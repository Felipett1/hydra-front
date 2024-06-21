import { ServicioService } from './../../service/servicio.service';
import { Component, Inject } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-servicio',
  templateUrl: './servicio.component.html',
  styleUrls: ['./servicio.component.css']
})
export class ServicioComponent {
  formulario: FormGroup = new FormGroup({});

  constructor(@Inject(MAT_DIALOG_DATA) public data: any, private servicioService: ServicioService,) {

  }

  ngOnInit(): void {
    this.formulario = new FormGroup(
      {
        tipo: new FormControl('', [Validators.required]),
        contacto: new FormControl('', [Validators.required, Validators.pattern("^[0-9]*$")]),
        detalle: new FormControl('', [Validators.required]),
      }
    )
  }

  confirmar(): void {
    const servicio = this.formulario.value
    this.servicioService.sendData(servicio);
  }
}
