import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, RouterLink } from '@angular/router';
import { UntypedFormBuilder, UntypedFormGroup, Validators, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AuthService } from '@core';
import { UnsubscribeOnDestroyAdapter } from '@shared';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { OrganizacionService } from 'app/organization/services/organizacion.service';
import Swal from 'sweetalert2';

@Component({
    selector: 'app-signin',
    templateUrl: './signin.component.html',
    styleUrls: ['./signin.component.scss'],
    imports: [
        FormsModule,
        ReactiveFormsModule,
        MatFormFieldModule,
        MatInputModule,
        MatIconModule,
        MatButtonModule,
    ]
})
export class SigninComponent
  extends UnsubscribeOnDestroyAdapter
  implements OnInit {
  authForm!: UntypedFormGroup;
  submitted = false;
  loading = false;
  error = '';
  hide = true;
  constructor(
    private organizationService: OrganizacionService,
    private formBuilder: UntypedFormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private authService: AuthService
  ) {
    super();
  }

  ngOnInit() {
    this.authForm = this.formBuilder.group({
      username: ['josego', Validators.required],
      password: ['30749', Validators.required],
    });
  }
  get f() {
    return this.authForm.controls;
  }
  onSubmit() {
    this.submitted = true;
    this.loading = true;
    this.error = '';
    if (this.authForm.invalid) {
      this.error = 'Username and Password not valid !';
      return;
    } else {
      
      //this.logni13(this.f['username'].value, this.f['password'].value);

       this.authService
        .login(this.f['username'].value, this.f['password'].value)
        .subscribe({
          next: user => {
            this.loading = false;
            if (user.isValid) {
              // login exitoso: redirecciona
             //console.log('user válido:: ', user);
              this.organizationService.getMenuAccess(user.roles[0].roleId).then((resultexx)=>{
                //console.log('VAMOS A VOLAR LA LUNA:: ', resultexx.data)
                sessionStorage.setItem('routes', JSON.stringify(resultexx.data));
                //sessionStorage.setItem('token',user.token);
                this.router.navigate(['/dashboard/dashboard1']);
              }); 
              
            } else {
              // credenciales incorrectas
              this.error = 'Invalid Login';
              Swal.fire({
                title: 'Usuario o contraseña inválido',
                text: 'No se ingresaron credenciales válidas.',
                icon: 'warning',
              }); 
            }
          },
          error: err => {
            // error de red o servidor
            this.loading = false;
            //this.error   = err;
          }
        });


    }
  };


}
