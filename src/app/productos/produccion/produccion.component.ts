import { Component, OnInit, Input, Output, EventEmitter, SimpleChange } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Produccion } from '../../models/ProduccionInterface';
import { ProductoService } from '../../servicios/productos.service';
import { NgForm } from '@angular/forms/src/directives/ng_form';
import { MiembroService } from '../../servicios/miembro.service';
import * as firebase from 'firebase';
import { isNullOrUndefined, isUndefined } from 'util';
import { MatDatepickerInputEvent, MatDialog } from '@angular/material';
import { NotifierService } from "angular-notifier";
import { ColaboradorComponent } from '../colaborador/colaborador.component';

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
  private considerar: boolean;
  private colaboradoresControl: FormControl = new FormControl();
  private colaboradoresExternosControl: FormControl = new FormControl();
  private fechaPublicacionControl: FormControl = new FormControl('', [Validators.required, Validators.maxLength(0)]);
  private btnConsideradoControl: FormControl = new FormControl();
  private colaboradoresLista: string[] = [];
  private lgac: string[] = [];
  private refColaboladores = new Map();
  private colaboradoresSeleccionados: string[] = [];

  @Input() private produccionObjeto: any;
  @Input() private habilitaCampos: boolean;
  @Input() private eliminarProducto: boolean;
  @Input() private nuevaProduccion: boolean;
  @Output() private creacionCancelada = new EventEmitter<boolean>(false);
  @Output() private cargarProductos = new EventEmitter<boolean>(false);
  @Output() private edicionCancelada = new EventEmitter<boolean>(false);

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
    public dialog: MatDialog,
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
    this.cargaDeArchivo = 0;
    this.considerar = false;
  }

  public llenarCampos() {
    this.produccion.clasificacion = this.produccionObjeto.clasificacion;
    this.produccion.colaboradores = this.produccionObjeto.colaboradores;
    this.produccion.consideradoPCA = this.produccionObjeto.consideradoPCA;
    this.considerar = this.produccionObjeto.consideradoPCA;
    this.produccion.descripcion = this.produccionObjeto.descripcion;
    this.produccion.estado = this.produccionObjeto.estado;
    this.produccion.evidencia = this.produccionObjeto.evidencia;
    this.produccion.fechaPublicacion = this.produccionObjeto.fechaPublicacion;
    this.produccion.id = this.produccionObjeto.id;
    this.idProduccion = this.produccionObjeto.id;
    this.produccion.lineaGeneracion = this.produccionObjeto.lineaGeneracion;
    this.produccion.numRegistro = this.produccionObjeto.numRegistro;
    this.produccion.pais = this.produccionObjeto.pais;
    this.produccion.proposito = this.produccionObjeto.proposito;
    this.produccion.titulo = this.produccionObjeto.titulo;
    this.produccion.uso = this.produccionObjeto.uso;
    this.produccion.usuario = this.produccionObjeto.usuario;
  }

  public ngOnInit() {
    if (!isNullOrUndefined(this.produccionObjeto)) {
      this.llenarCampos();
      this.fechaPublicacionControl = new FormControl(this.produccion.fechaPublicacion.toDate(), [Validators.required, Validators.maxLength(0)]);
    }
    this.produccionForm.addControl("fechaPublicacionControl", this.fechaPublicacionControl);

    if (this.habilitaCampos) {
      this.produccionForm.enable();
    } else {
      this.produccionForm.disable();
    }

    this.colaboradoresLista = [];
    var colaboradoresLista = this.colaboradoresLista;
    var refColaboladores = this.refColaboladores;
    var colaboradoresSeleccionados = this.colaboradoresSeleccionados;
    var colaboradores = this.produccion.colaboradores;
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
      console.log("Eliminando producto con id: " + this.idProduccion);
      this.notifier.notify("success", "Producto eliminado correctamente");
    }
  }

  public pasarReferencias() {
    for (let nombre of this.colaboradoresSeleccionados) {
      if (this.refColaboladores.has(nombre)) {
        this.produccion.colaboradores.push(this.refColaboladores.get(nombre));
      }
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

  public onChange(event) {
    this.produccion.consideradoPCA = !this.considerar;
    this.considerar = !this.considerar;
    console.log("Consideracion cambiada");
  }

  async onGuardarProduccion(myForm: NgForm) {
    this.cargaDeArchivo = 0;
    if (this.produccionForm.valid) {
      let idGenerado: string;
      this.pasarReferencias();
      if (isNullOrUndefined(this.produccion.fechaPublicacion)) {
        this.notifier.notify("warning", "Datos incompletos o inválidos");
        return 0;
      }
      if (isNullOrUndefined(this.idProduccion)) {
        console.log("Agregando producto");
        this.produccion.registrado = firebase.firestore.Timestamp.fromDate(new Date());
        await this.productoService.agregarProducto(this.produccion)
          .then((docRef) => {
            idGenerado = docRef.id;
            console.log(idGenerado);
            if (this.archivo != null) {
              this.productoService.subirArchivo(this.archivo.item(0), idGenerado, this.cargaDeArchivo);
            }
          })
          .catch(function(error) {
            this.notifier.notify("error", "Error con la conexión a la base de datos");
            console.error("Error al añadir documento: ", error);
            return;
          });
        console.log(this.produccion.colaboradores);
        this.cargarProductos.emit(false);
        this.creacionCancelada.emit(false);
        this.notifier.notify("success", "Producción almacenada exitosamente");
      } else {
        console.log("Modificando producto");
        this.produccion.id = this.idProduccion;
        await this.productoService.modificarProducto(this.produccion)
          .catch(function(error) {
            this.notifier.notify("error", "Error con la conexión a la base de datos");
            console.error("Error al añadir documento: ", error);
            return;
          });
        if (this.archivo != null) {
          this.productoService.subirArchivo(this.archivo.item(0), this.idProduccion, this.cargaDeArchivo);
        }
        console.log(this.produccion.colaboradores);
        this.cargarProductos.emit(false);
        this.creacionCancelada.emit(false);
        this.notifier.notify("success", "Producción modificada exitosamente");
      }
    } else {
      this.notifier.notify("warning", "Datos incompletos o inválidos");
    }
  }

  public cancelarEdicion() {
    if (!isNullOrUndefined(this.produccion.id)) {
      this.habilitaCampos = false;
      this.ngOnInit();
      this.edicionCancelada.emit(false);
    } else {
      this.nuevaProduccion = !this.nuevaProduccion;
      this.creacionCancelada.emit(false);
    }
  }

  public setFechaPublicacion(event: MatDatepickerInputEvent<Date>) {
    this.produccion.fechaPublicacion = firebase.firestore.Timestamp.fromDate(event.value);
  }

  public agregarColaborador() {
    var resultado: boolean
    const dialogRef = this.dialog.open(ColaboradorComponent, {
      width: '250px',
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
