const { browserSync } = require('laravel-mix');
let mix = require('laravel-mix');
require('laravel-mix-purgecss');
require('browser-sync');

mix.disableSuccessNotifications();
mix.setPublicPath('assets/compiled/');

mix.options({
    processCssUrls: false
  })
  .sourceMaps(false, 'source-map')
  .sass('assets/sass/app.scss', 'css/app.css')
  .js('assets/js/app.js', 'js/app.js')
  // .browserSync('http://saroj-markup.test')
  .version();