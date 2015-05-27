var config = require('./config');
var assert = require('./assert');
var Scene = require('./scene');
var Directive = require('./directive');
var _ = require('./utils');

var sceneIdentifier = 'scene';

function linkDirectives(el, scene) {
	assert(scene !== null);

	var attrs = el.attributes;
	for(var i = 0; i < attrs.length; i++) {
		attr = attrs.item(i);
		if(attr.nodeName.match(config.prefix)) {
			var dir = new Directive({
				dirName: attr.nodeName.replace(config.prefix, ''),
				expression: attr.value,
				scene: scene,
				el: el
			});
			//set app data structure
			scene.childs.push(dir);
			dir.parent = scene;
			//set the link fns
			scene.fns.push(dir.bind.bind(dir));
			scene.ufns.push(dir.unbind.bind(dir));
		}
	}
}

function compileDirectives(scene) {
	assert(scene !== null);

	var $nodes = [scene.el];
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
}

function compile(el, root) {
	assert(el !== null);
	//compile all the things
	var els = document.querySelectorAll('script[scene]');

	for(var idx = 0; idx < els.length; idx++) {
		var el = els[idx];
		var sceneId = _.getAttrValByName(el, 'scene');
		if(root.childs[sceneId]) {
			//warning
			console.log('can not set the same scene id');
			//then ignore this scene
			continue;
		}
		//set app data structure
		root.childs[sceneId] = new Scene({el: el, root: root});
		root.childs[sceneId].parent = root;
		//start compile the scene function
		compileDirectives(root.childs[sceneId]);
	}
}

module.exports = {
	$compile: compile
};