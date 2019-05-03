import { Component, OnInit, OnChanges, Input, SimpleChange, EventEmitter, Output } from '@angular/core';
import { ProyectoService } from '../../servicios/proyecto.service';
import { Proyecto } from '../../models/ProyectoInterface';
import { NotifierService } from 'angular-notifier';
import { NgForm, NgModel, FormGroup, FormControl, Validators } from '@angular/forms'
import { isNullOrUndefined } from 'util';
import * as firebase from 'firebase';
import { MatDatepickerInputEvent } from '@angular/material'

@Component({
  selector: 'app-proyecto',
  templateUrl: './proyecto.component.html',
  styleUrls: ['./proyecto.component.scss']
})
export class ProyectoComponent implements OnInit, OnChanges {

  @Input() private proyectoObjeto: Proyecto;
  @Input() private idMiembro: string;
  @Input() private habilitaCampos: boolean;
  @Input() private nuevoProyecto: boolean;
  @Output() private creacionCancelada = new EventEmitter<boolean>();

  private proyectoForm: FormGroup;
  private fechaInicioControl: FormControl = new FormControl('', [Validators.required]);
  private fechaFinControl: FormControl = new FormControl('', [Validators.required]);
  private considerar: boolean;


  private proyecto: Proyecto = {
    nombre: '',
    consideradoPCA: false,
    actividadesRealizadas: '',
    descripcion: '',
    idCreador: '',
  }

  constructor(
    private proyectoService: ProyectoService,
    private notifier: NotifierService,
  ) {
    this.proyectoForm = new FormGroup({
      nombreControl: new FormControl('', [Validators.required, Validators.minLength(2)]),
      descripcionControl: new FormControl('', [Validators.required, Validators.minLength(2)]),
      actividadesControl: new FormControl('', [Validators.required, Validators.minLength(2)]),
      btnConsideradoControl: new FormControl(''),
    });
    this.considerar = false;
  }

  ngOnInit() {
    if (!isNullOrUndefined(this.proyectoObjeto)) {
      this.llenarCampos();
      this.fechaInicioControl = new FormControl(this.proyecto.fechaInicio.toDate());
      this.fechaFinControl = new FormControl(this.proyecto.fechaTentativaFin.toDate());
    }
    this.proyectoForm.addControl("fechaInicioControl", this.fechaInicioControl);
    this.proyectoForm.addControl("fechaFinControl", this.fechaFinControl);
    if (this.habilitaCampos) {
      this.proyectoForm.enable();
    } else {
      this.proyectoForm.disable();
    }
  }

  public ngOnChanges(changes: { [propKey: string]: SimpleChange }) {
    if (this.habilitaCampos) {
      this.proyectoForm.enable();
    } else {
      this.proyectoForm.disable();
    }
  }

  private llenarCampos(): void {
    this.proyecto.id = this.proyectoObjeto.id;
    this.proyecto.nombre = this.proyectoObjeto.nombre;
    this.proyecto.actividadesRealizadas = this.proyectoObjeto.actividadesRealizadas;
    this.proyecto.consideradoPCA = this.proyectoObjeto.consideradoPCA;
    this.proyecto.fechaInicio = this.proyectoObjeto.fechaInicio;
    this.proyecto.fechaTentativaFin = this.proyectoObjeto.fechaTentativaFin;
    this.proyecto.descripcion = this.proyectoObjeto.descripcion;
    this.proyecto.idCreador = this.proyectoObjeto.idCreador;
    this.considerar = this.proyectoObjeto.consideradoPCA;
  }

  public onChange(event) {
    this.proyecto.consideradoPCA = !this.considerar;
    this.considerar = !this.considerar;
    console.log("Consideracion cambiada");
  }

  public onGuardarProyecto(myForm: NgForm): void {
    if (this.proyectoForm.valid) {
      let idGenerado: string;
      if (isNullOrUndefined(this.proyecto.fechaInicio) || isNullOrUndefined(this.proyecto.fechaTentativaFin)) {
        this.notifier.notify("warning", "Datos incompletos o inválidos");
        return;
      }
      if (isNullOrUndefined(this.proyecto.id)) {
        this.proyectoService.agregarProyecto(this.proyecto)
          .then((docRef) => {
            idGenerado = docRef.id;
            this.notifier.notify("success", "Proyecto guardado con éxito");
          })
          .catch((err) => {
            this.notifier.notify("error", "Error con la conexión a la base de datos");
            console.error("Error al añadir el documento: ", err);
          });
      } else {
        this.proyectoService.agregarProyecto(this.proyecto)
          .then(function (docRef) {
            idGenerado = docRef.id;
            console.log(idGenerado);
            if (this.archivo != null) {
              this.productoService.subirArchivo(this.archivo.item(0), idGenerado, this.cargaDeArchivo);
            }
            this.notifier.notify("success", "Proyecto guardado exitosamente")
          })
          .catch((err) => {
            this.notifier.notify("error", "Error con la conexión a la base de datos");
            console.error("Error al añadir el documento: ", err);
          });
      }
    } else {
      this.notifier.notify("warning", "Datos incompletos o inválidos");
    }
  }

  public hasError = (controlName: string, errorName: string) => {
    return this.proyectoForm.controls[controlName].hasError(errorName);
  }

  public cancelarEdicion(): void {
    if (!isNullOrUndefined(this.proyecto.id)) {
      this.llenarCampos();
    } else {
      this.nuevoProyecto = !this.nuevoProyecto;
      this.creacionCancelada.emit(false);
    }
  }

  public setFechaInicio(event: MatDatepickerInputEvent<Date>) {
    this.proyecto.fechaInicio = firebase.firestore.Timestamp.fromDate(event.value);
  }

  public setFechaFin(event: MatDatepickerInputEvent<Date>) {
    this.proyecto.fechaTentativaFin = firebase.firestore.Timestamp.fromDate(event.value);
  }

}
