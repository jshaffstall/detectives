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

    updateCartIcon(cartLS.list())
    cartLS.onChange(updateCartIcon)  
    
    $("#cart").on("click", function() {
        populateCart();
        $("#my-cart-modal").modal('show');
    });  
});

function addToCart(item)
{
    if (cartLS.exists(item.id))
        cartLS.quantity(item.id,1);
    else
        cartLS.add(item);
}

function updateCartIcon(items) {
    const $cart_qty = document.querySelector(".my-cart-badge")

    console.log(items);
    
    if (items.length > 0)
        $cart_qty.textContent = items.reduce((accumulator, currentValue) => accumulator + currentValue.quantity, 0); 
    else
        $cart_qty.textContent = ""; 
}

function populateCart()
{
    var $cartTable = $("#my-cart-modal");
    $cartTable.empty();    
    
    var items = cartLS.list().map(item => {
        var newitem = {}
        
        newitem['id'] = item['id'];
        newitem['name'] = item['name'];
        newitem['quantity'] = item['quantity'];
        newitem['price'] = (item['price']/100).toFixed(2);
        newitem['total'] = (item['price']/100*item['quantity']).toFixed(2);
        
        return newitem;
    });
    
    total = (cartLS.total()/100).toFixed(2)
    empty_msg = cartLS.list().length == 0 ? "block": "none";
    
    var template = document.getElementById('cart-items-template').innerHTML;
    var rendered = Mustache.render(template, {empty_msg: empty_msg, total: total, items: items}, {}, [ '<%', '%>' ]);
    
    $cartTable.html(rendered);  
    
    $(".cart-item-quantity").on('change', function () {
        // Update the cartLS view of the quantity
        var id = $(this).closest("tr").data("id");
        
        cartLS.update(id, "quantity", parseInt($(this).val()));
        
        // Then repopulate the cart
        populateCart();
    });
    
    $(".cart-item-remove").on('click', function () {
        // Update the cartLS view of the quantity
        var id = $(this).closest("tr").data("id");

        cartLS.remove(id);
        
        // Then repopulate the cart
        populateCart();
    });
    
    $(".my-cart-discount-button").on('click', function () {
        // Ask the server what sort of discount applies
        var mysteries = cartLS.list().map(item => {
            return item['id'];
        });        
        
        discount = $("#my-cart-discount").val();
        order_item = {mysteries: mysteries, discount: discount}
    
        $.ajax({
            url: "https://detectives-guild.anvil.app/_/api/order/total",
            type: "POST",
            data: JSON.stringify(order_item), 
            contentType: 'application/json',
            dataType: 'json',
            async: false,
            success: function (result) {
                console.log(result);
            }
        });
        
        // Store the results so the browswer remembers them
        
        // Then repopulate the cart
        populateCart();
    });
}
