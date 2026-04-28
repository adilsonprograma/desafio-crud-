import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, OnChanges, Output, SimpleChanges } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { StatusTarefa, Tarefa, criarTarefaVazia } from '../../models/tarefa.model';

export interface SalvarTarefaPayload {
  id: number;
  titulo: string;
  descricao: string;
  status: StatusTarefa;
}

@Component({
  selector: 'app-task-form',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="card form-card">
      <h2>{{ modoEdicao ? 'Editar tarefa' : 'Nova tarefa' }}</h2>

      <form #form="ngForm" (ngSubmit)="onSubmit(form.valid ?? false)">
        <div class="form-group">
          <label for="titulo">Titulo *</label>
          <input
            id="titulo"
            type="text"
            name="titulo"
            [(ngModel)]="formData.titulo"
            required
            minlength="3"
            maxlength="120"
            #tituloInput="ngModel"
          />
          <small class="error-message" *ngIf="tituloInput.invalid && tituloInput.touched">
            O titulo e obrigatorio e deve ter no minimo 3 caracteres.
          </small>
        </div>

        <div class="form-group">
          <label for="descricao">Descricao</label>
          <textarea
            id="descricao"
            name="descricao"
            [(ngModel)]="formData.descricao"
            rows="4"
            maxlength="500"
          ></textarea>
        </div>

        <div class="form-group" *ngIf="modoEdicao">
          <label for="status">Status</label>
          <select id="status" name="status" [(ngModel)]="formData.status">
            <option value="Pendente">Pendente</option>
            <option value="Concluida">Concluida</option>
          </select>
        </div>

        <div class="form-actions">
          <button type="submit" class="primary" [disabled]="form.invalid">Salvar</button>
          <button type="button" class="secondary" (click)="cancelar.emit()">Cancelar</button>
        </div>
      </form>
    </div>
  `,
  styles: [`
    .form-card {
      border: 1px solid #d8e6f2;
    }

    .form-card h2 {
      margin-bottom: 16px;
      color: #1f2937;
    }

    .error-message {
      color: #b42318;
      display: block;
      margin-top: 6px;
      font-size: 0.82rem;
    }

    .form-actions {
      display: flex;
      gap: 10px;
      margin-top: 14px;
    }
  `]
})
export class TaskFormComponent implements OnChanges {
  @Input() tarefa: Tarefa = criarTarefaVazia();
  @Input() modoEdicao = false;

  @Output() salvar = new EventEmitter<SalvarTarefaPayload>();
  @Output() cancelar = new EventEmitter<void>();

  formData: SalvarTarefaPayload = {
    id: 0,
    titulo: '',
    descricao: '',
    status: 'Pendente'
  };

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['tarefa']) {
      const origem = changes['tarefa'].currentValue as Tarefa;
      this.formData = {
        id: origem.id,
        titulo: origem.titulo,
        descricao: origem.descricao,
        status: origem.status
      };
    }
  }

  onSubmit(isValid: boolean): void {
    if (!isValid) {
      return;
    }

    this.salvar.emit({
      id: this.formData.id,
      titulo: this.formData.titulo.trim(),
      descricao: this.formData.descricao.trim(),
      status: this.formData.status
    });
  }
}
