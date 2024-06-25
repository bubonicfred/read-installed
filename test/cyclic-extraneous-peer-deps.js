import { test } from "tap";
import { sync } from "mkdirp";
import { sync as _sync } from "rimraf";
import { writeFileSync } from "fs";
import { resolve } from "path";
import { fileURLToPath } from 'url';
const __dirname = fileURLToPath(new URL('.', import.meta.url));
import readInstalled from "../read-installed.js";

const parent = {
  name: "parent",
  version: "1.2.3",
  dependencies: {},
  devDependencies: {
    "child1":"*"
  },
  readme:"."
};

const child1 = {
  name: "child1",
  version: "1.2.3",
  peerDependencies: {
    child2: "*"
  },
  readme:"."
};

const child2 = {
  name: "child2",
  version: "1.2.3",
  peerDependencies: {
    child1: "*"
  },
  readme:"."
};


const root = resolve(__dirname, "cyclic-extraneous-peer-deps");
const parentjson = resolve(root, "package.json");
const child1root = resolve(root, "node_modules/child1");
const child1json = resolve(child1root, "package.json");
const child2root = resolve(root, "node_modules/child2");
const child2json = resolve(child2root, "package.json");

test("setup", function (t) {
  _sync(root)
  sync(child1root)
  sync(child2root)
  writeFileSync(parentjson, `${JSON.stringify(parent, null, 2)}\n`, "utf8")
  writeFileSync(child1json, `${JSON.stringify(child1, null, 2)}\n`, "utf8")
  writeFileSync(child2json, `${JSON.stringify(child2, null, 2)}\n`, "utf8")
  t.pass("setup done")
  t.end()
})

test("dev mode", function (t) {
  // peer dev deps should both be not extraneous.
  readInstalled(root, { dev: true }, function (er, data) {
    if (er)
      throw er
    t.notOk(data.dependencies.child1.extraneous, "c1 not extra")
    t.notOk(data.dependencies.child2.extraneous, "c2 not extra")
    t.end()
  })
})

test("prod mode", function (t) {
  readInstalled(root, { dev: false }, function (er, data) {
    if (er)
      throw er
    t.ok(data.dependencies.child1.extraneous, "c1 extra")
    t.ok(data.dependencies.child2.extraneous, "c2 extra")
    t.end()
  })
})


test("cleanup", function (t) {
  _sync(root)
  t.pass("cleanup done")
  t.end()
})
