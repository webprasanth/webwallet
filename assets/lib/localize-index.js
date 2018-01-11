var textsIndex = null;

function initIndexLocal(cb) {
    var id_lang = localStorage.getItem('id_lang');
    if(!id_lang || id_lang == 'en') {
      id_lang = 'en-v1.1';
    }
    var lang_file = "assets/locale/" + id_lang +".json";
    /*$.getJSON(lang_file, function(json) {
        textsIndex = json;
    });*/
	
	$.ajax({
	  url: lang_file,
	  dataType: 'json',
	  async: false,
	  data: {},
	  success: function(json) {
		textsIndex = json;
	  }
	});
}

function writeTextIndexLocale(key, params = {}, returnStr = false) {
	
	//setTimeout(function(){ 
		if (!textsIndex[key]) {
			if(!returnStr)
				document.write(key);
			else
			return key;
		}

		var str = textsIndex[key];

		for (let p in params) {
			var sign = "%(" + p + ")s";
			str = str.replace(sign, params[p]);
		}

		if(!returnStr)
			document.write(str);
		else
			return str;
	
	//}, 2000);
}
