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
			dir = new Directive({
				dirName: attr.nodeName.replace(config.prefix, ''),
				expression: attr.value,
				el: el
			});
			//confirm the relationship
			scene.childs.push(dir);
			dir.parent = scene;
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

// function compileScenes(el, root) {
// 	assert(el !== null);

// 	attrs = el.attributes;
// 	for(var i = 0; i < attrs.length; i++) {
// 		attr = attrs.item(i);
// 		scene = new Scene({sceneId: attr.value, el: el});
// 		//confirm the relationship
// 		root.childs.push(scene);
// 		scene.parent = root;

// 		compileDirectives(el, scene);
// 	}
// }

function compile(el, root) {
	assert(el !== null);
	//first need to be refactored
	scene = new Scene({sceneId: attr.value, el: el});
	//confirm the relationship
	root.childs.push(scene);
	scene.parent = root;

	compileDirectives(el, scene);
}

module.exports = {
	$compile: compile
};