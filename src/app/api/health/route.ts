import { NextResponse } from "next/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export function GET() {
  return NextResponse.json({
    status: "ok",
    version: process.env.npm_package_version || "0.1.0",
    commit: process.env.RAILWAY_GIT_COMMIT_SHA || process.env.GIT_COMMIT || "dev",
    timestamp: new Date().toISOString(),
  });
}
