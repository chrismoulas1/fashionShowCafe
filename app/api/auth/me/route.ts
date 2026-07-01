import { NextRequest, NextResponse } from "next/server";
import { verifyRequestToken } from "@/lib/auth";

export async function GET(req: NextRequest) {
  const payload = await verifyRequestToken(req);
  if (!payload) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  return NextResponse.json({ username: payload.username });
}
