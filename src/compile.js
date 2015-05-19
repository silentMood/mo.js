var assert = require('./assert');
var dPrefix = 'd-';

function compile(el) {
	assert(el !== null);

	$nodes = [el];
	while($nodes.length) {
		$el = $nodes[0];
		$childNodes = $el.childNodes;
		if(!$childNodes.length) {
			$el.shift();
			continue;
		}
		for(var i = 0; i < $childNodes.length; i ++) {
			$node = $childNodes[i];
			//key link directive
			LinkDirective($node);
			$nodes.push($node);
		}
		$el.shift();
	}

}

function LinkDirective(el) {
	//need more assert
	assert(el !== null);

	attrs = el.attributes;
	for(var i = 0; i < attrs.length; i++) {
		attr = attrs.item(i);
		if(attr.nodeName.match(dPrefix)) {
			//link work
		}
	}
}

module.exports = {
	$compile: compile
}