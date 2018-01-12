import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { 
  SettingsService, 
  SidebarService, 
  SharedService, 
  UsuarioService, 
  LoginGuard,
  UploadImageService } from './service.index';

import { HttpClientModule } from '@angular/common/http';


@NgModule({
  imports: [
    CommonModule, HttpClientModule
  ],
  providers: [
    SettingsService, 
    SidebarService, 
    SharedService, 
    UsuarioService, 
    LoginGuard,
    UploadImageService
  ],
  declarations: []
})
export class ServiceModule { }
