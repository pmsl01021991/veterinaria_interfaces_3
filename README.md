# 🐶 Aplicación Web para una Clínica Veterinaria “Huellitas”

## 🧩 Descripción General

El presente proyecto consiste en el desarrollo de una **aplicación web para una clínica veterinaria** llamada **Huellitas**, creada con el framework **Angular**.  
Su finalidad es **agilizar la gestión de registros de mascotas y citas**, así como optimizar la atención brindada al cliente mediante una interfaz moderna, ordenada y fácil de usar.

La aplicación permite registrar, visualizar, editar y eliminar información de mascotas, además de gestionar citas médicas, manteniendo los datos organizados y accesibles para los usuarios administrativos de la clínica.

---

## 🧠 Objetivos del Proyecto

- Implementar una aplicación web responsiva y dinámica con Angular.  
- Permitir el registro de mascotas, dueños y citas veterinarias.  
- Facilitar la búsqueda, actualización y eliminación de registros.  
- Fomentar buenas prácticas de desarrollo frontend utilizando componentes, servicios y módulos de Angular.  


---

## ⚙️ Tecnologías Utilizadas

| Tecnología | Descripción |
|-------------|--------------|
| **Angular** | Framework principal para el desarrollo del frontend. |
| **TypeScript** | Lenguaje base de Angular que permite tipado estático y código estructurado. |
| **HTML5 / CSS3** | Lenguajes para la estructura y estilo de la aplicación. |
| **Bootstrap / Tailwind (si aplica)** | Librería de estilos para diseño responsivo. |
| **Node.js** | Entorno necesario para ejecutar Angular CLI y gestionar dependencias. |
| **Git / GitHub** | Control de versiones y almacenamiento remoto del proyecto. |

---

## 🏗️ Estructura del Proyecto

```
mi-proyecto01-integrado-huellitas/
│
├── src/
│   ├── app/
│   │   ├── components/       # Componentes visuales (formularios, listas, etc.)
│   │   ├── services/         # Servicios para comunicación entre componentes y backend
│   │   ├── models/           # Interfaces y estructuras de datos
│   │   ├── pages/            # Vistas principales del sistema
│   │   └── app.module.ts     # Módulo principal de Angular
│   │
│   ├── assets/               # Imágenes, íconos, estilos adicionales
│   ├── environments/         # Configuración de entornos (dev, prod)
│   ├── index.html            # Página principal de entrada
│   ├── main.ts               # Punto de arranque del proyecto Angular
│   └── styles.css            # Estilos globales del proyecto
│
├── angular.json              # Configuración del proyecto Angular
├── package.json              # Dependencias y scripts de ejecución
└── README.md                 # Documento explicativo del proyecto
```

---

## 🚀 Instalación y Ejecución

🌐 Deployment (Producción)

El proyecto está desplegado en Render y se puede acceder desde:

👉 https://veterinaria-interfaces-3.web.app

### 1️⃣ Requisitos previos
Antes de ejecutar la aplicación, asegúrate de tener instalado lo siguiente:

- [Node.js](https://nodejs.org/) versión 18 o superior  
- [Angular CLI](https://angular.io/cli) versión 20  
- Git (opcional para control de versiones)

Para verificar:
```bash
node -v
ng version
```

---

### 2️⃣ Clonar el repositorio (si está en GitHub)
```bash
git clone https://github.com/pmsl01021991/veterinaria_interfaces_3
cd mi-proyecto01-integrado-huellitas
```

---

### 3️⃣ Instalar dependencias
```bash
npm install
```

---

### 4️⃣ Ejecutar el servidor de desarrollo
```bash
ng serve
```

Luego, abre tu navegador en:
👉 `http://localhost:4200`

---

## 🧭 Funcionalidades Principales

- **Registro de Mascotas:** Permite agregar nueva información con validaciones.  
- **Gestión de Citas:** Posibilidad de registrar, modificar o eliminar citas médicas.  
- **Visualización de Datos:** Listado dinámico de mascotas y citas con filtros y búsqueda.  
- **Interfaz Adaptativa:** Diseño moderno y responsivo que se ajusta a diferentes pantallas.  
- **Validaciones:** Control de formularios mediante expresiones regulares (Regex).  
- **Conexión con Backend:** Preparado para integrarse con una API Flask o Node.js conectada a MySQL.  

---

## 🧑‍💻 Componentes Principales de Angular

| Componente / Módulo | Función |
|----------------------|---------|
| **AppComponent** | Contenedor principal de la aplicación. |
| **MascotaRegistroComponent** | Gestiona el formulario de registro de mascotas. |
| **CitaRegistroComponent** | Controla la creación y administración de citas veterinarias. |
| **Servicios (Services)** | Encargados de conectar los componentes con el backend. |
| **RoutingModule** | Configura las rutas y navegación entre vistas. |
| **Modelos (Interfaces)** | Definen la estructura de datos (mascota, cita, cliente, etc.). |

---

## 🧾 Conclusión

El desarrollo de esta aplicación web demuestra el uso práctico de Angular en la creación de **interfaces dinámicas y modulares**, aplicando los principios de desarrollo basado en componentes, separación de responsabilidades y reactividad.

Este sistema proporciona una herramienta eficiente para **la gestión interna de una clínica veterinaria**, optimizando el registro y control de mascotas y citas mediante una experiencia de usuario intuitiva y moderna.

---

## ✍️ Autor

**Nombre:** Grupo 2  
**Curso:** Desarrollo de Interfaces  3
**Ciclo:** Cuarto ciclo  
**Institución:** IDAT  
**Año:** 2025  

---

## 📚 Licencia

Este proyecto se desarrolló con fines **educativos y académicos**.  
El código puede ser reutilizado con fines didácticos mencionando la autoría correspondiente.
