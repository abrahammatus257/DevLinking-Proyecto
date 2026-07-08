import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';

import { environment } from '../../../environments/environment.development';

import { ApiPaginatedResponse } from '../models/api-response.model';

import { Tecnologia } from '../models/profesional.model';

@Injectable({
  providedIn: 'root',
})
export class TecnologiaService {
  private readonly http = inject(HttpClient);

  private readonly apiUrl = `${environment.apiUrl}/tecnologia`;

  listar() {
    return this.http.get<ApiPaginatedResponse<Tecnologia>>(this.apiUrl);
  }
}
