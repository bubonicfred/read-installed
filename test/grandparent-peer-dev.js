import readInstalled from '../read-installed.js';
import { test } from 'tap';
import { join } from 'path';
import { fileURLToPath } from 'url';
const __dirname = fileURLToPath(new URL('.', import.meta.url));
function allValid(t, map) {
  const deps = Object.keys(map.dependencies || {});
  deps.forEach(function (dep) {
    t.ok(map.dependencies[dep].extraneous, `dependency ${dep} of ${map.name} is extraneous`)
  })
}

test('grandparent dev peer dependencies should be extraneous', function(t) {
  readInstalled(
    join(__dirname, 'fixtures/grandparent-peer-dev'),
    { log: console.error },
    function(err, map) {
      allValid(t, map)
      t.end()
    })
})
