export class NgxDatableLogs {


   Id: number;
  Canal: string;
  DatosEnviados: string;
  DetalleError: string;
  Exitoso: boolean | null;
  FechaIntento: string | null;
 
  NombreFlujo: string;
  Resultado: string | null; 

  constructor(log:NgxDatableLogs) {

    {
      
      this.Canal          = log.Canal  || '',
      this.DatosEnviados   = log.DatosEnviados  || '',
      this.DetalleError     = log.DetalleError  || '',
      this.Exitoso   = log.Exitoso  || null,
      this.FechaIntento     = log.FechaIntento  || '',
      this.Id = log.Id,
      this.NombreFlujo    =  log.NombreFlujo  || 'chorizo',
      this.Resultado = log.Resultado  || ''
    }
  }
  
}

