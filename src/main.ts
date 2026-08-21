import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';

import { AppModule } from './app/app.module';

// "deployUrl": "https://stage.sastasundar.com/ngdashboard/v_26.8.21_4/",


platformBrowserDynamic().bootstrapModule(AppModule)
  .catch(err => console.error(err));
