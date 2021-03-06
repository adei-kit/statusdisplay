/* browserify task
   ---------------
   Bundle javascripty things with browserify!

   If the watch task is running, this uses watchify instead
   of browserify for faster bundling using caching.
*/

var browserify   = require('browserify');
var ractify      = require('ractify');
var watchify     = require('watchify');
var bundleLogger = require('../util/bundleLogger');
var gulp         = require('gulp');
var handleErrors = require('../util/handleErrors');
var source       = require('vinyl-source-stream');
var minifyify    = require('minifyify');


gulp.task('browserify', function() {

    var bundleMethod = global.isWatching ? watchify : browserify;

    var bundler = bundleMethod({
        // Specify the entry point of your app
        //entries: ['../static/js/default/index.js'],
        entries: ['./src/js/app.js'],
        //entries: ['../static/js/default.js', '../static/js/default/index.js'],
        // Add file extentions to make optional in your requires
        extensions: ['.js']
    });

    bundler.transform({ extension: 'html' }, ractify);
    //bundler.plugin('minifyify', {map: 'bundle.map.json'});

    var bundle = function() {
        // Log when bundling starts
        bundleLogger.start();

        return bundler
            .bundle({debug: true})
            // Report compile errors
            .on('error', handleErrors)
            // Use vinyl-source-stream to make the
            // stream gulp compatible. Specifiy the
            // desired output filename here.
            .pipe(source('bundle.js'))
            // Specify the output destination
            .pipe(gulp.dest('./build/'))
            // Log when bundling completes!
            .on('end', bundleLogger.end);
    };

    if(global.isWatching) {
        // Rebundle with watchify on changes.
        bundler.on('update', bundle);
    }

    return bundle();
});

