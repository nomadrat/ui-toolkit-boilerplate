module.exports = {

  "path": {
    "inputDir": "src/",
    "outputDir": "dist/",

    "input": {
      "copy": "src/copy-this/**/*",
      "scripts": "src/scripts/*.js",
      "styles": "src/styles/*.scss"
    },
    "output": {
      "scripts": "dist/scripts/",
      "styles": "dist/styles/"
    }
  },

  "browserSync": {
    "port": 1919,
    "reload": false,
    "baseDir": "dist/"
  }

};