/*
    Procedimientos de consulta para catalogos del modulo de desempeno.

    Requisito:
      Ejecutar previamente src/assets/data/des_modelo_evaluacion.sql

    Convenciones:
      - @SoloActivos = NULL devuelve activos e inactivos.
      - Las escalas de sistema tienen IdOrganizacion NULL y estan disponibles
        para todas las organizaciones.
      - DES_sp_Catalogos_ObtenerJson es la opcion recomendada para el endpoint
        GET /api/desempeno/catalogos.
*/


--use JUSTLINK_DB 
SET NOCOUNT ON;
SET XACT_ABORT ON;
GO

/* ============================================================
   1. Catalogos estaticos en multiples recordsets

   Orden de recordsets:
     1. tiposModelo
     2. estadosModelo
     3. estadosEvaluacion
     4. tiposItem
     5. escenarios
     6. metodosCalculo
     7. canalesEnvio
     8. estadosAsignacion
     9. estadosRespuesta
   ============================================================ */

CREATE OR ALTER PROCEDURE dbo.DES_sp_Catalogos_Listar
    @SoloActivos BIT = 1
AS
BEGIN
    SET NOCOUNT ON;

    SELECT
        IdTipoModelo AS id,
        Codigo AS codigo,
        Nombre AS nombre,
        Descripcion AS descripcion,
        Orden AS orden,
        Activo AS activo
    FROM dbo.DES_CatTipoModelo
    WHERE @SoloActivos IS NULL OR Activo = @SoloActivos
    ORDER BY Orden, IdTipoModelo;

    SELECT
        IdEstadoModelo AS id,
        Codigo AS codigo,
        Nombre AS nombre,
        Orden AS orden,
        Activo AS activo
    FROM dbo.DES_CatEstadoModelo
    WHERE @SoloActivos IS NULL OR Activo = @SoloActivos
    ORDER BY Orden, IdEstadoModelo;

    SELECT
        IdEstadoEvaluacion AS id,
        Codigo AS codigo,
        Nombre AS nombre,
        Orden AS orden,
        Activo AS activo
    FROM dbo.DES_CatEstadoEvaluacion
    WHERE @SoloActivos IS NULL OR Activo = @SoloActivos
    ORDER BY Orden, IdEstadoEvaluacion;

    SELECT
        IdTipoItem AS id,
        Codigo AS codigo,
        Nombre AS nombre,
        UsaEscala AS usaEscala,
        PermiteTexto AS permiteTexto,
        PermiteSeleccionMultiple AS permiteSeleccionMultiple,
        Orden AS orden,
        Activo AS activo
    FROM dbo.DES_CatTipoItem
    WHERE @SoloActivos IS NULL OR Activo = @SoloActivos
    ORDER BY Orden, IdTipoItem;

    SELECT
        IdEscenario AS id,
        Codigo AS codigo,
        Nombre AS nombre,
        Descripcion AS descripcion,
        Orden AS orden,
        Activo AS activo
    FROM dbo.DES_CatEscenario
    WHERE @SoloActivos IS NULL OR Activo = @SoloActivos
    ORDER BY Orden, IdEscenario;

    SELECT
        IdMetodoCalculo AS id,
        Codigo AS codigo,
        Nombre AS nombre,
        Descripcion AS descripcion,
        Activo AS activo
    FROM dbo.DES_CatMetodoCalculo
    WHERE @SoloActivos IS NULL OR Activo = @SoloActivos
    ORDER BY IdMetodoCalculo;

    SELECT
        IdCanalEnvio AS id,
        Codigo AS codigo,
        Nombre AS nombre,
        Activo AS activo
    FROM dbo.DES_CatCanalEnvio
    WHERE @SoloActivos IS NULL OR Activo = @SoloActivos
    ORDER BY IdCanalEnvio;

    SELECT
        IdEstadoAsignacion AS id,
        Codigo AS codigo,
        Nombre AS nombre,
        EsFinal AS esFinal,
        Orden AS orden,
        Activo AS activo
    FROM dbo.DES_CatEstadoAsignacion
    WHERE @SoloActivos IS NULL OR Activo = @SoloActivos
    ORDER BY Orden, IdEstadoAsignacion;

    SELECT
        IdEstadoRespuesta AS id,
        Codigo AS codigo,
        Nombre AS nombre,
        EsFinal AS esFinal,
        Orden AS orden,
        Activo AS activo
    FROM dbo.DES_CatEstadoRespuesta
    WHERE @SoloActivos IS NULL OR Activo = @SoloActivos
    ORDER BY Orden, IdEstadoRespuesta;
END
GO

/* ============================================================
   2. Catalogos completos como un unico JSON
   ============================================================ */

CREATE OR ALTER PROCEDURE dbo.DES_sp_Catalogos_ObtenerJson
    @IdOrganizacion INT = NULL,
    @SoloActivos BIT = 1,
    @IncluirPuestos BIT = 1,
    @IncluirValoresEscala BIT = 1
AS
BEGIN
    SET NOCOUNT ON;

    IF @IdOrganizacion IS NOT NULL
       AND NOT EXISTS (
           SELECT 1
           FROM dbo.Organizaciones
           WHERE Id = @IdOrganizacion
       )
        THROW 52001, 'No existe la organizacion indicada.', 1;

    DECLARE @DataJson NVARCHAR(MAX);

    SELECT @DataJson = (
        SELECT
            JSON_QUERY((
                SELECT
                    IdTipoModelo AS id,
                    Codigo AS codigo,
                    Nombre AS nombre,
                    Descripcion AS descripcion,
                    Orden AS orden,
                    Activo AS activo
                FROM dbo.DES_CatTipoModelo
                WHERE @SoloActivos IS NULL OR Activo = @SoloActivos
                ORDER BY Orden, IdTipoModelo
                FOR JSON PATH
            )) AS tiposModelo,
            JSON_QUERY((
                SELECT
                    IdEstadoModelo AS id,
                    Codigo AS codigo,
                    Nombre AS nombre,
                    Orden AS orden,
                    Activo AS activo
                FROM dbo.DES_CatEstadoModelo
                WHERE @SoloActivos IS NULL OR Activo = @SoloActivos
                ORDER BY Orden, IdEstadoModelo
                FOR JSON PATH
            )) AS estadosModelo,
            JSON_QUERY((
                SELECT
                    IdEstadoEvaluacion AS id,
                    Codigo AS codigo,
                    Nombre AS nombre,
                    Orden AS orden,
                    Activo AS activo
                FROM dbo.DES_CatEstadoEvaluacion
                WHERE @SoloActivos IS NULL OR Activo = @SoloActivos
                ORDER BY Orden, IdEstadoEvaluacion
                FOR JSON PATH
            )) AS estadosEvaluacion,
            JSON_QUERY((
                SELECT
                    IdTipoItem AS id,
                    Codigo AS codigo,
                    Nombre AS nombre,
                    UsaEscala AS usaEscala,
                    PermiteTexto AS permiteTexto,
                    PermiteSeleccionMultiple AS permiteSeleccionMultiple,
                    Orden AS orden,
                    Activo AS activo
                FROM dbo.DES_CatTipoItem
                WHERE @SoloActivos IS NULL OR Activo = @SoloActivos
                ORDER BY Orden, IdTipoItem
                FOR JSON PATH
            )) AS tiposItem,
            JSON_QUERY((
                SELECT
                    IdEscenario AS id,
                    Codigo AS codigo,
                    Nombre AS nombre,
                    Descripcion AS descripcion,
                    Orden AS orden,
                    Activo AS activo
                FROM dbo.DES_CatEscenario
                WHERE @SoloActivos IS NULL OR Activo = @SoloActivos
                ORDER BY Orden, IdEscenario
                FOR JSON PATH
            )) AS escenarios,
            JSON_QUERY((
                SELECT
                    IdMetodoCalculo AS id,
                    Codigo AS codigo,
                    Nombre AS nombre,
                    Descripcion AS descripcion,
                    Activo AS activo
                FROM dbo.DES_CatMetodoCalculo
                WHERE @SoloActivos IS NULL OR Activo = @SoloActivos
                ORDER BY IdMetodoCalculo
                FOR JSON PATH
            )) AS metodosCalculo,
            JSON_QUERY((
                SELECT
                    IdCanalEnvio AS id,
                    Codigo AS codigo,
                    Nombre AS nombre,
                    Activo AS activo
                FROM dbo.DES_CatCanalEnvio
                WHERE @SoloActivos IS NULL OR Activo = @SoloActivos
                ORDER BY IdCanalEnvio
                FOR JSON PATH
            )) AS canalesEnvio,
            JSON_QUERY((
                SELECT
                    IdEstadoAsignacion AS id,
                    Codigo AS codigo,
                    Nombre AS nombre,
                    EsFinal AS esFinal,
                    Orden AS orden,
                    Activo AS activo
                FROM dbo.DES_CatEstadoAsignacion
                WHERE @SoloActivos IS NULL OR Activo = @SoloActivos
                ORDER BY Orden, IdEstadoAsignacion
                FOR JSON PATH
            )) AS estadosAsignacion,
            JSON_QUERY((
                SELECT
                    IdEstadoRespuesta AS id,
                    Codigo AS codigo,
                    Nombre AS nombre,
                    EsFinal AS esFinal,
                    Orden AS orden,
                    Activo AS activo
                FROM dbo.DES_CatEstadoRespuesta
                WHERE @SoloActivos IS NULL OR Activo = @SoloActivos
                ORDER BY Orden, IdEstadoRespuesta
                FOR JSON PATH
            )) AS estadosRespuesta,
            JSON_QUERY((
                SELECT
                    e.IdEscala AS id,
                    e.IdOrganizacion AS organizacionId,
                    e.Codigo AS codigo,
                    e.Nombre AS nombre,
                    e.Descripcion AS descripcion,
                    e.ValorMinimo AS valorMinimo,
                    e.ValorMaximo AS valorMaximo,
                    e.EsSistema AS esSistema,
                    e.Activo AS activo,
                    JSON_QUERY((
                        SELECT
                            ev.IdEscalaValor AS id,
                            ev.Valor AS valor,
                            ev.Etiqueta AS etiqueta,
                            ev.Orden AS orden,
                            ev.Activo AS activo
                        FROM dbo.DES_EscalaValor ev
                        WHERE ev.IdEscala = e.IdEscala
                          AND @IncluirValoresEscala = 1
                          AND (@SoloActivos IS NULL OR ev.Activo = @SoloActivos)
                        ORDER BY ev.Orden, ev.IdEscalaValor
                        FOR JSON PATH
                    )) AS valores
                FROM dbo.DES_Escala e
                WHERE (
                        e.IdOrganizacion IS NULL
                        OR e.IdOrganizacion = @IdOrganizacion
                      )
                  AND (@SoloActivos IS NULL OR e.Activo = @SoloActivos)
                ORDER BY e.EsSistema DESC, e.Nombre, e.IdEscala
                FOR JSON PATH
            )) AS escalas,
            JSON_QUERY((
                SELECT
                    p.IdPuesto AS id,
                    p.IdOrganizacion AS organizacionId,
                    p.Codigo AS codigo,
                    p.Nombre AS nombre,
                    p.Activo AS activo,
                    (
                        SELECT COUNT_BIG(1)
                        FROM dbo.DES_EmpleadoPuesto ep
                        INNER JOIN dbo.Empleados em
                            ON em.Id = ep.IdEmpleado
                        WHERE ep.IdPuesto = p.IdPuesto
                          AND ep.EsActual = 1
                          AND em.IdOrganizacion = p.IdOrganizacion
                    ) AS totalEmpleados
                FROM dbo.DES_Puesto p
                WHERE p.IdOrganizacion = @IdOrganizacion
                  AND @IncluirPuestos = 1
                  AND @IdOrganizacion IS NOT NULL
                  AND (@SoloActivos IS NULL OR p.Activo = @SoloActivos)
                ORDER BY p.Nombre, p.IdPuesto
                FOR JSON PATH
            )) AS puestos
        FOR JSON PATH, WITHOUT_ARRAY_WRAPPER
    );

    SELECT @DataJson AS DataJson;
END
GO

/* ============================================================
   3. Escalas disponibles para una organizacion
   ============================================================ */

CREATE OR ALTER PROCEDURE dbo.DES_sp_Escalas_Listar
    @IdOrganizacion INT = NULL,
    @SoloActivos BIT = 1,
    @Buscar NVARCHAR(150) = NULL
AS
BEGIN
    SET NOCOUNT ON;

    SET @Buscar = NULLIF(LTRIM(RTRIM(@Buscar)), N'');

    SELECT
        e.IdEscala AS id,
        e.IdOrganizacion AS organizacionId,
        e.Codigo AS codigo,
        e.Nombre AS nombre,
        e.Descripcion AS descripcion,
        e.ValorMinimo AS valorMinimo,
        e.ValorMaximo AS valorMaximo,
        e.EsSistema AS esSistema,
        e.Activo AS activo,
        COUNT(ev.IdEscalaValor) AS totalValores
    FROM dbo.DES_Escala e
    LEFT JOIN dbo.DES_EscalaValor ev
        ON ev.IdEscala = e.IdEscala
       AND (@SoloActivos IS NULL OR ev.Activo = @SoloActivos)
    WHERE (
            e.IdOrganizacion IS NULL
            OR e.IdOrganizacion = @IdOrganizacion
          )
      AND (@SoloActivos IS NULL OR e.Activo = @SoloActivos)
      AND (
            @Buscar IS NULL
            OR e.Codigo LIKE N'%' + @Buscar + N'%'
            OR e.Nombre LIKE N'%' + @Buscar + N'%'
          )
    GROUP BY
        e.IdEscala,
        e.IdOrganizacion,
        e.Codigo,
        e.Nombre,
        e.Descripcion,
        e.ValorMinimo,
        e.ValorMaximo,
        e.EsSistema,
        e.Activo
    ORDER BY e.EsSistema DESC, e.Nombre, e.IdEscala;
END
GO

CREATE OR ALTER PROCEDURE dbo.DES_sp_Escalas_Obtener
    @IdEscala INT,
    @IdOrganizacion INT = NULL,
    @SoloActivos BIT = NULL
AS
BEGIN
    SET NOCOUNT ON;

    IF NOT EXISTS (
        SELECT 1
        FROM dbo.DES_Escala
        WHERE IdEscala = @IdEscala
          AND (
                IdOrganizacion IS NULL
                OR @IdOrganizacion IS NULL
                OR IdOrganizacion = @IdOrganizacion
              )
    )
        THROW 52002, 'No existe la escala indicada o no pertenece a la organizacion.', 1;

    SELECT
        e.IdEscala AS id,
        e.IdOrganizacion AS organizacionId,
        e.Codigo AS codigo,
        e.Nombre AS nombre,
        e.Descripcion AS descripcion,
        e.ValorMinimo AS valorMinimo,
        e.ValorMaximo AS valorMaximo,
        e.EsSistema AS esSistema,
        e.Activo AS activo,
        e.FechaCreacion AS fechaCreacion
    FROM dbo.DES_Escala e
    WHERE e.IdEscala = @IdEscala
      AND (
            e.IdOrganizacion IS NULL
            OR @IdOrganizacion IS NULL
            OR e.IdOrganizacion = @IdOrganizacion
          );

    SELECT
        ev.IdEscalaValor AS id,
        ev.IdEscala AS escalaId,
        ev.Valor AS valor,
        ev.Etiqueta AS etiqueta,
        ev.Orden AS orden,
        ev.Activo AS activo
    FROM dbo.DES_EscalaValor ev
    WHERE ev.IdEscala = @IdEscala
      AND (@SoloActivos IS NULL OR ev.Activo = @SoloActivos)
    ORDER BY ev.Orden, ev.IdEscalaValor;
END
GO

CREATE OR ALTER PROCEDURE dbo.DES_sp_EscalaValores_Listar
    @IdEscala INT,
    @IdOrganizacion INT = NULL,
    @SoloActivos BIT = 1
AS
BEGIN
    SET NOCOUNT ON;

    IF NOT EXISTS (
        SELECT 1
        FROM dbo.DES_Escala
        WHERE IdEscala = @IdEscala
          AND (
                IdOrganizacion IS NULL
                OR @IdOrganizacion IS NULL
                OR IdOrganizacion = @IdOrganizacion
              )
    )
        THROW 52003, 'No existe la escala indicada o no pertenece a la organizacion.', 1;

    SELECT
        IdEscalaValor AS id,
        IdEscala AS escalaId,
        Valor AS valor,
        Etiqueta AS etiqueta,
        Orden AS orden,
        Activo AS activo
    FROM dbo.DES_EscalaValor
    WHERE IdEscala = @IdEscala
      AND (@SoloActivos IS NULL OR Activo = @SoloActivos)
    ORDER BY Orden, IdEscalaValor;
END
GO

/* ============================================================
   4. Puestos de la organizacion
   ============================================================ */

CREATE OR ALTER PROCEDURE dbo.DES_sp_Puestos_Listar
    @IdOrganizacion INT,
    @SoloActivos BIT = 1,
    @Buscar NVARCHAR(150) = NULL
AS
BEGIN
    SET NOCOUNT ON;

    IF NOT EXISTS (
        SELECT 1
        FROM dbo.Organizaciones
        WHERE Id = @IdOrganizacion
    )
        THROW 52004, 'No existe la organizacion indicada.', 1;

    SET @Buscar = NULLIF(LTRIM(RTRIM(@Buscar)), N'');

    SELECT
        p.IdPuesto AS id,
        p.IdOrganizacion AS organizacionId,
        p.Codigo AS codigo,
        p.Nombre AS nombre,
        p.Activo AS activo,
        COUNT(DISTINCT ep.IdEmpleado) AS totalEmpleados
    FROM dbo.DES_Puesto p
    LEFT JOIN dbo.DES_EmpleadoPuesto ep
        ON ep.IdPuesto = p.IdPuesto
       AND ep.EsActual = 1
    WHERE p.IdOrganizacion = @IdOrganizacion
      AND (@SoloActivos IS NULL OR p.Activo = @SoloActivos)
      AND (
            @Buscar IS NULL
            OR p.Codigo LIKE N'%' + @Buscar + N'%'
            OR p.Nombre LIKE N'%' + @Buscar + N'%'
          )
    GROUP BY
        p.IdPuesto,
        p.IdOrganizacion,
        p.Codigo,
        p.Nombre,
        p.Activo
    ORDER BY p.Nombre, p.IdPuesto;
END
GO

CREATE OR ALTER PROCEDURE dbo.DES_sp_Puestos_ObtenerEmpleados
    @IdPuesto INT,
    @IdOrganizacion INT,
    @SoloActivos BIT = 1,
    @Buscar NVARCHAR(200) = NULL
AS
BEGIN
    SET NOCOUNT ON;

    IF NOT EXISTS (
        SELECT 1
        FROM dbo.DES_Puesto
        WHERE IdPuesto = @IdPuesto
          AND IdOrganizacion = @IdOrganizacion
    )
        THROW 52005, 'No existe el puesto indicado o no pertenece a la organizacion.', 1;

    SET @Buscar = NULLIF(LTRIM(RTRIM(@Buscar)), N'');

    SELECT
        e.Id AS id,
        e.IdOrganizacion AS organizacionId,
        e.Nombres AS nombres,
        e.Apellidos AS apellidos,
        LTRIM(RTRIM(
            COALESCE(e.Nombres, N'') + N' ' + COALESCE(e.Apellidos, N'')
        )) AS nombreCompleto,
        e.Email AS email,
        e.Cargo AS cargo,
        e.IdEmpleadoJefe AS jefeId,
        e.estado AS estado,
        ep.IdPuesto AS puestoId,
        ep.FechaInicio AS fechaInicioPuesto
    FROM dbo.DES_EmpleadoPuesto ep
    INNER JOIN dbo.Empleados e
        ON e.Id = ep.IdEmpleado
    WHERE ep.IdPuesto = @IdPuesto
      AND ep.EsActual = 1
      AND e.IdOrganizacion = @IdOrganizacion
      AND (
            @SoloActivos IS NULL
            OR (@SoloActivos = 1 AND e.estado = 1)
            OR (@SoloActivos = 0 AND ISNULL(e.estado, 0) = 0)
          )
      AND (
            @Buscar IS NULL
            OR e.Nombres LIKE N'%' + @Buscar + N'%'
            OR e.Apellidos LIKE N'%' + @Buscar + N'%'
            OR e.Email LIKE N'%' + @Buscar + N'%'
            OR e.Cargo LIKE N'%' + @Buscar + N'%'
          )
    ORDER BY e.Nombres, e.Apellidos, e.Id;
END
GO

/* ============================================================
   5. Escenarios predeterminados por tipo de modelo
   ============================================================ */

CREATE OR ALTER PROCEDURE dbo.DES_sp_TipoModeloEscenarios_Listar
    @CodigoTipoModelo NVARCHAR(30)
AS
BEGIN
    SET NOCOUNT ON;

    SET @CodigoTipoModelo = UPPER(LTRIM(RTRIM(@CodigoTipoModelo)));

    IF NOT EXISTS (
        SELECT 1
        FROM dbo.DES_CatTipoModelo
        WHERE Codigo = @CodigoTipoModelo
          AND Activo = 1
    )
        THROW 52006, 'No existe el tipo de modelo indicado.', 1;

    SELECT
        e.IdEscenario AS id,
        e.Codigo AS codigo,
        e.Nombre AS nombre,
        e.Descripcion AS descripcion,
        CASE
            WHEN @CodigoTipoModelo = N'90' AND e.Codigo = N'BOSS_TO_EMPLOYEE' THEN CAST(100 AS DECIMAL(5,2))
            WHEN @CodigoTipoModelo = N'180'
                 AND e.Codigo IN (N'BOSS_TO_EMPLOYEE', N'EMPLOYEE_TO_BOSS')
                THEN CAST(50 AS DECIMAL(5,2))
            WHEN @CodigoTipoModelo = N'AUTOEVALUACION' AND e.Codigo = N'SELF'
                THEN CAST(100 AS DECIMAL(5,2))
            WHEN @CodigoTipoModelo IN (N'360', N'MIXTA')
                THEN CAST(25 AS DECIMAL(5,2))
            ELSE CAST(0 AS DECIMAL(5,2))
        END AS ponderacionPredeterminada,
        CAST(CASE
            WHEN @CodigoTipoModelo = N'90' AND e.Codigo = N'BOSS_TO_EMPLOYEE' THEN 1
            WHEN @CodigoTipoModelo = N'180'
                 AND e.Codigo IN (N'BOSS_TO_EMPLOYEE', N'EMPLOYEE_TO_BOSS') THEN 1
            WHEN @CodigoTipoModelo = N'AUTOEVALUACION' AND e.Codigo = N'SELF' THEN 1
            WHEN @CodigoTipoModelo IN (N'360', N'MIXTA') THEN 1
            ELSE 0
        END AS BIT) AS activoPredeterminado,
        e.Orden AS orden
    FROM dbo.DES_CatEscenario e
    WHERE e.Activo = 1
    ORDER BY e.Orden, e.IdEscenario;
END
GO

PRINT N'Procedimientos de catalogos DES_ creados correctamente.';
GO

/*
    Ejemplos:

    EXEC dbo.DES_sp_Catalogos_ObtenerJson
        @IdOrganizacion = 29,
        @SoloActivos = 1,
        @IncluirPuestos = 1,
        @IncluirValoresEscala = 1;

    EXEC dbo.DES_sp_Catalogos_Listar @SoloActivos = 1;
    EXEC dbo.DES_sp_Escalas_Listar @IdOrganizacion = 29, @SoloActivos = 1;
    EXEC dbo.DES_sp_Escalas_Obtener @IdEscala = 1, @IdOrganizacion = 29;
    EXEC dbo.DES_sp_Puestos_Listar @IdOrganizacion = 29, @SoloActivos = 1;
*/

--NUEVOS PROCEDIMIENTOS AQUI ABAJO..

/* ============================================================
   6. Listado paginado de modelos de evaluacion
   ============================================================ */

CREATE OR ALTER PROCEDURE dbo.DES_sp_Modelos_Listar
    @IdOrganizacion INT,
    @EstadoCodigo NVARCHAR(30) = NULL,
    @TipoCodigo NVARCHAR(30) = NULL,
    @Activo BIT = NULL,
    @Buscar NVARCHAR(200) = NULL,
    @Pagina INT = 1,
    @Limite INT = 50
AS
BEGIN
    SET NOCOUNT ON;

    SET @Pagina = CASE WHEN @Pagina < 1 THEN 1 ELSE @Pagina END;
    SET @Limite = CASE
        WHEN @Limite < 1 THEN 50
        WHEN @Limite > 200 THEN 200
        ELSE @Limite
    END;
    SET @Buscar = NULLIF(LTRIM(RTRIM(@Buscar)), N'');

    ;WITH Datos AS (
        SELECT
            m.IdModelo AS id,
            m.IdOrganizacion AS organizacionId,
            m.Codigo AS codigo,
            m.Version AS version,
            m.Nombre AS nombre,
            m.Descripcion AS descripcion,
            tm.IdTipoModelo AS tipoModeloId,
            tm.Codigo AS tipoModeloCodigo,
            tm.Nombre AS tipoModeloNombre,
            em.IdEstadoModelo AS estadoModeloId,
            em.Codigo AS estadoCodigo,
            em.Nombre AS estadoNombre,
            m.IdEscalaPredeterminada AS escalaPredeterminadaId,
            m.IdMetodoCalculo AS metodoCalculoId,
            m.UsaPonderacion AS usaPonderacion,
            m.UsaAnonimato AS usaAnonimato,
            m.MinimoRespuestasAnonimas AS minimoRespuestasAnonimas,
            m.FechaInicio AS fechaInicio,
            m.FechaCierre AS fechaCierre,
            m.Activo AS activo,
            m.FechaCreacion AS fechaCreacion,
            m.FechaModificacion AS fechaModificacion,
            m.FechaPublicacion AS fechaPublicacion,
            (
                SELECT COUNT(*)
                FROM dbo.DES_ModeloDimension d
                WHERE d.IdModelo = m.IdModelo
                  AND d.Activo = 1
            ) AS totalDimensiones,
            (
                SELECT COUNT(*)
                FROM dbo.DES_ModeloPuesto p
                WHERE p.IdModelo = m.IdModelo
                  AND p.Activo = 1
            ) AS totalPuestos,
            (
                SELECT COUNT(*)
                FROM dbo.DES_ModeloEmpleadoEspecifico mee
                WHERE mee.IdModelo = m.IdModelo
                  AND mee.Activo = 1
            ) AS totalEmpleadosEspecificos,
            (
                SELECT COUNT(*)
                FROM dbo.DES_ModeloEscenario e
                WHERE e.IdModelo = m.IdModelo
                  AND e.Activo = 1
            ) AS totalEscenarios,
            (
                SELECT COUNT(*)
                FROM dbo.DES_CriterioEvaluacion c
                INNER JOIN dbo.DES_ModeloPuestoEscenario pe
                    ON pe.IdModeloPuestoEscenario = c.IdModeloPuestoEscenario
                INNER JOIN dbo.DES_ModeloPuesto p
                    ON p.IdModeloPuesto = pe.IdModeloPuesto
                WHERE p.IdModelo = m.IdModelo
                  AND c.Activo = 1
            ) AS totalCriterios,
            (
                SELECT COUNT(*)
                FROM dbo.DES_ItemEvaluativo i
                INNER JOIN dbo.DES_CriterioEvaluacion c
                    ON c.IdCriterioEvaluacion = i.IdCriterioEvaluacion
                INNER JOIN dbo.DES_ModeloPuestoEscenario pe
                    ON pe.IdModeloPuestoEscenario = c.IdModeloPuestoEscenario
                INNER JOIN dbo.DES_ModeloPuesto p
                    ON p.IdModeloPuesto = pe.IdModeloPuesto
                WHERE p.IdModelo = m.IdModelo
                  AND i.Activo = 1
            ) AS totalItems,
            CONCAT(
                N'[',
                ISNULL((
                    SELECT STRING_AGG(
                        CONVERT(NVARCHAR(MAX), mee.IdEmpleado),
                        N','
                    ) WITHIN GROUP (ORDER BY mee.IdEmpleado)
                    FROM dbo.DES_ModeloEmpleadoEspecifico mee
                    WHERE mee.IdModelo = m.IdModelo
                      AND mee.Activo = 1
                ), N''),
                N']'
            ) AS empleadosEspecificosIds,
            (
                SELECT
                    d.IdModeloDimension AS id,
                    d.Codigo AS codigo,
                    d.Nombre AS nombre,
                    d.Descripcion AS descripcion,
                    d.Ponderacion AS ponderacion,
                    d.Orden AS orden,
                    d.Activo AS activo,
                    JSON_QUERY((
                        SELECT
                            c.IdCriterioEvaluacion AS id,
                            c.IdCriterioOrigen AS criterioOrigenId,
                            c.Codigo AS codigo,
                            c.Nombre AS nombre,
                            c.Descripcion AS descripcion,
                            c.Ponderacion AS ponderacion,
                            c.NivelExigencia AS nivelExigencia,
                            c.IdTipoItemPredeterminado
                                AS tipoItemPredeterminadoId,
                            c.IdEscalaPredeterminada
                                AS escalaPredeterminadaId,
                            c.Orden AS orden,
                            c.Activo AS activo,
                            mp.IdPuesto AS puestoId,
                            p.Codigo AS puestoCodigo,
                            p.Nombre AS puestoNombre,
                            me.IdEscenario AS escenarioId,
                            ce.Codigo AS escenarioCodigo,
                            ce.Nombre AS escenarioNombre,
                            JSON_QUERY((
                                SELECT
                                    i.IdItemEvaluativo AS id,
                                    i.IdItemOrigen AS itemOrigenId,
                                    i.Codigo AS codigo,
                                    i.Texto AS texto,
                                    i.IdTipoItem AS tipoItemId,
                                    i.IdEscala AS escalaId,
                                    i.Requerido AS requerido,
                                    i.PermiteNoAplica AS permiteNoAplica,
                                    i.Orden AS orden,
                                    i.Activo AS activo
                                FROM dbo.DES_ItemEvaluativo i
                                WHERE i.IdCriterioEvaluacion =
                                    c.IdCriterioEvaluacion
                                ORDER BY i.Orden, i.IdItemEvaluativo
                                FOR JSON PATH
                            )) AS items
                        FROM dbo.DES_CriterioEvaluacion c
                        INNER JOIN dbo.DES_ModeloPuestoEscenario mpe
                            ON mpe.IdModeloPuestoEscenario =
                                c.IdModeloPuestoEscenario
                        INNER JOIN dbo.DES_ModeloPuesto mp
                            ON mp.IdModeloPuesto = mpe.IdModeloPuesto
                        INNER JOIN dbo.DES_Puesto p
                            ON p.IdPuesto = mp.IdPuesto
                        INNER JOIN dbo.DES_ModeloEscenario me
                            ON me.IdModeloEscenario =
                                mpe.IdModeloEscenario
                        INNER JOIN dbo.DES_CatEscenario ce
                            ON ce.IdEscenario = me.IdEscenario
                        WHERE c.IdModeloDimension =
                                d.IdModeloDimension
                          AND mp.IdModelo = m.IdModelo
                        ORDER BY
                            mp.Orden,
                            me.Orden,
                            c.Orden,
                            c.IdCriterioEvaluacion
                        FOR JSON PATH
                    )) AS criterios
                FROM dbo.DES_ModeloDimension d
                WHERE d.IdModelo = m.IdModelo
                ORDER BY d.Orden, d.IdModeloDimension
                FOR JSON PATH
            ) AS dimensiones,
            COUNT(*) OVER() AS TotalRegistros
        FROM dbo.DES_Modelo m
        INNER JOIN dbo.DES_CatTipoModelo tm
            ON tm.IdTipoModelo = m.IdTipoModelo
        INNER JOIN dbo.DES_CatEstadoModelo em
            ON em.IdEstadoModelo = m.IdEstadoModelo
        WHERE m.IdOrganizacion = @IdOrganizacion
          AND (@EstadoCodigo IS NULL OR em.Codigo = UPPER(@EstadoCodigo))
          AND (@TipoCodigo IS NULL OR tm.Codigo = UPPER(@TipoCodigo))
          AND (@Activo IS NULL OR m.Activo = @Activo)
          AND (
              @Buscar IS NULL
              OR m.Codigo LIKE N'%' + @Buscar + N'%'
              OR m.Nombre LIKE N'%' + @Buscar + N'%'
          )
    )
    SELECT *
    FROM Datos
    ORDER BY nombre, version DESC, id
    OFFSET (@Pagina - 1) * @Limite ROWS
    FETCH NEXT @Limite ROWS ONLY;

    DECLARE @Total INT = (
        SELECT COUNT(*)
        FROM dbo.DES_Modelo m
        INNER JOIN dbo.DES_CatTipoModelo tm
            ON tm.IdTipoModelo = m.IdTipoModelo
        INNER JOIN dbo.DES_CatEstadoModelo em
            ON em.IdEstadoModelo = m.IdEstadoModelo
        WHERE m.IdOrganizacion = @IdOrganizacion
          AND (@EstadoCodigo IS NULL OR em.Codigo = UPPER(@EstadoCodigo))
          AND (@TipoCodigo IS NULL OR tm.Codigo = UPPER(@TipoCodigo))
          AND (@Activo IS NULL OR m.Activo = @Activo)
          AND (
              @Buscar IS NULL
              OR m.Codigo LIKE N'%' + @Buscar + N'%'
              OR m.Nombre LIKE N'%' + @Buscar + N'%'
          )
    );

    SELECT
        @Pagina AS Pagina,
        @Limite AS Limite,
        @Total AS TotalRegistros,
        CEILING(CONVERT(DECIMAL(18,4), @Total) / @Limite) AS TotalPaginas;
END
GO

/* ============================================================
   7. Guardado jerarquico de modelos
   ============================================================ */

CREATE OR ALTER PROCEDURE dbo.DES_sp_Modelos_Guardar
    @IdModelo INT = NULL,
    @IdOrganizacion INT,
    @PayloadJson NVARCHAR(MAX),
    @Usuario NVARCHAR(100) = NULL
AS
BEGIN
    SET NOCOUNT ON;
    SET XACT_ABORT ON;

    DECLARE
        @EsNuevo BIT = CASE WHEN @IdModelo IS NULL THEN 1 ELSE 0 END,
        @IdEvaluacionCreada BIGINT = NULL;

    IF ISJSON(@PayloadJson) <> 1
        THROW 52104, 'El JSON del modelo es invalido.', 1;

    IF NOT EXISTS (
        SELECT 1
        FROM dbo.Organizaciones
        WHERE Id = @IdOrganizacion
    )
        THROW 52001, 'No existe la organizacion indicada.', 1;

    IF @IdModelo IS NOT NULL
    BEGIN
        IF NOT EXISTS (
            SELECT 1
            FROM dbo.DES_Modelo
            WHERE IdModelo = @IdModelo
              AND IdOrganizacion = @IdOrganizacion
        )
            THROW 52101, 'No existe el modelo indicado.', 1;

        IF EXISTS (
            SELECT 1
            FROM dbo.DES_Evaluacion e
            WHERE e.IdModelo = @IdModelo
              AND (
                  EXISTS (
                      SELECT 1
                      FROM dbo.DES_AsignacionEvaluacion a
                      WHERE a.IdEvaluacion = e.IdEvaluacion
                        AND a.FechaInicioRespuesta IS NOT NULL
                  )
                  OR EXISTS (
                      SELECT 1
                      FROM dbo.DES_RespuestaEvaluacion r
                      INNER JOIN dbo.DES_AsignacionEvaluacion a
                          ON a.IdAsignacion = r.IdAsignacion
                      WHERE a.IdEvaluacion = e.IdEvaluacion
                  )
              )
        )
            THROW 52102, 'La version ya tiene evaluaciones iniciadas; cree una nueva version.', 1;
    END

    DECLARE
        @Codigo NVARCHAR(50) = JSON_VALUE(@PayloadJson, '$.codigo'),
        @Version INT = TRY_CONVERT(INT, JSON_VALUE(@PayloadJson, '$.version')),
        @Nombre NVARCHAR(200) = JSON_VALUE(@PayloadJson, '$.nombre'),
        @Descripcion NVARCHAR(1000) = JSON_VALUE(@PayloadJson, '$.descripcion'),
        @IdTipoModelo SMALLINT =
            TRY_CONVERT(SMALLINT, JSON_VALUE(@PayloadJson, '$.tipoModeloId')),
        @IdEstadoModelo SMALLINT =
            TRY_CONVERT(SMALLINT, JSON_VALUE(@PayloadJson, '$.estadoModeloId')),
        @IdEscala INT =
            TRY_CONVERT(INT, JSON_VALUE(@PayloadJson, '$.escalaPredeterminadaId')),
        @IdMetodo SMALLINT =
            TRY_CONVERT(SMALLINT, JSON_VALUE(@PayloadJson, '$.metodoCalculoId')),
        @UsaPonderacion BIT =
            TRY_CONVERT(BIT, JSON_VALUE(@PayloadJson, '$.usaPonderacion')),
        @UsaAnonimato BIT =
            TRY_CONVERT(BIT, JSON_VALUE(@PayloadJson, '$.usaAnonimato')),
        @Minimo SMALLINT =
            TRY_CONVERT(SMALLINT, JSON_VALUE(@PayloadJson, '$.minimoRespuestasAnonimas')),
        @FechaInicio DATE =
            TRY_CONVERT(DATE, JSON_VALUE(@PayloadJson, '$.fechaInicio')),
        @FechaCierre DATE =
            TRY_CONVERT(DATE, JSON_VALUE(@PayloadJson, '$.fechaCierre')),
        @Activo BIT =
            TRY_CONVERT(BIT, JSON_VALUE(@PayloadJson, '$.activo'));

    IF @Codigo IS NULL OR @Version IS NULL OR @Nombre IS NULL
       OR @IdTipoModelo IS NULL OR @IdEstadoModelo IS NULL
       OR @IdEscala IS NULL OR @IdMetodo IS NULL
       OR @UsaPonderacion IS NULL OR @UsaAnonimato IS NULL
       OR @Minimo IS NULL OR @FechaInicio IS NULL OR @FechaCierre IS NULL
        THROW 52104, 'Faltan datos obligatorios del modelo.', 1;

    IF @FechaInicio > @FechaCierre
        THROW 52104, 'La fecha de inicio no puede ser posterior a la fecha de cierre.', 1;

    IF EXISTS (
        SELECT 1
        FROM dbo.DES_Modelo
        WHERE IdOrganizacion = @IdOrganizacion
          AND Codigo = @Codigo
          AND Version = @Version
          AND (@IdModelo IS NULL OR IdModelo <> @IdModelo)
    )
        THROW 52103, 'Ya existe el codigo y version en la organizacion.', 1;

    IF NOT EXISTS (
        SELECT 1
        FROM dbo.DES_CatTipoModelo
        WHERE IdTipoModelo = @IdTipoModelo
          AND Activo = 1
    )
       OR NOT EXISTS (
           SELECT 1
           FROM dbo.DES_CatEstadoModelo
           WHERE IdEstadoModelo = @IdEstadoModelo
             AND Activo = 1
       )
       OR NOT EXISTS (
           SELECT 1
           FROM dbo.DES_CatMetodoCalculo
           WHERE IdMetodoCalculo = @IdMetodo
             AND Activo = 1
       )
       OR NOT EXISTS (
           SELECT 1
           FROM dbo.DES_Escala
           WHERE IdEscala = @IdEscala
             AND Activo = 1
             AND (IdOrganizacion IS NULL OR IdOrganizacion = @IdOrganizacion)
       )
        THROW 52104, 'Tipo, estado, escala o metodo de calculo invalidos.', 1;

    DECLARE @EmpleadosEspecificos TABLE (
        IdEmpleado INT NOT NULL PRIMARY KEY
    );

    IF EXISTS (
        SELECT 1
        FROM OPENJSON(
            ISNULL(
                JSON_QUERY(@PayloadJson, '$.empleadosEspecificosIds'),
                N'[]'
            )
        )
        WHERE TRY_CONVERT(INT, [value]) IS NULL
           OR TRY_CONVERT(INT, [value]) <= 0
    )
        THROW 52104, 'La lista de empleados especificos contiene valores invalidos.', 1;

    INSERT @EmpleadosEspecificos (IdEmpleado)
    SELECT DISTINCT TRY_CONVERT(INT, [value])
    FROM OPENJSON(
        ISNULL(
            JSON_QUERY(@PayloadJson, '$.empleadosEspecificosIds'),
            N'[]'
        )
    );

    IF EXISTS (
        SELECT 1
        FROM @EmpleadosEspecificos ee
        LEFT JOIN dbo.Empleados e
            ON e.Id = ee.IdEmpleado
           AND e.IdOrganizacion = @IdOrganizacion
        WHERE e.Id IS NULL
    )
        THROW 52104, 'Uno o mas empleados especificos no pertenecen a la organizacion.', 1;

    IF @IdModelo IS NULL
    BEGIN
        INSERT dbo.DES_Modelo (
            IdOrganizacion,
            Codigo,
            Version,
            Nombre,
            Descripcion,
            IdTipoModelo,
            IdEstadoModelo,
            IdEscalaPredeterminada,
            IdMetodoCalculo,
            UsaPonderacion,
            UsaAnonimato,
            MinimoRespuestasAnonimas,
            FechaInicio,
            FechaCierre,
            JsonFuente,
            Activo,
            UsuarioCreacion
        )
        VALUES (
            @IdOrganizacion,
            @Codigo,
            @Version,
            @Nombre,
            @Descripcion,
            @IdTipoModelo,
            @IdEstadoModelo,
            @IdEscala,
            @IdMetodo,
            @UsaPonderacion,
            @UsaAnonimato,
            @Minimo,
            @FechaInicio,
            @FechaCierre,
            @PayloadJson,
            ISNULL(@Activo, 1),
            @Usuario
        );

        SET @IdModelo = CONVERT(INT, SCOPE_IDENTITY());
    END
    ELSE
    BEGIN
        UPDATE dbo.DES_Modelo
        SET Codigo = @Codigo,
            Version = @Version,
            Nombre = @Nombre,
            Descripcion = @Descripcion,
            IdTipoModelo = @IdTipoModelo,
            IdEstadoModelo = @IdEstadoModelo,
            IdEscalaPredeterminada = @IdEscala,
            IdMetodoCalculo = @IdMetodo,
            UsaPonderacion = @UsaPonderacion,
            UsaAnonimato = @UsaAnonimato,
            MinimoRespuestasAnonimas = @Minimo,
            FechaInicio = @FechaInicio,
            FechaCierre = @FechaCierre,
            JsonFuente = @PayloadJson,
            Activo = ISNULL(@Activo, Activo),
            FechaModificacion = SYSDATETIME(),
            UsuarioModificacion = @Usuario
        WHERE IdModelo = @IdModelo;
    END

    UPDATE mee
    SET Activo = 0,
        FechaModificacion = SYSDATETIME(),
        UsuarioModificacion = @Usuario
    FROM dbo.DES_ModeloEmpleadoEspecifico mee
    WHERE mee.IdModelo = @IdModelo
      AND mee.Activo = 1
      AND NOT EXISTS (
          SELECT 1
          FROM @EmpleadosEspecificos ee
          WHERE ee.IdEmpleado = mee.IdEmpleado
      );

    MERGE dbo.DES_ModeloEmpleadoEspecifico AS T
    USING @EmpleadosEspecificos AS S
       ON T.IdModelo = @IdModelo
      AND T.IdEmpleado = S.IdEmpleado
    WHEN MATCHED THEN
        UPDATE SET
            Activo = 1,
            FechaModificacion = SYSDATETIME(),
            UsuarioModificacion = @Usuario
    WHEN NOT MATCHED THEN
        INSERT (
            IdModelo,
            IdEmpleado,
            Activo,
            UsuarioCreacion
        )
        VALUES (
            @IdModelo,
            S.IdEmpleado,
            1,
            @Usuario
        );

    DECLARE @Dimensiones TABLE (
        Id INT NULL,
        Codigo NVARCHAR(50),
        Nombre NVARCHAR(150),
        Descripcion NVARCHAR(500),
        Ponderacion DECIMAL(5,2),
        Orden SMALLINT,
        Activo BIT
    );

    INSERT @Dimensiones (
        Id,
        Codigo,
        Nombre,
        Descripcion,
        Ponderacion,
        Orden,
        Activo
    )
    SELECT
        id,
        codigo,
        nombre,
        descripcion,
        ponderacion,
        orden,
        activo
    FROM OPENJSON(@PayloadJson, '$.dimensiones') WITH (
        id INT '$.id',
        codigo NVARCHAR(50) '$.codigo',
        nombre NVARCHAR(150) '$.nombre',
        descripcion NVARCHAR(500) '$.descripcion',
        ponderacion DECIMAL(5,2) '$.ponderacion',
        orden SMALLINT '$.orden',
        activo BIT '$.activo'
    );

    MERGE dbo.DES_ModeloDimension AS T
    USING @Dimensiones AS S
       ON T.IdModelo = @IdModelo
      AND (
          (S.Id IS NOT NULL AND T.IdModeloDimension = S.Id)
          OR (S.Id IS NULL AND T.Codigo = S.Codigo)
      )
    WHEN MATCHED THEN
        UPDATE SET
            Codigo = S.Codigo,
            Nombre = S.Nombre,
            Descripcion = S.Descripcion,
            Ponderacion = S.Ponderacion,
            Orden = S.Orden,
            Activo = ISNULL(S.Activo, 1)
    WHEN NOT MATCHED THEN
        INSERT (
            IdModelo,
            Codigo,
            Nombre,
            Descripcion,
            Ponderacion,
            Orden,
            Activo
        )
        VALUES (
            @IdModelo,
            S.Codigo,
            S.Nombre,
            S.Descripcion,
            S.Ponderacion,
            S.Orden,
            ISNULL(S.Activo, 1)
        );

    UPDATE d
    SET Activo = 0
    FROM dbo.DES_ModeloDimension d
    WHERE d.IdModelo = @IdModelo
      AND NOT EXISTS (
          SELECT 1
          FROM @Dimensiones s
          WHERE (s.Id IS NOT NULL AND s.Id = d.IdModeloDimension)
             OR (s.Id IS NULL AND s.Codigo = d.Codigo)
      );

    DECLARE @Escenarios TABLE (
        Id INT NULL,
        IdEscenario SMALLINT,
        Ponderacion DECIMAL(5,2),
        EsAnonimo BIT,
        Minimo SMALLINT NULL,
        Orden SMALLINT,
        Activo BIT
    );

    INSERT @Escenarios (
        Id,
        IdEscenario,
        Ponderacion,
        EsAnonimo,
        Minimo,
        Orden,
        Activo
    )
    SELECT
        id,
        escenarioId,
        ponderacion,
        esAnonimo,
        minimo,
        orden,
        activo
    FROM OPENJSON(@PayloadJson, '$.escenarios') WITH (
        id INT '$.id',
        escenarioId SMALLINT '$.escenarioId',
        ponderacion DECIMAL(5,2) '$.ponderacion',
        esAnonimo BIT '$.esAnonimo',
        minimo SMALLINT '$.minimoRespuestasAnonimas',
        orden SMALLINT '$.orden',
        activo BIT '$.activo'
    );

    IF EXISTS (
        SELECT 1
        FROM @Escenarios s
        LEFT JOIN dbo.DES_CatEscenario e
            ON e.IdEscenario = s.IdEscenario
           AND e.Activo = 1
        WHERE e.IdEscenario IS NULL
    )
        THROW 52104, 'Existe un escenario invalido.', 1;

    MERGE dbo.DES_ModeloEscenario AS T
    USING @Escenarios AS S
       ON T.IdModelo = @IdModelo
      AND T.IdEscenario = S.IdEscenario
    WHEN MATCHED THEN
        UPDATE SET
            Ponderacion = S.Ponderacion,
            EsAnonimo = S.EsAnonimo,
            MinimoRespuestasAnonimas = S.Minimo,
            Orden = S.Orden,
            Activo = ISNULL(S.Activo, 1)
    WHEN NOT MATCHED THEN
        INSERT (
            IdModelo,
            IdEscenario,
            Ponderacion,
            EsAnonimo,
            MinimoRespuestasAnonimas,
            Orden,
            Activo
        )
        VALUES (
            @IdModelo,
            S.IdEscenario,
            S.Ponderacion,
            S.EsAnonimo,
            S.Minimo,
            S.Orden,
            ISNULL(S.Activo, 1)
        );

    UPDATE e
    SET Activo = 0
    FROM dbo.DES_ModeloEscenario e
    WHERE e.IdModelo = @IdModelo
      AND NOT EXISTS (
          SELECT 1
          FROM @Escenarios s
          WHERE s.IdEscenario = e.IdEscenario
      );

    DECLARE @Puestos TABLE (
        Id INT NULL,
        IdPuesto INT,
        SoloEvaluador BIT,
        Orden SMALLINT,
        Activo BIT,
        EscenariosJson NVARCHAR(MAX)
    );

    INSERT @Puestos (
        Id,
        IdPuesto,
        SoloEvaluador,
        Orden,
        Activo,
        EscenariosJson
    )
    SELECT
        id,
        puestoId,
        soloEvaluador,
        orden,
        activo,
        escenarios
    FROM OPENJSON(@PayloadJson, '$.puestos') WITH (
        id INT '$.id',
        puestoId INT '$.puestoId',
        soloEvaluador BIT '$.soloEvaluador',
        orden SMALLINT '$.orden',
        activo BIT '$.activo',
        escenarios NVARCHAR(MAX) '$.escenarios' AS JSON
    );

    IF EXISTS (
        SELECT 1
        FROM @Puestos s
        LEFT JOIN dbo.DES_Puesto p
            ON p.IdPuesto = s.IdPuesto
           AND p.IdOrganizacion = @IdOrganizacion
           AND p.Activo = 1
        WHERE p.IdPuesto IS NULL
    )
        THROW 52104, 'Existe un puesto invalido para la organizacion.', 1;

    MERGE dbo.DES_ModeloPuesto AS T
    USING @Puestos AS S
       ON T.IdModelo = @IdModelo
      AND T.IdPuesto = S.IdPuesto
    WHEN MATCHED THEN
        UPDATE SET
            SoloEvaluador = S.SoloEvaluador,
            Orden = S.Orden,
            Activo = ISNULL(S.Activo, 1)
    WHEN NOT MATCHED THEN
        INSERT (
            IdModelo,
            IdPuesto,
            SoloEvaluador,
            Orden,
            Activo
        )
        VALUES (
            @IdModelo,
            S.IdPuesto,
            S.SoloEvaluador,
            S.Orden,
            ISNULL(S.Activo, 1)
        );

    UPDATE p
    SET Activo = 0
    FROM dbo.DES_ModeloPuesto p
    WHERE p.IdModelo = @IdModelo
      AND NOT EXISTS (
          SELECT 1
          FROM @Puestos s
          WHERE s.IdPuesto = p.IdPuesto
      );

    DECLARE @PuestoEscenarios TABLE (
        Id INT NULL,
        IdPuesto INT,
        IdEscenario SMALLINT,
        Ponderacion DECIMAL(5,2),
        Orden SMALLINT,
        Activo BIT,
        CriteriosJson NVARCHAR(MAX)
    );

    INSERT @PuestoEscenarios (
        Id,
        IdPuesto,
        IdEscenario,
        Ponderacion,
        Orden,
        Activo,
        CriteriosJson
    )
    SELECT
        j.id,
        p.IdPuesto,
        j.escenarioId,
        j.ponderacion,
        j.orden,
        j.activo,
        j.criterios
    FROM @Puestos p
    CROSS APPLY OPENJSON(ISNULL(p.EscenariosJson, N'[]')) WITH (
        id INT '$.id',
        escenarioId SMALLINT '$.escenarioId',
        ponderacion DECIMAL(5,2) '$.ponderacion',
        orden SMALLINT '$.orden',
        activo BIT '$.activo',
        criterios NVARCHAR(MAX) '$.criteriosPorDimension' AS JSON
    ) j;

    MERGE dbo.DES_ModeloPuestoEscenario AS T
    USING (
        SELECT
            pe.*,
            mp.IdModeloPuesto,
            me.IdModeloEscenario
        FROM @PuestoEscenarios pe
        INNER JOIN dbo.DES_ModeloPuesto mp
            ON mp.IdModelo = @IdModelo
           AND mp.IdPuesto = pe.IdPuesto
        INNER JOIN dbo.DES_ModeloEscenario me
            ON me.IdModelo = @IdModelo
           AND me.IdEscenario = pe.IdEscenario
    ) AS S
       ON T.IdModeloPuesto = S.IdModeloPuesto
      AND T.IdModeloEscenario = S.IdModeloEscenario
    WHEN MATCHED THEN
        UPDATE SET
            Ponderacion = S.Ponderacion,
            Orden = S.Orden,
            Activo = ISNULL(S.Activo, 1)
    WHEN NOT MATCHED THEN
        INSERT (
            IdModeloPuesto,
            IdModeloEscenario,
            Ponderacion,
            Orden,
            Activo
        )
        VALUES (
            S.IdModeloPuesto,
            S.IdModeloEscenario,
            S.Ponderacion,
            S.Orden,
            ISNULL(S.Activo, 1)
        );

    UPDATE mpe
    SET Activo = 0
    FROM dbo.DES_ModeloPuestoEscenario mpe
    INNER JOIN dbo.DES_ModeloPuesto mp
        ON mp.IdModeloPuesto = mpe.IdModeloPuesto
    INNER JOIN dbo.DES_ModeloEscenario me
        ON me.IdModeloEscenario = mpe.IdModeloEscenario
    WHERE mp.IdModelo = @IdModelo
      AND NOT EXISTS (
          SELECT 1
          FROM @PuestoEscenarios s
          WHERE s.IdPuesto = mp.IdPuesto
            AND s.IdEscenario = me.IdEscenario
      );

    DECLARE @Criterios TABLE (
        Id INT NULL,
        IdPuesto INT,
        IdEscenario SMALLINT,
        DimensionId INT NULL,
        DimensionCodigo NVARCHAR(50),
        Codigo NVARCHAR(50),
        Nombre NVARCHAR(180),
        Descripcion NVARCHAR(700),
        Ponderacion DECIMAL(5,2),
        Nivel DECIMAL(9,4),
        TipoItem SMALLINT,
        Escala INT NULL,
        Orden SMALLINT,
        Activo BIT,
        ItemsJson NVARCHAR(MAX)
    );

    INSERT @Criterios (
        Id,
        IdPuesto,
        IdEscenario,
        DimensionId,
        DimensionCodigo,
        Codigo,
        Nombre,
        Descripcion,
        Ponderacion,
        Nivel,
        TipoItem,
        Escala,
        Orden,
        Activo,
        ItemsJson
    )
    SELECT
        c.id,
        pe.IdPuesto,
        pe.IdEscenario,
        d.dimensionId,
        d.dimensionCodigo,
        c.codigo,
        c.nombre,
        c.descripcion,
        c.ponderacion,
        c.nivel,
        c.tipoItem,
        c.escala,
        c.orden,
        c.activo,
        c.items
    FROM @PuestoEscenarios pe
    CROSS APPLY OPENJSON(ISNULL(pe.CriteriosJson, N'[]')) WITH (
        dimensionId INT '$.dimensionId',
        dimensionCodigo NVARCHAR(50) '$.dimensionCodigo',
        criterios NVARCHAR(MAX) '$.criterios' AS JSON
    ) d
    CROSS APPLY OPENJSON(ISNULL(d.criterios, N'[]')) WITH (
        id INT '$.id',
        codigo NVARCHAR(50) '$.codigo',
        nombre NVARCHAR(180) '$.nombre',
        descripcion NVARCHAR(700) '$.descripcion',
        ponderacion DECIMAL(5,2) '$.ponderacion',
        nivel DECIMAL(9,4) '$.nivelExigencia',
        tipoItem SMALLINT '$.tipoItemPredeterminadoId',
        escala INT '$.escalaPredeterminadaId',
        orden SMALLINT '$.orden',
        activo BIT '$.activo',
        items NVARCHAR(MAX) '$.items' AS JSON
    ) c;

    IF EXISTS (
        SELECT 1
        FROM @Criterios c
        LEFT JOIN dbo.DES_ModeloDimension d
            ON d.IdModelo = @IdModelo
           AND (
               (c.DimensionId IS NOT NULL AND d.IdModeloDimension = c.DimensionId)
               OR (c.DimensionId IS NULL AND d.Codigo = c.DimensionCodigo)
           )
        WHERE d.IdModeloDimension IS NULL
    )
        THROW 52104, 'Existe una dimension invalida en los criterios.', 1;

    IF EXISTS (
        SELECT 1
        FROM @Criterios c
        LEFT JOIN dbo.DES_CatTipoItem ti
            ON ti.IdTipoItem = c.TipoItem
           AND ti.Activo = 1
        LEFT JOIN dbo.DES_Escala e
            ON e.IdEscala = c.Escala
           AND e.Activo = 1
           AND (e.IdOrganizacion IS NULL OR e.IdOrganizacion = @IdOrganizacion)
        WHERE ti.IdTipoItem IS NULL
           OR (c.Escala IS NOT NULL AND e.IdEscala IS NULL)
    )
        THROW 52104, 'Existe un tipo de item o escala invalido en los criterios.', 1;

    MERGE dbo.DES_CriterioEvaluacion AS T
    USING (
        SELECT
            c.*,
            mpe.IdModeloPuestoEscenario,
            d.IdModeloDimension
        FROM @Criterios c
        INNER JOIN dbo.DES_ModeloPuesto mp
            ON mp.IdModelo = @IdModelo
           AND mp.IdPuesto = c.IdPuesto
        INNER JOIN dbo.DES_ModeloEscenario me
            ON me.IdModelo = @IdModelo
           AND me.IdEscenario = c.IdEscenario
        INNER JOIN dbo.DES_ModeloPuestoEscenario mpe
            ON mpe.IdModeloPuesto = mp.IdModeloPuesto
           AND mpe.IdModeloEscenario = me.IdModeloEscenario
        INNER JOIN dbo.DES_ModeloDimension d
            ON d.IdModelo = @IdModelo
           AND (
               (c.DimensionId IS NOT NULL AND d.IdModeloDimension = c.DimensionId)
               OR (c.DimensionId IS NULL AND d.Codigo = c.DimensionCodigo)
           )
    ) S
       ON T.IdModeloPuestoEscenario = S.IdModeloPuestoEscenario
      AND T.IdModeloDimension = S.IdModeloDimension
      AND (
          (S.Id IS NOT NULL AND T.IdCriterioEvaluacion = S.Id)
          OR (
              S.Id IS NULL
              AND ISNULL(T.Codigo, T.Nombre) = ISNULL(S.Codigo, S.Nombre)
          )
      )
    WHEN MATCHED THEN
        UPDATE SET
            Codigo = S.Codigo,
            Nombre = S.Nombre,
            Descripcion = S.Descripcion,
            Ponderacion = S.Ponderacion,
            NivelExigencia = S.Nivel,
            IdTipoItemPredeterminado = S.TipoItem,
            IdEscalaPredeterminada = S.Escala,
            Orden = S.Orden,
            Activo = ISNULL(S.Activo, 1)
    WHEN NOT MATCHED THEN
        INSERT (
            IdModeloPuestoEscenario,
            IdModeloDimension,
            Codigo,
            Nombre,
            Descripcion,
            Ponderacion,
            NivelExigencia,
            IdTipoItemPredeterminado,
            IdEscalaPredeterminada,
            Orden,
            Activo
        )
        VALUES (
            S.IdModeloPuestoEscenario,
            S.IdModeloDimension,
            S.Codigo,
            S.Nombre,
            S.Descripcion,
            S.Ponderacion,
            S.Nivel,
            S.TipoItem,
            S.Escala,
            S.Orden,
            ISNULL(S.Activo, 1)
        );

    UPDATE c
    SET Activo = 0
    FROM dbo.DES_CriterioEvaluacion c
    INNER JOIN dbo.DES_ModeloPuestoEscenario mpe
        ON mpe.IdModeloPuestoEscenario = c.IdModeloPuestoEscenario
    INNER JOIN dbo.DES_ModeloPuesto mp
        ON mp.IdModeloPuesto = mpe.IdModeloPuesto
    INNER JOIN dbo.DES_ModeloEscenario me
        ON me.IdModeloEscenario = mpe.IdModeloEscenario
    WHERE mp.IdModelo = @IdModelo
      AND NOT EXISTS (
          SELECT 1
          FROM @Criterios s
          INNER JOIN dbo.DES_ModeloDimension d
              ON d.IdModelo = @IdModelo
             AND (
                 (s.DimensionId IS NOT NULL AND d.IdModeloDimension = s.DimensionId)
                 OR (s.DimensionId IS NULL AND d.Codigo = s.DimensionCodigo)
             )
          WHERE s.IdPuesto = mp.IdPuesto
            AND s.IdEscenario = me.IdEscenario
            AND d.IdModeloDimension = c.IdModeloDimension
            AND (
                (s.Id IS NOT NULL AND s.Id = c.IdCriterioEvaluacion)
                OR (
                    s.Id IS NULL
                    AND ISNULL(s.Codigo, s.Nombre) = ISNULL(c.Codigo, c.Nombre)
                )
            )
      );

    DECLARE @Items TABLE (
        Id INT NULL,
        CriterioId INT NULL,
        CriterioCodigo NVARCHAR(180),
        IdPuesto INT,
        IdEscenario SMALLINT,
        DimensionId INT NULL,
        DimensionCodigo NVARCHAR(50),
        Codigo NVARCHAR(50),
        Texto NVARCHAR(1500),
        TipoItem SMALLINT,
        Escala INT NULL,
        Requerido BIT,
        PermiteNoAplica BIT,
        Orden SMALLINT,
        Activo BIT
    );

    INSERT @Items (
        Id,
        CriterioId,
        CriterioCodigo,
        IdPuesto,
        IdEscenario,
        DimensionId,
        DimensionCodigo,
        Codigo,
        Texto,
        TipoItem,
        Escala,
        Requerido,
        PermiteNoAplica,
        Orden,
        Activo
    )
    SELECT
        i.id,
        c.Id,
        ISNULL(c.Codigo, c.Nombre),
        c.IdPuesto,
        c.IdEscenario,
        c.DimensionId,
        c.DimensionCodigo,
        i.codigo,
        i.texto,
        i.tipoItem,
        i.escala,
        i.requerido,
        i.permiteNoAplica,
        i.orden,
        i.activo
    FROM @Criterios c
    CROSS APPLY OPENJSON(ISNULL(c.ItemsJson, N'[]')) WITH (
        id INT '$.id',
        codigo NVARCHAR(50) '$.codigo',
        texto NVARCHAR(1500) '$.texto',
        tipoItem SMALLINT '$.tipoItemId',
        escala INT '$.escalaId',
        requerido BIT '$.requerido',
        permiteNoAplica BIT '$.permiteNoAplica',
        orden SMALLINT '$.orden',
        activo BIT '$.activo'
    ) i;

    IF EXISTS (
        SELECT 1
        FROM @Items i
        LEFT JOIN dbo.DES_CatTipoItem ti
            ON ti.IdTipoItem = i.TipoItem
           AND ti.Activo = 1
        LEFT JOIN dbo.DES_Escala e
            ON e.IdEscala = i.Escala
           AND e.Activo = 1
           AND (e.IdOrganizacion IS NULL OR e.IdOrganizacion = @IdOrganizacion)
        WHERE ti.IdTipoItem IS NULL
           OR (i.Escala IS NOT NULL AND e.IdEscala IS NULL)
    )
        THROW 52104, 'Existe un tipo de item o escala invalido en los items.', 1;

    MERGE dbo.DES_ItemEvaluativo AS T
    USING (
        SELECT
            i.*,
            c.IdCriterioEvaluacion
        FROM @Items i
        INNER JOIN dbo.DES_ModeloPuesto mp
            ON mp.IdModelo = @IdModelo
           AND mp.IdPuesto = i.IdPuesto
        INNER JOIN dbo.DES_ModeloEscenario me
            ON me.IdModelo = @IdModelo
           AND me.IdEscenario = i.IdEscenario
        INNER JOIN dbo.DES_ModeloPuestoEscenario mpe
            ON mpe.IdModeloPuesto = mp.IdModeloPuesto
           AND mpe.IdModeloEscenario = me.IdModeloEscenario
        INNER JOIN dbo.DES_ModeloDimension d
            ON d.IdModelo = @IdModelo
           AND (
               (i.DimensionId IS NOT NULL AND d.IdModeloDimension = i.DimensionId)
               OR (i.DimensionId IS NULL AND d.Codigo = i.DimensionCodigo)
           )
        INNER JOIN dbo.DES_CriterioEvaluacion c
            ON c.IdModeloPuestoEscenario = mpe.IdModeloPuestoEscenario
           AND c.IdModeloDimension = d.IdModeloDimension
           AND (
               (i.CriterioId IS NOT NULL AND c.IdCriterioEvaluacion = i.CriterioId)
               OR (
                   i.CriterioId IS NULL
                   AND ISNULL(c.Codigo, c.Nombre) = i.CriterioCodigo
               )
           )
    ) S
       ON T.IdCriterioEvaluacion = S.IdCriterioEvaluacion
      AND (
          (S.Id IS NOT NULL AND T.IdItemEvaluativo = S.Id)
          OR (
              S.Id IS NULL
              AND ISNULL(T.Codigo, CONVERT(NVARCHAR(20), T.Orden))
                  = ISNULL(S.Codigo, CONVERT(NVARCHAR(20), S.Orden))
          )
      )
    WHEN MATCHED THEN
        UPDATE SET
            Codigo = S.Codigo,
            Texto = S.Texto,
            IdTipoItem = S.TipoItem,
            IdEscala = S.Escala,
            Requerido = S.Requerido,
            PermiteNoAplica = S.PermiteNoAplica,
            Orden = S.Orden,
            Activo = ISNULL(S.Activo, 1)
    WHEN NOT MATCHED THEN
        INSERT (
            IdCriterioEvaluacion,
            Codigo,
            Texto,
            IdTipoItem,
            IdEscala,
            Requerido,
            PermiteNoAplica,
            Orden,
            Activo
        )
        VALUES (
            S.IdCriterioEvaluacion,
            S.Codigo,
            S.Texto,
            S.TipoItem,
            S.Escala,
            S.Requerido,
            S.PermiteNoAplica,
            S.Orden,
            ISNULL(S.Activo, 1)
        );

    UPDATE i
    SET Activo = 0
    FROM dbo.DES_ItemEvaluativo i
    INNER JOIN dbo.DES_CriterioEvaluacion c
        ON c.IdCriterioEvaluacion = i.IdCriterioEvaluacion
    INNER JOIN dbo.DES_ModeloPuestoEscenario mpe
        ON mpe.IdModeloPuestoEscenario = c.IdModeloPuestoEscenario
    INNER JOIN dbo.DES_ModeloPuesto mp
        ON mp.IdModeloPuesto = mpe.IdModeloPuesto
    INNER JOIN dbo.DES_ModeloEscenario me
        ON me.IdModeloEscenario = mpe.IdModeloEscenario
    INNER JOIN dbo.DES_ModeloDimension d
        ON d.IdModeloDimension = c.IdModeloDimension
    WHERE mp.IdModelo = @IdModelo
      AND NOT EXISTS (
          SELECT 1
          FROM @Items s
          WHERE (s.Id IS NOT NULL AND s.Id = i.IdItemEvaluativo)
             OR (
                 s.Id IS NULL
                 AND s.IdPuesto = mp.IdPuesto
                 AND s.IdEscenario = me.IdEscenario
                 AND (
                     (s.DimensionId IS NOT NULL
                      AND s.DimensionId = d.IdModeloDimension)
                     OR (s.DimensionId IS NULL
                         AND s.DimensionCodigo = d.Codigo)
                 )
                 AND (
                     (s.CriterioId IS NOT NULL
                      AND s.CriterioId = c.IdCriterioEvaluacion)
                     OR (
                         s.CriterioId IS NULL
                         AND s.CriterioCodigo = ISNULL(c.Codigo, c.Nombre)
                     )
                 )
                 AND ISNULL(s.Codigo, CONVERT(NVARCHAR(20), s.Orden))
                     = ISNULL(i.Codigo, CONVERT(NVARCHAR(20), i.Orden))
             )
      );

    IF @EsNuevo = 1
    BEGIN
        DECLARE @IdEstadoEvaluacionBorrador SMALLINT = (
            SELECT IdEstadoEvaluacion
            FROM dbo.DES_CatEstadoEvaluacion
            WHERE Codigo = N'BORRADOR'
              AND Activo = 1
        );

        IF @IdEstadoEvaluacionBorrador IS NULL
            THROW 52104, 'No existe el estado BORRADOR para crear la evaluacion.', 1;

        INSERT dbo.DES_Evaluacion (
            IdOrganizacion,
            IdModelo,
            IdEstadoEvaluacion,
            Nombre,
            Descripcion,
            FechaInicio,
            FechaCierre,
            JsonConfiguracionSnapshot,
            UsuarioCreacion
        )
        VALUES (
            @IdOrganizacion,
            @IdModelo,
            @IdEstadoEvaluacionBorrador,
            @Nombre,
            @Descripcion,
            @FechaInicio,
            @FechaCierre,
            @PayloadJson,
            @Usuario
        );

        SET @IdEvaluacionCreada = CONVERT(BIGINT, SCOPE_IDENTITY());
    END

    SELECT
        @IdModelo AS IdModelo,
        @IdEvaluacionCreada AS IdEvaluacion;
END
GO

/* ============================================================
   8. Obtencion jerarquica de un modelo
   ============================================================ */

CREATE OR ALTER PROCEDURE dbo.DES_sp_Modelos_Obtener
    @IdModelo INT,
    @IdOrganizacion INT
AS
BEGIN
    SET NOCOUNT ON;

    IF NOT EXISTS (
        SELECT 1
        FROM dbo.DES_Modelo
        WHERE IdModelo = @IdModelo
          AND IdOrganizacion = @IdOrganizacion
    )
        THROW 52101, 'No existe el modelo indicado.', 1;

    DECLARE @DataJson NVARCHAR(MAX);

    SELECT @DataJson = (
        SELECT
            m.IdModelo AS id,
            m.IdOrganizacion AS organizacionId,
            m.Codigo AS codigo,
            m.Version AS version,
            m.Nombre AS nombre,
            m.Descripcion AS descripcion,
            JSON_QUERY((
                SELECT
                    tm.IdTipoModelo AS id,
                    tm.Codigo AS codigo,
                    tm.Nombre AS nombre
                FOR JSON PATH, WITHOUT_ARRAY_WRAPPER
            )) AS tipoModelo,
            JSON_QUERY((
                SELECT
                    em.IdEstadoModelo AS id,
                    em.Codigo AS codigo,
                    em.Nombre AS nombre
                FOR JSON PATH, WITHOUT_ARRAY_WRAPPER
            )) AS estado,
            m.IdEscalaPredeterminada AS escalaPredeterminadaId,
            m.IdMetodoCalculo AS metodoCalculoId,
            m.UsaPonderacion AS usaPonderacion,
            m.UsaAnonimato AS usaAnonimato,
            m.MinimoRespuestasAnonimas AS minimoRespuestasAnonimas,
            m.FechaInicio AS fechaInicio,
            m.FechaCierre AS fechaCierre,
            JSON_QUERY(CONCAT(
                N'[',
                ISNULL((
                    SELECT STRING_AGG(
                        CONVERT(NVARCHAR(MAX), mee.IdEmpleado),
                        N','
                    ) WITHIN GROUP (ORDER BY mee.IdEmpleado)
                    FROM dbo.DES_ModeloEmpleadoEspecifico mee
                    WHERE mee.IdModelo = m.IdModelo
                      AND mee.Activo = 1
                ), N''),
                N']'
            )) AS empleadosEspecificosIds,
            m.Activo AS activo,
            m.FechaPublicacion AS fechaPublicacion,
            JSON_QUERY((
                SELECT
                    d.IdModeloDimension AS id,
                    d.Codigo AS codigo,
                    d.Nombre AS nombre,
                    d.Descripcion AS descripcion,
                    d.Ponderacion AS ponderacion,
                    d.Orden AS orden,
                    d.Activo AS activo
                FROM dbo.DES_ModeloDimension d
                WHERE d.IdModelo = m.IdModelo
                ORDER BY d.Orden, d.IdModeloDimension
                FOR JSON PATH
            )) AS dimensiones,
            JSON_QUERY((
                SELECT
                    me.IdModeloEscenario AS id,
                    me.IdEscenario AS escenarioId,
                    ce.Codigo AS codigo,
                    ce.Nombre AS nombre,
                    me.Ponderacion AS ponderacion,
                    me.EsAnonimo AS esAnonimo,
                    me.MinimoRespuestasAnonimas AS minimoRespuestasAnonimas,
                    me.Orden AS orden,
                    me.Activo AS activo
                FROM dbo.DES_ModeloEscenario me
                INNER JOIN dbo.DES_CatEscenario ce
                    ON ce.IdEscenario = me.IdEscenario
                WHERE me.IdModelo = m.IdModelo
                ORDER BY me.Orden, me.IdModeloEscenario
                FOR JSON PATH
            )) AS escenarios,
            JSON_QUERY((
                SELECT
                    mp.IdModeloPuesto AS id,
                    mp.IdPuesto AS puestoId,
                    p.Codigo AS codigo,
                    p.Nombre AS nombre,
                    mp.SoloEvaluador AS soloEvaluador,
                    mp.Orden AS orden,
                    mp.Activo AS activo,
                    JSON_QUERY((
                        SELECT
                            mpe.IdModeloPuestoEscenario AS id,
                            me.IdEscenario AS escenarioId,
                            ce.Codigo AS codigo,
                            ce.Nombre AS nombre,
                            mpe.Ponderacion AS ponderacion,
                            mpe.Orden AS orden,
                            mpe.Activo AS activo,
                            JSON_QUERY((
                                SELECT
                                    d.IdModeloDimension AS dimensionId,
                                    d.Codigo AS dimensionCodigo,
                                    d.Nombre AS dimensionNombre,
                                    JSON_QUERY((
                                        SELECT
                                            c.IdCriterioEvaluacion AS id,
                                            c.IdCriterioOrigen AS criterioOrigenId,
                                            c.Codigo AS codigo,
                                            c.Nombre AS nombre,
                                            c.Descripcion AS descripcion,
                                            c.Ponderacion AS ponderacion,
                                            c.NivelExigencia AS nivelExigencia,
                                            c.IdTipoItemPredeterminado
                                                AS tipoItemPredeterminadoId,
                                            c.IdEscalaPredeterminada
                                                AS escalaPredeterminadaId,
                                            c.Orden AS orden,
                                            c.Activo AS activo,
                                            JSON_QUERY((
                                                SELECT
                                                    i.IdItemEvaluativo AS id,
                                                    i.IdItemOrigen AS itemOrigenId,
                                                    i.Codigo AS codigo,
                                                    i.Texto AS texto,
                                                    i.IdTipoItem AS tipoItemId,
                                                    i.IdEscala AS escalaId,
                                                    i.Requerido AS requerido,
                                                    i.PermiteNoAplica AS permiteNoAplica,
                                                    i.Orden AS orden,
                                                    i.Activo AS activo
                                                FROM dbo.DES_ItemEvaluativo i
                                                WHERE i.IdCriterioEvaluacion =
                                                    c.IdCriterioEvaluacion
                                                ORDER BY
                                                    i.Orden,
                                                    i.IdItemEvaluativo
                                                FOR JSON PATH
                                            )) AS items
                                        FROM dbo.DES_CriterioEvaluacion c
                                        WHERE c.IdModeloPuestoEscenario =
                                                mpe.IdModeloPuestoEscenario
                                          AND c.IdModeloDimension =
                                                d.IdModeloDimension
                                        ORDER BY
                                            c.Orden,
                                            c.IdCriterioEvaluacion
                                        FOR JSON PATH
                                    )) AS criterios
                                FROM dbo.DES_ModeloDimension d
                                WHERE d.IdModelo = m.IdModelo
                                  AND d.Activo = 1
                                ORDER BY d.Orden, d.IdModeloDimension
                                FOR JSON PATH
                            )) AS criteriosPorDimension
                        FROM dbo.DES_ModeloPuestoEscenario mpe
                        INNER JOIN dbo.DES_ModeloEscenario me
                            ON me.IdModeloEscenario = mpe.IdModeloEscenario
                        INNER JOIN dbo.DES_CatEscenario ce
                            ON ce.IdEscenario = me.IdEscenario
                        WHERE mpe.IdModeloPuesto = mp.IdModeloPuesto
                        ORDER BY mpe.Orden, mpe.IdModeloPuestoEscenario
                        FOR JSON PATH
                    )) AS escenarios
                FROM dbo.DES_ModeloPuesto mp
                INNER JOIN dbo.DES_Puesto p
                    ON p.IdPuesto = mp.IdPuesto
                WHERE mp.IdModelo = m.IdModelo
                ORDER BY mp.Orden, mp.IdModeloPuesto
                FOR JSON PATH
            )) AS puestos,
            JSON_QUERY((
                SELECT
                    e.IdEscala AS id,
                    e.Codigo AS codigo,
                    e.Nombre AS nombre,
                    e.ValorMinimo AS valorMinimo,
                    e.ValorMaximo AS valorMaximo,
                    JSON_QUERY((
                        SELECT
                            ev.IdEscalaValor AS id,
                            ev.Valor AS valor,
                            ev.Etiqueta AS etiqueta,
                            ev.Orden AS orden,
                            ev.Activo AS activo
                        FROM dbo.DES_EscalaValor ev
                        WHERE ev.IdEscala = e.IdEscala
                        ORDER BY ev.Orden, ev.IdEscalaValor
                        FOR JSON PATH
                    )) AS valores
                FROM dbo.DES_Escala e
                WHERE e.IdEscala IN (
                    SELECT m.IdEscalaPredeterminada
                    UNION
                    SELECT c.IdEscalaPredeterminada
                    FROM dbo.DES_CriterioEvaluacion c
                    INNER JOIN dbo.DES_ModeloPuestoEscenario mpe
                        ON mpe.IdModeloPuestoEscenario =
                            c.IdModeloPuestoEscenario
                    INNER JOIN dbo.DES_ModeloPuesto mp2
                        ON mp2.IdModeloPuesto = mpe.IdModeloPuesto
                    WHERE mp2.IdModelo = m.IdModelo
                      AND c.IdEscalaPredeterminada IS NOT NULL
                    UNION
                    SELECT i.IdEscala
                    FROM dbo.DES_ItemEvaluativo i
                    INNER JOIN dbo.DES_CriterioEvaluacion c
                        ON c.IdCriterioEvaluacion = i.IdCriterioEvaluacion
                    INNER JOIN dbo.DES_ModeloPuestoEscenario mpe
                        ON mpe.IdModeloPuestoEscenario =
                            c.IdModeloPuestoEscenario
                    INNER JOIN dbo.DES_ModeloPuesto mp2
                        ON mp2.IdModeloPuesto = mpe.IdModeloPuesto
                    WHERE mp2.IdModelo = m.IdModelo
                      AND i.IdEscala IS NOT NULL
                )
                ORDER BY e.Nombre, e.IdEscala
                FOR JSON PATH
            )) AS escalas
        FROM dbo.DES_Modelo m
        INNER JOIN dbo.DES_CatTipoModelo tm
            ON tm.IdTipoModelo = m.IdTipoModelo
        INNER JOIN dbo.DES_CatEstadoModelo em
            ON em.IdEstadoModelo = m.IdEstadoModelo
        WHERE m.IdModelo = @IdModelo
          AND m.IdOrganizacion = @IdOrganizacion
        FOR JSON PATH, WITHOUT_ARRAY_WRAPPER
    );

    SELECT @DataJson AS DataJson;
END
GO
