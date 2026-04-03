## Simple ASCII Chart Website

Website and docs for [`simple-ascii-chart`](https://www.npmjs.com/package/simple-ascii-chart).

- Live site: [https://simple-ascii-chart.vercel.app/](https://simple-ascii-chart.vercel.app/)
- Library repo: [https://github.com/gtktsc/ascii-chart](https://github.com/gtktsc/ascii-chart)
- CLI repo: [https://github.com/gtktsc/simple-ascii-chart-cli](https://github.com/gtktsc/simple-ascii-chart-cli)

### Local development

```bash
yarn install
yarn docs:generate
yarn dev
```

### Quality checks

```bash
yarn docs:check
yarn typecheck
yarn lint
yarn test
yarn build
```

### Documentation generation

`/documentation` is generated from the installed `simple-ascii-chart` package metadata:

- `README.md` settings reference table
- `dist/types/index.d.ts` `Settings` type

Commands:

```bash
yarn docs:generate   # regenerate app/generated/settings-docs.ts
yarn docs:check      # fail if generated docs are stale
```

### API

Endpoint: `https://simple-ascii-chart.vercel.app/api`

#### GET (query params)

- `input` (required): chart coordinates as JSON
- `settings` (optional): settings as JSON

Example:

```bash
curl -G https://simple-ascii-chart.vercel.app/api \
  --data-urlencode 'input=[[1,2],[2,3],[3,4]]' \
  --data-urlencode 'settings={"width":50,"height":10}'
```

#### POST (JSON body)

Body:

```json
{
  "input": [[1,2],[2,3],[3,4]],
  "settings": {"width": 50, "height": 10}
}
```

Example:

```bash
curl -X POST https://simple-ascii-chart.vercel.app/api \
  -H 'content-type: application/json' \
  -d '{"input":[[1,2],[2,3],[3,4]],"settings":{"width":50,"height":10}}'
```

Success response is plain text chart output.
Error response is JSON:

```json
{
  "error": {
    "code": "ERROR_CODE",
    "message": "Human-readable message",
    "details": "Optional details"
  }
}
```

### Release/update workflow

When `simple-ascii-chart` changes:

1. `yarn add simple-ascii-chart --upgrade`
2. `yarn docs:generate`
3. `yarn docs:check && yarn typecheck && yarn lint && yarn test && yarn build`
4. Commit and push

Existing helper script:

```bash
yarn deploy
```

### License

MIT
