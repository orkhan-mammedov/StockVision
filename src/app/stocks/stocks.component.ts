import { Component, OnInit } from '@angular/core';
import {MarketService} from '../services/market.service';

@Component({
  selector: 'app-stocks',
  templateUrl: './stocks.component.html',
  styleUrls: ['./stocks.component.css']
})
export class StocksComponent implements OnInit {
  companyNameToSymbolMap: Map<string, string>;

  constructor(private marketService: MarketService) {
    this.companyNameToSymbolMap = this.marketService.getCompanyNameToSymbolMap();
    if (this.companyNameToSymbolMap == null) {
      this.marketService.companyNameToSymbolMap$.subscribe(companyNameToSymbol => {
        this.companyNameToSymbolMap = companyNameToSymbol;
      });
    }
  }

  ngOnInit() {
  }

}
