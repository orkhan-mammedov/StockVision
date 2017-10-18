import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { StockSnapshotComponent } from './stock-snapshot.component';

describe('StockSnapshotComponent', () => {
  let component: StockSnapshotComponent;
  let fixture: ComponentFixture<StockSnapshotComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ StockSnapshotComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(StockSnapshotComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
