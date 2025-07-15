import { createLogger, format, transports } from 'winston'
import DailyRotateFile from 'winston-daily-rotate-file'

const env = process.env.NODE_ENV || 'development'

const logger = createLogger({
    level: env === 'development' ? 'debug' : 'info',
    format: format.combine(
        format.timestamp(),
        format.errors({ stack: true }),
        format.printf(({ timestamp, level, message, stack, ...meta }) => {
            let log = `${timestamp} ${level}: ${message}`
            if (stack) {
                log += `\nStack: ${stack}`
            }
            if (Object.keys(meta).length > 0) {
                log += `\nMeta: ${JSON.stringify(meta)}`
            }
            return log
        })
    ),
    transports: [
        // Konsol çıktısı için
        // Eğer konsol çıktısı isteniyorsa, aşağıdaki satırı açabilirsiniz.

        // new transports.Console({
        //     format: env === 'development'
        //         ? format.combine(format.colorize(), format.simple())
        //         : format.combine(format.uncolorize())
        // }),
        
        new DailyRotateFile({
            filename: 'logs/application-%DATE%.log',
            datePattern: 'YYYY-MM-DD',
            zippedArchive: true,
            maxSize: '20m'
        })
    ]
})

// Seviyelere göre fonksiyonlar
const defaultLogger = {
    info: (msg, meta) => logger.info(msg, meta),
    error: (msg, meta) => logger.error(msg instanceof Error ? msg.message : msg, { ...meta, stack: msg instanceof Error ? msg.stack : undefined }),
    warn: (msg, meta) => logger.warn(msg, meta),
    debug: (msg, meta) => logger.debug(msg, meta),
    stream: {
        write: (message) => logger.info(message.trim())
    }
}

export default defaultLogger