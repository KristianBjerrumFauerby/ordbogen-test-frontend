import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from  '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../auth.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { TokenService } from  '../token.service';
import { Todo } from '../todo';


@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.css']
})
export class AdminComponent implements OnInit {
  firstname = "";
  todos = [];
  constructor(private authService: AuthService, private router: Router, private http: HttpClient, private token: TokenService, private formBuilder: FormBuilder) { }
  authForm: FormGroup;
  isSubmitted  =  false;
  get formControls() { return this.authForm.controls; }
   ngOnInit() {
    this.getUserInfo();
    this.getTodos();
    this.authForm  =  this.formBuilder.group({
      todo: ['', Validators.required]
  });
  }
  setTodoData(){
    this.authForm.value
    this.isSubmitted = true;
    if(this.authForm.invalid){
      return;
    }
  }
  sendTodoData(todoData: Todo){
    
    const todo = todoData.todo;
    
    let response = {};
    let headers: HttpHeaders = new HttpHeaders({'Authorization':this.token.getToken()});
    if(todo){
      this.http.post('http://localhost/ordbogen-test/index.php/todo/createtodo', {
        todo
      },{headers: headers}).subscribe(data => {
        response = data;
        
      })
    }
    setTimeout(()=>{ 
      this.getTodos();
    } , 500);

  }
  createTodo(){
    this.setTodoData();
    this.sendTodoData(this.authForm.value);
    this.authForm  =  this.formBuilder.group({
      todo: ['', Validators.required]
    });
  }

  logout(){
    this.authService.logout();
    this.router.navigateByUrl('/login');
  }
  getUserInfo(){
    const user_login = this.token.getUserFromToken();
    let headers: HttpHeaders = new HttpHeaders({'Authorization':this.token.getToken()});
    

    this.http.post('http://localhost/ordbogen-test/index.php/user_management/getuser', {
        email : user_login
      },{headers: headers}).subscribe(data => {
        this.firstname = data['response'][0]['firstname'];
    })
  }
  getTodos(){
    let headers: HttpHeaders = new HttpHeaders({'Authorization':this.token.getToken()});
    

    this.http.get('http://localhost/ordbogen-test/index.php/todo/gettodos',{headers: headers}).subscribe(data => {
      this.todos = data['response'];   
      console.log(data);
    })
  }
  closeTodo(id){
    
    let response = {};
    let headers: HttpHeaders = new HttpHeaders({'Authorization':this.token.getToken()});
    if(id){
      this.http.post('http://localhost/ordbogen-test/index.php/todo/finishtodo', {
        id
      },{headers: headers}).subscribe(data => {
        response = data;
        
      })
    }
    setTimeout(()=>{ 
      this.getTodos();
    } , 500);
  }
}
