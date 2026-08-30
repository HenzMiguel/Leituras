import { Component, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { map, switchMap } from 'rxjs';
import { LivroCard } from '../../components/livro-card/livro-card';
import { LivroService } from '../../services/livro.service';

@Component({
  imports: [RouterLink, LivroCard],
  selector: 'app-livro-detalhe-page',
  styleUrl: './livro-detalhe-page.css',
  templateUrl: './livro-detalhe-page.html',
})
export class LivroDetalhePage {
  private readonly route = inject(ActivatedRoute);
  private readonly livroService = inject(LivroService);
  protected readonly livro = toSignal(
    this.route.paramMap.pipe(
      map((params) => Number(params.get('id'))),
      switchMap((id) => this.livroService.buscarPorId(id))
    ),
    { initialValue: undefined }
  );

}
