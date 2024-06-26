import { Component, Inject } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-historico',
  templateUrl: './historico.component.html',
  styleUrls: ['./historico.component.css']
})
export class HistoricoComponent {
  columasNovedad: string[] = ['fecha', 'tipo', 'detalle', 'usuario'];
  novedades!: MatTableDataSource<any>;

  constructor(@Inject(MAT_DIALOG_DATA) public data: any) {
  }

  ngOnInit(): void {
    this.novedades = new MatTableDataSource(this.data.novedades)
  }

}
