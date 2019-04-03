import { Component, OnInit, Input, OnChanges, SimpleChange, Output, EventEmitter } from '@angular/core';
import { FormControl, FormGroup, Validators, Form } from '@angular/forms';
import { Libro } from '../models/LibroInterface';
import { ProductoService } from '../servicios/productos.service';
import { NgForm } from '@angular/forms/src/directives/ng_form';
import { MiembroService } from '../servicios/miembro.service';
import * as firebase from 'firebase';
import { isNullOrUndefined, isUndefined } from 'util';
import { NotifierService } from "angular-notifier";

@Component({
  selector: 'app-libro',
  templateUrl: './libro.component.html',
  styleUrls: ['./libro.component.scss']
})

export class LibroComponent implements OnInit, OnChanges {


  @Input() private libroObjeto: any;
  @Input() private habilitaCampos: boolean;
  @Input() private eliminarProducto: boolean;
  @Input() private nuevoLibro: boolean;
  @Output() private creacionCancelada = new EventEmitter<boolean>();

  private idLibro: string;
  private cargaDeArchivo: number;
  private archivo: FileList;
  private libroForm: FormGroup;
  private considerar: boolean;
  private btnEvidenciaControl: FormControl = new FormControl();
  private colaboradoresControl: FormControl = new FormControl();
  private colaboradoresExternosControl: FormControl = new FormControl();
  private colaboradores: string[] = [];
  private lgac: string[] = [];

  private llenarCampos() {
    this.libro.titulo = this.libroObjeto.titulo;
    this.libro.estado = this.libroObjeto.estado;
    this.libro.tipo = this.libroObjeto.tipo;
    this.libro.consideradoPCA = this.libroObjeto.consideradoPCA;
    this.considerar = this.libroObjeto.consideradoPCA;
    this.libro.year = this.libroObjeto.year;
    this.libro.editorial = this.libroObjeto.year;
    this.libro.numEdicion = this.libroObjeto.numEdicion;
    this.libro.isbn = this.libroObjeto.isbn;
    this.libro.paginas = this.libroObjeto.paginas;
    this.libro.pais = this.libroObjeto.pais;
    this.libro.proposito = this.libroObjeto.proposito;
    this.libro.lineaGeneracion = this.libroObjeto.proposito;
    this.libro.id = this.libroObjeto.id;
    this.idLibro = this.libroObjeto.id;
    this.libro.registrado = this.libroObjeto.registrado;
    this.libro.ejemplares = this.libroObjeto.ejemplares;
    this.libro.colaboradores = this.libroObjeto.colaboradores;
  }

  public libro: Libro = {
    titulo: '',
    estado: '',
    tipo: 'libro',
    consideradoPCA: false,
    year: 0,
    editorial: '',
    isbn: '',
    numEdicion: 0,
    paginas: 0,
    pais: '',
    proposito: '',
    ejemplares: 0,
    lineaGeneracion: '',
    colaboradores: [],
  }

  constructor(
    private productoService: ProductoService,
    private miembroService: MiembroService,
    private notifier: NotifierService,
  ) {

    this.libroForm = new FormGroup({
      tituloControl: new FormControl('', [Validators.required, Validators.minLength(2)]),
      autorControl: new FormControl('', [Validators.required, Validators.minLength(2)]),
      isbnControl: new FormControl('', [Validators.required, Validators.minLength(2)]),
      yearControl: new FormControl('', [Validators.required, Validators.min(1900)]),
      paginasControl: new FormControl('', [Validators.required, Validators.min(1)]),
      edicionControl: new FormControl('', [Validators.required, Validators.min(1)]),
      propositoControl: new FormControl('', [Validators.required, Validators.minLength(2)]),
      editorialControl: new FormControl('', [Validators.required, Validators.minLength(2)]),
      paisControl: new FormControl('', [Validators.required, Validators.minLength(2)]),
      ejemplaresControl: new FormControl('', [Validators.required, Validators.min(1)]),
      lineaGeneracionControl: new FormControl('', [Validators.required, Validators.min(2)]),
      estadoControl: new FormControl('', [Validators.required, Validators.minLength(1)]),
      btnConsideradoControl: new FormControl(''),
    });
    this.libroForm.addControl("colaboradoresControl", this.colaboradoresControl);
    this.libroForm.addControl("colaboradoresExternosControl", this.colaboradoresExternosControl);
    this.libroForm.addControl("btnEvidenciaControl", this.btnEvidenciaControl);
    this.cargaDeArchivo = 0;
    this.considerar = false;
  }

  public ngOnInit() {
    if (!isNullOrUndefined(this.libroObjeto)) {
      this.llenarCampos();
    }

    if (this.habilitaCampos) {
      this.libroForm.enable();
    } else {
      this.libroForm.disable();
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
      this.libroForm.enable();
    } else {
      this.libroForm.disable();
    }
    if (this.eliminarProducto) {
      this.productoService.eliminarProducto(this.idLibro)
        .catch(function (error) {
          this.notifier.notify("error", "Error con la conexión a la base de datos");
        });
      console.log("Eliminando producto con id: " + this.idLibro);
      this.notifier.notify("success", "Producto eliminado correctamente");
    }
  }

  public hasError = (controlName: string, errorName: string) => {
    return this.libroForm.controls[controlName].hasError(errorName);
  }

  public detectarArchivos(event) {
    this.archivo = event.target.files;
    console.log(this.archivo.item(0).size);
  }

  public onChange(event) {
    this.libro.consideradoPCA = !this.considerar;
    this.considerar = !this.considerar;
    console.log("Consideracion cambiada");
  }

  public cancelarEdicion() {
    if (!isNullOrUndefined(this.libro.id)) {
      this.llenarCampos();
    } else {
      this.nuevoLibro = !this.nuevoLibro;
      this.creacionCancelada.emit(false);
    }
  }

  public onGuardarLibro(myForm: NgForm) {
    this.cargaDeArchivo = 0;
    if (this.libroForm.valid) {
      let idGenerado: string;
      console.log(this.idLibro);
      if (isUndefined(this.idLibro)) {
        console.log("Agregando producto");
        this.libro.registrado = firebase.firestore.Timestamp.fromDate(new Date());
        this.productoService.agregarProducto(this.libro)
          .then(function (docRef) {
            idGenerado = docRef.id;
            console.log(idGenerado);
            if (this.archivo != null) {
              this.productoService.subirArchivo(this.archivo.item(0), idGenerado, this.cargaDeArchivo);
            }
            this.notifier.notify("success", "Libro almacenado exitosamente");
          })
          .catch(function (error) {
            this.notifier.notify("error", "Error con la conexión a la base de datos");
            console.error("Error al añadir documento: ", error);
          });
        console.log(this.libro.colaboradores);
      } else {
        console.log("Modificando producto");
        this.libro.id = this.idLibro;
        this.productoService.modificarProducto(this.libro)
          .catch(function (error) {
            this.notifier.notify("error", "Error con la conexión a la base de datos");
            console.error("Error al añadir documento: ", error);
          });
        if (this.archivo != null) {
          this.productoService.subirArchivo(this.archivo.item(0), this.idLibro, this.cargaDeArchivo);
        }
        this.notifier.notify("success", "Libro almacenado exitosamente");
        console.log(this.libro.colaboradores);
      }
    } else {
      this.notifier.notify("warning", "Datos incompletos o inválidos");
    }
  }

}
