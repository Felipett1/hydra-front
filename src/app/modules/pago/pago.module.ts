
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
import {MatCheckboxModule} from '@angular/material/checkbox';
import { FormsModule } from '@angular/forms';
import { MasivoComponent } from './pages/masivo/masivo.component';
import { FlexLayoutModule } from '@angular/flex-layout';
import { AnticipadoComponent } from './pages/anticipado/anticipado.component';

@NgModule({
  declarations: [
    ConsultarComponent,
    DetallePagoComponent,
    MasivoComponent,
    AnticipadoComponent
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
    MatDialogModule,
    MatCheckboxModule,
    FormsModule,
    FlexLayoutModule
  ]
})
export class PagoModule { }
