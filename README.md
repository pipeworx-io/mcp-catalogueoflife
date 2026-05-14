# mcp-catalogueoflife

Catalogue of Life — global taxonomic index of known species (~2.2M accepted names)

Part of [Pipeworx](https://pipeworx.io) — an MCP gateway connecting AI agents to 250+ live data sources.

## Tools

| Tool | Description |
|------|-------------|
| `search` | Name-usage search. |
| `name_match` | Exact scientific-name match (0 or 1 hit + alternatives). |
| `usage` | Single name-usage by id. |
| `taxon` | Taxon by id. |
| `classification` | Taxonomic classification chain (kingdom → species) for a taxon id. |
| `vernacular` | Vernacular (common) names for a taxon. |
| `synonyms` | Synonyms of a taxon. |
| `children` | Direct child taxa. |

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

Or connect to the full Pipeworx gateway for access to all 250+ data sources:

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

- [All tools and guides](https://github.com/pipeworx-io/examples)
- [pipeworx.io](https://pipeworx.io)

## License

MIT
