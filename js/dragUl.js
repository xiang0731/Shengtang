let liDrag = {
	class_name: null,
	permitDrag: false,
	_x: 0,
	_y: 0,
	_left: 0,
	_top: 0,
	old_elm: null,
	tmp_elm: null,
	new_elm: null,
	ul_style: {
		'width': '125px',
		'min-height': '35px',
		'padding': '5px',
		'margin': '5px',
		'display': 'block',
		'border-radius': '5px',
		'border': '1px solid #555',
	},
	li_style: {
		'width': '100px',
		'padding': '5px',
		'margin': '5px',
		'display': 'block',
		'border-radius': '5px',
		'border': '1px solid #555',
	},
	init: function(className, setStyle = false) {
		liDrag.class_name = className;
		$('.' + liDrag.class_name).on('mousedown', 'ul li', function(event) {
			liDrag.permitDrag = true;
			liDrag.old_elm = $(this);
			liDrag.mousedown(event);
			return false;
		});
		$(document).mousemove(function(event) {
			if (!liDrag.permitDrag) return false;
			liDrag.mousemove(event);
			return false;
		});
		$(document).mouseup(function(event) {
			if (!liDrag.permitDrag) return false;
			liDrag.permitDrag = false;
			liDrag.mouseup(event);
			return false;
		});
		if (setStyle) {
			$('.' + liDrag.class_name).find('ul').css(liDrag.ul_style);
			$('.' + liDrag.class_name).find('ul li').css(liDrag.li_style);
		}
	},
	mousedown: function(event) {
		liDrag.tmp_elm = $(liDrag.old_elm).clone();
		liDrag._x = $(liDrag.old_elm).offset().left;
		liDrag._y = $(liDrag.old_elm).offset().top;
		var e = event || window.event;
		liDrag._left = e.pageX - liDrag._x;
		liDrag._top = e.pageY - liDrag._y;
		$(liDrag.tmp_elm).css({
			'transform': 'rotate(3deg)',
			'min-width': '35px',
			'position': 'absolute',
			'background-color': '#000',
			'color': '#fff',
			'left': liDrag._x,
			'top': liDrag._y,
		});
		tmp = $(liDrag.old_elm).parent().append(liDrag.tmp_elm);
		liDrag.tmp_elm = $(tmp).find(liDrag.tmp_elm);
		$(liDrag.tmp_elm).css('cursor', 'move');
	},
	mousemove: function(event) {
		var e = event || window.event;
		var x = e.pageX - liDrag._left;
		var y = e.pageY - liDrag._top;
		var maxL = $(document).width() - $(liDrag.old_elm).outerWidth();
		var maxT = $(document).height() - $(liDrag.old_elm).outerHeight();
		x = x < 0 ? 0 : x;
		x = x > maxL ? maxL : x;
		y = y < 0 ? 0 : y;
		y = y > maxT ? maxT : y;
		$(liDrag.tmp_elm).css({
			'left': x,
			'top': y,
		});
	},
	mouseup: function(event) {
		$(liDrag.tmp_elm).remove();
		var e = event || window.event;
		$.each($('.' + liDrag.class_name + ' ul'), function(index, value) {
			var box_x = $(value).offset().left;
			var box_y = $(value).offset().top;
			var box_width = $(value).outerWidth();
			var box_height = $(value).outerHeight();
			if (e.pageX > box_x && e.pageX < box_x - 0 + box_width && e.pageY > box_y && e.pageY < box_y - 0 + box_height) {
				if ($(value).offset().left !== liDrag.old_elm.parent().offset().left || $(value).offset().top !== liDrag.old_elm.parent().offset().top) {
					tmp = $(liDrag.old_elm).clone();
					var newObj = $(value).append(tmp);
					$(liDrag.old_elm).remove();
					liDrag.new_elm = $(newObj).find(tmp);
				}
			}
		});
		$.each($('.' + liDrag.class_name + ' ul'), function(index, value) {
			var box_x = $(value).offset().left;
			var box_y = $(value).offset().top;
			let min_distance = null;
			$(value).find('li').each(function(){
				tmp = Math.sqrt(Math.pow((e.pageY - box_y),2)+Math.pow((e.pageX - box_x),2));
				console.log(tmp);
				if(min_distance && tmp <= min_distance){
					alert($(this).attr('value'));
				}else{
					min_distance = tmp;
				}
			})
		});
	},
	getValue: function() {
		let tmp = {};
		$('.' + liDrag.class_name).find('ul').each(function() {
			let tmpValue = []
			$(this).find('li').each(function() {
				tmpValue = tmpValue.concat([$(this).attr('value')]);
			})
			if (tmpValue.length > 0 && $(this).attr('id')) {
				tmp[$(this).attr('id')] = tmpValue;
			}
		});
		return tmp;
	}
};

/**Create a UL element can get value
 * @param {Object} target		JQuery selected target element
 * @param {Object} keyList		List of item on page
 * @param {Object} valueList	List of value in value array
 * @param {Object} ulId			New UL element attribution id
 */
function createUl(target, keyList, valueList, ulId) {
	if (!target || !keyList) {
		return false;
	}
	if (!valueList) {
		valueList = keyList;
	}
	if (!keyList.length || !valueList.length || valueList.length > keyList.length) {
		return false;
	}
	let tmp = '';
	for (let i = 0; i < keyList.length; i++) {
		tmp = tmp.concat('<li value="' + valueList[i] + '">' + keyList[i] + '</li>');
	}
	if (ulId) {
		tmp = ''.concat('<ul id="' + ulId + '">' + tmp + '</ul>');
	} else {
		tmp = ''.concat('<ul>' + tmp + '</ul>');
	}
	$(target).append(tmp);
	return true;
}
