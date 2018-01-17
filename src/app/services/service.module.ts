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
import { ModalUploadService } from '../components/modal-upload/modal-upload.service';


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
    UploadImageService,
    ModalUploadService
  ],
  declarations: []
})
export class ServiceModule { }
