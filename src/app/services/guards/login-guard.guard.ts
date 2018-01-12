import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { UsuarioService } from '../usuario/usuario.service';

@Injectable()
export class LoginGuard implements CanActivate 
{
  constructor(
    public router: Router,
    public usuarioService: UsuarioService){}

  canActivate()
  {
    if(this.usuarioService.estaLogueado()) return true;
    else this.router.navigate(['/login']);
    return true;
  }
}
