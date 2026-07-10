import { Component, signal, computed, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import Swal from 'sweetalert2';
import { CategoriaService } from '../../../core/services/categoria.service';
import { ServicioService } from '../../../core/services/servicio.service';
import { Servicio } from '../../../core/models/servicio.model';
import { Categoria } from '../../../core/models/categoria.model';

@Component({
  selector: 'app-servicios-list',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './servicios-list.html',
  styleUrl: './servicios-list.css'
})
export class ServiciosList implements OnInit {
  private readonly servicioService = inject(ServicioService);
  private readonly categoriaService = inject(CategoriaService);

  servicios = signal<Servicio[]>([]);
  categorias = signal<Categoria[]>([]);

  search = signal('');
  estadoSeleccionado = signal('');
  categoriaSeleccionada = signal('');
  modalidadSeleccionada = signal(''); 
  precioMaximo = signal<number | null>(null); 

  ngOnInit(): void {
    this.cargarServicios();
    this.cargarCategorias();
  }

  cargarServicios(): void {
    this.servicioService.listar().subscribe({
      next: (res) => {
        this.servicios.set(res.data);
      },
      error: (error) => {
        console.error('Error cargando servicios', error);
      }
    });
  }
  cargarCategorias(): void {
    this.categoriaService.listar().subscribe({
      next: (res) => this.categorias.set(res.data),
      error: (error) => console.error('Error cargando categorías', error)
    });
  }

  // Súper Computed: Filtra por texto (nombre / categoría) y por estado sincronizadamente
serviciosFiltrados = computed(() => {
  return this.servicios().filter((servicio) => {
    // 1. Filtro por Nombre
    const texto = this.search().toLowerCase();
    const coincideTexto = servicio.nombre.toLowerCase().includes(texto);
    
    // 2. Filtro por Categoría (Buscamos directo en la relación del objeto mitigando problemas de tipado)
    const coincideCategoria = 
      this.categoriaSeleccionada() === '' || 
      servicio.categoria?.id?.toString() === this.categoriaSeleccionada() ||
      servicio.categoriaId?.toString() === this.categoriaSeleccionada();

    // 3. Filtro por Modalidad
    const coincideModalidad = 
      this.modalidadSeleccionada() === '' || 
      servicio.modalidad === this.modalidadSeleccionada();

    // 4. Filtro por Rango de Precio (Cast seguro a Number para resolver el tipo Decimal de Prisma)
    const maxPrecio = this.precioMaximo();
    const precioServicio = Number(servicio.precio);
    
    const coincidePrecio = 
      maxPrecio === null || 
      maxPrecio <= 0 || 
      precioServicio <= maxPrecio;

    // 5. Filtro por Estado (Ahora sí funcionará porque el Backend envía los datos inactivos)
    const coincideEstado = 
      this.estadoSeleccionado() === '' || 
      servicio.estado === this.estadoSeleccionado();

    // Solo se muestra si cumple con todos los criterios de la pantalla
    return coincideTexto && coincideCategoria && coincideModalidad && coincidePrecio && coincideEstado;
  });
});

  filtrarPorEstado(estado: string): void {
    this.estadoSeleccionado.set(estado);
  }
  filtrarPorCategoria(id: string): void { this.categoriaSeleccionada.set(id); }
  filtrarPorModalidad(modalidad: string): void { this.modalidadSeleccionada.set(modalidad); }
  
  filtrarPorPrecio(valor: string): void {
    const precio = valor ? Number(valor) : null;
    this.precioMaximo.set(precio);
  }
  getImageUrl(fileName: string): string {
    return this.servicioService.getImageUrl(fileName);
  }

  confirmarCambioEstado(id: number): void {
    Swal.fire({
      title: 'Cambiar estado',
      text: '¿Seguro que desea cambiar el estado de este servicio?',
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Aceptar',
      cancelButtonText: 'Cancelar',
      confirmButtonColor: '#059669',
      cancelButtonColor: '#64748b',
    }).then((result) => {
      if (result.isConfirmed) {
        this.servicioService.cambiarEstado(id).subscribe({
          next: () => {
            this.cargarServicios();
            Swal.fire({
              title: 'Actualizado',
              text: 'Estado actualizado correctamente',
              icon: 'success',
              timer: 1500,
              showConfirmButton: false,
            });
          },
          error: () => {
            Swal.fire({
              title: 'Error',
              text: 'No se pudo cambiar el estado del servicio',
              icon: 'error',
            });
          },
        });
      }
    });
  }
}