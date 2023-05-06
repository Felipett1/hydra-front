import { BeneficiarioComponent } from './../beneficiario/beneficiario.component';
import { AfterViewInit, Component, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { ContratoService } from './../../service/contrato.service';
import { MatDialog } from '@angular/material/dialog';
import { map, Observable, startWith } from 'rxjs';
import Swal from 'sweetalert2';
import { Router } from '@angular/router';
import { Location } from '@angular/common';

@Component({
  selector: 'app-modificar',
  templateUrl: './modificar.component.html',
  styleUrls: ['./modificar.component.css']
})
export class ModificarComponent {
  displayedColumns: string[] = ['nombre', 'edad', 'parentesco', 'contacto', 'emoji', 'adicional', 'estado', 'editar'];
  beneficiarios!: MatTableDataSource<any>;
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  consulta!: any
  formulario: FormGroup = new FormGroup({});
  //Select de ciudades
  options: string[] = [];
  filteredOptions!: Observable<string[]> | undefined;
  //Soporte
  soporte: string = '';
  mensualidadTotal = 0

  constructor(private contratoService: ContratoService, public dialog: MatDialog, private router: Router,
    private location: Location) {
    //Se suscribe al agregar un nuevo beneficiario
    this.contratoService.getData().subscribe(beneficiario => {
      const data = this.beneficiarios.data;
      if (beneficiario.index >= 0) {
        data[beneficiario.index] = beneficiario;
      } else {
        data.push(beneficiario)
      }
      this.beneficiarios.data = data;
      this.calcularMensualidadTotal()
    });
  }

  async ngOnInit() {
    this.consulta = this.contratoService.consulta
    if (!this.consulta) {
      this.consulta = this.llenarDefecto()
    }
    if (this.consulta) {
      if (this.consulta.beneficiarios) {
        this.beneficiarios = new MatTableDataSource(this.consulta.beneficiarios);
      }
      this.formulario = new FormGroup(
        {
          nombre_completo: new FormControl(this.consulta.cliente.nombre_completo, [Validators.required]),
          codigo: new FormControl(this.consulta.subcontrato.codigo, [Validators.required]),
          correo: new FormControl(this.consulta.subcontrato.correo, [Validators.email]),
          direccion: new FormControl(this.consulta.subcontrato.direccion),
          ciudad: new FormControl(this.consulta.subcontrato.ciudad, [Validators.required]),
          grado: new FormControl(this.consulta.subcontrato.grado, [Validators.required]),
          celular: new FormControl(this.consulta.subcontrato.celular),
          telefono: new FormControl(this.consulta.subcontrato.telefono),
          dependencia: new FormControl(this.consulta.subcontrato.dependencia, [Validators.required]),
          observaciones: new FormControl(this.consulta.subcontrato.observaciones),
          cuotas: new FormControl(this.consulta.subcontrato.cuotas, [Validators.required]),
          soporte: new FormControl(this.consulta.subcontrato.soporte, [Validators.required])
        }
      )
      this.soporte = this.consulta.subcontrato.soporte
      this.calcularMensualidadTotal()
    }

    //Ciudades
    var ciudades = await this.contratoService.consultarCiudades().toPromise();
    if (ciudades) {
      for (var i = 0; i < ciudades.length; i++) {
        this.options[i] = `${ciudades[i].municipio} - ${ciudades[i].departamento}`
      }
    }

    this.filteredOptions = this.formulario.get('ciudad')?.valueChanges.pipe(
      startWith(''),
      map(value => this._filter(value || '')),
    );
  }

  private _filter(value: string): string[] {
    const filterValue = value.toLowerCase();
    return this.options.filter(option => option.toLowerCase().includes(filterValue));
  }

  ngAfterViewInit() {
    this.beneficiarios.paginator = this.paginator;
    this.beneficiarios.sort = this.sort;
  }

  modificarBeneficiario(beneficiario: any, index: any) {
    this.dialog.open(BeneficiarioComponent, {
      data: { beneficiario, index, accion: 'M' },
    })
  }

  agregarBeneficiario() {
    this.dialog.open(BeneficiarioComponent, {
      data: { accion: 'C' },
    })
  }

  cargarSoporte(event: any) {
    const file = event.target.files[0];
    if (file) {
      const nombreArchivo = file.name.split('.').slice(0, -1).join('.');
      console.log(nombreArchivo)
      console.log(this.consulta.subcontrato.id)
      if (file.type !== 'application/pdf') {
        this.alertaAdvertencia('Solo se permiten archivos PDF.')
        this.soporte = ''
        this.formulario.get('soporte')?.setValue(null)
      } else if (file.size > 5000000) {
        this.alertaAdvertencia('El tamaño maximo del archivo es 5MB.')
        this.soporte = ''
        this.formulario.get('soporte')?.setValue(null)
      } /*else if (nombreArchivo != this.consulta.subcontrato.id) {
        this.alertaAdvertencia('El nombre del archivo debe ser igual al identificador del subcontrato.')
        this.soporte = ''
        this.formulario.get('soporte')?.setValue(null)
      }*/ else {
        const reader = new FileReader();
        reader.onload = (e: any) => {
          try {
            var base64textString = e.target.result;
            this.soporte = base64textString
            this.formulario.get('soporte')?.setValue(base64textString)
          } catch (error) {
            this.soporte = ''
            this.formulario.get('soporte')?.setValue(null)
            this.alertaError('Error cargando el archivo.')
          }
        };
        reader.readAsDataURL(file);
      }
    }
  }

  calcularValorTotal() {
    if (this.formulario.value.cuotas) {
      this.consulta.subcontrato.valor = this.consulta.subcontrato.valor_total / this.formulario.value.cuotas
      this.calcularMensualidadTotal()
    } else {
      this.consulta.subcontrato.valor = 0
    }
  }

  volver() {
    this.location.back();
  }

  async modificarSubContrato() {
    var body = this.mapeo();
    try {
      var respuesta = await this.contratoService.modificarSubcontrato(body).toPromise();
      if (respuesta && respuesta.codigo == 0) {
        this.alertaExitoso('¡Subcontrato modificado exitosamente!');
      } else {
        this.alertaError(respuesta.detalle)
      }
    } catch (error) {
      this.alertaError(error + '')
    }
  }

  mapeo() {
    var data = {
      cliente: {
        documento: this.consulta.cliente.documento,
        nombre_completo: this.formulario.value.nombre_completo
      },
      subcontrato: {
        id: this.consulta.subcontrato.id,
        fecha_inicio: this.consulta.subcontrato.fecha_inicio,
        estado: true,
        plan: this.consulta.subcontrato.plan,
        valor: this.consulta.subcontrato.valor,
        soporte: this.soporte,
        cuotas: this.formulario.value.cuotas,
        codigo: this.formulario.value.codigo,
        correo: this.formulario.value.correo,
        direccion: this.formulario.value.direccion,
        ciudad: this.formulario.value.ciudad,
        grado: this.formulario.value.grado,
        celular: this.formulario.value.celular == '' ? 0 : this.formulario.value.celular,
        telefono: this.formulario.value.telefono == '' ? 0 : this.formulario.value.telefono,
        dependencia: this.formulario.value.dependencia,
        observaciones: this.formulario.value.observaciones,
        valor_total: this.consulta.subcontrato.valor_total,
        adicional: this.consulta.subcontrato.adicional,
        mascota: this.consulta.subcontrato.mascota,
        anticipado: false
      },
      beneficiarios: this.mapeoBeneficiarios(this.beneficiarios.data)
    }
    return data
  }

  mapeoBeneficiarios(beneficiarios: any) {
    for (let i = 0; i < beneficiarios.length; i++) {
      const beneficiario = beneficiarios[i];
      if (beneficiario.contacto == '') {
        beneficiarios[i].contacto = 0
      }
    }
    return beneficiarios
  }

  calcularMensualidadTotal() {
    let cuota = parseFloat(this.consulta.subcontrato.valor)
    let adicional = parseFloat(this.consulta.subcontrato.adicional)
    let mascota = parseFloat(this.consulta.subcontrato.mascota)
    let mensualidad = 0
    if (cuota) {
      mensualidad = cuota
      if (this.beneficiarios.data.length > 0) {
        this.beneficiarios.data.forEach(beneficiario => {
          if (beneficiario.estado) {
            if (beneficiario.adicional && beneficiario.parentesco != 'MA'
              && adicional) {
              mensualidad += adicional
            } else if (beneficiario.parentesco == 'MA' && mascota) {
              mensualidad += mascota
            }
          }
        });
      }
    }
    this.mensualidadTotal = mensualidad
  }

  alertaInformacion(mensaje: string): void {
    Swal.fire({
      title: 'Información',
      text: mensaje,
      icon: 'info',
      confirmButtonText: 'Aceptar'
    });
  }

  alertaAdvertencia(mensaje: string): void {
    Swal.fire({
      title: 'Alerta',
      text: mensaje,
      icon: 'warning',
      confirmButtonText: 'Aceptar'
    });
  }
  alertaExitoso(mensaje: string): void {
    Swal.fire({
      title: 'Transacción exitosa',
      text: mensaje,
      icon: 'success',
      confirmButtonText: 'Aceptar',
      preConfirm: () => {
        return this.router.navigate(['inicio', 'subcontrato']);
      }
    });
  }
  alertaError(mensaje: string): void {
    Swal.fire({
      title: 'Error',
      text: mensaje,
      icon: 'error',
      confirmButtonText: 'Aceptar'
    });
  }

  llenarDefecto() {
    return {
      "cliente": {
        "documento": "101012",
        "nombre_completo": "Nombre 12"
      },
      "subcontratos": [
        {
          "id": "RJ12-1",
          "cliente": "101012",
          "fecha_inicio": "2023-03-21 21:42:55.898",
          "estado": true,
          "plan": "Diamante",
          "valor": "62100",
          "soporte": "data:application/pdf;base64,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IDAgMCAwIDAgMCAwIDAgMCAwIDAgMCAwIDAgMCAwIDAgMCAwIDAgMCAwIDAgMCAwIDAgMCAwIDAgMCAwIDAgMCAwIDAgMCAwIDAgMCAwIDAgMCAwIDAgMCAwIDAgMCAwIDAgMCAwIDAgMCAwIDAgMCAwIDAgMCAwIDAgMCAwIDAgMCAwIDcyMl0gDQplbmRvYmoNCjUxIDAgb2JqDQpbIDI3OCAwIDAgMCAwIDAgMCAwIDAgMCAwIDAgMjc4IDAgMCAwIDAgMCAwIDAgMCAwIDAgMCAwIDAgMjc4IDAgMCAwIDAgMCAwIDY2NyA2NjcgNzIyIDcyMiA2NjcgMCA3NzggMCAyNzggMCAwIDU1NiA4MzMgNzIyIDc3OCA2NjcgMCA3MjIgNjY3IDYxMSA3MjIgMCAwIDAgNjY3IDAgMCAwIDAgMCAwIDAgNTU2IDU1NiA1MDAgNTU2IDU1NiAyNzggMCAwIDIyMiAwIDAgMjIyIDgzMyA1NTYgNTU2IDU1NiA1NTYgMzMzIDUwMCAyNzggNTU2IDAgMCA1MDAgNTAwIDAgMCAwIDAgMCAwIDAgMCAwIDAgMCAwIDAgMCAwIDAgMCAwIDAgMCAwIDAgMCAwIDAgMCAwIDAgMCAwIDAgMCAwIDAgMCAwIDAgMCAwIDAgMCAwIDAgMCAwIDAgMCAwIDAgMCAwIDAgMCAwIDAgMCAwIDAgMCAwIDAgMCAwIDAgMCAwIDAgMCAwIDAgMCAwIDAgMCAwIDAgMCAwIDAgMCAwIDAgMCAwIDAgMCAwIDcyMiAwIDAgMCAwIDAgMCAwIDAgMCAwIDAgMCAwIDAgMCA1NTYgMCAwIDAgMCAwIDAgMCAwIDAgMCAwIDI3OF0gDQplbmRvYmoNCjUyIDAgb2JqDQo8PC9UeXBlL1hSZWYvU2l6ZSA1Mi9XWyAxIDQgMl0gL1Jvb3QgMSAwIFIvSW5mbyAxMSAwIFIvSURbPDBEMjlEOUFGMEQzQ0JFNEY4OTY3QTA1NjExM0UxRjU3PjwwRDI5RDlBRjBEM0NCRTRGODk2N0EwNTYxMTNFMUY1Nz5dIC9GaWx0ZXIvRmxhdGVEZWNvZGUvTGVuZ3RoIDE0MD4+DQpzdHJlYW0NCnicNdC5EcJQDEVRfbN6w/ZnMattloDOKIGITmiBkIAGKIRGjNA1CnTmzUiBJKLVtk57IfLjBk/DvY2wAVL0gI8Rl/AykrtIoOte9nCAIzTQjZx0Ib3+k4MAetCHAQxhBGMIIYIYEkhhAhnkUICHKcxgDgsoYQkrWMMGtrCDCmq9L7/YX/xZ5Avo0w7zDQplbmRzdHJlYW0NCmVuZG9iag0KeHJlZg0KMCA1Mw0KMDAwMDAwMDAxMiA2NTUzNSBmDQowMDAwMDAwMDE3IDAwMDAwIG4NCjAwMDAwMDAxMjUgMDAwMDAgbg0KMDAwMDAwMDE4MSAwMDAwMCBuDQowMDAwMDAwNDU0IDAwMDAwIG4NCjAwMDAwMDIzMzYgMDAwMDAgbg0KMDAwMDAwMjUwMiAwMDAwMCBuDQowMDAwMDAyNzMzIDAwMDAwIG4NCjAwMDAwMDI3ODYgMDAwMDAgbg0KMDAwMDAwMjgzOSAwMDAwMCBuDQowMDAwMDAzMDAxIDAwMDAwIG4NCjAwMDAwMDMyMjggMDAwMDAgbg0KMDAwMDAwMDAxMyA2NTUzNSBmDQowMDAwMDAwMDE0IDY1NTM1IGYNCjAwMDAwMDAwMTUgNjU1MzUgZg0KMDAwMDAwMDAxNiA2NTUzNSBmDQowMDAwMDAwMDE3IDY1NTM1IGYNCjAwMDAwMDAwMTggNjU1MzUgZg0KMDAwMDAwMDAxOSA2NTUzNSBmDQowMDAwMDAwMDIwIDY1NTM1IGYNCjAwMDAwMDAwMjEgNjU1MzUgZg0KMDAwMDAwMDAyMiA2NTUzNSBmDQowMDAwMDAwMDIzIDY1NTM1IGYNCjAwMDAwMDAwMjQgNjU1MzUgZg0KMDAwMDAwMDAyNSA2NTUzNSBmDQowMDAwMDAwMDI2IDY1NTM1IGYNCjAwMDAwMDAwMjcgNjU1MzUgZg0KMDAwMDAwMDAyOCA2NTUzNSBmDQowMDAwMDAwMDI5IDY1NTM1IGYNCjAwMDAwMDAwMzAgNjU1MzUgZg0KMDAwMDAwMDAzMSA2NTUzNSBmDQowMDAwMDAwMDMyIDY1NTM1IGYNCjAwMDAwMDAwMzMgNjU1MzUgZg0KMDAwMDAwMDAzNCA2NTUzNSBmDQowMDAwMDAwMDM1IDY1NTM1IGYNCjAwMDAwMDAwMzYgNjU1MzUgZg0KMDAwMDAwMDAzNyA2NTUzNSBmDQowMDAwMDAwMDM4IDY1NTM1IGYNCjAwMDAwMDAwMzkgNjU1MzUgZg0KMDAwMDAwMDA0MCA2NTUzNSBmDQowMDAwMDAwMDQxIDY1NTM1IGYNCjAwMDAwMDAwNDIgNjU1MzUgZg0KMDAwMDAwMDA0MyA2NTUzNSBmDQowMDAwMDAwMDQ0IDY1NTM1IGYNCjAwMDAwMDAwNDUgNjU1MzUgZg0KMDAwMDAwMDA0NiA2NTUzNSBmDQowMDAwMDAwMDQ3IDY1NTM1IGYNCjAwMDAwMDAwNDggNjU1MzUgZg0KMDAwMDAwMDA0OSA2NTUzNSBmDQowMDAwMDAwMDAwIDY1NTM1IGYNCjAwMDAwMDQxOTkgMDAwMDAgbg0KMDAwMDAwNDY0OCAwMDAwMCBuDQowMDAwMDA1MTY3IDAwMDAwIG4NCnRyYWlsZXINCjw8L1NpemUgNTMvUm9vdCAxIDAgUi9JbmZvIDExIDAgUi9JRFs8MEQyOUQ5QUYwRDNDQkU0Rjg5NjdBMDU2MTEzRTFGNTc+PDBEMjlEOUFGMEQzQ0JFNEY4OTY3QTA1NjExM0UxRjU3Pl0gPj4NCnN0YXJ0eHJlZg0KNTUwOA0KJSVFT0YNCnhyZWYNCjAgMA0KdHJhaWxlcg0KPDwvU2l6ZSA1My9Sb290IDEgMCBSL0luZm8gMTEgMCBSL0lEWzwwRDI5RDlBRjBEM0NCRTRGODk2N0EwNTYxMTNFMUY1Nz48MEQyOUQ5QUYwRDNDQkU0Rjg5NjdBMDU2MTEzRTFGNTc+XSAvUHJldiA1NTA4L1hSZWZTdG0gNTE2Nz4+DQpzdGFydHhyZWYNCjY3MjQNCiUlRU9G",
          "cuotas": "36",
          "codigo": "101012",
          "correo": "",
          "direccion": "",
          "ciudad": "Melgar - Tolima",
          "grado": "General",
          "celular": "0",
          "telefono": "0",
          "dependencia": "Gabinete",
          "observaciones": "",
          "valor_total": 2235600,
          "adicional": 3500,
          "mascota": 8100,
          "anticipado": false
        }
      ],
      "subcontrato": {
        "id": "RJ12-1",
        "cliente": "101012",
        "fecha_inicio": "2023-03-21 21:42:55.898",
        "estado": true,
        "plan": "Diamante",
        "valor": "62100",
        "soporte": "data:application/pdf;base64,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IDAgMCAwIDAgMCAwIDAgMCAwIDAgMCAwIDAgMCAwIDAgMCAwIDAgMCAwIDAgMCAwIDAgMCAwIDAgMCAwIDAgMCAwIDAgMCAwIDAgMCAwIDAgMCAwIDAgMCAwIDAgMCAwIDAgMCAwIDAgMCAwIDAgMCAwIDAgMCAwIDAgMCAwIDAgMCAwIDcyMl0gDQplbmRvYmoNCjUxIDAgb2JqDQpbIDI3OCAwIDAgMCAwIDAgMCAwIDAgMCAwIDAgMjc4IDAgMCAwIDAgMCAwIDAgMCAwIDAgMCAwIDAgMjc4IDAgMCAwIDAgMCAwIDY2NyA2NjcgNzIyIDcyMiA2NjcgMCA3NzggMCAyNzggMCAwIDU1NiA4MzMgNzIyIDc3OCA2NjcgMCA3MjIgNjY3IDYxMSA3MjIgMCAwIDAgNjY3IDAgMCAwIDAgMCAwIDAgNTU2IDU1NiA1MDAgNTU2IDU1NiAyNzggMCAwIDIyMiAwIDAgMjIyIDgzMyA1NTYgNTU2IDU1NiA1NTYgMzMzIDUwMCAyNzggNTU2IDAgMCA1MDAgNTAwIDAgMCAwIDAgMCAwIDAgMCAwIDAgMCAwIDAgMCAwIDAgMCAwIDAgMCAwIDAgMCAwIDAgMCAwIDAgMCAwIDAgMCAwIDAgMCAwIDAgMCAwIDAgMCAwIDAgMCAwIDAgMCAwIDAgMCAwIDAgMCAwIDAgMCAwIDAgMCAwIDAgMCAwIDAgMCAwIDAgMCAwIDAgMCAwIDAgMCAwIDAgMCAwIDAgMCAwIDAgMCAwIDAgMCAwIDcyMiAwIDAgMCAwIDAgMCAwIDAgMCAwIDAgMCAwIDAgMCA1NTYgMCAwIDAgMCAwIDAgMCAwIDAgMCAwIDI3OF0gDQplbmRvYmoNCjUyIDAgb2JqDQo8PC9UeXBlL1hSZWYvU2l6ZSA1Mi9XWyAxIDQgMl0gL1Jvb3QgMSAwIFIvSW5mbyAxMSAwIFIvSURbPDBEMjlEOUFGMEQzQ0JFNEY4OTY3QTA1NjExM0UxRjU3PjwwRDI5RDlBRjBEM0NCRTRGODk2N0EwNTYxMTNFMUY1Nz5dIC9GaWx0ZXIvRmxhdGVEZWNvZGUvTGVuZ3RoIDE0MD4+DQpzdHJlYW0NCnicNdC5EcJQDEVRfbN6w/ZnMattloDOKIGITmiBkIAGKIRGjNA1CnTmzUiBJKLVtk57IfLjBk/DvY2wAVL0gI8Rl/AykrtIoOte9nCAIzTQjZx0Ib3+k4MAetCHAQxhBGMIIYIYEkhhAhnkUICHKcxgDgsoYQkrWMMGtrCDCmq9L7/YX/xZ5Avo0w7zDQplbmRzdHJlYW0NCmVuZG9iag0KeHJlZg0KMCA1Mw0KMDAwMDAwMDAxMiA2NTUzNSBmDQowMDAwMDAwMDE3IDAwMDAwIG4NCjAwMDAwMDAxMjUgMDAwMDAgbg0KMDAwMDAwMDE4MSAwMDAwMCBuDQowMDAwMDAwNDU0IDAwMDAwIG4NCjAwMDAwMDIzMzYgMDAwMDAgbg0KMDAwMDAwMjUwMiAwMDAwMCBuDQowMDAwMDAyNzMzIDAwMDAwIG4NCjAwMDAwMDI3ODYgMDAwMDAgbg0KMDAwMDAwMjgzOSAwMDAwMCBuDQowMDAwMDAzMDAxIDAwMDAwIG4NCjAwMDAwMDMyMjggMDAwMDAgbg0KMDAwMDAwMDAxMyA2NTUzNSBmDQowMDAwMDAwMDE0IDY1NTM1IGYNCjAwMDAwMDAwMTUgNjU1MzUgZg0KMDAwMDAwMDAxNiA2NTUzNSBmDQowMDAwMDAwMDE3IDY1NTM1IGYNCjAwMDAwMDAwMTggNjU1MzUgZg0KMDAwMDAwMDAxOSA2NTUzNSBmDQowMDAwMDAwMDIwIDY1NTM1IGYNCjAwMDAwMDAwMjEgNjU1MzUgZg0KMDAwMDAwMDAyMiA2NTUzNSBmDQowMDAwMDAwMDIzIDY1NTM1IGYNCjAwMDAwMDAwMjQgNjU1MzUgZg0KMDAwMDAwMDAyNSA2NTUzNSBmDQowMDAwMDAwMDI2IDY1NTM1IGYNCjAwMDAwMDAwMjcgNjU1MzUgZg0KMDAwMDAwMDAyOCA2NTUzNSBmDQowMDAwMDAwMDI5IDY1NTM1IGYNCjAwMDAwMDAwMzAgNjU1MzUgZg0KMDAwMDAwMDAzMSA2NTUzNSBmDQowMDAwMDAwMDMyIDY1NTM1IGYNCjAwMDAwMDAwMzMgNjU1MzUgZg0KMDAwMDAwMDAzNCA2NTUzNSBmDQowMDAwMDAwMDM1IDY1NTM1IGYNCjAwMDAwMDAwMzYgNjU1MzUgZg0KMDAwMDAwMDAzNyA2NTUzNSBmDQowMDAwMDAwMDM4IDY1NTM1IGYNCjAwMDAwMDAwMzkgNjU1MzUgZg0KMDAwMDAwMDA0MCA2NTUzNSBmDQowMDAwMDAwMDQxIDY1NTM1IGYNCjAwMDAwMDAwNDIgNjU1MzUgZg0KMDAwMDAwMDA0MyA2NTUzNSBmDQowMDAwMDAwMDQ0IDY1NTM1IGYNCjAwMDAwMDAwNDUgNjU1MzUgZg0KMDAwMDAwMDA0NiA2NTUzNSBmDQowMDAwMDAwMDQ3IDY1NTM1IGYNCjAwMDAwMDAwNDggNjU1MzUgZg0KMDAwMDAwMDA0OSA2NTUzNSBmDQowMDAwMDAwMDAwIDY1NTM1IGYNCjAwMDAwMDQxOTkgMDAwMDAgbg0KMDAwMDAwNDY0OCAwMDAwMCBuDQowMDAwMDA1MTY3IDAwMDAwIG4NCnRyYWlsZXINCjw8L1NpemUgNTMvUm9vdCAxIDAgUi9JbmZvIDExIDAgUi9JRFs8MEQyOUQ5QUYwRDNDQkU0Rjg5NjdBMDU2MTEzRTFGNTc+PDBEMjlEOUFGMEQzQ0JFNEY4OTY3QTA1NjExM0UxRjU3Pl0gPj4NCnN0YXJ0eHJlZg0KNTUwOA0KJSVFT0YNCnhyZWYNCjAgMA0KdHJhaWxlcg0KPDwvU2l6ZSA1My9Sb290IDEgMCBSL0luZm8gMTEgMCBSL0lEWzwwRDI5RDlBRjBEM0NCRTRGODk2N0EwNTYxMTNFMUY1Nz48MEQyOUQ5QUYwRDNDQkU0Rjg5NjdBMDU2MTEzRTFGNTc+XSAvUHJldiA1NTA4L1hSZWZTdG0gNTE2Nz4+DQpzdGFydHhyZWYNCjY3MjQNCiUlRU9G",
        "cuotas": "36",
        "codigo": "101012",
        "correo": "",
        "direccion": "",
        "ciudad": "Melgar - Tolima",
        "grado": "General",
        "celular": "0",
        "telefono": "0",
        "dependencia": "Gabinete",
        "observaciones": "",
        "valor_total": 2235600,
        "adicional": 3500,
        "mascota": 8100,
        "anticipado": false
      },
      "beneficiarios": [
        {
          "secuencia": 25,
          "subcontrato": "RJ12-1",
          "nombre": "Beneficiario 12-1",
          "edad": "12",
          "parentesco": "m",
          "adicional": false,
          "contacto": "0",
          "emoji": "local_hospital",
          "estado": true
        },
        {
          "secuencia": 26,
          "subcontrato": "RJ12-1",
          "nombre": "Beneficiario 12-2",
          "edad": "13",
          "parentesco": "e",
          "adicional": false,
          "contacto": "0",
          "emoji": "",
          "estado": true
        },
        {
          "secuencia": 27,
          "subcontrato": "RJ12-1",
          "nombre": "Beneficiario 12-4",
          "edad": "15",
          "parentesco": "a",
          "adicional": true,
          "contacto": "0",
          "emoji": "local_hospital",
          "estado": true
        },
        {
          "secuencia": 28,
          "subcontrato": "RJ12-1",
          "nombre": "Beneficiario 12-3",
          "edad": "14",
          "parentesco": "t",
          "adicional": false,
          "contacto": "0",
          "emoji": "gavel",
          "estado": true
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

  homologarParentesco(valor: any) {
    switch (valor) {
      case 'M':
        return 'Madre'
      case 'MC':
        return 'Madre Crianza'
      case 'P':
        return 'Padre'
      case 'PC':
        return 'Padre Crianza'
      case 'Su':
        return 'Suegros'
      case 'C':
        return 'Conyugue o compañera'
      case 'H':
        return 'Hijos'
      case 'E':
        return 'Hermanos'
      case 'Cu':
        return 'Cuñado'
      case 'R':
        return 'Primos'
      case 'Ti':
        return 'Tios'
      case 'S':
        return 'Sobrinos'
      case 'N':
        return 'Nietos'
      case 'A':
        return 'Abuelos'
      case 'O':
        return 'Otros'
      case 'MA':
        return 'Mascota'
      default:
        return 'Sin identificar'
    }
  }
}
