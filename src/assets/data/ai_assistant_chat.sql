/*
  Asistente IA especializado en clima y desempeno
  SQL Server (T-SQL)

  Ejecutar despues de:
  - sql/pagadito_orders_subscription_schema.sql
  - sql/des_modelo_evaluacion.sql

  Este script no se ejecuta automaticamente desde Node.
*/
--use JUSTLINK_DB 

--use JUSTLINK_DESA_DB2

SET ANSI_NULLS ON;
SET QUOTED_IDENTIFIER ON;
GO

IF OBJECT_ID(N'dbo.JL_Plan', N'U') IS NULL
   OR OBJECT_ID(N'dbo.JL_PlanFeature', N'U') IS NULL
   OR OBJECT_ID(N'dbo.JL_Order', N'U') IS NULL
BEGIN
  THROW 54001, 'Instale primero los objetos de planes y suscripciones JL.', 1;
END;
GO

/* La caracteristica se deriva del indicador estructurado IncluyeIA, no del nombre del plan. */
INSERT INTO dbo.JL_PlanFeature
(
  IdPlan,
  CodigoFeature,
  Nombre,
  Descripcion,
  ValorTexto,
  ValorNumero,
  Orden,
  Activo
)
SELECT
  p.IdPlan,
  N'AI_ASSISTANT',
  N'Asistente IA especializado',
  N'Consultas de clima organizacional y evaluacion de desempeno con IA.',
  NULL,
  NULL,
  ISNULL((
    SELECT MAX(existingFeature.Orden) + 1
    FROM dbo.JL_PlanFeature existingFeature
    WHERE existingFeature.IdPlan = p.IdPlan
  ), 1),
  1
FROM dbo.JL_Plan p
WHERE p.IncluyeIA = 1
  AND NOT EXISTS (
    SELECT 1
    FROM dbo.JL_PlanFeature feature
    WHERE feature.IdPlan = p.IdPlan
      AND feature.CodigoFeature = N'AI_ASSISTANT'
  );
GO

IF OBJECT_ID(N'dbo.AI_AsistenteConversacion', N'U') IS NULL
BEGIN
  CREATE TABLE dbo.AI_AsistenteConversacion
  (
    IdConversacion UNIQUEIDENTIFIER NOT NULL
      CONSTRAINT DF_AI_AsistenteConversacion_Id DEFAULT NEWID(),
    IdOrganizacion INT NOT NULL,
    IdUsuario NVARCHAR(150) NOT NULL,
    Dominio NVARCHAR(30) NOT NULL,
    Titulo NVARCHAR(200) NOT NULL,
    Estado NVARCHAR(20) NOT NULL
      CONSTRAINT DF_AI_AsistenteConversacion_Estado DEFAULT (N'ACTIVA'),
    ResumenContexto NVARCHAR(MAX) NULL,
    TotalMensajes INT NOT NULL
      CONSTRAINT DF_AI_AsistenteConversacion_Total DEFAULT (0),
    FechaCreacionUtc DATETIME2(3) NOT NULL
      CONSTRAINT DF_AI_AsistenteConversacion_Creacion DEFAULT SYSUTCDATETIME(),
    FechaActualizacionUtc DATETIME2(3) NOT NULL
      CONSTRAINT DF_AI_AsistenteConversacion_Actualizacion DEFAULT SYSUTCDATETIME(),
    FechaExpiracionUtc DATETIME2(3) NOT NULL,
    FechaArchivadoUtc DATETIME2(3) NULL,

    CONSTRAINT PK_AI_AsistenteConversacion PRIMARY KEY (IdConversacion),
    CONSTRAINT FK_AI_AsistenteConversacion_Organizacion
      FOREIGN KEY (IdOrganizacion) REFERENCES dbo.Organizaciones(Id),
    CONSTRAINT CK_AI_AsistenteConversacion_Dominio
      CHECK (Dominio IN (N'CLIMA', N'DESEMPENO', N'BOTH', N'OUT_OF_SCOPE')),
    CONSTRAINT CK_AI_AsistenteConversacion_Estado
      CHECK (Estado IN (N'ACTIVA', N'ARCHIVADA')),
    CONSTRAINT CK_AI_AsistenteConversacion_Resumen
      CHECK (ResumenContexto IS NULL OR LEN(ResumenContexto) <= 4000),
    CONSTRAINT CK_AI_AsistenteConversacion_Total CHECK (TotalMensajes >= 0)
  );
END;
GO

IF OBJECT_ID(N'dbo.AI_AsistenteMensaje', N'U') IS NULL
BEGIN
  CREATE TABLE dbo.AI_AsistenteMensaje
  (
    IdMensaje BIGINT IDENTITY(1,1) NOT NULL,
    IdConversacion UNIQUEIDENTIFIER NOT NULL,
    Rol NVARCHAR(20) NOT NULL,
    Contenido NVARCHAR(MAX) NOT NULL,
    ClasificacionJson NVARCHAR(MAX) NULL,
    Dominio NVARCHAR(30) NULL,
    Intencion NVARCHAR(40) NULL,
    Confianza DECIMAL(5,4) NULL,
    FechaCreacionUtc DATETIME2(3) NOT NULL
      CONSTRAINT DF_AI_AsistenteMensaje_Creacion DEFAULT SYSUTCDATETIME(),

    CONSTRAINT PK_AI_AsistenteMensaje PRIMARY KEY (IdMensaje),
    CONSTRAINT FK_AI_AsistenteMensaje_Conversacion
      FOREIGN KEY (IdConversacion) REFERENCES dbo.AI_AsistenteConversacion(IdConversacion),
    CONSTRAINT CK_AI_AsistenteMensaje_Rol CHECK (Rol IN (N'USER', N'ASSISTANT')),
    CONSTRAINT CK_AI_AsistenteMensaje_Contenido CHECK (LEN(LTRIM(RTRIM(Contenido))) > 0),
    CONSTRAINT CK_AI_AsistenteMensaje_Clasificacion
      CHECK (ClasificacionJson IS NULL OR ISJSON(ClasificacionJson) = 1),
    CONSTRAINT CK_AI_AsistenteMensaje_Dominio
      CHECK (Dominio IS NULL OR Dominio IN (N'CLIMA', N'DESEMPENO', N'BOTH', N'OUT_OF_SCOPE')),
    CONSTRAINT CK_AI_AsistenteMensaje_Intencion
      CHECK (Intencion IS NULL OR Intencion IN (
        N'MODEL_DESIGN', N'SURVEY_DESIGN', N'RESULTS_ANALYSIS', N'ACTION_PLAN',
        N'PLATFORM_HELP', N'CLARIFICATION', N'OUT_OF_SCOPE'
      )),
    CONSTRAINT CK_AI_AsistenteMensaje_Confianza
      CHECK (Confianza IS NULL OR (Confianza >= 0 AND Confianza <= 1))
  );
END;
GO

IF OBJECT_ID(N'dbo.AI_AsistenteAuditoria', N'U') IS NULL
BEGIN
  CREATE TABLE dbo.AI_AsistenteAuditoria
  (
    IdAuditoria BIGINT IDENTITY(1,1) NOT NULL,
    IdConversacion UNIQUEIDENTIFIER NULL,
    IdOrganizacion INT NOT NULL,
    IdUsuario NVARCHAR(150) NOT NULL,
    Modelo NVARCHAR(100) NULL,
    ModeloClasificador NVARCHAR(100) NULL,
    PromptVersion NVARCHAR(80) NOT NULL,
    ResponseId NVARCHAR(150) NULL,
    TokensEntrada INT NOT NULL CONSTRAINT DF_AI_AsistenteAuditoria_Entrada DEFAULT (0),
    TokensSalida INT NOT NULL CONSTRAINT DF_AI_AsistenteAuditoria_Salida DEFAULT (0),
    TokensTotal INT NOT NULL CONSTRAINT DF_AI_AsistenteAuditoria_Total DEFAULT (0),
    DuracionMs INT NOT NULL CONSTRAINT DF_AI_AsistenteAuditoria_Duracion DEFAULT (0),
    Resultado NVARCHAR(30) NOT NULL,
    CodigoError NVARCHAR(80) NULL,
    HashSolicitud NVARCHAR(64) NOT NULL,
    FechaCreacionUtc DATETIME2(3) NOT NULL
      CONSTRAINT DF_AI_AsistenteAuditoria_Creacion DEFAULT SYSUTCDATETIME(),

    CONSTRAINT PK_AI_AsistenteAuditoria PRIMARY KEY (IdAuditoria),
    CONSTRAINT FK_AI_AsistenteAuditoria_Conversacion
      FOREIGN KEY (IdConversacion) REFERENCES dbo.AI_AsistenteConversacion(IdConversacion),
    CONSTRAINT FK_AI_AsistenteAuditoria_Organizacion
      FOREIGN KEY (IdOrganizacion) REFERENCES dbo.Organizaciones(Id),
    CONSTRAINT CK_AI_AsistenteAuditoria_Tokens
      CHECK (TokensEntrada >= 0 AND TokensSalida >= 0 AND TokensTotal >= 0),
    CONSTRAINT CK_AI_AsistenteAuditoria_Duracion CHECK (DuracionMs >= 0),
    CONSTRAINT CK_AI_AsistenteAuditoria_Resultado
      CHECK (Resultado IN (N'SUCCESS', N'OUT_OF_SCOPE', N'CLARIFICATION', N'REJECTED', N'ERROR')),
    CONSTRAINT CK_AI_AsistenteAuditoria_Hash
      CHECK (LEN(HashSolicitud) = 64)
  );
END;
GO

IF NOT EXISTS (
  SELECT 1 FROM sys.indexes
  WHERE object_id = OBJECT_ID(N'dbo.AI_AsistenteConversacion')
    AND name = N'IX_AI_AsistenteConversacion_OrganizacionUsuario'
)
BEGIN
  CREATE INDEX IX_AI_AsistenteConversacion_OrganizacionUsuario
    ON dbo.AI_AsistenteConversacion
      (IdOrganizacion, IdUsuario, Estado, FechaActualizacionUtc DESC)
    INCLUDE (Dominio, Titulo, TotalMensajes, FechaExpiracionUtc);
END;
GO

IF NOT EXISTS (
  SELECT 1 FROM sys.indexes
  WHERE object_id = OBJECT_ID(N'dbo.AI_AsistenteConversacion')
    AND name = N'IX_AI_AsistenteConversacion_Expiracion'
)
BEGIN
  CREATE INDEX IX_AI_AsistenteConversacion_Expiracion
    ON dbo.AI_AsistenteConversacion (Estado, FechaExpiracionUtc);
END;
GO

IF NOT EXISTS (
  SELECT 1 FROM sys.indexes
  WHERE object_id = OBJECT_ID(N'dbo.AI_AsistenteMensaje')
    AND name = N'IX_AI_AsistenteMensaje_Conversacion'
)
BEGIN
  CREATE INDEX IX_AI_AsistenteMensaje_Conversacion
    ON dbo.AI_AsistenteMensaje (IdConversacion, FechaCreacionUtc DESC, IdMensaje DESC)
    INCLUDE (Rol, Dominio, Intencion, Confianza);
END;
GO

IF NOT EXISTS (
  SELECT 1 FROM sys.indexes
  WHERE object_id = OBJECT_ID(N'dbo.AI_AsistenteAuditoria')
    AND name = N'IX_AI_AsistenteAuditoria_OrganizacionUsuario'
)
BEGIN
  CREATE INDEX IX_AI_AsistenteAuditoria_OrganizacionUsuario
    ON dbo.AI_AsistenteAuditoria
      (IdOrganizacion, IdUsuario, FechaCreacionUtc DESC)
    INCLUDE (TokensTotal, Resultado, CodigoError);
END;
GO

CREATE OR ALTER PROCEDURE dbo.AI_sp_AsistenteFeature_Validar
    @IdOrganizacion INT
AS
BEGIN
    SET NOCOUNT ON;

    DECLARE @AhoraUtc DATETIME2(3) = SYSUTCDATETIME();

    DECLARE @HabilitadoPorOrganizacion BIT = 0;
    DECLARE @HabilitadoPorPlan BIT = 0;

    /*
      Habilitación directa para organizaciones que no tienen
      orden o suscripción provisionada mediante Pagadito.
    */
    IF EXISTS (
        SELECT 1
        FROM dbo.JL_OrganizacionFeature organizationFeature
        WHERE organizationFeature.IdOrganizacion = @IdOrganizacion
          AND organizationFeature.CodigoFeature = N'AI_ASSISTANT'
          AND organizationFeature.Activo = 1
          AND organizationFeature.FechaInicioUtc <= @AhoraUtc
          AND (
              organizationFeature.FechaFinUtc IS NULL
              OR organizationFeature.FechaFinUtc >= @AhoraUtc
          )
    )
    BEGIN
        SET @HabilitadoPorOrganizacion = 1;
    END;

    /*
      Habilitación mediante una orden provisionada, vigente
      y asociada a un plan que incluye AI_ASSISTANT.
    */
    IF EXISTS (
        SELECT 1
        FROM dbo.JL_Order subscription
        INNER JOIN dbo.JL_Plan planData
            ON planData.IdPlan = subscription.IdPlan
           AND planData.Activo = 1
        INNER JOIN dbo.JL_PlanFeature feature
            ON feature.IdPlan = planData.IdPlan
           AND feature.CodigoFeature = N'AI_ASSISTANT'
           AND feature.Activo = 1
        WHERE subscription.IdOrganizacionProvisionada = @IdOrganizacion
          AND subscription.Estado = N'PROVISIONADO'
          AND (
              subscription.FechaInicioPlanUtc IS NULL
              OR subscription.FechaInicioPlanUtc <= @AhoraUtc
          )
          AND (
              subscription.FechaFinPlanUtc IS NULL
              OR subscription.FechaFinPlanUtc >= @AhoraUtc
          )
    )
    BEGIN
        SET @HabilitadoPorPlan = 1;
    END;

    SELECT CAST(
        CASE
            WHEN @HabilitadoPorOrganizacion = 1
              OR @HabilitadoPorPlan = 1
            THEN 1
            ELSE 0
        END
    AS BIT) AS Habilitado;
END;
GO

CREATE OR ALTER PROCEDURE dbo.AI_sp_AsistenteConversacion_Crear
  @IdConversacion UNIQUEIDENTIFIER,
  @IdOrganizacion INT,
  @IdUsuario NVARCHAR(150),
  @Dominio NVARCHAR(30),
  @Titulo NVARCHAR(200),
  @DiasRetencion INT = 90
AS
BEGIN
  SET NOCOUNT ON;

  IF NOT EXISTS (SELECT 1 FROM dbo.Organizaciones WHERE Id = @IdOrganizacion)
    THROW 54104, 'La organizacion solicitada no existe.', 1;

  IF @DiasRetencion IS NULL OR @DiasRetencion < 1
    SET @DiasRetencion = 90;

  INSERT INTO dbo.AI_AsistenteConversacion
  (
    IdConversacion,
    IdOrganizacion,
    IdUsuario,
    Dominio,
    Titulo,
    FechaExpiracionUtc
  )
  VALUES
  (
    @IdConversacion,
    @IdOrganizacion,
    @IdUsuario,
    @Dominio,
    LEFT(@Titulo, 200),
    DATEADD(DAY, @DiasRetencion, SYSUTCDATETIME())
  );

  SELECT *
  FROM dbo.AI_AsistenteConversacion
  WHERE IdConversacion = @IdConversacion;
END;
GO

CREATE OR ALTER PROCEDURE dbo.AI_sp_AsistenteMensaje_Guardar
  @IdConversacion UNIQUEIDENTIFIER,
  @IdOrganizacion INT,
  @IdUsuario NVARCHAR(150),
  @EsSuperAdmin BIT = 0,
  @Rol NVARCHAR(20),
  @Contenido NVARCHAR(MAX),
  @ClasificacionJson NVARCHAR(MAX) = NULL,
  @Dominio NVARCHAR(30) = NULL,
  @Intencion NVARCHAR(40) = NULL,
  @Confianza DECIMAL(5,4) = NULL
AS
BEGIN
  SET NOCOUNT ON;
  SET XACT_ABORT ON;

  IF NOT EXISTS (SELECT 1 FROM dbo.AI_AsistenteConversacion WHERE IdConversacion = @IdConversacion)
    THROW 54101, 'La conversacion solicitada no existe.', 1;

  IF ISNULL(@EsSuperAdmin, 0) = 0 AND NOT EXISTS (
    SELECT 1
    FROM dbo.AI_AsistenteConversacion
    WHERE IdConversacion = @IdConversacion
      AND IdOrganizacion = @IdOrganizacion
      AND IdUsuario = @IdUsuario
  )
    THROW 54102, 'No tiene autorizacion para modificar esta conversacion.', 1;

  IF EXISTS (
    SELECT 1
    FROM dbo.AI_AsistenteConversacion
    WHERE IdConversacion = @IdConversacion
      AND Estado = N'ARCHIVADA'
  )
    THROW 54103, 'La conversacion esta archivada.', 1;

  IF @ClasificacionJson IS NOT NULL AND ISJSON(@ClasificacionJson) <> 1
    THROW 54105, 'ClasificacionJson debe contener JSON valido.', 1;

  BEGIN TRANSACTION;

  INSERT INTO dbo.AI_AsistenteMensaje
  (
    IdConversacion,
    Rol,
    Contenido,
    ClasificacionJson,
    Dominio,
    Intencion,
    Confianza
  )
  VALUES
  (
    @IdConversacion,
    @Rol,
    @Contenido,
    @ClasificacionJson,
    @Dominio,
    @Intencion,
    @Confianza
  );

  DECLARE @IdMensaje BIGINT = SCOPE_IDENTITY();

  UPDATE dbo.AI_AsistenteConversacion
  SET
    Dominio = COALESCE(@Dominio, Dominio),
    TotalMensajes = TotalMensajes + 1,
    FechaActualizacionUtc = SYSUTCDATETIME()
  WHERE IdConversacion = @IdConversacion;

  COMMIT TRANSACTION;

  SELECT @IdMensaje AS IdMensaje;
END;
GO

CREATE OR ALTER PROCEDURE dbo.AI_sp_AsistenteConversacion_Historial
  @IdConversacion UNIQUEIDENTIFIER,
  @IdOrganizacion INT = NULL,
  @IdUsuario NVARCHAR(150),
  @EsSuperAdmin BIT = 0,
  @Limite INT = 12
AS
BEGIN
  SET NOCOUNT ON;

  IF NOT EXISTS (SELECT 1 FROM dbo.AI_AsistenteConversacion WHERE IdConversacion = @IdConversacion)
    THROW 54101, 'La conversacion solicitada no existe.', 1;

  IF ISNULL(@EsSuperAdmin, 0) = 0 AND NOT EXISTS (
    SELECT 1
    FROM dbo.AI_AsistenteConversacion
    WHERE IdConversacion = @IdConversacion
      AND IdOrganizacion = @IdOrganizacion
      AND IdUsuario = @IdUsuario
  )
    THROW 54102, 'No tiene autorizacion para consultar esta conversacion.', 1;

  SET @Limite = CASE
    WHEN @Limite IS NULL OR @Limite < 1 THEN 12
    WHEN @Limite > 50 THEN 50
    ELSE @Limite
  END;

  SELECT
    IdConversacion,
    IdOrganizacion,
    IdUsuario,
    Dominio,
    Titulo,
    Estado,
    ResumenContexto,
    TotalMensajes,
    FechaCreacionUtc,
    FechaActualizacionUtc,
    FechaExpiracionUtc,
    FechaArchivadoUtc
  FROM dbo.AI_AsistenteConversacion
  WHERE IdConversacion = @IdConversacion;

  ;WITH UltimosMensajes AS
  (
    SELECT TOP (@Limite)
      IdMensaje,
      IdConversacion,
      Rol,
      Contenido,
      ClasificacionJson,
      Dominio,
      Intencion,
      Confianza,
      FechaCreacionUtc
    FROM dbo.AI_AsistenteMensaje
    WHERE IdConversacion = @IdConversacion
    ORDER BY FechaCreacionUtc DESC, IdMensaje DESC
  )
  SELECT *
  FROM UltimosMensajes
  ORDER BY FechaCreacionUtc, IdMensaje;
END;
GO

CREATE OR ALTER PROCEDURE dbo.AI_sp_AsistenteConversacion_Resumen_Actualizar
  @IdConversacion UNIQUEIDENTIFIER,
  @IdOrganizacion INT,
  @IdUsuario NVARCHAR(150),
  @EsSuperAdmin BIT = 0,
  @ResumenContexto NVARCHAR(MAX)
AS
BEGIN
  SET NOCOUNT ON;

  IF NOT EXISTS (SELECT 1 FROM dbo.AI_AsistenteConversacion WHERE IdConversacion = @IdConversacion)
    THROW 54101, 'La conversacion solicitada no existe.', 1;

  IF ISNULL(@EsSuperAdmin, 0) = 0 AND NOT EXISTS (
    SELECT 1
    FROM dbo.AI_AsistenteConversacion
    WHERE IdConversacion = @IdConversacion
      AND IdOrganizacion = @IdOrganizacion
      AND IdUsuario = @IdUsuario
  )
    THROW 54102, 'No tiene autorizacion para modificar esta conversacion.', 1;

  UPDATE dbo.AI_AsistenteConversacion
  SET
    ResumenContexto = RIGHT(@ResumenContexto, 4000),
    FechaActualizacionUtc = SYSUTCDATETIME()
  WHERE IdConversacion = @IdConversacion;
END;
GO

CREATE OR ALTER PROCEDURE dbo.AI_sp_AsistenteConversacion_Archivar
  @IdConversacion UNIQUEIDENTIFIER,
  @IdOrganizacion INT = NULL,
  @IdUsuario NVARCHAR(150),
  @EsSuperAdmin BIT = 0
AS
BEGIN
  SET NOCOUNT ON;

  IF NOT EXISTS (SELECT 1 FROM dbo.AI_AsistenteConversacion WHERE IdConversacion = @IdConversacion)
    THROW 54101, 'La conversacion solicitada no existe.', 1;

  IF ISNULL(@EsSuperAdmin, 0) = 0 AND NOT EXISTS (
    SELECT 1
    FROM dbo.AI_AsistenteConversacion
    WHERE IdConversacion = @IdConversacion
      AND IdOrganizacion = @IdOrganizacion
      AND IdUsuario = @IdUsuario
  )
    THROW 54102, 'No tiene autorizacion para archivar esta conversacion.', 1;

  UPDATE dbo.AI_AsistenteConversacion
  SET
    Estado = N'ARCHIVADA',
    FechaArchivadoUtc = COALESCE(FechaArchivadoUtc, SYSUTCDATETIME()),
    FechaActualizacionUtc = SYSUTCDATETIME()
  WHERE IdConversacion = @IdConversacion;

  SELECT IdConversacion, Estado, FechaArchivadoUtc
  FROM dbo.AI_AsistenteConversacion
  WHERE IdConversacion = @IdConversacion;
END;
GO

CREATE OR ALTER PROCEDURE dbo.AI_sp_AsistenteAuditoria_Registrar
  @IdConversacion UNIQUEIDENTIFIER = NULL,
  @IdOrganizacion INT,
  @IdUsuario NVARCHAR(150),
  @Modelo NVARCHAR(100) = NULL,
  @ModeloClasificador NVARCHAR(100) = NULL,
  @PromptVersion NVARCHAR(80),
  @ResponseId NVARCHAR(150) = NULL,
  @TokensEntrada INT = 0,
  @TokensSalida INT = 0,
  @TokensTotal INT = 0,
  @DuracionMs INT = 0,
  @Resultado NVARCHAR(30),
  @CodigoError NVARCHAR(80) = NULL,
  @HashSolicitud NVARCHAR(64)
AS
BEGIN
  SET NOCOUNT ON;

  INSERT INTO dbo.AI_AsistenteAuditoria
  (
    IdConversacion,
    IdOrganizacion,
    IdUsuario,
    Modelo,
    ModeloClasificador,
    PromptVersion,
    ResponseId,
    TokensEntrada,
    TokensSalida,
    TokensTotal,
    DuracionMs,
    Resultado,
    CodigoError,
    HashSolicitud
  )
  VALUES
  (
    @IdConversacion,
    @IdOrganizacion,
    @IdUsuario,
    @Modelo,
    @ModeloClasificador,
    @PromptVersion,
    @ResponseId,
    ISNULL(@TokensEntrada, 0),
    ISNULL(@TokensSalida, 0),
    ISNULL(@TokensTotal, 0),
    ISNULL(@DuracionMs, 0),
    @Resultado,
    @CodigoError,
    @HashSolicitud
  );

  SELECT SCOPE_IDENTITY() AS IdAuditoria;
END;
GO

CREATE OR ALTER PROCEDURE dbo.AI_sp_AsistenteUsoDiario_Obtener
  @IdOrganizacion INT,
  @IdUsuario NVARCHAR(150)
AS
BEGIN
  SET NOCOUNT ON;

  DECLARE @InicioDiaUtc DATETIME2(3) = CONVERT(DATETIME2(3), CONVERT(DATE, SYSUTCDATETIME()));

  SELECT
    ISNULL(SUM(TokensEntrada), 0) AS TokensEntrada,
    ISNULL(SUM(TokensSalida), 0) AS TokensSalida,
    ISNULL(SUM(TokensTotal), 0) AS TokensTotal
  FROM dbo.AI_AsistenteAuditoria
  WHERE IdOrganizacion = @IdOrganizacion
    AND IdUsuario = @IdUsuario
    AND FechaCreacionUtc >= @InicioDiaUtc;
END;
GO

/* Lista permitida de contexto: solo estructura no personal y validada por organizacion. */
CREATE OR ALTER PROCEDURE dbo.AI_sp_AsistenteContexto_Obtener
  @IdOrganizacion INT,
  @IdModelo INT = NULL,
  @IdFlujo INT = NULL
AS
BEGIN
  SET NOCOUNT ON;

  IF @IdModelo IS NOT NULL AND NOT EXISTS (
    SELECT 1
    FROM dbo.DES_Modelo
    WHERE IdModelo = @IdModelo
      AND IdOrganizacion = @IdOrganizacion
  )
    THROW 54104, 'El modelo no existe en la organizacion autorizada.', 1;

  IF @IdFlujo IS NOT NULL AND NOT EXISTS (
    SELECT 1
    FROM dbo.FlujosClima
    WHERE Id = @IdFlujo
      AND IdOrganizacion = @IdOrganizacion
  )
    THROW 54104, 'El flujo no existe en la organizacion autorizada.', 1;

  DECLARE @ModeloJson NVARCHAR(MAX) = NULL;
  DECLARE @FlujoJson NVARCHAR(MAX) = NULL;

  IF @IdModelo IS NOT NULL
  BEGIN
    SELECT @ModeloJson = (
      SELECT
        modelData.IdModelo AS id,
        modelData.Codigo AS codigo,
        modelData.Nombre AS nombre,
        modelData.Descripcion AS descripcion,
        modelType.Codigo AS tipoCodigo,
        modelType.Nombre AS tipoNombre,
        modelStatus.Codigo AS estadoCodigo,
        modelData.UsaPonderacion AS usaPonderacion,
        modelData.UsaAnonimato AS usaAnonimato,
        modelData.MinimoRespuestasAnonimas AS minimoRespuestasAnonimas,
        JSON_QUERY((
          SELECT TOP (40)
            dimensionData.Codigo AS codigo,
            dimensionData.Nombre AS nombre,
            dimensionData.Descripcion AS descripcion,
            dimensionData.Ponderacion AS ponderacion,
            dimensionData.Orden AS orden
          FROM dbo.DES_ModeloDimension dimensionData
          WHERE dimensionData.IdModelo = modelData.IdModelo
            AND dimensionData.Activo = 1
          ORDER BY dimensionData.Orden, dimensionData.IdModeloDimension
          FOR JSON PATH
        )) AS dimensiones,
        JSON_QUERY((
          SELECT TOP (10)
            scenarioCatalog.Codigo AS codigo,
            scenarioCatalog.Nombre AS nombre,
            modelScenario.Ponderacion AS ponderacion,
            modelScenario.EsAnonimo AS esAnonimo,
            modelScenario.Orden AS orden
          FROM dbo.DES_ModeloEscenario modelScenario
          INNER JOIN dbo.DES_CatEscenario scenarioCatalog
            ON scenarioCatalog.IdEscenario = modelScenario.IdEscenario
          WHERE modelScenario.IdModelo = modelData.IdModelo
            AND modelScenario.Activo = 1
          ORDER BY modelScenario.Orden, modelScenario.IdModeloEscenario
          FOR JSON PATH
        )) AS escenarios,
        JSON_QUERY((
          SELECT TOP (40)
            positionData.Codigo AS codigo,
            positionData.Nombre AS nombre,
            modelPosition.SoloEvaluador AS soloEvaluador,
            modelPosition.Orden AS orden
          FROM dbo.DES_ModeloPuesto modelPosition
          INNER JOIN dbo.DES_Puesto positionData
            ON positionData.IdPuesto = modelPosition.IdPuesto
          WHERE modelPosition.IdModelo = modelData.IdModelo
            AND modelPosition.Activo = 1
          ORDER BY modelPosition.Orden, modelPosition.IdModeloPuesto
          FOR JSON PATH
        )) AS puestos,
        (
          SELECT COUNT_BIG(*)
          FROM dbo.DES_CriterioEvaluacion criterionData
          INNER JOIN dbo.DES_ModeloPuestoEscenario positionScenario
            ON positionScenario.IdModeloPuestoEscenario = criterionData.IdModeloPuestoEscenario
          INNER JOIN dbo.DES_ModeloPuesto modelPosition
            ON modelPosition.IdModeloPuesto = positionScenario.IdModeloPuesto
          WHERE modelPosition.IdModelo = modelData.IdModelo
            AND criterionData.Activo = 1
        ) AS totalCriteriosActivos,
        (
          SELECT COUNT_BIG(*)
          FROM dbo.DES_ItemEvaluativo itemData
          INNER JOIN dbo.DES_CriterioEvaluacion criterionData
            ON criterionData.IdCriterioEvaluacion = itemData.IdCriterioEvaluacion
          INNER JOIN dbo.DES_ModeloPuestoEscenario positionScenario
            ON positionScenario.IdModeloPuestoEscenario = criterionData.IdModeloPuestoEscenario
          INNER JOIN dbo.DES_ModeloPuesto modelPosition
            ON modelPosition.IdModeloPuesto = positionScenario.IdModeloPuesto
          WHERE modelPosition.IdModelo = modelData.IdModelo
            AND criterionData.Activo = 1
            AND itemData.Activo = 1
        ) AS totalItemsActivos
      FROM dbo.DES_Modelo modelData
      INNER JOIN dbo.DES_CatTipoModelo modelType
        ON modelType.IdTipoModelo = modelData.IdTipoModelo
      INNER JOIN dbo.DES_CatEstadoModelo modelStatus
        ON modelStatus.IdEstadoModelo = modelData.IdEstadoModelo
      WHERE modelData.IdModelo = @IdModelo
        AND modelData.IdOrganizacion = @IdOrganizacion
      FOR JSON PATH, WITHOUT_ARRAY_WRAPPER
    );
  END;

  IF @IdFlujo IS NOT NULL
  BEGIN
    SELECT @FlujoJson = (
      SELECT
        flowData.Id AS id,
        flowData.Nombre AS nombre,
        flowData.Objetivo AS objetivo,
        flowData.FechaInicio AS fechaInicio,
        flowData.FechaFin AS fechaFin,
        flowData.Frecuencia AS frecuencia,
        flowData.MetodoAplicacion AS metodoAplicacion,
        flowData.EstimadoMinutos AS estimadoMinutos,
        flowData.Anonimato AS anonimato,
        flowData.Estado AS estado,
        flowData.TipoEvaluacion AS tipoEvaluacion
      FROM dbo.FlujosClima flowData
      WHERE flowData.Id = @IdFlujo
        AND flowData.IdOrganizacion = @IdOrganizacion
      FOR JSON PATH, WITHOUT_ARRAY_WRAPPER
    );
  END;

  SELECT @ModeloJson AS ModeloJson, @FlujoJson AS FlujoJson;
END;
GO



