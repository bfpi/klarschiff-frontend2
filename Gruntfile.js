module.exports = function(grunt) {
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    min: "<%= grunt.config('env') === 'production' ? '.min' : '' %>",
    versions: {
      bootstrap: '3.3.1',
      ol: 'v3.1.1',
      jq: '1.11.2',
      jqui: '1.11.2',
      proj4: '2.3.3',
    },
/*    shell: {
      'config-js': ... {
        }*/
    curl: {
      'config-js': {
        dest: 'javascripts/build/config.js',
        src: 'http://localhost/hgw/pc/config/config.js.php',
      },
      'jq-ks-spinner-js': {
        dest: 'javascripts/build/jquery.ks.spinner.js',
        src: 'http://localhost/hgw/pc/javascripts/jquery.ks.spinner.php',
      },
      'init-ks-lut-js': {
        dest: 'javascripts/build/init_ks_lut.js',
        src: 'http://localhost/hgw/pc/javascripts/init_ks_lut.js.php',
      },
      'ol-css': {
        dest: 'libs/OpenLayers.css',
        src: 'https://raw.githubusercontent.com/openlayers/ol3/<%= versions.ol %>/css/ol.css',
      },
      'ol-min-css': {
        dest: 'libs/OpenLayers.min.css',
        src: 'http://openlayers.org/en/<%= versions.ol %>/css/ol.css',
      },
      'ol-js': {
        dest: 'libs/OpenLayers.js',
        src: 'http://openlayers.org/en/<%= versions.ol %>/build/ol-debug.js',
      },
      'ol-min-js': {
        dest: 'libs/OpenLayers.min.js', 
        src: 'http://openlayers.org/en/<%= versions.ol %>/build/ol.js',
      },
      'bootstrap-css': {
        dest: 'libs/bootstrap.css',
        src: 'https://maxcdn.bootstrapcdn.com/bootstrap/<%= versions.bootstrap %>/css/bootstrap.css',
      },
      'bootstrap-min-css': {
        dest: 'libs/bootstrap.min.css',
        src: 'https://maxcdn.bootstrapcdn.com/bootstrap/<%= versions.bootstrap %>/css/bootstrap.min.css',
      },
      'bootstrap-js': {
        proxy: '',
        dest: 'libs/bootstrap.js',
        src: 'https://maxcdn.bootstrapcdn.com/bootstrap/<%= versions.bootstrap %>/js/bootstrap.js',
      },
      'bootstrap-min-js': {
        dest: 'libs/bootstrap.min.js',
        src: 'https://maxcdn.bootstrapcdn.com/bootstrap/<%= versions.bootstrap %>/js/bootstrap.min.js',
      },
      'jq-js': {
        dest: 'libs/jquery.js',
        src: 'http://code.jquery.com/jquery-<%= versions.jq %>.js',
      },
      'jq-min-js': {
        dest: 'libs/jquery.min.js',
        src: 'http://code.jquery.com/jquery-<%= versions.jq %>.min.js',
      },
      'proj4-js': {
        dest: 'libs/proj4js.js',
        src: 'https://github.com/proj4js/proj4js/releases/download/<%= versions.proj4 %>/proj4-src.js',
      },
      'proj4-min-js': {
        dest: 'libs/proj4js.min.js',
        src: 'https://github.com/proj4js/proj4js/releases/download/<%= versions.proj4 %>/proj4.js',
      },
      'jq-placeholder-js': {
        dest: 'libs/jquery-placeholder.js',
        src: 'https://jquery-placeholder-js.googlecode.com/svn/trunk/jquery.placeholder.1.3.js',
      },
      'jq-tmpl-js': {
        dest: 'libs/jquery-tmpl.js',
        src: 'https://raw.githubusercontent.com/KanbanSolutions/jquery-tmpl/1.0.4/jquery.tmpl.js',
      },
      'jq-form-js': {
        dest: 'libs/jquery-form.js',
        src: 'https://raw.githubusercontent.com/malsup/form/3.51/jquery.form.js',
      },
      'jq-ui-js': {
        dest: 'libs/jquery-ui.js',
        src: 'https://code.jquery.com/ui/<%= versions.jqui %>/jquery-ui.js',
      },
      'jq-ui-min-js': {
        dest: 'libs/jquery-ui.min.js',
        src: 'https://code.jquery.com/ui/<%= versions.jqui %>/jquery-ui.min.js',
      },
    },
    concat: {
      options: {
        separator: ';',
        sourceMap: true,
        sourceMapStyle: 'link',
      },
      'index-js': {
        files: {
          "javascripts/build/index.js": [
            "javascripts/functions<%= min %>.js",
            "javascripts/build/config<%= min %>.js",
            "javascripts/ks-search<%= min %>.js",
            "javascripts/projections<%= min %>.js",
            "javascripts/OpenLayers-layerFactories<%= min %>.js",
            "javascripts/index<%= min %>.js"
          ],
        }
      },
      'map-js': {
        files: {
          "javascripts/build/map.js": [
            "javascripts/functions<%= min %>.js",
            "javascripts/build/config<%= min %>.js",
            "javascripts/projections<%= min %>.js",
            "javascripts/build/jquery.ks.spinner<%= min %>.js",
            "javascripts/OpenLayers-layerFactories<%= min %>.js",
            "javascripts/ks-search<%= min %>.js",
            "javascripts/init_map<%= min %>.js",
            "javascripts/init_sidebar_neue_meldung<%= min %>.js",
            "javascripts/init_sidebar_beobachtungsflaechen<%= min %>.js",
            "javascripts/init_sidebar_mapicons<%= min %>.js",
            "javascripts/init_sidebar<%= min %>.js",
            "javascripts/build/init_ks_lut<%= min %>.js",
            "javascripts/init<%= min %>.js",
            "javascripts/meldung_show<%= min %>.js"
            ],
        }
      },
      'libs-js': {
        files: {
          "javascripts/build/libs.js": [
            "libs/jquery<%= min %>.js",
            "libs/bootstrap<%= min %>.js",
            "libs/jquery-tmpl<%= min %>.js",
            "libs/jquery-placeholder<%= min %>.js",
            "libs/jquery-ui<%= min %>.js",
            "libs/jquery-form<%= min %>.js",
            "libs/proj4js<%= min %>.js",
            // OpenLayers funktioniert hier zur Zeit noch nicht in der minimieren Version -> TODO!
            /*"libs/OpenLayers<%= min %>.js",*/
            "libs/OpenLayers.js",
            ],
        }
      },
    },
    uglify : {
      options: {
        mangle: false,
      },
      js: {
        files: {
          "javascripts/OpenLayers-layerFactories.min.js": "javascripts/OpenLayers-layerFactories.js",
          "javascripts/build/config.min.js": "javascripts/build/config.js",
          "javascripts/build/init_ks_lut.min.js": "javascripts/build/init_ks_lut.js",
          "javascripts/build/jquery.ks.spinner.min.js": "javascripts/build/jquery.ks.spinner.js",
          "javascripts/functions.min.js": "javascripts/functions.js",
          "javascripts/index.min.js": "javascripts/index.js",
          "javascripts/init.min.js": "javascripts/init.js",
          "javascripts/init_map.min.js": "javascripts/init_map.js",
          "javascripts/init_sidebar.min.js": "javascripts/init_sidebar.js",
          "javascripts/init_sidebar_beobachtungsflaechen.min.js": "javascripts/init_sidebar_beobachtungsflaechen.js",
          "javascripts/init_sidebar_mapicons.min.js": "javascripts/init_sidebar_mapicons.js",
          "javascripts/init_sidebar_neue_meldung.min.js": "javascripts/init_sidebar_neue_meldung.js",
          "javascripts/ks-search.min.js": "javascripts/ks-search.js",
          "javascripts/meldung_show.min.js": "javascripts/meldung_show.js",
          "javascripts/projections.min.js": "javascripts/projections.js",
          "libs/jquery-form.min.js": "libs/jquery-form.js",
          "libs/jquery-placeholder.min.js": "libs/jquery-placeholder.js",
          "libs/jquery-tmpl.min.js": "libs/jquery-tmpl.js",
        }
      }
    },
    watch: {
      'js-php': {
        files: '{config,javascripts}/*.js.php',
        tasks: 'curl:prebuild-js',
      },
      js: {
        files: ['javascripts/**/*.js', '!javascripts/build/{index,map}{,-libs}.js'],
        tasks: ['concat:js'],
      },
      'libs-js': {
        files: 'libs/*.js',
        tasks: 'concat:libs-js',
      },
    },
  });

  grunt.config('env', grunt.option('env') || process.env.GRUNT_ENV || 'development');

  grunt.loadNpmTasks('grunt-curl');
  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-shell');

  grunt.registerTask('curl:libs', [ 
      'curl:bootstrap-css',
      'curl:bootstrap-js',
      'curl:bootstrap-min-css',
      'curl:bootstrap-min-js',
      'curl:jq-form-js',
      'curl:jq-js',
      'curl:jq-min-js', 
      'curl:jq-placeholder-js',
      'curl:jq-tmpl-js',
      'curl:jq-ui-js',
      'curl:jq-ui-min-js',
      'curl:ol-css',
      'curl:ol-js',
      'curl:ol-min-css',
      'curl:ol-min-js',
      'curl:proj4-js',
      'curl:proj4-min-js',
      ]);

  grunt.registerTask('curl:prebuild-js', ['curl:config-js', 'curl:jq-ks-spinner-js', 'curl:init-ks-lut-js']);

  grunt.registerTask('concat:js', ['concat:index-js', 'concat:map-js']);
  grunt.registerTask('install', ['curl:libs', 'default']);

  grunt.registerTask('dev-default', ['concat', 'watch']);
  grunt.registerTask('prod-default', ['uglify:js', 'concat']);

  grunt.registerTask('default', ['curl:prebuild-js', (grunt.config('env') === 'production' ? 'prod' : 'dev') + '-default']);
};
