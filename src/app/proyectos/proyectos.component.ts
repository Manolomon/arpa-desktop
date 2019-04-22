import { Component, OnInit } from '@angular/core';
import { ProyectoService } from '../servicios/proyecto.service';

@Component({
  selector: 'app-proyectos',
  templateUrl: './proyectos.component.html',
  styleUrls: ['./proyectos.component.scss']
})
export class ProyectosComponent implements OnInit {

  private indexExpanded: number = -1;

  constructor(private proyectoService: ProyectoService) { }

  ngOnInit() {
  }

  togglePanels(index: number) {
    this.indexExpanded = index == this.indexExpanded ? -1 : index;
  }

  public habilitarCampos(): void {

  }
  eliminarProducto(producto) {
    if (confirm("Desea eliminar este proyecto?")) {
      console.log("Proyecto eliminado")
    }
  }
}
