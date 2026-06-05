const HTML_HEADERS = {
  "content-type": "text/html; charset=utf-8",
  "cache-control": "no-store",
};

function escapeHtml(value) {
  return String(value ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}

function addGroup(target, source) {
  for (const [key, value] of Object.entries(source || {})) {
    target[key] = (target[key] || 0) + Number(value || 0);
  }
}

function sortedRows(group, limit = 12) {
  return Object.entries(group || {})
    .sort((a, b) => b[1] - a[1])
    .slice(0, limit);
}

function renderRows(rows) {
  if (rows.length === 0) {
    return '<tr><td colspan="2">No data yet</td></tr>';
  }

  return rows
    .map(
      ([label, count]) =>
        `<tr><td>${escapeHtml(label)}</td><td>${Number(count || 0).toLocaleString("en-US")}</td></tr>`,
    )
    .join("");
}

function lastDays(count) {
  const days = [];
  const now = new Date();
  for (let index = 0; index < count; index += 1) {
    const date = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate() - index));
    days.push(date.toISOString().slice(0, 10));
  }
  return days;
}

function renderDashboard(stats) {
  const targetUrl = "/?v=cdc4a8e";
  const targetCount = stats.urls[targetUrl] || 0;
  const generatedAt = new Date().toLocaleString("en-US", { hour12: false });

  return `<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Jimmy Web Analytics</title>
    <style>
      :root {
        color-scheme: dark;
        background: #050607;
        color: #f4f7fb;
        font-family: Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
      }
      body {
        margin: 0;
        min-height: 100vh;
        background: #050607;
      }
      main {
        width: min(1120px, calc(100% - 32px));
        margin: 0 auto;
        padding: 48px 0;
      }
      h1, h2, p {
        margin: 0;
      }
      h1 {
        font-size: clamp(32px, 6vw, 64px);
        letter-spacing: 0;
      }
      .muted {
        color: #a8b0ba;
      }
      .summary {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
        gap: 12px;
        margin: 28px 0;
      }
      .metric, section {
        border: 1px solid rgba(255,255,255,0.12);
        background: #101316;
        border-radius: 8px;
      }
      .metric {
        padding: 18px;
      }
      .metric strong {
        display: block;
        margin-top: 8px;
        font-size: 34px;
      }
      .grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
        gap: 14px;
      }
      section {
        overflow: hidden;
      }
      h2 {
        padding: 16px 18px 10px;
        font-size: 17px;
      }
      table {
        width: 100%;
        border-collapse: collapse;
      }
      td {
        padding: 11px 18px;
        border-top: 1px solid rgba(255,255,255,0.08);
        color: #d8dde3;
      }
      td:last-child {
        width: 92px;
        text-align: right;
        color: #ffffff;
        font-variant-numeric: tabular-nums;
      }
      .target {
        margin-top: 8px;
        overflow-wrap: anywhere;
      }
    </style>
  </head>
  <body>
    <main>
      <p class="muted">Last 30 days · generated ${escapeHtml(generatedAt)}</p>
      <h1>Jimmy Web Analytics</h1>
      <p class="muted target">Tracking exact URL: ${escapeHtml(targetUrl)}</p>

      <div class="summary">
        <div class="metric"><span class="muted">Total views</span><strong>${stats.total.toLocaleString("en-US")}</strong></div>
        <div class="metric"><span class="muted">Target URL views</span><strong>${targetCount.toLocaleString("en-US")}</strong></div>
        <div class="metric"><span class="muted">Tracked days</span><strong>${stats.daysWithData.toLocaleString("en-US")}</strong></div>
      </div>

      <div class="grid">
        <section><h2>URLs</h2><table>${renderRows(sortedRows(stats.urls, 16))}</table></section>
        <section><h2>Countries</h2><table>${renderRows(sortedRows(stats.countries))}</table></section>
        <section><h2>Devices</h2><table>${renderRows(sortedRows(stats.devices))}</table></section>
        <section><h2>Browsers</h2><table>${renderRows(sortedRows(stats.browsers))}</table></section>
        <section><h2>Referrers</h2><table>${renderRows(sortedRows(stats.referrers))}</table></section>
        <section><h2>Daily Views</h2><table>${renderRows(stats.dailyRows)}</table></section>
      </div>
    </main>
  </body>
</html>`;
}

export async function onRequestGet(context) {
  const { request, env } = context;
  const url = new URL(request.url);
  const secret = env.ANALYTICS_SECRET;
  const key = url.searchParams.get("key");

  if (!secret || key !== secret) {
    return new Response("Not found", {
      status: 404,
      headers: HTML_HEADERS,
    });
  }

  const stats = {
    total: 0,
    daysWithData: 0,
    urls: {},
    countries: {},
    devices: {},
    browsers: {},
    referrers: {},
    dailyRows: [],
  };

  const days = lastDays(30);
  const records = await Promise.all(
    days.map(async (date) => [date, await env.ANALYTICS_KV.get(`analytics:daily:${date}`, "json")]),
  );

  for (const [date, record] of records) {
    const total = Number(record?.total || 0);
    if (total > 0) {
      stats.daysWithData += 1;
    }
    stats.total += total;
    stats.dailyRows.push([date, total]);
    addGroup(stats.urls, record?.urls);
    addGroup(stats.countries, record?.countries);
    addGroup(stats.devices, record?.devices);
    addGroup(stats.browsers, record?.browsers);
    addGroup(stats.referrers, record?.referrers);
  }

  return new Response(renderDashboard(stats), {
    headers: HTML_HEADERS,
  });
}
