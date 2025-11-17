import { Badge } from "@/components/ui/badge";
import { CodeBlock } from "@/components/code-block";
import { LanguageTabs } from "@/components/language-tabs";
import { TryItLiveButton } from "@/components/try-it-live-button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export default function SearchEndpointPage() {
  return (
    <div className="space-y-8">
      <div>
        <div className="mb-4 flex items-center gap-3">
          <Badge variant="outline" className="font-mono">
            GET
          </Badge>
          <code className="text-2xl font-bold">/api/players/search</code>
        </div>
        <p className="text-lg text-slate-600 dark:text-slate-400">
          Search for players by name with fuzzy matching support.
        </p>
        <div className="mt-4 flex gap-3">
          <TryItLiveButton href="/playground?search=lebron" label="Try Search: LeBron" />
          <TryItLiveButton
            href="/playground?search=curry"
            label="Try Search: Curry"
            variant="secondary"
          />
        </div>
      </div>

      <div className="space-y-6">
        <div>
          <h2 className="mb-3 text-2xl font-bold">Query Parameters</h2>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Parameter</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Description</TableHead>
                  <TableHead>Required</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                <TableRow>
                  <TableCell className="font-mono text-sm">q</TableCell>
                  <TableCell>string</TableCell>
                  <TableCell>Search query (player name)</TableCell>
                  <TableCell>Yes</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="font-mono text-sm">teamType</TableCell>
                  <TableCell>
                    <code className="text-sm">curr | class | allt</code>
                  </TableCell>
                  <TableCell>Filter by team type</TableCell>
                  <TableCell>No</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="font-mono text-sm">limit</TableCell>
                  <TableCell>number</TableCell>
                  <TableCell>Maximum results to return (max 50)</TableCell>
                  <TableCell>No (default: 10)</TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </div>
        </div>

        <div>
          <h2 className="mb-3 text-2xl font-bold">Example Request</h2>
          <LanguageTabs
            examples={{
              javascript: `const response = await fetch(
  'https://canny-kingfisher-472.convex.site/api/players/search?q=lebron',
  {
    headers: {
      'X-API-Key': 'your_api_key_here'
    }
  }
);

const data = await response.json();
console.log(data.data); // Array of matching players`,
              python: `import requests

response = requests.get(
    'https://canny-kingfisher-472.convex.site/api/players/search',
    params={'q': 'lebron'},
    headers={'X-API-Key': 'your_api_key_here'}
)

data = response.json()
print(data['data'])  # Array of matching players`,
              curl: `curl -X GET \\
  'https://canny-kingfisher-472.convex.site/api/players/search?q=lebron' \\
  -H 'X-API-Key: your_api_key_here'`,
            }}
          />
        </div>

        <div>
          <h2 className="mb-3 text-2xl font-bold">Example Response</h2>
          <CodeBlock
            code={`{
  "success": true,
  "data": [
    {
      "_id": "abc123",
      "name": "LeBron James",
      "slug": "lebron-james",
      "team": "Los Angeles Lakers",
      "teamType": "curr",
      "overallRating": 97,
      "position": "SF",
      "playerImage": "https://...",
      "relevance": 1.0
    }
  ],
  "query": "lebron",
  "count": 1
}`}
            language="json"
          />
        </div>

        <div>
          <h2 className="mb-3 text-2xl font-bold">Search Tips</h2>
          <div className="space-y-4">
            <div className="rounded-lg border border-slate-200 bg-slate-50 p-4 dark:border-slate-800 dark:bg-slate-900">
              <h4 className="mb-2 font-semibold">Partial Matching</h4>
              <p className="mb-2 text-sm text-slate-600 dark:text-slate-400">
                Search works with partial names. You don't need to type the full name.
              </p>
              <CodeBlock
                code={`// All of these will find LeBron James:
?q=lebron
?q=lebron james
?q=leb
?q=james lebron`}
                language="javascript"
              />
            </div>

            <div className="rounded-lg border border-slate-200 bg-slate-50 p-4 dark:border-slate-800 dark:bg-slate-900">
              <h4 className="mb-2 font-semibold">Case Insensitive</h4>
              <p className="text-sm text-slate-600 dark:text-slate-400">
                Search is case-insensitive. <code className="rounded bg-white px-1 text-xs dark:bg-slate-950">?q=LEBRON</code> and{" "}
                <code className="rounded bg-white px-1 text-xs dark:bg-slate-950">?q=lebron</code> return the same results.
              </p>
            </div>

            <div className="rounded-lg border border-slate-200 bg-slate-50 p-4 dark:border-slate-800 dark:bg-slate-900">
              <h4 className="mb-2 font-semibold">Combine with Filters</h4>
              <p className="mb-2 text-sm text-slate-600 dark:text-slate-400">
                Narrow results by combining search with team type filters.
              </p>
              <CodeBlock
                code={`// Search only current rosters
?q=michael jordan&teamType=curr

// Search classic teams
?q=kobe&teamType=class`}
                language="javascript"
              />
            </div>
          </div>
        </div>

        <div className="space-y-4 rounded-lg border border-slate-200 bg-slate-50 p-6 dark:border-slate-800 dark:bg-slate-900">
          <h3 className="text-lg font-semibold">Common Use Cases</h3>
          <ul className="space-y-2 text-slate-600 dark:text-slate-400">
            <li>
              • Building an autocomplete search box
            </li>
            <li>
              • Finding players by last name
            </li>
            <li>
              • Implementing a "type to search" feature
            </li>
            <li>
              • Creating Discord bot commands (/player search lebron)
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}
