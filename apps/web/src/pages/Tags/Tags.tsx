import {
  useEffect,
  useState,
  type FormEvent,
} from "react";
import {
  Edit3,
  Hash,
  Loader2,
  Plus,
  Trash2,
  X,
} from "lucide-react";

import {
  createTag,
  deleteTag,
  getTags,
  updateTag,
  type Tag,
} from "../../lib/api";

type TagFormProps = {
  tag?: Tag | null;
  onClose: () => void;
  onSaved: (tag: Tag) => void;
};

function TagForm({
  tag,
  onClose,
  onSaved,
}: TagFormProps) {
  const [name, setName] = useState(tag?.name ?? "");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const trimmedName = name.trim();

    if (!trimmedName) {
      setError("Tag name is required.");
      return;
    }

    setError("");
    setIsSubmitting(true);

    try {
      if (tag) {
        const response = await updateTag(
          tag.id,
          trimmedName,
        );

        onSaved(response.tag);
      } else {
        const response = await createTag(trimmedName);

        onSaved(response.tag);
      }

      onClose();
    } catch (error) {
      if (
        error instanceof Error &&
        "status" in error &&
        (error as { status?: number }).status === 409
      ) {
        setError("A tag with this name already exists.");
      } else {
        setError(
          tag
            ? "Unable to rename this tag."
            : "Unable to create this tag.",
        );
      }
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 px-4">
      <div className="w-full max-w-md rounded-2xl border border-[#E7E7E2] bg-white shadow-xl">
        <div className="flex items-center justify-between border-b border-[#E7E7E2] px-6 py-4">
          <div>
            <h2 className="font-semibold">
              {tag ? "Rename tag" : "New tag"}
            </h2>

            <p className="mt-0.5 text-xs text-slate-500">
              {tag
                ? "Give this tag a new name."
                : "Create a tag for organizing your notes."}
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

        <form onSubmit={handleSubmit} className="p-6">
          {error && (
            <div className="mb-5 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
              {error}
            </div>
          )}

          <label
            htmlFor="tag-name"
            className="mb-2 block text-sm font-medium"
          >
            Name
          </label>

          <div className="relative">
            <Hash
              size={16}
              className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
            />

            <input
              id="tag-name"
              value={name}
              onChange={(event) => setName(event.target.value)}
              autoFocus
              placeholder="e.g. system-design"
              className="w-full rounded-lg border border-[#E7E7E2] py-3 pl-9 pr-4 text-sm outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
            />
          </div>

          <div className="mt-5 flex justify-end gap-3 border-t border-[#E7E7E2] pt-5">
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
                : tag
                  ? "Save changes"
                  : "Create tag"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

function Tags() {
  const [tags, setTags] = useState<Tag[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  const [showForm, setShowForm] = useState(false);
  const [editingTag, setEditingTag] = useState<Tag | null>(
    null,
  );

  useEffect(() => {
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
          setIsLoading(false);
        }
      });

    return () => {
      mounted = false;
    };
  }, []);

  function handleSaved(tag: Tag) {
    setTags((current) => {
      const exists = current.some(
        (item) => item.id === tag.id,
      );

      if (exists) {
        return current.map((item) =>
          item.id === tag.id ? tag : item,
        );
      }

      return [tag, ...current];
    });
  }

  async function handleDelete(tag: Tag) {
    const confirmed = window.confirm(
      `Delete "${tag.name}"? This will remove the tag from notes that use it.`,
    );

    if (!confirmed) {
      return;
    }

    setError("");

    try {
      await deleteTag(tag.id);

      setTags((current) =>
        current.filter((item) => item.id !== tag.id),
      );
    } catch {
      setError("Unable to delete this tag.");
    }
  }

  if (isLoading) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <div className="flex items-center gap-2 text-sm text-slate-500">
          <Loader2 size={17} className="animate-spin" />
          Loading your tags...
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
        <div>
          <p className="text-sm font-medium text-blue-600">
            Organization
          </p>

          <h1 className="mt-1 text-3xl font-semibold tracking-tight">
            Tags
          </h1>

          <p className="mt-2 text-sm text-slate-500">
            Add lightweight labels to make your knowledge easier
            to find.
          </p>
        </div>

        <button
          type="button"
          onClick={() => {
            setEditingTag(null);
            setShowForm(true);
          }}
          className="inline-flex items-center justify-center gap-2 rounded-lg bg-[#171717] px-4 py-2.5 text-sm font-medium text-white transition hover:bg-slate-800"
        >
          <Plus size={17} />
          New tag
        </button>
      </div>

      {error && (
        <div className="mt-6 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      )}

      {tags.length === 0 ? (
        <div className="mt-8 rounded-xl border border-[#E7E7E2] bg-white px-5 py-16 text-center">
          <div className="mx-auto flex h-11 w-11 items-center justify-center rounded-full bg-slate-50">
            <Hash size={19} className="text-slate-400" />
          </div>

          <h2 className="mt-4 text-sm font-semibold">
            No tags yet
          </h2>

          <p className="mx-auto mt-1 max-w-sm text-sm text-slate-500">
            Create your first tag to start labeling your notes.
          </p>

          <button
            type="button"
            onClick={() => setShowForm(true)}
            className="mt-5 inline-flex items-center gap-2 rounded-lg bg-[#171717] px-4 py-2.5 text-sm font-medium text-white transition hover:bg-slate-800"
          >
            <Plus size={16} />
            Create tag
          </button>
        </div>
      ) : (
        <div className="mt-8 overflow-hidden rounded-xl border border-[#E7E7E2] bg-white">
          <div className="divide-y divide-[#E7E7E2]">
            {tags.map((tag) => (
              <article
                key={tag.id}
                className="flex items-center gap-4 px-5 py-4 transition hover:bg-[#FAFAF8]"
              >
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-slate-50 text-slate-500">
                  <Hash size={17} />
                </div>

                <div className="min-w-0 flex-1">
                  <h2 className="truncate text-sm font-medium">
                    {tag.name}
                  </h2>

                  <p className="mt-0.5 text-xs text-slate-400">
                    {tag._count?.noteTags ?? 0}{" "}
                    {(tag._count?.noteTags ?? 0) === 1
                      ? "note"
                      : "notes"}
                  </p>
                </div>

                <div className="flex items-center gap-1">
                  <button
                    type="button"
                    onClick={() => {
                      setEditingTag(tag);
                      setShowForm(true);
                    }}
                    className="rounded-lg p-2 text-slate-400 transition hover:bg-white hover:text-[#171717]"
                    title="Rename tag"
                  >
                    <Edit3 size={16} />
                  </button>

                  <button
                    type="button"
                    onClick={() => handleDelete(tag)}
                    className="rounded-lg p-2 text-slate-400 transition hover:bg-red-50 hover:text-red-600"
                    title="Delete tag"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </article>
            ))}
          </div>
        </div>
      )}

      {showForm && (
        <TagForm
          tag={editingTag}
          onClose={() => {
            setShowForm(false);
            setEditingTag(null);
          }}
          onSaved={handleSaved}
        />
      )}
    </div>
  );
}

export default Tags;