import { useEffect, useState } from "react";
import {
  Archive,
  ArrowRight,
  BookOpen,
  FileText,
  Folder,
  Heart,
  Plus,
  RefreshCw,
  Tag,
  WandSparkles,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

import {
  ApiError,
  getDashboardStats,
  type DashboardStats,
} from "../../lib/api";

function formatDate(date: string) {
  const value = new Date(date);

  const now = new Date();
  const diff =
    now.getTime() - value.getTime();

  const minute = 60 * 1000;
  const hour = 60 * minute;
  const day = 24 * hour;

  if (diff < minute) {
    return "Just now";
  }

  if (diff < hour) {
    const minutes = Math.floor(
      diff / minute,
    );

    return `${minutes}m ago`;
  }

  if (diff < day) {
    const hours = Math.floor(
      diff / hour,
    );

    return `${hours}h ago`;
  }

  if (diff < 7 * day) {
    const days = Math.floor(
      diff / day,
    );

    return `${days}d ago`;
  }

  return new Intl.DateTimeFormat("en", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(value);
}

function getGreeting() {
  const hour = new Date().getHours();

  if (hour < 12) {
    return "Good morning";
  }

  if (hour < 18) {
    return "Good afternoon";
  }

  return "Good evening";
}

function StatCard({
  label,
  value,
  icon: Icon,
  description,
}: {
  label: string;
  value: number;
  icon: typeof FileText;
  description: string;
}) {
  return (
    <div className="group rounded-xl border border-[#E7E7E2] bg-white p-4 transition hover:-translate-y-0.5 hover:border-[#D8D8D2] hover:shadow-sm">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-[0.06em] text-[#969692]">
            {label}
          </p>

          <p className="mt-2 text-2xl font-semibold tracking-tight text-[#171717]">
            {value}
          </p>
        </div>

        <div className="flex h-9 w-9 items-center justify-center rounded-lg border border-[#E7E7E2] bg-[#FAFAF8] text-[#6B6B68] transition group-hover:text-[#171717]">
          <Icon
            size={17}
            strokeWidth={1.8}
          />
        </div>
      </div>

      <p className="mt-3 text-xs text-[#969692]">
        {description}
      </p>
    </div>
  );
}

function Dashboard() {
  const navigate = useNavigate();

  const [stats, setStats] =
    useState<DashboardStats | null>(null);

  const [isLoading, setIsLoading] =
    useState(true);

  const [error, setError] =
    useState("");

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
          setError(
            "Unable to load your dashboard.",
          );
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
      <div className="flex min-h-[420px] items-center justify-center">
        <div className="flex flex-col items-center text-center">
          <div className="flex h-10 w-10 items-center justify-center rounded-full border border-[#E7E7E2] bg-white">
            <RefreshCw
              size={17}
              className="animate-spin text-[#6B6B68]"
            />
          </div>

          <p className="mt-4 text-sm font-medium text-[#171717]">
            Loading your library
          </p>

          <p className="mt-1 text-xs text-[#969692]">
            Getting your latest knowledge.
          </p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex min-h-[420px] items-center justify-center">
        <div className="w-full max-w-md rounded-xl border border-[#E7E7E2] bg-white p-8 text-center">
          <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-full bg-[#FAFAF8]">
            <RefreshCw
              size={17}
              className="text-[#6B6B68]"
            />
          </div>

          <h2 className="mt-4 text-sm font-semibold text-[#171717]">
            Unable to load your dashboard
          </h2>

          <p className="mt-2 text-sm leading-6 text-[#6B6B68]">
            {error}
          </p>

          <button
            type="button"
            onClick={() => {
              window.location.reload();
            }}
            className="mt-5 inline-flex items-center justify-center gap-2 rounded-lg bg-[#171717] px-4 py-2.5 text-sm font-medium text-white transition hover:bg-[#2B2B2B]"
          >
            <RefreshCw size={15} />
            Try again
          </button>
        </div>
      </div>
    );
  }

  if (!stats) {
    return null;
  }

  const recentNotes =
    stats.recentNotes.slice(0, 5);

  return (
    <div className="pb-10">
      {/* ------------------------------------------------------------------ */}
      {/* Hero                                                               */}
      {/* ------------------------------------------------------------------ */}

      <section className="relative overflow-hidden rounded-2xl border border-[#E7E7E2] bg-white">
        <div className="absolute right-0 top-0 h-40 w-40 rounded-full bg-[#FAFAF8] blur-2xl" />

        <div className="relative flex flex-col gap-7 px-6 py-7 md:px-8 md:py-8 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-2xl">
            <p className="text-[11px] font-semibold uppercase tracking-[0.08em] text-[#6B6B68]">
              {getGreeting()}
            </p>

            <h1 className="mt-2 max-w-2xl font-serif text-3xl leading-tight tracking-tight text-[#171717] md:text-4xl">
              Your knowledge,
              <br className="hidden sm:block" />
              at a glance.
            </h1>

            <p className="mt-3 max-w-xl text-sm leading-6 text-[#6B6B68]">
              Keep track of everything
              you've saved, organized, and
              discovered in MemDev.
            </p>
          </div>

          <div className="flex flex-col gap-2 sm:flex-row">
            <button
              type="button"
              onClick={() =>
                navigate("/notes")
              }
              className="inline-flex items-center justify-center gap-2 rounded-lg border border-[#DCDCD6] bg-white px-4 py-2.5 text-sm font-medium text-[#171717] transition hover:bg-[#FAFAF8]"
            >
              <Plus size={16} />
              New note
            </button>

            <button
              type="button"
              onClick={() =>
                navigate("/notes")
              }
              className="inline-flex items-center justify-center gap-2 rounded-lg bg-[#171717] px-4 py-2.5 text-sm font-medium text-white transition hover:bg-[#2B2B2B]"
            >
              <BookOpen size={16} />
              Open library
            </button>
          </div>
        </div>
      </section>

      {/* ------------------------------------------------------------------ */}
      {/* Stats                                                              */}
      {/* ------------------------------------------------------------------ */}

      <section className="mt-6">
        <div className="mb-3 flex items-end justify-between">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.08em] text-[#969692]">
              Your library
            </p>

            <h2 className="mt-1 text-sm font-semibold text-[#171717]">
              Knowledge overview
            </h2>
          </div>
        </div>

        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
          <StatCard
            label="Notes"
            value={stats.totalNotes}
            icon={FileText}
            description="Saved pieces of knowledge"
          />

          <StatCard
            label="Favorites"
            value={stats.favoriteNotes}
            icon={Heart}
            description="Knowledge worth revisiting"
          />

          <StatCard
            label="Archived"
            value={stats.archivedNotes}
            icon={Archive}
            description="Stored out of the way"
          />

          <StatCard
            label="Collections"
            value={stats.totalCollections}
            icon={Folder}
            description="Organized groups of notes"
          />

          <StatCard
            label="Tags"
            value={stats.totalTags}
            icon={Tag}
            description="Ways to connect ideas"
          />
        </div>
      </section>

      {/* ------------------------------------------------------------------ */}
      {/* Recent notes                                                       */}
      {/* ------------------------------------------------------------------ */}

      <section className="mt-7 overflow-hidden rounded-xl border border-[#E7E7E2] bg-white">
        <div className="flex flex-col gap-3 border-b border-[#E7E7E2] px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.06em] text-[#969692]">
              Library activity
            </p>

            <h2 className="mt-1 text-sm font-semibold text-[#171717]">
              Recent notes
            </h2>

            <p className="mt-0.5 text-xs text-[#6B6B68]">
              Your latest additions and
              captures.
            </p>
          </div>

          <button
            type="button"
            onClick={() =>
              navigate("/notes")
            }
            className="inline-flex items-center gap-1.5 self-start text-xs font-semibold text-[#6B6B68] transition hover:text-[#171717] sm:self-auto"
          >
            View all
            <ArrowRight size={13} />
          </button>
        </div>

        {recentNotes.length === 0 ? (
          <div className="px-5 py-16 text-center">
            <div className="mx-auto flex h-11 w-11 items-center justify-center rounded-xl border border-[#E7E7E2] bg-[#FAFAF8]">
              <FileText
                size={18}
                className="text-[#6B6B68]"
              />
            </div>

            <h3 className="mt-4 text-sm font-semibold text-[#171717]">
              Your library is empty
            </h3>

            <p className="mx-auto mt-1 max-w-sm text-sm leading-6 text-[#6B6B68]">
              Start with a note or capture
              something useful from the web.
            </p>

            <button
              type="button"
              onClick={() =>
                navigate("/notes")
              }
              className="mt-5 inline-flex items-center gap-2 rounded-lg bg-[#171717] px-4 py-2.5 text-xs font-semibold text-white transition hover:bg-[#2B2B2B]"
            >
              <Plus size={14} />
              Create your first note
            </button>
          </div>
        ) : (
          <div className="divide-y divide-[#E7E7E2]">
            {recentNotes.map((note) => (
              <button
                key={note.id}
                type="button"
                onClick={() =>
                  navigate(`/notes/${note.id}`)
                }
                className="group flex w-full items-start gap-4 px-5 py-4 text-left transition hover:bg-[#FAFAF8]"
              >
                <div className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-[#E7E7E2] bg-[#FAFAF8] text-[#6B6B68] transition group-hover:border-[#DCDCD6] group-hover:text-[#171717]">
                  <FileText
                    size={16}
                    strokeWidth={1.8}
                  />
                </div>

                <div className="min-w-0 flex-1">
                  <div className="flex items-start justify-between gap-4">
                    <h3 className="truncate text-sm font-medium text-[#171717]">
                      {note.title}
                    </h3>

                    <time
                      dateTime={note.createdAt}
                      className="shrink-0 text-[11px] text-[#969692]"
                    >
                      {formatDate(
                        note.createdAt,
                      )}
                    </time>
                  </div>

                  <p className="mt-1 line-clamp-2 text-xs leading-5 text-[#6B6B68]">
                    {note.summary ||
                      note.content}
                  </p>

                  {note.sourceUrl && (
                    <p className="mt-2 truncate text-[10px] text-[#969692]">
                      {note.sourceUrl}
                    </p>
                  )}
                </div>

                <ArrowRight
                  size={15}
                  className="mt-1 shrink-0 text-[#C0C0BB] transition group-hover:translate-x-0.5 group-hover:text-[#6B6B68]"
                />
              </button>
            ))}
          </div>
        )}
      </section>

      {/* ------------------------------------------------------------------ */}
      {/* Quick access                                                       */}
      {/* ------------------------------------------------------------------ */}

      <section className="mt-7">
        <div className="mb-3">
          <p className="text-[11px] font-semibold uppercase tracking-[0.08em] text-[#969692]">
            Quick access
          </p>

          <h2 className="mt-1 text-sm font-semibold text-[#171717]">
            Continue organizing
          </h2>
        </div>

        <div className="grid gap-3 md:grid-cols-3">
          <button
            type="button"
            onClick={() =>
              navigate("/collections")
            }
            className="group flex items-center gap-4 rounded-xl border border-[#E7E7E2] bg-white p-4 text-left transition hover:-translate-y-0.5 hover:border-[#D8D8D2] hover:shadow-sm"
          >
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-[#FAFAF8] text-[#6B6B68]">
              <Folder
                size={18}
                strokeWidth={1.8}
              />
            </div>

            <div className="min-w-0 flex-1">
              <p className="text-sm font-semibold text-[#171717]">
                Collections
              </p>

              <p className="mt-0.5 text-xs text-[#6B6B68]">
                Group related knowledge
              </p>
            </div>

            <ArrowRight
              size={15}
              className="text-[#C0C0BB] transition group-hover:translate-x-0.5 group-hover:text-[#6B6B68]"
            />
          </button>

          <button
            type="button"
            onClick={() =>
              navigate("/tags")
            }
            className="group flex items-center gap-4 rounded-xl border border-[#E7E7E2] bg-white p-4 text-left transition hover:-translate-y-0.5 hover:border-[#D8D8D2] hover:shadow-sm"
          >
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-[#FAFAF8] text-[#6B6B68]">
              <Tag
                size={18}
                strokeWidth={1.8}
              />
            </div>

            <div className="min-w-0 flex-1">
              <p className="text-sm font-semibold text-[#171717]">
                Tags
              </p>

              <p className="mt-0.5 text-xs text-[#6B6B68]">
                Connect related ideas
              </p>
            </div>

            <ArrowRight
              size={15}
              className="text-[#C0C0BB] transition group-hover:translate-x-0.5 group-hover:text-[#6B6B68]"
            />
          </button>

          <button
            type="button"
            onClick={() =>
              navigate("/notes")
            }
            className="group flex items-center gap-4 rounded-xl border border-[#E7E7E2] bg-white p-4 text-left transition hover:-translate-y-0.5 hover:border-[#D8D8D2] hover:shadow-sm"
          >
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-[#FAFAF8] text-[#6B6B68]">
              <WandSparkles
                size={18}
                strokeWidth={1.8}
              />
            </div>

            <div className="min-w-0 flex-1">
              <p className="text-sm font-semibold text-[#171717]">
                AI summaries
              </p>

              <p className="mt-0.5 text-xs text-[#6B6B68]">
                Explore and summarize notes
              </p>
            </div>

            <ArrowRight
              size={15}
              className="text-[#C0C0BB] transition group-hover:translate-x-0.5 group-hover:text-[#6B6B68]"
            />
          </button>
        </div>
      </section>

      {/* ------------------------------------------------------------------ */}
      {/* Browser capture callout                                            */}
      {/* ------------------------------------------------------------------ */}

      <section className="mt-7 overflow-hidden rounded-xl border border-[#E7E7E2] bg-[#171717]">
        <div className="flex flex-col gap-5 px-5 py-5 sm:flex-row sm:items-center sm:justify-between md:px-6">
          <div className="flex items-start gap-4">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-white/10 text-white">
              <BookOpen
                size={18}
                strokeWidth={1.8}
              />
            </div>

            <div>
              <p className="text-sm font-semibold text-white">
                Capture knowledge while you
                browse.
              </p>

              <p className="mt-1 max-w-xl text-xs leading-5 text-white/60">
                Highlight useful text on a
                webpage and save it directly
                to your MemDev library with
                the browser extension.
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={() =>
              navigate("/notes")
            }
            className="inline-flex shrink-0 items-center justify-center gap-2 rounded-lg bg-white px-4 py-2.5 text-xs font-semibold text-[#171717] transition hover:bg-[#F2F2EF]"
          >
            View your library
            <ArrowRight size={14} />
          </button>
        </div>
      </section>
    </div>
  );
}

export default Dashboard;