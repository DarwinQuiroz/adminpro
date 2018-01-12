export class Usuario
{
    constructor(
        public nombre: string,
        public correo: string,
        public clave: string,
        public imagen?: string,
        public rol?: string,
        public google?: boolean,
        public _id?: string) { }
}