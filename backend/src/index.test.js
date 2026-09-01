import test from 'node:test';
import assert from 'node:assert/strict';
import { createApp } from './index.js';

function makeCollection(data = []) {
  const items = [...data];

  return {
    find: () => ({
      sort: (sortObj = {}) => {
        const getSorted = () => {
          const res = [...items];
          if (sortObj.id === -1) {
            res.sort((a, b) => b.id - a.id);
          } else {
            res.sort((a, b) => a.id - b.id);
          }
          return res;
        };

        return {
          limit: (n) => ({
            toArray: async () => getSorted().slice(0, n)
          }),
          toArray: async () => getSorted()
        };
      }
    }),
    findOne: async ({ id, _id }) => {
      if (_id) {
        return items.find((item) => item._id?.toString?.() === _id.toString?.());
      }
      return items.find((item) => item.id === id) ?? null;
    },
    insertOne: async (livro) => {
      const item = { ...livro, _id: { toString: () => `mock-${livro.id}` } };
      items.push(item);
      return { insertedId: item._id };
    },
    findOneAndUpdate: async (filter, update) => {
      const index = items.findIndex((item) => item.id === filter.id);
      if (index === -1) {
        return null;
      }
      const atual = items[index];
      const novo = { ...atual, ...update.$set };
      items[index] = novo;
      return novo;
    },
    deleteOne: async ({ id }) => {
      const index = items.findIndex((item) => item.id === id);
      if (index === -1) {
        return { deletedCount: 0 };
      }
      items.splice(index, 1);
      return { deletedCount: 1 };
    }
  };
}

const livroBase = {
  id: 1,
  titulo: 'Torto Arado',
  autor: 'Itamar Vieira Junior',
  categoria: 'Romance',
  ano: 2019,
  status: 'Lido',
  descricao: 'Uma história de terra, memória e irmandade no sertão baiano.'
};

test('GET /api/livros deve listar todos os livros', async () => {
  const collection = makeCollection([livroBase]);
  const app = createApp(collection);
  const server = app.listen(0);
  const { port } = server.address();

  try {
    const response = await fetch(`http://localhost:${port}/api/livros`, {
      method: 'GET'
    });

    assert.equal(response.status, 200);
    const json = await response.json();
    assert.equal(json.length, 1);
    assert.equal(json[0].titulo, 'Torto Arado');
  } finally {
    server.close();
  }
});

test('GET /api/livros/:id deve retornar 404 quando não existir', async () => {
  const collection = makeCollection([]);
  const app = createApp(collection);

  const server = app.listen(0);
  const { port } = server.address();

  try {
    const response = await fetch(`http://localhost:${port}/api/livros/999`);
    assert.equal(response.status, 404);
    const json = await response.json();
    assert.equal(json.message, 'Livro não encontrado.');
  } finally {
    server.close();
  }
});

test('POST /api/livros deve criar o livro e PUT/DELETE devem atualizar e remover', async () => {
  const collection = makeCollection([livroBase]);
  const app = createApp(collection);
  const server = app.listen(0);
  const { port } = server.address();

  try {
    const livroNovo = {
      titulo: 'O Avesso da Pele',
      autor: 'Jeferson Tenório',
      categoria: 'Ficção',
      ano: 2020,
      status: 'Lendo',
      descricao: 'Um romance da jornada e da memória.'
    };

    const postResponse = await fetch(`http://localhost:${port}/api/livros`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(livroNovo)
    });

    assert.equal(postResponse.status, 201);
    const livroCriado = await postResponse.json();
    assert.equal(livroCriado.id, 2);
    assert.equal(livroCriado.titulo, 'O Avesso da Pele');

    const putResponse = await fetch(`http://localhost:${port}/api/livros/2`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...livroNovo, status: 'Lido' })
    });

    assert.equal(putResponse.status, 200);
    const livroAtualizado = await putResponse.json();
    assert.equal(livroAtualizado.status, 'Lido');

    const deleteResponse = await fetch(`http://localhost:${port}/api/livros/2`, {
      method: 'DELETE'
    });

    assert.equal(deleteResponse.status, 204);
  } finally {
    server.close();
  }
});
