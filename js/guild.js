function doLogout ()
{
    $.ajax({
       url: 'https://detectives-guild-site.anvil.app/_/api/user/logout',
       type: 'GET',
       contentType: 'text/plain',
       xhrFields: {
          withCredentials: true
       },
       crossDomain: true
    });    
}
