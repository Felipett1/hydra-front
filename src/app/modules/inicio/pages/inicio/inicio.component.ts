import { MasivoComponent } from './../../../pago/pages/masivo/masivo.component';
import { Router } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';
import { MediaMatcher } from '@angular/cdk/layout';
import { ChangeDetectorRef, Component, OnDestroy } from '@angular/core';
import Swal from 'sweetalert2';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { ServicioComponent } from '@modules/reporte/pages/servicio/servicio.component';
import { PagoComponent } from '@modules/reporte/pages/pago/pago.component';
import * as XLSX from 'xlsx';
import { ReporteService } from '@modules/reporte/service/reporte.service';

@Component({
  selector: 'app-inicio',
  templateUrl: './inicio.component.html',
  styleUrls: ['./inicio.component.css']
})
export class InicioComponent implements OnDestroy {
  mobileQuery: MediaQueryList;
  administrador: boolean = false

  private _mobileQueryListener: () => void;

  constructor(changeDetectorRef: ChangeDetectorRef, media: MediaMatcher, private cookieService: CookieService,
    private router: Router, public dialogo: MatDialog, private reporteService: ReporteService) {
    this.mobileQuery = media.matchMedia('(max-width: 600px)');
    this._mobileQueryListener = () => changeDetectorRef.detectChanges();
    this.mobileQuery.addListener(this._mobileQueryListener);
  }

  ngOnInit(): void {
    let rol = this.cookieService.get('rol')
    if (rol == 'administrador') {
      this.administrador = true;
    } else {
      this.administrador = false;
    }
  }

  ngOnDestroy(): void {
    this.mobileQuery.removeListener(this._mobileQueryListener);
  }

  cerrarSesion() {
    this.cookieService.delete('token', '/')
    this.cookieService.delete('usuario', '/')
    this.cookieService.delete('rol', '/')
    localStorage.clear();
    sessionStorage.clear();
    this.router.navigate(['/', 'login'])

  }

  contruccion(): void {
    Swal.fire({
      title: 'En construcción',
      text: 'Esta funcionalidad actualmente se esta desarrollando, muy pronto estará disponible',
      icon: 'warning',
      confirmButtonText: 'Aceptar'
    });
  }

  reporteServicio() {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.maxWidth = '600px';
    dialogConfig.width = '100%';
    this.dialogo.open(ServicioComponent, dialogConfig)
  }

  reportePago() {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.maxWidth = '600px';
    dialogConfig.width = '100%';
    this.dialogo.open(PagoComponent, dialogConfig)
  }

  async reporteConsolidadoGeneral() {
    var respuesta = await this.reporteService.obtenerConsolidadoGeneral().toPromise();
    if (respuesta.resultados) {
      let data = respuesta.resultados
      // Crear una nueva instancia de la hoja de cálculo
      const workbook = XLSX.utils.book_new();
      // Crear una nueva hoja en el libro
      const worksheet = XLSX.utils.json_to_sheet(data);
      // Agregar la hoja al libro
      XLSX.utils.book_append_sheet(workbook, worksheet, 'Resultados');
      // Generar el archivo Excel en formato de datos binarios
      const excelBuffer: any = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
      // Crear un Blob a partir de los datos binarios
      const blob = new Blob([excelBuffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
      // Crear una URL para el Blob
      const url = URL.createObjectURL(blob);
      // Crear un enlace de descarga
      const link = document.createElement('a');
      link.href = url;
      link.download = `Consolidado General (${this.formatoFecha(new Date())}).xlsx`;
      link.click();
      // Liberar la URL creada para el Blob
      URL.revokeObjectURL(url);
      this.alertaExitoso(respuesta.estado.detalle)
    } else {
      this.alertaAdvertencia(respuesta.estado.detalle)
    }
  }

  formatoFecha(fecha: any) {
    // Obtener los componentes de la fecha (año, mes y día)
    var año = fecha.getFullYear();
    var mes = ('0' + (fecha.getMonth() + 1)).slice(-2); // Agregar cero inicial si el mes es menor a 10
    var día = ('0' + fecha.getDate()).slice(-2); // Agregar cero inicial si el día es menor a 10
    // Formatear la fecha en el formato "yyyy-MM-dd"
    var fechaFormateada = año + '-' + mes + '-' + día;

    return fechaFormateada; // Ejemplo de salida: "2023-05-19"
  }

  alertaExitoso(mensaje: string): void {
    Swal.fire({
      title: 'Transacción exitosa',
      text: mensaje,
      icon: 'success',
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

  pagoMasivo() {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.maxWidth = '600px';
    dialogConfig.width = '100%';
    dialogConfig.panelClass = 'my-modal'
    this.dialogo.open(MasivoComponent, dialogConfig)
  }
}
