import { BrowserModule } from "@angular/platform-browser";
import { NgModule } from "@angular/core";

import { AppRoutingModule } from "./app-routing.module";
import { AppComponent } from "./app.component";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { HttpClientModule } from "@angular/common/http";

import { AngularFireModule } from "@angular/fire";
import { AngularFirestoreModule } from "@angular/fire/firestore";

import { MaterialModule } from "./material-module";
import { FlexLayoutModule } from "@angular/flex-layout";
import { NotifierModule, NotifierOptions } from "angular-notifier";

import { environment } from "../environments/environment";
import { ProductosComponent } from "./productos/productos.component";
import { ArticuloComponent } from "./articulo/articulo.component";
import { CapituloComponent } from "./capitulo/capitulo.component";
import { LibroComponent } from "./libro/libro.component";
import { MemoriaComponent } from "./memoria/memoria.component";
import { TesisComponent } from "./tesis/tesis.component";

import { ProductoService } from "./servicios/productos.service";
import { ProduccionComponent } from "./produccion/produccion.component";

const customNotifierOptions: NotifierOptions = {
  position: {
    horizontal: {
      position: "left",
      distance: 12
    },
    vertical: {
      position: "bottom",
      distance: 12,
      gap: 10
    }
  },
  theme: "material",
  behaviour: {
    autoHide: 5000,
    onClick: "hide",
    onMouseover: "pauseAutoHide",
    showDismissButton: true,
    stacking: 4
  },
  animations: {
    enabled: true,
    show: {
      preset: "slide",
      speed: 300,
      easing: "ease"
    },
    hide: {
      preset: "fade",
      speed: 300,
      easing: "ease",
      offset: 50
    },
    shift: {
      speed: 300,
      easing: "ease"
    },
    overlap: 150
  }
};

@NgModule({
  declarations: [
    AppComponent,
    CapituloComponent,
    ProductosComponent,
    LibroComponent,
    ArticuloComponent,
    MemoriaComponent,
    TesisComponent,
    ProduccionComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    AngularFireModule.initializeApp(environment.firebaseConfig),
    AngularFirestoreModule,
    FormsModule,
    ReactiveFormsModule,
    FlexLayoutModule,
    BrowserAnimationsModule,
    HttpClientModule,
    MaterialModule,
    NotifierModule.withConfig(customNotifierOptions)
  ],
  providers: [ProductoService],
  bootstrap: [AppComponent]
})
export class AppModule {}
