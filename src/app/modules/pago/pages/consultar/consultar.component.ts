import { DetallePagoComponent } from './../detalle-pago/detalle-pago.component';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { PagoService } from '@modules/pago/service/pago.service';

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

  async consultar() {
    const { subcontrato } = this.formPagos.value
    this.listadoPagos = []
    try {
      var respuesta = await this.pagoService.consultarPagos(subcontrato).toPromise();
      console.log(respuesta.listaPagos.length)
      if (respuesta.valorPlan) {
        this.resultados = true;
        this.hayConsulta = true;
        this.consulta = respuesta;
        for (let i = 0; i < respuesta.listaPagos.length; i++) {

          this.listadoPagos.push(this.consulta.listaPagos[i])
        }
        console.log(this.listadoPagos)
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
      data: { pago },
    })
  }

}
