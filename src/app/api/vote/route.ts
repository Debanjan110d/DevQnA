import { answerCollection, db, questionCollection, votesCollection } from "@/models/name";
import {  tables, users } from "@/models/server/config";
import { UserPrefs } from "@/store/Auth";
import { NextRequest, NextResponse } from "next/server";
import { ID, Query } from "node-appwrite";


export async function POST(request: NextRequest){
    try {
        
        //Lets grab the data 
        const {votedByID,voteStatus,type,typeId} = await request.json() 
        const response = await tables.listRows({
            databaseId: db,
            tableId: votesCollection,
            queries: [// This is filtering the database like we do in mongodb aggrigation
                Query.equal('type', type),
                Query.equal('typeId', typeId),
                Query.equal('votedByID', votedByID)
            ]
        })


        // This one is for the people who are clicking two times , 1st to vote and then again on the sam ebutton to cancel the vote 
        if (response.rows.length > 0) {
            await tables.deleteRow({
                databaseId: db,
                tableId: votesCollection,
                rowId: response.rows[0].$id  
            })

            // Now lets decrease the reputation
            const QuestionOrAnswer = await tables.getRow({
                databaseId: db,
                tableId: type === 'question' ? questionCollection : answerCollection , 
                rowId: typeId,
            
            })

            const author_preferences = await users.getPrefs<UserPrefs>(QuestionOrAnswer.data.authorId)

            await users.updatePrefs<UserPrefs>(
                {
                    userId: QuestionOrAnswer.data.authorId,
                    prefs: {
                        reputation: response.rows[0]?.voteStatus === 'upvoted' ? Number(author_preferences?.reputation) - 1 : Number(author_preferences?.reputation) + 1
                    }
                }
            )

            

        }

// So this means taht previous vote does not exist or status changed
        if (response.rows[0]?.voteStatus !== voteStatus) {
            await tables.createRow({
                databaseId: db,
                tableId: votesCollection,
                rowId: ID.unique(),
                data: {
                    voteStatus,
                    votedById: votedByID,
                    typeId,
                    type
                }
            })

            //Increase or decrease
            
            const QuestionOrAnswer = await tables.getRow({
                databaseId: db,
                tableId: type === 'question' ? questionCollection : answerCollection , 
                rowId: typeId,
            })

            const author_preferences = await users.getPrefs<UserPrefs>(QuestionOrAnswer.data.authorId)

            await users.updatePrefs<UserPrefs>(
                {
                    userId: QuestionOrAnswer.data.authorId,
                    prefs: {
                        reputation: voteStatus === 'upvoted' ? Number(author_preferences?.reputation) + 1 : Number(author_preferences?.reputation) - 1
                    }
                }
            )
        }



        //? All Vote handeling 

        const [upvotes,downvotes] = await Promise.all([
            tables.listRows(
                {
                    databaseId: db,
                    tableId: votesCollection,
                    queries: [
                        Query.equal('type', type),
                        Query.equal('typeId', typeId),
                        Query.equal('voteStatus', 'upvoted'),//! Upvote 
                        Query.equal('votedByID', votedByID),
                        Query.limit(1)
                    ]
                }
            ),
            tables.listRows(
                {
                    databaseId: db,
                    tableId: votesCollection,
                    queries: [
                        Query.equal('type', type),
                        Query.equal('typeId', typeId),
                        Query.equal('voteStatus', 'downvoted'),//! downvote 
                        Query.equal('votedByID', votedByID),
                        Query.limit(1)
                    ]
                }
            )
        ])

        return NextResponse.json(
            {
                data:{
                    voteResult :upvotes.total= downvotes.total
                }
            },
            {status:200}
        )

        

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error:any) {
        return NextResponse.json(
            {
                error: error?.message || "Error In voting"
            },
            {
                status: error?.status || error?.code ||500
            }
        )
    }
}