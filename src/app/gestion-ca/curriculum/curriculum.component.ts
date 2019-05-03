import { Component, Input, ViewChild, ElementRef } from '@angular/core';
import * as jsPDF from 'jspdf';

@Component({
  selector: 'app-curriculum',
  templateUrl: './curriculum.component.html',
  styleUrls: ['./curriculum.component.scss']
})
export class CurriculumComponent {

  @Input() data: any;
  @ViewChild('content') content: ElementRef;

  constructor(private elRef:ElementRef){}

  public printLPM(){
    let content = this.content.nativeElement;
    console.log("Desde aquí está mejor LPM: " + document.getElementById('content').innerHTML);

    console.log(this.data);
  }

  ngAfterViewInit() {
    var div = this.elRef.nativeElement.querySelector('div');
    const doc = new jsPDF();
    doc.fromHTML(div.innerHTML, 10, 10, {
      'width': 190,
    })
    doc.save('cv.pdf')  
  }

  // for transcluded content
  ngAfterContentInit() {
  }
}
