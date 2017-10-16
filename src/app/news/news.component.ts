import {Component, OnInit} from '@angular/core';
import {FormControl} from '@angular/forms';
import {Observable} from 'rxjs/Observable';
import {MarketService} from '../services/market.service';
import 'rxjs/add/operator/startWith';
import 'rxjs/add/operator/map';
import {NewsCard} from '../services/news.card';
import {isUndefined} from 'util';

@Component({
  selector: 'app-news',
  templateUrl: './news.component.html',
  styleUrls: ['./news.component.css']
})
export class NewsComponent implements OnInit {
  numberOfSuggestedCompanies = 5;
  numberOfNewsCardsInChunk = 10;
  maxNumberOfNewsCards = 50;
  backToLatestNewsPossible: boolean;
  loadMoreNewsPossible: boolean;
  companyNames: string[];
  currentNewsCards: NewsCard[];
  newsCards: NewsCard[];
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

    // Initiate newsCard to create news cards
    const latestMarketNews: Observable<NewsCard[]> = this.marketService.getLatestMarketNews();
    this.setupNewsCards(latestMarketNews);

    // Setup loading more news logic
    this.loadMoreNewsPossible = true;

    // Setup back to latest news logic
    this.backToLatestNewsPossible = false;
  }

  ngOnInit() {
    this.filteredCompanyNames = this.searchControl.valueChanges
      .startWith(null)
      .map(val => val ? this.filter(val) : []);
  }

  loadMoreNewsCards() {
    const upperBound = this.currentNewsCards.length + this.numberOfNewsCardsInChunk;
    for (let i = this.currentNewsCards.length; i < upperBound; i++) {
      this.currentNewsCards.push(this.newsCards[i]);
    }
    if (this.currentNewsCards.length === this.maxNumberOfNewsCards) {
      this.loadMoreNewsPossible = false;
    }
  }

  latestNews() {
    // Initiate newsCard to create news cards
    const latestMarketNews: Observable<NewsCard[]> = this.marketService.getLatestMarketNews();
    this.setupNewsCards(latestMarketNews);
    this.backToLatestNewsPossible = false;
    this.searchControl.setValue('');
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
      return;
    }

    const companyNews: Observable<NewsCard[]> = this.marketService.getCompanyNews(companySymbol);
    this.setupNewsCards(companyNews);
    this.backToLatestNewsPossible = true;
  }

  private setupNewsCards(news: Observable<NewsCard[]>) {
    this.currentNewsCards = [];
    this.newsCards = null;
    news.subscribe(newsCards => {
      if (newsCards.length === 0) {
        this.loadMoreNewsPossible = false;
      } else {
        this.loadMoreNewsPossible = true;
      }
      this.newsCards = newsCards;
      this.currentNewsCards = this.newsCards.slice(
        this.currentNewsCards.length,
        this.currentNewsCards.length + this.numberOfNewsCardsInChunk);
    });
  }

  private filter(val: string): string[] {
    return this.companyNames.filter(option =>
      option.toLowerCase().indexOf(val.toLowerCase()) === 0).slice(0, this.numberOfSuggestedCompanies);
  }

}
