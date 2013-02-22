module.exports = function(grunt) {

    grunt.initConfig({
	pkg: grunt.file.readJSON('package.json'),
 	jshint: {
	    files: ['gruntfile.js', 'static/js/TZoneApp*.js'],
	    options: {
        // options here to override JSHint defaults
		globals: {
		    jQuery: true,
		    console: true,
		    module: true,
		    document: true
		}
	    }
	},
/*	watch: {
	    files: ['<%= jshint.files %>'],
	    tasks: ['jshint', 'qunit']
	}*/
    });


    grunt.loadNpmTasks('grunt-contrib-jshint');

    grunt.registerTask('test', ['jshint']);

    grunt.registerTask('default', ['jshint']);

};

