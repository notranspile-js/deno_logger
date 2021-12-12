Deno Logger Utility
===================

Thin wrapper over Deno [std/log](https://deno.land/std/log) that looks for handlers, that support [flush](https://doc.deno.land/https://deno.land/std@0.117.0/log/handlers.ts/~/FileHandler#flush) and calls it after each message. Uses default logger - `log.getLogger()`.

Logging needs to be configured the usual way before using this wrapper, `std/log` module is reexported from this library and
needs to be used to have `std/log` version used by application to be the same as one used by this wrapper.

Usage example
-------------

```
import { log, logger } from "https://deno.land/x/notranspile_logger@1.0.0/mod.ts"

// standard logging setup
await log.setup({
  handlers: {
    file: new log.handlers.FileHandler("DEBUG", {
      filename: "path/to/myapp.log",
    }),
  },

  loggers: {
    default: {
      level: "DEBUG",
      handlers: ["file"],
    },
  },
});

// "DEBUG foo" will be written to myapp.log immediately
logger.debug("foo");
```

License information
-------------------

This project is released under the [Apache License 2.0](http://www.apache.org/licenses/LICENSE-2.0).