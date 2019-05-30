import { Component, OnInit } from "@angular/core";
import { ProductoService } from "../servicios/productos.service";
import { MiembroService } from '../servicios/miembro.service';
import { NotifierService } from "angular-notifier";
import { LoginService } from '../servicios/login.service';
import { Router } from '@angular/router';
import { DialogoComponent } from '../dialogo/dialogo.component';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA, MatDatepickerInputEvent } from '@angular/material';
import { ProyectoService } from '../servicios/proyecto.service';


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
    public dialog: MatDialog,
    private proyectoService: ProyectoService,
  ) {
    this.camposHabilitados = false;
    this.eliminaProducto = false;
    this.agregaProducto = false;
  }

  public ngOnInit() {
    this.productos = [];
    var docRefs: Array<any> = [];
    this.productoService.obtenerProductosMiembro(this.miembroService.getMiembroActivo()).then(function (querySnapshot) {
      querySnapshot.forEach(function (doc) {
        var documento = doc.data();
        documento.id = doc.id;
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
    this.camposHabilitados = !this.camposHabilitados;
  }

  async eliminarProducto(i: number) {
    var resultado: boolean;
    const dialogRef = this.dialog.open(DialogoComponent, {
      width: '400px',
      disableClose: true,
      data: {
        mensaje: "¿Desea eliminar este proyecto?",
        dobleBoton: true
      }
    });
    dialogRef.afterClosed().subscribe(result => {
      resultado = result;
      if (result) {
        this.productoService.eliminarProducto(this.productos[i].id)
          .then(async () => {
            var proyectosAux: Array<any> = [];
            await this.proyectoService.obtenerProyectos()
              .then((querySnapshot) => {
                querySnapshot.forEach(function (doc) {
                  var documento = doc.data();
                  documento.id = doc.id;
                  proyectosAux.push(documento);
                });
              });
            var proyectos: Array<any> = proyectosAux;
            for (let proyecto of proyectos) {
              var productosProyecto: any[] = proyecto.productos;
              proyecto.productos = [];
              for (let producto of productosProyecto) {
                if (producto.id != this.productos[i].id) {
                  proyecto.productos.push(producto);
                }
              }
              await this.proyectoService.modificarProyecto(proyecto);
            }
            this.ngOnInit();
          });
      }
    });
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
    this.ngOnInit();
  }

  public edicionCancelada(editar: boolean) {
    this.camposHabilitados = false;
  }

}
