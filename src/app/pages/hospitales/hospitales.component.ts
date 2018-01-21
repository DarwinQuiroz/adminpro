import { Component, OnInit } from '@angular/core';
import { Hospital } from '../../models/hospital.model';
import { HospitalService } from '../../services/service.index';
import { ModalUploadService } from '../../components/modal-upload/modal-upload.service';
declare var swal: any;

@Component({
  selector: 'app-hospitales',
  templateUrl: './hospitales.component.html',
  styles: []
})
export class HospitalesComponent implements OnInit 
{
  hospitales: Hospital[] = [];
  desde: number = 0;
  total: number = 0;

  constructor(
    public modalUpload: ModalUploadService,
    public hospitalService: HospitalService) { }

  ngOnInit() 
  {
    this.cargarHospitales();
    this.modalUpload.notificacion.subscribe(
      () => this.cargarHospitales()
    );
  }

  cargarHospitales()
  {
    this.hospitalService.obtenerTodos(this.desde).subscribe(
      res => {
        this.hospitales = res.hospitales;
        this.total = res.total;
      }
    );
  }

  crearHospital()
  {
    swal({
      title: 'Crear Hospital',
      text: 'Ingrese el nombre del hospital',
      content: 'input',
      buttons: true,
      dangerMode: true
    }).then((valor: string) => {
      if(!valor || valor.length === 0) return;

      this.hospitalService.crear(valor).subscribe(
        () => this.cargarHospitales()
      )
    })  
  }

  actualizarImagen(hospital)
  {
    this.modalUpload.mostrarModal('hospitales', hospital._id);
  }
  
  actualizarHospital(hospital : Hospital)
  {
    this.hospitalService.actualizar(hospital).subscribe();
  }

  borrarHospital(hospital: Hospital)
  {
    this.hospitalService.eliminar(hospital._id).subscribe(
      () => this.cargarHospitales()
    );
  }

  buscarHospital(termino: string)
  {
    if(termino.length <= 0)
    {
      this.cargarHospitales();
      return;
    }

    this.hospitalService.buscar(termino).subscribe(
      (hospitales: Hospital[]) => this.hospitales = hospitales
    );
  }

  cambiarDesde(valor: number)
  {
    let desde = this.desde + valor;

    if(desde >= this.total) return;
    if(desde < 0 ) return;

    this.desde += valor;
    this.cargarHospitales();
  }
}
