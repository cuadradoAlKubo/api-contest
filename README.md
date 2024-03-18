# Connectar Bot a discord

Hay que hacer click en el siguiente enlace <https://discordapp.com/oauth2/authorize?&client_id=1216978144645615626&scope=bot&permission=8>
*Nota: Hay que reemplazar el client_id por el propio*

## Configuración de bot

Se debe de crear el bot en  https://discord.com/developers, el cual hay que completar la información general, en OAuth, seleccionar scope bot y Bot Permissions que sean necesarios,
Posteriormente se debe de ir a Bot, Asignarle un nombre y publicar el bot

## Stack Tecnologico

El proyecto esta desarrollado en node, express y mongodb

## Instalación del proyecto

Se debe de clonar el repositorio

``` bash
git clone git@github.com:cuadradoAlKubo/api-contest.git
```

Instalar las dependencias

```bash
npm install
```

o

```bash
yarn install
```

Configurar las variables de entorno

```bash
PORT=
MONGODB_CNN=
SECRETKEY=
CLOUDINARY_URL=

DISCORD_TOKEN=
DISCORD_SERVER_ID = 
PUBLIC_URL=
```
