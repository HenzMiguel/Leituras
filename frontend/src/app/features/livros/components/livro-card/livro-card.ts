import { Component, input, output } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Livro } from '../../models/livro';

@Component({
  imports: [RouterLink],
  selector: 'app-livro-card',
  styleUrl: './livro-card.css',
  templateUrl: './livro-card.html',
})
export class LivroCard {
  readonly livro = input.required<Livro>();
  readonly compacto = input(false);
  readonly editar = output<Livro>();
  readonly remover = output<Livro>();

  protected classeStatus(status: string): string {
    return { 'Lido': 'badge-success', 'Lendo': 'badge-warning', 'Quero ler': 'badge-info' }[status] ?? 'badge-neutral';
  }
}
