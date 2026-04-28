export type StatusTarefa = 'Pendente' | 'Concluida';

export interface Tarefa {
  id: number;
  titulo: string;
  descricao: string;
  status: StatusTarefa;
  dataCriacao: string;
}

export interface CriarTarefaRequest {
  titulo: string;
  descricao: string;
}

export interface AtualizarTarefaRequest {
  titulo: string;
  descricao: string;
  status: StatusTarefa;
}

export function criarTarefaVazia(): Tarefa {
  return {
    id: 0,
    titulo: '',
    descricao: '',
    status: 'Pendente',
    dataCriacao: ''
  };
}
