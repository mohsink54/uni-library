import config from "@/lib/config";
import ImageKit from "imagekit";
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

const getImagekit = () => {
    const { publicKey, privateKey, urlEndpoint } = config.env.imageKit;

    if (!publicKey || !privateKey || !urlEndpoint) {
        throw new Error("ImageKit credentials are not configured");
    }

    return new ImageKit({ publicKey, privateKey, urlEndpoint });
};

export async function GET() {
    try {
        const imagekit = getImagekit();
        return NextResponse.json(imagekit.getAuthenticationParameters());
    } catch (error) {
        return NextResponse.json(
            {
                error: error instanceof Error ? error.message : "ImageKit authentication failed",
            },
            { status: 500 }
        );
    }
}