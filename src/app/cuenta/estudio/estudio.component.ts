import { Component, OnInit, Inject } from '@angular/core';
import { Estudio } from '../../models/EstudioInterface';
import { Miembro } from 'src/app/models/MiembroInterface';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import { isNullOrUndefined } from 'util';
import { FormGroup, FormControl, Validators, NgForm } from '@angular/forms';
import { MatDatepickerInputEvent } from '@angular/material';
import * as firebase from 'firebase';
import { EstudioService } from '../../servicios/estudio.service'
import { NotifierService } from 'angular-notifier'

export interface DialogData {
  miembroObjeto: Miembro;
  estudioObjeto?: Estudio;
  habilitaCampos: boolean;
  edicion: boolean;
}

@Component({
  selector: 'app-estudio',
  templateUrl: './estudio.component.html',
  styleUrls: ['./estudio.component.sass']
})
export class EstudioComponent implements OnInit {

  private miembroObjeto: Miembro;
  private estudioObjeto: Estudio;
  private estudioForm: FormGroup;
  private fechaControl: FormControl = new FormControl('', [Validators.required]);
  private habilitaCampos: boolean = true;
  private edicion: boolean;

  private estudio: Estudio = {
    titulo: '',
    area: '',
    institucion: '',
    paisInstitucion: '',
    fecha: null,
    grado: '',
  };
  constructor(
    public dialogRef: MatDialogRef<EstudioComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData,
    private estudioService: EstudioService,
    private notifier: NotifierService,
  ) {
    this.estudioForm = new FormGroup({
      tituloControl: new FormControl('', [Validators.required, Validators.minLength(5)]),
      gradoControl: new FormControl('', [Validators.required, Validators.minLength(2)]),
      institucionControl: new FormControl('', [Validators.required, Validators.minLength(2)]),
      areaControl: new FormControl('', [Validators.required, Validators.minLength(2)]),
      paisInstitucionControl: new FormControl('', [Validators.required, Validators.minLength(2)]),
    });
    this.miembroObjeto = data.miembroObjeto;
    console.log(this.miembroObjeto);
    this.habilitaCampos = data.habilitaCampos;
    this.edicion = data.edicion;
    if (this.habilitaCampos) {
      this.estudioForm.enable();
    } else {
      this.estudioForm.disable();
    }
    if (!isNullOrUndefined(data.estudioObjeto)) {
      this.estudioObjeto = data.estudioObjeto;
      this.llenarCampos();
    }
  }

  ngOnInit() {
    if (!isNullOrUndefined(this.estudioObjeto)) {
      this.fechaControl = new FormControl(this.estudioObjeto.fecha.toDate());
    }
    this.estudioForm.addControl("fechaControl", this.fechaControl);
  }

  private llenarCampos(): void {
    this.estudio.area = this.estudioObjeto.area;
    this.estudio.grado = this.estudioObjeto.grado;
    this.estudio.id = this.estudioObjeto.id;
    this.estudio.idMiembro = this.estudioObjeto.idMiembro;
    this.estudio.institucion = this.estudioObjeto.institucion;
    this.estudio.paisInstitucion = this.estudioObjeto.paisInstitucion;
    this.estudio.titulo = this.estudioObjeto.titulo;
  }

  public setFechaEstudio(event: MatDatepickerInputEvent<Date>) {
    this.estudio.fecha = firebase.firestore.Timestamp.fromDate(event.value);
  }

  async onGuardarEstudio() {
    if (this.estudioForm.valid) {
      this.estudio.idMiembro = this.miembroObjeto.id;
      let idGenerado: string;
      if (isNullOrUndefined(this.estudio.fecha)) {
        this.notifier.notify("warning", "Datos Incompleto o inválidos");
        return;
      }
      if (isNullOrUndefined(this.estudio.id)) {
        console.log('Agregando estudio');
        this.estudioService.agregarEstudio(this.estudio)
          .then((docRef) => {
            idGenerado = docRef.id;
            console.log(idGenerado);
            if (!isNullOrUndefined(idGenerado)) {
              this.notifier.notify("success", "Estudio agregado correctamente");
              this.dialogRef.close(true);
            }
          })
          .catch((err) => {
            this.notifier.notify("error", "Error con la conexion a la base de datos");
            console.error("Error al añadir el estudio: ", err);
            this.dialogRef.close(false);
          });
      } else {
        console.log('modificando producto');
        this.estudioService.modificarEstudio(this.estudio)
          .then(() => {
            this.notifier.notify("success", "Estudio guardado correctamente");
            this.dialogRef.close(true);
          })
          .catch((err) => {
            this.notifier.notify("error", "Error con la conexión a la base de datos");
            console.error("Error al añadir el estudio: ", err);
            this.dialogRef.close(false);
          });
      }
    } else {
      this.notifier.notify("warning", "Datos incompletos o inválidos");
    }
  }

  public hasError = (controlName: string, errorName: string) => {
    return this.estudioForm.controls[controlName].hasError(errorName);
  }

  public cancelarEdicion(): void {
    this.dialogRef.close(false);
  }

}
