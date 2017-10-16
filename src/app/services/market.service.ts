import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { SymbolResponse } from './symbol.response';
import { Subject } from 'rxjs/Subject';
import {NewsCard} from './news.card';
import {Observable} from 'rxjs/Observable';

@Injectable()
export class MarketService {
  private _apiURL= 'https://api.iextrading.com';
  private _apiVersion= '1.0';
  private _companyNameToSymbolMap: Map<string, string>;
  private _companyNameToSymbolMapSubject= new Subject<Map<string, string>>();

  // $ suffix is used to indicate that the variable is an Observable
  companyNameToSymbolMap$= this._companyNameToSymbolMapSubject.asObservable();

  constructor(private httpClient: HttpClient) {
    this._companyNameToSymbolMap = null;
    this.httpClient.get<SymbolResponse[]>(this._getEndpointURL('/ref-data/symbols')).subscribe(data => {
      // Read the result field from the JSON response.
      this._companyNameToSymbolMap = new Map();

      for (const entry of data) {
        this._companyNameToSymbolMap.set(entry.name, entry.symbol);
      }
      this._companyNameToSymbolMapSubject.next(this._companyNameToSymbolMap);
    });
  }

  getLatestMarketNews(): Observable<NewsCard[]> {
    const newsCardsSubject: Subject<NewsCard[]> = new Subject<NewsCard[]>();
    const newsCards$: Observable<NewsCard[]> = newsCardsSubject.asObservable();

    this.httpClient.get<NewsCard[]>(this._getEndpointURL('/stock/market/news/last/50')).subscribe(data => {
      newsCardsSubject.next(data);
    });

    return newsCards$;
  }

  getCompanyNews(companyName: string): Observable<NewsCard[]> {
    const newsCardsSubject: Subject<NewsCard[]> = new Subject<NewsCard[]>();
    const newsCards$: Observable<NewsCard[]> = newsCardsSubject.asObservable();

    this.httpClient.get<NewsCard[]>(this._getEndpointURL('/stock/' + companyName + '/news/last/50')).subscribe(data => {
      newsCardsSubject.next(data);
    });

    return newsCards$;
  }

  getCompanyNameToSymbolMap(): Map<string, string> {
    return this._companyNameToSymbolMap;
  }

  private _getEndpointURL(endpoint: string): string {
    return this._apiURL + '/' + this._apiVersion + '/' + endpoint;
  }
}
