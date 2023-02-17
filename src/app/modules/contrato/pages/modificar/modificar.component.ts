import { AfterViewInit, Component, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';

@Component({
  selector: 'app-modificar',
  templateUrl: './modificar.component.html',
  styleUrls: ['./modificar.component.css']
})
export class ModificarComponent {
  displayedColumns: string[] = ['nombre', 'edad', 'parentesco', 'contacto', 'emoji', 'editar', 'borrar'];
  dataSource!: MatTableDataSource<any>;
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor() {
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

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }
}
