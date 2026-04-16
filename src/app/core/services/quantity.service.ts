import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { QuantityDTO, ArithmeticDTO, ConversionResult } from '../../shared/models/models';

@Injectable({ providedIn: 'root' })
export class QuantityService {
  private http = inject(HttpClient);
  private baseUrl = environment.apiUrl;

  // POST /api/Conversion/{toUnit}
  convert(quantity: QuantityDTO, toUnit: string): Observable<ConversionResult> {
    return this.http.post<ConversionResult>(
      `${this.baseUrl}/quantity/conversion/${toUnit}`,
      quantity
    );
  }

  // POST /api/addition?toUnit=X
  add(dto: ArithmeticDTO, toUnit: string): Observable<ConversionResult> {
    const params = new HttpParams().set('toUnit', toUnit);
    return this.http.post<ConversionResult>(`${this.baseUrl}/quantity/addition`, dto, { params });
  }

  // POST /api/Subtraction?toUnit=X
  subtract(dto: ArithmeticDTO, toUnit: string): Observable<ConversionResult> {
    const params = new HttpParams().set('toUnit', toUnit);
    return this.http.post<ConversionResult>(`${this.baseUrl}/quantity/subtraction`, dto, { params });
  }
  
  divide(dto: ArithmeticDTO,toUnit: string): Observable<ConversionResult>{
    const params = new HttpParams().set('toUnit', toUnit);
    return this.http.post<ConversionResult>(`${this.baseUrl}/quantity/division`, dto, { params });
  }

  // POST /api/CheckEquaity
  checkEquality(dto: ArithmeticDTO): Observable<boolean> {
    return this.http.post<boolean>(`${this.baseUrl}/quantity/checkEquaity`, dto);
  }
  
  // getHistory(){
  //   // return this.http.get<ConversionResult[]>(`${this.baseUrl}/History`);
  //   // return this.http.get('/api/History');
  //   return this.http.get<any[]>('/api/history'); // array of history
  // }

  getHistory() {
    return this.http.get(`${environment.apiUrl}/user/history`);
  }
}