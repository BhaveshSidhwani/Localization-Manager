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

---

## 5 · Development Steps & Thought Process

1. **Database layer**

   - Spun up free Supabase project.
   - Created `translation_keys` table, seeded sample rows.
   - Added `projects` and `locales` tables later.

2. **Project bootstrap**

   - Cloned starter repo, installed Node + Python deps (`pnpm`, `poetry`).
   - Added env files for Supabase URL / keys and API URL.

3. **Backend setup (FastAPI)**

   - Wired Supabase client via env vars.
   - Implemented `GET /translations` with search, pagination, project filter.
   - Added CORS middleware for dev and prod origins.
   - Created CRUD helpers: `GET /projects`, `GET|POST /locales`, `PATCH /translations/bulk`, `POST /translations`.
   - Added bulk‐upsert logic and optional `key` field to avoid NOT-NULL errors.

4. **Automated API tests**

   - Wrote pytest + httpx tests covering list, get, bulk update, performance.

5. **Front-end scaffolding (Next 14)**

   - Added global React Query + Zustand providers in `app/layout`.
   - Created typed Zustand slice (`search`, `page`, `selectedLang`, `projectId`).

6. **Data hooks**

   - `useTranslationKeys` (list+total), `useUpdateTranslation`, `useCreateTranslation`, `useProjects`, `useLocales`, `useCreateLocale`.

7. **Core UI components**

   - **Toolbar** (debounced search + “New Key” button).
   - **ProjectSelector** with “All Projects”.
   - **LanguageSelector** + “Add language” modal.
   - **TranslationKeyManager** table + **Pagination**.
   - **InlineCell** with optimistic upsert & value merge to keep other languages.
   - **NewKeyModal** to add keys scoped to current project.

8. **Missing-value handling**

   - Inputs always render; placeholder “— missing —”; merged JSON sent to API.

9. **UX tweaks**

   - Toast feedback, centered pagination below table, reset page on filter change.

10. **Bug fixes & polishing**

    - Fixed CORS pre-flight, Pydantic validation, Supabase NOT-NULL issue.
    - Ensured language switch doesn’t overwrite other translations.
    - Added ability to edit newly added languages immediately.
