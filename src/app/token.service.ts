import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class TokenService {

  constructor() { }

  getUserFromToken(){
    const token = localStorage.getItem('ACCESS_TOKEN').toString();
    const tokenArr = token.split('.');
    const tokenBody = atob(tokenArr[1]);
    const bodyArr = JSON.parse(tokenBody);
    return bodyArr['user_login'];
  }
  getToken(){
    return localStorage.getItem('ACCESS_TOKEN').toString();
  }
}
