import readInstalled from "../read-installed.js";
import { test } from 'tap';
import { resolve } from 'path';
import { writeFileSync, symlinkSync } from 'fs';
import { sync } from 'mkdirp';
import { sync as _sync } from 'rimraf';
import { fileURLToPath } from 'url';

const __dirname = fileURLToPath(new URL('.', import.meta.url));

const root = resolve(__dirname, 'root');
const pkg = resolve(root, 'pkg');
const pkgnm = resolve(pkg, 'node_modules');
const linkdepSrc = resolve(root, 'linkdep');
const linkdepLink = resolve(pkgnm, 'linkdep');
const devdep = resolve(linkdepSrc, 'node_modules', 'devdep');

function pjson (dir, data) {
  sync(dir)
  const d = resolve(dir, 'package.json');
  writeFileSync(d, JSON.stringify(data))
}

test('setup', function (t) {
  _sync(root)
  pjson(pkg, {
    name: 'root',
    version: '1.2.3',
    dependencies: {
      linkdep: ''
    }
  })
  pjson(linkdepSrc, {
    name: 'linkdep',
    version: '1.2.3',
    devDependencies: {
      devdep: ''
    }
  })
  pjson(devdep, {
    name: 'devdep',
    version: '1.2.3'
  })

  sync(pkgnm)
  symlinkSync(linkdepSrc, linkdepLink, 'dir')

  t.end()
})

test('basic', function (t) {
  readInstalled(pkg, { dev: true }, function (er, data) {
    const dd = data.dependencies.linkdep.dependencies.devdep;
    t.notOk(dd.extraneous, 'linked dev dep should not be extraneous')
    t.end()
  })
})

test('cleanup', function (t) {
  _sync(root)
  t.end()
})
