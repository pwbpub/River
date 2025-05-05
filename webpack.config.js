const path = require('path');

module.exports = {
  
  resolve: {
    fallback: {
      "zlib": false,
      "querystring": false,
      "crypto": false,
      "path": false,
      "stream": false,
      "http": false,
      "url": false,
      "buffer": false,
      "fs": false,
      "net": false,
      "util": false
    }
  }
};