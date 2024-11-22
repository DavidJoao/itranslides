import { NextResponse } from "next/server";
import { URL } from "url";
const User = require('../../../../../../models/user');

export async function POST(req) {
    try {
        const url = new URL(req.url);
        const nickname = url.searchParams.get('nickname').toLocaleLowerCase();

        if (!nickname) {
            return NextResponse.json( { error: "Nickname is required" }, { status: 400 } );
        }

        const foundUser = await User.findOne({ nickname });

        if (foundUser) {
            return NextResponse.json({ user: foundUser }, { status: 200 });
        } else {
            const newUser = await User.create({
                nickname,
                presentations: [],
            });
            return NextResponse.json({ user: newUser }, { status: 200 });
        }
    } catch (error) {
        return NextResponse.json( { error: "Internal Server Error", details: error.message }, { status: 500 });
    }
}
