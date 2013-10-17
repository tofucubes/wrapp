
    window.fbAsyncInit = function() {
    // init the FB JS SDK
    FB.init({
        appId      : '186292964892271',                        // App ID from the app dashboard
        channelUrl : '//WWW.tofucubes.tk/wrapp/', // Channel file for x-domain comms
        status     : true,                                 // Check Facebook Login status
        xfbml      : true                                  // Look for social plugins on the page
    });

    // Additional initialization code such as adding Event Listeners goes here
};

FB.login(function(response) {
    if (response.authResponse) {
        FB.api('/me', function(info) {
            login(response, info);
        });
    } else {
        //user cancelled login or did not grant authorization
        showLoader(false);
    }
}, {scope:'email,user_birthday,status_update,publish_stream,user_about_me'});

// Load the SDK asynchronously
(function(d, s, id){
    var js, fjs = d.getElementsByTagName(s)[0];
    if (d.getElementById(id)) {return;}
    js = d.createElement(s); js.id = id;
    js.src = "//connect.facebook.net/en_US/all.js";
    fjs.parentNode.insertBefore(js, fjs);
}(document, 'script', 'facebook-jssdk'));
