import { InicioService } from './../../../modules/inicio/service/inicio.service';
import { Component } from '@angular/core';


@Component({
  selector: 'app-toolbar',
  templateUrl: './toolbar.component.html',
  styleUrls: ['./toolbar.component.css']
})
export class ToolbarComponent {

  constructor(private inicioService: InicioService) {
  }

  clickMenu() { 
    console.log('Click Menu!')
    console.log(this.inicioService)
    this.inicioService.toggle();
  }
}
