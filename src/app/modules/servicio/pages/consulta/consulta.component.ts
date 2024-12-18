import { ServicioComponent } from './../servicio/servicio.component';
import { ServicioService } from './../../service/servicio.service';
import { Component, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import Swal from 'sweetalert2';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { DatePipe } from '@angular/common';
import { CerrarComponent } from '../cerrar/cerrar.component';
import { Subscription } from 'rxjs';
import { NovedadComponent } from '../novedad/novedad.component';
import { HistoricoComponent } from '../historico/historico.component';

@Component({
  selector: 'app-consulta',
  templateUrl: './consulta.component.html',
  styleUrls: ['./consulta.component.css']
})
export class ConsultaComponent {
  formulario: FormGroup = new FormGroup({});
  consulta!: any
  resultados: boolean = true
  seleccion: boolean = false
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  columasServicio: string[] = ['secuencia', 'fecha_inicial', 'tipo', 'detalle', 'cerrado', 'consultar', 'agregar', 'cerrar'];
  servicios!: MatTableDataSource<any>;
  private subscription?: Subscription;
  constructor(private servicioService: ServicioService, public dialogo: MatDialog,
    private datePipe: DatePipe) {
    //Se suscribe al agregar un nuevo servicio
    this.subscription = this.servicioService.getData().subscribe(servicio => {
      this.crearServicio(servicio)
    });
  }

  ngOnInit(): void {
    this.formulario = new FormGroup(
      {
        cliente: new FormControl('',
          [
            Validators.required
          ])
      }
    )
  }

  ngOnDestroy() {
    this.subscription?.unsubscribe();
  }

  async consultar() {
    const { cliente } = this.formulario.value
    var consolidado: any = {}
    try {
      var respuesta = await this.servicioService.consultarCliente(cliente).toPromise();
      if (respuesta.resultados) {
        consolidado.cliente = respuesta.resultados[0]
      }
      respuesta = await this.servicioService.consultarContrato(cliente).toPromise();
      if (respuesta.resultados) {
        consolidado.subcontratos = respuesta.resultados
        this.consulta = consolidado
        if (consolidado.subcontratos.length == 1) {
          await this.consultarServicios(respuesta.resultados[0])
          this.seleccion = true
        } else {
          this.seleccion = false
        }
        this.resultados = true
      } else {
        this.resultados = false
        this.seleccion = false
        this.consulta = undefined
      }
    } catch (error) {
      console.log('Error consolidando la consulta: ' + error)
    }
  }

  async consultarServicios(subcontrato: any) {
    this.servicios = new MatTableDataSource();
    try {
      this.consulta.subcontrato = subcontrato
      var respuesta = await this.servicioService.consultarEstadoContrato(subcontrato.id).toPromise();
      if (respuesta) {
        this.consulta.subcontrato.mora = respuesta.resultado
      }
      respuesta = await this.servicioService.consultarHistoricoServicios(subcontrato.id).toPromise();
      if (respuesta.resultados) {
        this.consulta.servicios = respuesta.resultados
      }

      if (this.consulta.servicios) {
        this.servicios = new MatTableDataSource(this.consulta.servicios);
      }
      this.seleccion = true
      // Refrescamos el paginador después de que se muestre la tabla
      setTimeout(() => {
        this.servicios.paginator = this.paginator;
        this.servicios.sort = this.sort;
      }, 0);
    } catch (error) {
      console.log('Error consolidando la consulta: ' + error)
    }
  }

  agregarServicio() {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.maxWidth = '600px';
    dialogConfig.width = '100%';
    this.dialogo.open(ServicioComponent, dialogConfig)
  }
  async crearServicio(servicio: any) {
    var respuesta = await this.servicioService.crearServicio(this.mapeoServicio(servicio)).toPromise();
    if (respuesta && respuesta?.codigo == 0) {
      this.alertaExitoso('Servicio creado exitosamente!');
      //Consultar nuevamente los servicios
      respuesta = await this.servicioService.consultarHistoricoServicios(this.consulta.subcontrato.id).toPromise();
      if (respuesta.resultados) {
        this.consulta.servicios = respuesta.resultados
        let actual = this.servicios.data
        if (actual && this.consulta.servicios.length > 0) {
          for (let i = 0; i < this.consulta.servicios.length; i++) {
            var existe = false
            for (let j = 0; j < actual.length; j++) {
              if (this.consulta.servicios[i].secuencia == actual[j].secuencia) {
                existe = true;
                break;
              }
            }
            if (!existe) {
              servicio = this.consulta.servicios[i]
              break;
            }
          }
        }
        const data = this.consulta.servicios
        this.servicios.data = data;
      }
      //Enviar notificación de nuevo servicio
      await this.servicioService.notificarServicio(this.mapeoNotificacion(servicio)).toPromise();
    } else {
      this.alertaError(respuesta.detalle)
    }
  }

  cerrarServicio(servicio: any) {
    this.dialogo.open(CerrarComponent, {
      data: { secuencia: servicio.secuencia },
      maxWidth: '600px',
      width: '100%'
    })
  }

  agregarNovedad(servicio: any) {
    this.dialogo.open(NovedadComponent, {
      data: { secuencia: servicio.secuencia },
      maxWidth: '600px',
      width: '100%'
    })
  }

  async consultarNovedades(servicio: any) {
    var respuesta = await this.servicioService.consultarNovedadServicio({ servicio: servicio.secuencia }).toPromise()
    this.dialogo.open(HistoricoComponent, {
      data: {
        secuencia: servicio.secuencia,
        novedades: respuesta.resultados
      },
      maxWidth: '700px',
      width: '100%'
    })
  }

  mapeoServicio(servicio: any) {
    var data = {
      subcontrato: this.consulta.subcontrato.id,
      tipo_servicio: servicio.tipo,
      fecha_inicial: new Date().toLocaleDateString(),
      detalle_inicial: servicio.detalle,
      contacto: servicio.contacto,
    }
    return data
  }

  mapeoNotificacion(servicio: any) {
    var data = {
      secuencia: servicio.secuencia,
      subcontrato: this.consulta.subcontrato.id,
      tipo_servicio: servicio.tipo,
      fecha_inicial: this.datePipe.transform(new Date(), 'dd/MM/yyyy'),
      documento: this.consulta.cliente.documento,
      nombre_completo: this.consulta.cliente.nombre_completo,
      celular: this.consulta.subcontrato.celular == "0" ? "No registra" : this.consulta.subcontrato.celular,
      correo: this.consulta.subcontrato.correo == null ? "No registra" : this.consulta.subcontrato.correo,
      detalle_inicial: servicio.novedades[0].detalle,
      contacto: servicio.contacto,
      para: servicio.correo
    }
    return data
  }

  alertaAdvertencia(mensaje: string): void {
    Swal.fire({
      title: 'Alerta',
      text: mensaje,
      icon: 'warning',
      confirmButtonText: 'Aceptar'
    });
  }

  alertaExitoso(mensaje: string): void {
    Swal.fire({
      title: 'Transacción exitosa',
      text: mensaje,
      icon: 'success',
      confirmButtonText: 'Aceptar'
    });
  }
  alertaError(mensaje: string): void {
    Swal.fire({
      title: 'Error',
      text: mensaje,
      icon: 'error',
      confirmButtonText: 'Aceptar'
    });
  }

  contruccion(): void {
    Swal.fire({
      title: 'En construcción',
      text: 'Esta funcionalidad actualmente se esta desarrollando, muy pronto estará disponible',
      icon: 'warning',
      confirmButtonText: 'Aceptar'
    });
  }

}
