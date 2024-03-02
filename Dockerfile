# Use a imagem base do Node.js 18 com Alpine Linux
FROM node:18-alpine

# Define o diretório de trabalho no container
WORKDIR /usr/src/app

# Copia os arquivos package.json e package-lock.json para o diretório de trabalho
COPY package*.json ./

# Instala as dependências do projeto
RUN npm install

# Gera o Prisma Client
RUN npx prisma generate

# Copia o restante dos arquivos do projeto para o container
COPY . .

# Compila o aplicativo NestJS
RUN npm run build

# Define o comando para executar o aplicativo
CMD ["node", "dist/main"]