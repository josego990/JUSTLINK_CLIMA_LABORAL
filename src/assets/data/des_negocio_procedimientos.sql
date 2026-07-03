/*
    Procedimientos de negocio para evaluaciones de desempeno.

    Requisitos:
      1. des_modelo_evaluacion.sql
      2. des_catalogos_procedimientos.sql

    Los procedimientos de guardado reciben JSON para mantener una sola llamada
    por agregado y permitir que Node controle commit/rollback.
*/


--use JUSTLINK_DB 

SET NOCOUNT ON;
SET XACT_ABORT ON;
GO

CREATE OR ALTER PROCEDURE dbo.DES_sp_Modelos_Obtener_Legacy
    @IdModelo INT,
    @IdOrganizacion INT
AS
BEGIN
    SET NOCOUNT ON;
    IF NOT EXISTS (
        SELECT 1 FROM dbo.DES_Modelo
        WHERE IdModelo = @IdModelo AND IdOrganizacion = @IdOrganizacion
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
            JSON_QUERY((SELECT tm.IdTipoModelo AS id, tm.Codigo AS codigo, tm.Nombre AS nombre
                        FOR JSON PATH, WITHOUT_ARRAY_WRAPPER)) AS tipoModelo,
            JSON_QUERY((SELECT em.IdEstadoModelo AS id, em.Codigo AS codigo, em.Nombre AS nombre
                        FOR JSON PATH, WITHOUT_ARRAY_WRAPPER)) AS estado,
            m.IdEscalaPredeterminada AS escalaPredeterminadaId,
            m.IdMetodoCalculo AS metodoCalculoId,
            m.UsaPonderacion AS usaPonderacion,
            m.UsaAnonimato AS usaAnonimato,
            m.MinimoRespuestasAnonimas AS minimoRespuestasAnonimas,
            m.Activo AS activo,
            m.FechaPublicacion AS fechaPublicacion,
            JSON_QUERY((
                SELECT d.IdModeloDimension AS id, d.Codigo AS codigo, d.Nombre AS nombre,
                       d.Descripcion AS descripcion, d.Ponderacion AS ponderacion,
                       d.Orden AS orden, d.Activo AS activo
                FROM dbo.DES_ModeloDimension d
                WHERE d.IdModelo = m.IdModelo
                ORDER BY d.Orden, d.IdModeloDimension
                FOR JSON PATH
            )) AS dimensiones,
            JSON_QUERY((
                SELECT me.IdModeloEscenario AS id, me.IdEscenario AS escenarioId,
                       ce.Codigo AS codigo, ce.Nombre AS nombre,
                       me.Ponderacion AS ponderacion, me.EsAnonimo AS esAnonimo,
                       me.MinimoRespuestasAnonimas AS minimoRespuestasAnonimas,
                       me.Orden AS orden, me.Activo AS activo
                FROM dbo.DES_ModeloEscenario me
                INNER JOIN dbo.DES_CatEscenario ce ON ce.IdEscenario = me.IdEscenario
                WHERE me.IdModelo = m.IdModelo
                ORDER BY me.Orden, me.IdModeloEscenario
                FOR JSON PATH
            )) AS escenarios,
            JSON_QUERY((
                SELECT mp.IdModeloPuesto AS id, mp.IdPuesto AS puestoId,
                       p.Codigo AS codigo, p.Nombre AS nombre,
                       mp.SoloEvaluador AS soloEvaluador, mp.Orden AS orden,
                       mp.Activo AS activo,
                       JSON_QUERY((
                           SELECT mpe.IdModeloPuestoEscenario AS id,
                                  me.IdEscenario AS escenarioId,
                                  ce.Codigo AS codigo, ce.Nombre AS nombre,
                                  mpe.Ponderacion AS ponderacion, mpe.Orden AS orden,
                                  mpe.Activo AS activo,
                                  JSON_QUERY((
                                      SELECT d.IdModeloDimension AS dimensionId,
                                             d.Codigo AS dimensionCodigo,
                                             d.Nombre AS dimensionNombre,
                                             JSON_QUERY((
                                                 SELECT c.IdCriterioEvaluacion AS id,
                                                        c.IdCriterioOrigen AS criterioOrigenId,
                                                        c.Codigo AS codigo, c.Nombre AS nombre,
                                                        c.Descripcion AS descripcion,
                                                        c.Ponderacion AS ponderacion,
                                                        c.NivelExigencia AS nivelExigencia,
                                                        c.IdTipoItemPredeterminado AS tipoItemPredeterminadoId,
                                                        c.IdEscalaPredeterminada AS escalaPredeterminadaId,
                                                        c.Orden AS orden, c.Activo AS activo,
                                                        JSON_QUERY((
                                                            SELECT i.IdItemEvaluativo AS id,
                                                                   i.IdItemOrigen AS itemOrigenId,
                                                                   i.Codigo AS codigo, i.Texto AS texto,
                                                                   i.IdTipoItem AS tipoItemId,
                                                                   i.IdEscala AS escalaId,
                                                                   i.Requerido AS requerido,
                                                                   i.PermiteNoAplica AS permiteNoAplica,
                                                                   i.Orden AS orden, i.Activo AS activo
                                                            FROM dbo.DES_ItemEvaluativo i
                                                            WHERE i.IdCriterioEvaluacion = c.IdCriterioEvaluacion
                                                            ORDER BY i.Orden, i.IdItemEvaluativo
                                                            FOR JSON PATH
                                                        )) AS items
                                                 FROM dbo.DES_CriterioEvaluacion c
                                                 WHERE c.IdModeloPuestoEscenario = mpe.IdModeloPuestoEscenario
                                                   AND c.IdModeloDimension = d.IdModeloDimension
                                                 ORDER BY c.Orden, c.IdCriterioEvaluacion
                                                 FOR JSON PATH
                                             )) AS criterios
                                      FROM dbo.DES_ModeloDimension d
                                      WHERE d.IdModelo = m.IdModelo AND d.Activo = 1
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
                INNER JOIN dbo.DES_Puesto p ON p.IdPuesto = mp.IdPuesto
                WHERE mp.IdModelo = m.IdModelo
                ORDER BY mp.Orden, mp.IdModeloPuesto
                FOR JSON PATH
            )) AS puestos,
            JSON_QUERY((
                SELECT e.IdEscala AS id, e.Codigo AS codigo, e.Nombre AS nombre,
                       e.ValorMinimo AS valorMinimo, e.ValorMaximo AS valorMaximo,
                       JSON_QUERY((
                           SELECT ev.IdEscalaValor AS id, ev.Valor AS valor,
                                  ev.Etiqueta AS etiqueta, ev.Orden AS orden,
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
                       ON mpe.IdModeloPuestoEscenario = c.IdModeloPuestoEscenario
                    INNER JOIN dbo.DES_ModeloPuesto mp2 ON mp2.IdModeloPuesto = mpe.IdModeloPuesto
                    WHERE mp2.IdModelo = m.IdModelo AND c.IdEscalaPredeterminada IS NOT NULL
                    UNION
                    SELECT i.IdEscala
                    FROM dbo.DES_ItemEvaluativo i
                    INNER JOIN dbo.DES_CriterioEvaluacion c ON c.IdCriterioEvaluacion = i.IdCriterioEvaluacion
                    INNER JOIN dbo.DES_ModeloPuestoEscenario mpe
                       ON mpe.IdModeloPuestoEscenario = c.IdModeloPuestoEscenario
                    INNER JOIN dbo.DES_ModeloPuesto mp2 ON mp2.IdModeloPuesto = mpe.IdModeloPuesto
                    WHERE mp2.IdModelo = m.IdModelo AND i.IdEscala IS NOT NULL
                )
                ORDER BY e.Nombre, e.IdEscala
                FOR JSON PATH
            )) AS escalas
        FROM dbo.DES_Modelo m
        INNER JOIN dbo.DES_CatTipoModelo tm ON tm.IdTipoModelo = m.IdTipoModelo
        INNER JOIN dbo.DES_CatEstadoModelo em ON em.IdEstadoModelo = m.IdEstadoModelo
        WHERE m.IdModelo = @IdModelo AND m.IdOrganizacion = @IdOrganizacion
        FOR JSON PATH, WITHOUT_ARRAY_WRAPPER
    );
    SELECT @DataJson AS DataJson;
END
GO

CREATE OR ALTER PROCEDURE dbo.DES_sp_Modelos_Guardar_Legacy
    @IdModelo INT = NULL,
    @IdOrganizacion INT,
    @PayloadJson NVARCHAR(MAX),
    @Usuario NVARCHAR(100) = NULL
AS
BEGIN
    SET NOCOUNT ON;
    SET XACT_ABORT ON;
    IF ISJSON(@PayloadJson) <> 1 THROW 52104, 'El JSON del modelo es invalido.', 1;
    IF NOT EXISTS (SELECT 1 FROM dbo.Organizaciones WHERE Id = @IdOrganizacion)
        THROW 52001, 'No existe la organizacion indicada.', 1;

    IF @IdModelo IS NOT NULL
    BEGIN
        IF NOT EXISTS (
            SELECT 1 FROM dbo.DES_Modelo
            WHERE IdModelo = @IdModelo AND IdOrganizacion = @IdOrganizacion
        ) THROW 52101, 'No existe el modelo indicado.', 1;

        IF EXISTS (
            SELECT 1
            FROM dbo.DES_Evaluacion e
            WHERE e.IdModelo = @IdModelo
              AND (
                  EXISTS (SELECT 1 FROM dbo.DES_AsignacionEvaluacion a
                          WHERE a.IdEvaluacion = e.IdEvaluacion
                            AND a.FechaInicioRespuesta IS NOT NULL)
                  OR EXISTS (SELECT 1 FROM dbo.DES_RespuestaEvaluacion r
                             INNER JOIN dbo.DES_AsignacionEvaluacion a
                                ON a.IdAsignacion = r.IdAsignacion
                             WHERE a.IdEvaluacion = e.IdEvaluacion)
              )
        ) THROW 52102, 'La version ya tiene evaluaciones iniciadas; cree una nueva version.', 1;
    END

    DECLARE
        @Codigo NVARCHAR(50) = JSON_VALUE(@PayloadJson, '$.codigo'),
        @Version INT = TRY_CONVERT(INT, JSON_VALUE(@PayloadJson, '$.version')),
        @Nombre NVARCHAR(200) = JSON_VALUE(@PayloadJson, '$.nombre'),
        @Descripcion NVARCHAR(1000) = JSON_VALUE(@PayloadJson, '$.descripcion'),
        @IdTipoModelo SMALLINT = TRY_CONVERT(SMALLINT, JSON_VALUE(@PayloadJson, '$.tipoModeloId')),
        @IdEstadoModelo SMALLINT = TRY_CONVERT(SMALLINT, JSON_VALUE(@PayloadJson, '$.estadoModeloId')),
        @IdEscala INT = TRY_CONVERT(INT, JSON_VALUE(@PayloadJson, '$.escalaPredeterminadaId')),
        @IdMetodo SMALLINT = TRY_CONVERT(SMALLINT, JSON_VALUE(@PayloadJson, '$.metodoCalculoId')),
        @UsaPonderacion BIT = TRY_CONVERT(BIT, JSON_VALUE(@PayloadJson, '$.usaPonderacion')),
        @UsaAnonimato BIT = TRY_CONVERT(BIT, JSON_VALUE(@PayloadJson, '$.usaAnonimato')),
        @Minimo SMALLINT = TRY_CONVERT(SMALLINT, JSON_VALUE(@PayloadJson, '$.minimoRespuestasAnonimas')),
        @Activo BIT = TRY_CONVERT(BIT, JSON_VALUE(@PayloadJson, '$.activo'));

    IF EXISTS (
        SELECT 1 FROM dbo.DES_Modelo
        WHERE IdOrganizacion = @IdOrganizacion AND Codigo = @Codigo AND Version = @Version
          AND (@IdModelo IS NULL OR IdModelo <> @IdModelo)
    ) THROW 52103, 'Ya existe el codigo y version en la organizacion.', 1;

    IF NOT EXISTS (SELECT 1 FROM dbo.DES_CatTipoModelo WHERE IdTipoModelo = @IdTipoModelo AND Activo = 1)
       OR NOT EXISTS (SELECT 1 FROM dbo.DES_CatEstadoModelo WHERE IdEstadoModelo = @IdEstadoModelo AND Activo = 1)
       OR NOT EXISTS (SELECT 1 FROM dbo.DES_CatMetodoCalculo WHERE IdMetodoCalculo = @IdMetodo AND Activo = 1)
       OR NOT EXISTS (
           SELECT 1 FROM dbo.DES_Escala
           WHERE IdEscala = @IdEscala AND Activo = 1
             AND (IdOrganizacion IS NULL OR IdOrganizacion = @IdOrganizacion)
       )
        THROW 52104, 'Tipo, estado, escala o metodo de calculo invalidos.', 1;

    IF @IdModelo IS NULL
    BEGIN
        INSERT dbo.DES_Modelo (
            IdOrganizacion, Codigo, Version, Nombre, Descripcion, IdTipoModelo,
            IdEstadoModelo, IdEscalaPredeterminada, IdMetodoCalculo,
            UsaPonderacion, UsaAnonimato, MinimoRespuestasAnonimas,
            JsonFuente, Activo, UsuarioCreacion
        )
        VALUES (
            @IdOrganizacion, @Codigo, @Version, @Nombre, @Descripcion, @IdTipoModelo,
            @IdEstadoModelo, @IdEscala, @IdMetodo, @UsaPonderacion, @UsaAnonimato,
            @Minimo, @PayloadJson, ISNULL(@Activo, 1), @Usuario
        );
        SET @IdModelo = SCOPE_IDENTITY();
    END
    ELSE
    BEGIN
        UPDATE dbo.DES_Modelo
        SET Codigo = @Codigo, Version = @Version, Nombre = @Nombre,
            Descripcion = @Descripcion, IdTipoModelo = @IdTipoModelo,
            IdEstadoModelo = @IdEstadoModelo, IdEscalaPredeterminada = @IdEscala,
            IdMetodoCalculo = @IdMetodo, UsaPonderacion = @UsaPonderacion,
            UsaAnonimato = @UsaAnonimato, MinimoRespuestasAnonimas = @Minimo,
            JsonFuente = @PayloadJson, Activo = ISNULL(@Activo, Activo),
            FechaModificacion = SYSDATETIME(), UsuarioModificacion = @Usuario
        WHERE IdModelo = @IdModelo;
    END

    DECLARE @Dimensiones TABLE (
        Id INT NULL, Codigo NVARCHAR(50), Nombre NVARCHAR(150),
        Descripcion NVARCHAR(500), Ponderacion DECIMAL(5,2),
        Orden SMALLINT, Activo BIT
    );
    INSERT @Dimensiones
    SELECT id, codigo, nombre, descripcion, ponderacion, orden, activo
    FROM OPENJSON(@PayloadJson, '$.dimensiones') WITH (
        id INT '$.id', codigo NVARCHAR(50) '$.codigo', nombre NVARCHAR(150) '$.nombre',
        descripcion NVARCHAR(500) '$.descripcion', ponderacion DECIMAL(5,2) '$.ponderacion',
        orden SMALLINT '$.orden', activo BIT '$.activo'
    );

    MERGE dbo.DES_ModeloDimension AS T
    USING @Dimensiones AS S
       ON T.IdModelo = @IdModelo
      AND ((S.Id IS NOT NULL AND T.IdModeloDimension = S.Id)
           OR (S.Id IS NULL AND T.Codigo = S.Codigo))
    WHEN MATCHED THEN UPDATE SET Codigo=S.Codigo, Nombre=S.Nombre, Descripcion=S.Descripcion,
         Ponderacion=S.Ponderacion, Orden=S.Orden, Activo=ISNULL(S.Activo,1)
    WHEN NOT MATCHED THEN INSERT (IdModelo,Codigo,Nombre,Descripcion,Ponderacion,Orden,Activo)
         VALUES (@IdModelo,S.Codigo,S.Nombre,S.Descripcion,S.Ponderacion,S.Orden,ISNULL(S.Activo,1));
    UPDATE d SET Activo = 0
    FROM dbo.DES_ModeloDimension d
    WHERE d.IdModelo = @IdModelo
      AND NOT EXISTS (
          SELECT 1 FROM @Dimensiones s
          WHERE (s.Id IS NOT NULL AND s.Id = d.IdModeloDimension)
             OR (s.Id IS NULL AND s.Codigo = d.Codigo)
      );

    DECLARE @Escenarios TABLE (
        Id INT NULL, IdEscenario SMALLINT, Ponderacion DECIMAL(5,2),
        EsAnonimo BIT, Minimo SMALLINT NULL, Orden SMALLINT, Activo BIT
    );
    INSERT @Escenarios
    SELECT id, escenarioId, ponderacion, esAnonimo, minimo, orden, activo
    FROM OPENJSON(@PayloadJson, '$.escenarios') WITH (
        id INT '$.id', escenarioId SMALLINT '$.escenarioId',
        ponderacion DECIMAL(5,2) '$.ponderacion', esAnonimo BIT '$.esAnonimo',
        minimo SMALLINT '$.minimoRespuestasAnonimas', orden SMALLINT '$.orden',
        activo BIT '$.activo'
    );
    IF EXISTS (
        SELECT 1 FROM @Escenarios s
        LEFT JOIN dbo.DES_CatEscenario e ON e.IdEscenario=s.IdEscenario AND e.Activo=1
        WHERE e.IdEscenario IS NULL
    ) THROW 52104, 'Existe un escenario invalido.', 1;

    MERGE dbo.DES_ModeloEscenario AS T
    USING @Escenarios AS S
       ON T.IdModelo=@IdModelo AND T.IdEscenario=S.IdEscenario
    WHEN MATCHED THEN UPDATE SET Ponderacion=S.Ponderacion,EsAnonimo=S.EsAnonimo,
         MinimoRespuestasAnonimas=S.Minimo,Orden=S.Orden,Activo=ISNULL(S.Activo,1)
    WHEN NOT MATCHED THEN INSERT
         (IdModelo,IdEscenario,Ponderacion,EsAnonimo,MinimoRespuestasAnonimas,Orden,Activo)
         VALUES (@IdModelo,S.IdEscenario,S.Ponderacion,S.EsAnonimo,S.Minimo,S.Orden,ISNULL(S.Activo,1));
    UPDATE e SET Activo=0 FROM dbo.DES_ModeloEscenario e
    WHERE e.IdModelo=@IdModelo
      AND NOT EXISTS(SELECT 1 FROM @Escenarios s WHERE s.IdEscenario=e.IdEscenario);

    DECLARE @Puestos TABLE (
        Id INT NULL, IdPuesto INT, SoloEvaluador BIT, Orden SMALLINT,
        Activo BIT, EscenariosJson NVARCHAR(MAX)
    );
    INSERT @Puestos
    SELECT id, puestoId, soloEvaluador, orden, activo, escenarios
    FROM OPENJSON(@PayloadJson, '$.puestos') WITH (
        id INT '$.id', puestoId INT '$.puestoId', soloEvaluador BIT '$.soloEvaluador',
        orden SMALLINT '$.orden', activo BIT '$.activo',
        escenarios NVARCHAR(MAX) '$.escenarios' AS JSON
    );
    IF EXISTS (
        SELECT 1 FROM @Puestos s
        LEFT JOIN dbo.DES_Puesto p ON p.IdPuesto=s.IdPuesto
            AND p.IdOrganizacion=@IdOrganizacion AND p.Activo=1
        WHERE p.IdPuesto IS NULL
    ) THROW 52104, 'Existe un puesto invalido para la organizacion.', 1;

    MERGE dbo.DES_ModeloPuesto AS T
    USING @Puestos AS S ON T.IdModelo=@IdModelo AND T.IdPuesto=S.IdPuesto
    WHEN MATCHED THEN UPDATE SET SoloEvaluador=S.SoloEvaluador,Orden=S.Orden,Activo=ISNULL(S.Activo,1)
    WHEN NOT MATCHED THEN INSERT (IdModelo,IdPuesto,SoloEvaluador,Orden,Activo)
         VALUES(@IdModelo,S.IdPuesto,S.SoloEvaluador,S.Orden,ISNULL(S.Activo,1));
    UPDATE p SET Activo=0 FROM dbo.DES_ModeloPuesto p
    WHERE p.IdModelo=@IdModelo
      AND NOT EXISTS(SELECT 1 FROM @Puestos s WHERE s.IdPuesto=p.IdPuesto);

    DECLARE @PuestoEscenarios TABLE (
        Id INT NULL, IdPuesto INT, IdEscenario SMALLINT,
        Ponderacion DECIMAL(5,2), Orden SMALLINT, Activo BIT,
        CriteriosJson NVARCHAR(MAX)
    );
    INSERT @PuestoEscenarios (
        Id, IdPuesto, IdEscenario, Ponderacion, Orden, Activo, CriteriosJson
    )
    SELECT j.id, p.IdPuesto, j.escenarioId, j.ponderacion, j.orden, j.activo, j.criterios
    FROM @Puestos p
    CROSS APPLY OPENJSON(p.EscenariosJson) WITH (
        id INT '$.id', escenarioId SMALLINT '$.escenarioId',
        ponderacion DECIMAL(5,2) '$.ponderacion', orden SMALLINT '$.orden',
        activo BIT '$.activo',
        criterios NVARCHAR(MAX) '$.criteriosPorDimension' AS JSON
    ) j;

    MERGE dbo.DES_ModeloPuestoEscenario AS T
    USING (
        SELECT pe.*, mp.IdModeloPuesto, me.IdModeloEscenario
        FROM @PuestoEscenarios pe
        INNER JOIN dbo.DES_ModeloPuesto mp
          ON mp.IdModelo=@IdModelo AND mp.IdPuesto=pe.IdPuesto
        INNER JOIN dbo.DES_ModeloEscenario me
          ON me.IdModelo=@IdModelo AND me.IdEscenario=pe.IdEscenario
    ) AS S
      ON T.IdModeloPuesto=S.IdModeloPuesto AND T.IdModeloEscenario=S.IdModeloEscenario
    WHEN MATCHED THEN UPDATE SET Ponderacion=S.Ponderacion,Orden=S.Orden,Activo=ISNULL(S.Activo,1)
    WHEN NOT MATCHED THEN INSERT(IdModeloPuesto,IdModeloEscenario,Ponderacion,Orden,Activo)
         VALUES(S.IdModeloPuesto,S.IdModeloEscenario,S.Ponderacion,S.Orden,ISNULL(S.Activo,1));
    UPDATE mpe SET Activo=0
    FROM dbo.DES_ModeloPuestoEscenario mpe
    INNER JOIN dbo.DES_ModeloPuesto mp ON mp.IdModeloPuesto=mpe.IdModeloPuesto
    INNER JOIN dbo.DES_ModeloEscenario me ON me.IdModeloEscenario=mpe.IdModeloEscenario
    WHERE mp.IdModelo=@IdModelo
      AND NOT EXISTS (
          SELECT 1 FROM @PuestoEscenarios s
          WHERE s.IdPuesto=mp.IdPuesto AND s.IdEscenario=me.IdEscenario
      );

    DECLARE @Criterios TABLE (
        Id INT NULL, IdPuesto INT, IdEscenario SMALLINT,
        DimensionId INT NULL, DimensionCodigo NVARCHAR(50),
        Codigo NVARCHAR(50), Nombre NVARCHAR(180), Descripcion NVARCHAR(700),
        Ponderacion DECIMAL(5,2), Nivel DECIMAL(9,4), TipoItem SMALLINT,
        Escala INT NULL, Orden SMALLINT, Activo BIT, ItemsJson NVARCHAR(MAX)
    );
    INSERT @Criterios (
        Id, IdPuesto, IdEscenario, DimensionId, DimensionCodigo,
        Codigo, Nombre, Descripcion, Ponderacion, Nivel, TipoItem,
        Escala, Orden, Activo, ItemsJson
    )
    SELECT c.id, pe.IdPuesto, pe.IdEscenario, d.dimensionId, d.dimensionCodigo,
           c.codigo,c.nombre,c.descripcion,c.ponderacion,c.nivel,c.tipoItem,
           c.escala,c.orden,c.activo,c.items
    FROM @PuestoEscenarios pe
    CROSS APPLY OPENJSON(pe.CriteriosJson) WITH (
        dimensionId INT '$.dimensionId', dimensionCodigo NVARCHAR(50) '$.dimensionCodigo',
        criterios NVARCHAR(MAX) '$.criterios' AS JSON
    ) d
    CROSS APPLY OPENJSON(d.criterios) WITH (
        id INT '$.id', codigo NVARCHAR(50) '$.codigo', nombre NVARCHAR(180) '$.nombre',
        descripcion NVARCHAR(700) '$.descripcion', ponderacion DECIMAL(5,2) '$.ponderacion',
        nivel DECIMAL(9,4) '$.nivelExigencia',
        tipoItem SMALLINT '$.tipoItemPredeterminadoId',
        escala INT '$.escalaPredeterminadaId', orden SMALLINT '$.orden',
        activo BIT '$.activo', items NVARCHAR(MAX) '$.items' AS JSON
    ) c;
    IF EXISTS (
      SELECT 1
      FROM @Criterios c
      LEFT JOIN dbo.DES_CatTipoItem ti
        ON ti.IdTipoItem=c.TipoItem AND ti.Activo=1
      LEFT JOIN dbo.DES_Escala e
        ON e.IdEscala=c.Escala AND e.Activo=1
       AND (e.IdOrganizacion IS NULL OR e.IdOrganizacion=@IdOrganizacion)
      WHERE ti.IdTipoItem IS NULL
         OR (c.Escala IS NOT NULL AND e.IdEscala IS NULL)
    ) THROW 52104,'Existe un tipo de item o escala invalido en los criterios.',1;

    MERGE dbo.DES_CriterioEvaluacion AS T
    USING (
        SELECT c.*, mpe.IdModeloPuestoEscenario, d.IdModeloDimension
        FROM @Criterios c
        INNER JOIN dbo.DES_ModeloPuesto mp
          ON mp.IdModelo=@IdModelo AND mp.IdPuesto=c.IdPuesto
        INNER JOIN dbo.DES_ModeloEscenario me
          ON me.IdModelo=@IdModelo AND me.IdEscenario=c.IdEscenario
        INNER JOIN dbo.DES_ModeloPuestoEscenario mpe
          ON mpe.IdModeloPuesto=mp.IdModeloPuesto
         AND mpe.IdModeloEscenario=me.IdModeloEscenario
        INNER JOIN dbo.DES_ModeloDimension d
          ON d.IdModelo=@IdModelo
         AND ((c.DimensionId IS NOT NULL AND d.IdModeloDimension=c.DimensionId)
              OR (c.DimensionId IS NULL AND d.Codigo=c.DimensionCodigo))
    ) S
      ON T.IdModeloPuestoEscenario=S.IdModeloPuestoEscenario
     AND T.IdModeloDimension=S.IdModeloDimension
     AND ((S.Id IS NOT NULL AND T.IdCriterioEvaluacion=S.Id)
          OR (S.Id IS NULL AND ISNULL(T.Codigo,T.Nombre)=ISNULL(S.Codigo,S.Nombre)))
    WHEN MATCHED THEN UPDATE SET Codigo=S.Codigo,Nombre=S.Nombre,Descripcion=S.Descripcion,
         Ponderacion=S.Ponderacion,NivelExigencia=S.Nivel,
         IdTipoItemPredeterminado=S.TipoItem,IdEscalaPredeterminada=S.Escala,
         Orden=S.Orden,Activo=ISNULL(S.Activo,1)
    WHEN NOT MATCHED THEN INSERT (
         IdModeloPuestoEscenario,IdModeloDimension,Codigo,Nombre,Descripcion,Ponderacion,
         NivelExigencia,IdTipoItemPredeterminado,IdEscalaPredeterminada,Orden,Activo
    ) VALUES (
         S.IdModeloPuestoEscenario,S.IdModeloDimension,S.Codigo,S.Nombre,S.Descripcion,
         S.Ponderacion,S.Nivel,S.TipoItem,S.Escala,S.Orden,ISNULL(S.Activo,1)
    );

    UPDATE c SET Activo=0
    FROM dbo.DES_CriterioEvaluacion c
    INNER JOIN dbo.DES_ModeloPuestoEscenario mpe
      ON mpe.IdModeloPuestoEscenario=c.IdModeloPuestoEscenario
    INNER JOIN dbo.DES_ModeloPuesto mp ON mp.IdModeloPuesto=mpe.IdModeloPuesto
    INNER JOIN dbo.DES_ModeloEscenario me ON me.IdModeloEscenario=mpe.IdModeloEscenario
    WHERE mp.IdModelo=@IdModelo
      AND NOT EXISTS (
          SELECT 1 FROM @Criterios s
          INNER JOIN dbo.DES_ModeloDimension d ON d.IdModelo=@IdModelo
            AND ((s.DimensionId IS NOT NULL AND d.IdModeloDimension=s.DimensionId)
                 OR (s.DimensionId IS NULL AND d.Codigo=s.DimensionCodigo))
          WHERE s.IdPuesto=mp.IdPuesto AND s.IdEscenario=me.IdEscenario
            AND d.IdModeloDimension=c.IdModeloDimension
            AND ((s.Id IS NOT NULL AND s.Id=c.IdCriterioEvaluacion)
                 OR (s.Id IS NULL AND ISNULL(s.Codigo,s.Nombre)=ISNULL(c.Codigo,c.Nombre)))
      );

    DECLARE @Items TABLE (
        Id INT NULL, CriterioId INT NULL, CriterioCodigo NVARCHAR(180),
        IdPuesto INT, IdEscenario SMALLINT, DimensionId INT NULL,
        DimensionCodigo NVARCHAR(50), Codigo NVARCHAR(50), Texto NVARCHAR(1500),
        TipoItem SMALLINT, Escala INT NULL, Requerido BIT,
        PermiteNoAplica BIT, Orden SMALLINT, Activo BIT
    );
    INSERT @Items (
        Id, CriterioId, CriterioCodigo, IdPuesto, IdEscenario,
        DimensionId, DimensionCodigo, Codigo, Texto, TipoItem, Escala,
        Requerido, PermiteNoAplica, Orden, Activo
    )
    SELECT i.id,c.Id,ISNULL(c.Codigo,c.Nombre),c.IdPuesto,c.IdEscenario,c.DimensionId,c.DimensionCodigo,
           i.codigo,i.texto,i.tipoItem,i.escala,i.requerido,
           i.permiteNoAplica,i.orden,i.activo
    FROM @Criterios c
    CROSS APPLY OPENJSON(c.ItemsJson) WITH (
        id INT '$.id', codigo NVARCHAR(50) '$.codigo', texto NVARCHAR(1500) '$.texto',
        tipoItem SMALLINT '$.tipoItemId', escala INT '$.escalaId',
        requerido BIT '$.requerido', permiteNoAplica BIT '$.permiteNoAplica',
        orden SMALLINT '$.orden', activo BIT '$.activo'
    ) i;
    IF EXISTS (
      SELECT 1
      FROM @Items i
      LEFT JOIN dbo.DES_CatTipoItem ti
        ON ti.IdTipoItem=i.TipoItem AND ti.Activo=1
      LEFT JOIN dbo.DES_Escala e
        ON e.IdEscala=i.Escala AND e.Activo=1
       AND (e.IdOrganizacion IS NULL OR e.IdOrganizacion=@IdOrganizacion)
      WHERE ti.IdTipoItem IS NULL
         OR (i.Escala IS NOT NULL AND e.IdEscala IS NULL)
    ) THROW 52104,'Existe un tipo de item o escala invalido en los items.',1;

    MERGE dbo.DES_ItemEvaluativo AS T
    USING (
        SELECT i.*, c.IdCriterioEvaluacion
        FROM @Items i
        INNER JOIN dbo.DES_ModeloPuesto mp ON mp.IdModelo=@IdModelo AND mp.IdPuesto=i.IdPuesto
        INNER JOIN dbo.DES_ModeloEscenario me ON me.IdModelo=@IdModelo AND me.IdEscenario=i.IdEscenario
        INNER JOIN dbo.DES_ModeloPuestoEscenario mpe
          ON mpe.IdModeloPuesto=mp.IdModeloPuesto AND mpe.IdModeloEscenario=me.IdModeloEscenario
        INNER JOIN dbo.DES_ModeloDimension d ON d.IdModelo=@IdModelo
          AND ((i.DimensionId IS NOT NULL AND d.IdModeloDimension=i.DimensionId)
               OR (i.DimensionId IS NULL AND d.Codigo=i.DimensionCodigo))
        INNER JOIN dbo.DES_CriterioEvaluacion c
          ON c.IdModeloPuestoEscenario=mpe.IdModeloPuestoEscenario
         AND c.IdModeloDimension=d.IdModeloDimension
         AND ((i.CriterioId IS NOT NULL AND c.IdCriterioEvaluacion=i.CriterioId)
              OR (i.CriterioId IS NULL AND ISNULL(c.Codigo,c.Nombre)=i.CriterioCodigo))
    ) S
      ON T.IdCriterioEvaluacion=S.IdCriterioEvaluacion
     AND ((S.Id IS NOT NULL AND T.IdItemEvaluativo=S.Id)
          OR (S.Id IS NULL AND ISNULL(T.Codigo,CONVERT(NVARCHAR(20),T.Orden))
              =ISNULL(S.Codigo,CONVERT(NVARCHAR(20),S.Orden))))
    WHEN MATCHED THEN UPDATE SET Codigo=S.Codigo,Texto=S.Texto,IdTipoItem=S.TipoItem,
         IdEscala=S.Escala,Requerido=S.Requerido,PermiteNoAplica=S.PermiteNoAplica,
         Orden=S.Orden,Activo=ISNULL(S.Activo,1)
    WHEN NOT MATCHED THEN INSERT (
         IdCriterioEvaluacion,Codigo,Texto,IdTipoItem,IdEscala,
         Requerido,PermiteNoAplica,Orden,Activo
    ) VALUES (
         S.IdCriterioEvaluacion,S.Codigo,S.Texto,S.TipoItem,S.Escala,
         S.Requerido,S.PermiteNoAplica,S.Orden,ISNULL(S.Activo,1)
    );

    UPDATE i SET Activo=0
    FROM dbo.DES_ItemEvaluativo i
    INNER JOIN dbo.DES_CriterioEvaluacion c ON c.IdCriterioEvaluacion=i.IdCriterioEvaluacion
    INNER JOIN dbo.DES_ModeloPuestoEscenario mpe
      ON mpe.IdModeloPuestoEscenario=c.IdModeloPuestoEscenario
    INNER JOIN dbo.DES_ModeloPuesto mp ON mp.IdModeloPuesto=mpe.IdModeloPuesto
    INNER JOIN dbo.DES_ModeloEscenario me
      ON me.IdModeloEscenario=mpe.IdModeloEscenario
    INNER JOIN dbo.DES_ModeloDimension d
      ON d.IdModeloDimension=c.IdModeloDimension
    WHERE mp.IdModelo=@IdModelo
      AND NOT EXISTS (
          SELECT 1 FROM @Items s
          WHERE (s.Id IS NOT NULL AND s.Id=i.IdItemEvaluativo)
             OR (s.Id IS NULL
                 AND s.IdPuesto=mp.IdPuesto
                 AND s.IdEscenario=me.IdEscenario
                 AND ((s.DimensionId IS NOT NULL AND s.DimensionId=d.IdModeloDimension)
                      OR (s.DimensionId IS NULL AND s.DimensionCodigo=d.Codigo))
                 AND ((s.CriterioId IS NOT NULL AND s.CriterioId=c.IdCriterioEvaluacion)
                      OR (s.CriterioId IS NULL
                          AND s.CriterioCodigo=ISNULL(c.Codigo,c.Nombre)))
                 AND ISNULL(s.Codigo,CONVERT(NVARCHAR(20),s.Orden))
                    =ISNULL(i.Codigo,CONVERT(NVARCHAR(20),i.Orden)))
      );

    SELECT @IdModelo AS IdModelo;
END
GO

CREATE OR ALTER PROCEDURE dbo.DES_sp_Modelos_Duplicar
    @IdModelo INT,
    @IdOrganizacion INT,
    @Codigo NVARCHAR(50) = NULL,
    @Nombre NVARCHAR(200) = NULL,
    @Version INT = NULL,
    @EsNuevaVersion BIT = 0,
    @Usuario NVARCHAR(100) = NULL
AS
BEGIN
    SET NOCOUNT ON;
    SET XACT_ABORT ON;
    IF NOT EXISTS (SELECT 1 FROM dbo.DES_Modelo WHERE IdModelo=@IdModelo AND IdOrganizacion=@IdOrganizacion)
        THROW 52101, 'No existe el modelo indicado.', 1;

    BEGIN TRAN;
    BEGIN TRY
        DECLARE @Nuevo INT, @EstadoBorrador SMALLINT =
            (SELECT IdEstadoModelo FROM dbo.DES_CatEstadoModelo WHERE Codigo=N'BORRADOR');
        IF @EsNuevaVersion=1
        BEGIN
            SELECT @Codigo=Codigo,@Nombre=Nombre,
                   @Version=ISNULL((SELECT MAX(m2.Version) FROM dbo.DES_Modelo m2
                                   WHERE m2.IdOrganizacion=@IdOrganizacion
                                     AND m2.Codigo=m.Codigo),0)+1
            FROM dbo.DES_Modelo m WHERE m.IdModelo=@IdModelo;
        END
        IF EXISTS (SELECT 1 FROM dbo.DES_Modelo
                   WHERE IdOrganizacion=@IdOrganizacion AND Codigo=@Codigo AND Version=@Version)
            THROW 52103, 'Ya existe el codigo y version solicitados.', 1;

        INSERT dbo.DES_Modelo (
            IdOrganizacion,Codigo,Version,Nombre,Descripcion,IdTipoModelo,IdEstadoModelo,
            IdEscalaPredeterminada,IdMetodoCalculo,UsaPonderacion,UsaAnonimato,
            MinimoRespuestasAnonimas,FechaInicio,FechaCierre,JsonFuente,Activo,
            UsuarioCreacion
        )
        SELECT IdOrganizacion,@Codigo,@Version,@Nombre,Descripcion,IdTipoModelo,@EstadoBorrador,
               IdEscalaPredeterminada,IdMetodoCalculo,UsaPonderacion,UsaAnonimato,
               MinimoRespuestasAnonimas,FechaInicio,FechaCierre,JsonFuente,1,@Usuario
        FROM dbo.DES_Modelo WHERE IdModelo=@IdModelo;
        SET @Nuevo=SCOPE_IDENTITY();

        INSERT dbo.DES_ModeloEmpleadoEspecifico (
            IdModelo,IdEmpleado,Activo,UsuarioCreacion
        )
        SELECT @Nuevo,IdEmpleado,1,@Usuario
        FROM dbo.DES_ModeloEmpleadoEspecifico
        WHERE IdModelo=@IdModelo AND Activo=1;

        DECLARE @DimMap TABLE(OldId INT,NewId INT);
        MERGE dbo.DES_ModeloDimension T
        USING (SELECT * FROM dbo.DES_ModeloDimension WHERE IdModelo=@IdModelo) S ON 1=0
        WHEN NOT MATCHED THEN INSERT(IdModelo,Codigo,Nombre,Descripcion,Ponderacion,Orden,Activo)
          VALUES(@Nuevo,S.Codigo,S.Nombre,S.Descripcion,S.Ponderacion,S.Orden,S.Activo)
        OUTPUT S.IdModeloDimension,inserted.IdModeloDimension INTO @DimMap;

        DECLARE @EscMap TABLE(OldId INT,NewId INT);
        MERGE dbo.DES_ModeloEscenario T
        USING (SELECT * FROM dbo.DES_ModeloEscenario WHERE IdModelo=@IdModelo) S ON 1=0
        WHEN NOT MATCHED THEN INSERT(IdModelo,IdEscenario,Ponderacion,EsAnonimo,MinimoRespuestasAnonimas,Orden,Activo)
          VALUES(@Nuevo,S.IdEscenario,S.Ponderacion,S.EsAnonimo,S.MinimoRespuestasAnonimas,S.Orden,S.Activo)
        OUTPUT S.IdModeloEscenario,inserted.IdModeloEscenario INTO @EscMap;

        DECLARE @PuestoMap TABLE(OldId INT,NewId INT);
        MERGE dbo.DES_ModeloPuesto T
        USING (SELECT * FROM dbo.DES_ModeloPuesto WHERE IdModelo=@IdModelo) S ON 1=0
        WHEN NOT MATCHED THEN INSERT(IdModelo,IdPuesto,SoloEvaluador,Orden,Activo)
          VALUES(@Nuevo,S.IdPuesto,S.SoloEvaluador,S.Orden,S.Activo)
        OUTPUT S.IdModeloPuesto,inserted.IdModeloPuesto INTO @PuestoMap;

        DECLARE @PEMap TABLE(OldId INT,NewId INT);
        MERGE dbo.DES_ModeloPuestoEscenario T
        USING (
            SELECT pe.*,pm.NewId AS NewPuesto,em.NewId AS NewEscenario
            FROM dbo.DES_ModeloPuestoEscenario pe
            INNER JOIN @PuestoMap pm ON pm.OldId=pe.IdModeloPuesto
            INNER JOIN @EscMap em ON em.OldId=pe.IdModeloEscenario
        ) S ON 1=0
        WHEN NOT MATCHED THEN INSERT(IdModeloPuesto,IdModeloEscenario,Ponderacion,Orden,Activo)
          VALUES(S.NewPuesto,S.NewEscenario,S.Ponderacion,S.Orden,S.Activo)
        OUTPUT S.IdModeloPuestoEscenario,inserted.IdModeloPuestoEscenario INTO @PEMap;

        DECLARE @CriterioMap TABLE(OldId INT,NewId INT);
        MERGE dbo.DES_CriterioEvaluacion T
        USING (
            SELECT c.*,pem.NewId AS NewPE,dm.NewId AS NewDimension
            FROM dbo.DES_CriterioEvaluacion c
            INNER JOIN @PEMap pem ON pem.OldId=c.IdModeloPuestoEscenario
            INNER JOIN @DimMap dm ON dm.OldId=c.IdModeloDimension
        ) S ON 1=0
        WHEN NOT MATCHED THEN INSERT(
          IdCriterioOrigen,IdModeloPuestoEscenario,IdModeloDimension,Codigo,Nombre,
          Descripcion,Ponderacion,NivelExigencia,IdTipoItemPredeterminado,
          IdEscalaPredeterminada,Orden,Activo
        ) VALUES(
          S.IdCriterioEvaluacion,S.NewPE,S.NewDimension,S.Codigo,S.Nombre,S.Descripcion,
          S.Ponderacion,S.NivelExigencia,S.IdTipoItemPredeterminado,
          S.IdEscalaPredeterminada,S.Orden,S.Activo
        )
        OUTPUT S.IdCriterioEvaluacion,inserted.IdCriterioEvaluacion INTO @CriterioMap;

        INSERT dbo.DES_ItemEvaluativo(
          IdItemOrigen,IdCriterioEvaluacion,Codigo,Texto,IdTipoItem,IdEscala,
          Requerido,PermiteNoAplica,Orden,Activo
        )
        SELECT i.IdItemEvaluativo,cm.NewId,i.Codigo,i.Texto,i.IdTipoItem,i.IdEscala,
               i.Requerido,i.PermiteNoAplica,i.Orden,i.Activo
        FROM dbo.DES_ItemEvaluativo i
        INNER JOIN @CriterioMap cm ON cm.OldId=i.IdCriterioEvaluacion;

        COMMIT;
        SELECT @Nuevo AS IdModelo;
    END TRY
    BEGIN CATCH
        IF XACT_STATE()<>0 ROLLBACK;
        THROW;
    END CATCH
END
GO

CREATE OR ALTER PROCEDURE dbo.DES_sp_Modelos_CambiarEstado
    @IdModelo INT, @IdOrganizacion INT, @EstadoCodigo NVARCHAR(30),
    @Usuario NVARCHAR(100)=NULL
AS
BEGIN
    SET NOCOUNT ON;
    DECLARE @Estado SMALLINT=(SELECT IdEstadoModelo FROM dbo.DES_CatEstadoModelo
                              WHERE Codigo=UPPER(@EstadoCodigo) AND Activo=1);
    IF @Estado IS NULL THROW 52104, 'El estado solicitado no existe.', 1;
    UPDATE dbo.DES_Modelo
    SET IdEstadoModelo=@Estado,
        FechaPublicacion=CASE WHEN UPPER(@EstadoCodigo)=N'ACTIVO'
                              THEN ISNULL(FechaPublicacion,SYSDATETIME())
                              ELSE FechaPublicacion END,
        FechaModificacion=SYSDATETIME(),UsuarioModificacion=@Usuario,
        Activo=CASE WHEN UPPER(@EstadoCodigo) IN (N'INACTIVO',N'ARCHIVADO') THEN 0 ELSE 1 END
    WHERE IdModelo=@IdModelo AND IdOrganizacion=@IdOrganizacion;
    IF @@ROWCOUNT=0 THROW 52101, 'No existe el modelo indicado.', 1;
    SELECT @IdModelo AS id,@EstadoCodigo AS estadoCodigo;
END
GO

CREATE OR ALTER PROCEDURE dbo.DES_sp_Criterios_Duplicar
    @IdModelo INT,@IdCriterio INT,@IdOrganizacion INT,
    @DestinosJson NVARCHAR(MAX),@Usuario NVARCHAR(100)=NULL
AS
BEGIN
    SET NOCOUNT ON;
    IF ISJSON(@DestinosJson)<>1 THROW 52104,'Destinos invalidos.',1;
    IF NOT EXISTS (
      SELECT 1 FROM dbo.DES_CriterioEvaluacion c
      INNER JOIN dbo.DES_ModeloPuestoEscenario pe ON pe.IdModeloPuestoEscenario=c.IdModeloPuestoEscenario
      INNER JOIN dbo.DES_ModeloPuesto mp ON mp.IdModeloPuesto=pe.IdModeloPuesto
      INNER JOIN dbo.DES_Modelo m ON m.IdModelo=mp.IdModelo
      WHERE c.IdCriterioEvaluacion=@IdCriterio AND m.IdModelo=@IdModelo AND m.IdOrganizacion=@IdOrganizacion
    ) THROW 52101,'No existe el criterio indicado.',1;

    DECLARE @Creados TABLE(id INT,puestoId INT,escenarioId INT,dimensionId INT);
    DECLARE @Omitidos TABLE(puestoId INT,escenarioId INT,dimensionId INT,motivo NVARCHAR(200));
    DECLARE @Destinos TABLE(puestoId INT,escenarioId SMALLINT,dimensionId INT);
    INSERT @Destinos SELECT puestoId,escenarioId,dimensionId
    FROM OPENJSON(@DestinosJson) WITH(puestoId INT,escenarioId SMALLINT,dimensionId INT);
    INSERT @Omitidos
    SELECT d.puestoId,d.escenarioId,d.dimensionId,N'El destino no pertenece al modelo.'
    FROM @Destinos d
    WHERE NOT EXISTS (
      SELECT 1
      FROM dbo.DES_ModeloPuesto mp
      INNER JOIN dbo.DES_ModeloEscenario me
        ON me.IdModelo=@IdModelo AND me.IdEscenario=d.escenarioId
      INNER JOIN dbo.DES_ModeloPuestoEscenario mpe
        ON mpe.IdModeloPuesto=mp.IdModeloPuesto
       AND mpe.IdModeloEscenario=me.IdModeloEscenario
      INNER JOIN dbo.DES_ModeloDimension md
        ON md.IdModelo=@IdModelo AND md.IdModeloDimension=d.dimensionId
      WHERE mp.IdModelo=@IdModelo AND mp.IdPuesto=d.puestoId
    );

    DECLARE c CURSOR LOCAL FAST_FORWARD FOR
      SELECT d.puestoId,d.escenarioId,d.dimensionId,mpe.IdModeloPuestoEscenario
      FROM @Destinos d
      INNER JOIN dbo.DES_ModeloPuesto mp ON mp.IdModelo=@IdModelo AND mp.IdPuesto=d.puestoId
      INNER JOIN dbo.DES_ModeloEscenario me ON me.IdModelo=@IdModelo AND me.IdEscenario=d.escenarioId
      INNER JOIN dbo.DES_ModeloPuestoEscenario mpe
        ON mpe.IdModeloPuesto=mp.IdModeloPuesto AND mpe.IdModeloEscenario=me.IdModeloEscenario
      INNER JOIN dbo.DES_ModeloDimension md
        ON md.IdModelo=@IdModelo AND md.IdModeloDimension=d.dimensionId;
    DECLARE @P INT,@E SMALLINT,@D INT,@PE INT,@Nuevo INT;
    OPEN c; FETCH NEXT FROM c INTO @P,@E,@D,@PE;
    WHILE @@FETCH_STATUS=0
    BEGIN
      IF EXISTS(SELECT 1 FROM dbo.DES_CriterioEvaluacion x
                INNER JOIN dbo.DES_CriterioEvaluacion src ON src.IdCriterioEvaluacion=@IdCriterio
                WHERE x.IdModeloPuestoEscenario=@PE AND x.IdModeloDimension=@D
                  AND ISNULL(x.Codigo,x.Nombre)=ISNULL(src.Codigo,src.Nombre))
        INSERT @Omitidos VALUES(@P,@E,@D,N'Ya existe un criterio con el mismo codigo.');
      ELSE
      BEGIN
        INSERT dbo.DES_CriterioEvaluacion(
          IdCriterioOrigen,IdModeloPuestoEscenario,IdModeloDimension,Codigo,Nombre,
          Descripcion,Ponderacion,NivelExigencia,IdTipoItemPredeterminado,
          IdEscalaPredeterminada,Orden,Activo
        )
        SELECT IdCriterioEvaluacion,@PE,@D,Codigo,Nombre,Descripcion,Ponderacion,
               NivelExigencia,IdTipoItemPredeterminado,IdEscalaPredeterminada,
               ISNULL((SELECT MAX(Orden)+1 FROM dbo.DES_CriterioEvaluacion
                       WHERE IdModeloPuestoEscenario=@PE AND IdModeloDimension=@D),1),1
        FROM dbo.DES_CriterioEvaluacion WHERE IdCriterioEvaluacion=@IdCriterio;
        SET @Nuevo=SCOPE_IDENTITY();
        INSERT dbo.DES_ItemEvaluativo(
          IdItemOrigen,IdCriterioEvaluacion,Codigo,Texto,IdTipoItem,IdEscala,
          Requerido,PermiteNoAplica,Orden,Activo
        )
        SELECT IdItemEvaluativo,@Nuevo,Codigo,Texto,IdTipoItem,IdEscala,
               Requerido,PermiteNoAplica,Orden,Activo
        FROM dbo.DES_ItemEvaluativo WHERE IdCriterioEvaluacion=@IdCriterio;
        INSERT @Creados VALUES(@Nuevo,@P,@E,@D);
      END
      FETCH NEXT FROM c INTO @P,@E,@D,@PE;
    END
    CLOSE c; DEALLOCATE c;
    SELECT * FROM @Creados ORDER BY puestoId,escenarioId,dimensionId;
    SELECT * FROM @Omitidos ORDER BY puestoId,escenarioId,dimensionId;
END
GO

CREATE OR ALTER PROCEDURE dbo.DES_sp_Items_Duplicar
    @IdModelo INT,@IdItem INT,@IdOrganizacion INT,@DestinosJson NVARCHAR(MAX),
    @CrearCriterioSiNoExiste BIT=0,@Usuario NVARCHAR(100)=NULL
AS
BEGIN
    SET NOCOUNT ON;
    IF ISJSON(@DestinosJson)<>1 THROW 52104,'Destinos invalidos.',1;
    DECLARE @OrigenCriterio INT;
    SELECT @OrigenCriterio=i.IdCriterioEvaluacion
    FROM dbo.DES_ItemEvaluativo i
    INNER JOIN dbo.DES_CriterioEvaluacion c
      ON c.IdCriterioEvaluacion=i.IdCriterioEvaluacion
    INNER JOIN dbo.DES_ModeloPuestoEscenario mpe
      ON mpe.IdModeloPuestoEscenario=c.IdModeloPuestoEscenario
    INNER JOIN dbo.DES_ModeloPuesto mp
      ON mp.IdModeloPuesto=mpe.IdModeloPuesto
    INNER JOIN dbo.DES_Modelo m
      ON m.IdModelo=mp.IdModelo
    WHERE i.IdItemEvaluativo=@IdItem
      AND m.IdModelo=@IdModelo
      AND m.IdOrganizacion=@IdOrganizacion;
    IF @OrigenCriterio IS NULL THROW 52101,'No existe el item indicado.',1;
    DECLARE @Destinos TABLE(puestoId INT,escenarioId SMALLINT,dimensionId INT);
    INSERT @Destinos SELECT puestoId,escenarioId,dimensionId
    FROM OPENJSON(@DestinosJson) WITH(puestoId INT,escenarioId SMALLINT,dimensionId INT);
    DECLARE @Creados TABLE(id INT,puestoId INT,escenarioId INT,dimensionId INT);
    DECLARE @Omitidos TABLE(puestoId INT,escenarioId INT,dimensionId INT,motivo NVARCHAR(200));

    DECLARE c CURSOR LOCAL FAST_FORWARD FOR SELECT puestoId,escenarioId,dimensionId FROM @Destinos;
    DECLARE @P INT,@E SMALLINT,@D INT,@PE INT,@Criterio INT,@Nuevo INT;
    OPEN c; FETCH NEXT FROM c INTO @P,@E,@D;
    WHILE @@FETCH_STATUS=0
    BEGIN
      SELECT @PE=mpe.IdModeloPuestoEscenario
      FROM dbo.DES_ModeloPuesto mp
      INNER JOIN dbo.DES_ModeloEscenario me ON me.IdModelo=@IdModelo AND me.IdEscenario=@E
      INNER JOIN dbo.DES_ModeloPuestoEscenario mpe
        ON mpe.IdModeloPuesto=mp.IdModeloPuesto AND mpe.IdModeloEscenario=me.IdModeloEscenario
      INNER JOIN dbo.DES_ModeloDimension md
        ON md.IdModelo=@IdModelo AND md.IdModeloDimension=@D
      WHERE mp.IdModelo=@IdModelo AND mp.IdPuesto=@P;
      IF @PE IS NULL
        INSERT @Omitidos VALUES(@P,@E,@D,N'El destino no pertenece al modelo.');
      ELSE
      BEGIN
        SELECT @Criterio=c.IdCriterioEvaluacion
        FROM dbo.DES_CriterioEvaluacion c
        INNER JOIN dbo.DES_CriterioEvaluacion src ON src.IdCriterioEvaluacion=@OrigenCriterio
        WHERE c.IdModeloPuestoEscenario=@PE AND c.IdModeloDimension=@D
          AND ISNULL(c.Codigo,c.Nombre)=ISNULL(src.Codigo,src.Nombre);
        IF @Criterio IS NULL AND @CrearCriterioSiNoExiste=1
        BEGIN
          INSERT dbo.DES_CriterioEvaluacion(
            IdCriterioOrigen,IdModeloPuestoEscenario,IdModeloDimension,Codigo,Nombre,
            Descripcion,Ponderacion,NivelExigencia,IdTipoItemPredeterminado,
            IdEscalaPredeterminada,Orden,Activo
          )
          SELECT IdCriterioEvaluacion,@PE,@D,Codigo,Nombre,Descripcion,Ponderacion,
                 NivelExigencia,IdTipoItemPredeterminado,IdEscalaPredeterminada,
                 ISNULL((SELECT MAX(Orden)+1 FROM dbo.DES_CriterioEvaluacion
                         WHERE IdModeloPuestoEscenario=@PE AND IdModeloDimension=@D),1),1
          FROM dbo.DES_CriterioEvaluacion WHERE IdCriterioEvaluacion=@OrigenCriterio;
          SET @Criterio=SCOPE_IDENTITY();
        END
        IF @Criterio IS NULL
          INSERT @Omitidos VALUES(@P,@E,@D,N'No existe el criterio destino.');
        ELSE IF EXISTS(
          SELECT 1 FROM dbo.DES_ItemEvaluativo i
          INNER JOIN dbo.DES_ItemEvaluativo src ON src.IdItemEvaluativo=@IdItem
          WHERE i.IdCriterioEvaluacion=@Criterio
            AND ISNULL(i.Codigo,i.Texto)=ISNULL(src.Codigo,src.Texto)
        )
          INSERT @Omitidos VALUES(@P,@E,@D,N'Ya existe un item con el mismo codigo.');
        ELSE
        BEGIN
          INSERT dbo.DES_ItemEvaluativo(
            IdItemOrigen,IdCriterioEvaluacion,Codigo,Texto,IdTipoItem,IdEscala,
            Requerido,PermiteNoAplica,Orden,Activo
          )
          SELECT IdItemEvaluativo,@Criterio,Codigo,Texto,IdTipoItem,IdEscala,
                 Requerido,PermiteNoAplica,
                 ISNULL((SELECT MAX(Orden)+1 FROM dbo.DES_ItemEvaluativo
                         WHERE IdCriterioEvaluacion=@Criterio),1),1
          FROM dbo.DES_ItemEvaluativo WHERE IdItemEvaluativo=@IdItem;
          SET @Nuevo=SCOPE_IDENTITY();
          INSERT @Creados VALUES(@Nuevo,@P,@E,@D);
        END
      END
      SET @PE=NULL; SET @Criterio=NULL;
      FETCH NEXT FROM c INTO @P,@E,@D;
    END
    CLOSE c; DEALLOCATE c;
    SELECT * FROM @Creados ORDER BY puestoId,escenarioId,dimensionId;
    SELECT * FROM @Omitidos ORDER BY puestoId,escenarioId,dimensionId;
END
GO

CREATE OR ALTER PROCEDURE dbo.DES_sp_Modelos_Uso
    @IdModelo INT,@IdOrganizacion INT
AS
BEGIN
    SET NOCOUNT ON;
    SELECT e.IdEvaluacion AS id,e.Nombre AS nombre,ce.Codigo AS estadoCodigo,
           e.FechaInicio AS fechaInicio,e.FechaCierre AS fechaCierre
    FROM dbo.DES_Evaluacion e
    INNER JOIN dbo.DES_CatEstadoEvaluacion ce ON ce.IdEstadoEvaluacion=e.IdEstadoEvaluacion
    WHERE e.IdModelo=@IdModelo AND e.IdOrganizacion=@IdOrganizacion
    ORDER BY e.FechaCreacion DESC,e.IdEvaluacion DESC;
END
GO

CREATE OR ALTER PROCEDURE dbo.DES_sp_ModeloEnvios_Guardar
    @IdOrganizacion INT,
    @IdModelo INT,
    @IdEmpleado INT,
    @Estado NVARCHAR(30) = N'CREADO',
    @EmpleadosEnviarJson NVARCHAR(MAX),
    @Usuario NVARCHAR(100) = NULL
AS
BEGIN 
    SET NOCOUNT ON;
    SET XACT_ABORT ON;

    SET @Estado = UPPER(LTRIM(RTRIM(ISNULL(@Estado, N'CREADO'))));

    IF @Estado IS NULL OR @Estado NOT IN (
        N'CREADO',
        N'ENVIADO',
        N'INICIADO',
        N'CONTESTADO',
        N'ERROR',
        N'ANULADO'
    )
        THROW 52402, 'El estado del envio no es valido.', 1;

    IF ISJSON(@EmpleadosEnviarJson) <> 1
        THROW 52402, 'EmpleadosEnviar debe ser una lista JSON valida.', 1;

    IF NOT EXISTS (
        SELECT 1
        FROM dbo.DES_Modelo
        WHERE IdModelo = @IdModelo
          AND IdOrganizacion = @IdOrganizacion
    )
        THROW 52101, 'No existe el modelo indicado.', 1;

    IF NOT EXISTS (
        SELECT 1
        FROM dbo.Empleados
        WHERE Id = @IdEmpleado
          AND IdOrganizacion = @IdOrganizacion
    )
        THROW 52402, 'El empleado principal no pertenece a la organizacion.', 1;

    DECLARE @IdEvaluacion BIGINT = (
        SELECT TOP (1) IdEvaluacion
        FROM dbo.DES_Evaluacion
        WHERE IdModelo = @IdModelo
          AND IdOrganizacion = @IdOrganizacion
          AND Activo = 1
        ORDER BY IdEvaluacion DESC
    );

    IF @IdEvaluacion IS NULL
        THROW 52201, 'No existe una evaluacion activa para el modelo.', 1;

    DECLARE @IdEstadoAsignacionPendiente SMALLINT = (
        SELECT IdEstadoAsignacion
        FROM dbo.DES_CatEstadoAsignacion
        WHERE Codigo = N'PENDIENTE'
          AND Activo = 1
    );

    IF @IdEstadoAsignacionPendiente IS NULL
        THROW 52402, 'No existe el estado PENDIENTE para crear asignaciones.', 1;

    DECLARE @IdEmpleadoJefeEvaluador INT = (
        SELECT IdEmpleadoJefe
        FROM dbo.Empleados
        WHERE Id = @IdEmpleado
    );

    DECLARE @EmpleadosEnviar TABLE (
        IdEmpleadoEnviar INT NOT NULL PRIMARY KEY,
        CodigoEncuestaEmpleado NVARCHAR(256) NOT NULL,
        IdModeloPuestoEscenario INT NULL,
        EsAnonima BIT NULL
    );

    IF EXISTS (
        SELECT 1
        FROM OPENJSON(@EmpleadosEnviarJson)
        WHERE [type] <> 5
    )
        THROW 52402, 'EmpleadosEnviar contiene valores invalidos.', 1;

    INSERT @EmpleadosEnviar (
        IdEmpleadoEnviar,
        CodigoEncuestaEmpleado
    )
    SELECT
        IdEmpleadoEnviar,
        CodigoEncuestaEmpleado
    FROM OPENJSON(@EmpleadosEnviarJson) WITH (
        IdEmpleadoEnviar INT '$.idEmpleadoEnviar',
        CodigoEncuestaEmpleado NVARCHAR(256) '$.codigoEncuestaEmpleado'
    );

    IF NOT EXISTS (SELECT 1 FROM @EmpleadosEnviar)
        THROW 52402, 'Debe indicar al menos un empleado destinatario.', 1;

    IF EXISTS (
        SELECT 1
        FROM @EmpleadosEnviar
        WHERE IdEmpleadoEnviar <= 0
           OR NULLIF(LTRIM(RTRIM(CodigoEncuestaEmpleado)), N'') IS NULL
    )
        THROW 52402, 'EmpleadosEnviar contiene ids o codigos invalidos.', 1;

    IF EXISTS (
        SELECT 1
        FROM @EmpleadosEnviar ee
        LEFT JOIN dbo.Empleados e
            ON e.Id = ee.IdEmpleadoEnviar
           AND e.IdOrganizacion = @IdOrganizacion
        WHERE e.Id IS NULL
    )
        THROW 52402, 'Uno o mas destinatarios no pertenecen a la organizacion.', 1;

    UPDATE ee
    SET IdModeloPuestoEscenario = configuracion.IdModeloPuestoEscenario,
        EsAnonima = configuracion.EsAnonima
    FROM @EmpleadosEnviar ee
    INNER JOIN dbo.Empleados evaluado
        ON evaluado.Id = ee.IdEmpleadoEnviar
    OUTER APPLY (
        SELECT TOP (1) ep.IdPuesto
        FROM dbo.DES_EmpleadoPuesto ep
        WHERE ep.IdEmpleado = ee.IdEmpleadoEnviar
          AND ep.EsActual = 1
        ORDER BY ep.FechaInicio DESC, ep.IdEmpleadoPuesto DESC
    ) puestoActual
    OUTER APPLY (
        SELECT TOP (1)
            mpe.IdModeloPuestoEscenario,
            me.EsAnonimo AS EsAnonima
        FROM dbo.DES_ModeloPuesto mp
        INNER JOIN dbo.DES_ModeloPuestoEscenario mpe
            ON mpe.IdModeloPuesto = mp.IdModeloPuesto
           AND mpe.Activo = 1
        INNER JOIN dbo.DES_ModeloEscenario me
            ON me.IdModeloEscenario = mpe.IdModeloEscenario
           AND me.Activo = 1
        INNER JOIN dbo.DES_CatEscenario ce
            ON ce.IdEscenario = me.IdEscenario
        WHERE mp.IdModelo = @IdModelo
          AND mp.IdPuesto = puestoActual.IdPuesto
          AND mp.Activo = 1
          AND mp.SoloEvaluador = 0
          AND (
              (
                  ce.Codigo = N'BOSS_TO_EMPLOYEE'
                  AND evaluado.IdEmpleadoJefe = @IdEmpleado
              )
              OR (
                  ce.Codigo = N'EMPLOYEE_TO_BOSS'
                  AND @IdEmpleadoJefeEvaluador = ee.IdEmpleadoEnviar
              )
              OR (
                  ce.Codigo = N'SELF'
                  AND @IdEmpleado = ee.IdEmpleadoEnviar
              )
              OR (
                  ce.Codigo = N'PEER'
                  AND @IdEmpleado <> ee.IdEmpleadoEnviar
                  AND evaluado.IdEmpleadoJefe = @IdEmpleadoJefeEvaluador
                  AND evaluado.IdEmpleadoJefe IS NOT NULL
              )
          )
        ORDER BY me.Orden, mpe.Orden, mpe.IdModeloPuestoEscenario
    ) configuracion;

    IF EXISTS (
        SELECT 1
        FROM @EmpleadosEnviar
        WHERE IdModeloPuestoEscenario IS NULL
           OR EsAnonima IS NULL
    )
        THROW 52402, 'Uno o mas empleados no tienen puesto o escenario aplicable en el modelo.', 1;

    IF EXISTS (
        SELECT 1
        FROM @EmpleadosEnviar ee
        INNER JOIN dbo.DES_EnvioEncuestaEmpleado en
            ON en.IdModelo = @IdModelo
           AND en.IdEmpleado = @IdEmpleado
           AND en.IdEmpleadoEnviar = ee.IdEmpleadoEnviar
    )
        THROW 52403, 'Ya existe un envio para uno o mas destinatarios.', 1;

    DECLARE @Nuevos TABLE (
        IdEnvioEncuestaEmpleado BIGINT NOT NULL PRIMARY KEY,
        IdEmpleadoEnviar INT NOT NULL
    );

    DECLARE @AsignacionesNuevas TABLE (
        IdAsignacion BIGINT NOT NULL PRIMARY KEY,
        IdEmpleadoEnviar INT NOT NULL
    );
               
    INSERT dbo.DES_AsignacionEvaluacion (
        IdEvaluacion,
        IdModeloPuestoEscenario,
        IdEvaluador,
        IdEvaluado,
        IdEstadoAsignacion,
        EsAnonima,
        FechaLimite
    )
    OUTPUT
        inserted.IdAsignacion,
        inserted.IdEvaluado
        INTO @AsignacionesNuevas (IdAsignacion, IdEmpleadoEnviar)
    SELECT
        @IdEvaluacion,
        ee.IdModeloPuestoEscenario,
        @IdEmpleado,
        ee.IdEmpleadoEnviar,
        @IdEstadoAsignacionPendiente,
        ee.EsAnonima,
        DATEADD(
            DAY,
            1,
            CONVERT(
                DATETIME2(0),
                (SELECT FechaCierre
                 FROM dbo.DES_Evaluacion
                 WHERE IdEvaluacion = @IdEvaluacion)
            )
        )
    FROM @EmpleadosEnviar ee
    WHERE NOT EXISTS (
        SELECT 1
        FROM dbo.DES_AsignacionEvaluacion a
        WHERE a.IdEvaluacion = @IdEvaluacion
          AND a.IdModeloPuestoEscenario = ee.IdModeloPuestoEscenario
          AND a.IdEvaluador = @IdEmpleado
          AND a.IdEvaluado = ee.IdEmpleadoEnviar
    );

    IF (
        SELECT COUNT(*)
        FROM @AsignacionesNuevas
    ) <> (
        SELECT COUNT(*)
        FROM @EmpleadosEnviar
    )
        THROW 52403, 'Ya existe una asignacion para uno o mas empleados.', 1;

    INSERT dbo.DES_EnvioEncuestaEmpleado (
        IdOrganizacion,
        IdModelo,
        IdEmpleado,
        IdEmpleadoEnviar,
        Estado,
        CodigoEncuestaEmpleado,
        UsuarioCreacion
    )
    OUTPUT
        inserted.IdEnvioEncuestaEmpleado,
        inserted.IdEmpleadoEnviar
        INTO @Nuevos (IdEnvioEncuestaEmpleado, IdEmpleadoEnviar)
    SELECT
        @IdOrganizacion,
        @IdModelo,
        @IdEmpleado,
        ee.IdEmpleadoEnviar,
        @Estado,
        ee.CodigoEncuestaEmpleado,
        @Usuario
    FROM @EmpleadosEnviar ee;

    SELECT
        en.IdEnvioEncuestaEmpleado AS id,
        en.IdOrganizacion AS organizacionId,
        en.IdModelo AS modeloId,
        @IdEvaluacion AS evaluacionId,
        asignacion.IdAsignacion AS asignacionId,
        en.IdEmpleado AS empleadoId,
        en.IdEmpleadoEnviar AS empleadoEnviarId,
        en.Estado AS estado,
        en.CodigoEncuestaEmpleado AS codigoEncuestaEmpleado,
        en.Activo AS activo,
        en.FechaCreacion AS fechaCreacion
    FROM dbo.DES_EnvioEncuestaEmpleado en
    INNER JOIN @Nuevos n
        ON n.IdEnvioEncuestaEmpleado = en.IdEnvioEncuestaEmpleado
    INNER JOIN @AsignacionesNuevas asignacion
        ON asignacion.IdEmpleadoEnviar = n.IdEmpleadoEnviar
    ORDER BY en.IdEnvioEncuestaEmpleado;
END
GO

CREATE OR ALTER PROCEDURE dbo.DES_sp_ModeloEnvios_Obtener
    @IdOrganizacion INT,
    @IdEnvioEncuestaEmpleado BIGINT = NULL,
    @IdModelo INT = NULL,
    @IdEmpleado INT = NULL,
    @IdEmpleadoEnviar INT = NULL,
    @Estado NVARCHAR(30) = NULL,
    @Activo BIT = NULL
AS
BEGIN
    SET NOCOUNT ON;

    SET @Estado = NULLIF(UPPER(LTRIM(RTRIM(@Estado))), N'');

    SELECT
        en.IdEnvioEncuestaEmpleado AS id,
        en.IdOrganizacion AS organizacionId,
        en.IdModelo AS modeloId,
        m.Codigo AS modeloCodigo,
        m.Nombre AS modeloNombre,
        en.IdEmpleado AS empleadoId,
        CONCAT(
            ISNULL(ep.Nombres, N''),
            N' ',
            ISNULL(ep.Apellidos, N'')
        ) AS empleadoNombre,
        ep.Email AS empleadoEmail,
        en.IdEmpleadoEnviar AS empleadoEnviarId,
        CONCAT(
            ISNULL(ed.Nombres, N''),
            N' ',
            ISNULL(ed.Apellidos, N'')
        ) AS empleadoEnviarNombre,
        ed.Email AS empleadoEnviarEmail,
        en.Estado AS estado,
        en.CodigoEncuestaEmpleado AS codigoEncuestaEmpleado,
        en.FechaEnvio AS fechaEnvio,
        en.FechaInicio AS fechaInicio,
        en.FechaFinalizacion AS fechaFinalizacion,
        en.RespuestaEnvio AS respuestaEnvio,
        en.Activo AS activo,
        en.FechaCreacion AS fechaCreacion,
        en.FechaModificacion AS fechaModificacion
    FROM dbo.DES_EnvioEncuestaEmpleado en
    INNER JOIN dbo.DES_Modelo m
        ON m.IdModelo = en.IdModelo
    INNER JOIN dbo.Empleados ep
        ON ep.Id = en.IdEmpleado
    INNER JOIN dbo.Empleados ed
        ON ed.Id = en.IdEmpleadoEnviar
    WHERE en.IdOrganizacion = @IdOrganizacion
      AND (
          @IdEnvioEncuestaEmpleado IS NULL
          OR en.IdEnvioEncuestaEmpleado = @IdEnvioEncuestaEmpleado
      )
      AND (@IdModelo IS NULL OR en.IdModelo = @IdModelo)
      AND (@IdEmpleado IS NULL OR en.IdEmpleado = @IdEmpleado)
      AND (
          @IdEmpleadoEnviar IS NULL
          OR en.IdEmpleadoEnviar = @IdEmpleadoEnviar
      )
      AND (@Estado IS NULL OR en.Estado = @Estado)
      AND (@Activo IS NULL OR en.Activo = @Activo)
    ORDER BY en.FechaCreacion DESC, en.IdEnvioEncuestaEmpleado DESC;

    IF @IdEnvioEncuestaEmpleado IS NOT NULL AND @@ROWCOUNT = 0
        THROW 52401, 'No existe el envio indicado.', 1;
END
GO

CREATE OR ALTER PROCEDURE dbo.DES_sp_ModeloEnvios_Editar
    @IdOrganizacion INT,
    @IdEnvioEncuestaEmpleado BIGINT,
    @Estado NVARCHAR(30),
    @FechaEnvio DATETIME2(0) = NULL,
    @FechaInicio DATETIME2(0) = NULL,
    @FechaFinalizacion DATETIME2(0) = NULL,
    @RespuestaEnvio NVARCHAR(1000) = NULL,
    @Activo BIT = NULL,
    @Usuario NVARCHAR(100) = NULL
AS
BEGIN
    SET NOCOUNT ON;

    SET @Estado = UPPER(LTRIM(RTRIM(@Estado)));

    IF @Estado IS NULL OR @Estado NOT IN (
        N'CREADO',
        N'ENVIADO',
        N'INICIADO',
        N'CONTESTADO',
        N'ERROR',
        N'ANULADO'
    )
        THROW 52402, 'El estado del envio no es valido.', 1;

    IF @FechaInicio IS NOT NULL
       AND @FechaFinalizacion IS NOT NULL
       AND @FechaInicio > @FechaFinalizacion
        THROW 52402, 'La fecha de inicio no puede ser posterior a la finalizacion.', 1;

    UPDATE dbo.DES_EnvioEncuestaEmpleado
    SET Estado = @Estado,
        FechaEnvio = COALESCE(@FechaEnvio, FechaEnvio),
        FechaInicio = COALESCE(@FechaInicio, FechaInicio),
        FechaFinalizacion = COALESCE(@FechaFinalizacion, FechaFinalizacion),
        RespuestaEnvio = COALESCE(@RespuestaEnvio, RespuestaEnvio),
        Activo = COALESCE(@Activo, Activo),
        FechaModificacion = SYSDATETIME(),
        UsuarioModificacion = @Usuario
    WHERE IdEnvioEncuestaEmpleado = @IdEnvioEncuestaEmpleado
      AND IdOrganizacion = @IdOrganizacion;

    IF @@ROWCOUNT = 0
        THROW 52401, 'No existe el envio indicado.', 1;

    SELECT
        IdEnvioEncuestaEmpleado AS id,
        IdOrganizacion AS organizacionId,
        IdModelo AS modeloId,
        IdEmpleado AS empleadoId,
        IdEmpleadoEnviar AS empleadoEnviarId,
        Estado AS estado,
        CodigoEncuestaEmpleado AS codigoEncuestaEmpleado,
        FechaEnvio AS fechaEnvio,
        FechaInicio AS fechaInicio,
        FechaFinalizacion AS fechaFinalizacion,
        RespuestaEnvio AS respuestaEnvio,
        Activo AS activo,
        FechaModificacion AS fechaModificacion
    FROM dbo.DES_EnvioEncuestaEmpleado
    WHERE IdEnvioEncuestaEmpleado = @IdEnvioEncuestaEmpleado;
END
GO

CREATE OR ALTER PROCEDURE dbo.DES_sp_Evaluaciones_Listar
    @IdOrganizacion INT,@EstadoCodigo NVARCHAR(30)=NULL,@IdModelo INT=NULL,
    @Buscar NVARCHAR(200)=NULL,@FechaDesde DATE=NULL,@FechaHasta DATE=NULL,
    @Pagina INT=1,@Limite INT=50
AS
BEGIN
    SET NOCOUNT ON;
    SET @Pagina=CASE WHEN @Pagina<1 THEN 1 ELSE @Pagina END;
    SET @Limite=CASE WHEN @Limite<1 THEN 50 WHEN @Limite>200 THEN 200 ELSE @Limite END;
    ;WITH D AS (
      SELECT e.IdEvaluacion AS id,e.IdOrganizacion AS organizacionId,e.IdModelo AS modeloId,
             m.Codigo AS modeloCodigo,m.Version AS modeloVersion,e.Nombre AS nombre,
             e.Descripcion AS descripcion,ce.Codigo AS estadoCodigo,ce.Nombre AS estadoNombre,
             e.FechaInicio AS fechaInicio,e.FechaCierre AS fechaCierre,e.Activo AS activo,
             ISNULL(ps.totalParticipantes,0) AS totalParticipantes,
             ISNULL(ast.totalAsignaciones,0) AS totalAsignaciones,
             ISNULL(ast.pendientes,0) AS pendientes,
             ISNULL(ast.enProceso,0) AS enProceso,
             ISNULL(ast.respondidas,0) AS respondidas,
             ISNULL(env.erroresEnvio,0) AS erroresEnvio,
             CAST(CASE WHEN ISNULL(ast.totalAsignaciones,0)=0 THEN 0
                  ELSE 100.0*ast.respondidas/ast.totalAsignaciones
                  END AS DECIMAL(6,2)) AS porcentajeAvance
      FROM dbo.DES_Evaluacion e
      INNER JOIN dbo.DES_Modelo m ON m.IdModelo=e.IdModelo
      INNER JOIN dbo.DES_CatEstadoEvaluacion ce ON ce.IdEstadoEvaluacion=e.IdEstadoEvaluacion
      OUTER APPLY (
        SELECT COUNT(*) AS totalParticipantes
        FROM dbo.DES_EvaluacionParticipante p
        WHERE p.IdEvaluacion=e.IdEvaluacion AND p.Activo=1
      ) ps
      OUTER APPLY (
        SELECT COUNT(*) AS totalAsignaciones,
               SUM(CASE WHEN ea.Codigo=N'PENDIENTE' THEN 1 ELSE 0 END) AS pendientes,
               SUM(CASE WHEN ea.Codigo=N'EN_PROCESO' THEN 1 ELSE 0 END) AS enProceso,
               SUM(CASE WHEN ea.Codigo=N'RESPONDIDA' THEN 1 ELSE 0 END) AS respondidas
        FROM dbo.DES_AsignacionEvaluacion a
        INNER JOIN dbo.DES_CatEstadoAsignacion ea
          ON ea.IdEstadoAsignacion=a.IdEstadoAsignacion
        WHERE a.IdEvaluacion=e.IdEvaluacion AND a.Activo=1
      ) ast
      OUTER APPLY (
        SELECT COUNT(*) AS erroresEnvio
        FROM dbo.DES_EnvioEvaluacion en
        INNER JOIN dbo.DES_AsignacionEvaluacion ax
          ON ax.IdAsignacion=en.IdAsignacion
        WHERE ax.IdEvaluacion=e.IdEvaluacion AND en.Estado=N'ERROR'
      ) env
      WHERE e.IdOrganizacion=@IdOrganizacion
        AND (@EstadoCodigo IS NULL OR ce.Codigo=UPPER(@EstadoCodigo))
        AND (@IdModelo IS NULL OR e.IdModelo=@IdModelo)
        AND (@FechaDesde IS NULL OR e.FechaInicio>=@FechaDesde)
        AND (@FechaHasta IS NULL OR e.FechaCierre<=@FechaHasta)
        AND (@Buscar IS NULL OR e.Nombre LIKE N'%'+@Buscar+N'%' OR m.Codigo LIKE N'%'+@Buscar+N'%')
    )
    SELECT * FROM D ORDER BY fechaInicio DESC,id DESC
    OFFSET (@Pagina-1)*@Limite ROWS FETCH NEXT @Limite ROWS ONLY;
    DECLARE @Total INT=(SELECT COUNT(*) FROM dbo.DES_Evaluacion e
      INNER JOIN dbo.DES_Modelo m ON m.IdModelo=e.IdModelo
      INNER JOIN dbo.DES_CatEstadoEvaluacion ce ON ce.IdEstadoEvaluacion=e.IdEstadoEvaluacion
      WHERE e.IdOrganizacion=@IdOrganizacion
        AND (@EstadoCodigo IS NULL OR ce.Codigo=UPPER(@EstadoCodigo))
        AND (@IdModelo IS NULL OR e.IdModelo=@IdModelo)
        AND (@FechaDesde IS NULL OR e.FechaInicio>=@FechaDesde)
        AND (@FechaHasta IS NULL OR e.FechaCierre<=@FechaHasta)
        AND (@Buscar IS NULL OR e.Nombre LIKE N'%'+@Buscar+N'%'));
    SELECT @Pagina Pagina,@Limite Limite,@Total TotalRegistros,
           CEILING(CONVERT(DECIMAL(18,4),@Total)/@Limite) TotalPaginas;
END
GO

CREATE OR ALTER PROCEDURE dbo.DES_sp_Evaluaciones_Obtener
    @IdEvaluacion BIGINT,@IdOrganizacion INT
AS
BEGIN
    SET NOCOUNT ON;
    IF NOT EXISTS(SELECT 1 FROM dbo.DES_Evaluacion WHERE IdEvaluacion=@IdEvaluacion AND IdOrganizacion=@IdOrganizacion)
      THROW 52201,'No existe la evaluacion indicada.',1;
    DECLARE @DataJson NVARCHAR(MAX);
    SELECT @DataJson=(
      SELECT e.IdEvaluacion AS id,e.IdOrganizacion AS organizacionId,e.IdModelo AS modeloId,
             m.Codigo AS modeloCodigo,m.Version AS modeloVersion,m.Nombre AS modeloNombre,
             e.Nombre AS nombre,e.Descripcion AS descripcion,ce.Codigo AS estadoCodigo,
             ce.Nombre AS estadoNombre,e.FechaInicio AS fechaInicio,e.FechaCierre AS fechaCierre,
             e.FechaCierreReal AS fechaCierreReal,e.Activo AS activo,
             JSON_QUERY((SELECT p.IdEvaluacionParticipante AS id,p.IdEmpleado AS empleadoId,
               CONCAT(ISNULL(em.Nombres,N''),N' ',ISNULL(em.Apellidos,N'')) AS nombreCompleto,
               p.IdPuestoSnapshot AS puestoId,p.CargoSnapshot AS cargo,p.EmailSnapshot AS email,
               p.IdEmpleadoJefeSnapshot AS jefeId,p.EsEvaluador AS esEvaluador,
               p.EsEvaluado AS esEvaluado,p.Activo AS activo
               FROM dbo.DES_EvaluacionParticipante p
               INNER JOIN dbo.Empleados em ON em.Id=p.IdEmpleado
               WHERE p.IdEvaluacion=e.IdEvaluacion ORDER BY em.Nombres,em.Apellidos,em.Id
               FOR JSON PATH)) AS participantes,
             JSON_QUERY((SELECT COUNT(*) AS total,
               SUM(CASE WHEN ca.Codigo=N'PENDIENTE' THEN 1 ELSE 0 END) AS pendientes,
               SUM(CASE WHEN ca.Codigo=N'EN_PROCESO' THEN 1 ELSE 0 END) AS enProceso,
               SUM(CASE WHEN ca.Codigo=N'RESPONDIDA' THEN 1 ELSE 0 END) AS respondidas
               FROM dbo.DES_AsignacionEvaluacion a
               INNER JOIN dbo.DES_CatEstadoAsignacion ca ON ca.IdEstadoAsignacion=a.IdEstadoAsignacion
               WHERE a.IdEvaluacion=e.IdEvaluacion FOR JSON PATH,WITHOUT_ARRAY_WRAPPER)) AS asignaciones
      FROM dbo.DES_Evaluacion e
      INNER JOIN dbo.DES_Modelo m ON m.IdModelo=e.IdModelo
      INNER JOIN dbo.DES_CatEstadoEvaluacion ce ON ce.IdEstadoEvaluacion=e.IdEstadoEvaluacion
      WHERE e.IdEvaluacion=@IdEvaluacion AND e.IdOrganizacion=@IdOrganizacion
      FOR JSON PATH,WITHOUT_ARRAY_WRAPPER
    );
    SELECT @DataJson DataJson;
END
GO

CREATE OR ALTER PROCEDURE dbo.DES_sp_Evaluaciones_Crear
    @IdOrganizacion INT,@IdModelo INT,@Nombre NVARCHAR(200),
    @Descripcion NVARCHAR(1000)=NULL,@FechaInicio DATE,@FechaCierre DATE,
    @Usuario NVARCHAR(100)=NULL
AS
BEGIN
    SET NOCOUNT ON;
    IF @FechaInicio>@FechaCierre THROW 52205,'El rango de fechas es invalido.',1;
    IF NOT EXISTS(
      SELECT 1 FROM dbo.DES_Modelo m
      INNER JOIN dbo.DES_CatEstadoModelo e ON e.IdEstadoModelo=m.IdEstadoModelo
      WHERE m.IdModelo=@IdModelo AND m.IdOrganizacion=@IdOrganizacion
        AND m.Activo=1 AND e.Codigo=N'ACTIVO'
    ) THROW 52203,'El modelo debe estar activo.',1;
    DECLARE @Snapshot NVARCHAR(MAX);
    SELECT @Snapshot=JsonFuente FROM dbo.DES_Modelo WHERE IdModelo=@IdModelo;
    IF @Snapshot IS NULL
      SELECT @Snapshot=(SELECT * FROM dbo.DES_vw_ModeloDetalle WHERE IdModelo=@IdModelo FOR JSON PATH);
    DECLARE @Estado SMALLINT=(SELECT IdEstadoEvaluacion FROM dbo.DES_CatEstadoEvaluacion WHERE Codigo=N'BORRADOR');
    INSERT dbo.DES_Evaluacion(IdOrganizacion,IdModelo,IdEstadoEvaluacion,Nombre,Descripcion,
      FechaInicio,FechaCierre,JsonConfiguracionSnapshot,UsuarioCreacion)
    VALUES(@IdOrganizacion,@IdModelo,@Estado,@Nombre,@Descripcion,@FechaInicio,@FechaCierre,@Snapshot,@Usuario);
    SELECT CONVERT(BIGINT,SCOPE_IDENTITY()) AS IdEvaluacion;
END
GO

CREATE OR ALTER PROCEDURE dbo.DES_sp_Evaluaciones_Actualizar
    @IdEvaluacion BIGINT,@IdOrganizacion INT,@PayloadJson NVARCHAR(MAX),
    @Usuario NVARCHAR(100)=NULL
AS
BEGIN
    SET NOCOUNT ON;
    IF NOT EXISTS(
      SELECT 1 FROM dbo.DES_Evaluacion e
      INNER JOIN dbo.DES_CatEstadoEvaluacion ce ON ce.IdEstadoEvaluacion=e.IdEstadoEvaluacion
      WHERE e.IdEvaluacion=@IdEvaluacion AND e.IdOrganizacion=@IdOrganizacion
        AND ce.Codigo IN(N'BORRADOR',N'PROGRAMADA')
        AND NOT EXISTS(SELECT 1 FROM dbo.DES_RespuestaEvaluacion r
          INNER JOIN dbo.DES_AsignacionEvaluacion a ON a.IdAsignacion=r.IdAsignacion
          WHERE a.IdEvaluacion=e.IdEvaluacion)
    ) THROW 52202,'La evaluacion ya no es editable.',1;
    UPDATE dbo.DES_Evaluacion SET
      Nombre=COALESCE(JSON_VALUE(@PayloadJson,'$.nombre'),Nombre),
      Descripcion=CASE WHEN JSON_QUERY(@PayloadJson,'$.descripcion') IS NOT NULL
                        OR JSON_VALUE(@PayloadJson,'$.descripcion') IS NOT NULL
                       THEN JSON_VALUE(@PayloadJson,'$.descripcion') ELSE Descripcion END,
      FechaInicio=COALESCE(TRY_CONVERT(DATE,JSON_VALUE(@PayloadJson,'$.fechaInicio')),FechaInicio),
      FechaCierre=COALESCE(TRY_CONVERT(DATE,JSON_VALUE(@PayloadJson,'$.fechaCierre')),FechaCierre),
      FechaModificacion=SYSDATETIME(),UsuarioModificacion=@Usuario
    WHERE IdEvaluacion=@IdEvaluacion;
    IF EXISTS(SELECT 1 FROM dbo.DES_Evaluacion WHERE IdEvaluacion=@IdEvaluacion AND FechaInicio>FechaCierre)
      THROW 52205,'El rango de fechas es invalido.',1;
    SELECT @IdEvaluacion AS id;
END
GO

CREATE OR ALTER PROCEDURE dbo.DES_sp_Evaluaciones_GuardarParticipantes
    @IdEvaluacion BIGINT,@IdOrganizacion INT,@ParticipantesJson NVARCHAR(MAX)
AS
BEGIN
    SET NOCOUNT ON;
    IF ISJSON(@ParticipantesJson)<>1 THROW 52205,'Participantes invalidos.',1;
    IF NOT EXISTS(
      SELECT 1 FROM dbo.DES_Evaluacion e
      INNER JOIN dbo.DES_CatEstadoEvaluacion ce ON ce.IdEstadoEvaluacion=e.IdEstadoEvaluacion
      WHERE e.IdEvaluacion=@IdEvaluacion AND e.IdOrganizacion=@IdOrganizacion
        AND ce.Codigo IN(N'BORRADOR',N'PROGRAMADA')
        AND NOT EXISTS(SELECT 1 FROM dbo.DES_RespuestaEvaluacion r
          INNER JOIN dbo.DES_AsignacionEvaluacion a ON a.IdAsignacion=r.IdAsignacion
          WHERE a.IdEvaluacion=e.IdEvaluacion)
    ) THROW 52202,'Los participantes ya no son editables.',1;
    DECLARE @Ids TABLE(IdEmpleado INT PRIMARY KEY);
    INSERT @Ids SELECT DISTINCT TRY_CONVERT(INT,[value]) FROM OPENJSON(@ParticipantesJson)
    WHERE TRY_CONVERT(INT,[value]) IS NOT NULL;
    IF EXISTS(SELECT 1 FROM @Ids i LEFT JOIN dbo.Empleados e
      ON e.Id=i.IdEmpleado AND e.IdOrganizacion=@IdOrganizacion WHERE e.Id IS NULL)
      THROW 52205,'Uno o mas empleados no pertenecen a la organizacion.',1;
    IF EXISTS(
      SELECT 1
      FROM @Ids i
      INNER JOIN dbo.DES_Evaluacion ev ON ev.IdEvaluacion=@IdEvaluacion
      LEFT JOIN dbo.DES_EmpleadoPuesto ep
        ON ep.IdEmpleado=i.IdEmpleado AND ep.EsActual=1
      LEFT JOIN dbo.DES_ModeloPuesto mp
        ON mp.IdModelo=ev.IdModelo AND mp.IdPuesto=ep.IdPuesto AND mp.Activo=1
      WHERE mp.IdModeloPuesto IS NULL
    ) THROW 52205,'Uno o mas empleados no tienen un puesto participante en el modelo.',1;

    UPDATE p SET Activo=0
    FROM dbo.DES_EvaluacionParticipante p
    WHERE p.IdEvaluacion=@IdEvaluacion
      AND NOT EXISTS(SELECT 1 FROM @Ids i WHERE i.IdEmpleado=p.IdEmpleado);

    MERGE dbo.DES_EvaluacionParticipante T
    USING (
      SELECT i.IdEmpleado,ep.IdPuesto,mp.IdModeloPuesto,e.Cargo,e.Email,e.IdEmpleadoJefe,
             ISNULL(mp.SoloEvaluador,0) SoloEvaluador
      FROM @Ids i
      INNER JOIN dbo.Empleados e ON e.Id=i.IdEmpleado
      OUTER APPLY(SELECT TOP 1 x.IdPuesto FROM dbo.DES_EmpleadoPuesto x
                  WHERE x.IdEmpleado=e.Id AND x.EsActual=1 ORDER BY x.FechaInicio DESC,x.IdEmpleadoPuesto DESC) ep
      INNER JOIN dbo.DES_Evaluacion ev ON ev.IdEvaluacion=@IdEvaluacion
      LEFT JOIN dbo.DES_ModeloPuesto mp ON mp.IdModelo=ev.IdModelo AND mp.IdPuesto=ep.IdPuesto AND mp.Activo=1
    ) S ON T.IdEvaluacion=@IdEvaluacion AND T.IdEmpleado=S.IdEmpleado
    WHEN MATCHED THEN UPDATE SET IdModeloPuesto=S.IdModeloPuesto,IdPuestoSnapshot=S.IdPuesto,
      CargoSnapshot=S.Cargo,EmailSnapshot=S.Email,IdEmpleadoJefeSnapshot=S.IdEmpleadoJefe,
      EsEvaluador=1,EsEvaluado=CASE WHEN S.SoloEvaluador=1 THEN 0 ELSE 1 END,Activo=1
    WHEN NOT MATCHED THEN INSERT(IdEvaluacion,IdEmpleado,IdModeloPuesto,IdPuestoSnapshot,
      CargoSnapshot,EmailSnapshot,IdEmpleadoJefeSnapshot,EsEvaluador,EsEvaluado,Activo)
      VALUES(@IdEvaluacion,S.IdEmpleado,S.IdModeloPuesto,S.IdPuesto,S.Cargo,S.Email,
        S.IdEmpleadoJefe,1,CASE WHEN S.SoloEvaluador=1 THEN 0 ELSE 1 END,1);
    SELECT COUNT(*) totalParticipantes FROM dbo.DES_EvaluacionParticipante
    WHERE IdEvaluacion=@IdEvaluacion AND Activo=1;
END
GO

CREATE OR ALTER PROCEDURE dbo.DES_sp_Evaluaciones_PreviewAsignaciones
    @IdEvaluacion BIGINT,@IdOrganizacion INT
AS
BEGIN
    SET NOCOUNT ON;
    IF NOT EXISTS(SELECT 1 FROM dbo.DES_Evaluacion WHERE IdEvaluacion=@IdEvaluacion AND IdOrganizacion=@IdOrganizacion)
      THROW 52201,'No existe la evaluacion indicada.',1;
    ;WITH Base AS (
      SELECT evd.IdEmpleado IdEvaluado,evr.IdEmpleado IdEvaluador,ce.Codigo Escenario,
             mpe.IdModeloPuestoEscenario,mpe.Ponderacion,
             me.EsAnonimo
      FROM dbo.DES_Evaluacion e
      INNER JOIN dbo.DES_EvaluacionParticipante evd
        ON evd.IdEvaluacion=e.IdEvaluacion AND evd.Activo=1 AND evd.EsEvaluado=1
      INNER JOIN dbo.DES_ModeloPuesto mp
        ON mp.IdModeloPuesto=evd.IdModeloPuesto AND mp.Activo=1 AND mp.SoloEvaluador=0
      INNER JOIN dbo.DES_ModeloPuestoEscenario mpe
        ON mpe.IdModeloPuesto=mp.IdModeloPuesto AND mpe.Activo=1
      INNER JOIN dbo.DES_ModeloEscenario me
        ON me.IdModeloEscenario=mpe.IdModeloEscenario AND me.Activo=1
      INNER JOIN dbo.DES_CatEscenario ce ON ce.IdEscenario=me.IdEscenario
      INNER JOIN dbo.DES_EvaluacionParticipante evr
        ON evr.IdEvaluacion=e.IdEvaluacion AND evr.Activo=1 AND evr.EsEvaluador=1
       AND (
         (ce.Codigo=N'BOSS_TO_EMPLOYEE' AND evr.IdEmpleado=evd.IdEmpleadoJefeSnapshot)
         OR (ce.Codigo=N'EMPLOYEE_TO_BOSS' AND evr.IdEmpleadoJefeSnapshot=evd.IdEmpleado)
         OR (ce.Codigo=N'SELF' AND evr.IdEmpleado=evd.IdEmpleado)
         OR (ce.Codigo=N'PEER' AND evr.IdEmpleado<>evd.IdEmpleado
             AND evr.IdEmpleadoJefeSnapshot=evd.IdEmpleadoJefeSnapshot
             AND evd.IdEmpleadoJefeSnapshot IS NOT NULL)
       )
      WHERE e.IdEvaluacion=@IdEvaluacion
    )
    SELECT Escenario AS escenarioCodigo,COUNT(*) AS total
    FROM Base GROUP BY Escenario ORDER BY Escenario;
END
GO

CREATE OR ALTER PROCEDURE dbo.DES_sp_Evaluaciones_GenerarAsignaciones
    @IdEvaluacion BIGINT,@IdOrganizacion INT
AS
BEGIN
    SET NOCOUNT ON;
    SET XACT_ABORT ON;
    IF NOT EXISTS(SELECT 1 FROM dbo.DES_Evaluacion WHERE IdEvaluacion=@IdEvaluacion AND IdOrganizacion=@IdOrganizacion)
      THROW 52201,'No existe la evaluacion indicada.',1;
    DECLARE @Pendiente SMALLINT=(SELECT IdEstadoAsignacion FROM dbo.DES_CatEstadoAsignacion WHERE Codigo=N'PENDIENTE');
    ;WITH Base AS (
      SELECT evd.IdEmpleado IdEvaluado,evr.IdEmpleado IdEvaluador,ce.Codigo Escenario,
             mpe.IdModeloPuestoEscenario,me.EsAnonimo
      FROM dbo.DES_Evaluacion e
      INNER JOIN dbo.DES_EvaluacionParticipante evd
        ON evd.IdEvaluacion=e.IdEvaluacion AND evd.Activo=1 AND evd.EsEvaluado=1
      INNER JOIN dbo.DES_ModeloPuesto mp
        ON mp.IdModeloPuesto=evd.IdModeloPuesto AND mp.Activo=1 AND mp.SoloEvaluador=0
      INNER JOIN dbo.DES_ModeloPuestoEscenario mpe
        ON mpe.IdModeloPuesto=mp.IdModeloPuesto AND mpe.Activo=1
      INNER JOIN dbo.DES_ModeloEscenario me
        ON me.IdModeloEscenario=mpe.IdModeloEscenario AND me.Activo=1
      INNER JOIN dbo.DES_CatEscenario ce ON ce.IdEscenario=me.IdEscenario
      INNER JOIN dbo.DES_EvaluacionParticipante evr
        ON evr.IdEvaluacion=e.IdEvaluacion AND evr.Activo=1 AND evr.EsEvaluador=1
       AND (
         (ce.Codigo=N'BOSS_TO_EMPLOYEE' AND evr.IdEmpleado=evd.IdEmpleadoJefeSnapshot)
         OR (ce.Codigo=N'EMPLOYEE_TO_BOSS' AND evr.IdEmpleadoJefeSnapshot=evd.IdEmpleado)
         OR (ce.Codigo=N'SELF' AND evr.IdEmpleado=evd.IdEmpleado)
         OR (ce.Codigo=N'PEER' AND evr.IdEmpleado<>evd.IdEmpleado
             AND evr.IdEmpleadoJefeSnapshot=evd.IdEmpleadoJefeSnapshot
             AND evd.IdEmpleadoJefeSnapshot IS NOT NULL)
       )
      WHERE e.IdEvaluacion=@IdEvaluacion
    )
    INSERT dbo.DES_AsignacionEvaluacion(
      IdEvaluacion,IdModeloPuestoEscenario,IdEvaluador,IdEvaluado,
      IdEstadoAsignacion,EsAnonima,FechaLimite
    )
    SELECT @IdEvaluacion,b.IdModeloPuestoEscenario,b.IdEvaluador,b.IdEvaluado,
           @Pendiente,b.EsAnonimo,DATEADD(DAY,1,CONVERT(DATETIME2,(SELECT FechaCierre FROM dbo.DES_Evaluacion WHERE IdEvaluacion=@IdEvaluacion)))
    FROM Base b
    WHERE NOT EXISTS(
      SELECT 1 FROM dbo.DES_AsignacionEvaluacion a
      WHERE a.IdEvaluacion=@IdEvaluacion AND a.IdModeloPuestoEscenario=b.IdModeloPuestoEscenario
        AND a.IdEvaluador=b.IdEvaluador AND a.IdEvaluado=b.IdEvaluado
    );
    SELECT ce.Codigo AS escenarioCodigo,COUNT(*) AS total
    FROM dbo.DES_AsignacionEvaluacion a
    INNER JOIN dbo.DES_ModeloPuestoEscenario mpe ON mpe.IdModeloPuestoEscenario=a.IdModeloPuestoEscenario
    INNER JOIN dbo.DES_ModeloEscenario me ON me.IdModeloEscenario=mpe.IdModeloEscenario
    INNER JOIN dbo.DES_CatEscenario ce ON ce.IdEscenario=me.IdEscenario
    WHERE a.IdEvaluacion=@IdEvaluacion AND a.Activo=1
    GROUP BY ce.Codigo ORDER BY ce.Codigo;
END
GO

CREATE OR ALTER PROCEDURE dbo.DES_sp_Asignaciones_Listar
    @IdEvaluacion BIGINT,@IdOrganizacion INT,@IdEvaluador INT=NULL,@IdEvaluado INT=NULL,
    @EscenarioCodigo NVARCHAR(40)=NULL,@EstadoCodigo NVARCHAR(30)=NULL,
    @CanalCodigo NVARCHAR(30)=NULL,@Buscar NVARCHAR(200)=NULL,@Pagina INT=1,@Limite INT=50
AS
BEGIN
    SET NOCOUNT ON;
    SET @Pagina=CASE WHEN @Pagina<1 THEN 1 ELSE @Pagina END;
    SET @Limite=CASE WHEN @Limite<1 THEN 50 WHEN @Limite>200 THEN 200 ELSE @Limite END;
    ;WITH D AS (
      SELECT a.IdAsignacion AS id,a.IdEvaluador AS evaluadorId,
        CONCAT(ISNULL(er.Nombres,N''),N' ',ISNULL(er.Apellidos,N'')) AS evaluador,
        a.IdEvaluado AS evaluadoId,
        CONCAT(ISNULL(ed.Nombres,N''),N' ',ISNULL(ed.Apellidos,N'')) AS evaluado,
        ce.Codigo AS escenarioCodigo,ce.Nombre AS escenario,
        ea.Codigo AS estadoCodigo,ea.Nombre AS estado,
        ca.Codigo AS canalCodigo,a.TokenAcceso AS tokenAcceso,a.EsAnonima AS esAnonima,
        a.FechaPrimerEnvio AS fechaPrimerEnvio,a.FechaUltimoEnvio AS fechaUltimoEnvio,
        a.FechaRespuesta AS fechaRespuesta
      FROM dbo.DES_AsignacionEvaluacion a
      INNER JOIN dbo.DES_Evaluacion e ON e.IdEvaluacion=a.IdEvaluacion AND e.IdOrganizacion=@IdOrganizacion
      INNER JOIN dbo.Empleados er ON er.Id=a.IdEvaluador
      INNER JOIN dbo.Empleados ed ON ed.Id=a.IdEvaluado
      INNER JOIN dbo.DES_ModeloPuestoEscenario mpe ON mpe.IdModeloPuestoEscenario=a.IdModeloPuestoEscenario
      INNER JOIN dbo.DES_ModeloEscenario me ON me.IdModeloEscenario=mpe.IdModeloEscenario
      INNER JOIN dbo.DES_CatEscenario ce ON ce.IdEscenario=me.IdEscenario
      INNER JOIN dbo.DES_CatEstadoAsignacion ea ON ea.IdEstadoAsignacion=a.IdEstadoAsignacion
      LEFT JOIN dbo.DES_CatCanalEnvio ca ON ca.IdCanalEnvio=a.IdCanalEnvio
      WHERE a.IdEvaluacion=@IdEvaluacion
        AND (@IdEvaluador IS NULL OR a.IdEvaluador=@IdEvaluador)
        AND (@IdEvaluado IS NULL OR a.IdEvaluado=@IdEvaluado)
        AND (@EscenarioCodigo IS NULL OR ce.Codigo=UPPER(@EscenarioCodigo))
        AND (@EstadoCodigo IS NULL OR ea.Codigo=UPPER(@EstadoCodigo))
        AND (@CanalCodigo IS NULL OR ca.Codigo=UPPER(@CanalCodigo))
        AND (@Buscar IS NULL OR er.Nombres LIKE N'%'+@Buscar+N'%'
             OR er.Apellidos LIKE N'%'+@Buscar+N'%'
             OR ed.Nombres LIKE N'%'+@Buscar+N'%' OR ed.Apellidos LIKE N'%'+@Buscar+N'%')
    )
    SELECT * FROM D ORDER BY evaluado,evaluador,id
    OFFSET (@Pagina-1)*@Limite ROWS FETCH NEXT @Limite ROWS ONLY;
    DECLARE @Total INT=(SELECT COUNT(*) FROM dbo.DES_AsignacionEvaluacion a
      INNER JOIN dbo.DES_Evaluacion e ON e.IdEvaluacion=a.IdEvaluacion AND e.IdOrganizacion=@IdOrganizacion
      INNER JOIN dbo.Empleados er ON er.Id=a.IdEvaluador
      INNER JOIN dbo.Empleados ed ON ed.Id=a.IdEvaluado
      INNER JOIN dbo.DES_ModeloPuestoEscenario mpe ON mpe.IdModeloPuestoEscenario=a.IdModeloPuestoEscenario
      INNER JOIN dbo.DES_ModeloEscenario me ON me.IdModeloEscenario=mpe.IdModeloEscenario
      INNER JOIN dbo.DES_CatEscenario ce ON ce.IdEscenario=me.IdEscenario
      INNER JOIN dbo.DES_CatEstadoAsignacion ea ON ea.IdEstadoAsignacion=a.IdEstadoAsignacion
      LEFT JOIN dbo.DES_CatCanalEnvio ca ON ca.IdCanalEnvio=a.IdCanalEnvio
      WHERE a.IdEvaluacion=@IdEvaluacion
        AND (@IdEvaluador IS NULL OR a.IdEvaluador=@IdEvaluador)
        AND (@IdEvaluado IS NULL OR a.IdEvaluado=@IdEvaluado)
        AND (@EscenarioCodigo IS NULL OR ce.Codigo=UPPER(@EscenarioCodigo))
        AND (@EstadoCodigo IS NULL OR ea.Codigo=UPPER(@EstadoCodigo))
        AND (@CanalCodigo IS NULL OR ca.Codigo=UPPER(@CanalCodigo))
        AND (@Buscar IS NULL OR er.Nombres LIKE N'%'+@Buscar+N'%'
             OR er.Apellidos LIKE N'%'+@Buscar+N'%'
             OR ed.Nombres LIKE N'%'+@Buscar+N'%' OR ed.Apellidos LIKE N'%'+@Buscar+N'%'));
    SELECT @Pagina Pagina,@Limite Limite,@Total TotalRegistros,
      CEILING(CONVERT(DECIMAL(18,4),@Total)/@Limite) TotalPaginas;
END
GO

CREATE OR ALTER PROCEDURE dbo.DES_sp_Evaluaciones_RegistrarEnvios
    @IdEvaluacion BIGINT,@IdOrganizacion INT,@AsignacionesJson NVARCHAR(MAX),
    @CanalCodigo NVARCHAR(30),@SoloReenvio BIT=0
AS
BEGIN
    SET NOCOUNT ON;
    DECLARE @Canal SMALLINT=(SELECT IdCanalEnvio FROM dbo.DES_CatCanalEnvio
                             WHERE Codigo=UPPER(@CanalCodigo) AND Activo=1);
    IF @Canal IS NULL THROW 52205,'El canal no existe.',1;
    DECLARE @Ids TABLE(id BIGINT PRIMARY KEY);
    INSERT @Ids
    SELECT DISTINCT TRY_CONVERT(BIGINT,[value])
    FROM OPENJSON(@AsignacionesJson)
    WHERE TRY_CONVERT(BIGINT,[value]) IS NOT NULL;
    DECLARE @Nuevos TABLE(idEnvio BIGINT,idAsignacion BIGINT);
    INSERT dbo.DES_EnvioEvaluacion(IdAsignacion,IdCanalEnvio,Destino,Estado,Intento)
    OUTPUT inserted.IdEnvio,inserted.IdAsignacion INTO @Nuevos
    SELECT a.IdAsignacion,@Canal,p.EmailSnapshot,N'PENDIENTE',
      ISNULL((SELECT MAX(en.Intento)+1 FROM dbo.DES_EnvioEvaluacion en WHERE en.IdAsignacion=a.IdAsignacion),1)
    FROM @Ids i
    INNER JOIN dbo.DES_AsignacionEvaluacion a ON a.IdAsignacion=i.id AND a.IdEvaluacion=@IdEvaluacion
    INNER JOIN dbo.DES_Evaluacion e ON e.IdEvaluacion=a.IdEvaluacion AND e.IdOrganizacion=@IdOrganizacion
    INNER JOIN dbo.DES_EvaluacionParticipante p
      ON p.IdEvaluacion=a.IdEvaluacion AND p.IdEmpleado=a.IdEvaluador
    INNER JOIN dbo.DES_CatEstadoAsignacion ea ON ea.IdEstadoAsignacion=a.IdEstadoAsignacion
    WHERE p.EmailSnapshot IS NOT NULL
      AND ea.Codigo NOT IN(N'RESPONDIDA',N'ANULADA')
      AND (@SoloReenvio=0 OR EXISTS(SELECT 1 FROM dbo.DES_EnvioEvaluacion x
                                    WHERE x.IdAsignacion=a.IdAsignacion AND x.Estado IN(N'ERROR',N'PENDIENTE')));
    UPDATE a SET IdCanalEnvio=@Canal,FechaPrimerEnvio=ISNULL(FechaPrimerEnvio,SYSDATETIME()),
      FechaUltimoEnvio=SYSDATETIME()
    FROM dbo.DES_AsignacionEvaluacion a
    INNER JOIN @Nuevos n ON n.idAsignacion=a.IdAsignacion;
    SELECT en.IdEnvio AS id,en.IdAsignacion AS asignacionId,en.Destino AS destino,
      en.Estado AS estado,en.Intento AS intento
    FROM dbo.DES_EnvioEvaluacion en
    INNER JOIN @Nuevos n ON n.idEnvio=en.IdEnvio
    ORDER BY en.IdEnvio;
END
GO

CREATE OR ALTER PROCEDURE dbo.DES_sp_Evaluaciones_CambiarEstado
    @IdEvaluacion BIGINT,@IdOrganizacion INT,@EstadoCodigo NVARCHAR(30),
    @Usuario NVARCHAR(100)=NULL
AS
BEGIN
    SET NOCOUNT ON;
    DECLARE @Actual NVARCHAR(30),@Nuevo SMALLINT;
    SELECT @Actual=ce.Codigo FROM dbo.DES_Evaluacion e
      INNER JOIN dbo.DES_CatEstadoEvaluacion ce ON ce.IdEstadoEvaluacion=e.IdEstadoEvaluacion
      WHERE e.IdEvaluacion=@IdEvaluacion AND e.IdOrganizacion=@IdOrganizacion;
    SELECT @Nuevo=IdEstadoEvaluacion FROM dbo.DES_CatEstadoEvaluacion
      WHERE Codigo=UPPER(@EstadoCodigo) AND Activo=1;
    IF @Actual IS NULL THROW 52201,'No existe la evaluacion indicada.',1;
    IF @Nuevo IS NULL OR NOT (
      (@Actual=N'BORRADOR' AND UPPER(@EstadoCodigo) IN(N'PROGRAMADA',N'CANCELADA'))
      OR (@Actual=N'PROGRAMADA' AND UPPER(@EstadoCodigo) IN(N'EN_CURSO',N'CANCELADA'))
      OR (@Actual=N'EN_CURSO' AND UPPER(@EstadoCodigo)=N'CERRADA')
    ) THROW 52204,'La transicion de estado no esta permitida.',1;
    UPDATE dbo.DES_Evaluacion SET IdEstadoEvaluacion=@Nuevo,FechaModificacion=SYSDATETIME(),
      FechaCierreReal=CASE WHEN UPPER(@EstadoCodigo)=N'CERRADA' THEN SYSDATETIME() ELSE FechaCierreReal END,
      UsuarioModificacion=@Usuario
    WHERE IdEvaluacion=@IdEvaluacion;
    SELECT @IdEvaluacion AS id,@EstadoCodigo AS estadoCodigo;
END
GO

CREATE OR ALTER PROCEDURE dbo.DES_sp_Evaluaciones_Participantes_Listar
    @IdEvaluacion BIGINT,@IdOrganizacion INT
AS
BEGIN
    SET NOCOUNT ON;
    SELECT p.IdEvaluacionParticipante AS id,p.IdEmpleado AS empleadoId,
      CONCAT(ISNULL(e.Nombres,N''),N' ',ISNULL(e.Apellidos,N'')) AS nombreCompleto,
      p.IdPuestoSnapshot AS puestoId,pu.Nombre AS puesto,p.CargoSnapshot AS cargo,
      p.EmailSnapshot AS email,p.IdEmpleadoJefeSnapshot AS jefeId,
      p.EsEvaluador AS esEvaluador,p.EsEvaluado AS esEvaluado,p.Activo AS activo
    FROM dbo.DES_EvaluacionParticipante p
    INNER JOIN dbo.DES_Evaluacion ev ON ev.IdEvaluacion=p.IdEvaluacion AND ev.IdOrganizacion=@IdOrganizacion
    INNER JOIN dbo.Empleados e ON e.Id=p.IdEmpleado
    LEFT JOIN dbo.DES_Puesto pu ON pu.IdPuesto=p.IdPuestoSnapshot
    WHERE p.IdEvaluacion=@IdEvaluacion
    ORDER BY e.Nombres,e.Apellidos,e.Id;
END
GO

CREATE OR ALTER PROCEDURE dbo.DES_sp_Evaluaciones_Envios_Listar
    @IdEvaluacion BIGINT,@IdOrganizacion INT
AS
BEGIN
    SET NOCOUNT ON;
    SELECT en.IdEnvio AS id,en.IdAsignacion AS asignacionId,ca.Codigo AS canalCodigo,
      en.Destino AS destino,en.Estado AS estado,en.IdExterno AS idExterno,
      en.Intento AS intento,en.FechaSolicitud AS fechaSolicitud,en.FechaEnvio AS fechaEnvio,
      en.MensajeError AS mensajeError
    FROM dbo.DES_EnvioEvaluacion en
    INNER JOIN dbo.DES_AsignacionEvaluacion a ON a.IdAsignacion=en.IdAsignacion
    INNER JOIN dbo.DES_Evaluacion e ON e.IdEvaluacion=a.IdEvaluacion AND e.IdOrganizacion=@IdOrganizacion
    INNER JOIN dbo.DES_CatCanalEnvio ca ON ca.IdCanalEnvio=en.IdCanalEnvio
    WHERE a.IdEvaluacion=@IdEvaluacion
    ORDER BY en.FechaSolicitud DESC,en.IdEnvio DESC;
END
GO

CREATE OR ALTER PROCEDURE dbo.DES_sp_Respuestas_ObtenerPorToken
    @TokenAcceso UNIQUEIDENTIFIER
AS
BEGIN
    SET NOCOUNT ON;
    IF NOT EXISTS(SELECT 1 FROM dbo.DES_AsignacionEvaluacion WHERE TokenAcceso=@TokenAcceso AND Activo=1)
      THROW 52301,'El token no existe o ya no esta disponible.',1;
    UPDATE dbo.DES_AsignacionEvaluacion
      SET FechaInicioRespuesta=ISNULL(FechaInicioRespuesta,SYSDATETIME())
      WHERE TokenAcceso=@TokenAcceso;
    DECLARE @DataJson NVARCHAR(MAX);
    SELECT @DataJson=(
      SELECT ev.IdEvaluacion AS evaluacionId,ev.Nombre AS evaluacion,
        ev.FechaInicio AS fechaInicio,ev.FechaCierre AS fechaCierre,
        a.IdAsignacion AS asignacionId,a.TokenAcceso AS tokenAcceso,
        CONCAT(ISNULL(er.Nombres,N''),N' ',ISNULL(er.Apellidos,N'')) AS evaluador,
        CONCAT(ISNULL(ed.Nombres,N''),N' ',ISNULL(ed.Apellidos,N'')) AS evaluado,
        ce.Codigo AS escenarioCodigo,ce.Nombre AS escenario,a.EsAnonima AS esAnonima,
        cr.Codigo AS estadoRespuesta,
        JSON_QUERY((
          SELECT d.IdModeloDimension AS id,d.Codigo AS codigo,d.Nombre AS nombre,
            d.Descripcion AS descripcion,d.Ponderacion AS ponderacion,d.Orden AS orden,
            JSON_QUERY((
              SELECT c.IdCriterioEvaluacion AS id,c.Codigo AS codigo,c.Nombre AS nombre,
                c.Descripcion AS descripcion,c.Ponderacion AS ponderacion,
                c.NivelExigencia AS nivelExigencia,c.Orden AS orden,
                JSON_QUERY((
                  SELECT i.IdItemEvaluativo AS id,i.Codigo AS codigo,i.Texto AS texto,
                    ti.Codigo AS tipoItemCodigo,ti.UsaEscala AS usaEscala,
                    ti.PermiteTexto AS permiteTexto,
                    ti.PermiteSeleccionMultiple AS permiteSeleccionMultiple,
                    COALESCE(i.IdEscala,c.IdEscalaPredeterminada,m.IdEscalaPredeterminada) AS escalaId,
                    i.Requerido AS requerido,i.PermiteNoAplica AS permiteNoAplica,i.Orden AS orden,
                    rd.IdEscalaValor AS escalaValorId,rd.ValorNumero AS valorNumero,
                    rd.ValorTexto AS valorTexto,rd.NoAplica AS noAplica,
                    JSON_QUERY((SELECT ro.IdEscalaValor AS id FROM dbo.DES_RespuestaDetalleOpcion ro
                      WHERE ro.IdRespuestaDetalle=rd.IdRespuestaDetalle ORDER BY ro.IdEscalaValor FOR JSON PATH)) AS opcionIds,
                    JSON_QUERY((SELECT sv.IdEscalaValor AS id,sv.Valor AS valor,sv.Etiqueta AS etiqueta,
                      sv.Orden AS orden FROM dbo.DES_EscalaValor sv
                      WHERE sv.IdEscala=COALESCE(i.IdEscala,c.IdEscalaPredeterminada,m.IdEscalaPredeterminada)
                        AND sv.Activo=1 ORDER BY sv.Orden,sv.IdEscalaValor FOR JSON PATH)) AS valoresEscala
                  FROM dbo.DES_ItemEvaluativo i
                  INNER JOIN dbo.DES_CatTipoItem ti ON ti.IdTipoItem=i.IdTipoItem
                  LEFT JOIN dbo.DES_RespuestaEvaluacion r ON r.IdAsignacion=a.IdAsignacion
                  LEFT JOIN dbo.DES_RespuestaDetalle rd ON rd.IdRespuesta=r.IdRespuesta
                    AND rd.IdItemEvaluativo=i.IdItemEvaluativo
                  WHERE i.IdCriterioEvaluacion=c.IdCriterioEvaluacion AND i.Activo=1
                  ORDER BY i.Orden,i.IdItemEvaluativo FOR JSON PATH
                )) AS items
              FROM dbo.DES_CriterioEvaluacion c
              WHERE c.IdModeloPuestoEscenario=a.IdModeloPuestoEscenario
                AND c.IdModeloDimension=d.IdModeloDimension AND c.Activo=1
              ORDER BY c.Orden,c.IdCriterioEvaluacion FOR JSON PATH
            )) AS criterios
          FROM dbo.DES_ModeloDimension d
          WHERE d.IdModelo=m.IdModelo AND d.Activo=1
            AND EXISTS(SELECT 1 FROM dbo.DES_CriterioEvaluacion c
              WHERE c.IdModeloPuestoEscenario=a.IdModeloPuestoEscenario
                AND c.IdModeloDimension=d.IdModeloDimension AND c.Activo=1)
          ORDER BY d.Orden,d.IdModeloDimension FOR JSON PATH
        )) AS dimensiones
      FROM dbo.DES_AsignacionEvaluacion a
      INNER JOIN dbo.DES_Evaluacion ev ON ev.IdEvaluacion=a.IdEvaluacion
      INNER JOIN dbo.DES_Modelo m ON m.IdModelo=ev.IdModelo
      INNER JOIN dbo.Empleados er ON er.Id=a.IdEvaluador
      INNER JOIN dbo.Empleados ed ON ed.Id=a.IdEvaluado
      INNER JOIN dbo.DES_ModeloPuestoEscenario mpe ON mpe.IdModeloPuestoEscenario=a.IdModeloPuestoEscenario
      INNER JOIN dbo.DES_ModeloEscenario me ON me.IdModeloEscenario=mpe.IdModeloEscenario
      INNER JOIN dbo.DES_CatEscenario ce ON ce.IdEscenario=me.IdEscenario
      LEFT JOIN dbo.DES_RespuestaEvaluacion r ON r.IdAsignacion=a.IdAsignacion
      LEFT JOIN dbo.DES_CatEstadoRespuesta cr ON cr.IdEstadoRespuesta=r.IdEstadoRespuesta
      WHERE a.TokenAcceso=@TokenAcceso
      FOR JSON PATH,WITHOUT_ARRAY_WRAPPER
    );
    SELECT @DataJson DataJson;
END
GO

CREATE OR ALTER PROCEDURE dbo.DES_sp_Respuestas_GuardarBorrador
    @TokenAcceso UNIQUEIDENTIFIER,@RespuestasJson NVARCHAR(MAX),@EmitirResultado BIT=1
AS
BEGIN
    SET NOCOUNT ON;
    SET XACT_ABORT ON;
    IF ISJSON(@RespuestasJson)<>1 THROW 52303,'Las respuestas no tienen formato valido.',1;
    DECLARE @Asignacion BIGINT,@MPE INT,@Respuesta BIGINT;
    SELECT @Asignacion=IdAsignacion,@MPE=IdModeloPuestoEscenario
    FROM dbo.DES_AsignacionEvaluacion WHERE TokenAcceso=@TokenAcceso AND Activo=1;
    IF @Asignacion IS NULL THROW 52301,'El token no existe.',1;
    IF EXISTS(SELECT 1 FROM dbo.DES_RespuestaEvaluacion r
      INNER JOIN dbo.DES_CatEstadoRespuesta e ON e.IdEstadoRespuesta=r.IdEstadoRespuesta
      WHERE r.IdAsignacion=@Asignacion AND e.EsFinal=1)
      THROW 52302,'La respuesta ya fue finalizada.',1;

    DECLARE @R TABLE(itemId INT,escalaValorId INT NULL,valorNumero DECIMAL(18,4) NULL,
      valorTexto NVARCHAR(MAX) NULL,noAplica BIT,opciones NVARCHAR(MAX));
    INSERT @R SELECT itemId,escalaValorId,valorNumero,valorTexto,noAplica,opciones
    FROM OPENJSON(@RespuestasJson) WITH(
      itemId INT '$.itemId',escalaValorId INT '$.escalaValorId',
      valorNumero DECIMAL(18,4) '$.valorNumero',valorTexto NVARCHAR(MAX) '$.valorTexto',
      noAplica BIT '$.noAplica',opciones NVARCHAR(MAX) '$.opcionIds' AS JSON
    );
    IF EXISTS(SELECT 1 FROM @R r LEFT JOIN dbo.DES_ItemEvaluativo i
      ON i.IdItemEvaluativo=r.itemId AND i.Activo=1
      LEFT JOIN dbo.DES_CriterioEvaluacion c ON c.IdCriterioEvaluacion=i.IdCriterioEvaluacion
      WHERE i.IdItemEvaluativo IS NULL OR c.IdModeloPuestoEscenario<>@MPE)
      THROW 52303,'Existe una respuesta para un item no permitido.',1;
    IF EXISTS(SELECT 1 FROM @R r
      INNER JOIN dbo.DES_ItemEvaluativo i ON i.IdItemEvaluativo=r.itemId
      INNER JOIN dbo.DES_CriterioEvaluacion c ON c.IdCriterioEvaluacion=i.IdCriterioEvaluacion
      INNER JOIN dbo.DES_ModeloPuestoEscenario mpe ON mpe.IdModeloPuestoEscenario=c.IdModeloPuestoEscenario
      INNER JOIN dbo.DES_ModeloPuesto mp ON mp.IdModeloPuesto=mpe.IdModeloPuesto
      INNER JOIN dbo.DES_Modelo m ON m.IdModelo=mp.IdModelo
      LEFT JOIN dbo.DES_EscalaValor sv ON sv.IdEscalaValor=r.escalaValorId
        AND sv.IdEscala=COALESCE(i.IdEscala,c.IdEscalaPredeterminada,m.IdEscalaPredeterminada)
        AND sv.Activo=1
      WHERE r.escalaValorId IS NOT NULL AND sv.IdEscalaValor IS NULL)
      THROW 52303,'Existe un valor que no pertenece a la escala efectiva.',1;
    IF EXISTS(SELECT 1 FROM @R r
      INNER JOIN dbo.DES_ItemEvaluativo i ON i.IdItemEvaluativo=r.itemId
      WHERE r.noAplica=1 AND i.PermiteNoAplica=0)
      THROW 52303,'Existe un item que no permite la opcion no aplica.',1;
    IF EXISTS(
      SELECT 1
      FROM @R r
      CROSS APPLY OPENJSON(ISNULL(r.opciones,N'[]')) j
      INNER JOIN dbo.DES_ItemEvaluativo i ON i.IdItemEvaluativo=r.itemId
      INNER JOIN dbo.DES_CriterioEvaluacion c ON c.IdCriterioEvaluacion=i.IdCriterioEvaluacion
      INNER JOIN dbo.DES_ModeloPuestoEscenario mpe
        ON mpe.IdModeloPuestoEscenario=c.IdModeloPuestoEscenario
      INNER JOIN dbo.DES_ModeloPuesto mp ON mp.IdModeloPuesto=mpe.IdModeloPuesto
      INNER JOIN dbo.DES_Modelo m ON m.IdModelo=mp.IdModelo
      LEFT JOIN dbo.DES_EscalaValor sv
        ON sv.IdEscalaValor=TRY_CONVERT(INT,j.[value])
       AND sv.IdEscala=COALESCE(i.IdEscala,c.IdEscalaPredeterminada,m.IdEscalaPredeterminada)
       AND sv.Activo=1
      WHERE sv.IdEscalaValor IS NULL
    ) THROW 52303,'Existe una opcion que no pertenece a la escala efectiva.',1;

    DECLARE @FechaOperacion DATETIME2(0)=SYSDATETIME();
    DECLARE @Borrador SMALLINT=(SELECT IdEstadoRespuesta FROM dbo.DES_CatEstadoRespuesta WHERE Codigo=N'BORRADOR');
    SELECT @Respuesta=IdRespuesta FROM dbo.DES_RespuestaEvaluacion WHERE IdAsignacion=@Asignacion;
    IF @Respuesta IS NULL
    BEGIN
      INSERT dbo.DES_RespuestaEvaluacion(IdAsignacion,IdEstadoRespuesta) VALUES(@Asignacion,@Borrador);
      SET @Respuesta=SCOPE_IDENTITY();
    END
    ELSE UPDATE dbo.DES_RespuestaEvaluacion SET FechaModificacion=@FechaOperacion WHERE IdRespuesta=@Respuesta;

    MERGE dbo.DES_RespuestaDetalle T
    USING @R S ON T.IdRespuesta=@Respuesta AND T.IdItemEvaluativo=S.itemId
    WHEN MATCHED THEN UPDATE SET IdEscalaValor=S.escalaValorId,ValorNumero=S.valorNumero,
      ValorTexto=S.valorTexto,NoAplica=ISNULL(S.noAplica,0),FechaRespuesta=SYSDATETIME()
    WHEN NOT MATCHED THEN INSERT(IdRespuesta,IdItemEvaluativo,IdEscalaValor,ValorNumero,ValorTexto,NoAplica)
      VALUES(@Respuesta,S.itemId,S.escalaValorId,S.valorNumero,S.valorTexto,ISNULL(S.noAplica,0));
    DELETE o FROM dbo.DES_RespuestaDetalleOpcion o
      INNER JOIN dbo.DES_RespuestaDetalle d ON d.IdRespuestaDetalle=o.IdRespuestaDetalle
      INNER JOIN @R r ON r.itemId=d.IdItemEvaluativo WHERE d.IdRespuesta=@Respuesta;
    INSERT dbo.DES_RespuestaDetalleOpcion(IdRespuestaDetalle,IdEscalaValor)
    SELECT DISTINCT d.IdRespuestaDetalle,sv.IdEscalaValor
    FROM @R r INNER JOIN dbo.DES_RespuestaDetalle d
      ON d.IdRespuesta=@Respuesta AND d.IdItemEvaluativo=r.itemId
    CROSS APPLY OPENJSON(ISNULL(r.opciones,N'[]')) j
    INNER JOIN dbo.DES_ItemEvaluativo i ON i.IdItemEvaluativo=r.itemId
    INNER JOIN dbo.DES_CriterioEvaluacion c ON c.IdCriterioEvaluacion=i.IdCriterioEvaluacion
    INNER JOIN dbo.DES_ModeloPuestoEscenario mpe
      ON mpe.IdModeloPuestoEscenario=c.IdModeloPuestoEscenario
    INNER JOIN dbo.DES_ModeloPuesto mp ON mp.IdModeloPuesto=mpe.IdModeloPuesto
    INNER JOIN dbo.DES_Modelo m ON m.IdModelo=mp.IdModelo
    INNER JOIN dbo.DES_EscalaValor sv
      ON sv.IdEscalaValor=TRY_CONVERT(INT,j.[value])
     AND sv.IdEscala=COALESCE(i.IdEscala,c.IdEscalaPredeterminada,m.IdEscalaPredeterminada)
     AND sv.Activo=1;
    UPDATE dbo.DES_AsignacionEvaluacion SET FechaInicioRespuesta=ISNULL(FechaInicioRespuesta,@FechaOperacion)
      WHERE IdAsignacion=@Asignacion;

    UPDATE en
    SET Estado = CASE
          WHEN en.Estado IN (N'CREADO', N'ENVIADO') THEN N'INICIADO'
          ELSE en.Estado
        END,
        FechaInicio = COALESCE(en.FechaInicio, a.FechaInicioRespuesta, @FechaOperacion),
        FechaModificacion = @FechaOperacion
    FROM dbo.DES_EnvioEncuestaEmpleado en
    INNER JOIN dbo.DES_AsignacionEvaluacion a
      ON a.IdAsignacion=@Asignacion
     AND a.IdEvaluador=en.IdEmpleado
     AND a.IdEvaluado=en.IdEmpleadoEnviar
    INNER JOIN dbo.DES_Evaluacion ev
      ON ev.IdEvaluacion=a.IdEvaluacion
     AND ev.IdOrganizacion=en.IdOrganizacion
     AND ev.IdModelo=en.IdModelo
    WHERE en.Activo=1
      AND en.Estado IN (N'CREADO', N'ENVIADO', N'INICIADO');

    IF @EmitirResultado=1 SELECT @Respuesta AS idRespuesta,CAST(0 AS BIT) AS finalizada;
END
GO

CREATE OR ALTER PROCEDURE dbo.DES_sp_Respuestas_Finalizar
    @TokenAcceso UNIQUEIDENTIFIER,@RespuestasJson NVARCHAR(MAX)
AS
BEGIN
    SET NOCOUNT ON;
    SET XACT_ABORT ON;
    EXEC dbo.DES_sp_Respuestas_GuardarBorrador @TokenAcceso,@RespuestasJson,0;
    DECLARE @Asignacion BIGINT,@MPE INT,@Respuesta BIGINT;
    SELECT @Asignacion=IdAsignacion,@MPE=IdModeloPuestoEscenario
      FROM dbo.DES_AsignacionEvaluacion WHERE TokenAcceso=@TokenAcceso;
    SELECT @Respuesta=IdRespuesta FROM dbo.DES_RespuestaEvaluacion WHERE IdAsignacion=@Asignacion;
    IF EXISTS(
      SELECT 1 FROM dbo.DES_ItemEvaluativo i
      INNER JOIN dbo.DES_CriterioEvaluacion c ON c.IdCriterioEvaluacion=i.IdCriterioEvaluacion
      LEFT JOIN dbo.DES_RespuestaDetalle d ON d.IdRespuesta=@Respuesta AND d.IdItemEvaluativo=i.IdItemEvaluativo
      WHERE c.IdModeloPuestoEscenario=@MPE AND c.Activo=1 AND i.Activo=1 AND i.Requerido=1
        AND (d.IdRespuestaDetalle IS NULL OR
             (d.NoAplica=0 AND d.IdEscalaValor IS NULL AND d.ValorNumero IS NULL
              AND NULLIF(LTRIM(RTRIM(d.ValorTexto)),N'') IS NULL
              AND NOT EXISTS(SELECT 1 FROM dbo.DES_RespuestaDetalleOpcion o
                             WHERE o.IdRespuestaDetalle=d.IdRespuestaDetalle)))
    ) THROW 52303,'Faltan respuestas obligatorias.',1;
    DECLARE @FechaFinalizacion DATETIME2(0)=SYSDATETIME();
    DECLARE @Final SMALLINT=(SELECT IdEstadoRespuesta FROM dbo.DES_CatEstadoRespuesta WHERE Codigo=N'FINALIZADA');
    DECLARE @Respondida SMALLINT=(SELECT IdEstadoAsignacion FROM dbo.DES_CatEstadoAsignacion WHERE Codigo=N'RESPONDIDA');
    UPDATE dbo.DES_RespuestaEvaluacion SET IdEstadoRespuesta=@Final,
      FechaModificacion=@FechaFinalizacion,FechaFinalizacion=@FechaFinalizacion WHERE IdRespuesta=@Respuesta;
    UPDATE dbo.DES_AsignacionEvaluacion SET IdEstadoAsignacion=@Respondida,
      FechaRespuesta=@FechaFinalizacion WHERE IdAsignacion=@Asignacion;

    UPDATE en
    SET Estado = N'CONTESTADO',
        FechaInicio = COALESCE(en.FechaInicio, a.FechaInicioRespuesta, @FechaFinalizacion),
        FechaFinalizacion = @FechaFinalizacion,
        FechaModificacion = @FechaFinalizacion
    FROM dbo.DES_EnvioEncuestaEmpleado en
    INNER JOIN dbo.DES_AsignacionEvaluacion a
      ON a.IdAsignacion=@Asignacion
     AND a.IdEvaluador=en.IdEmpleado
     AND a.IdEvaluado=en.IdEmpleadoEnviar
    INNER JOIN dbo.DES_Evaluacion ev
      ON ev.IdEvaluacion=a.IdEvaluacion
     AND ev.IdOrganizacion=en.IdOrganizacion
     AND ev.IdModelo=en.IdModelo
    WHERE en.Activo=1
      AND en.Estado<>N'ANULADO';

    SELECT @Respuesta AS idRespuesta,CAST(1 AS BIT) AS finalizada;
END
GO

CREATE OR ALTER PROCEDURE dbo.DES_sp_Resultados_ObtenerEvaluacion
    @IdEvaluacion BIGINT,@IdOrganizacion INT
AS
BEGIN
    SET NOCOUNT ON;
    IF NOT EXISTS(SELECT 1 FROM dbo.DES_Evaluacion WHERE IdEvaluacion=@IdEvaluacion AND IdOrganizacion=@IdOrganizacion)
      THROW 52201,'No existe la evaluacion indicada.',1;
    DECLARE @DataJson NVARCHAR(MAX);
    SELECT @DataJson=(
      SELECT e.IdEvaluacion AS evaluacionId,e.Nombre AS evaluacion,
        ISNULL(ps.totalParticipantes,0) AS totalParticipantes,
        ISNULL(ast.totalAsignaciones,0) AS totalAsignaciones,
        ISNULL(ast.respondidas,0) AS respondidas,
        CAST(CASE WHEN ISNULL(ast.totalAsignaciones,0)=0 THEN 0
          ELSE 100.0*ast.respondidas/ast.totalAsignaciones
          END AS DECIMAL(6,2)) AS porcentajeAvance
      FROM dbo.DES_Evaluacion e
      OUTER APPLY (
        SELECT COUNT(DISTINCT p.IdEmpleado) AS totalParticipantes
        FROM dbo.DES_EvaluacionParticipante p
        WHERE p.IdEvaluacion=e.IdEvaluacion AND p.Activo=1
      ) ps
      OUTER APPLY (
        SELECT COUNT(*) AS totalAsignaciones,
               SUM(CASE WHEN ce.Codigo=N'RESPONDIDA' THEN 1 ELSE 0 END) AS respondidas
        FROM dbo.DES_AsignacionEvaluacion a
        INNER JOIN dbo.DES_CatEstadoAsignacion ce
          ON ce.IdEstadoAsignacion=a.IdEstadoAsignacion
        WHERE a.IdEvaluacion=e.IdEvaluacion AND a.Activo=1
      ) ast
      WHERE e.IdEvaluacion=@IdEvaluacion
      FOR JSON PATH,WITHOUT_ARRAY_WRAPPER
    );
    SELECT @DataJson DataJson;
END
GO

CREATE OR ALTER PROCEDURE dbo.DES_sp_Resultados_ObtenerEmpleado
    @IdEvaluacion BIGINT,@IdEmpleado INT,@IdOrganizacion INT
AS
BEGIN
    SET NOCOUNT ON;
    IF NOT EXISTS(SELECT 1 FROM dbo.DES_Evaluacion WHERE IdEvaluacion=@IdEvaluacion AND IdOrganizacion=@IdOrganizacion)
      THROW 52201,'No existe la evaluacion indicada.',1;
    ;WITH Puntajes AS (
      SELECT a.IdEvaluado,i.IdItemEvaluativo,c.IdCriterioEvaluacion,d.IdModeloDimension,
        ce.IdEscenario,ce.Codigo EscenarioCodigo,me.Ponderacion PonderacionEscenario,
        d.Ponderacion PonderacionDimension,c.Ponderacion PonderacionCriterio,
        c.NivelExigencia,CONVERT(DECIMAL(18,4),sv.Valor) Valor
      FROM dbo.DES_AsignacionEvaluacion a
      INNER JOIN dbo.DES_CatEstadoAsignacion ea ON ea.IdEstadoAsignacion=a.IdEstadoAsignacion AND ea.Codigo=N'RESPONDIDA'
      INNER JOIN dbo.DES_RespuestaEvaluacion r ON r.IdAsignacion=a.IdAsignacion
      INNER JOIN dbo.DES_RespuestaDetalle rd ON rd.IdRespuesta=r.IdRespuesta AND rd.NoAplica=0
      INNER JOIN dbo.DES_EscalaValor sv ON sv.IdEscalaValor=rd.IdEscalaValor
      INNER JOIN dbo.DES_ItemEvaluativo i ON i.IdItemEvaluativo=rd.IdItemEvaluativo
      INNER JOIN dbo.DES_CatTipoItem ti ON ti.IdTipoItem=i.IdTipoItem AND ti.UsaEscala=1
      INNER JOIN dbo.DES_CriterioEvaluacion c ON c.IdCriterioEvaluacion=i.IdCriterioEvaluacion
      INNER JOIN dbo.DES_ModeloDimension d ON d.IdModeloDimension=c.IdModeloDimension
      INNER JOIN dbo.DES_ModeloPuestoEscenario mpe ON mpe.IdModeloPuestoEscenario=a.IdModeloPuestoEscenario
      INNER JOIN dbo.DES_ModeloPuesto mp ON mp.IdModeloPuesto=mpe.IdModeloPuesto
      INNER JOIN dbo.DES_Modelo m ON m.IdModelo=mp.IdModelo
      INNER JOIN dbo.DES_ModeloEscenario me ON me.IdModeloEscenario=mpe.IdModeloEscenario
      INNER JOIN dbo.DES_CatEscenario ce ON ce.IdEscenario=me.IdEscenario
      WHERE a.IdEvaluacion=@IdEvaluacion AND a.IdEvaluado=@IdEmpleado
        AND (a.EsAnonima=0 OR (
          SELECT COUNT(*)
          FROM dbo.DES_AsignacionEvaluacion ax
          INNER JOIN dbo.DES_CatEstadoAsignacion ex
            ON ex.IdEstadoAsignacion=ax.IdEstadoAsignacion
          WHERE ax.IdEvaluacion=a.IdEvaluacion
            AND ax.IdEvaluado=a.IdEvaluado
            AND ax.IdModeloPuestoEscenario=a.IdModeloPuestoEscenario
            AND ex.Codigo=N'RESPONDIDA'
        )>=COALESCE(me.MinimoRespuestasAnonimas,m.MinimoRespuestasAnonimas,3))
    ), Criterios AS (
      SELECT IdCriterioEvaluacion,IdModeloDimension,IdEscenario,EscenarioCodigo,
        MAX(PonderacionEscenario) PonderacionEscenario,
        MAX(PonderacionDimension) PonderacionDimension,
        MAX(PonderacionCriterio) PonderacionCriterio,
        MAX(NivelExigencia) NivelExigencia,AVG(Valor) Resultado
      FROM Puntajes GROUP BY IdCriterioEvaluacion,IdModeloDimension,IdEscenario,EscenarioCodigo
    )
    SELECT * INTO #Criterios FROM Criterios;

    SELECT IdModeloDimension,IdEscenario,EscenarioCodigo,
      MAX(PonderacionEscenario) PonderacionEscenario,
      MAX(PonderacionDimension) PonderacionDimension,
      SUM(Resultado*PonderacionCriterio/100.0) Resultado
    INTO #Dimensiones
    FROM #Criterios
    GROUP BY IdModeloDimension,IdEscenario,EscenarioCodigo;

    SELECT IdEscenario,EscenarioCodigo,MAX(PonderacionEscenario) PonderacionEscenario,
      SUM(Resultado*PonderacionDimension/100.0) Resultado
    INTO #Escenarios
    FROM #Dimensiones
    GROUP BY IdEscenario,EscenarioCodigo;
    DECLARE @DataJson NVARCHAR(MAX);
    SELECT @DataJson=(
      SELECT @IdEmpleado AS empleadoId,
        CONCAT(ISNULL(e.Nombres,N''),N' ',ISNULL(e.Apellidos,N'')) AS empleado,
        (SELECT SUM(Resultado*PonderacionEscenario/100.0) FROM #Escenarios) AS resultadoTotal,
        JSON_QUERY((SELECT EscenarioCodigo AS escenarioCodigo,Resultado AS resultado,
          PonderacionEscenario AS ponderacion FROM #Escenarios ORDER BY EscenarioCodigo FOR JSON PATH)) AS escenarios,
        JSON_QUERY((SELECT d.IdModeloDimension AS dimensionId,d.Nombre AS dimension,
          x.EscenarioCodigo AS escenarioCodigo,
          SUM(x.Resultado*x.PonderacionCriterio/100.0) AS resultado
          FROM #Criterios x INNER JOIN dbo.DES_ModeloDimension d ON d.IdModeloDimension=x.IdModeloDimension
          GROUP BY d.IdModeloDimension,d.Nombre,x.EscenarioCodigo,d.Orden
          ORDER BY d.Orden,x.EscenarioCodigo FOR JSON PATH)) AS dimensiones,
        JSON_QUERY((SELECT c.IdCriterioEvaluacion AS criterioId,c.Nombre AS criterio,
          x.EscenarioCodigo AS escenarioCodigo,x.Resultado AS resultado,
          x.NivelExigencia AS nivelExigencia,x.Resultado-x.NivelExigencia AS diferencia
          FROM #Criterios x INNER JOIN dbo.DES_CriterioEvaluacion c
            ON c.IdCriterioEvaluacion=x.IdCriterioEvaluacion
          ORDER BY x.EscenarioCodigo,c.Orden,c.IdCriterioEvaluacion FOR JSON PATH)) AS criterios,
        JSON_QUERY((SELECT ce.Codigo AS escenarioCodigo,rd.ValorTexto AS comentario
          FROM dbo.DES_AsignacionEvaluacion a
          INNER JOIN dbo.DES_RespuestaEvaluacion r ON r.IdAsignacion=a.IdAsignacion
          INNER JOIN dbo.DES_CatEstadoAsignacion ea
            ON ea.IdEstadoAsignacion=a.IdEstadoAsignacion AND ea.Codigo=N'RESPONDIDA'
          INNER JOIN dbo.DES_RespuestaDetalle rd ON rd.IdRespuesta=r.IdRespuesta
          INNER JOIN dbo.DES_ItemEvaluativo i ON i.IdItemEvaluativo=rd.IdItemEvaluativo
          INNER JOIN dbo.DES_CatTipoItem ti ON ti.IdTipoItem=i.IdTipoItem AND ti.PermiteTexto=1
          INNER JOIN dbo.DES_ModeloPuestoEscenario mpe ON mpe.IdModeloPuestoEscenario=a.IdModeloPuestoEscenario
          INNER JOIN dbo.DES_ModeloPuesto mp ON mp.IdModeloPuesto=mpe.IdModeloPuesto
          INNER JOIN dbo.DES_Modelo m ON m.IdModelo=mp.IdModelo
          INNER JOIN dbo.DES_ModeloEscenario me ON me.IdModeloEscenario=mpe.IdModeloEscenario
          INNER JOIN dbo.DES_CatEscenario ce ON ce.IdEscenario=me.IdEscenario
          WHERE a.IdEvaluacion=@IdEvaluacion AND a.IdEvaluado=@IdEmpleado
            AND NULLIF(LTRIM(RTRIM(rd.ValorTexto)),N'') IS NOT NULL
            AND (a.EsAnonima=0 OR (SELECT COUNT(*) FROM dbo.DES_AsignacionEvaluacion ax
                 INNER JOIN dbo.DES_CatEstadoAsignacion ex ON ex.IdEstadoAsignacion=ax.IdEstadoAsignacion
                 WHERE ax.IdEvaluacion=a.IdEvaluacion AND ax.IdEvaluado=a.IdEvaluado
                   AND ax.IdModeloPuestoEscenario=a.IdModeloPuestoEscenario
                   AND ex.Codigo=N'RESPONDIDA')>=COALESCE(
                     me.MinimoRespuestasAnonimas,m.MinimoRespuestasAnonimas,3
                   ))
          ORDER BY ce.Codigo,rd.IdRespuestaDetalle FOR JSON PATH)) AS comentarios
      FROM dbo.Empleados e WHERE e.Id=@IdEmpleado AND e.IdOrganizacion=@IdOrganizacion
      FOR JSON PATH,WITHOUT_ARRAY_WRAPPER
    );
    DROP TABLE #Escenarios;
    DROP TABLE #Dimensiones;
    DROP TABLE #Criterios;
    SELECT @DataJson DataJson;
END
GO


CREATE OR ALTER PROCEDURE dbo.DES_sp_ModeloEnvios_RegistrarCorreoEnviado
    @IdEmpleado INT,
    @IdEmpleadoEvaluado INT,
    @Destino NVARCHAR(250) = NULL,
    @IdExterno NVARCHAR(200) = NULL,
    @RespuestaEnvio NVARCHAR(1000) = NULL,
    @FechaEnvio DATETIME2(0) = NULL
AS
BEGIN
    SET NOCOUNT ON;
    SET XACT_ABORT ON;

    SET @FechaEnvio = ISNULL(@FechaEnvio, SYSDATETIME());
    SET @Destino = NULLIF(LTRIM(RTRIM(@Destino)), N'');

    DECLARE
        @IdEnvioEncuestaEmpleado BIGINT,
        @IdModelo INT,
        @IdAsignacion BIGINT,
        @IdCanalCorreo SMALLINT,
        @Intento SMALLINT;

    SELECT TOP (1)
        @IdEnvioEncuestaEmpleado = en.IdEnvioEncuestaEmpleado,
        @IdModelo = en.IdModelo,
        @Destino = COALESCE(@Destino, NULLIF(LTRIM(RTRIM(e.Email)), N''))
    FROM dbo.DES_EnvioEncuestaEmpleado en
    INNER JOIN dbo.Empleados e
        ON e.Id = en.IdEmpleado
    WHERE en.IdEmpleado = @IdEmpleado
      AND en.IdEmpleadoEnviar = @IdEmpleadoEvaluado
      AND en.Activo = 1
    ORDER BY en.FechaCreacion DESC, en.IdEnvioEncuestaEmpleado DESC;

    IF @IdEnvioEncuestaEmpleado IS NULL
        THROW 52401, 'No existe un envio activo para los empleados indicados.', 1;

    IF @Destino IS NULL
        THROW 52402, 'No se encontro un correo destino para registrar el envio.', 1;

    SELECT TOP (1)
        @IdAsignacion = a.IdAsignacion
    FROM dbo.DES_AsignacionEvaluacion a
    INNER JOIN dbo.DES_Evaluacion ev
        ON ev.IdEvaluacion = a.IdEvaluacion
       AND ev.IdModelo = @IdModelo
    WHERE a.IdEvaluador = @IdEmpleado
      AND a.IdEvaluado = @IdEmpleadoEvaluado
      AND a.Activo = 1
      AND ev.Activo = 1
    ORDER BY ev.IdEvaluacion DESC, a.IdAsignacion DESC;

    IF @IdAsignacion IS NULL
        THROW 52402, 'No existe una asignacion activa para los empleados indicados.', 1;

    IF NOT EXISTS (
        SELECT 1
        FROM dbo.DES_CatEstadoAsignacion
        WHERE IdEstadoAsignacion = 2
          AND Codigo = N'ENVIADA'
          AND Activo = 1
    )
        THROW 52402, 'El estado de asignacion 2 no corresponde a ENVIADA.', 1;

    SELECT @IdCanalCorreo = IdCanalEnvio
    FROM dbo.DES_CatCanalEnvio
    WHERE Codigo = N'CORREO'
      AND Activo = 1;

    IF @IdCanalCorreo IS NULL
        THROW 52402, 'No existe el canal CORREO.', 1;

    BEGIN TRAN;
    BEGIN TRY
        SELECT @Intento = CONVERT(
            SMALLINT,
            ISNULL(MAX(Intento), 0) + 1
        )
        FROM dbo.DES_EnvioEvaluacion WITH (UPDLOCK, HOLDLOCK)
        WHERE IdAsignacion = @IdAsignacion;

        UPDATE dbo.DES_EnvioEncuestaEmpleado
        SET Estado = N'ENVIADO',
            FechaEnvio = @FechaEnvio,
            RespuestaEnvio = @RespuestaEnvio,
            FechaModificacion = SYSDATETIME()
        WHERE IdEnvioEncuestaEmpleado = @IdEnvioEncuestaEmpleado;

        UPDATE dbo.DES_AsignacionEvaluacion
        SET IdEstadoAsignacion = 2,
            IdCanalEnvio = @IdCanalCorreo,
            FechaPrimerEnvio = ISNULL(FechaPrimerEnvio, @FechaEnvio),
            FechaUltimoEnvio = @FechaEnvio
        WHERE IdAsignacion = @IdAsignacion;

        INSERT dbo.DES_EnvioEvaluacion (
            IdAsignacion,
            IdCanalEnvio,
            Destino,
            Estado,
            IdExterno,
            Intento,
            FechaEnvio,
            MensajeError
        )
        VALUES (
            @IdAsignacion,
            @IdCanalCorreo,
            @Destino,
            N'ENVIADO',
            @IdExterno,
            @Intento,
            @FechaEnvio,
            NULL
        );

        DECLARE @IdEnvioEvaluacion BIGINT =
            CONVERT(BIGINT, SCOPE_IDENTITY());

        COMMIT;

        SELECT
            @IdEnvioEncuestaEmpleado AS idEnvioEncuestaEmpleado,
            @IdAsignacion AS idAsignacion,
            @IdEnvioEvaluacion AS idEnvioEvaluacion,
            @IdEmpleado AS idEmpleado,
            @IdEmpleadoEvaluado AS idEmpleadoEvaluado,
            N'ENVIADO' AS estado,
            @Destino AS destino,
            @Intento AS intento,
            @FechaEnvio AS fechaEnvio;
    END TRY
    BEGIN CATCH
        IF XACT_STATE() <> 0
            ROLLBACK;
        THROW;
    END CATCH
END
GO





CREATE OR ALTER PROCEDURE dbo.DES_sp_FormularioEvaluacion_Obtener
    @IdEmpleado INT,
    @IdEmpleadoEvaluado INT
AS
BEGIN
    SET NOCOUNT ON;

    IF @IdEmpleado IS NULL OR @IdEmpleado <= 0
       OR @IdEmpleadoEvaluado IS NULL OR @IdEmpleadoEvaluado <= 0
        THROW 52301, 'El evaluador y el empleado evaluado son obligatorios.', 1;

    DECLARE
        @IdAsignacion BIGINT,
        @TokenAcceso UNIQUEIDENTIFIER,
        @IdEvaluacion BIGINT,
        @EscenarioCodigo NVARCHAR(40),
        @IdOrganizacion INT,
        @IdModelo INT,
        @EstadoAsignacion NVARCHAR(30),
        @IdRespuesta BIGINT,
        @EstadoRespuesta NVARCHAR(30),
        @FechaRespuesta DATETIME2(0),
        @FechaFinalizacion DATETIME2(0);

    SELECT TOP (1)
        @IdAsignacion = a.IdAsignacion,
        @TokenAcceso = a.TokenAcceso,
        @IdEvaluacion = e.IdEvaluacion,
        @EscenarioCodigo = es.Codigo,
        @IdOrganizacion = m.IdOrganizacion,
        @IdModelo = m.IdModelo,
        @EstadoAsignacion = ea.Codigo,
        @IdRespuesta = r.IdRespuesta,
        @EstadoRespuesta = er.Codigo,
        @FechaRespuesta = a.FechaRespuesta,
        @FechaFinalizacion = r.FechaFinalizacion
    FROM dbo.DES_Evaluacion e
    INNER JOIN dbo.DES_AsignacionEvaluacion a
        ON a.IdEvaluacion = e.IdEvaluacion
    INNER JOIN dbo.DES_ModeloPuestoEscenario mpe
        ON mpe.IdModeloPuestoEscenario = a.IdModeloPuestoEscenario
    INNER JOIN dbo.DES_ModeloEscenario me
        ON me.IdModeloEscenario = mpe.IdModeloEscenario
    INNER JOIN dbo.DES_CatEscenario es
        ON es.IdEscenario = me.IdEscenario
    INNER JOIN dbo.DES_Modelo m
        ON m.IdModelo = me.IdModelo
       AND m.IdModelo = e.IdModelo
    INNER JOIN dbo.DES_CatEstadoAsignacion ea
        ON ea.IdEstadoAsignacion = a.IdEstadoAsignacion
    LEFT JOIN dbo.DES_RespuestaEvaluacion r
        ON r.IdAsignacion = a.IdAsignacion
    LEFT JOIN dbo.DES_CatEstadoRespuesta er
        ON er.IdEstadoRespuesta = r.IdEstadoRespuesta
    WHERE a.IdEvaluador = @IdEmpleado
      AND a.IdEvaluado = @IdEmpleadoEvaluado
      AND a.Activo = 1
      AND e.Activo = 1
      AND mpe.Activo = 1
      AND me.Activo = 1
      AND es.Activo = 1
      AND m.Activo = 1
      AND ea.Codigo <> N'ANULADA'
    ORDER BY
        e.FechaInicio DESC,
        e.IdEvaluacion DESC,
        a.IdAsignacion DESC;

    IF @TokenAcceso IS NULL
        THROW 52501, 'No existe una asignacion activa para los empleados indicados.', 1;

    IF @EstadoAsignacion = N'RESPONDIDA'
       OR @EstadoRespuesta = N'FINALIZADA'
       OR @FechaRespuesta IS NOT NULL
       OR @FechaFinalizacion IS NOT NULL
    BEGIN
        DECLARE @DataJson NVARCHAR(MAX);

        SELECT @DataJson = (
            SELECT
                @IdOrganizacion AS organizacionId,
                @IdModelo AS modeloId,
                @IdEvaluacion AS evaluacionId,
                @IdAsignacion AS asignacionId,
                @IdEmpleado AS evaluadorId,
                @IdEmpleadoEvaluado AS evaluadoId,
                @EscenarioCodigo AS escenarioCodigo,
                @EstadoAsignacion AS estadoAsignacion,
                @IdRespuesta AS respuestaId,
                @EstadoRespuesta AS estadoRespuesta,
                CAST(1 AS BIT) AS respondida,
                CAST(CASE WHEN @IdRespuesta IS NULL THEN 0 ELSE 1 END AS BIT) AS tieneBorrador,
                CAST(0 AS BIT) AS puedeResponder,
                N'La encuesta ya fue llenada.' AS mensaje
            FOR JSON PATH, WITHOUT_ARRAY_WRAPPER
        );

        SELECT @DataJson AS DataJson;
        RETURN;
    END;

    EXEC dbo.DES_sp_Respuestas_ObtenerPorToken
        @TokenAcceso = @TokenAcceso;
END
GO





CREATE OR ALTER PROCEDURE dbo.DES_sp_Dashboard_Organizacion_Obtener
    @IdOrganizacion INT
AS
BEGIN
    SET NOCOUNT ON;

    IF @IdOrganizacion IS NULL OR @IdOrganizacion <= 0
       OR NOT EXISTS (SELECT 1 FROM dbo.Organizaciones WHERE Id = @IdOrganizacion)
        THROW 52001, 'No existe la organizacion indicada.', 1;

    SELECT
        e.IdEvaluacion,
        e.IdOrganizacion,
        e.IdModelo,
        m.Codigo AS ModeloCodigo,
        m.Nombre AS Modelo,
        m.Version AS ModeloVersion,
        e.Nombre AS Evaluacion,
        e.Descripcion,
        ce.Codigo AS EstadoEvaluacion,
        ce.Nombre AS EstadoEvaluacionNombre,
        e.FechaInicio,
        e.FechaCierre,
        e.FechaCierreReal,
        e.Activo
    INTO #Evaluaciones
    FROM dbo.DES_Evaluacion e
    INNER JOIN dbo.DES_Modelo m
        ON m.IdModelo = e.IdModelo
    INNER JOIN dbo.DES_CatEstadoEvaluacion ce
        ON ce.IdEstadoEvaluacion = e.IdEstadoEvaluacion
    WHERE e.IdOrganizacion = @IdOrganizacion
      AND e.Activo = 1;

    SELECT
        a.IdAsignacion,
        ev.IdEvaluacion,
        ev.IdModelo,
        a.IdEvaluador,
        a.IdEvaluado,
        a.IdModeloPuestoEscenario,
        ea.Codigo AS EstadoAsignacion,
        a.EsAnonima,
        a.FechaPrimerEnvio,
        a.FechaUltimoEnvio,
        a.FechaInicioRespuesta,
        a.FechaRespuesta,
        r.IdRespuesta,
        er.Codigo AS EstadoRespuesta,
        r.FechaFinalizacion,
        CAST(CASE
          WHEN ea.Codigo = N'RESPONDIDA'
            OR er.Codigo = N'FINALIZADA'
            OR a.FechaRespuesta IS NOT NULL
            OR r.FechaFinalizacion IS NOT NULL
          THEN 1 ELSE 0
        END AS BIT) AS EsRealizada,
        mp.IdPuesto,
        p.Codigo AS PuestoCodigo,
        p.Nombre AS Puesto,
        ce.IdEscenario,
        ce.Codigo AS EscenarioCodigo,
        ce.Nombre AS Escenario,
        mpe.Ponderacion AS PonderacionEscenario,
        COALESCE(me.MinimoRespuestasAnonimas, m.MinimoRespuestasAnonimas, 3) AS MinimoRespuestasAnonimas
    INTO #Asignaciones
    FROM #Evaluaciones ev
    INNER JOIN dbo.DES_Modelo m
        ON m.IdModelo = ev.IdModelo
    INNER JOIN dbo.DES_AsignacionEvaluacion a
        ON a.IdEvaluacion = ev.IdEvaluacion
       AND a.Activo = 1
    INNER JOIN dbo.DES_CatEstadoAsignacion ea
        ON ea.IdEstadoAsignacion = a.IdEstadoAsignacion
    LEFT JOIN dbo.DES_RespuestaEvaluacion r
        ON r.IdAsignacion = a.IdAsignacion
    LEFT JOIN dbo.DES_CatEstadoRespuesta er
        ON er.IdEstadoRespuesta = r.IdEstadoRespuesta
    INNER JOIN dbo.DES_ModeloPuestoEscenario mpe
        ON mpe.IdModeloPuestoEscenario = a.IdModeloPuestoEscenario
    INNER JOIN dbo.DES_ModeloPuesto mp
        ON mp.IdModeloPuesto = mpe.IdModeloPuesto
    INNER JOIN dbo.DES_Puesto p
        ON p.IdPuesto = mp.IdPuesto
    INNER JOIN dbo.DES_ModeloEscenario me
        ON me.IdModeloEscenario = mpe.IdModeloEscenario
    INNER JOIN dbo.DES_CatEscenario ce
        ON ce.IdEscenario = me.IdEscenario;

    SELECT *
    INTO #Puntajes
    FROM (
        SELECT
            a.IdEvaluacion,
            a.IdModelo,
            a.IdAsignacion,
            a.IdEvaluador,
            a.IdEvaluado,
            a.IdPuesto,
            a.PuestoCodigo,
            a.Puesto,
            a.IdEscenario,
            a.EscenarioCodigo,
            a.Escenario,
            a.PonderacionEscenario,
            d.IdModeloDimension,
            d.Codigo AS DimensionCodigo,
            d.Nombre AS Dimension,
            d.Ponderacion AS PonderacionDimension,
            c.IdCriterioEvaluacion,
            c.Codigo AS CriterioCodigo,
            c.Nombre AS Criterio,
            c.Ponderacion AS PonderacionCriterio,
            c.NivelExigencia,
            i.IdItemEvaluativo,
            CONVERT(DECIMAL(18,4), sv.Valor) AS Valor
        FROM #Asignaciones a
        INNER JOIN dbo.DES_RespuestaEvaluacion r
            ON r.IdAsignacion = a.IdAsignacion
        LEFT JOIN dbo.DES_CatEstadoRespuesta er
            ON er.IdEstadoRespuesta = r.IdEstadoRespuesta
        INNER JOIN dbo.DES_RespuestaDetalle rd
            ON rd.IdRespuesta = r.IdRespuesta
           AND rd.NoAplica = 0
        INNER JOIN dbo.DES_EscalaValor sv
            ON sv.IdEscalaValor = rd.IdEscalaValor
        INNER JOIN dbo.DES_ItemEvaluativo i
            ON i.IdItemEvaluativo = rd.IdItemEvaluativo
           AND i.Activo = 1
        INNER JOIN dbo.DES_CatTipoItem ti
            ON ti.IdTipoItem = i.IdTipoItem
           AND ti.UsaEscala = 1
        INNER JOIN dbo.DES_CriterioEvaluacion c
            ON c.IdCriterioEvaluacion = i.IdCriterioEvaluacion
           AND c.Activo = 1
        INNER JOIN dbo.DES_ModeloDimension d
            ON d.IdModeloDimension = c.IdModeloDimension
           AND d.Activo = 1
        WHERE a.EsRealizada = 1
          AND (
              a.EsAnonima = 0
              OR (
                  SELECT COUNT(*)
                  FROM #Asignaciones ax
                  WHERE ax.IdEvaluacion = a.IdEvaluacion
                    AND ax.IdEvaluado = a.IdEvaluado
                    AND ax.IdModeloPuestoEscenario = a.IdModeloPuestoEscenario
                    AND ax.EsRealizada = 1
              ) >= a.MinimoRespuestasAnonimas
          )

        UNION ALL

        SELECT
            a.IdEvaluacion,
            a.IdModelo,
            a.IdAsignacion,
            a.IdEvaluador,
            a.IdEvaluado,
            a.IdPuesto,
            a.PuestoCodigo,
            a.Puesto,
            a.IdEscenario,
            a.EscenarioCodigo,
            a.Escenario,
            a.PonderacionEscenario,
            d.IdModeloDimension,
            d.Codigo AS DimensionCodigo,
            d.Nombre AS Dimension,
            d.Ponderacion AS PonderacionDimension,
            c.IdCriterioEvaluacion,
            c.Codigo AS CriterioCodigo,
            c.Nombre AS Criterio,
            c.Ponderacion AS PonderacionCriterio,
            c.NivelExigencia,
            i.IdItemEvaluativo,
            CONVERT(DECIMAL(18,4), sv.Valor) AS Valor
        FROM #Asignaciones a
        INNER JOIN dbo.DES_RespuestaEvaluacion r
            ON r.IdAsignacion = a.IdAsignacion
        LEFT JOIN dbo.DES_CatEstadoRespuesta er
            ON er.IdEstadoRespuesta = r.IdEstadoRespuesta
        INNER JOIN dbo.DES_RespuestaDetalle rd
            ON rd.IdRespuesta = r.IdRespuesta
           AND rd.NoAplica = 0
        INNER JOIN dbo.DES_RespuestaDetalleOpcion ro
            ON ro.IdRespuestaDetalle = rd.IdRespuestaDetalle
        INNER JOIN dbo.DES_EscalaValor sv
            ON sv.IdEscalaValor = ro.IdEscalaValor
        INNER JOIN dbo.DES_ItemEvaluativo i
            ON i.IdItemEvaluativo = rd.IdItemEvaluativo
           AND i.Activo = 1
        INNER JOIN dbo.DES_CatTipoItem ti
            ON ti.IdTipoItem = i.IdTipoItem
           AND ti.UsaEscala = 1
        INNER JOIN dbo.DES_CriterioEvaluacion c
            ON c.IdCriterioEvaluacion = i.IdCriterioEvaluacion
           AND c.Activo = 1
        INNER JOIN dbo.DES_ModeloDimension d
            ON d.IdModeloDimension = c.IdModeloDimension
           AND d.Activo = 1
        WHERE a.EsRealizada = 1
          AND (
              a.EsAnonima = 0
              OR (
                  SELECT COUNT(*)
                  FROM #Asignaciones ax
                  WHERE ax.IdEvaluacion = a.IdEvaluacion
                    AND ax.IdEvaluado = a.IdEvaluado
                    AND ax.IdModeloPuestoEscenario = a.IdModeloPuestoEscenario
                    AND ax.EsRealizada = 1
              ) >= a.MinimoRespuestasAnonimas
          )
    ) p;

    SELECT
        IdEvaluacion,
        IdModelo,
        IdEvaluado,
        IdPuesto,
        PuestoCodigo,
        Puesto,
        IdEscenario,
        EscenarioCodigo,
        Escenario,
        PonderacionEscenario,
        IdModeloDimension,
        DimensionCodigo,
        Dimension,
        PonderacionDimension,
        IdCriterioEvaluacion,
        CriterioCodigo,
        Criterio,
        PonderacionCriterio,
        MAX(NivelExigencia) AS NivelExigencia,
        AVG(Valor) AS Resultado,
        COUNT(DISTINCT IdAsignacion) AS Respuestas
    INTO #Criterios
    FROM #Puntajes
    GROUP BY
        IdEvaluacion,
        IdModelo,
        IdEvaluado,
        IdPuesto,
        PuestoCodigo,
        Puesto,
        IdEscenario,
        EscenarioCodigo,
        Escenario,
        PonderacionEscenario,
        IdModeloDimension,
        DimensionCodigo,
        Dimension,
        PonderacionDimension,
        IdCriterioEvaluacion,
        CriterioCodigo,
        Criterio,
        PonderacionCriterio;

    SELECT
        IdEvaluacion,
        IdModelo,
        IdEvaluado,
        IdPuesto,
        PuestoCodigo,
        Puesto,
        IdEscenario,
        EscenarioCodigo,
        Escenario,
        PonderacionEscenario,
        IdModeloDimension,
        DimensionCodigo,
        Dimension,
        PonderacionDimension,
        SUM(Resultado * PonderacionCriterio / 100.0) AS Resultado,
        SUM(NivelExigencia * PonderacionCriterio / 100.0) AS NivelExigencia,
        COUNT(*) AS TotalCriterios
    INTO #Dimensiones
    FROM #Criterios
    GROUP BY
        IdEvaluacion,
        IdModelo,
        IdEvaluado,
        IdPuesto,
        PuestoCodigo,
        Puesto,
        IdEscenario,
        EscenarioCodigo,
        Escenario,
        PonderacionEscenario,
        IdModeloDimension,
        DimensionCodigo,
        Dimension,
        PonderacionDimension;

    SELECT
        IdEvaluacion,
        IdModelo,
        IdEvaluado,
        IdPuesto,
        PuestoCodigo,
        Puesto,
        IdEscenario,
        EscenarioCodigo,
        Escenario,
        PonderacionEscenario,
        SUM(Resultado * PonderacionDimension / 100.0) AS Resultado,
        SUM(NivelExigencia * PonderacionDimension / 100.0) AS NivelExigencia,
        COUNT(*) AS TotalDimensiones
    INTO #Escenarios
    FROM #Dimensiones
    GROUP BY
        IdEvaluacion,
        IdModelo,
        IdEvaluado,
        IdPuesto,
        PuestoCodigo,
        Puesto,
        IdEscenario,
        EscenarioCodigo,
        Escenario,
        PonderacionEscenario;

    SELECT
        IdEvaluacion,
        IdModelo,
        IdEvaluado,
        MAX(IdPuesto) AS IdPuesto,
        MAX(PuestoCodigo) AS PuestoCodigo,
        MAX(Puesto) AS Puesto,
        SUM(Resultado * PonderacionEscenario / 100.0) AS ResultadoTotal,
        SUM(NivelExigencia * PonderacionEscenario / 100.0) AS NivelExigenciaTotal,
        COUNT(DISTINCT IdEscenario) AS EscenariosContestados
    INTO #ResultadosEmpleado
    FROM #Escenarios
    GROUP BY IdEvaluacion, IdModelo, IdEvaluado;

    DECLARE @DataJson NVARCHAR(MAX);

    SELECT @DataJson = (
      SELECT
        @IdOrganizacion AS organizacionId,
        SYSDATETIME() AS fechaGeneracion,
        JSON_QUERY((
          SELECT
            (SELECT COUNT(*) FROM dbo.DES_Modelo m WHERE m.IdOrganizacion=@IdOrganizacion) AS totalModelos,
            (SELECT COUNT(*) FROM dbo.DES_Modelo m WHERE m.IdOrganizacion=@IdOrganizacion AND m.Activo=1) AS modelosActivos,
            (SELECT COUNT(*) FROM #Evaluaciones) AS totalEvaluaciones,
            (SELECT COUNT(*) FROM #Asignaciones) AS totalAsignaciones,
            ISNULL((SELECT SUM(CASE WHEN EstadoAsignacion=N'PENDIENTE' THEN 1 ELSE 0 END) FROM #Asignaciones),0) AS pendientes,
            ISNULL((SELECT SUM(CASE WHEN EstadoAsignacion=N'ENVIADA' THEN 1 ELSE 0 END) FROM #Asignaciones),0) AS enviadas,
            ISNULL((SELECT SUM(CASE WHEN EstadoAsignacion=N'EN_PROCESO' THEN 1 ELSE 0 END) FROM #Asignaciones),0) AS enProceso,
            ISNULL((SELECT SUM(CASE WHEN EstadoAsignacion=N'RESPONDIDA' THEN 1 ELSE 0 END) FROM #Asignaciones),0) AS respondidas,
            ISNULL((SELECT SUM(CASE WHEN EsRealizada=1 THEN 1 ELSE 0 END) FROM #Asignaciones),0) AS realizadas,
            ISNULL((SELECT SUM(CASE WHEN EstadoAsignacion=N'ERROR' THEN 1 ELSE 0 END) FROM #Asignaciones),0) AS errores,
            CAST(CASE WHEN (SELECT COUNT(*) FROM #Asignaciones)=0 THEN 0
              ELSE 100.0 * ISNULL((SELECT SUM(CASE WHEN EsRealizada=1 THEN 1 ELSE 0 END) FROM #Asignaciones),0)
                   / (SELECT COUNT(*) FROM #Asignaciones)
              END AS DECIMAL(6,2)) AS porcentajeAvance,
            CAST(CASE WHEN (SELECT COUNT(*) FROM #Asignaciones)=0 THEN 0
              ELSE 100.0 * ISNULL((SELECT SUM(CASE WHEN EsRealizada=1 THEN 1 ELSE 0 END) FROM #Asignaciones),0)
                   / (SELECT COUNT(*) FROM #Asignaciones)
              END AS DECIMAL(6,2)) AS porcentajeRealizacion,
            (SELECT COUNT(DISTINCT IdEvaluacion) FROM #Asignaciones WHERE EsRealizada=1) AS evaluacionesRealizadas,
            (SELECT COUNT(DISTINCT IdEvaluador) FROM #Asignaciones) AS totalEvaluadores,
            (SELECT COUNT(DISTINCT IdEvaluado) FROM #Asignaciones) AS totalEvaluados,
            (SELECT COUNT(DISTINCT IdEvaluado) FROM #ResultadosEmpleado) AS empleadosConResultado,
            CAST((SELECT AVG(ResultadoTotal) FROM #ResultadosEmpleado) AS DECIMAL(18,4)) AS resultadoPromedio,
            CAST((SELECT AVG(ResultadoTotal) FROM #ResultadosEmpleado) AS DECIMAL(18,4)) AS calificacionPromedio,
            CAST((SELECT AVG(NivelExigenciaTotal) FROM #ResultadosEmpleado) AS DECIMAL(18,4)) AS nivelExigenciaPromedio,
            CAST((SELECT AVG(ResultadoTotal-NivelExigenciaTotal) FROM #ResultadosEmpleado) AS DECIMAL(18,4)) AS brechaPromedio
          FOR JSON PATH, WITHOUT_ARRAY_WRAPPER
        )) AS resumen,
        JSON_QUERY((
          SELECT
            m.IdModelo AS id,
            m.Codigo AS codigo,
            m.Nombre AS nombre,
            m.Version AS version,
            tm.Codigo AS tipoCodigo,
            tm.Nombre AS tipo,
            em.Codigo AS estadoCodigo,
            em.Nombre AS estado,
            m.Activo AS activo,
            (SELECT COUNT(*) FROM #Evaluaciones e WHERE e.IdModelo=m.IdModelo) AS totalEvaluaciones,
            (SELECT COUNT(DISTINCT a.IdEvaluacion) FROM #Asignaciones a WHERE a.IdModelo=m.IdModelo AND a.EsRealizada=1) AS evaluacionesRealizadas,
            (SELECT COUNT(*) FROM #Asignaciones a WHERE a.IdModelo=m.IdModelo) AS totalAsignaciones,
            ISNULL((SELECT SUM(CASE WHEN a.EstadoAsignacion=N'RESPONDIDA' THEN 1 ELSE 0 END) FROM #Asignaciones a WHERE a.IdModelo=m.IdModelo),0) AS respondidas,
            ISNULL((SELECT SUM(CASE WHEN a.EsRealizada=1 THEN 1 ELSE 0 END) FROM #Asignaciones a WHERE a.IdModelo=m.IdModelo),0) AS realizadas,
            CAST(CASE WHEN (SELECT COUNT(*) FROM #Asignaciones a WHERE a.IdModelo=m.IdModelo)=0 THEN 0
              ELSE 100.0 * ISNULL((SELECT SUM(CASE WHEN a.EsRealizada=1 THEN 1 ELSE 0 END) FROM #Asignaciones a WHERE a.IdModelo=m.IdModelo),0)
                   / (SELECT COUNT(*) FROM #Asignaciones a WHERE a.IdModelo=m.IdModelo)
              END AS DECIMAL(6,2)) AS porcentajeAvance,
            (SELECT COUNT(DISTINCT r.IdEvaluado) FROM #ResultadosEmpleado r WHERE r.IdModelo=m.IdModelo) AS empleadosConResultado,
            CAST((SELECT AVG(r.ResultadoTotal) FROM #ResultadosEmpleado r WHERE r.IdModelo=m.IdModelo) AS DECIMAL(18,4)) AS resultadoPromedio,
            CAST((SELECT AVG(r.ResultadoTotal) FROM #ResultadosEmpleado r WHERE r.IdModelo=m.IdModelo) AS DECIMAL(18,4)) AS calificacionPromedio,
            CAST((SELECT AVG(r.NivelExigenciaTotal) FROM #ResultadosEmpleado r WHERE r.IdModelo=m.IdModelo) AS DECIMAL(18,4)) AS nivelExigenciaPromedio,
            CAST((SELECT AVG(r.ResultadoTotal-r.NivelExigenciaTotal) FROM #ResultadosEmpleado r WHERE r.IdModelo=m.IdModelo) AS DECIMAL(18,4)) AS brechaPromedio,
            JSON_QUERY((
              SELECT
                e.IdEvaluacion AS id,
                e.Evaluacion AS nombre,
                e.EstadoEvaluacion AS estadoCodigo,
                e.FechaInicio AS fechaInicio,
                e.FechaCierre AS fechaCierre,
                CAST(CASE WHEN EXISTS (
                  SELECT 1 FROM #Asignaciones a
                  WHERE a.IdEvaluacion=e.IdEvaluacion
                    AND a.EsRealizada=1
                ) THEN 1 ELSE 0 END AS BIT) AS tieneResultados,
                (SELECT COUNT(*) FROM #Asignaciones a WHERE a.IdEvaluacion=e.IdEvaluacion) AS totalAsignaciones,
                ISNULL((SELECT SUM(CASE WHEN a.EstadoAsignacion=N'RESPONDIDA' THEN 1 ELSE 0 END) FROM #Asignaciones a WHERE a.IdEvaluacion=e.IdEvaluacion),0) AS respondidas,
                ISNULL((SELECT SUM(CASE WHEN a.EsRealizada=1 THEN 1 ELSE 0 END) FROM #Asignaciones a WHERE a.IdEvaluacion=e.IdEvaluacion),0) AS realizadas,
                (SELECT COUNT(DISTINCT r.IdEvaluado) FROM #ResultadosEmpleado r WHERE r.IdEvaluacion=e.IdEvaluacion) AS empleadosConResultado,
                CAST((SELECT AVG(r.ResultadoTotal) FROM #ResultadosEmpleado r WHERE r.IdEvaluacion=e.IdEvaluacion) AS DECIMAL(18,4)) AS resultadoPromedio,
                CAST((SELECT AVG(r.ResultadoTotal) FROM #ResultadosEmpleado r WHERE r.IdEvaluacion=e.IdEvaluacion) AS DECIMAL(18,4)) AS calificacionPromedio,
                CAST((SELECT AVG(r.NivelExigenciaTotal) FROM #ResultadosEmpleado r WHERE r.IdEvaluacion=e.IdEvaluacion) AS DECIMAL(18,4)) AS nivelExigenciaPromedio
              FROM #Evaluaciones e
              WHERE e.IdModelo=m.IdModelo
              ORDER BY e.FechaInicio DESC,e.IdEvaluacion DESC
              FOR JSON PATH
            )) AS evaluaciones
          FROM dbo.DES_Modelo m
          INNER JOIN dbo.DES_CatTipoModelo tm ON tm.IdTipoModelo=m.IdTipoModelo
          INNER JOIN dbo.DES_CatEstadoModelo em ON em.IdEstadoModelo=m.IdEstadoModelo
          WHERE m.IdOrganizacion=@IdOrganizacion
          ORDER BY m.FechaCreacion DESC,m.IdModelo DESC
          FOR JSON PATH
        )) AS modelos,
        JSON_QUERY((
          SELECT
            e.IdEvaluacion AS id,
            e.IdModelo AS modeloId,
            e.ModeloCodigo AS modeloCodigo,
            e.Modelo AS modelo,
            e.Evaluacion AS nombre,
            e.EstadoEvaluacion AS estadoCodigo,
            e.EstadoEvaluacionNombre AS estado,
            e.FechaInicio AS fechaInicio,
            e.FechaCierre AS fechaCierre,
            CAST(CASE WHEN EXISTS (
              SELECT 1 FROM #Asignaciones a
              WHERE a.IdEvaluacion=e.IdEvaluacion
                AND a.EsRealizada=1
            ) THEN 1 ELSE 0 END AS BIT) AS tieneResultados,
            JSON_QUERY((
              SELECT
                COUNT(*) AS totalAsignaciones,
                ISNULL(SUM(CASE WHEN a.EstadoAsignacion=N'PENDIENTE' THEN 1 ELSE 0 END),0) AS pendientes,
                ISNULL(SUM(CASE WHEN a.EstadoAsignacion=N'ENVIADA' THEN 1 ELSE 0 END),0) AS enviadas,
                ISNULL(SUM(CASE WHEN a.EstadoAsignacion=N'EN_PROCESO' THEN 1 ELSE 0 END),0) AS enProceso,
                ISNULL(SUM(CASE WHEN a.EstadoAsignacion=N'RESPONDIDA' THEN 1 ELSE 0 END),0) AS respondidas,
                ISNULL(SUM(CASE WHEN a.EsRealizada=1 THEN 1 ELSE 0 END),0) AS realizadas,
                CAST(CASE WHEN COUNT(*)=0 THEN 0
                  ELSE 100.0*SUM(CASE WHEN a.EsRealizada=1 THEN 1 ELSE 0 END)/COUNT(*)
                  END AS DECIMAL(6,2)) AS porcentajeAvance
              FROM #Asignaciones a
              WHERE a.IdEvaluacion=e.IdEvaluacion
              FOR JSON PATH, WITHOUT_ARRAY_WRAPPER
            )) AS avance,
            (SELECT COUNT(DISTINCT r.IdEvaluado) FROM #ResultadosEmpleado r WHERE r.IdEvaluacion=e.IdEvaluacion) AS empleadosConResultado,
            CAST((SELECT AVG(r.ResultadoTotal) FROM #ResultadosEmpleado r WHERE r.IdEvaluacion=e.IdEvaluacion) AS DECIMAL(18,4)) AS resultadoPromedio,
            CAST((SELECT AVG(r.ResultadoTotal) FROM #ResultadosEmpleado r WHERE r.IdEvaluacion=e.IdEvaluacion) AS DECIMAL(18,4)) AS calificacionPromedio,
            CAST((SELECT AVG(r.NivelExigenciaTotal) FROM #ResultadosEmpleado r WHERE r.IdEvaluacion=e.IdEvaluacion) AS DECIMAL(18,4)) AS nivelExigenciaPromedio,
            CAST((SELECT AVG(r.ResultadoTotal-r.NivelExigenciaTotal) FROM #ResultadosEmpleado r WHERE r.IdEvaluacion=e.IdEvaluacion) AS DECIMAL(18,4)) AS brechaPromedio,
            JSON_QUERY((
              SELECT
                a.IdAsignacion AS asignacionId,
                a.IdEvaluador AS evaluadorId,
                CONCAT(ISNULL(evdr.Nombres,N''),N' ',ISNULL(evdr.Apellidos,N'')) AS evaluador,
                a.IdEvaluado AS evaluadoId,
                CONCAT(ISNULL(evdo.Nombres,N''),N' ',ISNULL(evdo.Apellidos,N'')) AS evaluado,
                a.IdPuesto AS puestoId,
                a.Puesto AS puesto,
                a.EscenarioCodigo AS escenarioCodigo,
                a.Escenario AS escenario,
                a.EstadoAsignacion AS estadoAsignacion,
                a.EstadoRespuesta AS estadoRespuesta,
                a.FechaRespuesta AS fechaRespuesta,
                a.FechaFinalizacion AS fechaFinalizacion
              FROM #Asignaciones a
              INNER JOIN dbo.Empleados evdr ON evdr.Id=a.IdEvaluador
              INNER JOIN dbo.Empleados evdo ON evdo.Id=a.IdEvaluado
              WHERE a.IdEvaluacion=e.IdEvaluacion
                AND a.EsRealizada=1
              ORDER BY evaluado,evaluador,a.EscenarioCodigo,a.IdAsignacion
              FOR JSON PATH
            )) AS asignacionesRealizadas,
            JSON_QUERY((
              SELECT
                x.IdPuesto AS puestoId,
                x.PuestoCodigo AS puestoCodigo,
                x.Puesto AS puesto,
                COUNT(DISTINCT x.IdEvaluado) AS empleadosEvaluados,
                CAST(AVG(x.ResultadoTotal) AS DECIMAL(18,4)) AS resultadoPromedio,
                CAST(AVG(x.ResultadoTotal) AS DECIMAL(18,4)) AS calificacionPromedio,
                CAST(AVG(x.NivelExigenciaTotal) AS DECIMAL(18,4)) AS nivelExigenciaPromedio,
                CAST(AVG(x.ResultadoTotal-x.NivelExigenciaTotal) AS DECIMAL(18,4)) AS brechaPromedio
              FROM #ResultadosEmpleado x
              WHERE x.IdEvaluacion=e.IdEvaluacion
              GROUP BY x.IdPuesto,x.PuestoCodigo,x.Puesto
              ORDER BY x.Puesto
              FOR JSON PATH
            )) AS puestos,
            JSON_QUERY((
              SELECT
                x.EscenarioCodigo AS escenarioCodigo,
                x.Escenario AS escenario,
                COUNT(DISTINCT x.IdEvaluado) AS empleadosEvaluados,
                CAST(AVG(x.Resultado) AS DECIMAL(18,4)) AS resultadoPromedio,
                CAST(AVG(x.Resultado) AS DECIMAL(18,4)) AS calificacionPromedio,
                CAST(AVG(x.NivelExigencia) AS DECIMAL(18,4)) AS nivelExigenciaPromedio,
                CAST(AVG(x.Resultado-x.NivelExigencia) AS DECIMAL(18,4)) AS brechaPromedio
              FROM #Escenarios x
              WHERE x.IdEvaluacion=e.IdEvaluacion
              GROUP BY x.EscenarioCodigo,x.Escenario
              ORDER BY x.EscenarioCodigo
              FOR JSON PATH
            )) AS escenarios,
            JSON_QUERY((
              SELECT
                x.IdModeloDimension AS dimensionId,
                x.DimensionCodigo AS dimensionCodigo,
                x.Dimension AS dimension,
                CAST(AVG(x.Resultado) AS DECIMAL(18,4)) AS resultadoPromedio,
                CAST(AVG(x.Resultado) AS DECIMAL(18,4)) AS calificacionPromedio,
                CAST(AVG(x.NivelExigencia) AS DECIMAL(18,4)) AS nivelExigenciaPromedio,
                CAST(AVG(x.Resultado-x.NivelExigencia) AS DECIMAL(18,4)) AS brechaPromedio
              FROM #Dimensiones x
              WHERE x.IdEvaluacion=e.IdEvaluacion
              GROUP BY x.IdModeloDimension,x.DimensionCodigo,x.Dimension
              ORDER BY x.Dimension
              FOR JSON PATH
            )) AS dimensiones,
            JSON_QUERY((
              SELECT
                x.IdCriterioEvaluacion AS criterioId,
                x.CriterioCodigo AS criterioCodigo,
                x.Criterio AS criterio,
                x.Dimension AS dimension,
                x.EscenarioCodigo AS escenarioCodigo,
                CAST(AVG(x.Resultado) AS DECIMAL(18,4)) AS resultadoPromedio,
                CAST(AVG(x.Resultado) AS DECIMAL(18,4)) AS calificacionPromedio,
                CAST(AVG(x.NivelExigencia) AS DECIMAL(18,4)) AS nivelExigenciaPromedio,
                CAST(AVG(x.Resultado-x.NivelExigencia) AS DECIMAL(18,4)) AS brechaPromedio
              FROM #Criterios x
              WHERE x.IdEvaluacion=e.IdEvaluacion
              GROUP BY x.IdCriterioEvaluacion,x.CriterioCodigo,x.Criterio,x.Dimension,x.EscenarioCodigo
              ORDER BY brechaPromedio,x.Criterio
              FOR JSON PATH
            )) AS criterios,
            JSON_QUERY((
              SELECT
                r.IdEvaluado AS empleadoId,
                CONCAT(ISNULL(emp.Nombres,N''),N' ',ISNULL(emp.Apellidos,N'')) AS empleado,
                r.IdPuesto AS puestoId,
                r.Puesto AS puesto,
                CAST(r.ResultadoTotal AS DECIMAL(18,4)) AS resultadoTotal,
                CAST(r.ResultadoTotal AS DECIMAL(18,4)) AS calificacionTotal,
                CAST(r.NivelExigenciaTotal AS DECIMAL(18,4)) AS nivelExigenciaTotal,
                CAST(r.ResultadoTotal-r.NivelExigenciaTotal AS DECIMAL(18,4)) AS brechaTotal,
                r.EscenariosContestados AS escenariosContestados,
                JSON_QUERY((
                  SELECT
                    a.IdAsignacion AS asignacionId,
                    a.IdEvaluador AS evaluadorId,
                    CONCAT(ISNULL(evdr.Nombres,N''),N' ',ISNULL(evdr.Apellidos,N'')) AS evaluador,
                    a.IdEvaluado AS evaluadoId,
                    a.EscenarioCodigo AS escenarioCodigo,
                    a.Escenario AS escenario,
                    a.EstadoAsignacion AS estadoAsignacion,
                    a.EstadoRespuesta AS estadoRespuesta,
                    a.FechaRespuesta AS fechaRespuesta,
                    a.FechaFinalizacion AS fechaFinalizacion
                  FROM #Asignaciones a
                  INNER JOIN dbo.Empleados evdr ON evdr.Id=a.IdEvaluador
                  WHERE a.IdEvaluacion=r.IdEvaluacion
                    AND a.IdEvaluado=r.IdEvaluado
                    AND a.EsRealizada=1
                  ORDER BY a.EscenarioCodigo,evaluador,a.IdAsignacion
                  FOR JSON PATH
                )) AS evaluadores,
                JSON_QUERY((
                  SELECT
                    s.EscenarioCodigo AS escenarioCodigo,
                    s.Escenario AS escenario,
                    CAST(s.Resultado AS DECIMAL(18,4)) AS resultado,
                    CAST(s.Resultado AS DECIMAL(18,4)) AS calificacion,
                    CAST(s.NivelExigencia AS DECIMAL(18,4)) AS nivelExigencia,
                    CAST(s.Resultado-s.NivelExigencia AS DECIMAL(18,4)) AS brecha
                  FROM #Escenarios s
                  WHERE s.IdEvaluacion=r.IdEvaluacion
                    AND s.IdEvaluado=r.IdEvaluado
                  ORDER BY s.EscenarioCodigo
                  FOR JSON PATH
                )) AS escenarios,
                JSON_QUERY((
                  SELECT
                    d.IdModeloDimension AS dimensionId,
                    d.DimensionCodigo AS dimensionCodigo,
                    d.Dimension AS dimension,
                    d.EscenarioCodigo AS escenarioCodigo,
                    CAST(d.Resultado AS DECIMAL(18,4)) AS resultado,
                    CAST(d.Resultado AS DECIMAL(18,4)) AS calificacion,
                    CAST(d.NivelExigencia AS DECIMAL(18,4)) AS nivelExigencia,
                    CAST(d.Resultado-d.NivelExigencia AS DECIMAL(18,4)) AS brecha
                  FROM #Dimensiones d
                  WHERE d.IdEvaluacion=r.IdEvaluacion
                    AND d.IdEvaluado=r.IdEvaluado
                  ORDER BY d.EscenarioCodigo,d.Dimension
                  FOR JSON PATH
                )) AS dimensiones,
                JSON_QUERY((
                  SELECT
                    c.IdCriterioEvaluacion AS criterioId,
                    c.CriterioCodigo AS criterioCodigo,
                    c.Criterio AS criterio,
                    c.Dimension AS dimension,
                    c.EscenarioCodigo AS escenarioCodigo,
                    CAST(c.Resultado AS DECIMAL(18,4)) AS resultado,
                    CAST(c.Resultado AS DECIMAL(18,4)) AS calificacion,
                    CAST(c.NivelExigencia AS DECIMAL(18,4)) AS nivelExigencia,
                    CAST(c.Resultado-c.NivelExigencia AS DECIMAL(18,4)) AS brecha,
                    c.Respuestas AS respuestas
                  FROM #Criterios c
                  WHERE c.IdEvaluacion=r.IdEvaluacion
                    AND c.IdEvaluado=r.IdEvaluado
                  ORDER BY c.EscenarioCodigo,c.Dimension,c.Criterio
                  FOR JSON PATH
                )) AS criterios
              FROM #ResultadosEmpleado r
              INNER JOIN dbo.Empleados emp ON emp.Id=r.IdEvaluado
              WHERE r.IdEvaluacion=e.IdEvaluacion
              ORDER BY empleado
              FOR JSON PATH
            )) AS empleados
          FROM #Evaluaciones e
          ORDER BY e.FechaInicio DESC,e.IdEvaluacion DESC
          FOR JSON PATH
        )) AS evaluaciones,
        JSON_QUERY((
          SELECT
            r.IdEvaluado AS empleadoId,
            CONCAT(ISNULL(emp.Nombres,N''),N' ',ISNULL(emp.Apellidos,N'')) AS empleado,
            MAX(r.IdPuesto) AS puestoId,
            MAX(r.Puesto) AS puesto,
            COUNT(DISTINCT r.IdEvaluacion) AS evaluacionesConResultado,
            CAST(AVG(r.ResultadoTotal) AS DECIMAL(18,4)) AS resultadoPromedio,
            CAST(AVG(r.ResultadoTotal) AS DECIMAL(18,4)) AS calificacionPromedio,
            CAST(AVG(r.NivelExigenciaTotal) AS DECIMAL(18,4)) AS nivelExigenciaPromedio,
            CAST(AVG(r.ResultadoTotal-r.NivelExigenciaTotal) AS DECIMAL(18,4)) AS brechaPromedio,
            JSON_QUERY((
              SELECT
                ev.IdEvaluacion AS evaluacionId,
                ev.Evaluacion AS evaluacion,
                ev.ModeloCodigo AS modeloCodigo,
                ev.Modelo AS modelo,
                r2.IdPuesto AS puestoId,
                r2.Puesto AS puesto,
                CAST(r2.ResultadoTotal AS DECIMAL(18,4)) AS resultadoTotal,
                CAST(r2.ResultadoTotal AS DECIMAL(18,4)) AS calificacionTotal,
                CAST(r2.NivelExigenciaTotal AS DECIMAL(18,4)) AS nivelExigenciaTotal,
                CAST(r2.ResultadoTotal-r2.NivelExigenciaTotal AS DECIMAL(18,4)) AS brechaTotal,
                JSON_QUERY((
                  SELECT
                    a.IdAsignacion AS asignacionId,
                    a.IdEvaluador AS evaluadorId,
                    CONCAT(ISNULL(evdr.Nombres,N''),N' ',ISNULL(evdr.Apellidos,N'')) AS evaluador,
                    a.IdEvaluado AS evaluadoId,
                    a.EscenarioCodigo AS escenarioCodigo,
                    a.Escenario AS escenario,
                    a.EstadoAsignacion AS estadoAsignacion,
                    a.EstadoRespuesta AS estadoRespuesta,
                    a.FechaRespuesta AS fechaRespuesta,
                    a.FechaFinalizacion AS fechaFinalizacion
                  FROM #Asignaciones a
                  INNER JOIN dbo.Empleados evdr ON evdr.Id=a.IdEvaluador
                  WHERE a.IdEvaluacion=r2.IdEvaluacion
                    AND a.IdEvaluado=r2.IdEvaluado
                    AND a.EsRealizada=1
                  ORDER BY a.EscenarioCodigo,evaluador,a.IdAsignacion
                  FOR JSON PATH
                )) AS evaluadores,
                JSON_QUERY((
                  SELECT
                    s.EscenarioCodigo AS escenarioCodigo,
                    s.Escenario AS escenario,
                    CAST(s.Resultado AS DECIMAL(18,4)) AS resultado,
                    CAST(s.Resultado AS DECIMAL(18,4)) AS calificacion,
                    CAST(s.NivelExigencia AS DECIMAL(18,4)) AS nivelExigencia,
                    CAST(s.Resultado-s.NivelExigencia AS DECIMAL(18,4)) AS brecha
                  FROM #Escenarios s
                  WHERE s.IdEvaluacion=r2.IdEvaluacion
                    AND s.IdEvaluado=r2.IdEvaluado
                  ORDER BY s.EscenarioCodigo
                  FOR JSON PATH
                )) AS escenarios
              FROM #ResultadosEmpleado r2
              INNER JOIN #Evaluaciones ev
                ON ev.IdEvaluacion=r2.IdEvaluacion
              WHERE r2.IdEvaluado=r.IdEvaluado
              ORDER BY ev.FechaInicio DESC,ev.IdEvaluacion DESC
              FOR JSON PATH
            )) AS evaluaciones
          FROM #ResultadosEmpleado r
          INNER JOIN dbo.Empleados emp ON emp.Id=r.IdEvaluado
          GROUP BY r.IdEvaluado,emp.Nombres,emp.Apellidos
          ORDER BY empleado
          FOR JSON PATH
        )) AS empleadosEvaluados,
        JSON_QUERY((
          SELECT
            r.IdPuesto AS puestoId,
            r.PuestoCodigo AS puestoCodigo,
            r.Puesto AS puesto,
            COUNT(DISTINCT r.IdEvaluado) AS empleadosEvaluados,
            COUNT(DISTINCT r.IdEvaluacion) AS evaluaciones,
            CAST(AVG(r.ResultadoTotal) AS DECIMAL(18,4)) AS resultadoPromedio,
            CAST(AVG(r.ResultadoTotal) AS DECIMAL(18,4)) AS calificacionPromedio,
            CAST(AVG(r.NivelExigenciaTotal) AS DECIMAL(18,4)) AS nivelExigenciaPromedio,
            CAST(AVG(r.ResultadoTotal-r.NivelExigenciaTotal) AS DECIMAL(18,4)) AS brechaPromedio
          FROM #ResultadosEmpleado r
          GROUP BY r.IdPuesto,r.PuestoCodigo,r.Puesto
          ORDER BY r.Puesto
          FOR JSON PATH
        )) AS resultadosPorPuesto,
        JSON_QUERY((
          SELECT
            s.EscenarioCodigo AS escenarioCodigo,
            s.Escenario AS escenario,
            COUNT(DISTINCT s.IdEvaluado) AS empleadosEvaluados,
            COUNT(DISTINCT s.IdEvaluacion) AS evaluaciones,
            CAST(AVG(s.Resultado) AS DECIMAL(18,4)) AS resultadoPromedio,
            CAST(AVG(s.Resultado) AS DECIMAL(18,4)) AS calificacionPromedio,
            CAST(AVG(s.NivelExigencia) AS DECIMAL(18,4)) AS nivelExigenciaPromedio,
            CAST(AVG(s.Resultado-s.NivelExigencia) AS DECIMAL(18,4)) AS brechaPromedio
          FROM #Escenarios s
          GROUP BY s.EscenarioCodigo,s.Escenario
          ORDER BY s.EscenarioCodigo
          FOR JSON PATH
        )) AS resultadosPorEscenario,
        JSON_QUERY((
          SELECT
            d.IdModeloDimension AS dimensionId,
            d.DimensionCodigo AS dimensionCodigo,
            d.Dimension AS dimension,
            COUNT(DISTINCT d.IdEvaluado) AS empleadosEvaluados,
            CAST(AVG(d.Resultado) AS DECIMAL(18,4)) AS resultadoPromedio,
            CAST(AVG(d.Resultado) AS DECIMAL(18,4)) AS calificacionPromedio,
            CAST(AVG(d.NivelExigencia) AS DECIMAL(18,4)) AS nivelExigenciaPromedio,
            CAST(AVG(d.Resultado-d.NivelExigencia) AS DECIMAL(18,4)) AS brechaPromedio
          FROM #Dimensiones d
          GROUP BY d.IdModeloDimension,d.DimensionCodigo,d.Dimension
          ORDER BY brechaPromedio,d.Dimension
          FOR JSON PATH
        )) AS resultadosPorDimension,
        JSON_QUERY((
          SELECT TOP (20)
            c.IdCriterioEvaluacion AS criterioId,
            c.CriterioCodigo AS criterioCodigo,
            c.Criterio AS criterio,
            c.Dimension AS dimension,
            c.EscenarioCodigo AS escenarioCodigo,
            COUNT(DISTINCT c.IdEvaluado) AS empleadosEvaluados,
            CAST(AVG(c.Resultado) AS DECIMAL(18,4)) AS resultadoPromedio,
            CAST(AVG(c.Resultado) AS DECIMAL(18,4)) AS calificacionPromedio,
            CAST(AVG(c.NivelExigencia) AS DECIMAL(18,4)) AS nivelExigenciaPromedio,
            CAST(AVG(c.Resultado-c.NivelExigencia) AS DECIMAL(18,4)) AS brechaPromedio
          FROM #Criterios c
          GROUP BY c.IdCriterioEvaluacion,c.CriterioCodigo,c.Criterio,c.Dimension,c.EscenarioCodigo
          ORDER BY brechaPromedio ASC,c.Criterio
          FOR JSON PATH
        )) AS brechasCriticas,
        JSON_QUERY((
          SELECT TOP (20)
            c.IdCriterioEvaluacion AS criterioId,
            c.CriterioCodigo AS criterioCodigo,
            c.Criterio AS criterio,
            c.Dimension AS dimension,
            c.EscenarioCodigo AS escenarioCodigo,
            COUNT(DISTINCT c.IdEvaluado) AS empleadosEvaluados,
            CAST(AVG(c.Resultado) AS DECIMAL(18,4)) AS resultadoPromedio,
            CAST(AVG(c.Resultado) AS DECIMAL(18,4)) AS calificacionPromedio,
            CAST(AVG(c.NivelExigencia) AS DECIMAL(18,4)) AS nivelExigenciaPromedio,
            CAST(AVG(c.Resultado-c.NivelExigencia) AS DECIMAL(18,4)) AS brechaPromedio
          FROM #Criterios c
          GROUP BY c.IdCriterioEvaluacion,c.CriterioCodigo,c.Criterio,c.Dimension,c.EscenarioCodigo
          ORDER BY brechaPromedio DESC,c.Criterio
          FOR JSON PATH
        )) AS fortalezas,
        JSON_QUERY((
          SELECT
            a.EstadoAsignacion AS estadoCodigo,
            COUNT(*) AS total
          FROM #Asignaciones a
          GROUP BY a.EstadoAsignacion
          ORDER BY a.EstadoAsignacion
          FOR JSON PATH
        )) AS asignacionesPorEstado,
        JSON_QUERY((
          SELECT
            en.Estado AS estadoCodigo,
            COUNT(*) AS total
          FROM dbo.DES_EnvioEncuestaEmpleado en
          WHERE en.IdOrganizacion=@IdOrganizacion
            AND en.Activo=1
          GROUP BY en.Estado
          ORDER BY en.Estado
          FOR JSON PATH
        )) AS enviosPorEstado
      FOR JSON PATH, WITHOUT_ARRAY_WRAPPER
    );

    DROP TABLE #ResultadosEmpleado;
    DROP TABLE #Escenarios;
    DROP TABLE #Dimensiones;
    DROP TABLE #Criterios;
    DROP TABLE #Puntajes;
    DROP TABLE #Asignaciones;
    DROP TABLE #Evaluaciones;

    SELECT @DataJson AS DataJson;
END
GO

go


----
CREATE OR ALTER PROCEDURE dbo.DES_sp_Respuestas_Modelo_Agrupadas_Obtener
    @IdOrganizacion INT,
    @IdModelo INT
AS
BEGIN
    SET NOCOUNT ON;

    IF @IdOrganizacion IS NULL OR @IdOrganizacion <= 0
       OR NOT EXISTS (SELECT 1 FROM dbo.Organizaciones WHERE Id = @IdOrganizacion)
        THROW 52001, 'No existe la organizacion indicada.', 1;

    IF @IdModelo IS NULL OR @IdModelo <= 0
       OR NOT EXISTS (
            SELECT 1
            FROM dbo.DES_Modelo
            WHERE IdModelo = @IdModelo
              AND IdOrganizacion = @IdOrganizacion
       )
        THROW 52101, 'No existe el modelo indicado.', 1;

    SELECT
        e.IdEvaluacion,
        e.Nombre AS Evaluacion,
        e.FechaInicio AS FechaInicioEvaluacion,
        e.FechaCierre AS FechaCierreEvaluacion,
        a.IdAsignacion,
        a.IdModeloPuestoEscenario,
        a.IdEvaluador,
        LTRIM(RTRIM(CONCAT(ISNULL(evdr.Nombres, N''), N' ', ISNULL(evdr.Apellidos, N'')))) AS Evaluador,
        evdr.Email AS EvaluadorEmail,
        evdr.Cargo AS EvaluadorCargo,
        a.IdEvaluado,
        LTRIM(RTRIM(CONCAT(ISNULL(evdo.Nombres, N''), N' ', ISNULL(evdo.Apellidos, N'')))) AS Evaluado,
        evdo.Email AS EvaluadoEmail,
        evdo.Cargo AS EvaluadoCargo,
        mp.IdPuesto,
        p.Codigo AS PuestoCodigo,
        p.Nombre AS Puesto,
        ce.IdEscenario,
        ce.Codigo AS EscenarioCodigo,
        ce.Nombre AS Escenario,
        a.EsAnonima,
        COALESCE(me.MinimoRespuestasAnonimas, m.MinimoRespuestasAnonimas, 3) AS MinimoRespuestasAnonimas,
        ea.Codigo AS EstadoAsignacion,
        er.Codigo AS EstadoRespuesta,
        a.FechaInicioRespuesta,
        a.FechaRespuesta,
        r.IdRespuesta,
        r.FechaInicio AS FechaInicioRespuestaRegistro,
        r.FechaModificacion AS FechaModificacionRespuesta,
        r.FechaFinalizacion
    INTO #AsignacionesRespondidas
    FROM dbo.DES_Evaluacion e
    INNER JOIN dbo.DES_Modelo m
        ON m.IdModelo = e.IdModelo
    INNER JOIN dbo.DES_AsignacionEvaluacion a
        ON a.IdEvaluacion = e.IdEvaluacion
       AND a.Activo = 1
    INNER JOIN dbo.DES_CatEstadoAsignacion ea
        ON ea.IdEstadoAsignacion = a.IdEstadoAsignacion
    LEFT JOIN dbo.DES_RespuestaEvaluacion r
        ON r.IdAsignacion = a.IdAsignacion
    LEFT JOIN dbo.DES_CatEstadoRespuesta er
        ON er.IdEstadoRespuesta = r.IdEstadoRespuesta
    INNER JOIN dbo.Empleados evdr
        ON evdr.Id = a.IdEvaluador
    INNER JOIN dbo.Empleados evdo
        ON evdo.Id = a.IdEvaluado
    INNER JOIN dbo.DES_ModeloPuestoEscenario mpe
        ON mpe.IdModeloPuestoEscenario = a.IdModeloPuestoEscenario
    INNER JOIN dbo.DES_ModeloPuesto mp
        ON mp.IdModeloPuesto = mpe.IdModeloPuesto
    INNER JOIN dbo.DES_Puesto p
        ON p.IdPuesto = mp.IdPuesto
    INNER JOIN dbo.DES_ModeloEscenario me
        ON me.IdModeloEscenario = mpe.IdModeloEscenario
    INNER JOIN dbo.DES_CatEscenario ce
        ON ce.IdEscenario = me.IdEscenario
    WHERE e.IdOrganizacion = @IdOrganizacion
      AND e.IdModelo = @IdModelo
      AND e.Activo = 1
      AND (
          ea.Codigo = N'RESPONDIDA'
          OR er.Codigo = N'FINALIZADA'
          OR a.FechaRespuesta IS NOT NULL
          OR r.FechaFinalizacion IS NOT NULL
      );

    SELECT
        a.IdEvaluacion,
        a.Evaluacion,
        a.FechaInicioEvaluacion,
        a.FechaCierreEvaluacion,
        a.IdAsignacion,
        a.IdEvaluador,
        a.Evaluador,
        a.EvaluadorEmail,
        a.EvaluadorCargo,
        a.IdEvaluado,
        a.Evaluado,
        a.EvaluadoEmail,
        a.EvaluadoCargo,
        a.IdPuesto,
        a.PuestoCodigo,
        a.Puesto,
        a.IdEscenario,
        a.EscenarioCodigo,
        a.Escenario,
        a.EsAnonima,
        a.EstadoAsignacion,
        a.EstadoRespuesta,
        a.FechaInicioRespuesta,
        a.FechaRespuesta,
        a.IdRespuesta,
        a.FechaInicioRespuestaRegistro,
        a.FechaModificacionRespuesta,
        a.FechaFinalizacion,
        d.IdModeloDimension,
        d.Codigo AS DimensionCodigo,
        d.Nombre AS Dimension,
        d.Ponderacion AS PonderacionDimension,
        d.Orden AS DimensionOrden,
        c.IdCriterioEvaluacion,
        c.Codigo AS CriterioCodigo,
        c.Nombre AS Criterio,
        c.Ponderacion AS PonderacionCriterio,
        c.NivelExigencia,
        c.Orden AS CriterioOrden,
        i.IdItemEvaluativo,
        i.Codigo AS ItemCodigo,
        i.Texto AS ItemTexto,
        i.Orden AS ItemOrden,
        ti.Codigo AS TipoItemCodigo,
        ti.Nombre AS TipoItem,
        ti.UsaEscala,
        ti.PermiteTexto,
        ti.PermiteSeleccionMultiple,
        rd.IdRespuestaDetalle,
        rd.IdEscalaValor,
        CAST(sv.Valor AS DECIMAL(18,4)) AS EscalaValor,
        sv.Etiqueta AS EscalaEtiqueta,
        rd.ValorNumero,
        rd.ValorTexto,
        rd.NoAplica,
        rd.FechaRespuesta AS FechaRespuestaItem
    INTO #Respuestas
    FROM #AsignacionesRespondidas a
    INNER JOIN dbo.DES_RespuestaDetalle rd
        ON rd.IdRespuesta = a.IdRespuesta
    INNER JOIN dbo.DES_ItemEvaluativo i
        ON i.IdItemEvaluativo = rd.IdItemEvaluativo
       AND i.Activo = 1
    INNER JOIN dbo.DES_CatTipoItem ti
        ON ti.IdTipoItem = i.IdTipoItem
    INNER JOIN dbo.DES_CriterioEvaluacion c
        ON c.IdCriterioEvaluacion = i.IdCriterioEvaluacion
       AND c.Activo = 1
    INNER JOIN dbo.DES_ModeloDimension d
        ON d.IdModeloDimension = c.IdModeloDimension
       AND d.Activo = 1
    LEFT JOIN dbo.DES_EscalaValor sv
        ON sv.IdEscalaValor = rd.IdEscalaValor
    -- Este endpoint es de detalle administrativo: retorna las respuestas
    -- contestadas. La identidad del evaluador se oculta mas abajo cuando
    -- la asignacion es anonima.

    DECLARE @DataJson NVARCHAR(MAX);

    SELECT @DataJson = (
        SELECT
            @IdOrganizacion AS organizacionId,
            m.IdModelo AS modeloId,
            m.Codigo AS modeloCodigo,
            m.Nombre AS modelo,
            m.Version AS modeloVersion,
            SYSDATETIME() AS fechaGeneracion,
            JSON_QUERY((
                SELECT
                    (SELECT COUNT(DISTINCT IdEvaluacion) FROM #AsignacionesRespondidas) AS totalEvaluaciones,
                    (SELECT COUNT(DISTINCT IdAsignacion) FROM #AsignacionesRespondidas) AS totalEncuestasRespondidas,
                    (SELECT COUNT(DISTINCT IdAsignacion) FROM #Respuestas) AS totalEncuestasConDetalleVisible,
                    (SELECT COUNT(DISTINCT IdPuesto) FROM #Respuestas) AS totalPuestos,
                    (SELECT COUNT(DISTINCT IdEvaluado) FROM #Respuestas) AS totalEmpleadosEvaluados,
                    (SELECT COUNT(*) FROM #Respuestas) AS totalItemsRespondidos
                FOR JSON PATH, WITHOUT_ARRAY_WRAPPER
            )) AS resumen,
            JSON_QUERY(COALESCE((
                SELECT
                    p.IdPuesto AS puestoId,
                    p.PuestoCodigo AS puestoCodigo,
                    p.Puesto AS puesto,
                    COUNT(DISTINCT p.IdEvaluado) AS empleadosEvaluados,
                    COUNT(DISTINCT p.IdAsignacion) AS encuestasRespondidas,
                    COUNT(*) AS itemsRespondidos,
                    JSON_QUERY((
                        SELECT
                            emp.IdEvaluado AS empleadoId,
                            emp.Evaluado AS empleado,
                            emp.EvaluadoEmail AS email,
                            emp.EvaluadoCargo AS cargo,
                            COUNT(DISTINCT emp.IdAsignacion) AS encuestasRespondidas,
                            COUNT(DISTINCT emp.IdEscenario) AS escenariosRespondidos,
                            COUNT(*) AS itemsRespondidos,
                            JSON_QUERY((
                                SELECT
                                    enc.IdEvaluacion AS evaluacionId,
                                    enc.Evaluacion AS evaluacion,
                                    enc.FechaInicioEvaluacion AS fechaInicioEvaluacion,
                                    enc.FechaCierreEvaluacion AS fechaCierreEvaluacion,
                                    enc.IdAsignacion AS asignacionId,
                                    enc.IdEscenario AS escenarioId,
                                    enc.EscenarioCodigo AS escenarioCodigo,
                                    enc.Escenario AS escenario,
                                    enc.EsAnonima AS esAnonima,
                                    CASE WHEN enc.EsAnonima = 1 THEN NULL ELSE enc.IdEvaluador END AS evaluadorId,
                                    CASE WHEN enc.EsAnonima = 1 THEN NULL ELSE enc.Evaluador END AS evaluador,
                                    CASE WHEN enc.EsAnonima = 1 THEN NULL ELSE enc.EvaluadorEmail END AS evaluadorEmail,
                                    enc.EstadoAsignacion AS estadoAsignacion,
                                    enc.EstadoRespuesta AS estadoRespuesta,
                                    enc.FechaInicioRespuesta AS fechaInicioRespuesta,
                                    enc.FechaRespuesta AS fechaRespuesta,
                                    enc.FechaFinalizacion AS fechaFinalizacion,
                                    JSON_QUERY((
                                        SELECT
                                            dim.IdModeloDimension AS dimensionId,
                                            dim.DimensionCodigo AS dimensionCodigo,
                                            dim.Dimension AS dimension,
                                            dim.PonderacionDimension AS ponderacion,
                                            COUNT(DISTINCT dim.IdCriterioEvaluacion) AS criteriosRespondidos,
                                            COUNT(*) AS itemsRespondidos,
                                            JSON_QUERY((
                                                SELECT
                                                    cri.IdCriterioEvaluacion AS criterioId,
                                                    cri.CriterioCodigo AS criterioCodigo,
                                                    cri.Criterio AS criterio,
                                                    cri.PonderacionCriterio AS ponderacion,
                                                    cri.NivelExigencia AS nivelExigencia,
                                                    COUNT(*) AS itemsRespondidos,
                                                    JSON_QUERY((
                                                        SELECT
                                                            itm.IdItemEvaluativo AS itemId,
                                                            itm.ItemCodigo AS itemCodigo,
                                                            itm.ItemTexto AS texto,
                                                            itm.TipoItemCodigo AS tipoItemCodigo,
                                                            itm.TipoItem AS tipoItem,
                                                            itm.UsaEscala AS usaEscala,
                                                            itm.PermiteTexto AS permiteTexto,
                                                            itm.PermiteSeleccionMultiple AS permiteSeleccionMultiple,
                                                            itm.IdEscalaValor AS escalaValorId,
                                                            itm.EscalaValor AS escalaValor,
                                                            itm.EscalaEtiqueta AS escalaEtiqueta,
                                                            itm.ValorNumero AS valorNumero,
                                                            itm.ValorTexto AS valorTexto,
                                                            itm.NoAplica AS noAplica,
                                                            itm.FechaRespuestaItem AS fechaRespuesta,
                                                            JSON_QUERY((
                                                                SELECT
                                                                    ro.IdEscalaValor AS id,
                                                                    CAST(op.Valor AS DECIMAL(18,4)) AS valor,
                                                                    op.Etiqueta AS etiqueta
                                                                FROM dbo.DES_RespuestaDetalleOpcion ro
                                                                INNER JOIN dbo.DES_EscalaValor op
                                                                    ON op.IdEscalaValor = ro.IdEscalaValor
                                                                WHERE ro.IdRespuestaDetalle = itm.IdRespuestaDetalle
                                                                ORDER BY op.Orden, op.IdEscalaValor
                                                                FOR JSON PATH
                                                            )) AS opciones
                                                        FROM #Respuestas itm
                                                        WHERE itm.IdAsignacion = cri.IdAsignacion
                                                          AND itm.IdModeloDimension = cri.IdModeloDimension
                                                          AND itm.IdCriterioEvaluacion = cri.IdCriterioEvaluacion
                                                        ORDER BY itm.ItemOrden, itm.IdItemEvaluativo
                                                        FOR JSON PATH
                                                    )) AS items
                                                FROM #Respuestas cri
                                                WHERE cri.IdAsignacion = dim.IdAsignacion
                                                  AND cri.IdModeloDimension = dim.IdModeloDimension
                                                GROUP BY
                                                    cri.IdAsignacion,
                                                    cri.IdModeloDimension,
                                                    cri.IdCriterioEvaluacion,
                                                    cri.CriterioCodigo,
                                                    cri.Criterio,
                                                    cri.PonderacionCriterio,
                                                    cri.NivelExigencia,
                                                    cri.CriterioOrden
                                                ORDER BY cri.CriterioOrden, cri.IdCriterioEvaluacion
                                                FOR JSON PATH
                                            )) AS criterios
                                        FROM #Respuestas dim
                                        WHERE dim.IdAsignacion = enc.IdAsignacion
                                        GROUP BY
                                            dim.IdAsignacion,
                                            dim.IdModeloDimension,
                                            dim.DimensionCodigo,
                                            dim.Dimension,
                                            dim.PonderacionDimension,
                                            dim.DimensionOrden
                                        ORDER BY dim.DimensionOrden, dim.IdModeloDimension
                                        FOR JSON PATH
                                    )) AS dimensiones
                                FROM (
                                    SELECT DISTINCT
                                        IdEvaluacion,
                                        Evaluacion,
                                        FechaInicioEvaluacion,
                                        FechaCierreEvaluacion,
                                        IdAsignacion,
                                        IdPuesto,
                                        IdEvaluado,
                                        IdEvaluador,
                                        Evaluador,
                                        EvaluadorEmail,
                                        IdEscenario,
                                        EscenarioCodigo,
                                        Escenario,
                                        EsAnonima,
                                        EstadoAsignacion,
                                        EstadoRespuesta,
                                        FechaInicioRespuesta,
                                        FechaRespuesta,
                                        FechaFinalizacion
                                    FROM #Respuestas
                                ) enc
                                WHERE enc.IdPuesto = emp.IdPuesto
                                  AND enc.IdEvaluado = emp.IdEvaluado
                                ORDER BY
                                    enc.FechaFinalizacion DESC,
                                    enc.FechaRespuesta DESC,
                                    enc.EscenarioCodigo,
                                    enc.IdAsignacion
                                FOR JSON PATH
                            )) AS encuestas
                        FROM #Respuestas emp
                        WHERE emp.IdPuesto = p.IdPuesto
                        GROUP BY
                            emp.IdPuesto,
                            emp.IdEvaluado,
                            emp.Evaluado,
                            emp.EvaluadoEmail,
                            emp.EvaluadoCargo
                        ORDER BY emp.Evaluado, emp.IdEvaluado
                        FOR JSON PATH
                    )) AS empleados
                FROM #Respuestas p
                GROUP BY p.IdPuesto, p.PuestoCodigo, p.Puesto
                ORDER BY p.Puesto, p.IdPuesto
                FOR JSON PATH
            ), N'[]')) AS puestos
        FROM dbo.DES_Modelo m
        WHERE m.IdModelo = @IdModelo
          AND m.IdOrganizacion = @IdOrganizacion
        FOR JSON PATH, WITHOUT_ARRAY_WRAPPER
    );

    DROP TABLE #Respuestas;
    DROP TABLE #AsignacionesRespondidas;

    SELECT @DataJson AS DataJson;
END
GO



----

CREATE OR ALTER PROCEDURE dbo.DES_sp_Modelos_Select_Listar
    @IdOrganizacion INT,
    @SoloActivos BIT = 1
AS
BEGIN
    SET NOCOUNT ON;

    IF @IdOrganizacion IS NULL OR @IdOrganizacion <= 0
       OR NOT EXISTS (
            SELECT 1
            FROM dbo.Organizaciones
            WHERE Id = @IdOrganizacion
       )
        THROW 52001, 'No existe la organizacion indicada.', 1;

    SELECT
        m.IdModelo AS id,
        m.Nombre AS nombre
    FROM dbo.DES_Modelo m
    WHERE m.IdOrganizacion = @IdOrganizacion
      AND (@SoloActivos IS NULL OR @SoloActivos = 0 OR m.Activo = 1)
    ORDER BY m.Nombre, m.IdModelo;
END
GO


--ANALISIS IA DESEPEÑO
CREATE OR ALTER PROCEDURE dbo.DES_sp_AnalisisResultadosIA_Obtener
    @IdOrganizacion INT,
    @IdModelo INT,
    @HashResultados NVARCHAR(64),
    @PromptVersion NVARCHAR(80) = NULL
AS
BEGIN
    SET NOCOUNT ON;

    SELECT TOP (1)
        IdAnalisisResultadoIA,
        IdOrganizacion,
        IdModelo,
        HashResultados,
        PromptVersion,
        ModeloIA,
        ResultadoJson,
        EvidenciaJson,
        OpenAIResponseId,
        TokensEntrada,
        TokensSalida,
        TokensTotal,
        FechaCreacion,
        FechaModificacion
    FROM dbo.DES_AnalisisResultadoIA
    WHERE IdOrganizacion = @IdOrganizacion
      AND IdModelo = @IdModelo
      AND HashResultados = @HashResultados
      AND (@PromptVersion IS NULL OR PromptVersion = @PromptVersion)
      AND Activo = 1
    ORDER BY ISNULL(FechaModificacion, FechaCreacion) DESC,
             IdAnalisisResultadoIA DESC;
END
GO


CREATE OR ALTER PROCEDURE dbo.DES_sp_AnalisisResultadosIA_Guardar
    @IdOrganizacion INT,
    @IdModelo INT,
    @HashResultados NVARCHAR(64),
    @ModeloIA NVARCHAR(80),
    @PromptVersion NVARCHAR(80),
    @ResultadoJson NVARCHAR(MAX),
    @EvidenciaJson NVARCHAR(MAX) = NULL,
    @OpenAIResponseId NVARCHAR(120) = NULL,
    @TokensEntrada INT = NULL,
    @TokensSalida INT = NULL,
    @TokensTotal INT = NULL,
    @Usuario NVARCHAR(100) = NULL
AS
BEGIN
    SET NOCOUNT ON;
    SET XACT_ABORT ON;

    IF NOT EXISTS (SELECT 1 FROM dbo.Organizaciones WHERE Id = @IdOrganizacion)
        THROW 52001, 'No existe la organizacion indicada.', 1;

    IF NOT EXISTS (
        SELECT 1
        FROM dbo.DES_Modelo
        WHERE IdModelo = @IdModelo
          AND IdOrganizacion = @IdOrganizacion
    )
        THROW 52101, 'No existe el modelo indicado.', 1;

    IF @HashResultados IS NULL OR LEN(@HashResultados) <> 64
        THROW 52104, 'El hash de resultados es invalido.', 1;

    IF ISJSON(@ResultadoJson) <> 1
        THROW 52104, 'El JSON de resultado IA es invalido.', 1;

    IF @EvidenciaJson IS NOT NULL AND ISJSON(@EvidenciaJson) <> 1
        THROW 52104, 'El JSON de evidencia IA es invalido.', 1;

    IF EXISTS (
        SELECT 1
        FROM dbo.DES_AnalisisResultadoIA WITH (UPDLOCK, HOLDLOCK)
        WHERE IdOrganizacion = @IdOrganizacion
          AND IdModelo = @IdModelo
          AND HashResultados = @HashResultados
          AND PromptVersion = @PromptVersion
    )
    BEGIN
        UPDATE dbo.DES_AnalisisResultadoIA
        SET ModeloIA = @ModeloIA,
            ResultadoJson = @ResultadoJson,
            EvidenciaJson = @EvidenciaJson,
            OpenAIResponseId = @OpenAIResponseId,
            TokensEntrada = @TokensEntrada,
            TokensSalida = @TokensSalida,
            TokensTotal = @TokensTotal,
            FechaModificacion = SYSDATETIME(),
            UsuarioModificacion = @Usuario,
            Activo = 1
        WHERE IdOrganizacion = @IdOrganizacion
          AND IdModelo = @IdModelo
          AND HashResultados = @HashResultados
          AND PromptVersion = @PromptVersion;
    END
    ELSE
    BEGIN
        INSERT dbo.DES_AnalisisResultadoIA (
            IdOrganizacion,
            IdModelo,
            HashResultados,
            PromptVersion,
            ModeloIA,
            ResultadoJson,
            EvidenciaJson,
            OpenAIResponseId,
            TokensEntrada,
            TokensSalida,
            TokensTotal,
            UsuarioCreacion
        )
        VALUES (
            @IdOrganizacion,
            @IdModelo,
            @HashResultados,
            @PromptVersion,
            @ModeloIA,
            @ResultadoJson,
            @EvidenciaJson,
            @OpenAIResponseId,
            @TokensEntrada,
            @TokensSalida,
            @TokensTotal,
            @Usuario
        );
    END

    SELECT TOP (1)
        IdAnalisisResultadoIA,
        IdOrganizacion,
        IdModelo,
        HashResultados,
        PromptVersion,
        ModeloIA,
        ResultadoJson,
        EvidenciaJson,
        OpenAIResponseId,
        TokensEntrada,
        TokensSalida,
        TokensTotal,
        FechaCreacion,
        FechaModificacion
    FROM dbo.DES_AnalisisResultadoIA
    WHERE IdOrganizacion = @IdOrganizacion
      AND IdModelo = @IdModelo
      AND HashResultados = @HashResultados
      AND PromptVersion = @PromptVersion
      AND Activo = 1
    ORDER BY IdAnalisisResultadoIA DESC;
END
GO

CREATE OR ALTER PROCEDURE dbo.DES_sp_AnalisisResultadosIA_ListarPorModelo
    @IdOrganizacion INT,
    @IdModelo INT
AS
BEGIN
    SET NOCOUNT ON;

    IF NOT EXISTS (SELECT 1 FROM dbo.Organizaciones WHERE Id = @IdOrganizacion)
        THROW 52001, 'No existe la organizacion indicada.', 1;

    IF NOT EXISTS (
        SELECT 1
        FROM dbo.DES_Modelo
        WHERE IdModelo = @IdModelo
          AND IdOrganizacion = @IdOrganizacion
    )
        THROW 52101, 'No existe el modelo indicado.', 1;

    SELECT
        IdAnalisisResultadoIA,
        IdOrganizacion,
        IdModelo,
        HashResultados,
        PromptVersion,
        ModeloIA,
        ResultadoJson,
        OpenAIResponseId,
        TokensEntrada,
        TokensSalida,
        TokensTotal,
        FechaCreacion,
        FechaModificacion
    FROM dbo.DES_AnalisisResultadoIA
    WHERE IdOrganizacion = @IdOrganizacion
      AND IdModelo = @IdModelo
      AND Activo = 1
    ORDER BY ISNULL(FechaModificacion, FechaCreacion) DESC,
             IdAnalisisResultadoIA DESC;
END
GO



PRINT N'Procedimientos de negocio DES_ creados correctamente.';
GO
