import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from  '@angular/forms';
import { AuthService } from  '../auth.service';
import { Router } from  '@angular/router';
import { Register } from '../register';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {
  error = "";
  constructor(private formBuilder: FormBuilder, private authService: AuthService, private router: Router,private http: HttpClient) { }

  authForm: FormGroup;
  isSubmitted  =  false;
  get formControls() { return this.authForm.controls; }

  ngOnInit() {
    this.authForm  =  this.formBuilder.group({
        email: ['', Validators.required],
        password: ['', Validators.required],
        firstname: ['', Validators.required],
        lastname: ['', Validators.required]
    });
  }
  setRegData(){
    this.authForm.value
    this.isSubmitted = true;
    if(this.authForm.invalid){
      return;
    }
  }
  sendRegData(registerData: Register){
    const email = registerData.email;
    const password = registerData.password;
    const firstname = registerData.firstname;
    const lastname = registerData.lastname;
    let response = {};

    if(email&&password){
      this.http.post('http://localhost/ordbogen-test/index.php/register', {
        email,
        password,
        firstname,
        lastname
      }).subscribe(data => {
        response = data;
      })
    }
    setTimeout(()=>{ 
      if(response['response'] == 'ERROR'){
        this.error = 'FEJL Email er i brug!'; 
      }else{
        this.router.navigateByUrl('/login');
      }  
    } , 500);

  }
  register(){
    this.setRegData();
    this.sendRegData(this.authForm.value);
  }
}
