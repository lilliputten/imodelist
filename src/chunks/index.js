import $ from 'jquery';
import 'bootstrap';
window.jQuery = $;
window.$ = $;
require ('@fancyapps/fancybox');
require('../scss/styles.scss');
require ('perfect-scrollbar/css/perfect-scrollbar.css');
import PerfectScrollbar from 'perfect-scrollbar';

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
  //custom Scrollbar
  var is_mobile = ((/Mobile|iPhone|iPod|BlackBerry|Windows Phone/i).test(navigator.userAgent || navigator.vendor || window.opera) ? true : false);
  if ( !is_mobile ) {
    var ps = []
    $('.custom-scroll').each(function(){ ps.push(new PerfectScrollbar($(this)[0])); });
    $(window).resize(function() {
      ps.forEach(function(value){
        value.update();
      });
    });
  }
});
