const appsScriptUrl = process.env.GOOGLE_APPS_SCRIPT_URL;
const appsScriptToken = process.env.GOOGLE_APPS_SCRIPT_TOKEN;

export async function POST(request: Request) {
  if (!appsScriptUrl || !appsScriptToken) {
    return Response.json({ ok: false, error: "Integrasi Google Sheet belum dikonfigurasi." }, { status: 503 });
  }

  try {
    const payload = (await request.json()) as { name?: string; slug?: string; attendance?: string; message?: string };
    const response = await fetch(appsScriptUrl, {
      method: "POST",
      headers: { "Content-Type": "text/plain;charset=utf-8" },
      body: JSON.stringify({ ...payload, token: appsScriptToken }),
      redirect: "follow",
    });
    const result = (await response.json()) as { ok?: boolean; error?: string };
    if (!response.ok || !result.ok) {
      return Response.json({ ok: false, error: result.error || "Konfirmasi belum berhasil disimpan." }, { status: 502 });
    }
    return Response.json({ ok: true });
  } catch (error) {
    console.error("RSVP submission failed", error);
    return Response.json({ ok: false, error: "Terjadi gangguan saat menyimpan konfirmasi." }, { status: 502 });
  }
}
