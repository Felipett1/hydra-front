import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ContratoRoutingModule } from './contrato-routing.module';
import { ConsultarComponent } from './pages/consultar/consultar.component';
import { ModificarComponent } from './pages/modificar/modificar.component';
import { CrearComponent } from './pages/crear/crear.component';
import { FlexLayoutModule } from '@angular/flex-layout';
import { MatFormFieldModule } from '@angular/material/form-field';
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
import { BeneficiarioComponent } from './pages/beneficiario/beneficiario.component';
import { MatDialogModule } from '@angular/material/dialog';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { PdfViewerModule } from 'ng2-pdf-viewer';
import { SoporteComponent } from './pages/soporte/soporte.component';
import { CerrarComponent } from './pages/cerrar/cerrar.component';


@NgModule({
  declarations: [
    ConsultarComponent,
    ModificarComponent,
    CrearComponent,
    BeneficiarioComponent,
    SoporteComponent,
    CerrarComponent
  ],
  imports: [
    CommonModule,
    ContratoRoutingModule,
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
    MatCheckboxModule,
    PdfViewerModule
  ]
})
export class ContratoModule { }

//platformBrowserDynamic().bootstrapModule(ContratoModule);