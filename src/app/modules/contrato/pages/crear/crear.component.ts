import { AfterViewInit, Component, ViewChild } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { BreakpointObserver } from '@angular/cdk/layout';
import { StepperOrientation } from '@angular/material/stepper';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';

@Component({
  selector: 'app-crear',
  templateUrl: './crear.component.html',
  styleUrls: ['./crear.component.css']
})
export class CrearComponent {
  firstFormGroup = this._formBuilder.group({
    firstCtrl: ['', Validators.required],
  });
  secondFormGroup = this._formBuilder.group({
    secondCtrl: ['', Validators.required],
  });
  thirdFormGroup = this._formBuilder.group({
    thirdCtrl: ['', Validators.required],
  });
  stepperOrientation: Observable<StepperOrientation>;

  //Tabla
  displayedColumns: string[] = ['nombre', 'edad', 'parentesco', 'contacto', 'emoji', 'borrar'];
  dataSource!: MatTableDataSource<any>;
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(private _formBuilder: FormBuilder, breakpointObserver: BreakpointObserver) {
    this.stepperOrientation = breakpointObserver
      .observe('(min-width: 800px)')
      .pipe(map(({ matches }) => (matches ? 'horizontal' : 'vertical')));

    const data = [
      {
        nombre: "Yoskerlin Maria Brito Zapata",
        edad: 28,
        parentesco: "Esposa",
        contacto: "3102424650",
        emoji: ":)"
      },
      {
        nombre: "Samantha Isabell Brito Zapata",
        edad: 5,
        parentesco: "Hija",
        contacto: "Sin numero",
        emoji: "xD"
      },
      {
        nombre: "Juan Felipe Triviño",
        edad: 7,
        parentesco: "Hijo",
        contacto: "Sin numero",
        emoji: ">:)"
      }
    ]
    this.dataSource = new MatTableDataSource(data);
  }
}
