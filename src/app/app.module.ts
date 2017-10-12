import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { BrowserAnimationsModule} from '@angular/platform-browser/animations';
import { RouterModule, Routes, RouterOutlet } from '@angular/router';
import { MaterialModule } from '../material/material.module';
import { NewsComponent } from './news/news.component';
import { StocksComponent } from './stocks/stocks.component';
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';

const appRoutes: Routes = [
  { path: 'news',
    component: NewsComponent },
  { path: 'stocks',
    component: StocksComponent },
  { path: '',
    redirectTo: '/news',
    pathMatch: 'full' },
  { path: '**',
    component: PageNotFoundComponent }
];

@NgModule({
  declarations: [
    AppComponent,
    NewsComponent,
    StocksComponent,
    PageNotFoundComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    RouterModule,
    MaterialModule,
    RouterModule.forRoot(
      appRoutes,
      { enableTracing: true } // <-- debugging purposes only
    )
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
