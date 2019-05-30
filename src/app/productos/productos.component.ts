import { Component, OnInit } from "@angular/core";
import { ProductoService } from "../servicios/productos.service";
import { MiembroService } from '../servicios/miembro.service';
import { NotifierService } from "angular-notifier";
import { LoginService } from '../servicios/login.service';
import { Router } from '@angular/router';

@Component({
  selector: "app-productos",
  templateUrl: "./productos.component.html",
  styleUrls: ["./productos.component.scss"]
})
export class ProductosComponent implements OnInit {
  private camposHabilitados: boolean;
  private eliminaProducto: boolean;
  private productos: Array<any> = [];
  private indexExpanded: number = -1;
  private tipoProducto: string;
  private agregaProducto: boolean;

  constructor(
    private productoService: ProductoService,
    private miembroService: MiembroService,
    private notifier: NotifierService,
    private loginServicio: LoginService,
    private router: Router,
  ) {
    this.camposHabilitados = false;
    this.eliminaProducto = false;
    this.agregaProducto = false;
  }

  public ngOnInit() {
    console.log("Inicio de gestionar productos");
    this.productos = [];
    var docRefs: Array<any> = [];
    console.log(this.miembroService.getMiembroActivo());
    this.productoService.obtenerProductosMiembro(this.miembroService.getMiembroActivo()).then(function(querySnapshot) {
      querySnapshot.forEach(function(doc) {
        console.log(doc);
        var documento = doc.data();
        documento.id = doc.id;
        console.log(documento);
        docRefs.push(documento);
      });
    });
    this.productos = docRefs;
    this.camposHabilitados = false;
    this.eliminaProducto = false;
    this.agregaProducto = false;
    this.togglePanels(-1);
  }

  public showNotification(event): void {
    /*this.notifier.notify("info", "Mensaje de información complementaria");
    this.notifier.notify("success", "Mensaje de éxito, sí se pudo");
    this.notifier.notify("warning", "Mensaje de advertencia algo raro pasó");
    this.notifier.notify("error", "Mensaje de error, algo salió mal");*/
  }

  public habilitarCampos() {
    console.log("Habilitando campos...");
    this.camposHabilitados = !this.camposHabilitados;
  }

  async eliminarProducto(i: number) {
    console.log("Eliminando producto..." + this.productos[i].id);
    if (confirm("¿Desea borrar este producto de la base de datos?")) {
      await this.productoService.eliminarProducto(this.productos[i].id);
      this.notifier.notify("success", "Producto eliminado correctamente");
    }
    this.ngOnInit();
  }

  togglePanels(index: number) {
    this.indexExpanded = index == this.indexExpanded ? -1 : index;
  }

  public agregarProducto(tipo: string) {
    this.tipoProducto = tipo;
    this.agregaProducto = true;
  }

  public creacionCancelada(cancelado: boolean) {
    this.agregaProducto = !this.agregaProducto;
    this.ngOnInit();
  }

  public cargarProductos(cargar: boolean) {
    console.log("cargando productos");
    this.ngOnInit();
  }

  public edicionCancelada(editar: boolean) {
    this.camposHabilitados = false;
  }

}
