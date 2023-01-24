import { Component, OnInit } from '@angular/core';
import { Cliente } from './cliente';
import { ClienteService } from './cliente.service';
import { Router, ActivatedRoute } from '@angular/router';
import swal from 'sweetalert2';

@Component({
  selector: 'app-form',
  templateUrl: './form.component.html',
})
export class FormComponent implements OnInit {

  public cliente: Cliente = new Cliente();
  public titulo: String = "Crear Cliente";
  public errores?: String[];

  ngOnInit(): void {
    this.cargaCliente();
  }
  constructor(private clienteService: ClienteService, private router: Router, private activatedRoute: ActivatedRoute) {
  }
  cargaCliente(): void {
    this.activatedRoute.params.subscribe(params => {
      let id = params['id']
      if (id) {
        this.clienteService.getCLiente(id).subscribe((cliente) => { return this.cliente = cliente; })
      }
    });
  }
  create(): void {
    this.clienteService.create(this.cliente).subscribe({
      next: (json) => {
        this.router.navigate(['/clientes']);
        swal.fire('Nuevo Cliente', `Cliente ${this.cliente.nombre} creado con exito!`, 'success')
      },
      error: (err) => {
        this.errores = this.clienteService.getErrores();
        console.error(err)
      },
    });
  }
  update(): void {
    this.clienteService.update(this.cliente).subscribe({
      next: (json) => {
        this.router.navigate(['/clientes']);
        swal.fire('Actualizar Cliente', `Cliente ${this.cliente.nombre} actualizado con exito`, 'success');
      },
      error: (err) => {
        this.errores = this.clienteService.getErrores();
        console.error(err)
      },
  })
  }
}
