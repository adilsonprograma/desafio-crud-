import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet],
  template: `
    <div class="container">
      <header class="page-header">
        <h1>Gerenciador de Tarefas</h1>
        <p class="subtitle">Desafio Tecnico - Angular + ASP.NET Core + SQL Server</p>
      </header>

      <main>
        <router-outlet></router-outlet>
      </main>
    </div>
  `
})
export class AppComponent {}
