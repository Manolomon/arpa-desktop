import { Component, OnInit, Input, Output, EventEmitter, OnChanges, SimpleChange } from '@angular/core';
import { FormControl, FormGroup, Validators, Form } from '@angular/forms';
import { Produccion } from '../models/ProduccionInterface';
import { ProductoService } from '../servicios/productos.service';
import { NgForm } from '@angular/forms/src/directives/ng_form';
import { MiembroService } from '../servicios/miembro.service';
import * as firebase from 'firebase';
import { isNullOrUndefined, isUndefined } from 'util';
import { MatDatepicker, MatDatepickerInputEvent } from '@angular/material';
import { NotifierService } from "angular-notifier";

@Component({
  selector: 'app-produccion',
  templateUrl: './produccion.component.html',
  styleUrls: ['./produccion.component.scss']
})

export class ProduccionComponent implements OnInit {

  private idProduccion: string;
  private cargaDeArchivo: number;
  private archivo: FileList;
  private produccionForm: FormGroup;
  private evidencia = "Evidencia";
  private colaboradoresControl: FormControl = new FormControl();
  private colaboradoresExternosControl: FormControl = new FormControl();
  private fechaPublicacionControl: FormControl = new FormControl();
  private btnConsideradoControl: FormControl = new FormControl();
  private colaboradores: string[] = [];
  private lgac: string[] = [];

  @Input() private produccionObjeto: any;
  @Input() private habilitaCampos: boolean;
  @Input() private eliminarProducto: boolean;
  @Input() private nuevaProduccion: boolean;
  @Output() private creacionCancelada = new EventEmitter<boolean>();

  public produccion: Produccion = {
    titulo: '',
    estado: '',
    tipo: 'produccion',
    consideradoPCA: false,
    clasificacion: '',
    descripcion: '',
    numRegistro: '',
    lineaGeneracion: '',
    pais: '',
    proposito: '',
    uso: '',
    usuario: '',
    colaboradores: [],
    evidencia: '',
  }

  constructor(
    private notifier: NotifierService,
    private miembroService: MiembroService,
    private productoService: ProductoService,
  ) {
    this.produccionForm = new FormGroup({
      tituloControl: new FormControl('', [Validators.required, Validators.minLength(2)]),
      clasificacionControl: new FormControl('', [Validators.required, Validators.minLength(2)]),
      usuarioControl: new FormControl('', [Validators.required, Validators.minLength(2)]),
      numRegistroControl: new FormControl('', [Validators.required, Validators.minLength(3)]),
      descripcionControl: new FormControl('', [Validators.required, Validators.minLength(2)]),
      usoControl: new FormControl('', [Validators.required, Validators.minLength(2)]),
      lineaGeneracionControl: new FormControl('', [Validators.required, Validators.minLength(2)]),
      propositoControl: new FormControl('', [Validators.required, Validators.minLength(2)]),
      estadoControl: new FormControl('', [Validators.required, Validators.minLength(2)]),
      paisControl: new FormControl('', [Validators.required, Validators.minLength(2)]),
    });
    this.produccionForm.addControl("btnConsideradoControl", this.btnConsideradoControl);
    this.produccionForm.addControl("colaboradoresControl", this.colaboradoresControl);
    this.produccionForm.addControl("colaboradoresExternosControl", this.colaboradoresExternosControl);
    this.produccionForm.addControl("fechaPublicacionControl", this.fechaPublicacionControl);
    this.cargaDeArchivo = 0;
  }

  public llenarCampos() {
    this.produccion.clasificacion = this.produccionObjeto.clasificacion;
    this.produccion.colaboradores = this.produccionObjeto.colaboradores;
    this.produccion.consideradoPCA = this.produccionObjeto.consideradoPCA;
    this.produccion.descripcion = this.produccionObjeto.descripcion;
    this.produccion.estado = this.produccionObjeto.estado;
    this.produccion.evidencia = this.produccion.evidencia;
    this.produccion.fechaPublicacion = this.produccion.fechaPublicacion;
    this.produccion.id = this.produccionObjeto.id;
    this.idProduccion = this.produccionObjeto.id;
    this.produccion.lineaGeneracion = this.produccionObjeto.lineaGeneracion;
    this.produccion.numRegistro = this.produccionObjeto.numRegistro;
    this.produccion.pais = this.produccionObjeto.pais;
    this.produccion.proposito = this.produccion.proposito;
    this.produccion.titulo = this.produccionObjeto.titulo;
    this.produccion.uso = this.produccionObjeto.uso;
    this.produccion.usuario = this.produccionObjeto.usuario;
  }

  public ngOnInit() {
    if (!isNullOrUndefined(this.produccionObjeto)) {
      this.llenarCampos();
      this.fechaPublicacionControl = new FormControl(this.produccion.fechaPublicacion.toDate());
    }
    this.produccionForm.addControl("fechaTerminoControl", this.fechaPublicacionControl);

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
  }

  public ngOnChanges(changes: { [propKey: string]: SimpleChange }) {
    if (this.habilitaCampos) {
      this.produccionForm.enable();
    } else {
      this.produccionForm.disable();
    }
    if (this.eliminarProducto) {
      this.productoService.eliminarProducto(this.idProduccion)
      .catch(function(error) {
        this.notifier.notify("error", "Error con la conexión a la base de datos");
      });
      console.log("Eliminando producto con id: "+ this.idProduccion);
      this.notifier.notify("success", "Producto eliminado correctamente");
    }
  }

  public hasError = (controlName: string, errorName: string) => {
    return this.produccionForm.controls[controlName].hasError(errorName);
  }

  public detectarArchivos(event) {
    this.archivo = event.target.files;
    console.log(this.archivo.item(0).size);
    this.evidencia = this.archivo.item(0).name;
    this.produccion.evidencia = this.evidencia;
  }

  public onChange() {
    this.produccion.consideradoPCA = !this.produccion.consideradoPCA;
    console.log("Consideracion cambiada");
  }

  public onGuardarproduccion(myForm: NgForm) {
    this.cargaDeArchivo = 0;
    if (this.produccionForm.valid) {
      let idGenerado: string;
      if (isNullOrUndefined(this.produccion.fechaPublicacion)) {
        this.notifier.notify("warning", "Datos incompletos o inválidos");
        return 0;
      }
      if (isUndefined(this.idProduccion)) {
        console.log("Agregando producto");
        this.produccion.registrado = firebase.firestore.Timestamp.fromDate(new Date());
        this.productoService.agregarProducto(this.produccion)
          .then(function (docRef) {
            idGenerado = docRef.id;
            console.log(idGenerado);
            if (this.archivo != null) {
              this.productoService.subirArchivo(this.archivo.item(0), idGenerado, this.cargaDeArchivo);
            }
            this.notifier.notify("success", "produccion almacenada exitosamente");
          })
          .catch(function (error) {
            this.notifier.notify("error", "Error con la conexión a la base de datos");
            console.error("Error al añadir documento: ", error);
          });
        console.log(this.produccion.colaboradores);
      } else {
        console.log("Modificando producto");
        this.produccion.id = this.idProduccion;
        this.productoService.modificarProducto(this.produccion)
          .catch(function (error) {
            this.notifier.notify("error", "Error con la conexión a la base de datos");
            console.error("Error al añadir documento: ", error);
          });
        if (this.archivo != null) {
          this.productoService.subirArchivo(this.archivo.item(0), this.idProduccion, this.cargaDeArchivo);
        }
        this.notifier.notify("success", "Produccion modificada exitosamente");
        console.log(this.produccion.colaboradores);
      }
    } else {
      this.notifier.notify("warning", "Datos incompletos o inválidos");
    }
  }

  public cancelarEdicion() {
    if (!isNullOrUndefined(this.produccion.id)) {
      this.llenarCampos();
    } else {
      this.nuevaProduccion = !this.nuevaProduccion;
      this.creacionCancelada.emit(false);
    }
  }

  public setFechaPublicacion(event: MatDatepickerInputEvent<Date>) {
    this.produccion.fechaPublicacion = firebase.firestore.Timestamp.fromDate(event.value);
  }

}