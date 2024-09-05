import Prompt from "@models/prompt";
import { connectToDB } from "@utils/database";
import { FONT_MANIFEST } from "next/dist/shared/lib/constants";

export const GET = async (request, { params }) => {
    try {
        await connectToDB()

        const prompt = await Prompt.findById(params.id).populate("creator")
        if (!prompt) return new Response("Prompt Not Found", { status: 404 });

        return new Response(JSON.stringify(prompt), { status: 200 })

    } catch (error) {
        return new Response("Internal Server Error", { status: 500 });
    }
}

export const PATCH = async (request, { params }) => {
    const { prompt, tag } = await request.json();

    try {
        await connectToDB();

        const headers = new Headers({
            'Content-Type': 'application/json',
            'Cache-Control': 'no-store' // This disables caching
        })


        // Find the existing prompt by ID
        const existingPrompt = await Prompt.findById(params.id);

        if (!existingPrompt) {
            return new Response("Prompt not found", { status: 404, headers });
        }

        // Update the prompt with new data
        existingPrompt.prompt = prompt;
        existingPrompt.tag = tag;

        await existingPrompt.save();

        return new Response("Successfully updated the Prompts", { status: 200, headers });
    } catch (error) {
        return new Response("Error Updating Prompt", { status: 500, headers });
    }
};

export const DELETE = async (request, { params }) => {
    try {
        await connectToDB();

        // Find the prompt by ID and remove it
         console.log("this is the param id: ", params.id);
        await Prompt.findByIdAndDelete(params.id);

        return new Response("Prompt deleted successfully", { status: 200 });
    } catch (error) {
        console.log("this is the error deleting a prompt: ", error);
        return new Response("Error deleting prompt", { status: 500 });
    }
};