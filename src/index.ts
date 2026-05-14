interface McpToolDefinition {
  name: string;
  description: string;
  inputSchema: {
    type: 'object';
    properties: Record<string, unknown>;
    required?: string[];
  };
}

interface McpToolExport {
  tools: McpToolDefinition[];
  callTool: (name: string, args: Record<string, unknown>) => Promise<unknown>;
  meter?: { credits: number };
  cost?: Record<string, unknown>;
  provider?: string;
}

/**
 * Catalogue of Life MCP — global taxonomic index.
 *
 * Auth: none. API: https://api.checklistbank.org/openapi/
 * Default dataset key 3LR = "COL latest release".
 */


const BASE = 'https://api.checklistbank.org';
const DEFAULT_DATASET = '3LR';
const UA = 'pipeworx-mcp-catalogueoflife/1.0 (+https://pipeworx.io)';

const tools: McpToolExport['tools'] = [
  {
    name: 'search',
    description: 'Name-usage search.',
    inputSchema: {
      type: 'object',
      properties: {
        query: { type: 'string', description: 'Free-text search (e.g. "Panthera leo").' },
        dataset: { type: 'string', description: `ChecklistBank dataset key (default "${DEFAULT_DATASET}" = COL latest release).` },
        limit: { type: 'number', description: '1-1000 (default 25).' },
        offset: { type: 'number' },
        rank: { type: 'string', description: 'e.g. "species", "genus", "family"' },
        status: { type: 'string', description: 'accepted | synonym | bare_name | missapplied | …' },
      },
      required: ['query'],
    },
  },
  {
    name: 'name_match',
    description: 'Exact scientific-name match (0 or 1 hit + alternatives).',
    inputSchema: {
      type: 'object',
      properties: {
        scientific_name: { type: 'string' },
        authorship: { type: 'string', description: 'Optional authorship to disambiguate homonyms.' },
        dataset: { type: 'string' },
      },
      required: ['scientific_name'],
    },
  },
  {
    name: 'usage',
    description: 'Single name-usage by id.',
    inputSchema: {
      type: 'object',
      properties: { id: { type: 'string' }, dataset: { type: 'string' } },
      required: ['id'],
    },
  },
  {
    name: 'taxon',
    description: 'Taxon by id.',
    inputSchema: {
      type: 'object',
      properties: { id: { type: 'string' }, dataset: { type: 'string' } },
      required: ['id'],
    },
  },
  {
    name: 'classification',
    description: 'Taxonomic classification chain (kingdom → species) for a taxon id.',
    inputSchema: {
      type: 'object',
      properties: { id: { type: 'string' }, dataset: { type: 'string' } },
      required: ['id'],
    },
  },
  {
    name: 'vernacular',
    description: 'Vernacular (common) names for a taxon.',
    inputSchema: {
      type: 'object',
      properties: { id: { type: 'string' }, dataset: { type: 'string' } },
      required: ['id'],
    },
  },
  {
    name: 'synonyms',
    description: 'Synonyms of a taxon.',
    inputSchema: {
      type: 'object',
      properties: { id: { type: 'string' }, dataset: { type: 'string' } },
      required: ['id'],
    },
  },
  {
    name: 'children',
    description: 'Direct child taxa.',
    inputSchema: {
      type: 'object',
      properties: {
        id: { type: 'string' },
        dataset: { type: 'string' },
        limit: { type: 'number', description: '1-1000 (default 100).' },
      },
      required: ['id'],
    },
  },
];

async function callTool(name: string, args: Record<string, unknown>): Promise<unknown> {
  const ds = datasetKey(args);
  switch (name) {
    case 'search': {
      const params = new URLSearchParams({
        q: reqStr(args, 'query', '"Panthera leo"'),
        limit: String(Math.min(1000, Math.max(1, (args.limit as number) ?? 25))),
        offset: String(Math.max(0, (args.offset as number) ?? 0)),
      });
      if (args.rank) params.set('rank', String(args.rank));
      if (args.status) params.set('status', String(args.status));
      return colGet(`/dataset/${ds}/nameusage/search?${params}`);
    }
    case 'name_match': {
      const params = new URLSearchParams({ q: reqStr(args, 'scientific_name', '"Panthera leo"') });
      if (args.authorship) params.set('authorship', String(args.authorship));
      return colGet(`/dataset/${ds}/match/nameusage?${params}`);
    }
    case 'usage':
      return colGet(`/dataset/${ds}/nameusage/${encodeURIComponent(reqStr(args, 'id', '"<id>"'))}`);
    case 'taxon':
      return colGet(`/dataset/${ds}/taxon/${encodeURIComponent(reqStr(args, 'id', '"<id>"'))}`);
    case 'classification':
      return colGet(`/dataset/${ds}/taxon/${encodeURIComponent(reqStr(args, 'id', '"<id>"'))}/classification`);
    case 'vernacular':
      return colGet(`/dataset/${ds}/taxon/${encodeURIComponent(reqStr(args, 'id', '"<id>"'))}/vernacular`);
    case 'synonyms':
      return colGet(`/dataset/${ds}/taxon/${encodeURIComponent(reqStr(args, 'id', '"<id>"'))}/synonyms`);
    case 'children': {
      const limit = Math.min(1000, Math.max(1, (args.limit as number) ?? 100));
      return colGet(
        `/dataset/${ds}/taxon/${encodeURIComponent(reqStr(args, 'id', '"<id>"'))}/children?limit=${limit}`,
      );
    }
    default:
      throw new Error(`Unknown tool: ${name}`);
  }
}

function datasetKey(args: Record<string, unknown>): string {
  const v = args.dataset;
  if (typeof v === 'string' && v.trim()) return v.trim();
  return DEFAULT_DATASET;
}

async function colGet(path: string): Promise<unknown> {
  const res = await fetch(`${BASE}${path}`, { headers: { Accept: 'application/json', 'User-Agent': UA } });
  if (res.status === 404) throw new Error('Catalogue of Life: not found');
  if (!res.ok) throw new Error(`Catalogue of Life: ${res.status} ${await res.text().then((t) => t.slice(0, 200))}`);
  return res.json();
}

function reqStr(args: Record<string, unknown>, key: string, example: string): string {
  const v = args[key];
  if (typeof v !== 'string' || !v.trim()) {
    throw new Error(`Required argument "${key}" is missing. Pass a string like ${example}.`);
  }
  return v;
}

export default { tools, callTool, meter: { credits: 1 } } satisfies McpToolExport;
