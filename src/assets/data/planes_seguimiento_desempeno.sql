
--producción
--use JUSTLINK_DB 
--go

--desarrollo
use JUSTLINK_DESA_DB2
go



select * from dbo.Menu
select * from menuaction
select * from dbo.RoleMenuAction


--reordenamiento de menu

------INICIA GENERAR INSERT DE TABLA
/**/
DECLARE @SchemaName SYSNAME = 'dbo';
DECLARE @TableName  SYSNAME = 'JL_Plan';

DECLARE @ColumnList NVARCHAR(MAX);
DECLARE @ValueList  NVARCHAR(MAX);
DECLARE @SQL        NVARCHAR(MAX);

-- Columnas que pueden insertarse
SELECT @ColumnList = STRING_AGG(QUOTENAME(c.name), ', ')
                    WITHIN GROUP (ORDER BY c.column_id)
FROM sys.columns c
INNER JOIN sys.tables t
    ON t.object_id = c.object_id
INNER JOIN sys.schemas s
    ON s.schema_id = t.schema_id
WHERE t.name = @TableName
  AND s.name = @SchemaName
  AND c.is_computed = 0
  AND c.system_type_id <> 189; -- timestamp / rowversion


-- Construcción de los valores según el tipo de dato
SELECT @ValueList = STRING_AGG(
    CAST(
        CASE
            -- Texto
            WHEN ty.name IN (
                'varchar', 'nvarchar',
                'char', 'nchar',
                'text', 'ntext',
                'xml'
            )
            THEN
                'CASE WHEN ' + QUOTENAME(c.name) + ' IS NULL ' +
                'THEN ''NULL'' ' +
                'ELSE ''N'''''' + REPLACE(CONVERT(NVARCHAR(MAX), ' +
                QUOTENAME(c.name) +
                '), '''''''', '''''''''''') + '''''''' END'

            -- Fechas
            WHEN ty.name IN (
                'date',
                'datetime',
                'datetime2',
                'smalldatetime',
                'datetimeoffset',
                'time'
            )
            THEN
                'CASE WHEN ' + QUOTENAME(c.name) + ' IS NULL ' +
                'THEN ''NULL'' ' +
                'ELSE '''''''' + CONVERT(NVARCHAR(50), ' +
                QUOTENAME(c.name) +
                ', 126) + '''''''' END'

            -- uniqueidentifier
            WHEN ty.name = 'uniqueidentifier'
            THEN
                'CASE WHEN ' + QUOTENAME(c.name) + ' IS NULL ' +
                'THEN ''NULL'' ' +
                'ELSE '''''''' + CONVERT(NVARCHAR(50), ' +
                QUOTENAME(c.name) +
                ') + '''''''' END'

            -- bit
            WHEN ty.name = 'bit'
            THEN
                'CASE WHEN ' + QUOTENAME(c.name) + ' IS NULL ' +
                'THEN ''NULL'' ' +
                'ELSE CONVERT(VARCHAR(1), ' +
                QUOTENAME(c.name) +
                ') END'

            -- Binarios
            WHEN ty.name IN ('binary', 'varbinary', 'image')
            THEN
                'CASE WHEN ' + QUOTENAME(c.name) + ' IS NULL ' +
                'THEN ''NULL'' ' +
                'ELSE ''0x'' + CONVERT(VARCHAR(MAX), ' +
                QUOTENAME(c.name) +
                ', 2) END'

            -- Numéricos
            ELSE
                'CASE WHEN ' + QUOTENAME(c.name) + ' IS NULL ' +
                'THEN ''NULL'' ' +
                'ELSE CONVERT(NVARCHAR(MAX), ' +
                QUOTENAME(c.name) +
                ') END'
        END
    AS NVARCHAR(MAX)),
    ' + '', '' + '
) WITHIN GROUP (ORDER BY c.column_id)

FROM sys.columns c
INNER JOIN sys.tables t
    ON t.object_id = c.object_id
INNER JOIN sys.schemas s
    ON s.schema_id = t.schema_id
INNER JOIN sys.types ty
    ON ty.user_type_id = c.user_type_id
WHERE t.name = @TableName
  AND s.name = @SchemaName
  AND c.is_computed = 0
  AND c.system_type_id <> 189;


SET @SQL =
    'SELECT ''INSERT INTO ' +
    QUOTENAME(@SchemaName) + '.' +
    QUOTENAME(@TableName) +
    ' (' + @ColumnList + ') VALUES ('' + ' +
    @ValueList +
    ' + '');'' AS InsertSQL ' +
    'FROM ' +
    QUOTENAME(@SchemaName) + '.' +
    QUOTENAME(@TableName) + ';';


EXEC sp_executesql @SQL;

select * from JL_PlanFeature
select * from JL_Plan


--INSERT INTO [dbo].[JL_Plan] ([IdPlan], [CodigoPlan], [CodigoExternoPagadito], [Nombre], [Descripcion], [Periodicidad], [DuracionMeses], [Precio], [Moneda], [EsLibre], [EsRecomendado], [Orden], [MaxUsuarios], [MaxEmpleados], [MaxParticipantesActivos], [MaxEncuestasClima], [MaxEvaluacionesDesempeno], [MaxEnviosCorreo], [MaxEnviosWhatsApp], [MaxEnviosSms], [IncluyeCorreo], [IncluyeWhatsApp], [IncluyeSms], [IncluyeDashboard], [IncluyeIA], [IncluyeReportes], [IncluyeSeguimientoPlanes], [IncluyeCapacitacion], [IncluyeAsesoria], [NivelSoporte], [Activo], [CreatedAtUtc], [UpdatedAtUtc]) VALUES (1, N'RENTA_ANUAL', N'code_plan_anual', N'Renta anual', N'Para organizaciones que miden, actuan y dan seguimiento todo el ano.', N'ANUAL', 12, 29000.00, N'USD', 0, 1, 2, NULL, 1000, 1000, NULL, NULL, NULL, NULL, NULL, 1, 1, 1, 1, 1, 1, 1, 1, 1, N'PRIORITARIO', 1, '2026-07-13T04:29:38.068', NULL);



-----FINALIZA GENERAR INSERT DE TABLA

--INSERT INTO [dbo].[Menu] ([ParentMenuId], [Name], [DisplayOrder], [IsActive], [CreatedAt], [Path], [Title], [IconType], [Icon], [Class], [IsGroupTitle], [Badge], [BadgeClass]) 
--VALUES (NULL, N'MENUITEMS.MAIN.LINES', 1, 1, GETDATE(), N'', N'MENUITEMS.MAIN.LINES', N'', N'', N'', 1, N'', N'');





--INSERT INTO [dbo].[Menu] ([ParentMenuId], [Name], [DisplayOrder], [IsActive], [CreatedAt], [Path], [Title], [IconType], [Icon], [Class], [IsGroupTitle], [Badge], [BadgeClass]) 
  --                VALUES (31, N'MENUITEMS.ACTIONDESEMPENIO.TEXT', 2, 1, GETDATE(), N'/desempeno/planes-seguimiento', N'MENUITEMS.ACTIONDESEMPENIO.TEXT', N'', N'', N'', 0, N'', N'');

--INSERT INTO [dbo].[menuaction] ([MenuId], [Code], [Name], [Description], [IsActive], [CreatedAt], [Path], [Title], [IconType], [Icon], [Class], [IsGroupTitle], [Badge], [BadgeClass]) 
  --          VALUES (37, N'viewdesactionsplans', N'MENUITEMS.SECURE.ACCESSDATA.ACTIONPLAINS', N'MENUITEMS.SECURE.ACCESSDATA.ACTIONPLAINSDESC', 1, GETDATE(), NULL, NULL, NULL, NULL, NULL, 0, NULL, NULL);




--INSERT INTO [dbo].[RoleMenuAction] ([RoleId], [ActionId], [Granted], [AssignedAt]) VALUES (1, 38, 1, getdate());

SELECT * FROM PagaditoWebhookEvent order by 1 desc


select * from LogsEnvio order by 1 desc


select * from Organizaciones order by 1 desc



select * from dbo.flujosclima --119

select * from EncuestasEmpleados where IdFlujo = 119

select Id from Factores where IdFlujo = 119

select * from preguntas where IdFactor in (select Id from Factores where IdFlujo = 119)

--tipo select para 119
1668
1669

select * 
from Respuestas 
where IdPregunta in (select Id from preguntas 
                     where IdFactor in (select Id from Factores where IdFlujo = 119)
                     and Id in (1668,1669))

--update Respuestas set IdOpcion = 5586 where Id = 83358


select * from OpcionesPregunta where IdPregunta in (1668,1669)

select * from flujosclima

select * from DES_Evaluacion

select * from DES_EmpleadoPuesto where idempleado in 
(select Id from empleados where idorganizacion  = 403)



select * from des_puesto


select * from Organizaciones

select * from empleados where idorganizacion = 40

select * from DES_CatTipoItem


select * from des_modelo
select * from DES_Evaluacion
select * from des_modelodimension
select * from des_criterioevaluacion
select * from des_itemevaluativo

select * from des_asignacionevaluacion



select * from des_itemevaluativo where idcriterioevaluacion in 
    (select idcriterioevaluacion from des_criterioevaluacion where idmodelodimension in 
        (select idmodelodimension from des_modelodimension where idModelo = 2))


select * from dbo.Menu


--INICIA activar una empresa con asistente IA:

/*
DECLARE @IdOrganizacion INT = 42;
DECLARE @Usuario NVARCHAR(150) = N'josego';

UPDATE dbo.JL_OrganizacionFeature
SET
    Activo = 1,
    FechaInicioUtc = SYSUTCDATETIME(),
    FechaFinUtc = NULL,
    Motivo = N'Habilitación administrativa del asistente IA'
WHERE IdOrganizacion = @IdOrganizacion
  AND CodigoFeature = N'AI_ASSISTANT';

IF @@ROWCOUNT = 0
BEGIN
    INSERT INTO dbo.JL_OrganizacionFeature
    (
        IdOrganizacion,
        CodigoFeature,
        Activo,
        FechaInicioUtc,
        FechaFinUtc,
        Origen,
        Motivo,
        UsuarioCreacion
    )
    VALUES
    (
        @IdOrganizacion,
        N'AI_ASSISTANT',
        1,
        SYSUTCDATETIME(),
        NULL,
        N'MANUAL',
        N'Habilitación administrativa del asistente IA',
        @Usuario
    );
END;
*/

--FINALIZA activar una empresa con asistente IA:

EXEC dbo.AI_sp_AsistenteFeature_Validar
    @IdOrganizacion = 1;


--opcional?? el de arriba funciona
EXEC dbo.AI_sp_AsistenteOrganizacion_Autorizar
    @IdUsuario = N'1',
    @IdOrganizacion = 1;




select * from Organizaciones

select * from camposdemograficos where idorganizacion = 27 --123

select * from empleadodemografico where idCampoDemografico = 126

select DISTINCT Valor from empleadodemografico where idCampoDemografico = 126

select * from [Role]
select * from dbo.[User]
select * from dbo.[UserRole]

SELECT * FROM  menuaction
SELECT * FROM RoleMenuAction

select * from dbo.[Menu]

------
GO

select * from dbo.AI_AsistenteMensaje


SELECT * FROM organizaciones

SELECT * FROM empleados where IdOrganizacion = 1 AND Cargo like '%ASESOR DE CRÉDITOS%'

select * from EmpleadoDemografico where IdEmpleado in (SELECT Id FROM empleados where IdOrganizacion = 1)


select * from dbo.DES_Puesto where IdOrganizacion = 1

select * from DES_EmpleadoPuesto where IdEmpleado = 4475 --in (select id from empleados where IdOrganizacion = 1) AND IdPuesto = 36

--UPDATE DES_EmpleadoPuesto set IdPuesto = 36 where IdEmpleado = 4475

select * from DES_ModeloPuesto

SELECT * FROM DES_ModeloPuestoEscenario

--

select * from FlujosClima
--update FlujosClima set Nombre = 'ENCUESTA CLIMA Y CULTURA 2026' where Id = 128 and IdOrganizacion = 42


select * from DES_Modelo --14
select * from DES_Evaluacion where IdModelo = 14
select * from DES_AsignacionEvaluacion where IdEvaluacion = 12

--update DES_AsignacionEvaluacion set FechaInicioRespuesta = NULL where IdAsignacion in (139,148) and IdEvaluacion = 12


--
select * from Organizaciones --42
select * from FlujosClima where IdOrganizacion = 42 --128

select * from Factores where IdFlujo = 128

--update Factores set Etiqueta = 'Percepción del liderazgo de la Gerencia General. De acuerdo a tu percepción y experiencia, consideras que el Gerente General:' where Id = 470 and IdFlujo = 128 and Clave = 'serie_5'

select * from OpcionesPregunta order by 1 desc



select * from organizaciones 42

select * from flujosclima where idorganizacion = 42 and Estado = 1 --128

select Id from factores where idflujo = 128

select * from preguntas where idfactor in (select Id from factores where idflujo = 128) and Tipo = 'select' and Etiqueta = 'Ha implementado procesos que han mejorado nuestra eficiencia y resultados al cliente.'

select * from OpcionesPregunta where IdPregunta in (2168,
2169,
2170,
2171,
2172,
2173,
2174,
2175)


go

select * from respuestas r
inner join empleados e on e.id = r.IdEmpleado
where r.idpregunta in (select id from preguntas 
  where idfactor in (select Id from factores 
    where idflujo = 128) and Tipo = 'select' and id = 2172
    ) 
--and r.IdOpcion not in (6479,6480,6481,6482,6483,6484,6485,6486,6487,6488,6489,6490,6491,6492,6493,6494,6495,6496,6497,6498,6499,6500,6501,6502,6503,6504,6505,6506,6507,6508,6509,6510,6599,6600,6601,6602,6603,6604,6605,6606)
and e.estado = 1
and e.id not in (4677)
order by r.idempleado, r.idpregunta


select * from OpcionesPregunta where IdPregunta = 2172

select * from respuestas r
inner join empleados e on e.Id = r.IdEmpleado
where r.IdPregunta = 2172
and e.estado = 1
and r.IdOpcion not in (6495,
6496,
6497,
6498,
6603)

--update respuestas set idopcion = 6603 where id = 86636

select * from respuestas where id = 86636





go



--cuantas faltan por responder por empleado:
DECLARE @IdFlujo INT = 128;

SELECT 
    r.IdEmpleado,
    COUNT(*) AS RespuestasRealizadas,
    (
        SELECT COUNT(*)
        FROM Preguntas p
        INNER JOIN Factores f ON f.Id = p.IdFactor
        WHERE f.IdFlujo = @IdFlujo
    ) AS TotalPreguntas,
    (
        SELECT COUNT(*)
        FROM Preguntas p
        INNER JOIN Factores f ON f.Id = p.IdFactor
        WHERE f.IdFlujo = @IdFlujo
    ) - COUNT(*) AS RespuestasFaltantes
FROM Respuestas r
INNER JOIN Preguntas p ON p.Id = r.IdPregunta
INNER JOIN Factores f ON f.Id = p.IdFactor
WHERE f.IdFlujo = @IdFlujo
GROUP BY r.IdEmpleado
ORDER BY r.IdEmpleado;


SELECT 
    r.IdEmpleado,
    COUNT(*) AS CantidadRespuestas
FROM Respuestas r
INNER JOIN Empleados e
    ON e.Id = r.IdEmpleado
INNER JOIN Preguntas p
    ON p.Id = r.IdPregunta
INNER JOIN Factores f
    ON f.Id = p.IdFactor
WHERE f.IdFlujo = 128
  AND e.estado = 1
GROUP BY r.IdEmpleado
ORDER BY r.IdEmpleado;


--ver conteo de respuestas por empleado por flujo
SELECT 
    r.IdEmpleado,
    COUNT(*) AS CantidadRespuestas
FROM Respuestas r
INNER JOIN Empleados e 
    ON e.Id = r.IdEmpleado
WHERE e.estado = 1
  AND r.IdPregunta IN (
        SELECT p.Id
        FROM Preguntas p
        WHERE p.IdFactor IN (
            SELECT f.Id
            FROM Factores f
            WHERE f.IdFlujo = 128
        )
    )

GROUP BY r.IdEmpleado
ORDER BY r.IdEmpleado;



---ver preguntas faltantes por empleado 4681,4677,4661,4660
DECLARE @IdFlujo INT = 128;

;WITH PreguntasFlujo AS
(
    SELECT
        p.Id,
        p.Etiqueta,
        p.Tipo
    FROM Preguntas p
    INNER JOIN Factores f
        ON f.Id = p.IdFactor
    WHERE f.IdFlujo = @IdFlujo
),
EmpleadosQueRespondieron AS
(
    SELECT DISTINCT
        r.IdEmpleado
    FROM Respuestas r
    INNER JOIN Empleados e
        ON e.Id = r.IdEmpleado
    INNER JOIN Preguntas p
        ON p.Id = r.IdPregunta
    INNER JOIN Factores f
        ON f.Id = p.IdFactor
    WHERE e.estado = 1
      AND f.IdFlujo = @IdFlujo
)
SELECT
    e.Id AS IdEmpleado,
    pf.Id AS IdPreguntaFaltante,
    pf.Etiqueta AS PreguntaFaltante,
    pf.Tipo AS Tipo
FROM EmpleadosQueRespondieron er
INNER JOIN Empleados e
    ON e.Id = er.IdEmpleado
CROSS JOIN PreguntasFlujo pf
LEFT JOIN Respuestas r
    ON r.IdEmpleado = e.Id
    AND r.IdPregunta = pf.Id
WHERE r.Id IS NULL
ORDER BY
    e.Id,
    pf.Id;







select * from OpcionesPregunta where IdPregunta in (2168,2169,2170,2171,2172,2173,2174,2175) order by idpregunta, Valor

select * from OpcionesPregunta where idpregunta in (select distinct id from preguntas where idfactor in (select Id from factores where idflujo = 128) and Tipo = 'select')

--update OpcionesPregunta set IdPregunta = 1141 where id in (6607,6608) and Valor = 'N/A no tengo suficiente información para responder' and IdPregunta = 2174

select * from preguntas where tipo = 'text' --1141

----sp modificado para que primero verifique que no exita respuesta previa

spGetConfigsJson

select * from ConfiguracionSistema



--update ConfiguracionSistema set Valor = 'Template_EMPLOYEE_FORMAT_EN(V5).xlsx' where IdConfig = 7
/*
INSERT INTO ConfiguracionSistema
(
    Nombre,
    Valor,
    Descripcion,
    Estado,
    FechaCreacion
)
VALUES
(
    'TEMPLATE_EXCEL_EMP_ENG',
    'Template_EMPLOYEE_FORMAT_EN(V5).xlsx',
    'Nombre de archivo plantilla Excel carga empleados inglés',
    1,
    GETDATE()
);
*/


go
-----renombrar encuestas y factores
CREATE OR ALTER PROCEDURE dbo.CLI_sp_Estructura_Renombrar
  @TipoElemento NVARCHAR(20),
  @IdOrganizacion INT,
  @IdClima INT,
  @IdEncuesta INT = NULL,
  @IdElemento INT,
  @NuevoNombre NVARCHAR(200),
  @Descripcion NVARCHAR(500) = NULL,
  @ActualizarDescripcion BIT = 0
AS
BEGIN
  SET NOCOUNT ON;
  SET XACT_ABORT ON;

  SET @TipoElemento = UPPER(LTRIM(RTRIM(ISNULL(@TipoElemento, N''))));
  SET @NuevoNombre = LTRIM(RTRIM(ISNULL(@NuevoNombre, N'')));
  SET @Descripcion = NULLIF(LTRIM(RTRIM(@Descripcion)), N'');

  IF @TipoElemento NOT IN (N'ENCUESTA', N'FACTOR')
    OR ISNULL(@IdOrganizacion, 0) <= 0
    OR ISNULL(@IdClima, 0) <= 0
    OR ISNULL(@IdElemento, 0) <= 0
    OR @NuevoNombre = N''
    OR (@TipoElemento = N'FACTOR' AND ISNULL(@IdEncuesta, 0) <= 0)
    THROW 53311, 'Los datos enviados para renombrar el elemento no son validos.', 1;

  DECLARE @LockResult INT;
  DECLARE @LockResource NVARCHAR(255) = CONCAT(
    N'CLI:Estructura:Renombrar:',
    @TipoElemento,
    N':',
    @IdClima,
    N':',
    CASE WHEN @TipoElemento = N'FACTOR' THEN @IdEncuesta ELSE 0 END
  );

  BEGIN TRY
    BEGIN TRANSACTION;

    EXEC @LockResult = sys.sp_getapplock
      @Resource = @LockResource,
      @LockMode = N'Exclusive',
      @LockOwner = N'Transaction',
      @LockTimeout = 15000;

    IF @LockResult < 0
      THROW 53314, 'No fue posible bloquear temporalmente la estructura del clima.', 1;

    IF NOT EXISTS (
      SELECT 1
      FROM dbo.FlujosClima flowData WITH (UPDLOCK, HOLDLOCK)
      WHERE flowData.Id = @IdClima
        AND flowData.IdOrganizacion = @IdOrganizacion
    )
      THROW 53313, 'No se encontro el clima dentro de la organizacion indicada.', 1;

    IF @TipoElemento = N'ENCUESTA'
    BEGIN
      IF NOT EXISTS (
        SELECT 1
        FROM dbo.GranFactores greatFactor WITH (UPDLOCK, HOLDLOCK)
        WHERE greatFactor.Id = @IdElemento
          AND greatFactor.IdFlujo = @IdClima
      )
        THROW 53313, 'No se encontro la encuesta dentro del clima indicado.', 1;

      IF EXISTS (
        SELECT 1
        FROM dbo.GranFactores greatFactor WITH (UPDLOCK, HOLDLOCK)
        WHERE greatFactor.IdFlujo = @IdClima
          AND greatFactor.Id <> @IdElemento
          AND UPPER(LTRIM(RTRIM(ISNULL(greatFactor.Etiqueta, N'')))) = UPPER(@NuevoNombre)
      )
        THROW 53312, 'Ya existe otra encuesta con el mismo nombre dentro del clima.', 1;

      UPDATE dbo.GranFactores
      SET Etiqueta = @NuevoNombre,
          Descripcion = CASE
            WHEN @ActualizarDescripcion = 1 THEN @Descripcion
            ELSE Descripcion
          END
      WHERE Id = @IdElemento
        AND IdFlujo = @IdClima;

      SELECT
        @TipoElemento AS TipoElemento,
        @IdOrganizacion AS IdOrganizacion,
        @IdClima AS IdClima,
        greatFactor.Id AS IdEncuesta,
        greatFactor.Id AS IdElemento,
        greatFactor.Etiqueta AS NuevoNombre,
        greatFactor.Descripcion AS Descripcion
      FROM dbo.GranFactores greatFactor
      WHERE greatFactor.Id = @IdElemento
        AND greatFactor.IdFlujo = @IdClima;
    END
    ELSE
    BEGIN
      IF NOT EXISTS (
        SELECT 1
        FROM dbo.GranFactores greatFactor WITH (UPDLOCK, HOLDLOCK)
        WHERE greatFactor.Id = @IdEncuesta
          AND greatFactor.IdFlujo = @IdClima
      )
        THROW 53313, 'No se encontro la encuesta dentro del clima indicado.', 1;

      IF NOT EXISTS (
        SELECT 1
        FROM dbo.Factores factorData WITH (UPDLOCK, HOLDLOCK)
        WHERE factorData.Id = @IdElemento
          AND factorData.IdFlujo = @IdClima
          AND factorData.IdGranFactor = @IdEncuesta
      )
        THROW 53313, 'No se encontro el factor dentro de la encuesta indicada.', 1;

      IF EXISTS (
        SELECT 1
        FROM dbo.Factores factorData WITH (UPDLOCK, HOLDLOCK)
        WHERE factorData.IdFlujo = @IdClima
          AND factorData.IdGranFactor = @IdEncuesta
          AND factorData.Id <> @IdElemento
          AND UPPER(LTRIM(RTRIM(ISNULL(factorData.Etiqueta, N'')))) = UPPER(@NuevoNombre)
      )
        THROW 53312, 'Ya existe otro factor con el mismo nombre dentro de la encuesta.', 1;

      UPDATE dbo.Factores
      SET Etiqueta = @NuevoNombre,
          Descripcion = CASE
            WHEN @ActualizarDescripcion = 1 THEN @Descripcion
            ELSE Descripcion
          END
      WHERE Id = @IdElemento
        AND IdFlujo = @IdClima
        AND IdGranFactor = @IdEncuesta;

      SELECT
        @TipoElemento AS TipoElemento,
        @IdOrganizacion AS IdOrganizacion,
        @IdClima AS IdClima,
        factorData.IdGranFactor AS IdEncuesta,
        factorData.Id AS IdElemento,
        factorData.Etiqueta AS NuevoNombre,
        factorData.Descripcion AS Descripcion
      FROM dbo.Factores factorData
      WHERE factorData.Id = @IdElemento
        AND factorData.IdFlujo = @IdClima
        AND factorData.IdGranFactor = @IdEncuesta;
    END;

    COMMIT TRANSACTION;
  END TRY
  BEGIN CATCH
    IF XACT_STATE() <> 0
      ROLLBACK TRANSACTION;

    THROW;
  END CATCH;
END;
GO

----AGREGAR NUEVOS PLANES 

/*
BEGIN TRANSACTION;
GO

INSERT INTO dbo.JL_Plan
(
    CodigoPlan, CodigoExternoPagadito, Nombre, Descripcion,
    Periodicidad, DuracionMeses, Precio, Moneda,
    EsLibre, EsRecomendado, Orden,
    MaxUsuarios, MaxEmpleados, MaxParticipantesActivos,
    MaxEncuestasClima, MaxEvaluacionesDesempeno,
    MaxEnviosCorreo, MaxEnviosWhatsApp, MaxEnviosSms,
    IncluyeCorreo, IncluyeWhatsApp, IncluyeSms, IncluyeDashboard,
    IncluyeIA, IncluyeReportes, IncluyeSeguimientoPlanes,
    IncluyeCapacitacion, IncluyeAsesoria,
    NivelSoporte, Activo, CreatedAtUtc, UpdatedAtUtc
)
VALUES
(
    N'anual_75', N'anual_75',
    N'Plan anual hasta 75 colaboradores',
    N'Plan anual de clima y desempeño para organizaciones de hasta 75 colaboradores.',
    N'ANUAL', 12, 800.00, N'USD',
    0, 0, 1,
    NULL, 75, 75,
    NULL, NULL,
    NULL, NULL, NULL,
    1, 1, 1, 1,
    0, 1, 1,
    1, 1,
    N'ESTANDAR', 1, SYSUTCDATETIME(), NULL
);

INSERT INTO dbo.JL_Plan
(
    CodigoPlan, CodigoExternoPagadito, Nombre, Descripcion,
    Periodicidad, DuracionMeses, Precio, Moneda,
    EsLibre, EsRecomendado, Orden,
    MaxUsuarios, MaxEmpleados, MaxParticipantesActivos,
    MaxEncuestasClima, MaxEvaluacionesDesempeno,
    MaxEnviosCorreo, MaxEnviosWhatsApp, MaxEnviosSms,
    IncluyeCorreo, IncluyeWhatsApp, IncluyeSms, IncluyeDashboard,
    IncluyeIA, IncluyeReportes, IncluyeSeguimientoPlanes,
    IncluyeCapacitacion, IncluyeAsesoria,
    NivelSoporte, Activo, CreatedAtUtc, UpdatedAtUtc
)
VALUES
(
    N'anual_150', N'anual_150',
    N'Plan anual hasta 150 colaboradores',
    N'Plan anual de clima y desempeño para organizaciones de 76 a 150 colaboradores.',
    N'ANUAL', 12, 1500.00, N'USD',
    0, 1, 2,
    NULL, 150, 150,
    NULL, NULL,
    NULL, NULL, NULL,
    1, 1, 1, 1,
    0, 1, 1,
    1, 1,
    N'PRIORITARIO', 1, SYSUTCDATETIME(), NULL
);

INSERT INTO dbo.JL_Plan
(
    CodigoPlan, CodigoExternoPagadito, Nombre, Descripcion,
    Periodicidad, DuracionMeses, Precio, Moneda,
    EsLibre, EsRecomendado, Orden,
    MaxUsuarios, MaxEmpleados, MaxParticipantesActivos,
    MaxEncuestasClima, MaxEvaluacionesDesempeno,
    MaxEnviosCorreo, MaxEnviosWhatsApp, MaxEnviosSms,
    IncluyeCorreo, IncluyeWhatsApp, IncluyeSms, IncluyeDashboard,
    IncluyeIA, IncluyeReportes, IncluyeSeguimientoPlanes,
    IncluyeCapacitacion, IncluyeAsesoria,
    NivelSoporte, Activo, CreatedAtUtc, UpdatedAtUtc
)
VALUES
(
    N'anual_300', N'anual_300',
    N'Plan anual hasta 300 colaboradores',
    N'Plan anual de clima y desempeño para organizaciones de 151 a 300 colaboradores.',
    N'ANUAL', 12, 2300.00, N'USD',
    0, 0, 3,
    NULL, 300, 300,
    NULL, NULL,
    NULL, NULL, NULL,
    1, 1, 1, 1,
    0, 1, 1,
    1, 1,
    N'PRIORITARIO', 1, SYSUTCDATETIME(), NULL
);
GO

INSERT INTO dbo.JL_PlanFeature
(
    IdPlan, CodigoFeature, Nombre, Descripcion,
    ValorTexto, ValorNumero, Orden, Activo
)
SELECT
    p.IdPlan,
    f.CodigoFeature,
    f.Nombre,
    f.Descripcion,
    f.ValorTexto,
    f.ValorNumero,
    f.Orden,
    1
FROM dbo.JL_Plan p
INNER JOIN
(
    VALUES
    (N'anual_75',  N'CLIMA_ILIMITADO',      N'Encuestas de clima',                    N'Encuestas de clima laboral incluidas.',                         N'ILIMITADAS', NULL, 1),
    (N'anual_75',  N'DES_ILIMITADO',        N'Evaluaciones de desempeño',             N'Evaluaciones de desempeño incluidas.',                          N'ILIMITADAS', NULL, 2),
    (N'anual_75',  N'MAX_EMPLEADOS',        N'Hasta 75 colaboradores',                N'Límite máximo de colaboradores activos.',                       N'75', 75, 3),
    (N'anual_75',  N'CANALES',              N'Canales de envío',                      N'Correo, WhatsApp y SMS.',                                      N'EMAIL,WHATSAPP,SMS', NULL, 4),
    (N'anual_75',  N'DASHBOARD',            N'Dashboards y reportes',                 N'Dashboards, Excel y PDF.',                                     NULL, NULL, 5),
    (N'anual_75',  N'SEGUIMIENTO',          N'Planes de acción y seguimiento',        N'Gestión y seguimiento de planes de acción.',                    NULL, NULL, 6),
    (N'anual_75',  N'CAPACITACION',         N'Capacitación y manuales',               N'Capacitación inicial y materiales de apoyo.',                   NULL, NULL, 7),
    (N'anual_75',  N'ASESORIA',             N'Asesoría',                              N'Acompañamiento de asesoría.',                                   NULL, NULL, 8),
    (N'anual_75',  N'IA_ADICIONAL',         N'Módulo IA adicional',                   N'Análisis, hallazgos y planes de acción mediante IA.',           N'OPCIONAL', 150, 9),

    (N'anual_150', N'CLIMA_ILIMITADO',      N'Encuestas de clima',                    N'Encuestas de clima laboral incluidas.',                         N'ILIMITADAS', NULL, 1),
    (N'anual_150', N'DES_ILIMITADO',        N'Evaluaciones de desempeño',             N'Evaluaciones de desempeño incluidas.',                          N'ILIMITADAS', NULL, 2),
    (N'anual_150', N'MAX_EMPLEADOS',        N'Hasta 150 colaboradores',               N'Límite máximo de colaboradores activos.',                       N'150', 150, 3),
    (N'anual_150', N'CANALES',              N'Canales de envío',                      N'Correo, WhatsApp y SMS.',                                      N'EMAIL,WHATSAPP,SMS', NULL, 4),
    (N'anual_150', N'DASHBOARD',            N'Dashboards y reportes',                 N'Dashboards, Excel y PDF.',                                     NULL, NULL, 5),
    (N'anual_150', N'SEGUIMIENTO',          N'Planes de acción y seguimiento',        N'Gestión y seguimiento de planes de acción.',                    NULL, NULL, 6),
    (N'anual_150', N'CAPACITACION',         N'Capacitación y manuales',               N'Capacitación inicial y materiales de apoyo.',                   NULL, NULL, 7),
    (N'anual_150', N'ASESORIA',             N'Asesoría',                              N'Acompañamiento de asesoría.',                                   NULL, NULL, 8),
    (N'anual_150', N'IA_ADICIONAL',         N'Módulo IA adicional',                   N'Análisis, hallazgos y planes de acción mediante IA.',           N'OPCIONAL', 150, 9),

    (N'anual_300', N'CLIMA_ILIMITADO',      N'Encuestas de clima',                    N'Encuestas de clima laboral incluidas.',                         N'ILIMITADAS', NULL, 1),
    (N'anual_300', N'DES_ILIMITADO',        N'Evaluaciones de desempeño',             N'Evaluaciones de desempeño incluidas.',                          N'ILIMITADAS', NULL, 2),
    (N'anual_300', N'MAX_EMPLEADOS',        N'Hasta 300 colaboradores',               N'Límite máximo de colaboradores activos.',                       N'300', 300, 3),
    (N'anual_300', N'CANALES',              N'Canales de envío',                      N'Correo, WhatsApp y SMS.',                                      N'EMAIL,WHATSAPP,SMS', NULL, 4),
    (N'anual_300', N'DASHBOARD',            N'Dashboards y reportes',                 N'Dashboards, Excel y PDF.',                                     NULL, NULL, 5),
    (N'anual_300', N'SEGUIMIENTO',          N'Planes de acción y seguimiento',        N'Gestión y seguimiento de planes de acción.',                    NULL, NULL, 6),
    (N'anual_300', N'CAPACITACION',         N'Capacitación y manuales',               N'Capacitación inicial y materiales de apoyo.',                   NULL, NULL, 7),
    (N'anual_300', N'ASESORIA',             N'Asesoría',                              N'Acompañamiento de asesoría.',                                   NULL, NULL, 8),
    (N'anual_300', N'IA_ADICIONAL',         N'Módulo IA adicional',                   N'Análisis, hallazgos y planes de acción mediante IA.',           N'OPCIONAL', 150, 9)
) f(PlanCodigo, CodigoFeature, Nombre, Descripcion, ValorTexto, ValorNumero, Orden)
    ON p.CodigoPlan = f.PlanCodigo
WHERE NOT EXISTS
(
    SELECT 1
    FROM dbo.JL_PlanFeature existingFeature
    WHERE existingFeature.IdPlan = p.IdPlan
      AND existingFeature.CodigoFeature = f.CodigoFeature
);
GO

COMMIT TRANSACTION;
GO

*/

select * from jl_plan
select * from JL_PlanFeature where idPlan in (4,5,6)
select * from jl_order order by 1 desc


    select * from dbo.Menu
    select * from dbo.MenuAction
    .

    JL_sp_Order_CreatePending

    select * from dbo.[User]




