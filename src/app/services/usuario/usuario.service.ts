import { Injectable } from '@angular/core';
import { Usuario } from '../../models/usuario.model';
import { HttpClient } from '@angular/common/http';
import { URL_SERVICIOS } from '../../config/config';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import { Router } from '@angular/router';
import { UploadImageService } from '../uploads/upload-image.service';
import { Observable } from 'rxjs/Observable';

@Injectable()
export class UsuarioService 
{
  url: string;
  usuario: Usuario;
  token: string;
  menu: any = [];

  constructor(
    public http: HttpClient, 
    public router: Router,
    public uploadImage: UploadImageService)
  {
    this.url = URL_SERVICIOS;
    this.cargarStorage();
  }

  renuevaToken()
  {
    return this.http.get(this.url + `login/refreshtoken?token=${this.token}`).map(
      (res:any) => {
        this.token = res.token;
        localStorage.setItem('token', this.token);
      }
    ).catch(error => {
      this.router.navigate(['/login']);
      swal('No se pudo renovar el token', error.message, 'error');
      return Observable.throw(error);
    });
  }

  estaLogueado():boolean
  {
    return (this.token.length > 5) ? true : false;
  }

  guardarStorage(id: string, token: string, usuario: Usuario, menu: any)
  {
    localStorage.setItem('id', id);
    localStorage.setItem('token', token);
    localStorage.setItem('usuario', JSON.stringify(usuario));
    localStorage.setItem('menu', JSON.stringify(menu));

    this.usuario = usuario;
    this.token = token;
    this.menu = menu;
  }

  cargarStorage()
  {
    if(localStorage.getItem('token'))
    {
      this.token = localStorage.getItem('token');
      this.usuario = JSON.parse(localStorage.getItem('usuario'));
      this.menu = JSON.parse(localStorage.getItem('menu'));
    }
    else 
    {
      this.token = '';
      this.usuario = null;
      this.menu = [];
    }
  }

  crear(usuario: Usuario)
  {
    return this.http.post(this.url  + 'usuario', usuario).map((res: any) => {
      swal('Usuario Creado', usuario.correo, 'success');
      return res.usuario;
    }).catch(err => {
      swal(err.error.mensaje, err.error.errors.message, 'error');
      return Observable.throw(err);
    });
  }

  actalizar(usuario: Usuario)
  {  
    return this.http.put(this.url + 'usuario/' + usuario._id + '?token=' + this.token, usuario)
    .map((res: any) => {
      if(usuario._id === this.usuario._id)
      {
        this.guardarStorage(res.usuario._id, this.token, res.usuario, this.menu);
      }
      
      swal('Usuario Actualizado', usuario.nombre, 'success');
      return true;
    }).catch(err => {
      swal(err.error.mensaje, err.error.errors.message, 'error');
      return Observable.throw(err);
    });
  }

  cambiarImagen(archivo: File, id: string)
  {
    this.uploadImage.subir(archivo, 'usuarios', id)
        .then((res:any) => {
          this.usuario.imagen = res.usuario.imagen;
          swal('Imágen Actualizada.!', this.usuario.nombre, 'success');
          this.guardarStorage(id, this.token, this.usuario, this.menu);
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
      this.guardarStorage(res.usuarioLogin._id, res.token, res.usuarioLogin, res.menu);

      return true;
    }).catch(err => {
      swal('Error en el loguin.!', err.error.mensaje, 'error');
      return Observable.throw(err);
    });
  }

  loginGoogle(token:string)
  {
    return this.http.post(this.url + 'login/google', {token}).map((res: any) => {
      this.guardarStorage(res.usuarioLogin._id, res.token, res.usuarioLogin, res.menu);
      return true;
    });
  }

  logOut()
  {
    this.usuario = null;
    this.token = '';
    this.menu = [];

    localStorage.removeItem('token');
    localStorage.removeItem('usuario');
    localStorage.removeItem('menu');

    this.router.navigate(['/login']);
  }

  cargar(desde: number = 0)
  {
    return this.http.get(this.url + 'usuario?desde=' + desde);
  }

  buscar(termino: string)
  {
    return this.http.get(this.url + `buscar/coleccion/usuarios/${ termino }`).map(
      (res: any) => res.usuarios
    );
  }

  eliminar(id: string)
  {
    return this.http.delete(this.url + `usuario/${id}?token=${this.token}`);
  }
}
