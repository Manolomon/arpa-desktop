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
  //MatMomentDateModule,
  MatFormFieldModule,
  MatCardModule,
  MatExpansionModule
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
    //MatMomentDateModule,
    MatFormFieldModule,
    MatCardModule,
    MatExpansionModule
  ]
})
export class MaterialModule {}