import { ContratoService } from './../../service/contrato.service';
import { AfterViewInit, Component, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
//import { ConsultaModelo } from 'src/app/core/models/consulta.models';

@Component({
  selector: 'app-consultar',
  templateUrl: './consultar.component.html',
  styleUrls: ['./consultar.component.css']
})
export class ConsultarComponent {
  formulario: FormGroup = new FormGroup({});
  displayedColumns: string[] = ['nombre', 'edad', 'parentesco', 'contacto', 'emoji'];
  dataSource!: MatTableDataSource<any>;
  consulta!: any
  resultados: boolean = true
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  columasServicio: string[] = ['secuencia', 'fecha_inicial', 'tipo', 'fecha_final'];
  servicios!: MatTableDataSource<any>;

  constructor(private contratoService: ContratoService, private router: Router) {
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
    this.consulta = undefined
    this.servicios = new MatTableDataSource();
    this.dataSource = new MatTableDataSource();
    try {
      var respuesta = await this.contratoService.consultarContrato(cliente).toPromise();
      if (respuesta.resultados) {
        consolidado.contrato = respuesta.resultados[0]
        respuesta = await this.contratoService.consultarCliente(cliente).toPromise();
        if (respuesta.resultados) {
          consolidado.cliente = respuesta.resultados[0]
          respuesta = await this.contratoService.consultarBeneficiario(consolidado.contrato.id).toPromise();
          if (respuesta.resultados) {
            consolidado.beneficiarios = respuesta.resultados
            respuesta = await this.contratoService.consultarEstadoContrato(cliente).toPromise();
            if (respuesta.resultados) {
              consolidado.contrato.mora = respuesta.resultados[0].mora
              respuesta = await this.contratoService.consultarHistoricoServicios(consolidado.contrato.id).toPromise();
              if (respuesta.resultados) {
                consolidado.servicios = respuesta.resultados
              }
            }
          }
        }
        this.consulta = consolidado
        if (this.consulta.servicios) {
          this.servicios = new MatTableDataSource(this.consulta.servicios);
        }
        if (this.consulta.beneficiarios) {
          this.dataSource = new MatTableDataSource(this.consulta.beneficiarios);
          this.dataSource.paginator = this.paginator;
          this.dataSource.sort = this.sort;
        }
        this.resultados = true
      } else {
        this.resultados = false
      }
    } catch (error) {
      console.log('Error consolidando la consulta: ' + error)
    }
  }

  modificar() {
    this.contratoService.consulta = this.consulta
    this.router.navigate(['/inicio/contrato/modificar']);
  }
}