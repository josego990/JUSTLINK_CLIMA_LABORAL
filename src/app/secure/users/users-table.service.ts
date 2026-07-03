import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of, throwError, from } from 'rxjs';
import { HttpErrorResponse } from '@angular/common/http';
import { catchError, map } from 'rxjs/operators';
import { UserModel } from './users-table.model';
import { OrganizacionService } from 'app/organization/services/organizacion.service';

@Injectable({
  providedIn: 'root',
  
})
export class AdvanceTableService {
  dataChange: BehaviorSubject<UserModel[]> = new BehaviorSubject<
    UserModel[]
  >([]);

  constructor(private organizationService: OrganizacionService) {}

  /** GET: Fetch all advance tables */
  getAllAdvanceTables(): Observable<UserModel[]> {
    return from(this.organizationService.getUsers())
      .pipe(map((response: any) => response?.data ?? []))
      .pipe(catchError(this.handleError));
  }

  getAllUsersById(idOrganization:any): Observable<UserModel[]> {
    return from(this.organizationService.getUsersByIdOrg(idOrganization))
      .pipe(map((response: any) => response?.data ?? []))
      .pipe(catchError(this.handleError));
  }
  
  /** POST: Add a new advance table */
  addUserTable(newUser: UserModel): Observable<UserModel> {

   //console.log('A GUARDAR:: ', newUser);

     return from(this.organizationService.saveUser(newUser)).pipe(
       map((response: any) => {
         return response?.data; // Return response from API
       }),
       catchError(this.handleError)
     );
  }

  /** PUT: Update an existing advance table */
  updateUserTable(updateUser: UserModel): Observable<UserModel> {
    
    console.log("updateUser: ",  updateUser);

    // API call to update the advance table
     return from(this.organizationService.updateUser(updateUser)).pipe(
       map((response: any) => {
         return response?.data; // Return response from API
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
