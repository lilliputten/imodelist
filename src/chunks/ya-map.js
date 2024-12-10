$(document).ready(function () {
  if ($('.map-holder').length) {
    $('.map-holder')
      .find('input.autoComplete')
      .on('autocomplete.select', function (evt, item) {
        var post = $(this).data('post');
        var input = $(this).val();
        $.ajax({
          type: 'get',
          url: post,
          data: { id: input },
          success: function (response) {
            try {
              response = JSON.parse(response);
              $('.title').html(response.title);
              $('.text').html(response.text);
              $('.close-map').addClass('btn').text('Выбрать');
              $('.close-map').data('uid', response.uid);
              $('.close-map').data('title', response.title);
            } catch (e) {}
          },
        });
      });

    ymaps.ready(init);
    var ALLmaps = [];
    function init() {
      $('.map-holder').each(function () {
        var map = $(this).data('map');
        var obj = $('#' + map);
        var zoom = obj.data('zoom');
        var url = obj.data('url');
        var type = obj.data('type');
        var lt = obj.data('lt');
        var lg = obj.data('lg');
        var myMap = new ymaps.Map(map, {
          center: [lt, lg],
          zoom: zoom,
        });
        ALLmaps.push(myMap);
        getAjax();
        myMap.events.add('boundschange', function (event) {
          myMap.geoObjects.removeAll();
          getAjax();
        });

        function getAjax() {
          var bounds = myMap.getBounds();
          $.ajax({
            type: 'GET',
            url: url,
            data: {
              l: bounds[0],
              r: bounds[1],
              t: type,
            },
            success: function (response) {
              try {
                if (typeof response === 'string') {
                  response = JSON.parse(response);
                }
                myCollection = new ymaps.GeoObjectCollection(
                  {},
                  {
                    preset: 'islands#redCircleDotIcon',
                  },
                );
                for (var i = 0; i < response.length; i++) {
                  var myGeoObject = new ymaps.GeoObject({
                    geometry: {
                      type: 'Point',
                      coordinates: [+response[i].lt, +response[i].lg],
                    },
                    properties: {
                      hintContent: response[i].title,
                    },
                  });
                  (function () {
                    var resp = response[i];
                    myGeoObject.events.add('click', function (e) {
                      $('.title').html(resp.title);
                      $('.text').html(resp.text);
                      $('.close-map').addClass('btn').text('Выбрать');
                      $('.close-map').data('uid', resp.uid);
                      $('.close-map').data('title', resp.title);
                    });
                  })(i);
                  myCollection.add(myGeoObject);
                }
                myMap.geoObjects.add(myCollection);
              } catch (e) {
                console.error('[ya-map:init]', e);
                debugger;
              }
            },
          });
        }
      });
    }
    $('.close-map').click(function (e) {
      e.preventDefault();
      $('[name="uid"]').val($('.close-map').data('uid'));
      $('.close-map').closest('.map-accord').addClass('disabled');
      $('.show-deliver-point').removeClass('disabled');
      $('.show-deliver-point .title').html($('.close-map').data('title'));
      $('.show-deliver-point .text').html($('.close-map').data('text'));
    });
    $('.map-tabs').click(function (e) {
      for (var i = 0; i < ALLmaps.length; i++) {
        (function () {
          var m = ALLmaps[i];
          setTimeout(function () {
            m.container.fitToViewport();
          }, 300);
        })(i);
      }
    });
    $('input[name="product_order[delivery_form]"]').change(function (e) {
      if ($(this).hasClass('map-tab-active')) {
        $('[name="uid"]').val('');
        $('.show-deliver-point').addClass('disabled');
        $('.map-accord').find('.tab-pane').removeClass('active');
        $('.map-accord')
          .find('#' + $(this).data('map'))
          .addClass('active');
        $('.map-accord').removeClass('disabled');
      } else {
        $('[name="uid"]').val('');
        $('.map-accord').addClass('disabled');
        $('.show-deliver-point').addClass('disabled');
      }
    });
  }
});
