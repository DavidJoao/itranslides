import { NextResponse } from "next/server";
import { URL } from "url";
const User = require("../../../../../../models/user");

export async function POST(req) {
    try {
        const url = new URL(req.url);
        const nickname = url.searchParams.get('nickname')?.toLowerCase();

        if (!nickname) {
            return NextResponse.json(
                { error: "Nickname is required" },
                { status: 400 }
            );
        }

        let user;
        const foundUser = await User.findOne({ nickname });

        if (foundUser) {
            user = foundUser;
        } else {
            user = await User.create({
                nickname,
                presentations: [],
            });
        }

        const response = NextResponse.json({ user }, { status: 200 });

        response.cookies.set('userId', user._id.toString(), {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
            maxAge: 60 * 60 * 24 * 7,
            path: '/',
        });

        return response;
    } catch (error) {
        return NextResponse.json(
            { error: "Internal Server Error", details: error.message },
            { status: 500 }
        );
    }
}
