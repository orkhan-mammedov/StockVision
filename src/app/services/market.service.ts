import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { SymbolResponse } from './symbol.response';
import { Subject } from 'rxjs/Subject';
import {NewsCard} from './news.card';
import {Observable} from 'rxjs/Observable';
import {StockSnapshot} from './stock.snapshot.response';
import {CompanyDetails} from './company.details.response';
import {StockQuote} from './stock.quote.response';
import {StockKeyStats} from './stock.key.stats.response';
import {CompanyLogo} from './company.logo.response';
import {StockChartPoint} from './stock.chart.point.response';

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

  getStockSnapshots(stocksType: string): Observable<StockSnapshot[]> {
    const stockSnapshotsSubject: Subject<StockSnapshot[]> = new Subject<StockSnapshot[]>();
    const stockSnapshots$: Observable<StockSnapshot[]> = stockSnapshotsSubject.asObservable();

    this.httpClient.get<StockSnapshot[]>(this._getEndpointURL('/stock/market/list/' + stocksType)).subscribe(data => {
      stockSnapshotsSubject.next(data);
    });

    return stockSnapshots$;
  }

  getCompanyDetails(companySymbol: string): Observable<CompanyDetails> {
    const companyDetailsSubject: Subject<CompanyDetails> = new Subject<CompanyDetails>();
    const companyDetails$: Observable<CompanyDetails> = companyDetailsSubject.asObservable();

    this.httpClient.get<CompanyDetails>(this._getEndpointURL('/stock/' + companySymbol + '/company' )).subscribe(data => {
      companyDetailsSubject.next(data);
    });

    return companyDetails$;
  }

  getCompanyLogo(companySymbol: string): Observable<CompanyLogo> {
    const companyLogoSubject: Subject<CompanyLogo> = new Subject<CompanyLogo>();
    const companyLogo$: Observable<CompanyLogo> = companyLogoSubject.asObservable();

    this.httpClient.get<CompanyLogo>(this._getEndpointURL('/stock/' + companySymbol + '/logo' )).subscribe(data => {
      companyLogoSubject.next(data);
    });

    return companyLogo$;
  }

  getStockQuote(companySymbol: string): Observable<StockQuote> {
    const stockQuoteSubject: Subject<StockQuote> = new Subject<StockQuote>();
    const stockQuote$: Observable<StockQuote> = stockQuoteSubject.asObservable();

    this.httpClient.get<StockQuote>(this._getEndpointURL('/stock/' + companySymbol + '/quote' )).subscribe(data => {
      stockQuoteSubject.next(data);
    });

    return stockQuote$;
  }

  getStockKeyStats(companySymbol: string): Observable<StockKeyStats> {
    const stockKeyStatsSubject: Subject<StockKeyStats> = new Subject<StockKeyStats>();
    const stockKeyStats$: Observable<StockKeyStats> = stockKeyStatsSubject.asObservable();

    this.httpClient.get<StockKeyStats>(this._getEndpointURL('/stock/' + companySymbol + '/stats' )).subscribe(data => {
      stockKeyStatsSubject.next(data);
    });

    return stockKeyStats$;
  }

  getStockChartPoints(companySymbol: string, range: string): Observable<StockChartPoint[]> {
    const stockChartPointsSubject: Subject<StockChartPoint[]> = new Subject<StockChartPoint[]>();
    const stockChartPoints$: Observable<StockChartPoint[]> = stockChartPointsSubject.asObservable();

    this.httpClient.get<StockChartPoint[]>(this._getEndpointURL('/stock/' + companySymbol + '/chart/' + range)).subscribe(data => {
      if (range.toLocaleLowerCase() !== '1d') {
        data.map(stockChartPoint => {
          stockChartPoint.average = (stockChartPoint.low + stockChartPoint.high) / 2;
          stockChartPoint.pointInTime = stockChartPoint.date;
          return stockChartPoint;
        });
      } else {
        data.map(stockChartPoint => {
          stockChartPoint.pointInTime = stockChartPoint.minute;
          return stockChartPoint;
        });
      }
      stockChartPointsSubject.next(data);
    });

    return stockChartPoints$;
  }

  getCompanyNameToSymbolMap(): Map<string, string> {
    return this._companyNameToSymbolMap;
  }

  private _getEndpointURL(endpoint: string): string {
    return this._apiURL + '/' + this._apiVersion + '/' + endpoint;
  }
}
