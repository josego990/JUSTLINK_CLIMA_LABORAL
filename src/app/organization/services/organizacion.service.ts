import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import axios from 'axios';
import { ConfigInfo } from 'app/layout/sidebar/sidebar.metadata';
import { relativeTimeThreshold } from 'moment';

@Injectable({
  providedIn: 'root',
})
export class OrganizacionService {

  private configs:any = sessionStorage.getItem('configs');
  private confslist:any = [];

  private baseURL = '';
  private baseURLLocal = 'http://localhost:3030/';

  constructor(private http: HttpClient) {
    try {
      if(this.configs){
      this.confslist = JSON.parse(this.configs);
      const c = this.confslist.find((config:any) => config.Nombre === 'API_BASE_URL');
      this.baseURL = c.Valor + '/';
      console.log('baseURL:: ', this.baseURL);
    }
    } 
    catch(error){
      console.error(error);
    }
  }

  saveNewOrganization(organizacion: any) {
    return axios
      .post(this.baseURL + 'save-new-organization', JSON.stringify(organizacion));
  }

  updateOrganization(organizacion: any) {
    return axios
      .post(this.baseURL + 'update-organization', JSON.stringify(organizacion));
  }

  getOrganizations() {
    return axios
      .get(this.baseURL + 'get-organizations');
  }

  getOrganizationById(idOrganization: any) {
    return axios
      .post(this.baseURL + 'get-organization-by-id',{idOrganization:idOrganization});
  }

  deleteOrganization(idOrganization:number) {
   //console.log('DR. HOUSE ',idOrganization);

    return axios.post(this.baseURL + 'delete-organization', {idOrganization:idOrganization});
  }

  getCountries() {
    return axios
      .get(this.baseURL + 'get-countries');
  }

  saveNewEmployee(employee: any) {
    return axios
      .post(this.baseURL + 'insert-employeeSecure', employee);
  }

  updateEmployee(employee: any) {
    return axios
      .post(this.baseURL + 'update-employeeSecure', employee);
  }

  saveNewEmployeesExcel(employees: any) {
    return axios
      .post(this.baseURL + 'insert-employees-batch', employees);
  }

  saveNewPreguntasExcel(preguntas: any) {
    return axios
      .post(this.baseURL + 'insert-preguntas-excel', preguntas);
  }

  getEmployees(idOrganization:number) {
    //console.log('ID ORGANIZACION::', idOrganization);
    return axios
      .post(this.baseURL + 'get-employees', {idOrganization:idOrganization});
  }

  deleteEmployee(idEmployee:number) {
    //console.log('DR. idEmployee ',idEmployee);
    const d = {id:idEmployee};
    return axios.post(this.baseURL + 'delete-Employee', {
      idEmployee:idEmployee
    });
  }

  activeEmployee(idEmployee:number) {
    //console.log('DR. idEmployee ',idEmployee);
    const d = {id:idEmployee};
    return axios.post(this.baseURL + 'active-Employee', {
      idEmployee:idEmployee
    });
  }

  getDemograficos(idOrganization:number) {
    //console.log('ID ORGANIZACION::', idOrganization);
    return axios
      .post(this.baseURL + 'get-demograficos', {idOrganization:idOrganization});
  }

  deleteDemografico(idDemografico:number) {
    //console.log('DR. idEmployee ',idEmployee);
    const d = {id:idDemografico};
    return axios.post(this.baseURL + 'delete-demografico', {
      idDemografico:idDemografico
    });
  }

  activeDemografico(idDemografico:number) {
    //console.log('DR. idEmployee ',idEmployee);
    const d = {id:idDemografico};
    return axios.post(this.baseURL + 'active-demografico', {
      idDemografico:idDemografico
    });
  }

  saveNewDemografico(campo: any, idOrganizacion: any) {    
   //console.log('CAMPO: ',campo);
    const data = {idOrganizacion:idOrganizacion,campo:campo.NombreCampo}
   //console.log('data: ',data);
    return axios.post(this.baseURL + 'insert-demographic-field', data);
  }

  saveNewClima(data_clima: any) {    
   //console.log('DATA_CLIMA_A_GUARDAR: ', data_clima);
    //const data = {idOrganizacion:idOrganizacion,campo:campo.NombreCampo}
    //console.log('data: ',data);

    return axios.post(this.baseURL + 'insert-flujo-clima', data_clima);
  }

  getClimas(idOrganization:number) {    
    return axios
      .post(this.baseURL + 'get-flujos-clima-json', {idOrganizacion:idOrganization});
  }

  getClimasById(idOrganization:number) {    
    return axios
      .post(this.baseURL + 'get-flujos-clima-by-id-json', {idOrganizacion:idOrganization});
  }

  getFactores(idOrganization:number) {    
    return axios
      .post(this.baseURL + 'get-factores-json', {idOrganizacion:idOrganization});
  }

  getGrandesFactores(idFlujo:number) {    
    return axios
      .post(this.baseURL + 'get-grandes-factores', {IdFlujo:idFlujo});
  }

   saveNewGFactor(data_gfactor: any) {    
   console.log('DATA_GRAN_FACTOR_A_GUARDAR: ', data_gfactor);

    return axios.post(this.baseURL + 'insert-gran-factor', data_gfactor);
  }

  saveNewFactor(data_factor: any) {    
   //console.log('DATA_FACTOR_A_GUARDAR: ', data_factor);

    return axios.post(this.baseURL + 'insert-factor', data_factor);
  }

  deleteFactor(idFactor:number) {
    //console.log('DR. idEmployee ',idEmployee);
    const d = {idFactor:idFactor};
    return axios.post(this.baseURL + 'delete-factor', d);
  }

  updateClima(clima_data:any) {    

    return axios
      .post(this.baseURL + 'update-clima-status', clima_data);
  }

  saveNewPregunta(data_pregunta: any) {    
   //console.log('DATA_PREGUNTA_A_GUARDAR: ', data_pregunta);

    return axios.post(this.baseURL + 'insert-pregunta', data_pregunta);
  }

  updatePregunta(pregunta_data:any) {    
    return axios
      .post(this.baseURL + 'update-pregunta-estado', pregunta_data);
  }

  crearEnvioEncuesta(idFlujo:number) {

    const d = {IdFlujo:idFlujo};
    return axios.post(this.baseURL + 'crear-envio-encuestas', d);
  }

  crearEnvioEncuestaIndividual(datos:any) {

 
    return axios.post(this.baseURL + 'crear-envio-encuesta-individual', datos);
  }

  getEncuestasFlujo(idFlujo:number) {

    return axios
      .post(this.baseURL + 'get-encuestas-flujo', {IdFlujo:idFlujo});
  }

  sendEmail(mailBody: any) {

    return axios
      .post(this.baseURL + 'send-email-just-link', mailBody);
  }

  updateEncuestaEmpleado(update_data: any) {

    return axios
      .post(this.baseURL + 'actualizar-encuesta-empleado', update_data);
  }

  updateEncuestaEncabezado(update_data: any) {

    return axios
      .post(this.baseURL + 'actualizar-envio-encuesta-encabezado', update_data);
  }

  sendWhatsappMessage(mesaje_data: any) {

    return axios
      .post(this.baseURL + 'api/send-whatsapp-template-temp', mesaje_data);
  }


  saveNewTemplate(template_data: any) {    
   //console.log('DATA_PLANTILLA_A_GUARDAR: ', template_data);

    return axios.post(this.baseURL + 'insert-plantilla', template_data);
  }

  getFlujosPlantilla(idOrganizacion:number) {

    return axios
      .post(this.baseURL + 'get-flujos-con-plantilla', {IdOrganizacion:idOrganizacion});
  }

  getFlujoPlantilla(IdFlujo:number) {

    return axios
      .post(this.baseURL + 'get-clima-plantilla', {IdFlujo:IdFlujo});
  }

  getPreguntasClima(idFlujo:number) {    
    return axios
      .post(this.baseURL + 'get-clima-json', {idFlujo:idFlujo});
  }

  getPreguntasClimaGF(idFlujo:number,idEmpleado:number) {    
    return axios
      .post(this.baseURL + 'get-clima-json-gf', {idFlujo:idFlujo,idEmpleado:idEmpleado});
  }

  savePreguntas(preguntas_data: any) {    
    //console.log('DATA_PLANTILLA_A_GUARDAR: ', template_data);

    return axios.post(this.baseURL + 'insert-respuestas', preguntas_data);
  }

  updateClimaEncuesta(clima_data:any) {    

    return axios
      .post(this.baseURL + 'update-encuesta-empleado', clima_data);
  }

  getClimaInfo(clima_data:any) {    
    return axios
      .post(this.baseURL + 'get-encuesta-info', clima_data);
  }

  getEmpleadoInfo(IdEmpleado:any) {    
    return axios
      .post(this.baseURL + 'get-empleado-info', {IdEmpleado:IdEmpleado});
  }

  getFlujosLista(idOrganizacion:number) {

    return axios
      .post(this.baseURL + 'get-flujos-list', {IdOrganizacion:idOrganizacion});
  }

  getMetricaFactores(idFlujo:number) {

    return axios
      .post(this.baseURL + 'get-metrica-factores', {IdFlujo:idFlujo});
  }

  getMetricaFactoresFiltrado(idFlujo:number, filtros:string) {

    return axios
      .post(this.baseURL + 'get-metrica-factores-filtrado', {IdFlujo:idFlujo,FiltrosDemograficos:filtros});
  }

  getMetricaFactoresFiltradoGF(idFlujo:number, filtros:string, filtrosGf:string, tipoFiltro:string) {

    return axios
      .post(this.baseURL + 'get-metrica-factores-filtrado-gf',
        {IdFlujo:idFlujo,
          FiltrosDemograficos:filtros,
          FiltrosGf: filtrosGf,
          TipoFiltro: tipoFiltro 
        });
  }

  getMetricaComments(idFlujo:number) {

    return axios
      .post(this.baseURL + 'get-metrica-comments', {IdFlujo:idFlujo});
  }

  getMetricaCommentsGF(idFlujo:number, filtrosGf:string) {

    return axios
      .post(this.baseURL + 'get-metrica-comments-gf', 
        {
          IdFlujo:idFlujo,
          FiltrosGf: filtrosGf
        });
  }
  

  getMetricaCommentsia(idFlujo:number) {

    return axios
      .post(this.baseURL + 'get-metrica-comments-ia', {IdFlujo:idFlujo});
  }

  getMetricaCommentsIAGF(idFlujo:number, filtrosGf:string) {

    return axios
      .post(this.baseURL + 'get-metrica-comments-ia-gf', 
        {
          IdFlujo:idFlujo,
          FiltrosGf: filtrosGf
        });
  }
  
 getMetricaConteoPreguntasFactores(idFlujo:number) {

    return axios
      .post(this.baseURL + 'get-metrica-conteo-factores', {IdFlujo:idFlujo});
  }

 getMetricaConteoPreguntasFactoresFILTRADO(idFlujo:number, filtros:string) {

    return axios
      .post(this.baseURL + 'get-metrica-conteo-factores-FILTRADO', {IdFlujo:idFlujo,FiltrosDemograficos:filtros});
  }

  getMetricaConteoPreguntasFactoresFILTRADOGF(idFlujo:number, filtros:string, filtrosGf:string) {
    return axios
      .post(this.baseURL + 'get-metrica-conteo-factores-FILTRADO-gf',
        {
          IdFlujo:idFlujo,
          FiltrosDemograficos:filtros,
          FiltrosGf: filtrosGf
        });
  }

  getMetricaSatisfaccionPreguntas(idFlujo:number) {

    return axios
      .post(this.baseURL + 'get-metrica-satisfaccion-preguntas', {IdFlujo:idFlujo});
  }

  getMetricaSatisfaccionPreguntasFILTRADO(idFlujo:number, filtros:string) {

    return axios
      .post(this.baseURL + 'get-metrica-satisfaccion-preguntas-FILTRADO', 
        {IdFlujo:idFlujo,FiltrosDemograficos:filtros});
  }

  getMetricaSatisfaccionPreguntasFILTRADOGF(idFlujo:number, filtros:string, filtrosGf:string, tipoFiltro:string) {

    return axios
      .post(this.baseURL + 'get-metrica-satisfaccion-preguntas-filtrado-gf', 
        {
          IdFlujo:idFlujo,
          FiltrosDemograficos:filtros,
          FiltrosGf: filtrosGf,
          TipoFiltro: tipoFiltro        
        });
  }

  getMetricaCalificacionGeneralClima(idFlujo:number) {

    return axios
      .post(this.baseURL + 'get-metrica-calificacion-general', {IdFlujo:idFlujo});
  }

  getMetricaCalificacionGeneralClimaFiltrado(idFlujo:number, filtros:string) {

    return axios
      .post(this.baseURL + 'get-metrica-calificacion-general-filtrado', {IdFlujo:idFlujo,FiltrosDemograficos:filtros});
  }

  getMetricaCalificacionGeneralClimaFiltradoGF(idFlujo:number, filtros:string, 
    filtrosGf:string, tipoFiltro:string) {

    return axios
      .post(this.baseURL + 'get-metrica-calificacion-general-filtrado-gf', 
        {
          IdFlujo:idFlujo,
          FiltrosDemograficos:filtros,
          FiltrosGf: filtrosGf,
          TipoFiltro: tipoFiltro         
        });
  }

  getMetricaEstadoEnvioClima(idFlujo:number) {

    return axios
      .post(this.baseURL + 'get-metrica-estado-envio', {IdFlujo:idFlujo});
  }

  getMetricaPorcentajeRespuestas(idFlujo:number) {

    return axios
      .post(this.baseURL + 'get-metrica-porcentaje-respuestas', {IdFlujo:idFlujo});
  }

  getMetricaPorcentajeRespuestasFiltrado(idFlujo:number, filtros:string) {

    return axios
      .post(this.baseURL + 'get-metrica-porcentaje-respuestas-filtrado', 
        {IdFlujo:idFlujo,FiltrosDemograficos:filtros});
  }

  getMetricaPorcentajeRespuestasFiltradoGF(idFlujo:number, filtros:string, filtrosGf:string) {

    return axios
      .post(this.baseURL + 'get-metrica-porcentaje-respuestas-filtrado-gf', 
        {IdFlujo:idFlujo,
          FiltrosDemograficos:filtros,
          FiltrosGf: filtrosGf
        
        });
  }

  getMetricaPorcentajeSatisfaccionFactor(idFlujo:number) {

    return axios
      .post(this.baseURL + 'get-metrica-porcentaje-satisfaccion-factor', {IdFlujo:idFlujo});
  }

  getMetricaPorcentajeSatisfaccionFactorFiltrado(idFlujo:number, filtros:string) {

    return axios
      .post(this.baseURL + 'get-metrica-porcentaje-satisfaccion-factor-filtrado', 
        {IdFlujo:idFlujo,FiltrosDemograficos:filtros});
  }

  getMetricaPorcentajeSatisfaccionFactorFiltradoGF(idFlujo:number, filtros:string, filtrosGf:string) {

    return axios
      .post(this.baseURL + 'get-metrica-porcentaje-satisfaccion-factor-filtrado-gf', 
        {
          IdFlujo:idFlujo,
          FiltrosDemograficos:filtros,
          FiltrosGf: filtrosGf
        
        });
  }

  getMetricaDemograficos(idOrg:number) {

    return axios
      .post(this.baseURL + 'get-metrica-demograficos', 
        {
          IdOrg:idOrg
          
        });
  }

  getFiltrosDemograficosRestrictivo(idOrg:number, idFlujo:number, minRespuestas: number) {

    return axios
      .post(this.baseURL + 'get-factores-demograficos-restrictivo', 
        {
          IdOrg: idOrg,
          IdFlujo: idFlujo,
          MinRespuestas: minRespuestas        
        });
  }

  logni13(user:any) {
   //console.log('ENTRA EN LOGIN..');
    return axios
      .post(this.baseURL + 'logni13', user);

  }

  getMenuAccess(RoleId:any) {
  
    return axios
      .post(this.baseURL + 'get-access-menu', {RoleId: RoleId});

  }

  getUsers() {
    return axios
      .post(this.baseURL + 'get-users-json');
  }
  
  getRoles() {
    return axios
      .get(this.baseURL + 'get-roles-json');
  }

  getRolesByIdOrg(idOrganization:any) {
    return axios
      .post(this.baseURL + 'get-roles-by-id-org-json',{idOrganization:idOrganization});
  }

  saveUser(userData: any) {    
    //console.log('DATA_PLANTILLA_A_GUARDAR: ', template_data);

    return axios.post(this.baseURL + 'insert-user', userData);
  }

  updateUser(userData: any) {    
    //console.log('DATA_PLANTILLA_A_GUARDAR: ', template_data);

    return axios.post(this.baseURL + 'update-user', userData);
  }

  getRolesAccess() {
  
    return axios
      .get(this.baseURL + 'get-roles-access-json');

  }

  getRolesAccessByIdOrg(idOrganization:any) {
  
    return axios
      .post(this.baseURL + 'get-roles-access-by-id-org-json', {idOrganization:idOrganization});

  }

  saveRole(roleData: any) {    
    //console.log('DATA_PLANTILLA_A_GUARDAR: ', template_data);

    return axios.post(this.baseURL + 'insert-role', roleData);
  }

   updateRoleAccess(updRoleData: any) {    
    //console.log('DATA_PLANTILLA_A_GUARDAR: ', template_data);

    return axios.post(this.baseURL + 'update-role-access', updRoleData);
  }

  getUserById(userId:any) {
  
    return axios
      .post(this.baseURL + 'get-user-by-id-json', {userId:userId});

  }

   getGFactorsAccessByIdFlujo(idFlujo:any) {
  
    return axios
      .post(this.baseURL + 'get-gfactors-access-by-id-flujo-json', {idFlujo:idFlujo});

  }

  updateGFactorsAccessByIdFlujo(data:any) {
  
    return axios
      .post(this.baseURL + 'update-gf-access', data);

  }

   getConfigs() {
  
    return axios
      .get(this.baseURLLocal + 'get-conf-json');

  }


















}
