import { Component } from '@angular/core';

@Component({
  selector: 'app-consultar',
  templateUrl: './consultar.component.html',
  styleUrls: ['./consultar.component.css']
})
export class ConsultarComponent {
  fechas: any[] = [
    {
      fecha: 'ene-22',
      estado: 1,
      valor: 29.000

    },
    {
      fecha: 'ene-22',
      estado: 1,
    },
    {
      fecha: 'ene-22',
      estado: 1,
    },
    {
      fecha: 'ene-22',
      estado: 1,
      valor: 29.000

    },
    {
      fecha: 'ene-22',
      estado: 1,
    },
    {
      fecha: 'ene-22',
      estado: 1,
    },
    {
      fecha: 'ene-22',
      estado: 3,
      valor: 29.000

    },
    {
      fecha: 'ene-22',
      estado: 4,
    },
    {
      fecha: 'ene-22',
      estado: 2,
    },

  ];

  /*
    Estado
    1:al dia 
    2:pendiente
    3:incompleto
    4:en mora
  */
  asignarColor(estado: any) {
    switch (estado) {
      case 1:
        return '#61CE70';
      case 2:
        return '#BDBDBD';
      case 3:
        return '#CDDC39';
      case 4:
        return '#F37B72';

      default:
        return '';
    }
  }
}
