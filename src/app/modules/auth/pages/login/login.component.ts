import { LoginService } from './../../service/login.service';
import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { OlvidoClaveComponent } from '../olvido-clave/olvido-clave.component';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  formLogin: FormGroup = new FormGroup({});
  ocultar = true;
  constructor(private loginService: LoginService,
    private router: Router, public dialog: MatDialog) {

  }

  ngOnInit(): void {
    this.formLogin = new FormGroup(
      {
        usuario: new FormControl('',
          [
            Validators.required
          ]),
        clave: new FormControl('', [
          Validators.required
        ])
      }
    )
  }

  autenticar(): void {
    const { usuario, clave } = this.formLogin.value
    this.loginService.autenticar(usuario, clave)
      //TODO: 200 <400
      .subscribe(response => {
        console.log(response)
        if (response.autenticar) {
          console.log("Autenticación exitosa");
        } else {
          console.log("Usuario y/o contraseña invalida!");
        }
      },
        err => {//TODO error 400>=
          console.log('Ocurrio un error llamando la API: ' + err);
        })
  }

  dlgOlvido() {
    const dialogRef = this.dialog.open(OlvidoClaveComponent, {
      width: '400px',
    })
  }
}
