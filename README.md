# ¿Cómo fue desplegado en railway?

Para esto se creo un Dockerfile.prod especializado en tener el proyecto con una version optimizada de node.js, sabiendo esto es importante destacar que dentro de railway detecta este archivo y arranca el proyecto desde ahi.
En caso de ser necesario, se dejan las variables que usamos para hacer las peticiones al backend.
VITE_BACKEND_URL:  https://parkingbackend-production-b10c.up.railway.app
Ahora dejamos los pasos detallados:
Paso 1 Abrir railway
Paso 2 Enlazar en repositorio 
Paso 3 Verificar que railway detecte .prod
Paso 4 Verificar variables de entorno
Paso 5 Esperar building
Paso 6 Frontend Desplegado
Paso 7 Ir a Settings> Networking y ver url del proyecto
paso 8 Listo.


# ¿Cómo compilarlo en local?

Para compilarlo en local, es importante estar en la raiz del proyecto donde estan ambos dockerfile e inicar con dockerfile.dev, siendo estos los pasos a seguir:
Paso 1 Construir nuestra imagen a partir del dockerfile.dev, usando el siguiente comando: docker build -f Dockerfile.dev -t parkingfrontend-dev .
Paso 2 Iniciar la imagen, con puertos, con volumen, con .env (path de backend) quenado el comando asi: docker run -it --rm -p 5173:5173 -v ${PWD}:/app -v /app/node_modules -e VITE_BACKEND_URL=https://parkingbackend-production-b10c.up.railway.app parkingfrontend-dev
Paso 3 Esperar compilacion.
Paso 4 Una vez terminaddo, el proyecto estará corriendo el localhost puerto 5173.

Recalcamos que es importante estar en la raiz ddel proyecto y tener docker corriendo, para el correcto funcionamiento del proyecto.
