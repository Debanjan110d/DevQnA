"use client"
import { create } from "zustand";
import { immer } from "zustand/middleware/immer";
import { persist } from "zustand/middleware";


import {AppwriteException,ID,Models}  from "appwrite";// since this is going to be login based so we not importing it from the node-appwrite but if you want to add more features then you can import it from node-appwrite
//Some client side configurations
import { account } from "@/models/client/config";
import { createUserProfile, getUserProfile } from "@/lib/appwrite";


//Lets make user reputaton 

export interface UserPrefs {
    reputation: number;
    name: string;
    email: string;
    avatar?: string;
}

interface MyAuthStore { //? This is a interface ,its coming up because we are using typescript if we are using hs we do't have to work with these things 
    session: Models.Session | null;// This is given by the appwrite itslf
    jwt : string | null;
    user : Models.User<UserPrefs> | null;
    hydrated: boolean;//it will depend on zustand 
    

    sethydrated():void; // basically it will be true when the user is logged in and false when the user is logged out
    verrifySession(): Promise<void>;
    login(email: string, password: string): Promise<
    {
        sucess : boolean // appwirte 1O1
        error? : AppwriteException | null; // Thre is a chance that there is no errors
    }
    >;
    createAccount(
        email: string,
        password: string,
        name:string
    ): Promise<
    {
        sucess : boolean 
        error? : AppwriteException | null; 
    }
    >;

    logout(): Promise<void>
    
}

export const useAuthStore = create<MyAuthStore>()( //? the 1st () are initilizing the store and then we are immediately passing on a method onto this one and we will provide everything 
    persist( //* We can go into the docs but I have already studied it on my way home form college so letts continue

        immer(
            
            (set)=>(// This is a setter and immer will take care that everytime you ste any variable/ any data  //* immer will take care that you are not overwritting the existing state or data  
                {
                    session:null,
                    jwt : null,
                    user : null,
                    hydrated : false,

                    sethydrated() {
                        set({hydrated : true})// This means if this method runs then hydrated will be true
                    },

                    async verrifySession() {
                        try {
                            const session = await account.getSession({sessionId: "current"});
                            set({ session }); //* set variable is just like useState  
                        } catch {
                            // Silent fail
                        }
                    },

                    async login(email,password){ 
                        try {
                            const session = await account.createEmailPasswordSession({email,password}); 
                            const [user,{jwt}] = await Promise.all([
                                account.get<UserPrefs>(),
                                account.createJWT()
                            ])
                            if (!user.prefs?.reputation) {
                                await account.updatePrefs({ prefs: { reputation: 0 } });
                            }
                            
                            // Ensure user profile exists in database
                            const existingProfile = await getUserProfile(user.$id);
                            if (!existingProfile) {
                                await createUserProfile({
                                    userId: user.$id,
                                    name: user.name,
                                    email: user.email,
                                    avatar: user.prefs?.avatar,
                                    reputation: user.prefs?.reputation || 0,
                                });
                            }
                            
                            set({session,user,jwt});
                            return {
                                sucess : true
                            }
                            
                        } catch (error) {
                            return {
                                sucess : false,
                                error : error as AppwriteException
                            }
                        }
                    }, 

                    
                    async createAccount(email: string,password: string,name:string){
                        try {
                            const newUser = await account.create({userId:ID.unique(),email,password,name});
                            
                            // Create user profile in database
                            await createUserProfile({
                                userId: newUser.$id,
                                name: name,
                                email: email,
                                reputation: 0,
                            });
                            
                            return{
                                sucess : true
                            }

                        } catch (error) {
                            return {
                                sucess : false,
                                error : error as AppwriteException
                            }
                            
                        }


                    },
                    async logout(){
                        try {
                            await account.deleteSessions();
                            set({session:null,user:null,jwt:null});
                        } catch {
                            // Silent fail
                        }
                    },

                }
            )
            
        ),
        {
            name: "auth",
            onRehydrateStorage:()=>{
                return(state,error)=>{// Here this is a call back and //? zustand provides me with the state so I do not have to explicitly declare it here
                    if (!error) state?.sethydrated()
                }
            }
        }

    )

)

