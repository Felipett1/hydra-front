import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PreRegistroRoutingModule } from './pre-registro-routing.module';
import { PreRegistroComponent } from './pages/pre-registro/pre-registro.component';
import { ReactiveFormsModule } from '@angular/forms';
import { RegistroExitosoComponent } from './pages/registro-exitoso/registro-exitoso.component';


@NgModule({
  declarations: [
    PreRegistroComponent,
    RegistroExitosoComponent
  ],
  imports: [
    CommonModule,
    PreRegistroRoutingModule,
    ReactiveFormsModule
  ]
})
export class PreRegistroModule { }
