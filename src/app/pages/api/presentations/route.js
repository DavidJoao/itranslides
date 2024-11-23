import { NextResponse } from "next/server";
const Presentation = require("../../../../../models/presentation");
import { URL } from "url";
import { ObjectId } from "mongodb"; 

export async function GET(req) {
    const url = new URL(req.url);
    const userId = url.searchParams.get("userId");
    const objId = new ObjectId(userId)
    try {
        const myPresentations = await Presentation.find({
            creator: { $eq: objId }
        });
        return NextResponse.json({ presentations: myPresentations }, { status: 200 });
    } catch (error) {
        return NextResponse.json( { error: "Error Fetching Presentations", details: error.message }, { status: 500 });
    }
}
