/*
    Modulo de evaluaciones de desempeno
    Prefijo de objetos: DES_

    Requisitos:
      - dbo.Organizaciones(Id)
      - dbo.Empleados(Id, IdOrganizacion, Cargo, Email, IdEmpleadoJefe, estado)

    Criterios de diseno:
      - El modelo se versiona y no depende de nombres para relacionar entidades.
      - Los escenarios y sus ponderaciones pueden variar por puesto.
      - Los criterios e items pertenecen a una combinacion puesto/escenario/dimension.
      - La evaluacion guarda una fotografia de participantes y asignaciones.
      - muestraColaboradores, participantes.demograficos e
        itemsEvaluativosAbiertosEjemplo son datos derivados y no se persisten.

    El script no incluye USE para evitar ejecutarlo accidentalmente en otra base.
*/

SET NOCOUNT ON;
SET XACT_ABORT ON;
GO

/* ============================================================
   1. Catalogos
   
   ============================================================ */

IF OBJECT_ID(N'dbo.DES_CatTipoModelo', N'U') IS NULL
BEGIN
    CREATE TABLE dbo.DES_CatTipoModelo (
        IdTipoModelo       SMALLINT IDENTITY(1,1) NOT NULL,
        Codigo             NVARCHAR(30) NOT NULL,
        Nombre             NVARCHAR(100) NOT NULL,
        Descripcion        NVARCHAR(300) NULL,
        Orden              SMALLINT NOT NULL CONSTRAINT DF_DES_CatTipoModelo_Orden DEFAULT (1),
        Activo             BIT NOT NULL CONSTRAINT DF_DES_CatTipoModelo_Activo DEFAULT (1),
        CONSTRAINT PK_DES_CatTipoModelo PRIMARY KEY CLUSTERED (IdTipoModelo),
        CONSTRAINT UQ_DES_CatTipoModelo_Codigo UNIQUE (Codigo)
    );
END
GO

IF OBJECT_ID(N'dbo.DES_CatEstadoModelo', N'U') IS NULL
BEGIN
    CREATE TABLE dbo.DES_CatEstadoModelo (
        IdEstadoModelo     SMALLINT IDENTITY(1,1) NOT NULL,
        Codigo             NVARCHAR(30) NOT NULL,
        Nombre             NVARCHAR(100) NOT NULL,
        Orden              SMALLINT NOT NULL CONSTRAINT DF_DES_CatEstadoModelo_Orden DEFAULT (1),
        Activo             BIT NOT NULL CONSTRAINT DF_DES_CatEstadoModelo_Activo DEFAULT (1),
        CONSTRAINT PK_DES_CatEstadoModelo PRIMARY KEY CLUSTERED (IdEstadoModelo),
        CONSTRAINT UQ_DES_CatEstadoModelo_Codigo UNIQUE (Codigo)
    );
END
GO

IF OBJECT_ID(N'dbo.DES_CatEstadoEvaluacion', N'U') IS NULL
BEGIN
    CREATE TABLE dbo.DES_CatEstadoEvaluacion (
        IdEstadoEvaluacion SMALLINT IDENTITY(1,1) NOT NULL,
        Codigo             NVARCHAR(30) NOT NULL,
        Nombre             NVARCHAR(100) NOT NULL,
        Orden              SMALLINT NOT NULL CONSTRAINT DF_DES_CatEstadoEvaluacion_Orden DEFAULT (1),
        Activo             BIT NOT NULL CONSTRAINT DF_DES_CatEstadoEvaluacion_Activo DEFAULT (1),
        CONSTRAINT PK_DES_CatEstadoEvaluacion PRIMARY KEY CLUSTERED (IdEstadoEvaluacion),
        CONSTRAINT UQ_DES_CatEstadoEvaluacion_Codigo UNIQUE (Codigo)
    );
END
GO

IF OBJECT_ID(N'dbo.DES_CatTipoItem', N'U') IS NULL
BEGIN
    CREATE TABLE dbo.DES_CatTipoItem (
        IdTipoItem         SMALLINT IDENTITY(1,1) NOT NULL,
        Codigo             NVARCHAR(40) NOT NULL,
        Nombre             NVARCHAR(100) NOT NULL,
        UsaEscala          BIT NOT NULL CONSTRAINT DF_DES_CatTipoItem_UsaEscala DEFAULT (0),
        PermiteTexto       BIT NOT NULL CONSTRAINT DF_DES_CatTipoItem_PermiteTexto DEFAULT (0),
        PermiteSeleccionMultiple BIT NOT NULL
            CONSTRAINT DF_DES_CatTipoItem_PermiteSeleccionMultiple DEFAULT (0),
        Orden              SMALLINT NOT NULL CONSTRAINT DF_DES_CatTipoItem_Orden DEFAULT (1),
        Activo             BIT NOT NULL CONSTRAINT DF_DES_CatTipoItem_Activo DEFAULT (1),
        CONSTRAINT PK_DES_CatTipoItem PRIMARY KEY CLUSTERED (IdTipoItem),
        CONSTRAINT UQ_DES_CatTipoItem_Codigo UNIQUE (Codigo)
    );
END
GO

IF OBJECT_ID(N'dbo.DES_CatEscenario', N'U') IS NULL
BEGIN
    CREATE TABLE dbo.DES_CatEscenario (
        IdEscenario        SMALLINT IDENTITY(1,1) NOT NULL,
        Codigo             NVARCHAR(40) NOT NULL,
        Nombre             NVARCHAR(120) NOT NULL,
        Descripcion        NVARCHAR(300) NULL,
        Orden              SMALLINT NOT NULL CONSTRAINT DF_DES_CatEscenario_Orden DEFAULT (1),
        Activo             BIT NOT NULL CONSTRAINT DF_DES_CatEscenario_Activo DEFAULT (1),
        CONSTRAINT PK_DES_CatEscenario PRIMARY KEY CLUSTERED (IdEscenario),
        CONSTRAINT UQ_DES_CatEscenario_Codigo UNIQUE (Codigo)
    );
END
GO

IF OBJECT_ID(N'dbo.DES_CatMetodoCalculo', N'U') IS NULL
BEGIN
    CREATE TABLE dbo.DES_CatMetodoCalculo (
        IdMetodoCalculo    SMALLINT IDENTITY(1,1) NOT NULL,
        Codigo             NVARCHAR(40) NOT NULL,
        Nombre             NVARCHAR(120) NOT NULL,
        Descripcion        NVARCHAR(300) NULL,
        Activo             BIT NOT NULL CONSTRAINT DF_DES_CatMetodoCalculo_Activo DEFAULT (1),
        CONSTRAINT PK_DES_CatMetodoCalculo PRIMARY KEY CLUSTERED (IdMetodoCalculo),
        CONSTRAINT UQ_DES_CatMetodoCalculo_Codigo UNIQUE (Codigo)
    );
END
GO

IF OBJECT_ID(N'dbo.DES_CatCanalEnvio', N'U') IS NULL
BEGIN
    CREATE TABLE dbo.DES_CatCanalEnvio (
        IdCanalEnvio       SMALLINT IDENTITY(1,1) NOT NULL,
        Codigo             NVARCHAR(30) NOT NULL,
        Nombre             NVARCHAR(100) NOT NULL,
        Activo             BIT NOT NULL CONSTRAINT DF_DES_CatCanalEnvio_Activo DEFAULT (1),
        CONSTRAINT PK_DES_CatCanalEnvio PRIMARY KEY CLUSTERED (IdCanalEnvio),
        CONSTRAINT UQ_DES_CatCanalEnvio_Codigo UNIQUE (Codigo)
    );
END
GO

IF OBJECT_ID(N'dbo.DES_CatEstadoAsignacion', N'U') IS NULL
BEGIN
    CREATE TABLE dbo.DES_CatEstadoAsignacion (
        IdEstadoAsignacion SMALLINT IDENTITY(1,1) NOT NULL,
        Codigo             NVARCHAR(30) NOT NULL,
        Nombre             NVARCHAR(100) NOT NULL,
        EsFinal            BIT NOT NULL CONSTRAINT DF_DES_CatEstadoAsignacion_EsFinal DEFAULT (0),
        Orden              SMALLINT NOT NULL CONSTRAINT DF_DES_CatEstadoAsignacion_Orden DEFAULT (1),
        Activo             BIT NOT NULL CONSTRAINT DF_DES_CatEstadoAsignacion_Activo DEFAULT (1),
        CONSTRAINT PK_DES_CatEstadoAsignacion PRIMARY KEY CLUSTERED (IdEstadoAsignacion),
        CONSTRAINT UQ_DES_CatEstadoAsignacion_Codigo UNIQUE (Codigo)
    );
END
GO

IF OBJECT_ID(N'dbo.DES_CatEstadoRespuesta', N'U') IS NULL
BEGIN
    CREATE TABLE dbo.DES_CatEstadoRespuesta (
        IdEstadoRespuesta  SMALLINT IDENTITY(1,1) NOT NULL,
        Codigo             NVARCHAR(30) NOT NULL,
        Nombre             NVARCHAR(100) NOT NULL,
        EsFinal            BIT NOT NULL CONSTRAINT DF_DES_CatEstadoRespuesta_EsFinal DEFAULT (0),
        Orden              SMALLINT NOT NULL CONSTRAINT DF_DES_CatEstadoRespuesta_Orden DEFAULT (1),
        Activo             BIT NOT NULL CONSTRAINT DF_DES_CatEstadoRespuesta_Activo DEFAULT (1),
        CONSTRAINT PK_DES_CatEstadoRespuesta PRIMARY KEY CLUSTERED (IdEstadoRespuesta),
        CONSTRAINT UQ_DES_CatEstadoRespuesta_Codigo UNIQUE (Codigo)
    );
END
GO

/* ============================================================
   2. Semillas de catalogos
   ============================================================ */

INSERT INTO dbo.DES_CatTipoModelo (Codigo, Nombre, Descripcion, Orden)
SELECT v.Codigo, v.Nombre, v.Descripcion, v.Orden
FROM (VALUES
    (N'90',              N'Evaluacion 90 grados',  N'El jefe evalua a sus colaboradores directos.', 1),
    (N'180',             N'Evaluacion 180 grados', N'Incluye evaluacion descendente y ascendente.', 2),
    (N'360',             N'Evaluacion 360 grados', N'Incluye jefe, colaborador, autoevaluacion y pares.', 3),
    (N'AUTOEVALUACION',  N'Autoevaluacion',        N'Cada participante se evalua a si mismo.', 4),
    (N'MIXTA',           N'Modelo mixto',           N'Permite seleccionar escenarios de forma personalizada.', 5)
) v(Codigo, Nombre, Descripcion, Orden)
WHERE NOT EXISTS (
    SELECT 1 FROM dbo.DES_CatTipoModelo c WHERE c.Codigo = v.Codigo
);
GO

INSERT INTO dbo.DES_CatEstadoModelo (Codigo, Nombre, Orden)
SELECT v.Codigo, v.Nombre, v.Orden
FROM (VALUES
    (N'BORRADOR',  N'Borrador', 1),
    (N'ACTIVO',    N'Activo', 2),
    (N'INACTIVO',  N'Inactivo', 3),
    (N'ARCHIVADO', N'Archivado', 4)
) v(Codigo, Nombre, Orden)
WHERE NOT EXISTS (
    SELECT 1 FROM dbo.DES_CatEstadoModelo c WHERE c.Codigo = v.Codigo
);
GO

INSERT INTO dbo.DES_CatEstadoEvaluacion (Codigo, Nombre, Orden)
SELECT v.Codigo, v.Nombre, v.Orden
FROM (VALUES
    (N'BORRADOR',   N'Borrador', 1),
    (N'PROGRAMADA', N'Programada', 2),
    (N'EN_CURSO',   N'En curso', 3),
    (N'CERRADA',    N'Cerrada', 4),
    (N'CANCELADA',  N'Cancelada', 5)
) v(Codigo, Nombre, Orden)
WHERE NOT EXISTS (
    SELECT 1 FROM dbo.DES_CatEstadoEvaluacion c WHERE c.Codigo = v.Codigo
);
GO

INSERT INTO dbo.DES_CatTipoItem (
    Codigo, Nombre, UsaEscala, PermiteTexto, PermiteSeleccionMultiple, Orden
)
SELECT
    v.Codigo, v.Nombre, v.UsaEscala, v.PermiteTexto, v.PermiteSeleccionMultiple, v.Orden
FROM (VALUES
    (N'LIKERT_1_5',      N'Likert de 1 a 5', 1, 0, 0, 1),
    (N'ABIERTA',         N'Respuesta abierta', 0, 1, 0, 2),
    (N'SI_NO',           N'Si o no', 1, 0, 0, 3),
    (N'OPCION_UNICA',    N'Opcion unica', 1, 0, 0, 4),
    (N'OPCION_MULTIPLE', N'Opcion multiple', 1, 0, 1, 5),
    (N'NUMERICA',        N'Respuesta numerica', 0, 0, 0, 6)
) v(Codigo, Nombre, UsaEscala, PermiteTexto, PermiteSeleccionMultiple, Orden)
WHERE NOT EXISTS (
    SELECT 1 FROM dbo.DES_CatTipoItem c WHERE c.Codigo = v.Codigo
);
GO

INSERT INTO dbo.DES_CatEscenario (Codigo, Nombre, Descripcion, Orden)
SELECT v.Codigo, v.Nombre, v.Descripcion, v.Orden
FROM (VALUES
    (N'BOSS_TO_EMPLOYEE', N'Jefe a colaborador', N'El jefe directo evalua al colaborador.', 1),
    (N'EMPLOYEE_TO_BOSS', N'Colaborador a jefe', N'El colaborador evalua a su jefe directo.', 2),
    (N'SELF',             N'Autoevaluacion',      N'El colaborador se evalua a si mismo.', 3),
    (N'PEER',             N'Par',                 N'Colaboradores con el mismo jefe se evaluan entre si.', 4)
) v(Codigo, Nombre, Descripcion, Orden)
WHERE NOT EXISTS (
    SELECT 1 FROM dbo.DES_CatEscenario c WHERE c.Codigo = v.Codigo
);
GO

INSERT INTO dbo.DES_CatMetodoCalculo (Codigo, Nombre, Descripcion)
SELECT v.Codigo, v.Nombre, v.Descripcion
FROM (VALUES
    (N'PROMEDIO_PONDERADO', N'Promedio ponderado',
        N'Aplica las ponderaciones de escenarios, dimensiones y criterios.'),
    (N'PROMEDIO_SIMPLE', N'Promedio simple',
        N'Calcula el promedio de respuestas sin ponderaciones.')
) v(Codigo, Nombre, Descripcion)
WHERE NOT EXISTS (
    SELECT 1 FROM dbo.DES_CatMetodoCalculo c WHERE c.Codigo = v.Codigo
);
GO

INSERT INTO dbo.DES_CatCanalEnvio (Codigo, Nombre)
SELECT v.Codigo, v.Nombre
FROM (VALUES
    (N'CORREO',   N'Correo electronico'),
    (N'WHATSAPP', N'WhatsApp'),
    (N'AMBOS',    N'Correo y WhatsApp')
) v(Codigo, Nombre)
WHERE NOT EXISTS (
    SELECT 1 FROM dbo.DES_CatCanalEnvio c WHERE c.Codigo = v.Codigo
);
GO

INSERT INTO dbo.DES_CatEstadoAsignacion (Codigo, Nombre, EsFinal, Orden)
SELECT v.Codigo, v.Nombre, v.EsFinal, v.Orden
FROM (VALUES
    (N'PENDIENTE',  N'Pendiente', 0, 1),
    (N'ENVIADA',    N'Enviada', 0, 2),
    (N'EN_PROCESO', N'En proceso', 0, 3),
    (N'RESPONDIDA', N'Respondida', 1, 4),
    (N'ERROR',      N'Error', 0, 5),
    (N'ANULADA',    N'Anulada', 1, 6)
) v(Codigo, Nombre, EsFinal, Orden)
WHERE NOT EXISTS (
    SELECT 1 FROM dbo.DES_CatEstadoAsignacion c WHERE c.Codigo = v.Codigo
);
GO

INSERT INTO dbo.DES_CatEstadoRespuesta (Codigo, Nombre, EsFinal, Orden)
SELECT v.Codigo, v.Nombre, v.EsFinal, v.Orden
FROM (VALUES
    (N'BORRADOR',   N'Borrador', 0, 1),
    (N'FINALIZADA', N'Finalizada', 1, 2),
    (N'ANULADA',    N'Anulada', 1, 3)
) v(Codigo, Nombre, EsFinal, Orden)
WHERE NOT EXISTS (
    SELECT 1 FROM dbo.DES_CatEstadoRespuesta c WHERE c.Codigo = v.Codigo
);
GO

/* ============================================================
   3. Escalas y valores de respuesta
   ============================================================ */

IF OBJECT_ID(N'dbo.DES_Escala', N'U') IS NULL
BEGIN
    CREATE TABLE dbo.DES_Escala (
        IdEscala           INT IDENTITY(1,1) NOT NULL,
        IdOrganizacion     INT NULL,
        Codigo             NVARCHAR(50) NOT NULL,
        Nombre             NVARCHAR(150) NOT NULL,
        Descripcion        NVARCHAR(300) NULL,
        ValorMinimo        DECIMAL(9,4) NOT NULL,
        ValorMaximo        DECIMAL(9,4) NOT NULL,
        EsSistema          BIT NOT NULL CONSTRAINT DF_DES_Escala_EsSistema DEFAULT (0),
        Activo             BIT NOT NULL CONSTRAINT DF_DES_Escala_Activo DEFAULT (1),
        FechaCreacion      DATETIME2(0) NOT NULL
            CONSTRAINT DF_DES_Escala_FechaCreacion DEFAULT (SYSDATETIME()),
        CONSTRAINT PK_DES_Escala PRIMARY KEY CLUSTERED (IdEscala),
        CONSTRAINT FK_DES_Escala_Organizaciones
            FOREIGN KEY (IdOrganizacion) REFERENCES dbo.Organizaciones(Id),
        CONSTRAINT UQ_DES_Escala_OrganizacionCodigo UNIQUE (IdOrganizacion, Codigo),
        CONSTRAINT CK_DES_Escala_Rango CHECK (ValorMinimo < ValorMaximo)
    );
END
GO

IF OBJECT_ID(N'dbo.DES_EscalaValor', N'U') IS NULL
BEGIN
    CREATE TABLE dbo.DES_EscalaValor (
        IdEscalaValor      INT IDENTITY(1,1) NOT NULL,
        IdEscala           INT NOT NULL,
        Valor              DECIMAL(9,4) NOT NULL,
        Etiqueta           NVARCHAR(200) NOT NULL,
        Orden              SMALLINT NOT NULL,
        Activo             BIT NOT NULL CONSTRAINT DF_DES_EscalaValor_Activo DEFAULT (1),
        CONSTRAINT PK_DES_EscalaValor PRIMARY KEY CLUSTERED (IdEscalaValor),
        CONSTRAINT FK_DES_EscalaValor_Escala
            FOREIGN KEY (IdEscala) REFERENCES dbo.DES_Escala(IdEscala),
        CONSTRAINT UQ_DES_EscalaValor_Valor UNIQUE (IdEscala, Valor),
        CONSTRAINT UQ_DES_EscalaValor_Orden UNIQUE (IdEscala, Orden)
    );
END
GO

INSERT INTO dbo.DES_Escala (
    IdOrganizacion, Codigo, Nombre, Descripcion, ValorMinimo, ValorMaximo, EsSistema
)
SELECT NULL, v.Codigo, v.Nombre, v.Descripcion, 1, 5, 1
FROM (VALUES
    (N'CUMPLIMIENTO_1_5', N'Cumplimiento',
        N'Nivel de cumplimiento desde No cumple hasta Supera lo esperado.'),
    (N'ACUERDO_1_5', N'Acuerdo',
        N'Nivel de acuerdo desde Totalmente en desacuerdo hasta Totalmente de acuerdo.'),
    (N'SATISFACCION_1_5', N'Satisfaccion',
        N'Nivel de satisfaccion desde Muy insatisfecho hasta Muy satisfecho.'),
    (N'FRECUENCIA_1_5', N'Frecuencia',
        N'Frecuencia desde Nunca hasta Siempre.'),
    (N'IMPORTANCIA_1_5', N'Importancia',
        N'Importancia desde Nada importante hasta Muy importante.'),
    (N'CALIDAD_1_5', N'Calidad',
        N'Calidad desde Mala hasta Excelente.')
) v(Codigo, Nombre, Descripcion)
WHERE NOT EXISTS (
    SELECT 1
    FROM dbo.DES_Escala e
    WHERE e.IdOrganizacion IS NULL
      AND e.Codigo = v.Codigo
);
GO

INSERT INTO dbo.DES_Escala (
    IdOrganizacion, Codigo, Nombre, Descripcion, ValorMinimo, ValorMaximo, EsSistema
)
SELECT NULL, N'SI_NO', N'Si o no', N'Escala binaria para respuestas afirmativas o negativas.', 0, 1, 1
WHERE NOT EXISTS (
    SELECT 1
    FROM dbo.DES_Escala e
    WHERE e.IdOrganizacion IS NULL
      AND e.Codigo = N'SI_NO'
);
GO

DECLARE @EscalasValores TABLE (
    CodigoEscala NVARCHAR(50),
    Valor DECIMAL(9,4),
    Etiqueta NVARCHAR(200),
    Orden SMALLINT
);

INSERT INTO @EscalasValores (CodigoEscala, Valor, Etiqueta, Orden)
VALUES
    (N'CUMPLIMIENTO_1_5', 1, N'No cumple', 1),
    (N'CUMPLIMIENTO_1_5', 2, N'Cumple en nivel bajo', 2),
    (N'CUMPLIMIENTO_1_5', 3, N'Cumple parcialmente', 3),
    (N'CUMPLIMIENTO_1_5', 4, N'Cumple lo esperado', 4),
    (N'CUMPLIMIENTO_1_5', 5, N'Supera lo esperado', 5),
    (N'ACUERDO_1_5', 1, N'Totalmente en desacuerdo', 1),
    (N'ACUERDO_1_5', 2, N'En desacuerdo', 2),
    (N'ACUERDO_1_5', 3, N'Ni de acuerdo ni en desacuerdo', 3),
    (N'ACUERDO_1_5', 4, N'De acuerdo', 4),
    (N'ACUERDO_1_5', 5, N'Totalmente de acuerdo', 5),
    (N'SATISFACCION_1_5', 1, N'Muy insatisfecho', 1),
    (N'SATISFACCION_1_5', 2, N'Insatisfecho', 2),
    (N'SATISFACCION_1_5', 3, N'Neutral', 3),
    (N'SATISFACCION_1_5', 4, N'Satisfecho', 4),
    (N'SATISFACCION_1_5', 5, N'Muy satisfecho', 5),
    (N'FRECUENCIA_1_5', 1, N'Nunca', 1),
    (N'FRECUENCIA_1_5', 2, N'Casi nunca', 2),
    (N'FRECUENCIA_1_5', 3, N'A veces', 3),
    (N'FRECUENCIA_1_5', 4, N'Casi siempre', 4),
    (N'FRECUENCIA_1_5', 5, N'Siempre', 5),
    (N'IMPORTANCIA_1_5', 1, N'Nada importante', 1),
    (N'IMPORTANCIA_1_5', 2, N'Poco importante', 2),
    (N'IMPORTANCIA_1_5', 3, N'Neutral', 3),
    (N'IMPORTANCIA_1_5', 4, N'Importante', 4),
    (N'IMPORTANCIA_1_5', 5, N'Muy importante', 5),
    (N'CALIDAD_1_5', 1, N'Mala', 1),
    (N'CALIDAD_1_5', 2, N'Regular', 2),
    (N'CALIDAD_1_5', 3, N'Buena', 3),
    (N'CALIDAD_1_5', 4, N'Muy buena', 4),
    (N'CALIDAD_1_5', 5, N'Excelente', 5),
    (N'SI_NO', 0, N'No', 1),
    (N'SI_NO', 1, N'Si', 2);

INSERT INTO dbo.DES_EscalaValor (IdEscala, Valor, Etiqueta, Orden)
SELECT e.IdEscala, v.Valor, v.Etiqueta, v.Orden
FROM @EscalasValores v
INNER JOIN dbo.DES_Escala e
    ON e.Codigo = v.CodigoEscala
   AND e.IdOrganizacion IS NULL
WHERE NOT EXISTS (
    SELECT 1
    FROM dbo.DES_EscalaValor ev
    WHERE ev.IdEscala = e.IdEscala
      AND ev.Valor = v.Valor
);
GO

/* ============================================================
   4. Puestos y relacion vigente con Empleados
   ============================================================ */

IF OBJECT_ID(N'dbo.DES_Puesto', N'U') IS NULL
BEGIN
    CREATE TABLE dbo.DES_Puesto (
        IdPuesto           INT IDENTITY(1,1) NOT NULL,
        IdOrganizacion     INT NOT NULL,
        Codigo             NVARCHAR(50) NULL,
        Nombre             NVARCHAR(150) NOT NULL,
        Activo             BIT NOT NULL CONSTRAINT DF_DES_Puesto_Activo DEFAULT (1),
        FechaCreacion      DATETIME2(0) NOT NULL
            CONSTRAINT DF_DES_Puesto_FechaCreacion DEFAULT (SYSDATETIME()),
        CONSTRAINT PK_DES_Puesto PRIMARY KEY CLUSTERED (IdPuesto),
        CONSTRAINT FK_DES_Puesto_Organizaciones
            FOREIGN KEY (IdOrganizacion) REFERENCES dbo.Organizaciones(Id),
        CONSTRAINT UQ_DES_Puesto_OrganizacionNombre UNIQUE (IdOrganizacion, Nombre)
    );
END
GO

IF OBJECT_ID(N'dbo.DES_EmpleadoPuesto', N'U') IS NULL
BEGIN
    CREATE TABLE dbo.DES_EmpleadoPuesto (
        IdEmpleadoPuesto   BIGINT IDENTITY(1,1) NOT NULL,
        IdEmpleado         INT NOT NULL,
        IdPuesto           INT NOT NULL,
        FechaInicio        DATE NOT NULL CONSTRAINT DF_DES_EmpleadoPuesto_FechaInicio
            DEFAULT (CONVERT(DATE, SYSDATETIME())),
        FechaFin           DATE NULL,
        EsActual           BIT NOT NULL CONSTRAINT DF_DES_EmpleadoPuesto_EsActual DEFAULT (1),
        FechaCreacion      DATETIME2(0) NOT NULL
            CONSTRAINT DF_DES_EmpleadoPuesto_FechaCreacion DEFAULT (SYSDATETIME()),
        CONSTRAINT PK_DES_EmpleadoPuesto PRIMARY KEY CLUSTERED (IdEmpleadoPuesto),
        CONSTRAINT FK_DES_EmpleadoPuesto_Empleados
            FOREIGN KEY (IdEmpleado) REFERENCES dbo.Empleados(Id),
        CONSTRAINT FK_DES_EmpleadoPuesto_Puesto
            FOREIGN KEY (IdPuesto) REFERENCES dbo.DES_Puesto(IdPuesto),
        CONSTRAINT CK_DES_EmpleadoPuesto_Fechas
            CHECK (FechaFin IS NULL OR FechaInicio <= FechaFin)
    );

    CREATE UNIQUE INDEX UX_DES_EmpleadoPuesto_Actual
        ON dbo.DES_EmpleadoPuesto (IdEmpleado)
        WHERE EsActual = 1;
END
GO

/* Sincronizacion inicial desde Empleados.Cargo. */
INSERT INTO dbo.DES_Puesto (IdOrganizacion, Nombre)
SELECT DISTINCT e.IdOrganizacion, LTRIM(RTRIM(e.Cargo))
FROM dbo.Empleados e
WHERE e.IdOrganizacion IS NOT NULL
  AND NULLIF(LTRIM(RTRIM(e.Cargo)), N'') IS NOT NULL
  AND NOT EXISTS (
      SELECT 1
      FROM dbo.DES_Puesto p
      WHERE p.IdOrganizacion = e.IdOrganizacion
        AND p.Nombre = LTRIM(RTRIM(e.Cargo))
  );
GO

INSERT INTO dbo.DES_EmpleadoPuesto (IdEmpleado, IdPuesto, EsActual)
SELECT e.Id, p.IdPuesto, 1
FROM dbo.Empleados e
INNER JOIN dbo.DES_Puesto p
    ON p.IdOrganizacion = e.IdOrganizacion
   AND p.Nombre = LTRIM(RTRIM(e.Cargo))
WHERE NULLIF(LTRIM(RTRIM(e.Cargo)), N'') IS NOT NULL
  AND NOT EXISTS (
      SELECT 1
      FROM dbo.DES_EmpleadoPuesto ep
      WHERE ep.IdEmpleado = e.Id
        AND ep.EsActual = 1
  );
GO

/* ============================================================
   5. Definicion versionada del modelo
   ============================================================ */

IF OBJECT_ID(N'dbo.DES_Modelo', N'U') IS NULL
BEGIN
    CREATE TABLE dbo.DES_Modelo (
        IdModelo           INT IDENTITY(1,1) NOT NULL,
        IdOrganizacion     INT NOT NULL,
        Codigo             NVARCHAR(50) NOT NULL,
        Version            INT NOT NULL CONSTRAINT DF_DES_Modelo_Version DEFAULT (1),
        Nombre             NVARCHAR(200) NOT NULL,
        Descripcion        NVARCHAR(1000) NULL,
        IdTipoModelo       SMALLINT NOT NULL,
        IdEstadoModelo     SMALLINT NOT NULL,
        IdEscalaPredeterminada INT NOT NULL,
        IdMetodoCalculo    SMALLINT NOT NULL,
        UsaPonderacion     BIT NOT NULL CONSTRAINT DF_DES_Modelo_UsaPonderacion DEFAULT (1),
        UsaAnonimato       BIT NOT NULL CONSTRAINT DF_DES_Modelo_UsaAnonimato DEFAULT (1),
        MinimoRespuestasAnonimas SMALLINT NOT NULL
            CONSTRAINT DF_DES_Modelo_MinimoRespuestasAnonimas DEFAULT (3),
        FechaInicio        DATE NULL,
        FechaCierre        DATE NULL,
        JsonFuente         NVARCHAR(MAX) NULL,
        Activo             BIT NOT NULL CONSTRAINT DF_DES_Modelo_Activo DEFAULT (1),
        FechaCreacion      DATETIME2(0) NOT NULL
            CONSTRAINT DF_DES_Modelo_FechaCreacion DEFAULT (SYSDATETIME()),
        FechaModificacion  DATETIME2(0) NULL,
        FechaPublicacion   DATETIME2(0) NULL,
        UsuarioCreacion    NVARCHAR(100) NULL,
        UsuarioModificacion NVARCHAR(100) NULL,
        CONSTRAINT PK_DES_Modelo PRIMARY KEY CLUSTERED (IdModelo),
        CONSTRAINT FK_DES_Modelo_Organizaciones
            FOREIGN KEY (IdOrganizacion) REFERENCES dbo.Organizaciones(Id),
        CONSTRAINT FK_DES_Modelo_TipoModelo
            FOREIGN KEY (IdTipoModelo) REFERENCES dbo.DES_CatTipoModelo(IdTipoModelo),
        CONSTRAINT FK_DES_Modelo_EstadoModelo
            FOREIGN KEY (IdEstadoModelo) REFERENCES dbo.DES_CatEstadoModelo(IdEstadoModelo),
        CONSTRAINT FK_DES_Modelo_Escala
            FOREIGN KEY (IdEscalaPredeterminada) REFERENCES dbo.DES_Escala(IdEscala),
        CONSTRAINT FK_DES_Modelo_MetodoCalculo
            FOREIGN KEY (IdMetodoCalculo) REFERENCES dbo.DES_CatMetodoCalculo(IdMetodoCalculo),
        CONSTRAINT UQ_DES_Modelo_OrganizacionCodigoVersion
            UNIQUE (IdOrganizacion, Codigo, Version),
        CONSTRAINT CK_DES_Modelo_Version CHECK (Version > 0),
        CONSTRAINT CK_DES_Modelo_MinimoAnonimo CHECK (MinimoRespuestasAnonimas >= 1),
        CONSTRAINT CK_DES_Modelo_Fechas
            CHECK (FechaInicio IS NULL OR FechaCierre IS NULL OR FechaInicio <= FechaCierre),
        CONSTRAINT CK_DES_Modelo_JsonFuente
            CHECK (JsonFuente IS NULL OR ISJSON(JsonFuente) = 1)
    );
END
GO

IF COL_LENGTH(N'dbo.DES_Modelo', N'FechaInicio') IS NULL
    ALTER TABLE dbo.DES_Modelo ADD FechaInicio DATE NULL;
GO

IF COL_LENGTH(N'dbo.DES_Modelo', N'FechaCierre') IS NULL
    ALTER TABLE dbo.DES_Modelo ADD FechaCierre DATE NULL;
GO

IF NOT EXISTS (
    SELECT 1
    FROM sys.check_constraints
    WHERE parent_object_id = OBJECT_ID(N'dbo.DES_Modelo')
      AND name = N'CK_DES_Modelo_Fechas'
)
BEGIN
    ALTER TABLE dbo.DES_Modelo WITH CHECK
        ADD CONSTRAINT CK_DES_Modelo_Fechas
        CHECK (FechaInicio IS NULL OR FechaCierre IS NULL OR FechaInicio <= FechaCierre);
END
GO

IF OBJECT_ID(N'dbo.DES_ModeloEmpleadoEspecifico', N'U') IS NULL
BEGIN
    CREATE TABLE dbo.DES_ModeloEmpleadoEspecifico (
        IdModeloEmpleadoEspecifico INT IDENTITY(1,1) NOT NULL,
        IdModelo           INT NOT NULL,
        IdEmpleado         INT NOT NULL,
        Activo             BIT NOT NULL
            CONSTRAINT DF_DES_ModeloEmpleadoEspecifico_Activo DEFAULT (1),
        FechaCreacion      DATETIME2(0) NOT NULL
            CONSTRAINT DF_DES_ModeloEmpleadoEspecifico_FechaCreacion DEFAULT (SYSDATETIME()),
        FechaModificacion  DATETIME2(0) NULL,
        UsuarioCreacion    NVARCHAR(100) NULL,
        UsuarioModificacion NVARCHAR(100) NULL,
        CONSTRAINT PK_DES_ModeloEmpleadoEspecifico
            PRIMARY KEY CLUSTERED (IdModeloEmpleadoEspecifico),
        CONSTRAINT FK_DES_ModeloEmpleadoEspecifico_Modelo
            FOREIGN KEY (IdModelo) REFERENCES dbo.DES_Modelo(IdModelo),
        CONSTRAINT FK_DES_ModeloEmpleadoEspecifico_Empleado
            FOREIGN KEY (IdEmpleado) REFERENCES dbo.Empleados(Id),
        CONSTRAINT UQ_DES_ModeloEmpleadoEspecifico
            UNIQUE (IdModelo, IdEmpleado)
    );

    CREATE INDEX IX_DES_ModeloEmpleadoEspecifico_ModeloActivo
        ON dbo.DES_ModeloEmpleadoEspecifico (IdModelo, Activo, IdEmpleado);
END
GO

IF OBJECT_ID(N'dbo.DES_ModeloEscenario', N'U') IS NULL
BEGIN
    CREATE TABLE dbo.DES_ModeloEscenario (
        IdModeloEscenario  INT IDENTITY(1,1) NOT NULL,
        IdModelo           INT NOT NULL,
        IdEscenario        SMALLINT NOT NULL,
        Ponderacion        DECIMAL(5,2) NOT NULL,
        EsAnonimo          BIT NOT NULL CONSTRAINT DF_DES_ModeloEscenario_EsAnonimo DEFAULT (1),
        MinimoRespuestasAnonimas SMALLINT NULL,
        Orden              SMALLINT NOT NULL,
        Activo             BIT NOT NULL CONSTRAINT DF_DES_ModeloEscenario_Activo DEFAULT (1),
        CONSTRAINT PK_DES_ModeloEscenario PRIMARY KEY CLUSTERED (IdModeloEscenario),
        CONSTRAINT FK_DES_ModeloEscenario_Modelo
            FOREIGN KEY (IdModelo) REFERENCES dbo.DES_Modelo(IdModelo),
        CONSTRAINT FK_DES_ModeloEscenario_Escenario
            FOREIGN KEY (IdEscenario) REFERENCES dbo.DES_CatEscenario(IdEscenario),
        CONSTRAINT UQ_DES_ModeloEscenario UNIQUE (IdModelo, IdEscenario),
        CONSTRAINT CK_DES_ModeloEscenario_Ponderacion
            CHECK (Ponderacion >= 0 AND Ponderacion <= 100),
        CONSTRAINT CK_DES_ModeloEscenario_MinimoAnonimo
            CHECK (MinimoRespuestasAnonimas IS NULL OR MinimoRespuestasAnonimas >= 1)
    );
END
GO

IF OBJECT_ID(N'dbo.DES_ModeloDimension', N'U') IS NULL
BEGIN
    CREATE TABLE dbo.DES_ModeloDimension (
        IdModeloDimension  INT IDENTITY(1,1) NOT NULL,
        IdModelo           INT NOT NULL,
        Codigo             NVARCHAR(50) NULL,
        Nombre             NVARCHAR(150) NOT NULL,
        Descripcion        NVARCHAR(500) NULL,
        Ponderacion        DECIMAL(5,2) NOT NULL,
        Orden              SMALLINT NOT NULL,
        Activo             BIT NOT NULL CONSTRAINT DF_DES_ModeloDimension_Activo DEFAULT (1),
        CONSTRAINT PK_DES_ModeloDimension PRIMARY KEY CLUSTERED (IdModeloDimension),
        CONSTRAINT FK_DES_ModeloDimension_Modelo
            FOREIGN KEY (IdModelo) REFERENCES dbo.DES_Modelo(IdModelo),
        CONSTRAINT UQ_DES_ModeloDimension_Nombre UNIQUE (IdModelo, Nombre),
        CONSTRAINT UQ_DES_ModeloDimension_Orden UNIQUE (IdModelo, Orden),
        CONSTRAINT CK_DES_ModeloDimension_Ponderacion
            CHECK (Ponderacion >= 0 AND Ponderacion <= 100)
    );
END
GO

IF OBJECT_ID(N'dbo.DES_ModeloPuesto', N'U') IS NULL
BEGIN
    CREATE TABLE dbo.DES_ModeloPuesto (
        IdModeloPuesto     INT IDENTITY(1,1) NOT NULL,
        IdModelo           INT NOT NULL,
        IdPuesto           INT NOT NULL,
        SoloEvaluador      BIT NOT NULL CONSTRAINT DF_DES_ModeloPuesto_SoloEvaluador DEFAULT (0),
        Orden              SMALLINT NOT NULL,
        Activo             BIT NOT NULL CONSTRAINT DF_DES_ModeloPuesto_Activo DEFAULT (1),
        CONSTRAINT PK_DES_ModeloPuesto PRIMARY KEY CLUSTERED (IdModeloPuesto),
        CONSTRAINT FK_DES_ModeloPuesto_Modelo
            FOREIGN KEY (IdModelo) REFERENCES dbo.DES_Modelo(IdModelo),
        CONSTRAINT FK_DES_ModeloPuesto_Puesto
            FOREIGN KEY (IdPuesto) REFERENCES dbo.DES_Puesto(IdPuesto),
        CONSTRAINT UQ_DES_ModeloPuesto UNIQUE (IdModelo, IdPuesto)
    );
END
GO

IF OBJECT_ID(N'dbo.DES_ModeloPuestoEscenario', N'U') IS NULL
BEGIN
    CREATE TABLE dbo.DES_ModeloPuestoEscenario (
        IdModeloPuestoEscenario INT IDENTITY(1,1) NOT NULL,
        IdModeloPuesto     INT NOT NULL,
        IdModeloEscenario  INT NOT NULL,
        Ponderacion        DECIMAL(5,2) NOT NULL,
        Orden              SMALLINT NOT NULL,
        Activo             BIT NOT NULL
            CONSTRAINT DF_DES_ModeloPuestoEscenario_Activo DEFAULT (1),
        CONSTRAINT PK_DES_ModeloPuestoEscenario
            PRIMARY KEY CLUSTERED (IdModeloPuestoEscenario),
        CONSTRAINT FK_DES_ModeloPuestoEscenario_ModeloPuesto
            FOREIGN KEY (IdModeloPuesto) REFERENCES dbo.DES_ModeloPuesto(IdModeloPuesto),
        CONSTRAINT FK_DES_ModeloPuestoEscenario_ModeloEscenario
            FOREIGN KEY (IdModeloEscenario) REFERENCES dbo.DES_ModeloEscenario(IdModeloEscenario),
        CONSTRAINT UQ_DES_ModeloPuestoEscenario
            UNIQUE (IdModeloPuesto, IdModeloEscenario),
        CONSTRAINT CK_DES_ModeloPuestoEscenario_Ponderacion
            CHECK (Ponderacion >= 0 AND Ponderacion <= 100)
    );
END
GO

IF OBJECT_ID(N'dbo.DES_CriterioEvaluacion', N'U') IS NULL
BEGIN
    CREATE TABLE dbo.DES_CriterioEvaluacion (
        IdCriterioEvaluacion INT IDENTITY(1,1) NOT NULL,
        IdCriterioOrigen   INT NULL,
        IdModeloPuestoEscenario INT NOT NULL,
        IdModeloDimension  INT NOT NULL,
        Codigo             NVARCHAR(50) NULL,
        Nombre             NVARCHAR(180) NOT NULL,
        Descripcion        NVARCHAR(700) NULL,
        Ponderacion        DECIMAL(5,2) NOT NULL,
        NivelExigencia     DECIMAL(9,4) NOT NULL,
        IdTipoItemPredeterminado SMALLINT NOT NULL,
        IdEscalaPredeterminada INT NULL,
        Orden              SMALLINT NOT NULL,
        Activo             BIT NOT NULL CONSTRAINT DF_DES_CriterioEvaluacion_Activo DEFAULT (1),
        CONSTRAINT PK_DES_CriterioEvaluacion PRIMARY KEY CLUSTERED (IdCriterioEvaluacion),
        CONSTRAINT FK_DES_CriterioEvaluacion_Origen
            FOREIGN KEY (IdCriterioOrigen)
            REFERENCES dbo.DES_CriterioEvaluacion(IdCriterioEvaluacion),
        CONSTRAINT FK_DES_CriterioEvaluacion_ModeloPuestoEscenario
            FOREIGN KEY (IdModeloPuestoEscenario)
            REFERENCES dbo.DES_ModeloPuestoEscenario(IdModeloPuestoEscenario),
        CONSTRAINT FK_DES_CriterioEvaluacion_ModeloDimension
            FOREIGN KEY (IdModeloDimension) REFERENCES dbo.DES_ModeloDimension(IdModeloDimension),
        CONSTRAINT FK_DES_CriterioEvaluacion_TipoItem
            FOREIGN KEY (IdTipoItemPredeterminado) REFERENCES dbo.DES_CatTipoItem(IdTipoItem),
        CONSTRAINT FK_DES_CriterioEvaluacion_Escala
            FOREIGN KEY (IdEscalaPredeterminada) REFERENCES dbo.DES_Escala(IdEscala),
        CONSTRAINT UQ_DES_CriterioEvaluacion_Nombre
            UNIQUE (IdModeloPuestoEscenario, IdModeloDimension, Nombre),
        CONSTRAINT UQ_DES_CriterioEvaluacion_Orden
            UNIQUE (IdModeloPuestoEscenario, IdModeloDimension, Orden),
        CONSTRAINT CK_DES_CriterioEvaluacion_Ponderacion
            CHECK (Ponderacion >= 0 AND Ponderacion <= 100),
        CONSTRAINT CK_DES_CriterioEvaluacion_NivelExigencia
            CHECK (NivelExigencia > 0)
    );
END
GO

IF OBJECT_ID(N'dbo.DES_ItemEvaluativo', N'U') IS NULL
BEGIN
    CREATE TABLE dbo.DES_ItemEvaluativo (
        IdItemEvaluativo   INT IDENTITY(1,1) NOT NULL,
        IdItemOrigen       INT NULL,
        IdCriterioEvaluacion INT NOT NULL,
        Codigo             NVARCHAR(50) NULL,
        Texto              NVARCHAR(1500) NOT NULL,
        IdTipoItem         SMALLINT NOT NULL,
        IdEscala           INT NULL,
        Requerido          BIT NOT NULL CONSTRAINT DF_DES_ItemEvaluativo_Requerido DEFAULT (1),
        PermiteNoAplica    BIT NOT NULL
            CONSTRAINT DF_DES_ItemEvaluativo_PermiteNoAplica DEFAULT (0),
        Orden              SMALLINT NOT NULL,
        Activo             BIT NOT NULL CONSTRAINT DF_DES_ItemEvaluativo_Activo DEFAULT (1),
        CONSTRAINT PK_DES_ItemEvaluativo PRIMARY KEY CLUSTERED (IdItemEvaluativo),
        CONSTRAINT FK_DES_ItemEvaluativo_Origen
            FOREIGN KEY (IdItemOrigen) REFERENCES dbo.DES_ItemEvaluativo(IdItemEvaluativo),
        CONSTRAINT FK_DES_ItemEvaluativo_Criterio
            FOREIGN KEY (IdCriterioEvaluacion)
            REFERENCES dbo.DES_CriterioEvaluacion(IdCriterioEvaluacion),
        CONSTRAINT FK_DES_ItemEvaluativo_TipoItem
            FOREIGN KEY (IdTipoItem) REFERENCES dbo.DES_CatTipoItem(IdTipoItem),
        CONSTRAINT FK_DES_ItemEvaluativo_Escala
            FOREIGN KEY (IdEscala) REFERENCES dbo.DES_Escala(IdEscala),
        CONSTRAINT UQ_DES_ItemEvaluativo_Orden UNIQUE (IdCriterioEvaluacion, Orden)
    );
END
GO

/* ============================================================
   6. Ejecucion de evaluaciones
   ============================================================ */

IF OBJECT_ID(N'dbo.DES_Evaluacion', N'U') IS NULL
BEGIN
    CREATE TABLE dbo.DES_Evaluacion (
        IdEvaluacion       BIGINT IDENTITY(1,1) NOT NULL,
        IdOrganizacion     INT NOT NULL,
        IdModelo           INT NOT NULL,
        IdEstadoEvaluacion SMALLINT NOT NULL,
        Nombre             NVARCHAR(200) NOT NULL,
        Descripcion        NVARCHAR(1000) NULL,
        FechaInicio        DATE NOT NULL,
        FechaCierre        DATE NOT NULL,
        JsonConfiguracionSnapshot NVARCHAR(MAX) NULL,
        Activo             BIT NOT NULL CONSTRAINT DF_DES_Evaluacion_Activo DEFAULT (1),
        FechaCreacion      DATETIME2(0) NOT NULL
            CONSTRAINT DF_DES_Evaluacion_FechaCreacion DEFAULT (SYSDATETIME()),
        FechaModificacion  DATETIME2(0) NULL,
        FechaCierreReal    DATETIME2(0) NULL,
        UsuarioCreacion    NVARCHAR(100) NULL,
        UsuarioModificacion NVARCHAR(100) NULL,
        CONSTRAINT PK_DES_Evaluacion PRIMARY KEY CLUSTERED (IdEvaluacion),
        CONSTRAINT FK_DES_Evaluacion_Organizaciones
            FOREIGN KEY (IdOrganizacion) REFERENCES dbo.Organizaciones(Id),
        CONSTRAINT FK_DES_Evaluacion_Modelo
            FOREIGN KEY (IdModelo) REFERENCES dbo.DES_Modelo(IdModelo),
        CONSTRAINT FK_DES_Evaluacion_Estado
            FOREIGN KEY (IdEstadoEvaluacion)
            REFERENCES dbo.DES_CatEstadoEvaluacion(IdEstadoEvaluacion),
        CONSTRAINT CK_DES_Evaluacion_Fechas CHECK (FechaInicio <= FechaCierre),
        CONSTRAINT CK_DES_Evaluacion_JsonSnapshot
            CHECK (
                JsonConfiguracionSnapshot IS NULL
                OR ISJSON(JsonConfiguracionSnapshot) = 1
            )
    );

    CREATE INDEX IX_DES_Evaluacion_OrganizacionEstado
        ON dbo.DES_Evaluacion (IdOrganizacion, IdEstadoEvaluacion, FechaInicio);
END
GO

IF OBJECT_ID(N'dbo.DES_EvaluacionParticipante', N'U') IS NULL
BEGIN
    CREATE TABLE dbo.DES_EvaluacionParticipante (
        IdEvaluacionParticipante BIGINT IDENTITY(1,1) NOT NULL,
        IdEvaluacion       BIGINT NOT NULL,
        IdEmpleado         INT NOT NULL,
        IdModeloPuesto     INT NULL,
        IdPuestoSnapshot   INT NULL,
        CargoSnapshot      NVARCHAR(150) NULL,
        EmailSnapshot      NVARCHAR(200) NULL,
        IdEmpleadoJefeSnapshot INT NULL,
        EsEvaluador        BIT NOT NULL
            CONSTRAINT DF_DES_EvaluacionParticipante_EsEvaluador DEFAULT (1),
        EsEvaluado         BIT NOT NULL
            CONSTRAINT DF_DES_EvaluacionParticipante_EsEvaluado DEFAULT (1),
        Activo             BIT NOT NULL
            CONSTRAINT DF_DES_EvaluacionParticipante_Activo DEFAULT (1),
        FechaCreacion      DATETIME2(0) NOT NULL
            CONSTRAINT DF_DES_EvaluacionParticipante_FechaCreacion DEFAULT (SYSDATETIME()),
        CONSTRAINT PK_DES_EvaluacionParticipante
            PRIMARY KEY CLUSTERED (IdEvaluacionParticipante),
        CONSTRAINT FK_DES_EvaluacionParticipante_Evaluacion
            FOREIGN KEY (IdEvaluacion) REFERENCES dbo.DES_Evaluacion(IdEvaluacion),
        CONSTRAINT FK_DES_EvaluacionParticipante_Empleado
            FOREIGN KEY (IdEmpleado) REFERENCES dbo.Empleados(Id),
        CONSTRAINT FK_DES_EvaluacionParticipante_ModeloPuesto
            FOREIGN KEY (IdModeloPuesto) REFERENCES dbo.DES_ModeloPuesto(IdModeloPuesto),
        CONSTRAINT FK_DES_EvaluacionParticipante_Puesto
            FOREIGN KEY (IdPuestoSnapshot) REFERENCES dbo.DES_Puesto(IdPuesto),
        CONSTRAINT FK_DES_EvaluacionParticipante_Jefe
            FOREIGN KEY (IdEmpleadoJefeSnapshot) REFERENCES dbo.Empleados(Id),
        CONSTRAINT UQ_DES_EvaluacionParticipante UNIQUE (IdEvaluacion, IdEmpleado),
        CONSTRAINT CK_DES_EvaluacionParticipante_Rol
            CHECK (EsEvaluador = 1 OR EsEvaluado = 1)
    );
END
GO

IF OBJECT_ID(N'dbo.DES_AsignacionEvaluacion', N'U') IS NULL
BEGIN
    CREATE TABLE dbo.DES_AsignacionEvaluacion (
        IdAsignacion       BIGINT IDENTITY(1,1) NOT NULL,
        IdEvaluacion       BIGINT NOT NULL,
        IdModeloPuestoEscenario INT NOT NULL,
        IdEvaluador        INT NOT NULL,
        IdEvaluado         INT NOT NULL,
        IdEstadoAsignacion SMALLINT NOT NULL,
        IdCanalEnvio       SMALLINT NULL,
        TokenAcceso        UNIQUEIDENTIFIER NOT NULL
            CONSTRAINT DF_DES_AsignacionEvaluacion_Token DEFAULT (NEWID()),
        EsAnonima          BIT NOT NULL
            CONSTRAINT DF_DES_AsignacionEvaluacion_EsAnonima DEFAULT (1),
        FechaLimite        DATETIME2(0) NULL,
        FechaPrimerEnvio   DATETIME2(0) NULL,
        FechaUltimoEnvio   DATETIME2(0) NULL,
        FechaInicioRespuesta DATETIME2(0) NULL,
        FechaRespuesta     DATETIME2(0) NULL,
        Activo             BIT NOT NULL
            CONSTRAINT DF_DES_AsignacionEvaluacion_Activo DEFAULT (1),
        FechaCreacion      DATETIME2(0) NOT NULL
            CONSTRAINT DF_DES_AsignacionEvaluacion_FechaCreacion DEFAULT (SYSDATETIME()),
        CONSTRAINT PK_DES_AsignacionEvaluacion PRIMARY KEY CLUSTERED (IdAsignacion),
        CONSTRAINT FK_DES_AsignacionEvaluacion_Evaluacion
            FOREIGN KEY (IdEvaluacion) REFERENCES dbo.DES_Evaluacion(IdEvaluacion),
        CONSTRAINT FK_DES_AsignacionEvaluacion_ModeloPuestoEscenario
            FOREIGN KEY (IdModeloPuestoEscenario)
            REFERENCES dbo.DES_ModeloPuestoEscenario(IdModeloPuestoEscenario),
        CONSTRAINT FK_DES_AsignacionEvaluacion_Evaluador
            FOREIGN KEY (IdEvaluador) REFERENCES dbo.Empleados(Id),
        CONSTRAINT FK_DES_AsignacionEvaluacion_Evaluado
            FOREIGN KEY (IdEvaluado) REFERENCES dbo.Empleados(Id),
        CONSTRAINT FK_DES_AsignacionEvaluacion_Estado
            FOREIGN KEY (IdEstadoAsignacion)
            REFERENCES dbo.DES_CatEstadoAsignacion(IdEstadoAsignacion),
        CONSTRAINT FK_DES_AsignacionEvaluacion_Canal
            FOREIGN KEY (IdCanalEnvio) REFERENCES dbo.DES_CatCanalEnvio(IdCanalEnvio),
        CONSTRAINT UQ_DES_AsignacionEvaluacion
            UNIQUE (IdEvaluacion, IdModeloPuestoEscenario, IdEvaluador, IdEvaluado),
        CONSTRAINT UQ_DES_AsignacionEvaluacion_Token UNIQUE (TokenAcceso)
    );

    CREATE INDEX IX_DES_AsignacionEvaluacion_EvaluadorEstado
        ON dbo.DES_AsignacionEvaluacion
        (IdEvaluador, IdEstadoAsignacion, IdEvaluacion);

    CREATE INDEX IX_DES_AsignacionEvaluacion_Evaluado
        ON dbo.DES_AsignacionEvaluacion (IdEvaluado, IdEvaluacion);
END
GO

IF OBJECT_ID(N'dbo.DES_EnvioEvaluacion', N'U') IS NULL
BEGIN
    CREATE TABLE dbo.DES_EnvioEvaluacion (
        IdEnvio            BIGINT IDENTITY(1,1) NOT NULL,
        IdAsignacion       BIGINT NOT NULL,
        IdCanalEnvio       SMALLINT NOT NULL,
        Destino            NVARCHAR(250) NOT NULL,
        Estado             NVARCHAR(30) NOT NULL,
        IdExterno          NVARCHAR(200) NULL,
        Intento            SMALLINT NOT NULL CONSTRAINT DF_DES_EnvioEvaluacion_Intento DEFAULT (1),
        FechaSolicitud     DATETIME2(0) NOT NULL
            CONSTRAINT DF_DES_EnvioEvaluacion_FechaSolicitud DEFAULT (SYSDATETIME()),
        FechaEnvio         DATETIME2(0) NULL,
        MensajeError       NVARCHAR(2000) NULL,
        CONSTRAINT PK_DES_EnvioEvaluacion PRIMARY KEY CLUSTERED (IdEnvio),
        CONSTRAINT FK_DES_EnvioEvaluacion_Asignacion
            FOREIGN KEY (IdAsignacion) REFERENCES dbo.DES_AsignacionEvaluacion(IdAsignacion),
        CONSTRAINT FK_DES_EnvioEvaluacion_Canal
            FOREIGN KEY (IdCanalEnvio) REFERENCES dbo.DES_CatCanalEnvio(IdCanalEnvio),
        CONSTRAINT CK_DES_EnvioEvaluacion_Estado
            CHECK (Estado IN (N'PENDIENTE', N'ENVIADO', N'ERROR'))
    );

    CREATE INDEX IX_DES_EnvioEvaluacion_Asignacion
        ON dbo.DES_EnvioEvaluacion (IdAsignacion, FechaSolicitud DESC);
END
GO

IF OBJECT_ID(N'dbo.DES_RespuestaEvaluacion', N'U') IS NULL
BEGIN
    CREATE TABLE dbo.DES_RespuestaEvaluacion (
        IdRespuesta        BIGINT IDENTITY(1,1) NOT NULL,
        IdAsignacion       BIGINT NOT NULL,
        IdEstadoRespuesta  SMALLINT NOT NULL,
        FechaInicio        DATETIME2(0) NOT NULL
            CONSTRAINT DF_DES_RespuestaEvaluacion_FechaInicio DEFAULT (SYSDATETIME()),
        FechaModificacion  DATETIME2(0) NULL,
        FechaFinalizacion  DATETIME2(0) NULL,
        CONSTRAINT PK_DES_RespuestaEvaluacion PRIMARY KEY CLUSTERED (IdRespuesta),
        CONSTRAINT FK_DES_RespuestaEvaluacion_Asignacion
            FOREIGN KEY (IdAsignacion) REFERENCES dbo.DES_AsignacionEvaluacion(IdAsignacion),
        CONSTRAINT FK_DES_RespuestaEvaluacion_Estado
            FOREIGN KEY (IdEstadoRespuesta)
            REFERENCES dbo.DES_CatEstadoRespuesta(IdEstadoRespuesta),
        CONSTRAINT UQ_DES_RespuestaEvaluacion_Asignacion UNIQUE (IdAsignacion)
    );
END
GO

IF OBJECT_ID(N'dbo.DES_RespuestaDetalle', N'U') IS NULL
BEGIN
    CREATE TABLE dbo.DES_RespuestaDetalle (
        IdRespuestaDetalle BIGINT IDENTITY(1,1) NOT NULL,
        IdRespuesta        BIGINT NOT NULL,
        IdItemEvaluativo   INT NOT NULL,
        IdEscalaValor      INT NULL,
        ValorNumero        DECIMAL(18,4) NULL,
        ValorTexto         NVARCHAR(MAX) NULL,
        NoAplica           BIT NOT NULL CONSTRAINT DF_DES_RespuestaDetalle_NoAplica DEFAULT (0),
        FechaRespuesta     DATETIME2(0) NOT NULL
            CONSTRAINT DF_DES_RespuestaDetalle_FechaRespuesta DEFAULT (SYSDATETIME()),
        CONSTRAINT PK_DES_RespuestaDetalle PRIMARY KEY CLUSTERED (IdRespuestaDetalle),
        CONSTRAINT FK_DES_RespuestaDetalle_Respuesta
            FOREIGN KEY (IdRespuesta) REFERENCES dbo.DES_RespuestaEvaluacion(IdRespuesta),
        CONSTRAINT FK_DES_RespuestaDetalle_Item
            FOREIGN KEY (IdItemEvaluativo) REFERENCES dbo.DES_ItemEvaluativo(IdItemEvaluativo),
        CONSTRAINT FK_DES_RespuestaDetalle_EscalaValor
            FOREIGN KEY (IdEscalaValor) REFERENCES dbo.DES_EscalaValor(IdEscalaValor),
        CONSTRAINT UQ_DES_RespuestaDetalle UNIQUE (IdRespuesta, IdItemEvaluativo)
    );
END
GO

/* Para OPCION_MULTIPLE. En Likert y opcion unica se usa IdEscalaValor
   directamente en DES_RespuestaDetalle. */
IF OBJECT_ID(N'dbo.DES_RespuestaDetalleOpcion', N'U') IS NULL
BEGIN
    CREATE TABLE dbo.DES_RespuestaDetalleOpcion (
        IdRespuestaDetalle BIGINT NOT NULL,
        IdEscalaValor      INT NOT NULL,
        CONSTRAINT PK_DES_RespuestaDetalleOpcion
            PRIMARY KEY CLUSTERED (IdRespuestaDetalle, IdEscalaValor),
        CONSTRAINT FK_DES_RespuestaDetalleOpcion_Detalle
            FOREIGN KEY (IdRespuestaDetalle)
            REFERENCES dbo.DES_RespuestaDetalle(IdRespuestaDetalle),
        CONSTRAINT FK_DES_RespuestaDetalleOpcion_EscalaValor
            FOREIGN KEY (IdEscalaValor) REFERENCES dbo.DES_EscalaValor(IdEscalaValor)
    );
END
GO

/* ============================================================
   7. Validacion integral antes de publicar un modelo
   ============================================================ */

CREATE OR ALTER PROCEDURE dbo.DES_sp_ValidarModelo
    @IdModelo INT
AS
BEGIN
    SET NOCOUNT ON;

    DECLARE @UsaPonderacion BIT;
    DECLARE @Errores TABLE (
        Orden INT IDENTITY(1,1),
        Codigo NVARCHAR(50),
        Mensaje NVARCHAR(1000)
    );

    SELECT @UsaPonderacion = UsaPonderacion
    FROM dbo.DES_Modelo
    WHERE IdModelo = @IdModelo
      AND Activo = 1;

    IF @UsaPonderacion IS NULL
        INSERT INTO @Errores (Codigo, Mensaje)
        VALUES (N'MODELO_NO_EXISTE', N'El modelo no existe o esta inactivo.');

    IF NOT EXISTS (
        SELECT 1
        FROM dbo.DES_ModeloDimension
        WHERE IdModelo = @IdModelo
          AND Activo = 1
    )
        INSERT INTO @Errores (Codigo, Mensaje)
        VALUES (N'SIN_DIMENSIONES', N'El modelo debe tener al menos una dimension activa.');

    IF NOT EXISTS (
        SELECT 1
        FROM dbo.DES_ModeloPuesto
        WHERE IdModelo = @IdModelo
          AND Activo = 1
    )
        INSERT INTO @Errores (Codigo, Mensaje)
        VALUES (N'SIN_PUESTOS', N'El modelo debe tener al menos un puesto participante.');

    INSERT INTO @Errores (Codigo, Mensaje)
    SELECT
        N'PUESTO_SOLO_EVALUADOR_CON_CONTENIDO',
        N'El puesto "' + p.Nombre
        + N'" esta marcado como solo evaluador y no puede tener criterios ni items.'
    FROM dbo.DES_ModeloPuesto mp
    INNER JOIN dbo.DES_Puesto p ON p.IdPuesto = mp.IdPuesto
    WHERE mp.IdModelo = @IdModelo
      AND mp.Activo = 1
      AND mp.SoloEvaluador = 1
      AND EXISTS (
          SELECT 1
          FROM dbo.DES_ModeloPuestoEscenario mpe
          INNER JOIN dbo.DES_CriterioEvaluacion c
              ON c.IdModeloPuestoEscenario = mpe.IdModeloPuestoEscenario
             AND c.Activo = 1
          WHERE mpe.IdModeloPuesto = mp.IdModeloPuesto
            AND mpe.Activo = 1
      );

    IF @UsaPonderacion = 1
       AND ISNULL((
           SELECT SUM(Ponderacion)
           FROM dbo.DES_ModeloDimension
           WHERE IdModelo = @IdModelo
             AND Activo = 1
       ), 0) <> 100
        INSERT INTO @Errores (Codigo, Mensaje)
        VALUES (N'PONDERACION_DIMENSIONES',
            N'Las ponderaciones de las dimensiones activas deben sumar 100.');

    IF NOT EXISTS (
        SELECT 1
        FROM dbo.DES_ModeloEscenario
        WHERE IdModelo = @IdModelo
          AND Activo = 1
    )
        INSERT INTO @Errores (Codigo, Mensaje)
        VALUES (N'SIN_ESCENARIOS', N'El modelo debe tener al menos un escenario activo.');

    IF @UsaPonderacion = 1
       AND ISNULL((
           SELECT SUM(Ponderacion)
           FROM dbo.DES_ModeloEscenario
           WHERE IdModelo = @IdModelo
             AND Activo = 1
       ), 0) <> 100
        INSERT INTO @Errores (Codigo, Mensaje)
        VALUES (N'PONDERACION_ESCENARIOS',
            N'Las ponderaciones de los escenarios activos deben sumar 100.');

    INSERT INTO @Errores (Codigo, Mensaje)
    SELECT
        N'RELACION_ESCENARIO_MODELO',
        N'Existe un escenario por puesto relacionado con otro modelo.'
    FROM dbo.DES_ModeloPuestoEscenario mpe
    INNER JOIN dbo.DES_ModeloPuesto mp
        ON mp.IdModeloPuesto = mpe.IdModeloPuesto
    INNER JOIN dbo.DES_ModeloEscenario me
        ON me.IdModeloEscenario = mpe.IdModeloEscenario
    WHERE mp.IdModelo = @IdModelo
      AND me.IdModelo <> mp.IdModelo
    GROUP BY mp.IdModelo;

    INSERT INTO @Errores (Codigo, Mensaje)
    SELECT
        N'RELACION_DIMENSION_MODELO',
        N'Existe un criterio relacionado con una dimension de otro modelo.'
    FROM dbo.DES_CriterioEvaluacion c
    INNER JOIN dbo.DES_ModeloPuestoEscenario mpe
        ON mpe.IdModeloPuestoEscenario = c.IdModeloPuestoEscenario
    INNER JOIN dbo.DES_ModeloPuesto mp
        ON mp.IdModeloPuesto = mpe.IdModeloPuesto
    INNER JOIN dbo.DES_ModeloDimension d
        ON d.IdModeloDimension = c.IdModeloDimension
    WHERE mp.IdModelo = @IdModelo
      AND d.IdModelo <> mp.IdModelo
    GROUP BY mp.IdModelo;

    INSERT INTO @Errores (Codigo, Mensaje)
    SELECT
        N'ESCENARIO_GLOBAL_INACTIVO',
        N'El puesto "' + p.Nombre + N'" utiliza el escenario global "'
        + e.Nombre + N'" que esta inactivo.'
    FROM dbo.DES_ModeloPuesto mp
    INNER JOIN dbo.DES_Puesto p
        ON p.IdPuesto = mp.IdPuesto
    INNER JOIN dbo.DES_ModeloPuestoEscenario mpe
        ON mpe.IdModeloPuesto = mp.IdModeloPuesto
       AND mpe.Activo = 1
    INNER JOIN dbo.DES_ModeloEscenario me
        ON me.IdModeloEscenario = mpe.IdModeloEscenario
    INNER JOIN dbo.DES_CatEscenario e
        ON e.IdEscenario = me.IdEscenario
    WHERE mp.IdModelo = @IdModelo
      AND me.Activo = 0;

    INSERT INTO @Errores (Codigo, Mensaje)
    SELECT
        N'PUESTO_SIN_ESCENARIOS',
        N'El puesto "' + p.Nombre + N'" no tiene escenarios activos.'
    FROM dbo.DES_ModeloPuesto mp
    INNER JOIN dbo.DES_Puesto p ON p.IdPuesto = mp.IdPuesto
    WHERE mp.IdModelo = @IdModelo
      AND mp.Activo = 1
      AND mp.SoloEvaluador = 0
      AND NOT EXISTS (
          SELECT 1
          FROM dbo.DES_ModeloPuestoEscenario mpe
          WHERE mpe.IdModeloPuesto = mp.IdModeloPuesto
            AND mpe.Activo = 1
      );

    IF @UsaPonderacion = 1
    BEGIN
        INSERT INTO @Errores (Codigo, Mensaje)
        SELECT
            N'PONDERACION_ESCENARIOS_PUESTO',
            N'Los escenarios activos del puesto "' + p.Nombre + N'" deben sumar 100.'
        FROM dbo.DES_ModeloPuesto mp
        INNER JOIN dbo.DES_Puesto p ON p.IdPuesto = mp.IdPuesto
        LEFT JOIN dbo.DES_ModeloPuestoEscenario mpe
            ON mpe.IdModeloPuesto = mp.IdModeloPuesto
           AND mpe.Activo = 1
        WHERE mp.IdModelo = @IdModelo
          AND mp.Activo = 1
          AND mp.SoloEvaluador = 0
        GROUP BY mp.IdModeloPuesto, p.Nombre
        HAVING ISNULL(SUM(mpe.Ponderacion), 0) <> 100;

        INSERT INTO @Errores (Codigo, Mensaje)
        SELECT
            N'DIMENSION_SIN_CRITERIOS',
            N'La dimension "' + d.Nombre + N'" no tiene criterios para el puesto "'
            + p.Nombre + N'" y escenario "' + e.Nombre + N'".'
        FROM dbo.DES_ModeloPuesto mp
        INNER JOIN dbo.DES_Puesto p
            ON p.IdPuesto = mp.IdPuesto
        INNER JOIN dbo.DES_ModeloPuestoEscenario mpe
            ON mpe.IdModeloPuesto = mp.IdModeloPuesto
           AND mpe.Activo = 1
        INNER JOIN dbo.DES_ModeloEscenario me
            ON me.IdModeloEscenario = mpe.IdModeloEscenario
           AND me.Activo = 1
        INNER JOIN dbo.DES_CatEscenario e
            ON e.IdEscenario = me.IdEscenario
        INNER JOIN dbo.DES_ModeloDimension d
            ON d.IdModelo = mp.IdModelo
           AND d.Activo = 1
        WHERE mp.IdModelo = @IdModelo
          AND mp.Activo = 1
          AND mp.SoloEvaluador = 0
          AND NOT EXISTS (
              SELECT 1
              FROM dbo.DES_CriterioEvaluacion c
              WHERE c.IdModeloPuestoEscenario = mpe.IdModeloPuestoEscenario
                AND c.IdModeloDimension = d.IdModeloDimension
                AND c.Activo = 1
          );

        INSERT INTO @Errores (Codigo, Mensaje)
        SELECT
            N'PONDERACION_CRITERIOS',
            N'Los criterios de "' + d.Nombre + N'" para el puesto "' + p.Nombre
            + N'" y escenario "' + e.Nombre + N'" deben sumar 100.'
        FROM dbo.DES_ModeloPuesto mp
        INNER JOIN dbo.DES_Puesto p
            ON p.IdPuesto = mp.IdPuesto
        INNER JOIN dbo.DES_ModeloPuestoEscenario mpe
            ON mpe.IdModeloPuesto = mp.IdModeloPuesto
           AND mpe.Activo = 1
        INNER JOIN dbo.DES_ModeloEscenario me
            ON me.IdModeloEscenario = mpe.IdModeloEscenario
        INNER JOIN dbo.DES_CatEscenario e
            ON e.IdEscenario = me.IdEscenario
        INNER JOIN dbo.DES_CriterioEvaluacion c
            ON c.IdModeloPuestoEscenario = mpe.IdModeloPuestoEscenario
           AND c.Activo = 1
        INNER JOIN dbo.DES_ModeloDimension d
            ON d.IdModeloDimension = c.IdModeloDimension
           AND d.Activo = 1
        WHERE mp.IdModelo = @IdModelo
          AND mp.Activo = 1
          AND mp.SoloEvaluador = 0
        GROUP BY mpe.IdModeloPuestoEscenario, c.IdModeloDimension,
                 p.Nombre, e.Nombre, d.Nombre
        HAVING SUM(c.Ponderacion) <> 100;
    END

    INSERT INTO @Errores (Codigo, Mensaje)
    SELECT
        N'NIVEL_EXIGENCIA_FUERA_ESCALA',
        N'El nivel de exigencia del criterio "' + c.Nombre
        + N'" esta fuera del rango de su escala.'
    FROM dbo.DES_CriterioEvaluacion c
    INNER JOIN dbo.DES_ModeloPuestoEscenario mpe
        ON mpe.IdModeloPuestoEscenario = c.IdModeloPuestoEscenario
    INNER JOIN dbo.DES_ModeloPuesto mp
        ON mp.IdModeloPuesto = mpe.IdModeloPuesto
    INNER JOIN dbo.DES_Modelo m
        ON m.IdModelo = mp.IdModelo
    INNER JOIN dbo.DES_Escala es
        ON es.IdEscala = COALESCE(c.IdEscalaPredeterminada, m.IdEscalaPredeterminada)
    WHERE mp.IdModelo = @IdModelo
      AND c.Activo = 1
      AND (
          c.NivelExigencia < es.ValorMinimo
          OR c.NivelExigencia > es.ValorMaximo
      );

    INSERT INTO @Errores (Codigo, Mensaje)
    SELECT
        N'CRITERIO_SIN_ITEMS',
        N'El criterio "' + c.Nombre + N'" no tiene items evaluativos activos.'
    FROM dbo.DES_CriterioEvaluacion c
    INNER JOIN dbo.DES_ModeloPuestoEscenario mpe
        ON mpe.IdModeloPuestoEscenario = c.IdModeloPuestoEscenario
    INNER JOIN dbo.DES_ModeloPuesto mp
        ON mp.IdModeloPuesto = mpe.IdModeloPuesto
    WHERE mp.IdModelo = @IdModelo
      AND c.Activo = 1
      AND NOT EXISTS (
          SELECT 1
          FROM dbo.DES_ItemEvaluativo i
          WHERE i.IdCriterioEvaluacion = c.IdCriterioEvaluacion
            AND i.Activo = 1
      );

    INSERT INTO @Errores (Codigo, Mensaje)
    SELECT
        N'ITEM_SIN_ESCALA',
        N'El item "' + LEFT(i.Texto, 200)
        + N'" requiere una escala de respuesta.'
    FROM dbo.DES_ItemEvaluativo i
    INNER JOIN dbo.DES_CatTipoItem ti
        ON ti.IdTipoItem = i.IdTipoItem
    INNER JOIN dbo.DES_CriterioEvaluacion c
        ON c.IdCriterioEvaluacion = i.IdCriterioEvaluacion
    INNER JOIN dbo.DES_ModeloPuestoEscenario mpe
        ON mpe.IdModeloPuestoEscenario = c.IdModeloPuestoEscenario
    INNER JOIN dbo.DES_ModeloPuesto mp
        ON mp.IdModeloPuesto = mpe.IdModeloPuesto
    INNER JOIN dbo.DES_Modelo m
        ON m.IdModelo = mp.IdModelo
    WHERE mp.IdModelo = @IdModelo
      AND i.Activo = 1
      AND ti.UsaEscala = 1
      AND COALESCE(i.IdEscala, c.IdEscalaPredeterminada, m.IdEscalaPredeterminada) IS NULL;

    SELECT Codigo, Mensaje
    FROM @Errores
    ORDER BY Orden;

    SELECT
        @IdModelo AS IdModelo,
        CAST(CASE WHEN EXISTS (SELECT 1 FROM @Errores) THEN 0 ELSE 1 END AS BIT) AS EsValido,
        (SELECT COUNT(*) FROM @Errores) AS CantidadErrores;
END
GO

/* ============================================================
   8. Vista de apoyo para obtener el modelo jerarquico
   ============================================================ */

CREATE OR ALTER VIEW dbo.DES_vw_ModeloDetalle
AS
SELECT
    m.IdModelo,
    m.IdOrganizacion,
    m.Codigo AS CodigoModelo,
    m.Version,
    m.Nombre AS Modelo,
    tm.Codigo AS TipoModelo,
    em.Codigo AS EstadoModelo,
    p.IdPuesto,
    p.Nombre AS Puesto,
    mp.SoloEvaluador,
    ce.Codigo AS CodigoEscenario,
    ce.Nombre AS Escenario,
    mpe.Ponderacion AS PonderacionEscenarioPuesto,
    d.IdModeloDimension,
    d.Nombre AS Dimension,
    d.Ponderacion AS PonderacionDimension,
    c.IdCriterioEvaluacion,
    c.Nombre AS CriterioEvaluacion,
    c.Ponderacion AS PonderacionCriterio,
    c.NivelExigencia,
    i.IdItemEvaluativo,
    i.Texto AS ItemEvaluativo,
    ti.Codigo AS TipoItem,
    i.Requerido,
    i.PermiteNoAplica,
    es.Codigo AS CodigoEscala,
    es.Nombre AS Escala,
    mp.Orden AS OrdenPuesto,
    mpe.Orden AS OrdenEscenario,
    d.Orden AS OrdenDimension,
    c.Orden AS OrdenCriterio,
    i.Orden AS OrdenItem
FROM dbo.DES_Modelo m
INNER JOIN dbo.DES_CatTipoModelo tm
    ON tm.IdTipoModelo = m.IdTipoModelo
INNER JOIN dbo.DES_CatEstadoModelo em
    ON em.IdEstadoModelo = m.IdEstadoModelo
INNER JOIN dbo.DES_ModeloPuesto mp
    ON mp.IdModelo = m.IdModelo
   AND mp.Activo = 1
INNER JOIN dbo.DES_Puesto p
    ON p.IdPuesto = mp.IdPuesto
LEFT JOIN dbo.DES_ModeloPuestoEscenario mpe
    ON mpe.IdModeloPuesto = mp.IdModeloPuesto
   AND mpe.Activo = 1
LEFT JOIN dbo.DES_ModeloEscenario me
    ON me.IdModeloEscenario = mpe.IdModeloEscenario
LEFT JOIN dbo.DES_CatEscenario ce
    ON ce.IdEscenario = me.IdEscenario
LEFT JOIN dbo.DES_CriterioEvaluacion c
    ON c.IdModeloPuestoEscenario = mpe.IdModeloPuestoEscenario
   AND c.Activo = 1
LEFT JOIN dbo.DES_ModeloDimension d
    ON d.IdModeloDimension = c.IdModeloDimension
   AND d.Activo = 1
LEFT JOIN dbo.DES_ItemEvaluativo i
    ON i.IdCriterioEvaluacion = c.IdCriterioEvaluacion
   AND i.Activo = 1
LEFT JOIN dbo.DES_CatTipoItem ti
    ON ti.IdTipoItem = i.IdTipoItem
LEFT JOIN dbo.DES_Escala es
    ON es.IdEscala = COALESCE(
        i.IdEscala,
        c.IdEscalaPredeterminada,
        m.IdEscalaPredeterminada
    )
WHERE m.Activo = 1;
GO



--analisis IA desempeño
IF OBJECT_ID(N'dbo.DES_AnalisisResultadoIA', N'U') IS NULL
BEGIN
    CREATE TABLE dbo.DES_AnalisisResultadoIA (
        IdAnalisisResultadoIA BIGINT IDENTITY(1,1) NOT NULL,
        IdOrganizacion        INT NOT NULL,
        IdModelo              INT NOT NULL,
        HashResultados        NVARCHAR(64) NOT NULL,
        PromptVersion         NVARCHAR(80) NOT NULL,
        ModeloIA              NVARCHAR(80) NOT NULL,
        ResultadoJson         NVARCHAR(MAX) NOT NULL,
        EvidenciaJson         NVARCHAR(MAX) NULL,
        OpenAIResponseId      NVARCHAR(120) NULL,
        TokensEntrada         INT NULL,
        TokensSalida          INT NULL,
        TokensTotal           INT NULL,
        Activo                BIT NOT NULL
            CONSTRAINT DF_DES_AnalisisResultadoIA_Activo DEFAULT (1),
        FechaCreacion         DATETIME2(0) NOT NULL
            CONSTRAINT DF_DES_AnalisisResultadoIA_FechaCreacion DEFAULT (SYSDATETIME()),
        FechaModificacion     DATETIME2(0) NULL,
        UsuarioCreacion       NVARCHAR(100) NULL,
        UsuarioModificacion   NVARCHAR(100) NULL,
        CONSTRAINT PK_DES_AnalisisResultadoIA
            PRIMARY KEY CLUSTERED (IdAnalisisResultadoIA),
        CONSTRAINT FK_DES_AnalisisResultadoIA_Organizacion
            FOREIGN KEY (IdOrganizacion) REFERENCES dbo.Organizaciones(Id),
        CONSTRAINT FK_DES_AnalisisResultadoIA_Modelo
            FOREIGN KEY (IdModelo) REFERENCES dbo.DES_Modelo(IdModelo),
        CONSTRAINT UQ_DES_AnalisisResultadoIA_Cache
            UNIQUE (IdOrganizacion, IdModelo, HashResultados, PromptVersion)
    );
END
GO


PRINT N'Estructura DES_ creada o verificada correctamente.';
GO
