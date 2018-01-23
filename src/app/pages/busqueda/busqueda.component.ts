import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpClient } from '@angular/common/http';

import { URL_SERVICIOS } from '../../config/config';
import { Usuario } from '../../models/usuario.model';
import { Medico } from '../../models/medico.model';
import { Hospital } from '../../models/hospital.model';

@Component({
  selector: 'app-busqueda',
  templateUrl: './busqueda.component.html',
  styles: []
})
export class BusquedaComponent implements OnInit 
{
  url: string;
  usuarios: Usuario[] = [];
  medicos: Medico[] = [];
  hospitales: Hospital[] = [];

  constructor(
    public activatedRoute: ActivatedRoute,
    public http: HttpClient) 
  {
    this.url = URL_SERVICIOS + 'buscar/todo/';
  }

  ngOnInit() 
  {
    this.buscar();
  }

  buscar()
  {
    this.activatedRoute.params.subscribe(params => {
      let termino = params['termino'];
      this.http.get(this.url + termino).subscribe(
        (res: any) => {
          this.usuarios = res.usuarios;
          this.hospitales = res.hospitales;
          this.medicos = res.medicos;
        }
      )
    })
  }
}
