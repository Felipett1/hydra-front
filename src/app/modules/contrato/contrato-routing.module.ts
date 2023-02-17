import { CrearComponent } from './pages/crear/crear.component';
import { ModificarComponent } from './pages/modificar/modificar.component';
import { ConsultarComponent } from './pages/consultar/consultar.component';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: "", //http:localhost:4200/inicio/contrato
    component: ConsultarComponent
  },
  {
    path: "modificar", //http:localhost:4200/inicio/contrato/modificar
    component: ModificarComponent
  },
  {
    path: "crear", //http:localhost:4200/inicio/contrato/crear
    component: CrearComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ContratoRoutingModule { }
