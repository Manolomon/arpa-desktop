import { Component, OnInit, Input, OnChanges, SimpleChange } from '@angular/core';
import { DialogoComponent } from 'src/app/dialogo/dialogo.component';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA, MatDatepickerInputEvent } from '@angular/material';
import { EstudioService } from '../servicios/estudio.service';
import { NgForm } from '@angular/forms/src/directives/ng_form';
import { isNullOrUndefined, isUndefined } from 'util';
import { EstudioComponent } from './estudio/estudio.component';
import { Miembro } from '../models/MiembroInterface';
import { NotifierService } from "angular-notifier";
import { MiembroService } from '../servicios/miembro.service';
@Component({
  selector: 'app-cuenta',
  templateUrl: './cuenta.component.html',
  styleUrls: ['./cuenta.component.scss']
})
export class CuentaComponent implements OnInit {

  @Input() private miembroObjeto: Miembro;

  private datosPersonalesForm: FormGroup;
  private minLengthChar: number;
  hide = true;
  editMode = false;
  estudios: Array<any> = [];
  private idMiembro: string;

  public miembro: Miembro = {
    id: '',
    nombre: '',
    correo: '',
    passGenerada: '',
    facultad: '',
    institucion: '',
    puesto: '',
    rol: '',
    sni: '',
  };

  constructor(
    private miembroService: MiembroService,
    public dialog: MatDialog,
    private notifier: NotifierService,
  ) {
    this.minLengthChar = 2;
    this.datosPersonalesForm = new FormGroup({
      correoControl: new FormControl('', [Validators.required, Validators.minLength(this.minLengthChar)]),
      passwordControl: new FormControl('', [Validators.required, Validators.minLength(this.minLengthChar)]),
      nombreControl: new FormControl('', [Validators.required, Validators.minLength(this.minLengthChar)]),
      facultadControl: new FormControl('', [Validators.required, Validators.minLength(this.minLengthChar)]),
      institucionControl: new FormControl('', [Validators.required, Validators.minLength(this.minLengthChar)]),
      puestoControl: new FormControl('', [Validators.required, Validators.minLength(this.minLengthChar)]),
      sniControl: new FormControl('', [Validators.required, Validators.minLength(this.minLengthChar)]),
    });
  }

  public habilitarCampos() {
    this.editMode = !this.editMode;
    if (!this.editMode) {
      this.ngOnInit();
    } else {
      this.datosPersonalesForm.enable();
      this.datosPersonalesForm.get('correoControl').disable();
    }
  }

  ngOnInit() {
    console.log(this.miembro);
    if (!isNullOrUndefined(this.miembroObjeto)) {
      this.llenarCampos();
    }
    if (this.editMode) {
      this.datosPersonalesForm.enable();
      this.datosPersonalesForm.get('correoControl').disable();
    } else {
      this.datosPersonalesForm.disable();
    }

    this.estudios = [];
    var docRefs: Array<any> = [];
    this.miembroService.obtenerEstudios(this.miembroObjeto.id).then(function (querySnapshot) {
      querySnapshot.forEach(function (doc) {
        var documento = doc.data();
        documento.id = doc.id;
        console.log(documento);
        docRefs.push(documento);
      });
    });
    this.estudios = docRefs;
  }

  public ngOnChanges(changes: { [propKey: string]: SimpleChange }) {
    if (this.editMode) {
      this.datosPersonalesForm.enable();
    } else {
      this.datosPersonalesForm.disable();
    }

  }

  public hasError = (controlName: string, errorName: string) => {
    return this.datosPersonalesForm.controls[controlName].hasError(errorName);
  }

  private llenarCampos() {
    this.idMiembro = this.miembroObjeto.id;
    this.miembro.id = this.miembroObjeto.id;
    this.miembro.nombre = this.miembroObjeto.nombre;
    this.miembro.correo = this.miembroObjeto.correo;
    this.miembro.passGenerada = this.miembroObjeto.passGenerada;
    this.miembro.facultad = this.miembroObjeto.facultad;
    this.miembro.institucion = this.miembroObjeto.institucion;
    this.miembro.puesto = this.miembroObjeto.puesto;
    this.miembro.sni = this.miembroObjeto.sni;
    this.miembro.rol = this.miembroObjeto.rol;
  }

  agregarEstudio() {
    var resultado: boolean;
    console.log(this.miembroObjeto);
    const dialogRef = this.dialog.open(EstudioComponent, {
      width: '40%',
      data: { miembroObjeto: this.miembroObjeto, habilitaCampos: true, edicion: false }
    });
    dialogRef.afterClosed().subscribe(result => {
      resultado = result;
      if (result) {
        this.ngOnInit();
      }
    });
  }

  onGuardarCambios() {
    console.log(this.miembro);
    if (this.datosPersonalesForm.valid) {
      this.miembroService.actualizarDatos(this.miembro)
        .then((docRef) => {
          this.notifier.notify("success", "Datos actualizados exitosamente");
        })
        .catch((error) => {
          this.notifier.notify("error", "Error con la conexión a la base de datos");
          console.error("Error al añadir documento: ", error);
          return;
        });
    } else {
      this.notifier.notify("warning", "Datos incompletos o inválidos");
    }
    this.habilitarCampos();
  }

  editarEstudio(posicion: number) {
    console.log('Editar estudio');
    console.log(posicion);
    var resultado: boolean;
    console.log(this.miembroObjeto);
    const dialogRef = this.dialog.open(EstudioComponent, {
      width: '40%',
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
