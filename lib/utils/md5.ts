import * as crypto from "crypto";
import * as fs from "fs";

const BUFFER_SIZE = 8192;

export function file(path: fs.PathLike) {
    const fd = fs.openSync(path.toString(), "r");
    const hash = crypto.createHash("md5");
    const buffer = Buffer.alloc(BUFFER_SIZE);

    try {
        let bytesRead;

        do {
            bytesRead = fs.readSync(fd, buffer, 0, BUFFER_SIZE, null);
            hash.update(buffer.slice(0, bytesRead));
        } while (bytesRead === BUFFER_SIZE);
    } finally {
        fs.closeSync(fd);
    }

    return hash.digest("hex");
}

export function str(text: string) {
    const hash = crypto.createHash("md5");
    hash.update(text);
    return hash.digest("hex");
}
