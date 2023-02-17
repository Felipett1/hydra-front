import { ContratoService } from './../../service/contrato.service';
import { AfterViewInit, Component, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { FormControl, FormGroup, Validators } from '@angular/forms';
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
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  columasServicio: string[] = ['secuencia', 'fecha_inicial', 'tipo', 'fecha_final'];
  servicios!: MatTableDataSource<any>;

  constructor(private contratoService: ContratoService) {
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
    await this.contratoService.consultarContrato(cliente)
      .subscribe(response => {
        if (response.resultados) {
          consolidado.contrato = response.resultados[0]
          this.contratoService.consultarCliente(cliente)
            .subscribe(response => {
              if (response.resultados) {
                consolidado.cliente = response.resultados[0]
                this.contratoService.consultarBeneficiario(consolidado.contrato.id)
                  .subscribe(response => {
                    if (response.resultados) {
                      consolidado.beneficiarios = response.resultados
                      this.dataSource = new MatTableDataSource(consolidado.beneficiarios);
                      this.dataSource.paginator = this.paginator;
                      this.dataSource.sort = this.sort;

                      this.contratoService.consultarEstadoContrato(cliente)
                        .subscribe(response => {
                          if (response.resultados) {
                            consolidado.contrato.mora = response.resultados[0].mora
                            this.contratoService.consultarHistoricoServicios(consolidado.contrato.id)
                              .subscribe(response => {
                                if (response.resultados) {
                                  consolidado.servicios = response.resultados
                                  this.consulta = consolidado
                                  this.servicios = new MatTableDataSource(consolidado.servicios);
                                } else {
                                  console.log('No se encontraron resultados')
                                }
                              },
                                err => {
                                  console.log('Ocurrio un error llamando la API: ' + err);
                                })
                          } else {
                            console.log('No se encontraron resultados')
                          }
                        },
                          err => {
                            console.log('Ocurrio un error llamando la API: ' + err);
                          })
                      this.consulta = consolidado
                    } else {
                      console.log('No se encontraron resultados')
                    }
                  },
                    err => {
                      console.log('Ocurrio un error llamando la API: ' + err);
                    })
              } else {
                console.log('No se encontraron resultados')
              }
            },
              err => {
                console.log('Ocurrio un error llamando la API: ' + err);
              })
        } else {
          console.log('No se encontraron resultados')
        }
      },
        err => {
          console.log('Ocurrio un error llamando la API: ' + err);
        })
  }
}
