from dotenv import load_dotenv
load_dotenv()

from fastapi import FastAPI, HTTPException
from fastapi.responses import JSONResponse
from fastapi.middleware.cors import CORSMiddleware
from supabase import create_client, Client
import os
from typing import List, Any, Dict
from pydantic import BaseModel, Field

# Pydantic models

class LangEntry(BaseModel):
    value: str
    updatedAt: str
    updatedBy: str

TranslationsMap = Dict[str, LangEntry]

class TranslationKeyInDB(BaseModel):
    id: str
    key: str
    category: str | None = None
    description: str | None = None
    translations: Dict[str, Dict[str, Any]]

class TranslationKeyCreate(BaseModel):
    key: str
    category: str | None = None
    description: str | None = None
    project_id: str | None = None
    translations: dict = Field(default_factory=dict)

class BulkUpdateItem(BaseModel):
    id: str
    translations: Dict[str, Dict[str, Any]]
    # key is optional (your UI doesn’t send it but Supabase upsert needs it if
    # you ever decide to insert a brand-new row)
    key: str | None = None

    class Config:
        extra = "allow"

class LocaleCreate(BaseModel):
    code: str

SUPABASE_URL: str | None = os.getenv("SUPABASE_URL")
SUPABASE_KEY: str | None = os.getenv("SUPABASE_SERVICE_ROLE")

if not SUPABASE_URL:
    raise RuntimeError("SUPABASE_URL env vars missing")
if not SUPABASE_KEY:
    raise RuntimeError("SUPABASE_SERVICE_ROLE env vars missing")

supabase: Client = create_client(SUPABASE_URL, SUPABASE_KEY)

app = FastAPI()

origins = ["http://localhost:3000"]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=[
        "GET",
        "POST",
        "PATCH",
        "PUT",
        "DELETE",
        "OPTIONS",
    ],
    allow_headers=["*"],
)

@app.get("/localizations/{project_id}/{locale}")
async def get_localizations(project_id: str, locale: str):
    return {"project_id": project_id, "locale": locale, "localizations": {"greeting": "Hello", "farewell": "Goodbye"}}


@app.get("/translations", response_model=List[Any])
async def list_translations(q: str | None = None, page: int = 1, per_page: int = 20, project_id: str | None = None):
    """
    Return a paginated list of translation keys.
    Optional full-text search with ?q=something
    """
    query = supabase.table("translation_keys").select("*")
    if q:
        query = query.ilike("key", f"%{q}%")
    
    if project_id:
        query = query.eq("project_id", project_id)

    from_ = (page - 1) * per_page
    to_   = from_ + per_page - 1
    result = query.range(from_, to_).execute()

    # Total count for the UI (fallback to page length if Supabase didn’t return .count)
    total = result.count or len(result.data)

    response = JSONResponse(result.data)
    response.headers["X-Total-Count"] = str(total)
    return response


@app.post("/translations", status_code=201)
async def create_translation(item: TranslationKeyCreate):
    row = supabase.table("translation_keys").insert(item.dict()).execute().data[0]
    return row


@app.get("/translations/{id}")
async def get_translation(id: str):
    result = (
        supabase.table("translation_keys")
        .select("*")
        .eq("id", id)
        .single()
        .execute()
    )
    if result.data is None:
        raise HTTPException(status_code=404, detail="Translation not found")
    return result.data


@app.patch("/translations/bulk", status_code=204)
async def bulk_update(items: List[BulkUpdateItem]):
    if not items:
        return

    payload = [
        {"id": item.id, "key": item.key, "translations": item.translations}
        for item in items
    ]

    supabase.table("translation_keys").upsert(
        payload,
        on_conflict="id",
    ).execute()


@app.get("/projects", response_model=List[dict])
async def list_projects():
    rows = supabase.table("projects").select("id,name").execute().data
    return rows


@app.post("/locales", status_code=201)
async def add_locale(payload: LocaleCreate):
    supabase.table("locales").insert({"code": payload.code}).execute()


@app.get("/locales", response_model=List[str])
async def list_locales():
    rows = supabase.table("locales").select("code").execute().data
    return [r["code"] for r in rows]