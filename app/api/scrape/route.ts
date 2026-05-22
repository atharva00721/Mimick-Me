import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth/server";

export async function POST(request: Request) {
    const session = await getSession();
    if (!session?.user?.id) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    try {
        const { url } = await request.json();
        if (!url || typeof url !== "string") {
            return NextResponse.json({ error: "URL is required" }, { status: 400 });
        }

        let targetUrl = url;
        if (!/^https?:\/\//i.test(targetUrl)) {
            targetUrl = `https://${targetUrl}`;
        }

        console.log("[api/scrape] fetching:", targetUrl);
        const res = await fetch(`https://r.jina.ai/${targetUrl}`);

        if (!res.ok) {
            // Fallback: simple fetch + strip tags
            const fb = await fetch(targetUrl);
            const html = await fb.text();
            const text = html
                .replace(/<script\b[^>]*>([\s\S]*?)<\/script>/gim, "")
                .replace(/<style\b[^>]*>([\s\S]*?)<\/style>/gim, "")
                .replace(/<[^>]*>?/gm, " ")
                .replace(/\s+/g, " ")
                .trim()
                .substring(0, 15000);

            return NextResponse.json({ success: true, text });
        }

        const text = await res.text();
        return NextResponse.json({ success: true, text: text.substring(0, 15000) });
    } catch (error) {
        console.error("[api/scrape] error:", error);
        return NextResponse.json({ error: "Failed to scrape website" }, { status: 500 });
    }
}
