import {
  useEffect,
  useMemo,
  useState,
  type FormEvent,
} from "react";
import {
  Archive,
  ArchiveRestore,
  Edit3,
  FileText,
  Heart,
  Loader2,
  Plus,
  Search,
  Trash2,
  X,
} from "lucide-react";

import {
  createNote,
  deleteNote,
  getNotes,
  updateNote,
  type Note,
} from "../../lib/api";

type NoteFormProps = {
  note?: Note | null;
  onClose: () => void;
  onSaved: (note: Note) => void;
};

function NoteForm({ note, onClose, onSaved }: NoteFormProps) {
  const [title, setTitle] = useState(note?.title ?? "");
  const [content, setContent] = useState(note?.content ?? "");
  const [sourceUrl, setSourceUrl] = useState(note?.sourceUrl ?? "");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setError("");

    if (!title.trim() || !content.trim()) {
      setError("Title and content are required.");
      return;
    }

    setIsSubmitting(true);

    try {
      if (note) {
        const response = await updateNote(note.id, {
          title: title.trim(),
          content: content.trim(),
          sourceUrl: sourceUrl.trim() || null,
        });

        onSaved(response.note);
      } else {
        const response = await createNote({
          title: title.trim(),
          content: content.trim(),
          ...(sourceUrl.trim()
            ? { sourceUrl: sourceUrl.trim() }
            : {}),
        });

        onSaved(response.note);
      }

      onClose();
    } catch {
      setError(
        note
          ? "Unable to update this note."
          : "Unable to create this note.",
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 px-4">
      <div className="w-full max-w-2xl rounded-2xl border border-[#E7E7E2] bg-white shadow-xl">
        <div className="flex items-center justify-between border-b border-[#E7E7E2] px-6 py-4">
          <div>
            <h2 className="font-semibold">
              {note ? "Edit note" : "New note"}
            </h2>

            <p className="mt-0.5 text-xs text-slate-500">
              {note
                ? "Update your saved knowledge."
                : "Capture something worth remembering."}
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-2 text-slate-400 transition hover:bg-slate-50 hover:text-[#171717]"
            aria-label="Close"
          >
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5 p-6">
          {error && (
            <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
              {error}
            </div>
          )}

          <div>
            <label
              htmlFor="note-title"
              className="mb-2 block text-sm font-medium"
            >
              Title
            </label>

            <input
              id="note-title"
              value={title}
              onChange={(event) => setTitle(event.target.value)}
              placeholder="e.g. Rate limiting"
              className="w-full rounded-lg border border-[#E7E7E2] px-4 py-3 text-sm outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
            />
          </div>

          <div>
            <label
              htmlFor="note-content"
              className="mb-2 block text-sm font-medium"
            >
              Content
            </label>

            <textarea
              id="note-content"
              value={content}
              onChange={(event) => setContent(event.target.value)}
              placeholder="Write what you want to remember..."
              rows={8}
              className="w-full resize-y rounded-lg border border-[#E7E7E2] px-4 py-3 text-sm leading-6 outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
            />
          </div>

          <div>
            <label
              htmlFor="note-source"
              className="mb-2 block text-sm font-medium"
            >
              Source URL
              <span className="ml-1 font-normal text-slate-400">
                optional
              </span>
            </label>

            <input
              id="note-source"
              type="url"
              value={sourceUrl}
              onChange={(event) => setSourceUrl(event.target.value)}
              placeholder="https://..."
              className="w-full rounded-lg border border-[#E7E7E2] px-4 py-3 text-sm outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
            />
          </div>

          <div className="flex justify-end gap-3 border-t border-[#E7E7E2] pt-5">
            <button
              type="button"
              onClick={onClose}
              className="rounded-lg border border-[#E7E7E2] px-4 py-2.5 text-sm font-medium transition hover:bg-slate-50"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={isSubmitting}
              className="inline-flex items-center gap-2 rounded-lg bg-[#171717] px-4 py-2.5 text-sm font-medium text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isSubmitting && (
                <Loader2 size={16} className="animate-spin" />
              )}

              {isSubmitting
                ? "Saving..."
                : note
                  ? "Save changes"
                  : "Create note"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

function Notes() {
  const [notes, setNotes] = useState<Note[]>([]);
  const [search, setSearch] = useState("");
  const [showArchived, setShowArchived] = useState(false);

  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  const [showForm, setShowForm] = useState(false);
  const [editingNote, setEditingNote] = useState<Note | null>(null);

  useEffect(() => {
    let mounted = true;

    getNotes()
      .then((response) => {
        if (mounted) {
          setNotes(response.notes);
        }
      })
      .catch(() => {
        if (mounted) {
          setError("Unable to load your notes.");
        }
      })
      .finally(() => {
        if (mounted) {
          setIsLoading(false);
        }
      });

    return () => {
      mounted = false;
    };
  }, []);

  const visibleNotes = useMemo(() => {
    const normalizedSearch = search.trim().toLowerCase();

    return notes.filter((note) => {
      if (!showArchived && note.isArchived) {
        return false;
      }

      if (!normalizedSearch) {
        return true;
      }

      return (
        note.title.toLowerCase().includes(normalizedSearch) ||
        note.content.toLowerCase().includes(normalizedSearch) ||
        note.summary?.toLowerCase().includes(normalizedSearch)
      );
    });
  }, [notes, search, showArchived]);

  function handleSaved(savedNote: Note) {
    setNotes((current) => {
      const exists = current.some((note) => note.id === savedNote.id);

      if (exists) {
        return current.map((note) =>
          note.id === savedNote.id ? savedNote : note,
        );
      }

      return [savedNote, ...current];
    });
  }

  async function handleToggleFavorite(note: Note) {
    try {
      const response = await updateNote(note.id, {
        isFavorite: !note.isFavorite,
      });

      setNotes((current) =>
        current.map((item) =>
          item.id === note.id ? response.note : item,
        ),
      );
    } catch {
      setError("Unable to update favorite status.");
    }
  }

  async function handleToggleArchive(note: Note) {
    try {
      const response = await updateNote(note.id, {
        isArchived: !note.isArchived,
      });

      setNotes((current) =>
        current.map((item) =>
          item.id === note.id ? response.note : item,
        ),
      );
    } catch {
      setError("Unable to update archive status.");
    }
  }

  async function handleDelete(note: Note) {
    const confirmed = window.confirm(
      `Delete "${note.title}"? This action cannot be undone.`,
    );

    if (!confirmed) {
      return;
    }

    try {
      await deleteNote(note.id);

      setNotes((current) =>
        current.filter((item) => item.id !== note.id),
      );
    } catch {
      setError("Unable to delete this note.");
    }
  }

  if (isLoading) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <div className="flex items-center gap-2 text-sm text-slate-500">
          <Loader2 size={17} className="animate-spin" />
          Loading your notes...
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
        <div>
          <p className="text-sm font-medium text-blue-600">Library</p>

          <h1 className="mt-1 text-3xl font-semibold tracking-tight">
            Notes
          </h1>

          <p className="mt-2 text-sm text-slate-500">
            Everything you've chosen to remember.
          </p>
        </div>

        <button
          type="button"
          onClick={() => {
            setEditingNote(null);
            setShowForm(true);
          }}
          className="inline-flex items-center justify-center gap-2 rounded-lg bg-[#171717] px-4 py-2.5 text-sm font-medium text-white transition hover:bg-slate-800"
        >
          <Plus size={17} />
          New note
        </button>
      </div>

      <div className="mt-8 flex flex-col gap-3 sm:flex-row">
        <div className="relative flex-1">
          <Search
            size={17}
            className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
          />

          <input
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Search notes..."
            className="w-full rounded-lg border border-[#E7E7E2] bg-white py-2.5 pl-10 pr-4 text-sm outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
          />
        </div>

        <button
          type="button"
          onClick={() => setShowArchived((current) => !current)}
          className={[
            "inline-flex items-center justify-center gap-2 rounded-lg border px-4 py-2.5 text-sm font-medium transition",
            showArchived
              ? "border-slate-300 bg-slate-100 text-[#171717]"
              : "border-[#E7E7E2] bg-white text-slate-500 hover:bg-slate-50 hover:text-[#171717]",
          ].join(" ")}
        >
          {showArchived ? (
            <ArchiveRestore size={17} />
          ) : (
            <Archive size={17} />
          )}

          {showArchived ? "Hide archived" : "Show archived"}
        </button>
      </div>

      {error && (
        <div className="mt-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      )}

      <div className="mt-6 overflow-hidden rounded-xl border border-[#E7E7E2] bg-white">
        {visibleNotes.length === 0 ? (
          <div className="px-5 py-16 text-center">
            <div className="mx-auto flex h-11 w-11 items-center justify-center rounded-full bg-slate-50">
              <FileText size={19} className="text-slate-400" />
            </div>

            <h2 className="mt-4 text-sm font-semibold">
              {search
                ? "No notes found"
                : showArchived
                  ? "No archived notes"
                  : "Your library is empty"}
            </h2>

            <p className="mx-auto mt-1 max-w-sm text-sm text-slate-500">
              {search
                ? "Try a different search term."
                : "Create your first note and start building your personal knowledge library."}
            </p>

            {!search && !showArchived && (
              <button
                type="button"
                onClick={() => setShowForm(true)}
                className="mt-5 inline-flex items-center gap-2 rounded-lg bg-[#171717] px-4 py-2.5 text-sm font-medium text-white transition hover:bg-slate-800"
              >
                <Plus size={16} />
                Create your first note
              </button>
            )}
          </div>
        ) : (
          <div className="divide-y divide-[#E7E7E2]">
            {visibleNotes.map((note) => (
              <article
                key={note.id}
                className="group px-5 py-5 transition hover:bg-[#FAFAF8]"
              >
                <div className="flex gap-4">
                  <div className="mt-1 hidden h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-slate-50 text-slate-400 sm:flex">
                    <FileText size={17} />
                  </div>

                  <div className="min-w-0 flex-1">
                    <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
                      <div className="min-w-0">
                        <h2 className="truncate font-semibold">
                          {note.title}
                        </h2>

                        <p className="mt-1 line-clamp-2 text-sm leading-6 text-slate-500">
                          {note.summary || note.content}
                        </p>
                      </div>

                      <time
                        dateTime={note.createdAt}
                        className="shrink-0 text-xs text-slate-400"
                      >
                        {new Intl.DateTimeFormat("en", {
                          month: "short",
                          day: "numeric",
                          year: "numeric",
                        }).format(new Date(note.createdAt))}
                      </time>
                    </div>

                    <div className="mt-4 flex flex-wrap items-center gap-2">
                      {note.isFavorite && (
                        <span className="inline-flex items-center gap-1 rounded-full bg-rose-50 px-2.5 py-1 text-xs font-medium text-rose-600">
                          <Heart size={12} fill="currentColor" />
                          Favorite
                        </span>
                      )}

                      {note.isArchived && (
                        <span className="inline-flex items-center gap-1 rounded-full bg-slate-100 px-2.5 py-1 text-xs font-medium text-slate-500">
                          <Archive size={12} />
                          Archived
                        </span>
                      )}

                      {note.sourceUrl && (
                        <a
                          href={note.sourceUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="max-w-[240px] truncate text-xs text-blue-600 hover:underline"
                        >
                          Source
                        </a>
                      )}

                      <div className="ml-auto flex items-center gap-1">
                        <button
                          type="button"
                          onClick={() => handleToggleFavorite(note)}
                          title={
                            note.isFavorite
                              ? "Remove favorite"
                              : "Add favorite"
                          }
                          className="rounded-lg p-2 text-slate-400 transition hover:bg-white hover:text-rose-500"
                        >
                          <Heart
                            size={16}
                            fill={
                              note.isFavorite
                                ? "currentColor"
                                : "none"
                            }
                          />
                        </button>

                        <button
                          type="button"
                          onClick={() => handleToggleArchive(note)}
                          title={
                            note.isArchived
                              ? "Restore note"
                              : "Archive note"
                          }
                          className="rounded-lg p-2 text-slate-400 transition hover:bg-white hover:text-[#171717]"
                        >
                          {note.isArchived ? (
                            <ArchiveRestore size={16} />
                          ) : (
                            <Archive size={16} />
                          )}
                        </button>

                        <button
                          type="button"
                          onClick={() => {
                            setEditingNote(note);
                            setShowForm(true);
                          }}
                          title="Edit note"
                          className="rounded-lg p-2 text-slate-400 transition hover:bg-white hover:text-[#171717]"
                        >
                          <Edit3 size={16} />
                        </button>

                        <button
                          type="button"
                          onClick={() => handleDelete(note)}
                          title="Delete note"
                          className="rounded-lg p-2 text-slate-400 transition hover:bg-white hover:text-red-600"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
      </div>

      {showForm && (
        <NoteForm
          note={editingNote}
          onClose={() => {
            setShowForm(false);
            setEditingNote(null);
          }}
          onSaved={handleSaved}
        />
      )}
    </div>
  );
}

export default Notes;