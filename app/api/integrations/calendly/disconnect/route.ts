import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth/server";
import { getAgentByUserId } from "@/lib/agent/configure";
import { disconnectAgentCalendly } from "@/lib/integrations/calendly";

export async function POST() {
    const session = await getSession();
    if (!session?.user?.id) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    try {
        const agent = await getAgentByUserId(session.user.id);
        if (!agent) {
            return NextResponse.json({ error: "Agent not found" }, { status: 404 });
        }

        await disconnectAgentCalendly(agent.id);
        return NextResponse.json({ success: true });
    } catch (err) {
        console.error("Calendly disconnect error:", err);
        return NextResponse.json({ error: "Failed to disconnect" }, { status: 500 });
    }
}
