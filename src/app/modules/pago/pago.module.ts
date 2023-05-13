
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PagoRoutingModule } from './pago-routing.module';
import { ConsultarComponent } from './pages/consultar/consultar.component';
import { MatListModule } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatGridListModule } from '@angular/material/grid-list';
import { ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { DetallePagoComponent } from './pages/detalle-pago/detalle-pago.component';
import { MatDialogModule } from '@angular/material/dialog';

@NgModule({
  declarations: [
    ConsultarComponent,
    DetallePagoComponent
  ],
  imports: [
    CommonModule,
    PagoRoutingModule,
    MatListModule,
    MatIconModule,
    MatGridListModule,
    MatButtonModule,
    ReactiveFormsModule,
    HttpClientModule,
    MatFormFieldModule,
    MatInputModule,
    MatDialogModule
  ]
})
export class PagoModule { }
