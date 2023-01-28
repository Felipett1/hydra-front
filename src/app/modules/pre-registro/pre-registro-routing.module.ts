import { RegistroExitosoComponent } from './pages/registro-exitoso/registro-exitoso.component';
import { PreRegistroComponent } from './pages/pre-registro/pre-registro.component';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: "",
    component: PreRegistroComponent
  },
  {
    path: "exitoso",
    component: RegistroExitosoComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PreRegistroRoutingModule { }
