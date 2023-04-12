import { Component, OnInit } from '@angular/core';
import { ThemePalette } from '@angular/material/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';

export interface Task {
  name: string;
  completed: boolean;
  color: ThemePalette;
  subtasks?: Task[];
}

@Component({
  selector: 'app-solicitar',
  templateUrl: './solicitar.component.html',
  styleUrls: ['./solicitar.component.css']
})

export class SolicitarComponent implements OnInit {

  enviarSolicitud = new FormGroup({
    descripcionserv: new FormControl('', [Validators.required])
  });

  texto: string = '';

  constructor() { }

  ngOnInit(): void {
  }

  task: Task = {
    name: 'Marcar / Desmarcar',
    completed: false,
    color: 'primary',
    subtasks: [
      { name: 'Servicio 1', completed: false, color: 'primary' },
      { name: 'Servicio 2', completed: false, color: 'primary' },
      { name: 'Servicio 3', completed: false, color: 'primary' },
      { name: 'Servicio 4', completed: false, color: 'primary' },
      { name: 'Servicio 5', completed: false, color: 'primary' },
    ],
  };

  allComplete: boolean = false;


  updateAllComplete() {
    this.allComplete = this.task.subtasks != null && this.task.subtasks.every(t => t.completed);
  }

  someComplete(): boolean {
    if (this.task.subtasks == null) {
      return false;
    }
    return this.task.subtasks.filter(t => t.completed).length > 0 && !this.allComplete
  }

  setAll(completed: boolean) {
    this.allComplete = completed;
    if (this.task.subtasks == null) {
      return;
    }
    this.task.subtasks.forEach(t => (t.completed = completed));
  }

  solicitarServicio() {

  }

  validarformulario() {
    if (this.enviarSolicitud.invalid) {
      return true
    }
    else {
      if (this.task.subtasks) {
        for (let i = 0; i < this.task.subtasks.length; i++) {
          const element = this.task.subtasks[i];
          if (element.completed) {
            return false
          }
        }
      }
      return true
    }
  }
  
  borrarTexto() {
    this.texto = '';
  }
}