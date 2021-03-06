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
        exec: {
            

            run_python_unit_tests: {
                command: 'python flask_tests.py'
            }
        }
/*	watch: {
	    files: ['<%= jshint.files %>'],
	    tasks: ['jshint', 'qunit']
	}*/
    });


    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-exec');

    grunt.registerTask('test', ['jshint', 'exec']);

    grunt.registerTask('default', ['jshint', 'exec']);

};

