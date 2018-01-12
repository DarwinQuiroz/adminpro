import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';

import swal from 'sweetalert';
import { UsuarioService } from '../services/service.index';
import { Usuario } from '../models/usuario.model';

declare function init_plugins();

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./login.component.css']
})
export class RegisterComponent implements OnInit 
{
  forma: FormGroup;
  usuario: Usuario;

  constructor(
    public usuarioService: UsuarioService,
    public router: Router) 
  {
    // this.usuario = new Usuario('', '', '');
  }

  ngOnInit() 
  {
    init_plugins();

    this.forma = new FormGroup({
      nombre: new FormControl(null, Validators.required),
      correo: new FormControl(null, [Validators.required, Validators.email]),
      clave: new FormControl(null, Validators.required),
      confirmarClave: new FormControl(null, Validators.required),
      condiciones: new FormControl(false)
    }, { validators:  this.sonIguales('clave', 'confirmarClave')});
  }

  sonIguales(valor1: string, valor2: string)
  {
    return (group: FormGroup) => {
      let pass1 = group.controls[valor1].value;
      let pass2 = group.controls[valor2].value;

      if(pass1 === pass2) return null
      
      return {
        sonIguales: true
      }
    }
  }

  registrarUsuario()
  {
    if(!this.forma.value.condiciones)
    {
      swal("Importante!", "Debe aceptar las condiciones.!", "warning");
    }

    this.usuario = new Usuario(
      this.forma.value.nombre, 
      this.forma.value.correo, 
      this.forma.value.clave);

    this.usuarioService.crear(this.usuario).subscribe(
      res => {
        console.log(res);
        this.router.navigate(['/login']);
      },
      error => {
        console.log(error);
      }
    );
  }
}
