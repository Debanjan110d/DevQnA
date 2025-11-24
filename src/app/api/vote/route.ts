import { answerCollection, db, questionCollection, votesCollection, usersCollection } from "@/models/name";
import { databases, users } from "@/models/server/config";
import { UserPrefs } from "@/store/Auth";
import { NextRequest, NextResponse } from "next/server";
import { ID, Query } from "node-appwrite";

export async function POST(request: NextRequest) {
    try {
        // Grab the data
        const { votedByID, voteStatus, type, typeId } = await request.json();

        const response = await databases.listDocuments(
            db,
            votesCollection,
            [
                Query.equal("type", type),
                Query.equal("typeId", typeId),
                Query.equal("votedById", votedByID),
            ]
        );

        const existingVote = response.documents[0];

        const targetCollection = type === "question" ? questionCollection : answerCollection;
        const questionOrAnswer = await databases.getDocument(
            db,
            targetCollection,
            typeId
        );

        const authorId = questionOrAnswer.authorId;

        // Helper to update reputation
        const updateReputation = async (change: number) => {
            // Update Auth Prefs
            try {
                const prefs = await users.getPrefs<UserPrefs>(authorId);
                const newReputation = Number(prefs.reputation || 0) + change;
                await users.updatePrefs(authorId, { reputation: newReputation });
            } catch (error) {
                console.error("Error updating user prefs:", error);
            }

            // Update Users Collection (if exists)
            try {
                const userDocs = await databases.listDocuments(
                    db,
                    usersCollection,
                    [Query.equal("userId", authorId)]
                );
                if (userDocs.documents.length > 0) {
                    await databases.updateDocument(
                        db,
                        usersCollection,
                        userDocs.documents[0].$id,
                        {
                            reputation: Number(userDocs.documents[0].reputation || 0) + change,
                        }
                    );
                }
            } catch (error) {
                console.error("Error updating users collection:", error);
            }
        };

        if (existingVote) {
            // Vote exists
            if (existingVote.voteStatus === voteStatus) {
                // Toggle off (remove vote)
                await databases.deleteDocument(db, votesCollection, existingVote.$id);

                // Revert reputation
                await updateReputation(voteStatus === "upvoted" ? -1 : 1);
            } else {
                // Change vote (e.g. upvoted -> downvoted)
                await databases.updateDocument(db, votesCollection, existingVote.$id, {
                    voteStatus: voteStatus,
                });

                // Revert old, apply new
                // If old was up (+1), new is down (-1): total -2
                // If old was down (-1), new is up (+1): total +2
                await updateReputation(voteStatus === "upvoted" ? 2 : -2);
            }
        } else {
            // New vote
            await databases.createDocument(
                db,
                votesCollection,
                ID.unique(),
                {
                    type,
                    typeId,
                    voteStatus,
                    votedById: votedByID,
                }
            );

            // Apply reputation
            await updateReputation(voteStatus === "upvoted" ? 1 : -1);
        }

        // Recalculate total votes for return
        const [upvotes, downvotes] = await Promise.all([
            databases.listDocuments(db, votesCollection, [
                Query.equal("type", type),
                Query.equal("typeId", typeId),
                Query.equal("voteStatus", "upvoted"),
                Query.equal("votedById", votedByID), // Wait, why filter by votedByID? We want total votes for the item.
                Query.limit(1),
            ]),
            databases.listDocuments(db, votesCollection, [
                Query.equal("type", type),
                Query.equal("typeId", typeId),
                Query.equal("voteStatus", "downvoted"),
                Query.equal("votedById", votedByID), // Same here.
                Query.limit(1),
            ]),
        ]);
        
        // The previous code was filtering by votedByID which is wrong for "total votes".
        // But maybe it was checking if the current user voted?
        // The return value was `voteResult :upvotes.total= downvotes.total`.
        // If we want to return the total score of the post, we should count ALL votes.
        
        const [totalUpvotes, totalDownvotes] = await Promise.all([
             databases.listDocuments(db, votesCollection, [
                Query.equal("type", type),
                Query.equal("typeId", typeId),
                Query.equal("voteStatus", "upvoted"),
                Query.limit(1), // We just need count, but listDocuments returns total.
            ]),
            databases.listDocuments(db, votesCollection, [
                Query.equal("type", type),
                Query.equal("typeId", typeId),
                Query.equal("voteStatus", "downvoted"),
                Query.limit(1),
            ]),
        ]);

        return NextResponse.json(
            {
                data: {
                    document: null,
                    voteResult: totalUpvotes.total - totalDownvotes.total, // Return net score
                },
            },
            { status: 200 }
        );
    } catch (error: any) {
        return NextResponse.json(
            {
                error: error?.message || "Error In voting",
            },
            {
                status: error?.status || error?.code || 500,
            }
        );
    }
}