const MAX_FIELD_LENGTH = 900;
const MAX_TITLE_LENGTH = 120;

const channelColor = {
  punishments: 0xff5f73,
  anticheat: 0xffb84d,
};

export function sendJson(response, status, body) {
  response.status(status).setHeader("content-type", "application/json");
  response.end(JSON.stringify(body));
}

export function assertMethod(request, response, method) {
  if (request.method === "OPTIONS") {
    response.status(204).end();
    return false;
  }

  if (request.method !== method) {
    response.setHeader("allow", method);
    sendJson(response, 405, { ok: false, error: "method_not_allowed" });
    return false;
  }

  return true;
}

export function requireWebhookAuth(request, response) {
  const expectedKey = process.env.PANEL_WEBHOOK_API_KEY;

  if (!expectedKey) {
    sendJson(response, 503, {
      ok: false,
      error: "webhook_auth_not_configured",
    });
    return false;
  }

  const authorization = request.headers.authorization ?? "";
  const providedKey = authorization.startsWith("Bearer ")
    ? authorization.slice("Bearer ".length).trim()
    : "";

  if (providedKey !== expectedKey) {
    sendJson(response, 401, { ok: false, error: "unauthorized" });
    return false;
  }

  return true;
}

export function normalizePayload(body) {
  const source = typeof body === "object" && body !== null ? body : {};

  return {
    eventType: clean(source.eventType ?? source.type ?? "staff-event", MAX_TITLE_LENGTH),
    player: clean(source.player ?? source.minecraftUsername ?? "Unknown", MAX_FIELD_LENGTH),
    staff: clean(source.staff ?? source.staffUsername ?? source.issuedBy ?? "System", MAX_FIELD_LENGTH),
    reason: clean(source.reason ?? source.message ?? "No reason supplied", MAX_FIELD_LENGTH),
    severity: clean(source.severity ?? source.priority ?? "medium", MAX_FIELD_LENGTH),
    server: clean(source.server ?? "Dog SMP", MAX_FIELD_LENGTH),
    evidenceUrl: cleanUrl(source.evidenceUrl ?? source.evidence),
  };
}

export async function forwardWebhook({ response, envVar, channel, payload }) {
  const webhookUrl = process.env[envVar];

  if (!webhookUrl) {
    sendJson(response, 503, {
      ok: false,
      error: "webhook_not_configured",
      envVar,
    });
    return;
  }

  const discordResponse = await fetch(webhookUrl, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify(toDiscordMessage(channel, payload)),
  });

  if (!discordResponse.ok) {
    sendJson(response, 502, {
      ok: false,
      error: "discord_webhook_failed",
      status: discordResponse.status,
    });
    return;
  }

  sendJson(response, 202, { ok: true, channel });
}

function toDiscordMessage(channel, payload) {
  const title = channel === "anticheat" ? "Anticheat Alert" : "Minecraft Punishment";

  return {
    username: "Dog SMP Staff Panel",
    allowed_mentions: { parse: [] },
    embeds: [
      {
        title: `${title}: ${payload.eventType}`,
        color: channelColor[channel] ?? 0x64ff72,
        timestamp: new Date().toISOString(),
        fields: [
          { name: "Player", value: payload.player, inline: true },
          { name: "Staff/System", value: payload.staff, inline: true },
          { name: "Severity", value: payload.severity, inline: true },
          { name: "Server", value: payload.server, inline: true },
          { name: "Reason", value: payload.reason, inline: false },
          ...(payload.evidenceUrl
            ? [{ name: "Evidence", value: payload.evidenceUrl, inline: false }]
            : []),
        ],
        footer: { text: "Dog SMP secure webhook proxy" },
      },
    ],
  };
}

function clean(value, maxLength) {
  return String(value)
    .replace(/@everyone/g, "@\u200beveryone")
    .replace(/@here/g, "@\u200bhere")
    .replace(/\s+/g, " ")
    .trim()
    .slice(0, maxLength);
}

function cleanUrl(value) {
  if (!value) {
    return "";
  }

  const text = clean(value, MAX_FIELD_LENGTH);
  return /^https?:\/\//i.test(text) ? text : "";
}
