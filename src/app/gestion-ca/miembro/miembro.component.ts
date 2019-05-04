import { Component, OnInit, Input } from '@angular/core';
import { MiembroService } from '../../servicios/miembro.service';
import { Miembro } from 'src/app/models/MiembroInterface'
import { FormGroup, FormControl, Validators, Form } from '@angular/forms';
import { DialogoComponent } from 'src/app/dialogo/dialogo.component';
import { MatDialog } from '@angular/material';

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
  private correoNuevo : string;
  private minLengthChar : number;
  private passGenerada : string;
  private resultadoDialog: boolean;
  
  constructor(
    private miembroService: MiembroService,
    public dialog: MatDialog
  ) {
    this.minLengthChar = 2;
  }

  ngOnInit() {
    console.log("Es miembro: " + this.esMiembro);
  }

  public confirmarCambio() {
    console.log("Switch a punto de cambiar");
  }

  public registrarIntegrante() {
    var rol: string;
    if (this.esMiembro) {
      rol = "Miembro";
    } else {
      rol = "Colaborador";
    }
    this.passGenerada = this.miembroService.registrarMiembro(this.nombreNuevo,this.correoNuevo,rol);
    if (rol == "Miembro") {
      console.log("Deberia abrir un dialogo");
      const dialogRef = this.dialog.open(DialogoComponent, {
        data: { mensaje: "La contraseña generada para el miembro es la siguiente: " + this.passGenerada, resultado: this.resultadoDialog, dobleBoton: false}
      });
    }
    console.log("La pass generada es: " + this.passGenerada);
  }

}
