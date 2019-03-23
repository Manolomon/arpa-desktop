import { Component, OnInit, Input } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Capitulo } from '../models/CapituloInterface';
import { ProductoService } from '../servicios/productos.service';
import { NgForm } from '@angular/forms/src/directives/ng_form';


@Component({
  selector: "app-capitulo",
  templateUrl: "./capitulo.component.html",
  styleUrls: ["./capitulo.component.scss"]
})
export class CapituloComponent implements OnInit {

  @Input() capituloObjeto: any;
  idCapitulo: string;
  cargaDeArchivo: number;
  archivo: FileList;
  capituloForm: FormGroup;
  capitulo: Capitulo = {
    titulo: '',
    estado: '',
    tipo: 'capitulo',
    consideradoPCA: false,
    evidencia: null,
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
    colaboradores: []
  };

  evidencia: string = "Evidencia";
  toppings = new FormControl();
  toppingList: string[] = [
    "Extra cheese",
    "Mushroom",
    "Onion",
    "Pepperoni",
    "Sausage",
    "Tomato"
  ];

  constructor(private productoService: ProductoService) { }

  ngOnInit() {
    if (this.capituloObjeto!=null) {
      this.capitulo.titulo = this.capituloObjeto.titulo;
      this.capitulo.estado = this.capituloObjeto.estado;
      this.capitulo.tipo = this.capituloObjeto.tipo;
      this.capitulo.consideradoPCA = this.capituloObjeto.consideradoPCA;
      this.capitulo.year = this.capituloObjeto.year;
      this.capitulo.editorial = this.capituloObjeto.editorial;
      this.capitulo.isbn = this.capituloObjeto.isbn;
      this.capitulo.paginaInicio = this.capituloObjeto.paginaInicio;
      this.capitulo.paginaFinal = this.capituloObjeto.paginaFinal;
      this.capitulo.pais = this.capituloObjeto.pais;
      this.capitulo.proposito = this.capituloObjeto.proposito;
      this.capitulo.tituloLibro = this.capituloObjeto.tituloLibro;
      this.capitulo.lineaGeneracion = this.capituloObjeto.lineaGeneracion;
      this.idCapitulo = this.capituloObjeto.id;
    }
    
    this.capituloForm = new FormGroup({
      tituloControl: new FormControl('', [Validators.required, Validators.minLength(2)]),
      tituloLibroControl: new FormControl('', [Validators.required, Validators.minLength(2)]),
      isbnControl: new FormControl('', [Validators.required, Validators.minLength(2)]),
      yearControl: new FormControl('', [Validators.required, Validators.min(1900)]),
      edicionControl: new FormControl('', [Validators.required, Validators.min(1)]),
      propositoControl: new FormControl('', [Validators.required, Validators.minLength(2)]),
      editorialControl: new FormControl('', [Validators.required, Validators.minLength(2)]),
      paisControl: new FormControl('', [Validators.required, Validators.minLength(2)]),
      pagInicioControl: new FormControl('', [Validators.required, Validators.min(1)]),
      pagFinalControl: new FormControl('', [Validators.required, Validators.min(2)]),
      lineaGeneracionControl: new FormControl('', [Validators.required, Validators.min(2)]),
      estadoControl: new FormControl('', [Validators.required, Validators.minLength(1)]),
    });

    console.log(this.idCapitulo);
  }

  public hasError = (controlName: string, errorName: string) => {
    return this.capituloForm.controls[controlName].hasError(errorName);
  }

  detectarArchivos(event) {
    this.archivo = event.target.files;
    console.log(this.archivo.item(0).size);
  }

  onChange(event) {
    this.capitulo.consideradoPCA = !this.capitulo.consideradoPCA;
    console.log("Consideracion cambiada");
  }

  onGuardarCapitulo(myForm: NgForm) {
    if (this.capituloForm.valid) {
      let idGenerado: string;
      this.productoService.agregarProducto(this.capitulo)
        .then(function (docRef) {
          idGenerado = docRef.id;
        })
        .catch(function (error) {
          console.error("Error al añadir documento: ", error);
        });

      if (this.archivo != null) {
        this.productoService.subirArchivo(this.archivo.item(0), idGenerado, this.cargaDeArchivo);
      }
      console.log(this.capitulo.colaboradores);
    } else {
      alert("Datos incompletos o inválidos");
    }
  }

}
