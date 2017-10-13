import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { SymbolResponse } from './symbol.response';
import { Subject } from 'rxjs/Subject';

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

  getCompanyNameToSymbolMap(): Map<string, string> {
    return this._companyNameToSymbolMap;
  }

  private _getEndpointURL(endpoint: string): string {
    return this._apiURL + '/' + this._apiVersion + '/' + endpoint;
  }
}
