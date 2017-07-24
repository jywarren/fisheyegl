module.exports = function(grunt) {

  grunt.loadNpmTasks('grunt-replace');
  grunt.loadNpmTasks('grunt-browserify');

  grunt.initConfig({

    pkg: grunt.file.readJSON('package.json'),

    replace: {
      dist: {
        options: {
          preserveOrder: true,
          usePrefix: false,
          patterns: [
            {
              match: /^(.*)$/mg,
              replacement: '$1\\n\\'
            },
            {
              match: /^(.*)$/m,
              replacement: 'module.exports = \"\\\n$1'
            },
            {
              match: /^\\n\\$(\n)?/mg,
              replacement: ''
            },
            {
              match: /(.*)$/,
              replacement: '$1\";'
            }
          ]
        },
        files: [{
            expand: true,
            flatten: true,
            src: 'shaders/*',
            dest: 'src/shaders/',
            rename: function(dest, src) {
              return dest + src.replace(/s$/,"s.js");
            }
        }]
      }
    },

    browserify: {
      dist: {
        src: 'src/fisheyegl.js',
        dest: 'dist/fisheyegl.js'
      }
    }

  });

  grunt.registerTask('gen-shader-modules', 'replace');
  grunt.registerTask('build', 'browserify');

  grunt.registerTask('default', ['replace','browserify']);

}
