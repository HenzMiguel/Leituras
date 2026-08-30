import { Component, input, output } from '@angular/core';
import { LivroCard } from '../livro-card/livro-card';
import { Livro } from '../../models/livro';

@Component({
  imports: [LivroCard],
  selector: 'app-lista-livros',
  styleUrl: './lista-livros.css',
  templateUrl: './lista-livros.html',
})
export class ListaLivros {
  readonly livros = input.required<readonly Livro[]>();
  readonly editar = output<Livro>();
  readonly remover = output<Livro>();
}
