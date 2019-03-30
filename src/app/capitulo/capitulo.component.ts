import { Component, OnInit, Input, Output, EventEmitter, OnChanges, SimpleChange } from '@angular/core';
import { FormControl, FormGroup, Validators, Form } from '@angular/forms';
import { Capitulo } from '../models/CapituloInterface';
import { ProductoService } from '../servicios/productos.service';
import { NgForm } from '@angular/forms/src/directives/ng_form';
import { MiembroService } from '../servicios/miembro.service';
import * as firebase from 'firebase';
import { isNullOrUndefined, isUndefined } from 'util';


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
  private btnEvidenciaControl: FormControl = new FormControl();
  private colaboradoresControl: FormControl = new FormControl();
  private colaboradoresExternosControl: FormControl = new FormControl();

  private colaboradores: string[] = [];

  @Input() private capituloObjeto: any;
  @Input() private habilitaCampos: boolean;
  @Input() private eliminarProducto: boolean;
  @Input() private nuevoCapitulo: boolean;
  @Output() private creacionCancelada = new EventEmitter<boolean>();

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

  constructor(private productoService: ProductoService, private miembroService: MiembroService) {
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
      lineaGeneracionControl: new FormControl('', [Validators.required, Validators.min(this.minLengthChar)]),
      estadoControl: new FormControl('', [Validators.required, Validators.minLength(this.minLengthChar)]),
      btnConsideradoControl: new FormControl(''),
    });
    this.capituloForm.addControl("colaboradoresControl", this.colaboradoresControl);
    this.capituloForm.addControl("colaboradoresExternosControl", this.colaboradoresExternosControl);
    this.capituloForm.addControl("btnEvidenciaControl", this.btnEvidenciaControl);
    this.cargaDeArchivo = 0;
  }

  public llenarCampos() {
    this.capitulo.titulo = this.capituloObjeto.titulo;
    this.capitulo.estado = this.capituloObjeto.estado;
    this.capitulo.tipo = this.capituloObjeto.tipo;
    this.capitulo.consideradoPCA = this.capituloObjeto.consideradoPCA;
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

    this.miembroService.obtenerMiembros().subscribe(datos => {
      this.colaboradores = [];
      for (let dato of datos) {
        const temporal: any = (dato.payload.doc.data());
        this.colaboradores.push(temporal.nombre);
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
      this.productoService.eliminarProducto(this.idCapitulo);
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
    this.capitulo.consideradoPCA = !this.capitulo.consideradoPCA;
    console.log("Consideracion cambiada");
  }

  public onGuardarCapitulo(myForm: NgForm) {
    this.cargaDeArchivo = 0;
    if (this.capituloForm.valid) {
      let idGenerado: string;
      console.log(this.idCapitulo);
      if (isUndefined(this.idCapitulo)) {
        console.log("Agregando producto");
        this.capitulo.registrado = firebase.firestore.Timestamp.fromDate(new Date());
        this.productoService.agregarProducto(this.capitulo)
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
        console.log(this.capitulo.colaboradores);
      } else {
        console.log("Modificando producto");
        this.capitulo.id = this.idCapitulo;
        this.productoService.modificarProducto(this.capitulo)
          .catch(function (error) {
            console.error("Error al añadir documento: ", error);
          });
        if (this.archivo != null) {
          this.productoService.subirArchivo(this.archivo.item(0), this.idCapitulo, this.cargaDeArchivo);
        }
        console.log(this.capitulo.colaboradores);
      }
    } else {
      alert("Datos incompletos o inválidos");
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