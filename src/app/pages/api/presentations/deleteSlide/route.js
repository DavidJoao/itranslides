import { NextResponse } from "next/server";
const Presentation = require("../../../../../../models/presentation");
import { URL } from "url";
import { ObjectId } from "mongodb"; 

export async function POST(req) {
    const url = new URL(req.url);
    const presentationId = url.searchParams.get("presentationId");
    const presenationObjId = new ObjectId(presentationId)
    const slideId = url.searchParams.get("slideId");
    const slideObjId = new ObjectId(slideId)

    try {
        const presentation = await Presentation.findById(presentationId);
        if (!presentation) {
			NextResponse.json({ error: 'Presentation not found' }, { status: 404 })
		}

        presentation.slides = presentation.slides.filter((slide) => slide._id.toString() !== slideId);

        await presentation.save();
        return NextResponse.json({ message:'Empty Slide Deleted Successfully', presentation: presentation }, { status: 200 });
    } catch (error) {
        return NextResponse.json( { error: "Error Fetching Presentations", details: error.message }, { status: 500 });
    }
}
