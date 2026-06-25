import {
  assertMethod,
  forwardWebhook,
  normalizePayload,
  requireWebhookAuth,
} from "../_lib/webhook.js";

export default async function handler(request, response) {
  if (!assertMethod(request, response, "POST")) {
    return;
  }

  if (!requireWebhookAuth(request, response)) {
    return;
  }

  await forwardWebhook({
    response,
    envVar: "DISCORD_WEBHOOK_ANTICHEAT",
    channel: "anticheat",
    payload: normalizePayload(request.body),
  });
}
