var alert = console.log;

function destroyClickedElement(event) {
	document.body.removeChild(event.target);
}

function saveBinaryFile(byteArray, fileName) {
    var u8 = new Int8Array(byteArray);
    var dataFileAsBlob = new Blob([u8], {type: 'application/octet-stream'}); /*'application/x-msdownload'*/
    var downloadLink = document.createElement("a");
    downloadLink.download = fileName;
    downloadLink.innerHTML = "Download Binary File";
    if (window.webkitURL) {
		// Chrome allows the link to be clicked
		// without actually adding it to the DOM.
		downloadLink.href = window.webkitURL.createObjectURL(dataFileAsBlob);
    }
    else {
		// Firefox requires the link to be added to the DOM
		// before it can be clicked.
		downloadLink.href = window.URL.createObjectURL(dataFileAsBlob);
		downloadLink.onclick = destroyClickedElement;
		downloadLink.style.display = "none";
		document.body.appendChild(downloadLink);
    }
    downloadLink.click();
}

function errorHandler(evt) {
	switch(evt.target.error.code) {
		case evt.target.error.NOT_FOUND_ERR:
			alert('File Not Found!');
			break;
		case evt.target.error.NOT_READABLE_ERR:
			alert('File is not readable');
			break;
		case evt.target.error.ABORT_ERR:
			break; // noop
		default:
			alert('An error occurred reading this file.');
	};
}

function loadBinaryFile(inputFileElementId, call_back) {
	var file = document.getElementById(inputFileElementId).files[0];
	var reader = new FileReader();
	reader.onerror = errorHandler;
	reader.onload = function(event) {
		call_back(new Int8Array(event.target.result));
	};
	reader.readAsArrayBuffer(file);
}

function ByteArray2IntArray(ba) {
	var	len = ba.length,
		ia = [];
	for (var i=0; i<len; i++) {
		 ia[i] = ba[i] & 0xFF; // Optimize from (ba[i]<0)? 256+ba[i] : ba[i];
	}
	return ia;
};

Math.logBase = function(val, base) {
	return Math.log(val) / Math.log(base);
};

Math.log10 = function(val) {
	return Math.log(val) / Math.LN10;
};

Math.log2 = function(val) {
	return Math.log(val) / Math.LN2;
};

Math.fact = function(n) {						/* n! */
	var f = 1;
	for (var i=2; i<=n; i++) f *= i;
	return f;
};

Math.log2Fact = function(n) {					/* log2(n!) */
	var result = 0;
	for (var i=2; i<=n; i++) result += Math.log2(i);
	return result;
};

Math.log2InvFact = function(n) {				/* log2(1/n!) */
	var result = 0;
	for (var i=2; i<=n; i++) result -= Math.log2(i);
	return result;
};

Math.log2POfN = function(N) {					/* log2(P_N) : logarit base 2 of the permute of N things */
	return Math.log2Fact(N);
};

Math.log2CkOfN = function(k, N) {				/* log2(C^k_N) : logarit base 2 of the combination of k things on N things */
	return Math.log2FactDivFact([N],[k,N-k]);
};

Math.log2FactDivFact = function(arr1, arr2) {	/* log2( (arr1[0]! x arr1[1]! x ...) / (arr2[0]! x arr2[1]! x ...) ) */
	var result = 0;
	for (var i=arr1.length-1; i>=0; i--) result += Math.log2Fact(arr1[i]);
	for (var i=arr2.length-1; i>=0; i--) result -= Math.log2Fact(arr2[i]);
	return result;
};

Array.prototype.readInt = function() {
	return (this.splice(0,1)[0] << 24) | (this.splice(0,1)[0] << 16) | (this.splice(0,1)[0] << 8) | this.splice(0,1)[0];
};

Array.prototype.readShort = function() {
	return (this.splice(0,1)[0] << 8) | this.splice(0,1)[0];
};

Array.prototype.readByte = function() {
	return this.splice(0,1)[0] & 0xFF;
};

Array.prototype.readBoolean = function() {
	return this.splice(0,1)[0] != 0;
};

Array.prototype.readUTF = function() {
	var len = this.read();
	var str = [];
	for (var i=0; i<len; i++)
		str.push(String.fromCharCode(this.readShort()));
	return str.join("");
};

Array.prototype.read = function(arr) {
	if (arr) {
		for (var i=0; i<arr.length; i++) {
			arr[i] = this.splice(0,1)[0];
		}
	} else {
		return this.splice(0,1)[0];
	}
};

Array.prototype.toHexString = function(len) {
	var s = [];
	if (!len) {
		for (var i=0; i<this.length; i++) {
			s.push(this[i].toString(16));
		}
	} else {
		for (var i=0; i<this.length; i++) {
			var tmp = this[i].toString(16);
			if (tmp.length > len) {
				throw Exception.invalid("Cannot parse to hex string with format " + len + " chars.");
			} else {
				for (var j=len-tmp.length; j>0; j--) {
					s.push("0");
				}
				s.push(tmp);
			}
		}
	}
	return s.join("");
};

Array.prototype.toString = function(base, len) {
	var s = ["["];
	if (!len) {
		for (var i=0; i<this.length; i++) {
			var tmp = this[i].toString(base);
			if (base==16) s.push("0x");
			s.push(tmp);
			if (i<this.length-1) s.push(",");
		}
	} else {
		for (var i=0; i<this.length; i++) {
			var tmp = this[i].toString(base);
			if (tmp.length > len) {
				throw Exception.invalid("Cannot parse to string with format " + len + " chars.");
			} else {
				if (base==16) s.push("0x");
				for (var j=len-tmp.length; j>0; j--) {
					s.push("0");
				}
				s.push(tmp);
				if (i<this.length-1) s.push(",");
			}
		}
	}
	s.push("]");
	return s.join("");
};

function arraysCopyOf(arr, newLength) {
	var zero = [];
	if (newLength > arr.length) {
		var result = arr.slice(0);
		for (var i=newLength-arr.length; i>0; i--)
			result.push(0);
		return result;
	}
	return arr.slice(0, newLength);
};

function arraysCopyOfRange(arr, from, to) {
	var zero = [], arrLength = arr.length;
	if (from > to) return null;
	var result = arr.slice(from,to);
	if (from >= arrLength || to >= arrLength) {
		for (var i=to-from-result.length; i>0; i--)
			result.push(0);
	}
	return result;
};

function arrayShuffle(arr, rng) {
	var i, j, t;
	if (!rng) {
		for (i = 1; i < arr.length; i++) {
			j = Math.floor(Math.random()*(1+i));	// choose j in [0..i]
			if (j != i) {
				t = arr[i];
				arr[i] = arr[j];
				arr[j] = t;
			}
		}
	} else {
		for (i = 1; i < arr.length; i++) {
			j = rng.nextInt(1+i);					// choose j in [0..i]
			if (j != i) {
				t = arr[i];
				arr[i] = arr[j];
				arr[j] = t;
			}
		}
	}
};

function arraysEquals(a,b) { return !(a<b || b<a); };

var Base64 = {
 
	_keyStr : "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=",

	_id : {"A":0,"B":1,"C":2,"D":3,"E":4,"F":5,"G":6,"H":7,
		"I":8,"J":9,"K":10,"L":11,"M":12,"N":13,"O":14,"P":15,
		"Q":16,"R":17,"S":18,"T":19,"U":20,"V":21,"W":22,"X":23,
		"Y":24,"Z":25,"a":26,"b":27,"c":28,"d":29,"e":30,"f":31,
		"g":32,"h":33,"i":34,"j":35,"k":36,"l":37,"m":38,"n":39,
		"o":40,"p":41,"q":42,"r":43,"s":44,"t":45,"u":46,"v":47,
		"w":48,"x":49,"y":50,"z":51,"0":52,"1":53,"2":54,"3":55,
		"4":56,"5":57,"6":58,"7":59,"8":60,"9":61,"+":62,"/":63,"=":64},
 
	encode : function (input) {
		var output = "";
		var chr1, chr2, chr3, enc1, enc2, enc3, enc4;
		var i = 0;
 
		input = Base64._utf8_encode(input);
 
		while (i < input.length) {
 
			chr1 = input.charCodeAt(i++);
			chr2 = input.charCodeAt(i++);
			chr3 = input.charCodeAt(i++);
 
			enc1 = chr1 >> 2;
			enc2 = ((chr1 & 3) << 4) | (chr2 >> 4);
			enc3 = ((chr2 & 15) << 2) | (chr3 >> 6);
			enc4 = chr3 & 63;
 
			if (isNaN(chr2)) {
				enc3 = enc4 = 64;
			} else if (isNaN(chr3)) {
				enc4 = 64;
			}
			output = output +
			Base64._keyStr.charAt(enc1) + Base64._keyStr.charAt(enc2) +
			Base64._keyStr.charAt(enc3) + Base64._keyStr.charAt(enc4);
 
		}
 
		return output;
	},
 
	decode : function (input) {
		var output = "";
		var chr1, chr2, chr3;
		var enc1, enc2, enc3, enc4;
		var i = 0;
 
		input = input.replace(/[^A-Za-z0-9\+\/\=]/g, "");
 
		while (i < input.length) {
 
			enc1 = Base64._id[input.charAt(i++)];
			enc2 = Base64._id[input.charAt(i++)];
			enc3 = Base64._id[input.charAt(i++)];
			enc4 = Base64._id[input.charAt(i++)];
 
			chr1 = (enc1 << 2) | (enc2 >> 4);
			chr2 = ((enc2 & 15) << 4) | (enc3 >> 2);
			chr3 = ((enc3 & 3) << 6) | enc4;
 
			output = output + String.fromCharCode(chr1);
 
			if (enc3 != 64) {
				output = output + String.fromCharCode(chr2);
			}
			if (enc4 != 64) {
				output = output + String.fromCharCode(chr3);
			}
 
		}
 
		output = Base64._utf8_decode(output);
 
		return output;
 
	},
 
	_utf8_encode : function (string) {
		string = string.replace(/\r\n/g,"\n");
		var utftext = "";
 
		for (var n = 0; n < string.length; n++) {
 
			var c = string.charCodeAt(n);
 
			if (c < 128) {
				utftext += String.fromCharCode(c);
			}
			else if((c > 127) && (c < 2048)) {
				utftext += String.fromCharCode((c >> 6) | 192);
				utftext += String.fromCharCode((c & 63) | 128);
			}
			else {
				utftext += String.fromCharCode((c >> 12) | 224);
				utftext += String.fromCharCode(((c >> 6) & 63) | 128);
				utftext += String.fromCharCode((c & 63) | 128);
			}
 
		}
 
		return utftext;
	},
 
	_utf8_decode : function (utftext) {
		var string = "";
		var i = 0;
		var c = c1 = c2 = 0;
 
		while ( i < utftext.length ) {
 
			c = utftext.charCodeAt(i);
 
			if (c < 128) {
				string += String.fromCharCode(c);
				i++;
			}
			else if((c > 191) && (c < 224)) {
				c2 = utftext.charCodeAt(i+1);
				string += String.fromCharCode(((c & 31) << 6) | (c2 & 63));
				i += 2;
			}
			else {
				c2 = utftext.charCodeAt(i+1);
				c3 = utftext.charCodeAt(i+2);
				string += String.fromCharCode(((c & 15) << 12) | ((c2 & 63) << 6) | (c3 & 63));
				i += 3;
			}
 
		}
 
		return string;
	},
 
	fromByteArray : function (input) {
		var output = [];
		var chr1, chr2, chr3, enc1, enc2, enc3, enc4;
		var i = 0;
 
		while (i < input.length) {
 
			chr1 = input[i++];
			chr2 = input[i++];
			chr3 = input[i++];
 
			enc1 = chr1 >> 2;
			enc2 = ((chr1 & 3) << 4) | (chr2 >> 4);
			enc3 = ((chr2 & 15) << 2) | (chr3 >> 6);
			enc4 = chr3 & 63;
 
			if (isNaN(chr2)) {
				enc3 = enc4 = 64;
			} else if (isNaN(chr3)) {
				enc4 = 64;
			}
			arrayAppend(output,[Base64._keyStr.charAt(enc1), Base64._keyStr.charAt(enc2),
				Base64._keyStr.charAt(enc3), Base64._keyStr.charAt(enc4)]);
 
		}
 
		return output.join('');
	},
 
	toByteArray : function (input) {
		var output = [];
		var chr1, chr2, chr3;
		var enc1, enc2, enc3, enc4;
		var i = 0;
 
		input = input.replace(/[^A-Za-z0-9\+\/\=]/g, "");
 
		while (i < input.length) {
 
			enc1 = Base64._id[input.charAt(i++)];
			enc2 = Base64._id[input.charAt(i++)];
			enc3 = Base64._id[input.charAt(i++)];
			enc4 = Base64._id[input.charAt(i++)];
 
			chr1 = (enc1 << 2) | (enc2 >> 4);
			chr2 = ((enc2 & 15) << 4) | (enc3 >> 2);
			chr3 = ((enc3 & 3) << 6) | enc4;
 
			output.push(chr1);
 
			if (enc3 != 64) {
				output.push(chr2);
			}
			if (enc4 != 64) {
				output.push(chr3);
			}
 
		}
 
		return output;
 
	}
 
};

/** Base128
 * Exclude: \x20( ), \x22("), \x27('), \x2C(,), \x2E(.), \x3B(;), \x5C(\), \x7F(DEL) => 128 - 32 - 8 = 88 characters
 * Include: \xB3 -> \xDA => 218 - 179 + 1 = 40 characters
 * => We have 128 character & Set \x2E(.) to be stop-character like "=" in Base64
**/
var Base128 = {
 
	_keyStr :     "\x21" +"\x23\x24\x25\x26" +"\x28\x29\x2A\x2B" +"\x2D" +"\x2F"
			+ "\x30\x31\x32\x33\x34\x35\x36\x37\x38\x39\x3A" +"\x3C\x3D\x3E\x3F"
			+ "\x40\x41\x42\x43\x44\x45\x46\x47\x48\x49\x4A\x4B\x4C\x4D\x4E\x4F"
			+ "\x50\x51\x52\x53\x54\x55\x56\x57\x58\x59\x5A\x5B" +"\x5D\x5E\x5F"
			+ "\x60\x61\x62\x63\x64\x65\x66\x67\x68\x69\x6A\x6B\x6C\x6D\x6E\x6F"
			+ "\x70\x71\x72\x73\x74\x75\x76\x77\x78\x79\x7A\x7B\x7C\x7D\x7E"
			+             "\xB3\xB4\xB5\xB6\xB7\xB8\xB9\xBA\xBB\xBC\xBD\xBE\xBF"
			+ "\xC0\xC1\xC2\xC3\xC4\xC5\xC6\xC7\xC8\xC9\xCA\xCB\xCC\xCD\xCE\xCF"
			+ "\xD0\xD1\xD2\xD3\xD4\xD5\xD6\xD7\xD8\xD9\xDA"
			+ "\x2E",

	_id : {             "\x21":  0,             "\x23":  1, "\x24":  2, "\x25":  3, "\x26":  4,             "\x28":  5, "\x29":  6, "\x2A":  7, "\x2B":  8,             "\x2D":  9,             "\x2F": 10,
			"\x30": 11, "\x31": 12, "\x32": 13, "\x33": 14, "\x34": 15, "\x35": 16, "\x36": 17, "\x37": 18, "\x38": 19, "\x39": 20, "\x3A": 21,             "\x3C": 22, "\x3D": 23, "\x3E": 24, "\x3F": 25,
			"\x40": 26, "\x41": 27, "\x42": 28, "\x43": 29, "\x44": 30, "\x45": 31, "\x46": 32, "\x47": 33, "\x48": 34, "\x49": 35, "\x4A": 36, "\x4B": 37, "\x4C": 38, "\x4D": 39, "\x4E": 40, "\x4F": 41,
			"\x50": 42, "\x51": 43, "\x52": 44, "\x53": 45, "\x54": 46, "\x55": 47, "\x56": 48, "\x57": 49, "\x58": 50, "\x59": 51, "\x5A": 52, "\x5B": 53,             "\x5D": 54, "\x5E": 55, "\x5F": 56,
			"\x60": 57, "\x61": 58, "\x62": 59, "\x63": 60, "\x64": 61, "\x65": 62, "\x66": 63, "\x67": 64, "\x68": 65, "\x69": 66, "\x6A": 67, "\x6B": 68, "\x6C": 69, "\x6D": 70, "\x6E": 71, "\x6F": 72,
			"\x70": 73, "\x71": 74, "\x72": 75, "\x73": 76, "\x74": 77, "\x75": 78, "\x76": 79, "\x77": 80, "\x78": 81, "\x79": 82, "\x7A": 83, "\x7B": 84, "\x7C": 85, "\x7D": 86, "\x7E": 87,
			                                    "\xB3": 88, "\xB4": 89, "\xB5": 90, "\xB6": 91, "\xB7": 92, "\xB8": 93, "\xB9": 94, "\xBA": 95, "\xBB": 96, "\xBC": 97, "\xBD": 98, "\xBE": 99, "\xBF":100,
			"\xC0":101, "\xC1":102, "\xC2":103, "\xC3":104, "\xC4":105, "\xC5":106, "\xC6":107, "\xC7":108, "\xC8":109, "\xC9":110, "\xCA":111, "\xCB":112, "\xCC":113, "\xCD":114, "\xCE":115, "\xCF":116,
			"\xD0":117, "\xD1":118, "\xD2":119, "\xD3":120, "\xD4":121, "\xD5":122, "\xD6":123, "\xD7":124, "\xD8":125, "\xD9":126, "\xDA":127,
			"\x2E":128
	},
 
	fromByteArray : function (input) {
		var output = [];
		var chr1, chr2, chr3, chr4, chr5, chr6, chr7, enc1, enc2, enc3, enc4, enc5, enc6, enc7, enc8;
		var i = 0;
 
		while (i < input.length) {
 
			chr1 = input[i++];
			chr2 = input[i++];
			chr3 = input[i++];
			chr4 = input[i++];
			chr5 = input[i++];
			chr6 = input[i++];
			chr7 = input[i++];
 
			enc1 = chr1 >> 1;
			enc2 = ((chr1 &  1) << 6) | (chr2 >> 2);
			enc3 = ((chr2 &  3) << 5) | (chr3 >> 3);
			enc4 = ((chr3 &  7) << 4) | (chr4 >> 4);
			enc5 = ((chr4 & 15) << 3) | (chr5 >> 5);
			enc6 = ((chr5 & 31) << 2) | (chr6 >> 6);
			enc7 = ((chr6 & 63) << 1) | (chr7 >> 7);
			enc8 = chr7 & 127;
 
			if (i > input.length) {
				if (isNaN(chr2)) {
					enc3 = enc4 = enc5 = enc6 = enc7 = enc8 = 128;
				} else if (isNaN(chr3)) {
					enc4 = enc5 = enc6 = enc7 = enc8 = 128;
				} else if (isNaN(chr4)) {
					enc5 = enc6 = enc7 = enc8 = 128;
				} else if (isNaN(chr5)) {
					enc6 = enc7 = enc8 = 128;
				} else if (isNaN(chr6)) {
					enc7 = enc8 = 128;
				} else if (isNaN(chr7)) {
					enc8 = 128;
				}
			}
			arrayAppend(output,[
				Base128._keyStr.charAt(enc1), Base128._keyStr.charAt(enc2),
				Base128._keyStr.charAt(enc3), Base128._keyStr.charAt(enc4),
				Base128._keyStr.charAt(enc5), Base128._keyStr.charAt(enc6),
				Base128._keyStr.charAt(enc7), Base128._keyStr.charAt(enc8)
			]);
 
		}
 
		return output.join('');
	},
 
	toByteArray : function (input) {
		var output = [];
		var chr1, chr2, chr3, chr4, chr5, chr6, chr7;
		var enc1, enc2, enc3, enc4, enc5, enc6, enc7, enc8;
		var i = 0;
 
		while (i < input.length) {
 
			enc1 = Base128._id[input.charAt(i++)];
			enc2 = Base128._id[input.charAt(i++)];
			enc3 = Base128._id[input.charAt(i++)];
			enc4 = Base128._id[input.charAt(i++)];
			enc5 = Base128._id[input.charAt(i++)];
			enc6 = Base128._id[input.charAt(i++)];
			enc7 = Base128._id[input.charAt(i++)];
			enc8 = Base128._id[input.charAt(i++)];
 
			chr1 = (enc1 << 1) | (enc2 >> 6);
			chr2 = ((enc2 & 63) << 2) | (enc3 >> 5);
			chr3 = ((enc3 & 31) << 3) | (enc4 >> 4);
			chr4 = ((enc4 & 15) << 4) | (enc5 >> 3);
			chr5 = ((enc5 &  7) << 5) | (enc6 >> 2);
			chr6 = ((enc6 &  3) << 6) | (enc7 >> 1);
			chr7 = ((enc7 &  1) << 7) | enc8;
 
			output.push(chr1);
 
			if (enc3 != 128) {
				output.push(chr2);
			} else break;
			if (enc4 != 128) {
				output.push(chr3);
			} else break;
			if (enc5 != 128) {
				output.push(chr4);
			} else break;
			if (enc6 != 128) {
				output.push(chr5);
			} else break;
			if (enc7 != 128) {
				output.push(chr6);
			} else break;
 			if (enc8 != 128) {
				output.push(chr7);
			} else break;

		}
 
		return output;
 
	}
 
};

/**
 * Exception
 */
var Exception = {

	SHOW_ALERT: 1,

	/** @this {Element} */
    corrupt: function(message) {
		this.toString = function() { return this.message; };
		this.message = message;
		if (Exception.SHOW_ALERT) alert(this.toString());
    },

	/** @this {Element} */
    invalid: function(message) {
		this.toString = function() { return this.message; };
		this.message = message;
		if (Exception.SHOW_ALERT) alert(this.toString());
	}
	
};

function arrayAppend(dest, src) {
    for ( var i = 0; i < src.length; i++ ) {
        dest.push( src[i] );
    }
    return dest;
};

function string2JSON(str) {	// to fix a bug of invalid JSON of JSON.parse: like {hello:"world"} -> {'hello':"world"}
	try {
		return JSON.parse(JSON.stringify(eval("(" + str + ")")));
	} catch(e) {
		throw Exception.invalid("JSON is invalid, may be missing or corrupted.");
	}	
};

function UnicodeString2ByteArray(str, startPoint, endPoint) {
	if (Object.prototype.toString.call(str) === '[object Array]' && typeof str[0] == 'number') {
		return str.slice(0);	// str is already an array
	}
	var arr = [];
	startPoint = startPoint || 0;
	endPoint = endPoint || str.length;
	for (var i=startPoint; i < endPoint; i++) {
		arr.push(str.charCodeAt(i) >>> 8);
		arr.push(str.charCodeAt(i) & 0xFF);
	}
	return arr;
};

function ByteArray2UnicodeString(arr, startPoint, endPoint) {
	if (typeof arr == 'string') {
		return arr;	// arr is already a string
	}
	var str = [];
	startPoint = startPoint || 0;
	endPoint = endPoint || arr.length;
	for (var i=startPoint; i < endPoint; i+=2) {
		str.push(String.fromCharCode(arr[i] << 8 | arr[i+1]));
	}
	return str.join('');
};

function ASCIIString2ByteArray(str, startPoint, endPoint) {
	if (Object.prototype.toString.call(str) === '[object Array]' && typeof str[0] == 'number') {
		return str.slice(0);	// str is already an array
	}
	var arr = [];
	startPoint = startPoint || 0;
	endPoint = endPoint || str.length;
	for (var i=startPoint; i < endPoint; i++) {
		arr.push(str.charCodeAt(i) & 0xFF);
	}
	return arr;
};

function ByteArray2ASCIIString(arr, startPoint, endPoint) {
	if (typeof arr == 'string') {
		return arr;	// arr is already a string
	}
	var str = [];
	startPoint = startPoint || 0;
	endPoint = endPoint || arr.length;
	for (var i=startPoint; i < endPoint; i++) {
		str.push(String.fromCharCode(arr[i] & 0xFF));
	}
	return str.join('');
};

function XorByteArray(a1, a2, startPoint, endPoint) {
	var a3 = [], a1Len = a1.length, a2Len = a2.length;
	startPoint = startPoint || 0;
	endPoint = endPoint || ((a1Len > a2Len) ? a1Len : a2Len);
	for (var i=startPoint; i < endPoint; i++) {
		a3.push(a1[i]^a2[i]);
	}
	return a3;
};

function Salt(byteSize) {
	var arr = [];
	for (var i=0; i<byteSize; i++) {
		arr.push(Math.floor(Math.random()*0xFF));
	}
	return arr;
};

function NewFilledArray(len, val) {
    var rv = new Array(len);
    while (--len >= 0) {
        rv[len] = val;
    }
    return rv;
};

// Convert BOM (result of FileReader.readAsBinaryString) to byte-array
// Reference:
//	http://www.unicode.org/faq//utf_bom.html#BOM
//	http://stackoverflow.com/questions/3146483/html5-file-api-read-as-text-and-binary)
// function BOM2ByteArray(str, startPoint, endPoint) {
	// var arr = [];
	// startPoint = startPoint || 0;
	// endPoint = endPoint || str.length;
	// for (var i=startPoint; i < endPoint; i++) {
		// arr.push(str.charCodeAt(i));
	// }
	// return arr;
// };
Xaes.MaxN = 5;

Xaes.P = [
	[
		[
			[0x03,0x01,0x01,0x02],
			[0x0b,0x0d,0x09,0x0e]
		],
		[
			[0x05,0x03,0x05,0x04,0x03,0x02,0x02,0x01],
			[0xb3,0x39,0x9a,0xa1,0xdb,0x54,0x46,0x2a]
		],
		[
			[0x07,0x09,0x04,0x09,0x08,0x03,0x02,0x08,0x06,0x04,0x04,0x01,0x08,0x03,0x06,0x05],
			[0x1e,0xbc,0x55,0x8d,0x1a,0x37,0x97,0x10,0xf0,0xd5,0x01,0xad,0x59,0x82,0x59,0x3a]
		],
		[
			[0x6b,0x7d,0x53,0x1d,0x40,0x52,0x1a,0x7c,0x5f,0x53,0x23,0x74,0x46,0x35,0x63,0x1a,0x45,0x2d,0x6e,0x17,0x2c,0x12,0x50,0x7a,0x4a,0x49,0x38,0x79,0x69,0x6d,0x37,0x29],
			[0x2b,0x60,0x76,0x84,0xd9,0x47,0x19,0x9f,0xcb,0x1c,0xef,0xfb,0x6d,0xc5,0x2d,0xe1,0xd4,0x9c,0x35,0x53,0x64,0x2f,0xa2,0x25,0x70,0x43,0x17,0xbc,0x8f,0x22,0x42,0xa9]
		]
	],
	[
		[
			[0x03,0x01,0x01,0x02],
			[0x0b,0x0d,0x09,0x0e]
		],
		[
			[0x04,0x01,0x05,0x02,0x06,0x05,0x03,0x03],
			[0x80,0x28,0x9d,0x58,0xc2,0x7c,0xdb,0x09]
		],
		[
			[0x12,0x0b,0x16,0x18,0x0a,0x10,0x06,0x16,0x11,0x0c,0x06,0x0e,0x1c,0x05,0x07,0x02],
			[0x2f,0xfd,0x6b,0x9a,0xbf,0x12,0xf0,0xba,0xb7,0x94,0x3a,0x48,0x8a,0xa9,0x21,0x0e]
		],
		[
			[0x36,0x05,0x36,0x61,0x56,0x27,0x36,0x68,0x4f,0x06,0x78,0x24,0x76,0x4d,0x5c,0x04,0x6a,0x2c,0x3b,0x02,0x78,0x19,0x55,0x47,0x25,0x1a,0x21,0x74,0x68,0x76,0x40,0x71],
			[0x85,0x45,0x37,0x2f,0xe8,0x44,0xbc,0x2c,0xd9,0xba,0x04,0x90,0x3e,0xbb,0x55,0xbd,0xcb,0xda,0x91,0x54,0x76,0xc4,0xc1,0xad,0x15,0x11,0xae,0x0e,0x75,0x18,0x91,0x3c]
		]
	]
];

/**
 * @constructor
 */
function Xaes(key, ip, ar, qm, gs) {
    this._precompute(key, ip, ar, qm, gs);
};

Xaes.getAvailableKeyBitSizes = function() {
	var availableKeyBitSizes = [];
	for (var N=2; N <= Xaes.MaxN; N++)
		for (var k=1; k <= 2; k+=0.5)
			availableKeyBitSizes.push(k * (1<<2*N+3));
	return availableKeyBitSizes;
};

Xaes.getAvailableKeyByteSizes = function() {
	var availableKeyByteSizes = [];
	for (var N=2; N <= Xaes.MaxN; N++)
		for (var k=1; k <= 2; k+=0.5)
			availableKeyByteSizes.push(k * (1<<2*N));
	return availableKeyByteSizes;
};

/** private */
Xaes.STR_KEYLENGTH_WARNING_MESSAGE	= "You're using a none-recommend key size. Key bit size must be 2^(2N+3) x K, where (" + (Xaes.MaxN+1) + " > N > 1) and (K = 1 or K = 1.5 or K = 2).";
/** private */
Xaes.STR_ADDROUND_ERROR_MESSAGE		= "You cannont use a negative additional-round number, because of decreasing the safety of algorithm. It should be greater than or equal 0.";
/** private */
Xaes.STR_POLYNOMIAL_ERROR_MESSAGE	= "Cannot determine the polymomial to use in MixColumns.";
/** private */
Xaes.STR_KEYSIZE_ERROR_MESSAGE		= "Key bit size must be 2^(2N+3) x K, where (" + (Xaes.MaxN+1) + " > N > 1) and (K = 1 or K = 1.5 or K = 2).";
/** private */
Xaes.STR_KEY_TOO_LONG_ERROR_MESSAGE	= "Key size must be equal or less than " + (1<<(2*Xaes.MaxN+1)) + " bytes (" + (1<<(2*Xaes.MaxN+4)) + " bits).";

/** private */
Xaes.GFMulTable	= [];		// Precompute multiply table on GF.

/** private */
Xaes.BuildGFMulTable = function() {
	var a, b ,p, counter, hi_bit_set;
	for (var i=0; i<0x100; i++) {
		for (var j=i; j<0x100; j++) {
			a = i; b = j; p = 0;
			for (counter = 0; counter < 8; counter++) {
				if ((b & 1) != 0)
					p ^= a;
				hi_bit_set = a & 0x80;
				a <<= 1;
				if (hi_bit_set != 0)
					a ^= 0x1b; /* x^8 + x^4 + x^3 + x + 1 */
				b >>= 1;
			}
			Xaes.GFMulTable[i<<8|j] = Xaes.GFMulTable[j<<8|i] = (p & 0xFF);
		}
	}
};
Xaes.BuildGFMulTable();

/** private */
Xaes.Sbox		= [];		// Substitution box.
/** private */
Xaes.iSbox		= [];		// Inverse Substitution box.

/** private */
Xaes.BuildSboxAndInvSbox = function() {
	var d = [], th = [], s, x, xInv, x2 = 0;
	
	// Compute double and third tables
	for (var i = 0; i < 256; i++) {
		th[( d[i] = i<<1 ^ (i>>7)*283 )^i]=i;
	}

	for (x = xInv = 0; !Xaes.Sbox[x]; x ^= x2 || 1, xInv = th[xInv] || 1) {
		// Compute sbox
		s = xInv ^ xInv << 1 ^ xInv << 2 ^ xInv << 3 ^ xInv << 4;
		s = s >> 8 ^ s & 255 ^ 99;
		Xaes.Sbox[x] = s;
		Xaes.iSbox[s] = x;
		x2 = d[x];
	}
};
Xaes.BuildSboxAndInvSbox();

/** private */
Xaes.GraySbox		= [			// Gray Substitution box.
	0x63, 0x7c, 0x7b, 0x77, 0x6f, 0xc5, 0x6b, 0xf2, 0xfe, 0xd7, 0x76, 0xab, 0x67, 0x2b, 0x01, 0x30,
	0xad, 0xd4, 0xaf, 0xa2, 0x72, 0xc0, 0xa4, 0x9c, 0xfa, 0x59, 0xf0, 0x47, 0xc9, 0x7d, 0x82, 0xca,
	0x04, 0xc7, 0xc3, 0x23, 0x05, 0x9a, 0x96, 0x18, 0xeb, 0x27, 0x75, 0xb2, 0x80, 0xe2, 0x12, 0x07,
	0x34, 0xa5, 0xf1, 0xe5, 0x31, 0x15, 0xd8, 0x71, 0x36, 0x3f, 0xcc, 0xf7, 0x93, 0x26, 0xfd, 0xb7,
	0xd0, 0xef, 0xfb, 0xaa, 0x33, 0x85, 0x4d, 0x43, 0x50, 0x3c, 0xa8, 0x9f, 0x02, 0x7f, 0xf9, 0x45,
	0xbc, 0xb6, 0x21, 0xda, 0xf3, 0xd2, 0xff, 0x10, 0x92, 0x9d, 0xf5, 0x38, 0x40, 0x8f, 0xa3, 0x51,
	0x53, 0xd1, 0xed, 0x00, 0xb1, 0x5b, 0xfc, 0x20, 0x4a, 0x4c, 0xcf, 0x58, 0xbe, 0x39, 0xcb, 0x6a,
	0x52, 0x3b, 0xb3, 0xd6, 0x2f, 0x84, 0xe3, 0x29, 0x1b, 0x6e, 0xa0, 0x5a, 0x2c, 0x1a, 0x83, 0x09,
	0xba, 0x78, 0x2e, 0x25, 0xb4, 0xc6, 0xa6, 0x1c, 0x4b, 0xbd, 0x8a, 0x8b, 0x74, 0x1f, 0xdd, 0xe8,
	0x61, 0x35, 0xb9, 0x57, 0x1d, 0x9e, 0xc1, 0x86, 0x48, 0x03, 0x0e, 0xf6, 0xb5, 0x66, 0x3e, 0x70,
	0x8c, 0xa1, 0x0d, 0x89, 0x42, 0x68, 0xe6, 0xbf, 0xb0, 0x54, 0x16, 0xbb, 0x2d, 0x0f, 0x99, 0x41,
	0x9b, 0x1e, 0xe9, 0x87, 0x28, 0xdf, 0x55, 0xce, 0x69, 0xd9, 0x94, 0x8e, 0x98, 0x11, 0xf8, 0xe1,
	0xe0, 0x32, 0x0a, 0x3a, 0x24, 0x5c, 0x06, 0x49, 0x91, 0x95, 0x79, 0xe4, 0xac, 0x62, 0xd3, 0xc2,
	0x6c, 0x56, 0xea, 0xf4, 0xae, 0x08, 0x7a, 0x65, 0x8d, 0xd5, 0xa9, 0x4e, 0x37, 0x6d, 0xc8, 0xe7,
	0x60, 0x81, 0xdc, 0x4f, 0x90, 0x88, 0x2a, 0x22, 0xde, 0x5e, 0xdb, 0x0b, 0xb8, 0x14, 0xee, 0x46,
	0xc4, 0xa7, 0x3d, 0x7e, 0x19, 0x73, 0x5d, 0x64, 0x5f, 0x97, 0x17, 0x44, 0x13, 0xec, 0x0c, 0xcd
];
/** private */
Xaes.iGraySbox		= [];		// Inverse Gray Substitution box.

/** private */
Xaes.BuildInvGraySbox = function() {
	for (var i = 0; i < 256; i++) {
		Xaes.iGraySbox[Xaes.GraySbox[i]] = i;
	}
};
Xaes.BuildInvGraySbox();


Xaes.prototype = {

	debug: 0,

    /*********************************** ASSERT ***********************************/

	/** private */
	assert: function(boo, str) {
		if (!boo) {
			throw Exception.invalid(str);
		}
	},

    /*********************************** LOG ***********************************/

	/** private */
	logHexArray: function(caption, arr, start, end, width) {
		if (!this.debug) return;
		var result = "";
		for (var i = start; i < end; i++) {
			var str = arr[i].toString(16);
			var z = 2 - str.length + 1;
			if (z > 0) {
				str = Array(z).join("0") + str;
			}
			if ((i>0)&&(i-start)%width===0) {
				result += "\n";
			}
			result += str;
		}
		var seperator = ((width==null)||(end - start > width)) ? "\n" : " ";
		console.log(caption + seperator + result);
	},

    /*********************************** DECLARATION ***********************************/

	/** private */
    Nw:		0,		// No.byte in a Word. Is 2^N where Xaes.MaxN+1 > N > 1.
	/** private */
    Nb:		0,		// No.word in a Data-Block (State). Is 2^N x K, where (Xaes.MaxN+1 > N > 1) and (K = 1 or K = 1.5 or K = 2).
	/** private */
    Nk:		0,		// No.word in Key. Is 2^N x K, where (Xaes.MaxN+1 > N > 1) and (K = 1 or K = 1.5 or K = 2).
	/** private */
    Nr:		0,		// No.rounds of encryption in algorithm.

	/** private */
    R:		0,		// No.additional-rounds of encryption in algorithm for safer. R >= 0.

	/** private */
    A:		[],		// The polynomial that used in MixColumns.
	/** private */
	iA:		[],		// The polynomial that used in inverse MixColumns.

	/** private */
    key:	[],		// The seed key.
	/** private */
    w:		[],		// Key Schedule array.
	/** private */
    Rcon:	[],		// Round constants.
	/** private */
    State:	[],		// State matrix.
	
	/** private */
    Sbox:	[],		// Substitution box.
	/** private */
    iSox:	[],		// Inverse Substitution box.

	/** 
	* Precompute for encryption/decryption
	* @param {String} key
	* @param {int} ip the index of polynomial that used
	* @param {int} ar the additional-round
	* @param {boo} qm use quick mode (less rounds) or not
	* @param {boo} gs use Gray-Sbox or not
	* @return {Array of Bytes}
	*/
	_precompute: function(key, ip, ar, qm, gs) {
    	this.R = ar || 0;              // No.additional-rounds of encryption in algorithm for safer
    	this.assert(this.R >= 0, Xaes.STR_ADDROUND_ERROR_MESSAGE);
        
        this.SetNbNkNr(key.length, qm);
		
		this.ChooseSbox(gs);
		
		if (this.debug) console.log("key.length=" + key.length + "bytes=" + (key.length*8) + "bits, Nw=" + this.Nw + ", Nk=" + this.Nk + ", Nb=" + this.Nb + ", Nr=" + this.Nr + ", ip=" + ip + ", ar=" + ar + ", qm=" + qm + ", gs=" + gs);

		this.ChoosePolynomial(ip);

        // convert key to byte[]
    	this.key = key.slice(0);

        this.BuildRcon();
        this.KeyExpansion();
	},	// _precompute()

	/** private */
    ChooseSbox: function(gs) {
		if (gs || false) {
			this.Sbox = Xaes.GraySbox;
			this.iSbox = Xaes.iGraySbox;
		} else {
			this.Sbox = Xaes.Sbox;
			this.iSbox = Xaes.iSbox;
		}		
	},
	
	/** private */
    ChoosePolynomial: function(ip) {
		var i = ip || 0;
    	this.assert(i >= 0, Xaes.STR_POLYNOMIAL_ERROR_MESSAGE);
		var c = -2, Nw = this.Nw;
		while ((Nw&1) == 0) {
			c++;
			Nw >>= 1;
		}
		this.A = Xaes.P[i][c][0];
		this.iA = Xaes.P[i][c][1];
	},
	
	/** private */
    SetNbNkNr: function(keyByteSize, isQuickMode) {

    	var findNw = 2;
        while (findNw * findNw <= keyByteSize) {
            this.Nw = findNw;                           // No.byte in a Word
            findNw *= 2;
        }

        this.Nk = parseInt(keyByteSize / this.Nw);                // No.word in Key

        // FOR TESTING: BEGIN
        this.assert(keyByteSize <= (1<<(2*Xaes.MaxN+1)), Xaes.STR_KEY_TOO_LONG_ERROR_MESSAGE);
        this.assert(this.Nk * this.Nw == keyByteSize, Xaes.STR_KEYSIZE_ERROR_MESSAGE);
        this.assert(this.Nk / this.Nw == 1 || this.Nk / this.Nw == 1.5 || this.Nk / this.Nw == 2, Xaes.STR_KEYLENGTH_WARNING_MESSAGE);
        // FOR TESTING: END

        this.Nb = this.Nk;                              // No.word in a Data-Block (State)

		if (isQuickMode || false) {
			this.Nr = 2*Math.ceil(2*(this.Nk/this.Nw)) + 8 + this.R;   // No.rounds of encryption in algorithm
		} else {
			this.Nr = this.Nk + 6 + this.R;   // No.rounds of encryption in algorithm
		}

    },  // SetNbNkNr()

	/** private */
    BuildRcon: function() {
        this.Rcon[0] = 0x8d;
        for (var i=1; i< 256; i++) {
        	this.Rcon[i] = this.Rcon[i-1] << 1 ^ (this.Rcon[i-1] >> 7) * 283;
        }
    },  // BuildRcon()

	/** private */
    KeyExpansion: function() {

		var Nw = this.Nw, Nk = this.Nk, Nb = this.Nb, Nr = this.Nr;			// cache
	
        this.w = [];        // Nw columns of bytes corresponds to a words

        for (var row = 0; row < Nk; row++) {
            for (var b = 0; b < Nw; b++) {
                this.w[Nw * row + b] = this.key[Nw * row + b];
            }
        }

        var temp = [];

        for (var row = Nk; row < Nb * (Nr + 1); row++) {
            for (var b = 0; b < Nw; ++b) {
                temp[b] = this.w[Nw * (row - 1) + b];
            }

            if (row % Nk == 0) {
                temp = this.SubWord(this.RotWord(temp));
                temp[0] ^= this.Rcon[row / Nk];
            }
            else if (Nk > 6 && (row % Nk == 4)) {
                temp = this.SubWord(temp);
            }

            // w[row] = w[row-Nk] xor temp
            for (var b = 0; b < Nw; b++) {
                this.w[Nw * row + b] = this.w[Nw * (row - Nk) + b] ^ temp[b];
            }
        }   // for loop
		
		this.logHexArray("\nKeyExpansion:", this.w, 0, Nb * (Nr + 1) * Nw, Nw);
		
    },  // KeyExpansion()

	/** private */
    SubWord: function(word) {
		var Nw = this.Nw, Sbox = Xaes.Sbox;		// cache
    	var result = [];
        for (var b = 0; b < Nw; b++) {
            result[b] = Sbox[word[b]];
        }
        return result;
    },  // SubWord()

	/** private */
    RotWord: function(word) {
		var Nw = this.Nw;			// cache
    	var result = [];
        for (var b = 0; b < Nw - 1; b++) {
            result[b] = word[b + 1];
        }
        result[Nw - 1] = word[0];
        return result;
    },  // RotWord()

    /*********************************** GALOIS COMPUTING ***********************************/

    /* Add two numbers in a GF(2^8) finite field */
	/** private */
    gfadd: function(a, b) {
        return a ^ b;
    },

    /* Subtract two numbers in a GF(2^8) finite field */
	/** private */
    gfsub: function(a, b) {
        return a ^ b;
    },

    /* Multiply two numbers in the GF(2^8) finite field defined 
     * by the polynomial x^8 + x^4 + x^3 + x + 1 */
	/** private */
    gfmul: function(a, b) {
        return Xaes.GFMulTable[a<<8|b];
    },

    /*********************************** ENCRYPTION ***********************************/

	/** public */
    encrypt: function(data) {	// Encipher Nw x Nb bytes input
		var Nw = this.Nw, Nb = this.Nb, Nr = this.Nr;		// cache

        this.State = data.slice(0);

        this.assert(this.State.length == Nw * Nb, "Invalid data block size!");

		this.logHexArray("\nBegin:", this.State, 0, Nw * Nb, Nb);

		this.AddRoundKey(0);

		this.logHexArray("\nBegin AddRoundKey:", this.State, 0, Nw * Nb, Nb);

        for (var round = 1; round <= (Nr - 1); ++round) {     // Main round loop
            this.SubBytes();
			this.logHexArray("\ni = " + (round-1) + "\nSubBytes:", this.State, 0, Nw * Nb, Nb);
            
            this.ShiftRows();
			this.logHexArray("\nShiftRows:", this.State, 0, Nw * Nb, Nb);
            
            this.MixColumns();
			this.logHexArray("\nMixColumns:", this.State, 0, Nw * Nb, Nb);
            
            this.AddRoundKey(round);
			this.logHexArray("\nAddRoundKey:", this.State, 0, Nw * Nb, Nb);
        }   // Main round loop

        this.SubBytes();
		this.logHexArray("\nLast round:\nSubBytes:", this.State, 0, Nw * Nb, Nb);
		
        this.ShiftRows();
		this.logHexArray("\nShiftRows:", this.State, 0, Nw * Nb, Nb);
		
        this.AddRoundKey(Nr);
		this.logHexArray("\nAddRoundKey:", this.State, 0, Nw * Nb, Nb);

        // output = state
        return this.State;

    },  // encrypt()

	/** private */
    AddRoundKey: function(round) {
		var Nw = this.Nw, Nb = this.Nb;			// cache
        for (var c = 0; c < Nw; ++c) {
            for (var r = 0; r < Nb; ++r) {
                this.State[Nw * r + c] ^= this.w[Nw * (Nb * round + r) + c];
            }
        }
    },  // AddRoundKey()

	/** private */
    SubBytes: function() {
		var Nw = this.Nw, Nb = this.Nb;				// cache
        for (var i = 0; i < Nw * Nb; i++) {
        	this.State[i] = this.Sbox[this.State[i]];
        }
    },  // SubBytes    

	/** private */
    ShiftRows: function() {
		var Nw = this.Nw, Nb = this.Nb;				// cache
    	var temp = [];
        for (var i = 0; i < Nw * Nb; i++) {		// Copy State into temp[]
            temp[i] = this.State[i];
        }

        for (var r = 1; r < Nw; ++r) {			// Shift temp into State
            for (var c = 0; c < Nb; ++c) {
                this.State[r * Nb + c] = temp[r * Nb + ((c + r) % Nb)];
            }
        }
    },  // ShiftRows()

	/** private */
    MixColumns: function() {
		var Nw = this.Nw, Nb = this.Nb, A = this.A;				// cache
    	var temp = [];
        for (var c = 0; c < Nb; ++c) {
            for (var r = 0; r < Nw; ++r) {
                temp[r] = this.State[r * Nb + c];
            }

            switch (Nw) {
                case 4:
                    for (var r = 0; r < Nw; ++r) {
                        this.State[r * Nb + c] = 	this.gfmul(A[3], temp[r]) ^
                                                    this.gfmul(A[0], temp[(r + 1) % Nw]) ^
                                                    this.gfmul(A[1], temp[(r + 2) % Nw]) ^
                                                    this.gfmul(A[2], temp[(r + 3) % Nw]);
                    }
                    break;

                case 8:
                    for (var r = 0; r < Nw; ++r) {
                        this.State[r * Nb + c] = 	this.gfmul(A[7], temp[r]) ^
                                                    this.gfmul(A[0], temp[(r + 1) % Nw]) ^
                                                    this.gfmul(A[1], temp[(r + 2) % Nw]) ^
                                                    this.gfmul(A[2], temp[(r + 3) % Nw]) ^
                                                    this.gfmul(A[3], temp[(r + 4) % Nw]) ^
                                                    this.gfmul(A[4], temp[(r + 5) % Nw]) ^
                                                    this.gfmul(A[5], temp[(r + 6) % Nw]) ^
                                                    this.gfmul(A[6], temp[(r + 7) % Nw]);
                    }
                    break;

                case 16:
                    for (var r = 0; r < Nw; ++r) {
                        this.State[r * Nb + c] = 	this.gfmul(A[0xf], temp[r]) ^
                                                    this.gfmul(A[0x0], temp[(r + 1) % Nw]) ^
                                                    this.gfmul(A[0x1], temp[(r + 2) % Nw]) ^
                                                    this.gfmul(A[0x2], temp[(r + 3) % Nw]) ^
                                                    this.gfmul(A[0x3], temp[(r + 4) % Nw]) ^
                                                    this.gfmul(A[0x4], temp[(r + 5) % Nw]) ^
                                                    this.gfmul(A[0x5], temp[(r + 6) % Nw]) ^
                                                    this.gfmul(A[0x6], temp[(r + 7) % Nw]) ^
                                                    this.gfmul(A[0x7], temp[(r + 8) % Nw]) ^
                                                    this.gfmul(A[0x8], temp[(r + 9) % Nw]) ^
                                                    this.gfmul(A[0x9], temp[(r + 10) % Nw]) ^
                                                    this.gfmul(A[0xa], temp[(r + 11) % Nw]) ^
                                                    this.gfmul(A[0xb], temp[(r + 12) % Nw]) ^
                                                    this.gfmul(A[0xc], temp[(r + 13) % Nw]) ^
                                                    this.gfmul(A[0xd], temp[(r + 14) % Nw]) ^
                                                    this.gfmul(A[0xe], temp[(r + 15) % Nw]);
                    }
                    break;

                case 32:
                    for (var r = 0; r < Nw; ++r) {
                        this.State[r * Nb + c] = 	this.gfmul(A[0x1f], temp[r]) ^
                                                    this.gfmul(A[0x00], temp[(r + 1) % Nw]) ^
                                                    this.gfmul(A[0x01], temp[(r + 2) % Nw]) ^
                                                    this.gfmul(A[0x02], temp[(r + 3) % Nw]) ^
                                                    this.gfmul(A[0x03], temp[(r + 4) % Nw]) ^
                                                    this.gfmul(A[0x04], temp[(r + 5) % Nw]) ^
                                                    this.gfmul(A[0x05], temp[(r + 6) % Nw]) ^
                                                    this.gfmul(A[0x06], temp[(r + 7) % Nw]) ^
                                                    this.gfmul(A[0x07], temp[(r + 8) % Nw]) ^
                                                    this.gfmul(A[0x08], temp[(r + 9) % Nw]) ^
                                                    this.gfmul(A[0x09], temp[(r + 10) % Nw]) ^
                                                    this.gfmul(A[0x0a], temp[(r + 11) % Nw]) ^
                                                    this.gfmul(A[0x0b], temp[(r + 12) % Nw]) ^
                                                    this.gfmul(A[0x0c], temp[(r + 13) % Nw]) ^
                                                    this.gfmul(A[0x0d], temp[(r + 14) % Nw]) ^
                                                    this.gfmul(A[0x0e], temp[(r + 15) % Nw]) ^
                                                    this.gfmul(A[0x0f], temp[(r + 16) % Nw]) ^
                                                    this.gfmul(A[0x10], temp[(r + 17) % Nw]) ^
                                                    this.gfmul(A[0x11], temp[(r + 18) % Nw]) ^
                                                    this.gfmul(A[0x12], temp[(r + 19) % Nw]) ^
                                                    this.gfmul(A[0x13], temp[(r + 20) % Nw]) ^
                                                    this.gfmul(A[0x14], temp[(r + 21) % Nw]) ^
                                                    this.gfmul(A[0x15], temp[(r + 22) % Nw]) ^
                                                    this.gfmul(A[0x16], temp[(r + 23) % Nw]) ^
                                                    this.gfmul(A[0x17], temp[(r + 24) % Nw]) ^
                                                    this.gfmul(A[0x18], temp[(r + 25) % Nw]) ^
                                                    this.gfmul(A[0x19], temp[(r + 26) % Nw]) ^
                                                    this.gfmul(A[0x1a], temp[(r + 27) % Nw]) ^
                                                    this.gfmul(A[0x1b], temp[(r + 28) % Nw]) ^
                                                    this.gfmul(A[0x1c], temp[(r + 29) % Nw]) ^
                                                    this.gfmul(A[0x1d], temp[(r + 30) % Nw]) ^
                                                    this.gfmul(A[0x1e], temp[(r + 31) % Nw]);
                    }
                    break;
            }
        }
    },  // MixColumns()

    /*********************************** DECRYPTION ***********************************/

	/** public */
    decrypt: function(data) {		// Decipher Nw x Nb bytes input
		var Nw = this.Nw, Nb = this.Nb, Nr = this.Nr;		// cache

        this.State = data.slice(0);

        this.assert(this.State.length == Nw * Nb, "Invalid data block size!");

		this.logHexArray("\nBegin:", this.State, 0, Nw * Nb, Nb);

		this.AddRoundKey(Nr);

		this.logHexArray("\nBegin AddRoundKey:", this.State, 0, Nw * Nb, Nb);
        
        for (var round = Nr - 1; round >= 1; --round) {		// Main round loop
            this.InvShiftRows();
			this.logHexArray("\ni = " + (round-1) + "\nInvShiftRows:", this.State, 0, Nw * Nb, Nb);
            
            this.InvSubBytes();
			this.logHexArray("\nInvSubBytes:", this.State, 0, Nw * Nb, Nb);
            
            this.AddRoundKey(round);
			this.logHexArray("\nAddRoundKey:", this.State, 0, Nw * Nb, Nb);

            this.InvMixColumns();
			this.logHexArray("\nInvMixColumns:", this.State, 0, Nw * Nb, Nb);
        }  // End main round loop for InvCipher

        this.InvShiftRows();
		this.logHexArray("\nLast round:\nInvShiftRows:", this.State, 0, Nw * Nb, Nb);

        this.InvSubBytes();
		this.logHexArray("\nInvSubBytes:", this.State, 0, Nw * Nb, Nb);

        this.AddRoundKey(0);
		this.logHexArray("\nAddRoundKey:", this.State, 0, Nw * Nb, Nb);

        // output = state
        return this.State;

    },  // decrypt()

	/** private */
    InvSubBytes: function() {
		var Nw = this.Nw, Nb = this.Nb;				// cache
        for (var i = 0; i < Nw * Nb; i++) {
        	this.State[i] = this.iSbox[this.State[i]];
        }
    },  // InvSubBytes()

	/** private */
    InvShiftRows: function() {
		var Nw = this.Nw, Nb = this.Nb;				// cache
    	var temp = [];
        for (var i = 0; i < Nw * Nb; i++) {		// Copy State into temp[]
            temp[i] = this.State[i];
        }

        for (var r = 1; r < Nw; ++r) {			// Shift temp into State
            for (var c = 0; c < Nb; ++c) {
                this.State[r * Nb + ((c + r) % Nb)] = temp[r * Nb + c];
            }
        }
    },  // InvShiftRows()

	/** private */
    InvMixColumns: function() {
		var Nw = this.Nw, Nb = this.Nb, iA = this.iA;				// cache
    	var temp = [];
        for (var c = 0; c < Nb; ++c) {
            for (var r = 0; r < Nw; ++r) {
                temp[r] = this.State[r * Nb + c];
            }

            switch (Nw) {
                case 4:
                    for (var r = 0; r < Nw; ++r) {
                        this.State[r * Nb + c] = 	this.gfmul(iA[3], temp[r]) ^
                                                    this.gfmul(iA[0], temp[(r + 1) % Nw]) ^
                                                    this.gfmul(iA[1], temp[(r + 2) % Nw]) ^
                                                    this.gfmul(iA[2], temp[(r + 3) % Nw]);
                    }
                    break;

                case 8:
                    for (var r = 0; r < Nw; ++r) {
                        this.State[r * Nb + c] = 	this.gfmul(iA[7], temp[r]) ^
                                                    this.gfmul(iA[0], temp[(r + 1) % Nw]) ^
                                                    this.gfmul(iA[1], temp[(r + 2) % Nw]) ^
                                                    this.gfmul(iA[2], temp[(r + 3) % Nw]) ^
                                                    this.gfmul(iA[3], temp[(r + 4) % Nw]) ^
                                                    this.gfmul(iA[4], temp[(r + 5) % Nw]) ^
                                                    this.gfmul(iA[5], temp[(r + 6) % Nw]) ^
                                                    this.gfmul(iA[6], temp[(r + 7) % Nw]);
                    }
                    break;

                case 16:
                    for (var r = 0; r < Nw; ++r) {
                        this.State[r * Nb + c] = 	this.gfmul(iA[0xf], temp[r]) ^
                                                    this.gfmul(iA[0x0], temp[(r + 1) % Nw]) ^
                                                    this.gfmul(iA[0x1], temp[(r + 2) % Nw]) ^
                                                    this.gfmul(iA[0x2], temp[(r + 3) % Nw]) ^
                                                    this.gfmul(iA[0x3], temp[(r + 4) % Nw]) ^
                                                    this.gfmul(iA[0x4], temp[(r + 5) % Nw]) ^
                                                    this.gfmul(iA[0x5], temp[(r + 6) % Nw]) ^
                                                    this.gfmul(iA[0x6], temp[(r + 7) % Nw]) ^
                                                    this.gfmul(iA[0x7], temp[(r + 8) % Nw]) ^
                                                    this.gfmul(iA[0x8], temp[(r + 9) % Nw]) ^
                                                    this.gfmul(iA[0x9], temp[(r + 10) % Nw]) ^
                                                    this.gfmul(iA[0xa], temp[(r + 11) % Nw]) ^
                                                    this.gfmul(iA[0xb], temp[(r + 12) % Nw]) ^
                                                    this.gfmul(iA[0xc], temp[(r + 13) % Nw]) ^
                                                    this.gfmul(iA[0xd], temp[(r + 14) % Nw]) ^
                                                    this.gfmul(iA[0xe], temp[(r + 15) % Nw]);
                    }
                    break;

                case 32:
                    for (var r = 0; r < Nw; ++r) {
                        this.State[r * Nb + c] = 	this.gfmul(iA[0x1f], temp[r]) ^
                                                    this.gfmul(iA[0x00], temp[(r + 1) % Nw]) ^
                                                    this.gfmul(iA[0x01], temp[(r + 2) % Nw]) ^
                                                    this.gfmul(iA[0x02], temp[(r + 3) % Nw]) ^
                                                    this.gfmul(iA[0x03], temp[(r + 4) % Nw]) ^
                                                    this.gfmul(iA[0x04], temp[(r + 5) % Nw]) ^
                                                    this.gfmul(iA[0x05], temp[(r + 6) % Nw]) ^
                                                    this.gfmul(iA[0x06], temp[(r + 7) % Nw]) ^
                                                    this.gfmul(iA[0x07], temp[(r + 8) % Nw]) ^
                                                    this.gfmul(iA[0x08], temp[(r + 9) % Nw]) ^
                                                    this.gfmul(iA[0x09], temp[(r + 10) % Nw]) ^
                                                    this.gfmul(iA[0x0a], temp[(r + 11) % Nw]) ^
                                                    this.gfmul(iA[0x0b], temp[(r + 12) % Nw]) ^
                                                    this.gfmul(iA[0x0c], temp[(r + 13) % Nw]) ^
                                                    this.gfmul(iA[0x0d], temp[(r + 14) % Nw]) ^
                                                    this.gfmul(iA[0x0e], temp[(r + 15) % Nw]) ^
                                                    this.gfmul(iA[0x0f], temp[(r + 16) % Nw]) ^
                                                    this.gfmul(iA[0x10], temp[(r + 17) % Nw]) ^
                                                    this.gfmul(iA[0x11], temp[(r + 18) % Nw]) ^
                                                    this.gfmul(iA[0x12], temp[(r + 19) % Nw]) ^
                                                    this.gfmul(iA[0x13], temp[(r + 20) % Nw]) ^
                                                    this.gfmul(iA[0x14], temp[(r + 21) % Nw]) ^
                                                    this.gfmul(iA[0x15], temp[(r + 22) % Nw]) ^
                                                    this.gfmul(iA[0x16], temp[(r + 23) % Nw]) ^
                                                    this.gfmul(iA[0x17], temp[(r + 24) % Nw]) ^
                                                    this.gfmul(iA[0x18], temp[(r + 25) % Nw]) ^
                                                    this.gfmul(iA[0x19], temp[(r + 26) % Nw]) ^
                                                    this.gfmul(iA[0x1a], temp[(r + 27) % Nw]) ^
                                                    this.gfmul(iA[0x1b], temp[(r + 28) % Nw]) ^
                                                    this.gfmul(iA[0x1c], temp[(r + 29) % Nw]) ^
                                                    this.gfmul(iA[0x1d], temp[(r + 30) % Nw]) ^
                                                    this.gfmul(iA[0x1e], temp[(r + 31) % Nw]);
                    }
                    break;
            }
        }
    }   // InvMixColumns()

};

function XaesHash(data, keyByteSize, salt, ip, ar, qm, gs) {

	/* Add for PremiumLib v2.3.1 - Begin */
	var strSalt = null;
	if (salt === "") {
		strSalt = salt;
		salt = [];
	} else {
		if (typeof salt == "string") {
			strSalt = salt;
			var saltArr = UnicodeString2ByteArray(salt),
				padLen = keyByteSize - saltArr.length;
			if (padLen > 0) {
				var saltPad = NewFilledArray(padLen, 0xFF);
				salt = saltArr.concat(saltPad);
			} else {
				salt = saltArr.slice(0, keyByteSize);
			}	
		} else
	/* Add for PremiumLib v2.3.1 - End */
			salt = salt || Salt(keyByteSize);
		if (salt.length != keyByteSize)
			throw Exception.invalid("Invalid salt:\n\tExpect a string, or array ["+keyByteSize+"], got array ["+salt.length+"].");
	}
	
	ip = ip || 0;
	ar = ar || 0;
	qm = qm || false;
	gs = gs || false;

	var dataArr = UnicodeString2ByteArray(data),
		passByteSize = dataArr.length,
		padding = NewFilledArray(keyByteSize - passByteSize % keyByteSize, 0xFF),
		h = NewFilledArray(keyByteSize, 0xFF),	// create h0
		k = dataArr.concat(padding, salt),
		xaes = null,
		n = k.length / keyByteSize;
		
	for (var i=0; i<n; i++) {
		xaes = new Xaes(k.slice(i*keyByteSize, (i+1)*keyByteSize), ip, ar, qm, gs);
		h = XorByteArray(xaes.encrypt(h), h);
		delete xaes;
	}
	i--;
	
	return {keyByteArray: (new Xaes(XorByteArray(k.slice(i*keyByteSize, (i+1)*keyByteSize), h), ip, ar, qm, gs)).encrypt(h), salt: (strSalt!=null) ? strSalt : salt};
};

function XaesHashBigFile(data, keyByteSize, blockLength, ip, ar, qm, gs) {	// Implement XaesHashBigFile (hash but keep data size as near the original file size as possible)

	ip = ip || 0;
	ar = ar || 0;
	qm = qm || false;
	gs = gs || false;
	
	/* Add for PremiumLib v2.3.1 - Begin */
	if (blockLength < 1)
		throw Exception.invalid("Invalid block length:\n\tExpect a positive number, got "+blockLength+".");
	/* Add for PremiumLib v2.3.1 - End */

	var dataArr = UnicodeString2ByteArray(data),
		segmentLength = blockLength * keyByteSize,
		padding = NewFilledArray(segmentLength - dataArr.length % segmentLength, 0xFF),
		h = NewFilledArray(keyByteSize, 0xFF),	// create h0
		xaes = null,
		key = null,
		start = null,
		xorResult = null;
		
	Array.prototype.push.apply(dataArr, padding);
	
	var n = dataArr.length / segmentLength;
		
	for (var i=0; i<n; i++) {
		key = [];
		/* Add for PremiumLib v2.3.1 - Begin */
		if (blockLength == 1)
			key = dataArr.slice(i*segmentLength, i*segmentLength+keyByteSize);
		else
		/* Add for PremiumLib v2.3.1 - End */
			for (var j=0; j<keyByteSize; j++) {
				xorResult = 0;
				start = i*segmentLength + j*blockLength;
				for (var k=0; k<blockLength; k++) {
					xorResult ^= ((dataArr[start + k] * k) & 0xFF) ^ ((dataArr[start + k] * k) >> 8);
				}
				key.push(xorResult);
			}
		xaes = new Xaes(key, ip, ar, qm, gs);
		h = XorByteArray(xaes.encrypt(h), h);
		delete xaes;
	}
	i--;
	hEnd = (new Xaes(XorByteArray(key, h), ip, ar, qm, gs)).encrypt(h);
	for (i=n*blockLength-1; i>=0; i--) {
		h = XorByteArray(dataArr.slice(i*keyByteSize, (i+1)*keyByteSize), hEnd);
		Array.prototype.splice.apply(dataArr, [i*keyByteSize, keyByteSize].concat(h));	// replace new h arrays on k
	}
	return dataArr;
};//
// OTP (One Time Pad)
//
var OTP = function (otpMode, otpSeed) {
	this._precompute(otpMode, otpSeed);
};

OTP.LITE_OTP_MIN_KEY_LENGTH	= 10	/* Unicode-characters */;
OTP.OTP_MIN_KEY_SIZE		= 4		/* KBs */;
OTP.HASHED_OTP_MIN_KEY_SIZE	= 32	/* KBs */;

OTP.prototype = {

	debug: 0,
	
	otpSeedByteArr: null,
	otpHashedSeedByteArr: null,	
	
	otpMode: null,
	
    /*********************************** PRECOMPUTE ***********************************/
	
	/** private */
	checkOtpSeed: function(otpSeedByteArr) {
		var seedLength = otpSeedByteArr.length,
			result = '',
			previousByte = otpSeedByteArr[0],
			currentByte = null,
			value = NewFilledArray(256/*size*/, 0/*value*/),
			diffValue = 0,
			continuous = 1,
			maxContinuous = 1,
			maxZeroContinuous = 0,
			curZeroContinuous = 0;
			
		value[previousByte]++;
		
		for (var i=1; i < seedLength; i++) {
			currentByte = otpSeedByteArr[i];
			
			// Check values occurency
			value[currentByte]++;
			// Check continuous bytes of "0"
			curZeroContinuous += (currentByte==0) ? 1:-curZeroContinuous;
			maxZeroContinuous = (maxZeroContinuous<curZeroContinuous) ? curZeroContinuous : maxZeroContinuous;
			// Check continuous equal bytes
			if (previousByte==currentByte) {
				continuous++;
			} else {
				maxContinuous = continuous;
				continuous = 1;
			}
			
			previousByte = currentByte;
		}
		
		for (i=0; i<256; i++) {
			if (value[i] > 0) diffValue++;
			if (value[i] > seedLength/3) result += " Byte-value " + i + " occur too many times: " + value[i] + " times (Should be less than 1/3 secure key length).";
		}
		if (diffValue < 20) result += " There are too few different byte-values: " + diffValue + " values (Should be more than 20).";
		
		switch (this.otpMode) {
			case Premium.MODE.OTP:
				if (maxZeroContinuous > 5) result += " There are place(s) that byte-values of '0' occur continuously too many times: " + maxZeroContinuous + " times (Should be less than 5).";
				break;
			case Premium.MODE.HASHED_OTP:
				if (maxZeroContinuous > seedLength/1000) result += " There are place(s) that byte-values of '0' occur continuously too many times: " + maxZeroContinuous + " times (Should be less than 1/1000 secure key length).";
				break;
		}
		
		if (maxContinuous > seedLength/20) result += " There are too much byte-values repeat continuously: " + maxContinuous + " times (Should be less than 1/20 secure key length).";
		
		if (result != '')
			result = "Your selected OTP secure key is too weak!" + result 
				+ "\n\nPlease select another file. Notice that Unicode-text files often have too many byte-values 0, you can use UTF-8 instead."
				+ " And for more secure, you should not use .exe, .msi, .pdf, or any file with long file-header like .doc, etc.";
		
		return result;
	},

	/** private */
	_precompute: function(otpMode, otpSeed) {
		if (!otpSeed) {
			throw Exception.invalid("OTP secure key cannot be empty!");
		}
		this.otpMode = otpMode;
		switch (this.otpMode) {
			case Premium.MODE.LITE_OTP:
				this.otpSeedByteArr = UnicodeString2ByteArray(otpSeed);
				if (this.otpSeedByteArr.length < OTP.LITE_OTP_MIN_KEY_LENGTH * 2) {
					throw Exception.invalid("Lite-OTP secure key should be at least " + OTP.LITE_OTP_MIN_KEY_LENGTH + " Unicode-characters for safe!");
				}
				break;
			case Premium.MODE.OTP:
				this.otpSeedByteArr = ByteArray2IntArray(otpSeed).reverse();	// Revert to avoid same file header
				var checkResult = this.checkOtpSeed(this.otpSeedByteArr);
				if (checkResult != '') {	// Not good OTP seed
					throw Exception.invalid(checkResult);
				}
				if (this.otpSeedByteArr.length < OTP.OTP_MIN_KEY_SIZE * 1024) {
					throw Exception.invalid("OTP secure key should be at least " + OTP.OTP_MIN_KEY_SIZE + " KBs for normal conversation!");
				}
				break;
			case Premium.MODE.HASHED_OTP:
				this.otpSeedByteArr = ByteArray2IntArray(otpSeed).reverse();	// Revert to avoid same file header
				var checkResult = this.checkOtpSeed(this.otpSeedByteArr);
				if (checkResult == '') {	// Good OTP seed
					var ip = Premium.XAES_VERSION.POLYN_ID, ar = Premium.XAES_VERSION.ADD_ROUND, qm = Premium.XAES_VERSION.QUICK_MODE, gs = Premium.XAES_VERSION.GRAY_SBOX;
					this.otpHashedSeedByteArr = XaesHashBigFile(this.otpSeedByteArr, 512/*keyByteSize*/, 64/*blockLength*/, ip, ar, qm, gs);
				} else {					// Not good OTP seed
					throw Exception.invalid(checkResult);
				}
				if (this.otpSeedByteArr.length < OTP.HASHED_OTP_MIN_KEY_SIZE * 1024) {
					throw Exception.invalid("Hashed-OTP secure key should be at least " + OTP.HASHED_OTP_MIN_KEY_SIZE + " KBs for normal conversation!");
				}
				break;
		}
	},

    /*********************************** LOG ***********************************/

	/** private */
	logHexArray: function(caption, arr, start, end, width) {
		if (!this.debug) return;
		var result = "", start = start || 0, end = end || arr.length;
		for (var i = start; i < end; i++) {
			var str = arr[i].toString(16);
			var z = 2 - str.length + 1;
			str = Array(z).join("0") + str;
			if ((i>0)&&(i-start)%width===0) {
				result += "\n";
			}
			result += str;
		}
		var seperator = ((width==null)||(end - start > width)) ? "\n" : " ";
		console.log(caption + seperator + result);
	},

    /*********************************** DECLARATION ***********************************/

	genKeyBundle: function(password, dataLength, salt, ip, ar, qm, gs) {
		// TODO: Upgrade this
		var keyByteSize = 512, tmp;
		if (dataLength < keyByteSize) {
			for (var N=4; N>1; N--) {
				for (var K=2; K>=1; K-=0.5) {
					tmp = Math.round((1 << 2*N+3) * K / 8);
					if (tmp >= dataLength) keyByteSize = tmp;
				}
			}
		}
		if (this.debug) console.log("keyByteSize = " + keyByteSize);
		// End TODO
		
		var passwordBundle = XaesHash(password, keyByteSize, salt, ip, ar, qm, gs);

		if (this.otpMode == Premium.MODE.LITE_OTP) {
			passwordBundle.otpSeedByteArr = XaesHash(this.otpSeedByteArr, keyByteSize, passwordBundle.salt, ip, ar, qm, gs).keyByteArray;
		}
		
		return passwordBundle;
	},

	/**
	* Encrypt data by password
	* @Param {string} password: a Unicode string
	* @Param {array} plainData: an array of byte of data to be encrypted
	* @Return {JSON} cipherData: a JSON {mode: ..., st: ..., salt: ..., ct: ...}
	*/
	/** @this {Element} */
	encrypt: function(password, plainData, isByteArray) {
		var dataLen = plainData.length;
		
		if (dataLen > 0xFFFFFFFF) {
			throw Exception.invalid("data is too big!");
		}
		
		var otpSeedArr, salt,
			ip = Premium.XAES_VERSION.POLYN_ID,
			ar = Premium.XAES_VERSION.ADD_ROUND,
			qm = Premium.XAES_VERSION.QUICK_MODE,
			gs = Premium.XAES_VERSION.GRAY_SBOX;
		
		var keyBundle = this.genKeyBundle(password, dataLen, salt, ip, ar, qm, gs);
			keyArr = keyBundle.keyByteArray,
			keyArrLength = keyArr.length;
		
		if (this.otpMode == Premium.MODE.HASHED_OTP) {
		
			otpSeedArr = this.otpHashedSeedByteArr;
			
			if (dataLen > otpSeedArr.length) {
				throw Exception.invalid("Message cannot be longer than OTP secure key!\nYou must use a bigger OTP secure file (but should be less than 10MB).");
			}
			
			for (var i=0; i<dataLen; i++) {
				plainData[i] ^= keyArr[i%keyArrLength] ^ otpSeedArr[i];
			}
			
		} else if (this.otpMode == Premium.MODE.OTP) {
		
			otpSeedArr = this.otpSeedByteArr;
			
			if (dataLen > otpSeedArr.length) {
				throw Exception.invalid("Message cannot be longer than OTP secure key!\nYou must use a bigger OTP secure file (but should be less than 10MB).");
			}
			
			for (var i=0; i<dataLen; i++) {
				plainData[i] ^= keyArr[i%keyArrLength] ^ otpSeedArr[i];
			}
			
		} else {	// Lite OTP
		
			otpSeedArr = keyBundle.otpSeedByteArr;
			var otpSeedArrLength = otpSeedArr.length;
			
			for (var i=0; i<dataLen; i++) {
				plainData[i] ^= keyArr[i%keyArrLength] ^ otpSeedArr[i%otpSeedArrLength];
			}
			
		}
		
		this.logHexArray("Cipher data:", plainData);
		
		if (isByteArray)
			return {
				mode: this.otpMode, 
				ip: ip, ar: ar, qm: qm, gs: gs,
				salt: Base64.fromByteArray(keyBundle.salt), 
				ct: Base128.fromByteArray(plainData),
				ctype: Premium.CTYPE_BASE128,
				iba: isByteArray
			};
		else
			return {
				mode: this.otpMode, 
				ip: ip, ar: ar, qm: qm, gs: gs,
				salt: Base64.fromByteArray(keyBundle.salt), 
				ct: Base64.fromByteArray(plainData),
				iba: isByteArray
			};
	},

	/**
	* Decrypt data by password
	* @Param {string} password: a Unicode string
	* @Param {JSON} cipherData: {mode: ..., st: ..., salt: ..., ct: ...}
	* @Return {array} an array of byte of plainData
	*/
	/** @this {Element} */
	decrypt: function(password, cipherData) {
		var decipherData = (cipherData.ctype === Premium.CTYPE_BASE128) ? Base128.toByteArray(cipherData.ct) : Base64.toByteArray(cipherData.ct),
			dataLen = decipherData.length;
			
		if (dataLen > 0xFFFFFFFF) {
			throw Exception.invalid("data is too big!");
		}
		
		var cip = cipherData.ip || 0,
			car = cipherData.ar || 0,
			cqm = cipherData.qm || false,
			cgs = cipherData.gs || false;
		
		var otpSeedArr,
			keyBundle = this.genKeyBundle(password, dataLen, Base64.toByteArray(cipherData.salt), cip, car, cqm, cgs),
			keyArr = keyBundle.keyByteArray,
			keyArrLength = keyArr.length;
		
		if (this.otpMode == Premium.MODE.HASHED_OTP) {
		
			var ip = Premium.XAES_VERSION.POLYN_ID,
				ar = Premium.XAES_VERSION.ADD_ROUND,
				qm = Premium.XAES_VERSION.QUICK_MODE,
				gs = Premium.XAES_VERSION.GRAY_SBOX;
			
			if (ip != cip || ar != car || qm != cqm || gs != cgs)	// decrypt message of different versions of xAES
				otpSeedArr = XaesHashBigFile(this.otpSeedByteArr, 512/*keyByteSize*/, 64/*blockLength*/, cip, car, cqm, cgs);
			else
				otpSeedArr = this.otpHashedSeedByteArr;
				
			if (dataLen > otpSeedArr.length) {
				throw Exception.invalid("Message cannot be longer than OTP secure key!\nYou must use a bigger OTP secure file (but should be less than 10MB).");
			}
			
			for (var i=0; i<dataLen; i++) {
				decipherData[i] ^= keyArr[i%keyArrLength] ^ otpSeedArr[i];
			}
			
		} else if (this.otpMode == Premium.MODE.OTP) {
		
			otpSeedArr = this.otpSeedByteArr;
			
			if (dataLen > otpSeedArr.length) {
				throw Exception.invalid("Message cannot be longer than OTP secure key!\nYou must use a bigger OTP secure file (but should be less than 10MB).");
			}
			
			for (var i=0; i<dataLen; i++) {
				decipherData[i] ^= keyArr[i%keyArrLength] ^ otpSeedArr[i];
			}
			
		} else {	// Lite-OTP
		
			otpSeedArr = keyBundle.otpSeedByteArr;
			var otpSeedArrLength = otpSeedArr.length;
				
			for (var i=0; i<dataLen; i++) {
				decipherData[i] ^= keyArr[i%keyArrLength] ^ otpSeedArr[i%otpSeedArrLength];
			}
		
		}
		
		this.logHexArray("Decipher data:", decipherData);
		
		return decipherData;
	}

};/**
 * @constructor
 */
var Premium = function(mode, param) {
	this._precompute(mode, param);
};


Premium.MODE = {XAES: 0, OTP: 1, LITE_OTP: 2, HASHED_OTP: 3};

Premium.XAES_VERSION = {POLYN_ID: 1, ADD_ROUND: 0, QUICK_MODE: true, GRAY_SBOX: true};

Premium.CTYPE_BASE64 = "Base64";
Premium.CTYPE_BASE128 = "Base128";

/************************************/

Premium.XaesHash = XaesHash;

Premium.XaesHashString = function(msg, keyByteSize, xaesVersion, salt) {
	if (typeof msg !== "string") {
		console.log("ERROR: XaesHashString can only hash string, not " + typeof msg);
		return null;
	}
	if (!salt)
		salt = msg;
	var ip = xaesVersion.POLYN_ID,
		ar = xaesVersion.ADD_ROUND,
		qm = xaesVersion.QUICK_MODE,
		gs = xaesVersion.GRAY_SBOX;
	return Base64.fromByteArray(XaesHash(msg, keyByteSize, salt, ip, ar, qm, gs).keyByteArray);
};

Premium.XaesHashBigFile = function(data, keyByteSize, blockLength, xaesVersion) {
	var ip = xaesVersion.POLYN_ID,
		ar = xaesVersion.ADD_ROUND,
		qm = xaesVersion.QUICK_MODE,
		gs = xaesVersion.GRAY_SBOX;
	return Base64.fromByteArray(XaesHashBigFile(data, keyByteSize, blockLength, ip, ar, qm, gs));
};

Premium.xaesEncrypt = function(keyByteSize, password, data, isByteArray) {
	return Premium.encrypt(Premium.MODE.XAES, keyByteSize, password, data, isByteArray);
};

Premium.liteOtpEncrypt = function(otpSeed, password, data, isByteArray) {
	return Premium.encrypt(Premium.MODE.LITE_OTP, otpSeed, password, data, isByteArray);
};

Premium.otpEncrypt = function(otpSeed, password, data, isByteArray) {
	return Premium.encrypt(Premium.MODE.OTP, otpSeed, password, data, isByteArray);
};

Premium.hashedOtpEncrypt = function(otpSeed, password, data, isByteArray) {
	return Premium.encrypt(Premium.MODE.HASHED_OTP, otpSeed, password, data, isByteArray);
};

Premium.encrypt = function(mode, param, password, data, isByteArray) {
	if (typeof data === "undefined" || data == null) {
		throw Exception.invalid("Data to encrypt cannot be null!");
	}
	var premiumObj = new Premium(mode, param);
	return premiumObj.encrypt(password, data, isByteArray);
};

/************************************/

Premium.xaesDecrypt = function(password, cipherData) {
	return Premium.decrypt(password, cipherData);
};

Premium.liteOtpDecrypt = function(otpSeed, password, cipherData) {
	return Premium.decrypt(otpSeed, password, cipherData);
};

Premium.otpDecrypt = function(otpSeed, password, cipherData) {
	return Premium.decrypt(otpSeed, password, cipherData);
};

Premium.hashedOtpDecrypt = function(otpSeed, password, cipherData) {
	return Premium.decrypt(otpSeed, password, cipherData);
};

Premium.decrypt = function() {
	var param, password, data;
	if (arguments.length == 3) {
		param = arguments[0];
		password = arguments[1];
		data =  arguments[2];
	} else if (arguments.length == 2) {
		param = null;
		password = arguments[0];
		data =  arguments[1];
	} else if (arguments.length < 2){
		throw Exception.invalid("Premium.decrypt() is missing arguments.");
	}
	var cipherData = Premium.readCipherData(data),
		mode = cipherData.mode,
		param = (mode == Premium.MODE.XAES) ? cipherData.ks>>3 : param,
		premiumObj = new Premium(mode, param);
	return premiumObj.decrypt(password, cipherData);
};

/************************************/

Premium.readPassword = function(password) {
	if (typeof password != "string" || !password) {
		throw Exception.invalid("Password must be a non-empty string!");
	}
	return password;
};

Premium.readCipherData = function(cipherData) {
	if (typeof cipherData == "string") {
		return string2JSON(cipherData);
	}
	if (typeof cipherData != "object" || !cipherData) {
		throw Exception.invalid("Cipher data must be a non-empty JSON object!");
	}
	return cipherData;
};

Premium.readIsByteArray = function(isByteArray) {
	return !!isByteArray;
};

/************************************/

Premium.prototype = {

	keyByteSize: null,
	
	otpSeed: null,
	
	mode: null,
	
	otp: null,
	
	_precompute: function(mode, param) {
		this.mode = parseInt(mode);
		switch (this.mode) {
			case Premium.MODE.XAES:
				this.keyByteSize = parseInt(param);
				if (isNaN(this.keyByteSize))
					throw Exception.invalid("Invalid key size, it must be a number or a string of number!");
				break;
			case Premium.MODE.OTP:
			case Premium.MODE.LITE_OTP:
			case Premium.MODE.HASHED_OTP:
				this.otpSeed = param;
				this.otp = new OTP(this.mode, this.otpSeed);
				break;
			default:
				throw Exception.invalid("Invalid cryptography mode!");
		}
	},
	
	/**
	* Encrypt data by password
	* @Param {string} password: a Unicode string
	* @Param {string} data: data to be encrypted, can be an Array of data or a String
	* @Param {boolean} isByteArray: an optional parameter, default value is "false". It's "true" if the data is an Array of Bytes or an ASCII String. It's "false" if data is a Unicode String.
	* @Return {JSON} ciphertext: a JSON {mode: ..., ...: ..., salt: ..., ct: ..., iba: ...}
	*/
	/** @this {Element} */
	encrypt: function(password, data, isByteArray) {
		password = Premium.readPassword(password);
		isByteArray = Premium.readIsByteArray(isByteArray);
		switch (this.mode) {
			case Premium.MODE.XAES:
				return this.xaesEncrypt(password,data,isByteArray);
			case Premium.MODE.OTP:
			case Premium.MODE.LITE_OTP:
			case Premium.MODE.HASHED_OTP:
				return this.otpEncrypt(password,data,isByteArray);
		}
	},
	
	/**
	* Decrypt cipherData by password
	* @Param {string} password: a Unicode string
	* @Param {JSON} cipherData: a JSON {mode: ..., ...: ..., salt: ..., ct: ..., iba: ...}
	* @Return {Object} originData: can be an Array of data or a String
	*/
	/** @this {Element} */
	decrypt: function(password, data) {
		password = Premium.readPassword(password);
		data = Premium.readCipherData(data);
		switch (this.mode) {
			case Premium.MODE.XAES:
				return this.xaesDecrypt(password, data);
			case Premium.MODE.OTP:
			case Premium.MODE.LITE_OTP:
			case Premium.MODE.HASHED_OTP:
				return this.otpDecrypt(password, data);
		}
	},
	
	/****************************************************************************************************************/

	otpEncrypt: function(password, data, isByteArray) {
		var dataArr = [];
		if (!isByteArray) {		// Read each block = 2 bytes -> (Unicode text)
			for (var i=0; i < data.length; i++) {
				dataArr.push(data.charCodeAt(i) >>> 8);
				dataArr.push(data.charCodeAt(i) & 0xFF);
			}
		} else {				// Read each byte -> (ASCII text or any data)
			dataArr = ByteArray2IntArray(data);
		}
		var dataArrLen = dataArr.length;
		dataArr.unshift(dataArrLen >>> 24 & 0xFF, dataArrLen >>> 16 & 0xFF, dataArrLen >>> 8 & 0xFF, dataArrLen & 0xFF);
		var cipherData = this.otp.encrypt(password, dataArr, isByteArray);
		return cipherData;
	},
	
	otpDecrypt: function(password, data) {
		var decipherText = [],
			decipherArr = this.otp.decrypt(password, data);
		var originLen = decipherArr[0] << 24 | decipherArr[1] << 16 |  decipherArr[2] << 8 | decipherArr[3],
			endPoint = originLen + 4;
		if (originLen < 0 || endPoint > decipherArr.length) {
			throw Exception.invalid("Cannot decrypt the given message!\nPlease recheck your password, OTP secure key, and message.");
		}
		var isByteArray = data.iba;
		if (!isByteArray) {		// Read each block = 2 bytes -> (Unicode text)
			for (var i=4; i < endPoint; i+=2) {
				decipherText.push(String.fromCharCode(decipherArr[i] << 8 | decipherArr[i+1]));
			}
			return decipherText.join('');
		} else {				// Read each byte -> (ASCII text or any data)
			return arrayAppend([],(new Int8Array(decipherArr)).subarray(4, endPoint));
		}
	},

	/****************************************************************************************************************/
	
	xaesEncrypt: function(password, data, isByteArray) {
		var keyByteSize = this.keyByteSize,
			ip = Premium.XAES_VERSION.POLYN_ID, ar = Premium.XAES_VERSION.ADD_ROUND, qm = Premium.XAES_VERSION.QUICK_MODE, gs = Premium.XAES_VERSION.GRAY_SBOX,
			passwordBundle = XaesHash(password, keyByteSize, null, ip, ar, qm, gs),
			xaes = new Xaes(passwordBundle.keyByteArray, ip, ar, qm, gs),
			dataArr = [],
			ciphertArr = [];
		if (!isByteArray) {		// Read each block = 2 bytes -> (Unicode text)
			for (var i=0; i < data.length; i++) {
				dataArr.push(data.charCodeAt(i) >>> 8);
				dataArr.push(data.charCodeAt(i) & 0xFF);
			}
		} else {				// Read each byte -> (ASCII text or any data)
			dataArr = ByteArray2IntArray(data);
		}
		if (dataArr.length > 0xFFFFFFFF) {
			throw Exception.invalid("data is too big!");
		}
		dataArr.unshift(dataArr.length >>> 24 & 0xFF, dataArr.length >>> 16 & 0xFF, dataArr.length >>> 8 & 0xFF, dataArr.length & 0xFF);
		if (dataArr.length % keyByteSize !== 0) {
			var tailLength = keyByteSize - (dataArr.length % keyByteSize);
			for (var i=0; i < tailLength; i++) {
				dataArr.push(0);
			}
		}
		for (var i=0; i<dataArr.length; i+=keyByteSize) {
			arrayAppend(ciphertArr, xaes.encrypt(dataArr.slice(i,i+keyByteSize)));
		}
		if (isByteArray)
			return {
				mode: Premium.MODE.XAES, 
				ks: this.keyByteSize * 8, 
				ip: ip, ar: ar, qm: qm, gs: gs,
				salt: Base64.fromByteArray(passwordBundle.salt), 
				ct: Base128.fromByteArray(ciphertArr),
				ctype: Premium.CTYPE_BASE128,
				iba: isByteArray
			};
		else
			return {
				mode: Premium.MODE.XAES, 
				ks: this.keyByteSize * 8, 
				ip: ip, ar: ar, qm: qm, gs: gs, 
				salt: Base64.fromByteArray(passwordBundle.salt), 
				ct: Base64.fromByteArray(ciphertArr),
				iba: isByteArray
			};
	},
	
	xaesDecrypt: function(password, data) {
		var keyByteSize = this.keyByteSize,
			ip = data.ip || 0, ar = data.ar || 0, qm = data.qm || false, gs = data.gs || false,
			passwordBundle = XaesHash(password, keyByteSize, Base64.toByteArray(data.salt), ip, ar, qm, gs),
			xaes = new Xaes(passwordBundle.keyByteArray, ip, ar, qm, gs),
			isByteArray = data.iba,
			dataArr = (data.ctype === Premium.CTYPE_BASE128) ? Base128.toByteArray(data.ct) : Base64.toByteArray(data.ct),
			decipherArr = [],
			decipherText = [];
		if (dataArr.length > 0xFFFFFFFF) {
			throw Exception.invalid("data is too big!");
		}
		if (dataArr.length % keyByteSize !== 0) {
			throw Exception.corrupt("data is corrupted!");
		}
		for (var i=0; i<dataArr.length; i+=keyByteSize) {
			arrayAppend(decipherArr, xaes.decrypt(dataArr.slice(i,i+keyByteSize)));
		}
		var originLen = decipherArr[0] << 24 | decipherArr[1] << 16 |  decipherArr[2] << 8 | decipherArr[3],
			endPoint = originLen + 4;
		if (originLen < 0 || endPoint > decipherArr.length) {
			throw Exception.invalid("Cannot decrypt the given message!\nPlease recheck your password and message.");
		}
		if (!isByteArray) {		// Read each block = 2 bytes -> (Unicode text)
			for (var i=4; i < endPoint; i+=2) {
				decipherText.push(String.fromCharCode(decipherArr[i] << 8 | decipherArr[i+1]));
			}
			return decipherText.join('');
		} else {				// Read each byte -> (ASCII text or any data)
			return arrayAppend([],(new Int8Array(decipherArr)).subarray(4, endPoint));
		}
	}
};


module.exports = Premium;
