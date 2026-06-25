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
    envVar: "DISCORD_WEBHOOK_MC_PUNISHMENTS",
    channel: "punishments",
    payload: normalizePayload(request.body),
  });
}
