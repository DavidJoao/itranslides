import { NextResponse } from "next/server";
const Presentation = require("../../../../../../models/presentation");

export async function GET(req) {
    try {
        const allPresentations = await Presentation.find({})
        return NextResponse.json({ presentations: allPresentations }, { status: 200 });
    } catch (error) {
        return NextResponse.json( { error: "Error Fetching Presentations", details: error.message }, { status: 500 });
    }
}
