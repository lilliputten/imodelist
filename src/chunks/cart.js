(function($){

  $.fn.cart = function(carttext){
    const sys={};
    const init=function(){
      sys.cart=$(this);
      sys.count=sys.cart.find(".quantity__icon");
      sys.quantity=sys.cart.find("[name='quantity']");
      sys.trash=sys.cart.find("[data-trash]");
      sys.cart_form=sys.cart.find(".cart_form");
      sys.totalcount=sys.cart.find("[data-totalcount]");
      sys.totalsumm=sys.cart.find("[data-totalsumm]");
      sys.total_list = [];
      sys.init();
    }
    sys.init=function(){
      sys.quantity.mask('#');
      sys.count.on('click', function() {
        const inp=$(this).closest('.quantity').find("[name='quantity']");
        sys.counDown($(this).data('type'), inp);
      });
      sys.trash.on('click', function(e) {
        e.preventDefault();
        const row=$(this).closest("[data-id]");
        sys.rowDelete(row);
      });
      sys.quantity.on('keyup', function (e) {
        e.preventDefault();
        $(this).val(parseInt($(this).val(), 10)?parseInt($(this).val(), 10):0);
      });
      sys.quantity.on('blur', function () {
        if (parseInt($(this).val(), 10) < 1) {
          sys.rowDelete($(this).closest('.item-row'));
        } else {
          sys.total();
        }
      });
      sys.cart_form.on('submit', function (e) {
        e.preventDefault();
        e.stopPropagation();
        $.ajax( {
          type: "POST",
          url: $(this).data( 'action' ),
          data: $(this).serialize() + '&itemList=' + JSON.stringify(sys.total_list),
          success: function( response ) {
            $('#modal .modal-content').html('<p class="txt_30px text-center">Спасибо за заказ!</p><p class="txt_16px pb-3 text-center">Наши менеджеры свяжуться с вами в ближайшее время.</p>')
            $('#modal').modal({show:true});
            carttext.text('Корзина пуста');
            setTimeout(function(){
              location.href='/';
            },2000);
          }
        });
      });
      sys.total();
    }
    sys.counDown=function(type, inp){
      const row=inp.closest("[data-id]");
      if (type == 'plus') {
        const count=parseInt(inp.val(), 10)+1;
        inp.val(count);
        sys.total();
      } else {
        const count=parseInt(inp.val(), 10)-1;
        if (count) {
          inp.val(count);
          sys.total();
        } else {
          sys.rowDelete(row);
        }
      }
    }
    sys.rowDelete=function(row){
      var id = row.data('id');
      sys.cart.find('[data-id="'+id+'"]').fadeOut('slow').promise().done(function() {
        $(this).remove();
        sys.total();
      });
    }
    sys.total=function(){
      let totalcount = 0;
      let totalsumm = 0;
      sys.total_list = [];
      sys.cart.find("[data-id]").each(function(){
        var exist = null;
        const row=$(this);
        exist = sys.total_list.find(function(el){
          return el.id === row.data('id');
        });
        if (!exist) {
          const inp=row.find("[name='quantity']");
          const price=parseInt(row.find("[data-price]").data('price'), 10);
          const count=parseInt(inp.val(), 10);
          const summ=row.find("[data-summ]");
          summ.text(price*count).thousandSeparateString();
          totalcount+=count;
          totalsumm+=price*count;
          sys.total_list.push({
            id: row.data('id'),
            price: price,
            count: count,
          });
        }
      });
      sys.totalcount.text(totalcount);
      sys.totalsumm.text(totalsumm).thousandSeparateString();

      if (!sys.total_list.length) {
        sys.cart.css({
          display: 'none'
        })
        sys.cart.prev().css({
          display: 'flex'
        })
      }
      $.ajax( {
        type: "POST",
        url: sys.cart.data('url'),
        data: JSON.stringify(sys.total_list),
        success: function( response ) {
          carttext.text('');
        }
      });
    }
    return this.each(init);
  };
})(jQuery);

$(function () {
  const carttext = $('[data-carttext]');

  $("body").on('click', '[data-buy]', function(e){
    e.preventDefault();
    var imgtodrag = $(this).closest('.prod-item').find(".img-holder").eq(0);
    if (!imgtodrag.length) {
      imgtodrag = $(this).closest('.row').find(">div img").eq(0);
    }
    cart_animation(imgtodrag);
    const add = {
      id: $(this).data('id'),
      price: $(this).data('price'),
    };
    $.ajax( {
      type: "POST",
      url: '/add',
      data: JSON.stringify(add),
      success: function( response ) {
        //carttext.text(response);
      }
    });
  });

  function cart_animation(imgtodrag) {
    var cart = $('.icon-holder .icon_cart');
    if (imgtodrag) {
      var imgclone = imgtodrag.clone()
        .offset({
          top: imgtodrag.offset().top,
          left: imgtodrag.offset().left
        })
        .css({
          'opacity': '0.9',
          'position': 'absolute',
          'height': imgtodrag.height(),
          'width': imgtodrag.width(),
          'margin': 0,
          'z-index': '100'
        })
        .appendTo($('body'))
        .animate({
          'top': cart.offset().top - 10,
          'left': cart.offset().left + 10,
          'width': 75,
          'height': 75,
          'opacity': 0
        }, 1200);

      imgclone.animate({
        'width': 0,
        'height': 0
      }, function () {
        $(this).detach()
      });
    }
  }


  $("[data-compare]").on('click', function(e){
    e.preventDefault();
    $(this).addClass('hidden');
    const add = {
      id: $(this).data('id'),
    };
    $.ajax( {
      type: "POST",
      url: '/add-compare',
      data: JSON.stringify(add),
      success: function( response ) {
        carttext.text(response);
        $('#modal .modal-content').load($(this).data("remote"),function(){
          $('#modal').modal({show:true});
        });
      }
    });
  });
  $("[data-notify]").on('click', function(e){
    e.preventDefault();
    $(this).addClass('hidden');
    const add = {
      id: $(this).data('id'),
    };
    $.ajax( {
      type: "POST",
      url: '/add-notify',
      data: JSON.stringify(add),
      success: function( response ) {
      }
    });
  });
  $("[data-like]").on('click', function(e){
    e.preventDefault();
    $(this).addClass('hidden');
    const add = {
      id: $(this).data('id'),
    };
    $.ajax( {
      type: "POST",
      url: '/add-like',
      data: JSON.stringify(add),
      success: function( response ) {
      }
    });
  });

});

