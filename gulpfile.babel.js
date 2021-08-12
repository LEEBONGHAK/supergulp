import gulp from "gulp";
import gpug from "gulp-pug";                        // pug 파일을 html로 변환 시키는 데 사용하는 라이브러리 (have to install gulp-gup)
import del from "del";                              // 이미 build된 내용을 삭제하기 위한 라이브러리 (have to install del)
import ws from "gulp-webserver";                    // 개발 서버(localhost 서버 같은 것)를 만드는 데 사용하는 라이브러리 (have to install gulp-webserver)
import gimage from "gulp-image";                    // 이미지를 다루기 위한 라이브러리 (have to install gulp-image)
import autoprefixer from "gulp-autoprefixer";       // 작업한 코드를 알아듣지 못하는 구형 브라우저도 호환 가능하도록 만들어줌 (have to install gulp-autoprefixer)
import miniCSS from "gulp-csso";                    // css 파일을 최소화 해주는 라이브러리 (have to install gulp-csso)
import bro from "gulp-bro";                         // 브라우저에서 Node.js 스타일의 모듈을 사용하기 위한 오픈 소스 JS 툴인 Browserify를 사용하기 위한 라이브러리 (have to install gulp-bro)
import babelify from "babelify";                    // babel을 사용하기 위한 라이브러리 (have to install babelify)
import ghPages from "gulp-gh-pages";                // github page로 배포하기 위한 라이브러리 (have to install gulp-gh-pages)

const sass = require("gulp-sass")(require("node-sass"));      // sass 를 사용하기 위한 라이브러리 (have to install node-sass and gulp-sass)

const routes = {
    pug: {
        watch: "src/**/*.pug",       // src 내 모든 파일의 변동사항을 확인하기 위해
        src: "src/*.pug",            // src: "src/**/*.pug" : 폴더 안쪽의 파일까지 변환 시키고 싶을 경우 사용
        dest: "build"
    },
    img: {
        src: "src/img/*",
        dest: "build/img"
    },
    scss: {
        watch: "src/scss/**/*.scss",
        src: "src/scss/style.scss",
        dest: "build/css"
    },
    js: {
        watch: "src/js/**/*.js",
        src: "src/js/main.js",
        dest: "build/js"
    }
};

const pug = () =>
    gulp
        .src(routes.pug.src)
        .pipe(gpug())
        .pipe(gulp.dest(routes.pug.dest));         // gulp은 pipe(데이터/파일 stream을 만드는 것)와 함께 쓰임

const clean = () => del(["build/", ".publish"]);

const webserver = () =>
    gulp
        .src("build")
        .pipe(ws({ livereload: true, open: true }));     // livereload : 파일을 저장하면 자동으로 새로고침해주는 것, open : brawsor에서 localhost 서버를 여는 것

const img = () => 
    gulp
        .src(routes.img.src)
        .pipe(gimage())
        .pipe(gulp.dest(routes.img.dest));

const styles = () =>
    gulp
        .src(routes.scss.src)
        .pipe(sass().on("error", sass.logError))        // sass만의 에러를 보기 위해
        .pipe(autoprefixer())
        .pipe(miniCSS())
        .pipe(gulp.dest(routes.scss.dest));

const js = () => 
    gulp
        .src(routes.js.src)
        .pipe(bro({
            transform: [
                babelify.configure({presets: ['@babel/preset-env']}), 
                [ 'uglifyify', { global:true } ]        // A Browserify v2 transform which minifies your code using terser (a maintained fork of uglify-es) -> have to install uglifyify
            ]
        }))
        .pipe(gulp.dest(routes.js.dest));

const ghDeploy = () => 
    gulp
        .src("build/**/*")
        .pipe(ghPages());

const watch = () => {
    gulp.watch(routes.pug.watch, pug);
    gulp.watch(routes.img.src, img);
    gulp.watch(routes.scss.watch, styles);
    gulp.watch(routes.js.watch, js);
};

const prepare = gulp.series([clean, img]);

const assets = gulp.series([pug, styles, js]);

const live = gulp.series([webserver, watch]);

export const build = gulp.series([prepare, assets]);
export const dev = gulp.series([build, live]);      // export는 pakage.json에서 쓸 command만 해주면 됨
export const deploy = gulp.series([build, ghDeploy, clean]); 