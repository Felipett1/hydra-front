import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { PagoService } from '@modules/pago/service/pago.service';
import Swal from 'sweetalert2';
import { Router } from '@angular/router';



@Component({
  selector: 'app-detalle-pago',
  templateUrl: './detalle-pago.component.html',
  styleUrls: ['./detalle-pago.component.css'],
})
export class DetallePagoComponent {
  formulario: FormGroup = new FormGroup({});
  placeholder = '';
  tipoFormulario: boolean = true;
  tipoPago: boolean = true;
  checked = false;
  consolidado: any = {};
  consolidadoAnticipado: any = {};
  fechaActual: Date = new Date();
  valorEsperado!: number;
  pendiente: boolean = false;
  descuento: any;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private pagoService: PagoService,
    private router: Router
  ) {}

  ngOnInit(): void {
    /* this.accion = this.data?.accion; */
    this.formulario = new FormGroup({
      pago: new FormControl(this.data.pago ? this.data.pago.valor : '', [
        Validators.required,
      ]),
      porcentaje: new FormControl('', [Validators.required]),
    });
    this.validarVista();
  }

  async validarVista() {
    const { pago } = await this.data;
    try {
      if (pago.secuencia) {
        this.tipoFormulario = true;
        if (this.data.pago.valorMes) {
          this.valorEsperado = this.data.pago.valorMes;
          this.pendiente = true;
        }
      } else {
        this.tipoFormulario = false;
      }
      /* await this.pagoService.modificarPago(pago).toPromise(); */
    } catch (error) {
      console.log('error');
    }
  }
  async modificarPago() {
    this.consolidado.valor = this.formulario.value.pago;
    this.consolidado.secuencia = this.data.pago.secuencia;
    console.log(this.data);

    try {
      var respuesta = await this.pagoService
        .modificarPago(this.consolidado)
        .toPromise();
      if (respuesta && respuesta.codigo == 0) {
        this.alertaExitoso('¡Pago modificado exitosamente!');
      } else {
        this.alertaError('No se pudo Modificar el pago');
      }
    } catch (error) {
      this.alertaError('No se pudo Modificar el pago');
    }
  }

  async cargarPago() {
    //Pago anticipado
    var listado = await this.data.listado;
    var valorPagar = 0;
    var multiplo = 0;
    var pendientePorPagar = 0;
    var descuento = 0;
    
    for (let i = 0; i < listado.length; i++) {
      if (!listado[i].secuencia) {
        multiplo += 1;
      }
    }
    pendientePorPagar = this.data.valorTotal * multiplo;
    descuento = pendientePorPagar * (this.formulario.value.porcentaje / 100);
    valorPagar = pendientePorPagar - descuento;

    if (this.checked == true) {
    this.consolidado.pendiente = pendientePorPagar;
    this.consolidado.porcentaje = this.formulario.value.porcentaje;
    this.consolidado.pagado = valorPagar;
    this.consolidado.descuento = descuento;

    try {
      var respuesta = await this.pagoService
        .cargarPagoAnticipado(this.consolidado)
        .toPromise();
      if (respuesta && respuesta.codigo == 0) {
        this.alertaExitoso('¡Pago cargado exitosamente!');
      } else {
        this.alertaError(respuesta.mensaje);
      }
    } catch (error) {
      this.alertaError('No se pudo Modificar el pago');
    }
      //pago normal
    }
    /* subcontrato, fecha, periodo, valor, anticipado,mes */
    this.consolidado= {}
    this.consolidado.subcontrato = this.data.subcontrato;
    this.consolidado.fecha = this.fechaActual;
    this.consolidado.periodo = this.data.pago.periodo;
    this.consolidado.valor = valorPagar
    //this.consolidado.anticipado = null
    this.consolidado.mes = this.data.pago.mes;
    console.log(this.data);
    console.log(this.consolidado);
    try {
      var respuesta = await this.pagoService
        .cargarPago(this.consolidado)
        .toPromise();
      if (respuesta && respuesta.codigo == 0) {
        this.alertaExitoso('¡Pago cargado exitosamente!');
      } else {
        this.alertaError(respuesta.mensaje);
      }
    } catch (error) {
      this.alertaError('No se pudo Modificar el pago');
    }
  }
  async cargarPagoAnticipado() {
    
  }

  alertaExitoso(mensaje: string): void {
    Swal.fire({
      title: 'Transacción exitosa',
      text: mensaje,
      icon: 'success',
      confirmButtonText: 'Aceptar',
      preConfirm: () => {
        return this.router.navigate(['inicio', 'pago']);
      },
    });
  }
  alertaError(mensaje: any): void {
    Swal.fire({
      title: 'Error',
      text: mensaje,
      icon: 'error',
      confirmButtonText: 'Aceptar',
    });
  }

  validarTipoPago() {
    if (this.checked == true) {
      this.tipoPago = false;
    } else {
      this.tipoPago = true;
    }
    this.consolidarAnticipado();
  }

  async consolidarAnticipado() {
    var listado = await this.data.listado;
    var valorPagar = 0;
    var multiplo = 0;
    var pendientePorPagar = 0;
    var descuento = 0;
    for (let i = 0; i < listado.length; i++) {
      if (!listado[i].secuencia) {
        multiplo += 1;
      }
    }
    pendientePorPagar = this.data.valorTotal * multiplo;
    descuento = pendientePorPagar * (this.formulario.value.porcentaje / 100);
    valorPagar = pendientePorPagar - descuento;
    this.descuento = descuento;
    this.consolidadoAnticipado.pendiente = pendientePorPagar;
    this.consolidadoAnticipado.porcentaje = this.formulario.value.porcentaje;
    this.consolidadoAnticipado.pagado = valorPagar;
  }
}
