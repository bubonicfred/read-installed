import readInstalled from "../read-installed.js";
import { test } from "tap";
import { join } from "path";
import { fileURLToPath } from 'url';
const __dirname = fileURLToPath(new URL('.', import.meta.url));
test("extraneous detected", function(t) {
  // This test verifies read-installed#16
  readInstalled(
    join(__dirname, "fixtures/extraneous-dev-dep"),
    {
      log: console.error,
      dev: true
    },
    function (err, map) {
      t.error(err, "read-installed made it")

      t.notOk(map.dependencies.d.extraneous, "d is not extraneous, it's required by root")
      t.ok(map.dependencies.x.extraneous, "x is extraneous, it's only a dev dep of d")
      t.end()
    })
})
