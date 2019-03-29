import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { ProductoService } from '../servicios/productos.service';

import { NotifierService } from 'angular-notifier';

@Component({
  selector: 'app-productos',
  templateUrl: './productos.component.html',
  styleUrls: ['./productos.component.scss']
})
export class ProductosComponent implements OnInit {

  private notifier: NotifierService;
  public camposHabilitados: boolean;
  constructor(public productoService: ProductoService, notifier: NotifierService) {
    this.notifier = notifier;
    this.camposHabilitados = false;
  }

  productos: Array<any> = []

  ngOnInit() {
    console.log("Inicio de gestionar productos");
    this.productoService.obtenerProductos().subscribe(datos => {
      this.productos = [];
      console.log(datos);
      for (let i = 0; i < datos.length; i++) {
        let temporal = (datos[i].payload.doc.data());
        this.productos.push(temporal);
        this.productos[i].id = datos[i].payload.doc.id;
      }
      console.log(this.productos);
    })
  }

  public showNotification(event): void {
    this.notifier.notify('info', 'Mensaje de información complementaria');
    this.notifier.notify('success', 'Mensaje de éxito, sí se pudo');
    this.notifier.notify('warning', 'Mensaje de advertencia algo raro pasó');
    this.notifier.notify('error', 'Mensaje de error, algo salió mal');
  }

  public habilitarCampos() {
    console.log("Habilitando campos...");
    this.camposHabilitados = !this.camposHabilitados;
  }

}
