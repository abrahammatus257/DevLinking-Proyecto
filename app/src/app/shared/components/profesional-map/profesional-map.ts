import { Component, input, AfterViewInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { inject } from '@angular/core';
import * as L from 'leaflet';

@Component({
  selector: 'app-profesional-map',
  standalone: true,
  imports: [],
  templateUrl: './profesional-map.html',
  styleUrl: './profesional-map.css',
})
export class ProfesionalMap implements AfterViewInit {
  private readonly http = inject(HttpClient);

  provincia = input<string>('');

  canton = input<string>('');

  distrito = input<string>('');

  nombre = input<string>('');

  titulo = input<string>('');

  ngAfterViewInit(): void {
    const direccion = `${this.distrito()},
     ${this.canton()},
     ${this.provincia()},
     Costa Rica`;

    console.log(direccion);

    this.buscarUbicacion(direccion);
  }

  private buscarUbicacion(direccion: string): void {
    const url = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(direccion)}`;

    this.http.get<any[]>(url).subscribe({
      next: (response) => {
        if (!response || response.length === 0) {
          return;
        }

        const lat = Number(response[0].lat);

        const lon = Number(response[0].lon);

        console.log('Latitud', lat);

        console.log('Longitud', lon);

        this.crearMapa(lat, lon);
        console.log(response);
        console.log(response[0].lat, response[0].lon);
      },

      error: (error) => {
        console.error(error);
      },
    });
  }

  private crearMapa(lat: number, lon: number): void {
    const map = L.map('map').setView([lat, lon], 14);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; OpenStreetMap',
    }).addTo(map);

    L.marker([lat, lon])
      .addTo(map)
      .bindPopup(
        `
    <strong>${this.nombre()}</strong>
    <br>
    ${this.titulo()}
    <br><br>
    ${this.distrito()},
    ${this.canton()}
    <br>
    ${this.provincia()}
  `,
      )
      .openPopup();

    setTimeout(() => {
      map.invalidateSize();
    }, 100);
  }
}
