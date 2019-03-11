import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-capitulo',
  templateUrl: './capitulo.component.html',
  styleUrls: ['/capitulo.component.scss']
})
export class CapituloComponent implements OnInit {

  constructor() { 
    this.data = this.source.slice();
  }

  ngOnInit() {
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
