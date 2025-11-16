import { Badge } from "@/components/ui/badge";
import { CodeBlock } from "@/components/code-block";
import { LanguageTabs } from "@/components/language-tabs";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export default function PlayersEndpointPage() {
  return (
    <div className="space-y-8">
      <div>
        <div className="mb-4 flex items-center gap-3">
          <Badge variant="outline" className="font-mono">
            GET
          </Badge>
          <code className="text-2xl font-bold">/api/players</code>
        </div>
        <p className="text-lg text-slate-600 dark:text-slate-400">
          Retrieve a list of NBA 2K players with optional filtering and pagination.
        </p>
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
                  <TableHead>Default</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                <TableRow>
                  <TableCell className="font-mono text-sm">teamType</TableCell>
                  <TableCell>
                    <code className="text-sm">curr | class | allt</code>
                  </TableCell>
                  <TableCell>Filter by team type (current, classic, all-time)</TableCell>
                  <TableCell>
                    <code className="text-sm">curr</code>
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="font-mono text-sm">team</TableCell>
                  <TableCell>string</TableCell>
                  <TableCell>Filter by team name</TableCell>
                  <TableCell>-</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="font-mono text-sm">position</TableCell>
                  <TableCell>string</TableCell>
                  <TableCell>Filter by position (PG, SG, SF, PF, C)</TableCell>
                  <TableCell>-</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="font-mono text-sm">minRating</TableCell>
                  <TableCell>number</TableCell>
                  <TableCell>Minimum overall rating (0-99)</TableCell>
                  <TableCell>-</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="font-mono text-sm">limit</TableCell>
                  <TableCell>number</TableCell>
                  <TableCell>Number of results to return (max 100)</TableCell>
                  <TableCell>
                    <code className="text-sm">50</code>
                  </TableCell>
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
  'https://polished-bee-946.convex.site/api/players?teamType=curr&minRating=90&limit=10',
  {
    headers: {
      'X-API-Key': 'your_api_key_here'
    }
  }
);

const data = await response.json();
console.log(data.data); // Array of top 10 current players rated 90+`,
              python: `import requests

response = requests.get(
    'https://polished-bee-946.convex.site/api/players',
    params={
        'teamType': 'curr',
        'minRating': 90,
        'limit': 10
    },
    headers={'X-API-Key': 'your_api_key_here'}
)

data = response.json()
print(data['data'])  # Array of top 10 current players rated 90+`,
              curl: `curl -X GET \\
  'https://polished-bee-946.convex.site/api/players?teamType=curr&minRating=90&limit=10' \\
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
      "height": "6'9\\"",
      "weight": "250 lbs",
      "playerImage": "https://...",
      "teamImage": "https://...",
      "closeShot": 92,
      "midRangeShot": 88,
      "threePointShot": 44,
      "freeThrow": 70,
      "shotIQ": 95,
      "offensiveConsistency": 95,
      // ... 30+ more attributes
      "lastUpdated": "2025-01-15T00:00:00.000Z"
    },
    // ... more players
  ],
  "pagination": {
    "total": 150,
    "count": 10,
    "limit": 10
  }
}`}
            language="json"
          />
        </div>

        <div>
          <h2 className="mb-3 text-2xl font-bold">Response Fields</h2>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Field</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Description</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                <TableRow>
                  <TableCell className="font-mono text-sm">_id</TableCell>
                  <TableCell>string</TableCell>
                  <TableCell>Unique player identifier</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="font-mono text-sm">name</TableCell>
                  <TableCell>string</TableCell>
                  <TableCell>Player's full name</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="font-mono text-sm">slug</TableCell>
                  <TableCell>string</TableCell>
                  <TableCell>URL-friendly identifier (e.g., "lebron-james")</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="font-mono text-sm">overallRating</TableCell>
                  <TableCell>number</TableCell>
                  <TableCell>Overall player rating (0-99)</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="font-mono text-sm">position</TableCell>
                  <TableCell>string</TableCell>
                  <TableCell>Player position (PG, SG, SF, PF, C)</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="font-mono text-sm">team</TableCell>
                  <TableCell>string</TableCell>
                  <TableCell>Team name</TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </div>
        </div>

        <div className="space-y-4 rounded-lg border border-slate-200 bg-slate-50 p-6 dark:border-slate-800 dark:bg-slate-900">
          <h3 className="text-lg font-semibold">Related Endpoints</h3>
          <ul className="space-y-2 text-slate-600 dark:text-slate-400">
            <li>
              <code className="mr-2 rounded bg-white px-1.5 py-0.5 text-sm dark:bg-slate-950">
                GET /api/players/:slug
              </code>
              - Get a single player by slug
            </li>
            <li>
              <code className="mr-2 rounded bg-white px-1.5 py-0.5 text-sm dark:bg-slate-950">
                GET /api/players/search
              </code>
              - Search players by name
            </li>
            <li>
              <code className="mr-2 rounded bg-white px-1.5 py-0.5 text-sm dark:bg-slate-950">
                GET /api/teams
              </code>
              - Get all teams
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}
