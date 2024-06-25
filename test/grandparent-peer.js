import readInstalled from '../read-installed.js';
import { test } from 'tap';
import { join } from 'path';
import { fileURLToPath } from 'url';
const __dirname = fileURLToPath(new URL('.', import.meta.url));
function allValid(t, map) {
  const deps = Object.keys(map.dependencies || {});
  deps.forEach(function (dep) {
    t.notOk(map.dependencies[dep].invalid, `dependency ${dep} of ${map.name} is not invalid`)
    t.notOk(typeof map.dependencies[dep] === 'string', `dependency ${dep} of ${map.name} is not missing`)
  })
  deps.forEach(function (dep) {
    allValid(t, map.dependencies[dep])
  })
}

test('grandparent can satisfy peer dependencies', function(t) {
  readInstalled(
    join(__dirname, 'fixtures/grandparent-peer'),
    { log: console.error },
    function(err, map) {
      allValid(t, map)
      t.end()
    })
})
