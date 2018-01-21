import { Component, OnInit } from '@angular/core';
import { Medico } from '../../models/medico.model';
import { MedicoService } from '../../services/service.index';

@Component({
  selector: 'app-medicos',
  templateUrl: './medicos.component.html',
  styles: []
})
export class MedicosComponent implements OnInit 
{
  medicos: Medico[] = [];
  desde: number = 0;
  total: number = 0;

  constructor(public medicoService: MedicoService) { }

  ngOnInit() 
  { 
    this.cargarMedicos();
  }

  cargarMedicos()
  {
    this.medicoService.obtenerTodos(this.desde).subscribe(
      res => {
        this.medicos = res.medicos;
        this.total = res.total;
      }
    );
  }

  borrarmedico(medico: Medico)
  {
    this.medicoService.eliminar(medico._id).subscribe(
      () => this.cargarMedicos()
    );
  }

  buscarMedico(termino: string)
  {
    if(termino.length <= 0)
    {
      this.cargarMedicos();
      return;
    }

    this.medicoService.buscar(termino).subscribe(
      medicos => this.medicos = medicos
    );
  }

  cambiarDesde(valor: number)
  {
    let desde = this.desde + valor;

    if(desde >= this.total) return;
    if(desde < 0 ) return;

    this.desde += valor;
    this.cargarMedicos();
  }
}
