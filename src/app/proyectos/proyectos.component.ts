import { Component, OnInit, Input } from '@angular/core';
import { ProyectoService } from '../servicios/proyecto.service';
import { Proyecto } from '../models/ProyectoInterface'
import { NotifierService } from 'angular-notifier';
import { Miembro } from '../models/MiembroInterface';
import { DialogoComponent } from '../dialogo/dialogo.component';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA, MatDatepickerInputEvent } from '@angular/material';


@Component({
  selector: 'app-proyectos',
  templateUrl: './proyectos.component.html',
  styleUrls: ['./proyectos.component.scss']
})
export class ProyectosComponent implements OnInit {

  @Input() private miembroObjeto: Miembro;

  private camposHabilitados: boolean;
  private proyectos: Array<any> = [];
  private agregaProyecto: boolean;
  private indexExpanded: number = -1;

  constructor(
    private proyectoService: ProyectoService,
    private notifier: NotifierService,
    public dialog: MatDialog,
  ) {
    this.camposHabilitados = false;
    this.agregaProyecto = false;
  }

  public ngOnInit(): void {
    this.proyectos = [];
    var docRefs: Array<any> = [];
    this.proyectoService.obtenerProyectosMiembro(this.miembroObjeto.id).then(function(querySnapshot) {
      querySnapshot.forEach(function(doc) {
        var documento = doc.data();
        documento.id = doc.id;
        console.log(documento);
        docRefs.push(documento);
      });
    });
    this.proyectos = docRefs;
    this.camposHabilitados = false;
    this.agregaProyecto = false;
    this.togglePanels(-1);
  }

  public habilitarCampos(): void {
    this.camposHabilitados = !this.camposHabilitados;
  }

  private togglePanels(index: number): void {
    this.indexExpanded = index == this.indexExpanded ? -1 : index;
  }

  public async eliminarProyecto(posicion: number) {
    var resultado: boolean;
    const dialogRef = this.dialog.open(DialogoComponent, {
      width: '400px',
      disableClose: true,
      data: {
        mensaje: "¿Desea eliminar este proyecto?",
        dobleBoton: true
      }
    });
    dialogRef.afterClosed().subscribe(result => {
      resultado = result;
      if (result) {
        this.proyectoService.eliminarProyecto(this.proyectos[posicion].id)
          .then(() => {
            this.ngOnInit();
          });
      }
    });
  }

  public agregarProyecto(): void {
    this.agregaProyecto = true;
  }

  public creacionCancelada(cancelado: boolean) {
    this.agregaProyecto = !this.agregaProyecto;
    this.ngOnInit();
  }

  public cargarProyectos(cargar: boolean) {
    console.log("cargando proyectos");
    this.ngOnInit();
  }

  public edicionCancelada(editado: boolean) {
    this.camposHabilitados = false;
  }

}
