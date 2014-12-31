module.exports = function (grunt) {
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        manifest: grunt.file.readJSON('manifest.json'),

        crx: {
            staging: {
                "src": [
                    "./**/*",
                    "!.{git,svn}",
                    "!*.pem",
                    "!dist/**"
                ],
                "dest": "dist/staging/src/<%= pkg.name %>-<%= manifest.version %>-dev.crx",
                "zipDest": "dist/staging/src/<%= pkg.name %>-<%= manifest.version %>-dev.zip",
                "options": {
                    "baseURL": "http://codeweft.com/blockaid/",
                    "filename": "",
                    "privateKey": "dist/key.pem",
                    "maxBuffer": 3000 * 1024 //build extension with a weight up to 3MB
                }
            },
            production: {
                "src": [
                    "./**/*",
                    "!.{git,svn}",
                    "!*.pem",
                    "!dev/**",
                    "!dist/**"
                ],
                "dest": "dist/production/src/<%= pkg.name %>-<%= manifest.version %>-dev.crx",
                "zipDest": "dist/production/src/<%= pkg.name %>-<%= manifest.version %>-dev.zip",
                "options": {
                    "baseURL": "http://codeweft.com/blockaid/",
                    "maxBuffer": 3000 * 1024 //build extension with a weight up to 3MB
                }
            }
        }
    });


    grunt.loadNpmTasks( 'grunt-crx' );
    grunt.loadNpmTasks( 'grunt-contrib-compress' );
    grunt.registerTask( 'package', [ 'crx:production', 'compress:production' ] );
    grunt.registerTask( 'default', [ 'crx:staging', 'compress:staging'] );
}