import { Routes } from '@angular/router';
import { LivrosPage } from './features/livros/pages/livros-page/livros-page';
import { LivroDetalhePage } from './features/livros/pages/livro-detalhe-page/livro-detalhe-page';

export const routes: Routes = [
    {path: 'livros', component: LivrosPage},
    {path: 'livros/:id', component: LivroDetalhePage}
];
