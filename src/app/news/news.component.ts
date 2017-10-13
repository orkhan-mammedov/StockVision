import { Component, OnInit } from '@angular/core';
import { MarketService } from '../services/market.service';

@Component({
  selector: 'app-news',
  templateUrl: './news.component.html',
  styleUrls: ['./news.component.css']
})
export class NewsComponent implements OnInit {
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
