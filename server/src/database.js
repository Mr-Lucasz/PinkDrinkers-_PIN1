const { PrismaClient } = require('@prisma/client');
require('dotenv').config({ path: '../.env' });

console.log(process.env.DATABASE_URL);


const prisma = new PrismaClient({
  // Configuração de conexão com o banco de dados
  datasources: {
    db: {
      url: process.env.DATABASE_URL, // Lê a variável de ambiente "DATABASE_URL" que contém a URL de conexão com o banco de dados
    },
  },
});

module.exports = prisma; // Exporta o objeto Prisma Client para ser usado em outros arquivos