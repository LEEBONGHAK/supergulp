import gulp from "gulp";
import gpug from "gulp-pug";         // pug 파일을 html로 변환 시키는 데 사용하는 라이브러리
import del from "del";               // 이미 build된 내용을 삭제하기 위한 라이브러리

const routes = {
    pug: {
        src: "src/*.pug",            // src: "src/**/*.pug" : 폴더 안쪽의 파일까지 변환 시키고 싶을 경우 사용
        dest: "build"
    }
};

const pug = () => 
    gulp
        .src(routes.pug.src)
        .pipe(gpug())
        .pipe(gulp.dest(routes.pug.dest));         // gulp은 pipe(데이터/파일 stream을 만드는 것)와 함께 쓰임

const clean = () => del(["build"]);

const prepare = gulp.series([clean])

const assets = gulp.series([pug])

export const dev = gulp.series([prepare, assets]);      // export는 pakage.json에서 쓸 command만 해주면 됨