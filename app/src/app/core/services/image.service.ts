import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';

import { environment } from '../../../environments/environment.development';

@Injectable({
  providedIn: 'root',
})
export class ImageService {
  private readonly http = inject(HttpClient);

  private readonly apiUrl = `${environment.apiUrl}/image`;

  upload(file: File) {
    const formData = new FormData();

    formData.append('image', file);

    return this.http.post<{
      fileName: string;
    }>(`${this.apiUrl}/upload`, formData);
  }
}
