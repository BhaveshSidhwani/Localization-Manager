import { renderHook } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { rest } from "msw";
import { setupServer } from "msw/node";
import { useTranslationKeys } from "../hooks/useTranslationKeys";

const server = setupServer(
  rest.get("http://localhost:8000/translations", (_, res, ctx) =>
    res(
      ctx.json([
        {
          id: "1",
          key: "button.save",
          translations: { en: { value: "Save" } },
        },
      ])
    )
  )
);

beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

test("fetches translation keys", async () => {
  const qc = new QueryClient();
  const { result } = renderHook(() => useTranslationKeys("", 1), {
    wrapper: ({ children }) => (
      <QueryClientProvider client={qc}>{children}</QueryClientProvider>
    ),
  });

  await new Promise((r) => setTimeout(r, 0));

  expect(result.current.data?.[0].key).toBe("button.save");
});
