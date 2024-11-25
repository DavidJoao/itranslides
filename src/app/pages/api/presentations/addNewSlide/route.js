import { NextResponse } from "next/server";
const Presentation = require("../../../../../../models/presentation");
import { URL } from "url";
import { ObjectId } from "mongodb"; 

export async function POST(req) {
    const url = new URL(req.url);
    const presentationId = url.searchParams.get("presentationId");
    const objId = new ObjectId(presentationId)
    try {
        const presentation = await Presentation.findById(presentationId);
        if (!presentation) {
			NextResponse.json({ error: 'Presentation not found' }, { status: 404 })
		}

        const newPosition = presentation.slides.length + 1;
        presentation.slides.push({ position: newPosition });
        await presentation.save();
    
        return NextResponse.json({ message:'Empty Slide Created Successfully', presentation: presentation }, { status: 200 });
    } catch (error) {
        return NextResponse.json( { error: "Error Fetching Presentations", details: error.message }, { status: 500 });
    }
}
