//Z Framework
var z = z || {};
z.debug = true;
z.record = true;
z.log = function(obj) {
	if (z.debug) {
		console.log(obj);
		if (z.record) z.addLogs(obj);
	}
}
z.logs = [];
z.addLogs = function(msg, options = null) {
	if (z.record) z.logs = z.logs.concat([{
		'time': new Date().getTime(),
		'msg': msg,
		'option': options
	}]);
}
z.error = function(msg, options = null) {
	if (z.record) z.addLogs('ERROR|'.concat(msg), options);
	throw new Error(msg);
}
z.number = {};
z.number.integer = function(number, type = 0) {
	if (typeof number != 'number') z.error('Not a number', {
		'function': 'z.number.integer',
		'params': {
			'number': number,
			'type': type
		}
	});
	switch (type) {
		case 0:
			return Math.round(number);
			break;
		case 1:
			return Math.ceil(number);
			break;
		case 2:
			return Math.floor(number);
			break;
		default:
			return Math.round(number);
			break;
	}
}
z.number.random = function(min, max) {
	if (typeof min != 'number' || typeof max != 'number' || max < min) {

	}
	return min + Math.random() * (max - min);
}
z.number.randomInt = function(min, max) {
	if (typeof min != 'number' || typeof max != 'number' || max < min) {

	}
	return z.number.integer(z.number.random(min, max));
}
z.string = {};
z.string.concatArray = function(array, gap, lastGap = false, keepNull = false, action = null) {
	if (array && array.length && typeof gap === 'string') {
		let str = '';
		for (let i = 0; i < array.length; i++) {
			if (!lastGap && (array.length - 1) == i)
				gap = '';
			if (typeof action === 'function')
				array[i] = action(array[i]);
			if(!keepNull){
				if(!array[i].length || array[i].length<1){
					continue;
				}
			}
			str = str.concat(''.concat(array[i]).concat(gap));
		}
		return str;
	} else {
		z.error('PARAM ERROR', {
			'function': 'z.string.concatArray',
			'params': {
				'array': array,
				'gap': gap
			}
		});
	}
};
z.string.surroundEachRows = function(str, former, after) {
	if (typeof str != 'string') z.error('NOT A STRING', {
		'function': 'surroundEachRows',
		'params': {
			'str': str,
			'former': former,
			'after': after
		}
	});
	let tmp = str.split('\n');
	str = '';
	str = z.string.concatArray(tmp, '\n', false, false, function(str) {
		if (str.length > 0) {
			return ''.concat(former).concat(str).concat(after);
		};
		return '';
	});
	return str;
};
z.string.replaceForSQL = function(str) {
	if (typeof str != 'string') z.error('NOT A STRING', {
		'function': 'z.string.replaceForSQL',
		'params': {
			'str': str
		}
	});
	let tmp = [];
	if (str.indexOf('\t') > -1) {
		tmp = str.split('\t');
		str = '';
	} else if (str.indexOf('\n') > -1) {
		tmp = str.split('\n');
		str = '';
	}
	if (tmp.length) {
		str = z.string.concatArray(tmp, ',');
	}
	return str;
};
z.string.replaceForTable = function(str, type = 0) {
	if (typeof str != 'string') z.error('NOT A STRING', {
		'function': 'z.string.replaceForTable',
		'params': {
			'str': str,
			'type': type
		}
	});
	let tmp = str.split(',');
	str = '';
	for (let i = 0; i < tmp.length; i++) {
		switch (type) {
			case 0:
				str = str.concat(tmp[i].concat('\n'));
				break;
			case 1:
				str = str.concat(tmp[i].concat('\t'));
				break;
			default:
				str = str.concat(tmp[i].concat('\n'));
				break;
		}
	}
	return str;
};
z.string.setClipBoard = function(target) {
	if (target == null) z.error('PARAM ERROR', {
		'function': 'z.string.setClipBoard',
		'params': {
			'target': target
		}
	});
	if (target.setSelectionRange) {
		target.setSelectionRange(0, target.value.length);
	} else {
		target.select();
	}
	document.execCommand("copy");
};
z.string.formatSentence = function(str) {
	if (typeof str != 'string') z.error('NOT A STRING', {
		'function': 'z.string.formatSentence',
		'params': {
			'str': str
		}
	});
	str = str.toLowerCase();
	str = str.split('^!?.;:\x22');
	str = z.string.concatArray(str, '', true, false, function(str) {
		if (str.length && str.length > 0 && str.charCodeAt(0) > 96 && str.charCodeAt(0) < 123)
			str = ''.concat(String.fromCharCode(str.charCodeAt(0) - 32)).concat(str.substring(1, str.length));
		return str;
	})
	return str;
}
z.string.formatLabel = function(str) {
	if (typeof str != 'string') z.error('NOT A STRING', {
		'function': 'z.string.formatLabel',
		'params': {
			'str': str
		}
	});
	str = str.toLowerCase();
	str = str.split(' ');
	str = z.string.concatArray(str, ' ', false, false, function(str) {
		if (str.length && str.length > 0 && str.charCodeAt(0) > 96 && str.charCodeAt(0) < 123)
			str = ''.concat(String.fromCharCode(str.charCodeAt(0) - 32)).concat(str.substring(1, str.length));
		return str;
	})
	return str;
}
z.string.toFieldsName = function(str) {
	if (typeof str != 'string') z.error('NOT A STRING', {
		'function': 'z.string.toFieldsName',
		'params': {
			'str': str
		}
	});
	if (str.length < 1) return str;
	str = str.replace('__', '_');
	str = str.split('_');
	str[str.length - 1] = '';
	str = z.string.concatArray(str, ' ', false, false);
	return str;
}
z.string.toCustomObjecAPIName = function(str) {
	if (typeof str != 'string') z.error('NOT A STRING', {
		'function': 'z.string.toCustomObjecAPIName',
		'params': {
			'str': str
		}
	});
	if (str.length < 1) return str;
	str = str.split(' ');
	str = z.string.concatArray(str, '_', false, false);
	str = str.concat('__c')
	return str;
}
z.string.drop = function(str,target){
	if (typeof str != 'string' || typeof target != 'string') z.error('NOT A STRING', {
		'function': 'z.string.drop',
		'params': {
			'str': str,
			'target' : target
		},
	});
	str = str.split(target);
	str = z.string.concatArray(str,'',false,false);
	return str;
}
z.string.packageTable = function(str) {
	if (typeof str != 'string') z.error('NOT A STRING', {
		'function': 'z.string.packageTable',
		'params': {
			'str': str
		},
	});
	if (str.indexOf('"') != -1) {
		alert('Not supprot string with token ["]');
		return str;
	}
	if (str.indexOf('\n') != -1) {
		let tmp = str.split('\n');
		for (let i = 0; i < tmp.length; i++) {
			tmp[i] = z.string.packageTable(tmp[i]);
		}
		return z.string.concatArray(tmp, '\n', false, true);
	} else if (str.indexOf('\t') != -1) {
		let tmp = str.split('\t');
		for (let i = 0; i < tmp.length; i++) {
			tmp[i] = z.string.packageTable(tmp[i]);
		}
		return '"'.concat(z.string.concatArray(tmp, '","', false, true)).concat('"');
	} else {
		return str;
	}
}
z.array = {};
z.array.itemSummary= function(array) {
	if (!array || !array.length || array.length < 1) z.error('NOT A Array', {
		'function': 'z.array.summary',
		'params': {
			'array': array
		},
	});
	let result = {};
	let count = {};
	let set = [];
	for(let i = 0;i<array.length;i++){
		let key = ''.concat(array[i])
		if(count[key]){
			count[key] = count[key] + 1;
		}else{
			count[key] = 1;
			set = set.concat(array[i]);
		}
	}
	result = {'count':count,'set':set};
	return result;
}
z.array.dropDuplicate = function(array){
	if (!array || !array.length || array.length < 1) z.error('NOT A Array', {
		'function': 'z.array.dropDuplicate',
		'params': {
			'array': array
		},
	});
	let count = {};
	let set = [];
	for(let i = 0;i<array.length;i++){
		let key = ''.concat(array[i])
		if(!count[key]){
			count[key] = 1;
			set = set.concat(array[i]);
		}else{
			continue;
		}
	}
	return set;
}