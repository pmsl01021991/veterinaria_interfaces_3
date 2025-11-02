import { bootstrapApplication } from '@angular/platform-browser';
import { provideRouter } from '@angular/router';
import { App } from './app/app';
import { routes } from './app/app.routes';
import { appConfig } from './app/app.config';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';


// Unificamos todo en una sola llamada
bootstrapApplication(App, {
  providers: [
    provideRouter(routes),
    ...(appConfig?.providers || [])
  ]
}).catch((err) => console.error(err));
