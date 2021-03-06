/*
 * Copyright 2021, alex at staticlibs.net
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import { log } from "./deps.ts";

function logAndFlush(level: number, msg: string) {

  // get logger
  const logger = log.getLogger();

  // log
  switch (level) {
    case log.LogLevels.DEBUG: {
      logger.debug(msg);
      break;
    }
    case log.LogLevels.ERROR: {
      logger.error(msg);
      break;
    }
    case log.LogLevels.INFO: {
      logger.info(msg);
      break;
    }
    case log.LogLevels.WARNING: {
      logger.warning(msg);
      break;
    }
    default: throw new Error(`Invalid level, value: [${level}]`);
  }

  // flush
  for (const handler of logger.handlers) {

    let hasFlush = false;
    // https://stackoverflow.com/a/31055217
    let proto = handler;
    do {
      const props = Object.getOwnPropertyNames(proto);
      if (props.includes("flush")) {
        hasFlush = true;
        break;
      }
    } while (null != (proto = Object.getPrototypeOf(proto)));

    if (hasFlush) {
      const obj = handler as unknown as Record<string, () => void>;
      try {
        obj.flush();
      } catch(e) {
        console.error(e.stack);
        logger.critical(e.stack);
      }
    }
  }

}

export default {

  debug(msg: string) {
    logAndFlush(log.LogLevels.DEBUG, msg);
  },

  error(msg: string) {
    logAndFlush(log.LogLevels.ERROR, msg);
  },

  info(msg: string) {
    logAndFlush(log.LogLevels.INFO, msg);
  },

  warning(msg: string) {
    logAndFlush(log.LogLevels.WARNING, msg);
  }

}
