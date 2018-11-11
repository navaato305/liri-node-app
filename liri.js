var divider = "\n----------------------------------\n"

//Twitter Keys
var activeKeys = require('./keys.js');

//Twitter Function
var Twitter = require('twitter');

var client = new Twitter (activeKeys.twitterKeys);


function twitterWrite () {
	var params = {screen_name: 'UCF_LIRI_Dav', count: 20};

	client.get('statuses/user_timeline', params, function (error, tweets, response) {
		var tweetMessage = "";
		if (!error) {
			for (var i = 0; i < tweets.length; i++) {
				tweetMessage += "\n"+tweets[i].created_at + " - " + tweets[i].text;
			}
		}
		else {
			console.log(error);
		}

		tweetMessage += divider;
		console.log(divider + tweetMessage);

		fs.appendFile("log.txt", tweetMessage, function (err) {
			if (err) {
				console.log(err);
			}
		})
	})
}

// twitterWrite ();

//Spotify Function
var Spotify = require('node-spotify-api');

var spotify = new Spotify ({
	id: 'df16d8312ed54b45b4d65dc32a81d78d',
	secret: '176efb35dedf483ebb4371809d847fdd'
});

function spotifyWrite () {

	var queryTerm;
	var comboTerm = "";

	for (var i = 3; i < process.argv.length; i++) {
		comboTerm += process.argv[i] + " ";
	}

	if (process.argv[2] == "spotify-this-song" && process.argv[3] != undefined) {
		queryTerm = comboTerm;
	}
	else if (process.argv[2] == "spotify-this-song" && process.argv[3] == undefined) {
		queryTerm = "The Sign, Ace of Base";
	}
	else if (process.argv[2] == "do-what-it-says") {
		queryTerm = readQuery;
	}

	spotify.search({type: 'track', query: queryTerm, limit: 1}, function (err, data) {

		if (data.tracks.items[0] == undefined) {
			console.log("No Song Found");
			return;
		}

		var artist = data.tracks.items[0].artists[0].name;

		for (var i = 1; i < data.tracks.items[0].artists.length; i++) {
			artist += ", " + data.tracks.items[0].artists[i].name;
		}

		// console.log(artist);

		var songMessage = "Song: " + data.tracks.items[0].name + "\nArtist: " + artist + "\nAlbum: " + data.tracks.items[0].album.name + "\nLink: " + data.tracks.items[0].external_urls.spotify;

		songMessage += divider;

		console.log(divider + songMessage);

		fs.appendFile("log.txt", songMessage, function (err) {
			if (err) {
				console.log(err);
			}
		})
	})
}

// spotifyWrite();

//OMDB Function
function movieWrite () {
	var request = require('request');

	var queryTerm;
	var comboTerm = "";

	for (var i = 3; i < process.argv.length; i++) {
		comboTerm += process.argv[i] + " ";
	}

	if (process.argv[2] == "movie-this" && process.argv[3] != undefined) {
		queryTerm = comboTerm;
	}
	else if (process.argv[2] == "movie-this" && process.argv[3] == undefined) {
		queryTerm = "Mr. Nobody";
	}
	else if (process.argv[2] == "do-what-it-says") {
		queryTerm = readQuery;
	}

	var queryURL = "http://www.omdbapi.com/?t=" + queryTerm + "&apikey=40e9cece"

	request(queryURL, function (error, response, body) {
		var obj = JSON.parse(body);

		if (error) {
			return console.log(error);
		}
		else if (obj.Response == "False") {
			return console.log("No Movie Found");
		}

		var movieMessage = "Title: " + obj.Title + "\nYear: " + obj.Year + "\nIMDB Rating: " + obj.Ratings[0].Value + "\nRotten Tomatoes Rating: " + obj.Ratings[1].Value + "\nCountry: " + obj.Country + "\nLanguage: " + obj.Language + "\nPlot: " + obj.Plot + "\nActors: " + obj.Actors;

		movieMessage += divider;

		console.log(divider + movieMessage);

		fs.appendFile("log.txt", movieMessage, function (err) {
			if (err) {
				console.log(err);
			}
		})

	})
}

// movieWrite();

//DoThis Function
var readQuery;
var fs = require("fs");

function doThisWrite () {

	fs.readFile("random.txt", "utf8", function (err, data) {

		if (err) {
			return console.log(err);
		}

		data = data.split(", ")

		readQuery = data[1];

		if (data[0] == "my-tweets") {
		 	twitterWrite();
		}
		else if (data[0] == "spotify-this-song") {
		 	spotifyWrite();
		}
		else if (data[0] == "movie-this") {
		    movieWrite();
		}

	})

}

// doThisWrite ();

var action = process.argv[2];

switch (action) {
	case "my-tweets":
		twitterWrite();
		break;

	case "spotify-this-song":
		spotifyWrite();
		break;

	case "movie-this":
		movieWrite();
		break;

	case "do-what-it-says":
		doThisWrite();
		break;
	default:
		console.log("Please Use a Working Command: \nmy-tweets \nspotify-this-song \nmovie-this \ndo-what-it-says");
		break;
}