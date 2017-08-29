
let texts = null;

export function init(cb) {
    $.getJSON("assets/locale/en.json", function(json) {
        texts = json;
        cb()
    });
}

export function getText(key, params = {}): string {
    if (!texts[key]) {
        return key;
    }
    
    let str = texts[key];

    for (let p in params) {
        let sign = "%(" + p + ")s";
        str = str.replace(sign, params[p]);
    }

    return str;
}