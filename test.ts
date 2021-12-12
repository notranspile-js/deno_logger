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

import { log, logger } from "./mod.ts";
import { assert, assertEquals, path } from "./test_deps.ts";

Deno.test("logger test", async () => {
  const dir = await Deno.makeTempDir();
  const file = path.join(dir, "test_log.txt");

  await log.setup({
    handlers: {
      file: new log.handlers.RotatingFileHandler("DEBUG", {
        filename: file,
        maxBackupCount: 1,
        maxBytes: 1024 * 1024
      }),
    },

    loggers: {
      default: {
        level: "DEBUG",
        handlers: ["file"],
      },
    },
  });

  assertEquals((await Deno.stat(file)).size, 0);

  logger.debug("foo");

  let logged = false;
  for (let i = 0; i < (1 << 16); i++) {
    const size = (await Deno.stat(file)).size;
    if (size > 0) {
      logged = true;
      break;
    }
  }

  assert(logged);

  const msg = await Deno.readTextFile(file);
  assert(msg.startsWith("DEBUG foo"));

  {
    // prevent fsFile leak in deno test
    const ha = log.getLogger().handlers[0] as unknown as Record<string, unknown>;
    const fi = ha._file as Record<string, unknown>;
    Deno.close(fi.rid as number);
    fi.close = () => {};
  }

  await Deno.remove(dir, {
    recursive: true,
  });
});
