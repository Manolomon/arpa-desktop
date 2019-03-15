import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AngularFireModule } from '@angular/fire';
import { AngularFirestoreModule } from '@angular/fire/firestore';
import { environment } from '../environments/environment';
import { ProductoService } from './servicios/productos.service';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { InputsModule } from '@progress/kendo-angular-inputs';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { CapituloComponent } from './capitulo/capitulo.component';
import { DropDownsModule } from '@progress/kendo-angular-dropdowns';
import { FormsModule } from '@angular/forms';
import { UploadModule } from '@progress/kendo-angular-upload';
import { HttpClientModule } from '@angular/common/http';
import { ProductosComponent } from './productos/productos.component';

import {
  MatSidenavModule, MatToolbarModule, MatButtonModule, MatIconModule,
  MatCardModule, MatMenuModule, MatTooltipModule,
  MatDialogModule, MatChipsModule, MatAutocompleteModule, MatFormFieldModule,
  MatInputModule, MatSnackBarModule, MatSlideToggleModule, MatExpansionModule
} from '@angular/material';
import { LibroComponent } from './libro/libro.component';
import { ArticuloComponent } from './articulo/articulo.component';
import { MemoriaComponent } from './memoria/memoria.component';
import { DateInputsModule } from '@progress/kendo-angular-dateinputs';


@NgModule({
  declarations: [
    AppComponent,
    CapituloComponent,
    ProductosComponent,
    LibroComponent,
    ArticuloComponent,
    MemoriaComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    AngularFireModule.initializeApp(environment.firebaseConfig),
    AngularFirestoreModule,
    FormsModule,
    InputsModule,
    BrowserAnimationsModule,
    DropDownsModule,
    UploadModule,
    HttpClientModule,
    MatSidenavModule,
    MatToolbarModule,
    MatButtonModule,
    MatIconModule,
    MatCardModule,
    MatMenuModule,
    MatTooltipModule,
    MatDialogModule,
    MatChipsModule,
    MatAutocompleteModule,
    MatFormFieldModule,
    MatInputModule,
    MatSnackBarModule,
    MatExpansionModule,
    MatSlideToggleModule,
    DateInputsModule
  ],
  providers: [ProductoService],
  bootstrap: [AppComponent]
})
export class AppModule { }
