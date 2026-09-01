import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { of } from 'rxjs';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { Livro } from '../../models/livro';
import { LivroService } from '../../services/livro.service';
import { LivrosPage } from './livros-page';

const livro: Livro = {
  id: 1,
  titulo: 'Torto Arado',
  autor: 'Itamar Vieira Junior',
  categoria: 'Romance',
  ano: 2019,
  status: 'Lido',
  descricao: 'Uma historia de terra e memoria.',
};

describe('LivrosPage', () => {
  let fixture: ComponentFixture<LivrosPage>;
  const livroService = {
    listar: vi.fn(() => of([livro])),
    criar: vi.fn(() => of(livro)),
    atualizar: vi.fn(() => of(livro)),
    remover: vi.fn(() => of(undefined)),
  };

  beforeEach(async () => {
    livroService.listar.mockClear();
    livroService.remover.mockClear();
    await TestBed.configureTestingModule({
      imports: [LivrosPage],
      providers: [provideRouter([]), { provide: LivroService, useValue: livroService }],
    }).compileComponents();
    fixture = TestBed.createComponent(LivrosPage);
    fixture.detectChanges();
  });

  it('carrega e mostra livros fornecidos pelo servico', () => {
    expect(livroService.listar).toHaveBeenCalledOnce();
    expect(fixture.nativeElement.textContent).toContain('Torto Arado');
  });

  it('abre o formulario de edicao pelo card', () => {
    const botoes: HTMLButtonElement[] = Array.from(
      (fixture.nativeElement as HTMLElement).querySelectorAll('button')
    );
    const editar = botoes
      .find((botao) => botao.textContent?.trim() === 'Editar') as HTMLButtonElement;

    editar.click();
    fixture.detectChanges();

    expect(fixture.nativeElement.textContent).toContain('Editar livro');
  });

  it('remove o livro confirmado pelo usuario', () => {
    vi.spyOn(window, 'confirm').mockReturnValue(true);
    const botoes: HTMLButtonElement[] = Array.from(
      (fixture.nativeElement as HTMLElement).querySelectorAll('button')
    );
    const excluir = botoes
      .find((botao) => botao.textContent?.trim() === 'Excluir') as HTMLButtonElement;

    excluir.click();

    expect(livroService.remover).toHaveBeenCalledWith(1);
    expect(livroService.listar).toHaveBeenCalledTimes(2);
  });
});