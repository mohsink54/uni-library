"use client";

import { toast } from "@/hooks/use-toast";
import { borrowBook } from "@/lib/actions/book";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Button } from "./ui/button";
import Image from "next/image";


interface Props {
    userId: string;
    bookId: string;
    borrowingEligibility: {
        isEligible: boolean;
        message: string;
    };
}

const BorrowBook = ({
    userId,
    bookId,
    borrowingEligibility: {isEligible, message},
}: Props) => {
    
    const router = useRouter();
    const [borrowing, setBorrowing] = useState(false);

    const handleBorrowBook = async()=>{
        if (!isEligible) {
            toast({
                title: "Error",
                description: message,
                variant: "destructive",
            });
        }

        setBorrowing(true)

        try {
            const result = await borrowBook({userId, bookId});

            if (result.success) {
                toast({
                    title: "Success",
                    description: "Book Borrowed Successfully",
                });

                router.push("/")
            }else{
                toast({
                    title: "Error",
                    description: result.error,
                    variant: "destructive",
                });
            }
        } catch (error) {
            toast({
                title: "Error",
                description: "An Error occured while borrowing the book",
                variant: "destructive",
            })
        }finally{
            setBorrowing(false);
        }
    }

  return (
    <Button
        className="book-overview_btn"
        onClick={handleBorrowBook}
        disabled={borrowing}
    >
        <Image src="/icons/book.svg" alt="book" width={20} height={20} />
        <p className="font-bebas-neue text-xl text-dark-100">
            {borrowing ? "Borrowing..." : "Borrow Book"}
        </p>
    </Button>
  )
}

export default BorrowBook