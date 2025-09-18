# Ejemplo DDD Universidad en TypeScript: Inscripción a Materia y Correlativas

## 1. Contexto del Dominio

- **Entidad:** Alumno
- **Entidad:** Materia
- **Entidad:** Inscripción
- **Conceptos de Dominio:** Correlativas, Materias aprobadas, Materias en curso

---

## 2. Modelado básico en TypeScript

```typescript name=universidad/domain.ts
// Estado de la inscripción
export enum EstadoInscripcion {
  Aprobada = "Aprobada",
  Condicional = "Condicional",
  Rechazada = "Rechazada",
}

export class Materia {
  constructor(
    public id: string,
    public nombre: string,
    public correlativas: Materia[] = []
  ) {}
}

export class Inscripcion {
  constructor(
    public materia: Materia,
    public estado: EstadoInscripcion,
    public mensaje: string
  ) {}
}

export class Alumno {
  constructor(
    public materiasAprobadas: Materia[] = [],
    public materiasEnCurso: Materia[] = []
  ) {}

  // Lógica de inscripción a materia considerando correlativas
  inscribirse(materiaDestino: Materia): Inscripcion {
    const idsAprobadas = this.materiasAprobadas.map((m) => m.id);
    const idsEnCurso = this.materiasEnCurso.map((m) => m.id);

    const correlativasFaltantes = materiaDestino.correlativas.filter(
      (corr) => !idsAprobadas.includes(corr.id)
    );

    if (correlativasFaltantes.length === 0) {
      return new Inscripcion(
        materiaDestino,
        EstadoInscripcion.Aprobada,
        "Inscripción aprobada: cumple correlativas."
      );
    }

    // Duda: ¿qué hacer si falta alguna correlativa?
    // Aquí surge la consulta al cliente.
    return new Inscripcion(
      materiaDestino,
      EstadoInscripcion.Rechazada,
      `No cumple con correlativas: ${correlativasFaltantes
        .map((m) => m.nombre)
        .join(", ")}`
    );
  }
}
```

---

## 3. Planteo de Issue al Cliente (usando lenguaje DDD)

> **Desarrollador:**  
> _En el contexto de la inscripción a materias, cuando un **Alumno** intenta inscribirse a una **Materia** pero no tiene todas las **correlativas** aprobadas, ¿debe bloquearse la inscripción? ¿O existe la posibilidad de inscribirse de manera condicional si está cursando alguna correlativa actualmente?_

---

## 4. Respuesta del Cliente

> **Cliente:**  
> _“Si el alumno está cursando actualmente la última correlativa, puede inscribirse de manera **condicional**. Si no, la inscripción debe ser rechazada. En el caso condicional, debe notificarse al alumno que la inscripción depende de aprobar la correlativa en curso.”_

---

## 5. Refactor en el Modelo según la Respuesta

```typescript name=universidad/domain.ts
// ... (mantener el mismo código anterior)

  inscribirse(
    materiaDestino: Materia
  ): Inscripcion {
    const idsAprobadas = this.materiasAprobadas.map(m => m.id);
    const idsEnCurso = this.materiasEnCurso.map(m => m.id);

    const correlativasFaltantes = materiaDestino.correlativas.filter(
      corr => !idsAprobadas.includes(corr.id)
    );

    if (correlativasFaltantes.length === 0) {
      return new Inscripcion(
        materiaDestino,
        EstadoInscripcion.Aprobada,
        "Inscripción aprobada: cumple correlativas."
      );
    }

    // Nuevo: Permitir inscripción condicional si solo falta una y la está cursando
    if (
      correlativasFaltantes.length === 1 &&
      idsEnCurso.includes(correlativasFaltantes[0].id)
    ) {
      return new Inscripcion(
        materiaDestino,
        EstadoInscripcion.Condicional,
        `Inscripción condicional: debe aprobar la correlativa "${correlativasFaltantes[0].nombre}" antes de rendir "${materiaDestino.nombre}".`
      );
    }

    return new Inscripcion(
      materiaDestino,
      EstadoInscripcion.Rechazada,
      `No cumple con correlativas: ${correlativasFaltantes.map(m => m.nombre).join(", ")}`
    );
  }
```

---

## 6. Resumen del Flujo Ágil con DDD

1. El desarrollador detecta la **duda usando términos del dominio** y lo consulta con el cliente.
2. El cliente responde, **usando el mismo lenguaje ubicuo**.
3. El modelo se adapta fácilmente y **la lógica queda clara y documentada**.

---

## 7. Ejemplo Visual Comparando los Enfoques (DDD vs Repository/Service)

<img width="1150" height="301" alt="image" src="https://github.com/user-attachments/assets/660bd5ff-9d35-422f-973a-7f1c81cf6e4f" />

---

> **Este ejemplo muestra cómo DDD facilita la comunicación y la evolución ágil del software, logrando soluciones alineadas con el negocio y fácilmente auditables.**
