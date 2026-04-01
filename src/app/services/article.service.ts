import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ArticleService {

  // ============== Live ================
  // public articleurl = 'https://article.sastasundar.com/';

  // ============== stage ================
  public articleurl = 'https://stage-article.sastasundar.com/';

  // ============== local ================
  // public articleurl = 'http://192.168.5.236:7003/';

  constructor(private http: HttpClient) { }

  // getData(url: any): Observable<any>{
  //   return this.http.get(url);
  // }

  getData(path: any, data: any): Observable<any> {
    // data.AuthKey = '9v6lZbc2Q12fSDQ6jWFyUS7CU4BxrxDd';
    let gettUrl = this.articleurl + path;
    return this.http.get(gettUrl, data);
  }

  postData(path: any, data: any): Observable<any> {
    // data.AuthKey = '9v6lZbc2Q12fSDQ6jWFyUS7CU4BxrxDd';
    const headers = new HttpHeaders({
    'authkey' : '9v6lZbc2Q12fSDQ6jWFyUS7CU4BxrxDd'
    });
    let postUrl = this.articleurl + path;
    return this.http.post(postUrl, data, {headers});
  }
}
