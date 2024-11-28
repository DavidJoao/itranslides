import { NextResponse } from "next/server";
const Presentation = require("../../../../../../models/presentation");
const User = require("../../../../../../models/user");
import { URL } from "url";
import { ObjectId } from "mongodb"; 

export async function POST(req) {
    const url = new URL(req.url);
    const presentationId = url.searchParams.get("presentationId");
    const userId = url.searchParams.get("userId");
    const role = url.searchParams.get("role") || "viewer";

    try {
        const foundPresentation = await Presentation.findById(presentationId);
        if (!foundPresentation) {
            return NextResponse.json({ error: "Presentation not found" }, { status: 404 });
        }

        const roles = ["viewers", "editors"];

        // Ensure the role arrays are initialized
        roles.forEach((r) => {
            if (!Array.isArray(foundPresentation[r])) {
                foundPresentation[r] = [];
            }
            foundPresentation[r] = foundPresentation[r].filter(
                (user) => user.toString() !== userId
            );
        });

        // Add the user to the specified role
        if (role && Array.isArray(foundPresentation[role])) {
            foundPresentation[role].push(userId);
        }

        await foundPresentation.save();

        return NextResponse.json({
            editors: foundPresentation.editors,
            viewers: foundPresentation.viewers,
        });
    } catch (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
