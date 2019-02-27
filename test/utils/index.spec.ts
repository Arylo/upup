import test from "ava";
import { argv, md5, version } from "../../lib/utils";

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
