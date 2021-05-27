import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Router } from '@angular/router';

interface errorHttp extends HttpErrorResponse{
  servidorNoEncontrado: boolean
}

@Injectable()
export class ServicioHeaderInterceptor implements HttpInterceptor {

  constructor(private router: Router) {
  }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    let modifiedReq: HttpRequest<any>;
    const sesionUsuario = false;

    if (sesionUsuario) {
        const token = 'TOKEN_DE_PRUEBA';
        modifiedReq = req.clone({
          headers: new HttpHeaders({
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
            'Authorization': `Bearer ${token}`
          })
        });
    } else {
        modifiedReq = req.clone({
        headers: new HttpHeaders({
          'Content-Type': 'application/json; charset=UTF-8',
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods': 'GET, POST, PUT, PATCH, DELETE, OPTIONS',  //, GET, POST, PUT, PATCH, DELETE, OPTIONS
          'Access-Control-Max-Age': '3600',
          'Access-Control-Allow-Headers': 'Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With',
          'Access-Control-Allow-Credentials': 'false'
          // 'Content-Encoding': 'br',
          // 'Connection': 'keep-alive',
          // 'Server': 'nginx'
        })
      });
    }



    return next.handle(modifiedReq).pipe(
      catchError(error => {
        let customErrorHttp: errorHttp = error;
        customErrorHttp.servidorNoEncontrado = false;

        let errorMessage = '';
        let objetoError: InterfaceError;

        if (error instanceof ErrorEvent) {
          // error en el cliente
          if (error.error.message) {
            errorMessage = `Error del lado del Cliente: ${error.error.message}`;
          }
        } else {
          // error en el backend
          // VALIDAR EL ERROR HTTP
          if (error.status == 0) {
            errorMessage = 'Parece que no hay Conexión con el Servidor Central. Intente Nuevamente' + error;
            customErrorHttp.servidorNoEncontrado = true;

          } else if (error.status >= 502 && error.status <= 504) {
            errorMessage = 'No hay Conexión con el Servidor Central. Intente Nuevamente';
            customErrorHttp.servidorNoEncontrado = true;

          } else if (error.status == 401) {
              errorMessage = 'La Sesión ha expirado. Ingrese sus credenciales Nuevamente';
              console.log('ERROR INTERCEPTOR HTTP', errorMessage)
              this.router.navigate(['/login']);
              return throwError(error);
          } else {
            if (error.status && error.message) {
              if (error.error) {
                errorMessage = `${JSON.stringify(error.error)}`;
              } else {
                errorMessage = `Error del lado del Servidor: ${error.status} ${error.message}`;
              }

            }
          }
        }

        if (error) {
          objetoError = this.armarError(error);
          errorMessage = errorMessage;
        }

        console.log('ERROR INTERCEPTOR HTTP', errorMessage, objetoError)
        return throwError(error);
      })
    ) as any;

  }

  armarError(datoError: any): InterfaceError {
    return {
      message: datoError.message,
      name: datoError.name,
      ok: datoError.ok,
      status: datoError.status,
      statusText: datoError.statusText,
      url: datoError.url
    };
  }

}


export interface InterfaceError {
    message: string;
    name: string;
    ok: boolean;
    status: number;
    statusText: string;
    url: string;
  }
  