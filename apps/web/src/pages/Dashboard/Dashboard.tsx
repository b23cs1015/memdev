import { useEffect, useState } from "react";
import {
  Archive,
  FileText,
  Folder,
  Heart,
  Loader2,
  Plus,
  Tag,
} from "lucide-react";

import { ApiError, getDashboardStats, type DashboardStats } from "../../lib/api";

function formatDate(date: string) {
  return new Intl.DateTimeFormat("en", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(new Date(date));
}

function StatCard({
  label,
  value,
  icon: Icon,
}: {
  label: string;
  value: number;
  icon: typeof FileText;
}) {
  return (
    <div className="rounded-xl border border-[#E7E7E2] bg-white p-5">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm text-slate-500">{label}</p>
          <p className="mt-2 text-2xl font-semibold tracking-tight">
            {value}
          </p>
        </div>

        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-slate-50 text-slate-500">
          <Icon size={18} strokeWidth={1.8} />
        </div>
      </div>
    </div>
  );
}

function Dashboard() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let isMounted = true;

    getDashboardStats()
      .then((response) => {
        if (isMounted) {
          setStats(response.stats);
        }
      })
      .catch((error: unknown) => {
        if (!isMounted) {
          return;
        }

        if (error instanceof ApiError) {
          setError(error.message);
        } else {
          setError("Unable to load your dashboard.");
        }
      })
      .finally(() => {
        if (isMounted) {
          setIsLoading(false);
        }
      });

    return () => {
      isMounted = false;
    };
  }, []);

  if (isLoading) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <div className="flex items-center gap-2 text-sm text-slate-500">
          <Loader2 size={17} className="animate-spin" />
          Loading your workspace...
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-xl border border-red-200 bg-red-50 px-5 py-4 text-sm text-red-700">
        {error}
      </div>
    );
  }

  if (!stats) {
    return null;
  }

  return (
    <div>
      <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
        <div>
          <p className="text-sm font-medium text-blue-600">Dashboard</p>

          <h1 className="mt-1 text-3xl font-semibold tracking-tight">
            Your knowledge, at a glance.
          </h1>

          <p className="mt-2 max-w-xl text-sm text-slate-500">
            Keep track of everything you've saved and organized in MemDev.
          </p>
        </div>

        <button
          type="button"
          className="inline-flex items-center justify-center gap-2 rounded-lg bg-[#171717] px-4 py-2.5 text-sm font-medium text-white transition hover:bg-slate-800"
        >
          <Plus size={17} />
          New note
        </button>
      </div>

      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
        <StatCard
          label="Notes"
          value={stats.totalNotes}
          icon={FileText}
        />

        <StatCard
          label="Favorites"
          value={stats.favoriteNotes}
          icon={Heart}
        />

        <StatCard
          label="Archived"
          value={stats.archivedNotes}
          icon={Archive}
        />

        <StatCard
          label="Collections"
          value={stats.totalCollections}
          icon={Folder}
        />

        <StatCard
          label="Tags"
          value={stats.totalTags}
          icon={Tag}
        />
      </div>

      <section className="mt-8 rounded-xl border border-[#E7E7E2] bg-white">
        <div className="flex items-center justify-between border-b border-[#E7E7E2] px-5 py-4">
          <div>
            <h2 className="font-semibold">Recent notes</h2>
            <p className="mt-0.5 text-xs text-slate-500">
              Your latest additions
            </p>
          </div>

          <button
            type="button"
            className="text-sm font-medium text-slate-500 transition hover:text-[#171717]"
          >
            View all
          </button>
        </div>

        {stats.recentNotes.length === 0 ? (
          <div className="px-5 py-14 text-center">
            <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-full bg-slate-50">
              <FileText size={18} className="text-slate-400" />
            </div>

            <h3 className="mt-4 text-sm font-semibold">
              No notes yet
            </h3>

            <p className="mt-1 text-sm text-slate-500">
              Start saving knowledge to build your library.
            </p>
          </div>
        ) : (
          <div className="divide-y divide-[#E7E7E2]">
            {stats.recentNotes.map((note) => (
              <article
                key={note.id}
                className="flex items-center justify-between gap-5 px-5 py-4 transition hover:bg-[#FAFAF8]"
              >
                <div className="min-w-0">
                  <h3 className="truncate text-sm font-medium">
                    {note.title}
                  </h3>

                  <p className="mt-1 truncate text-sm text-slate-500">
                    {note.summary || note.content}
                  </p>
                </div>

                <time
                  dateTime={note.createdAt}
                  className="shrink-0 text-xs text-slate-400"
                >
                  {formatDate(note.createdAt)}
                </time>
              </article>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}

export default Dashboard;