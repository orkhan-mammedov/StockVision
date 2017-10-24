import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  MatToolbarModule, MatButtonModule, MatCheckboxModule, MatAutocompleteModule,
  MatInputModule, MatCardModule, MatChipsModule, MatIconModule, MatProgressSpinnerModule, MatTabsModule,
  MatFormFieldModule
} from '@angular/material';


@NgModule({
  imports: [
    CommonModule,
    MatButtonModule,
    MatCheckboxModule,
    MatToolbarModule,
    MatAutocompleteModule,
    MatInputModule,
    MatCardModule,
    MatChipsModule,
    MatIconModule,
    MatProgressSpinnerModule,
    MatTabsModule,
    MatFormFieldModule,
  ],
  exports: [
    MatButtonModule,
    MatCheckboxModule,
    MatToolbarModule,
    MatAutocompleteModule,
    MatInputModule,
    MatCardModule,
    MatChipsModule,
    MatIconModule,
    MatProgressSpinnerModule,
    MatTabsModule,
    MatFormFieldModule,
  ],
  declarations: []
})
export class MaterialModule { }
