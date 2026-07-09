import { Component, computed, inject, input, OnInit, output, signal } from '@angular/core';

import { CommonModule } from '@angular/common';

import { FormField, form, required, min, minLength, maxLength } from '@angular/forms/signals';

import { effect } from '@angular/core';

import {
  Especialidad,
  Profesional,
  ProfesionalCreateDto,
  ProfesionalFormModel,
  ProfesionalUpdateDto,
  Tecnologia,
} from '../../../core/models/profesional.model';
import { TecnologiaService } from '../../../core/services/tecnologia.service';
import { EspecialidadService } from '../../../core/services/especialidad.service';
import { UsuarioService } from '../../../core/services/usuario.service';
import { Usuario } from '../../../core/models/usuario.model';
import { ImageService } from '../../../core/services/image.service';
import { ProfesionalService } from '../../../core/services/profesional.service';

@Component({
  selector: 'app-profesional-form',
  standalone: true,
  imports: [CommonModule, FormField],
  templateUrl: './profesional-form.html',
  styleUrl: './profesional-form.css',
})
export class ProfesionalForm implements OnInit {
  private readonly profesionalService = inject(ProfesionalService);

  private readonly tecnologiaService = inject(TecnologiaService);

  private readonly especialidadService = inject(EspecialidadService);

  private readonly usuarioService = inject(UsuarioService);

  private readonly imageService = inject(ImageService);

  profesional = input<Profesional | null>(null);

  tecnologias = signal<Tecnologia[]>([]);

  especialidades = signal<Especialidad[]>([]);

  usuarios = signal<Usuario[]>([]);

  imagePreview = signal<string | null>(null);

  selectedImageFile = signal<File | null>(null);

  uploadingImage = signal(false);

  saving = input<boolean>(false);

  guardar = output<ProfesionalCreateDto | ProfesionalUpdateDto>();

  cancelar = output<void>();

  ngOnInit(): void {
    this.cargarTecnologias();
    this.cargarEspecialidades();
    this.cargarUsuarios();
  }

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

    usuarioId: '0',

    tecnologiaIds: [],

    especialidadIds: [],
  });

  profesionalForm = form(this.profesionalModel, (path) => {
    required(path.tituloProfesional, {
      message: 'El título profesional es obligatorio',
    });

    minLength(path.tituloProfesional, 3, {
      message: 'Mínimo 3 caracteres',
    });

    maxLength(path.tituloProfesional, 150, {
      message: 'Máximo 150 caracteres',
    });

    required(path.descripcion, {
      message: 'La descripción es obligatoria',
    });

    minLength(path.descripcion, 20, {
      message: 'La descripción debe tener mínimo 20 caracteres',
    });

    required(path.annosExperiencia, {
      message: 'La experiencia es obligatoria',
    });

    min(path.annosExperiencia, 0, {
      message: 'La experiencia no puede ser negativa',
    });

    required(path.tarifaBase, {
      message: 'La tarifa es obligatoria',
    });

    min(path.tarifaBase, 1, {
      message: 'La tarifa no puede ser 0',
    });

    required(path.provincia, {
      message: 'La provincia es obligatoria',
    });

    required(path.canton, {
      message: 'El cantón es obligatorio',
    });

    required(path.distrito, {
      message: 'El distrito es obligatorio',
    });

    required(path.usuarioId, {
      message: 'Seleccione un profesional',
    });
  });

  isEdit = computed(() => this.profesional() !== null);

  isSubmitting = computed(() => this.saving());

  submit(): void {
    if (this.isSubmitting()) return;

    this.marcarCamposComoTocados();

    if (this.formularioInvalido()) return;

    const file = this.selectedImageFile();

    if (file) {
      this.subirImagenYGuardar(file);

      return;
    }

    const dto = this.buildDto();

    console.log('Formulario válido:', dto);

    this.guardar.emit(dto);
  }

  constructor() {
    effect(() => {
      const profesional = this.profesional();

      if (!profesional) {
        return;
      }

      this.profesionalModel.set({
        tituloProfesional: profesional.tituloProfesional,

        descripcion: profesional.descripcion ?? '',

        annosExperiencia: profesional.annosExperiencia,

        modalidad: profesional.modalidad,

        provincia: profesional.provincia,

        canton: profesional.canton,

        distrito: profesional.distrito,

        tarifaBase: Number(profesional.tarifaBase),

        disponible: profesional.disponible,

        imagenPerfil: profesional.imagenPerfil,

        usuarioId: profesional.usuarioId.toString(),

        tecnologiaIds: profesional.tecnologias.map((item) => item.tecnologiaId),

        especialidadIds: profesional.especialidades.map((item) => item.especialidadId),
      });

      if (profesional.imagenPerfil) {
        this.imagePreview.set(this.profesionalService.getImageUrl(profesional.imagenPerfil));
      }
      
    });
  }

  soloEnteros(event: KeyboardEvent): void {
    const teclasPermitidas = [
      'Backspace',
      'Delete',
      'ArrowLeft',
      'ArrowRight',
      'ArrowUp',
      'ArrowDown',
      'Tab',
    ];

    if (teclasPermitidas.includes(event.key)) {
      return;
    }

    if (!/^\d$/.test(event.key)) {
      event.preventDefault();
    }
  }

  private marcarCamposComoTocados(): void {
    this.profesionalForm.tituloProfesional().markAsTouched();

    this.profesionalForm.descripcion().markAsTouched();

    this.profesionalForm.annosExperiencia().markAsTouched();

    this.profesionalForm.provincia().markAsTouched();

    this.profesionalForm.canton().markAsTouched();

    this.profesionalForm.distrito().markAsTouched();

    this.profesionalForm.tarifaBase().markAsTouched();

    this.profesionalForm.usuarioId().markAsTouched();
  }

  private formularioInvalido(): boolean {
    return (
      this.profesionalForm.tituloProfesional().invalid() ||
      this.profesionalForm.descripcion().invalid() ||
      this.profesionalForm.annosExperiencia().invalid() ||
      this.profesionalForm.provincia().invalid() ||
      this.profesionalForm.canton().invalid() ||
      this.profesionalForm.distrito().invalid() ||
      this.profesionalForm.tarifaBase().invalid() ||
      this.profesionalForm.usuarioId().invalid()
    );
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

  onImageSelected(event: Event): void {
    const input = event.target as HTMLInputElement;

    const file = input.files?.[0];

    if (!file) return;

    this.selectedImageFile.set(file);

    this.imagePreview.set(URL.createObjectURL(file));
  }

  private cargarTecnologias(): void {
    this.tecnologiaService.listar().subscribe({
      next: (response) => {
        console.log('Tecnologías:', response.data);

        this.tecnologias.set(response.data);
      },

      error: (error) => {
        console.error('Error cargando tecnologías', error);
      },
    });
  }

  private cargarEspecialidades(): void {
    this.especialidadService.listar().subscribe({
      next: (response) => {
        console.log('Especialidades:', response.data);

        this.especialidades.set(response.data);
      },

      error: (error) => {
        console.error('Error cargando especialidades', error);
      },
    });
  }

  toggleTecnologia(id: number): void {
    this.profesionalModel.update((value) => ({
      ...value,

      tecnologiaIds: value.tecnologiaIds.includes(id)
        ? value.tecnologiaIds.filter((item) => item !== id)
        : [...value.tecnologiaIds, id],
    }));
  }

  toggleEspecialidad(id: number): void {
    this.profesionalModel.update((value) => ({
      ...value,

      especialidadIds: value.especialidadIds.includes(id)
        ? value.especialidadIds.filter((item) => item !== id)
        : [...value.especialidadIds, id],
    }));
  }

  isTecnologiaSelected(id: number): boolean {
    return this.profesionalModel().tecnologiaIds.includes(id);
  }

  isEspecialidadSelected(id: number): boolean {
    return this.profesionalModel().especialidadIds.includes(id);
  }

  getTechColor(tecnologia: string): string {
    const colores: Record<string, string> = {
      Angular: '#dd0031',

      React: '#61dafb',

      '.NET': '#512bd4',

      'ASP.NET Core MVC': '#7c3aed',

      'SQL Server': '#cc2927',

      'Node.js': '#339933',

      MongoDB: '#13aa52',

      Docker: '#2496ed',
    };

    return colores[tecnologia] ?? '#8b5cf6';
  }

  private cargarUsuarios(): void {
    this.usuarioService.listarProfesionalesDisponibles().subscribe({
      next: (response) => {
        this.usuarios.set(response.data);
      },

      error: (error) => {
        console.error(error);
      },
    });
  }

  private subirImagenYGuardar(file: File): void {
    this.uploadingImage.set(true);

    this.imageService.upload(file).subscribe({
      next: (response) => {
        this.profesionalModel.update((value) => ({
          ...value,

          imagenPerfil: response.fileName,
        }));

        const dto = this.buildDto();

        this.guardar.emit(dto);
      },

      error: () => {
        alert('No se pudo subir la imagen');
      },

      complete: () => {
        this.uploadingImage.set(false);
      },
    });
  }
}
