# E-FIX
:wrench: :pencil2: :wrench: :pencil2: :wrench: :pencil2: :wrench: :pencil2: :wrench: :pencil2: :wrench: :pencil2: :wrench: :pencil2: :wrench: :pencil2: :wrench: :pencil2: :wrench: :pencil2: :wrench: :pencil2: :wrench: :pencil2: :wrench: :pencil2: :wrench: :pencil2:

<img src="https://raw.github.com/CamilaSosa96/e-fix-doc/master/./efixlogo.png" height="150">

### E-FIX es una herramienta que permite gestionar órdenes de reparación.

 #### :star: Front-End: https://github.com/CamilaSosa96/e-fix-front
 #### :star: Documentación: https://github.com/CamilaSosa96/e-fix-doc/wiki
 #### :star: Trello: https://trello.com/b/xYudk17j/e-fix

:wrench: :pencil2: :wrench: :pencil2: :wrench: :pencil2: :wrench: :pencil2: :wrench: :pencil2: :wrench: :pencil2: :wrench: :pencil2: :wrench: :pencil2: :wrench: :pencil2: :wrench: :pencil2: :wrench: :pencil2: :wrench: :pencil2: :wrench: :pencil2: :wrench: :pencil2:

 ## Instalación de E-Fix 
 ### :sparkles: Servidor de datos (Base de datos)
 <b>Recursos necesarios:</b>
 * Xampp
 * Script SQL de Efix (Provisto en el repositorio de documentación)

<b>Pasos:</b>
- Instalar Xampp e iniciar el panel del control. Allí iniciar los servicios de Apache y MySQL.

- Ir a 'localhost/phpmyadmin/' desde el navegador, y crear una Base de Datos llamada 'efix'. Allí importar el script sql.

### :sparkles: Servidor Web (Back-End)
<b>Recursos necesarios:</b>
* Node js 
* VS Code

<b>Pasos:</b>
- Abrir VS Code. Abrir la carpeta en donde se encuentra el proyecto. 

- (Opcional) Abrir el archivo 'MySQLconnection' y editar los valores de la variable 'con', completando los datos
correspondientes al servidor de datos.

- (Opcional) Para el envío de email con presupuesto al cliente, se debe configurar la dirección IP a la que este va a acceder para aprobar o no la reparación. Esto se hace en el archivo efixRouter, editando la constante 'ip'. Poner la IP pública de la red, y configurar en el router un port forwarding hacia el IP de la máquina en donde esté corriendo el front-end.

- Abrir una terminal desde VS Code en la ruta '/e-fix-back' y ejecutar 'npm i' para instalar las dependencias.

- Ejecutar 'cd src' para entrar al directorio src. Allí ejecutar 'node efixservice' para inicial el servidor.

### :sparkles: Cliente (Front-End)
<b>Recursos necesarios:</b>
* Node js
* VS Code
* React

<b>Pasos:</b>
- Ir a VS Code, abrir la carpeta en donde se encuentra el proyecto.
- Abrir el archivo efixService.js y editar la constante 'host'. Asignarle la IP de la máquina en donde se encuentre corriendo el backend. 
- Abrir una terminal desde VS Code en la ruta '/e-fix-front' y ejecutar 'npm i' para instalar las dependencias.
- Ejecutar 'npm start' para iniciar el cliente.

### :sparkles: Configurar usuario Admin
- Loguearse en el sistema con el usuario Admin (Usuario: Admin, contraseña: root) y cambiar la contraseña luego de ingresar.
- El sistema E-Fix está listo para usar!
