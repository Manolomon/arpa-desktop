import { Component, OnInit, Input, Output, EventEmitter, OnChanges, SimpleChange } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Tesis } from '../../models/TesisInterface';
import { ProductoService } from '../../servicios/productos.service';
import { NgForm } from '@angular/forms/src/directives/ng_form';
import { MiembroService } from '../../servicios/miembro.service';
import * as firebase from 'firebase';
import { isNullOrUndefined, isUndefined } from 'util';
import { MatDatepickerInputEvent, MatDialog } from '@angular/material';
import { NotifierService } from "angular-notifier";
import { ColaboradorComponent } from '../colaborador/colaborador.component';

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
  private considerar: boolean;
  private btnEvidenciaControl: FormControl = new FormControl();
  private colaboradoresControl: FormControl = new FormControl();
  private estadoControl: FormControl = new FormControl();
  private colaboradoresExternosControl: FormControl = new FormControl();
  private gradoControl: FormControl = new FormControl('', [Validators.required]);
  private fechaInicioControl: FormControl = new FormControl('', [Validators.required, Validators.maxLength(0)]);
  private fechaTerminoControl: FormControl = new FormControl('', [Validators.required, Validators.maxLength(0)]);
  private colaboradoresExternos: string[] = [];
  private colaboradoresLista: string[] = [];
  private lgac: string[] = [];
  private refColaboladores = new Map();
  private colaboradoresSeleccionados: string[] = [];

  @Input() private tesisObjeto: any;
  @Input() private habilitaCampos: boolean;
  @Input() private eliminarProducto: boolean;
  @Input() private nuevaTesis: boolean;
  @Output() private creacionCancelada = new EventEmitter<boolean>(false);
  @Output() private cargarProductos = new EventEmitter<boolean>(false);
  @Output() private edicionCancelada = new EventEmitter<boolean>(false);

  private actualYear = new Date().getFullYear();
  private minDate = new Date(2010, 1, 1);
  private maxDate = new Date(this.actualYear + 7, 31, 12);

  public tesis: Tesis = {
    titulo: '',
    estado: '',
    tipo: 'tesis',
    consideradoPCA: false,
    grado: '',
    numAlumnos: 0,
    lineaGeneracion: '',
    colaboradores: [],
    colaboradoresExternos: [],
    evidencia: '',
  };

  constructor(
    private productoService: ProductoService,
    private miembroService: MiembroService,
    private notifier: NotifierService,
    public dialog: MatDialog,
  ) {
    this.tesisForm = new FormGroup({
      tituloControl: new FormControl('', [Validators.required, Validators.minLength(2)]),
      lineaGeneracionControl: new FormControl('', [Validators.required, Validators.minLength(2)]),
      numAlumnosControl: new FormControl('', [Validators.required]),
      btnConsideradoControl: new FormControl(''),
    });
    this.tesisForm.addControl("estadoControl", this.estadoControl);
    this.tesisForm.addControl("gradoControl", this.gradoControl);
    this.tesisForm.addControl("colaboradoresControl", this.colaboradoresControl);
    this.tesisForm.addControl("colaboradoresExternosControl", this.colaboradoresExternosControl);
    this.considerar = false;
  }

  public llenarCampos() {
    this.tesis.id = this.tesisObjeto.id;
    this.tesis.titulo = this.tesisObjeto.titulo;
    this.tesis.estado = this.tesisObjeto.estado;
    this.tesis.tipo = this.tesisObjeto.tipo;
    this.tesis.consideradoPCA = this.tesisObjeto.consideradoPCA;
    this.considerar = this.tesisObjeto.consideradoPCA;
    this.tesis.fechaInicio = this.tesisObjeto.fechaInicio;
    this.tesis.fechaTermino = this.tesisObjeto.fechaTermino;
    this.tesis.grado = this.tesisObjeto.grado;
    this.tesis.numAlumnos = this.tesisObjeto.numAlumnos;
    this.tesis.lineaGeneracion = this.tesisObjeto.lineaGeneracion;
    this.idTesis = this.tesisObjeto.id;
    this.tesis.registrado = this.tesisObjeto.registrado;
    this.tesis.evidencia = this.tesisObjeto.evidencia;
    this.tesis.colaboradores = this.tesisObjeto.colaboradores;
    this.tesis.colaboradoresExternos = this.tesisObjeto.colaboradoresExternos;
  }

  public ngOnInit() {
    if (!isNullOrUndefined(this.tesisObjeto)) {
      this.llenarCampos();
      this.fechaTerminoControl = new FormControl(this.tesis.fechaTermino.toDate(), [Validators.required, Validators.maxLength(0)]);
      this.fechaInicioControl = new FormControl(this.tesis.fechaInicio.toDate(), [Validators.required, Validators.maxLength(0)]);
    }
    this.tesisForm.addControl("fechaTerminoControl", this.fechaTerminoControl);
    this.tesisForm.addControl("fechaInicioControl", this.fechaInicioControl);
    if (this.habilitaCampos) {
      this.tesisForm.enable();
    } else {
      this.tesisForm.disable();
    }

    this.colaboradoresLista = [];
    var colaboradoresLista = this.colaboradoresLista;
    var refColaboladores = this.refColaboladores;
    var colaboradoresSeleccionados = this.colaboradoresSeleccionados;
    var colaboradores = this.tesis.colaboradores;
    this.miembroService.obtenerMiembros().then(function (querySnapshot) {
      querySnapshot.forEach(function (doc) {
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
    console.log(this.idTesis);
    console.log(this.tesis.titulo);

    this.actualizarColaboradoresExternos();
  }

  public ngOnChanges(changes: { [propKey: string]: SimpleChange }) {
    if (this.habilitaCampos) {
      this.tesisForm.enable();
    } else {
      this.tesisForm.disable();
    }
  }

  public pasarReferencias() {
    this.tesis.colaboradores = [];
    for (let nombre of this.colaboradoresSeleccionados) {
      if (this.refColaboladores.has(nombre)) {
        this.tesis.colaboradores.push(this.refColaboladores.get(nombre));
      }
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

  public onChange(event) {
    this.tesis.consideradoPCA = !this.considerar;
    this.considerar = !this.considerar;
    console.log("Consideracion cambiada");
  }

  async onGuardarTesis(myForm: NgForm) {
    this.cargaDeArchivo = 0;
    if (this.tesisForm.valid) {
      let idGenerado: string;
      this.pasarReferencias();
      if (isNullOrUndefined(this.tesis.fechaInicio) ||
        isNullOrUndefined(this.tesis.fechaTermino) ||
        !this.fechaValida()) {
        this.notifier.notify("warning", "Datos incompletos o inválidos");
        return;
      }
      if (isNullOrUndefined(this.tesis.id)) {
        console.log("Agregando producto");
        this.tesis.registrado = firebase.firestore.Timestamp.fromDate(new Date());
        await this.productoService.agregarProducto(this.tesis)
          .then((docRef) => {
            idGenerado = docRef.id;
            console.log(idGenerado);
            if (this.archivo != null) {
              this.productoService.subirArchivo(this.archivo.item(0), idGenerado, this.cargaDeArchivo);
            }
            console.log(this.tesis.colaboradores);
            this.cargarProductos.emit(false);
            this.creacionCancelada.emit(false);
            this.notifier.notify("success", "Tesis almacenada exitosamente");
          })
          .catch((error) => {
            this.notifier.notify("error", "Error con la conexión a la base de datos");
            console.error("Error al añadir documento: ", error);
            return;
          });
      } else {
        console.log("Modificando producto");
        this.tesis.id = this.idTesis;
        await this.productoService.modificarProducto(this.tesis)
          .then((docRef) => {
            if (this.archivo != null) {
              this.productoService.subirArchivo(this.archivo.item(0), this.idTesis, this.cargaDeArchivo);
            }
            console.log(this.tesis.colaboradores);
            this.cargarProductos.emit(false);
            this.creacionCancelada.emit(false);
            this.notifier.notify("success", "Tesis modificada exitosamente");
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
    console.log("cancelando edicion");
    if (!isNullOrUndefined(this.tesis.id)) {
      console.log(this.tesis.id);
      this.habilitaCampos = false;
      this.ngOnInit();
      this.edicionCancelada.emit(false);
    } else {
      console.log("cancelado 2");
      this.nuevaTesis = !this.nuevaTesis;
      this.creacionCancelada.emit(false);
    }
  }

  public setFechaInicio(event: MatDatepickerInputEvent<Date>) {
    this.tesis.fechaInicio = null;
    try {
      this.tesis.fechaInicio = firebase.firestore.Timestamp.fromDate(event.value);
    } catch (exception) {
      this.notifier.notify("warning", "La fecha de inicio no es válida");
      this.tesis.fechaInicio = firebase.firestore.Timestamp.fromDate(new Date());
    }
  }
  public setFechaFin(event: MatDatepickerInputEvent<Date>) {
    try {
      this.tesis.fechaTermino = firebase.firestore.Timestamp.fromDate(event.value);
    } catch (exception) {
      this.notifier.notify("warning", "La fecha de finalización no es válida");
      this.tesis.fechaTermino = firebase.firestore.Timestamp.fromDate(new Date());
    }
  }

  private actualizarColaboradoresExternos() {
    this.colaboradoresExternos = [];
    const listaExternos = this.colaboradoresExternos;
    this.miembroService.obtenerColaboradoresExternos(this.miembroService.getMiembroActivo().id).then((querySnapshot) => {
        querySnapshot.forEach((doc) => {
          const temporal: any = doc.data();
          const colaborador: string = temporal.nombre + " - " + temporal.institucion + " - " + temporal.grado;
          console.log(colaborador);
          listaExternos.push(colaborador);
        });
    });
    this.colaboradoresExternos = listaExternos;
  }

  public agregarColaborador() {
    const dialogRef = this.dialog.open(ColaboradorComponent, {
      width: '120%',
      data: { grado: '', nombre: '', institucion: '' }
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.actualizarColaboradoresExternos();
	      this.notifier.notify("success", "Colaboradores externos actualizados");
      }
    });
  }

  private fechaValida(): boolean {
    let anioVal = this.tesis.fechaInicio.toDate().getFullYear();
    let anioVal2 = this.tesis.fechaTermino.toDate().getFullYear();
    let monthVal = this.tesis.fechaInicio.toDate().getMonth();
    let monthVal2 = this.tesis.fechaTermino.toDate().getMonth();
    let dayVal = this.tesis.fechaInicio.toDate().getDay();
    let dayVal2 = this.tesis.fechaTermino.toDate().getDay();

    if (anioVal > anioVal2) {
      console.log("año 1 mayor");
      return false;
    } else if (anioVal == anioVal2) {
      if (monthVal > monthVal2) {
        console.log("mes 1 mayor")
        return false;
      } else if (monthVal == monthVal2) {
        if (dayVal > dayVal2) {
          console.log("dia1 mayor");
          return false;
        } else if (dayVal == dayVal2) {
          console.log("dias iguales");
          return false;
        }
      }
    }
    return true;
  }
}
