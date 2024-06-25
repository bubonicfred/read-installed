import readInstalled from "../read-installed.js";
import { test } from "tap";
import { join } from "path";
import { fileURLToPath } from 'url';
const __dirname = fileURLToPath(new URL('.', import.meta.url));
test("Handle bad path", function (t) {
  readInstalled(join(__dirname, "../unknown"), {
    dev: true,
    log: console.error
  }, function (er, map) {
      t.notOk(er, "er should be null");
      t.ok(map, "map should be data");
      t.equal(Object.keys(map.dependencies).length, 0, "Dependencies should have no keys");
      if (er) return console.error(er.stack || er.message);
      t.end();
  });
});
