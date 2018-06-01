import dotenv from 'dotenv'
dotenv.config()

if (!process.env.ZEPLIN_USERNAME || !process.env.ZEPLIN_PASSWORD) {
    throw new Error('You must define ZEPLIN_USERNAME and ZEPLIN_PASSWORD')
    exit(1)
}

export const config = {
    SERVER_PORT: process.env.PORT || 3000,
    MONGODB_URL: process.env.MONGODB_URL || 'mongodb://0.0.0.0/zeplin-crawler',
    ZEPLIN_USERNAME: process.env.ZEPLIN_USERNAME,
    ZEPLIN_PASSWORD: process.env.ZEPLIN_PASSWORD,
    CRAWLER_TIMEOUT: 15000,
}

export default config
