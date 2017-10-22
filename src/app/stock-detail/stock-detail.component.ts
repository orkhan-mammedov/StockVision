import { Component, OnInit } from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {Observable} from 'rxjs/Observable';
import {CompanyDetails} from '../services/company.details.response';
import {MarketService} from '../services/market.service';
import {StockQuote} from '../services/stock.quote.response';
import {StockKeyStats} from '../services/stock.key.stats.response';
import {CompanyLogo} from '../services/company.logo.response';

@Component({
  selector: 'app-stock-detail',
  templateUrl: './stock-detail.component.html',
  styleUrls: ['./stock-detail.component.css']
})
export class StockDetailComponent implements OnInit {
  companyName: string;
  companySymbol: string;
  companyLogoUrl: string;
  companyDescription: string;
  companyCEO: string;
  companyIndustry: string;
  companySector: string;
  companyWebsite: string;
  companyWebsiteFormatted: string;
  stockPrice: number;
  stockPriceChange: number;
  stockPriceChangePercentage: number;
  marketCapitalization: string;
  week52high: number;
  week52low: number;
  stockDividendYield: number;
  companyRevenue: string;
  companyGrossProfit: string;
  companyCash: string;
  companyDebt: string;

  stockFound: boolean;
  companyDetailsRetrieved: boolean;
  stockQuoteRetrieved: boolean;
  stockKeyStatsRetrieved: boolean;

  constructor(private route: ActivatedRoute, private marketService: MarketService) {
    this.companyDetailsRetrieved = false;
    this.stockQuoteRetrieved = false;
    this.stockKeyStatsRetrieved = false;
    this.stockFound = true;
  }

  ngOnInit() {
    this.route.params.subscribe(params => {
      this.companySymbol = params['id'];

      if (this.companySymbol === 'null_company') {
        this.stockFound = false;
        return;
      }
      this.stockFound = true;

      const companyDetailsObservable: Observable<CompanyDetails> = this.marketService.getCompanyDetails(this.companySymbol);
      companyDetailsObservable.subscribe(companyDetails => {
        this.companyName = companyDetails.companyName;
        this.companyDescription = companyDetails.description;
        this.companyCEO = companyDetails.CEO;
        this.companyIndustry = companyDetails.industry;
        this.companySector = companyDetails.sector;
        this.companyWebsite = companyDetails.website;
        this.companyWebsiteFormatted = companyDetails.website.replace(/^https?\:\/\//i, '');
        this.companyDetailsRetrieved = true;
      });

      const companyLogoObservable: Observable<CompanyLogo> = this.marketService.getCompanyLogo(this.companySymbol);
      companyLogoObservable.subscribe(companyLogo => {
        this.companyLogoUrl = companyLogo.url;
      });

      const stockQuoteObservable: Observable<StockQuote> = this.marketService.getStockQuote(this.companySymbol);
      stockQuoteObservable.subscribe(stockQuote => {
        this.stockPrice = stockQuote.latestPrice; // TODO: Could use calculated price, but it is blank when markets close
        this.stockPriceChange = stockQuote.change;
        this.stockPriceChangePercentage = stockQuote.changePercent;
        this.week52high = stockQuote.week52High;
        this.week52low = stockQuote.week52Low;
        this.stockQuoteRetrieved = true;
      });

      const stockKeyStatsObservable: Observable<StockKeyStats> = this.marketService.getStockKeyStats(this.companySymbol);
      stockKeyStatsObservable.subscribe(stockKeyStats => {
        this.stockDividendYield = stockKeyStats.dividendYield;
        this.marketCapitalization = this.formatLongNumber(stockKeyStats.marketcap);
        this.companyRevenue = this.formatLongNumber(stockKeyStats.revenue);
        this.companyGrossProfit = this.formatLongNumber(stockKeyStats.grossProfit);
        this.companyCash = this.formatLongNumber(stockKeyStats.cash);
        this.companyDebt = this.formatLongNumber(stockKeyStats.debt);
        this.stockKeyStatsRetrieved = true;
      });
    });
  }

  formatLongNumber(x: number): string {
    if (x > 1000000000) { // Billions
      return (x / 1000000000).toFixed(2) + 'B';
    } else if (x > 1000000) { // Millions
      return (x / 1000000).toFixed(2) + 'M';
    } else {
      return x.toLocaleString();
    }
  }

}
