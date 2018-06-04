import winston from 'winston'

const { format } = winston

const logger = winston.createLogger({
    format: format.combine(
        format.align(),
        format.timestamp(),
        format.printf(info => `${info.timestamp} ${info.level}: ${info.message}`)
    ),
    transports: [
        new winston.transports.File({ filename: 'error.log', level: 'error' }),
        new winston.transports.Console({
            level: 'debug',
            format: format.combine(
                format.colorize(),
                format.align(),
                format.timestamp(),
                format.printf(info => `${info.timestamp} ${info.level}: ${info.message}`)
            )
        })
    ]
})

export default logger
