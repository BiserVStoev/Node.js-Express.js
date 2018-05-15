const fs = require('fs');
const formidable = require('formidable');
const db = require('../config/dataBase');
const qs = require('querystring');
const url = require('url');
const shortid = require('shortid');
const mv = require('mv');
const allMemesFilePath = './views/viewAll.html';
const addMemeFilePath = './views/addMeme.html';
const detailedMemeFilePath = './views/details.html';

let viewAll = (req, res) => {
  let readStream = fs.createReadStream(allMemesFilePath);
  let html = '';
  readStream.on('data', data => {
    html += data;
  });
  readStream.on('end', () => {
    let memeData = db.getDb();
    memeData = memeData.sort((a, b) => {
      return b.dateStamp - a.dateStamp;
    }).filter((currMeme) => {
      return currMeme.privacy === 'on';
    });
    let memesToReplace = '';
    for (let meme of memeData) {
      memesToReplace += `<div class="meme">
      <a href="/getDetails?id=${meme.id}">
      <img class="memePoster" src="${meme.memeSrc}"/>
      </div>`;
    }

    html = html.replace('<div id="replaceMe">{{replaceMe}}</div>', memesToReplace)
    res.writeHead(200, {
      'Content-Type': 'text/html'
    });
    res.write(html);
    res.end();
  });
}

let viewAddMeme = (req, res) => {
  let readStream = fs.createReadStream(addMemeFilePath);
  let html = '';

  readStream.on('data', data => {
    html += data;
  });

  readStream.on('end', () => {
    res.writeHead(200, {
      'Content-Type': 'text/html'
    });
    res.write(html);
    res.end();
  });
}

let addMeme = (req, res) => {
  let form = new formidable.IncomingForm();
  let currDb = db.getDb();
  let dbLength = Math.ceil(currDb.length / 10);
  let fileName = shortid.generate();
  form.parse(req, (err, fields, files) => {
    if (err) {
      console.log(err);
      return;
    }

    let title = fields.memeTitle;
    let memeSrc =  `./public/memeStorage/${dbLength}/${fileName}.jpg`;
    let description = fields.memeDescription;
    let privacy = fields.status;
    let id = fileName;
    let meme = {
      id: id,
      title: title,
      memeSrc: memeSrc,
      description: description,
      privacy: privacy,
      dateStamp: Date.now()
    };

    console.log(meme)
    mv(files.meme.path, memeSrc, {mkdirp: true}, (err) => {
      if(err){
        console.log(err);
        return;
      }

      db.add(meme);
      db.save().then(() => {
        res.writeHead(302, {
          'Location': '/viewAllMemes'
        });
        res.end();
      });
    });
  });
};

let getDetails = (req, res) => {
  let memeId = qs.parse(url.parse(req.url).query).id;
  let meme = db.getDb().find((searchedMeme) => searchedMeme.id === memeId);
  console.log(meme);
  if (meme === undefined) {
    res.writeHead(404, {
      'Content-Type': 'text/html'
    });
    res.write("NOT FOUND");
    res.end();
    return;
  }
  let readStream = fs.createReadStream(detailedMemeFilePath);
  let html = '';

  readStream.on('data', data => {
    html += data;
  });

  readStream.on('end', () => {
    res.writeHead(200, {
      'Content-Type': 'text/html'
    });
    html = html.replace('<div id="replaceMe">{{replaceMe}}</div>', `<div class="content">
    <img src="${meme.memeSrc}" alt=""/>
    <h3>Title ${meme.title}</h3>
    <p> ${meme.description}</p>
    <button><a href="${meme.memeSrc}">Download Meme</a></button>
    </div>`);
    res.write(html);
    res.end();
  });
}

module.exports = (req, res) => {
  if (req.pathname === '/viewAllMemes' && req.method === 'GET') {
    viewAll(req, res);
  } else if (req.pathname === '/addMeme' && req.method === 'GET') {
    viewAddMeme(req, res)
  } else if (req.pathname === '/addMeme' && req.method === 'POST') {
    addMeme(req, res);
  } else if (req.pathname.startsWith('/getDetails') && req.method === 'GET') {
    getDetails(req, res);
  } else {
    return true;
  }
}
