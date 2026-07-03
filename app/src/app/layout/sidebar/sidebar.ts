import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './sidebar.html',
  styleUrl: './sidebar.css'
})
export class Sidebar {

  menuItems = [
    {
      label: 'Inicio',
      icon: 'fa-solid fa-house',
      route: '/'
    },
    {
      label: 'Usuarios',
      icon: 'fa-solid fa-users',
      route: '/usuarios'
    },
    {
      label: 'Profesionales',
      icon: 'fa-solid fa-laptop-code',
      route: '/profesionales'
    },
    {
      label: 'Servicios',
      icon: 'fa-solid fa-briefcase',
      route: '/servicios'
    },
    {
      label: 'Categorías',
      icon: 'fa-solid fa-folder',
      route: '/categorias'
    },
    {
      label: 'Especialidades',
      icon: 'fa-solid fa-tags',
      route: '/especialidades'
    },
    {
      label: 'Citas',
      icon: 'fa-solid fa-calendar-days',
      route: '/citas'
    }
  ];
}