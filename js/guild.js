var serverUrl = "https://app.detectivesguild.com/_/api/";
//var serverUrl = "https://detectives-guild.anvil.app/_/api/";

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
    var rendered = Mustache.render(template, {email: localStorage.getItem("email"), empty_msg: empty_msg, total: (total/100).toFixed(2), items: items, discount: localStorage.getItem("discountCode")}, {}, [ '<%', '%>' ]);
    
    $cartTable.html(rendered);  
    
    var style = {
      base: {
        color: "#32325d",
      }
    };
    
    var stripe = Stripe('pk_test_0kIbVwHbShyR9Jak5SnRE9jo');
    
    // We have to bind these functions after we add the 
    // rendered cart to the page, or they won't affect
    // the newly added cart items
    
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
    
    $("#cart-email").on('input', function () {
        localStorage.setItem("email", $(this).val());
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
        
        var button = $(this);
        $(this).prop("disabled", true);
        
        var mysteries = cartLS.list().map(item => {
            newitem = {}
            
            newitem['id'] = item['id'];
            newitem['quantity'] = item['quantity'];
            
            return newitem;
        });        
        
        var email = $("#cart-email").val();
        
        // Ask the server what sort of discount applies
        order_item = {mysteries: mysteries, discount: discount, email: email}
    
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
                else
                {
                    button.prop("disabled", false);
                    alert (result.error);
                }
            },
            error: function (xhr, ajaxOptions, thrownError) {
                button.prop("disabled", false);
                
                alert ("Unable to contact server to validate discount code.  Try again in a while, if the problem persists go to our support page and contact us.");
            }
        });
    });

    $(".my-cart-checkout").on('click', function () {
        var email = $("#cart-email").val();
        
        if (! email)
        {
            alert ("You must enter the email of your Detectives Guild account");
            return;
        }
        
        var button = $(this);
        $(this).prop("disabled", true);
        
        var discount = $("#my-cart-discount").val();
        
        var mysteries = cartLS.list().map(item => {
            newitem = {}
            
            newitem['id'] = item['id'];
            newitem['quantity'] = item['quantity'];
            
            return newitem;
        });        
        
        order_item = {mysteries: mysteries, discount: discount, email: email}
        
        $.ajax({
            url: serverUrl+"order/submit",
            type: "POST",
            data: JSON.stringify(order_item), 
            contentType: 'application/json',
            dataType: 'json',
            success: function (result) {
                if (result.status == "success")
                {
                    // Display the user's order id so they can
                    // write it down if they like
                    alert ("Your Order Id is " + result.order_id + ". Write it down in case you need to contact us about your order");

                    $("#my-cart-modal").modal('hide');
                    cartLS.destroy();
                    localStorage.removeItem("discountCode");
                    localStorage.removeItem("discountedTotal");        
                    
                    button.prop("disabled", false);
                    
                    if (result.id)
                    {
                        // If there's a Stripe session, then
                        // redirect to it
                        stripe.redirectToCheckout({ sessionId: result.id })
                        .then(function(result) {
                            alert("Problem with checkout: " + result.error.message + ".  Please contact support if this error persists");
                        });
                    }
                }
                else
                {
                    button.prop("disabled", false);
                
                    alert (result.error);
                }
            },
            error: function (xhr, ajaxOptions, thrownError) {
                button.prop("disabled", false);
            
                alert ("Unable to contact server to submit the order.  Try again in a while, if the problem persists go to our support page and contact us.");
            }
        });
    });
}
