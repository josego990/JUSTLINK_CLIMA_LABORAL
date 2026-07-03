# Prompt para Codex Backend: Evaluaciones de desempeño

Trabaja sobre el backend Node.js existente de Justlink. Antes de modificar código, revisa su arquitectura, framework HTTP, acceso a SQL Server, validadores, middleware de autenticación, manejo de errores, convenciones de respuestas, pruebas y organización de rutas. Conserva esas convenciones y no introduzcas un framework paralelo.

## Contexto

Debes implementar la API REST del módulo de evaluaciones de desempeño usando:

- `src/assets/data/des_modelo_evaluacion.sql`: tablas `DES_`, catálogos, validación y vista de detalle.
- `src/assets/data/des_catalogos_procedimientos.sql`: procedimientos para obtener catálogos, escalas y puestos.
- Tabla existente `dbo.Empleados`, cuya PK es `Id` y contiene `IdOrganizacion`, `Cargo`, `Email`, `estado` e `IdEmpleadoJefe`.
- Tabla existente `dbo.Organizaciones`, cuya PK es `Id`.
- Prefijo de rutas existente: `/api/desempeno`.

Los modelos soportan:

- Tipos 90, 180, 360, autoevaluación y mixto.
- Escenarios activables y ponderados.
- Dimensiones globales.
- Puestos participantes o marcados como `soloEvaluador`.
- Criterios e ítems independientes por puesto y escenario.
- Escalas Likert y preguntas abiertas.
- Duplicación de criterios o ítems entre puestos.
- Generación jerárquica de asignaciones mediante `Empleados.IdEmpleadoJefe`.

## Reglas generales

1. Usa consultas parametrizadas o procedimientos almacenados. Nunca concatenes valores recibidos en SQL.
2. Obtén `IdOrganizacion` del contexto autenticado cuando el backend ya disponga de él. Si también llega por query/body, valida que pertenezca al usuario.
3. Usa transacciones para guardar un modelo completo, duplicarlo, crear una evaluación y generar asignaciones.
4. Ante un error, haz rollback y usa el formato de error existente del backend.
5. No elimines físicamente modelos o evaluaciones utilizadas. Cambia `Activo` o el estado correspondiente.
6. No permitas modificar la estructura de una versión de modelo que ya tenga evaluaciones iniciadas. Crea una nueva versión.
7. Convierte `BIT` a boolean y valores `DECIMAL` a number en las respuestas JSON.
8. Conserva `codigo` como identificador funcional y `id` como PK.
9. Todas las listas deben tener orden determinista.
10. Agrega validación de esquema con la librería que ya use el proyecto. Si no existe, utiliza Zod o Joi, eligiendo solo una.
11. Agrega pruebas de servicios/controladores para casos exitosos, validaciones, permisos y rollback.
12. No confíes en nombres de puestos, escenarios, escalas o estados enviados por el cliente; resuelve y persiste sus IDs.

## Formato de respuesta

Respeta el formato ya usado por el backend. Si no existe uno uniforme, usa:

```json
{
  "ok": true,
  "data": {},
  "message": null
}
```

Para errores:

```json
{
  "ok": false,
  "data": null,
  "message": "Mensaje entendible",
  "code": "CODIGO_ESTABLE",
  "details": []
}
```

## Endpoints prioritarios

### 1. Catálogos

#### `GET /api/desempeno/catalogos`

Query:

- `idOrganizacion`: opcional si se obtiene del usuario autenticado.
- `soloActivos`: opcional, default `true`.
- `incluirPuestos`: opcional, default `true`.
- `incluirValoresEscala`: opcional, default `true`.

Ejecuta `dbo.DES_sp_Catalogos_ObtenerJson` y parsea `DataJson`.

Respuesta:

```json
{
  "tiposModelo": [],
  "estadosModelo": [],
  "estadosEvaluacion": [],
  "tiposItem": [],
  "escenarios": [],
  "metodosCalculo": [],
  "canalesEnvio": [],
  "estadosAsignacion": [],
  "estadosRespuesta": [],
  "escalas": [],
  "puestos": []
}
```

#### `GET /api/desempeno/catalogos/tipos-modelo/:codigo/escenarios`

Ejecuta `dbo.DES_sp_TipoModeloEscenarios_Listar`.

#### `GET /api/desempeno/escalas`

Query: `idOrganizacion`, `soloActivos`, `buscar`.

Ejecuta `dbo.DES_sp_Escalas_Listar`.

#### `GET /api/desempeno/escalas/:id`

Ejecuta `dbo.DES_sp_Escalas_Obtener`.
Combina el primer recordset con `valores` del segundo.
Pasa siempre el `IdOrganizacion` autorizado al procedimiento.

#### `GET /api/desempeno/escalas/:id/valores`

Ejecuta `dbo.DES_sp_EscalaValores_Listar`.
Pasa siempre el `IdOrganizacion` autorizado al procedimiento.

#### `GET /api/desempeno/puestos`

Query: `idOrganizacion`, `soloActivos`, `buscar`.

Ejecuta `dbo.DES_sp_Puestos_Listar`.

#### `GET /api/desempeno/puestos/:id/empleados`

Query: `soloActivos`, `buscar`.

Ejecuta `dbo.DES_sp_Puestos_ObtenerEmpleados`.
Pasa siempre el `IdOrganizacion` autorizado al procedimiento.

### 2. Modelos

#### `GET /api/desempeno/modelos`

Query:

- `idOrganizacion`
- `estado`
- `tipo`
- `activo`
- `buscar`
- `pagina`
- `limite`

Devuelve resumen del modelo, versión, tipo, estado, escala, cantidad de dimensiones, puestos, escenarios activos, criterios e ítems.

#### `GET /api/desempeno/modelos/:id`

Devuelve el modelo completo en la estructura usada por el frontend:

```json
{
  "id": 1,
  "organizacionId": 29,
  "codigo": "MOD-360-GERENCIAL",
  "version": 1,
  "nombre": "Evaluación 360 gerencial",
  "descripcion": "...",
  "tipoModelo": {
    "id": 3,
    "codigo": "360",
    "nombre": "Evaluación 360 grados"
  },
  "estado": {
    "id": 2,
    "codigo": "ACTIVO",
    "nombre": "Activo"
  },
  "escalaPredeterminadaId": 1,
  "metodoCalculoId": 1,
  "usaPonderacion": true,
  "usaAnonimato": true,
  "minimoRespuestasAnonimas": 3,
  "dimensiones": [],
  "escenarios": [],
  "puestos": []
}
```

Cada puesto debe incluir sus escenarios. Cada escenario debe incluir dimensiones, criterios e ítems. Incluye valores de escala cuando sean necesarios para editar.

#### `POST /api/desempeno/modelos`

Guarda el modelo completo en una sola transacción.

Payload recomendado:

```json
{
  "organizacionId": 29,
  "codigo": "MOD-360-GERENCIAL",
  "version": 1,
  "nombre": "Evaluación de Desempeño 360 Gerencial",
  "descripcion": "...",
  "tipoModeloId": 3,
  "estadoModeloId": 1,
  "escalaPredeterminadaId": 1,
  "metodoCalculoId": 1,
  "usaPonderacion": true,
  "usaAnonimato": true,
  "minimoRespuestasAnonimas": 3,
  "dimensiones": [
    {
      "codigo": "OBJETIVOS",
      "nombre": "Objetivos",
      "descripcion": "...",
      "ponderacion": 45,
      "orden": 1
    }
  ],
  "escenarios": [
    {
      "escenarioId": 1,
      "ponderacion": 60,
      "esAnonimo": false,
      "minimoRespuestasAnonimas": null,
      "orden": 1,
      "activo": true
    }
  ],
  "puestos": [
    {
      "puestoId": 10,
      "soloEvaluador": false,
      "orden": 1,
      "escenarios": [
        {
          "escenarioId": 1,
          "ponderacion": 60,
          "orden": 1,
          "criteriosPorDimension": [
            {
              "dimensionCodigo": "OBJETIVOS",
              "criterios": [
                {
                  "codigo": "CUMPLIMIENTO_METAS",
                  "nombre": "Cumplimiento de metas",
                  "descripcion": "...",
                  "ponderacion": 100,
                  "nivelExigencia": 3,
                  "tipoItemPredeterminadoId": 1,
                  "escalaPredeterminadaId": 1,
                  "orden": 1,
                  "items": [
                    {
                      "codigo": "OBJ-001",
                      "texto": "Cumple los objetivos acordados.",
                      "tipoItemId": 1,
                      "escalaId": 1,
                      "requerido": true,
                      "permiteNoAplica": false,
                      "orden": 1
                    }
                  ]
                }
              ]
            }
          ]
        }
      ]
    }
  ]
}
```

Validaciones antes del commit:

- La organización existe.
- Tipo, estado, escala y método están activos.
- El código y versión no se repiten en la organización.
- Los puestos pertenecen a la organización.
- Las dimensiones activas suman 100 cuando usa ponderación.
- Los escenarios globales activos suman 100.
- Los escenarios activos de cada puesto evaluado suman 100.
- Un puesto `soloEvaluador` no debe contener criterios ni ítems.
- Cada dimensión de cada puesto/escenario evaluado tiene criterios.
- Los criterios activos por dimensión suman 100.
- Cada criterio tiene al menos un ítem.
- El nivel de exigencia está dentro de la escala efectiva.
- Los ítems que usan escala tienen escala efectiva.
- Orden e IDs no están duplicados dentro de su padre.

Después de insertar, ejecuta `dbo.DES_sp_ValidarModelo`. Si devuelve errores, haz rollback y responde HTTP 422.

#### `PUT /api/desempeno/modelos/:id`

Actualiza en transacción una versión editable. No hagas reemplazos parciales que dejen hijos huérfanos.

Usa estrategia de sincronización:

- Actualiza registros con ID.
- Inserta registros nuevos sin ID.
- Marca `Activo = 0` los hijos eliminados.
- No reutilices IDs entre puestos o escenarios.

#### `POST /api/desempeno/modelos/:id/duplicar`

Body:

```json
{
  "codigo": "MOD-360-GERENCIAL-2027",
  "nombre": "Evaluación 360 gerencial 2027",
  "version": 1
}
```

Copia toda la jerarquía en una transacción. Al copiar criterios e ítems, llena `IdCriterioOrigen` e `IdItemOrigen`.

#### `POST /api/desempeno/modelos/:id/nueva-version`

Crea una copia con el mismo `codigo`, incrementa `version` y deja el estado `BORRADOR`.

#### `POST /api/desempeno/modelos/:id/validar`

Ejecuta `dbo.DES_sp_ValidarModelo` y devuelve:

```json
{
  "esValido": false,
  "cantidadErrores": 2,
  "errores": [
    {
      "codigo": "PONDERACION_ESCENARIOS",
      "mensaje": "..."
    }
  ]
}
```

#### `PATCH /api/desempeno/modelos/:id/estado`

Body: `{ "estadoCodigo": "ACTIVO" }`.

Para activar/publicar:

- Ejecuta la validación.
- Rechaza con 422 si hay errores.
- Registra `FechaPublicacion`.

### 3. Operaciones de duplicación dentro del editor

#### `POST /api/desempeno/modelos/:id/criterios/:criterioId/duplicar`

Body:

```json
{
  "destinos": [
    {
      "puestoId": 11,
      "escenarioId": 1,
      "dimensionId": 20
    }
  ]
}
```

Crea copias independientes del criterio y sus ítems. Llena `IdCriterioOrigen` e `IdItemOrigen`. No sobrescribas contenido existente con el mismo código; devuelve los destinos omitidos.

#### `POST /api/desempeno/modelos/:id/items/:itemId/duplicar`

Body igual al anterior. Si el criterio destino no existe, permite crearlo solo cuando el frontend envíe `crearCriterioSiNoExiste: true`.

### 4. Evaluaciones

#### `GET /api/desempeno/evaluaciones`

Filtros: `idOrganizacion`, `estado`, `modeloId`, `buscar`, `fechaDesde`, `fechaHasta`, paginación.

Incluye métricas:

- Total participantes.
- Total asignaciones.
- Pendientes.
- En proceso.
- Respondidas.
- Errores de envío.
- Porcentaje de avance.

#### `GET /api/desempeno/evaluaciones/:id`

Devuelve cabecera, modelo usado, fechas, estado, participantes y resumen de asignaciones.

#### `POST /api/desempeno/evaluaciones`

Body:

```json
{
  "organizacionId": 29,
  "modeloId": 1,
  "nombre": "Evaluación de Desempeño 2026 - Primer Semestre",
  "descripcion": "...",
  "fechaInicio": "2026-06-01",
  "fechaCierre": "2026-06-30",
  "participanteIds": [3585, 3586, 3587, 3588]
}
```

En una transacción:

1. Verifica que el modelo esté activo y validado.
2. Verifica que todos los empleados pertenezcan a la organización.
3. Crea `DES_Evaluacion`.
4. Guarda el JSON completo del modelo en `JsonConfiguracionSnapshot`.
5. Inserta `DES_EvaluacionParticipante` guardando cargo, correo, puesto y jefe como snapshot.
6. Marca como `EsEvaluador = 1, EsEvaluado = 0` los puestos `soloEvaluador`.
7. No generes asignaciones todavía salvo que `generarAsignaciones` sea `true`.

#### `PUT /api/desempeno/evaluaciones/:id`

Permite editar cabecera, fechas y participantes solo en estado `BORRADOR` o `PROGRAMADA` y antes de recibir respuestas.

#### `POST /api/desempeno/evaluaciones/:id/generar-asignaciones`

Genera relaciones evaluador/evaluado según escenarios activos:

- `BOSS_TO_EMPLOYEE`: jefe directo evalúa al colaborador.
- `EMPLOYEE_TO_BOSS`: colaborador evalúa al jefe directo.
- `SELF`: empleado se evalúa a sí mismo.
- `PEER`: empleados con al menos un mismo jefe directo se evalúan entre sí.

Reglas:

- Usa el snapshot de participantes, no la tabla viva cuando la evaluación ya fue creada.
- Los puestos `soloEvaluador` pueden evaluar, pero no ser evaluados.
- No dupliques la combinación evaluación, puesto/escenario, evaluador y evaluado.
- No generes asignaciones para escenarios globales o del puesto inactivos.
- La configuración aplicable se determina por el puesto del evaluado.
- Ejecuta todo en transacción y devuelve totales por escenario.

#### `GET /api/desempeno/evaluaciones/:id/asignaciones`

Filtros: evaluador, evaluado, escenario, estado, canal, buscar y paginación.

#### `POST /api/desempeno/evaluaciones/:id/enviar`

Body:

```json
{
  "asignacionIds": [1, 2, 3],
  "canalCodigo": "CORREO"
}
```

Registra cada intento en `DES_EnvioEvaluacion`. La comunicación externa debe ejecutarse fuera de la transacción de persistencia o mediante la cola existente. Actualiza estado e intento sin perder historial.

#### `POST /api/desempeno/evaluaciones/:id/reenviar`

Permite reenviar pendientes o errores. No reenvíes asignaciones respondidas o anuladas.

#### `PATCH /api/desempeno/evaluaciones/:id/estado`

Transiciones permitidas:

- `BORRADOR -> PROGRAMADA`
- `PROGRAMADA -> EN_CURSO`
- `EN_CURSO -> CERRADA`
- `BORRADOR|PROGRAMADA -> CANCELADA`

No permitas reabrir una evaluación cerrada sin una operación administrativa explícita y auditada.

### 5. Formulario de respuesta

Estas rutas pueden autenticarse mediante `TokenAcceso`, sin exponer IDs sensibles.

#### `GET /api/desempeno/respuestas/token/:token`

Devuelve:

- Evaluación.
- Evaluador y evaluado.
- Escenario.
- Dimensiones, criterios e ítems aplicables.
- Escalas y opciones.
- Progreso y respuestas existentes.

No expongas la identidad de otros evaluadores cuando el escenario sea anónimo.

#### `PUT /api/desempeno/respuestas/token/:token`

Guarda borrador idempotente:

```json
{
  "respuestas": [
    {
      "itemId": 100,
      "escalaValorId": 5,
      "valorNumero": null,
      "valorTexto": null,
      "noAplica": false,
      "opcionIds": []
    }
  ]
}
```

Valida que cada ítem pertenezca a la configuración de la asignación y que el valor pertenezca a la escala efectiva.

#### `POST /api/desempeno/respuestas/token/:token/finalizar`

Valida todos los ítems requeridos, marca respuesta y asignación como finalizadas y registra `FechaRespuesta`.

### 6. Resultados

#### `GET /api/desempeno/evaluaciones/:id/resultados`

Devuelve resumen general y avance. No publiques resultados anónimos de un escenario hasta alcanzar `MinimoRespuestasAnonimas`.

#### `GET /api/desempeno/evaluaciones/:id/resultados/empleados/:empleadoId`

Devuelve:

- Resultado total.
- Resultado por dimensión.
- Resultado por criterio.
- Resultado por escenario.
- Nivel de exigencia esperado y diferencia.
- Comentarios abiertos, agrupados y anonimizados cuando corresponda.

Aplica:

1. Promedio de ítems del criterio.
2. Ponderación de criterios dentro de dimensión.
3. Ponderación de dimensiones.
4. Ponderación de escenarios activos del puesto.

No mezcles ítems abiertos en el cálculo numérico.

### 7. Endpoints auxiliares recomendados

- `GET /api/desempeno/modelos/:id/uso`: evaluaciones que usan la versión.
- `GET /api/desempeno/evaluaciones/:id/participantes`.
- `PUT /api/desempeno/evaluaciones/:id/participantes`.
- `GET /api/desempeno/evaluaciones/:id/preview-asignaciones`: calcula sin persistir.
- `GET /api/desempeno/evaluaciones/:id/envios`.
- `GET /api/desempeno/evaluaciones/:id/exportar`: dejar interfaz preparada aunque la exportación se implemente después.

## Procedimientos adicionales que debe crear el backend

Crea un archivo SQL separado para procedimientos de escritura y lectura de negocio. Como mínimo:

- `DES_sp_Modelos_Listar`
- `DES_sp_Modelos_Obtener`
- `DES_sp_Modelos_Guardar`
- `DES_sp_Modelos_Duplicar`
- `DES_sp_Modelos_CambiarEstado`
- `DES_sp_Evaluaciones_Listar`
- `DES_sp_Evaluaciones_Obtener`
- `DES_sp_Evaluaciones_Crear`
- `DES_sp_Evaluaciones_GuardarParticipantes`
- `DES_sp_Evaluaciones_GenerarAsignaciones`
- `DES_sp_Asignaciones_Listar`
- `DES_sp_Respuestas_ObtenerPorToken`
- `DES_sp_Respuestas_GuardarBorrador`
- `DES_sp_Respuestas_Finalizar`
- `DES_sp_Resultados_ObtenerEmpleado`

Para guardar estructuras jerárquicas, prefiere:

- TVP tipados si la capa SQL del proyecto los maneja correctamente, o
- un parámetro JSON validado con `ISJSON`, `OPENJSON ... WITH` y transacción.

No hagas decenas de llamadas SQL desde Node para guardar un único modelo.

## Entregables

1. Migración o script SQL con los procedimientos faltantes.
2. Rutas, controladores y servicios.
3. Validadores de request.
4. Mapeadores de filas SQL a JSON.
5. Manejo transaccional y de errores SQL.
6. Pruebas automatizadas.
7. Colección Postman/Bruno o archivo HTTP con ejemplos.
8. Documentación breve de variables de entorno y forma de ejecutar.
9. Resumen de endpoints implementados y pendientes.

Implementa primero catálogos y CRUD completo de modelos. Después implementa evaluaciones, asignaciones y respuestas. No dejes rutas simuladas ni respuestas hardcodeadas.
