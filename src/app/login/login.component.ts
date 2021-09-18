import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { LoginService } from './login.service';
import { User } from './user.model';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  constructor(private loginservice: LoginService, private router: Router) { }

  loginForm = new FormGroup({
    username: new FormControl(),
    password: new FormControl()
  });
  ngOnInit(): void {
  }

  onSubmit() {
    if (!this.loginForm.valid) {
      return;
    }
    const email = this.loginForm.controls.username.value;
    const password = this.loginForm.controls.password.value;
    this.loginservice.login(email, password).subscribe(
      resData => {
        if (resData.registered){
          const user = new User("abc@abc.com", "sampleToken", true);
          this.loginservice.user.next(user);
          this.router.navigate(['/admin']);
        }
        console.log(resData);
      },
      errorMessage => {
        console.log(errorMessage);
      }
    );

  }


}
