# Task Completion Checklist

- Run `npm run build` before claiming frontend/code changes are complete. It is currently the only configured verification command.
- If a new script is added later, update this memory and prefer the repo's own lint/test/typecheck scripts.
- For UI changes, start `npm run dev` and verify the affected route in the browser when practical.
- Check `git status --short` before and after changes. Do not revert unrelated user changes.
- Current known status before any task-specific edits: `package-lock.json` was already modified; `.serena/` and `.spec-workflow/` were untracked.