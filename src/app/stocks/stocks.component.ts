import { Component, OnInit } from '@angular/core';
import {MarketService} from '../services/market.service';
import {FormControl} from '@angular/forms';
import {Observable} from 'rxjs/Observable';
import {StockSnapshot} from '../services/stock.snapshot.response';

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

  constructor(private marketService: MarketService) {
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
    // TODO: Implement search logic
  }

  private filter(val: string): string[] {
    return this.companyNames.filter(option =>
      option.toLowerCase().indexOf(val.toLowerCase()) === 0).slice(0, this.numberOfSuggestedCompanies);
  }

}
