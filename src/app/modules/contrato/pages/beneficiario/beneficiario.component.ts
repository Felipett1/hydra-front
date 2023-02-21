import { ContratoService } from './../../service/contrato.service';
import { Component, Inject } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-beneficiario',
  templateUrl: './beneficiario.component.html',
  styleUrls: ['./beneficiario.component.css']
})
export class BeneficiarioComponent {
  formulario: FormGroup = new FormGroup({});

  constructor(private contratoService: ContratoService, @Inject(MAT_DIALOG_DATA) public data: any) {
  }

  ngOnInit(): void {
    this.formulario = new FormGroup(
      {
        nombre: new FormControl(this.data.beneficiario.nombre, [Validators.required]),
        edad: new FormControl(this.data.beneficiario.edad, [Validators.required]),
        parentesco: new FormControl(this.data.beneficiario.parentesco, [Validators.required]),
        contacto: new FormControl(this.data.beneficiario.contacto),
        emoji: new FormControl(this.data.beneficiario.emoji, [Validators.required]),
      }
    )
  }

  confirmar(): void {
    if (this.data.index) {
      console.log(this.formulario.value)
      this.contratoService.modificarBeneficiario(this.formulario.value, this.data.index)
    } else {

    }
  }
}
