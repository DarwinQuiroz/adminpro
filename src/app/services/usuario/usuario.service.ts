import { Injectable } from '@angular/core';
import { Usuario } from '../../models/usuario.model';
import { HttpClient } from '@angular/common/http';
import { URL_SERVICIOS } from '../../config/config';
import 'rxjs/add/operator/map';
import { Router } from '@angular/router';

@Injectable()
export class UsuarioService 
{
  url: string;
  usuario: Usuario;
  token: string;

  constructor(public http: HttpClient, public router: Router)
  {
    this.url = URL_SERVICIOS;
    this.cargarStorage();
  }

  estaLogueado():boolean
  {
    return (this.token.length > 5) ? true : false;
  }

  guardarStorage(id: string, token: string, usuario: Usuario)
  {
    localStorage.setItem('id', id);
    localStorage.setItem('token', token);
    localStorage.setItem('usuario', JSON.stringify(usuario));
    this.usuario = usuario;
    this.token = token;
  }

  cargarStorage()
  {
    if(localStorage.getItem('token'))
    {
      this.token = localStorage.getItem('token');
      this.usuario = JSON.parse(localStorage.getItem('usuario'));
    }
    else 
    {
      this.token = '';
      this.usuario = null;
    }
  }

  crear(usuario: Usuario)
  {
    return this.http.post(this.url  + 'usuario', usuario).map((res: any) => {
      swal('Usuario Creado', usuario.correo, 'success');
      return res.usuario;
    });
  }


  login(usuario: Usuario, recordar:boolean = false)
  {
    if(recordar) localStorage.setItem('email', usuario.correo);
    else localStorage.removeItem('email');

    return this.http.post(this.url + 'login', usuario).map((res: any) => {
      this.guardarStorage(res.usuarioLogin._id, res.token, res.usuarioLogin);

      return true;
    });
  }

  loginGoogle(token:string)
  {
    return this.http.post(this.url + 'login/google', {token}).map((res: any) => {
      this.guardarStorage(res.usuarioLogin._id, res.token, res.usuarioLogin);
      return true;
    });
  }

  logOut()
  {
    this.usuario = null;
    this.token = '';

    localStorage.removeItem('token');
    localStorage.removeItem('usuario');

    this.router.navigate(['/login']);
  }
}
