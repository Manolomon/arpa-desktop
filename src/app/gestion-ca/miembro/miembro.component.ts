import { Component, OnInit, Input } from '@angular/core';
import { MiembroService } from '../../servicios/miembro.service';
import { Miembro } from 'src/app/models/MiembroInterface'
import { FormGroup, FormControl, Validators, Form } from '@angular/forms';

@Component({
  selector: 'app-miembro',
  templateUrl: './miembro.component.html',
  styleUrls: ['./miembro.component.scss']
})
export class MiembroComponent implements OnInit {

  @Input() private integrante: Miembro;
  @Input() private esMiembro : boolean;
  @Input() private agregando : boolean;
  private nombreNuevo : string;
  private nombreCorreo : string;
  private minLengthChar : number;
  
  constructor() {
    this.minLengthChar = 2;
  }

  ngOnInit() {
    console.log("Es miembro: " + this.esMiembro);
  }

  public confirmarCambio() {
    console.log("Switch a punto de cambiar");
  }

}
