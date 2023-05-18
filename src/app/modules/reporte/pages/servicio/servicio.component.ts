import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Component } from '@angular/core';

@Component({
  selector: 'app-servicio',
  templateUrl: './servicio.component.html',
  styleUrls: ['./servicio.component.css']
})
export class ServicioComponent {
  formulario: FormGroup = new FormGroup({});

  ngOnInit(): void {
    this.formulario = new FormGroup(
      {
        fechaInicio: new FormControl('', [Validators.required]),
        fechaFin: new FormControl('', [Validators.required])
      }
    )
  }
}
