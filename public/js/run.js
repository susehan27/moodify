
var subscriptionKey = "ef312d5091da4d6ea6e8c7c66b632085";
var clientId = "d60bf11c7b194604ae4c722f37ddf05d";
var secret = "f2bb9112f8a74a84afe9d4784bf5ffaf";
var player;
var canvas;
var context;
var captureButton;
var constraints;
var imageData = null;
var mood = '';
var firstvisit = true;
var atoken = ""; 

$(document).ready(function() {
    // hide the canvas
    $('#canvas').hide();
    // remove current mood 
    $('#mood-label').remove();
    // empty any existing playlists
    $('#playlist-wrapper').empty();
    // display the main container and main-wrapper 
    $('#main').show();
    $('#main-wrapper').hide();
    $('#upload-wrapper').show();
    
    $('#get-started').hide(); 
    // change info color to default
    $('#info').css('background', '#4E5F82');
    $('#logo').attr('src', 'assets/images/logodesignlandingblank.png');
    
    // set webcam / canvas variables
    player = document.getElementById('player');
    canvas = document.getElementById('canvas');
    context = canvas.getContext('2d');
    captureButton = document.getElementById('capture');
    constraints = {
        video: true,
    };

    // adjust first visit var
    firstvisit = false;
    
    startApp();
});

$(document).on('click', '#capture', function () { 
    // draw canvas from video player and save image data       
    context.drawImage(player, 0, 0, canvas.width, canvas.height);
    imageData = convertToBlobFormat(canvas.toDataURL('image/jpeg'));
    $('#canvas').show();
    // Stop all video streams.
    player.srcObject.getVideoTracks().forEach(track => track.stop());
    
    // replace player with canvas image / mood and prompt user to confirm
    if (imageData !== null) {
        $('#snapshot-wrapper').append($('<h2 class="lightw" id="confirm-label">Is this picture okay?</h2>'),
            $('<button class="confirm btn btn-dark mr-2" id="confirm">confirm</button>'),
            $('<button class="confirm btn btn-dark mx-auto" id="try-again">try again</button>'));
    }
    $('#upload-wrapper').hide();
    $('#main-wrapper').hide();
});

$(document).on('click', '#use-webcam', function() {
    $('#upload-wrapper').hide();
    $('#main-wrapper').show();
    // start webcam 
    navigator.mediaDevices.getUserMedia(constraints)
        .then((stream) => {
            // Attach the video stream to the video element and autoplay.
            player.srcObject = stream;
    });
});

function readURL(input) {

    // if a file was uploaded create an img element than use that to draw the canvas
    if (input.files && input.files[0]) {
        var reader = new FileReader();
        
        reader.onload = function (e) {
            var img = new Image(400, 300);
            img.src =  e.target.result;
            img.id = 'placeholder';
            img.alt = input.files[0].name;
            $('#snapshot-wrapper').prepend(img);
            imageData = convertToBlobFormat(e.target.result);
        };
        reader.readAsDataURL(input.files[0]);

        $('#main-wrapper').hide();
        $('#upload-wrapper').hide();
        $('#snapshot-wrapper').append($('<h3 class="lightw" id="confirm-label lightw">is this okay?</h3>'),
                                        $('<button class="confirm btn btn-light mr-2" id="confirm">confirm</button>'),
                                        $('<button class="confirm btn btn-light mx-auto" id="try-again">try again</button>'));
    }
}


$(document).on('click', '#confirm', function() {          
    processImage();
    $('#confirm-label').remove();
    $('#confirm').remove();
    $('#try-again').remove();
    $('#placeholder').remove();
    // clear the canvas 
    context.clearRect(0, 0, canvas.width, canvas.height);
    $('#canvas').hide();
    $('#how-to-modal').hide();
    $('#get-started').show();
    $('#get-started').text('not feeling it?');
    $("#get-started").href("index.html");
});

$(document).on('click', '#try-again', function(){
    // clear the canvas 
    context.clearRect(0, 0, canvas.width, canvas.height);
    $('#canvas').hide();
    $('#placeholder').remove();
    $('#confirm-label').remove();
    $('#confirm').remove();
    $('#try-again').remove();
    $('#main-wrapper').hide(); 
    $('#upload-wrapper').show();              
    $('#try-again').attr("href", "/app");

    navigator.mediaDevices.getUserMedia(constraints)
        .then((stream) => {
            // Attach the video stream to the video element and autoplay.
            player.srcObject = stream;
        });
});


function processImage() {

    var uriBase = "https://westcentralus.api.cognitive.microsoft.com/face/v1.0/detect";

    // Request parameters.
    var params = {
        "returnFaceId": "true",
        "returnFaceLandmarks": "false",
        "returnFaceAttributes": "emotion"
    };

    // Make API request to Face API
    $.ajax({
        url: uriBase + "?" + $.param(params),
        beforeSend: function(xhrObj){
            xhrObj.setRequestHeader("Content-Type","application/octet-stream");
            xhrObj.setRequestHeader("Ocp-Apim-Subscription-Key", subscriptionKey);
        },
        type: "POST",
        processData: false,
        data: imageData
    })        

    .done(function(data) {
        // save pertinent data as a variable
        var result = data[0].faceAttributes.emotion;
        $("#confirm-label").hide();

        // conditional that determines, matches the playlist and changes css
        if (Math.round(result.neutral) === 1) {
            mood = 'chill';
            $('#snapshot-wrapper').append($('<h2 id="mood-label">current mood: <span class="' + mood +  '">' + mood + '</span></h2>'));
            playlistMatch();
            $('body').css('background-color', '#3a92ce');
            
        } else if (Math.round(result.anger) === 1) {
            mood = 'rage';
            $('#snapshot-wrapper').append($('<h2 id="mood-label">current mood: <span class="' + mood +  '">' + mood + '</span></h2>'));
            playlistMatch();
            $('body').css('background-color', '#ea3232');
            
        } else if (Math.round(result.contempt) === 1) {
            mood = 'revenge';
            $('#snapshot-wrapper').append($('<h2 id="mood-label">current mood: <span class="' + mood +  '">' + mood + '</span></h2>'));
            playlistMatch();
            $('body').css('background-color', '#b03be0');
            
        } else if (Math.round(result.disgust) === 1) {
            mood = 'bored';
            $('#snapshot-wrapper').append($('<h2 id="mood-label">current mood: <span class="' + mood +  '">' + mood + '</span></h2>'));
            playlistMatch();
            $('body').css('background-color', '#939393');
            
        } else if (Math.round(result.happiness) === 1) {
            mood = 'happy';
            $('#snapshot-wrapper').append($('<h2 id="mood-label">current mood: <span class="' + mood +  '">' + mood + '</span></h2>'));
            playlistMatch();
            $('body').css('background-color', '#f4df47');
            
        } else if (Math.round(result.sadness) === 1) {
            mood = 'sad';
            $('#snapshot-wrapper').append($('<h2 id="mood-label">current mood: <span class="' + mood +  '">' + mood + '</span></h2>'));
            playlistMatch();
            $('body').css('background-color', '#939393');
            
        } else if (Math.round(result.surprise) === 1) {
            mood = 'shock';
            $('#snapshot-wrapper').append($('<h2 id="mood-label">current mood: <span class="' + mood +  '">' + mood + '</span></h2>'));
            playlistMatch();
            $('body').css('background-color', '#db874d');
            
        }

    })
    .fail(function(jqXHR, textStatus, errorThrown) {
        // display error message.
        var errorString = (errorThrown === "") ?
            "Error. " : errorThrown + " (" + jqXHR.status + "): ";
            errorString += (jqXHR.responseText === "") ?
                                "" : (jQuery.parseJSON(jqXHR.responseText).message) ?
                                            jQuery.parseJSON(jqXHR.responseText).message :
                                            jQuery.parseJSON(jqXHR.responseText).error.message;
        console.log(errorString);
        $('#snapshot-wrapper').append($('<h2 class="lightw">Oops! Looks like a mood could not be detected :/</h2><p class="lightw">Try again! Make sure your face is forward and clearly visible!</p>'))
    });
}


// function that converts img data to blob format
function convertToBlobFormat(dataURL) {
    var BASE64_MARKER = ';base64,';
    if (dataURL.indexOf(BASE64_MARKER) == -1) {
        var parts = dataURL.split(',');
        var contentType = parts[0].split(':')[1];
        var raw = decodeURIComponent(parts[1]);
        return new Blob([raw], { type: contentType });
    }
    var parts = dataURL.split(BASE64_MARKER);
    var contentType = parts[0].split(':')[1];
    var raw = window.atob(parts[1]);
    var rawLength = raw.length;

    var uInt8Array = new Uint8Array(rawLength);

    for (var i = 0; i < rawLength; ++i) {
        uInt8Array[i] = raw.charCodeAt(i);
    }
    return new Blob([uInt8Array], { type: contentType });
}

//function to get access token from Spotify
function startApp() {
    console.log("ready!"); 
    var queryURL = "https://cors-anywhere.herokuapp.com/https://accounts.spotify.com/api/token";
    var bas64 = btoa(  clientId +  ":" + secret );
    
    $.ajax({
        beforeSend: function(request) {
            request.setRequestHeader("Authorization", "Basic " + bas64)
        },
        url: queryURL,
        method: "POST",
        data: "json",
        contentType: "application/x-www-form-urlencoded",
        headers: {"Access-Control-Allow-Origin": "*", "Access-Control-Allow-Methods": "GET, POST, PATCH, PUT, DELETE, OPTIONS", "Access-Control-Allow-Headers": "*"},
        data: {grant_type: "client_credentials"}
    })
    .done( function(response) {
        //get access token
        atoken = response.access_token;
        
        //log if token exists
        if (atoken !== "") {
            console.log("Token Granted!");
        }
    })
    .fail( function(error) {
        console.log("Token Request Failed!");
        console.log(error);
    });
}

function playlistMatch() {
    //limit to 1 to speed up as much as possible
    var limit = 8;
    var q = mood;

    //offset by 10 to return a random playlist
    var offset = Math.floor(Math.random() * 10);
    var queryPlaylist = "https://api.spotify.com/v1/search?q="+ q +"&type=playlist&market=US&limit="+limit+"&offset="+offset;

    $.ajax({
        url: queryPlaylist,
        method: "GET",
        headers: { Authorization: "Bearer " + atoken}
    })
    .done( function(response) {
        $("#instructions").hide();
        $("#confirm-label").remove();
        $("#snapshot-wrapper").append("<p class='lightw'>check out your playlists below!</p>")
        for (var i=0; i < response.playlists.items.length; i++) {
            $("#playlist-wrapper").append("<iframe class='iframes' src='https://open.spotify.com/embed?uri=" 
                                        + response.playlists.items[i].uri 
                                        + "' width='280' height='320' frameborder='0' allowtransparency='true' allow='encrypted-media'></iframe>");
        }
    })
    .fail( function(error) {
        console.log("playlistMatch() has failed");
        console.log(error);
    });
}

