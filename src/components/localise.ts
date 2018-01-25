let texts = null;
let texts_default = null;

export function init(cb) {
  let id_lang = localStorage.getItem('id_lang');
  if (!id_lang || id_lang == 'en') {
    id_lang = 'en-v1.1';
  }

  //load english file default, if some localization is not available, we will use English words
  let lang_file_default = 'assets/locale/en-v1.1.json';
  $.getJSON(lang_file_default, function(json) {
    texts_default = json;
  });

  let lang_file = 'assets/locale/' + id_lang + '.json';
  $.getJSON(lang_file, function(json) {
    texts = json;
    cb();
  });
}

export function getText(key, params = {}): string {
  let str = '';
  if (!texts[key]) {
    if (!texts_default[key])
      //check if default text is available
      return key;
    str = texts_default[key];
  } else str = texts[key];

  for (let p in params) {
    let sign = '%(' + p + ')s';
    str = str.replace(sign, params[p]);
  }

  return str;
}
