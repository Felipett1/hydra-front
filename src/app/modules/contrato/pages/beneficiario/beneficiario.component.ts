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
  accion: string = ''

  constructor(private contratoService: ContratoService, @Inject(MAT_DIALOG_DATA) public data: any) {
  }

  ngOnInit(): void {
    this.accion = this.data?.accion;
    this.formulario = new FormGroup(
      {
        nombre: new FormControl(this.data.beneficiario ? this.data.beneficiario.nombre : '', [Validators.required]),
        edad: new FormControl(this.data.beneficiario ? this.data.beneficiario.edad : '', [Validators.required, Validators.pattern("^[0-9]*$")]),
        parentesco: new FormControl(this.data.beneficiario ? this.data.beneficiario.parentesco : '', [Validators.required]),
        contacto: new FormControl(this.data.beneficiario ? this.data.beneficiario.contacto : '', [Validators.pattern("^[0-9]*$")]),
        emoji: new FormControl(this.data.beneficiario ? this.data.beneficiario.emoji : ''),
        adicional: new FormControl(this.data.beneficiario ? this.data.beneficiario.adicional : false, [Validators.required]),
        estado: new FormControl(this.data.beneficiario ? this.data.beneficiario.estado : true, [Validators.required])
      }
    )
  }

  confirmar(): void {
    const beneficiario = this.formulario.value
    beneficiario.secuencia = (this.data.beneficiario ? this.data.beneficiario.secuencia : null)
    beneficiario.index = this.data.index
    this.contratoService.sendData(beneficiario);
  }
}
