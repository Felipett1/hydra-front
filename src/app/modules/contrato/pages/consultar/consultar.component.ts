import { PagoService } from '@modules/pago/service/pago.service';
import { DetalleComponent } from './../detalle/detalle.component';
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
import { jsPDF } from 'jspdf';
import { saveAs } from 'file-saver';

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
  @ViewChild('pgtServicioCerrado') paginatorServicioCerrado!: MatPaginator;
  @ViewChild('pgtBeneficiario') paginatorBeneficiario!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  //Ver PDF
  public pdfSoporte: any = null;
  columasServicio: string[] = ['secuencia', 'fecha_inicial', 'tipo', 'detalle'];
  columasServicioCerrado: string[] = ['secuencia', 'fecha_inicial', 'tipo', 'detalle', 'consulta'];
  servicios!: MatTableDataSource<any>;
  serviciosCerrados!: MatTableDataSource<any>;
  mensualidadTotal = 0
  adminitrador: boolean = false

  constructor(private contratoService: ContratoService, private router: Router, public dialogo: MatDialog,
    private solicitudService: SolicitudService, private cookieService: CookieService, private pagoService: PagoService) {
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
      console.log(respuesta)
      if (respuesta.resultados) {
        consolidado.cliente = respuesta.resultados[0]
      }
      respuesta = await this.contratoService.consultarContrato(cliente).toPromise();
      if (respuesta.resultados) {
        consolidado.subcontratos = respuesta.resultados
        for (let i = 0; i < consolidado.subcontratos.length; i++) {
          const subcontrato = consolidado.subcontratos[i];
          if (subcontrato.estado) {
            respuesta = await this.contratoService.consultarEstadoContrato(subcontrato.id).toPromise();
            if (respuesta) {
              consolidado.subcontratos[i].mora = respuesta.resultado
            }
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
    this.serviciosCerrados = new MatTableDataSource();
    this.beneficiarios = new MatTableDataSource();
    try {
      this.consulta.subcontrato = subcontrato
      var respuesta = await this.contratoService.consultarBeneficiario(subcontrato.id).toPromise();
      if (respuesta.resultados) {
        this.consulta.beneficiarios = respuesta.resultados
      }

      //Consulta servicios Abiertos
      respuesta = await this.contratoService.consultarServicioAbierto(subcontrato.id).toPromise();
      if (respuesta.resultados) {
        this.consulta.servicioAbierto = respuesta.resultados
      }

      //Consulta servicios Cerrados
      respuesta = await this.contratoService.consultarServicioCerrado(subcontrato.id).toPromise();
      if (respuesta.resultados) {
        this.consulta.servicioCerrado = respuesta.resultados
      }

      if (this.consulta.servicioAbierto) {
        this.servicios = new MatTableDataSource(this.consulta.servicioAbierto);
      }
      if (this.consulta.servicioCerrado) {
        this.serviciosCerrados = new MatTableDataSource(this.consulta.servicioCerrado);
      }
      if (this.consulta.beneficiarios) {
        this.beneficiarios = new MatTableDataSource(this.consulta.beneficiarios);
      }

      this.seleccion = true
      // Refrescamos el paginador después de que se muestre la tabla
      setTimeout(() => {
        this.servicios.paginator = this.paginator;
        this.serviciosCerrados.paginator = this.paginatorServicioCerrado;
        this.beneficiarios.paginator = this.paginatorBeneficiario;
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

  pago() {
    this.pagoService.consulta = this.consulta
    this.router.navigate(['/inicio/pago']);
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

  verDetalleCierre(servicio: any) {
    this.dialogo.open(DetalleComponent, {
      data: servicio,
      maxWidth: '600px',
    })
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

  generarCarnet(): void {
    console.log('Entro')
    const imageSrc = 'assets/plantillaCarnet.jpg';
    const pdf = new jsPDF();
    const img = new Image();
    img.src = imageSrc;
    img.onload = () => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      canvas.width = img.width;
      canvas.height = img.height;

      if (ctx) {
        ctx.drawImage(img, 0, 0);
      }
      pdf.addImage(canvas.toDataURL('image/jpeg'), 'JPEG', 0, 0, pdf.internal.pageSize.getWidth(), pdf.internal.pageSize.getHeight());

      // Sobreponer texto en el PDF
      pdf.setFontSize(12);
      pdf.text(this.insertarSaltoDeLinea(this.consulta.cliente.nombre_completo), 52, 147);
      pdf.text('Documento', 108, 147);
      pdf.text(this.consulta.cliente.documento, 110, 152);
      pdf.text('Plan', 145, 147);
      pdf.text(this.consulta.subcontrato.plan, 142, 152);

      if (this.consulta.beneficiarios) {
        let posicion = 162
        for (let index = 0; index < this.consulta.beneficiarios.length; index++) {
          const beneficiario = this.consulta.beneficiarios[index];
          pdf.text(beneficiario.nombre, 60, posicion);
          posicion += 8
          if (index == 1 || index == 3 || index == 5) {
            posicion -= 1
          }
        }
      }

      // Descargar el PDF
      pdf.save(`Carnet${this.consulta.subcontrato.id}.pdf`);
    }
  }

  insertarSaltoDeLinea(texto: string): string {
    const espacios = texto.split(' ');
    if (espacios.length >= 2) {
      espacios.splice(2, 0, '\n');
    }
    return espacios.join(' ');
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