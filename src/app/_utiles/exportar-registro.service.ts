import { Injectable } from "@angular/core";
import { ClipboardService } from "ngx-clipboard";
import { TableexcelService } from "../_services/tableexcel.service";
import { ToastrService } from "ngx-toastr";

declare var require: any;
const jsPDF = require('jspdf');
require('jspdf-autotable');

@Injectable({
    providedIn: 'root'
})
export class ExportarRegistrosService {

    constructor(private _clipboardService: ClipboardService,
                private tableexcelService: TableexcelService,
                private toastr: ToastrService,) {

    }
 
  /* ****************************************************************** */
  /* INICIO DE BOTONES PARA OBTENER DATOS DE LA GRILLA  */
  /* ****************************************************************** */
  public exportarAJson(rowsRegistros: any) {
    this._clipboardService.copyFromContent(JSON.stringify(rowsRegistros));
    this.toastr.success('Los datos fueron copiados en la Memoria');
  }
  public onCopyFailure() {
    alert('Error al Copiar los datos');
  }

  public exportarAExcel(rowsRegistros: any, nombreArchivo: string) {
    this.tableexcelService.exportAsExcelFile(rowsRegistros, 'Archivo_' + nombreArchivo);
  }

  public exportarAPDF(rowsRegistros: any[], columnas: any[], nombreArchivo: string) {
    let margen = {
      top: 70,
      bottom: 40,
      left: 30,
      width: 550
    };

    const doc = new jsPDF('p', 'pt', 'a4');
    doc.margins = margen;
    const rows = [];

    rowsRegistros.forEach(element => {
      let temp: any[] = [];
      columnas.forEach(campos => {
        temp.push(element[campos.field]);
      });
      rows.push(temp);
    });    
    doc.autoTable(columnas, rows);

    //poner el numero de cada pagina
    let paginas = doc.internal.getNumberOfPages();
    for (var i = 1; i <= paginas; i++) {
      doc.setPage(i);
      let tamanioFuenteActual = doc.getFontSize();
      doc.setFontSize(8);
      doc.text('Página' + String(i) + ' de ' + String(paginas), margen.left, doc.internal.pageSize.height - 20);
      doc.setFontSize(tamanioFuenteActual);
    }

    //Guardar el documento
    doc.save('Archivo_' + nombreArchivo + '.pdf');

  }


}