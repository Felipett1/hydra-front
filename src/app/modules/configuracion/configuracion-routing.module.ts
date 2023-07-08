import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CambioClaveComponent } from './pages/cambio-clave/cambio-clave.component';

const routes: Routes = [
  {
    path: "", //http:localhost:4200/inicio/configuracion
    component: CambioClaveComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ConfiguracionRoutingModule { }
