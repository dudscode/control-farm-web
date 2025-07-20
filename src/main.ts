import { initFederation } from '@angular-architects/native-federation';

initFederation({
  'control-farm-mfe': 'https://d3fattc0qhjhmh.cloudfront.net/bundle/remoteEntry.json'
})
  .catch(err => console.error(err))
  .then(_ => import('./bootstrap'))
  .catch(err => console.error(err));
