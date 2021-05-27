import { IResponseInhabilitarRegistro } from './../../../_interfaces/response-inhabilitar.interface';
import { environment } from 'src/environments/environment';
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { ICategoria } from '../../../_interfaces/categoria.interface';
import { mockCategorias } from '../mock-categorias';

const httpOptions = { 
  headers: new HttpHeaders({ 
    'Content-Type': 'application/json; charset=utf-8',
  })
};

@Injectable({
  providedIn: 'root'
})
export class CategoriaService {

  apiBaseURLService = environment.BASE_URL_API;

  constructor(private readonly http: HttpClient) {
  }

  ApiCreate(regitro: ICategoria): Observable<ICategoria> {
    const registro = 
    { 
      "name": regitro.name, 
      "categoryid": 1, 
      "storeid": 1,
      "action": "add" 
    }

    const opciones = {
      headers: httpOptions['headers'],
      body: registro
    };
    return this.http.post<ICategoria>(this.apiBaseURLService, opciones); 
  }  

  ApiRead(): Observable<ICategoria[]> {
    const action = {
      action: 'getall'
    }
    const opciones = {
      headers: httpOptions['headers'],
      body: action,
    };

    // HASTA SOLUCIONAR REL PROBLEMA DE CORS
    // return of(mockCategorias.data);
    return this.http.get<ICategoria[]>(this.apiBaseURLService, opciones)

  }

  
  ApiOne(id: number): Observable<ICategoria> {
    const action = {
      action: 'getall',
      id : id.toString()
    }
    const opciones = {
      headers: httpOptions['headers'],
      body: action,
    };

    // HASTA SOLUCIONAR REL PROBLEMA DE CORS
    const registro = mockCategorias.data.find(x => x.id == id);
    console.log('REGISTRO DESDE API', registro);
    return of(registro);
    // return this.http.get<ICategoria[]>(this.apiBaseURLService, opciones)
  }


  ApiUpdate(regitro: ICategoria): Observable<ICategoria> {
    const registro = 
    { 
      "name": regitro.name, 
      "categoryid": 1, 
      "storeid": 1,
      "id": regitro.id,
      "action": "edit" 
    }

    const opciones = {
      headers: httpOptions['headers'],
      body: registro
    };
    return this.http.get<ICategoria>(this.apiBaseURLService, opciones);
  } 

  ApiDelete(id: number): Observable<ICategoria> {
    const registro = 
    { 
      "status": 1,
      "id": id,
      "action": "editstatus" 
    }

    const opciones = {
      headers: httpOptions['headers'],
      body: registro
    };
    return this.http.get<ICategoria>(this.apiBaseURLService, opciones);
  }



}

