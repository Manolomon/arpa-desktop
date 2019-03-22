import { Component, OnInit } from '@angular/core';
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

  cargaDeArchivo: number;
  archivo: FileList;
  capituloForm: FormGroup;
  capitulo: Capitulo = {
    titulo: '',
    estado: '',
    tipo: 'Capitulo de libro',
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
    this.capituloForm = new FormGroup({
      tituloControl: new FormControl('', [Validators.required, Validators.minLength(2)]),
      tituloLibroControl: new FormControl('', [Validators.required, Validators.minLength(2)]),
      isbnControl: new FormControl('', [Validators.required, Validators.minLength(2)]),
      yearControl: new FormControl('', Validators.required),
      edicionControl: new FormControl('', Validators.required),
      propositoControl: new FormControl('', [Validators.required, Validators.minLength(2)]),
      editorialControl: new FormControl('', [Validators.required, Validators.minLength(2)]),
      paisControl: new FormControl('', [Validators.required, Validators.minLength(2)]),
      pagInicioControl: new FormControl('', Validators.required),
      pagFinalControl: new FormControl('', Validators.required),
      lineaGeneracionControl: new FormControl('', Validators.required),
      estadoControl: new FormControl('', Validators.required),
    });
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
  }

}
