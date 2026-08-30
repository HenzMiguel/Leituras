import { Component, effect, inject, input, output } from '@angular/core';
import { NonNullableFormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Livro } from '../../models/livro';

@Component({
  imports: [ReactiveFormsModule],
  selector: 'app-formulario-livro',
  styleUrl: './formulario-livro.css',
  templateUrl: './formulario-livro.html',
})
export class FormularioLivro {
  readonly livro = input<Livro>();
  readonly salvar = output<Livro>();
  readonly cancelar = output<void>();

  private readonly formBuilder = inject(NonNullableFormBuilder);
  protected readonly formulario = this.formBuilder.group({
    id: [0, [Validators.required, Validators.min(1)]],
    titulo: ['', Validators.required],
    autor: ['', Validators.required],
    categoria: ['', Validators.required],
    ano: [new Date().getFullYear(), [Validators.required, Validators.min(0)]],
    status: ['Quero ler', Validators.required],
    descricao: ['', Validators.required],
  });

  constructor() {
    effect(() => {
      const livro = this.livro();
      this.formulario.reset(livro ?? {
        id: 0,
        titulo: '',
        autor: '',
        categoria: '',
        ano: new Date().getFullYear(),
        status: 'Quero ler',
        descricao: '',
      });
    });
  }

  protected enviar() {
    if (this.formulario.invalid) {
      this.formulario.markAllAsTouched();
      return;
    }
    this.salvar.emit(this.formulario.getRawValue());
  }
}
