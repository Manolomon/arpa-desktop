import { Component, OnInit } from '@angular/core';
import { ProductoService } from '../servicios/productos.service';

@Component({
  selector: 'app-productos',
  templateUrl: './productos.component.html',
  styleUrls: ['./productos.component.scss']
})
export class ProductosComponent implements OnInit {

  constructor(public productoService: ProductoService) { }

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

}
