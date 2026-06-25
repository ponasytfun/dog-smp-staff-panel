import { sendJson } from "../_lib/webhook.js";

const checks = [
  {
    key: "mc-punishments",
    label: "MC Punishments Webhook",
    envVar: "DISCORD_WEBHOOK_MC_PUNISHMENTS",
  },
  {
    key: "anticheat",
    label: "Anticheat Webhook",
    envVar: "DISCORD_WEBHOOK_ANTICHEAT",
  },
  {
    key: "client-secret",
    label: "Discord Client Secret",
    envVar: "DISCORD_CLIENT_SECRET",
  },
  {
    key: "webhook-api-key",
    label: "Webhook Proxy API Key",
    envVar: "PANEL_WEBHOOK_API_KEY",
  },
];

export default function handler(request, response) {
  if (request.method !== "GET") {
    response.setHeader("allow", "GET");
    sendJson(response, 405, { ok: false, error: "method_not_allowed" });
    return;
  }

  sendJson(response, 200, {
    ok: true,
    integrations: checks.map((check) => ({
      key: check.key,
      label: check.label,
      configured: Boolean(process.env[check.envVar]),
    })),
  });
}
