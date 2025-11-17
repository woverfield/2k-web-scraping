import Link from "next/link";
import { Button } from "@/components/ui/button";
import { CodeBlock } from "@/components/code-block";
import { LanguageTabs } from "@/components/language-tabs";
import { AlertCircle, CheckCircle2, XCircle } from "lucide-react";

export default function AuthenticationPage() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="mb-4 text-4xl font-bold">Authentication</h1>
        <p className="text-lg text-slate-600 dark:text-slate-400">
          Learn how to authenticate your API requests using API keys.
        </p>
      </div>

      <div className="space-y-6">
        <div>
          <h2 className="mb-3 text-2xl font-bold">API Keys</h2>
          <p className="mb-4 text-slate-600 dark:text-slate-400">
            The NBA 2K Ratings API uses API keys to authenticate requests. All requests must include
            a valid API key in the <code className="rounded bg-slate-100 px-1.5 py-0.5 text-sm dark:bg-slate-800">X-API-Key</code> header.
          </p>
          <Button asChild>
            <Link href="/dashboard">Get Your API Key</Link>
          </Button>
        </div>

        <div>
          <h2 className="mb-3 text-2xl font-bold">Including your API key</h2>
          <p className="mb-4 text-slate-600 dark:text-slate-400">
            Add your API key to the <code className="rounded bg-slate-100 px-1.5 py-0.5 text-sm dark:bg-slate-800">X-API-Key</code> header in every request:
          </p>
          <LanguageTabs
            examples={{
              javascript: `const response = await fetch(
  'https://canny-kingfisher-472.convex.site/api/players',
  {
    headers: {
      'X-API-Key': 'your_api_key_here'
    }
  }
);`,
              python: `import requests

response = requests.get(
    'https://canny-kingfisher-472.convex.site/api/players',
    headers={'X-API-Key': 'your_api_key_here'}
)`,
              curl: `curl -X GET \\
  'https://canny-kingfisher-472.convex.site/api/players' \\
  -H 'X-API-Key: your_api_key_here'`,
            }}
          />
        </div>

        <div>
          <h2 className="mb-3 text-2xl font-bold">Best Practices</h2>

          <div className="space-y-4">
            <div className="flex gap-3 rounded-lg border border-green-200 bg-green-50 p-4 dark:border-green-900 dark:bg-green-950">
              <CheckCircle2 className="h-5 w-5 shrink-0 text-green-600 dark:text-green-400" />
              <div>
                <h4 className="mb-1 font-semibold text-green-900 dark:text-green-100">
                  Store API keys in environment variables
                </h4>
                <p className="text-sm text-green-700 dark:text-green-300">
                  Never hardcode API keys in your source code. Use environment variables instead.
                </p>
                <CodeBlock
                  code={`# .env
NBA2K_API_KEY=your_api_key_here

# JavaScript
const apiKey = process.env.NBA2K_API_KEY;

# Python
import os
api_key = os.getenv('NBA2K_API_KEY')`}
                  filename=".env"
                  className="mt-3"
                />
              </div>
            </div>

            <div className="flex gap-3 rounded-lg border border-yellow-200 bg-yellow-50 p-4 dark:border-yellow-900 dark:bg-yellow-950">
              <AlertCircle className="h-5 w-5 shrink-0 text-yellow-600 dark:text-yellow-400" />
              <div>
                <h4 className="mb-1 font-semibold text-yellow-900 dark:text-yellow-100">
                  Add .env to .gitignore
                </h4>
                <p className="text-sm text-yellow-700 dark:text-yellow-300">
                  Prevent committing your API keys to version control.
                </p>
                <CodeBlock
                  code={`# .gitignore
.env
.env.local
.env.*.local`}
                  filename=".gitignore"
                  className="mt-3"
                />
              </div>
            </div>

            <div className="flex gap-3 rounded-lg border border-red-200 bg-red-50 p-4 dark:border-red-900 dark:bg-red-950">
              <XCircle className="h-5 w-5 shrink-0 text-red-600 dark:text-red-400" />
              <div>
                <h4 className="mb-1 font-semibold text-red-900 dark:text-red-100">
                  Never expose API keys in client-side code
                </h4>
                <p className="text-sm text-red-700 dark:text-red-300">
                  API calls should be made from your backend/server, not directly from the browser.
                  Exposing keys in client-side JavaScript makes them publicly accessible.
                </p>
              </div>
            </div>

            <div className="flex gap-3 rounded-lg border border-green-200 bg-green-50 p-4 dark:border-green-900 dark:bg-green-950">
              <CheckCircle2 className="h-5 w-5 shrink-0 text-green-600 dark:text-green-400" />
              <div>
                <h4 className="mb-1 font-semibold text-green-900 dark:text-green-100">
                  Regenerate compromised keys immediately
                </h4>
                <p className="text-sm text-green-700 dark:text-green-300">
                  If you accidentally expose your API key, regenerate it immediately in your{" "}
                  <Link href="/dashboard" className="underline">
                    dashboard
                  </Link>
                  .
                </p>
              </div>
            </div>
          </div>
        </div>

        <div>
          <h2 className="mb-3 text-2xl font-bold">Error Responses</h2>
          <p className="mb-4 text-slate-600 dark:text-slate-400">
            If authentication fails, you'll receive a 401 Unauthorized response:
          </p>
          <CodeBlock
            code={`{
  "success": false,
  "error": {
    "message": "Invalid or missing API key",
    "code": "INVALID_API_KEY"
  }
}`}
            language="json"
          />
        </div>

        <div className="space-y-4 rounded-lg border border-slate-200 bg-slate-50 p-6 dark:border-slate-800 dark:bg-slate-900">
          <h3 className="text-lg font-semibold">Need help?</h3>
          <p className="text-slate-600 dark:text-slate-400">
            If you're having trouble with authentication, check out the{" "}
            <Link href="/docs/errors" className="font-medium text-primary hover:underline">
              error handling guide
            </Link>{" "}
            or view your{" "}
            <Link href="/dashboard" className="font-medium text-primary hover:underline">
              dashboard
            </Link>{" "}
            to verify your API key is active.
          </p>
        </div>
      </div>
    </div>
  );
}
