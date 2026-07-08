import { Component, computed, input, output, signal } from '@angular/core';

import { CommonModule } from '@angular/common';

import {
  Profesional,
  ProfesionalCreateDto,
  ProfesionalFormModel,
  ProfesionalUpdateDto,
} from '../../../core/models/profesional.model';

@Component({
  selector: 'app-profesional-form',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './profesional-form.html',
  styleUrl: './profesional-form.css',
})
export class ProfesionalForm {
  profesional = input<Profesional | null>(null);

  saving = input<boolean>(false);

  guardar = output<ProfesionalCreateDto | ProfesionalUpdateDto>();

  cancelar = output<void>();

  profesionalModel = signal<ProfesionalFormModel>({
    tituloProfesional: '',

    descripcion: '',

    annosExperiencia: 0,

    modalidad: 'VIRTUAL',

    provincia: '',

    canton: '',

    distrito: '',

    tarifaBase: 0,

    disponible: true,

    imagenPerfil: '',

    usuarioId: 0,

    tecnologiaIds: [],

    especialidadIds: [],
  });

  isEdit = computed(() => this.profesional() !== null);

  isSubmitting = computed(() => this.saving());

  submit(): void {
    const dto = this.buildDto();

    this.guardar.emit(dto);
  }

  private buildDto(): ProfesionalCreateDto | ProfesionalUpdateDto {
    const value = this.profesionalModel();

    return {
      tituloProfesional: value.tituloProfesional.trim(),

      descripcion: value.descripcion.trim(),

      annosExperiencia: Number(value.annosExperiencia),

      modalidad: value.modalidad,

      provincia: value.provincia.trim(),

      canton: value.canton.trim(),

      distrito: value.distrito.trim(),

      tarifaBase: Number(value.tarifaBase),

      disponible: value.disponible,

      imagenPerfil: value.imagenPerfil,

      usuarioId: Number(value.usuarioId),

      tecnologiaIds: value.tecnologiaIds,

      especialidadIds: value.especialidadIds,
    };
  }
}
