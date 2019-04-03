import { Component, OnInit, Input, Output, EventEmitter, OnChanges, SimpleChange } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Memoria } from '../models/MemoriaInterface'
import { ProductoService } from '../servicios/productos.service';
import { NgForm } from '@angular/forms/src/directives/ng_form';
import { MiembroService } from '../servicios/miembro.service';
import * as firebase from 'firebase';
import { isNullOrUndefined, isUndefined } from 'util';
import { MatDatepickerInputEvent } from '@angular/material';
import { NotifierService } from "angular-notifier";


@Component({
  selector: "app-memoria",
  templateUrl: "./memoria.component.html",
  styleUrls: ["./memoria.component.scss"],
})

export class MemoriaComponent implements OnInit, OnChanges {

  private idMemoria: string;
  private cargaDeArchivo: number;
  private archivo: FileList;
  private memoriaForm: FormGroup;
  private evidencia = "Evidencia";
  private considerar: boolean;
  private btnEvidenciaControl: FormControl = new FormControl();
  private colaboradoresControl: FormControl = new FormControl();
  private colaboradoresExternosControl: FormControl = new FormControl();
  private ciudadControl: FormControl = new FormControl();
  private fechaPublicacion: FormControl = new FormControl('', [Validators.required]);
  private colaboradores: string[] = [];
  private lgac: string[] = [];

  @Input() private memoriaObjeto: any;
  @Input() private habilitaCampos: boolean;
  @Input() private eliminarProducto: boolean;
  @Input() private nuevaMemoria: boolean;
  @Output() private creacionCancelada = new EventEmitter<boolean>();

  private memoria: Memoria = {
    titulo: '',
    estado: '',
    tipo: 'memoria',
    consideradoPCA: false,
    autor: '',
    ciudad: '',
    nombreCongreso: '',
    paginaInicio: 0,
    paginaFin: 0,
    pais: '',
    proposito: '',
    lineaGeneracion: '',
  }

  constructor(
    private productoService: ProductoService,
    private miembroService: MiembroService,
    private notifier: NotifierService,
  ) {
    this.memoriaForm = new FormGroup({
      tituloControl: new FormControl('', [Validators.required, Validators.minLength(2)]),
      autorControl: new FormControl('', [Validators.required, Validators.minLength(2)]),
      pagInicioControl: new FormControl(Validators.required, Validators.min(1)),
      paginaFinControl: new FormControl('', [Validators.required, Validators.min(2)]),
      propositoControl: new FormControl('', [Validators.required, Validators.minLength(2)]),
      congresoControl: new FormControl('', [Validators.required, Validators.minLength(2)]),
      lineaGeneracionControl: new FormControl('', [Validators.required, Validators.minLength(2)]),
      estadoControl: new FormControl('', [Validators.required, Validators.minLength(2)]),
      paisControl: new FormControl('', [Validators.required, Validators.minLength(3)]),
      btnConsideradoControl: new FormControl(''),
    });
    this.memoriaForm.addControl("btnEvidenciaControl", this.btnEvidenciaControl);
    this.memoriaForm.addControl("colaboradoresControl", this.colaboradoresControl);
    this.memoriaForm.addControl("colaboradoresExternosConttrol", this.colaboradoresExternosControl);
    this.memoriaForm.addControl("ciudadControl", this.ciudadControl);
    this.considerar = false;
  }

  public llenarCampos() {
    this.memoria.autor = this.memoriaObjeto.autor;
    this.memoria.ciudad = this.memoriaObjeto.ciudad;
    this.memoria.consideradoPCA = this.memoriaObjeto.consideradoPCA;
    this.considerar = this.memoriaObjeto.consideradoPCA;
    this.memoria.estado = this.memoriaObjeto.estado;
    this.memoria.fechaPublicacion = this.memoriaObjeto.fechaPublicacion;
    this.memoria.nombreCongreso = this.memoriaObjeto.nombreCongreso;
    this.memoria.paginaFin = this.memoriaObjeto.paginaFin;
    this.memoria.paginaInicio = this.memoriaObjeto.paginaInicio;
    this.memoria.pais = this.memoriaObjeto.pais;
    this.memoria.proposito = this.memoriaObjeto.proposito;
    this.memoria.registrado = this.memoriaObjeto.registrado;
    this.memoria.colaboradores = this.memoriaObjeto.colaboradores;
    this.idMemoria = this.memoriaObjeto.id;
    this.memoria.id = this.memoriaObjeto.id;
    this.memoria.lineaGeneracion = this.memoriaObjeto.lineaGeneracion;
    this.memoria.titulo = this.memoriaObjeto.titulo;
  }

  public ngOnInit() {
    if (!isNullOrUndefined(this.memoriaObjeto)) {
      this.llenarCampos();
      this.fechaPublicacion = new FormControl(this.memoria.fechaPublicacion.toDate());
    }
    this.memoriaForm.addControl("fechaPublicacion", this.fechaPublicacion);
    if (this.habilitaCampos) {
      this.memoriaForm.enable();
    } else {
      this.memoriaForm.disable();
    }
    this.miembroService.obtenerMiembros().subscribe(datos => {
      this.colaboradores = [];
      for (let dato of datos) {
        const temporal: any = (dato.payload.doc.data());
        this.colaboradores.push(temporal.nombre);
      }
    });
    this.productoService.obtenerLGAC().subscribe(datos => {
      this.lgac = [];
      for (let dato of datos) {
        const temporal: any = (dato.payload.doc.data());
        this.lgac.push(temporal.nombre);
      }
    });
    console.log(this.idMemoria);
    console.log(this.memoria.titulo);
  }

  public ngOnChanges(changes: { [propKey: string]: SimpleChange }) {
    if (this.habilitaCampos) {
      this.memoriaForm.enable();
    } else {
      this.memoriaForm.disable();
    }
    if (this.eliminarProducto) {
      this.productoService.eliminarProducto(this.idMemoria)
        .catch(function (error) {
          this.notifier.notify("error", "Error con la conexión a la base de datos");
        });
      console.log("Eliminando producto con id: " + this.idMemoria);
      this.notifier.notify("success", "Producto eliminado correctamente");
    }
  }

  public hasError = (controlName: string, errorName: string) => {
    return this.memoriaForm.controls[controlName].hasError(errorName);
  }

  public detectarArchivos(event) {
    this.archivo = event.target.files;
    console.log(this.archivo.item(0).size);
    this.evidencia = this.archivo.item(0).name;
    this.memoria.evidencia = this.evidencia;
  }

  public onChange(event) {
    this.memoria.consideradoPCA = !this.considerar;
    this.considerar = !this.considerar;
    console.log("Consideracion cambiada");
    console.log(this.memoria.consideradoPCA);
  }

  public onGuardarMemoria(myForm: NgForm) {
    this.cargaDeArchivo = 0;
    if (this.memoriaForm.valid) {
      let idGenerado: string;
      if (isNullOrUndefined(this.memoria.fechaPublicacion)) {
        this.notifier.notify("warning", "Datos incompletos o inválidos");
        return 0;
      }
      if (isUndefined(this.idMemoria)) {
        console.log("Agregando producto");
        this.memoria.registrado = firebase.firestore.Timestamp.fromDate(new Date());
        this.productoService.agregarProducto(this.memoria)
          .then(function (docRef) {
            idGenerado = docRef.id;
            console.log(idGenerado);
            if (this.archivo != null) {
              this.productoService.subirArchivo(this.archivo.item(0), idGenerado, this.cargaDeArchivo);
            }
            this.notifier.notify("success", "Tesis almacenada exitosamente");
          })
          .catch(function (error) {
            this.notifier.notify("error", "Error con la conexión a la base de datos");
            console.error("Error al añadir documento: ", error);
          });
        console.log(this.memoria.colaboradores);
      } else {
        console.log("Modificando producto");
        this.memoria.id = this.idMemoria;
        this.productoService.modificarProducto(this.memoria)
          .catch(function (error) {
            this.notifier.notify("error", "Error con la conexión a la base de datos");
            console.error("Error al añadir documento: ", error);
          });
        if (this.archivo != null) {
          this.productoService.subirArchivo(this.archivo.item(0), this.idMemoria, this.cargaDeArchivo);
        }
        this.notifier.notify("success", "Tesis modificada exitosamente");
        console.log(this.memoria.colaboradores);
      }
    } else {
      this.notifier.notify("warning", "Datos incompletos o inválidos");
    }
  }

  public cancelarEdicion() {
    if (!isNullOrUndefined(this.memoria.id)) {
      this.llenarCampos();
    } else {
      this.nuevaMemoria = !this.nuevaMemoria;
      this.creacionCancelada.emit(false);
    }
  }

  public setFechaPublicacion(event: MatDatepickerInputEvent<Date>) {
    this.memoria.fechaPublicacion = firebase.firestore.Timestamp.fromDate(event.value);
  }
}
