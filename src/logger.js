import winston from 'winston'

const { format } = winston

const logger = winston.createLogger({
    format: format.combine(
        format.align(),
        format.timestamp(),
        format.simple(),
        format.printf(info => `${info.timestamp} ${info.level}: ${info.message}`)
    ),
    transports: [
        new winston.transports.File({ filename: 'error.log', level: 'error' }),
        // new winston.transports.File({ filename: 'combined.log', level: 'info' })
    ]
})

if (process.env.NODE_ENV !== 'production') {
    logger.add(new winston.transports.Console({
        level: 'debug',
        format: format.combine(
            format.colorize(),
            format.align(),
            format.timestamp(),
            format.simple(),
            format.printf(info => `${info.timestamp} ${info.level}: ${info.message}`)
        )
    }))
}

export default logger
