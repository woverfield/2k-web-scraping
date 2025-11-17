import { DocsSidebar } from "@/components/docs-sidebar";

const docsNavigation = [
  {
    title: "Getting Started",
    items: [
      { title: "Introduction", href: "/docs" },
      { title: "Quickstart", href: "/docs/quickstart" },
      { title: "Authentication", href: "/docs/authentication" },
    ],
  },
  {
    title: "API Reference",
    items: [
      { title: "Players", href: "/docs/endpoints/players" },
      { title: "Teams", href: "/docs/endpoints/teams" },
      { title: "Search", href: "/docs/endpoints/search" },
    ],
  },
  {
    title: "Guides",
    items: [
      { title: "Rate Limits", href: "/docs/rate-limits" },
      { title: "Error Handling", href: "/docs/errors" },
    ],
  },
];

export default function DocsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex gap-8">
        <DocsSidebar sections={docsNavigation} />
        <main className="min-w-0 flex-1">
          <div className="mx-auto max-w-3xl">{children}</div>
        </main>
      </div>
    </div>
  );
}
