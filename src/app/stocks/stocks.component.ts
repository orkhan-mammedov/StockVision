import { Component, OnInit } from '@angular/core';
import {MarketService} from '../services/market.service';
import {FormControl} from '@angular/forms';
import {Observable} from 'rxjs/Observable';
import {StockSnapshot} from '../services/stock.snapshot.response';
import {isUndefined} from 'util';
import {Router} from '@angular/router';

@Component({
  selector: 'app-stocks',
  templateUrl: './stocks.component.html',
  styleUrls: ['./stocks.component.css']
})
export class StocksComponent implements OnInit {
  numberOfSuggestedCompanies = 5;
  mostActiveStocks: StockSnapshot[];
  gainersStocks: StockSnapshot[];
  losersStocks: StockSnapshot[];
  companyNames: string[];
  companyNameToSymbolMap: Map<string, string>;
  filteredCompanyNames: Observable<string[]>;
  searchControl: FormControl = new FormControl();

  constructor(private marketService: MarketService,  private router: Router) {
    // Initiate companyNameToSymbolMap to facilitate search functionality
    this.filteredCompanyNames = null;
    this.companyNameToSymbolMap = this.marketService.getCompanyNameToSymbolMap();
    if (this.companyNameToSymbolMap == null) {
      this.marketService.companyNameToSymbolMap$.subscribe(companyNameToSymbolMap => {
        this.companyNameToSymbolMap = companyNameToSymbolMap;
        this.companyNames = Array.from(this.companyNameToSymbolMap.keys());
      });
    } else {
      this.companyNames = Array.from(this.companyNameToSymbolMap.keys());
    }

    // Initialize mostActiveStocks
    const mostActiveStocksObservable: Observable<StockSnapshot[]> = this.marketService.getStockSnapshots('mostactive');
    mostActiveStocksObservable.subscribe(mostActiveStocks => {
      this.mostActiveStocks = mostActiveStocks;
    });

    // Initialize gainersStocks
    const gainersStocksObservable: Observable<StockSnapshot[]> = this.marketService.getStockSnapshots('gainers');
    gainersStocksObservable.subscribe(gainersStocks => {
      this.gainersStocks = gainersStocks;
    });

    // Initialize gainersStocks
    const losersStocksObservable: Observable<StockSnapshot[]> = this.marketService.getStockSnapshots('losers');
    losersStocksObservable.subscribe(losersStocks => {
      this.losersStocks = losersStocks;
    });
  }

  ngOnInit() {
    this.filteredCompanyNames = this.searchControl.valueChanges
      .startWith(null)
      .map(val => val ? this.filter(val) : []);
  }

  search() {
    let companySymbol: string;
    if (this.searchControl.value === '') {
      return;
    }

    if (this.companyNameToSymbolMap.has(this.searchControl.value)) {
      companySymbol = this.companyNameToSymbolMap.get(this.searchControl.value);
    } else {
      const suggestedCompanies:  string[] = this.filter(this.searchControl.value);
      companySymbol = this.companyNameToSymbolMap.get(suggestedCompanies[0]);
    }

    if (companySymbol == null || isUndefined(companySymbol) || companySymbol === '') {
      companySymbol = 'null_company'; // this will return no results, which is what we want
    }

    this.router.navigate(['/stocks', companySymbol]);
  }

  private filter(val: string): string[] {
    return this.companyNames.filter(option =>
      option.toLowerCase().indexOf(val.toLowerCase()) === 0).slice(0, this.numberOfSuggestedCompanies);
  }

}
