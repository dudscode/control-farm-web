const { withNativeFederation, shareAll } = require('@angular-architects/native-federation/config');

module.exports = withNativeFederation({

  shared: {
    ...shareAll({ singleton: true, strictVersion: true, requiredVersion: 'auto' }),
  },
  remotes: {
  // incluir caminho do remoteEntry.js bucket
  'control-farm-mfe': 'https://d3fattc0qhjhmh.cloudfront.net/bundle/remoteEntry.js',
},

  skip: [
    'rxjs/ajax',
    'rxjs/fetch',
    'rxjs/testing',
    'rxjs/webSocket',
  ]

  
});
