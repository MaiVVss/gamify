# Gamify Your Life 🎮

Transforma tu vida en un juego épico con esta aplicación de gamificación personal. Desarrollada con React y Tailwind CSS, optimizada para ADHD con colores vibrantes, animaciones suaves y feedback visual inmediato.

## ✨ Características Principales

### 🏆 Sistema de Progreso
- **Niveles y XP**: Sube de nivel completando tareas y hábitos
- **Sistema de Coins**: Gana monedas para canjear recompensas
- **Rachas**: Mantén tu motivación con seguimiento de días consecutivos
- **Logros**: Desbloquea logros especiales por tus metas alcanzadas

### 📋 Dashboard Principal
- Estadísticas en tiempo real (racha, tareas completadas, metas, XP)
- Vista previa de las 6 áreas de vida principales
- Actividad reciente con timeline visual
- Resumen semanal interactivo

### 🎯 6 Áreas de Vida
1. **Salud & Bienestar** (75%) - ❤️
2. **Carrera & Profesión** (60%) - 💼
3. **Relaciones Sociales** (80%) - 👥
4. **Desarrollo Personal** (90%) - 🧠
5. **Finanzas** (55%) - 💰
6. **Hogar & Entorno** (70%) - 🏠

Cada área con:
- Sistema de niveles (Novato → Principiante → Intermedio → Experto → Maestro)
- Barras de progreso animadas
- Control manual de progreso
- Logros desbloqueables

### ✅ Sistema de Tareas
- **Prioridades** con códigos de color (rojo/amarillo/verde)
- **Recompensas de XP** por tarea completada
- **Búsqueda y filtros** en tiempo real
- **Modal detallado** para crear tareas
- **Fecha límite** opcional
- **Feedback visual** inmediato al completar

### 🔥 Hábitos Diarios
- **Categorías de áreas de vida** con colores distintivos
- **Sistema de dificultad** (Fácil/Medio/Difícil/Extremo)
- **Recompensas automáticas** basadas en dificultad
- **Seguimiento de rachas** con emojis 🔥
- **Estadísticas detalladas**:
  - Tasa de completación con anillo visual
  - Total de completaciones
  - Rachas con bonificaciones especiales
- **8 hábitos de ejemplo** preconfigurados

### 🎁 Sistema de Recompensas
- **Recompensas personalizables** con iconos y colores
- **Sistema de canje** con coins
- **Barra de progreso** visual para cada recompensa
- **Recompensas recomendadas** basadas en tus coins disponibles
- **Historial de recompensas** canjeadas

### 📅 Calendario Integrado
- **Vista mensual completa** con navegación
- **Indicadores de eventos** (metas, eventos, recompensas)
- **Resumen diario** de actividad
- **Creación de eventos** con diferentes tipos
- **Estadísticas del mes** integradas

## 🎨 Optimización ADHD

### Diseño Visual
- **Colores vibrantes y gradientes** energéticos
- **Animaciones suaves** y microinteracciones
- **Feedback visual inmediato** en todas las acciones
- **Bordes de enfoque amarillos** para accesibilidad
- **Notificaciones animadas** y motivadoras

### Atajos de Teclado
- `Ctrl+N` - Dashboard
- `Ctrl+H` - Hábitos
- `Ctrl+R` - Recompensas
- `Ctrl+T` - Tareas

### UX/UI Features
- **Sidebar fijo** con indicadores visuales
- **Botones flotantes** de acción rápida
- **Modales elegantes** con formularios proper
- **Focus states optimizados**
- **Layout limpio** y espaciado consistente

## 🛠️ Tecnologías

- **React 18** - Framework principal
- **Tailwind CSS** - Estilos y diseño
- **Lucide React** - Iconos
- **date-fns** - Manejo de fechas
- **LocalStorage** - Persistencia de datos

## 🚀 Instalación y Ejecución

1. **Clonar el repositorio**:
```bash
git clone <repository-url>
cd gamify-life
```

2. **Instalar dependencias**:
```bash
npm install
```

3. **Iniciar la aplicación**:
```bash
npm start
```

4. **Abrir en el navegador**:
```
http://localhost:3000
```

## 📱 Estructura del Proyecto

```
src/
├── components/          # Componentes principales
│   ├── Dashboard.js    # Dashboard principal
│   ├── Tasks.js        # Sistema de tareas
│   ├── Habits.js       # Sistema de hábitos
│   ├── LifeAreas.js    # 6 áreas de vida
│   ├── Rewards.js      # Sistema de recompensas
│   ├── Calendar.js     # Calendario integrado
│   ├── Sidebar.js      # Navegación lateral
│   └── NotificationSystem.js # Notificaciones
├── context/            # Contexto de React
│   └── DataContext.js  # Estado global
├── hooks/              # Hooks personalizados
│   └── useLocalStorage.js # Persistencia
├── App.js              # Componente principal
├── index.js            # Punto de entrada
└── index.css           # Estilos globales
```

## 🎮 Cómo Usar

### 1. Configura tus Áreas de Vida
- Ve a "Áreas de Vida" y ajusta tu progreso inicial
- Usa los botones +1/-1 o +5/-5 para actualizar
- Observa cómo subes de nivel automáticamente

### 2. Crea tus Tareas
- En "Tareas", haz clic en "Nueva Tarea"
- Asigna prioridad, XP y fecha límite
- Márcalas como completadas para ganar recompensas

### 3. Establece Hábitos
- En "Hábitos", crea rutinas diarias
- Elige categoría, dificultad y momento del día
- Mantén las rachas para obtener bonificaciones

### 4. Define Recompensas
- En "Recompensas", crea premios motivadores
- Asigna un costo en coins
- Canjéalas cuando tengas suficientes coins

### 5. Planifica con el Calendario
- Usa el "Calendario" para planificar metas
- Agrega eventos y recompensas futuras
- Revisa tu actividad diaria

## 🏆 Sistema de Niveles

| Nivel | XP Requerido | Título |
|-------|-------------|--------|
| 1 | 0-99 | Novato |
| 2 | 100-199 | Aprendiz |
| 3 | 200-299 | Explorador |
| 4 | 300-399 | Guerrero |
| 5 | 400-499 | Campeón |
| 6+ | 500+ | Leyenda |

## 🔥 Bonificaciones de Racha

- **7 días**: +50 XP + 10 coins
- **30 días**: +200 XP + 50 coins
- **100 días**: +500 XP + 100 coins

## 💡 Tips para Máxima Productividad

1. **Empieza pequeño**: Crea 2-3 hábitos simples
2. **Sé consistente**: Mantén las rachas diarias
3. **Celebra logros**: Canjea recompensas regularmente
4. **Balancea áreas**: Desarrolla todas las 6 áreas de vida
5. **Revisa progreso**: Usa el dashboard diariamente

## 🤝 Contribuciones

Las contribuciones son bienvenidas. Por favor:

1. Fork el proyecto
2. Crea una feature branch
3. Commit tus cambios
4. Push al branch
5. Abre un Pull Request

## 📄 Licencia

Este proyecto está bajo la Licencia MIT.

## 🌟 Créditos

Desarrollado con ❤️ para ayudarte a transformar tu vida en una aventura épica.

---

**¡Transforma tu vida, conquista tus metas, conviértete en leyenda! 🚀**
