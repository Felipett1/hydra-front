import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ConsultaComponent } from './pages/consulta/consulta.component';
import { CrearComponent } from './pages/crear/crear.component';

const routes: Routes = [  
  {
    path: "", //http:localhost:4200/inicio/servicio
    component:ConsultaComponent
  },
  {
    path: "crear", //http:localhost:4200/inicio/servicio/crear
    component: CrearComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ServicioRoutingModule { }
