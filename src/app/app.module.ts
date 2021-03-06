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
import { ArticuloComponent } from "./productos/articulo/articulo.component";
import { CapituloComponent } from "./productos/capitulo/capitulo.component";
import { LibroComponent } from "./productos/libro/libro.component";
import { MemoriaComponent } from "./productos/memoria/memoria.component";
import { TesisComponent } from "./productos/tesis/tesis.component";
import { ProduccionComponent } from "./productos/produccion/produccion.component";
import { ProyectosComponent } from "./proyectos/proyectos.component";

import { ProductoService } from "./servicios/productos.service";
import { LoginComponent } from './login/login.component';
import { AngularFireAuth } from '@angular/fire/auth';
import { RouterModule } from '@angular/router';
import { GestionCaComponent, DialogCurriculum } from './gestion-ca/gestion-ca.component';
import { MenuComponent } from './menu/menu.component';
import { MiembroComponent } from './gestion-ca/miembro/miembro.component';
import { ProyectoComponent } from './proyectos/proyecto/proyecto.component';
import { DialogoComponent } from './dialogo/dialogo.component';
import { CuentaComponent } from './cuenta/cuenta.component';
import { EstudioComponent } from './cuenta/estudio/estudio.component';
import { ColaboradorComponent } from './productos/colaborador/colaborador.component';


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
    ProduccionComponent,
    LoginComponent,
    ProyectosComponent,
    GestionCaComponent,
    MenuComponent,
    MiembroComponent,
    ProyectoComponent,
    DialogoComponent,
    DialogCurriculum,
    CuentaComponent,
    EstudioComponent,
    ColaboradorComponent,
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
    NotifierModule.withConfig(customNotifierOptions),
    RouterModule.forRoot([
      { path: 'login', component: LoginComponent },
      { path: 'productos', component: ProductosComponent },
      { path: 'proyectos', component: ProyectosComponent },
      { path: 'menu', component: MenuComponent },
    ])
  ],
  providers: [ProductoService,
    AngularFireAuth,
  ],
  bootstrap: [AppComponent],
  entryComponents: [
    DialogoComponent,
    DialogCurriculum,
    EstudioComponent,
    ColaboradorComponent,
  ]
})
export class AppModule { }
