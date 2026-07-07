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
      route: '/',
      color: '#1e88ff'
    },
    {
      label: 'Usuarios',
      icon: 'fa-solid fa-users',
      route: '/usuarios',
      color: '#1e88ff'
    },
    {
      label: 'Profesionales',
      icon: 'fa-solid fa-laptop-code',
      route: '/profesionales',
      color: '#7c3aed'
    },
    {
      label: 'Servicios',
      icon: 'fa-solid fa-briefcase',
      route: '/servicios',
      color: '#059669'
    },
    {
      label: 'Categorías',
      icon: 'fa-solid fa-folder',
      route: '/categorias',
      color: '#ff0000'
    },
    {
      label: 'Especialidades',
      icon: 'fa-solid fa-tags',
      route: '/especialidades',
      color: '#f59e0b'
    },
    {
      label: 'Citas',
      icon: 'fa-solid fa-calendar-days',
      route: '/citas',
      color: '#ec4899'
    }
  ];
}