import winston from 'winston'
import chalk from 'chalk'

const paint = (kind, message) => {
    const painter = {
        error: chalk.red,
        warn: chalk.yellow,
        workflowLog: chalk.blue
    }[kind]

    if (painter) {
        return painter(message)
    }
    return message
}


export const logger = winston.createLogger({
    format: winston.format.printf((info) => {
        return paint(info.level, `${info.message}`)
    }),
    transports: [ new winston.transports.Console({ level: process.env.DEBUG === '1' ?  'debug' : 'info' }) ],
})

export const workflowLogger = winston.createLogger({
    format: winston.format.printf((info) => {
        let logMessage = `${info.message}`
        if (info.pod) {
            logMessage = `[${info.pod}] ${logMessage}`
        }
        return paint('workflowLog', logMessage)
    }),
    transports: [ new winston.transports.Console() ],
})