import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

interface CepResponse {
  cep: string;
  logradouro: string;
  complemento: string;
  bairro: string;
  localidade: string;
  uf: string;
}

@Injectable({
  providedIn: 'root',
})
export class CepService {
  private baseUrl = 'https://viacep.com.br/ws';

  constructor(private http: HttpClient) {}

  getCep(cep: string): Observable<CepResponse> {
    const cleanCep = cep.replace(/\D/g, '');

    console.log('clean cep', cleanCep);
    console.log(this.http.get<CepResponse>(`${this.baseUrl}/${cleanCep}/json/`));
    return this.http.get<CepResponse>(`${this.baseUrl}/${cleanCep}/json/`);
  }
}
