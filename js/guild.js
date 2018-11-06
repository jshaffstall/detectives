$(document).ready(function() 
{
    window.addEventListener("message", receiveMessage);

    //$(function () {
    function receiveMessage(event)
    {
        if (event.data && event.data.hasOwnProperty('type') && event.data.type == 'refresh')
        {
            alert(event.data.sender);
        }
    }
});