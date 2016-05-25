module.exports = function(grunt) {
    grunt.loadNpmTasks('grunt-contrib-copy');
    require('load-grunt-tasks')(grunt);
    grunt.initConfig({
        clean: ['dist/*.html',
            'dist/css/*',
            'dist/js/*',
            'dist/img/*'
        ],
        jshint: {
            options: {
                curly: true,
                eqeqeq: true,
                eqnull: true,
                browser: true,
                globals: {
                    jQuery: true
                },
            },
            uses_defaults: ['js/*.js'],
        },
        csslint: {
            strict: {
                options: {
                    import: 2
                },
                src: ['css/style.css']
            }
        },
        validation: {
            options: {
                reset: grunt.option('reset') || false,
                stoponerror: true,
                relaxerror: ['Bad value X-UA-Compatible for attribute http-equiv on element meta.'], //ignores these errors
            },
            files: {
                src: ['index.html']
            }
        },
        copy: {
            main: {
                files: [{
                    expand: true,
                    cwd: 'css/lib/bootstrap-3.3.6-dist/css',
                    src: ['bootstrap.min.css'],
                    dest: 'dist/css/lib/bootstrap-3.3.6-dist/css/'
                }, {
                    expand: true,
                    cwd: 'js/lib',
                    src: ['jquery-2.2.3.min.js', 'knockout-3.4.0.js', 'oauth-signature.min.js'],
                    dest: 'dist/js/lib'
                }, {
                    expand: true,
                    cwd: 'js/lib/jquery-ui-1.11.4',
                    src: ['jquery-ui.min.js', 'jquery-ui.min.css'],
                    dest: 'dist/js/lib/jquery-ui-1.11.4'
                }]
            },
            images1: {
                files: [{
                    expand: true,
                    cwd: 'img',
                    src: ['icons/*', 'markers/*'],
                    dest: 'dist/img/'
                }]
            },
            images2: {
                files: [{
                    expand: true,
                    cwd: 'js/lib/jquery-ui-1.11.4/images/',
                    src: ['*'],
                    dest: 'dist/js/lib/jquery-ui-1.11.4/images/'
                }]
            }
        },
        htmlmin: { // Task
            dist: { // Target
                options: { // Target options
                    removeComments: true,
                    collapseWhitespace: true
                },
                files: {
                    'dist/index.html': 'index.html', // 'destination': 'source'
                    'dist/README.md': 'readme.md'
                }
            },
        },
        cssmin: {
            target: {
                files: [{
                    expand: true,
                    cwd: 'css',
                    src: ['*.css'],
                    dest: 'dist/css',
                    ext: '.css'
                }]
            }
        },
        uglify: {
            options: {
                mangle: false
            },
            my_target: {
                files: {
                    'dist/js/app.js': ['js/app.js'],
                }
            }
        }
    });
    grunt.registerTask('default', [
        'clean',
        'jshint',
        'validation',
        'csslint',
        'htmlmin',
        'cssmin',
        'uglify',
        'copy'
    ]);
}