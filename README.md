# Proyecto Flask

Este es un proyecto desarrollado con Flask que incluye funcionalidades de base de datos y servidor web.

## 📥 Clonar el Repositorio

Para obtener una copia del proyecto en tu máquina local, ejecuta:

```bash
git clone https://github.com/CarlosVelasco210/app.git
```

Luego, accede a la carpeta del repositorio:

```bash
cd app
```

## 🏗️ Crear y Activar un Entorno Virtual

Para evitar conflictos con otras dependencias de Python, se recomienda usar un entorno virtual. Para crearlo, ejecuta:

```bash
py -3 -m venv "nombre_entorno"
```

### 🔹 **Activar el entorno virtual en PowerShell**
Si usas PowerShell, es posible que obtengas un error de permisos al activar el entorno. Para solucionarlo, antes de activarlo, ejecuta este comando:

```powershell
Set-ExecutionPolicy Unrestricted -Scope Process
```

Luego, activa el entorno virtual con:

```powershell
"nombre_entorno"\Scripts\activate
```

### 🔹 **Alternativa en CMD (sin errores de permisos)**
Si prefieres evitar este problema, puedes usar CMD en lugar de PowerShell:

```cmd
"nombre_entorno"\Scripts\activate.bat
```

## 📦 Instalar Dependencias

Instala los paquetes necesarios ejecutando:

```bash
pip install -r requirements.txt
```

## 🚀 Ejecutar el Servidor

Para iniciar el servidor de desarrollo de Flask, usa el siguiente comando:

```bash
flask --app main --debug run
```

### 🌐 Acceder a la Aplicación

Una vez que el servidor esté en ejecución, aparecerá un enlace en la terminal. Puedes hacer clic en él o copiarlo y pegarlo en tu navegador para visualizar la aplicación.

## 📊 Poblar la Base de Datos (Opcional)

Si la base de datos está vacía y deseas llenarla con datos de prueba, ejecuta:

```bash
python populate.py
```

Luego, recarga la página para ver los datos agregados.

## 🛠️ Tecnologías Utilizadas

- Python
- Flask
- Flask-SQLAlchemy
- Javascript
- HTML/CSS
- Chart.js

## 📝 Notas Adicionales

- Asegúrate de tener **Python** instalado en tu sistema antes de ejecutar el proyecto.
- Si tienes algún problema con dependencias, prueba ejecutar `pip install --upgrade pip` antes de instalar los requisitos.