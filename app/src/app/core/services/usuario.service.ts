import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';

import { environment } from '../../../environments/environment.development';

import {
    ApiPaginatedResponse
} from '../models/api-response.model';

import { Usuario } from '../models/usuario.model';

@Injectable({
    providedIn: 'root'
})
export class UsuarioService {

    private readonly http = inject(HttpClient);

    private readonly apiUrl =
        `${environment.apiUrl}/usuario`;

    listar() {

        return this.http.get<
            ApiPaginatedResponse<Usuario>
        >(this.apiUrl);

    }


    cambiarEstado(id: number) {

        return this.http.patch(
            `${this.apiUrl}/${id}/estado`,
            {}
        );

    }


}