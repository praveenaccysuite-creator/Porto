"use client";

interface SectionEmptyStateProps {
  title: string;
  message?: string;
}

export default function SectionEmptyState({
  title,
  message = "No content has been added yet. Check back soon.",
}: SectionEmptyStateProps) {
  return (
    <div
      role="status"
      className="mx-auto px-6 py-12 text-center"
    >
      <p className="text-sm font-semibold uppercase tracking-wide text-pink-500">
        {title}
      </p>
      <p className="mt-3 text-base text-gray-600 dark:text-gray-300">{message}</p>
    </div>
  );
}
