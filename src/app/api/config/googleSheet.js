import { google } from "googleapis";
 
const auth = new google.auth.GoogleAuth({
  credentials: {
    client_email: process.env.GOOGLE_CLIENT_EMAIL,
    private_key: process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, "\n"),
  },
  scopes: [
    "https://www.googleapis.com/auth/spreadsheets",
    "https://www.googleapis.com/auth/drive",
  ],
});
 
const sheets = google.sheets({ version: "v4", auth });
const drive = google.drive({ version: "v3", auth });
const spreadsheetId = process.env.SPREADSHEET_ID;
 
export { sheets, spreadsheetId, drive };