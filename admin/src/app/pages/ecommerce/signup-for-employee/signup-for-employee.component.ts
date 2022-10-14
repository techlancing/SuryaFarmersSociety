import { Component, OnInit, AfterViewInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

import { AuthenticationService } from '../../../core/services/authentication.service';
import { environment } from '../../../../environments/environment';
import { first } from 'rxjs/operators';
import { UserProfileService } from '../../../core/services/user.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-signup-for-employee',
  templateUrl: './signup-for-employee.component.html',
  styleUrls: ['./signup-for-employee.component.scss']
})
export class SignupForEmployeeComponent implements OnInit {

  signupForm: FormGroup;
  submitted = false;
  error = '';
  successmsg = false;
  aRole = [];
  sRole : string;

  // set the currenr year
  year: number = new Date().getFullYear();

  // tslint:disable-next-line: max-line-length
  constructor(private formBuilder: FormBuilder, private route: ActivatedRoute, private router: Router, private authenticationService: AuthenticationService,
    private userService: UserProfileService) { }

  ngOnInit() {
    this.signupForm = this.formBuilder.group({
      username: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required],
      repeatpassword: ['', Validators.required],
      role : ['',Validators.required]
    });
    this.aRole = [
      {
        sDisplayText : "Manager",
        value : "manager"
      },
      {
        sDisplayText : "Employee",
        value : "employee"
      }
    ]
  }

  ngAfterViewInit() {
  }

  // convenience getter for easy access to form fields
  get f() { return this.signupForm.controls; }

  /**
   * On submit form
   */
  onSubmit() {
    this.submitted = true;

    // stop here if form is invalid
    if (this.signupForm.invalid) {
      return;
    }else if(this.f.password.value !== this.f.repeatpassword.value){
      this.fnWarningMessage("Password Mismatch.")
    }
     else {
      this.authenticationService.fnCreateUserAccount(this.f.username.value, this.f.email.value, this.f.password.value,this.f.password.value,this.f.role.value,1234567890)
      .subscribe(
        (data) => {
          this.fnSuccessMessage(this.f.role.value);
          // this.router.navigate(['/account/login']);
        },
        error => {
          console.log(error);
          this.error = error ? error : '';
        });
    }
  }

  fnClear(){
    this.f.username.patchValue('');
    this.f.email.patchValue('');
    this.f.password.patchValue('');
    this.f.repeatpassword.patchValue('');
    this.f.role.patchValue('');
  }
  fnSuccessMessage(employee) {
    Swal.fire({
      position: 'center',
      icon: 'success',
      title: `${employee} is create Successfully.`,
      showConfirmButton: false,
      timer: 2000
    });
  }
  fnWarningMessage(msg : string) {
    Swal.fire({
      position: 'center',
      icon: 'warning',
      title: msg,
      showConfirmButton: false,
      timer: 2000
    });
  }

  }






