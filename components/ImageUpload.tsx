"use client"
import { toast } from "@/hooks/use-toast";
import config from "@/lib/config";
import { cn } from "@/lib/utils";
import { error } from "console";
import ImageKit from "imagekit";
import { IKImage, ImageKitProvider, IKUpload, } from "imagekitio-next";
import Image from "next/image";
import { useRef, useState } from "react";

const{
    env:{
        imageKit:{publicKey, urlEndpoint},
    },
} = config;

const authenticator = async()=>{
    try {
        const response = await fetch(`${config.env.apiEndpoint}/api/auth/imagekit`);

        if (!response.ok) {
            const errorText = await response.text();

            throw new Error(
                `Request failedwith status ${response.status}: ${errorText}`,
            );
        }

        const data = await response.json();

        const {signature, expire, token} = data;
        return{ token, expire, signature};
        
    } catch (error: any) {
        throw new Error(`Authencation request Failed ${error.message}`);
    }
}

const ImageUpload = ({
    onFileChange,
}:{
    onFileChange: (filePath: string)=> void;
}) => {
    const IKUploadRef = useRef(null);
    const [file, setFile] = useState<{ filePath: string} | null>(null);

    const onError = (error:any)=>{
        console.log(error);

        toast({
            title:"Image upload failed",
            description: "Your Image Could not be Uploaded Please Try again",
            variant: "destructive"
        })
    };
    const onSuccess = (res: any)=>{
        setFile(res);
        onFileChange(res.filePath);

        toast({
            title:`${res.filePath} uploaded Succesfully`,
            description: `Your ${res.filePath} Uploaded Successfully.`,
        });
    };
  return (
    <ImageKitProvider
        publicKey={publicKey}
        urlEndpoint={urlEndpoint}
        authenticator={authenticator}
    >

        <IKUpload 
            className="hidden"
            ref={IKUploadRef}
            onError={onError}
            onSuccess={onSuccess}
            fileName="text-upload.png"
        />

        <button
            className="upload-btn"
            onClick={(e)=>{
                e.preventDefault();

                if(IKUploadRef.current){
                    // @ts-ignore
                    IKUploadRef.current?.click();
                }
            }}
        >
            <Image
                src="/icons/upload.svg"
                alt="upload-icon"
                width={20}
                height={20}
                className="object-contain"
            />
            <p className="text-base">Upload file</p>
            {file && <p className="upload-filename">{file.filePath}</p>}
        </button>
        {file && (
                <IKImage
                    alt={file.filePath}
                    path={file.filePath}
                    width={500}
                    height={300}
                />
            )}
    </ImageKitProvider>
  )
}

export default ImageUpload