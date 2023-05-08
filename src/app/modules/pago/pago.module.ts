import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PagoRoutingModule } from './pago-routing.module';
import { ConsultarComponent } from './pages/consultar/consultar.component';
import { MatListModule } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatGridListModule } from '@angular/material/grid-list';

@NgModule({
  declarations: [
    ConsultarComponent
  ],
  imports: [
    CommonModule,
    PagoRoutingModule,
    MatListModule,
    MatIconModule,
    MatGridListModule,
    MatButtonModule
    
  ]
})
export class PagoModule { }
