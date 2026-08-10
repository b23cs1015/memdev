import { useEffect, useMemo, useState } from "react";
import {
  Archive,
  ArchiveRestore,
  ArrowLeft,
  CalendarDays,
  Edit3,
  ExternalLink,
  Folder,
  Hash,
  Heart,
  Loader2,
  Plus,
  Sparkles,
  Trash2,
  X,
} from "lucide-react";
import { Link, useNavigate, useParams } from "react-router-dom";

import {
  ApiError,
  attachTagToNote,
  deleteNote,
  getNote,
  getTags,
  removeTagFromNote,
  summarizeNote,
  updateNote,
  type Note,
  type Tag,
} from "../../lib/api";

function formatDate(value: string) {
  return new Intl.DateTimeFormat("en", {
    month: "long",
    day: "numeric",
    year: "numeric",
  }).format(new Date(value));
}

function NoteDetails() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [note, setNote] = useState<Note | null>(null);
  const [tags, setTags] = useState<Tag[]>([]);

  const [isLoading, setIsLoading] = useState(Boolean(id));
  const [isLoadingTags, setIsLoadingTags] = useState(true);
  const [isAddingTag, setIsAddingTag] = useState(false);
  const [removingTagId, setRemovingTagId] = useState<string | null>(null);

  const [isSummarizing, setIsSummarizing] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const [isTagMenuOpen, setIsTagMenuOpen] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!id) {
      return;
    }

    let mounted = true;

    getNote(id)
      .then((response) => {
        if (mounted) {
          setNote(response.note);
        }
      })
      .catch((requestError: unknown) => {
        if (!mounted) {
          return;
        }

        if (
          requestError instanceof ApiError &&
          requestError.status === 404
        ) {
          setError("This note could not be found.");
        } else {
          setError("Unable to load this note.");
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
  }, [id]);

  useEffect(() => {
    if (!id) {
      return;
    }

    let mounted = true;

    getTags()
      .then((response) => {
        if (mounted) {
          setTags(response.tags);
        }
      })
      .catch(() => {
        if (mounted) {
          setError("Unable to load your tags.");
        }
      })
      .finally(() => {
        if (mounted) {
          setIsLoadingTags(false);
        }
      });

    return () => {
      mounted = false;
    };
  }, [id]);

  const availableTags = useMemo(() => {
    if (!note) {
      return tags;
    }

    const attachedTagIds = new Set(
      (note.noteTags ?? []).map(
        (noteTag) => noteTag.tagId,
      ),
    );

    return tags.filter(
      (tag) => !attachedTagIds.has(tag.id),
    );
  }, [note, tags]);

  async function handleAddTag(tag: Tag) {
    if (!note || isAddingTag) {
      return;
    }

    setIsAddingTag(true);
    setError("");

    try {
      const response = await attachTagToNote(
        note.id,
        tag.id,
      );

      setNote((currentNote) => {
        if (!currentNote) {
          return currentNote;
        }

        const existingNoteTags =
          currentNote.noteTags ?? [];

        if (
          existingNoteTags.some(
            (noteTag) => noteTag.tagId === tag.id,
          )
        ) {
          return currentNote;
        }

        return {
          ...currentNote,
          noteTags: [
            ...existingNoteTags,
            response.noteTag,
          ],
        };
      });

      setIsTagMenuOpen(false);
    } catch (requestError: unknown) {
      if (
        requestError instanceof ApiError &&
        requestError.status === 409
      ) {
        setError("This tag is already attached.");
      } else {
        setError("Unable to add this tag.");
      }
    } finally {
      setIsAddingTag(false);
    }
  }

  async function handleRemoveTag(tagId: string) {
    if (!note || removingTagId) {
      return;
    }

    setRemovingTagId(tagId);
    setError("");

    try {
      await removeTagFromNote(note.id, tagId);

      setNote((currentNote) => {
        if (!currentNote) {
          return currentNote;
        }

        return {
          ...currentNote,
          noteTags: (currentNote.noteTags ?? []).filter(
            (noteTag) => noteTag.tagId !== tagId,
          ),
        };
      });
    } catch {
      setError("Unable to remove this tag.");
    } finally {
      setRemovingTagId(null);
    }
  }

  async function handleToggleFavorite() {
    if (!note) {
      return;
    }

    try {
      const response = await updateNote(note.id, {
        isFavorite: !note.isFavorite,
      });

      setNote(response.note);
      setError("");
    } catch {
      setError("Unable to update favorite status.");
    }
  }

  async function handleToggleArchive() {
    if (!note) {
      return;
    }

    try {
      const response = await updateNote(note.id, {
        isArchived: !note.isArchived,
      });

      setNote(response.note);
      setError("");
    } catch {
      setError("Unable to update archive status.");
    }
  }

  async function handleSummarize() {
    if (!note) {
      return;
    }

    setError("");
    setIsSummarizing(true);

    try {
      const response = await summarizeNote(note.id);
      setNote(response.note);
    } catch {
      setError("Unable to generate a summary right now.");
    } finally {
      setIsSummarizing(false);
    }
  }

  async function handleDelete() {
    if (!note) {
      return;
    }

    const confirmed = window.confirm(
      `Delete "${note.title}"? This action cannot be undone.`,
    );

    if (!confirmed) {
      return;
    }

    setIsDeleting(true);
    setError("");

    try {
      await deleteNote(note.id);
      navigate("/notes");
    } catch {
      setError("Unable to delete this note.");
      setIsDeleting(false);
    }
  }

  if (!id) {
    return (
      <div className="mx-auto max-w-2xl py-16 text-center">
        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-slate-50">
          <Trash2
            size={20}
            className="text-slate-400"
          />
        </div>

        <h1 className="mt-4 text-lg font-semibold">
          Note unavailable
        </h1>

        <p className="mt-2 text-sm text-slate-500">
          This note could not be found.
        </p>

        <Link
          to="/notes"
          className="mt-6 inline-flex items-center gap-2 rounded-lg bg-[#171717] px-4 py-2.5 text-sm font-medium text-white transition hover:bg-slate-800"
        >
          <ArrowLeft size={16} />
          Back to notes
        </Link>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <div className="flex items-center gap-2 text-sm text-slate-500">
          <Loader2
            size={17}
            className="animate-spin"
          />
          Loading note...
        </div>
      </div>
    );
  }

  if (!note) {
    return (
      <div className="mx-auto max-w-2xl py-16 text-center">
        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-slate-50">
          <Trash2
            size={20}
            className="text-slate-400"
          />
        </div>

        <h1 className="mt-4 text-lg font-semibold">
          Note unavailable
        </h1>

        <p className="mt-2 text-sm text-slate-500">
          {error || "This note could not be loaded."}
        </p>

        <Link
          to="/notes"
          className="mt-6 inline-flex items-center gap-2 rounded-lg bg-[#171717] px-4 py-2.5 text-sm font-medium text-white transition hover:bg-slate-800"
        >
          <ArrowLeft size={16} />
          Back to notes
        </Link>
      </div>
    );
  }

  return (
    <article className="mx-auto max-w-4xl">
      <Link
        to="/notes"
        className="inline-flex items-center gap-2 text-sm text-slate-500 transition hover:text-[#171717]"
      >
        <ArrowLeft size={16} />
        Back to notes
      </Link>

      {error && (
        <div className="mt-5 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      )}

      <header className="mt-8 border-b border-[#E7E7E2] pb-8">
        <div className="flex flex-wrap items-center gap-2">
          {note.isFavorite && (
            <span className="inline-flex items-center gap-1.5 rounded-full bg-rose-50 px-3 py-1.5 text-xs font-medium text-rose-600">
              <Heart
                size={13}
                fill="currentColor"
              />
              Favorite
            </span>
          )}

          {note.isArchived && (
            <span className="inline-flex items-center gap-1.5 rounded-full bg-slate-100 px-3 py-1.5 text-xs font-medium text-slate-500">
              <Archive size={13} />
              Archived
            </span>
          )}
        </div>

        <h1 className="mt-5 text-4xl font-semibold tracking-tight text-[#171717] sm:text-5xl">
          {note.title}
        </h1>

        <div className="mt-5 flex flex-wrap items-center gap-x-5 gap-y-2 text-xs text-slate-400">
          <span className="inline-flex items-center gap-1.5">
            <CalendarDays size={14} />
            Created {formatDate(note.createdAt)}
          </span>

          {note.updatedAt !== note.createdAt && (
            <span>
              Updated {formatDate(note.updatedAt)}
            </span>
          )}
        </div>
      </header>

      <div className="flex flex-col gap-10 py-8 lg:flex-row">
        <main className="min-w-0 flex-1">
          {note.summary ? (
            <section className="mb-10 rounded-xl border border-blue-100 bg-blue-50/50 p-5">
              <div className="flex items-center gap-2 text-sm font-semibold text-blue-700">
                <Sparkles size={16} />
                AI Summary
              </div>

              <p className="mt-3 text-sm leading-7 text-slate-600">
                {note.summary}
              </p>
            </section>
          ) : (
            <section className="mb-10 rounded-xl border border-dashed border-[#E7E7E2] bg-white p-5">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <div className="flex items-center gap-2 text-sm font-semibold">
                    <Sparkles size={16} />
                    No summary yet
                  </div>

                  <p className="mt-1 text-xs text-slate-500">
                    Generate a concise AI summary of this note.
                  </p>
                </div>

                <button
                  type="button"
                  onClick={handleSummarize}
                  disabled={isSummarizing}
                  className="inline-flex shrink-0 items-center justify-center gap-2 rounded-lg bg-[#171717] px-3.5 py-2 text-xs font-medium text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {isSummarizing ? (
                    <Loader2
                      size={14}
                      className="animate-spin"
                    />
                  ) : (
                    <Sparkles size={14} />
                  )}

                  {isSummarizing
                    ? "Generating..."
                    : "Generate summary"}
                </button>
              </div>
            </section>
          )}

          {note.summary && (
            <div className="mb-8 flex justify-end">
              <button
                type="button"
                onClick={handleSummarize}
                disabled={isSummarizing}
                className="inline-flex items-center gap-2 text-xs font-medium text-slate-500 transition hover:text-[#171717] disabled:opacity-50"
              >
                {isSummarizing ? (
                  <Loader2
                    size={14}
                    className="animate-spin"
                  />
                ) : (
                  <Sparkles size={14} />
                )}

                Regenerate summary
              </button>
            </div>
          )}

          <section>
            <div className="whitespace-pre-wrap text-[15px] leading-8 text-slate-700">
              {note.content}
            </div>
          </section>
        </main>

        <aside className="w-full shrink-0 lg:w-56">
          <div className="sticky top-6 space-y-6">
            <section>
              <h2 className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                Actions
              </h2>

              <div className="mt-3 space-y-1">
                <button
                  type="button"
                  onClick={handleToggleFavorite}
                  className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-slate-600 transition hover:bg-slate-50 hover:text-[#171717]"
                >
                  <Heart
                    size={16}
                    fill={
                      note.isFavorite
                        ? "currentColor"
                        : "none"
                    }
                  />

                  {note.isFavorite
                    ? "Remove favorite"
                    : "Add favorite"}
                </button>

                <button
                  type="button"
                  onClick={handleToggleArchive}
                  className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-slate-600 transition hover:bg-slate-50 hover:text-[#171717]"
                >
                  {note.isArchived ? (
                    <ArchiveRestore size={16} />
                  ) : (
                    <Archive size={16} />
                  )}

                  {note.isArchived
                    ? "Restore note"
                    : "Archive note"}
                </button>

                <button
                  type="button"
                  onClick={() =>
                    navigate(`/notes/${note.id}/edit`)
                  }
                  className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-slate-600 transition hover:bg-slate-50 hover:text-[#171717]"
                >
                  <Edit3 size={16} />
                  Edit note
                </button>

                <button
                  type="button"
                  onClick={handleDelete}
                  disabled={isDeleting}
                  className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-red-500 transition hover:bg-red-50 disabled:opacity-50"
                >
                  {isDeleting ? (
                    <Loader2
                      size={16}
                      className="animate-spin"
                    />
                  ) : (
                    <Trash2 size={16} />
                  )}

                  Delete note
                </button>
              </div>
            </section>

            <section className="border-t border-[#E7E7E2] pt-6">
              <div className="flex items-center justify-between">
                <h2 className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                  Tags
                </h2>

                <button
                  type="button"
                  onClick={() =>
                    setIsTagMenuOpen((open) => !open)
                  }
                  disabled={
                    isLoadingTags ||
                    isAddingTag ||
                    availableTags.length === 0
                  }
                  className="inline-flex items-center gap-1 rounded-md px-2 py-1 text-xs font-medium text-slate-500 transition hover:bg-slate-100 hover:text-[#171717] disabled:cursor-not-allowed disabled:opacity-40"
                >
                  <Plus size={13} />
                  Add tag
                </button>
              </div>

              {note.noteTags &&
                note.noteTags.length > 0 && (
                  <div className="mt-3 flex flex-wrap gap-1.5">
                    {note.noteTags.map((noteTag) => (
                      <span
                        key={noteTag.tagId}
                        className="inline-flex items-center gap-1 rounded-full bg-slate-100 pl-2.5 pr-1 py-1 text-xs text-slate-600"
                      >
                        <Hash size={11} />
                        {noteTag.tag.name}

                        <button
                          type="button"
                          onClick={() =>
                            handleRemoveTag(
                              noteTag.tagId,
                            )
                          }
                          disabled={
                            removingTagId ===
                            noteTag.tagId
                          }
                          aria-label={`Remove ${noteTag.tag.name} tag`}
                          className="ml-0.5 rounded-full p-0.5 text-slate-400 transition hover:bg-slate-200 hover:text-slate-700 disabled:opacity-50"
                        >
                          {removingTagId ===
                          noteTag.tagId ? (
                            <Loader2
                              size={11}
                              className="animate-spin"
                            />
                          ) : (
                            <X size={11} />
                          )}
                        </button>
                      </span>
                    ))}
                  </div>
                )}

              {!note.noteTags?.length &&
                !isTagMenuOpen && (
                  <p className="mt-3 text-xs text-slate-400">
                    No tags added to this note yet.
                  </p>
                )}

              {isLoadingTags && (
                <div className="mt-3 flex items-center gap-2 text-xs text-slate-400">
                  <Loader2
                    size={13}
                    className="animate-spin"
                  />
                  Loading tags...
                </div>
              )}

              {isTagMenuOpen && (
                <div className="relative mt-3">
                  <div className="overflow-hidden rounded-lg border border-[#E7E7E2] bg-white shadow-sm">
                    {availableTags.length > 0 ? (
                      <div className="max-h-52 overflow-y-auto py-1">
                        {availableTags.map((tag) => (
                          <button
                            key={tag.id}
                            type="button"
                            onClick={() =>
                              handleAddTag(tag)
                            }
                            disabled={isAddingTag}
                            className="flex w-full items-center gap-2 px-3 py-2 text-left text-sm text-slate-600 transition hover:bg-slate-50 hover:text-[#171717] disabled:opacity-50"
                          >
                            <Hash size={13} />

                            <span className="truncate">
                              {tag.name}
                            </span>

                            {tag._count?.noteTags !==
                              undefined && (
                              <span className="ml-auto text-xs text-slate-400">
                                {tag._count.noteTags}
                              </span>
                            )}
                          </button>
                        ))}
                      </div>
                    ) : (
                      <div className="px-3 py-3 text-xs text-slate-400">
                        {tags.length === 0
                          ? "Create a tag first from the Tags page."
                          : "All your tags are already attached."}
                      </div>
                    )}
                  </div>
                </div>
              )}

              {!isLoadingTags &&
                tags.length > 0 &&
                availableTags.length === 0 &&
                !isTagMenuOpen && (
                  <p className="mt-2 text-xs text-slate-400">
                    All available tags are already attached.
                  </p>
                )}
            </section>

            {note.sourceUrl && (
              <section className="border-t border-[#E7E7E2] pt-6">
                <h2 className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                  Source
                </h2>

                <a
                  href={note.sourceUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="mt-3 inline-flex max-w-full items-center gap-1.5 text-sm font-medium text-blue-600 hover:underline"
                >
                  <ExternalLink size={13} />
                  <span className="truncate">
                    Open source
                  </span>
                </a>
              </section>
            )}

            {note.collectionId && (
              <section className="border-t border-[#E7E7E2] pt-6">
                <h2 className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                  Collection
                </h2>

                <p className="mt-3 flex items-center gap-2 text-sm text-slate-600">
                  <Folder size={14} />
                  Assigned collection
                </p>
              </section>
            )}
          </div>
        </aside>
      </div>
    </article>
  );
}

export default NoteDetails;