export interface User {
  userId:    number;
  isValid:   boolean;
  roles:     { roleId: number; roleName: string }[];
  permissions: any[]; // ajusta el tipo según tu modelo
}