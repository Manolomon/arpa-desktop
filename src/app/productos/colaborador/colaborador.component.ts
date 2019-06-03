import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import { Colaborador } from '../../models/ColaboradorInterface';
import { MiembroService } from 'src/app/servicios/miembro.service';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { NotifierService } from "angular-notifier";

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
  private colaboradorForm: FormGroup;
  private colaborador: Colaborador = {
    nombre: '',
    institucion: '',
    grado: ''
  }
  private idColaborador: string = "";

  constructor(
    private miembroService: MiembroService,
    private notifier: NotifierService,
    public dialogRef: MatDialogRef<ColaboradorComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData) { }

  ngOnInit(): void {
    this.colaboradorForm = new FormGroup({
      nombreControl: new FormControl('', [Validators.required, Validators.minLength(2)]),
      gradoControl: new FormControl('', [Validators.required, Validators.minLength(2)]),
      institucionControl: new FormControl('', [Validators.required, Validators.minLength(2)])
    })
    
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
    if(this.colaboradorForm.valid) {
      const idMiembro = this.miembroService.getMiembroActivo().id;
      this.miembroService.agregarOActualizarColaboradorExterno(idMiembro, this.colaborador)
      .catch((error) => {
        this.notifier.notify("error", "Error con la conexión a la base de datos");
        console.log("Error al actualizar o agregar colaborador: " + error);
        this.dialogRef.close(false);
      });
      this.dialogRef.close(true);
    }
  }

  eliminarColaborador(idColaborador): void {
    this.miembroService.eliminarColaboradorExterno(this.miembroService.getMiembroActivo().id,idColaborador)
    .catch((error) => {
      this.notifier.notify("error", "Error con la conexión a la base de datos");
      console.log("Error al eliminar colaborador: " + error);
      this.dialogRef.close(false);
    });
    this.dialogRef.close(true);
  }

  onNoClick(): void {
    this.dialogRef.close(false);
  }

}
