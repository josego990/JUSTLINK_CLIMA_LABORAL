import { formatDate } from '@angular/common';

export class UserModel {
  id:       number;
  username:     string;
  email:        string;
  isActive:     boolean;
  createdAt:    string;
  nombres:      string;
  apellidos:    string;
  telefono:     string;
  imagenUrl:    string;
  cargo:        string;
  idOrganizacion: number;
  genero:       string;
  ciudad:       string;
  roleId:       number;
  roleName:     string;
  organizacion: string;

  constructor(data: Partial<UserModel> = {}) {
    this.id       = data.id       ?? this.getRandomID();
    this.username     = data.username     ?? '';
    this.email        = data.email        ?? '';
    this.isActive     = data.isActive     ?? true;
    this.createdAt    = data.createdAt    ?? formatDate(new Date(), 'yyyy-MM-ddTHH:mm:ss', 'en');
    this.nombres      = data.nombres      ?? '';
    this.apellidos    = data.apellidos    ?? '';
    this.telefono     = data.telefono     ?? '';
    this.imagenUrl    = data.imagenUrl    ?? '';
    this.cargo        = data.cargo        ?? '';
    this.idOrganizacion = data.idOrganizacion ?? 0;
    this.genero       = data.genero       ?? '';
    this.ciudad       = data.ciudad       ?? '';
    this.roleId       = data.roleId       ?? 0;
    this.roleName     = data.roleName     ?? '';
    this.organizacion = data.organizacion ?? '';
  }

  private getRandomID(): number {
    const S4 = () => ((1 + Math.random()) * 0x10000) | 0;
    return S4() + S4();
  }
}
