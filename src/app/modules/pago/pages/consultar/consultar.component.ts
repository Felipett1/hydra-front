import { DetallePagoComponent } from './../detalle-pago/detalle-pago.component';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { PagoService } from '@modules/pago/service/pago.service';
import { PagoAnticipadoComponent } from '../pago-anticipado/pago-anticipado.component';

@Component({
  selector: 'app-consultar',
  templateUrl: './consultar.component.html',
  styleUrls: ['./consultar.component.css']
})
export class ConsultarComponent implements OnInit {

  formPagos: FormGroup = new FormGroup({});
  consulta!: any;
  resultados: boolean = true
  hayConsulta: boolean = false
  listadoPagos: any = []
  

  constructor(private pagoService: PagoService, public dialog: MatDialog) { }

  ngOnInit(): void {
    this.formPagos = new FormGroup(
      {
        subcontrato: new FormControl('',
          [
            Validators.required
          ])
      })
  }
  /*
    Estado
    1:al dia 
    2:pendiente
    3:incompleto
    4:en mora
    5:Pago sobrepasa lo esperado
    6:En validacion
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
      case 5:
        return '#A664CC';
      case 6:
        return '#F6F4EC';

      default:
        return '';
    }
  }

  async consultar() {
    const { subcontrato } = this.formPagos.value
    this.listadoPagos = []
    try {
      var respuesta = await this.pagoService.consultarPagos(subcontrato).toPromise();
      
      if (respuesta.valorPlan) {
        this.resultados = true;
        this.hayConsulta = true;
        this.consulta = respuesta;
        for (let i = 0; i < respuesta.listaPagos.length; i++) {

          this.listadoPagos.push(this.consulta.listaPagos[i])
        }
        console.log(respuesta)
      }

      else {
        this.resultados = false;
        this.hayConsulta = false;
      }

    } catch (error) {
      console.log("ERROR DE API")
    }
  }

  detallePago(pago: any) {
    this.dialog.open(DetallePagoComponent, {
      data: { pago,
        subcontrato: this.formPagos.value.subcontrato,
        listado : this.listadoPagos,
        valorTotal: this.consulta.totalCuota
      }
    })
  }

  pagoAnticipado() {
    this.dialog.open(PagoAnticipadoComponent, {
     // data: { pago,subcontrato: this.formPagos.value.subcontrato },
    })
  }
  

}
