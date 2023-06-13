import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import Swal from 'sweetalert2';
import { FormControl, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-pago-anticipado',
  templateUrl: './pago-anticipado.component.html',
  styleUrls: ['./pago-anticipado.component.css']
})
export class PagoAnticipadoComponent {
  formulario: FormGroup = new FormGroup({});

  constructor(@Inject(MAT_DIALOG_DATA) public data: any){}
  ngOnInit(): void {
    /* this.accion = this.data?.accion; */
    this.formulario = new FormGroup(
      {
        pago: new FormControl('',[Validators.required]),
        
      }
    )
    
  }
  cargarPago(){
    console.log("this.data")
  }

}