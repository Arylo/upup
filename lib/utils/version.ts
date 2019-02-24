interface IVersion {
    major: number;
    minor: number;
    patch: number;
}

export function parse(ver: string) {
    return ver
        .split(".")
        .map((item) => parseInt(item, 10))
        .reduce<IVersion>(
            (obj, num, index) => {
                switch (index) {
                    case 0:
                        obj.major = num;
                        break;
                    case 1:
                        obj.minor = num;
                        break;
                    case 2:
                        obj.patch = num;
                        break;
                }
                return obj;
            },
            { major: 0, minor: 0, patch: 0 }
        );
}

export function stringify(verObj: IVersion) {
    return `${verObj.major}.${verObj.minor}.${verObj.patch}`;
}
