import { CookieService } from 'ngx-cookie-service';
import { SolicitudService } from './../../../solicitud/service/solicitud.service';
import { SoporteComponent } from './../soporte/soporte.component';
import { ContratoService } from './../../service/contrato.service';
import { AfterViewInit, Component, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';

@Component({
  selector: 'app-consultar',
  templateUrl: './consultar.component.html',
  styleUrls: ['./consultar.component.css']
})
export class ConsultarComponent {
  formulario: FormGroup = new FormGroup({});
  displayedColumns: string[] = ['nombre', 'edad', 'parentesco', 'contacto', 'adicional', 'estado', 'emoji'];
  beneficiarios!: MatTableDataSource<any>;
  consulta!: any
  resultados: boolean = true
  seleccion: boolean = false
  @ViewChild('pgtServcios') paginator!: MatPaginator;
  @ViewChild('pgtBeneficiario') paginatorBeneficiario!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  //Ver PDF
  public pdfSoporte: any = null;
  columasServicio: string[] = ['secuencia', 'fecha_inicial', 'tipo', 'detalle', 'fecha_final'];
  servicios!: MatTableDataSource<any>;
  mensualidadTotal = 0
  adminitrador: boolean = false

  constructor(private contratoService: ContratoService, private router: Router, public dialogo: MatDialog,
    private solicitudService: SolicitudService, private cookieService: CookieService) {
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

    let rol = this.cookieService.get('rol')
    if (rol == 'administrador') {
      this.adminitrador = true;
    } else {
      this.adminitrador = false;
    }
  }


  async consultar() {
    const { cliente } = this.formulario.value
    var consolidado: any = {}
    try {
      var respuesta = await this.contratoService.consultarCliente(cliente).toPromise();
      if (respuesta.resultados) {
        consolidado.cliente = respuesta.resultados[0]
      }
      respuesta = await this.contratoService.consultarContrato(cliente).toPromise();
      if (respuesta.resultados) {
        consolidado.subcontratos = respuesta.resultados
        for (let i = 0; i < consolidado.subcontratos.length; i++) {
          const subcontrato = consolidado.subcontratos[i];
          respuesta = await this.contratoService.consultarEstadoContrato(subcontrato.id).toPromise();
          if (respuesta) {
            consolidado.subcontratos[i].mora = respuesta.resultado
          }
        }
        this.consulta = consolidado
        if (consolidado.subcontratos.length == 1) {
          await this.consultarDetalleSubContrato(consolidado.subcontratos[0])
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

  async consultarDetalleSubContrato(subcontrato: any) {
    this.servicios = new MatTableDataSource();
    this.beneficiarios = new MatTableDataSource();
    try {
      this.consulta.subcontrato = subcontrato
      var respuesta = await this.contratoService.consultarBeneficiario(subcontrato.id).toPromise();
      if (respuesta.resultados) {
        this.consulta.beneficiarios = respuesta.resultados
      }

      respuesta = await this.contratoService.consultarHistoricoServicios(subcontrato.id).toPromise();
      if (respuesta.resultados) {
        this.consulta.servicios = respuesta.resultados
      }

      if (this.consulta.servicios) {
        this.servicios = new MatTableDataSource(this.consulta.servicios);
      }
      if (this.consulta.beneficiarios) {
        this.beneficiarios = new MatTableDataSource(this.consulta.beneficiarios);
      }

      this.seleccion = true
      // Refrescamos el paginador después de que se muestre la tabla
      setTimeout(() => {
        this.servicios.paginator = this.paginator;
        //this.servicios.sort = this.sort;
        this.beneficiarios.paginator = this.paginatorBeneficiario;
        //this.beneficiarios.sort = this.sort;
      }, 0);
      this.calcularMensualidadTotal()
    } catch (error) {
      console.log('Error consolidando la consulta: ' + error)
    }
  }

  modificar() {
    this.contratoService.consulta = this.consulta
    this.router.navigate(['/inicio/subcontrato/modificar']);
  }

  solicitar() {
    this.solicitudService.consulta = this.consulta
    this.router.navigate(['/inicio/solicitud']);
  }

  previsualizarSoporte() {
    var archivo = this.consulta.subcontrato.soporte
    var id = this.consulta.subcontrato.id
    if (archivo != '') {
      const byteCharacters = window.atob(archivo.split(',')[1]);
      const byteNumbers = new Array(byteCharacters.length);
      for (let i = 0; i < byteCharacters.length; i++) {
        byteNumbers[i] = byteCharacters.charCodeAt(i);
      }
      const byteArray = new Uint8Array(byteNumbers);
      const blob = new Blob([byteArray], { type: 'application/pdf' });
      this.pdfSoporte = URL.createObjectURL(blob);
      //console.log(this.pdfSoporte)
      this.verSoporte(this.pdfSoporte)
      //saveAs(blob, `Soporte_ ${id}`);
    } else {
      this.alertaAdvertencia('No se ha encontrado un soporte para este subcontrato.')
    }
  }

  verSoporte(soporte: string) {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.maxWidth = '800px';
    dialogConfig.width = '100%';
    dialogConfig.data = { soporte };
    this.dialogo.open(SoporteComponent, dialogConfig)
  }

  calcularMensualidadTotal() {
    let cuota = parseFloat(this.consulta.subcontrato.valor)
    let adicional = parseFloat(this.consulta.subcontrato.adicional)
    let mascota = parseFloat(this.consulta.subcontrato.mascota)
    let mensualidad = 0
    if (cuota) {
      mensualidad = cuota
      if (this.beneficiarios.data.length > 0) {
        this.beneficiarios.data.forEach(beneficiario => {
          if (beneficiario.estado) {
            if (beneficiario.adicional && beneficiario.parentesco != 'MA'
              && adicional) {
              mensualidad += adicional
            } else if (beneficiario.parentesco == 'MA' && mascota) {
              mensualidad += mascota
            }
          }
        });
      }
    }
    this.mensualidadTotal = mensualidad
  }


  homologarParentesco(valor: any) {
    switch (valor) {
      case 'M':
        return 'Madre'
      case 'MC':
        return 'Madre Crianza'
      case 'P':
        return 'Padre'
      case 'PC':
        return 'Padre Crianza'
      case 'Su':
        return 'Suegros'
      case 'C':
        return 'Conyugue o compañera'
      case 'H':
        return 'Hijos'
      case 'E':
        return 'Hermanos'
      case 'Cu':
        return 'Cuñado'
      case 'R':
        return 'Primos'
      case 'Ti':
        return 'Tios'
      case 'S':
        return 'Sobrinos'
      case 'N':
        return 'Nietos'
      case 'A':
        return 'Abuelos'
      case 'O':
        return 'Otros'
      case 'MA':
        return 'Mascota'
      default:
        return 'Sin identificar'
    }
  }

  contruccion(): void {
    Swal.fire({
      title: 'En construcción',
      text: 'Esta funcionalidad actualmente se esta desarrollando, muy pronto estará disponible',
      icon: 'warning',
      confirmButtonText: 'Aceptar'
    });
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