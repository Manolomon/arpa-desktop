import { Component, OnInit, Inject } from '@angular/core';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material';
import { database } from 'firebase';

export interface DialogData {
  mensaje: string,
  resultado : boolean,
  dobleBoton : boolean
}

@Component({
  selector: 'app-dialogo',
  templateUrl: './dialogo.component.html',
  styleUrls: ['./dialogo.component.sass']
})
export class DialogoComponent implements OnInit {
  
  constructor(public dialogRef: MatDialogRef<DialogoComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData) { }

  ngOnInit() {
  }

  clickCancelar(): void {
    this.data.resultado = false;
    this.dialogRef.close();
  }

  clickAceptar(): void {
    this.data.resultado = true;
    this.dialogRef.close();
  }

}
