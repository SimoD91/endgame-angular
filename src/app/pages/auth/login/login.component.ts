import { Component, ViewChild } from '@angular/core';
import { UserLogin } from '../../../models/i-user-dto';
import { UserService } from '../../../services/user.service';
import { Router } from '@angular/router';
import { NgForm } from '@angular/forms';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent {
  userLogin: UserLogin = {
    username: '',
    password: ''
  }

  @ViewChild('registerForm') registerForm!: NgForm;
  logging = false;
  inputActiveStates: { [key: string]: boolean } = {};
  showPassword: boolean = false;
  isLoggedIn: boolean = false;

  constructor(private authService: AuthService, private userService: UserService, private router: Router) {}

loginUser() {
  this.logging = true;
  this.userService.login(this.userLogin)
    .subscribe(
      (response: any) => {
        console.log('Login successful:', response);
        localStorage.setItem('token', response.token);
        this.authService.updateLoginStatus();
        this.isLoggedIn = true;
        setTimeout(() => {
          this.router.navigate(['../../dashboard/loading']);
        }, 2000);
      },
      (error) => {
        console.error('Login error:', error);
      }
    );
}

  isValidEmail(email: string): boolean {
    const emailPattern = /^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}$/;
    return emailPattern.test(email);
  }

  onInputChange(inputId: string) {
    this.inputActiveStates[inputId] = true;
  }

  onInputBlur(inputId: string) {
    this.inputActiveStates[inputId] = false;
  }
  togglePasswordVisibility() {
    this.showPassword = !this.showPassword;
    const imgElement = document.getElementById('password-toggle-img') as HTMLImageElement;
    if (this.showPassword) {
      imgElement.src = "../../../../assets/icons/password_visibile_1.png";
    } else {
      imgElement.src = "../../../../assets/icons/password_nascosta_1.png";
    }
  }
}
