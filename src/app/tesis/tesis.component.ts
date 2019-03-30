import { Component, OnInit, Input, Output, EventEmitter, OnChanges, SimpleChange } from '@angular/core';
import { FormControl, FormGroup, Validators, Form } from '@angular/forms';
import { Tesis } from '../models/TesisInterface';
import { ProductoService } from '../servicios/productos.service';
import { NgForm } from '@angular/forms/src/directives/ng_form';
import { MiembroService } from '../servicios/miembro.service';
import * as firebase from 'firebase';
import { isNullOrUndefined, isUndefined } from 'util';
import { MatDatepicker, MatDatepickerInputEvent } from '@angular/material';


@Component({
  selector: "app-tesis",
  templateUrl: "./tesis.component.html",
  styleUrls: ["./tesis.component.scss"],
})

export class TesisComponent implements OnInit, OnChanges {

  private idTesis: string;
  private cargaDeArchivo: number;
  private archivo: FileList;
  private tesisForm: FormGroup;
  private evidencia = "Evidencia";
  private btnEvidenciaControl: FormControl = new FormControl();
  private colaboradoresControl: FormControl = new FormControl();
  private estadoControl: FormControl = new FormControl();
  private colaboradoresExternosControl: FormControl = new FormControl();
  private gradoControl: FormControl = new FormControl('', [Validators.required]);
  private fechaInicio: string;
  private colaboradores: string[] = [];

  @Input() private tesisObjeto: any;
  @Input() private habilitaCampos: boolean;
  @Input() private eliminarProducto: boolean;
  @Input() private nuevaTesis: boolean;
  @Output() private creacionCancelada = new EventEmitter<boolean>();

  public tesis: Tesis = {
    titulo: '',
    estado: '',
    tipo: 'tesis',
    consideradoPCA: false,
    grado: '',
    numAlumnos: 0,
    lineaGeneracion: '',
    colaboradores: [],
  }
  constructor(private productoService: ProductoService, private miembroService: MiembroService) {
    this.tesisForm = new FormGroup({
      tituloControl: new FormControl('', [Validators.required, Validators.minLength(2)]),
      lineaGeneracionControl: new FormControl('', [Validators.required, Validators.minLength(2)]),
      numAlumnosControl: new FormControl('', [Validators.required]),
      btnConsideradoControl: new FormControl(''),
      fechaInicioControl: new FormControl('', [Validators.required]),
      fechaTerminoControl: new FormControl('', [Validators.required]),
    });
    this.tesisForm.addControl("estadoControl", this.estadoControl);
    this.tesisForm.addControl("gradoCOntrol", this.gradoControl);
    this.tesisForm.addControl("colaboradoresControl", this.colaboradoresControl);
    this.tesisForm.addControl("colaboradoresExternosControl", this.colaboradoresExternosControl);

  }

  public llenarCampos() {
    this.tesis.titulo = this.tesisObjeto.titulo;
    this.tesis.estado = this.tesisObjeto.estado;
    this.tesis.tipo = this.tesisObjeto.tipo;
    this.tesis.consideradoPCA = this.tesisObjeto.consideradoPCA;
    this.tesis.fechaInicio = this.tesisObjeto.fechaInicio;
    this.fechaInicio = this.tesis.fechaInicio.toDate().getDate() + '/' + this.tesis.fechaInicio.toDate().getMonth() + '/' + this.tesis.fechaInicio.toDate().getFullYear();

    this.tesis.fechaTermino = this.tesisObjeto.fechaTermino;
    this.tesis.grado = this.tesisObjeto.grado;
    this.tesis.numAlumnos = this.tesisObjeto.numAlumnos;
    this.tesis.lineaGeneracion = this.tesisObjeto.lineaGeneracion;
    this.idTesis = this.tesisObjeto.id;
    this.tesis.registrado = this.tesisObjeto.registrado;
    this.tesis.evidencia = this.tesisObjeto.evidencia;
  }

  public ngOnInit() {
    if (!isNullOrUndefined(this.tesisObjeto)) {
      this.llenarCampos();
    }

    this.miembroService.obtenerMiembros().subscribe(datos => {
      this.colaboradores = [];
      for (let dato of datos) {
        const temporal: any = (dato.payload.doc.data());
        this.colaboradores.push(temporal.nombre);
      }
    });
    console.log(this.idTesis);
    console.log(this.tesis.titulo);
  }

  public ngOnChanges(changes: { [propKey: string]: SimpleChange }) {
    if (this.habilitaCampos) {
      this.tesisForm.enable();
    } else {
      this.tesisForm.disable();
    }
    if (this.eliminarProducto) {
      this.productoService.eliminarProducto(this.idTesis);
    }
  }

  public hasError = (controlName: string, errorName: string) => {
    return this.tesisForm.controls[controlName].hasError(errorName);
  }

  public detectarArchivos(event) {
    this.archivo = event.target.files;
    console.log(this.archivo.item(0).size);
    this.evidencia = this.archivo.item(0).name;
    this.tesis.evidencia = this.evidencia;
  }

  public onChange() {
    this.tesis.consideradoPCA = !this.tesis.consideradoPCA;
    console.log("Consideracion cambiada");
  }

  public onGuardarTesis(myForm: NgForm) {
    this.cargaDeArchivo = 0;
    if (this.tesisForm.valid) {
      let idGenerado: string;
      if (isNullOrUndefined(this.tesis.fechaInicio) || isNullOrUndefined(this.tesis.fechaTermino)) {
        alert("Error, datos incompletos o inválidos");
        return 0;
      }
      if (isUndefined(this.idTesis)) {
        console.log("Agregando producto");
        this.tesis.registrado = firebase.firestore.Timestamp.fromDate(new Date());
        this.productoService.agregarProducto(this.tesis)
          .then(function (docRef) {
            idGenerado = docRef.id;
            console.log(idGenerado);
            if (this.archivo != null) {
              this.productoService.subirArchivo(this.archivo.item(0), idGenerado, this.cargaDeArchivo);
            }
          })
          .catch(function (error) {
            console.error("Error al añadir documento: ", error);
          });
        console.log(this.tesis.colaboradores);
      } else {
        console.log("Modificando producto");
        this.tesis.id = this.idTesis;
        this.productoService.modificarProducto(this.tesis)
          .catch(function (error) {
            console.error("Error al añadir documento: ", error);
          });
        if (this.archivo != null) {
          this.productoService.subirArchivo(this.archivo.item(0), this.idTesis, this.cargaDeArchivo);
        }
        console.log(this.tesis.colaboradores);
      }
    } else {
      alert("Datos incompletos o inválidos");
    }
  }

  public cancelarEdicion() {
    if (!isNullOrUndefined(this.tesis.id)) {
      this.llenarCampos();
    } else {
      this.nuevaTesis = !this.nuevaTesis;
      this.creacionCancelada.emit(false);
    }
  }

  public setFechaInicio(event: MatDatepickerInputEvent<Date>) {
    this.tesis.fechaInicio = firebase.firestore.Timestamp.fromDate(event.value);
    this.fechaInicio = event.value.getDay() + '/' + event.value.getMonth() + '/' + event.value.getFullYear();
    console.log(this.fechaInicio);
  }
  public setFechaFin(event: MatDatepickerInputEvent<Date>) {
    this.tesis.fechaTermino = firebase.firestore.Timestamp.fromDate(event.value);
  }

}

