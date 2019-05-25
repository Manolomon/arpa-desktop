import { Component, OnInit } from '@angular/core';
import { DialogoComponent } from 'src/app/dialogo/dialogo.component';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA, MatDatepickerInputEvent } from '@angular/material';
import { EstudioService } from '../servicios/estudio.service';

@Component({
  selector: 'app-cuenta',
  templateUrl: './cuenta.component.html',
  styleUrls: ['./cuenta.component.scss']
})
export class CuentaComponent implements OnInit {

  hide = true;
  estudios: Array<any> = []

  constructor(
    private estudioService: EstudioService,
    public dialog: MatDialog,
  ) { }

  ngOnInit() {
    this.estudios = [];
    var docRefs: Array<any> = [];
    this.estudioService.obtenerEstudios().then(function(querySnapshot) {
      querySnapshot.forEach(function(doc) {
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
    const dialogRef = this.dialog.open();

  }

}
