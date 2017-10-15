import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Observable } from 'rxjs/Observable';
import { MarketService } from '../services/market.service';
import 'rxjs/add/operator/startWith';
import 'rxjs/add/operator/map';

@Component({
  selector: 'app-news',
  templateUrl: './news.component.html',
  styleUrls: ['./news.component.css']
})
export class NewsComponent implements OnInit {
  numberOfSuggestedCompanies = 5;
  companyNames: string[];
  companyNameToSymbolMap: Map<string, string>;
  filteredCompanyNames: Observable<string[]>;
  searchControl: FormControl = new FormControl();

  constructor(private marketService: MarketService) {
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

  filter(val: string): string[] {
    return this.companyNames.filter(option =>
      option.toLowerCase().indexOf(val.toLowerCase()) === 0).slice(0, this.numberOfSuggestedCompanies);
  }

}
