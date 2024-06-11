import { MasivoComponent } from './../../../pago/pages/masivo/masivo.component';
import { Router } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';
import { MediaMatcher } from '@angular/cdk/layout';
import { ChangeDetectorRef, Component, OnDestroy } from '@angular/core';
import Swal from 'sweetalert2';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { ServicioComponent } from '@modules/reporte/pages/servicio/servicio.component';
import { PagoComponent } from '@modules/reporte/pages/pago/pago.component';

@Component({
  selector: 'app-inicio',
  templateUrl: './inicio.component.html',
  styleUrls: ['./inicio.component.css']
})
export class InicioComponent implements OnDestroy {
  mobileQuery: MediaQueryList;
  adminitrador: boolean = false

  private _mobileQueryListener: () => void;

  constructor(changeDetectorRef: ChangeDetectorRef, media: MediaMatcher, private cookieService: CookieService,
    private router: Router, public dialogo: MatDialog) {
    this.mobileQuery = media.matchMedia('(max-width: 600px)');
    this._mobileQueryListener = () => changeDetectorRef.detectChanges();
    this.mobileQuery.addListener(this._mobileQueryListener);
  }

  ngOnInit(): void {
    let rol = this.cookieService.get('rol')
    if (rol == 'administrador') {
      this.adminitrador = true;
    } else {
      this.adminitrador = false;
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

  pagoMasivo() {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.maxWidth = '600px';
    dialogConfig.width = '100%';
    dialogConfig.panelClass = 'my-modal'
    this.dialogo.open(MasivoComponent, dialogConfig)
  }
}
