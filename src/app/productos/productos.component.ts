import { Component, OnInit, Output, EventEmitter } from "@angular/core";
import { ProductoService } from "../servicios/productos.service";

import { NotifierService } from "angular-notifier";

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
    private notifier: NotifierService
  ) {
    this.camposHabilitados = false;
    this.eliminaProducto = false;
    this.agregaProducto = false;
  }

  public ngOnInit() {
    console.log("Inicio de gestionar productos");
    this.productoService.obtenerProductos().subscribe(datos => {
      this.productos = [];
      console.log(datos);
      for (let i = 0; i < datos.length; i++) {
        let temporal = datos[i].payload.doc.data();
        this.productos.push(temporal);
        this.productos[i].id = datos[i].payload.doc.id;
      }
      console.log(this.productos);
    });
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

  public eliminarProducto(i: number) {
    console.log("Eliminando producto..." + this.productos[i].id);
    if (confirm("Desea borrar este producto de la base de datos?")) {
      console.log("Implement delete functionality here");
      this.productoService.eliminarProducto(this.productos[i].id);
    }
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
  }

}
