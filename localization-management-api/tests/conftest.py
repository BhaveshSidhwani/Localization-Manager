import os
import pytest
import pytest_asyncio
from httpx import AsyncClient, ASGITransport
from localization_management_api.main import app

@pytest.fixture(scope="session", autouse=True)
def ensure_env():
    assert os.getenv("SUPABASE_URL") and os.getenv("SUPABASE_SERVICE_ROLE"), (
        "Environment variables not loaded. "
        "Run tests the same way you run the server, or set UP vars in shell."
    )

@pytest_asyncio.fixture
async def client():
    transport = ASGITransport(app=app)
    async with AsyncClient(transport=transport, base_url="http://testserver") as c:
        yield c
