import { NextResponse } from "next/server";
const User = require('../../../../../models/user')

export async function GET(req) {
    const url = new URL(req.url);
    const userId = url.searchParams.get("userId");

    if (!userId) {
        return NextResponse.json(
            { error: "User ID is required" },
            { status: 400 }
        );
    }

    try {
        const foundUser = await User.findById(userId);
        if (!foundUser) {
            return NextResponse.json(
                { error: "User not found" },
                { status: 404 }
            );
        }

        return NextResponse.json({ user: foundUser }, { status: 200 });
    } catch (error) {
        return NextResponse.json(
            { error: "Error Finding User", details: error.message },
            { status: 500 }
        );
    }
}
