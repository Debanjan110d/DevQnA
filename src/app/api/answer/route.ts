import { answerCollection, db } from "@/models/name";
import { tables, users } from "@/models/server/config";
import { NextRequest,NextResponse } from "next/server";
import { ID } from "node-appwrite";
import {UserPrefs} from "@/store/Auth";

export async function POST(request: NextRequest){
    try {
        
        const {questionId,answer,authorID} = await request.json() // This  request.json() will e giving us the data that we have sent from the client side.

        const response = await tables.createRow({ // database has chaged as tables now
            databaseId: db,
            tableId: answerCollection,
            rowId: ID.unique(),
            data: {
                questionId,
                content: answer,
                authorId: authorID
            }
        })


        //Increase author reputation
        const preference = await users.getPrefs<UserPrefs>(authorID)
        const currentReputation = Number(preference?.reputation) || 0; //* In this way there is almost no risk of getting some undefined value 
        await users.updatePrefs(
            {userId: authorID,
            prefs:{
                // reputation: Number(preference?.reputation) +1 we will do better than this
                //lets use currentReputation +
                reputation: currentReputation + 1
            }
            }
        )
        return NextResponse.json(
            response,
            {status: 201}
        )

        //and we can get the data by just simply destructuring it
        
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error:any) {
        return NextResponse.json(
            {error: error?.message || "Something went wrong when creating answers"},
            {status: error?.status || error?.code ||500}
        )
    }
}


export async function DELETE(request: NextRequest){
    try {
        
        const {answerId,authorID} = await request.json()
        const answer = await tables.getColumn(// New wat of appwrite 
            {
            databaseId:db,
            tableId:answerCollection,
            key:answerId
        }
        )

        //Lets 1st ccheck that the answer exists or not 
        if (!answer) {
            return NextResponse.json(
                {
                    error: "Answer does not exist"
                },
                {
                    status: 402
                }
            )
        }

        await tables.deleteRow(
            {
                databaseId:db,
                tableId:answerCollection,
                rowId:answerId
            }
        )

        //Now lets decrease the reputation
        const preference = await users.getPrefs<UserPrefs>(authorID) //cause we do not have authorID directly here 
        const currentReputation = Number(preference?.reputation) || 0;
        await users.updatePrefs(
            {userId: authorID,//TODO Lets try to use it directly make sure to check later 
            prefs:{
                
                //lets use currentReputation -
                reputation: currentReputation -1
            }
            }
        )

        return NextResponse.json(
            {
                message: "Answer deleted successfully"
            },
            {
                status: 200
            }
        )





        
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error:any) {
        return NextResponse.json(
            {
                error: error?.message || "Error deleting the answer"
            },
            {
                status: error?.status || error?.code || 500
            }
        )
        
    }
}