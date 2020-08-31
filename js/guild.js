var serverUrl = "https://detectives-guild.anvil.app/_/api/";

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
    
    if (localStorage.getItem("discountedTotal") != null)
        total = parseInt(localStorage.getItem("discountedTotal"));
    else
        total = cartLS.total();
        
    empty_msg = cartLS.list().length == 0 ? "block": "none";
    
    var template = document.getElementById('cart-items-template').innerHTML;
    var rendered = Mustache.render(template, {empty_msg: empty_msg, total: (total/100).toFixed(2), items: items, discount: localStorage.getItem("discountCode")}, {}, [ '<%', '%>' ]);
    
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
    
    $(".my-cart-discount-clear-button").on('click', function () {
        localStorage.removeItem("discountCode");
        localStorage.removeItem("discountedTotal");        
        populateCart();
    });
    
    $(".my-cart-discount-button").on('click', function () {
        // Make sure we have a discount code to apply
        var discount = $("#my-cart-discount").val();
        
        if (! discount)
        {
            alert ("You must enter a discount code in the box");
            return;
        }
        
        // Ask the server what sort of discount applies
        var mysteries = cartLS.list().map(item => {
            return item['id'];
        });        
        
        order_item = {mysteries: mysteries, discount: discount}
    
        $.ajax({
            url: serverUrl+"order/total",
            type: "POST",
            data: JSON.stringify(order_item), 
            contentType: 'application/json',
            dataType: 'json',
            success: function (result) {
                if (result.status == "success")
                {
                    // Store the results so the browswer remembers them
                    // Store both the discount code being applied,
                    // and the discounted total
                    localStorage.setItem("discountCode", discount);
                    localStorage.setItem("discountedTotal", result.total);
                    
                    // Then repopulate the cart
                    populateCart();
                }
            },
            error: function (xhr, ajaxOptions, thrownError) {
                alert ("Unable to contact server to validate discount code.  Try again in a while, if the problem persists go to our support page and contact us.");
            }
        });
    });
}
