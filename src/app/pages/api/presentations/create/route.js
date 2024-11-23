import { NextResponse } from "next/server";
const Presentation = require("../../../../../../models/presentation");
const User = require("../../../../../../models/user");
import { URL } from "url";

export async function POST(req) {

    const url = new URL(req.url);
    const presentationName = url.searchParams.get("presentationName");
    const userId = url.searchParams.get("userId");

    try {
        if (!presentationName || !userId) {
            return NextResponse.json( { error: "Nickname and user ID are required" }, { status: 400 } );
        }

        const newPresentation = await Presentation.create({
            name: presentationName,
            creator: userId
        })

        const user = await User.findById(userId);
        if (!user) {
            return NextResponse.json({ error: "User not found" }, { status: 404 });
        }
        
        user.presentations.push(newPresentation._id);
        await user.save();
            
        return NextResponse.json({ presentation: newPresentation }, { status: 201 });
    } catch (error) {
        return NextResponse.json( { error: "Error Creating New Presentation", details: error.message }, { status: 500 });
    }
}
