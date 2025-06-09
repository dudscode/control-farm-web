import { initFederation } from '@angular-architects/native-federation';

initFederation({
  'control-farm-mfe': 'http://localhost:4202/remoteEntry.json'
})
  .catch(err => console.error(err))
  .then(_ => import('./bootstrap'))
  .catch(err => console.error(err));
