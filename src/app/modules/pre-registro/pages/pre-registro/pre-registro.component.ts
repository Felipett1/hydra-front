import { PreRegistroService } from './../../services/pre-registro.service';
import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-pre-registro',
  templateUrl: './pre-registro.component.html',
  styleUrls: ['./pre-registro.component.css']
})
export class PreRegistroComponent {
  errorSession: boolean = false
  formLogin: FormGroup = new FormGroup({});

  constructor(private prService: PreRegistroService, private router: Router) {

  }

  ngOnInit(): void {
    this.formLogin = new FormGroup(
      {
        nombre: new FormControl('',
          [
            Validators.required
          ]),
        correo: new FormControl('', [
          Validators.required,
          Validators.email
        ]),
        celular: new FormControl('',
          [
            Validators.required,
            Validators.pattern("^[0-9]*$"),
            Validators.minLength(10),
            Validators.maxLength(10)
          ])
      }
    )
  }

  sendLogin(): void {
    const { nombre, correo, celular } = this.formLogin.value
    this.prService.preRegistro(nombre, correo, celular)
      //TODO: 200 <400
      .subscribe(responseOk => { //TODO: Cuando la notificación se envio correctamente
        //const { tokenSession, data } = responseOk
        //this.cookie.set('token', tokenSession, 4, '/')
        this.router.navigate(['/registro', 'exitoso'])
      },
        err => {//TODO error 400>=
          this.errorSession = true
          console.log('Ocurrio un error llamando la API: ' + err);
        })
  }
}
