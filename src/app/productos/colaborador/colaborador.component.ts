import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import { Colaborador } from '../../models/ColaboradorInterface';
import { MiembroService } from 'src/app/servicios/miembro.service';
import { FormControl } from '@angular/forms';

export interface DialogData {
  grado: string;
  nombre: string;
  institucion: string;
}

@Component({
  selector: 'app-colaborador',
  templateUrl: './colaborador.component.html',
  styleUrls: ['./colaborador.component.scss']
})

export class ColaboradorComponent implements OnInit {

  private listaColaboradores: Array<Colaborador>;
  private colaborador: Colaborador = {
    nombre: '',
    institucion: '',
    grado: ''
  }
  private idColaborador: string = "";
  private gradoControl: FormControl = new FormControl();

  constructor(
    private miembroService: MiembroService,    
    public dialogRef: MatDialogRef<ColaboradorComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData) { }

  ngOnInit(): void {
    var listaCol: Array<Colaborador> = [];
    this.miembroService.obtenerColaboradoresExternos(this.miembroService.getMiembroActivo().id).then(function(querySnapshot) {
      querySnapshot.forEach(function(doc) {
        const temporal: any = doc.data();
        const col: Colaborador = {
          id: doc.id,
          nombre: temporal.nombre,
          institucion: temporal.institucion,
          grado: temporal.grado
        };
        listaCol.push(col);
      });
    });
    this.listaColaboradores = listaCol;
  }

  clickColaborador(colaborador): void {
    this.colaborador = colaborador;
  }

  clickAgregarOActualizarColaborador(): void {
    const idMiembro = this.miembroService.getMiembroActivo().id;
    this.miembroService.agregarOActualizarColaboradorExterno(idMiembro,this.colaborador);
    this.dialogRef.close();
  }

  eliminarColaborador(idColaborador): void {
    this.miembroService.eliminarColaboradorExterno(this.miembroService.getMiembroActivo().id,idColaborador);
    this.dialogRef.close();
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

}
