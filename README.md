# @pipeworx/catalogueoflife

[Catalogue of Life](https://www.catalogueoflife.org) MCP — the global taxonomic index of known species (~2.2 M accepted names). Wraps the ChecklistBank API that backs COL. Keyless.

Part of [Pipeworx](https://pipeworx.io) — an MCP gateway connecting AI agents to 1476+ live data sources.

The default dataset is `3LR` (the latest COL release). Pass `dataset` to override (e.g. `3` for the editorial-state COL dataset, or any ChecklistBank dataset key).

## Tools

- `search(query, dataset?, limit?, offset?, rank?, status?)` — name-usage search
- `name_match(scientific_name, dataset?, authorship?)` — exact-name match (returns 0/1 hit + suggestions)
- `usage(id, dataset?)` — single name-usage by id
- `taxon(id, dataset?)` — taxon by id
- `classification(id, dataset?)` — taxonomic classification chain (kingdom → species)
- `vernacular(id, dataset?)` — vernacular (common) names for a taxon
- `synonyms(id, dataset?)` — synonyms of a taxon
- `children(id, dataset?, limit?)` — direct child taxa

## Data source

`https://api.checklistbank.org/dataset/{key}/...`

## Quick Start

Add to your MCP client (Claude Desktop, Cursor, Windsurf, etc.):

```json
{
  "mcpServers": {
    "catalogueoflife": {
      "url": "https://gateway.pipeworx.io/catalogueoflife/mcp"
    }
  }
}
```

### What this endpoint actually serves

`tools/list` at `https://gateway.pipeworx.io/catalogueoflife/mcp` returns the tools in the table
above **plus the shared Pipeworx meta-tools** — `ask_pipeworx`,
`discover_tools`, `search_within`, `remember`/`recall` and the rest of the
gateway-wide set. So the tool count you see is larger than this table: a
single-pack endpoint currently lists roughly 30 shared tools alongside the
pack's own. The connection's `initialize` response states its exact scope, and
is the authoritative answer for a given day.

This is deliberate, not multiplexing by accident. The meta-tools are what let a
scoped connection answer a question this pack does not cover — via
`ask_pipeworx`, which routes across the whole catalog — without you adding a
second MCP server. There is currently no way to mount a pack endpoint without
them; if the extra schemas cost you more context than the routing is worth,
connect to the full gateway once rather than to several pack endpoints.

Or connect to the full Pipeworx gateway to get every pack's tools listed
directly, instead of just this one's:

```json
{
  "mcpServers": {
    "pipeworx": {
      "url": "https://gateway.pipeworx.io/mcp"
    }
  }
}
```

Both URLs reach the same gateway and the same 1476+ data sources. The
only difference is which pack's tools are listed **directly**; `ask_pipeworx`
reaches all of them from either one.

## Using with ask_pipeworx

Instead of calling tools directly, you can ask questions in plain English —
this works on the pack endpoint above as well as on the full gateway:

```
ask_pipeworx({ question: "your question about Catalogueoflife data" })
```

The gateway picks the right tool and fills the arguments automatically.

## More

- [Docs and guides](https://pipeworx.io/docs)
- [pipeworx.io](https://pipeworx.io)

## License

MIT
