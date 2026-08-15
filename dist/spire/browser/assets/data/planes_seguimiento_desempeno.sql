
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

--INSERT INTO [dbo].[Menu] ([ParentMenuId], [Name], [DisplayOrder], [IsActive], [CreatedAt], [Path], [Title], [IconType], [Icon], [Class], [IsGroupTitle], [Badge], [BadgeClass]) 
--VALUES (NULL, N'MENUITEMS.MAINDESEMPENIO.TEXT', 1, 1, GETDATE(), N'', N'MENUITEMS.MAINDESEMPENIO.TEXT', N'', N'', N'', 1, N'', N'');

--INSERT INTO [dbo].[menuaction] ([MenuId], [Code], [Name], [Description], [IsActive], [CreatedAt], [Path], [Title], [IconType], [Icon], [Class], [IsGroupTitle], [Badge], [BadgeClass]) 
--VALUES (32, N'viewdesdash', N'MENUITEMS.SECURE.ACCESSDATA.DESDASHBOARD', N'MENUITEMS.SECURE.ACCESSDATA.DESDASHBOARD', 1, GETDATE(), NULL, NULL, NULL, NULL, NULL, 0, NULL, NULL);




--INSERT INTO [dbo].[RoleMenuAction] ([RoleId], [ActionId], [Granted], [AssignedAt]) VALUES (1, 34, 1, getdate());

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



--validar asistente por organizacion
DECLARE @IdOrganizacion INT = 40;

SELECT
    o.IdOrder,
    o.IdOrganizacionProvisionada,
    o.IdPlan,
    p.CodigoPlan,
    p.Nombre [Plan],
    p.Activo [PlanActivo],
    p.IncluyeIA,
    o.Estado,
    o.FechaInicioPlanUtc,
    o.FechaFinPlanUtc,
    f.CodigoFeature,
    f.Activo AS FeatureActivo
FROM dbo.JL_Order o
INNER JOIN dbo.JL_Plan p
    ON p.IdPlan = o.IdPlan
LEFT JOIN dbo.JL_PlanFeature f
    ON f.IdPlan = p.IdPlan
   AND f.CodigoFeature = N'AI_ASSISTANT'
WHERE o.IdOrganizacionProvisionada = @IdOrganizacion
ORDER BY o.IdOrder DESC;


select * from JL_Order
select * from JL_Plan




--activar una empresa con asistente IA:

DECLARE @IdOrganizacion INT = 40;
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


EXEC dbo.AI_sp_AsistenteFeature_Validar
    @IdOrganizacion = 40;


EXEC dbo.AI_sp_AsistenteOrganizacion_Autorizar
    @IdUsuario = N'1',
    @IdOrganizacion = 40;


--select * from Respuestas where IdPregunta in (select Id from preguntas where IdFactor in (select Id from Factores where IdFlujo in (select id from flujosclima where idorganizacion in (16,38,39))))
--DELETE from Respuestas where IdPregunta in (select Id from preguntas where IdFactor in (select Id from Factores where IdFlujo in (select id from flujosclima where idorganizacion in (16,38,39))))


--select * from OpcionesPregunta where IdPregunta in (select Id from preguntas where IdFactor in (select Id from Factores where IdFlujo in (select id from flujosclima where idorganizacion in (16,38,39))))
--delete from OpcionesPregunta where IdPregunta in (select Id from preguntas where IdFactor in (select Id from Factores where IdFlujo in (select id from flujosclima where idorganizacion in (16,38,39)))) and id <> 2477

--select * from preguntas where IdFactor in (select Id from Factores where IdFlujo in (select id from flujosclima where idorganizacion in (16,38,39)))
--delete from preguntas where IdFactor in (select Id from Factores where IdFlujo in (select id from flujosclima where idorganizacion in (16,38,39))) and id <> 751

--select * from Factores where IdFlujo in (select id from flujosclima where idorganizacion in (16,38,39))
--delete from Factores where IdFlujo in (select id from flujosclima where idorganizacion in (16,38,39)) and id <> 215

--select * from GranFactores where Id in (select IdGranFactor from Factores where IdFlujo in (select id from flujosclima where idorganizacion in (16,38,39)))
--delete from GranFactores where Id in (select IdGranFactor from Factores where IdFlujo in (select id from flujosclima where idorganizacion in (16,38,39)))

--select * from flujosclima where idorganizacion in (16,38,39)
--delete from flujosclima where idorganizacion in (16,38,39)


--select * from empleadodemografico where idempleado in (select Id from empleados where idorganizacion in (16,38,39))
--delete from empleadodemografico where idempleado in (select Id from empleados where idorganizacion in (16,38,39))

--select * from empleados where idorganizacion in (16,38,39)
--delete from empleados where idorganizacion in (16,38,39)


--select * from RoleMenuAction where RoleId in (select RoleId from dbo.[Role] where idorganization in (16,38,39))
--delete from RoleMenuAction where RoleId in (select RoleId from dbo.[Role] where idorganization in (16,38,39))

--select * from dbo.[UserRole] where UserId in (select UserId from dbo.[User] where idorganization in (16,38,39))
--delete from dbo.[UserRole] where UserId in (select UserId from dbo.[User] where idorganization in (16,38,39))

--select * from dbo.[Role] where idorganization in (16,38,39)
--delete from dbo.[Role] where idorganization in (16,38,39)


--select * from dbo.[User] where idorganization in (16,38,39)
--delete from dbo.[User] where idorganization in (16,38,39)

--select * from camposdemograficos where idorganizacion in (16,38,39)
--delete from camposdemograficos where idorganizacion in (16,38,39)


--select * from des_puesto where idorganizacion in (select Id from organizaciones where id in (16,38,39))
--delete from des_puesto where idorganizacion in (select Id from organizaciones where id in (16,38,39))


--select * from organizaciones where id in (16,38,39)
--delete from organizaciones where id in (38,39)


select * from Organizaciones

select * from camposdemograficos where idorganizacion = 27 --123

select * from empleadodemografico where idCampoDemografico = 126

select DISTINCT Valor from empleadodemografico where idCampoDemografico = 126

select * from [Role]
select * from dbo.[User]
select * from dbo.[UserRole]

SELECT * FROM  menuaction
SELECT * FROM RoleMenuAction

------
GO

select * from dbo.AI_AsistenteMensaje
