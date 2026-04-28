import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { TaskFormComponent, SalvarTarefaPayload } from '../task-form/task-form.component';
import { StatusTarefa, Tarefa, criarTarefaVazia } from '../../models/tarefa.model';
import { TaskService } from '../../services/task.service';

@Component({
  selector: 'app-task-list',
  standalone: true,
  imports: [CommonModule, FormsModule, TaskFormComponent],
  template: `
    <section class="task-container">
      <div class="toolbar card">
        <div class="toolbar-left">
          <label for="filtroStatus">Filtro</label>
          <select id="filtroStatus" [(ngModel)]="filtroStatus" (change)="aplicarFiltro()">
            <option value="todos">Todos</option>
            <option value="Pendente">Pendente</option>
            <option value="Concluida">Concluida</option>
          </select>
        </div>

        <button class="primary" type="button" (click)="novaTarefa()">Nova tarefa</button>
      </div>

      <div *ngIf="mensagemErro" class="alert alert-error">{{ mensagemErro }}</div>
      <div *ngIf="mensagemSucesso" class="alert alert-success">{{ mensagemSucesso }}</div>

      <app-task-form
        *ngIf="mostrarFormulario"
        [modoEdicao]="modoEdicao"
        [tarefa]="tarefaSelecionada"
        (salvar)="onSalvar($event)"
        (cancelar)="onCancelar()"
      ></app-task-form>

      <div *ngIf="carregando" class="card empty-state">
        Carregando tarefas...
      </div>

      <div *ngIf="!carregando" class="task-list">
        <div *ngIf="tarefasFiltradas.length === 0" class="card empty-state">
          Nenhuma tarefa encontrada.
        </div>

        <article *ngFor="let tarefa of tarefasFiltradas" class="card tarefa-card">
          <header class="tarefa-header">
            <h3>{{ tarefa.titulo }}</h3>
            <span class="status-badge" [ngClass]="classeStatus(tarefa.status)">
              {{ tarefa.status }}
            </span>
          </header>

          <p class="tarefa-descricao">{{ tarefa.descricao || 'Sem descricao.' }}</p>

          <footer class="tarefa-footer">
            <small>Criada em {{ tarefa.dataCriacao | date:'dd/MM/yyyy HH:mm' }}</small>
            <div class="tarefa-actions">
              <button type="button" class="success" (click)="alternarStatus(tarefa)">
                {{ tarefa.status === 'Pendente' ? 'Concluir' : 'Marcar pendente' }}
              </button>
              <button type="button" class="secondary" (click)="editarTarefa(tarefa)">Editar</button>
              <button type="button" class="danger" (click)="excluirTarefa(tarefa)">Excluir</button>
            </div>
          </footer>
        </article>
      </div>
    </section>
  `,
  styles: [`
    .task-container {
      display: grid;
      gap: 16px;
      max-width: 920px;
      margin: 0 auto;
    }

    .toolbar {
      display: flex;
      justify-content: space-between;
      align-items: center;
      gap: 12px;
      margin-bottom: 0;
    }

    .toolbar-left {
      display: flex;
      align-items: center;
      gap: 10px;
    }

    .toolbar-left select {
      margin-bottom: 0;
      width: 180px;
    }

    .task-list {
      display: grid;
      gap: 12px;
    }

    .tarefa-card {
      border-left: 4px solid #3b82f6;
    }

    .tarefa-header {
      display: flex;
      justify-content: space-between;
      gap: 12px;
      align-items: center;
      margin-bottom: 10px;
    }

    .tarefa-header h3 {
      margin: 0;
      color: #111827;
    }

    .status-badge {
      border-radius: 999px;
      padding: 4px 10px;
      font-size: 0.8rem;
      font-weight: 600;
      color: #fff;
    }

    .status-pendente {
      background: #f59e0b;
    }

    .status-concluida {
      background: #16a34a;
    }

    .tarefa-descricao {
      color: #4b5563;
      margin: 0 0 12px;
    }

    .tarefa-footer {
      display: flex;
      justify-content: space-between;
      gap: 14px;
      align-items: center;
      border-top: 1px solid #e5e7eb;
      padding-top: 10px;
      flex-wrap: wrap;
    }

    .tarefa-footer small {
      color: #6b7280;
    }

    .tarefa-actions {
      display: flex;
      gap: 8px;
      flex-wrap: wrap;
    }

    .tarefa-actions button {
      padding: 8px 10px;
      font-size: 0.8rem;
    }

    .empty-state {
      text-align: center;
      color: #6b7280;
      margin: 0;
    }
  `]
})
export class TaskListComponent implements OnInit {
  tarefas: Tarefa[] = [];
  tarefasFiltradas: Tarefa[] = [];
  filtroStatus: 'todos' | StatusTarefa = 'todos';

  mostrarFormulario = false;
  modoEdicao = false;
  tarefaSelecionada: Tarefa = criarTarefaVazia();

  carregando = false;
  mensagemErro = '';
  mensagemSucesso = '';

  constructor(private readonly taskService: TaskService) {}

  ngOnInit(): void {
    this.carregarTarefas();
  }

  carregarTarefas(): void {
    this.carregando = true;

    this.taskService.getTarefas().subscribe({
      next: (tarefas) => {
        this.tarefas = tarefas;
        this.aplicarFiltro();
        this.carregando = false;
      },
      error: () => {
        this.mensagemErro = 'Erro ao carregar tarefas. Verifique se a API esta rodando.';
        this.carregando = false;
      }
    });
  }

  aplicarFiltro(): void {
    this.limparMensagens();

    if (this.filtroStatus === 'todos') {
      this.tarefasFiltradas = [...this.tarefas];
      return;
    }

    this.tarefasFiltradas = this.tarefas.filter((tarefa) => tarefa.status === this.filtroStatus);
  }

  novaTarefa(): void {
    this.tarefaSelecionada = criarTarefaVazia();
    this.modoEdicao = false;
    this.mostrarFormulario = true;
    this.limparMensagens();
  }

  editarTarefa(tarefa: Tarefa): void {
    this.tarefaSelecionada = { ...tarefa };
    this.modoEdicao = true;
    this.mostrarFormulario = true;
    this.limparMensagens();
  }

  onSalvar(payload: SalvarTarefaPayload): void {
    if (payload.id === 0) {
      this.taskService
        .createTarefa({ titulo: payload.titulo, descricao: payload.descricao })
        .subscribe({
          next: () => {
            this.mensagemSucesso = 'Tarefa criada com sucesso.';
            this.mostrarFormulario = false;
            this.carregarTarefas();
          },
          error: () => {
            this.mensagemErro = 'Nao foi possivel criar a tarefa.';
          }
        });

      return;
    }

    this.taskService
      .updateTarefa(payload.id, {
        titulo: payload.titulo,
        descricao: payload.descricao,
        status: payload.status
      })
      .subscribe({
        next: () => {
          this.mensagemSucesso = 'Tarefa atualizada com sucesso.';
          this.mostrarFormulario = false;
          this.carregarTarefas();
        },
        error: () => {
          this.mensagemErro = 'Nao foi possivel atualizar a tarefa.';
        }
      });
  }

  onCancelar(): void {
    this.mostrarFormulario = false;
    this.tarefaSelecionada = criarTarefaVazia();
  }

  excluirTarefa(tarefa: Tarefa): void {
    const confirmou = confirm(`Deseja excluir a tarefa "${tarefa.titulo}"?`);

    if (!confirmou) {
      return;
    }

    this.taskService.deleteTarefa(tarefa.id).subscribe({
      next: () => {
        this.mensagemSucesso = 'Tarefa excluida com sucesso.';
        this.carregarTarefas();
      },
      error: () => {
        this.mensagemErro = 'Nao foi possivel excluir a tarefa.';
      }
    });
  }

  alternarStatus(tarefa: Tarefa): void {
    const novoStatus: StatusTarefa = tarefa.status === 'Pendente' ? 'Concluida' : 'Pendente';

    this.taskService
      .updateTarefa(tarefa.id, {
        titulo: tarefa.titulo,
        descricao: tarefa.descricao,
        status: novoStatus
      })
      .subscribe({
        next: () => {
          this.mensagemSucesso = `Status alterado para ${novoStatus}.`;
          this.carregarTarefas();
        },
        error: () => {
          this.mensagemErro = 'Nao foi possivel alterar o status.';
        }
      });
  }

  classeStatus(status: StatusTarefa): string {
    return status === 'Concluida' ? 'status-concluida' : 'status-pendente';
  }

  limparMensagens(): void {
    this.mensagemErro = '';
    this.mensagemSucesso = '';
  }
}
