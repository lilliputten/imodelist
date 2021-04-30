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
require ('jquery-mask-plugin');

$(document).ready(function() {
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
  $('.bigstars').find('div').click(function(){
    var ind = $(this).index()+1;
    $(this).closest('.bigstars').addClass('active');
    $(this).closest('.bigstars').removeClass('bigstars_hover_1');
    $(this).closest('.bigstars').removeClass('bigstars_hover_2');
    $(this).closest('.bigstars').removeClass('bigstars_hover_3');
    $(this).closest('.bigstars').removeClass('bigstars_hover_4');
    $(this).closest('.bigstars').removeClass('bigstars_hover_5');
    $(this).closest('.bigstars').addClass('bigstars_hover_' + ind);
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
  //img-loader
  function imgLoaded(){
    $('.img-loading').not('.loaded').each(function(){
      var src = $(this).attr('src');
      var loadImg = document.createElement("img");
      loadImg.src=src;
      var newImg = document.createElement("img");
      newImg.src='/assets/img/blank.png';
      newImg.className='blankimg';
      $(this).closest('.img-holder')[0].appendChild(newImg);
      var img = $(this).closest('.img-holder').find('.blankimg');
      $(this).addClass('loaded');
      loadImg.onload = function() {
        img.addClass('destroyed');
      };
    })
  }
  imgLoaded();
  //ajax-load
  if (location.hash && location.hash.indexOf('page')) {
    location.hash = '';
    location.href = location.href.split('?')[0] + '?' + location.hash.replace('#','');
  }

  $('#content').on('click', '.next-page', function(e){
    e.preventDefault();
    var href = $(this).attr('href');
    var hash = href.split('?')[1];
    $(this).next('.next-page-loading').addClass('active');
    $(this).addClass('loaded');
    location.hash = hash;
    $.ajax({
      url: href,
      context: $(this)
    }).done(function(data) {
        $(this).closest('.page-holder').after(data);
        $(this).next('.next-page-loading').removeClass('active');
        $(this).closest('.page-holder').remove();
        imgLoaded();
      });
  });
  //presents
  $('#content').on('change', '[name="present-wrapping"]', function(e){
    e.preventDefault();
    if ($(this).prop('checked')) {
      $('.present-holder').addClass('active');
    } else {
      $('.present-holder').removeClass('active');
    }
  });
  //slider
  $('#sliderMain').on('slide.bs.carousel', function (e) {
    var indicator = $('[data-target="#'+this.id+'"]');
    var index = $(e.relatedTarget).index();
    indicator.removeClass('active');
    indicator.filter('[data-slide-to="'+ index +'"]').addClass('active');
  })

  if ($('#notifications-bottom-right-tab').length) {
    setTimeout(function(){
      $('#notifications-bottom-right-tab').addClass('active');
    },0);
    $('body').on('click', '#notifications-bottom-right-tab .close', function(e){
      e.preventDefault();
      $('#notifications-bottom-right-tab').removeClass('active');
    });
  }
});
