SystemJS.config({
  paths: {
    "npm:": "jspm_packages/npm/",
    "github:": "jspm_packages/github/",
    "canopy-sofe-extensions/": "src/"
  },
  browserConfig: {
    "baseURL": "/"
  },
  devConfig: {
    "map": {
      "plugin-babel": "npm:systemjs-plugin-babel@0.0.12"
    }
  },
  transpiler: "plugin-babel",
  packages: {
    "canopy-sofe-extensions": {
      "main": "canopy-sofe-extensions.js",
      "meta": {
        "*.js": {
          "loader": "plugin-babel"
        }
      }
    }
  }
});

SystemJS.config({
  packageConfigPaths: [
    "npm:@*/*.json",
    "npm:*.json",
    "github:*/*.json"
  ],
  map: {
    "process": "github:jspm/nodelibs-process@0.2.0-alpha",
    "sofe": "npm:sofe@1.4.1"
  },
  packages: {
    "npm:sofe@1.4.1": {
      "map": {
        "path-browserify": "npm:path-browserify@0.0.0"
      }
    }
  }
});
