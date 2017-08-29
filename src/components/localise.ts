
let texts = null;

export function init() {
    $.getJSON("assets/locale/en.json", function(json) {
        texts = json;
    });
}

export function getText(key): string {
    if (texts[key]) {
        return texts[key];
    }
    
    return key;
}