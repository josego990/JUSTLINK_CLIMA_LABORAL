
use JUSTLINK_DB

IF OBJECT_ID(N'dbo.CLI_CatEstadoPlanAccionClima', N'U') IS NULL
BEGIN
    CREATE TABLE dbo.CLI_CatEstadoPlanAccionClima (
        IdEstadoPlanAccionClima INT IDENTITY(1,1) NOT NULL
            CONSTRAINT PK_CLI_CatEstadoPlanAccionClima PRIMARY KEY,
        Codigo NVARCHAR(30) NOT NULL
            CONSTRAINT UQ_CLI_CatEstadoPlanAccionClima_Codigo UNIQUE,
        Nombre NVARCHAR(80) NOT NULL,
        Orden INT NOT NULL,
        Activo BIT NOT NULL
            CONSTRAINT DF_CLI_CatEstadoPlanAccionClima_Activo DEFAULT (1)
    );
END
GO

MERGE dbo.CLI_CatEstadoPlanAccionClima AS target
USING (VALUES
    (N'SIN_INICIAR', N'Sin iniciar', 1),
    (N'EN_PROGRESO', N'En progreso', 2),
    (N'EN_RIESGO', N'En riesgo', 3),
    (N'COMPLETADO', N'Completado', 4)
) AS source (Codigo, Nombre, Orden)
ON target.Codigo = source.Codigo
WHEN MATCHED THEN
    UPDATE SET
        Nombre = source.Nombre,
        Orden = source.Orden,
        Activo = 1
WHEN NOT MATCHED THEN
    INSERT (Codigo, Nombre, Orden)
    VALUES (source.Codigo, source.Nombre, source.Orden);
GO

IF OBJECT_ID(N'dbo.CLI_PlanAccionClimaOportunidad', N'U') IS NULL
BEGIN
    CREATE TABLE dbo.CLI_PlanAccionClimaOportunidad (
        IdOportunidadClima BIGINT IDENTITY(1,1) NOT NULL
            CONSTRAINT PK_CLI_PlanAccionClimaOportunidad PRIMARY KEY,
        IdOrganizacion INT NOT NULL,
        IdFlujo INT NOT NULL,
        OportunidadId NVARCHAR(300) NOT NULL,
        Encuesta NVARCHAR(200) NULL,
        Factor NVARCHAR(250) NULL,
        Area NVARCHAR(250) NULL,
        Alcance NVARCHAR(300) NULL,
        PreguntaCritica NVARCHAR(1500) NULL,
        Motivo NVARCHAR(MAX) NULL,
        FiltrosDemograficosJson NVARCHAR(MAX) NULL,
        ContextoHash CHAR(64) NOT NULL,
        Activo BIT NOT NULL
            CONSTRAINT DF_CLI_PlanAccionClimaOportunidad_Activo DEFAULT (1),
        CreadoPor NVARCHAR(120) NULL,
        CreadoEn DATETIME2(3) NOT NULL
            CONSTRAINT DF_CLI_PlanAccionClimaOportunidad_CreadoEn DEFAULT (SYSUTCDATETIME()),
        ActualizadoPor NVARCHAR(120) NULL,
        ActualizadoEn DATETIME2(3) NULL,
        CONSTRAINT FK_CLI_PlanAccionClimaOportunidad_Organizaciones
            FOREIGN KEY (IdOrganizacion) REFERENCES dbo.Organizaciones(Id),
        CONSTRAINT FK_CLI_PlanAccionClimaOportunidad_FlujosClima
            FOREIGN KEY (IdFlujo) REFERENCES dbo.FlujosClima(Id),
        CONSTRAINT CK_CLI_PlanAccionClimaOportunidad_FiltrosJson
            CHECK (FiltrosDemograficosJson IS NULL OR ISJSON(FiltrosDemograficosJson) = 1)
    );
END
GO

IF NOT EXISTS (
    SELECT 1
    FROM sys.indexes
    WHERE name = N'UX_CLI_PlanAccionClimaOportunidad_Activa'
      AND object_id = OBJECT_ID(N'dbo.CLI_PlanAccionClimaOportunidad')
)
BEGIN
    CREATE UNIQUE INDEX UX_CLI_PlanAccionClimaOportunidad_Activa
        ON dbo.CLI_PlanAccionClimaOportunidad
            (IdOrganizacion, IdFlujo, OportunidadId, ContextoHash)
        WHERE Activo = 1;
END
GO

IF OBJECT_ID(N'dbo.CLI_PlanAccionClima', N'U') IS NULL
BEGIN
    CREATE TABLE dbo.CLI_PlanAccionClima (
        IdPlanAccionClima BIGINT IDENTITY(1,1) NOT NULL
            CONSTRAINT PK_CLI_PlanAccionClima PRIMARY KEY,
        IdOportunidadClima BIGINT NOT NULL,
        Accion NVARCHAR(MAX) NOT NULL,
        Recursos NVARCHAR(MAX) NULL,
        Kpi NVARCHAR(500) NULL,
        Patrocinador NVARCHAR(250) NULL,
        Plazo NVARCHAR(120) NULL,
        FechaLimite DATE NULL,
        FrecuenciaSeguimiento NVARCHAR(120) NULL,
        Validacion NVARCHAR(MAX) NULL,
        Evidencia NVARCHAR(MAX) NULL,
        IdEstadoPlanAccionClima INT NOT NULL,
        Prioridad NVARCHAR(20) NOT NULL,
        Activo BIT NOT NULL
            CONSTRAINT DF_CLI_PlanAccionClima_Activo DEFAULT (1),
        CreadoPor NVARCHAR(120) NULL,
        CreadoEn DATETIME2(3) NOT NULL
            CONSTRAINT DF_CLI_PlanAccionClima_CreadoEn DEFAULT (SYSUTCDATETIME()),
        ActualizadoPor NVARCHAR(120) NULL,
        ActualizadoEn DATETIME2(3) NULL,
        CONSTRAINT FK_CLI_PlanAccionClima_Oportunidad
            FOREIGN KEY (IdOportunidadClima)
            REFERENCES dbo.CLI_PlanAccionClimaOportunidad(IdOportunidadClima),
        CONSTRAINT FK_CLI_PlanAccionClima_Estado
            FOREIGN KEY (IdEstadoPlanAccionClima)
            REFERENCES dbo.CLI_CatEstadoPlanAccionClima(IdEstadoPlanAccionClima),
        CONSTRAINT CK_CLI_PlanAccionClima_Prioridad
            CHECK (Prioridad IN (N'ALTA', N'MEDIA', N'BAJA'))
    );
END
GO

IF OBJECT_ID(N'dbo.CLI_PlanAccionClimaResponsable', N'U') IS NULL
BEGIN
    CREATE TABLE dbo.CLI_PlanAccionClimaResponsable (
        IdPlanAccionClima BIGINT NOT NULL,
        IdEmpleado INT NOT NULL,
        CreadoPor NVARCHAR(120) NULL,
        CreadoEn DATETIME2(3) NOT NULL
            CONSTRAINT DF_CLI_PlanAccionClimaResponsable_CreadoEn DEFAULT (SYSUTCDATETIME()),
        CONSTRAINT PK_CLI_PlanAccionClimaResponsable
            PRIMARY KEY (IdPlanAccionClima, IdEmpleado),
        CONSTRAINT FK_CLI_PlanAccionClimaResponsable_Plan
            FOREIGN KEY (IdPlanAccionClima)
            REFERENCES dbo.CLI_PlanAccionClima(IdPlanAccionClima),
        CONSTRAINT FK_CLI_PlanAccionClimaResponsable_Empleado
            FOREIGN KEY (IdEmpleado)
            REFERENCES dbo.Empleados(Id)
    );
END
GO

IF OBJECT_ID(N'dbo.CLI_PlanAccionClimaTarea', N'U') IS NULL
BEGIN
    CREATE TABLE dbo.CLI_PlanAccionClimaTarea (
        IdTarea BIGINT IDENTITY(1,1) NOT NULL
            CONSTRAINT PK_CLI_PlanAccionClimaTarea PRIMARY KEY,
        IdPlanAccionClima BIGINT NOT NULL,
        Titulo NVARCHAR(500) NOT NULL,
        Responsable NVARCHAR(250) NULL,
        Entregable NVARCHAR(500) NULL,
        FechaLimite DATE NULL,
        Evidencia NVARCHAR(MAX) NULL,
        Completada BIT NOT NULL
            CONSTRAINT DF_CLI_PlanAccionClimaTarea_Completada DEFAULT (0),
        Orden INT NOT NULL
            CONSTRAINT DF_CLI_PlanAccionClimaTarea_Orden DEFAULT (1),
        CreadoPor NVARCHAR(120) NULL,
        CreadoEn DATETIME2(3) NOT NULL
            CONSTRAINT DF_CLI_PlanAccionClimaTarea_CreadoEn DEFAULT (SYSUTCDATETIME()),
        ActualizadoPor NVARCHAR(120) NULL,
        ActualizadoEn DATETIME2(3) NULL,
        CONSTRAINT FK_CLI_PlanAccionClimaTarea_Plan
            FOREIGN KEY (IdPlanAccionClima)
            REFERENCES dbo.CLI_PlanAccionClima(IdPlanAccionClima)
    );
END
GO

IF OBJECT_ID(N'dbo.CLI_PlanAccionClimaSeguimiento', N'U') IS NULL
BEGIN
    CREATE TABLE dbo.CLI_PlanAccionClimaSeguimiento (
        IdSeguimiento BIGINT IDENTITY(1,1) NOT NULL
            CONSTRAINT PK_CLI_PlanAccionClimaSeguimiento PRIMARY KEY,
        IdPlanAccionClima BIGINT NOT NULL,
        Fecha DATE NOT NULL,
        Comentario NVARCHAR(MAX) NOT NULL,
        AvancePct DECIMAL(5,2) NOT NULL,
        CreadoPor NVARCHAR(120) NULL,
        CreadoEn DATETIME2(3) NOT NULL
            CONSTRAINT DF_CLI_PlanAccionClimaSeguimiento_CreadoEn DEFAULT (SYSUTCDATETIME()),
        CONSTRAINT FK_CLI_PlanAccionClimaSeguimiento_Plan
            FOREIGN KEY (IdPlanAccionClima)
            REFERENCES dbo.CLI_PlanAccionClima(IdPlanAccionClima),
        CONSTRAINT CK_CLI_PlanAccionClimaSeguimiento_Avance
            CHECK (AvancePct >= 0 AND AvancePct <= 100)
    );
END
GO

IF NOT EXISTS (
    SELECT 1 FROM sys.indexes
    WHERE name = N'IX_CLI_PlanAccionClima_Oportunidad'
      AND object_id = OBJECT_ID(N'dbo.CLI_PlanAccionClima')
)
BEGIN
    CREATE INDEX IX_CLI_PlanAccionClima_Oportunidad
        ON dbo.CLI_PlanAccionClima(IdOportunidadClima, Activo);
END
GO

IF NOT EXISTS (
    SELECT 1 FROM sys.indexes
    WHERE name = N'IX_CLI_PlanAccionClimaResponsable_Empleado'
      AND object_id = OBJECT_ID(N'dbo.CLI_PlanAccionClimaResponsable')
)
BEGIN
    CREATE INDEX IX_CLI_PlanAccionClimaResponsable_Empleado
        ON dbo.CLI_PlanAccionClimaResponsable(IdEmpleado);
END
GO

IF NOT EXISTS (
    SELECT 1 FROM sys.indexes
    WHERE name = N'IX_CLI_PlanAccionClimaTarea_Plan'
      AND object_id = OBJECT_ID(N'dbo.CLI_PlanAccionClimaTarea')
)
BEGIN
    CREATE INDEX IX_CLI_PlanAccionClimaTarea_Plan
        ON dbo.CLI_PlanAccionClimaTarea(IdPlanAccionClima, Orden, IdTarea);
END
GO

IF NOT EXISTS (
    SELECT 1 FROM sys.indexes
    WHERE name = N'IX_CLI_PlanAccionClimaSeguimiento_Plan'
      AND object_id = OBJECT_ID(N'dbo.CLI_PlanAccionClimaSeguimiento')
)
BEGIN
    CREATE INDEX IX_CLI_PlanAccionClimaSeguimiento_Plan
        ON dbo.CLI_PlanAccionClimaSeguimiento(IdPlanAccionClima, Fecha, IdSeguimiento);
END
GO

CREATE OR ALTER PROCEDURE dbo.CLI_sp_PlanesAccionClima_Obtener
    @IdOrganizacion INT,
    @IdFlujo INT,
    @FiltrosDemograficosJson NVARCHAR(MAX) = NULL,
    @IdPlanAccion BIGINT = NULL
AS
BEGIN
    SET NOCOUNT ON;

    IF @IdOrganizacion IS NULL OR @IdOrganizacion <= 0
       OR @IdFlujo IS NULL OR @IdFlujo <= 0
       OR NOT EXISTS (
            SELECT 1
            FROM dbo.FlujosClima
            WHERE Id = @IdFlujo
              AND IdOrganizacion = @IdOrganizacion
       )
        THROW 56101, 'No existe el flujo de clima indicado para la organizacion.', 1;

    IF @FiltrosDemograficosJson IS NOT NULL
       AND ISJSON(@FiltrosDemograficosJson) <> 1
        THROW 56102, 'Los filtros demograficos deben enviarse como JSON valido.', 1;

    DECLARE @ContextoHash CHAR(64) = NULL;

    IF @FiltrosDemograficosJson IS NOT NULL
        SET @ContextoHash = CONVERT(CHAR(64), HASHBYTES('SHA2_256', CONVERT(VARBINARY(MAX), @FiltrosDemograficosJson)), 2);

    SELECT
        p.IdPlanAccionClima AS id,
        o.OportunidadId AS oportunidadId,
        o.IdOportunidadClima AS oportunidadRegistroId,
        o.Encuesta AS encuesta,
        o.Factor AS factor,
        o.Area AS area,
        o.Alcance AS alcance,
        o.PreguntaCritica AS preguntaCritica,
        o.Motivo AS motivo,
        JSON_QUERY(ISNULL(o.FiltrosDemograficosJson, N'[]')) AS filtrosDemograficos,
        p.Accion AS accion,
        p.Recursos AS recursos,
        p.Kpi AS kpi,
        p.Patrocinador AS patrocinador,
        p.Plazo AS plazo,
        p.FechaLimite AS fechaLimite,
        p.FrecuenciaSeguimiento AS frecuenciaSeguimiento,
        ep.Codigo AS estado,
        p.Prioridad AS prioridad,
        p.Validacion AS validacion,
        p.Evidencia AS evidencia,
        JSON_QUERY((
            SELECT
                r.IdEmpleado AS idEmpleado,
                LTRIM(RTRIM(CONCAT(ISNULL(e.Nombres, N''), N' ', ISNULL(e.Apellidos, N'')))) AS nombreCompleto,
                e.Cargo AS cargo
            FROM dbo.CLI_PlanAccionClimaResponsable r
            INNER JOIN dbo.Empleados e
                ON e.Id = r.IdEmpleado
            WHERE r.IdPlanAccionClima = p.IdPlanAccionClima
            ORDER BY nombreCompleto, r.IdEmpleado
            FOR JSON PATH
        )) AS responsables,
        JSON_QUERY((
            SELECT
                t.IdTarea AS id,
                t.Titulo AS titulo,
                t.Responsable AS responsable,
                t.Entregable AS entregable,
                t.FechaLimite AS fechaLimite,
                t.Evidencia AS evidencia,
                t.Completada AS completada
            FROM dbo.CLI_PlanAccionClimaTarea t
            WHERE t.IdPlanAccionClima = p.IdPlanAccionClima
            ORDER BY t.Orden, t.IdTarea
            FOR JSON PATH
        )) AS tareas,
        JSON_QUERY((
            SELECT
                s.IdSeguimiento AS id,
                s.Fecha AS fecha,
                s.Comentario AS comentario,
                s.AvancePct AS avancePct,
                s.CreadoPor AS creadoPor,
                s.CreadoEn AS creadoEn
            FROM dbo.CLI_PlanAccionClimaSeguimiento s
            WHERE s.IdPlanAccionClima = p.IdPlanAccionClima
            ORDER BY s.Fecha, s.IdSeguimiento
            FOR JSON PATH
        )) AS seguimientos,
        p.CreadoEn AS creadoEn,
        p.ActualizadoEn AS actualizadoEn
    FROM dbo.CLI_PlanAccionClima p
    INNER JOIN dbo.CLI_PlanAccionClimaOportunidad o
        ON o.IdOportunidadClima = p.IdOportunidadClima
    INNER JOIN dbo.CLI_CatEstadoPlanAccionClima ep
        ON ep.IdEstadoPlanAccionClima = p.IdEstadoPlanAccionClima
    WHERE p.Activo = 1
      AND o.Activo = 1
      AND o.IdOrganizacion = @IdOrganizacion
      AND o.IdFlujo = @IdFlujo
      AND (@IdPlanAccion IS NULL OR p.IdPlanAccionClima = @IdPlanAccion)
      AND (@ContextoHash IS NULL OR o.ContextoHash = @ContextoHash)
    ORDER BY
        CASE p.Prioridad
            WHEN N'ALTA' THEN 1
            WHEN N'MEDIA' THEN 2
            ELSE 3
        END,
        p.FechaLimite,
        p.IdPlanAccionClima DESC;
END
GO

CREATE OR ALTER PROCEDURE dbo.CLI_sp_PlanesAccionClima_Guardar
    @IdPlanAccion BIGINT = NULL,
    @IdOrganizacion INT,
    @IdFlujo INT,
    @OportunidadId NVARCHAR(300),
    @Encuesta NVARCHAR(200) = NULL,
    @Factor NVARCHAR(250) = NULL,
    @Area NVARCHAR(250) = NULL,
    @Alcance NVARCHAR(300) = NULL,
    @PreguntaCritica NVARCHAR(1500) = NULL,
    @Motivo NVARCHAR(MAX) = NULL,
    @Prioridad NVARCHAR(20),
    @Accion NVARCHAR(MAX),
    @Recursos NVARCHAR(MAX) = NULL,
    @Kpi NVARCHAR(500) = NULL,
    @Patrocinador NVARCHAR(250) = NULL,
    @Plazo NVARCHAR(120) = NULL,
    @FechaLimite DATE = NULL,
    @FrecuenciaSeguimiento NVARCHAR(120) = NULL,
    @Validacion NVARCHAR(MAX) = NULL,
    @Evidencia NVARCHAR(MAX) = NULL,
    @Estado NVARCHAR(30) = N'SIN_INICIAR',
    @ResponsableEmpleadoIdsJson NVARCHAR(MAX) = N'[]',
    @FiltrosDemograficosJson NVARCHAR(MAX) = N'[]',
    @ContextoHash CHAR(64) = NULL,
    @TareasJson NVARCHAR(MAX) = NULL,
    @Usuario NVARCHAR(120) = NULL
AS
BEGIN
    SET NOCOUNT ON;

    IF @IdOrganizacion IS NULL OR @IdOrganizacion <= 0
       OR @IdFlujo IS NULL OR @IdFlujo <= 0
       OR NOT EXISTS (
            SELECT 1
            FROM dbo.FlujosClima
            WHERE Id = @IdFlujo
              AND IdOrganizacion = @IdOrganizacion
       )
        THROW 56101, 'No existe el flujo de clima indicado para la organizacion.', 1;

    IF NULLIF(LTRIM(RTRIM(@OportunidadId)), N'') IS NULL
        THROW 56103, 'El identificador de oportunidad es obligatorio.', 1;

    IF NULLIF(LTRIM(RTRIM(@Accion)), N'') IS NULL
        THROW 56104, 'La accion del plan es obligatoria.', 1;

    IF @Prioridad NOT IN (N'ALTA', N'MEDIA', N'BAJA')
        THROW 56105, 'La prioridad no es valida.', 1;

    DECLARE @IdEstadoPlanAccionClima INT;

    SELECT @IdEstadoPlanAccionClima = IdEstadoPlanAccionClima
    FROM dbo.CLI_CatEstadoPlanAccionClima
    WHERE Codigo = @Estado
      AND Activo = 1;

    IF @IdEstadoPlanAccionClima IS NULL
        THROW 56106, 'El estado del plan no es valido.', 1;

    IF @ResponsableEmpleadoIdsJson IS NULL
        SET @ResponsableEmpleadoIdsJson = N'[]';

    IF ISJSON(@ResponsableEmpleadoIdsJson) <> 1
        THROW 56107, 'Los responsables deben enviarse como JSON valido.', 1;

    IF @FiltrosDemograficosJson IS NULL
        SET @FiltrosDemograficosJson = N'[]';

    IF ISJSON(@FiltrosDemograficosJson) <> 1
        THROW 56102, 'Los filtros demograficos deben enviarse como JSON valido.', 1;

    IF @TareasJson IS NOT NULL AND ISJSON(@TareasJson) <> 1
        THROW 56108, 'Las tareas deben enviarse como JSON valido.', 1;

    IF @ContextoHash IS NULL
        SET @ContextoHash = CONVERT(CHAR(64), HASHBYTES('SHA2_256', CONVERT(VARBINARY(MAX), @FiltrosDemograficosJson)), 2);

    DECLARE @Responsables TABLE (IdEmpleado INT NOT NULL PRIMARY KEY);

    IF EXISTS (
        SELECT 1
        FROM OPENJSON(@ResponsableEmpleadoIdsJson)
        WHERE TRY_CONVERT(INT, [value]) IS NULL
           OR TRY_CONVERT(INT, [value]) <= 0
    )
        THROW 56109, 'Uno o mas responsables no son empleados validos.', 1;

    INSERT INTO @Responsables (IdEmpleado)
    SELECT DISTINCT TRY_CONVERT(INT, [value])
    FROM OPENJSON(@ResponsableEmpleadoIdsJson);

    IF EXISTS (
        SELECT 1
        FROM @Responsables r
        WHERE NOT EXISTS (
            SELECT 1
            FROM dbo.Empleados e
            WHERE e.Id = r.IdEmpleado
              AND e.IdOrganizacion = @IdOrganizacion
        )
    )
        THROW 56109, 'Uno o mas responsables no pertenecen a la organizacion.', 1;

    DECLARE @Tareas TABLE (
        IdTarea BIGINT NULL,
        Titulo NVARCHAR(500) NOT NULL,
        Responsable NVARCHAR(250) NULL,
        Entregable NVARCHAR(500) NULL,
        FechaLimite DATE NULL,
        Evidencia NVARCHAR(MAX) NULL,
        Completada BIT NOT NULL,
        Orden INT NOT NULL
    );

    IF @TareasJson IS NOT NULL
    BEGIN
        INSERT INTO @Tareas (
            IdTarea,
            Titulo,
            Responsable,
            Entregable,
            FechaLimite,
            Evidencia,
            Completada,
            Orden
        )
        SELECT
            TRY_CONVERT(BIGINT, JSON_VALUE([value], '$.id')),
            LTRIM(RTRIM(JSON_VALUE([value], '$.titulo'))),
            NULLIF(LTRIM(RTRIM(JSON_VALUE([value], '$.responsable'))), N''),
            NULLIF(LTRIM(RTRIM(JSON_VALUE([value], '$.entregable'))), N''),
            TRY_CONVERT(DATE, JSON_VALUE([value], '$.fechaLimite')),
            JSON_VALUE([value], '$.evidencia'),
            ISNULL(TRY_CONVERT(BIT, JSON_VALUE([value], '$.completada')), 0),
            ISNULL(TRY_CONVERT(INT, JSON_VALUE([value], '$.orden')), ROW_NUMBER() OVER (ORDER BY [key]))
        FROM OPENJSON(@TareasJson);

        IF EXISTS (SELECT 1 FROM @Tareas WHERE NULLIF(Titulo, N'') IS NULL)
            THROW 56110, 'Todas las tareas deben tener titulo.', 1;

        IF EXISTS (
            SELECT 1
            FROM @Tareas src
            WHERE src.IdTarea IS NOT NULL
              AND NOT EXISTS (
                  SELECT 1
                  FROM dbo.CLI_PlanAccionClimaTarea t
                  WHERE t.IdTarea = src.IdTarea
                    AND t.IdPlanAccionClima = @IdPlanAccion
              )
        )
            THROW 56113, 'No existe una de las tareas indicadas.', 1;
    END

    IF EXISTS (
        SELECT 1
        FROM dbo.CLI_PlanAccionClima p
        INNER JOIN dbo.CLI_PlanAccionClimaOportunidad o
            ON o.IdOportunidadClima = p.IdOportunidadClima
        WHERE p.Activo = 1
          AND o.Activo = 1
          AND o.IdOrganizacion = @IdOrganizacion
          AND o.IdFlujo = @IdFlujo
          AND o.OportunidadId = @OportunidadId
          AND o.ContextoHash = @ContextoHash
          AND (@IdPlanAccion IS NULL OR p.IdPlanAccionClima <> @IdPlanAccion)
    )
        THROW 56111, 'Ya existe un plan activo para la misma oportunidad y contexto demografico.', 1;

    DECLARE @IdOportunidadClima BIGINT;

    BEGIN TRY
        BEGIN TRANSACTION;

        IF @IdPlanAccion IS NULL
        BEGIN
            INSERT INTO dbo.CLI_PlanAccionClimaOportunidad (
                IdOrganizacion,
                IdFlujo,
                OportunidadId,
                Encuesta,
                Factor,
                Area,
                Alcance,
                PreguntaCritica,
                Motivo,
                FiltrosDemograficosJson,
                ContextoHash,
                CreadoPor
            )
            VALUES (
                @IdOrganizacion,
                @IdFlujo,
                @OportunidadId,
                @Encuesta,
                @Factor,
                @Area,
                @Alcance,
                @PreguntaCritica,
                @Motivo,
                @FiltrosDemograficosJson,
                @ContextoHash,
                @Usuario
            );

            SET @IdOportunidadClima = SCOPE_IDENTITY();

            INSERT INTO dbo.CLI_PlanAccionClima (
                IdOportunidadClima,
                Accion,
                Recursos,
                Kpi,
                Patrocinador,
                Plazo,
                FechaLimite,
                FrecuenciaSeguimiento,
                Validacion,
                Evidencia,
                IdEstadoPlanAccionClima,
                Prioridad,
                CreadoPor
            )
            VALUES (
                @IdOportunidadClima,
                @Accion,
                @Recursos,
                @Kpi,
                @Patrocinador,
                @Plazo,
                @FechaLimite,
                @FrecuenciaSeguimiento,
                @Validacion,
                @Evidencia,
                @IdEstadoPlanAccionClima,
                @Prioridad,
                @Usuario
            );

            SET @IdPlanAccion = SCOPE_IDENTITY();
        END
        ELSE
        BEGIN
            SELECT @IdOportunidadClima = p.IdOportunidadClima
            FROM dbo.CLI_PlanAccionClima p
            INNER JOIN dbo.CLI_PlanAccionClimaOportunidad o
                ON o.IdOportunidadClima = p.IdOportunidadClima
            WHERE p.IdPlanAccionClima = @IdPlanAccion
              AND p.Activo = 1
              AND o.Activo = 1
              AND o.IdOrganizacion = @IdOrganizacion
              AND o.IdFlujo = @IdFlujo;

            IF @IdOportunidadClima IS NULL
                THROW 56112, 'No existe el plan de accion indicado.', 1;

            UPDATE dbo.CLI_PlanAccionClimaOportunidad
            SET
                OportunidadId = @OportunidadId,
                Encuesta = @Encuesta,
                Factor = @Factor,
                Area = @Area,
                Alcance = @Alcance,
                PreguntaCritica = @PreguntaCritica,
                Motivo = @Motivo,
                FiltrosDemograficosJson = @FiltrosDemograficosJson,
                ContextoHash = @ContextoHash,
                ActualizadoPor = @Usuario,
                ActualizadoEn = SYSUTCDATETIME()
            WHERE IdOportunidadClima = @IdOportunidadClima;

            UPDATE dbo.CLI_PlanAccionClima
            SET
                Accion = @Accion,
                Recursos = @Recursos,
                Kpi = @Kpi,
                Patrocinador = @Patrocinador,
                Plazo = @Plazo,
                FechaLimite = @FechaLimite,
                FrecuenciaSeguimiento = @FrecuenciaSeguimiento,
                Validacion = @Validacion,
                Evidencia = @Evidencia,
                IdEstadoPlanAccionClima = @IdEstadoPlanAccionClima,
                Prioridad = @Prioridad,
                ActualizadoPor = @Usuario,
                ActualizadoEn = SYSUTCDATETIME()
            WHERE IdPlanAccionClima = @IdPlanAccion;
        END

        DELETE r
        FROM dbo.CLI_PlanAccionClimaResponsable r
        WHERE r.IdPlanAccionClima = @IdPlanAccion
          AND NOT EXISTS (
              SELECT 1
              FROM @Responsables src
              WHERE src.IdEmpleado = r.IdEmpleado
          );

        INSERT INTO dbo.CLI_PlanAccionClimaResponsable (
            IdPlanAccionClima,
            IdEmpleado,
            CreadoPor
        )
        SELECT
            @IdPlanAccion,
            src.IdEmpleado,
            @Usuario
        FROM @Responsables src
        WHERE NOT EXISTS (
            SELECT 1
            FROM dbo.CLI_PlanAccionClimaResponsable r
            WHERE r.IdPlanAccionClima = @IdPlanAccion
              AND r.IdEmpleado = src.IdEmpleado
        );

        IF @TareasJson IS NOT NULL
        BEGIN
            DELETE t
            FROM dbo.CLI_PlanAccionClimaTarea t
            WHERE t.IdPlanAccionClima = @IdPlanAccion
              AND NOT EXISTS (
                  SELECT 1
                  FROM @Tareas src
                  WHERE src.IdTarea IS NOT NULL
                    AND src.IdTarea = t.IdTarea
              );

            UPDATE t
            SET
                Titulo = src.Titulo,
                Responsable = src.Responsable,
                Entregable = src.Entregable,
                FechaLimite = src.FechaLimite,
                Evidencia = src.Evidencia,
                Completada = src.Completada,
                Orden = src.Orden,
                ActualizadoPor = @Usuario,
                ActualizadoEn = SYSUTCDATETIME()
            FROM dbo.CLI_PlanAccionClimaTarea t
            INNER JOIN @Tareas src
                ON src.IdTarea = t.IdTarea
            WHERE t.IdPlanAccionClima = @IdPlanAccion;

            INSERT INTO dbo.CLI_PlanAccionClimaTarea (
                IdPlanAccionClima,
                Titulo,
                Responsable,
                Entregable,
                FechaLimite,
                Evidencia,
                Completada,
                Orden,
                CreadoPor
            )
            SELECT
                @IdPlanAccion,
                src.Titulo,
                src.Responsable,
                src.Entregable,
                src.FechaLimite,
                src.Evidencia,
                src.Completada,
                src.Orden,
                @Usuario
            FROM @Tareas src
            WHERE src.IdTarea IS NULL;
        END

        COMMIT TRANSACTION;
    END TRY
    BEGIN CATCH
        IF @@TRANCOUNT > 0
            ROLLBACK TRANSACTION;
        THROW;
    END CATCH;

    SELECT @IdPlanAccion AS id;
END
GO

CREATE OR ALTER PROCEDURE dbo.CLI_sp_PlanesAccionClima_Eliminar
    @IdOrganizacion INT,
    @IdFlujo INT,
    @IdPlanAccion BIGINT,
    @Usuario NVARCHAR(120) = NULL
AS
BEGIN
    SET NOCOUNT ON;

    DECLARE @IdOportunidadClima BIGINT;

    SELECT @IdOportunidadClima = p.IdOportunidadClima
    FROM dbo.CLI_PlanAccionClima p
    INNER JOIN dbo.CLI_PlanAccionClimaOportunidad o
        ON o.IdOportunidadClima = p.IdOportunidadClima
    WHERE p.IdPlanAccionClima = @IdPlanAccion
      AND o.IdOrganizacion = @IdOrganizacion
      AND o.IdFlujo = @IdFlujo;

    IF @IdOportunidadClima IS NULL
        THROW 56112, 'No existe el plan de accion indicado.', 1;

    BEGIN TRY
        BEGIN TRANSACTION;

        DELETE FROM dbo.CLI_PlanAccionClimaSeguimiento
        WHERE IdPlanAccionClima = @IdPlanAccion;

        DELETE FROM dbo.CLI_PlanAccionClimaTarea
        WHERE IdPlanAccionClima = @IdPlanAccion;

        DELETE FROM dbo.CLI_PlanAccionClimaResponsable
        WHERE IdPlanAccionClima = @IdPlanAccion;

        DELETE FROM dbo.CLI_PlanAccionClima
        WHERE IdPlanAccionClima = @IdPlanAccion;

        DELETE FROM dbo.CLI_PlanAccionClimaOportunidad
        WHERE IdOportunidadClima = @IdOportunidadClima;

        COMMIT TRANSACTION;
    END TRY
    BEGIN CATCH
        IF @@TRANCOUNT > 0
            ROLLBACK TRANSACTION;
        THROW;
    END CATCH;

    SELECT @IdPlanAccion AS id;
END
GO

CREATE OR ALTER PROCEDURE dbo.CLI_sp_PlanesAccionClima_Tarea_Guardar
    @IdOrganizacion INT,
    @IdFlujo INT,
    @IdPlanAccion BIGINT,
    @IdTarea BIGINT = NULL,
    @Titulo NVARCHAR(500),
    @Responsable NVARCHAR(250) = NULL,
    @Entregable NVARCHAR(500) = NULL,
    @FechaLimite DATE = NULL,
    @Evidencia NVARCHAR(MAX) = NULL,
    @Completada BIT = 0,
    @Usuario NVARCHAR(120) = NULL
AS
BEGIN
    SET NOCOUNT ON;

    IF NULLIF(LTRIM(RTRIM(@Titulo)), N'') IS NULL
        THROW 56110, 'La tarea debe tener titulo.', 1;

    IF NOT EXISTS (
        SELECT 1
        FROM dbo.CLI_PlanAccionClima p
        INNER JOIN dbo.CLI_PlanAccionClimaOportunidad o
            ON o.IdOportunidadClima = p.IdOportunidadClima
        WHERE p.IdPlanAccionClima = @IdPlanAccion
          AND p.Activo = 1
          AND o.Activo = 1
          AND o.IdOrganizacion = @IdOrganizacion
          AND o.IdFlujo = @IdFlujo
    )
        THROW 56112, 'No existe el plan de accion indicado.', 1;

    IF @IdTarea IS NULL
    BEGIN
        DECLARE @Orden INT;

        SELECT @Orden = ISNULL(MAX(Orden), 0) + 1
        FROM dbo.CLI_PlanAccionClimaTarea
        WHERE IdPlanAccionClima = @IdPlanAccion;

        INSERT INTO dbo.CLI_PlanAccionClimaTarea (
            IdPlanAccionClima,
            Titulo,
            Responsable,
            Entregable,
            FechaLimite,
            Evidencia,
            Completada,
            Orden,
            CreadoPor
        )
        VALUES (
            @IdPlanAccion,
            @Titulo,
            @Responsable,
            @Entregable,
            @FechaLimite,
            @Evidencia,
            ISNULL(@Completada, 0),
            @Orden,
            @Usuario
        );

        SET @IdTarea = SCOPE_IDENTITY();
    END
    ELSE
    BEGIN
        UPDATE dbo.CLI_PlanAccionClimaTarea
        SET
            Titulo = @Titulo,
            Responsable = @Responsable,
            Entregable = @Entregable,
            FechaLimite = @FechaLimite,
            Evidencia = @Evidencia,
            Completada = ISNULL(@Completada, 0),
            ActualizadoPor = @Usuario,
            ActualizadoEn = SYSUTCDATETIME()
        WHERE IdTarea = @IdTarea
          AND IdPlanAccionClima = @IdPlanAccion;

        IF @@ROWCOUNT = 0
            THROW 56113, 'No existe la tarea indicada.', 1;
    END

    SELECT @IdTarea AS id;
END
GO

CREATE OR ALTER PROCEDURE dbo.CLI_sp_PlanesAccionClima_Tarea_Eliminar
    @IdOrganizacion INT,
    @IdFlujo INT,
    @IdPlanAccion BIGINT,
    @IdTarea BIGINT
AS
BEGIN
    SET NOCOUNT ON;

    DELETE t
    FROM dbo.CLI_PlanAccionClimaTarea t
    INNER JOIN dbo.CLI_PlanAccionClima p
        ON p.IdPlanAccionClima = t.IdPlanAccionClima
    INNER JOIN dbo.CLI_PlanAccionClimaOportunidad o
        ON o.IdOportunidadClima = p.IdOportunidadClima
    WHERE t.IdTarea = @IdTarea
      AND t.IdPlanAccionClima = @IdPlanAccion
      AND o.IdOrganizacion = @IdOrganizacion
      AND o.IdFlujo = @IdFlujo;

    IF @@ROWCOUNT = 0
        THROW 56113, 'No existe la tarea indicada.', 1;

    SELECT @IdTarea AS id;
END
GO

CREATE OR ALTER PROCEDURE dbo.CLI_sp_PlanesAccionClima_Seguimiento_Guardar
    @IdOrganizacion INT,
    @IdFlujo INT,
    @IdPlanAccion BIGINT,
    @Fecha DATE,
    @Comentario NVARCHAR(MAX),
    @AvancePct DECIMAL(5,2),
    @Usuario NVARCHAR(120) = NULL
AS
BEGIN
    SET NOCOUNT ON;

    IF @Fecha IS NULL
        THROW 56114, 'La fecha del seguimiento es obligatoria.', 1;

    IF NULLIF(LTRIM(RTRIM(@Comentario)), N'') IS NULL
        THROW 56115, 'El comentario del seguimiento es obligatorio.', 1;

    IF @AvancePct IS NULL OR @AvancePct < 0 OR @AvancePct > 100
        THROW 56116, 'El avance debe estar entre 0 y 100.', 1;

    IF NOT EXISTS (
        SELECT 1
        FROM dbo.CLI_PlanAccionClima p
        INNER JOIN dbo.CLI_PlanAccionClimaOportunidad o
            ON o.IdOportunidadClima = p.IdOportunidadClima
        WHERE p.IdPlanAccionClima = @IdPlanAccion
          AND p.Activo = 1
          AND o.Activo = 1
          AND o.IdOrganizacion = @IdOrganizacion
          AND o.IdFlujo = @IdFlujo
    )
        THROW 56112, 'No existe el plan de accion indicado.', 1;

    INSERT INTO dbo.CLI_PlanAccionClimaSeguimiento (
        IdPlanAccionClima,
        Fecha,
        Comentario,
        AvancePct,
        CreadoPor
    )
    VALUES (
        @IdPlanAccion,
        @Fecha,
        @Comentario,
        @AvancePct,
        @Usuario
    );

    SELECT SCOPE_IDENTITY() AS id;
END
GO

CREATE OR ALTER PROCEDURE dbo.CLI_sp_PlanesAccionClima_Seguimientos_Obtener
    @IdOrganizacion INT,
    @IdFlujo INT,
    @IdPlanAccion BIGINT
AS
BEGIN
    SET NOCOUNT ON;

    IF NOT EXISTS (
        SELECT 1
        FROM dbo.CLI_PlanAccionClima p
        INNER JOIN dbo.CLI_PlanAccionClimaOportunidad o
            ON o.IdOportunidadClima = p.IdOportunidadClima
        WHERE p.IdPlanAccionClima = @IdPlanAccion
          AND p.Activo = 1
          AND o.Activo = 1
          AND o.IdOrganizacion = @IdOrganizacion
          AND o.IdFlujo = @IdFlujo
    )
        THROW 56112, 'No existe el plan de accion indicado.', 1;

    SELECT
        s.IdSeguimiento AS id,
        s.Fecha AS fecha,
        s.Comentario AS comentario,
        s.AvancePct AS avancePct,
        s.CreadoPor AS creadoPor,
        s.CreadoEn AS creadoEn
    FROM dbo.CLI_PlanAccionClimaSeguimiento s
    WHERE s.IdPlanAccionClima = @IdPlanAccion
    ORDER BY s.Fecha, s.IdSeguimiento;
END
GO

CREATE OR ALTER PROCEDURE dbo.CLI_sp_PlanAccionClima_Portal_Obtener
    @IdEmpleado INT,
    @IdFlujo INT,
    @IdPlanAccion BIGINT
AS
BEGIN
    SET NOCOUNT ON;

    IF @IdEmpleado IS NULL OR @IdEmpleado <= 0
       OR @IdFlujo IS NULL OR @IdFlujo <= 0
       OR @IdPlanAccion IS NULL OR @IdPlanAccion <= 0
        THROW 56201, 'No se encontro el plan de accion solicitado.', 1;

    IF NOT EXISTS (
        SELECT 1
        FROM dbo.CLI_PlanAccionClima p
        INNER JOIN dbo.CLI_PlanAccionClimaOportunidad o
            ON o.IdOportunidadClima = p.IdOportunidadClima
        INNER JOIN dbo.CLI_PlanAccionClimaResponsable r
            ON r.IdPlanAccionClima = p.IdPlanAccionClima
        WHERE p.IdPlanAccionClima = @IdPlanAccion
          AND p.Activo = 1
          AND o.Activo = 1
          AND o.IdFlujo = @IdFlujo
          AND r.IdEmpleado = @IdEmpleado
    )
        THROW 56201, 'No se encontro el plan de accion solicitado.', 1;

    DECLARE @DataJson NVARCHAR(MAX);

    SELECT @DataJson = (
        SELECT
            JSON_QUERY((
                SELECT
                    e.Id AS id,
                    NULLIF(LTRIM(RTRIM(CONCAT(ISNULL(e.Nombres, N''), N' ', ISNULL(e.Apellidos, N'')))), N'') AS nombreCompleto,
                    UPPER(CONCAT(
                        LEFT(NULLIF(LTRIM(RTRIM(ISNULL(e.Nombres, N''))), N''), 1),
                        LEFT(NULLIF(LTRIM(RTRIM(ISNULL(e.Apellidos, N''))), N''), 1)
                    )) AS iniciales,
                    e.Cargo AS cargo,
                    e.Email AS email,
                    org.Nombre AS organizacion
                FOR JSON PATH, WITHOUT_ARRAY_WRAPPER
            )) AS responsable,
            JSON_QUERY((
                SELECT
                    f.Id AS id,
                    f.Nombre AS nombre
                FOR JSON PATH, WITHOUT_ARRAY_WRAPPER
            )) AS clima,
            JSON_QUERY((
                SELECT
                    p.IdPlanAccionClima AS id,
                    o.Encuesta AS encuesta,
                    o.Factor AS factor,
                    o.Area AS area,
                    o.Alcance AS alcance,
                    o.PreguntaCritica AS preguntaCritica,
                    o.Motivo AS motivo,
                    p.Accion AS accion,
                    p.Recursos AS recursos,
                    p.Kpi AS kpi,
                    p.Patrocinador AS patrocinador,
                    p.Plazo AS plazo,
                    p.FechaLimite AS fechaLimite,
                    p.FrecuenciaSeguimiento AS frecuenciaSeguimiento,
                    p.Validacion AS validacion,
                    p.Evidencia AS evidencia,
                    p.Prioridad AS prioridad,
                    ep.Codigo AS estadoCodigo,
                    ep.Nombre AS estadoNombre,
                    CAST(CASE
                        WHEN prog.TotalTareas = 0 THEN 0
                        ELSE (100.0 * prog.TareasCompletadas / prog.TotalTareas)
                    END AS DECIMAL(5,2)) AS progresoPct,
                    prog.TotalTareas AS totalTareas,
                    prog.TareasCompletadas AS tareasCompletadas,
                    CAST(1 AS BIT) AS puedeEditar
                FOR JSON PATH, WITHOUT_ARRAY_WRAPPER
            )) AS [plan],
            JSON_QUERY((
                SELECT
                    er.Id AS idEmpleado,
                    NULLIF(LTRIM(RTRIM(CONCAT(ISNULL(er.Nombres, N''), N' ', ISNULL(er.Apellidos, N'')))), N'') AS nombreCompleto,
                    er.Cargo AS cargo
                FROM dbo.CLI_PlanAccionClimaResponsable pr
                INNER JOIN dbo.Empleados er
                    ON er.Id = pr.IdEmpleado
                WHERE pr.IdPlanAccionClima = p.IdPlanAccionClima
                ORDER BY nombreCompleto, er.Id
                FOR JSON PATH
            )) AS responsables,
            JSON_QUERY((
                SELECT
                    t.IdTarea AS id,
                    t.Titulo AS titulo,
                    t.Responsable AS responsable,
                    t.Entregable AS entregable,
                    t.FechaLimite AS fechaLimite,
                    t.Evidencia AS evidencia,
                    t.Completada AS completada,
                    t.Orden AS orden,
                    CAST(1 AS BIT) AS puedeEditar
                FROM dbo.CLI_PlanAccionClimaTarea t
                WHERE t.IdPlanAccionClima = p.IdPlanAccionClima
                ORDER BY t.Orden, t.IdTarea
                FOR JSON PATH
            )) AS tareas,
            JSON_QUERY((
                SELECT
                    s.IdSeguimiento AS id,
                    s.Fecha AS fecha,
                    s.Comentario AS comentario,
                    s.AvancePct AS avancePct,
                    s.CreadoEn AS creadoEn
                FROM dbo.CLI_PlanAccionClimaSeguimiento s
                WHERE s.IdPlanAccionClima = p.IdPlanAccionClima
                ORDER BY s.Fecha, s.IdSeguimiento
                FOR JSON PATH
            )) AS seguimientos
        FROM dbo.CLI_PlanAccionClima p
        INNER JOIN dbo.CLI_PlanAccionClimaOportunidad o
            ON o.IdOportunidadClima = p.IdOportunidadClima
        INNER JOIN dbo.CLI_CatEstadoPlanAccionClima ep
            ON ep.IdEstadoPlanAccionClima = p.IdEstadoPlanAccionClima
        INNER JOIN dbo.FlujosClima f
            ON f.Id = o.IdFlujo
        INNER JOIN dbo.Organizaciones org
            ON org.Id = o.IdOrganizacion
        INNER JOIN dbo.Empleados e
            ON e.Id = @IdEmpleado
        CROSS APPLY (
            SELECT
                COUNT(*) AS TotalTareas,
                ISNULL(SUM(CASE WHEN t.Completada = 1 THEN 1 ELSE 0 END), 0) AS TareasCompletadas
            FROM dbo.CLI_PlanAccionClimaTarea t
            WHERE t.IdPlanAccionClima = p.IdPlanAccionClima
        ) AS prog
        WHERE p.IdPlanAccionClima = @IdPlanAccion
          AND p.Activo = 1
          AND o.Activo = 1
          AND o.IdFlujo = @IdFlujo
        FOR JSON PATH, WITHOUT_ARRAY_WRAPPER
    );

    SELECT @DataJson AS DataJson;
END
GO

CREATE OR ALTER PROCEDURE dbo.CLI_sp_PlanAccionClima_Portal_GuardarProgreso
    @IdEmpleado INT,
    @IdFlujo INT,
    @IdPlanAccion BIGINT,
    @TareasJson NVARCHAR(MAX),
    @Comentario NVARCHAR(2000) = NULL
AS
BEGIN
    SET NOCOUNT ON;

    IF @IdEmpleado IS NULL OR @IdEmpleado <= 0
       OR @IdFlujo IS NULL OR @IdFlujo <= 0
       OR @IdPlanAccion IS NULL OR @IdPlanAccion <= 0
        THROW 56201, 'No se encontro el plan de accion solicitado.', 1;

    IF @TareasJson IS NULL OR ISJSON(@TareasJson) <> 1
        THROW 56202, 'Las tareas deben enviarse como JSON valido.', 1;

    DECLARE @Tareas TABLE (
        IdTarea BIGINT NULL,
        Completada BIT NULL,
        Evidencia NVARCHAR(2000) NULL,
        ActualizarEvidencia BIT NOT NULL
    );

    INSERT INTO @Tareas (
        IdTarea,
        Completada,
        Evidencia,
        ActualizarEvidencia
    )
    SELECT
        j.IdTarea,
        j.Completada,
        NULLIF(LTRIM(RTRIM(j.Evidencia)), N''),
        ISNULL(j.ActualizarEvidencia, 0)
    FROM OPENJSON(@TareasJson)
    WITH (
        IdTarea BIGINT '$.id',
        Completada BIT '$.completada',
        Evidencia NVARCHAR(2000) '$.evidencia',
        ActualizarEvidencia BIT '$.actualizarEvidencia'
    ) j;

    IF EXISTS (
        SELECT 1
        FROM OPENJSON(@TareasJson)
        WHERE JSON_VALUE([value], '$.id') IS NULL
           OR TRY_CONVERT(BIGINT, JSON_VALUE([value], '$.id')) IS NULL
           OR TRY_CONVERT(BIGINT, JSON_VALUE([value], '$.id')) <= 0
           OR JSON_VALUE([value], '$.completada') IS NULL
    )
        THROW 56204, 'Una o mas tareas contienen datos invalidos.', 1;

    IF EXISTS (
        SELECT 1
        FROM @Tareas
        WHERE IdTarea IS NULL
           OR IdTarea <= 0
           OR Completada IS NULL
    )
        THROW 56204, 'Una o mas tareas contienen datos invalidos.', 1;

    IF EXISTS (
        SELECT IdTarea
        FROM @Tareas
        GROUP BY IdTarea
        HAVING COUNT(*) > 1
    )
        THROW 56204, 'No se permiten tareas duplicadas.', 1;

    DECLARE
        @FechaLimite DATE,
        @IdEstado INT,
        @EstadoCodigo NVARCHAR(30),
        @TotalTareas INT,
        @TareasCompletadas INT,
        @ProgresoPct DECIMAL(5,2),
        @UsuarioPortal NVARCHAR(120) = CONCAT(N'portal:', CONVERT(NVARCHAR(20), @IdEmpleado));

    BEGIN TRY
        BEGIN TRANSACTION;

        SELECT
            @FechaLimite = p.FechaLimite
        FROM dbo.CLI_PlanAccionClima p WITH (UPDLOCK, HOLDLOCK)
        INNER JOIN dbo.CLI_PlanAccionClimaOportunidad o
            ON o.IdOportunidadClima = p.IdOportunidadClima
        INNER JOIN dbo.CLI_PlanAccionClimaResponsable r
            ON r.IdPlanAccionClima = p.IdPlanAccionClima
        WHERE p.IdPlanAccionClima = @IdPlanAccion
          AND p.Activo = 1
          AND o.Activo = 1
          AND o.IdFlujo = @IdFlujo
          AND r.IdEmpleado = @IdEmpleado;

        IF @FechaLimite IS NULL
           AND NOT EXISTS (
                SELECT 1
                FROM dbo.CLI_PlanAccionClima p
                INNER JOIN dbo.CLI_PlanAccionClimaOportunidad o
                    ON o.IdOportunidadClima = p.IdOportunidadClima
                INNER JOIN dbo.CLI_PlanAccionClimaResponsable r
                    ON r.IdPlanAccionClima = p.IdPlanAccionClima
                WHERE p.IdPlanAccionClima = @IdPlanAccion
                  AND p.Activo = 1
                  AND o.Activo = 1
                  AND o.IdFlujo = @IdFlujo
                  AND r.IdEmpleado = @IdEmpleado
           )
            THROW 56201, 'No se encontro el plan de accion solicitado.', 1;

        IF EXISTS (
            SELECT 1
            FROM @Tareas src
            WHERE NOT EXISTS (
                SELECT 1
                FROM dbo.CLI_PlanAccionClimaTarea t
                WHERE t.IdTarea = src.IdTarea
                  AND t.IdPlanAccionClima = @IdPlanAccion
            )
        )
            THROW 56203, 'Una o mas tareas no pertenecen al plan indicado.', 1;

        UPDATE t
        SET
            Completada = src.Completada,
            Evidencia = CASE
                WHEN src.ActualizarEvidencia = 1 THEN src.Evidencia
                ELSE t.Evidencia
            END,
            ActualizadoPor = @UsuarioPortal,
            ActualizadoEn = SYSUTCDATETIME()
        FROM dbo.CLI_PlanAccionClimaTarea t
        INNER JOIN @Tareas src
            ON src.IdTarea = t.IdTarea
        WHERE t.IdPlanAccionClima = @IdPlanAccion;

        SELECT
            @TotalTareas = COUNT(*),
            @TareasCompletadas = SUM(CASE WHEN Completada = 1 THEN 1 ELSE 0 END)
        FROM dbo.CLI_PlanAccionClimaTarea
        WHERE IdPlanAccionClima = @IdPlanAccion;

        SET @TotalTareas = ISNULL(@TotalTareas, 0);
        SET @TareasCompletadas = ISNULL(@TareasCompletadas, 0);
        SET @ProgresoPct = CAST(CASE
            WHEN @TotalTareas = 0 THEN 0
            ELSE (100.0 * @TareasCompletadas / @TotalTareas)
        END AS DECIMAL(5,2));

        SET @EstadoCodigo = CASE
            WHEN @TotalTareas > 0
                 AND @TareasCompletadas < @TotalTareas
                 AND @FechaLimite IS NOT NULL
                 AND @FechaLimite < CAST(SYSUTCDATETIME() AS DATE)
                THEN N'EN_RIESGO'
            WHEN @TotalTareas = 0 OR @TareasCompletadas = 0
                THEN N'SIN_INICIAR'
            WHEN @TareasCompletadas >= @TotalTareas
                THEN N'COMPLETADO'
            ELSE N'EN_PROGRESO'
        END;

        SELECT @IdEstado = IdEstadoPlanAccionClima
        FROM dbo.CLI_CatEstadoPlanAccionClima
        WHERE Codigo = @EstadoCodigo
          AND Activo = 1;

        IF @IdEstado IS NULL
            THROW 56204, 'No existe el estado calculado para el plan.', 1;

        UPDATE dbo.CLI_PlanAccionClima
        SET
            IdEstadoPlanAccionClima = @IdEstado,
            ActualizadoPor = @UsuarioPortal,
            ActualizadoEn = SYSUTCDATETIME()
        WHERE IdPlanAccionClima = @IdPlanAccion;

        IF NULLIF(LTRIM(RTRIM(@Comentario)), N'') IS NOT NULL
        BEGIN
            INSERT INTO dbo.CLI_PlanAccionClimaSeguimiento (
                IdPlanAccionClima,
                Fecha,
                Comentario,
                AvancePct,
                CreadoPor
            )
            VALUES (
                @IdPlanAccion,
                CAST(SYSUTCDATETIME() AS DATE),
                LTRIM(RTRIM(@Comentario)),
                @ProgresoPct,
                @UsuarioPortal
            );
        END

        COMMIT TRANSACTION;
    END TRY
    BEGIN CATCH
        IF @@TRANCOUNT > 0
            ROLLBACK TRANSACTION;
        THROW;
    END CATCH;

    EXEC dbo.CLI_sp_PlanAccionClima_Portal_Obtener
        @IdEmpleado = @IdEmpleado,
        @IdFlujo = @IdFlujo,
        @IdPlanAccion = @IdPlanAccion;
END
GO
