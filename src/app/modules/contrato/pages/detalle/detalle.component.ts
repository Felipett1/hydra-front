import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-detalle',
  templateUrl: './detalle.component.html',
  styleUrls: ['./detalle.component.css']
})
export class DetalleComponent {
  servicio: any
  constructor(@Inject(MAT_DIALOG_DATA) public data: any) {
    this.servicio = data
  }

}
