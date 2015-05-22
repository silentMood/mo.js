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
			scene.childs.push(new Directive({
				dirName: attr.nodeName.replace(config.prefix, ''),
				expression: attr.value,
				parent: scene,
				el: el
			}));
		}
	}
}

function compileDirectives(el, scene) {
	assert(el !== null);
	assert(scene !== null);

	scene.$emit('BeginRegisterDirectives');
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
			if($childNodes[i].nodeType != document.TEXT_NODE) {
				$nodes.push($childNodes[i]);
			}
		}
		$nodes.shift();
	}
	scene.$emit('EndRegisterDirectives');
}

function compileScenes(el, root) {
	assert(el !== null);

	attrs = el.attributes;
	for(var i = 0; i < attrs.length; i++) {
		attr = attrs.item(i);
		scene = new Scene({sceneId: attr.value, parent: root, el: el});
		root.childs.push(scene);
		compileDirectives(el, scene);
	}
}

function compile(el, root) {
	assert(el !== null);
	//first need to be refactored
	$scenes = el.querySelectorAll('.scene');
	for(var i = 0; i < $scenes.length; i++) {
		compileScenes($scenes[i], root);
	}
}

module.exports = {
	$compile: compile
};