import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';

import { AppModule } from './app/app.module';

// "deployUrl": "https://sastasundar.com/ngdashboard/V2_28/",
// "deployUrl": "https://stage.sastasundar.com/ngdashboard/",


platformBrowserDynamic().bootstrapModule(AppModule)
  .catch(err => console.error(err));
