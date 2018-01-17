import { Component, OnInit } from '@angular/core';
import { Usuario } from '../../models/usuario.model';
import { UsuarioService } from '../../services/service.index';
import { ModalUploadService } from '../../components/modal-upload/modal-upload.service';
declare var swal: any;

@Component({
  selector: 'app-usuarios',
  templateUrl: './usuarios.component.html',
  styles: []
})
export class UsuariosComponent implements OnInit 
{
  usuarios: Usuario[] = [];
  desde: number = 0;
  total: number = 0;
  cargando: boolean = true;

  constructor(
    public usuarioService: UsuarioService,
    public modalUploadService: ModalUploadService) { }

  ngOnInit() 
  {
    this.cargarUsuarios();
    this.modalUploadService.notificacion.subscribe(
      res => this.cargarUsuarios());
  }


  cargarUsuarios()
  {
    this.usuarioService.cargar(this.desde).subscribe(
      (res: any) => {
        this.total = res.total;
        this.usuarios = res.usuarios;
        this.cargando = false;
      },
      error => {
        console.log(error);
      }
    );
  }

  guardarUsuario(usuario: Usuario)
  {
    this.usuarioService.actalizar(usuario).subscribe(

    );
  }

  borrarUsuario(usuario)
  {
    if(usuario._id === this.usuarioService.usuario._id)
    {
      swal('Acción no permitida.', 'No se puede eliminar a si mismo.', 'warning');
      return;
    }

    swal({
      title: '¿Estás seguro?',
      text: 'Estás a punto de eliminar a ' + usuario.nombre,
      icon: 'warning',
      buttons: true,
      dangerMode: true,
    })
    .then((borrar) => {
      if (borrar) 
      {
        this.usuarioService.eliminar(usuario._id).subscribe(
          res => {
            swal("El usuario ha sido eliminado!", {
              icon: "success",
            });
            this.cargarUsuarios();
          }
        );
      }
    });
  }

  cambiarDesde(valor: number)
  {
    let desde = this.desde + valor;

    if(desde >= this.total) return;
    if(desde < 0 ) return;

    this.desde += valor;
    this.cargarUsuarios();
  }

  buscarUsuario(termino: string)
  {
    if(termino.length <= 0)
    {
      this.cargarUsuarios();
      return;
    }
    this.cargando = true;

    this.usuarioService.buscar(termino).subscribe(
      (usuarios: Usuario[]) => {
        this.usuarios = usuarios;
        this.cargando = false;
      }
    );
  }

  mostarModal(id: string)
  {
    this.modalUploadService.mostrarModal('usuarios', id);
  }
}
