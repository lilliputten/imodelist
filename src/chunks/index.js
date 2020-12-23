import $ from 'jquery';
import 'bootstrap';
window.jQuery = $;
window.$ = $;
require ('@fancyapps/fancybox');
require('../scss/styles.scss');
require ('perfect-scrollbar/css/perfect-scrollbar.css');
import PerfectScrollbar from 'perfect-scrollbar';
require ('bootstrap-datepicker/dist/css/bootstrap-datepicker3.standalone.css');
require ('bootstrap-datepicker');
require ('bootstrap-datepicker/dist/locales/bootstrap-datepicker.ru.min.js');
require ('bootstrap-autocomplete');

$(function () {
  //tooltip
  $("body").tooltip({ selector: '[data-toggle=tooltip]' });
  //fancybox
  $("[data-fancybox]").fancybox();
  //toggle mobile menu
  $("[data-toggle-main-left-menu]").click(function(e){
    e.preventDefault();
    $(this).toggleClass('active');
    $('.main-left-menu').toggleClass('active');
    $('body, html').toggleClass('scroll-lock');
  });
  //toggle mobile cata menu
  $("[data-toggle-cata-left-menu]").click(function(e){
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
  //stars
  $('.bigstars').find('div').hover(
    function() {
      if (!$(this).closest('.bigstars').hasClass('active')){
        var ind = $(this).index()+1;
        $(this).closest('.bigstars').addClass('bigstars_hover_' + ind);
      }
    }, function() {
      if (!$(this).closest('.bigstars').hasClass('active')){
        var ind = $(this).index()+1;
        $(this).closest('.bigstars').removeClass('bigstars_hover_' + ind);
      }
    }
  );
  $('.bigstars').not('.active').find('div').click(function(){
    var ind = $(this).index()+1;
    $(this).closest('.bigstars').addClass('active');
    const add = {
      id: $(this).closest('.bigstars').data('id'),
      ind: ind,
    };
        $.ajax( {
          type: "POST",
          url: '/add-notify',
          data: JSON.stringify(add),
          success: function( response ) {
            carttext.text(response);
            $('#modal .modal-content').load($(this).data("remote"),function(){
              $('#modal').modal({show:true});
            });
          }
        });
  });
  //datepicker
  $('.dpicker').datepicker({
    isRTL: false,
    format: 'dd.mm.yyyy',
    autoclose:true,
    language: 'ru'
  });
});
