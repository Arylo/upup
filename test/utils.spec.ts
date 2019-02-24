import test from "ava";
import { argv, md5, version } from "./../lib/utils";

test("MD5 Utils", (t) => {
    t.true(typeof md5 === "object");
    t.true(typeof md5.file === "function");
    t.true(typeof md5.str === "function");
});

test("Version Utils", (t) => {
    t.true(typeof version === "object");
    t.true(typeof version.parse === "function");
    t.true(typeof version.stringify === "function");
});

test("Argv Utils #0", (t) => {
    t.true(typeof argv === "object");
    t.true(typeof argv.parse === "function");
});

test("Argv Utils #1", (t) => {
    t.true(Array.isArray(argv.parse(process.argv, {})["--"]));
    const obj = argv.parse("node upup --aaa test --bbb 123 -c".split(" "), {
        aaa: {
            key: "--aaa",
            type: "string"
        },
        bbb: {
            key: "--bbb",
            type: "number"
        },
        c: {
            key: "-c",
            type: "boolean"
        }
    });
    t.deepEqual(obj, {
        "--": [],
        "aaa": "test",
        "bbb": 123,
        "c": true
    });
});

test("Argv Utils #2", (t) => {
    t.true(Array.isArray(argv.parse(process.argv, {})["--"]));
    const obj = argv.parse("node upup --aaa 123 --bbb 123 --ccc t".split(" "), {
        aaa: {
            key: "--aaa",
            type: "string"
        },
        bbb: {
            key: "--bbb",
            type: "number"
        },
        ccc: {
            key: "--ccc",
            type: "number"
        }
    });
    t.deepEqual(obj, {
        "--": ["--ccc", "t"],
        "aaa": "123",
        "bbb": 123
    });
});
