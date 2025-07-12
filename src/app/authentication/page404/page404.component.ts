import { Component } from '@angular/core';
import { RouterLink, Router } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { FormsModule } from '@angular/forms';
import { AuthService } from '@core';

@Component({
    selector: 'app-page404',
    templateUrl: './page404.component.html',
    styleUrls: ['./page404.component.scss'],
    imports: [
        FormsModule,
        MatButtonModule,

    ]
})
export class Page404Component {
  constructor(private aut: AuthService, private router: Router) {
    // constructor
  }


  LogoutAnRedirect():void{
   //console.log('CLIC');
    this.aut.clearCurrentUser();
    this.router.navigate(['/authentication/signin']);
  }



}
