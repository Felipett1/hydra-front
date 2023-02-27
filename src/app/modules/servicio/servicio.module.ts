import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ServicioRoutingModule } from './servicio-routing.module';
import { CrearComponent } from './pages/crear/crear.component';


@NgModule({
  declarations: [
    CrearComponent
  ],
  imports: [
    CommonModule,
    ServicioRoutingModule
  ]
})
export class ServicioModule { }
