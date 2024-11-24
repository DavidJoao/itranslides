import { NextResponse } from "next/server";
const Presentation = require("../../../../../../models/presentation");
import { URL } from "url";
import { ObjectId } from "mongodb"; 

export async function GET(req) {
    const url = new URL(req.url);
    const presentationId = url.searchParams.get("presentationId");
    const objId = new ObjectId(presentationId)
    try {
        const presentation = await Presentation.findById(presentationId);
        return NextResponse.json({ presentation: presentation }, { status: 200 });
    } catch (error) {
        return NextResponse.json( { error: "Error Fetching Presentations", details: error.message }, { status: 500 });
    }
}
