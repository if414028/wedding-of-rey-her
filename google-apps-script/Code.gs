const SPREADSHEET_ID = "1QAOKvy8XGnN8YlFwdOQZcW3hxAG0V546EGu8dzwd_AM";
const RSVP_SHEET = "RSVP";
const WISHES_SHEET = "Ucapan";

function jsonResponse(data) {
  return ContentService
    .createTextOutput(JSON.stringify(data))
    .setMimeType(ContentService.MimeType.JSON);
}

function parseRequest(e) {
  if (e.postData && e.postData.contents) {
    try {
      return JSON.parse(e.postData.contents);
    } catch (_) {
      // Fall back to form parameters below.
    }
  }
  return e.parameter || {};
}

function clean(value, maxLength) {
  return String(value || "")
    .replace(/[<>]/g, "")
    .trim()
    .slice(0, maxLength);
}

function verifyToken(token) {
  const expected = PropertiesService.getScriptProperties().getProperty("API_TOKEN");
  return Boolean(expected) && token === expected;
}

function doPost(e) {
  try {
    const data = parseRequest(e);
    if (!verifyToken(data.token)) {
      return jsonResponse({ ok: false, error: "Unauthorized" });
    }

    const name = clean(data.name, 120);
    const slug = clean(data.slug, 160);
    const attendance = clean(data.attendance, 120);
    const message = clean(data.message, 1000);

    if (!name || !attendance) {
      return jsonResponse({ ok: false, error: "Nama dan konfirmasi kehadiran wajib diisi." });
    }

    const spreadsheet = SpreadsheetApp.openById(SPREADSHEET_ID);
    const timestamp = new Date();
    const rsvpSheet = spreadsheet.getSheetByName(RSVP_SHEET);
    rsvpSheet.appendRow([timestamp, name, slug, attendance, message, "Baru"]);

    if (message) {
      const wishesSheet = spreadsheet.getSheetByName(WISHES_SHEET);
      const id = Utilities.getUuid();
      wishesSheet.appendRow([id, timestamp, name, slug, message, "Tampil"]);
    }

    return jsonResponse({ ok: true });
  } catch (error) {
    console.error(error);
    return jsonResponse({ ok: false, error: "Terjadi kesalahan saat menyimpan data." });
  }
}

function doGet(e) {
  try {
    if (!verifyToken(e.parameter.token)) {
      return jsonResponse({ ok: false, error: "Unauthorized" });
    }

    const limit = Math.min(Math.max(Number(e.parameter.limit) || 20, 1), 100);
    const spreadsheet = SpreadsheetApp.openById(SPREADSHEET_ID);
    const sheet = spreadsheet.getSheetByName(WISHES_SHEET);
    const lastRow = sheet.getLastRow();

    if (lastRow < 2) {
      return jsonResponse({ ok: true, wishes: [] });
    }

    const rows = sheet.getRange(2, 1, lastRow - 1, 6).getValues();
    const wishes = rows
      .filter((row) => row[5] === "Tampil")
      .reverse()
      .slice(0, limit)
      .map((row) => ({
        id: row[0],
        timestamp: row[1],
        name: row[2],
        message: row[4],
      }));

    return jsonResponse({ ok: true, wishes });
  } catch (error) {
    console.error(error);
    return jsonResponse({ ok: false, error: "Terjadi kesalahan saat membaca ucapan." });
  }
}

