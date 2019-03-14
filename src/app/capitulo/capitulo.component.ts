import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { ProductoService } from '../servicios/productos.service';

@Component({
  selector: 'app-capitulo',
  templateUrl: './capitulo.component.html',
  styleUrls: ['/capitulo.component.scss']
})
export class CapituloComponent implements OnInit {

  //Input() capituloL: any;
  public tituloLibro: String;
  capitulo: any;

  constructor(public productoService: ProductoService) { 
    this.data = this.source.slice();
  }

  ngOnInit() {
    /*this.productoService.obtenerProducto('JWH08mF6WvFXv9RdFb8l').subscribe(datos =>{
      //console.log(datos.payload.data());
      this.capitulo = datos.payload.data();
      this.capitulo.id = datos.payload.id;
      //console.log(this.capitulo.titulo);
      //console.log(this.capitulo.id);
      this.tituloLibro = this.capitulo.titulo;
    })*/
    if (this.capitulo != null) {
       
    }
  }

  public source: Array<string> = ['Albania', 'Andorra', 'Armenia', 'Austria', 'Azerbaijan'];
    public data: Array<string>;
    public listItems: Array<string> = [
      'Baseball', 'Basketball', 'Ingeniería de las Tecnologías de Software', 'Field Hockey',
      'Football', 'Table Tennis', 'Tennis', 'Volleyball'
  ];

  public value = ['Basketball', 'Cricket'];

  public valueChange(value: any): void {
      console.log('valueChange', value);
  }

  public filterChange(filter: any): void {
      
      this.data = this.source.filter((s) => s.toLowerCase().indexOf(filter.toLowerCase()) !== -1);
  }

  public open(): void {
      console.log('open');
  }

  public close(): void {
      console.log('close');
  }

  public focus(): void {
      console.log('focus');
  }

  public blur(): void {
      console.log('blur');
  }

  uploadSaveUrl = 'saveUrl'; // should represent an actual API endpoint
  uploadRemoveUrl = 'removeUrl'; // should represent an actual API endpoint

}
