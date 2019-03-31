import { Component, OnInit, Input, Output, EventEmitter, OnChanges, SimpleChange } from '@angular/core';
import { FormControl, FormGroup, Validators, Form } from '@angular/forms';
import { Articulo } from '../models/ArticuloInterface';
import { ProductoService } from '../servicios/productos.service';
import { NgForm } from '@angular/forms/src/directives/ng_form';
import { MiembroService } from '../servicios/miembro.service';
import * as firebase from 'firebase';
import { isNullOrUndefined, isUndefined } from 'util';
import { NotifierService } from "angular-notifier";

@Component({
  selector: 'app-articulo',
  templateUrl: './articulo.component.html',
  styleUrls: ['./articulo.component.scss']
})
export class ArticuloComponent implements OnInit {



  @Input() private articuloObjeto: any;
  @Input() private habilitaCampos: boolean;
  @Input() private eliminarProducto: boolean;
  @Input() private nuevoArticulo: boolean;
  @Output() private creacionCancelada = new EventEmitter<boolean>();

  private idArticulo: string;
  private cargaDeArchivo: number;
  private archivo: FileList;
  private articuloForm: FormGroup;
  private evidencia = "Evidencia";
  private btnEvidenciaControl: FormControl = new FormControl();
  private colaboradoresControl: FormControl = new FormControl();
  private colaboradoresExternosControl: FormControl = new FormControl();
  private estadoControl: FormControl = new FormControl('', [Validators.required]);
  private tipoArticuloControl: FormControl = new FormControl('', Validators.required);
  private colaboradores: string[] = [];
  private lgac: string[] = [];

  private llenarCampos() {
    this.articulo.titulo = this.articuloObjeto.titulo;
    this.articulo.estado = this.articuloObjeto.estado;
    this.articulo.tipo = this.articuloObjeto.tipo;
    this.articulo.consideradoPCA = this.articuloObjeto.consideradoPCA;
    this.articulo.year = this.articuloObjeto.year;
    this.articulo.descripcion = this.articuloObjeto.descripcion;
    this.articulo.direccionElectronica = this.articuloObjeto.direccionELectronica;
    this.articulo.editorial = this.articuloObjeto.editorial;
    this.articulo.indice = this.articuloObjeto.indice;
    this.articulo.tipoArticulo = this.articuloObjeto.tipoArticulo;
    this.articulo.nombreRevista = this.articuloObjeto.nombreRevista;
    this.articulo.ISSN = this.articuloObjeto.ISSN;
    this.articulo.paginaInicio = this.articuloObjeto.paginaInicio;
    this.articulo.paginaFin = this.articuloObjeto.paginaFin;
    this.articulo.pais = this.articuloObjeto.pais;
    this.articulo.proposito = this.articuloObjeto.proposito;
    this.articulo.volumen = this.articuloObjeto.volumen;
    this.articulo.evidencia = this.articuloObjeto.evidencia;
    this.articulo.colaboradores = this.articuloObjeto.colaboradores;
  }

  public articulo: Articulo = {
    titulo: '',
    estado: '',
    tipo: 'articulo',
    consideradoPCA: false,
    year: 0,
    descripcion: '',
    direccionElectronica: '',
    editorial: '',
    indice: '',
    tipoArticulo: '',
    nombreRevista: '',
    ISSN: '',
    paginaInicio: 0,
    paginaFin: 0,
    pais: '',
    proposito: '',
    volumen: 0,
  };

  constructor(
    private productoService: ProductoService,
    private miembroService: MiembroService,
    private notifier: NotifierService,
  ) {
    this.articuloForm = new FormGroup({
      tituloControl: new FormControl('', [Validators.required, Validators.minLength(2)]),
      descripcionControl: new FormControl('', [Validators.required, Validators.minLength(2), Validators.maxLength(2500)]),
      issnControl: new FormControl('', [Validators.required, Validators.minLength(2)]),
      yearControl: new FormControl('', [Validators.required, Validators.min(1900)]),
      volumenControl: new FormControl('', [Validators.required, Validators.min(1)]),
      propositoControl: new FormControl('', [Validators.required, Validators.minLength(2)]),
      paginaInicioControl: new FormControl('', [Validators.required, Validators.min(1)]),
      paginaFinControl: new FormControl('',
        [Validators.required, Validators.min(2)]),
      paisControl: new FormControl('', [Validators.required, Validators.minLength(2)]),
      autorControl: new FormControl('', [Validators.required, Validators.minLength(2)]),
      nombreRevistaControl: new FormControl('', [Validators.required, Validators.minLength(2)]),
      editorialControl: new FormControl('', [Validators.required, Validators.minLength(2)]),
      indiceControl: new FormControl('', [Validators.minLength(2)]),
      direccionElectronicaControl: new FormControl('', [Validators.minLength(2)]),
    });
    this.articuloForm.addControl("colaboradoresControl", this.colaboradoresControl);
    this.articuloForm.addControl("btnEvidenciaControl", this.btnEvidenciaControl);
    this.articuloForm.addControl("colaboradoresExternosControl", this.colaboradoresExternosControl);
    this.articuloForm.addControl("estadoControl", this.estadoControl);
    this.articuloForm.addControl("tipoArticuloControl", this.tipoArticuloControl);

  }

  public ngOnInit() {
    if (!isNullOrUndefined(this.articuloObjeto)) {
      this.llenarCampos();
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
  }

  public ngOnChanges(changes: { [propKey: string]: SimpleChange }) {
    if (this.habilitaCampos) {
      this.articuloForm.enable();
    } else {
      this.articuloForm.disable();
    }
    if (this.eliminarProducto) {
      this.productoService.eliminarProducto(this.idArticulo)
      .catch(function(error) {
        this.notifier.notify("error", "Error con la conexión a la base de datos");
      });
      console.log("Eliminando producto con id: "+ this.idArticulo);
      this.notifier.notify("success", "Producto eliminado correctamente");
    }
  }

  public hasError = (controlName: string, errorName: string) => {
    return this.articuloForm.controls[controlName].hasError(errorName);
  }

  public detectarArchivos(event) {
    this.archivo = event.target.files;
    console.log(this.archivo.item(0).size);
    this.evidencia = this.archivo.item(0).name;
    this.articulo.evidencia = this.evidencia;
  }

  public onChange(event) {
    this.articulo.consideradoPCA = !this.articulo.consideradoPCA;
    console.log("Consideracion cambiada");
  }

  public onGuardarArticulo(myForm: NgForm) {
    this.cargaDeArchivo = 0;
    if (this.articuloForm.valid) {
      let idGenerado: string;
      console.log(this.idArticulo);
      if (isUndefined(this.idArticulo)) {
        console.log("Agregando producto");
        this.articulo.registrado = firebase.firestore.Timestamp.fromDate(new Date());
        this.productoService.agregarProducto(this.articulo)
          .then(function (docRef) {
            idGenerado = docRef.id;
            console.log(idGenerado);
            if (this.archivo != null) {
              this.productoService.subirArchivo(this.archivo.item(0), idGenerado, this.cargaDeArchivo);
            }
            this.notifier.notify("success", "Artículo almacenado exitosamente");
          })
          .catch(function (error) {
            this.notifier.notify("error", "Error con la conexión a la base de datos");
            console.error("Error al añadir documento: ", error);
          });
        console.log(this.articulo.colaboradores);
      } else {
        console.log("Modificando producto");
        this.articulo.id = this.idArticulo;
        this.productoService.modificarProducto(this.articulo)
          .catch(function (error) {
            this.notifier.notify("error", "Error con la conexión a la base de datos");
            console.error("Error al añadir documento: ", error);
          });
        if (this.archivo != null) {
          this.productoService.subirArchivo(this.archivo.item(0), this.idArticulo, this.cargaDeArchivo);
        }
        this.notifier.notify("success", "Artículo modificado exitosamente");
        console.log(this.articulo.colaboradores);
      }
    } else {
      this.notifier.notify("warning", "Datos incompletos o inválidos");
    }
  }

  public cancelarEdicion() {
    if (!isNullOrUndefined(this.articulo.id)) {
      this.llenarCampos();
    } else {
      this.nuevoArticulo = !this.nuevoArticulo;
      this.creacionCancelada.emit(false);
    }
  }
}
