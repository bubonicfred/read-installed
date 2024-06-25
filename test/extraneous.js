import readInstalled from '../read-installed.js';
import { test } from 'tap';
import { join } from 'path';
import { fileURLToPath } from 'url';
const __dirname = fileURLToPath(new URL('.', import.meta.url));
test('extraneous detected', function(t) {
  // This test verifies read-installed#16
  readInstalled(
    join(__dirname, 'fixtures/extraneous-detected'),
    { log: console.error },
    function(err, map) {
      t.ok(map.dependencies.foo.extraneous, 'foo is extraneous, it\'s not required by any module')
      t.ok(map.dependencies.bar.extraneous, 'bar is extraneous, it\'s not required by any module')
      t.notOk(map.dependencies.asdf.extraneous, 'asdf is not extraneous, it\'s required by ghjk')
      t.notOk(map.dependencies.ghjk.extraneous, 'ghjk is not extraneous, it\'s required by our root module')
      t.end()
    })
})
