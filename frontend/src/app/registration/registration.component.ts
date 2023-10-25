import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { JwtHelperService } from '@auth0/angular-jwt';

@Component({
  selector: 'app-registration',
  templateUrl: './registration.component.html',
  styleUrls: ['./registration.component.css']
})
export class RegistrationComponent {
  user: any = {
    username: '',
    email: '',
    password: '',
    confirmPassword: ''
  };
  passwordsMatch = true;
  passwordLength = true;

  constructor(private http:HttpClient, private jwtHelper: JwtHelperService){}

  onSubmit() {
    // Reset validation flags
    this.passwordsMatch = true;
    this.passwordLength = true;

    // Check if passwords match
    if (this.user.password !== this.user.confirmPassword) {
      console.error('Passwords do not match');
      this.passwordsMatch = false;
      return;
    }
    
    // Check password length
    if (this.user.password.length < 8 || this.user.password.length > 64) {
      console.error('Password must be at least 8 characters');
      this.passwordLength = false;
      return;
    }

    // Registration request
    this.http.post('http://localhost:5000/api/register', this.user)
    .subscribe((result: any)=>{
      if (result && result.access_token) {
        localStorage.setItem('access_token', result.access_token)

        //testing. delete later
        console.log(this.jwtHelper.decodeToken(result.access_token.username))

        if (!this.jwtHelper.isTokenExpired(result.access_token)) {
          console.log('Registration and login successful');
        } else {
          console.error('Token is expired');
        }
      } else {
        console.error('Registration failed');
      }      
    });
  }
}