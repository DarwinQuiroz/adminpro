import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { URL_SERVICIOS } from '../../config/config';

import { UsuarioService } from '../usuario/usuario.service';
import { Hospital } from '../../models/hospital.model';

@Injectable()
export class HospitalService 
{
  url: string;
  totalHospitales: number = 0;

  constructor(
    public http: HttpClient,
    public usuarioService: UsuarioService) 
  { 
    this.url = URL_SERVICIOS + 'hospital/';
  }

  obtenerTodos(desde: number = 0)
  {
    return this.http.get(this.url + '?desde=' + desde).map((res: any) => {
      this.totalHospitales = res.total;
      return res;
    });
  }

  obtenerUno(id: string)
  {
    return this.http.get(this.url + id).map(
      (res: any) => res.hospital
    );
  }

  eliminar(id: string)
  {
    return this.http.delete(this.url + id + '?token=' + this.usuarioService.token).map(res => {
      swal('Hospital eliminado.', 'Eliminado correctamente', 'success');
    });
  }

  crear(nombre: string)
  {
    return this.http.post(this.url + `?token=${this.usuarioService.token}`, { nombre }).map(
      (res: any) => res.hospital
    );
  }

  buscar(termino: string)
  {
    let url = URL_SERVICIOS;
    return this.http.get(url + `buscar/coleccion/hospitales/${ termino }`).map(
      (res: any) => res.hospitales
    );
  }

  actualizar(hospital: Hospital)
  {
    return this.http.put(this.url + `${hospital._id}/?token=${this.usuarioService.token}`, hospital).map(
      (res:any) => {
        swal('Hospital Actualizado.', hospital.nombre, 'success');
        return res.hospital;
      }
    );
  }
}
