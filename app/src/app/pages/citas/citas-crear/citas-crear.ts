import { Component, inject, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { CitaService } from '../../../core/services/cita.service';
import { UsuarioService } from '../../../core/services/usuario.service';
import { ProfesionalService } from '../../../core/services/profesional.service';
import { ServicioService } from '../../../core/services/servicio.service'; // Asegúrate de que esta ruta sea la correcta en tu proyecto
import { ModalidadCita } from '../../../core/models/cita.model';
import { Usuario } from '../../../core/models/usuario.model';
import { Profesional } from '../../../core/models/profesional.model';

@Component({
  selector: 'app-citas-crear',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './citas-crear.html',
  styleUrl: './citas-crear.css'
})
export class CitasCrear implements OnInit {
  private readonly citaService = inject(CitaService);
  private readonly usuarioService = inject(UsuarioService);
  private readonly profesionalService = inject(ProfesionalService);
  private readonly servicioService = inject(ServicioService);
  private readonly router = inject(Router);

  // Signals para controlar el estado de la UI
  guardando = signal<boolean>(false);
  errorMensaje = signal<string | null>(null);

  // Listas tipadas para los selectores cargados desde el backend
  clientes = signal<Usuario[]>([]); 
  profesionales = signal<Profesional[]>([]);
  servicios = signal<any[]>([]); // Cambia 'any' por tu modelo 'Servicio' correspondiente

  // Campos locales bindeados al Formulario
  fechaInput = '';
  horaInput = '';
  modalidadInput: ModalidadCita = 'VIRTUAL';
  descripcionInput = '';
  montoInput: number | null = null;
  clienteIdInput: number | null = null;
  profesionalIdInput: number | null = null;
  servicioIdInput: number | null = null;

  ngOnInit(): void {
    this.cargarClientes();
    this.cargarProfesionales();
    this.cargarServicios();
  }

  private cargarClientes(): void {
    // Usamos tu servicio de usuarios enfocado en el rol o listado general según tu API
    this.usuarioService.listar().subscribe({
      next: (response) => {
        this.clientes.set(response.data);
      },
      error: (error) => {
        console.error('Error cargando clientes:', error);
      }
    });
  }

  private cargarProfesionales(): void {
    // Usamos el listado de profesionales directo desde su servicio dedicado
    this.profesionalService.listar().subscribe({
      next: (response) => {
        this.profesionales.set(response.data);
      },
      error: (error) => {
        console.error('Error cargando profesionales:', error);
      }
    });
  }

  private cargarServicios(): void {
    this.servicioService.listar().subscribe({
      next: (response) => {
        this.servicios.set(response.data);
      },
      error: (error) => {
        console.error('Error cargando servicios:', error);
      }
    });
  }

  // Se dispara automáticamente al cambiar el servicio en el HTML para actualizar la tarifa base automáticamente
  onServicioChange(id: any): void {
    if (!id) return;
    const servicio = this.servicios().find(s => s.id === Number(id));
    if (servicio) {
      // Mapea automáticamente la tarifa o precio base al input de monto
      this.montoInput = servicio.precio || servicio.tarifaBase; 
    }
  }

registrarCita(): void {
  // Aseguramos verificar que los campos no sean nulos o vacíos
  if (!this.fechaInput || !this.horaInput || !this.clienteIdInput || !this.profesionalIdInput || !this.servicioIdInput || !this.montoInput) {
    this.errorMensaje.set('Por favor, completa todos los campos obligatorios.');
    return;
  }

  this.guardando.set(true);
  this.errorMensaje.set(null);

  try {
    // Combinar fecha y hora local de forma segura
    const fechaCitaObj = new Date(`${this.fechaInput}T${this.horaInput}:00`);
    
    if (isNaN(fechaCitaObj.getTime())) {
      throw new Error('Fecha u hora inválida');
    }

    // Sumar 1 hora para la finalización de la cita
    const fechaFinalizacionObj = new Date(fechaCitaObj.getTime() + (60 * 60 * 1000));

    // Armar el payload asegurando los tipos correctos para Zod
    const payload = {
      fechaCita: fechaCitaObj.toISOString(),
      horaInicio: fechaCitaObj.toISOString(),
      horaFinalizacion: fechaFinalizacionObj.toISOString(),
      modalidad: this.modalidadInput,
      descripcion: this.descripcionInput ? this.descripcionInput.trim() : null,
      monto: Number(this.montoInput),
      clienteId: Number(this.clienteIdInput),
      profesionalId: Number(this.profesionalIdInput),
      servicioId: Number(this.servicioIdInput)
    };

    this.citaService.crear(payload).subscribe({
      next: () => {
        this.guardando.set(false);
        this.router.navigate(['/citas']);
      },
      error: (err) => {
        console.error('Error desde el servidor:', err);
        this.guardando.set(false);
        // Capturar el mensaje exacto que configuramos en el backend o en Zod
        this.errorMensaje.set(err.error?.message || 'Error en el servidor al intentar registrar la cita.');
      }
    });
  } catch (e) {
    this.guardando.set(false);
    this.errorMensaje.set('Error al procesar el formato de la fecha y hora seleccionada.');
  }
}
}