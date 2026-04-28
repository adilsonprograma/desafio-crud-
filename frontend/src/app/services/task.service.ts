import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AtualizarTarefaRequest, CriarTarefaRequest, Tarefa } from '../models/tarefa.model';

@Injectable({
  providedIn: 'root'
})
export class TaskService {
  private readonly apiUrl = 'http://localhost:5000/api/tarefas';

  constructor(private http: HttpClient) {}

  getTarefas(): Observable<Tarefa[]> {
    return this.http.get<Tarefa[]>(this.apiUrl);
  }

  getTarefa(id: number): Observable<Tarefa> {
    return this.http.get<Tarefa>(`${this.apiUrl}/${id}`);
  }

  createTarefa(payload: CriarTarefaRequest): Observable<Tarefa> {
    return this.http.post<Tarefa>(this.apiUrl, payload);
  }

  updateTarefa(id: number, payload: AtualizarTarefaRequest): Observable<Tarefa> {
    return this.http.put<Tarefa>(`${this.apiUrl}/${id}`, payload);
  }

  deleteTarefa(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
