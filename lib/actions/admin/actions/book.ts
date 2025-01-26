"use server"

import { db } from "@/database/drizzle"
import { books } from "@/database/schema"

export const CreateBook = async(params: BookParams)=>{
    try {
        const newBook = await db
        .insert(books)
        .values({
            ...params,
            availableCopies: params.totalCopies,
        })
        .returning();

        return{
            success: true,
            data: JSON.parse(JSON.stringify(newBook[0])),
        };
    } catch (error) {
        return{
            success: false,
            message: "An error occured while creating the book",
        }
    }
}