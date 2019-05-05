import { Component, OnInit, ComponentFactoryResolver, ViewChild, ViewContainerRef, ElementRef, Inject } from '@angular/core';
import { Router } from '@angular/router';
import { LoginService } from '../servicios/login.service';
import { MiembroService } from '../servicios/miembro.service';
import { Miembro } from '../models/MiembroInterface'
import { ProductoService } from '../servicios/productos.service';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA, MatDatepickerInputEvent } from '@angular/material';
import * as jsPDF from 'jspdf';
import { FormControl, Validators, FormGroup } from '@angular/forms';
import { NotifierService } from 'angular-notifier';

export interface DialogData {
  initDate: Date;
  finalDate: Date;
}

@Component({
  selector: 'app-gestion-ca',
  templateUrl: './gestion-ca.component.html',
  styleUrls: ['./gestion-ca.component.scss']
})
export class GestionCaComponent implements OnInit {

  public productos: Array<any> = [];
  private correo: string;
  private integrantes: Miembro[] = [];
  private mostrarCard: boolean;
  private esMiembro: boolean;
  private agregando: boolean;
  private mostrarCurriculum: boolean = true;
  private integranteSeleccionado: Miembro;

  initDate: Date;
  finalDate: Date;

  @ViewChild('content') content: ElementRef;
  @ViewChild('curriculumContainer', { read: ViewContainerRef }) container: ViewContainerRef;
  componentRef: any;

  constructor(
    private router: Router,
    private loginServicio: LoginService,
    private miembroService: MiembroService,
    private resolver: ComponentFactoryResolver,
    private productoService: ProductoService,
    public dialog: MatDialog,
    private notifier: NotifierService,
  ) { }

  ngOnInit() {
    this.mostrarCard = false;
    var integrantes = this.integrantes = [];
    this.miembroService.obtenerMiembros().then(function (querySnapshot) {
      querySnapshot.forEach(function (doc) {
        var integrante: Miembro = {
          id: '',
          nombre: '',
          correo: '',
          rol: '',
        };
        let temporal: any = doc.data();
        integrante.nombre = temporal.nombre;
        integrante.correo = temporal.correo;
        integrante.rol = temporal.rol;
        integrante.id = doc.ref.id;
        integrantes.push(integrante);
      });
    });
    this.integrantes = integrantes;
    console.log("Inicio de carga de archivos");
    this.productos = [];
    let inicio = new Date('2019-04-05');
    let fin = new Date('2019-04-22');
    var docRefs: Array<any> = [];
    console.log(this.miembroService.getMiembroActivo());
    this.productoService.obtenerProductosCurriculum(inicio, fin).then(function (querySnapshot) {
      querySnapshot.forEach(function (doc) {
        console.log(doc);
        var documento = doc.data();
        documento.id = doc.id;
        console.log(documento);
        docRefs.push(documento);
      });
    });
    this.productos = docRefs;
  }

  public clickMiembro(integrante: Miembro) {
    this.mostrarCard = true;
    this.integranteSeleccionado = integrante;
    if (this.integranteSeleccionado.rol == "Miembro") {
      this.esMiembro = true;
    } else {
      this.esMiembro = false;
    }
    this.agregando = false;
  }

  public clickAgregar() {
    this.mostrarCard = true;
    this.agregando = true;
    console.log("Click agregar miembro");
  }

  public onCerrarSesion() {
    if (confirm("Desea cerrar la sesion?")) {
      console.log(this.loginServicio.getUsuario());
      this.loginServicio.cerrarSesion();
      this.router.navigate(['login']);
    }
  }

  public generarPDF() {
    this.mostrarCurriculum = false;
    var margins = {
      top: 25,
      bottom: 60,
      left: 20,
      width: 522
    };
    const doc = new jsPDF("p", "pt", "letter");
    doc.internal.scaleFactor = 3;
    doc.addHTML(this.content.nativeElement, margins.top, margins.left, { pagesplit: true }, function () {
      doc.save('curriculum-ca.pdf');
    });
    //this.router.navigateByUrl('/menu');
  }

  destroyComponent() {
    this.componentRef.destroy();
  }

  cargarProductos() {
    console.log("Inicio de carga de archivos");
    this.productos = [];
    //let inicio = new Date('2019-04-05');
    //let fin = new Date('2019-04-22');
    var docRefs: Array<any> = [];
    console.log(this.miembroService.getMiembroActivo());
    this.productoService.obtenerProductosCurriculum(this.initDate, this.finalDate).then(function (querySnapshot) {
      querySnapshot.forEach(function (doc) {
        console.log(doc);
        var documento = doc.data();
        documento.id = doc.id;
        console.log(documento);
        docRefs.push(documento);
      });
    });
    this.productos = docRefs;
    this.generarPDF();
  }

  openDialog(): void {
    const dialogRef = this.dialog.open(DialogCurriculum, {
      width: '250px',
      data: { initDate: this.initDate, finalDate: this.finalDate }
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
      if (result) {
        this.initDate = result.initDate;
        this.finalDate = result.finalDate;
        console.log('Init date: ' + (this.initDate));
        console.log('FInal date: ' + (this.finalDate));

        if (this.finalDate < this.initDate) {
          this.notifier.notify('error', 'Intervalo de fechas no es posible');
        } else {
          this.cargarProductos();
          if (this.confirmarCurriculum()) { // Algo como "Generando Curriculum, desea continuar?"
            if (this.productos.length < 1) {
              this.notifier.notify('warning', 'No se encontraron productos en ese intervalo');
            }
            this.generarPDF();
          }
        }
      } else {
        this.notifier.notify('warning', 'Operación abortada');
      }
    });
  }

  confirmarCurriculum(): boolean {
    return true;
  }

}

@Component({
  selector: 'app-dialog-curriculum',
  templateUrl: 'dialog-curriculum.html',
})
export class DialogCurriculum {

  private curriculumForm: FormGroup;
  private fechaInicioControl: FormControl = new FormControl('', [Validators.required]);
  private fechaTerminoControl: FormControl = new FormControl('', [Validators.required]);

  constructor(
    public dialogRef: MatDialogRef<DialogCurriculum>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData) {
    this.curriculumForm = new FormGroup({});
  }

  ngOnInit(): void {
    this.fechaTerminoControl = new FormControl(this.data.initDate);
    this.fechaInicioControl = new FormControl(this.data.finalDate);
    this.curriculumForm.addControl("fechaTerminoControl", this.fechaTerminoControl);
    this.curriculumForm.addControl("fechaInicioControl", this.fechaInicioControl);
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  public setFechaInicio(event: MatDatepickerInputEvent<Date>) {
    this.data.initDate = (event.value);
  }
  public setFechaFin(event: MatDatepickerInputEvent<Date>) {
    this.data.finalDate = (event.value);
  }

}
