import { NextResponse } from "next/server";

export async function GET(req) {
    try {
        const response = NextResponse.json({ message: "Logged out successfully" }, { status: 200 });
        response.cookies.set('userId', '', {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
            maxAge: 0,
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
