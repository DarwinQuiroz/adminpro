import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';

import { MedicoService, HospitalService } from '../../services/service.index';
import { Hospital } from '../../models/hospital.model';
import { Medico } from '../../models/medico.model';
import { ModalUploadService } from '../../components/modal-upload/modal-upload.service';

@Component({
  selector: 'app-medico',
  templateUrl: './medico.component.html',
  styles: []
})
export class MedicoComponent implements OnInit 
{
  hospitales: Hospital[] = [];
  medico: Medico = new Medico('', '', '', '', '');
  hospital: Hospital = new Hospital('');

  constructor(
    public medicoService: MedicoService,
    public hospitalService: HospitalService,
    public modalUpload: ModalUploadService,
    public router: Router,
    public activatedRoute: ActivatedRoute) { }

  ngOnInit() 
  { 
    this.hospitalService.obtenerTodos().subscribe(
      res => this.hospitales = res.hospitales
    );

    this.cargarMedico();

    this.modalUpload.notificacion.subscribe(
      res => {
        this.medico.imagen = res.medico.imagen;
      }
    );
  }

  guardarMedico(form: NgForm)
  {
    if(form.invalid) return;

    this.medicoService.guardar(this.medico).subscribe(
      medico => {
        this.medico._id = medico._id;
        this.router.navigate(['/medico', medico._id]);
      }
    );
  }

  cambioHospital(id: string)
  {    
    this.hospitalService.obtenerUno(id).subscribe(
      hospital => this.hospital = hospital
    );
  }

  cargarMedico()
  {
    this.activatedRoute.params.subscribe(params => {
      let id = params['id'];
      if(id != 'nuevo')
      {
        this.medicoService.obtenerUno(id).subscribe(
          medico => {
            this.medico = medico;
            this.medico.hospital = medico.hospital._id;
            this.cambioHospital(this.medico.hospital);
          }
        )
      }
    })
  }

  cambiarImagen()
  {
    this.modalUpload.mostrarModal('medicos', this.medico._id);
  }
}
