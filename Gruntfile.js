module.exports = function(grunt){
    grunt.loadNpmTasks('grunt-contrib-copy');
    require('load-grunt-tasks')(grunt);
    grunt.initConfig({
     clean : ['dist/*.html',
              'dist/css/*',
              'dist/js/*',
              'dist/img/*'],
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
      copy: {
        main: {
          files: [
          {expand: true, cwd: 'css/lib/bootstrap-3.3.6-dist/css',
          src: ['bootstrap.min.css'],
          dest: 'dist/css/lib/bootstrap-3.3.6-dist/css/'}
          ]},
          images:{
          files: [
          {expand: true, cwd: 'img',
          src: ['icons/*','markers/*'],
          dest: 'dist/img/'}
          ]}
    },
    htmlmin: {                     // Task
        dist: {                                      // Target
          options: {                                 // Target options
            removeComments: true,
            collapseWhitespace: true
          },
          files: {
            'dist/index.html': 'index.html',     // 'destination': 'source'
            'dist/README.md': 'readme.md'
          }
        },
      },
    cssmin: {
      target: {
        files: [{
          expand: true,
          cwd: 'css',
          src: ['*.css' ],
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
   grunt.registerTask('default',[
      'clean',
      'jshint',
      'htmlmin',
      'cssmin',
      'uglify',
      'copy'
   ]);
}
