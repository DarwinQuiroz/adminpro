import { Pipe, PipeTransform } from '@angular/core';
import { URL_SERVICIOS } from '../config/config';

@Pipe({
  name: 'imagen'
})
export class ImagenPipe implements PipeTransform {

  transform(imagen: string, tipo: string = 'usuarios'): any 
  {
    let url = URL_SERVICIOS + 'img/';
    
    if(!imagen) return url + tipo + '/zbc-123';
    if(imagen.indexOf('https') >= 0) return imagen;

    return url += tipo + '/' + imagen;

    // switch(tipo)
    // {
    //   case 'usuario':
    //     url += 'usuario'
    //   break;
    //   case 'medico':
    //   break;
    //   case 'hospital':
    //   break;
    // }
  }

}
