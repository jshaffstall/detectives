$(document).ready(function() 
{
    $('.add-to-cart').on('click', function () {
        var cart = $('#cart');
        var imgtodrag = $(this).parent('.item').find("img").eq(0);
        var data = this.dataset;
        
        if (imgtodrag) {
            var imgclone = imgtodrag.clone()
                .offset({
                top: imgtodrag.offset().top,
                left: imgtodrag.offset().left
            })
                .css({
                'opacity': '0.5',
                    'position': 'absolute',
                    'height': '150px',
                    'width': '150px',
                    'z-index': '100'
            })
                .appendTo($('body'))
                .animate({
                'top': cart.offset().top + 10,
                    'left': cart.offset().left + 10,
                    'width': 75,
                    'height': 75
            }, 1000, 'easeInOutExpo');
            
            setTimeout(function () {
                cart.effect("shake", {
                    times: 2
                }, 200);
                
                addToCart({id: data.id, name: data.name, price: data.price})
            }, 1500);

            imgclone.animate({
                'width': 0,
                    'height': 0
            }, function () {
                $(this).detach()
            });
        }
    });

    $("#cart").on("click", function() {
    $(".shopping-cart").fadeToggle( "fast");
  });  

    renderCart(cartLS.list())
    cartLS.onChange(renderCart)  
});

function renderCart(items) {
    const $cart_qty = document.querySelector(".my-cart-badge")

    if (items.length > 0)
        $cart_qty.textContent = items.reduce((accumulator, currentValue) => accumulator + currentValue.quantity, 0); 
    else
        $cart_qty.textContent = ""; 
}

function addToCart(item)
{
    if (cartLS.exists(item.id))
        cartLS.quantity(item.id,1);
    else
        cartLS.add(item);
}