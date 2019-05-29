import { Component, OnInit, Input, Output, EventEmitter, SimpleChange } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Articulo } from '../../models/ArticuloInterface';
import { ProductoService } from '../../servicios/productos.service';
import { NgForm } from '@angular/forms/src/directives/ng_form';
import { MiembroService } from '../../servicios/miembro.service';
import * as firebase from 'firebase';
import { isNullOrUndefined } from 'util';
import { NotifierService } from "angular-notifier";
import { ColaboradorComponent } from '../colaborador/colaborador.component';
import { MatDialog } from '@angular/material';

@Component({
  selector: 'app-articulo',
  templateUrl: './articulo.component.html',
  styleUrls: ['./articulo.component.scss']
})
export class ArticuloComponent implements OnInit {

  @Input() private articuloObjeto: Articulo;
  @Input() private habilitaCampos: boolean;
  @Input() private eliminarProducto: boolean;
  @Input() private nuevoArticulo: boolean;
  @Output() private creacionCancelada = new EventEmitter<boolean>(false);
  @Output() private cargarProductos = new EventEmitter<boolean>(false);
  @Output() private edicionCancelada = new EventEmitter<boolean>(false);

  private idArticulo: string;
  private cargaDeArchivo: number;
  private archivo: FileList;
  private articuloForm: FormGroup;
  private evidencia = "Evidencia";
  private considerar: boolean;
  private btnEvidenciaControl: FormControl = new FormControl();
  private colaboradoresControl: FormControl = new FormControl();
  private colaboradoresExternosControl: FormControl = new FormControl();
  private estadoControl: FormControl = new FormControl('', [Validators.required]);
  private tipoArticuloControl: FormControl = new FormControl('', Validators.required);
  private colaboradoresLista: string[] = [];
  private lgac: string[] = [];
  private refColaboladores = new Map();
  private colaboradoresSeleccionados: string[] = [];

  private llenarCampos() {
    this.idArticulo = this.articuloObjeto.id;
    this.articulo.id = this.articuloObjeto.id;
    this.articulo.titulo = this.articuloObjeto.titulo;
    this.articulo.estado = this.articuloObjeto.estado;
    this.articulo.tipo = this.articuloObjeto.tipo;
    this.articulo.consideradoPCA = this.articuloObjeto.consideradoPCA;
    this.considerar = this.articuloObjeto.consideradoPCA;
    this.articulo.year = this.articuloObjeto.year;
    this.articulo.descripcion = this.articuloObjeto.descripcion;
    this.articulo.direccionElectronica = this.articuloObjeto.direccionElectronica;
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
    this.articulo.lineaGeneracion = this.articuloObjeto.lineaGeneracion;
    this.articulo.autor = this.articuloObjeto.autor;
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
    lineaGeneracion: '',
    colaboradores: [],
    autor: '',
  };

  constructor(
    private productoService: ProductoService,
    private miembroService: MiembroService,
    private notifier: NotifierService,
    public dialog: MatDialog,
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
      lineaGeneracionControl: new FormControl('', [Validators.required, Validators.minLength(2)]),
      btnConsideradoControl: new FormControl(''),
    });
    this.articuloForm.addControl("colaboradoresControl", this.colaboradoresControl);
    this.articuloForm.addControl("btnEvidenciaControl", this.btnEvidenciaControl);
    this.articuloForm.addControl("colaboradoresExternosControl", this.colaboradoresExternosControl);
    this.articuloForm.addControl("estadoControl", this.estadoControl);
    this.articuloForm.addControl("tipoArticuloControl", this.tipoArticuloControl);
    this.considerar = false;

  }

  public ngOnInit() {
    if (!isNullOrUndefined(this.articuloObjeto)) {
      this.llenarCampos();
    }

    if (this.habilitaCampos) {
      this.articuloForm.enable();
    } else {
      this.articuloForm.disable();
    }

    this.colaboradoresLista = [];
    var colaboradoresLista = this.colaboradoresLista;
    var refColaboladores = this.refColaboladores;
    var colaboradoresSeleccionados = this.colaboradoresSeleccionados;
    var colaboradores = this.articulo.colaboradores;
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
      this.articuloForm.enable();
    } else {
      this.articuloForm.disable();
    }
  }

  public pasarReferencias() {
    this.articulo.colaboradores = [];
    for (let nombre of this.colaboradoresSeleccionados) {
      if (this.refColaboladores.has(nombre)) {
        this.articulo.colaboradores.push(this.refColaboladores.get(nombre));
      }
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
    this.articulo.consideradoPCA = !this.considerar;
    this.considerar = !this.considerar;
    console.log("Consideracion cambiada");
  }

  async onGuardarArticulo(myForm: NgForm) {
    this.cargaDeArchivo = 0;
    if (this.articuloForm.valid) {
      let idGenerado: string;
      this.pasarReferencias();
      console.log(this.idArticulo);
      if (isNullOrUndefined(this.idArticulo)) {
        console.log("Agregando producto");
        this.articulo.registrado = firebase.firestore.Timestamp.fromDate(new Date());
        await this.productoService.agregarProducto(this.articulo)
          .then((docRef) => {
            idGenerado = docRef.id;
            console.log(idGenerado);
            if (this.archivo != null) {
              this.productoService.subirArchivo(this.archivo.item(0), idGenerado, this.cargaDeArchivo);
            }
            console.log(this.articulo.colaboradores);
            this.cargarProductos.emit(false);
            this.creacionCancelada.emit(false);
            this.notifier.notify("success", "Artículo almacenado exitosamente");
          })
          .catch((error) => {
            this.notifier.notify("error", "Error con la conexión a la base de datos");
            console.error("Error al añadir documento: ", error);
            return;
          });

      } else {
        console.log("Modificando producto");
        this.articulo.id = this.idArticulo;
        await this.productoService.modificarProducto(this.articulo)
          .then((docRef) => {
            this.cargarProductos.emit(false);
            this.notifier.notify("success", "Artículo almacenado exitosamente");
            console.log(this.articulo.colaboradores);
          })
          .catch((error) => {
            this.notifier.notify("error", "Error con la conexión a la base de datos");
            console.error("Error al añadir documento: ", error);
            return;
          });
        if (this.archivo != null) {
          this.productoService.subirArchivo(this.archivo.item(0), this.idArticulo, this.cargaDeArchivo);
        }
      }
    } else {
      this.notifier.notify("warning", "Datos incompletos o inválidos");
    }
    this.ngOnInit();
  }

  public cancelarEdicion() {
    if (!isNullOrUndefined(this.articulo.id)) {
      this.habilitaCampos = false;
      this.ngOnInit();
      this.edicionCancelada.emit(false);
    } else {
      this.nuevoArticulo = !this.nuevoArticulo;
      this.creacionCancelada.emit(false);
    }
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
