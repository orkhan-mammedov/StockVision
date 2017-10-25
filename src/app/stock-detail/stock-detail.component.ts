import {Component, OnInit, ViewChild} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {Observable} from 'rxjs/Observable';
import {CompanyDetails} from '../services/company.details.response';
import {MarketService} from '../services/market.service';
import {StockQuote} from '../services/stock.quote.response';
import {StockKeyStats} from '../services/stock.key.stats.response';
import {CompanyLogo} from '../services/company.logo.response';
import {StockChartPoint} from '../services/stock.chart.point.response';
import {BaseChartDirective} from 'ng2-charts';
import {MatButton} from '@angular/material';
import {isUndefined} from 'util';

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

  // Chart switches
  // TODO: Consider better approach
  @ViewChild('5Y')
  chart5YSwitch: MatButton;
  @ViewChild('2Y')
  chart2YSwitch: MatButton;
  @ViewChild('1Y')
  chart1YSwitch: MatButton;
  @ViewChild('6M')
  chart6MSwitch: MatButton;
  @ViewChild('1M')
  chart1MSwitch: MatButton;
  @ViewChild('1D')
  chart1DSwitch: MatButton;
  currentChartSwitch: MatButton;
  currentChartSwitchName: string;

  // Chart
  @ViewChild(BaseChartDirective)
  chart: BaseChartDirective;
  stockPrices: Array<any>;
  stockTimeLabels: Array<any>;
  lineChartOptions: any = {
    legend: {
      display: false
    },
  };
  lineChartType = 'line';

  constructor(private route: ActivatedRoute, private marketService: MarketService) {
    this.companyDetailsRetrieved = false;
    this.stockQuoteRetrieved = false;
    this.stockKeyStatsRetrieved = false;
    this.stockFound = true;

    // Stock chart setup
    this.stockPrices = [{data: []}];
    this.stockTimeLabels = [];
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

      // Stock Chart
      const stockChartPointsObservable: Observable<StockChartPoint[]> = this.marketService.getStockChartPoints(this.companySymbol, '1d');
      stockChartPointsObservable.subscribe(stockChartPoints => {
        this.processStockChartPoints(stockChartPoints);
      });
    });
  }

  private processStockChartPoints(stockChartPoints) {
    const stockChartPointsFiltered = stockChartPoints.filter(stockChartPoint => stockChartPoint.average > 0);
    const stockPricesArray = stockChartPointsFiltered.map(stockChartPoint => stockChartPoint.average);
    const stockTimePeriodsArray = stockChartPointsFiltered.map(stockChartPoint => stockChartPoint.minute);

    // Clear existing data points
    this.stockPrices[0].data.splice(0, this.stockPrices[0].data.length);
    this.stockTimeLabels.splice(0, this.stockTimeLabels.length);

    // Push new data points
    for (let i = 0; i < stockPricesArray.length; i = i + 1) {
      this.stockPrices[0].data.push(stockPricesArray[i]);
      this.stockTimeLabels.push(stockTimePeriodsArray[i]);
    }
    this.chart.chart.update();
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

  stockTimePeriodChanged(chartSwitchName: string): void {
    if (chartSwitchName === this.currentChartSwitchName) {
      return;
    }

    if (!isUndefined(this.currentChartSwitch)) {
      this.currentChartSwitch.color = 'accent';
    } else { // entered only once on the first switch
      this.chart1DSwitch.color = 'accent';
    }

    if (chartSwitchName === '1D') {
      this.currentChartSwitch = this.chart1DSwitch;
      this.currentChartSwitchName = '1D';
    } else if (chartSwitchName === '1M') {
      this.currentChartSwitch = this.chart1MSwitch;
      this.currentChartSwitchName = '1M';
    } else if (chartSwitchName === '6M') {
      this.currentChartSwitch = this.chart6MSwitch;
      this.currentChartSwitchName = '6M';
    } else if (chartSwitchName === '1Y') {
      this.currentChartSwitch = this.chart1YSwitch;
      this.currentChartSwitchName = '1Y';
    } else if (chartSwitchName === '2Y') {
      this.currentChartSwitch = this.chart2YSwitch;
      this.currentChartSwitchName = '2Y';
    } else if (chartSwitchName === '5Y') {
      this.currentChartSwitch = this.chart5YSwitch;
      this.currentChartSwitchName = '5Y';
    }
    this.currentChartSwitch.color = 'primary';

    const stockChartPointsObservable: Observable<StockChartPoint[]> =
      this.marketService.getStockChartPoints(this.companySymbol, this.currentChartSwitchName);
    stockChartPointsObservable.subscribe(stockChartPoints => {
      this.processStockChartPoints(stockChartPoints);
    });
  }

  // events
  public chartClicked(e: any): void {
    console.log(e);
  }

  public chartHovered(e: any): void {
    console.log(e);
  }
}
