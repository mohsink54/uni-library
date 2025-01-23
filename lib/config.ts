const config = {
    env: {
        apiEndpoint: process.env.NEXT_PUBLIC_API_ENDPOINT!,
        prodApiEndpoint: process.env.NEXT_PUBLIC_PROD_API_ENDPOINT!,
        imageKit: {
            publicKey: process.env.NEXT_PUBLIC_IMAGEKIT_PUBLIC_KEY!,
            urlEndpoint: process.env.NEXT_PUBLIC_IMAGEKIT_URL_ENDPOINT!,
            privateKey: process.env.IMAGEKIT_PRIVATE_KEY!,
        },
        databaseUrl: process.env.DATABASE_URL!,
        upstash:{
            redisUrl : process.env.UPSTASH_REDIS_URL!,
            redisToken: process.env.UPSTASH_REDIS_TOKEN!,
            qstashUrl: process.env.QSTASH_URL!,
            qstashToken: process.env.QSTASH_TOKEN!,
        },
        sendemail:{
            emailService: process.env.EMAIL_SERVICE!,
            emailTemplate: process.env.EMAIL_TEMPLATE!,
            emailPublic: process.env.EMAIL_PUBLIC_KEY!,
        }
    },
};

export default config;