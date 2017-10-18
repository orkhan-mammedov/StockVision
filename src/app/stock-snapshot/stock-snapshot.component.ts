import {Component, Input, OnInit} from '@angular/core';

@Component({
  selector: 'app-stock-snapshot',
  templateUrl: './stock-snapshot.component.html',
  styleUrls: ['./stock-snapshot.component.css']
})
export class StockSnapshotComponent implements OnInit {
  @Input() companyName: string;
  @Input() companySymbol: string;
  @Input() stockPriceChange: number;
  @Input() stockPrice: number;
  @Input() marketCapitalization: number;
  @Input() week52high: number;
  @Input() week52low: number;

  constructor() {  }

  ngOnInit() {
  }

}
