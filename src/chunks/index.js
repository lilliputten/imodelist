import $ from 'jquery';
import 'bootstrap';
window.jQuery = $;
window.$ = $;
require ('@fancyapps/fancybox');
require('../scss/styles.scss');


$(function () {
  //tooltip
  $("body").tooltip({ selector: '[data-toggle=tooltip]' });
  //fancybox
  $("[data-fancybox]").fancybox();
  //toggle mobile menu
  $("a[href='#toggle-main-left-menu']").click(function(e){
    e.preventDefault();
    $(this).toggleClass('active');
    $('.main-left-menu').toggleClass('active');
    $('body, html').toggleClass('scroll-lock');
  });
  //toggle mobile cata menu
  $("a[href='#toggle-cata-left-menu']").click(function(e){
    e.preventDefault();
    $(this).toggleClass('active');
    $('.cata-left-menu').toggleClass('active');
    $('body, html').toggleClass('scroll-lock');
  });
});
