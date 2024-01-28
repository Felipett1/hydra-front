import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import Swal from 'sweetalert2';
import { FormControl, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-anticipado',
  templateUrl: './anticipado.component.html',
  styleUrls: ['./anticipado.component.css']
})
export class AnticipadoComponent {
  fecha: any;
  valor: any = 0;

  constructor(@Inject(MAT_DIALOG_DATA) public data: any){}
  ngOnInit(): void {
    /* this.accion = this.data?.accion; */
    console.log(this.data)
    
    for(let i = 0;i<this.data.listado.length;i++){
      if(this.data.listado[i].estado==7 && this.data.listado[i].valor > this.valor){
        this.fecha=this.data.listado[i].fecha
        this.valor=this.data.listado[i].valor
      }

    }  
  }
  cargarPago(){
    console.log("this.data")
  }


}
