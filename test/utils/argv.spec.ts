import test from "ava";
import { argv } from "../../lib/utils";

test("Argv Utils #0", (t) => {
    t.true(typeof argv === "object");
    t.true(typeof argv.parse === "function");
    t.true(Array.isArray(argv.parse(process.argv, {})["--"]));
});

test("Argv Utils #1", (t) => {
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

test("Argv -- ways", (t) => {
    let obj = argv.parse("node upup aaa -- bbb".split(" "), {});
    t.deepEqual(obj, {
        "--": ["bbb"]
    });
    obj = argv.parse("node upup aaa bbb".split(" "), {});
    t.deepEqual(obj, {
        "--": ["aaa", "bbb"]
    });
});
