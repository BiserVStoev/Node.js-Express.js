const fs = require('fs');
const qs = require('querystring');
const db = require('./../config/dataBase');
const addMovieFilePath = './views/addMovie.html';
const addMoviePath = '/addMovie';
const viewAllMoviesFilePath = './views/viewAll.html';
const viewAllPath = '/viewAllMovies';
const detailedMovieRegex = /^\/movies\/details\/\d+$/;
const detailedMovieFilePath = './views/details.html';

let detailedMovieLinkMaker = (id) => `/movies/details/${id}`;
let decodeDetailedComponents = (component) => {
  let result = decodeURIComponent(component);
  result = result.replace(/\+/g, ' ');
  return result;
};

module.exports = (req, res) => {
  console.log(req.headers)
  if (req.path === addMoviePath && req.method === 'GET') {
    fs.readFile(addMovieFilePath, (err, data) => {
      if (err) {
        console.log(err.message);
        return;
      }

      res.writeHead(200, {
        'content-type': 'text/html'
      });
      res.write(data);
      res.end();
    });
  } else if (req.path === addMoviePath && req.method === 'POST') {
    let body = [];
    req.on('data', (chunk) => {
      body.push(chunk);
    }).on('end', () => {
      body = Buffer.concat(body).toString();
      let parsedBody = qs.parse(body);
      let validMovieFlag = true;
      for (let prop in parsedBody) {
        if (parsedBody[prop] == '') {
          validMovieFlag = false;
          break;
        }
      }

      res.writeHead(200, {
        'content-type': 'text/html'
      });
      fs.readFile('./views/AddMovie.html', (err, data) => {
        if (err) {
          console.log(err.message);
          return;
        }

        let output = data.toString();
        if (validMovieFlag) {
          db.push(parsedBody);
          output = data.toString().replace('<div id="replaceMe">{{replaceMe}}</div>', '<div id="succssesBox"><h2 id="succssesMsg">Movie Added</h2></div>');
        } else {
          output = data.toString().replace('<div id="replaceMe">{{replaceMe}}</div>', '<div id="errBox"><h2 id="errMsg">Please fill all fields</h2></div>');
        }

        res.write(output);
        res.end();
      });
      // at this point, `body` has the entire request body stored in it as a string
    });
  } else if (req.path === viewAllPath && req.method === 'GET') {
    fs.readFile(viewAllMoviesFilePath, (err, data) => {
      if (err) {
        console.log(err.message);
        return;
      }

      res.writeHead(200, {
        'content-type': 'text/html'
      });

      let allMovies = [];
      counter = 0;
      for (let currMovie of db) {
        let movieDiv = `<div class="movie">
                          <a href="${detailedMovieLinkMaker(counter)}">
                            <img class="moviePoster" src="${decodeURIComponent(currMovie.moviePoster)}"/>
                          </a>
                        </div>`;
        allMovies.push(movieDiv);
        counter++;
      }

      let output = data.toString().replace('<div id="replaceMe">{{replaceMe}}</div>', allMovies.join(''))
      res.write(output);
      res.end();
    });
  } else if (detailedMovieRegex.test(req.path) && req.method === "GET") {
    let movieId = req.path.split('/');
    movieId = movieId[movieId.length - 1];
    let currMovie = db[movieId];
    if (currMovie === undefined) {
      return true;
    }

    fs.readFile(detailedMovieFilePath, (err, data) => {
      if (err) {
        console.log(err.message);
        return;
      }

      res.writeHead(200, {
        'content-type': 'text/html'
      });

      let movieDiv = `<div class="content">
          <img src="${decodeDetailedComponents(currMovie.moviePoster)}" alt=""/>
          <h3>Title ${decodeDetailedComponents(currMovie.movieTitle)}</h3>
          <h3>Year ${decodeDetailedComponents(currMovie.movieYear)}</h3 >
      <p> ${decodeDetailedComponents(currMovie.movieDescription)}</p>
          </div > ​`;
        
        let output = data.toString().replace('<div id="replaceMe">{{replaceMe}}</div>', movieDiv);
        res.write(output);
        res.end();
      });
      
  }else {
    return true;
  }
}