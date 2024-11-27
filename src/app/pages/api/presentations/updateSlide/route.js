import { NextResponse } from "next/server";
import { ObjectId } from "mongodb";
const Presentation = require('../../../../../../models/presentation')

export async function POST(req) {
    try {
        const body = await req.json();
        const url = new URL(req.url);
        const presentationId = url.searchParams.get("presentationId");
        const slideId = url.searchParams.get("slideId");

        if (!presentationId || !slideId) {
            return NextResponse.json({ error: "Missing presentationId or slideId" }, { status: 400 });
        }

        if (!ObjectId.isValid(presentationId) || !ObjectId.isValid(slideId)) {
            return NextResponse.json({ error: "Invalid ID format" }, { status: 400 });
        }

        if (!Array.isArray(body)) {
            return NextResponse.json({ error: "Invalid elements data" }, { status: 400 });
        }

        const presentation = await Presentation.findById(presentationId);
        if (!presentation) {
            return NextResponse.json({ error: "Presentation not found" }, { status: 404 });
        }

        const slideIndex = presentation.slides.findIndex(
            (slide) => slide._id.toString() === slideId
        );

        if (slideIndex === -1) {
            return NextResponse.json({ error: "Slide not found" }, { status: 404 });
        }

        // Update the elements of the specific slide
        presentation.slides[slideIndex].elements = body;

        // Save the updated presentation
        await presentation.save();

        return NextResponse.json(
            { message: "Slide updated successfully", slide: presentation.slides[slideIndex] },
            { status: 200 }
        );
    } catch (error) {
        console.error("Error updating slide:", error);
        return NextResponse.json(
            { error: "Error updating slide", details: error instanceof Error ? error.message : "Unknown error" },
            { status: 500 }
        );
    }
}