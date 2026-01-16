import "server-only";
import { google } from "googleapis";
// import { Resource } from "sst";

export async function getGoogleSheets() {
  // const GOOGLE_PRIVATE_KEY_B64 = Resource.GooglePrivateKeyB64.value;
  // const GOOGLE_PRIVATE_KEY_B64 = Resource.GooglePrivateKey.value;
  const GOOGLE_PRIVATE_KEY = process.env.GOOGLE_PRIVATE_KEY;

  /* if (!process.env.GOOGLE_CLIENT_EMAIL || !GOOGLE_PRIVATE_KEY_B64 || !process.env.SPREADSHEET_ID) {
    throw new Error("Missing Google credentials");
  } */
  if (!process.env.GOOGLE_CLIENT_EMAIL || !GOOGLE_PRIVATE_KEY || !process.env.SPREADSHEET_ID) {
    throw new Error("Missing Google credentials");
  }

  /* const decodedKey = Buffer
    .from(GOOGLE_PRIVATE_KEY_B64, "base64")
    .toString("utf8"); */

  const auth = new google.auth.GoogleAuth({
    credentials: {
      client_email: process.env.GOOGLE_CLIENT_EMAIL,
      // private_key: decodedKey,
      private_key: GOOGLE_PRIVATE_KEY.replace(/\\n/g, '\n'),
    },
    scopes: ["https://www.googleapis.com/auth/spreadsheets"],
  });

  const sheets = google.sheets({ version: "v4", auth });
  return { sheets, spreadsheetId: process.env.SPREADSHEET_ID };
}
