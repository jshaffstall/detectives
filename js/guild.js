$( document ).ready(function() 
{
    bindEvent(window, 'message', function (e) {
        alert(e.data);
    });    
});