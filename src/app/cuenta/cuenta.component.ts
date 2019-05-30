import { Component, OnInit, Input } from '@angular/core';
import { DialogoComponent } from 'src/app/dialogo/dialogo.component';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA, MatDatepickerInputEvent } from '@angular/material';
import { EstudioService } from '../servicios/estudio.service';
import { NgForm } from '@angular/forms/src/directives/ng_form';
import { EstudioComponent } from './estudio/estudio.component';
import { Miembro } from '../models/MiembroInterface';
import { MiembroService } from '../servicios/miembro.service';
@Component({
  selector: 'app-cuenta',
  templateUrl: './cuenta.component.html',
  styleUrls: ['./cuenta.component.scss']
})
export class CuentaComponent implements OnInit {

  @Input() private miembroObjeto: Miembro;
  
  private datosPersonalesForm: FormGroup;
  hide = true;
  estudios: Array<any> = []

  constructor(
    private miembroService: MiembroService,
    public dialog: MatDialog,
  ) {
    this.datosPersonalesForm = new FormGroup({
    });
  }

  ngOnInit() {
    this.estudios = [];
    var docRefs: Array<any> = [];
    this.miembroService.obtenerEstudios(this.miembroService.getMiembroActivo().id).then(function(querySnapshot) {
      querySnapshot.forEach(function(doc) {
        var documento = doc.data();
        documento.id = doc.id;
        console.log(documento);
        docRefs.push(documento);
      });
    });
    this.estudios = docRefs;
  }

  private llenarCampos() {

  }

  agregarEstudio() {
    var resultado: boolean;
    console.log(this.miembroObjeto);
    const dialogRef = this.dialog.open(EstudioComponent, {
      width: '400px',
      data: { miembroObjeto: this.miembroObjeto, habilitaCampos: true, edicion: false }
    });
    dialogRef.afterClosed().subscribe(result => {
      resultado = result;
      if (result) {
        this.ngOnInit();
      }
    });
  }

  editarEstudio(posicion: number) {
    console.log('Editar estudio');
    console.log(posicion);
    var resultado: boolean;
    console.log(this.miembroObjeto);
    const dialogRef = this.dialog.open(EstudioComponent, {
      width: '400px',
      data: {
        miembroObjeto: this.miembroObjeto,
        habilitaCampos: false,
        edicion: true,
        estudioObjeto: this.estudios[posicion]
      }
    });
    dialogRef.afterClosed().subscribe(result => {
      resultado = result;
      if (result) {
        this.ngOnInit();
      }
    });
  }
}
