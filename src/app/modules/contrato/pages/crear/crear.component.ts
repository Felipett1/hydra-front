import { Component, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, Validators } from '@angular/forms';
import { BreakpointObserver } from '@angular/cdk/layout';
import { MatStepper, StepperOrientation } from '@angular/material/stepper';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { MatTableDataSource } from '@angular/material/table';
import { ContratoService } from '@modules/contrato/service/contrato.service';
import { MatDialog } from '@angular/material/dialog';
import { BeneficiarioComponent } from '../beneficiario/beneficiario.component';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-crear',
  templateUrl: './crear.component.html',
  styleUrls: ['./crear.component.css']
})
export class CrearComponent {
  @ViewChild(MatStepper) stepper!: MatStepper;
  datosGrupo = this._formBuilder.group({
    documento: ['', [Validators.required, Validators.pattern("^[0-9]*$")]],
    nombre_completo: ['', Validators.required],
    codigo: ['', Validators.required],
    correo: ['', Validators.email],
    direccion: [''],
    ciudad: ['', Validators.required],
    grado: ['', Validators.required],
    celular: ['', Validators.pattern("^[0-9]*$")],
    telefono: ['', Validators.pattern("^[0-9]*$")],
    dependencia: ['', Validators.required],
    observaciones: ['']
  });
  beneficiariosGrupo = this._formBuilder.group({});
  planGrupo = this._formBuilder.group({
    plan: ['', Validators.required],
    valor: [null, [Validators.required, Validators.pattern("^[0-9]*$")]],
    soporte: ['', Validators.required],
    cuotas: [null, [Validators.required, Validators.pattern("^[0-9]*$")]],
    adicional: [null, [Validators.required, Validators.pattern("^[0-9]*$")]],
    mascota: [null, [Validators.required, Validators.pattern("^[0-9]*$")]],

  });
  idControl = new FormControl('', Validators.required);
  stepperOrientation: Observable<StepperOrientation>;
  soporte: string = '';
  //Select de ciudades
  options: string[] = [];
  filteredOptions!: Observable<string[]> | undefined;
  //Tabla
  displayedColumns: string[] = ['nombre', 'edad', 'parentesco', 'contacto', 'adicional', 'estado', 'borrar'];
  beneficiarios!: MatTableDataSource<any>;
  fechaActual: Date = new Date();
  valor_total: number = 0
  mensualidadTotal = 0

  constructor(private _formBuilder: FormBuilder, breakpointObserver: BreakpointObserver,
    private contratoService: ContratoService, public dialogo: MatDialog, private router: Router) {
    this.stepperOrientation = breakpointObserver
      .observe('(min-width: 800px)')
      .pipe(map(({ matches }) => (matches ? 'horizontal' : 'vertical')));

    this.beneficiarios = new MatTableDataSource();

    //Se suscribe al agregar un nuevo beneficiario
    this.contratoService.getData().subscribe(beneficiario => {
      const data = this.beneficiarios.data;
      data.push(beneficiario);
      this.beneficiarios.data = data;
      this.calcularMensualidadTotal()
    });
  }

  async ngOnInit() {
    var ciudades = await this.contratoService.consultarCiudades().toPromise();
    if (ciudades) {
      for (var i = 0; i < ciudades.length; i++) {
        this.options[i] = `${ciudades[i].municipio} - ${ciudades[i].departamento}`
      }
    }

    this.filteredOptions = this.datosGrupo.get('ciudad')?.valueChanges.pipe(
      startWith(''),
      map(value => this._filter(value || '')),
    );
  }

  private _filter(value: string): string[] {
    const filterValue = value.toLowerCase();
    return this.options.filter(option => option.toLowerCase().includes(filterValue));
  }

  agregarBeneficiario() {
    this.dialogo.open(BeneficiarioComponent, {
      data: { accion: 'C' },
    })
  }

  eliminarBeneficiario(i: any) {
    const data = this.beneficiarios.data;
    data.splice(i, 1);
    this.beneficiarios.data = data;
    this.calcularMensualidadTotal()
  }

  siguientePaso() {
    if (this.datosGrupo.invalid || this.idControl.invalid) {
      this.datosGrupo.markAllAsTouched();
      this.idControl.markAllAsTouched();
    } else {
      this.stepper.next();
    }
  }

  calcularValorTotal() {
    if (this.planGrupo.value.valor && this.planGrupo.value.cuotas) {
      this.valor_total = this.planGrupo.value.valor * this.planGrupo.value.cuotas;
      this.calcularMensualidadTotal()
    } else {
      this.valor_total = 0
    }
  }

  cargarSoporte(event: any) {
    const file = event.target.files[0];
    if (file) {
      const nombreArchivo = file.name.split('.').slice(0, -1).join('.');
      if (file.type !== 'application/pdf') {
        this.alertaAdvertencia('Solo se permiten archivos PDF.')
        this.soporte = ''
        this.planGrupo.get('soporte')?.setValue(null)
      } else if (file.size > 5000000) {
        this.alertaAdvertencia('El tamaño maximo del archivo es 5MB.')
        this.soporte = ''
        this.planGrupo.get('soporte')?.setValue(null)
      } /*else if (nombreArchivo != this.idControl.value) {
        this.alertaAdvertencia('El nombre del archivo debe ser igual al identificador del subcontrato.')
        this.soporte = ''
        this.planGrupo.get('soporte')?.setValue(null)
      }*/ else {
        const reader = new FileReader();
        reader.onload = (e: any) => {
          try {
            var base64textString = e.target.result;
            this.soporte = base64textString
          } catch (error) {
            this.soporte = ''
            this.planGrupo.get('soporte')?.setValue(null)
            this.alertaError('Error cargando el archivo.')
          }
        };
        reader.readAsDataURL(file);
      }
    }
  }

  async crearSubContrato() {
    var body = this.mapeoCreacion();
    try {
      var respuesta = await this.contratoService.crearSubcontrato(body).toPromise();
      if (respuesta && respuesta.codigo == 0) {
        this.alertaExitoso('¡Subcontrato creado exitosamente!');
      } else {
        this.alertaError(respuesta.detalle)
      }
    } catch (error) {
      this.alertaError(error + '')
    }
  }

  mapeoCreacion() {
    var data = {
      cliente: {
        documento: this.datosGrupo.value.documento,
        nombre_completo: this.datosGrupo.value.nombre_completo
      },
      subcontrato: {
        id: this.idControl.value,
        fecha_inicio: this.fechaActual,
        estado: true,
        plan: this.planGrupo.value.plan,
        valor: this.planGrupo.value.valor,
        soporte: this.soporte,
        cuotas: this.planGrupo.value.cuotas,
        codigo: this.datosGrupo.value.codigo,
        correo: this.datosGrupo.value.correo,
        direccion: this.datosGrupo.value.direccion,
        ciudad: this.datosGrupo.value.ciudad,
        grado: this.datosGrupo.value.grado,
        celular: this.datosGrupo.value.celular == '' ? 0 : this.datosGrupo.value.celular,
        telefono: this.datosGrupo.value.telefono == '' ? 0 : this.datosGrupo.value.telefono,
        dependencia: this.datosGrupo.value.dependencia,
        observaciones: this.datosGrupo.value.observaciones,
        valor_total: this.valor_total,
        adicional: this.planGrupo.value.adicional,
        mascota: this.planGrupo.value.mascota,
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
    let cuota = this.planGrupo.value.valor
    let adicional = this.planGrupo.value.adicional
    let mascota = this.planGrupo.value.mascota
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
