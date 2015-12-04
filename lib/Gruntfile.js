module.exports = function(grunt) {

  grunt.initConfig({
    jshint: {
      files: ['../js/**/*.js']
    },
    sass: {
      dist: {
        files: {
          '../style/css/main.css': '../style/sass/main.scss'
        }
      }
    },
    watch: {
      javascripts: {
        files: ['../js/**/*.js'],
        tasks: ['jshint']
      },
      sassy: {
        files: ['../styles/sass/**/*.scss'],
        tasks: ['sass']
      }
    }
  });

  require('matchdep').filterDev('grunt-*').forEach(grunt.loadNpmTasks);
  grunt.registerTask('default', ['jshint', 'sass', 'watch']);
};