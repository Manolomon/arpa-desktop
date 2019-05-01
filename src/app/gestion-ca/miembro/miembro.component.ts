import { Component, OnInit, Input } from '@angular/core';
import { MiembroService } from '../../servicios/miembro.service';
import { Miembro } from 'src/app/models/MiembroInterface'

@Component({
  selector: 'app-miembro',
  templateUrl: './miembro.component.html',
  styleUrls: ['./miembro.component.scss']
})
export class MiembroComponent implements OnInit {

  @Input() private integrante: Miembro;
  
  constructor() { }

  ngOnInit() {
  }

}
