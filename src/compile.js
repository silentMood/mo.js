var config = require('./config');
var assert = require('./assert');
var Scene = require('./scene');
var Directive = require('./directive');

var sceneIdentifier = 'scene';

function linkDirectives(el, scene) {
	assert(el !== null);
	assert(scene !== null);

	attrs = el.attributes;
	for(var i = 0; i < attrs.length; i++) {
		attr = attrs.item(i);
		if(attr.nodeName.match(config.prefix)) {
			//compile directive
			Directive.$register(attr.nodeName, attr.value, scene, el);
		}
	}
}

function compileDirectives(el, scene) {
	assert(el !== null);
	assert(scene !== null);

	$nodes = [el];
	while($nodes.length) {
		$el = $nodes[0];
		linkDirectives($el, scene);
		
		$childNodes = $el.childNodes;
		if(!$childNodes.length) {
			$nodes.shift();
			continue;
		}
		for(var i = 0; i < $childNodes.length; i++) {
			$nodes.push($childNodes[i]);
		}
		$el.shift();
	}	
}

function compileScenes(el) {
	assert(el !== null);

	attrs = el.attributes;
	for(var i = 0; i < attrs.length; i++) {
		attr = attrs.item(i);
		scene = new Scene({sid: attr.value});
		compileDirectives(el, scene);
	}
}

function compile(el) {
	assert(el !== null);
	//first
	$scenes = document.querySelectorAll('.scene');
	for(var i = 0; i < $scenes.length; i++) {
		compileScenes($scenes[i]);
	}
}

module.exports = {
	$compile: compile
};