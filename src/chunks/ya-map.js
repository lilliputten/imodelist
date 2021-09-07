
$(document).ready(function() {
  if ($('.map-holder').length) {
    ymaps.ready(init);
    var ALLmaps = [];
    function init(){
      $('.map-holder').each(function(){
        var map = $(this).data('map');
        var obj = $('#'+map);
        var url = obj.data('url');
        var type = obj.data('type');
        var lt = obj.data('lt');
        var lg = obj.data('lg');
        var myMap = new ymaps.Map(map, {
          center: [lt, lg],
          zoom: 7
        });
        ALLmaps.push(myMap);
        var bounds = myMap.getBounds();
        $.ajax( {
          type: "GET",
          url: url,
          data: {
            l:bounds[0],
            r:bounds[1],
            t:type,
          },
          success: function( response ) {
            myCollection = new ymaps.GeoObjectCollection({}, {
              preset: 'islands#redCircleDotIcon'
            });
            for (var i = 0; i < response.length; i++) {
              var myGeoObject = new ymaps.GeoObject({
                geometry: {
                  type: "Point",
                  coordinates: [response[i].lt, response[i].lg]
                },
                properties: {
                  hintContent: response[i].title,
                }
              });
              (function(){
                var resp = response[i];
                myGeoObject.events.add("click", function (e) {
                  console.log(resp);
                  $('.title').html(resp.title);
                  $('.text').html(resp.text);
                  $('.close-map').addClass('btn').text('Выбрать');
                  $('.close-map').data('uid',resp.uid);
                  $('.close-map').data('title',resp.title);
                });
              })(i);
              myCollection.add(myGeoObject);
            }
            myMap.geoObjects.add(myCollection);
          }
        });
      });
    }
    $('.close-map').click(function(e){
      e.preventDefault();
      $('[name="uid"]').val($(this).data('uid'));
      $(this).closest('.map-accord').addClass('disabled');
      $('.show-deliver-point').removeClass('hidden');
      $('.show-deliver-point .title').html($(this).data('title'));
      $('.show-deliver-point .text').html($(this).data('text'));
    })
    $('.map-tabs').click(function(e){
      for (var i = 0; i < ALLmaps.length; i++) {
        (function() {
          var m = ALLmaps[i];
          setTimeout(function () {
            m.container.fitToViewport();
          }, 300)
        })(i);
      }
    })
  }
});
