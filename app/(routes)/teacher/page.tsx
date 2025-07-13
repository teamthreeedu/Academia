import { currentUser } from "@clerk/nextjs/server"
import Head from "next/head";
import { Header } from "./components";

export default async function TeacherPage(){
    const user = await currentUser();
    if(!user){
        return <p>No Signed in</p>
    }

    return(
        <div>
            <Header/>
        </div>
    )
}