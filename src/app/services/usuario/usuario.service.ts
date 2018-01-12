import { Injectable } from '@angular/core';
import { Usuario } from '../../models/usuario.model';
import { HttpClient } from '@angular/common/http';
import { URL_SERVICIOS } from '../../config/config';
import 'rxjs/add/operator/map';
import { Router } from '@angular/router';
import { UploadImageService } from '../uploads/upload-image.service';

@Injectable()
export class UsuarioService 
{
  url: string;
  usuario: Usuario;
  token;

  constructor(
    public http: HttpClient, 
    public router: Router,
    public uploadImage: UploadImageService)
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

  actalizar(usuario: Usuario)
  {
    this.url += 'usuario/' + usuario._id + '?token=' + this.token;
    console.log(this.url);
    return this.http.put(this.url, usuario).map((res: any) => {
      swal('Usuario Actualizado', usuario.nombre, 'success');
      this.guardarStorage(res.usuario._id, this.token, res.usuario);
      return true;
    });
  }

  cambiarImagen(archivo: File, id: string)
  {
    this.uploadImage.subir(archivo, 'usuarios', id)
        .then((res:any) => {
          this.usuario.imagen = res.usuario.imagen;
          swal('Imágen Actualizada.!', this.usuario.nombre, 'success');
          this.guardarStorage(id, this.token, this.usuario);
        })
        .catch(error => {
          console.log(error);
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
