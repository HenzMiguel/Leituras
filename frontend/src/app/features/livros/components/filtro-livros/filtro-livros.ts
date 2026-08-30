import { Component, input, output } from '@angular/core';

@Component({
  imports: [],
  selector: 'app-filtro-livros',
  styleUrl: './filtro-livros.css',
  templateUrl: './filtro-livros.html',
})
export class FiltroLivros {
  readonly categorias = input.required<readonly string[]>();
  readonly statuses = input.required<readonly string[]>();
  readonly busca = input('');
  readonly categoria = input('Todas');
  readonly status = input('Todos');

  readonly buscaChange = output<string>();
  readonly categoriaChange = output<string>();
  readonly statusChange = output<string>();

  protected atualizarBusca(event: Event): void {
    this.buscaChange.emit((event.target as HTMLInputElement).value);
  }

  protected atualizarCategoria(event: Event): void {
    this.categoriaChange.emit((event.target as HTMLSelectElement).value);
  }

  protected atualizarStatus(event: Event): void {
    this.statusChange.emit((event.target as HTMLSelectElement).value);
  }
}
