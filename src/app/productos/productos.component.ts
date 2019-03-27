import { Component, OnInit } from '@angular/core';
import { ProductoService } from '../servicios/productos.service';

import { NotifierService } from 'angular-notifier';

@Component({
  selector: 'app-productos',
  templateUrl: './productos.component.html',
  styleUrls: ['./productos.component.scss']
})
export class ProductosComponent implements OnInit {

  private notifier: NotifierService;

  constructor(public productoService: ProductoService, notifier: NotifierService) {
    this.notifier = notifier;
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

  public showNotification(event): void{
    this.notifier.notify( 'warning', 'You are awesome! I mean it!' );
  }

}
