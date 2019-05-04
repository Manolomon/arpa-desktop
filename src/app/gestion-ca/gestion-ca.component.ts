import { Component, OnInit, ComponentFactoryResolver, ViewChild, ViewContainerRef } from '@angular/core';
import { Router } from '@angular/router';
import { LoginService } from '../servicios/login.service';
import { MiembroService } from '../servicios/miembro.service';
import { Miembro } from '../models/MiembroInterface'
import { CurriculumComponent } from './curriculum/curriculum.component';

@Component({
  selector: 'app-gestion-ca',
  templateUrl: './gestion-ca.component.html',
  styleUrls: ['./gestion-ca.component.scss']
})
export class GestionCaComponent implements OnInit {

  private correo: string;
  private integrantes: Miembro[] = [];
  private mostrarCard : boolean;
  private esMiembro : boolean;
  private agregando : boolean;
  private integranteSeleccionado : Miembro;
  @ViewChild('curriculumContainer', { read: ViewContainerRef }) container: ViewContainerRef;
  componentRef: any;
  
  constructor(
    private router: Router,
    private loginServicio: LoginService,
    private miembroService: MiembroService,
    private resolver: ComponentFactoryResolver
  ) { }

  ngOnInit() {
    this.mostrarCard = false;
    this.miembroService.obtenerMiembros().then(function(querySnapshot) {
      this.integrantes = [];
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
        this.integrantes.push(integrante);
      });
    });
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
    this.container.clear();
    const factory = this.resolver.resolveComponentFactory(CurriculumComponent);

    this.componentRef = this.container.createComponent(factory);
    let data = ['perros', 'gatos', 'camellos', 'iguanas'];
    this.componentRef.instance.data = data;
  }

  destroyComponent() {
    this.componentRef.destroy();
  }

}
