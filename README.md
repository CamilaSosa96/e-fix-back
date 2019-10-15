# E-FIX

<img src="https://raw.github.com/CamilaSosa96/e-fix-doc/master/./efixlogo.png" height="150">

 ### E-FIX es una herramienta que permite gestionar órdenes de reparación.

 #### Front-End: https://github.com/CamilaSosa96/e-fix-front
 #### Documentación: https://github.com/CamilaSosa96/e-fix-doc/wiki
 #### Trello: https://trello.com/b/xYudk17j/e-fix

  ## Instalación de E-Fix
 ### Servidor de datos (Base de datos)
 Recursos necesarios:
 * Xampp
 * Script SQL de Efix (Provisto en el repositorio de documentación)

Pasos:
- Instalar Xampp e iniciar el panel del control. Allí iniciar los servicios de Apache y MySQL.

- Ir a 'localhost/phpmyadmin/' desde el navegador, y crear una Base de Datos llamada 'efix'. Allí importar el script sql.

- (Opcional) Dar de alta usuarios haciendo una query en la tabla usuarios. 
(Ej: INSERT INTO usuarios (usuario, contraseña) VALUES ('miUsuario', 'miContraseña')).

### Servidor Web (Back-End)
Recursos necesarios:
* Node js 
* VS Code

Pasos:
- Abrir VS Code. Abrir la carpeta en donde se encuentra el proyecto. 

- (Opcional) Abrir el archivo 'MySQLconnection' y editar los valores de la variable 'con', completando los datos
correspondientes al servidor de datos.

- Abrir una terminal desde VS Code en la ruta '/e-fix-back' y ejecutar 'npm i' para instalar las dependencias.

- Ejecutar 'cd src' para entrar al directorio src. Allí ejecutar 'node efixservice' para inicial el servidor.

### Cliente (Front-End)
Recursos necesarios:
* Node js
* VS Code
* React

Pasos:
- Ir a VS Code, abrir la carpeta en donde se encuentra el proyecto.
- Abrir el archivo efixService.js y editar la constante 'host'. Asignarle la IP de la máquina en donde se encuentre corriendo el backend. 
- Abrir una terminal desde VS Code en la ruta '/e-fix-front' y ejecutar 'npm i' para instalar las dependencias.
- Ejecutar 'npm start' para iniciar el cliente.
