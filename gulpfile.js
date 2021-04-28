let project_folder = "dist";
let source_folder = 'src';

let path ={
    build:{
        html:project_folder+"/",
        css:project_folder+"/css/",
        js:project_folder+"/js/",
        img:project_folder+"/img/",
        fonts:project_folder+"/fonts/",
    },
    src:{
        html:[source_folder+"/*.html","!"+source_folder+"/_*.html"],
        css:source_folder+"/scss/style.scss",
        js:source_folder+"/js/script.js",
        img:source_folder+"/img/**/*.{jpg,png,svg}",
        fonts:source_folder+"/fonts/*.{ttf,woff}",
    },
    watch:{
        html:source_folder+"/**/*.html",
        css:source_folder+"/scss/**/*.scss",
        js:source_folder+"/js/**/*.js",
        img:source_folder+"/img/**/*.{jpg,png,svg}",
    },
    clean:"./"+project_folder+'/',
}

let {src, dest } = require('gulp'),
gulp = require ('gulp')
browsersync = require("browser-sync").create()
fileinclude = require('gulp-file-include')
del = require('del')
scss = require('gulp-sass')
autoprefixer = require('gulp-autoprefixer')
cleancss = require('gulp-clean-css')
rename = require("gulp-rename")
uglify = require("gulp-uglify-es").default
babel = require("gulp-babel")
imgaemin = require('gulp-imagemin')
webp = require("gulp-webp")
groupmedia = require('gulp-group-css-media-queries')

function browserSync()
{
    browsersync.init({
        server:{
            baseDir:`./${project_folder}/`
        },
        port:3000,
        notify:false,
    })
}
function html()
{
    return src(path.src.html)
    .pipe(fileinclude())
    .pipe(dest(path.build.html))
    .pipe(browsersync.stream())
}

function fonts()
{
    return src(path.src.fonts)
    .pipe(dest(path.build.fonts))
    .pipe(browsersync.stream())
}

function image()
{
    return src(path.src.img)
    .pipe(imgaemin(
        {
            prgressive:true,
            svgoPlugins: [
                {
                    removeViewBox: false
                }
                
            ],
            interlaced: true, 
            optimizationLevel: 5,
        }
    ))
    .pipe(dest(path.build.img))
    .pipe(browsersync.stream())
}


function js()
{
    return src(path.src.js)
    .pipe(fileinclude())
    .pipe (babel(
        {
            presets: ['@babel/env']
        }
    ))
    .pipe(dest(path.build.js))
    .pipe (uglify())
    .pipe(rename(
        {
            extname: '.min.js'
        }
    ))
    .pipe(dest(path.build.js))
    .pipe(browsersync.stream())
}

function css()
{
    return src(path.src.css)
    .pipe (scss(
        {
            outputStyle: "expanded"
        }
    ))
    .pipe(autoprefixer(
        {
            overrideBrowserslist:["last 5 versions"],
            cascade:true
        }
    ))
    .pipe(groupmedia())
    .pipe(dest(path.build.css))
    .pipe(cleancss())
    .pipe(rename(
        {
            extname: '.min.css'
        }
    ))
    .pipe(dest(path.build.css))
    .pipe(browsersync.stream())
}

function watchfiles ()
{
    gulp.watch([path.watch.html],html)
    gulp.watch([path.watch.css],css)
    gulp.watch([path.watch.js],js)
    gulp.watch([path.watch.img],image)
}

function clean()
{
 return del(path.clean)
}

let build = gulp.series(clean,gulp.parallel(js,css,html,image,fonts));
let watch = gulp.parallel(build,watchfiles, browserSync);

exports.fonts = fonts
exports.image = image
exports.js = js;
exports.css = css;
exports.html = html;
 exports.build = build;
 exports.watch = watch;
 exports.default = watch;
