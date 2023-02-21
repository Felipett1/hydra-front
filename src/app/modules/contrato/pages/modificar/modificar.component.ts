import { BeneficiarioComponent } from './../beneficiario/beneficiario.component';
import { AfterViewInit, Component, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { ContratoService } from './../../service/contrato.service';
import { MatDialog } from '@angular/material/dialog';

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
  consulta!: any
  formulario: FormGroup = new FormGroup({});

  constructor(private contratoService: ContratoService, public dialog: MatDialog) {
  }

  ngOnInit() {
    this.consulta = this.contratoService.consulta
    if (!this.consulta) {
      this.consulta = this.llenarDefecto()
    }
    if (this.consulta) {
      console.log(this.consulta)
      if (this.consulta.beneficiarios) {
        this.dataSource = new MatTableDataSource(this.consulta.beneficiarios);
      }
      this.formulario = new FormGroup(
        {
          nombre_completo: new FormControl(this.consulta.cliente.nombre_completo, [Validators.required]),
          codigo: new FormControl(this.consulta.cliente.codigo, [Validators.required]),
          correo: new FormControl(this.consulta.cliente.correo, [Validators.email]),
          direccion: new FormControl(this.consulta.cliente.direccion),
          ciudad: new FormControl(this.consulta.cliente.ciudad, [Validators.required]),
          grado: new FormControl(this.consulta.cliente.grado, [Validators.required]),
          celular: new FormControl(this.consulta.cliente.celular),
          telefono: new FormControl(this.consulta.cliente.telefono),
          dependencia: new FormControl(this.consulta.cliente.dependencia, [Validators.required]),
          observaciones: new FormControl(this.consulta.cliente.observaciones)
        }
      )
    }
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  modificarBeneficiario(beneficiario: any, index: any) {
    console.log(index)
    const dialogRef = this.dialog.open(BeneficiarioComponent, {
      data: { beneficiario, index },
    })
  }

  eliminarBeneficiario(i: any) {
    console.log(i)
    this.consulta.beneficiarios.splice(i, 1);
    this.dataSource = new MatTableDataSource(this.consulta.beneficiarios);
  }


  llenarDefecto() {
    return {
      "contrato": {
        "id": "12345",
        "cliente": "1092644529",
        "fecha_inicio": "2023-01-10 20:41:35.504348",
        "estado": true,
        "plan": "Zafiro",
        "valor": "23800",
        "soporte": "",
        "cuotas": "36",
        "mora": false
      },
      "cliente": {
        "documento": "1092644529",
        "nombre_completo": "Alvaro Reyes Lopez Diaz",
        "codigo": "1092644529",
        "correo": "nombre@correo.co",
        "direccion": "Cr 80 # 22 -56",
        "ciudad": "Bogota",
        "grado": "SLP",
        "celular": "3103039986",
        "telefono": "6015406780",
        "dependencia": "EJC",
        "observaciones": "Buscar bienestarpara su familia."
      },
      "beneficiarios": [
        {
          "secuencia": 2,
          "contrato": "12345",
          "nombre": "Jose Perez",
          "edad": "7",
          "parentesco": "h",
          "adicional": false,
          "contacto": "6013423434",
          "emoji": "local_hospital"
        },
        {
          "secuencia": 3,
          "contrato": "12345",
          "nombre": "Carlos Martinez",
          "edad": "55",
          "parentesco": "p",
          "adicional": false,
          "contacto": "350345754",
          "emoji": "gavel"
        },
        {
          "secuencia": 4,
          "contrato": "12345",
          "nombre": "Carmen Salazar",
          "edad": "48",
          "parentesco": "m",
          "adicional": false,
          "contacto": "3205678932",
          "emoji": "local_hospital"
        }
      ],
      "servicios": [
        {
          "documento": "1092644529",
          "nombre_completo": "Alvaro Reyes Lopez Diaz",
          "estado": true,
          "celular": "3103039986",
          "telefono": "6015406780",
          "secuencia": 3,
          "fecha_inicial": "2023-02-16 23:21:58.300888",
          "tipo": "Legal",
          "detalle_inicial": "Requiere asesoria de comparendos.",
          "fecha_final": null,
          "detalle_final": null
        },
        {
          "documento": "1092644529",
          "nombre_completo": "Alvaro Reyes Lopez Diaz",
          "estado": true,
          "celular": "3103039986",
          "telefono": "6015406780",
          "secuencia": 4,
          "fecha_inicial": "2023-02-16 23:21:58.300888",
          "tipo": "Medico",
          "detalle_inicial": "Genera cita de urgencias.",
          "fecha_final": null,
          "detalle_final": null
        },
        {
          "documento": "1092644529",
          "nombre_completo": "Alvaro Reyes Lopez Diaz",
          "estado": true,
          "celular": "3103039986",
          "telefono": "6015406780",
          "secuencia": 2,
          "fecha_inicial": "2023-02-16 23:21:58.300888",
          "tipo": "Medico",
          "detalle_inicial": "Solicita una vista media domiciliaria.",
          "fecha_final": "2023-02-16 23:21:58.300888",
          "detalle_final": "Se presta el servicio"
        },
        {
          "documento": "1092644529",
          "nombre_completo": "Alvaro Reyes Lopez Diaz",
          "estado": true,
          "celular": "3103039986",
          "telefono": "6015406780",
          "secuencia": 1,
          "fecha_inicial": "2023-02-16 23:21:58.300888",
          "tipo": "Medico",
          "detalle_inicial": "Requiere un servicio de odontologia.",
          "fecha_final": null,
          "detalle_final": null
        }
      ]
    }
  }
}
