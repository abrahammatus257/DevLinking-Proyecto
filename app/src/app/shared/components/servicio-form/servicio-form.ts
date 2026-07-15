import { Component, computed, inject, input, OnInit, output, signal, effect } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormField, form, required, min, minLength, maxLength } from '@angular/forms/signals';
import { Servicio, ServicioCreateDto, ServicioFormModel, ServicioUpdateDto } from '../../../core/models/servicio.model';
import { Tecnologia, Especialidad } from '../../../core/models/profesional.model';
import { Categoria } from '../../../core/models/categoria.model';
import { TecnologiaService } from '../../../core/services/tecnologia.service';
import { EspecialidadService } from '../../../core/services/especialidad.service';
import { ServicioService } from '../../../core/services/servicio.service';
import { ImageService } from '../../../core/services/image.service';
import { CategoriaService } from '../../../core/services/categoria.service';
import { ProfesionalService } from '../../../core/services/profesional.service'; 
import { Profesional } from '../../../core/models/profesional.model'; 
@Component({
    selector: 'app-servicio-form',
    standalone: true,
    imports: [CommonModule, FormField],
    templateUrl: './servicio-form.html',
    styleUrl: './servicio-form.css'
})
export class ServicioForm implements OnInit {
    private readonly servicioService = inject(ServicioService);
    private readonly tecnologiaService = inject(TecnologiaService);
    private readonly especialidadService = inject(EspecialidadService);
    private readonly imageService = inject(ImageService);
    private readonly categoriaService = inject(CategoriaService);
    private readonly profesionalService = inject(ProfesionalService);

    servicio = input<Servicio | null>(null);
    saving = input<boolean>(false);
    guardar = output<ServicioCreateDto | ServicioUpdateDto>();
    cancelar = output<void>();

    tecnologias = signal<Tecnologia[]>([]);
    especialidades = signal<Especialidad[]>([]);
    categorias = signal<Categoria[]>([]); 

    profesionales = signal<Profesional[]>([]);


    imagePreview = signal<string | null>(null);
    selectedImageFile = signal<File | null>(null);

    servicioModel = signal<ServicioFormModel>({
        nombre: '',
        descripcion: '',
        precio: 0,
        duracionEstimada: 0,
        modalidad: 'VIRTUAL',
        categoriaId: '0',
        profesionalId: '0',
        tecnologiaIds: [],
        especialidadIds: [],
        imagenPortada: '',
        estado: 'ACTIVO'
    });

    servicioForm = form(this.servicioModel, (path) => {
        required(path.nombre, { message: 'El nombre es obligatorio' });
        minLength(path.nombre, 3, { message: 'Mínimo 3 caracteres' });
        maxLength(path.nombre, 150, { message: 'Máximo 150 caracteres' });
        min(path.precio, 1, { message: 'El precio debe ser mayor a 0' });
        required(path.duracionEstimada, { message: 'La duración estimada es obligatoria' });
    });

    isEdit = computed(() => this.servicio() !== null);

    constructor() {
        effect(() => {
            const serv = this.servicio();
            if (!serv) return;

            this.servicioModel.set({
                nombre: serv.nombre,
                descripcion: serv.descripcion ?? '',
                precio: Number(serv.precio),
                duracionEstimada: serv.duracionEstimada,
                modalidad: serv.modalidad,
                categoriaId: serv.categoriaId.toString(),
                profesionalId: serv.profesionalId.toString(),
                
                tecnologiaIds: serv.tecnologias.map(t => t.tecnologia.id),
                especialidadIds: serv.especialidades.map(e => e.especialidad.id),
                imagenPortada: serv.imagenPortada,
                estado: serv.estado
            });

            if (serv.imagenPortada) {
                this.imagePreview.set(this.servicioService.getImageUrl(serv.imagenPortada));
            }
        });
    }

    ngOnInit(): void {
        this.tecnologiaService.listar().subscribe(res => this.tecnologias.set(res.data));
        this.especialidadService.listar().subscribe(res => this.especialidades.set(res.data));
        
        this.categoriaService.listar().subscribe(res => this.categorias.set(res.data));
        this.profesionalService.listar().subscribe(res => this.profesionales.set(res.data));
    }

    toggleTecnologia(id: number): void {
        this.servicioModel.update(v => ({
            ...v,
            tecnologiaIds: v.tecnologiaIds.includes(id) ? v.tecnologiaIds.filter(i => i !== id) : [...v.tecnologiaIds, id]
        }));
    }

    toggleEspecialidad(id: number): void {
        this.servicioModel.update(v => ({
            ...v,
            especialidadIds: v.especialidadIds.includes(id) ? v.especialidadIds.filter(i => i !== id) : [...v.especialidadIds, id]
        }));
    }

    isTecnologiaSelected(id: number): boolean { return this.servicioModel().tecnologiaIds.includes(id); }
    isEspecialidadSelected(id: number): boolean { return this.servicioModel().especialidadIds.includes(id); }

    onImageSelected(event: Event): void {
        const file = (event.target as HTMLInputElement).files?.[0];
        if (!file) return;
        this.selectedImageFile.set(file);
        this.imagePreview.set(URL.createObjectURL(file));
    }

    submit(): void {
        if (this.saving()) return;

        const file = this.selectedImageFile();
        if (file) {
            this.imageService.upload(file).subscribe(res => {
                this.servicioModel.update(v => ({ ...v, imagenPortada: res.fileName }));
                this.guardar.emit(this.buildDto());
            });
        } else {
            this.guardar.emit(this.buildDto());
        }
    }

    private buildDto(): ServicioCreateDto | ServicioUpdateDto {
        const v = this.servicioModel();
        return {
            nombre: v.nombre.trim(),
            descripcion: v.descripcion?.trim() || undefined,
            precio: Number(v.precio),
            duracionEstimada: Number(v.duracionEstimada),
            modalidad: v.modalidad,
            categoriaId: Number(v.categoriaId),
            profesionalId: Number(v.profesionalId),
            tecnologiaIds: v.tecnologiaIds,
            especialidadIds: v.especialidadIds,
            imagenPortada: v.imagenPortada,
            estado: v.estado
        };
    }
}