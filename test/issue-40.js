import readInstalled from '../read-installed.js';
import { test } from 'tap';
import { join } from 'path';
import { fileURLToPath } from 'url';
const __dirname = fileURLToPath(new URL('.', import.meta.url));
test('prerelease packages should not be marked invalid', function(t) {
  readInstalled(
    join(__dirname, 'fixtures/issue-40'),
    { log: console.error },
    function(err, map) {
      t.equal(map.dependencies.fake.version, '0.1.0-2');
      t.notOk(map.dependencies.fake.invalid);
      t.end();
    }
  );
});
