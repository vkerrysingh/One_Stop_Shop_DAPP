module.exports = {
  build: {
    "index.html": "index.html",
    "admin.html":"partials/admin.html",
    "app.js": [
      "javascripts/app.js",            
      "javascripts/_vendor/jquery-3.1.1.min.js",      
      "javascripts/_vendor/bootstrap.min.js"
    ],
    "storeScripts.js":[
      "javascripts/_vendor/angular.min.js",
      "javascripts/storecontroller.js"      
    ],
    "app.css": [
      "stylesheets/app.css"      
    ],
    "bootstrap.css":[
      "stylesheets/bootstrap.css",
      "stylesheets/bootstrap-theme.min.css",
      //"stylesheets/bootstrap-theme.min.css.map",
      "stylesheets/bootstrap-responsive.min.css",      
      "stylesheets/customerManagementStyles.css"
    ],
    "images/": "images/"
  },
  rpc: {
    host: "localhost",
    port: 8545
  }
};
