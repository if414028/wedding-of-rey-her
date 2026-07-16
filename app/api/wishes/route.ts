const appsScriptUrl = process.env.GOOGLE_APPS_SCRIPT_URL;
const appsScriptToken = process.env.GOOGLE_APPS_SCRIPT_TOKEN;

export async function GET() {
  if (!appsScriptUrl || !appsScriptToken) return Response.json({ ok: true, wishes: [] });

  try {
    const url = new URL(appsScriptUrl);
    url.searchParams.set("token", appsScriptToken);
    url.searchParams.set("limit", "20");
    const response = await fetch(url, { redirect: "follow", cache: "no-store" });
    const result = (await response.json()) as {
      ok?: boolean;
      error?: string;
      wishes?: Array<{ id: string; timestamp: string; name: string; message: string }>;
    };
    if (!response.ok || !result.ok) {
      return Response.json({ ok: false, error: result.error || "Ucapan belum dapat dimuat." }, { status: 502 });
    }
    return Response.json({ ok: true, wishes: result.wishes ?? [] });
  } catch (error) {
    console.error("Wishes fetch failed", error);
    return Response.json({ ok: false, error: "Terjadi gangguan saat memuat ucapan." }, { status: 502 });
  }
}
