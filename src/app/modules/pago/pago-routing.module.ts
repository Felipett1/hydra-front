import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ConsultarComponent } from './pages/consultar/consultar.component';

const routes: Routes = [
  {
    path: "", //http:localhost:4200/inicio/pago
    component: ConsultarComponent
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PagoRoutingModule { }
