import { Component, OnInit } from '@angular/core';
import {MarketService} from '../services/market.service';
import {FormControl} from '@angular/forms';
import {Observable} from 'rxjs/Observable';

@Component({
  selector: 'app-stocks',
  templateUrl: './stocks.component.html',
  styleUrls: ['./stocks.component.css']
})
export class StocksComponent implements OnInit {
  numberOfSuggestedCompanies = 5;
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
