const fs = require('fs');
let validExtensions = {
  '.html': 'text/html',
  '.css': 'text/css',
  '.js': 'application/javascipt',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.png' : 'image/png'
};

let notFoundErrorPage = (res) => {
  fs.readFile('./error.html', (err, data) => {
    if (err) {
      console.log(err.message);
      return;
    }

    res.writeHead(404, {
      'content-type': 'text/html'
    })
    res.write(data);
    res.end();
  });
}

module.exports = (req, res) => {
  if (req.path.startsWith('/public')) {
    let typeIsAllowed = false;
    let neededExtension = '';
    for (let extension in validExtensions) {
      if (req.path.endsWith(extension)) {
        neededExtension = extension;
        typeIsAllowed = true;
        break;
      }
    }

    if (!typeIsAllowed) {
      notFoundErrorPage(res);
      return;
    }
    fs.readFile('.' + req.path, (err, data) => {
      if (err) {
        console.log(err);
        notFoundErrorPage(res);
        return;
      }
      res.writeHead(200, {
        'content-type': validExtensions[neededExtension]
      });

      res.write(data);
      res.end();
    })
  } else {
    notFoundErrorPage(res);
  }
}