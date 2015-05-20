// Generated by CoffeeScript 1.7.1
'use strict';
module.exports = function(grunt) {
  grunt.initConfig({
    browserify: {
      dist: {
        files: {
          'dist/bundle.js': ['src/compile.js']
        }
      }
    },
    exec: {
      clean: {
        command: 'rm -rf dist'
      }
    },
  });

  grunt.loadNpmTasks('grunt-browserify');
  grunt.loadNpmTasks('grunt-exec');

  grunt.registerTask('test', [
    'browserify', 
    //todo
  ]);
  grunt.registerTask('build', [
    'browserify',
    //todo
  ]);
};
