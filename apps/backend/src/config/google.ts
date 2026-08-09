import { google } from "googleapis";

import { env } from "./env.js";

if (
  !env.GOOGLE_CLIENT_ID ||
  !env.GOOGLE_CLIENT_SECRET ||
  !env.GOOGLE_CALLBACK_URL
) {
  throw new Error(
    "Google OAuth environment variables are not configured",
  );
}

export const googleOAuth2Client = new google.auth.OAuth2(
  env.GOOGLE_CLIENT_ID,
  env.GOOGLE_CLIENT_SECRET,
  env.GOOGLE_CALLBACK_URL,
);