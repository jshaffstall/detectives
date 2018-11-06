$(document).ready(function() 
{
    window.addEventListener("message", receiveMessage);

    function receiveMessage(event)
    {
        if (event.data && event.data.hasOwnProperty('type') && event.data.type == 'refresh')
        {
            // We need to refresh every Detectives Guild iframe
            // except for the one that sent the message
            //
            // Every Detectives Guild iframe must be defined with 
            // a data-guild attribute
            
            var iframes = document.querySelectorAll("iframe[data-guild]");
            
            for (var i in iframes) 
            {
                i = $(i)
                
                if (i.contentWindow != event.source)
                    refreshIframe(i);
            }            
        }
    }
});

function refreshIframe(iframe, src="")
{
    // This hackish technique prevents the history from being modified 
    // when we reload the iframe
    var container = iframe.parent();
    
    if (src == "")
        src = iframe.src
    
    iframe.remove ();
    iframe.attr('src', src);
    
    container.append(iframe);
}
