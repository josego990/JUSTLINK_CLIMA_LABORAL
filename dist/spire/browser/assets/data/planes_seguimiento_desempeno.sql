
--producción
--use JUSTLINK_DB 
--go

--desarrollo
use JUSTLINK_DESA_DB2
go



select * from dbo.Menu
select * from menuaction
select * from dbo.RoleMenuAction

--update dbo.Menu set Icon = 'award' where MenuId = 33

INSERT INTO [dbo].[Menu] ([ParentMenuId], [Name], [DisplayOrder], [IsActive], [CreatedAt], [Path], [Title], [IconType], [Icon], [Class], [IsGroupTitle], [Badge], [BadgeClass]) 
                  VALUES (33, N'MENUITEMS.ACTIONDESEMPENIO.TEXT', 2, 1, GETDATE(), N'/desempeno/planes-seguimiento', N'MENUITEMS.ACTIONDESEMPENIO.TEXT', N'', N'', N'', 0, N'', N'');

INSERT INTO [dbo].[menuaction] ([MenuId], [Code], [Name], [Description], [IsActive], [CreatedAt], [Path], [Title], [IconType], [Icon], [Class], [IsGroupTitle], [Badge], [BadgeClass]) 
            VALUES (32, N'viewdesactionsplans', N'MENUITEMS.SECURE.ACCESSDATA.DESDASHBOARD', N'MENUITEMS.SECURE.ACCESSDATA.DESDASHBOARD', 1, GETDATE(), NULL, NULL, NULL, NULL, NULL, 0, NULL, NULL);




INSERT INTO [dbo].[RoleMenuAction] ([RoleId], [ActionId], [Granted], [AssignedAt]) VALUES (1, 34, 1, getdate());

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
DECLARE @IdOrganizacion INT = 1;
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

UPDATE DES_EmpleadoPuesto set IdPuesto = 36 where IdEmpleado = 4475

select * from DES_ModeloPuesto

SELECT * FROM DES_ModeloPuestoEscenario

--
