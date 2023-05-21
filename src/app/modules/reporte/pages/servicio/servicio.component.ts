import { ReporteService } from './../../service/reporte.service';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Component } from '@angular/core';
import * as XLSX from 'xlsx';

@Component({
  selector: 'app-servicio',
  templateUrl: './servicio.component.html',
  styleUrls: ['./servicio.component.css']
})
export class ServicioComponent {
  formulario: FormGroup = new FormGroup({});


  constructor(private reporteService: ReporteService) {
  }


  ngOnInit(): void {
    this.formulario = new FormGroup(
      {
        fechaInicio: new FormControl('', [Validators.required]),
        fechaFin: new FormControl('', [Validators.required])
      }
    )
  }

  async generarReporte() {
    var respuesta = await this.reporteService.obtenerServicioTiempo(this.formulario.value).toPromise();
    if (respuesta.resultados) {
      let data = respuesta.resultados
      // Crear una nueva instancia de la hoja de cálculo
      const workbook = XLSX.utils.book_new();
      // Crear una nueva hoja en el libro
      const worksheet = XLSX.utils.json_to_sheet(data);
      // Agregar la hoja al libro
      XLSX.utils.book_append_sheet(workbook, worksheet, 'Resultados');
      // Generar el archivo Excel en formato de datos binarios
      const excelBuffer: any = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
      // Crear un Blob a partir de los datos binarios
      const blob = new Blob([excelBuffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
      // Crear una URL para el Blob
      const url = URL.createObjectURL(blob);
      // Crear un enlace de descarga
      const link = document.createElement('a');
      link.href = url;
      link.download = 'Servicios.xlsx';
      link.click();
      // Liberar la URL creada para el Blob
      URL.revokeObjectURL(url);
    }
  }
}
