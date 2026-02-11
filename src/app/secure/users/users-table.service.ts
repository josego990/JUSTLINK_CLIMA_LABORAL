import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of, throwError } from 'rxjs';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { catchError, map } from 'rxjs/operators';
import { UserModel } from './users-table.model';
import { OrganizacionService } from 'app/organization/services/organizacion.service';

@Injectable({
  providedIn: 'root',
  
})
export class AdvanceTableService {
  /*
  private readonly API_URL = 'https://api.justlink360.net/get-users-json';
  private readonly API_URL_BY_ID = 'https://api.justlink360.net/get-users-by-id-org-json';
  private readonly API_URL_SAVE_USER = 'https://api.justlink360.net/insert-user';
  private readonly API_URL_UPDATE_USER = 'https://api.justlink360.net/update-user';
*/
  private readonly API_URL = 'http://localhost:3030/get-users-json';
  private readonly API_URL_BY_ID = 'http://localhost:3030/get-users-by-id-org-json';
  private readonly API_URL_SAVE_USER = 'http://localhost:3030/insert-user';
  private readonly API_URL_UPDATE_USER = 'http://localhost:3030/update-user';


  dataChange: BehaviorSubject<UserModel[]> = new BehaviorSubject<
    UserModel[]
  >([]);

  constructor(private httpClient: HttpClient, private organizationService: OrganizacionService) {}

  /** GET: Fetch all advance tables */
  getAllAdvanceTables(): Observable<UserModel[]> {
    return this.httpClient
      .get<UserModel[]>(this.API_URL)
      .pipe(catchError(this.handleError));
  }

  getAllUsersById(idOrganization:any): Observable<UserModel[]> {
    return this.httpClient
      .post<UserModel[]>(this.API_URL_BY_ID,{idOrganization:idOrganization})
      .pipe(catchError(this.handleError));
  }
  
  /** POST: Add a new advance table */
  addUserTable(newUser: UserModel): Observable<UserModel> {

   //console.log('A GUARDAR:: ', newUser);

     return this.httpClient.post<UserModel>(this.API_URL_SAVE_USER, newUser).pipe(
       map((response) => {
         return response; // Return response from API
       }),
       catchError(this.handleError)
     );
  }

  /** PUT: Update an existing advance table */
  updateUserTable(updateUser: UserModel): Observable<UserModel> {
    
    console.log("updateUser: ",  updateUser);

    // API call to update the advance table
     return this.httpClient.post<UserModel>(`${this.API_URL_UPDATE_USER}`, updateUser).pipe(
       map((response) => {
         return response; // Return response from API
       }),
       catchError(this.handleError)
     );
  }

  /** DELETE: Remove an advance table by ID */
  deleteAdvanceTable(id: number): Observable<number> {
    // Delete the advance table by ID from the data array
    return of(id).pipe(
      map((response) => {
        return id; // Return the ID of the deleted advance table
      }),
      catchError(this.handleError)
    );


  }

  /** Handle Http operation that failed */
  private handleError(error: HttpErrorResponse) {
    console.error('An error occurred:', error.message);
    return throwError(
      () => new Error('Something went wrong; please try again later.')
    );
  }
}
