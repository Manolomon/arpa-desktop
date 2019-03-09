import { Component, OnInit } from '@angular/core';
import { MiembroService } from 'src/app/miembro.service';
import { Miembro } from 'src/app/miembro.model';

@Component({
  selector: 'lista-miembro',
  templateUrl: './lista-miembro.component.html',
  styleUrls: ['./lista-miembro.component.scss']
})
export class ListaMiembroComponent implements OnInit {

  miembros: Miembro[];
  constructor(private miembroServicio: MiembroService) { }

  ngOnInit() {
    this.miembroServicio.getMiembros().subscribe(data => {
      this.miembros = data.map(e => {
        return {
          id: e.payload.doc.id,
          ...e.payload.doc.data()
        } as Miembro;
      })
    })
  }

  crear(miembro: Miembro) {
    this.miembroServicio.crearMiembro(miembro);
  }

  actualizar(miembro: Miembro) {
    this.miembroServicio.actualizarMiembro(miembro);
  }

  eliminar(id: string) {
    this.miembroServicio.eliminarMiembro(id);
  }
}
