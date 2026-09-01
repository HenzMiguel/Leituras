import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { Livro, NovoLivro } from '../models/livro';
import { LivroService } from './livro.service';

const novoLivro: NovoLivro = {
  titulo: 'Torto Arado',
  autor: 'Itamar Vieira Junior',
  categoria: 'Romance',
  ano: 2019,
  status: 'Lido',
  descricao: 'Uma historia de terra e memoria.',
};

const livro: Livro = {
  id: 1,
  ...novoLivro,
};

describe('LivroService', () => {
  let service: LivroService;
  let httpTesting: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting()],
    });
    service = TestBed.inject(LivroService);
    httpTesting = TestBed.inject(HttpTestingController);
  });

  afterEach(() => httpTesting.verify());

  it('cria um livro com POST', () => {
    service.criar(novoLivro).subscribe((resultado) => expect(resultado).toEqual(livro));

    const requisicao = httpTesting.expectOne('http://localhost:3000/api/livros');
    expect(requisicao.request.method).toBe('POST');
    expect(requisicao.request.body).toEqual(novoLivro);
    requisicao.flush(livro);
  });

  it('atualiza um livro com PUT', () => {
    service.atualizar(livro.id, { ...novoLivro, status: 'Lendo' }).subscribe((resultado) => {
      expect(resultado.status).toBe('Lendo');
    });

    const requisicao = httpTesting.expectOne('http://localhost:3000/api/livros/1');
    expect(requisicao.request.method).toBe('PUT');
    requisicao.flush({ ...livro, status: 'Lendo' });
  });

  it('remove um livro com DELETE', () => {
    service.remover(livro.id).subscribe();

    const requisicao = httpTesting.expectOne('http://localhost:3000/api/livros/1');
    expect(requisicao.request.method).toBe('DELETE');
    requisicao.flush(null);
  });
});