import { Component, OnInit } from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {Observable} from 'rxjs/Observable';
import {CompanyDetails} from '../services/company.details.response';
import {MarketService} from '../services/market.service';
import {StockQuote} from '../services/stock.quote.response';
import {StockKeyStats} from '../services/stock.key.stats.response';

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
  stockPrice: number;
  stockPriceChange: number;
  stockPriceChangePercentage: number;
  marketCapitalization: number;
  week52high: number;
  week52low: number;
  stockDividendYield: number;
  companyRevenue: number;
  companyGrossProfit: number;
  companyCash: number;
  companyDebt: number;

  companyDetailsRetrieved: boolean;
  stockQuoteRetrieved: boolean;
  stockKeyStatsRetrieved: boolean;

  constructor(private route: ActivatedRoute, private marketService: MarketService) {
    this.companyDetailsRetrieved = false;
    this.stockQuoteRetrieved = false;
    this.stockKeyStatsRetrieved = false;
  }

  ngOnInit() {
    this.route.params.subscribe(params => {
      this.companySymbol = params['id'];

      const companyDetailsObservable: Observable<CompanyDetails> = this.marketService.getCompanyDetails(this.companySymbol);
      companyDetailsObservable.subscribe(companyDetails => {
        this.companyName = companyDetails.companyName;
        this.companyDescription = companyDetails.description;
        this.companyCEO = companyDetails.CEO;
        this.companyIndustry = companyDetails.industry;
        this.companySector = companyDetails.sector;
        this.companyWebsite = companyDetails.website;
        this.companyDetailsRetrieved = true;
      });

      const stockQuoteObservable: Observable<StockQuote> = this.marketService.getStockQuote(this.companySymbol);
      stockQuoteObservable.subscribe(stockQuote => {
        this.stockPrice = stockQuote.latestPrice; // TODO: Could use calculated price, but it is blank when markets close
        this.stockPriceChange = stockQuote.change;
        this.week52high = stockQuote.week52High;
        this.week52low = stockQuote.week52Low;
        this.stockQuoteRetrieved = true;
      });

      const stockKeyStatsObservable: Observable<StockKeyStats> = this.marketService.getStockKeyStats(this.companySymbol);
      stockKeyStatsObservable.subscribe(stockKeyStats => {
        this.stockDividendYield = stockKeyStats.dividendYield;
        this.marketCapitalization = stockKeyStats.marketCap;
        this.companyRevenue = stockKeyStats.revenue;
        this.companyGrossProfit = stockKeyStats.grossProfit;
        this.companyCash = stockKeyStats.cash;
        this.companyDebt = stockKeyStats.debt;
        this.stockKeyStatsRetrieved = true;
      });
    });
  }

  backToStocks() {
    // TODO: Implement
  }

}
