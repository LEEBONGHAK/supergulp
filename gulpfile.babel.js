import gulp from "gulp";
import gpug from "gulp-pug";         // pug 파일을 html로 변환 시키는 데 사용하는 라이브러리 (have to install gulp-gup)
import del from "del";               // 이미 build된 내용을 삭제하기 위한 라이브러리 (have to install del)
import ws from "gulp-webserver";     // 개발 서버(localhost 서버 같은 것)를 만드는 데 사용하는 라이브러리 (have to install gulp-webserver)
import gimage from "gulp-image";     // 이미지를 다루기 위한 라이브러리 (have to install gulp-image)

const routes = {
    pug: {
        watch: "src/**/*.pug",       // src 내 모든 파일의 변동사항을 확인하기 위해
        src: "src/*.pug",            // src: "src/**/*.pug" : 폴더 안쪽의 파일까지 변환 시키고 싶을 경우 사용
        dest: "build"
    },
    img: {
        src: "src/img/*",
        dest: "build/img"
    }
};

const pug = () =>
    gulp
        .src(routes.pug.src)
        .pipe(gpug())
        .pipe(gulp.dest(routes.pug.dest));         // gulp은 pipe(데이터/파일 stream을 만드는 것)와 함께 쓰임

const clean = () => del(["build"]);

const webserver = () =>
    gulp
        .src("build")
        .pipe(ws({ livereload: true, open: true }));     // livereload : 파일을 저장하면 자동으로 새로고침해주는 것, open : brawsor에서 localhost 서버를 여는 것


const img = () => 
    gulp
        .src(routes.img.src)
        .pipe(gimage())
        .pipe(gulp.dest(routes.img.dest));

const watch = () => {
    gulp.watch(routes.pug.watch, pug);
    gulp.watch(routes.img.src, img);    
};

const prepare = gulp.series([clean, img]);

const assets = gulp.series([pug]);

const live = gulp.series([webserver, watch]);

export const dev = gulp.series([prepare, assets, live]);      // export는 pakage.json에서 쓸 command만 해주면 됨