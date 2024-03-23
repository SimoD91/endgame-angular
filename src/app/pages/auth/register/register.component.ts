import { Component, ViewChild } from '@angular/core';
import { UserRegister } from '../../../models/i-user-dto';
import { UserService } from '../../../services/user.service';
import { Router } from '@angular/router';
import { NgForm } from '@angular/forms';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent {
  userRegister: UserRegister = {
    nome: '',
    cognome: '',
    username: '',
    email: '',
    password: '',
  };

  @ViewChild('registerForm') registerForm!: NgForm;
  registering = false;
  inputActiveStates: { [key: string]: boolean } = {};
  showPassword: boolean = false;

  constructor(private userService: UserService, private router: Router) {}

  registerUser() {
    if (!this.isValidEmail(this.userRegister.email)) {
      console.error('Email non valida');
      return;
    }

    this.registering = true;
    this.userService.register(this.userRegister)
      .subscribe(
        (response) => {
          console.log('Registration successful:', response);
          this.registering = false;
          setTimeout(() => {
            this.router.navigate(['auth/login'])
          }, 2000);
        },
        (error) => {
          console.error('Registration error:', error);
          this.registering = false;
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
