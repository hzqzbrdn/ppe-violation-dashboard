import { NextResponse } from "next/server";

export const dynamic = "force-dynamic"; // always proxy live, never cache

const UPSTREAM = process.env.PPE_UPSTREAM || "http://192.168.0.161:8090";

export async function GET() {
  try {
    const res = await fetch(`${UPSTREAM}/api/violations`, {
      cache: "no-store",
      headers: { "User-Agent": "ppe-dashboard-next" },
    });
    if (!res.ok) {
      return NextResponse.json(
        { error: `Upstream responded ${res.status}` },
        { status: res.status },
      );
    }
    const data = await res.json();
    return NextResponse.json(data, {
      headers: { "Cache-Control": "no-store" },
    });
  } catch (e) {
    return NextResponse.json(
      { error: `Cannot reach source ${UPSTREAM}: ${(e as Error).message}` },
      { status: 502 },
    );
  }
}
