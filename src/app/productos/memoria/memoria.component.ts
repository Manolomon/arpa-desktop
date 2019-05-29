import { Component, OnInit, Input, Output, EventEmitter, OnChanges, SimpleChange } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Memoria } from '../../models/MemoriaInterface'
import { ProductoService } from '../../servicios/productos.service';
import { NgForm } from '@angular/forms/src/directives/ng_form';
import { MiembroService } from '../../servicios/miembro.service';
import * as firebase from 'firebase';
import { isNullOrUndefined, isUndefined } from 'util';
import { MatDatepickerInputEvent, MatDialog } from '@angular/material';
import { NotifierService } from "angular-notifier";
import { ColaboradorComponent } from '../colaborador/colaborador.component';

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
  private colaboradoresLista: string[] = [];
  private lgac: string[] = [];
  private refColaboladores = new Map();
  private colaboradoresSeleccionados: string[] = [];

  @Input() private memoriaObjeto: any;
  @Input() private habilitaCampos: boolean;
  @Input() private eliminarProducto: boolean;
  @Input() private nuevaMemoria: boolean;
  @Output() private creacionCancelada = new EventEmitter<boolean>(false);
  @Output() private cargarProductos = new EventEmitter<boolean>(false);
  @Output() private edicionCancelada = new EventEmitter<boolean>(false);

  private actualYear = new Date().getFullYear();
  private minDate = new Date(2010, 1, 1);
  private maxDate = new Date(this.actualYear + 7, 31, 12);

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
    colaboradores: [],
    evidencia: '',
  }

  constructor(
    private productoService: ProductoService,
    private miembroService: MiembroService,
    private notifier: NotifierService,
    public dialog: MatDialog,
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

    this.colaboradoresLista = [];
    var colaboradoresLista = this.colaboradoresLista;
    var refColaboladores = this.refColaboladores;
    var colaboradoresSeleccionados = this.colaboradoresSeleccionados;
    var colaboradores = this.memoria.colaboradores;
    this.miembroService.obtenerMiembros().then(function(querySnapshot) {
      querySnapshot.forEach(function(doc) {
        const temporal: any = doc.data();
        colaboradoresLista.push(temporal.nombre);
        refColaboladores.set(temporal.nombre, doc.ref);
        for (let docRef of colaboradores) {
          if (docRef.id == doc.ref.id) {
            colaboradoresSeleccionados.push(temporal.nombre);
          }
        }
      });
    });
    this.colaboradoresLista = colaboradoresLista;
    this.refColaboladores = refColaboladores;
    this.colaboradoresSeleccionados = colaboradoresSeleccionados;

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
  }

  public pasarReferencias() {
    this.memoria.colaboradores = [];
    for (let nombre of this.colaboradoresSeleccionados) {
      if (this.refColaboladores.has(nombre)) {
        this.memoria.colaboradores.push(this.refColaboladores.get(nombre));
      }
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

  async onGuardarMemoria(myForm: NgForm) {
    this.cargaDeArchivo = 0;
    if (this.memoriaForm.valid) {
      let idGenerado: string;
      this.pasarReferencias();
      if (isNullOrUndefined(this.memoria.fechaPublicacion)) {
        this.notifier.notify("warning", "Datos incompletos o inválidos");
        return 0;
      }
      if (isNullOrUndefined(this.idMemoria)) {
        console.log("Agregando producto");
        this.memoria.registrado = firebase.firestore.Timestamp.fromDate(new Date());
        await this.productoService.agregarProducto(this.memoria)
          .then((docRef) => {
            idGenerado = docRef.id;
            console.log(idGenerado);
            if (this.archivo != null) {
              this.productoService.subirArchivo(this.archivo.item(0), idGenerado, this.cargaDeArchivo);
            }
            console.log(this.memoria.colaboradores);
            this.cargarProductos.emit(false);
            this.creacionCancelada.emit(false);
            this.notifier.notify("success", "Memoria almacenada exitosamente");
          })
          .catch(function(error) {
            this.notifier.notify("error", "Error con la conexión a la base de datos");
            console.error("Error al añadir documento: ", error);
            return;
          });

      } else {
        console.log("Modificando producto");
        this.memoria.id = this.idMemoria;
        await this.productoService.modificarProducto(this.memoria)
          .then((docRef) => {
            if (this.archivo != null) {
              this.productoService.subirArchivo(this.archivo.item(0), this.idMemoria, this.cargaDeArchivo);
            }
            console.log(this.memoria.colaboradores);
            this.cargarProductos.emit(false);
            this.creacionCancelada.emit(false);
            this.notifier.notify("success", "Memoria modificada exitosamente");
          })
          .catch((error) => {
            this.notifier.notify("error", "Error con la conexión a la base de datos");
            console.error("Error al añadir documento: ", error);
            return;
          });
      }
    } else {
      this.notifier.notify("warning", "Datos incompletos o inválidos");
    }
  }

  public cancelarEdicion() {
    if (!isNullOrUndefined(this.memoria.id)) {
      this.habilitaCampos = false;
      this.ngOnInit();
      this.edicionCancelada.emit(false);
    } else {
      this.nuevaMemoria = !this.nuevaMemoria;
      this.creacionCancelada.emit(false);
    }
  }

  public setFechaPublicacion(event: MatDatepickerInputEvent<Date>) {
    this.memoria.fechaPublicacion = firebase.firestore.Timestamp.fromDate(event.value);
  }

  public agregarColaborador() {
    var resultado: boolean
    const dialogRef = this.dialog.open(ColaboradorComponent, {
      width: '120%',
      data: { grado: '', nombre: '', institucion: '' }
    });
    dialogRef.afterClosed().subscribe(result => {
      resultado = result;
      if (result) {
        this.ngOnInit();
      }
    });
  }
}
