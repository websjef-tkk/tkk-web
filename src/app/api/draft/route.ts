import { draftMode } from "next/headers";
import { redirect } from "next/navigation";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const secret = req.nextUrl.searchParams.get("secret");
  if (secret !== process.env.NEXT_PUBLIC_SANITY_PREVIEW_SECRET) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const path = req.nextUrl.searchParams.get("path") ?? "/";
  if (!path.startsWith("/")) {
    return NextResponse.json({ error: "Ugyldig sti" }, { status: 400 });
  }

  (await draftMode()).enable();
  redirect(path);
}
