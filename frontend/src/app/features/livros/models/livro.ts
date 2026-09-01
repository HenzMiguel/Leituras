export interface Livro {
  id: number;
  titulo: string;
  autor: string;
  categoria: string;
  ano: number;
  status: string;
  descricao?: string;
}

export type NovoLivro = Omit<Livro, 'id'>;