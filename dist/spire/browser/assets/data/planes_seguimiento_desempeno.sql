
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




