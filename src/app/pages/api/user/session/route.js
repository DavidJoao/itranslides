import { NextResponse } from "next/server";

export async function GET(req) {
    try {
        const cookies = req.cookies;
        const userId = cookies.get("userId");
        if (!userId) {
            return NextResponse.json({ error: "User not logged in" }, { status: 401 });
        }
        return NextResponse.json({ message: "User is authenticated", userId }, { status: 200 });
    } catch (error) {
        return NextResponse.json({ error: "Internal Server Error", details: error.message }, { status: 500 });
    }
}
