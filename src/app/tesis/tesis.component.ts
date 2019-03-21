import { Component, OnInit } from '@angular/core';
import { FormControl } from "@angular/forms";

@Component({
  selector: 'app-tesis',
  templateUrl: './tesis.component.html',
  styleUrls: ['./tesis.component.scss']
})
export class TesisComponent implements OnInit {

  date  =  new  FormControl(new  Date());

  selected = 'licenciatura';
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
