import { Injectable } from '@angular/core';
import { URL_SERVICIOS } from '../../config/config';

@Injectable()
export class UploadImageService 
{
  url: string;
  constructor() 
  {
    this.url = URL_SERVICIOS + 'uploads/';
  }

  subir(archivo: File, tipo: string, id: string)
  {
    return new Promise((resolve, reject) => {
      let formData = new FormData();
      let xhr = new XMLHttpRequest();

      formData.append('imagen', archivo, archivo.name);

      xhr.onreadystatechange = () =>{
        if(xhr.readyState === 4)
        {
          if(xhr.status === 200)
          {
            resolve(JSON.parse(xhr.response));
          }
          else
          {
            reject(xhr.response);
          }
        }
      };
      
      xhr.open('PUT', this.url + tipo + '/' + id, true);
      xhr.send(formData);
    });
    
  }

}
