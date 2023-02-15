import { ModificarComponent } from './pages/modificar/modificar.component';
import { ConsultarComponent } from './pages/consultar/consultar.component';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: "", //http:localhost:4200/login/
    component: ConsultarComponent
  },
  {
    path: "modificar", //http:localhost:4200/login/
    component: ModificarComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ContratoRoutingModule { }
