import { Injectable } from '@angular/core';
import { Cliente } from './cliente';
import { Observable, map, catchError,throwError } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';

@Injectable()
export class ClienteService {
  private urlEndPoint: string = 'http://localhost:8080/api/clientes';
  private httpHeaders = new HttpHeaders({ 'Content-Type': 'application/json' });
  public errores: string[] = [];
  constructor(private http: HttpClient, private router : Router) { }

  deleteCliente(id: number) {
    throw new Error('Method not implemented.');
  }
  getErrores(): string[] {
    return this.errores;
  }
  getClientes(): Observable<Cliente[]> {
    //return of (CLIENTES);
    return this.http.get<Cliente[]>(this.urlEndPoint).pipe(
      map(response => {
        let clientes = response as Cliente[];

        return clientes.map(cliente => {
          cliente.nombre = cliente.nombre.toUpperCase();
          return cliente;
        });
      })
    );
  }

  create(cliente: Cliente): Observable<Cliente> {
    return this.http.post<any>(this.urlEndPoint, cliente, { headers: this.httpHeaders }).pipe(
      catchError(e => {

        if(e.status == 400) {
          this.errores = e.error.errors as string[];
          console.log(e.error.errors);
          return throwError(() => new Error(e));
        }

        console.log(e.error.mensaje);
        Swal.fire({ icon: 'error', title: 'Error al Crear ', text: e.error.mensaje, footer: '<a href="">Why do I have this issue?</a>'});
        return throwError(() => new Error(e));
      })
    );
  }
  getCLiente(id: number): Observable<Cliente> {
    return this.http.get<Cliente>(`${this.urlEndPoint}/${id}`).pipe(
      catchError(e => {
        this.router.navigate(['/clientes']);
        console.log(e.error.mensaje);
        Swal.fire({icon: 'error', title: 'Error al Editar ', text: e.error.mensaje, footer: '<a href="">Why do I have this issue?</a>'});
        return throwError(() => new Error(e));
      })
    );
  }
  update(cliente: Cliente): Observable<Cliente> {
    return this.http.put<any>(`${this.urlEndPoint}/${cliente.id}`, cliente, { headers: this.httpHeaders }).pipe(
      catchError(e => {

        if(e.status == 400) {
          this.errores = e.error.errors as string[];
          console.log(e.error.errors);
          return throwError(() => new Error(e));
        }

        console.log(e.error.mensaje);
        Swal.fire({ icon: 'error', title: 'Error al actualizar ', text: e.error.mensaje, footer: '<a href="">Why do I have this issue?</a>'});
        return throwError(() => new Error(e));
      })
    );
  }
  delete(id: number): Observable<Cliente> {
  return this.http.delete<Cliente>(`${this.urlEndPoint}/${id}`, {headers: this.httpHeaders}).pipe(
    catchError(e => {
      console.log(e.error.mensaje);
      Swal.fire({ icon: 'error', title: 'Error al eliminar ', text: e.error.mensaje, footer: '<a href="">Why do I have this issue?</a>'});
      return throwError(() => new Error(e));
    })
  );
  }
}
