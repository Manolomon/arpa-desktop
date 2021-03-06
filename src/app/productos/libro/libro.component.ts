import { Component, OnInit, Input, OnChanges, SimpleChange, Output, EventEmitter } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Libro } from '../../models/LibroInterface';
import { ProductoService } from '../../servicios/productos.service';
import { NgForm } from '@angular/forms/src/directives/ng_form';
import { MiembroService } from '../../servicios/miembro.service';
import * as firebase from 'firebase';
import { isNullOrUndefined, isUndefined } from 'util';
import { NotifierService } from "angular-notifier";
import { MatDialog } from '@angular/material';
import { ColaboradorComponent } from '../colaborador/colaborador.component';

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
  @Output() private creacionCancelada = new EventEmitter<boolean>(false);
  @Output() private cargarProductos = new EventEmitter<boolean>(false);
  @Output() private edicionCancelada = new EventEmitter<boolean>(false);

  private idLibro: string;
  private cargaDeArchivo: number;
  private archivo: FileList;
  private libroForm: FormGroup;
  private considerar: boolean;
  private btnEvidenciaControl: FormControl = new FormControl();
  private colaboradoresControl: FormControl = new FormControl();
  private colaboradoresExternosControl: FormControl = new FormControl();
  private colaboradoresExternos: string[] = [];
  private colaboradoresLista: string[] = [];
  private lgac: string[] = [];
  private refColaboladores = new Map();
  private colaboradoresSeleccionados: string[] = [];

  public libro: Libro = {
    titulo: '',
    estado: '',
    autor: '',
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
    colaboradoresExternos: [],
    evidencia: '',
  }

  private llenarCampos() {
    this.libro.titulo = this.libroObjeto.titulo;
    this.libro.autor = this.libroObjeto.autor;
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
    this.libro.colaboradoresExternos = this.libroObjeto.colaboradoresExternos;
  }

  constructor(
    private productoService: ProductoService,
    private miembroService: MiembroService,
    private notifier: NotifierService,
    public dialog: MatDialog,
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

    this.colaboradoresLista = [];
    var colaboradoresLista = this.colaboradoresLista;
    var refColaboladores = this.refColaboladores;
    var colaboradoresSeleccionados = this.colaboradoresSeleccionados;
    var colaboradores = this.libro.colaboradores;
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

    this.actualizarColaboradoresExternos();
  }

  public ngOnChanges(changes: { [propKey: string]: SimpleChange }) {
    if (this.habilitaCampos) {
      this.libroForm.enable();
    } else {
      this.libroForm.disable();
    }
  }

  public pasarReferencias() {
    this.libro.colaboradores = [];
    for (let nombre of this.colaboradoresSeleccionados) {
      if (this.refColaboladores.has(nombre)) {
        this.libro.colaboradores.push(this.refColaboladores.get(nombre));
      }
    }
    this.libro.colaboradores.push(this.miembroService.getMiembroActivo());
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
      this.habilitaCampos = false;
      this.ngOnInit();
      this.edicionCancelada.emit(false);
    } else {
      this.nuevoLibro = !this.nuevoLibro;
      this.creacionCancelada.emit(false);
    }
  }

  async onGuardarLibro(myForm: NgForm) {
    this.cargaDeArchivo = 0;
    if (this.libroForm.valid) {
      let idGenerado: string;
      this.pasarReferencias();
      console.log(this.idLibro);
      if (isNullOrUndefined(this.idLibro)) {
        console.log("Agregando producto");
        this.libro.registrado = firebase.firestore.Timestamp.fromDate(new Date());
        await this.productoService.agregarProducto(this.libro)
          .then((docRef) => {
            idGenerado = docRef.id;
            console.log(idGenerado);
            if (this.archivo != null) {
              this.productoService.subirArchivo(this.archivo.item(0), idGenerado, this.cargaDeArchivo);
            }
            console.log(this.libro.colaboradores);
            this.cargarProductos.emit(false);
            this.creacionCancelada.emit(false);
            this.notifier.notify("success", "Libro almacenado exitosamente");
          })
          .catch((error) => {
            this.notifier.notify("error", "Error con la conexión a la base de datos");
            console.error("Error al añadir documento: ", error);
            return;
          });
      } else {
        console.log("Modificando producto");
        this.libro.id = this.idLibro;
        await this.productoService.modificarProducto(this.libro)
          .then((docRef) => {
            if (this.archivo != null) {
              this.productoService.subirArchivo(this.archivo.item(0), this.idLibro, this.cargaDeArchivo);
            }
            this.cargarProductos.emit(false);
            this.creacionCancelada.emit(false);
            this.notifier.notify("success", "Libro almacenado exitosamente");
            console.log(this.libro.colaboradores);
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

}
