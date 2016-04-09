module.exports = function (grunt) {
  grunt.initConfig({
    concat: {
      options: {
        banner: "/* Placebo v.<%= pkg.version %> - http://dmnevius.net/placebo */(function (context) {",
        footer: "}(this));",
        separator: "\n",
        stripBanners: true,
        sourceMap: true
      },
      dist: {
        src: ['src/core.js', 'src/parser.js', 'src/builder.js', 'src/interface.js', 'src/integration.js'],
        dest: 'placebo.js'
      }
    },
    jsbeautifier: {
      files: ['placebo.js']
    },
    jshint: {
      files: ['src/core.js', 'src/builder.js', 'src/interface.js', 'src/integration.js', 'src/ender.js']
    },
    pkg: grunt.file.readJSON('package.json'),
    shell: {
      target: {
        command: "cd src && pegjs --export-var placebo.parser parser.pegjs"
      }
    },
    uglify: {
      target: {
        files: {
          'placebo.min.js': 'placebo.js'
        },
        options: {
          banner: "/* Placebo v.<%= pkg.version %> - http://dmnevius.net/placebo */",
          sourceMap: true,
          sourceMapName: 'placebo.min.js.map'
        }
      }
    }
  });

  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-jsbeautifier');
  grunt.loadNpmTasks('grunt-shell');

  // Use default for normal changes and testing
  grunt.registerTask('default', ['jshint', 'concat']);

  // Use build for preparing for a new release
  grunt.registerTask('build', ['shell', 'concat', 'uglify', 'jsbeautifier']);
}
