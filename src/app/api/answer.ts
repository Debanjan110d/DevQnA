import { answerCollection, db } from "@/models/name";
import { databases } from "@/models/server/config";
import { NextRequest,NextResponse } from "next/server";
import { ID } from "node-appwrite";

export async function POST(request: NextRequest){
    try {
        
        const {questionId,answer,authorID} = await request.json() // This  request.json() will e giving us the data that we have sent from the client side.

        const response = await databases.createDocument(
            db,answerCollection,ID.unique(),{
                questionId,
                answer,
                authorID
            }
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