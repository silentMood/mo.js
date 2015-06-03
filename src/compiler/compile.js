var config = require('../config');
var assert = require('../assert');
var Directive = require('../core/directive');
var _ = require('../utils');

var sceneIdentifier = 'scene';

function generateLinkFns(el, scene) {
	assert(scene !== null);

	var linkedAttrNames = [];

	var attrs = el.attributes;
	for(var i = 0; i < attrs.length; i++) {
		var attr = attrs.item(i);
		if(attr.nodeName.match(config.prefix)) {
			var dir = new Directive({
				dirName: attr.nodeName.replace(config.prefix, ''),
				expression: attr.value,
				scene: scene,
				el: el
			});
			//set app data structure, it's better to move inside
			scene.childs.push(dir);
			dir.parent = scene;
			//set the link fns
			scene.fns.push(dir.bind.bind(dir));
			scene.ufns.push(dir.unbind.bind(dir));
			//linkedAttrNames
			linkedAttrNames.push(attr.nodeName);
		}
	}
	//remove the linked attribute
	linkedAttrNames.forEach(function(name) {
		attrs.removeNamedItem(name);
	});
}

function compile(scene) {
	//assert error
	assert(scene !== null);

	var $nodes = [scene.el];
	while($nodes.length) {
		var $el = $nodes[0];
		generateLinkFns($el, scene);
		
		var $childNodes = $el.childNodes;
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
}

module.exports = {
	$compile: compile
};