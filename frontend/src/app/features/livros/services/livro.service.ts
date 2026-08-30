import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { catchError, of } from 'rxjs';
import { environment } from '../../../environment';
import { Livro } from '../models/livro';

const API_URL = environment.apiUrl;

@Injectable({ providedIn: 'root' })
export class LivroService {
	private readonly http = inject(HttpClient);

	listar() {
		return this.http.get<Livro[]>(API_URL).pipe(catchError(() => of([])));
	}

	buscarPorId(id: number) {
		return this.http.get<Livro>(`${API_URL}/${id}`).pipe(catchError(() => of(undefined)));
	}

	criar(livro: Livro) {
		return this.http.post<Livro>(API_URL, livro);
	}

	atualizar(id: number, livro: Livro) {
		return this.http.put<Livro>(`${API_URL}/${id}`, livro);
	}

	remover(id: number) {
		return this.http.delete<void>(`${API_URL}/${id}`);
	}
}
