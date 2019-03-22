import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';

@Component({
  selector: 'app-patente',
  templateUrl: './patente.component.html',
  styleUrls: ['./patente.component.scss']
})
export class PatenteComponent implements OnInit {

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
