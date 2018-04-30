var textsIndex = null;
var textsIndex_default = null;

function initIndexLocal(cb) {
    var id_lang = localStorage.getItem('id_lang');
    if(!id_lang || id_lang == 'en') {
      id_lang = 'en-v1.1';
    }
    var lang_file = "assets/locale/" + id_lang +".json";
    var lang_file_default = "assets/locale/en-v1.1.json";
    /*$.getJSON(lang_file, function(json) {
        textsIndex = json;
    });*/

    $.ajax({
	  url: lang_file_default,
	  dataType: 'json',
	  async: false,
	  data: {},
	  success: function(json) {
		textsIndex_default = json;
	  }
	});
	//console.log(lang_file);
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
		var str = '';
		if (!textsIndex[key]) {
			if (!textsIndex_default[key])	//check if default text is available
			{
				if(!returnStr)
					document.write(key);
				else
				return key;
			}
			str = textsIndex_default[key];
		}
		else
			str = textsIndex[key];

		

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
