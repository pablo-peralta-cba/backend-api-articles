import { createLogger, format, transports } from 'winston';

const logger = createLogger({
  level: 'info',
  format: format.combine(
    format.timestamp(),
    format.printf(({ level, message, timestamp, ...metadata }) => {
        const stringifiedMetadata = Object.keys(metadata).length ? JSON.stringify(metadata) : '';
      return `[${timestamp}] ${level.toUpperCase()}: ${message} ${stringifiedMetadata}`;
    })
  ),
  transports: [
    new transports.Console(),
  ],
});

export default logger;
