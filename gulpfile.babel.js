import gulp from 'gulp';
import sourcemaps from 'gulp-sourcemaps';
import autoprefixer from 'gulp-autoprefixer';
import sass from 'gulp-sass';
import rename from 'gulp-rename';
import clean from 'gulp-clean-dest';
import uglify from 'gulp-uglify';
import minify from 'gulp-clean-css';

import path from 'path';

import buffer from 'vinyl-buffer';
import source from 'vinyl-source-stream';

import browserify from 'browserify';
import babelify from 'babelify';

const dirs = {
    src: 'src',
    dest: 'static'
};

const config = {
    sass: {
        entry: 'index.scss',
        output: 'app.css',
        src: path.join(__dirname, dirs.src, 'scss'),
        dest: path.join(__dirname, dirs.dest, 'css')
    },
    js: {
        entry: 'index.js',
        output: 'app.js',
        src: path.join(__dirname, dirs.src, 'js'),
        dest: path.join(__dirname, dirs.dest, 'js')
    }
};


gulp.task('js', () => {
    const bundler = browserify({
        entries: path.join(config.js.src, config.js.entry),
        debug: true
    });
    bundler.transform(babelify);

    return bundler.bundle()
        .on('error', () => {
            console.log('--> Bundling error');
        })
        .pipe(source(config.js.output))
        .pipe(buffer())
        .pipe(sourcemaps.init({
            loadMaps: true
        }))
        .pipe(uglify())
        .pipe(clean(config.js.dest))
        .pipe(sourcemaps.write('.'))
        .pipe(gulp.dest(config.js.dest));

});

gulp.task('sass', () =>
    gulp.src(path.join(config.sass.src, config.sass.entry))
        .pipe(sourcemaps.init({
            loadMaps: true
        }))
        .pipe(sass.sync().on('error', sass.logError))
        .pipe(autoprefixer())
        .pipe(rename(config.sass.output))
        .pipe(minify())
        .pipe(clean(config.sass.dest))
        .pipe(sourcemaps.write('.'))
        .pipe(gulp.dest(config.sass.dest))
);

gulp.task('watch', ['bundle'], () => {
    gulp.watch(path.join(config.sass.src, '**/*.scss'), ['sass']);
    gulp.watch(path.join(config.js.src, '**/*.js'), ['js']);
});

gulp.task('bundle', ['js', 'sass']);

gulp.task('default', ['watch']);

















