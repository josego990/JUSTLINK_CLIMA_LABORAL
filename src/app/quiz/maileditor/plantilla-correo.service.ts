import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';

interface Plantilla { html: string; }

@Injectable({ providedIn: 'root' })
export class PlantillaCorreoService {
  obtenerPlantilla(key: string): Observable<Plantilla> {
    // TODO: reemplazar con HttpClient.get
    return of({ html: '<p>Hola {{nombreEmpleado}},</p><p>Participa en la encuesta {{nombreEncuesta}} de {{nombreOrganizacion}}.</p>' });
  }

  guardarPlantilla(key: string, html: string): Observable<void> {
    // TODO: reemplazar con HttpClient.post/put
   //console.log('Guardando html:', html);
    return of();
  }
}