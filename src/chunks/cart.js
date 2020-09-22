(function($){

  $.fn.cart = function(carttext){
    const sys={};
    const init=function(){
      sys.cart=$(this);
      sys.cart_form=sys.cart.find(".cart_form");
      sys.count=sys.cart.find(".quantity__icon");
      sys.quantity=sys.cart.find("[name='quantity']");
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
      sys.cart.find("select[name='size']").on('change', function(){
        const row=$(this).closest("[data-id]");
        const op=$(this).find('option:selected').data('optionprice');
        const price=row.find("[data-price]");
        price.data('price', op);
        price.text(op).thousandSeparateString();
        sys.total();
      });
      sys.cart_form.on('submit', function (e) {
        e.preventDefault();
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
      const row=inp.closest('.item-row');
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
      row.fadeOut(200, function() {
        $(this).remove();
        sys.total();
      });
    }
    sys.total=function(){
      let totalcount = 0;
      let totalsumm = 0;
      sys.total_list = [];
      sys.cart.find("[data-price]").each(function(){
        const row=$(this).closest("[data-id]");
        const inp=row.find("[name='quantity']");
        const price=parseInt($(this).data('price'), 10);
        const count=parseInt(inp.val(), 10);
        const summ=row.find("[data-summ]");
        summ.text(price*count).thousandSeparateString();
        totalcount+=count;
        totalsumm+=price*count;
        sys.total_list.push({
          id: row.data('id'),
          price: price,
          count: count,
          size: row.find("[name='size']").find('option:selected').val() || null,
        });
      });
      sys.totalcount.text(totalcount);
      sys.totalsumm.text(totalsumm).thousandSeparateString();
      $.ajax( {
        type: "POST",
        url: '/count',
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
  $('#cart').cart(carttext);
  $("[data-buy]").on('click', function(){
    const add = {
      id: $(this).data('id'),
      price: $(this).data('price'),
    };
    carttext.text('12 шт.');
    $('#modal .modal-body').load('./cart-notify.html',function(){
      $(".modal-backdrop").remove();
      $('#modal').modal({show:true});
    });
/*    $.ajax( {
      type: "POST",
      url: '/add',
      data: JSON.stringify(add),
      success: function( response ) {
        carttext.text(response);
        $('#modal .modal-content').load($(this).data("remote"),function(){
          $('#modal').modal({show:true});
        });
      }
    });*/
  });

});

