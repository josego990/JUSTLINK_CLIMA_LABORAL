// Sidebar route metadata
export interface RouteInfo {
  path: string;
  title: string;
  iconType: string;
  icon: string;
  class: string;
  groupTitle: boolean;
  badge: string;
  badgeClass: string;
  submenu: RouteInfo[];
}

export interface ConfigInfo {
  idConfig: number;
  Nombre: string;
  Descripcion: string;
  Estado: boolean;

}
