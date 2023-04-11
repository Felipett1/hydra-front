import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { ServicioRoutingModule } from './servicio-routing.module';
import { ConsultaComponent } from './pages/consulta/consulta.component';
import { ServicioComponent } from './pages/servicio/servicio.component';
import { FlexLayoutModule } from '@angular/flex-layout';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button'
import { ReactiveFormsModule } from '@angular/forms';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatTableModule } from '@angular/material/table';
import { MatTabsModule } from '@angular/material/tabs';
import { MatSelectModule } from '@angular/material/select';
import { MatStepperModule } from '@angular/material/stepper';
import { MatDialogModule } from '@angular/material/dialog';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatCheckboxModule } from '@angular/material/checkbox';

@NgModule({
  declarations: [
    ConsultaComponent,
    ServicioComponent
  ],
  imports: [
    CommonModule,
    ServicioRoutingModule,
    FlexLayoutModule,
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
    MatButtonModule,
    ReactiveFormsModule,
    MatExpansionModule,
    MatPaginatorModule,
    MatTableModule,
    MatTabsModule,
    MatSelectModule,
    MatStepperModule,
    MatDialogModule,
    MatAutocompleteModule,
    MatCheckboxModule
  ]
})
export class ServicioModule { }
