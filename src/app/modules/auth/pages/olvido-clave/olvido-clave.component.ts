import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { LoginService } from '@modules/auth/service/login.service';
import {
  MatSnackBar,
  MatSnackBarHorizontalPosition,
  MatSnackBarVerticalPosition,
} from '@angular/material/snack-bar';


@Component({
  selector: 'app-olvido-clave',
  templateUrl: './olvido-clave.component.html',
  styleUrls: ['./olvido-clave.component.css']
})
export class OlvidoClaveComponent {
  formRecuperar: FormGroup = new FormGroup({});

  constructor(private loginService: LoginService, private _snackBar: MatSnackBar) {
  }


  ngOnInit(): void {
    this.formRecuperar = new FormGroup(
      {
        usuario: new FormControl('',
          [
            Validators.required
          ])
      }
    )
  }

  recuperar(): void {
    const { usuario } = this.formRecuperar.value
    this.loginService.ntfRecuperar(usuario)
      //TODO: 200 <400
      .subscribe(response => {
        let mensaje = ''
        if (response.codigo == 0) {
          mensaje = `¡Solicitud enviada correctamente para ${usuario}!`
        } else {
          mensaje = `Presentamos inconvenientes, por favor intente más tarde`
        }

        this._snackBar.open(mensaje, '', {
          horizontalPosition: 'center',
          verticalPosition: 'top',
          duration: 3000,
        });
      },
        err => {//TODO error 400>=
          console.log('Ocurrio un error llamando la API: ' + err);
        })
  }
}
