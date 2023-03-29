import { ServicioComponent } from './../servicio/servicio.component';
import { ServicioService } from './../../service/servicio.service';
import { AfterViewInit, Component, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
import { MatDialog } from '@angular/material/dialog';

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
  columasServicio: string[] = ['secuencia', 'fecha_inicial', 'tipo', 'fecha_final'];
  servicios!: MatTableDataSource<any>;

  constructor(private servicioService: ServicioService, private router: Router, public dialogo: MatDialog) {
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
      if (respuesta.resultados) {
        this.consulta.subcontrato.mora = respuesta.resultados[0].mora
      }
      respuesta = await this.servicioService.consultarHistoricoServicios(subcontrato.id).toPromise();
      if (respuesta.resultados) {
        this.consulta.servicios = respuesta.resultados
      }

      if (this.consulta.servicios) {
        this.servicios = new MatTableDataSource(this.consulta.servicios);
      }
      this.seleccion = true

    } catch (error) {
      console.log('Error consolidando la consulta: ' + error)
    }
  }
  
  agregarServicio() {
    this.dialogo.open(ServicioComponent)
  }

  alertaAdvertencia(mensaje: string): void {
    Swal.fire({
      title: 'Alerta',
      text: mensaje,
      icon: 'warning',
      confirmButtonText: 'Aceptar'
    });
  }
}
