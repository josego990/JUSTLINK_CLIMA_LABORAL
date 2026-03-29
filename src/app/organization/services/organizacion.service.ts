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

  private baseURL = 'https://api.justlink360.net/';
  private baseURL_DESA = 'http://98.88.117.108:3030/'
  private baseURLLocal = 'http://localhost:3030/';

  //nota de jj: para alternar entre los ambientes del api se debe
  //hacer un replace de 'this.baseURL' por ejemplo por 'this.baseURLLocal'

  constructor(private http: HttpClient) {
    try {
      if(this.configs){
      this.confslist = JSON.parse(this.configs);
      const c = this.confslist.find((config:any) => config.Nombre === 'API_BASE_URL');
      this.baseURL= c.Valor + '/';
      console.log('baseURL:: ', this.baseURL);
    }
    } 
    catch(error){
      console.error(error);
    }
  }

  saveNewOrganization(organizacion: any) {
    return axios
      .post(this.baseURLLocal + 'save-new-organization', JSON.stringify(organizacion));
  }

  updateOrganization(organizacion: any) {
    return axios
      .post(this.baseURLLocal + 'update-organization', JSON.stringify(organizacion));
  }

  getOrganizations() {
    return axios
      .get(this.baseURLLocal +'get-organizations');
  }


  getOrganizationIdByFlujoId(IdFlujo:any) {
    return axios
      .post(this.baseURLLocal +'get-org-by-flujo-id', {IdFlujo:IdFlujo});
  }


  getOrganizationById(idOrganization: any) {
    return axios
      .post(this.baseURLLocal +'get-organization-by-id',{idOrganization:idOrganization});
  }

  deleteOrganization(idOrganization:number) {
   //console.log('DR. HOUSE ',idOrganization);

    return axios.post(this.baseURLLocal +'delete-organization', {idOrganization:idOrganization});
  }

  getCountries() {
    return axios
      .get(this.baseURLLocal +'get-countries');
  }

  saveNewEmployee(employee: any) {
    return axios
      .post(this.baseURLLocal +'insert-employeeSecure', employee);
  }

  updateEmployee(employee: any) {
    return axios
      .post(this.baseURLLocal +'update-employeeSecure', employee);
  }

  saveNewEmployeesExcel(employees: any) {
    return axios
      .post(this.baseURLLocal +'insert-employees-batch', employees);
  }

  saveNewPreguntasExcel(preguntas: any) {
    return axios
      .post(this.baseURLLocal +'insert-preguntas-excel', preguntas);
  }

  getEmployees(idOrganization:number) {
    //console.log('ID ORGANIZACION::', idOrganization);
    return axios
      .post(this.baseURLLocal +'get-employees', {idOrganization:idOrganization});
  }

  deleteEmployee(idEmployee:number) {
    //console.log('DR. idEmployee ',idEmployee);
    const d = {id:idEmployee};
    return axios.post(this.baseURLLocal +'delete-Employee', {
      idEmployee:idEmployee
    });
  }

  activeEmployee(idEmployee:number) {
    //console.log('DR. idEmployee ',idEmployee);
    const d = {id:idEmployee};
    return axios.post(this.baseURLLocal +'active-Employee', {
      idEmployee:idEmployee
    });
  }

  getDemograficos(idOrganization:number) {
    //console.log('ID ORGANIZACION::', idOrganization);
    return axios
      .post(this.baseURLLocal +'get-demograficos', {idOrganization:idOrganization});
  }

  deleteDemografico(idDemografico:number) {
    //console.log('DR. idEmployee ',idEmployee);
    const d = {id:idDemografico};
    return axios.post(this.baseURLLocal +'delete-demografico', {
      idDemografico:idDemografico
    });
  }

  activeDemografico(idDemografico:number) {
    //console.log('DR. idEmployee ',idEmployee);
    const d = {id:idDemografico};
    return axios.post(this.baseURLLocal +'active-demografico', {
      idDemografico:idDemografico
    });
  }

  saveNewDemografico(campo: any, idOrganizacion: any) {    
   //console.log('CAMPO: ',campo);
    const data = {idOrganizacion:idOrganizacion,campo:campo.NombreCampo}
   //console.log('data: ',data);
    return axios.post(this.baseURLLocal +'insert-demographic-field', data);
  }

  saveNewClima(data_clima: any) {    
   //console.log('DATA_CLIMA_A_GUARDAR: ', data_clima);
    //const data = {idOrganizacion:idOrganizacion,campo:campo.NombreCampo}
    //console.log('data: ',data);

    return axios.post(this.baseURLLocal +'insert-flujo-clima', data_clima);
  }

  uploadFileV2(
    formData: FormData,
    onProgress?: (percent: number, event: any) => void
  ) {
    return axios.post(this.baseURLLocal +'upload-file-v2', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
      onUploadProgress: (e) => {
        const pct = Math.round((e.loaded * 100) / (e.total ?? 1));
        if (onProgress) {
          onProgress(pct, e);
        }
      }
    });
  }

  getClimas(idOrganization:number) {    
    return axios
      .post(this.baseURLLocal +'get-flujos-clima-json', {idOrganizacion:idOrganization});
  }

  getClimasById(idOrganization:number) {    
    return axios
      .post(this.baseURLLocal +'get-flujos-clima-by-id-json', {idOrganizacion:idOrganization});
  }

  getFactores(idOrganization:number) {    
    return axios
      .post(this.baseURLLocal +'get-factores-json', {idOrganizacion:idOrganization});
  }

  getGrandesFactores(idFlujo:number) {    
    return axios
      .post(this.baseURLLocal +'get-grandes-factores', {IdFlujo:idFlujo});
  }

   saveNewGFactor(data_gfactor: any) {    
    //console.log('DATA_GRAN_FACTOR_A_GUARDAR: ', data_gfactor);

    return axios.post(this.baseURLLocal +'insert-gran-factor', data_gfactor);
  
  }

  saveNewFactor(data_factor: any) {    
   //console.log('DATA_FACTOR_A_GUARDAR: ', data_factor);

    return axios.post(this.baseURLLocal +'insert-factor', data_factor);
  }

  deleteFactor(idFactor:number) {
    //console.log('DR. idEmployee ',idEmployee);
    const d = {idFactor:idFactor};
    return axios.post(this.baseURLLocal +'delete-factor', d);
  }

  updateClima(clima_data:any) {    

    return axios
      .post(this.baseURLLocal +'update-clima-status', clima_data);
  }

  saveNewPregunta(data_pregunta: any) {    
   //console.log('DATA_PREGUNTA_A_GUARDAR: ', data_pregunta);

    return axios.post(this.baseURLLocal +'insert-pregunta', data_pregunta);
  }

  updatePregunta(pregunta_data:any) {    
    return axios
      .post(this.baseURLLocal +'update-pregunta-estado', pregunta_data);
  }

  crearEnvioEncuesta(idFlujo:number) {

    const d = {IdFlujo:idFlujo};
    return axios.post(this.baseURLLocal +'crear-envio-encuestas', d);
  }

  crearEnvioEncuestaIndividual(datos:any) {

 
    return axios.post(this.baseURLLocal +'crear-envio-encuesta-individual', datos);
  }

  getEncuestasFlujo(idFlujo:number) {

    return axios
      .post(this.baseURLLocal +'get-encuestas-flujo', {IdFlujo:idFlujo});
  }

  sendEmail(mailBody: any) {

    return axios
      .post(this.baseURLLocal +'send-email-just-link', mailBody);
  }

  updateEncuestaEmpleado(update_data: any) {

    return axios
      .post(this.baseURLLocal +'actualizar-encuesta-empleado', update_data);
  }

  updateEncuestaEncabezado(update_data: any) {

    return axios
      .post(this.baseURLLocal +'actualizar-envio-encuesta-encabezado', update_data);
  }

  sendWhatsappMessage(mesaje_data: any) {

    return axios
      .post(this.baseURLLocal +'api/send-whatsapp-template-temp', mesaje_data);
  }

   sendWhatsappMessageProd(mesaje_data: any) {

    return axios
      .post(this.baseURLLocal +'api/s-w-t-j', mesaje_data);
  }


  saveNewTemplate(template_data: any) {    
   //console.log('DATA_PLANTILLA_A_GUARDAR: ', template_data);

    return axios.post(this.baseURLLocal +'insert-plantilla', template_data);
  }

  getFlujosPlantilla(idOrganizacion:number) {

    return axios
      .post(this.baseURLLocal +'get-flujos-con-plantilla', {IdOrganizacion:idOrganizacion});
  }

  getFlujoPlantilla(IdFlujo:number) {

    return axios
      .post(this.baseURLLocal +'get-clima-plantilla', {IdFlujo:IdFlujo});
  }

  getPreguntasClima(idFlujo:number) {    
    return axios
      .post(this.baseURLLocal +'get-clima-json', {idFlujo:idFlujo});
  }

  getPreguntasClimaGF(idFlujo:number,idEmpleado:number) {    
    return axios
      .post(this.baseURLLocal +'get-clima-json-gf', {idFlujo:idFlujo,idEmpleado:idEmpleado});
  }

  savePreguntas(preguntas_data: any) {    
    //console.log('DATA_PLANTILLA_A_GUARDAR: ', template_data);

    return axios.post(this.baseURLLocal +'guardar-encuesta-empleado', preguntas_data);
  }

  updateClimaEncuesta(clima_data:any) {    

    return axios
      .post(this.baseURLLocal +'update-encuesta-empleado', clima_data);
  }

  getClimaInfo(clima_data:any) {    
    return axios
      .post(this.baseURLLocal +'get-encuesta-info', clima_data);
  }

  getEmpleadoInfo(IdEmpleado:any) {    
    return axios
      .post(this.baseURLLocal +'get-empleado-info', {IdEmpleado:IdEmpleado});
  }

  getFlujosLista(idOrganizacion:number) {

    return axios
      .post(this.baseURLLocal +'get-flujos-list', {IdOrganizacion:idOrganizacion});
  }

  getMetricaFactores(idFlujo:number) {

    return axios
      .post(this.baseURLLocal +'get-metrica-factores', {IdFlujo:idFlujo});
  }

  getMetricaFactoresFiltrado(idFlujo:number, filtros:string) {

    return axios
      .post(this.baseURLLocal +'get-metrica-factores-filtrado', {IdFlujo:idFlujo,FiltrosDemograficos:filtros});
  }

  getMetricaFactoresFiltradoGF(idFlujo:number, filtros:string, filtrosGf:string, tipoFiltro:string) {

    return axios
      .post(this.baseURLLocal +'get-metrica-factores-filtrado-gf',
        {IdFlujo:idFlujo,
          FiltrosDemograficos:filtros,
          FiltrosGf: filtrosGf,
          TipoFiltro: tipoFiltro 
        });
  }

  getMetricaComments(idFlujo:number) {

    return axios
      .post(this.baseURLLocal +'get-metrica-comments', {IdFlujo:idFlujo});
  }

  getMetricaCommentsGF(idFlujo:number, filtrosGf:string) {

    return axios
      .post(this.baseURLLocal +'get-metrica-comments-gf', 
        {
          IdFlujo:idFlujo,
          FiltrosGf: filtrosGf
        });
  }
  

  getMetricaCommentsia(idFlujo:number) {

    return axios
      .post(this.baseURLLocal +'get-metrica-comments-ia', {IdFlujo:idFlujo});
  }

  getMetricaCommentsIAGF(idFlujo:number, filtrosGf:string) {

    return axios
      .post(this.baseURLLocal +'get-metrica-comments-ia-gf', 
        {
          IdFlujo:idFlujo,
          FiltrosGf: filtrosGf
        });
  }
  
 getMetricaConteoPreguntasFactores(idFlujo:number) {

    return axios
      .post(this.baseURLLocal +'get-metrica-conteo-factores', {IdFlujo:idFlujo});
  }

 getMetricaConteoPreguntasFactoresFILTRADO(idFlujo:number, filtros:string) {

    return axios
      .post(this.baseURLLocal +'get-metrica-conteo-factores-FILTRADO', {IdFlujo:idFlujo,FiltrosDemograficos:filtros});
  }

  getMetricaConteoPreguntasFactoresFILTRADOGF(idFlujo:number, filtros:string, filtrosGf:string) {
    return axios
      .post(this.baseURLLocal +'get-metrica-conteo-factores-FILTRADO-gf',
        {
          IdFlujo:idFlujo,
          FiltrosDemograficos:filtros,
          FiltrosGf: filtrosGf
        });
  }

  getMetricaSatisfaccionPreguntas(idFlujo:number) {

    return axios
      .post(this.baseURLLocal +'get-metrica-satisfaccion-preguntas', {IdFlujo:idFlujo});
  }

  getMetricaSatisfaccionPreguntasFILTRADO(idFlujo:number, filtros:string) {

    return axios
      .post(this.baseURLLocal +'get-metrica-satisfaccion-preguntas-FILTRADO', 
        {IdFlujo:idFlujo,FiltrosDemograficos:filtros});
  }

  getMetricaSatisfaccionPreguntasFILTRADOGF(idFlujo:number, filtros:string, filtrosGf:string, tipoFiltro:string) {

    return axios
      .post(this.baseURLLocal +'get-metrica-satisfaccion-preguntas-filtrado-gf', 
        {
          IdFlujo:idFlujo,
          FiltrosDemograficos:filtros,
          FiltrosGf: filtrosGf,
          TipoFiltro: tipoFiltro        
        });
  }

  getMetricaCalificacionGeneralClima(idFlujo:number) {

    return axios
      .post(this.baseURLLocal +'get-metrica-calificacion-general', {IdFlujo:idFlujo});
  }

  getMetricaCalificacionGeneralClimaFiltrado(idFlujo:number, filtros:string) {

    return axios
      .post(this.baseURLLocal +'get-metrica-calificacion-general-filtrado', {IdFlujo:idFlujo,FiltrosDemograficos:filtros});
  }

  getMetricaCalificacionGeneralClimaFiltradoGF(idFlujo:number, filtros:string, 
    filtrosGf:string, tipoFiltro:string) {

    return axios
      .post(this.baseURLLocal +'get-metrica-calificacion-general-filtrado-gf', 
        {
          IdFlujo:idFlujo,
          FiltrosDemograficos:filtros,
          FiltrosGf: filtrosGf,
          TipoFiltro: tipoFiltro         
        });
  }

  getAllMetrics(idFlujo:number, filtros:string, 
    filtrosGf:string, tipoFiltro:string) {

    return axios
      .post(this.baseURLLocal +'get-all-dash-metrics', 
        {
          IdFlujo:idFlujo,
          FiltrosDemograficos:filtros,
          FiltrosGf: filtrosGf,
          TipoFiltro: tipoFiltro         
        });
  }

  getMetricaEstadoEnvioClima(idFlujo:number) {

    return axios
      .post(this.baseURLLocal +'get-metrica-estado-envio', {IdFlujo:idFlujo});
  }

  getMetricaPorcentajeRespuestas(idFlujo:number) {

    return axios
      .post(this.baseURLLocal +'get-metrica-porcentaje-respuestas', {IdFlujo:idFlujo});
  }

  getMetricaPorcentajeRespuestasFiltrado(idFlujo:number, filtros:string) {

    return axios
      .post(this.baseURLLocal +'get-metrica-porcentaje-respuestas-filtrado', 
        {IdFlujo:idFlujo,FiltrosDemograficos:filtros});
  }

  getMetricaPorcentajeRespuestasFiltradoGF(idFlujo:number, filtros:string, filtrosGf:string) {

    return axios
      .post(this.baseURLLocal +'get-metrica-porcentaje-respuestas-filtrado-gf', 
        {IdFlujo:idFlujo,
          FiltrosDemograficos:filtros,
          FiltrosGf: filtrosGf
        
        });
  }

  getMetricaPorcentajeSatisfaccionFactor(idFlujo:number) {

    return axios
      .post(this.baseURLLocal +'get-metrica-porcentaje-satisfaccion-factor', {IdFlujo:idFlujo});
  }

  getMetricaPorcentajeSatisfaccionFactorFiltrado(idFlujo:number, filtros:string) {

    return axios
      .post(this.baseURLLocal +'get-metrica-porcentaje-satisfaccion-factor-filtrado', 
        {IdFlujo:idFlujo,FiltrosDemograficos:filtros});
  }

  getMetricaPorcentajeSatisfaccionFactorFiltradoGF(idFlujo:number, filtros:string, filtrosGf:string) {

    return axios
      .post(this.baseURLLocal +'get-metrica-porcentaje-satisfaccion-factor-filtrado-gf', 
        {
          IdFlujo:idFlujo,
          FiltrosDemograficos:filtros,
          FiltrosGf: filtrosGf
        
        });
  }

  getMetricaDemograficos(idOrg:number) {

    return axios
      .post(this.baseURLLocal +'get-metrica-demograficos', 
        {
          IdOrg:idOrg
          
        });
  }

  getFiltrosDemograficosRestrictivo(idOrg:number, idFlujo:number, minRespuestas: number) {

    return axios
      .post(this.baseURLLocal +'get-factores-demograficos-restrictivo', 
        {
          IdOrg: idOrg,
          IdFlujo: idFlujo,
          MinRespuestas: minRespuestas        
        });
  }

  getFiltrosDemograficosArbol(idOrg:number) {

    return axios
      .post(this.baseURLLocal +'get-factores-demograficos-arbol', 
        {
          IdOrg: idOrg     
        });
  }

  logni13(user:any) {
   //console.log('ENTRA EN LOGIN..');
    return axios
      .post(this.baseURLLocal +'logni13', user);

  }

  getMenuAccess(RoleId:any) {
  
    return axios
      .post(this.baseURLLocal +'get-access-menu', {RoleId: RoleId});

  }

  getUsers() {
    return axios
      .post(this.baseURLLocal +'get-users-json');
  }
  
  getRoles() {
    return axios
      .get(this.baseURLLocal +'get-roles-json');
  }

  getRolesByIdOrg(idOrganization:any) {
    return axios
      .post(this.baseURLLocal +'get-roles-by-id-org-json',{idOrganization:idOrganization});
  }

  saveUser(userData: any) {    
    //console.log('DATA_PLANTILLA_A_GUARDAR: ', template_data);

    return axios.post(this.baseURLLocal +'insert-user', userData);
  }

  updateUser(userData: any) {    
    //console.log('DATA_PLANTILLA_A_GUARDAR: ', template_data);

    return axios.post(this.baseURLLocal +'update-user', userData);
  }

  getRolesAccess() {
  
    return axios
      .get(this.baseURLLocal +'get-roles-access-json');

  }

  getRolesAccessByIdOrg(idOrganization:any) {
  
    return axios
      .post(this.baseURLLocal +'get-roles-access-by-id-org-json', {idOrganization:idOrganization});

  }

  saveRole(roleData: any) {    
    //console.log('DATA_PLANTILLA_A_GUARDAR: ', template_data);

    return axios.post(this.baseURLLocal +'insert-role', roleData);
  }

   updateRoleAccess(updRoleData: any) {    
    //console.log('DATA_PLANTILLA_A_GUARDAR: ', template_data);

    return axios.post(this.baseURLLocal +'update-role-access', updRoleData);
  }

  getUserById(userId:any) {
  
    return axios
      .post(this.baseURLLocal +'get-user-by-id-json', {userId:userId});

  }

   getGFactorsAccessByIdFlujo(idFlujo:any) {
  
    return axios
      .post(this.baseURLLocal +'get-gfactors-access-by-id-flujo-json', {idFlujo:idFlujo});

  }

  updateGFactorsAccessByIdFlujo(data:any) {
  
    return axios
      .post(this.baseURLLocal +'update-gf-access', data);

  }

   getConfigs() {
  
    return axios
      .get(this.baseURLLocal +'get-conf-json');

  }


  //encuesta orden
   updateGFactorsOrder(data:any) {
    return axios
      .post(this.baseURLLocal +'update-orden-gran-factores', data);
  }

  updateFactorsOrder(data:any) {
    return axios
      .post(this.baseURLLocal +'update-orden-factores', data);
  }

  updatePreguntasOrder(data:any) {
    return axios
      .post(this.baseURLLocal +'update-orden-preguntas', data);
  }

  updatePreguntaLabel(data:any) {    
    return axios
      .post(this.baseURLLocal +'update-pregunta-label', data);
  }

  insertPreguntaOpcion(data:any) {    
    return axios
      .post(this.baseURLLocal +'insert-pregunta-option', data);
  }

  updatePreguntaRango(data:any) {    
    return axios
      .post(this.baseURLLocal +'update-pregunta-range', data);
  }

  updatePreguntaLikertOptions(data:any) {
    return axios
      .post(this.baseURLLocal +'update-pregunta-likert-options', data);
  }

  insertEmailTemplate(data:any) {    
    return axios
      .post(this.baseURLLocal +'upsert-email-template', data);
  }


  enviarCorreoIndividual(mailBody: any) {

    return axios
      .post(this.baseURLLocal +'smjl-ind', mailBody);
  }


  
  obtenerPlantillasCorreoOrg(data: any) {

    return axios
      .post(this.baseURLLocal +'get-email-templates-by-org', data);
  }

  obtenerPlantillasCorreoByFlujo(data: any) {

    return axios
      .post(this.baseURLLocal +'get-email-templates-by-flow', data);
  }


   enviarCorreosPendienteClima(idFlujo:any) {

    return axios
      .post(this.baseURLLocal +'send-email-pendientes-just-link', idFlujo);
  }

  enviarCorreosCompletadosClima(idFlujo:any) {

    return axios
      .post(this.baseURLLocal +'send-email-completadas-just-link', idFlujo);
      
  }


  enviarCorreosTodosActivos(idFlujo:any) {

    return axios
      .post(this.baseURLLocal +'send-email-todos-activos-just-link', idFlujo);
      
  }

  obtenerTotalPreguntasActivasClima(idFlujo:any) {

    return axios
      .post(this.baseURLLocal +'get-total-preguntas-encuesta', idFlujo);
      
  }



}
