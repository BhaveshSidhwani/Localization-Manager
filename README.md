# Localization Management App

Full-stack assignment that lets you manage translation keys, values, projects, and languages.

| Layer     | Stack                                                         |
| --------- | ------------------------------------------------------------- |
| Front-end | Next.js 14 · TypeScript · Tailwind · React Query v5 · Zustand |
| Back-end  | FastAPI · Python 3.12 · Supabase (PostgreSQL)                 |
| Tests     | Jest · Testing Library · MSW (front) · Pytest + httpx (API)   |

---

## 1 · Local setup

```bash
# clone & install
git clone <repo>
cd <repo>
pnpm install          # front-end deps
poetry install        # back-end deps
```

Create two files in the repo root:

```bash
# apps/web/.env.local
NEXT_PUBLIC_API_URL="http://localhost:8000"

# apps/api/.env
SUPABASE_URL="https://<project>.supabase.co"
SUPABASE_SERVICE_ROLE="<service-role-key>"
```

---

## 2 · Running locally

| Command                                                     | Purpose                                                             |
| ----------------------------------------------------------- | ------------------------------------------------------------------- |
| `pnpm dev`                                                  | Next.js dev server → [http://localhost:3000](http://localhost:3000) |
| `uvicorn src.localization_management_api.main:app --reload` | FastAPI → [http://localhost:8000](http://localhost:8000)            |

---

## 3 · Project structure

```
apps/
  web/                   # Next.js app (App Router)
  api/                   # FastAPI service
components/              # Reusable React components
hooks/                   # React Query + helper hooks
stores/                  # Zustand slices
tests/                   # Jest + MSW tests
```

---

## 4 · Key features

- **TranslationKeyManager** – list, search, paginate, inline edit.
- **Projects & Languages** – sidebar selectors, “Add language” modal.
- **Optimistic updates** – React Query + Supabase bulk upsert.
- **Backend** – CRUD, project filter, locale endpoints, bulk updates.
- **CORS** – patched for GET / POST / PATCH from the front-end dev host.
