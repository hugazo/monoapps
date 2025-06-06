# This is a monorepo

## Project Structure

- `.vscode/`: Visual Studio Code Configurations
- `apps/`: App directory, each one is meant to be deployed to a target
- `supabase/`: Local supabase config, used to deploy the backend environments
- `packages/`: Packages directory, these are meant to export functionality to be used in other packages or apps

## Project Installation

```bash
pnpm install
```

## Local Development

### Local App Development

```bash
# ./apps/app
pnpm run dev
```

### Local App Build

```bash
# ./apps/app
pnpm run build
```

### Local package Development

```bash
# ./packages/package
pnpm run dev
```
