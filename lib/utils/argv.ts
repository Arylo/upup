interface IParseArgvOptions {
    [key: string]: {
        key: string;
        type: "string" | "number" | "boolean";
        msg?: string;
        [k: string]: any;
    };
}

type ttoType<T extends "string" | "number" | "boolean"> = T extends "string"
    ? string
    : T extends "number"
    ? number
    : T extends "boolean"
    ? boolean
    : any;
type tPAO = IParseArgvOptions;
type tArgvObj<T extends IParseArgvOptions> = {
    [P in keyof T]?: ttoType<T[P]["type"]>
};

export function parse<T extends tPAO>(argvs: string[], conf: T) {
    let argv = argvs.slice(2);
    let index = -1;
    const obj = {};
    for (const key of Object.keys(conf)) {
        const c = conf[key];
        switch (c.type) {
            case "boolean":
                index = argv.indexOf(c.key);
                if (index === -1) {
                    break;
                }
                obj[key] = true;
                argv = argv.filter((_, i) => i !== index);
                break;
            case "number":
                index = argv.indexOf(c.key);
                if (
                    index === -1 ||
                    !argv[index + 1] ||
                    !/^-?\d+$/.test(argv[index + 1])
                ) {
                    break;
                }
                obj[key] = parseInt(argv[index + 1], 10);
                argv = argv.filter((_, i) => i !== index && i !== index + 1);
                break;
            case "string":
                index = argv.indexOf(c.key);
                if (index === -1 || !argv[index + 1]) {
                    break;
                }
                obj[key] = argv[index + 1];
                argv = argv.filter((_, i) => i !== index && i !== index + 1);
                break;
        }
    }

    return Object.assign({ "--": argv }, obj as tArgvObj<T>);
}
