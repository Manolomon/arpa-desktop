import { Component, OnInit, Input } from '@angular/core';
import { MiembroService } from '../../servicios/miembro.service';
import { Miembro } from 'src/app/models/MiembroInterface'
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { DialogoComponent } from 'src/app/dialogo/dialogo.component';
import { MatDialog } from '@angular/material';


@Component({
  selector: 'app-miembro',
  templateUrl: './miembro.component.html',
  styleUrls: ['./miembro.component.scss']
})
export class MiembroComponent implements OnInit {

  @Input() private integrante: Miembro;
  @Input() private esMiembro: boolean;
  @Input() private agregando: boolean;
  @Input() private esCoordinador: boolean;
  private nombreNuevo: string;
  private correoNuevo: string;
  private minLengthChar: number;
  private passGenerada: string;
  private resultadoDialog: boolean;
  private miembroForm: FormGroup;

  constructor(
    private miembroService: MiembroService,
    public dialog: MatDialog
  ) { }

  ngOnInit() {
    console.log("Es miembro: " + this.esMiembro);
    this.miembroForm = new FormGroup({
      nombreControl: new FormControl('', [Validators.required, Validators.minLength(2)]),
      correoControl: new FormControl('', [Validators.required, Validators.minLength(2)]),
    });
    if (this.integrante.rol == "Coordinador") {
      this.esCoordinador = true;
    } else {
      this.esCoordinador = false;
    }
    console.log("Es coordinador: " + this.esCoordinador);
  }

  private degradarMiembro() {
    console.log("Degradar miembro inicio");
    const dialogRef = this.dialog.open(DialogoComponent, {
      width: '400px',
      disableClose: true,
      data: {
        mensaje: "Cambiar a este miembro le bloqueará el acceso al sistema, pero no perderá sus productos académicos. ¿Está seguro de hacer este cambio?",
        resultado: this.resultadoDialog,
        dobleBoton: true
      }
    });
    dialogRef.afterClosed().subscribe(result => {
      if (!result) {
        console.log("Click cancelar y switch: " + this.esMiembro);
        if (this.esMiembro) {
          this.esMiembro = false;
        } else {
          this.esMiembro = true;
        }
      } else {
        this.miembroService.degradarMiembro(this.integrante.id);
      }
    });
  }

  private ascenderColaborador() {
    console.log("Ascender colaborador iniciado");
    const dialogRef = this.dialog.open(DialogoComponent, {
      width: '400px',
      disableClose: true,
      data: {
        mensaje: "Cambiar a este colaborador le dará acceso al sistema y se generará una contraseña que no se mostrará de nuevo ¿Está seguro de hacer este cambio?",
        resultado: this.resultadoDialog,
        dobleBoton: true
      }
    });
    dialogRef.afterClosed().subscribe(result => {
      if (!result) {
        console.log("Click cancelar y switch: " + this.esMiembro);
        if (this.esMiembro) {
          this.esMiembro = false;
        } else {
          this.esMiembro = true;
        }
      } else {
        this.ascender();
      }
    });
  }

  private ascender() {
    var dialTemp = this.dialog;
    var res = this.resultadoDialog;
    this.miembroService.ascenderColaborador(this.integrante.id).then(function (doc) {
      var pass = doc.data().passGenerada;
      console.log(pass);
      console.log("Dialog por abrir con: " + pass);
      dialTemp.open(DialogoComponent, {
        width: '400px',
        disableClose: true,
        data: { mensaje: "La contraseña generada para el miembro es la siguiente: " + pass, resultado: res, dobleBoton: false }
      });
    });
  }

  public confirmarCambio() {
    if (!this.agregando) {
      console.log("Switch a punto de cambiar");
      console.log("Ël switch esta en: " + this.esMiembro);
      if (this.esMiembro) {
        this.degradarMiembro();
      } else {
        this.ascenderColaborador();
      }
    }
  }

  public registrarIntegrante() {
    if (this.miembroForm.valid) {
      var rol: string;
      if (this.esMiembro) {
        rol = "Miembro";
      } else {
        rol = "Colaborador";
      }
      this.passGenerada = this.miembroService.registrarMiembro(this.nombreNuevo, this.correoNuevo, rol);
      if (rol == "Miembro") {
        console.log("Deberia abrir un dialogo");
        this.dialog.open(DialogoComponent, {
          width: '400px',
          disableClose: true,
          data: { mensaje: "La contraseña generada para el miembro es la siguiente: " + this.passGenerada, resultado: this.resultadoDialog, dobleBoton: false }
        });
      }
      console.log("La pass generada es: " + this.passGenerada);
    }
  }

}
