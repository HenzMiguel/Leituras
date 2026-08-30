import dotenv from "dotenv";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { MongoClient } from "mongodb";

const diretorioAtual = path.dirname(fileURLToPath(import.meta.url));

dotenv.config({
    path: path.resolve(diretorioAtual, "../.env")
});

const uri = process.env.MONGODB_URI;

if (!uri) {
    throw new Error(
        "MONGODB_URI não configurada."
    );
}

const client = new MongoClient(uri);

let collection;

const livrosSchema = {
    bsonType: "object",
    required: ["id", "titulo", "autor", "categoria", "ano", "status", "descricao"],
    properties: {
        id: { bsonType: "int", description: "deve ser um inteiro" },
        titulo: { bsonType: "string", description: "deve ser uma string" },
        autor: { bsonType: "string", description: "deve ser uma string" },
        categoria: { bsonType: "string", description: "deve ser uma string" },
        ano: { bsonType: "int", description: "deve ser um inteiro" },
        status: { bsonType: "string", description: "deve ser uma string" },
        descricao: { bsonType: "string", description: "deve ser uma string" }
    }
};

export async function conectarBanco() {
    await client.connect();
    const db = client.db("livros");
    await db.createCollection("livros", {
        validator: { $jsonSchema: livrosSchema },
        validationLevel: "strict",
        validationAction: "error"
    }).catch((error) => {
        if (error.codeName !== "NamespaceExists") {
            throw error;
        }
    });

    collection = db.collection("livros");
    await collection.createIndex({ id: 1 }, { unique: true });
    const response = await db.command({ ping: 1 });
    console.log(response);
    console.log("MongoDB conectado.");
}
export function livrosCollection() {
    if (!collection) {
        throw new Error("Banco não conectado.");
    }
    return collection;
}