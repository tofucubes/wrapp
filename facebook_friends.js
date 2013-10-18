function insertIntoElement(name, content) {
    document.getElementById(name).innerHTML += content;
}
function clearElement(name) {
    document.getElementById(name).innerHTML = '';
}
function sortByKey(array, key) {
    return array.sort(function (a, b) {
        var x = a[key];
        var y = b[key];
        return ((x < y) ? -1 : ((x > y) ? 1 : 0));
    });
}
function typoglycemia(filter, main_string, matching_percent) {
    var names = main_string.toLowerCase().split(' ');
    var matching = 0;
    for (var i = 0; names.length > i; i++) {
        if (names[i][0] == filter[0] &&
            names[i][names[i].length - 1] == filter[filter.length - 1]) {

            for (var j = 0; filter.length > j; j++) {
                if (names[i].indexOf(filter[j]) != -1) {
                    matching++;
                }
            }
            if (matching_percent * names[i].length < matching) {
                return true;
            }
        }
    }
    return false;
}
var FriendList = function () {
    var friends;

    function insertIntoFriendList(friend) {
        insertIntoElement("friendlist", createFriendPair(friend.name, friend.id));
    }

    function pictureUrl(id) {
        return '//graph.facebook.com/' + id + '/picture?type=large';
    }

    function createFriendPair(name, id) {
        return '<div>' + createImg(id) + '<br>' + name + '</div>';
    }

    function createImg(id) {
        return '<img src="' + pictureUrl(id) + '">';
    }

    function searchFriends(search) {
        var newresults = false;
        if (search != '') {
            search.toLowerCase();
        } else {
            return;
        }
        var first_name_match, other_name_match, first = [], last = [], typoglycemia_arr = [];
        for (var i = 0; i < friends.length; i++) {
            //preference first name, then last name, then typoglycemia blobs (takes care of typos and most sound outs).

            first_name_match = friends[i].name.toLowerCase().indexOf(search) == 0;
            other_name_match = friends[i].name.toLowerCase().indexOf(' ' + search) != -1;
            if (first_name_match) {
                newresults = true;
                first.push(friends[i]);
            } else if (other_name_match) {
                last.push(friends[i]);
                newresults = true;
            } else if (typoglycemia(search, friends[i].name, .5)) {
                newresults = true;
                typoglycemia_arr.push(friends[i]);
            }
        }
        if (newresults == true) {
            clearElement('friendlist');
            for (i = 0; first.length > i; i++) {
                insertIntoFriendList(first[i]);
                delete first[i];
            }

            for (i = 0; last.length > i; i++) {
                insertIntoFriendList(last[i]);
                delete last[i];
            }

            for (i = 0; typoglycemia_arr.length > i; i++) {
                insertIntoFriendList(typoglycemia_arr[i]);
                delete typoglycemia_arr[i];
            }
        }
        newresults = false;
    }

    this.getFriends = function getFriends() {
        FB.api('/me/friends', function (response) {
            friends = response.data;
            if (response.data) {
                friends = sortByKey(friends, 'name');
                for (var i = 0; i < 10; i++) {
                    insertIntoFriendList(friends[i]);
                }

                var friendsearch = document.getElementById("friendsearch");
                friendsearch.onkeyup = function () {
                    searchFriends(friendsearch.value)
                };
            } else {
                console.log('friends didn\'t come in');
            }
        });
    }

};


window.fbAsyncInit = function () {
    // init the FB JS SDK
    FB.init({
        appId: '186292964892271',                        // App ID from the app dashboard
        channelUrl: '//www.tofucubes.tk/wrapptest/', // Channel file for x-domain comms
        status: true,                                 // Check Facebook Login status
        xfbml: true                                  // Look for social plugins on the page
    });

    // Here we subscribe to the auth.authResponseChange JavaScript event. This event is fired
    // for any authentication related change, such as login, logout or session refresh. This means that
    // whenever someone who was previously logged out tries to log in again, the correct case below
    // will be handled.

    FB.Event.subscribe('auth.authResponseChange', function (response) {
        // Here we specify what we do with the response anytime this event occurs.
        if (response.status === 'connected') {
            // The response object is returned with a status field that lets the app know the current
            // login status of the person. In this case, we're handling the situation where they
            // have logged in to the app.
            console.log('you have friends');
            var friends = new FriendList();
            friends.getFriends();
        } else if (response.status === 'not_authorized') {
            // In this case, the person is logged into Facebook, but not into the app, so we call
            // FB.login() to prompt them to do so.
            // In real-life usage, you wouldn't want to immediately prompt someone to login
            // like this, for two reasons:
            // (1) JavaScript created popup windows are blocked by most browsers unless they
            // result from direct interaction from people using the app (such as a mouse click)
            // (2) it is a bad experience to be continually prompted to login upon page load.

            console.log('friends are guarded');
            FB.login(function (response) {
                if (response.authResponse) {
                    FB.api('/me', function (info) {
                        login(response, info);
                    });
                    // The person logged into your app
                } else {
                    // The person cancelled the login dialog
                }
            });

        } else {
            // In this case, the person is not logged into Facebook, so we call the login()
            // function to prompt them to do so. Note that at this stage there is no indication
            // of whether they are logged into the app. If they aren't then they'll see the Login
            // dialog right after they log in to Facebook.
            // The same caveats as above apply to the FB.login() call here.
            console.log('you have no friends');
            FB.login(function (response) {
                if (response.authResponse) {
                    FB.api('/me', function (info) {
                        login(response, info);
                    });
                    // The person logged into your app
                } else {
                    // The person cancelled the login dialog
                }
            });
        }
    });
};

// Additional initialization code such as adding Event Listeners goes here


// Load the SDK asynchronously
(function (d, s, id) {
    var js, fjs = d.getElementsByTagName(s)[0];
    if (d.getElementById(id)) {
        return;
    }
    js = d.createElement(s);
    js.id = id;
    js.src = "//connect.facebook.net/en_US/all.js";
    fjs.parentNode.insertBefore(js, fjs);
}(document, 'script', 'facebook-jssdk'));
