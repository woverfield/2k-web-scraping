import Link from "next/link";
import { Separator } from "@/components/ui/separator";

export function Footer() {
  return (
    <footer className="border-t bg-slate-50 dark:bg-slate-950">
      <div className="container mx-auto px-4 py-12">
        <div className="grid gap-8 md:grid-cols-4">
          <div className="md:col-span-1">
            <div className="flex items-center gap-2 font-semibold mb-3">
              <span>nba2k-api</span>
            </div>
            <p className="text-sm text-muted-foreground">
              Access NBA 2K player ratings and team data via REST API.
            </p>
          </div>

          <div>
            <h3 className="mb-3 text-sm font-semibold">Documentation</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/docs" className="text-muted-foreground hover:text-foreground">
                  Getting Started
                </Link>
              </li>
              <li>
                <Link href="/docs#endpoints" className="text-muted-foreground hover:text-foreground">
                  API Reference
                </Link>
              </li>
              <li>
                <Link href="/docs#authentication" className="text-muted-foreground hover:text-foreground">
                  Authentication
                </Link>
              </li>
              <li>
                <Link href="/docs#rate-limiting" className="text-muted-foreground hover:text-foreground">
                  Rate Limiting
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="mb-3 text-sm font-semibold">Resources</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/dashboard" className="text-muted-foreground hover:text-foreground">
                  Dashboard
                </Link>
              </li>
              <li>
                <a
                  href="https://github.com/woverfield/2k-web-scraping"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-muted-foreground hover:text-foreground"
                >
                  GitHub
                </a>
              </li>
              <li>
                <a
                  href="https://2kratings.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-muted-foreground hover:text-foreground"
                >
                  2K Ratings Source
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="mb-3 text-sm font-semibold">Legal</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <span className="text-muted-foreground">
                  Data sourced from 2kratings.com
                </span>
              </li>
              <li>
                <span className="text-muted-foreground text-xs">
                  Not affiliated with 2K Sports or NBA
                </span>
              </li>
            </ul>
          </div>
        </div>

        <Separator className="my-8" />

        <div className="flex flex-col gap-4 text-center text-sm text-muted-foreground md:flex-row md:justify-between">
          <p>Built with Next.js, Convex, and Playwright</p>
          <p>&copy; {new Date().getFullYear()} NBA 2K Ratings API</p>
        </div>
      </div>
    </footer>
  );
}
