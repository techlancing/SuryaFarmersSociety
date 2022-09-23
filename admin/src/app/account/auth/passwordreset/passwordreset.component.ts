import { Component, OnInit, AfterViewInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthenticationService } from '../../../core/services/authentication.service';
// import { AuthenticationService } from '../../../core/services/auth.service';
import { environment } from '../../../../environments/environment';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-passwordreset',
  templateUrl: './passwordreset.component.html',
  styleUrls: ['./passwordreset.component.scss']
})

/**
 * Reset-password component
 */
export class PasswordresetComponent implements OnInit, AfterViewInit {

  resetForm: FormGroup;
  submitted = false;
  error = '';
  success = '';
  loading = false;
  bEmail = false;
  bOtp = false ;

  // set the currenr year
  year: number = new Date().getFullYear();

  // tslint:disable-next-line: max-line-length
  constructor(private formBuilder: FormBuilder, private route: ActivatedRoute, private router: Router, private authenticationService: AuthenticationService) { }

  ngOnInit() {

    this.resetForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      otp : ['', [Validators.required]],
      password : ['', [Validators.required]],
      repeatpassword : ['', [Validators.required]],
    });
  }

  ngAfterViewInit() {
  }

  // convenience getter for easy access to form fields
  get f() { return this.resetForm.controls; }

  /**
   * On submit form
   */
  onSubmit() {
    this.success = '';
    this.submitted = true;

    // stop here if form is invalid
    if (this.resetForm.invalid) {
      return;
    }
    // if (environment.defaultauth === 'firebase') {
    //   this.authenticationService.resetPassword(this.f.email.value)
    //     .catch(error => {
    //       this.error = error ? error : '';
    //     });
    // }
    if(this.f.password.value === this.f.repeatpassword.value){
      this.authenticationService.fnSetNewPassword(this.f.email.value,this.f.password.value,this.f.repeatpassword.value).subscribe((data) => {
        let message = data as any;
        if(message == 'success'){
          this.fnSuccessMessage('Password Reset Completed successfully');
          this.redirectTo('/login');
        }
      });
    }else this.fnWarningMessage("Password Mismatch");
    
  }

  fnWarningMessage(message : string){
    Swal.fire({
      position: 'center',
      icon: 'warning',
      title:  message,
      showConfirmButton: false,
      timer: 2000
    }); 
  }
  fnSuccessMessage(message : string){
    Swal.fire({
      position: 'center',
      icon: 'success',
      title:  message,
      showConfirmButton: false,
      timer: 2000
    });  
}
  fnEmailAuthentication(){
    this.authenticationService.fnEmailAuthentication(this.f.email.value).subscribe((data) => {
      console.log("email authentication data",data);
      let message = data as any;
      if(message == 'success'){
        this.bEmail =true ;
       // this.fnResetOTP();
      }
    })
  }

  redirectTo(uri:string){
    this.router.navigateByUrl('/', {skipLocationChange: true}).then(()=>
    this.router.navigate([uri]));
 }
  fnOTPValidation() {
    this.authenticationService.fnOTPValidation(this.f.email.value,this.f.otp.value).subscribe((data) => {
      console.log("otp validation data", data);
      let message = data as any;
      if (message == 'success') {
        this.bEmail = true;
        this.bOtp = true;
      }

    });
  }
}
