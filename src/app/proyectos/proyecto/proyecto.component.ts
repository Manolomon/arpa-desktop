import { Component, OnInit, OnChanges, Input, SimpleChange, EventEmitter, Output } from '@angular/core';
import { ProyectoService } from '../../servicios/proyecto.service';
import { Proyecto } from '../../models/ProyectoInterface';
import { NotifierService } from 'angular-notifier';
import { NgForm, FormGroup, FormControl, Validators } from '@angular/forms'
import { isNullOrUndefined } from 'util';
import * as firebase from 'firebase';
import { MatDatepickerInputEvent } from '@angular/material';
import { Miembro } from '../../models/MiembroInterface';
import { ProductoService } from '../../servicios/productos.service';
import { MiembroService } from '../../servicios/miembro.service';

@Component({
  selector: 'app-proyecto',
  templateUrl: './proyecto.component.html',
  styleUrls: ['./proyecto.component.scss']
})
export class ProyectoComponent implements OnInit, OnChanges {

  @Input() private proyectoObjeto: Proyecto;
  @Input() private miembroObjeto: Miembro;
  @Input() private habilitaCampos: boolean;
  @Input() private nuevoProyecto: boolean;
  @Output() private creacionCancelada = new EventEmitter<boolean>(false);
  @Output() private cargarProyectos = new EventEmitter<boolean>(false);
  @Output() private edicionCancelada = new EventEmitter<boolean>(false);

  private proyectoForm: FormGroup;
  private fechaInicioControl: FormControl = new FormControl('', [Validators.required]);
  private fechaFinControl: FormControl = new FormControl('', [Validators.required]);
  private productosControl: FormControl = new FormControl('');
  private productosSeleccionados: string[] = [];
  private productosLista: string[] = [];
  private refProductos = new Map();
  private considerar: boolean;
  private noProductos: Number;
  private productosProyecto: Array<any> = [];
  private actualYear = new Date().getFullYear();
  private minDate = new Date(2010, 1, 1);
  private maxDate = new Date(this.actualYear + 7, 31, 12);

  private proyecto: Proyecto = {
    nombre: '',
    consideradoPCA: false,
    actividadesRealizadas: '',
    descripcion: '',
    idCreador: '',
    productos: [],
  }

  constructor(
    private proyectoService: ProyectoService,
    private notifier: NotifierService,
    private productoService: ProductoService,
    private miembroService: MiembroService,
  ) {
    this.proyectoForm = new FormGroup({
      nombreControl: new FormControl('', [Validators.required, Validators.minLength(2)]),
      descripcionControl: new FormControl('', [Validators.required, Validators.minLength(2)]),
      actividadesControl: new FormControl('', [Validators.required, Validators.minLength(2)]),
      btnConsideradoControl: new FormControl(''),
    });
    this.proyectoForm.addControl("productosControl", this.productosControl);
    this.considerar = false;
    this.proyecto.productos = [];
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

    this.productosLista = [];
    var productosLista = this.productosLista;
    var refProductos = this.refProductos;
    var productosSeleccionados = this.productosSeleccionados;
    var productos = this.proyecto.productos;
    var productosProyecto: Array<any> = [];
    this.productoService.obtenerProductosMiembro(this.miembroService.getMiembroActivo())
      .then((querySnapshot) => {
        querySnapshot.forEach((doc) => {
          const temporal: any = doc.data();
          productosLista.push(temporal.titulo);
          refProductos.set(temporal.titulo, doc.ref);
          for (let docRef of productos) {
            if (docRef.id == doc.ref.id) {
              let productoAux = { titulo: '', tipo: '' };
              productoAux.titulo = temporal.titulo;
              productoAux.tipo = temporal.tipo;
              productosProyecto.push(productoAux);
              productosSeleccionados.push(temporal.titulo);
            }
          }
        });
      });
    this.productosProyecto = productosProyecto;
    this.productosLista = productosLista;
    this.refProductos = refProductos;
    this.productosSeleccionados = productosSeleccionados;
    console.log("productos");
    console.log(this.proyecto.productos);


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
    this.proyecto.productos = this.proyectoObjeto.productos;
    console.log(this.proyectoObjeto.productos);
  }

  public onChange(event) {
    this.proyecto.consideradoPCA = !this.considerar;
    this.considerar = !this.considerar;
    console.log("Consideracion cambiada");
  }

  public async onGuardarProyecto(myForm: NgForm) {
    if (this.proyectoForm.valid) {
      this.proyecto.productos = [];
      this.pasarReferencias();
      console.log(this.productosSeleccionados);
      this.proyecto.idCreador = this.miembroObjeto.id;
      let idGenerado: string;
      if (isNullOrUndefined(this.proyecto.fechaInicio) ||
        isNullOrUndefined(this.proyecto.fechaTentativaFin) ||
        !this.fechaValida()
      ) {
        this.notifier.notify("warning", "Datos incompletos o inválidos");
        return;
      }
      if (isNullOrUndefined(this.proyecto.id)) {
        this.proyectoService.agregarProyecto(this.proyecto)
          .then((docRef) => {
            idGenerado = docRef.id;
            console.log(idGenerado);
            if (!isNullOrUndefined(idGenerado)) {
              this.cargarProyectos.emit(false);
              this.creacionCancelada.emit(false);
              this.notifier.notify("success", "Proyecto agregado a la base de datos");
            }
          })
          .catch((err) => {
            this.notifier.notify("error", "Error con la conexión a la base de datos");
            console.error("Error al añadir el documento: ", err);
          });

      } else {
        this.proyectoService.modificarProyecto(this.proyecto)
          .then(() => {
            this.notifier.notify("success", "Proyecto agregado a la base de datos");
            this.cargarProyectos.emit(false);
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
      this.proyectoForm.disable();
      this.edicionCancelada.emit(true);
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

  private fechaValida(): boolean {
    let anioVal = this.proyecto.fechaInicio.toDate().getFullYear();
    let anioVal2 = this.proyecto.fechaTentativaFin.toDate().getFullYear();
    let monthVal = this.proyecto.fechaInicio.toDate().getMonth();
    let monthVal2 = this.proyecto.fechaTentativaFin.toDate().getMonth();
    let dayVal = this.proyecto.fechaInicio.toDate().getDay();
    let dayVal2 = this.proyecto.fechaTentativaFin.toDate().getDay();

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

  private pasarReferencias() {
    for (let producto of this.productosSeleccionados) {
      if (this.refProductos.has(producto)) {
        this.proyecto.productos.push(this.refProductos.get(producto));
      }
    }
  }

}
