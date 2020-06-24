import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from  '@angular/forms';
import { Router } from  '@angular/router';
import { AuthService } from  '../auth.service';
import { User } from '../user';
import { HttpClient } from '@angular/common/http';



@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  error = "";
  constructor(private authService: AuthService, private router: Router, private formBuilder: FormBuilder,private http: HttpClient ) { }

  authForm: FormGroup;
  isSubmitted  =  false;
  get formControls() { return this.authForm.controls; }

  ngOnInit() {
    this.authForm  =  this.formBuilder.group({
        email: ['', Validators.required],
        password: ['', Validators.required]
    });
  }
  setLoginData(){
    this.authForm.value
    this.isSubmitted = true;
    if(this.authForm.invalid){
      return;
    }
  }
  sendLoginData(userData: User){
    const email = userData.email;
    const password = userData.password;
    let response = {};

    if(email&&password){
      this.http.post('http://localhost/ordbogen-test/index.php/login', {
        email,
        password
      }).subscribe(data => {
        response = data;
        var token = data['response']['token'];
          if(token){
            this.authService.setToken(response['response']['token']);
          }
      })
    }
    setTimeout(()=>{ 
      if(response['response'] == 'ERROR'){
        this.error = 'FELJ email eller password er forkert!'; 
      }else{
        this.router.navigateByUrl('/admin');
      }  
    } , 500);

  }
  signIn(){
    this.setLoginData();
    this.sendLoginData(this.authForm.value);
  }

}
