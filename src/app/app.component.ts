import { Component } from '@angular/core';
import { LoginService } from './servicios/login.service'

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'Arpa Desktop';
  constructor(private _loginServicio: LoginService) { }
}
