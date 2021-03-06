import coreLogger from '../core/logger';

export default function logger({ config }) {
  const logger = coreLogger({ config });

  logger.stream = {
    write: function (message, encoding) {
      logger.info(`server[http]: ${message.trim()}`);
    }
  };

  return logger;
}
