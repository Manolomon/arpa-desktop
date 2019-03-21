import { Component, OnInit } from "@angular/core";
import { FormControl } from "@angular/forms";
import { ProductoService } from '../servicios/productos.service';

@Component({
  selector: 'app-articulo',
  templateUrl: './articulo.component.html',
  styleUrls: ['./articulo.component.scss']
})
export class ArticuloComponent implements OnInit {

  evidencia: string = "Evidencia";
  toppings = new FormControl();
  selected = 'default';
  toppingList: string[] = [
    "Extra cheese",
    "Mushroom",
    "Onion",
    "Pepperoni",
    "Sausage",
    "Tomato"
  ];

  constructor() {}

  ngOnInit() {}

}
