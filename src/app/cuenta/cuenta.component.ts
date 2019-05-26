import { Component, OnInit, Input } from '@angular/core';
import { DialogoComponent } from 'src/app/dialogo/dialogo.component';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA, MatDatepickerInputEvent } from '@angular/material';
import { EstudioService } from '../servicios/estudio.service';
import { EstudioComponent } from './estudio/estudio.component';
import { Miembro } from '../models/MiembroInterface';
import { Estudio } from '../models/EstudioInterface';
@Component({
  selector: 'app-cuenta',
  templateUrl: './cuenta.component.html',
  styleUrls: ['./cuenta.component.scss']
})
export class CuentaComponent implements OnInit {

  @Input() private miembroObjeto: Miembro;
  hide = true;
  estudios: Array<any> = []

  constructor(
    private estudioService: EstudioService,
    public dialog: MatDialog,
  ) { }

  ngOnInit() {
    this.estudios = [];
    var docRefs: Array<any> = [];
    this.estudioService.obtenerEstudios().then(function (querySnapshot) {
      querySnapshot.forEach(function (doc) {
        var documento = doc.data();
        documento.id = doc.id;
        console.log(documento);
        docRefs.push(documento);
      });
    });
    this.estudios = docRefs;
  }

  agregarEstudio() {
    var resultado: boolean;
    console.log(this.miembroObjeto);
    const dialogRef = this.dialog.open(EstudioComponent, {
      width: '250px',
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
      width: '250px',
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
