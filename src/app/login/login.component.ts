import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NgForm } from '@angular/forms';
import { UsuarioService } from '../services/service.index';
import { Usuario } from '../models/usuario.model';

declare function init_plugins();
declare const gapi: any;

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit 
{
  recordar: boolean = false;
  email: string;
  auth2: any;

  constructor(
    public usuarioService: UsuarioService,
    public router: Router) { }

  ngOnInit() 
  {
    init_plugins();
    this.googleInit();

    this.email = localStorage.getItem('email') || ''; 
    if(this.email != '') this.recordar = true;
  }

  ingresar(form: NgForm)
  {
    let usuario = new Usuario(null, form.value.correo, form.value.clave);
    this.usuarioService.login(usuario, form.value.recordar).subscribe(
      res => {
        this.router.navigate(['/dashboard']);
      },
      error => {
        console.log(error);
        
      }
    );
  }


  googleInit()
  {
    gapi.load('auth2', () => {
      this.auth2 = gapi.auth2.init({
        client_id: '177505360224-da6c1edap53inlon8jbje8gfagq1e5ld.apps.googleusercontent.com',
        cookiepolicy: 'single_host_origin',
        scope: 'profile email'
      });

      this.attachsignin(document.getElementById('btnGoogle'));
    });
  }

  attachsignin(element)
  {
    this.auth2.attachClickHandler(element, {}, (googleUser) => {
      // let profile = googleUser.getBasicProfile();
      let token = googleUser.getAuthResponse().id_token;
      
      this.usuarioService.loginGoogle(token).subscribe(
        res => {
          // this.router.navigate(['/dashboard']);
          window.location.href = '/#dashboard';
        }
      )
    })
  }
}
