const { series, watch, src, dest, parallel } = require('gulp');
const pump = require('pump');

// gulp plugins and utils
var livereload = require('gulp-livereload');
var postcss = require('gulp-postcss');
var beeper = require('beeper');

// postcss plugins
var autoprefixer = require('autoprefixer');
var colorFunction = require('postcss-color-function');
var cssnano = require('cssnano');
var customProperties = require('postcss-custom-properties');
var easyimport = require('postcss-easy-import');

function serve(done) {
    livereload.listen();
    done();
}

const handleError = (done) => {
    return function (err) {
        if (err) {
            beeper();
        }
        return done(err);
    };
};

function css(done) {
    var processors = [
        easyimport,
        customProperties({ preserve: false }),
        colorFunction(),
        autoprefixer({ browsers: ['last 2 versions'] }),
        cssnano()
    ];

    pump([
        src('assets/css/*.css', { sourcemaps: true }),
        postcss(processors),
        dest('assets/built/', { sourcemaps: '.' }),
        livereload()
    ], handleError(done));
}

const watcher = () => watch('assets/css/**', css);
const build = series(css);
const dev = series(build, serve, watcher);

exports.build = build;
exports.default = dev;
