import readInstalled from '../read-installed.js';
import { test } from 'tap';
import { join } from 'path';
import { fileURLToPath } from 'url';
const __dirname = fileURLToPath(new URL('.', import.meta.url));
test('"latest" version is valid', function(t) {
  // This test verifies npm#3860
  readInstalled(
    join(__dirname, 'fixtures/peer-at-latest'),
    { log: console.error },
    function(err, map) {
      t.notOk(map.dependencies.debug.invalid, 'debug@latest is satisfied by a peer')
      t.end()
    })
})
