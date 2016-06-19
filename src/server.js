import app from './server/app';
import { watchIndex, watchClient } from './application';
import loadConfig from './core/configuration';
import createLogger from './server/logger';

export function run({ env, onStart, rootDir }) {
  const config = loadConfig({ env, rootDir });
  const logger = createLogger({ config });
  let dependencies = {};

  logger.info('It all started when they descended to the Piraeus...');

  function onFirstBuildFinish(appTree) {
    dependencies.appTree = appTree;

    const server = app({ config, dependencies, logger });

    server.listen(config.port, function () {
      logger.info(`server[port]: ${config.port}`);
      logger.info('server[code]: loaded');
      if (onStart) onStart(server);
    });
  }

  function onBuildFinish(appTree) {
    dependencies.appTree = appTree;
    logger.info('server[code]: reloaded');
  }

  function onClientBuildFinish(clientPath) {
    logger.info('client[code]: reloaded');
  }

  watchIndex({ config, logger, onFirstBuildFinish, onBuildFinish });
  watchClient({ config, logger, onBuildFinish: onClientBuildFinish });
}
