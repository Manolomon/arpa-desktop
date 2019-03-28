import { NgModule } from '@angular/core';
import {
  MatInputModule,
  MatIconModule,
  MatButtonModule,
  MatDividerModule,
  MatAutocompleteModule,
  MatSelectModule,
  MatChipsModule,
  MatToolbarModule,
  MatCheckboxModule,
  MatDatepickerModule,
  MatNativeDateModule, 
  MatTooltipModule,
  MatFormFieldModule,
  MatCardModule,
  MatExpansionModule,
  MatProgressSpinnerModule
} from '@angular/material';

@NgModule({
  exports: [
    MatInputModule,
    MatIconModule,
    MatButtonModule,
    MatDividerModule,
    MatAutocompleteModule,
    MatSelectModule,
    MatChipsModule,
    MatToolbarModule,
    MatCheckboxModule,
    MatDatepickerModule,
    MatNativeDateModule, 
    MatTooltipModule,
    MatFormFieldModule,
    MatCardModule,
    MatExpansionModule,
    MatProgressSpinnerModule
  ]
})
export class MaterialModule {}