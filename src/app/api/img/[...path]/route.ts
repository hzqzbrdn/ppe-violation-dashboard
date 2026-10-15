export const dynamic = "force-dynamic";

const UPSTREAM = process.env.PPE_UPSTREAM || "http://192.168.0.161:8090";

/** Proxy a violation snapshot image from the source, keeping it same-origin. */
export async function GET(
  _req: Request,
  { params }: { params: { path: string[] } },
) {
  const rel = params.path.map(encodeURIComponent).join("/");
  const url = `${UPSTREAM}/${rel}`;
  try {
    const res = await fetch(url, {
      cache: "no-store",
      headers: { "User-Agent": "ppe-dashboard-next" },
    });
    if (!res.ok) {
      return new Response(`Upstream image error ${res.status}`, { status: res.status });
    }
    const body = await res.arrayBuffer();
    return new Response(body, {
      status: 200,
      headers: {
        "Content-Type": res.headers.get("Content-Type") || "image/jpeg",
        "Cache-Control": "public, max-age=300",
      },
    });
  } catch (e) {
    return new Response(`Cannot reach source: ${(e as Error).message}`, { status: 502 });
  }
}
