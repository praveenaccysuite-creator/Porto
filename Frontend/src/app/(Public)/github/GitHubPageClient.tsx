"use client";

import { useState, useMemo, useCallback, useEffect } from "react";
import Header from "../components/Header";
import Image from "next/image";
import GitHubContributionGraph from "./ContributionGraph";
import { motion, AnimatePresence } from "framer-motion";
import {
  Star,
  GitFork,
  MapPin,
  BookOpen,
  ExternalLink,
  GitCommit,
  Globe,
  Building2,
  Twitter,
  ChevronDown,
  ChevronUp,
} from "lucide-react";

interface GHUser {
  login: string;
  name: string;
  avatar_url: string;
  bio: string | null;
  location: string | null;
  blog: string | null;
  company: string | null;
  twitter_username?: string | null;
  followers: number;
  following: number;
  public_repos: number;
  created_at: string;
  html_url: string;
}

interface GHRepo {
  id: number;
  name: string;
  description: string | null;
  html_url: string;
  language: string | null;
  stargazers_count: number;
  forks_count: number;
  watchers_count: number;
  updated_at: string;
  topics: string[];
  private: boolean;
}

interface GHCommit {
  sha: string;
  html_url: string;
  repoName: string;
  commit: {
    message: string;
    author: {
      name: string;
      date: string;
    };
  };
}

interface GHContributionCalendar {
  totalContributions: number;
  weeks: {
    contributionDays: {
      date: string;
      contributionCount: number;
      contributionLevel:
        | "NONE"
        | "FIRST_QUARTILE"
        | "SECOND_QUARTILE"
        | "THIRD_QUARTILE"
        | "FOURTH_QUARTILE";
    }[];
  }[];
}

const LANG_COLORS: Record<string, string> = {
  TypeScript: "#3178c6",
  JavaScript: "#f1e05a",
  Python: "#3572A5",
  Rust: "#dea584",
  Go: "#00ADD8",
  CSS: "#563d7c",
  HTML: "#e34c26",
  default: "#8b949e",
};

function langColor(lang: string | null) {
  if (!lang) return LANG_COLORS.default;
  return LANG_COLORS[lang] ?? LANG_COLORS.default;
}

function timeAgo(date: string) {
  const mins = Math.floor((Date.now() - new Date(date).getTime()) / 60000);
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  const days = Math.floor(hrs / 24);
  return `${days}d ago`;
}

function RepoCard({ repo, delay = 0 }: { repo: GHRepo; delay?: number }) {
  return (
    <motion.a
      href={repo.html_url}
      target="_blank"
      rel="noreferrer"
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ scale: 1.02 }}
      transition={{ duration: 0.25, delay }}
      className="flex flex-col gap-2 p-4 rounded-md dark:bg-gray-900/70 border border-gray-400 dark:border-[#30363d] hover:border-[#388bfd] transition-colors duration-60"
    >
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-1.5 min-w-0">
          <BookOpen size={14} className="shrink-0 text-[#848d97]" />
          <span className="text-sm font-semibold text-[#388bfd] truncate ">
            {repo.name}
          </span>
        </div>
        <span className="text-[11px] border border-gray-300 dark:border-[#30363d] rounded-full px-2 py-[1px] text-[#848d97] shrink-0">
          {repo.private ? "Private" : "Public"}
        </span>
      </div>

      {/* description */}
      {repo.description && (
        <p className="text-xs text-[#848d97] line-clamp-2 leading-relaxed">
          {repo.description}
        </p>
      )}

      {/* meta */}
      <div className="flex items-center gap-3 text-xs text-[#848d97] mt-auto">
        {repo.language && (
          <span className="flex items-center gap-1.5">
            <span
              className="w-2.5 h-2.5 rounded-full shrink-0"
              style={{ backgroundColor: langColor(repo.language) }}
            />
            {repo.language}
          </span>
        )}

        <span className="flex items-center gap-1">
          <Star size={11} />
          {repo.stargazers_count}
        </span>

        <span className="flex items-center gap-1">
          <GitFork size={11} />
          {repo.forks_count}
        </span>
      </div>
    </motion.a>
  );
}

function ActivityItem({
  icon,
  title,
  children,
}: {
  icon: React.ReactNode;
  title: string;
  children: React.ReactNode;
}) {
  const [expanded, setExpanded] = useState(true);

  return (
    <div className="flex gap-3 mb-4">
      {/* timeline */}
      <div className="flex flex-col items-center">
        <div className="w-8 h-8 rounded-full border border-gray-300 dark:border-[#30363d] bg-white dark:bg-[#0d1117] flex items-center justify-center shrink-0 text-[#848d97]">
          {icon}
        </div>
        <div className="w-px flex-1 bg-[#21262d] mt-1" />
      </div>

      {/* content */}
      <div className="flex-1 pb-4 min-w-0">
        <div className="flex items-center justify-between gap-2 mb-2">
          <span className="text-sm dark:text-[#e6edf3]">{title}</span>
          <button
            onClick={() => setExpanded((p) => !p)}
            className="text-[#848d97] hover:text-[#e6edf3] transition-colors"
          >
            {expanded ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
          </button>
        </div>

        <AnimatePresence initial={false}>
          {expanded && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.2 }}
              className="overflow-hidden"
            >
              {children}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

function CommitActivity({ commits }: { commits: GHCommit[] }) {
  const grouped = useMemo(() => {
    const map = new Map<string, { count: number; repoUrl: string }>();
    commits.forEach((c) => {
      const prev = map.get(c.repoName);
      map.set(c.repoName, {
        count: (prev?.count ?? 0) + 1,
        repoUrl: c.html_url.replace(/\/commit\/.*/, ""),
      });
    });
    return Array.from(map.entries()).sort((a, b) => b[1].count - a[1].count);
  }, [commits]);

  const maxCount = grouped[0]?.[1].count ?? 1;

  return (
    <ActivityItem
      icon={<GitCommit size={14} />}
      title={`Created ${commits.length} commit${commits.length !== 1 ? "s" : ""} in ${grouped.length} repositor${grouped.length !== 1 ? "ies" : "y"}`}
    >
      <div className="space-y-2">
        {grouped.map(([repoName, { count, repoUrl }]) => (
          <div key={repoName} className="flex items-center gap-3">
            <a
              href={repoUrl}
              target="_blank"
              rel="noreferrer"
              className="text-[13px] text-[#388bfd] hover:underline shrink-0"
            >
              {repoName}
            </a>
            <span className="text-xs text-[#848d97] shrink-0">
              {count} commit{count !== 1 ? "s" : ""}
            </span>
            <div className="flex-1 h-2 rounded-full bg-[#21262d] overflow-hidden">
              <div
                className="h-full rounded-full bg-[#238636]"
                style={{ width: `${(count / maxCount) * 100}%` }}
              />
            </div>
          </div>
        ))}
      </div>
    </ActivityItem>
  );
}

const RepoIcon = () => (
  <svg viewBox="0 0 16 16" width="14" height="14" fill="currentColor">
    <path d="M2 2.5A2.5 2.5 0 0 1 4.5 0h8.75a.75.75 0 0 1 .75.75v12.5a.75.75 0 0 1-.75.75h-2.5a.75.75 0 0 1 0-1.5h1.75v-2h-8a1 1 0 0 0-.714 1.7.75.75 0 1 1-1.072 1.05A2.495 2.495 0 0 1 2 11.5Zm10.5-1h-8a1 1 0 0 0-1 1v6.708A2.486 2.486 0 0 1 4.5 9h8Z" />
  </svg>
);

function RepoActivityItem({
  repo,
  userLogin,
}: {
  repo: GHRepo;
  userLogin: string;
}) {
  return (
    <ActivityItem icon={<RepoIcon />} title="Created 1 repository">
      <div className="flex items-center justify-between flex-wrap gap-2">
        <div className="flex items-center gap-2">
          <svg viewBox="0 0 16 16" width="13" height="13" fill="#848d97">
            <path d="M2 2.5A2.5 2.5 0 0 1 4.5 0h8.75a.75.75 0 0 1 .75.75v12.5a.75.75 0 0 1-.75.75h-2.5a.75.75 0 0 1 0-1.5h1.75v-2h-8a1 1 0 0 0-.714 1.7.75.75 0 1 1-1.072 1.05A2.495 2.495 0 0 1 2 11.5Zm10.5-1h-8a1 1 0 0 0-1 1v6.708A2.486 2.486 0 0 1 4.5 9h8Z" />
          </svg>
          <a
            href={repo.html_url}
            target="_blank"
            rel="noreferrer"
            className="text-[13px] text-[#388bfd] hover:underline"
          >
            {userLogin}/{repo.name}
          </a>
        </div>
        <div className="flex items-center gap-3 text-xs text-[#848d97]">
          {repo.language && (
            <span className="flex items-center gap-1.5">
              <span
                className="w-2 h-2 rounded-full"
                style={{ backgroundColor: langColor(repo.language) }}
              />
              {repo.language}
            </span>
          )}
          <span>{timeAgo(repo.updated_at)}</span>
        </div>
      </div>
    </ActivityItem>
  );
}

export default function GitHubPageClient() {
  const [user, setUser] = useState<GHUser | null>(null);
  const [repos, setRepos] = useState<GHRepo[]>([]);
  const [commits, setCommits] = useState<GHCommit[]>([]);
  const [contributionCalendar, setContributionCalendar] =
    useState<GHContributionCalendar | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showAllRepos, setShowAllRepos] = useState(false);
  const [showMoreActivity, setShowMoreActivity] = useState(false);

  useEffect(() => {
    const loadGithub = async () => {
      try {
        setLoading(true);
        const API = process.env.NEXT_PUBLIC_API_URL;
        if (!API) {
          throw new Error("API URL is not configured");
        }

        const res = await fetch(`${API}/github/overview`, { cache: "no-store" });
        if (!res.ok) {
          throw new Error("Failed to load GitHub data");
        }

        const data = await res.json();
        setUser(data.user ?? null);
        setRepos(data.repos ?? []);
        setCommits(data.commits ?? []);
        setContributionCalendar(data.contributionCalendar ?? null);
        setError(null);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load GitHub data");
      } finally {
        setLoading(false);
      }
    };

    loadGithub();
  }, []);

  const toggleShowMoreActivity = useCallback(() => {
    setShowMoreActivity((p) => !p);
  }, []);

  const sorted = useMemo(
    () => [...repos].sort((a, b) => b.stargazers_count - a.stargazers_count),
    [repos],
  );
  const visibleRepos = showAllRepos ? sorted : sorted.slice(0, 6);

  const containerVariants = {
    hidden: {},
    show: {
      transition: {
        staggerChildren: 0.08,
      },
    },
  };

const itemVariants = {
  hidden: { opacity: 0, y: 25, scale: 0.98 },
  show: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      duration: 0.45,
      ease: [0.22, 1, 0.36, 1],
    },
  },
};

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-gray-600 dark:text-gray-300">
        Loading GitHub profile…
      </div>
    );
  }

  if (error || !user) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-3 px-4 text-center">
        <Header hiddenNav={true} />
        <p className="text-gray-600 dark:text-gray-300">
          {error ?? "GitHub data is unavailable right now."}
        </p>
      </div>
    );
  }

  return (
    <AnimatePresence mode="wait">
      <div className="relative min-h-screen   text-gray-900 dark:text-[#e6edf3]">
        <div
          className=" fixed inset-x-0 blur-2xl -top-90 -z-10 transform-gpu overflow-hidden sm:-top-90 opacity-40"
          aria-hidden="true"
        >
          <div
            className="relative left-[calc(50%-11rem)] aspect-[1155/678]
          w-[36.125rem] -translate-x-1/2 rotate-[30deg]
          bg-gradient-to-tr from-[#ff80b5] to-[#9089fc]
          sm:left-[calc(100%-50rem)] sm:w-[82.1875rem]"
            style={{
              clipPath:
                "polygon(49.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)",
            }}
          ></div>
        </div>{" "}
        <Header hiddenNav={true} />

          <motion.div
            key="content"
            className="relative max-w-[1280px] mx-auto px-4 py-8 flex flex-col lg:flex-row gap-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
          >
            <motion.aside
              variants={itemVariants}
              className="w-full lg:w-[296px] lg:shrink-0 lg:sticky lg:top-8 lg:self-start space-y-4"
            >
              {" "}
              <Image
                src={user.avatar_url}
                alt={user.login}
                width={150}
                height={150}
                className="w-24 h-24 sm:w-32 sm:h-32 md:w-36 md:h-36 lg:w-full lg:h-full rounded-full border border-gray-300 dark:border-[#30363d] object-cover"
              />
              {/* Name + login */}
              <div className="mt-1">
                <h1 className="text-[26px] font-semibold leading-tight dark:text-[#e6edf3]">
                  {user.name || user.login}
                </h1>
                <p className="text-xl font-light text-[#848d97]">
                  {user.login}
                </p>
              </div>
              {/* Bio */}
              {user.bio && (
                <p className="text-sm  dark:text-[#e6edf3] leading-relaxed">
                  {user.bio}
                </p>
              )}
              {/* Edit profile */}
              <button className="w-full py-[5px] px-3 text-sm font-medium bg-[#21262d] border border-[#363b42] rounded-md text-[#e6edf3] hover:bg-[#30363d] transition-colors">
                Edit profile
              </button>
              {/* Follow stats */}
              <div className="flex items-center gap-1.5 text-sm text-[#848d97]">
                <svg
                  viewBox="0 0 16 16"
                  width="16"
                  height="16"
                  fill="currentColor"
                >
                  <path d="M2 5.5a3.5 3.5 0 1 1 5.898 2.549 5.508 5.508 0 0 1 3.034 4.084.75.75 0 1 1-1.482.235 4 4 0 0 0-7.9 0 .75.75 0 0 1-1.482-.236A5.507 5.507 0 0 1 3.102 8.05 3.493 3.493 0 0 1 2 5.5ZM11 4a3.001 3.001 0 0 1 2.22 5.018 5.01 5.01 0 0 1 2.56 3.012.749.749 0 0 1-.885.954.752.752 0 0 1-.549-.514 3.507 3.507 0 0 0-2.522-2.372.75.75 0 0 1-.574-.73v-.352a.75.75 0 0 1 .416-.672A1.5 1.5 0 0 0 11 5.5.75.75 0 0 1 11 4Zm-5.5-.5a2 2 0 1 0-.001 3.999A2 2 0 0 0 5.5 3.5Z" />
                </svg>
                <a
                  href="#"
                  className="font-semibold dark:text-[#e6edf3] text-gray-500 hover:text-[#388bfd]"
                >
                  {user.followers.toLocaleString()}
                </a>
                <span>followers</span>
                <span>·</span>
                <a
                  href="#"
                  className="font-semibold dark:text-[#e6edf3] text-gray-500 hover:text-[#388bfd]"
                >
                  {user.following.toLocaleString()}
                </a>
                <span>following</span>
              </div>
              {/* Meta info */}
              <div className="space-y-1.5 text-sm text-[#848d97]">
                {user.location && (
                  <div className="flex items-center gap-2">
                    <MapPin size={15} className="shrink-0" />
                    <span>{user.location}</span>
                  </div>
                )}
                {user.blog && (
                  <div className="flex items-center gap-2">
                    <Globe size={15} className="shrink-0" />
                    <a
                      href={user.blog}
                      target="_blank"
                      rel="noreferrer"
                      className="hover:text-[#388bfd] truncate"
                    >
                      {user.blog}
                    </a>
                  </div>
                )}
                {user.company && (
                  <div className="flex items-center gap-2">
                    <Building2 size={15} className="shrink-0" />
                    <span>{user.company}</span>
                  </div>
                )}
                {user.twitter_username && (
                  <div className="flex items-center gap-2">
                    <Twitter size={15} className="shrink-0" />
                    <a
                      href={`https://twitter.com/${user.twitter_username}`}
                      target="_blank"
                      rel="noreferrer"
                      className=" text-base hover:text-[#388bfd]"
                    >
                      @{user.twitter_username}
                    </a>
                  </div>
                )}
              </div>
              {/* Achievements */}
              <div>
                <h2 className="text-sm text-base font-semibold mb-2">
                  Achievements
                </h2>
                <div className="flex flex-wrap gap-2">
                  <Image
                    src="/assets/img/Pull-Shark.png"
                    width={50}
                    height={50}
                    alt="Achievement badge"
                    title="Achievement"
                    className="w-12 h-12 rounded-full border border-gray-300 dark:border-[#30363d]"
                    onError={(e) => {
                      (e.target as HTMLImageElement).style.display = "none";
                    }}
                  />
                </div>
              </div>
            </motion.aside>

            {/* ══════════════════════════════
            MAIN CONTENT
        ══════════════════════════════ */}
            <motion.div
              variants={containerVariants}
              initial="hidden"
              animate="show"
              className="flex-1 min-w-0 space-y-6"
            >
              {/* ── Popular Repositories ── */}
              <motion.section variants={itemVariants}>
                <div className="flex items-center justify-between mb-3">
                  <h2 className="text-base font-semibold">
                    Popular repositories
                  </h2>
                  <a
                    href={`${user.html_url}?tab=repositories`}
                    target="_blank"
                    rel="noreferrer"
                    className="text-xs text-[#388bfd] hover:underline"
                  >
                    Customize your pins
                  </a>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <AnimatePresence initial={false}>
                    {visibleRepos.map((r, i) => (
                      <RepoCard key={r.id} repo={r} delay={i * 0.04} />
                    ))}
                  </AnimatePresence>
                </div>

                {sorted.length > 6 && (
                  <motion.button
                    whileHover={{ scale: 1.01 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setShowAllRepos((p) => !p)}
                    className="mt-3 w-full flex items-center justify-center gap-1.5
                  py-2 text-sm dark:text-[#848d97]
                  dark:bg-gray-900/30
                  border border-gray-400 dark:border-[#30363d] rounded-md
                  hover:border-[#388bfd] hover:text-[#388bfd]
                  transition-colors"
                  >
                    {showAllRepos ? (
                      <>
                        <ChevronUp size={14} /> Show less
                      </>
                    ) : (
                      <>
                        <ChevronDown size={14} /> Show all {sorted.length}{" "}
                        repositories
                      </>
                    )}
                  </motion.button>
                )}
              </motion.section>

              <motion.section variants={itemVariants}>
                <GitHubContributionGraph
                  calendar={contributionCalendar ?? undefined}
                />
              </motion.section>

              {/* ── Contribution Activity ── */}
              <motion.section variants={itemVariants}>
                <h2 className="text-base font-semibold mb-4">
                  Contribution activity
                </h2>

                {/* Month divider */}
                <div className="flex items-center gap-3 mb-4">
                  <span className="text-sm font-semibold">
                    {new Date().toLocaleString("default", {
                      month: "long",
                      year: "numeric",
                    })}
                  </span>
                  <div className="flex-1 h-px bg-gray-400 dark:bg-gray-500" />
                </div>

                {/* Commits activity */}
                {commits.length > 0 && <CommitActivity commits={commits} />}

                {/* Always-visible: first created repo */}
                {repos.slice(0, 1).map((r) => (
                  <RepoActivityItem
                    key={r.id}
                    repo={r}
                    userLogin={user.login}
                  />
                ))}

                {/* Extra items revealed by "Show more activity" */}
                <AnimatePresence initial={false}>
                  {showMoreActivity && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.25 }}
                      className="overflow-hidden"
                    >
                      {/* Starred repos — one entry per extra repo */}
                      {repos.slice(1, 3).map((r) => (
                        <RepoActivityItem
                          key={r.id}
                          repo={r}
                          userLogin={user.login}
                        />
                      ))}

                      {/* Extra commits batch if we have more than one repo worth */}
                      {commits.length > 3 && (
                        <ActivityItem
                          icon={<GitCommit size={14} />}
                          title={`${commits.length - 3} more commit${commits.length - 3 !== 1 ? "s" : ""} across repositories`}
                        >
                          <div className="space-y-1.5">
                            {commits.slice(3, 6).map((c) => (
                              <a
                                key={c.sha}
                                href={c.html_url}
                                target="_blank"
                                rel="noreferrer"
                                className="flex items-center gap-2 text-xs text-[#848d97] hover:text-[#e6edf3] transition-colors"
                              >
                                <GitCommit
                                  size={11}
                                  className="dark:ext-[#3fb950] shrink-0"
                                />
                                <span className="truncate">
                                  {c.commit.message}
                                </span>
                                <span className="shrink-0 font-mono text-[10px]">
                                  {c.sha.slice(0, 7)}
                                </span>
                                <span className="shrink-0">
                                  {timeAgo(c.commit.author.date)}
                                </span>
                              </a>
                            ))}
                          </div>
                        </ActivityItem>
                      )}
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Show more / Show less toggle */}
                <button
                  onClick={toggleShowMoreActivity}
                  className="w-full mt-2 py-2 text-sm dark:bg-gray-900/40 text-[#388bfd] border border-gray-300 dark:border-[#30363d] rounded-md  transition-colors dark:hover:bg-gray-900/50 transform hover:scale-[1.02] transition-transform duration-200"
                >
                  {showMoreActivity
                    ? "Show less activity"
                    : "Show more activity"}
                </button>
              </motion.section>

              {/* ── Latest Commits ── */}
              {commits.length > 0 && (
                <motion.section variants={itemVariants}>
                  <h2 className="text-base font-semibold mb-3">
                    Latest Commits
                  </h2>

                  <div className="border border-gray-300 dark:bg-gray-900/70  dark:border-[#30363d] rounded-md overflow-hidden divide-y divide-gray-200 dark:divide-[#21262d]">
                    {commits.map((c, i) => (
                      <motion.a
                        key={c.sha}
                        href={c.html_url}
                        target="_blank"
                        rel="noreferrer"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: i * 0.03 }}
                        className="flex items-start gap-3 px-4 py-3 dark:hover:bg-gray-900/40  hover:bg-gray-600/10 transform hover:scale-[1.02] transition-transform duration-200 transition-colors group"
                      >
                        <GitCommit
                          size={14}
                          className="text-[#3fb950] shrink-0 mt-0.5"
                        />
                        <div className="flex-1 min-w-0">
                          <p className="text-sm dark:text-[#e6edf3] truncate">
                            {c.commit.message}
                          </p>
                          <p className="text-xs text-[#848d97] mt-0.5 flex items-center gap-1.5 flex-wrap">
                            <span className="font-medium text-[#adbac7]">
                              {c.repoName}
                            </span>
                            <span>·</span>
                            <code className="font-mono text-[11px]">
                              {c.sha.slice(0, 7)}
                            </code>
                            <span>·</span>
                            <span>{timeAgo(c.commit.author.date)}</span>
                          </p>
                        </div>
                        <ExternalLink
                          size={12}
                          className="shrink-0 text-[#848d97] opacity-0 group-hover:opacity-100 transition-opacity mt-1"
                        />
                      </motion.a>
                    ))}
                  </div>
                </motion.section>
              )}

              {/* Footer */}
              <p className="text-xs text-[#848d97] border-t border-[#21262d] pt-4 pb-8">
                Seeing something unexpected?{" "}
                <a
                  href="https://github.com/Praveen-Singh0"
                  target="_blank"
                  rel="noreferrer"
                  className="text-[#388bfd] hover:underline"
                >
                  Take a look at the GitHub profile
                </a>
                .
              </p>
            </motion.div>
          </motion.div>

      </div>
    </AnimatePresence>
  );
}
