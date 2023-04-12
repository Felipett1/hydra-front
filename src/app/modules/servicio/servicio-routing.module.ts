import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ConsultaComponent } from './pages/consulta/consulta.component';
import { SolicitarComponent } from './pages/solicitar/solicitar.component';

const routes: Routes = [
  {
    path: "", //http:localhost:4200/inicio/servicio
    component: ConsultaComponent
  },
  {
    path: "solicitar", //http:localhost:4200/inicio/servicio/solicitar
    component: SolicitarComponent
  }

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ServicioRoutingModule { }
