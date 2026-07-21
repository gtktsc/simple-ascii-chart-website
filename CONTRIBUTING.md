# Contributing

Thanks for your interest in improving this project.

## Development setup

1. Fork the repository and clone your fork.
2. Install dependencies:

```bash
yarn install
```

3. Generate docs and start development:

```bash
yarn docs:generate
yarn dev
```

## Before opening a pull request

Please run:

```bash
yarn docs:check
yarn typecheck
yarn lint
yarn test
yarn build
```

## Pull request guidelines

- Keep changes focused and small
- Add or update tests when behavior changes
- Update documentation when needed
- Use clear commit messages

By contributing, you agree to follow the Code of Conduct.