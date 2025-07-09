export interface User {
  id: number;
  img: string;
  username: string;
  firstName: string;
  lastName: string;
  token: string;

  userId:    number;
  isValid:   boolean;
  roles:     { roleId: number; roleName: string }[];
  permissions: any[]; // ajusta el tipo según tu modelo
}