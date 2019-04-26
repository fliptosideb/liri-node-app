require("dotenv").config();

var keys = require("./keys.js");
var Spotify = require("node-spotify-api")
var spotify = new Spotify(keys.spotify);
var moment = require('moment')
var axios = require('axios')

var option = process.argv[2];
var input = process.argv.slice(3);

user(option, input)

function user(option, input) {
    switch (option) {
        case 'concert-this':
            concertInfo(input);
            break;
        case 'spotify-this-song':
            songInfo(input);
            break;
        case 'movie-this':
            movieInfo(input);
            break;
        default:
            console.log("error")
    }
}

function concertInfo(input) {
    axios.get(`https://rest.bandsintown.com/artists/${input.join(' ')}/events?app_id=codingbootcamp&date=upcoming`)
        .then(({ data: [{venue: {name, city}, datetime}] }) => {
            // need to loop to show more than one concert date
                console.log(`
        Venue: ${name}
        Location: ${city}
        Date: ${moment(datetime).format('MM-DD-YYYY, LT')}
        `)})
        .catch(e => console.log(e, "Please Enter a Valid Arist"))

}

function songInfo(input) {
    if (!input) {
        input = "The Sign";
        // can't get it default to this song
    } else {
        spotify.search({
            type: 'track',
            query: input,
        })
            .then(function (response) {
                console.log(response)
                let song = response.tracks.items
                song.forEach(track => {
                    console.log(`
    Artist: ${track.artists[0].name}
    Song: ${track.name}
    Preview Link: ${track.preview_url}
    Album: ${track.album.name}
    `)
                })
            })
            .catch(function (err) {
                console.log(err);
            })
    }
}


function movieInfo(input) {
    console.log(input)
    axios.get(`http://www.omdbapi.com/?t=${input.join(' ')}&apikey=trilogy`)

        .then(({ data: { Title, Released, imdbRating, Ratings: [, { Value }], Country, Language, Plot, Actors } }) => console.log(`
    Title: ${Title}
    Release Year: ${Released}
    IMDB: ${imdbRating}
    Rotten Tomatoes: ${Value}
    Country: ${Country}
    Language: ${Language}
    Plot: ${Plot}
    Actors: ${Actors}`
        ))
        .catch(e => console.log(e, "Please Enter a Valid Title"))
}

