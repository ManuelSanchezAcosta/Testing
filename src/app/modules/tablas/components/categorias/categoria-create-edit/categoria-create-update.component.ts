import { DatePipe } from '@angular/common';
import { MensajesSwalService } from './../../../../../_utiles/mensajes-swal.service';
import { CategoriaService } from './../../../../repositorio/tablas/categoria.service';
import { ICategoria } from './../../../../../_interfaces/categoria.interface';
import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ActivatedRoute } from '@angular/router';


@Component({
  selector: 'app-categoria-create-update',
  templateUrl: './categoria-create-update.component.html',
  styleUrls: ['./categoria-create-update.component.css']
})
export class CategoriaCreateUpdateComponent implements OnInit {

  // @BlockUI('bloqueformulario') blockUIBloqueFormulario: NgBlockUI;  
  
  public breadcrumb: any;

  formulario: FormGroup;
  _tituloForm = 'NUEVA CATEGORIA';
  _autoGenerarID : boolean = false; //indica que para en este mantenimiento, sera la BD quien genere el nuevo ID
  _rowsSucursales: any;
  _IdRegistroEditar: number;
  _ModoEdicion: boolean = false;
  _CargaDatosCompleta : boolean;

  constructor(private readonly formBuilder: FormBuilder,
              private readonly servicioCategoria : CategoriaService, 
              private readonly router: Router,
              private readonly activatedRoute: ActivatedRoute,
              private readonly mensajes: MensajesSwalService,
              private readonly formatoFecha: DatePipe) {

  }

  ngOnInit() {

    this.ponerBreadcrumb();
    this.iniciar();

  }

  private ponerBreadcrumb(){
    this.breadcrumb = {
      'mainlabel': 'Tablas Sistenet',
      'links': [
        {
          'name': 'Tablas',
          'isLink': true,
          'link': '/tablas'
        },
        {
          'name': 'Categorias',
          'isLink': true,
          'link': '/tablas/categorias'
        }
      ]
    };
  }

  private iniciar(){
    //SABER SI ES NUEVO O MODO EDICION
    this._IdRegistroEditar = Number.parseInt(this.activatedRoute.snapshot.paramMap.get('id'));
    if (this._IdRegistroEditar){
      console.log('PARAMETRO OBTENIDO PARA EDITAR 2', this._IdRegistroEditar);
      this._ModoEdicion = true;
      this.ponerModoEdicion();
    }

    this.instanciarFormulario();
    this.cargarDatos();
  }


  private instanciarFormulario(){
    this.formulario = this.formBuilder.group({
      html_categoryid: ['', Validators.required],
      html_sname: ['', Validators.required],
      html_status: [true, Validators.required]
    });

  }

  private ponerModoEdicion(){
    this._tituloForm = 'EDITAR CATEGORIA';
  }


  private cargarDatos() {
    this.ObtenerDatosparaEditar();
  }


  ObtenerDatosparaEditar(){
    //ESTE PROCEDIMIENTO OBTIENE LOS DATOS DEL REGISTRO A EDITAR
    let RegistroEditar : ICategoria = null;
    this.servicioCategoria.ApiOne(this._IdRegistroEditar).subscribe(
      Response => {
        if (Response) {
          RegistroEditar = Response;
          this.formulario.patchValue({        
            html_categoryid: RegistroEditar.categoryid,
            html_sname: RegistroEditar.sname,
            html_status: RegistroEditar.status == 1 ? true: false
          });
          this._CargaDatosCompleta = true;
        }
      }); 

  }


  guardarRegistro() {
    const fechaHoy = this.formatoFecha.transform( new Date());

    let swalEsperar = this.mensajes.mensajePregunta('Seguro de Guardar la información ?').then(
      respuesta => {
        let registro : ICategoria;
        registro =  {
        id: 0,
        categoryid: this.formulario.value.html_categoryid,
        storeid: 1,
        name: this.formulario.value.html_sname,
        image: '',
        status: this.formulario.value.html_activo == true ? 1: 0,
        createdBy: 1,
        createdDT: fechaHoy, // 2020-04-06 15:54:01,
        modifiedBy: 0,
        modifiedDT: fechaHoy, //2021-05-25 17:45:24,
        parent: 'PRUEBA',
        parentimage: 'IMAGEN.PRUEBA.ICO', //img/category/6_1600457280.ico,
        sid: 1,
        sname: this.formulario.value.html_sname

        };
    
        let RegistroGrabado: any;
    
        this.servicioCategoria.ApiCreate(registro).subscribe(
          Response => {
          RegistroGrabado = Response;
          this.mensajes.mensajeInformacion("Registro Satisfactorio")
          this.router.navigate(['/tablas/categorias']);
          },
          error => {
            console.log('guardarRegistro()', error);
          },
          () => {
            // swalEsperar.close();
          }
        ); 

      }
    )



  }

  cancelar(){
    this.router.navigate(['/tablas/categorias']);
  }

}


