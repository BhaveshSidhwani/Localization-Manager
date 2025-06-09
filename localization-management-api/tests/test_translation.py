import pytest, random, string, time
import uuid

def _new_uuid() -> str:
    return str(uuid.uuid4())

@pytest.mark.asyncio
async def test_list_and_get(client):
    # list first page
    r = await client.get("/translations")
    assert r.status_code == 200
    data = r.json()
    assert isinstance(data, list) and len(data) > 0

    # get first record
    first_id = data[0]["id"]
    r = await client.get(f"/translations/{first_id}")
    assert r.status_code == 200
    assert r.json()["id"] == first_id

@pytest.mark.asyncio
async def test_bulk_update(client):
    # create two random ids (they may or may not exist)
    ids = [_new_uuid() for _ in range(2)]
    body = [
        {
            "id": ids[0],
            "key": "test.auto_1",
            "translations": {
                "en": {"value": "Hi", "updatedAt": "2025-06-07T00:00:00Z", "updatedBy": "pytest"}
            },
        },
        {
            "id": ids[1],
            "key": "test.auto_2",
            "translations": {
                "en": {"value": "Bye", "updatedAt": "2025-06-07T00:00:00Z", "updatedBy": "pytest"}
            },
        },
    ]

    r = await client.patch("/translations/bulk", json=body)
    assert r.status_code == 204

    # confirm one of them is now in DB
    r = await client.get(f"/translations/{ids[0]}")
    assert r.status_code == 200
    assert r.json()["translations"]["en"]["value"] == "Hi"

@pytest.mark.asyncio
async def test_query_performance(client):
    t0 = time.perf_counter()
    r = await client.get("/translations?page=1&per_page=1000")
    assert r.status_code == 200
    elapsed = time.perf_counter() - t0
    assert elapsed < 0.5, f"Query took {elapsed:.2f}s, expected <0.5s"
