import { Routes } from '@angular/router';

import { MainLayout } from './layout/main-layout/main-layout';

import { Home } from './pages/home/home';

import { UsuariosList } from './pages/usuarios/usuarios-list/usuarios-list';

import { ProfesionalesList } from './pages/profesionales/profesionales-list/profesionales-list';
import { ProfesionalesCrear } from './pages/profesionales/profesionales-crear/profesionales-crear';
import { ProfesionalesEditar } from './pages/profesionales/profesionales-editar/profesionales-editar';
import { ProfesionalesDetalle } from './pages/profesionales/profesionales-detalle/profesionales-detalle';

import { ServiciosList } from './pages/servicios/servicios-list/servicios-list';
import { ServiciosCrear } from './pages/servicios/servicios-crear/servicios-crear';
import { ServiciosEditar } from './pages/servicios/servicios-editar/servicios-editar';
import { ServiciosDetalle } from './pages/servicios/servicios-detalle/servicios-detalle';

import { CategoriasList } from './pages/categorias/categorias-list/categorias-list';

import { EspecialidadesLista } from './pages/especialidades/especialidades-lista/especialidades-lista';

import { CitasList } from './pages/citas/citas-list/citas-list';
import { CitasCrear } from './pages/citas/citas-crear/citas-crear';
import { CitasDetalle } from './pages/citas/citas-detalle/citas-detalle';

export const routes: Routes = [

  {
    path: '',
    component: MainLayout,

    children: [

      {
        path: '',
        component: Home,
        title: 'Inicio'
      },

      {
        path: 'usuarios',
        component: UsuariosList,
        title: 'Usuarios'
      },

      {
        path: 'profesionales',
        component: ProfesionalesList,
        title: 'Profesionales'
      },

      {
        path: 'profesionales/crear',
        component: ProfesionalesCrear,
        title: 'Crear profesional'
      },

      {
        path: 'profesionales/:id',
        component: ProfesionalesDetalle,
        title: 'Detalle profesional'
      },

      {
        path: 'profesionales/editar/:id',
        component: ProfesionalesEditar,
        title: 'Editar profesional'
      },

      {
        path: 'servicios',
        component: ServiciosList,
        title: 'Servicios'
      },

      {
        path: 'servicios/crear',
        component: ServiciosCrear,
        title: 'Crear servicio'
      },

      {
        path: 'servicios/:id',
        component: ServiciosDetalle,
        title: 'Detalle servicio'
      },

      {
        path: 'servicios/editar/:id',
        component: ServiciosEditar,
        title: 'Editar servicio'
      },

      {
        path: 'categorias',
        component: CategoriasList,
        title: 'Categorías'
      },

      {
        path: 'especialidades',
        component: EspecialidadesLista,
        title: 'Especialidades'
      },

      {
        path: 'citas',
        component: CitasList,
        title: 'Citas'
      },

      {
        path: 'citas/crear',
        component: CitasCrear,
        title: 'Crear cita'
      },

      {
        path: 'citas/:id',
        component: CitasDetalle,
        title: 'Detalle cita'
      }
      
    ]
  },

  {
    path: '**',
    redirectTo: ''
  }

];