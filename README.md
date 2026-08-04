# @pipeworx/catalogueoflife

[Catalogue of Life](https://www.catalogueoflife.org) MCP — the global taxonomic index of known species (~2.2 M accepted names). Wraps the ChecklistBank API that backs COL. Keyless.

Part of [Pipeworx](https://pipeworx.io) — an MCP gateway connecting AI agents to 1394+ live data sources.

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

Or connect to the full Pipeworx gateway for access to all 1394+ data sources:

```json
{
  "mcpServers": {
    "pipeworx": {
      "url": "https://gateway.pipeworx.io/mcp"
    }
  }
}
```

## Using with ask_pipeworx

Instead of calling tools directly, you can ask questions in plain English:

```
ask_pipeworx({ question: "your question about Catalogueoflife data" })
```

The gateway picks the right tool and fills the arguments automatically.

## More

- [Docs and guides](https://pipeworx.io/docs)
- [pipeworx.io](https://pipeworx.io)

## License

MIT
