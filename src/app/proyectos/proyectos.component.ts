import { Component, OnInit } from '@angular/core';
import { ProyectoService } from '../servicios/proyecto.service';
import { Proyecto } from '../models/ProyectoInterface'
import { NotifierService } from 'angular-notifier';


@Component({
  selector: 'app-proyectos',
  templateUrl: './proyectos.component.html',
  styleUrls: ['./proyectos.component.scss']
})
export class ProyectosComponent implements OnInit {

  private camposHabilitados: boolean;
  private proyectos: Array<Proyecto> = [];
  private agregaProyecto: boolean;
  private indexExpanded: number = -1;

  constructor(
    private proyectoService: ProyectoService,
    private notifier: NotifierService,
  ) {
    this.camposHabilitados = false;
    this.agregaProyecto = false;
  }

  public ngOnInit(): void {
    this.proyectos = [];
    var docRefs: Array<any> = [];
    this.proyectoService.obtenerProyectos().then(function (querySnapshot) {
      querySnapshot.forEach(function (doc) {
        var documento = doc.data();
        documento.id = doc.id;
        console.log(documento);
        docRefs.push(documento);
      });
    });
    this.proyectos = docRefs;
  }

  public habilitarCampos(): void {
    this.camposHabilitados = !this.camposHabilitados;
  }

  private togglePanels(index: number): void {
    this.indexExpanded = index == this.indexExpanded ? -1 : index;
  }

  public eliminarProyecto(posicion: number): void {
    if (confirm("Desea eliminar este proyecto?")) {
      this.proyectoService.eliminarProyecto(this.proyectos[posicion].id);
    }
  }

  public agregarProyecto(): void {
    this.agregaProyecto = true;
  }

  public creacionCancelada(cancelado: boolean) {
    this.agregaProyecto = !this.agregaProyecto;
  }
}
