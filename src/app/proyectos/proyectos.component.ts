import { Component, OnInit, Input, SimpleChanges, EventEmitter } from '@angular/core';
import { ProyectoService } from '../servicios/proyecto.service';
import { Proyecto } from '../models/ProyectoInterface';
import { NotifierService } from 'angular-notifier';
import { NgForm, NgModel, FormGroup, FormControl } from '@angular/forms'

@Component({
  selector: 'app-proyectos',
  templateUrl: './proyectos.component.html',
  styleUrls: ['./proyectos.component.scss']
})
export class ProyectosComponent implements OnInit {

  @Input() private proyectoObjeto: Proyecto;
  @Input() private idMiembro: string;
  @Input() private habilitaCampos: boolean;
  @Input() private nuevoProyecto: boolean;
  @Output() private creacionCancelada = new EventEmitter<boolean>();

  private proyecto: Proyecto = {
    nombre: '',
    consideradoPCA: false,
    actividadesRealizadas: '',
    descripcion: '',
    idCreador: '',
  }

  private indexExpanded: number = -1;

  constructor(
    private proyectoService: ProyectoService,
    private notifier: NotifierService,
  ) { }

  public ngOnInit(): void {
    if (!isNullOrUndefined(this.proyectoObjeto)) {
      this.llenarCampos();
    }
  }

  private togglePanels(index: number): void {
    this.indexExpanded = index == this.indexExpanded ? -1 : index;
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
  }

  public habilitarCampos(): void {
  }

  public onGUardarProyecto(myForm: NgForm): void {
    let idGenerado: string;
    if (isNullOrUndefined(this.proyecto.id)) {
      this.proyectoService.agregarProyecto(this.proyecto)
        .then((docRef) => {
          idGenerado = docRef.id;
          this.notifier.notify("success", "Proyecto guardado con éxito");
        })
        .catch((err) => {
          this.notifier.notify("error", "Error con la conexión a la base de datos");
          console.error("Error al añadir el documento: ", err);
        });
    } else {
      this.proyectoService.modificarProyecto(this.proyecto)
        .then((docRef) => {
          idGenerado = docRef.id;
          this.notifier.notify("success", "Proyecto guardado con éxito");
        })
        .catch((err) => {
          this.notifier.notify("error", "Error con la conexión a la base de datos");
          console.error("Error al añadir el documento: ", err);
        });
    }
  }

  public cancelarEdicion(): void {
    if (!isNullOrUndefined(this.proyecto.id)) {
      this.llenarCampos();
    } else {
      this.nuevoProyecto = !this.nuevoProyecto;
      this.creacionCancelada.emit(false);
    }
  }
  eliminarProducto(producto): void {
    if (confirm("Desea eliminar este proyecto?")) {
      console.log("Proyecto eliminado")
    }
  }
}
