import { useEffect, useState } from "react";
import {
  ArrowLeft,
  FileText,
  Loader2,
} from "lucide-react";
import { Link, useParams } from "react-router-dom";

import {
  getCollection,
  type CollectionWithNotes,
} from "../../lib/api";

function CollectionDetails() {
  const { id } = useParams<{ id: string }>();

  const [collection, setCollection] =
    useState<CollectionWithNotes | null>(null);

  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!id) {
      return;
    }

    let mounted = true;

    getCollection(id)
      .then((response) => {
        if (mounted) {
          setCollection(response.collection);
        }
      })
      .catch(() => {
        if (mounted) {
          setError("Unable to load this collection.");
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

  if (!id) {
    return (
      <div>
        <Link
          to="/collections"
          className="inline-flex items-center gap-2 text-sm text-slate-500 transition hover:text-[#171717]"
        >
          <ArrowLeft size={16} />
          Back to collections
        </Link>

        <div className="mt-6 rounded-xl border border-red-200 bg-red-50 px-5 py-4 text-sm text-red-700">
          Collection not found.
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <div className="flex items-center gap-2 text-sm text-slate-500">
          <Loader2 size={17} className="animate-spin" />
          Loading collection...
        </div>
      </div>
    );
  }

  if (error || !collection) {
    return (
      <div>
        <Link
          to="/collections"
          className="inline-flex items-center gap-2 text-sm text-slate-500 transition hover:text-[#171717]"
        >
          <ArrowLeft size={16} />
          Back to collections
        </Link>

        <div className="mt-6 rounded-xl border border-red-200 bg-red-50 px-5 py-4 text-sm text-red-700">
          {error || "Collection not found."}
        </div>
      </div>
    );
  }

  return (
    <div>
      <Link
        to="/collections"
        className="inline-flex items-center gap-2 text-sm text-slate-500 transition hover:text-[#171717]"
      >
        <ArrowLeft size={16} />
        Back to collections
      </Link>

      <div className="mt-6">
        <p className="text-sm font-medium text-blue-600">
          Collection
        </p>

        <h1 className="mt-1 text-3xl font-semibold tracking-tight">
          {collection.name}
        </h1>

        <p className="mt-2 text-sm text-slate-500">
          {collection.notes.length}{" "}
          {collection.notes.length === 1 ? "note" : "notes"}
        </p>
      </div>

      <div className="mt-8 overflow-hidden rounded-xl border border-[#E7E7E2] bg-white">
        {collection.notes.length === 0 ? (
          <div className="px-5 py-16 text-center">
            <div className="mx-auto flex h-11 w-11 items-center justify-center rounded-full bg-slate-50">
              <FileText size={19} className="text-slate-400" />
            </div>

            <h2 className="mt-4 text-sm font-semibold">
              No notes in this collection
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              Notes assigned to this collection will appear here.
            </p>
          </div>
        ) : (
          <div className="divide-y divide-[#E7E7E2]">
            {collection.notes.map((note) => (
              <article
                key={note.id}
                className="px-5 py-5 transition hover:bg-[#FAFAF8]"
              >
                <div className="flex items-start gap-4">
                  <div className="hidden h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-slate-50 text-slate-400 sm:flex">
                    <FileText size={17} />
                  </div>

                  <div className="min-w-0">
                    <h2 className="font-semibold">
                      {note.title}
                    </h2>

                    <p className="mt-1 line-clamp-2 text-sm leading-6 text-slate-500">
                      {note.summary || note.content}
                    </p>

                    <p className="mt-3 text-xs text-slate-400">
                      {new Intl.DateTimeFormat("en", {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                      }).format(new Date(note.createdAt))}
                    </p>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default CollectionDetails;