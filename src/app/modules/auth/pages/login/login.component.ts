import { CookieService } from 'ngx-cookie-service';
import { LoginService } from './../../service/login.service';
import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { OlvidoClaveComponent } from '../olvido-clave/olvido-clave.component';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  formLogin: FormGroup = new FormGroup({});
  ocultar = true;
  constructor(private loginService: LoginService,
    private router: Router, public dialog: MatDialog, private _snackBar: MatSnackBar,
    private cookieService: CookieService) {

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

  async autenticar(): Promise<void> {
    const { usuario, clave } = this.formLogin.value
    let mensaje = ""
    await this.loginService.autenticar(usuario, clave)
      .subscribe(response => {
        if (response.autenticar) {
          this.cookieService.set('token', response.token, 1, '/');
          this.cookieService.set('usuario', response.usuario.usuario, 1, '/');
          this.cookieService.set('rol', response.usuario.rol, 1, '/');
          this.router.navigate(['inicio', 'subcontrato'])
        } else {
          mensaje = "¡Usuario y/o contraseña invalida!"
          this._snackBar.open(mensaje, '', {
            horizontalPosition: 'center',
            verticalPosition: 'top',
            duration: 3000,
          });
        }
      },
        err => {
          console.log('Ocurrio un error llamando la API: ' + err);
          mensaje = "Presentamos problemas técnicos, por favor intente más tarde"
          this._snackBar.open(mensaje, '', {
            horizontalPosition: 'center',
            verticalPosition: 'top',
            duration: 3000,
          });
        })

  }

  dlgOlvido() {
    const dialogRef = this.dialog.open(OlvidoClaveComponent, {
      width: '400px',
    })
  }
}
