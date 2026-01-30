# Sistema de Registro y Login con Roles – BookNotes

Proyecto desarrollado con Node.js, Express, MySQL y React Native (Expo).
Incluye registro de usuarios con roles, inicio de sesión con JWT, persistencia de sesión, vista protegida y cierre de sesión.

## Tecnologías utilizadas

Node.js + Express
MySQL
React Native (Expo)
JWT
DBeaver + HeidiSQL

## Estructura del proyecto

### Backend
backend/
 ├ controllers/
 ├ models/
 ├ routes/
 ├ middleware/
 ├ config/
 ├ index.js
 ├ package.json
 └ .env

## Frontend

frontend/
 ├ app/
 │   ├ _layout.tsx
 │   ├ index.tsx
 │   ├ register.tsx
 │   ├ home.tsx
 │   ├ books.tsx
 │   └ book-detail.tsx
 │
 ├ services/
 │   └ api.ts
 │
 └ package.json

## Variables de entorno (.env)

DB_HOST=localhost

DB_USER=booknotes_user

DB_PASSWORD=12345678

DB_NAME=booknotes

DB_PORT=3306

JWT_SECRET=booknotes_secret

PORT=3000


## Base de datos

Creada en DBeaver usando HeidiSQL.
Tablas:
usuarios
roles

## Backend
### Instalación

cd backend
npm install
node index.js

## Servidor:
http://localhost:3000

## Frontend

cd frontend
npm install
npx expo start

## Funcionalidades

Registro con rol
Login con JWT
Persistencia de sesión
Ruta protegida
Logout

## Flujo del sistema

Registro  
Login  
Acceso a Home  
Logout  

(Registro → Login → Home → Logout)



Autor: Isca Madaí Ortiz Sabando

