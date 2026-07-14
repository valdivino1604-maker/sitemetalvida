export function json(data, init = {}) {
  return new Response(JSON.stringify(data), {
    ...init,
    headers: {
      "content-type": "application/json; charset=utf-8",
      "cache-control": "no-store",
      ...(init.headers || {})
    }
  });
}

export function error(message, status = 400) {
  return json({ ok: false, error: message }, { status });
}

export function requireDb(env) {
  if (!env.DB) {
    throw new Error("D1 não está ligado. Configure o binding DB no Cloudflare Pages.");
  }
  return env.DB;
}

export function requireAdmin(request, env) {
  const expected = env.ADMIN_TOKEN;
  if (!expected) {
    return { ok: false, response: error("ADMIN_TOKEN não configurado no Cloudflare.", 500) };
  }
  const header = request.headers.get("authorization") || "";
  const token = header.replace(/^Bearer\s+/i, "").trim() || request.headers.get("x-admin-token") || "";
  if (token !== expected) {
    return { ok: false, response: error("Acesso administrativo não autorizado.", 401) };
  }
  return { ok: true };
}

export async function readJson(request) {
  try {
    return await request.json();
  } catch {
    return {};
  }
}

export function normalizeCode(code) {
  return String(code || "").trim().toUpperCase();
}

export function parseLines(value, mapper) {
  return String(value || "")
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean)
    .map(mapper);
}
