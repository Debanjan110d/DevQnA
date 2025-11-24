import { answerCollection, db } from "@/models/name";
import { databases, users } from "@/models/server/config";
import { NextRequest, NextResponse } from "next/server";
import { ID } from "node-appwrite";
import { UserPrefs } from "@/store/Auth";

export async function POST(request: NextRequest) {
    try {
        const { questionId, content, authorId } = await request.json();

        const response = await databases.createDocument(
            db,
            answerCollection,
            ID.unique(),
            {
                questionId,
                content,
                authorId
            }
        );

        // Increase author reputation
        try {
            const prefs = await users.getPrefs<UserPrefs>(authorId);
            await users.updatePrefs(authorId, {
                reputation: Number(prefs.reputation || 0) + 1
            });
        } catch (error) {
            console.error("Error updating reputation:", error);
        }

        return NextResponse.json(response, { status: 201 });
    } catch (error: any) {
        return NextResponse.json(
            { error: error?.message || "Error creating answer" },
            { status: error?.status || error?.code || 500 }
        );
    }
}

export async function DELETE(request: NextRequest) {
    try {
        const { answerId } = await request.json();

        const answer = await databases.getDocument(db, answerCollection, answerId);

        await databases.deleteDocument(db, answerCollection, answerId);

        // Decrease reputation
        try {
            const prefs = await users.getPrefs<UserPrefs>(answer.authorId);
            await users.updatePrefs(answer.authorId, {
                reputation: Number(prefs.reputation || 0) - 1
            });
        } catch (error) {
            console.error("Error updating reputation:", error);
        }

        return NextResponse.json({ message: "Answer deleted successfully" }, { status: 200 });
    } catch (error: any) {
        return NextResponse.json(
            { error: error?.message || "Error deleting answer" },
            { status: error?.status || error?.code || 500 }
        );
    }
}