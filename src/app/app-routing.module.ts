import { InicioComponent } from './modules/inicio/pages/inicio/inicio.component';
import { NgModule } from '@angular/core';
import { Router, RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: "registro", //http://localhost:4200/registro
    loadChildren: () => import('./modules/pre-registro/pre-registro.module').then(m => m.PreRegistroModule)
  },
  {
    path: "login", //http://localhost:4200/login
    loadChildren: () => import('./modules/auth/auth.module').then(m => m.AuthModule)
  },
  {
    path: "inicio", //http://localhost:4200/inicio
    component: InicioComponent,
    loadChildren: () => import('./modules/inicio/inicio.module').then(m => m.InicioModule)
  },
  {
    path: "", //http://localhost:4200/
    redirectTo: "/registro",
    pathMatch: "full"
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
