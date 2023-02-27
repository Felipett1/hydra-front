import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { ServicioRoutingModule } from './servicio-routing.module';
import { CrearComponent } from './pages/crear/crear.component';
import { ConsultaComponent } from './pages/consulta/consulta.component';
import { MatGridListModule } from '@angular/material/grid-list';
import { FlexLayoutModule } from '@angular/flex-layout';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';


@NgModule({
  declarations: [
    CrearComponent,
    ConsultaComponent
  ],
  imports: [
    CommonModule,
    ServicioRoutingModule,
    MatFormFieldModule,
    MatGridListModule,
    FlexLayoutModule,
    MatIconModule,
    MatInputModule,
    

  ]
})
export class ServicioModule { }
