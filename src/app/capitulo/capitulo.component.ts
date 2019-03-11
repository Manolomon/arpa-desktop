import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-capitulo',
  templateUrl: './capitulo.component.html',
  styleUrls: ['./capitulo.component.scss']
})
export class CapituloComponent implements OnInit {

  constructor() { }

  ngOnInit() {
  }

  public listItems: Array<string> = ['Baseball', 'Basketball', 'Cricket', 'Field Hockey', 'Football', 'Table Tennis', 'Tennis', 'Volleyball'];
  public value: any = ['Baseball']
}
