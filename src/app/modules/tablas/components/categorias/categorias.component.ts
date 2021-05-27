import { IColumnasGrid } from "src/app/_interfaces/columnas-grid.interface";
import { Constantes } from "./../../../../_utiles/constantes";
import { ExportarRegistrosService } from "./../../../../_utiles/exportar-registro.service";
import { MensajesSwalService } from "./../../../../_utiles/mensajes-swal.service";
import { CategoriaService } from "./../../../repositorio/tablas/categoria.service";
import { Component, OnInit, ViewChild } from "@angular/core";
import { BlockUI, NgBlockUI } from "ng-block-ui";
import {
  PerfectScrollbarConfigInterface,
  PerfectScrollbarComponent,
  PerfectScrollbarDirective,
} from "ngx-perfect-scrollbar";
import { Router } from "@angular/router";
import { ToastrService } from "ngx-toastr";
import Swal from "sweetalert2";
import { ColumnMode, SelectionType } from "@swimlane/ngx-datatable";

@Component({
  selector: "app-categorias",
  templateUrl: "../vista-tabla-estandar/vista-tabla-estandar.component.html",
  styleUrls: ["../vista-tabla-estandar/vista-tabla-estandar.component.css"],
})
export class CategoriasComponent implements OnInit {
  tituloMantenimiento = "Categorias";
  campoID: string = "id";
  columnas: IColumnasGrid[] = [];
  datos: any;
  loadingIndicator: true;
  rowsRegistros: any;
  ColumnMode = ColumnMode;
  SelectionType = SelectionType;

  row: any;
  FilasXPagina = Constantes.REGISTROS_X_PAGINA_MANTENIMIENTO;
  IdRegistroSeleccionado: any = "";
  public breadcrumb: any;

  public config: PerfectScrollbarConfigInterface = { wheelPropagation: true };
  @BlockUI("bloqueFormulario") bloqueFormulario: NgBlockUI;
  @ViewChild(PerfectScrollbarComponent, { static: false })
  componentRef?: PerfectScrollbarComponent;
  @ViewChild(PerfectScrollbarDirective, { static: true })
  directiveRef?: PerfectScrollbarDirective;
  @BlockUI("basicAlerts") blockUIBasicAlerts: NgBlockUI;
  @BlockUI("dismissibleAlerts") blockUIDismissibleAlerts: NgBlockUI;

  options = {
    close: true,
    expand: true,
    minimize: true,
    reload: true,
  };

  constructor(
    private servicio: CategoriaService,
    private router: Router,
    private toastr: ToastrService,
    private mensajesSwal: MensajesSwalService,
    private servicioExportacion: ExportarRegistrosService
  ) {}

  ngOnInit() {
    this.breadcrumb = {
      mainlabel: "Archivo",
      links: [
        {
          name: "Home",
          isLink: true,
          link: "/archivo",
        },
      ],
    };

    this.iniciar();
  }

  iniciar() {
    this.columnas = [
      { field: "id", header: "Id" },
      { field: "categoryid", header: "Categoria ID" },
      { field: "name", header: "Nombre" },
      { field: "image", header: "Imagen" },
      { field: "createdDT", header: "Creado" },
      { field: "parentimage", header: "Imagen Parent" },
      { field: "sname", header: "Nombre 2" },
    ];

    this.getRegistros(true);
  }

  onRowSelect(event) {
    console.log("FILA SELECCIONADA", event);
    if (!event) {
      return;
    }
    const categoria = event.selected[0];
    this.IdRegistroSeleccionado = categoria[this.campoID];
    console.log("ID SELECCIONADO", this.IdRegistroSeleccionado);
  }

  /* ****************************************************************** */
  /* INICIO DE BOTONES DE MANTENIMIENTO */
  /* ****************************************************************** */
  create() {
    this.router.navigate(["/tablas/categorias-create-update", ""]);
  }

  getRegistros(bloquearFormulario: boolean) {
    if (bloquearFormulario) {
      this.bloqueFormulario.start("Cargando ...");
    }
    this.servicio.ApiRead().subscribe(
      (Response) => {
        console.log("RESULTADO DE API", Response);
        this.rowsRegistros = Response;
      },
      (error) => {
        if (bloquearFormulario) {
          this.bloqueFormulario.stop();
        }
      },
      () => {
        if (bloquearFormulario) {
          this.bloqueFormulario.stop();
        }
      }
    );
  }

  update() {
    if (this.IdRegistroSeleccionado == "") {
      this.mensajesSwal.mensajeInformacion(
        "Debe seleccionar el Registro a modificar"
      );
      return;
    }
    this.router.navigate([
      "/tablas/categorias-create-update",
      this.IdRegistroSeleccionado,
    ]);
  }

  delete() {
    if (this.IdRegistroSeleccionado == "") {
      this.mensajesSwal.mensajeInformacion(
        "Debe seleccionar el Registro a Inhabilitar"
      );
      return;
    }

    this.mensajesSwal
      .mensajePregunta("Está seguro de Eliminar el Registro ?")
      .then((response) => {
        if (response.isConfirmed) {
          this.eliminarRegistro();
        }
      });
  }

  eliminarRegistro() {
    let Respuesta: any;
    Swal.fire({
      title: "Eliminar Registros",
      html: "Procesando.",
      timerProgressBar: true,
      didOpen: () => {
        Swal.showLoading();

        this.servicio.ApiDelete(this.IdRegistroSeleccionado).subscribe(
          (Response) => {
            Respuesta = Response;
            console.log("Respuesta de Eliminación:", Respuesta);
            if (Respuesta) {
              this.getRegistros(false);
            }
          },
          (error) => {
            Swal.close();
            console.log("eliminarRegistro()", error);
          },
          () => {
            Swal.close();
          }
        );
      },
      willClose: () => {
        if (Respuesta) {
          this.toastr.success(Respuesta[0].respuesta);
        }
      },
    }).then((result) => {
    });
  }

  /* ****************************************************************** */
  /* FIN DE BOTONES DE MANTENIMIENTO */
  /* ****************************************************************** */

  print(printME) {
    const printContents = document.getElementById(printME).innerHTML;
    const originalContents = document.body.innerHTML;
    document.body.innerHTML = printContents;
    window.print();
    document.body.innerHTML = originalContents;
  }

  /* ****************************************************************** */
  /* FIN DE BOTONES PARA OBTENER DATOS DE LA GRILLA  */
  /* ****************************************************************** */

  /* ****************************************************************** */
  /* INICIO DE BOTONES PARA OBTENER DATOS DE LA GRILLA  */
  /* ****************************************************************** */
  CopiarAJson() {
    this.servicioExportacion.exportarAJson(this.rowsRegistros);
  }

  getExcelData() {
    this.servicioExportacion.exportarAExcel(
      this.rowsRegistros,
      this.tituloMantenimiento
    );
  }

  getPdfData() {
    this.servicioExportacion.exportarAPDF(
      this.rowsRegistros,
      this.columnas,
      this.tituloMantenimiento
    );
  }
}
