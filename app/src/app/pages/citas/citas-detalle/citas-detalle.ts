import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Cita } from '../../../core/models/cita.model';

@Component({
  selector: 'app-citas-detalle',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './citas-detalle.html',
  styleUrls: ['./citas-detalle.css']
})
export class CitasDetalle {
  
  @Input() cita: Cita | null = null;
  @Output() alCerrar = new EventEmitter<void>();

  cerrar(): void {
    this.alCerrar.emit();
  }
}