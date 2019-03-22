import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { ProductoService } from '../servicios/productos.service';

@Component({
  selector: 'app-memoria',
  templateUrl: './memoria.component.html',
  styleUrls: ['./memoria.component.scss']
})
export class MemoriaComponent implements OnInit {
  
  date  =  new  FormControl(new  Date());

  evidencia: string = "Evidencia";
  toppings = new FormControl();
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
