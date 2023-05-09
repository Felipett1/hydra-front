import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { PagoService } from '@modules/pago/service/pago.service';

@Component({
  selector: 'app-consultar',
  templateUrl: './consultar.component.html',
  styleUrls: ['./consultar.component.css']
})
export class ConsultarComponent implements OnInit{
  formPagos : FormGroup = new FormGroup ({});
  resultados : boolean = true;

  constructor(private pagoService : PagoService){}
  

  ngOnInit(): void {
    this.formPagos = new FormGroup(
      {
      subcontrato: new FormControl('',
      [
        Validators.required
      ])
    })
  }






  fechas: any[] = [
    {
      fecha: 'ene-22',
      estado: 1,
      valor: 29.000

    },
    {
      fecha: 'ene-22',
      estado: 1,
    },
    {
      fecha: 'ene-22',
      estado: 1,
    },
    {
      fecha: 'ene-22',
      estado: 1,
      valor: 29.000

    },
    {
      fecha: 'ene-22',
      estado: 1,
    },
    {
      fecha: 'ene-22',
      estado: 1,
    },
    {
      fecha: 'ene-22',
      estado: 3,
      valor: 29.000

    },
    {
      fecha: 'ene-22',
      estado: 4,
    },
    {
      fecha: 'ene-22',
      estado: 2,
    },

  ];

  /*
    Estado
    1:al dia 
    2:pendiente
    3:incompleto
    4:en mora
  */
  asignarColor(estado: any) {
    switch (estado) {
      case 1:
        return '#61CE70';
      case 2:
        return '#BDBDBD';
      case 3:
        return '#CDDC39';
      case 4:
        return '#F37B72';

      default:
        return '';
    }
  }

  async consultar(){
    const {subcontrato}= this.formPagos.value
    try {
      var respuesta = await this.pagoService.consultarPagos(subcontrato).toPromise();
      console.log(respuesta)
    } catch (error) {
      console.log("ERROR DE API")
    }
  }
  
}
