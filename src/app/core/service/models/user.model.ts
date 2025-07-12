export interface User {
  id: number;
  img: string;
  username: string;
  firstName: string;
  lastName: string;
  token: string;
  
  userId:    number;
  isValid:   boolean;
  idOrganization: number;
  roles:     { roleId: number; roleName: string }[];
  permissions: any[]; // ajusta el tipo según tu modelo
}