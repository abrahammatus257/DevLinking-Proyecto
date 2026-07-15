import { Component, inject, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { CitaService } from '../../../core/services/cita.service';
import { UsuarioService } from '../../../core/services/usuario.service';
import { ProfesionalService } from '../../../core/services/profesional.service';
import { ServicioService } from '../../../core/services/servicio.service';
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

  // Signals para controlar el estado
  guardando = signal<boolean>(false);
  errorMensaje = signal<string | null>(null);

  // Listas tipadas para los selectores cargados desde el backend
  clientes = signal<Usuario[]>([]); 
  profesionales = signal<Profesional[]>([]);
  servicios = signal<any[]>([]); // Cambia 'any' por tu modelo 'Servicio' correspondiente


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

  onServicioChange(id: any): void {
    if (!id) {
      this.montoInput = null;
      this.profesionalIdInput = null;
      return;
    }

    const servicioIdNumerico = Number(id);
    
    const servicio = this.servicios().find(s => s.id === servicioIdNumerico);
    
    if (servicio) {
      // 1. Mapea automáticamente la tarifa o precio base al input de monto
      this.montoInput = servicio.precio || servicio.tarifaBase; 
      
      // 2. EXTRAE EL DUEÑO DEL SERVICIO:
      
      if (servicio.profesionalId) {
        this.profesionalIdInput = Number(servicio.profesionalId);
        console.log(`Profesional asignado automáticamente: ID ${this.profesionalIdInput}`);
      } else if (servicio.profesional && servicio.profesional.id) {
      
        this.profesionalIdInput = Number(servicio.profesional.id);
        console.log(`Profesional asignado automáticamente (anidado): ID ${this.profesionalIdInput}`);
      } else {
        console.warn('Alerta: El servicio seleccionado no tiene un profesionalId asociado en la base de datos.');
      }
    }
  }

registrarCita(): void {
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

    const fechaFinalizacionObj = new Date(fechaCitaObj.getTime() + (60 * 60 * 1000));

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
        
        this.errorMensaje.set(err.error?.message || 'Error en el servidor al intentar registrar la cita.');
      }
    });
  } catch (e) {
    this.guardando.set(false);
    this.errorMensaje.set('Error al procesar el formato de la fecha y hora seleccionada.');
  }
}
}