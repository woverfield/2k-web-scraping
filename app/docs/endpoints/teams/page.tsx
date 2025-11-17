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

export default function TeamsEndpointPage() {
  return (
    <div className="space-y-8">
      <div>
        <div className="mb-4 flex items-center gap-3">
          <Badge variant="outline" className="font-mono">
            GET
          </Badge>
          <code className="text-2xl font-bold">/api/teams</code>
        </div>
        <p className="text-lg text-slate-600 dark:text-slate-400">
          Retrieve a list of all NBA 2K teams with their rosters.
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
              </TableBody>
            </Table>
          </div>
        </div>

        <div>
          <h2 className="mb-3 text-2xl font-bold">Example Request</h2>
          <LanguageTabs
            examples={{
              javascript: `const response = await fetch(
  'https://canny-kingfisher-472.convex.site/api/teams?teamType=curr',
  {
    headers: {
      'X-API-Key': 'your_api_key_here'
    }
  }
);

const data = await response.json();
console.log(data.data); // Array of all current NBA teams`,
              python: `import requests

response = requests.get(
    'https://canny-kingfisher-472.convex.site/api/teams',
    params={'teamType': 'curr'},
    headers={'X-API-Key': 'your_api_key_here'}
)

data = response.json()
print(data['data'])  # Array of all current NBA teams`,
              curl: `curl -X GET \\
  'https://canny-kingfisher-472.convex.site/api/teams?teamType=curr' \\
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
      "teamName": "Los Angeles Lakers",
      "teamType": "curr",
      "playerCount": 17,
      "averageRating": 82.4
    },
    {
      "teamName": "Boston Celtics",
      "teamType": "curr",
      "playerCount": 16,
      "averageRating": 81.8
    },
    // ... more teams
  ]
}`}
            language="json"
          />
        </div>

        <div>
          <h2 className="mb-3 text-2xl font-bold">Get Team Roster</h2>
          <p className="mb-4 text-slate-600 dark:text-slate-400">
            To get a specific team's roster, use the team roster endpoint:
          </p>
          <LanguageTabs
            examples={{
              javascript: `const response = await fetch(
  'https://canny-kingfisher-472.convex.site/api/teams/Los%20Angeles%20Lakers/roster?teamType=curr',
  {
    headers: {
      'X-API-Key': 'your_api_key_here'
    }
  }
);

const data = await response.json();
console.log(data.data); // Array of Lakers players`,
              python: `import requests

response = requests.get(
    'https://canny-kingfisher-472.convex.site/api/teams/Los Angeles Lakers/roster',
    params={'teamType': 'curr'},
    headers={'X-API-Key': 'your_api_key_here'}
)

data = response.json()
print(data['data'])  # Array of Lakers players`,
              curl: `curl -X GET \\
  'https://canny-kingfisher-472.convex.site/api/teams/Los%20Angeles%20Lakers/roster?teamType=curr' \\
  -H 'X-API-Key: your_api_key_here'`,
            }}
          />
        </div>

        <div className="space-y-4 rounded-lg border border-slate-200 bg-slate-50 p-6 dark:border-slate-800 dark:bg-slate-900">
          <h3 className="text-lg font-semibold">Team Types</h3>
          <ul className="space-y-2 text-slate-600 dark:text-slate-400">
            <li>
              <code className="mr-2 rounded bg-white px-1.5 py-0.5 text-sm dark:bg-slate-950">
                curr
              </code>
              - Current NBA teams (2024-25 season)
            </li>
            <li>
              <code className="mr-2 rounded bg-white px-1.5 py-0.5 text-sm dark:bg-slate-950">
                class
              </code>
              - Classic teams (historic rosters)
            </li>
            <li>
              <code className="mr-2 rounded bg-white px-1.5 py-0.5 text-sm dark:bg-slate-950">
                allt
              </code>
              - All-time teams (greatest players franchise history)
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}
