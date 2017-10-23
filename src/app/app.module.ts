import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { BrowserAnimationsModule} from '@angular/platform-browser/animations';
import { RouterModule, Routes } from '@angular/router';
import { MaterialModule } from '../material/material.module';
import { NewsComponent } from './news/news.component';
import { StocksComponent } from './stocks/stocks.component';
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';
import {HttpClientModule} from '@angular/common/http';
import {MarketService} from './services/market.service';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import { StockDetailComponent } from './stock-detail/stock-detail.component';
import { StockSnapshotComponent } from './stock-snapshot/stock-snapshot.component';
import {ChartsModule} from 'ng2-charts';

const appRoutes: Routes = [
  { path: 'news',
    component: NewsComponent },
  { path: 'stocks/:id',
    component: StockDetailComponent },
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
    PageNotFoundComponent,
    StockDetailComponent,
    StockSnapshotComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    HttpClientModule,
    RouterModule,
    MaterialModule,
    FormsModule,
    ReactiveFormsModule,
    ChartsModule,
    RouterModule.forRoot(
      appRoutes
    )
  ],
  providers: [
    MarketService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
