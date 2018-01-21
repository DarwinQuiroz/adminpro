import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { URL_SERVICIOS } from '../../config/config';
import { UsuarioService } from '../usuario/usuario.service';
import { Medico } from '../../models/medico.model';

@Injectable()
export class MedicoService 
{
  public url: string;
  public totalMedicos: number = 0;

  constructor(
    public usuarioService: UsuarioService, 
    public http: HttpClient) 
  { 
    this.url = URL_SERVICIOS + 'medico/';
  }

  obtenerTodos(desde: number = 0)
  {
    return this.http.get(this.url + '?desde=' + desde).map(
      (res: any) => {
        this.totalMedicos = res.total;
        return res;
      }
    );
  }

  obtenerUno(id: string)
  {
    return this.http.get(this.url + id).map(
      (res: any) => res.medico
    );
  }

  guardar(medico: Medico)
  {
    if(medico._id)
    {
      return this.http.put(this.url + `${medico._id}?token=${this.usuarioService.token}`, medico).map(
        (res: any) => {
          swal('Médico Actualizado.!', medico.nombre, 'success');
          return res.medico;
        }
      );
    }
    else
    {
      return this.http.post(this.url + `?token=${this.usuarioService.token}`, medico).map(
        (res: any) => {
          swal('Médico Creado.!', medico.nombre, 'success');
          return res.medico;
        }
      );
    }
  }

  eliminar(id: string)
  {
    return this.http.delete(this.url + id + `?token=${this.usuarioService.token}`).map(
      res => {
        swal('Médico eliminado.!', 'Ha eliminado el médico correctamente.', 'success');
        return res;
      }
    );
  }

  buscar(termino: string)
  {
    let url = URL_SERVICIOS + `buscar/coleccion/medicos/${ termino }`;
    return this.http.get(url).map(
      (res: any) => res.medicos
    );
  }
}
