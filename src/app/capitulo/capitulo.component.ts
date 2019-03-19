import { Component, OnInit } from "@angular/core";
import { FormControl } from "@angular/forms";

@Component({
  selector: "app-capitulo",
  templateUrl: "./capitulo.component.html",
  styleUrls: ["./capitulo.component.scss"]
})
export class CapituloComponent implements OnInit {
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
