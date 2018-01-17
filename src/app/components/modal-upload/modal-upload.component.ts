import { Component, OnInit } from '@angular/core';
import { UploadImageService } from '../../services/uploads/upload-image.service';
import { ModalUploadService } from './modal-upload.service';

@Component({
  selector: 'app-modal-upload',
  templateUrl: './modal-upload.component.html',
  styles: []
})
export class ModalUploadComponent implements OnInit 
{
  imagenSubir: File;
  imagenTemp: string;

  constructor(
    public modalUploadService: ModalUploadService,
    public upload: UploadImageService
    ) { }

  ngOnInit() {
  }

  subirImagen()
  {
    this.upload.subir(this.imagenSubir, this.modalUploadService.tipo, this.modalUploadService.id)
      .then(res => {
        this.modalUploadService.notificacion.emit(res);
        this.cerrarModal();
      })
      .catch(error => {
        console.log(error);
      });
  }

  cerrarModal()
  {
    this.imagenTemp = null;
    this.imagenSubir = null;
    this.modalUploadService.ocultarModal();
  }

  seleccionImagen(archivo: File)
  {
    if(!archivo) 
    {
      this.imagenSubir = null;
      return;
    }
    if(archivo.type.indexOf('image') < 0)
    {
      swal('Sólo imágenes.', 'El archivo seleccionado no es una imágen.', 'error');
      this.imagenSubir = null;
      return;
    }
    this.imagenSubir = archivo;

    let reader = new FileReader();
    let urlImgTemp = reader.readAsDataURL(archivo);
    
    reader.onloadend = () => this.imagenTemp = reader.result;
  }

}
