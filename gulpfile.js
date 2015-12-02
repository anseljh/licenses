var gulp = require('gulp');
var jsoncombine = require("gulp-jsoncombine");  // To combine JSON files
var prettyData = require('gulp-pretty-data');   // Prettify JSON
var convert = require('gulp-convert');          // To convert from JSON to CSV
var jeditor = require("gulp-json-editor");      // To tweak datapackage.json
var del = require('del');

gulp.task('generate_json', /*['clean_release'],*/ function(cb) {
  // Generate a merged JSON file
  gulp.src("./licenses/*.json")
      .pipe(jsoncombine("licenses.json", function(data){ return new Buffer(JSON.stringify(data)); }))
      .pipe(prettyData({type: 'prettify'}))
      .pipe(gulp.dest("./release"));
  cb();
});

// TODO
// gulp.task('clean_release', function(cb) {
//   return del([
//     './release/*'
//   ]);
//   cb();
// });

// TODO
// gulp.task('clean_json', ['generate_json'], function() {
//   return del([
//     './release/*.json',
//     '!./release/licenses.json',
//     '!./release/datapackage.json'
//   ]);
// });

gulp.task('generate_csv', ['generate_json'], function(cb) {
  // Generate the CSV file
  gulp.src('./release/licenses.json')
      .pipe(convert({
        from: 'json',
        to: 'csv'
       }))
      .pipe(gulp.dest('./release'));
  cb();
});

// TODO
gulp.task('update_datapackage', ['generate_json', 'generate_csv'], function() {
  // Update datapackage.json and put it in the right place.
  // This had been in datapackage.json, but I removed it:
  //   "bytes": 15051,
  gulp.src("./licenses/*.json")
      // Count the bytes here
      // and update "bytes"
      .pipe(gulp.dest("./release"));
});

gulp.task('default', [/*'clean_release',*/ 'generate_json', 'generate_csv', 'update_datapackage' /*, 'clean_json'*/ ]);
