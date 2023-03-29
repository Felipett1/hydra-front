import { ConfiguracionModule } from './../configuracion/configuracion.module';
import { ReporteModule } from './../reporte/reporte.module';
import { PagoModule } from './../pago/pago.module';
import { ServicioModule } from './../servicio/servicio.module';
import { ContratoModule } from './../contrato/contrato.module';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: "subcontrato", //http://localhost:4200/inico/contrato
    loadChildren: () => import('../contrato/contrato.module').then(m => m.ContratoModule)
  },
  {
    path: "servicio", //http://localhost:4200/inico/servicio
    loadChildren: () => import('../servicio/servicio.module').then(m => m.ServicioModule)
  },
  {
    path: "pago", //http://localhost:4200/inico/pago
    loadChildren: () => import('../pago/pago.module').then(m => m.PagoModule)
  },
  {
    path: "reporte", //http://localhost:4200/inico/reporte
    loadChildren: () => import('../reporte/reporte.module').then(m => m.ReporteModule)
  },
  {
    path: "configuracion", //http://localhost:4200/inico/configuracion
    loadChildren: () => import('../configuracion/configuracion.module').then(m => m.ConfiguracionModule)
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class InicioRoutingModule { }
