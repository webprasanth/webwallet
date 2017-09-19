
let texts = null;

export function init(cb) {
    let id_lang = localStorage.getItem('id_lang');
    if(!id_lang) {
      id_lang = 'en';
    }
    let lang_file = "assets/locale/" + id_lang +".json";
    $.getJSON(lang_file, function(json) {
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
