# Suggested Commands

- Install dependencies: `npm i`
- Run development server: `npm run dev`
- Production build: `npm run build`
- Check working tree: `git status --short`
- List files quickly: `rg --files`
- Search code/content: `rg "pattern" "path"`
- Inspect root files on Darwin/macOS: `ls -la`

Notes:
- `package.json` only defines `dev` and `build`; no test, lint, format, or typecheck scripts are configured.
- Project includes `package-lock.json` and `pnpm-workspace.yaml`, but README documents npm usage and `node_modules` is present. Prefer npm unless the user asks otherwise.
- Build output goes to `dist/`, which is ignored by `.gitignore`.