import { ComponentFixture, TestBed } from '@angular/core/testing';
import { describe, expect, it, vi, beforeEach } from 'vitest';
import { FormularioLivro } from './formulario-livro';

describe('FormularioLivro', () => {
  let fixture: ComponentFixture<FormularioLivro>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({ imports: [FormularioLivro] }).compileComponents();
    fixture = TestBed.createComponent(FormularioLivro);
    fixture.detectChanges();
  });

  it('nao emite o livro enquanto campos obrigatorios estiverem vazios', () => {
    const salvar = vi.fn();
    fixture.componentInstance.salvar.subscribe(salvar);

    fixture.nativeElement.querySelector('form').dispatchEvent(new Event('submit'));
    fixture.detectChanges();

    expect(salvar).not.toHaveBeenCalled();
  });

  it('emite o livro preenchido ao enviar o formulario', () => {
    const salvar = vi.fn();
    fixture.componentInstance.salvar.subscribe(salvar);
    const campos = fixture.nativeElement.querySelectorAll('input, textarea, select');
    const valores = ['Ensaio', 'Autora', 'Categoria', '2020', 'Lendo', 'Descricao'];

    campos.forEach((campo: HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement, indice: number) => {
      campo.value = valores[indice];
      campo.dispatchEvent(new Event('input'));
      campo.dispatchEvent(new Event('change'));
    });
    fixture.nativeElement.querySelector('form').dispatchEvent(new Event('submit'));

    expect(salvar).toHaveBeenCalledWith({
      titulo: 'Ensaio',
      autor: 'Autora',
      categoria: 'Categoria',
      ano: 2020,
      status: 'Lendo',
      descricao: 'Descricao',
    });
  });
});