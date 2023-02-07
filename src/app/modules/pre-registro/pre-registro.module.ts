//import { AppModule } from './../../app.module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PreRegistroRoutingModule } from './pre-registro-routing.module';
import { PreRegistroComponent } from './pages/pre-registro/pre-registro.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RegistroExitosoComponent } from './pages/registro-exitoso/registro-exitoso.component';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button'
import { FlexLayoutModule } from '@angular/flex-layout';

@NgModule({
  declarations: [
    PreRegistroComponent,
    RegistroExitosoComponent,
  ],
  imports: [
    CommonModule,
    PreRegistroRoutingModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    FormsModule,
    MatInputModule,
    MatIconModule,
    MatButtonModule,
    FlexLayoutModule
  ]
})
export class PreRegistroModule { }
