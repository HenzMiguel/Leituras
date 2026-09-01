import { Component, computed, inject, signal } from '@angular/core';
import { FiltroLivros } from '../../components/filtro-livros/filtro-livros';
import { FormularioLivro } from '../../components/formulario-livro/formulario-livro';
import { ListaLivros } from '../../components/lista-livros/lista-livros';
import { Livro, NovoLivro } from '../../models/livro';
import { LivroService } from '../../services/livro.service';

@Component({
  imports: [FiltroLivros, FormularioLivro, ListaLivros],
  selector: 'app-livros-page',
  styleUrl: './livros-page.css',
  templateUrl: './livros-page.html',
})
export class LivrosPage {
  private readonly livroService = inject(LivroService);
  protected readonly busca = signal('');
  protected readonly categoria = signal('Todas');
  protected readonly status = signal('Todos');
  protected readonly livros = signal<Livro[]>([]);
  protected readonly formularioAberto = signal(false);
  protected readonly livroEmEdicao = signal<Livro | undefined>(undefined);
  protected readonly categorias = computed(() => ['Todas', ...new Set(this.livros().map((livro) => livro.categoria))]);
  protected readonly statuses = computed(() => ['Todos', ...new Set(this.livros().map((livro) => livro.status))]);
  protected readonly livrosFiltrados = computed(() => {
    const termo = this.busca().trim().toLocaleLowerCase();
    const categoria = this.categoria();
    const status = this.status();

    return this.livros().filter((livro) =>
      (categoria === 'Todas' || livro.categoria === categoria) &&
      (status === 'Todos' || livro.status === status) &&
      (!termo || `${livro.titulo} ${livro.autor}`.toLocaleLowerCase().includes(termo))
    );
  });

  constructor() {
    this.carregarLivros();
  }

  protected abrirCadastro() {
    this.livroEmEdicao.set(undefined);
    this.formularioAberto.set(true);
  }

  protected editarLivro(livro: Livro) {
    this.livroEmEdicao.set(livro);
    this.formularioAberto.set(true);
  }

  protected salvarLivro(livro: NovoLivro) {
    const livroEmEdicao = this.livroEmEdicao();
    const requisicao = livroEmEdicao
      ? this.livroService.atualizar(livroEmEdicao.id, livro)
      : this.livroService.criar(livro);

    requisicao.subscribe({
      next: () => {
        this.formularioAberto.set(false);
        this.carregarLivros();
      }
    });
  }

  protected removerLivro(livro: Livro) {
    if (!window.confirm(`Excluir "${livro.titulo}" da biblioteca?`)) {
      return;
    }
    this.livroService.remover(livro.id).subscribe({ next: () => this.carregarLivros() });
  }

  protected fecharFormulario() {
    this.formularioAberto.set(false);
  }

  private carregarLivros() {
    this.livroService.listar().subscribe((livros) => this.livros.set(livros));
  }

}
