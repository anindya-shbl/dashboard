import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';

import { AppModule } from './app/app.module';

// "deployUrl": "https://sastasundar.com/ngdashboard/V2_25/",
// "deployUrl": "https://stage.sastasundar.com/ngdashboard/v_26.8.21_2/",


platformBrowserDynamic().bootstrapModule(AppModule)
  .catch(err => console.error(err));
