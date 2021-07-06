import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

const baseUrl = 'http://localhost:3000';

@Injectable({
  providedIn: 'root'
})
export class KaryawanService { 

  constructor(private http: HttpClient) { }

  getAll(): Observable<any> {
    return this.http.get(baseUrl + "/karyawan");
  }


  create(data:any): Observable<any> {
    return this.http.post(baseUrl + "/insertkaryawan", data);
  }


  update(data:any): Observable<any> {
    return this.http.post(baseUrl + "/updatekaryawan", data);
  }

  delete(data:any): Observable<any> {
    return this.http.post(baseUrl + "/deletekaryawan", data);
  }

}
