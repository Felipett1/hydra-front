import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ReporteRoutingModule } from './reporte-routing.module';
import { ServicioComponent } from './pages/servicio/servicio.component';
import { HistoricoComponent } from './pages/historico/historico.component';
import { PagoComponent } from './pages/pago/pago.component';
import { MatFormFieldModule } from '@angular/material/form-field';
import { FlexLayoutModule } from '@angular/flex-layout';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button'
import { ReactiveFormsModule } from '@angular/forms';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSortModule } from '@angular/material/sort';
import { MatTableModule } from '@angular/material/table';
import { MatTabsModule } from '@angular/material/tabs';
import { MatSelectModule } from '@angular/material/select';
import { MatStepperModule } from '@angular/material/stepper';
import { MatDialogModule } from '@angular/material/dialog';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { DatePipe } from '@angular/common';
import { MatNativeDateModule } from '@angular/material/core';


@NgModule({
  declarations: [
    ServicioComponent,
    HistoricoComponent,
    PagoComponent
  ],
  imports: [
    CommonModule,
    ReporteRoutingModule,
    MatFormFieldModule,
    FlexLayoutModule,
    MatInputModule,
    MatIconModule,
    MatButtonModule,
    ReactiveFormsModule,
    MatExpansionModule,
    MatPaginatorModule,
    MatSortModule,
    MatTableModule,
    MatTabsModule,
    MatSelectModule,
    MatStepperModule,
    MatDialogModule,
    MatAutocompleteModule,
    MatCheckboxModule,
    DatePipe,
    MatDatepickerModule,
    MatNativeDateModule
  ],
  providers: [
    MatDatepickerModule,
  ]
})
export class ReporteModule { }
