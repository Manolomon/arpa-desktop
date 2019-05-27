import { Component, OnInit, Input, Output, EventEmitter, OnChanges, SimpleChange } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Capitulo } from '../../models/CapituloInterface';
import { ProductoService } from '../../servicios/productos.service';
import { NgForm } from '@angular/forms/src/directives/ng_form';
import { MiembroService } from '../../servicios/miembro.service';
import * as firebase from 'firebase';
import { isNullOrUndefined, isUndefined } from 'util';
import { NotifierService } from "angular-notifier";


@Component({
  selector: "app-capitulo",
  templateUrl: "./capitulo.component.html",
  styleUrls: ["./capitulo.component.scss"],
})

export class CapituloComponent implements OnInit, OnChanges {

  private minYear: number;
  private minLengthChar: number;
  private idCapitulo: string;
  private cargaDeArchivo: number;
  private archivo: FileList;
  private capituloForm: FormGroup;
  private evidencia = "Evidencia";
  private considerar: boolean;
  private btnEvidenciaControl: FormControl = new FormControl();
  private colaboradoresControl: FormControl = new FormControl();
  private colaboradoresExternosControl: FormControl = new FormControl();
  private colaboradoresLista: string[] = [];
  private lgac: string[] = [];
  private refColaboladores = new Map();
  private colaboradoresSeleccionados: string[] = [];

  @Input() private capituloObjeto: any;
  @Input() private habilitaCampos: boolean;
  @Input() private eliminarProducto: boolean;
  @Input() private nuevoCapitulo: boolean;
  @Output() private creacionCancelada = new EventEmitter<boolean>(false);
  @Output() private cargarProductos = new EventEmitter<boolean>(false);

  public capitulo: Capitulo = {
    titulo: '',
    estado: '',
    tipo: 'capitulo',
    consideradoPCA: false,
    year: 0,
    editorial: '',
    isbn: '',
    numEdicion: 0,
    paginaInicio: 0,
    paginaFinal: 0,
    pais: '',
    proposito: '',
    tituloLibro: '',
    lineaGeneracion: '',
    colaboradores: [],
  };

  constructor(
    private productoService: ProductoService,
    private miembroService: MiembroService,
    private notifier: NotifierService,
  ) {
    this.minYear = 1900;
    this.minLengthChar = 2;
    this.capituloForm = new FormGroup({
      tituloControl: new FormControl('', [Validators.required, Validators.minLength(this.minLengthChar)]),
      tituloLibroControl: new FormControl('', [Validators.required, Validators.minLength(this.minLengthChar)]),
      isbnControl: new FormControl('', [Validators.required, Validators.minLength(this.minLengthChar)]),
      yearControl: new FormControl('', [Validators.required, Validators.min(this.minYear)]),
      edicionControl: new FormControl('', [Validators.required, Validators.min(1)]),
      propositoControl: new FormControl('', [Validators.required, Validators.minLength(this.minLengthChar)]),
      editorialControl: new FormControl('', [Validators.required, Validators.minLength(this.minLengthChar)]),
      paisControl: new FormControl('', [Validators.required, Validators.minLength(this.minLengthChar)]),
      pagInicioControl: new FormControl('', [Validators.required, Validators.min(1)]),
      pagFinalControl: new FormControl('', [Validators.required, Validators.min(2)]),
      lineaGeneracionControl: new FormControl('', [Validators.required, Validators.minLength(this.minLengthChar)]),
      estadoControl: new FormControl('', [Validators.required, Validators.minLength(this.minLengthChar)]),
      btnConsideradoControl: new FormControl(''),
    });
    this.capituloForm.addControl("colaboradoresControl", this.colaboradoresControl);
    this.capituloForm.addControl("colaboradoresExternosControl", this.colaboradoresExternosControl);
    this.capituloForm.addControl("btnEvidenciaControl", this.btnEvidenciaControl);
    this.cargaDeArchivo = 0;
    this.considerar = false;
  }

  public llenarCampos() {
    this.capitulo.titulo = this.capituloObjeto.titulo;
    this.capitulo.estado = this.capituloObjeto.estado;
    this.capitulo.tipo = this.capituloObjeto.tipo;
    this.capitulo.consideradoPCA = this.capituloObjeto.consideradoPCA;
    this.considerar = this.capituloObjeto.consideradoPCA;
    this.capitulo.year = this.capituloObjeto.year;
    this.capitulo.editorial = this.capituloObjeto.editorial;
    this.capitulo.numEdicion = this.capituloObjeto.numEdicion;
    this.capitulo.isbn = this.capituloObjeto.isbn;
    this.capitulo.paginaInicio = this.capituloObjeto.paginaInicio;
    this.capitulo.paginaFinal = this.capituloObjeto.paginaFinal;
    this.capitulo.pais = this.capituloObjeto.pais;
    this.capitulo.proposito = this.capituloObjeto.proposito;
    this.capitulo.tituloLibro = this.capituloObjeto.tituloLibro;
    this.capitulo.lineaGeneracion = this.capituloObjeto.lineaGeneracion;
    this.idCapitulo = this.capituloObjeto.id;
    this.capitulo.registrado = this.capituloObjeto.registrado;
    this.capitulo.evidencia = this.capituloObjeto.evidencia;
    this.capitulo.colaboradores = this.capituloObjeto.colaboradores;
  }

  public ngOnInit() {
    if (!isNullOrUndefined(this.capituloObjeto)) {
      this.llenarCampos();
    }
    if (this.habilitaCampos) {
      this.capituloForm.enable();
    } else {
      this.capituloForm.disable();
    }

    this.colaboradoresLista = [];
    var colaboradoresLista = this.colaboradoresLista;
    var refColaboladores = this.refColaboladores;
    var colaboradoresSeleccionados = this.colaboradoresSeleccionados;
    var colaboradores = this.capitulo.colaboradores;
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
    console.log(this.idCapitulo);
    console.log(this.capitulo.titulo);
  }

  public ngOnChanges(changes: { [propKey: string]: SimpleChange }) {
    if (this.habilitaCampos) {
      this.capituloForm.enable();
    } else {
      this.capituloForm.disable();
    }
    if (this.eliminarProducto) {
      this.productoService.eliminarProducto(this.idCapitulo)
        .catch(function(error) {
          this.notifier.notify("error", "Error con la conexión a la base de datos");
        });
      console.log("Eliminando producto con id: " + this.idCapitulo);
      this.notifier.notify("success", "Producto eliminado correctamente");
    }
  }

  public pasarReferencias() {
    for (let nombre of this.colaboradoresSeleccionados) {
      if (this.refColaboladores.has(nombre)) {
        this.capitulo.colaboradores.push(this.refColaboladores.get(nombre));
      }
    }
  }

  public hasError = (controlName: string, errorName: string) => {
    return this.capituloForm.controls[controlName].hasError(errorName);
  }

  public detectarArchivos(event) {
    this.archivo = event.target.files;
    console.log(this.archivo.item(0).size);
    this.evidencia = this.archivo.item(0).name;
    this.capitulo.evidencia = this.evidencia;
  }

  public onChange() {
    this.capitulo.consideradoPCA = !this.considerar;
    this.considerar = !this.considerar;
    console.log("Consideracion cambiada");
  }

  async onGuardarCapitulo(myForm: NgForm) {
    if (this.capituloForm.valid) {
      this.pasarReferencias();
      console.log(this.idCapitulo);
      let idGenerado: string;
      if (isUndefined(this.idCapitulo)) {
        console.log("Agregando producto");
        this.capitulo.registrado = firebase.firestore.Timestamp.fromDate(new Date());
        await this.productoService.agregarProducto(this.capitulo)
          .then((docRef) => {
            idGenerado = docRef.id;
            console.log(idGenerado);
            if (this.archivo != null) {
              this.productoService.subirArchivo(this.archivo.item(0), idGenerado, 0);
            }
          })
          .catch(function(error) {
            this.notifier.notify("error", "Error con la conexión a la base de datos");
            console.error("Error al añadir documento: ", error);
          });
        console.log(this.capitulo.colaboradores);
        this.cargarProductos.emit(false);
        this.creacionCancelada.emit(false);
        this.notifier.notify("success", "Capitulo de libro almacenado exitosamente");
      } else {
        console.log("Modificando producto");
        this.capitulo.id = this.idCapitulo;
        await this.productoService.modificarProducto(this.capitulo)
          .catch(function(error) {
            this.notifier.notify("error", "Error con la conexión a la base de datos");
            console.error("Error al añadir documento: ", error);
          });
        if (this.archivo != null) {
          this.productoService.subirArchivo(this.archivo.item(0), this.idCapitulo, this.cargaDeArchivo);
        }
        this.cargarProductos.emit(false);
        this.notifier.notify("success", "Capitulo de libro almacenado exitosamente");
        console.log(this.capitulo.colaboradores);
      }
    } else {
      this.notifier.notify("warning", "Datos incompletos o inválidos");
    }
  }

  public cancelarEdicion() {
    if (!isNullOrUndefined(this.capitulo.id)) {
      this.llenarCampos();
    } else {
      this.nuevoCapitulo = !this.nuevoCapitulo;
      this.creacionCancelada.emit(false);
    }
  }

}
