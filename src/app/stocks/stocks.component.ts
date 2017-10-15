import { Component, OnInit } from '@angular/core';
import {MarketService} from '../services/market.service';

@Component({
  selector: 'app-stocks',
  templateUrl: './stocks.component.html',
  styleUrls: ['./stocks.component.css']
})
export class StocksComponent implements OnInit {
  companyNames: string[];
  companyNameToSymbolMap: Map<string, string>;

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
  }

}
