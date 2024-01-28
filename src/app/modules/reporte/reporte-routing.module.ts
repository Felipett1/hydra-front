import { PagoComponent } from './pages/pago/pago.component';
import { HistoricoComponent } from './pages/historico/historico.component';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ServicioComponent } from '@modules/reporte/pages/servicio/servicio.component';

const routes: Routes = [
  {
    path: "servicio", //http:localhost:4200/inicio/reporte/servicio
    component: ServicioComponent
  },
  {
    path: "historico", //http:localhost:4200/inicio/reporte/historico
    component: HistoricoComponent
  },
  {
    path: "pago", //http:localhost:4200/inicio/reporte/pago
    component: PagoComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ReporteRoutingModule { }
