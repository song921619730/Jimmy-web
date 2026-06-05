const JSON_HEADERS = {
  "content-type": "application/json; charset=utf-8",
  "cache-control": "no-store",
};

function normalizePath(value) {
  if (typeof value !== "string" || value.length === 0) {
    return "/";
  }

  try {
    const url = value.startsWith("http")
      ? new URL(value)
      : new URL(value, "https://jimmy-web.pages.dev");
    return `${url.pathname}${url.search}`.slice(0, 320);
  } catch {
    return "/";
  }
}

function getReferrerHost(value) {
  if (typeof value !== "string" || value.length === 0) {
    return "Direct";
  }

  try {
    return new URL(value).hostname || "Direct";
  } catch {
    return "Direct";
  }
}

function getDevice(userAgent, width) {
  const ua = userAgent.toLowerCase();
  if (/ipad|tablet|playbook|silk/.test(ua)) {
    return "Tablet";
  }
  if (/mobile|iphone|android|phone|micromessenger/.test(ua) || Number(width) < 760) {
    return "Mobile";
  }
  return "Desktop";
}

function getBrowser(userAgent) {
  if (/MicroMessenger/i.test(userAgent)) return "WeChat";
  if (/Edg\//i.test(userAgent)) return "Edge";
  if (/OPR\//i.test(userAgent)) return "Opera";
  if (/SamsungBrowser/i.test(userAgent)) return "Samsung";
  if (/Firefox\//i.test(userAgent)) return "Firefox";
  if (/Chrome\//i.test(userAgent)) return "Chrome";
  if (/Safari\//i.test(userAgent)) return "Safari";
  return "Other";
}

function increment(bucket, group, key, amount = 1) {
  bucket[group] ||= {};
  bucket[group][key] = (bucket[group][key] || 0) + amount;
}

export async function onRequestPost(context) {
  const { request, env, waitUntil } = context;

  if (!env.ANALYTICS_KV) {
    return new Response(JSON.stringify({ ok: false }), {
      status: 503,
      headers: JSON_HEADERS,
    });
  }

  let payload = {};
  try {
    payload = await request.json();
  } catch {
    payload = {};
  }

  const now = new Date();
  const date = now.toISOString().slice(0, 10);
  const path = normalizePath(payload.url);
  const userAgent = request.headers.get("user-agent") || "";
  const host = request.headers.get("host") || "jimmy-web.pages.dev";
  const country = request.cf?.country || "Unknown";
  const device = getDevice(userAgent, payload.width);
  const browser = getBrowser(userAgent);
  const referrerHost = getReferrerHost(payload.referrer);
  const key = `analytics:daily:${date}`;

  const write = async () => {
    const existing = (await env.ANALYTICS_KV.get(key, "json")) || {
      date,
      total: 0,
      urls: {},
      countries: {},
      devices: {},
      browsers: {},
      referrers: {},
      hosts: {},
    };

    existing.total = (existing.total || 0) + 1;
    existing.updatedAt = now.toISOString();
    increment(existing, "urls", path);
    increment(existing, "countries", country);
    increment(existing, "devices", device);
    increment(existing, "browsers", browser);
    increment(existing, "referrers", referrerHost);
    increment(existing, "hosts", host);

    await env.ANALYTICS_KV.put(key, JSON.stringify(existing));
  };

  waitUntil(write());

  return new Response(JSON.stringify({ ok: true }), {
    headers: JSON_HEADERS,
  });
}

export async function onRequestOptions() {
  return new Response(null, {
    status: 204,
    headers: JSON_HEADERS,
  });
}
