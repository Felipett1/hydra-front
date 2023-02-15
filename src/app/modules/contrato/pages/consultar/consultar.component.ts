import { AfterViewInit, Component, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';

@Component({
  selector: 'app-consultar',
  templateUrl: './consultar.component.html',
  styleUrls: ['./consultar.component.css']
})
export class ConsultarComponent {
  displayedColumns: string[] = ['nombre', 'edad', 'parentesco', 'contacto', 'emoji'];
  dataSource!: MatTableDataSource<any>;
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  columasServicio: string[] = ['id', 'fecha', 'tipo', 'estado'];
  servicios!: MatTableDataSource<any>;

  constructor() {
    // Create 100 users
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

    const servicios = [
      {
        id: "4234",
        fecha: "07/12/2022",
        tipo: "Legal",
        estado: "Cerrado"
      },
      {
        id: "5644",
        fecha: "28/12/2022",
        tipo: "Medico",
        estado: "Cerrado"
      },
      {
        id: "32398",
        fecha: "15/01/2023",
        tipo: "Medico",
        estado: "Cerrado"
      },
      {
        id: "67545",
        fecha: "05/02/2023",
        tipo: "Medico",
        estado: "Abierto"
      }
    ]
    // Assign the data to the data source for the table to render
    this.dataSource = new MatTableDataSource(data);
    this.servicios = new MatTableDataSource(servicios);
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }
}
