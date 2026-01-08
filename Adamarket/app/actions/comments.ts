
"use server"

 import { headers } from "next/headers";
 import { auth } from "@/lib/auth"; 
 import { db } from "@/lib/db/drizzle" 
 import {comments} from "@/lib/db/schema"
 import {eq,and} from "drizzle-orm"
 import { revalidatePath } from "next/cache";



  export const createComment = async(productId:number, content:string)=>{ 
    const session = await auth.api.getSession({
     headers: await headers(),
})
     if(!session?.user){ throw new Error ("Connecte toi por favor pour commenter ") 

     }
    await db 
    .insert(comments).values({ 
        productId, 
        content, 
        authorId: session.user.id,
     }) 
     revalidatePath(`/products/${productId}`); 


    }
  
    export const updateComment = async(commentId:number, content:string, productId:number) =>{
      const session = await auth.api.getSession({
        headers: await headers(),
      })
        if(!session?.user){ throw new Error ("Connecte toi por favor") 
        }
      await db
      .update(comments)
      .set({content})
      .where(
        and(
          eq(comments.id, commentId),
          eq(comments.authorId, session.user.id)
        )
      )
        .returning()

        revalidatePath(`/products/${productId}`); 

      }

      export const deleteComment = async(commentId:number, productId:number) =>{
        const session = await auth.api.getSession({
          headers: await headers(),
        })
        if(!session?.user){ throw new Error ("Connecte toi por favor ") 
      }
    await db 
    .delete(comments)
    .where(
      and(
        eq(comments.id, commentId),
        eq(comments.authorId, session.user.id)
      )
    )
    revalidatePath(`/products/${productId}`); 
    }