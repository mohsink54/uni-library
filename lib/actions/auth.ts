"use server"

import { signIn } from "@/auth";
import { db } from "@/database/drizzle";
import { users } from "@/database/schema";
import { hash } from "bcryptjs";
import { eq } from "drizzle-orm";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import ratelimit from "../ratelimit";

export const signInWithCredentials = async(
    params: Pick<AuthCredentials, "email" | "password">,
)=>{
    const {email, password} = params;

    const ip = (await headers()).get("x-forwarded-for") || "127.0.0.1";

    const success = await ratelimit.limit(ip);

    if (!success) {
        return redirect("/too-fast");
    }

    try {
        const result = await signIn("credentials",{
            email,
            password,
            redirect: false,
        });

        if (result?.error) {
            return{ success: false, error: result.error};
        }

        return{ success: true};
    } catch (error) {
        console.log(error, "Signin error");
        return{ success: false, error: "Signin Error"}
    }
};

export const signUp = async (params: AuthCredentials): Promise<{ success: boolean; error?: string }> => {
    const { fullName, email, universityId, password, universityCard } = params;

    const ip = (await headers()).get("x-forwarded-for") || "127.0.0.1";

    const success = await ratelimit.limit(ip);

    if (!success) {
        return redirect("/too-fast");
    }


    try {
      // Check if the user already exists
      const existingUser = await db
        .select()
        .from(users)
        .where(eq(users.email, email))
        .limit(1);
  
      if (existingUser.length > 0) {
        return { success: false, error: "User Already exists" };
      }
  
      // Hash the password
      const hashedPassword = await hash(password, 10);
  
      // Insert the new user
      await db.insert(users).values({
        fullName,
        email,
        universityId,
        password: hashedPassword,
        universityCard,
      });
  
      // Automatically sign in the user
      await signInWithCredentials({ email, password });
  
      return { success: true };
    } catch (error) {
      console.error("SignUp Error:", error);
      return { success: false, error: "Failed to sign up. Please try again." };
    }
  };
  