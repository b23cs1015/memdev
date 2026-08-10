import {
  useEffect,
  useState,
  type FormEvent,
} from "react";
import {
  Edit3,
  Folder,
  Loader2,
  Plus,
  Trash2,
  X,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

import {
  createCollection,
  deleteCollection,
  getCollections,
  updateCollection,
  type Collection,
} from "../../lib/api";

type CollectionFormProps = {
  collection?: Collection | null;
  onClose: () => void;
  onSaved: (collection: Collection) => void;
};

function CollectionForm({
  collection,
  onClose,
  onSaved,
}: CollectionFormProps) {
  const [name, setName] = useState(collection?.name ?? "");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(
    event: FormEvent<HTMLFormElement>,
  ) {
    event.preventDefault();

    const trimmedName = name.trim();

    if (!trimmedName) {
      setError("Collection name is required.");
      return;
    }

    setError("");
    setIsSubmitting(true);

    try {
      if (collection) {
        const response = await updateCollection(collection.id, {
          name: trimmedName,
        });

        onSaved(response.collection);
      } else {
        const response = await createCollection({
          name: trimmedName,
        });

        onSaved(response.collection);
      }

      onClose();
    } catch {
      setError(
        collection
          ? "Unable to rename this collection."
          : "Unable to create this collection.",
      );
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
              {collection
                ? "Rename collection"
                : "New collection"}
            </h2>

            <p className="mt-0.5 text-xs text-slate-500">
              {collection
                ? "Give this collection a new name."
                : "Create a place to organize related notes."}
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
            htmlFor="collection-name"
            className="mb-2 block text-sm font-medium"
          >
            Name
          </label>

          <input
            id="collection-name"
            value={name}
            onChange={(event) => setName(event.target.value)}
            autoFocus
            placeholder="e.g. System Design"
            className="w-full rounded-lg border border-[#E7E7E2] px-4 py-3 text-sm outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
          />

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
                : collection
                  ? "Save changes"
                  : "Create collection"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

function Collections() {
  const navigate = useNavigate();

  const [collections, setCollections] = useState<Collection[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  const [showForm, setShowForm] = useState(false);
  const [editingCollection, setEditingCollection] =
    useState<Collection | null>(null);

  useEffect(() => {
    let mounted = true;

    getCollections()
      .then((response) => {
        if (mounted) {
          setCollections(response.collections);
        }
      })
      .catch(() => {
        if (mounted) {
          setError("Unable to load your collections.");
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

  function handleSaved(collection: Collection) {
    setCollections((current) => {
      const exists = current.some(
        (item) => item.id === collection.id,
      );

      if (exists) {
        return current.map((item) =>
          item.id === collection.id ? collection : item,
        );
      }

      return [collection, ...current];
    });
  }

  async function handleDelete(collection: Collection) {
    const confirmed = window.confirm(
      `Delete "${collection.name}"? Notes inside this collection will not be deleted.`,
    );

    if (!confirmed) {
      return;
    }

    setError("");

    try {
      await deleteCollection(collection.id);

      setCollections((current) =>
        current.filter((item) => item.id !== collection.id),
      );
    } catch {
      setError("Unable to delete this collection.");
    }
  }

  if (isLoading) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <div className="flex items-center gap-2 text-sm text-slate-500">
          <Loader2 size={17} className="animate-spin" />
          Loading your collections...
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
            Collections
          </h1>

          <p className="mt-2 text-sm text-slate-500">
            Organize related notes into meaningful groups.
          </p>
        </div>

        <button
          type="button"
          onClick={() => {
            setEditingCollection(null);
            setShowForm(true);
          }}
          className="inline-flex items-center justify-center gap-2 rounded-lg bg-[#171717] px-4 py-2.5 text-sm font-medium text-white transition hover:bg-slate-800"
        >
          <Plus size={17} />
          New collection
        </button>
      </div>

      {error && (
        <div className="mt-6 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      )}

      {collections.length === 0 ? (
        <div className="mt-8 rounded-xl border border-[#E7E7E2] bg-white px-5 py-16 text-center">
          <div className="mx-auto flex h-11 w-11 items-center justify-center rounded-full bg-slate-50">
            <Folder size={19} className="text-slate-400" />
          </div>

          <h2 className="mt-4 text-sm font-semibold">
            No collections yet
          </h2>

          <p className="mx-auto mt-1 max-w-sm text-sm text-slate-500">
            Create your first collection to start organizing
            your notes.
          </p>

          <button
            type="button"
            onClick={() => setShowForm(true)}
            className="mt-5 inline-flex items-center gap-2 rounded-lg bg-[#171717] px-4 py-2.5 text-sm font-medium text-white transition hover:bg-slate-800"
          >
            <Plus size={16} />
            Create collection
          </button>
        </div>
      ) : (
        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {collections.map((collection) => (
            <article
              key={collection.id}
              className="group rounded-xl border border-[#E7E7E2] bg-white p-5 transition hover:border-slate-300 hover:shadow-sm"
            >
              <button
                type="button"
                onClick={() =>
                  navigate(`/collections/${collection.id}`)
                }
                className="block w-full text-left"
              >
                <div className="flex items-start justify-between">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-slate-50 text-slate-500">
                    <Folder size={19} strokeWidth={1.8} />
                  </div>

                  <span className="text-xs text-slate-400">
                    {collection._count?.notes ?? 0}{" "}
                    {(collection._count?.notes ?? 0) === 1
                      ? "note"
                      : "notes"}
                  </span>
                </div>

                <h2 className="mt-5 truncate font-semibold">
                  {collection.name}
                </h2>

                <p className="mt-1 text-xs text-slate-400">
                  Created{" "}
                  {new Intl.DateTimeFormat("en", {
                    month: "short",
                    day: "numeric",
                    year: "numeric",
                  }).format(new Date(collection.createdAt))}
                </p>
              </button>

              <div className="mt-5 flex items-center gap-1 border-t border-[#E7E7E2] pt-4">
                <button
                  type="button"
                  onClick={() => {
                    setEditingCollection(collection);
                    setShowForm(true);
                  }}
                  className="inline-flex items-center gap-1.5 rounded-lg px-2.5 py-2 text-xs font-medium text-slate-500 transition hover:bg-slate-50 hover:text-[#171717]"
                >
                  <Edit3 size={14} />
                  Rename
                </button>

                <button
                  type="button"
                  onClick={() => handleDelete(collection)}
                  className="ml-auto rounded-lg p-2 text-slate-400 transition hover:bg-red-50 hover:text-red-600"
                  title="Delete collection"
                >
                  <Trash2 size={15} />
                </button>
              </div>
            </article>
          ))}
        </div>
      )}

      {showForm && (
        <CollectionForm
          collection={editingCollection}
          onClose={() => {
            setShowForm(false);
            setEditingCollection(null);
          }}
          onSaved={handleSaved}
        />
      )}
    </div>
  );
}

export default Collections;