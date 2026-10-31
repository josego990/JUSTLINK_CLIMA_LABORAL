import { Injectable } from '@angular/core';
import { HttpClient, HttpContext } from '@angular/common/http';
import { BehaviorSubject, Subject } from 'rxjs';
import axios from 'axios';
import { environment } from '../../../environments/environment';
import { SKIP_SESSION_VALIDATION } from '../../core/interceptor/session-validation.context';

export interface SelectedOrganization {
  Id: number;
  Nombre: string;
}

export interface ClimaDashboardFilter {
  campoId: number;
  valor: string;
}

export interface ClimaDashboardPayload {
  idOrganizacion: number;
  idFlujo: number;
  filtrosDemograficos: ClimaDashboardFilter[];
  idsGrandesFactores: number[];
  modo: 'AND' | 'OR';
}

export interface ClimaDashboardCommentsPayload extends ClimaDashboardPayload {
  tipo: 'TODOS' | 'TEXT' | 'IATEXT';
  idPregunta: number | null;
  pagina: number;
  limite: number;
}

const SELECTED_ORGANIZATION_STORAGE_KEY = 'justlink.selectedOrganization';

@Injectable({
  providedIn: 'root',
})
export class OrganizacionService {

  private configs:any = sessionStorage.getItem('configs');
  private confslist:any = [];

  private baseURL = 'https://api.justlink360.net/';
  //private baseURL_DESA = 'http://98.88.117.108:3030/'
  private baseURLLocal = 'http://localhost:3030/';

  private selectedOrganizationSubject = new BehaviorSubject<SelectedOrganization | null>(
    this.readStoredSelectedOrganization()
  );
  public selectedOrganization$ = this.selectedOrganizationSubject.asObservable();
  private organizationsChangedSubject = new Subject<void>();
  public organizationsChanged$ = this.organizationsChangedSubject.asObservable();


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

  get selectedOrganizationSnapshot(): SelectedOrganization | null {
    return this.selectedOrganizationSubject.value;
  }

  normalizeOrganizationOption(value: any): SelectedOrganization | null {
    const id = Number(
      value?.Id ??
      value?.id ??
      value?.IdOrganizacion ??
      value?.idOrganizacion ??
      value?.organizacionId ??
      value?.organizationId ??
      value
    );

    if (!Number.isFinite(id) || id <= 0) {
      return null;
    }

    const name = String(
      value?.Nombre ??
      value?.nombre ??
      value?.NombreOrganizacion ??
      value?.nombreOrganizacion ??
      value?.organizacion ??
      value?.organization ??
      value?.name ??
      ''
    ).trim();

    return {
      Id: id,
      Nombre: name || `Organización ${id}`,
    };
  }

  setSelectedOrganization(organization: any | null): void {
    const normalized = this.normalizeOrganizationOption(organization);

    if (!normalized) {
      this.clearSelectedOrganization();
      return;
    }

    this.selectedOrganizationSubject.next(normalized);
    this.persistSelectedOrganization(normalized);
  }

  selectOrganizationById(idOrganization: any, organizations: any[]): SelectedOrganization | null {
    const id = Number(idOrganization);

    if (!Number.isFinite(id) || id <= 0) {
      return null;
    }

    const selected = (organizations ?? [])
      .map((item) => this.normalizeOrganizationOption(item))
      .find((item): item is SelectedOrganization => !!item && item.Id === id) ?? null;

    if (selected) {
      this.setSelectedOrganization(selected);
    }

    return selected;
  }

  clearSelectedOrganization(): void {
    this.selectedOrganizationSubject.next(null);

    try {
      localStorage.removeItem(SELECTED_ORGANIZATION_STORAGE_KEY);
    } catch {
      // localStorage may be unavailable in some execution contexts.
    }
  }

  notifyOrganizationsChanged(): void {
    this.organizationsChangedSubject.next();
  }

  private readStoredSelectedOrganization(): SelectedOrganization | null {
    try {
      const raw = localStorage.getItem(SELECTED_ORGANIZATION_STORAGE_KEY);
      return raw ? this.normalizeOrganizationOption(JSON.parse(raw)) : null;
    } catch {
      return null;
    }
  }

  private persistSelectedOrganization(organization: SelectedOrganization): void {
    try {
      localStorage.setItem(SELECTED_ORGANIZATION_STORAGE_KEY, JSON.stringify(organization));
    } catch {
      // Ignore persistence errors; the in-memory selection remains available.
    }
  }

  private isDemoModeActive(): boolean {
    return !!environment.demo?.enabled;
  }

  private getApiEndpoint(endpoint: string): string {
    const normalizedEndpoint = this.isDemoModeActive() && !endpoint.endsWith('_demo')
      ? `${endpoint}_demo`
      : endpoint;

    return this.baseURLLocal + normalizedEndpoint;
  }

  private getRestApiEndpoint(endpoint: string): string {
    return this.baseURLLocal + endpoint.replace(/^\/+/, '');
  }

  private getNoCacheConfig(params: Record<string, any> = {}) {
    const token = this.getCurrentUserToken();

    return {
      params: {
        ...params,
        _ts: Date.now(),
      },
      headers: {
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
        'Cache-Control': 'no-cache, no-store, must-revalidate',
        Pragma: 'no-cache',
        Expires: '0',
      },
      timeout: 15000,
    };
  }

  private getNoCacheHttpOptions(params: Record<string, any> = {}) {
    return {
      ...this.getNoCacheConfig(params),
      context: new HttpContext().set(SKIP_SESSION_VALIDATION, true),
    };
  }

  private getAuthorizedHttpOptions(params: Record<string, any> = {}) {
    const token = this.getCurrentUserToken();

    return {
      params,
      headers: {
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
        'Cache-Control': 'no-cache, no-store, must-revalidate',
        Pragma: 'no-cache',
        Expires: '0',
      },
      context: new HttpContext().set(SKIP_SESSION_VALIDATION, true),
    };
  }

  private getCurrentUserToken(): string | null {
    try {
      const currentUser = JSON.parse(localStorage.getItem('currentUser') || 'null');
      const token = currentUser?.token
        ?? currentUser?.jwt
        ?? currentUser?.jwtToken
        ?? currentUser?.accessToken
        ?? currentUser?.access_token
        ?? currentUser?.idToken
        ?? currentUser?.Token
        ?? currentUser?.JWT;

      return typeof token === 'string' && token.trim() ? token.trim() : null;
    } catch {
      return null;
    }
  }

  private getPublicRequestOptions(
    params?: Record<string, any>,
    headers?: Record<string, string>
  ) {
    return {
      ...(params ? { params } : {}),
      ...(headers ? { headers } : {}),
      context: new HttpContext().set(SKIP_SESSION_VALIDATION, true),
    };
  }

  saveNewOrganization(organizacion: any) {
    return axios
      .post(this.getApiEndpoint('save-new-organization'), JSON.stringify(organizacion));
  }

  login(userData: any) {
    return axios
      .post(this.getApiEndpoint('logni13'), userData);
  }

  updateOrganization(organizacion: any) {
    return axios
      .post(this.getApiEndpoint('update-organization'), JSON.stringify(organizacion));
  }

  getOrganizations() {
    return axios
      .get(this.getApiEndpoint('get-organizations'));
  }

  getDesempenoOrganizations() {
    return axios
      .get(
        this.getRestApiEndpoint('api/desempeno/organizaciones'),
        this.getNoCacheConfig()
      );
  }

  getDesempenoOrganizationsHttp() {
    return this.http.get(
      this.getRestApiEndpoint('api/desempeno/organizaciones'),
      this.getNoCacheConfig()
    );
  }

  getDesempenoEmployees(params?: Record<string, any>) {
    return axios
      .get(
        this.getRestApiEndpoint('api/desempeno/empleados'),
        this.getNoCacheConfig(params ?? {})
      );
  }

  getDesempenoOrganigrama(idOrganizacion: number) {
    return axios
      .get(this.getRestApiEndpoint('api/desempeno/organizacion/organigrama'), {
        params: { idOrganizacion },
      });
  }

  getDesempenoDashboard(idOrganizacion: number) {
    return axios
      .get(
        this.getRestApiEndpoint('api/desempeno/dashboard'),
        this.getNoCacheConfig({ idOrganizacion })
      );
  }

  getDesempenoDashboardHttp(idOrganizacion: number) {
    return this.http.get(
      this.getRestApiEndpoint('api/desempeno/dashboard'),
      this.getNoCacheConfig({ idOrganizacion })
    );
  }

  getDesempenoScales(params?: Record<string, any>) {
    return axios
      .get(this.getRestApiEndpoint('api/desempeno/escalas'), { params });
  }

  getDesempenoCatalogs(params?: Record<string, any>) {
    return axios
      .get(this.getRestApiEndpoint('api/desempeno/catalogos'), { params });
  }

  getDesempenoModelTypeScenarios(typeCode: string) {
    return axios
      .get(
        this.getRestApiEndpoint(
          `api/desempeno/catalogos/tipos-modelo/${encodeURIComponent(typeCode)}/escenarios`
        )
      );
  }

  getDesempenoPositions(params?: Record<string, any>) {
    return axios
      .get(this.getRestApiEndpoint('api/desempeno/puestos'), { params });
  }

  getDesempenoCriteriaBank(idOrganizacion: number, params?: Record<string, any>) {
    return axios
      .get(
        this.getRestApiEndpoint('api/desempeno/banco-criterios'),
        this.getNoCacheConfig({
          ...params,
          organizationId: idOrganizacion,
        })
      );
  }

  saveDesempenoCriteriaBankCriterion(payload: any, criterionId?: number | string | null) {
    const config = this.getNoCacheConfig();
    const normalizedId = Number(criterionId);

    if (Number.isInteger(normalizedId) && normalizedId > 0) {
      return axios.put(
        this.getRestApiEndpoint(`api/desempeno/banco-criterios/${normalizedId}`),
        payload,
        config
      );
    }

    return axios.post(
      this.getRestApiEndpoint('api/desempeno/banco-criterios'),
      payload,
      config
    );
  }

  updateDesempenoCriteriaBankCriterionStatus(
    criterionId: number | string,
    organizationId: number,
    active: boolean
  ) {
    return axios.patch(
      this.getRestApiEndpoint(`api/desempeno/banco-criterios/${Number(criterionId)}/estado`),
      { organizationId, active },
      this.getNoCacheConfig()
    );
  }

  deleteDesempenoCriteriaBankCriterion(criterionId: number | string, organizationId: number) {
    return axios.delete(
      this.getRestApiEndpoint(`api/desempeno/banco-criterios/${Number(criterionId)}`),
      this.getNoCacheConfig({ organizationId })
    );
  }

  importDesempenoCriteriaBank(payload: any) {
    return axios.post(
      this.getRestApiEndpoint('api/desempeno/banco-criterios/importar'),
      payload,
      this.getNoCacheConfig()
    );
  }

  getDesempenoModels(idOrganizacion: number, params?: Record<string, any>) {
    return axios
      .get(this.getRestApiEndpoint('api/desempeno/modelos'), {
        params: {
          ...params,
          idOrganizacion,
        },
      });
  }

  getDesempenoModelsHttp(idOrganizacion: number, params?: Record<string, any>) {
    return this.http.get(
      this.getRestApiEndpoint('api/desempeno/modelos'),
      this.getNoCacheHttpOptions({
        ...params,
        idOrganizacion,
      })
    );
  }

  getDesempenoModelsSelectHttp(idOrganizacion: number) {
    return this.http.get(
      this.getRestApiEndpoint('api/desempeno/modelos/select'),
      this.getAuthorizedHttpOptions({ idOrganizacion })
    );
  }

  getDesempenoGroupedResponsesByModel(id: number, idOrganizacion: number) {
    return axios
      .get(
        this.getRestApiEndpoint(`api/desempeno/modelos/${id}/respuestas-agrupadas`),
        this.getNoCacheConfig({ idOrganizacion })
      );
  }

  getDesempenoAiActionPlans(idOrganizacion: number, modeloId: number) {
    return axios
      .get(
        this.getRestApiEndpoint('api/desempeno/ia/planes-accion'),
        this.getNoCacheConfig({ idOrganizacion, modeloId })
      );
  }

  getDesempenoActionPlans(idOrganizacion: number, modeloId: number, params?: Record<string, any>) {
    return axios
      .get(
        this.getRestApiEndpoint('api/desempeno/planes-accion'),
        this.getNoCacheConfig({
          soloActivos: true,
          ...params,
          idOrganizacion,
          modeloId,
        })
      );
  }

  saveDesempenoActionPlan(payload: any, planId?: number | null) {
    const config = this.getNoCacheConfig();
    const url = planId && planId > 0
      ? this.getRestApiEndpoint(`api/desempeno/planes-accion/${planId}`)
      : this.getRestApiEndpoint('api/desempeno/planes-accion');

    return planId && planId > 0
      ? axios.put(url, payload, config)
      : axios.post(url, payload, config);
  }

  deleteDesempenoActionPlan(planId: number, idOrganizacion: number, descartarOportunidad = false) {
    return axios
      .delete(
        this.getRestApiEndpoint(`api/desempeno/planes-accion/${planId}`),
        this.getNoCacheConfig({ idOrganizacion, descartarOportunidad })
      );
  }

  generateDesempenoAiActionPlan(payload: any) {
    const config = this.getNoCacheConfig();
    return axios
      .post(
        this.getRestApiEndpoint('api/desempeno/ia/planes-accion'),
        payload,
        {
          ...config,
          timeout: 180000,
        }
      );
  }

  getDesempenoModelById(id: number, idOrganizacion: number) {
    return axios
      .get(this.getRestApiEndpoint(`api/desempeno/modelos/${id}`), {
        params: { idOrganizacion },
      });
  }

  saveDesempenoModel(model: any) {
    return axios
      .post(this.getRestApiEndpoint('api/desempeno/modelos'), model);
  }

  updateDesempenoModel(id: number, model: any) {
    return axios
      .put(this.getRestApiEndpoint(`api/desempeno/modelos/${id}`), model);
  }

  duplicateDesempenoModel(id: number, payload: {
    organizacionId: number;
    codigo: string;
    nombre: string;
    version: number;
  }) {
    return axios
      .post(this.getRestApiEndpoint(`api/desempeno/modelos/${id}/duplicar`), payload);
  }

  createDesempenoIndividualSurveySend(payload: {
    organizationId: number;
    IdModelo: number;
    IdEmpleado: number;
    Estado: string;
    IdsEmpleadosEnviar: number[];
  }) {
    return axios
      .post(
        this.getRestApiEndpoint('api/desempeno/crear-envio-encuesta-individual'),
        payload
      );
  }

  getDesempenoSurveySends(
    idModelo: number,
    idEmpleado: number,
    organizationId: number
  ) {
    return axios
      .get(this.getRestApiEndpoint('api/desempeno/envios-encuesta'), {
        params: { idModelo, idEmpleado, organizationId },
      });
  }

  getDesempenoSurveySendById(id: number) {
    return axios
      .get(this.getRestApiEndpoint(`api/desempeno/envios-encuesta/${id}`));
  }

  getDesempenoEvaluationForm(
    idEmpleado: number,
    idEmpleadoEvaluado: number
  ) {
    return this.http.get(
      this.getRestApiEndpoint('api/desempeno/formulario-evaluacion'),
      this.getPublicRequestOptions({
        idEmpleado,
        idEmpleadoEvaluado,
      })
    );
  }

  getDesempenoEvaluationCenter(codigoEncuestaEmpleado: string) {
    return this.http.post(
      this.getRestApiEndpoint('api/desempeno/centro-evaluaciones'),
      { codigoEncuestaEmpleado },
      this.getPublicRequestOptions()
    );
  }

  saveDesempenoResponseDraft(
    token: string,
    payload: any,
    turnstileToken: string
  ) {
    return this.http.put(
      this.getRestApiEndpoint(
        `api/desempeno/respuestas/token/${encodeURIComponent(token)}`
      ),
      payload,
      this.getPublicRequestOptions(undefined, {
        'Turnstile-Token': turnstileToken,
      })
    );
  }

  finalizeDesempenoResponse(
    token: string,
    payload: any,
    turnstileToken: string
  ) {
    return this.http.post(
      this.getRestApiEndpoint(
        `api/desempeno/respuestas/token/${encodeURIComponent(token)}/finalizar`
      ),
      payload,
      this.getPublicRequestOptions(undefined, {
        'Turnstile-Token': turnstileToken,
      })
    );
  }

  sendDesempenoEmail(payload: any) {
    return axios
      .post(this.getRestApiEndpoint('send-email-just-link-desempeno'), payload);
  }

  sendClimaActionPlanEmail(payload: any) {
    return axios.post(
      this.getRestApiEndpoint('send-email-just-link-clima-planes-accion'),
      payload,
      this.getNoCacheConfig()
    );
  }

  sendDesempenoWhatsapp(payload: any) {
    return axios.post(
      this.getRestApiEndpoint('api/s-w-t-j-des'),
      payload,
      this.getNoCacheConfig()
    );
  }

  saveDesempenoScale(scale: any) {
    return axios
      .post(this.getRestApiEndpoint('api/desempeno/escalas'), scale);
  }

  getDesempenoScaleById(id: number) {
    return axios
      .get(this.getRestApiEndpoint(`api/desempeno/escalas/${id}`));
  }

  updateDesempenoScale(id: number, scale: any) {
    return axios
      .put(this.getRestApiEndpoint(`api/desempeno/escalas/${id}`), scale);
  }

  updateDesempenoScaleDetail(id: number, payload: any) {
    return axios
      .put(this.getRestApiEndpoint(`api/desempeno/escalas/${id}/detalle`), payload);
  }

  getDesempenoEmployeeById(id: number) {
    return axios
      .get(this.getRestApiEndpoint(`api/desempeno/empleados/${id}`));
  }

  saveDesempenoEmployee(employee: any) {
    return axios
      .post(this.getRestApiEndpoint('api/desempeno/empleados'), employee);
  }

  updateDesempenoEmployee(id: number, employee: any) {
    return axios
      .put(this.getRestApiEndpoint(`api/desempeno/empleados/${id}`), employee);
  }

  updateDesempenoEmployeeDemographics(id: number, payload: any) {
    return axios
      .put(this.getRestApiEndpoint(`api/desempeno/empleados/${id}/demograficos`), payload);
  }

  getDesempenoCamposDemograficos(params?: Record<string, any>) {
    return axios
      .get(this.getRestApiEndpoint('api/desempeno/campos-demograficos'), { params });
  }

  saveDesempenoCampoDemografico(campo: any) {
    return axios
      .post(this.getRestApiEndpoint('api/desempeno/campos-demograficos'), campo);
  }

  updateDesempenoCampoDemografico(id: number, campo: any) {
    return axios
      .put(this.getRestApiEndpoint(`api/desempeno/campos-demograficos/${id}`), campo);
  }

  updateDesempenoCampoDemograficoEstado(id: number, estado: { activo: boolean }) {
    return axios
      .patch(this.getRestApiEndpoint(`api/desempeno/campos-demograficos/${id}/estado`), estado);
  }

  getDesempenoCampoDemograficoOpciones(id: number) {
    return axios
      .get(this.getRestApiEndpoint(`api/desempeno/campos-demograficos/${id}/opciones`));
  }

  saveDesempenoCampoDemograficoOpcion(id: number, opcion: any) {
    return axios
      .post(this.getRestApiEndpoint(`api/desempeno/campos-demograficos/${id}/opciones`), opcion);
  }

  updateDesempenoCampoDemograficoOpcion(id: number, idOpcion: number, opcion: any) {
    return axios
      .put(
        this.getRestApiEndpoint(`api/desempeno/campos-demograficos/${id}/opciones/${idOpcion}`),
        opcion
      );
  }

  updateDesempenoCampoDemograficoOpcionEstado(
    id: number,
    idOpcion: number,
    estado: { activo: boolean }
  ) {
    return axios
      .patch(
        this.getRestApiEndpoint(`api/desempeno/campos-demograficos/${id}/opciones/${idOpcion}/estado`),
        estado
      );
  }

  saveDesempenoOrganization(organizacion: any) {
    return axios
      .post(this.getRestApiEndpoint('api/desempeno/organizaciones'), organizacion);
  }

  updateDesempenoOrganization(id: number, organizacion: any) {
    return axios
      .put(this.getRestApiEndpoint(`api/desempeno/organizaciones/${id}`), organizacion);
  }


  getOrganizationIdByFlujoId(IdFlujo:any) {
    return axios
      .post(this.getApiEndpoint('get-org-by-flujo-id'), {IdFlujo:IdFlujo});
  }


  getOrganizationById(idOrganization: any) {
    return axios
      .post(this.getApiEndpoint('get-organization-by-id'),{idOrganization:idOrganization});
  }

  deleteOrganization(idOrganization:number) {
   //console.log('DR. HOUSE ',idOrganization);

    return axios.post(this.getApiEndpoint('delete-organization'), {idOrganization:idOrganization});
  }

  getCountries() {
    return axios
      .get(this.getApiEndpoint('get-countries'));
  }

  saveNewEmployee(employee: any) {
    return axios
      .post(this.getApiEndpoint('insert-employeeSecure'), employee);
  }

  updateEmployee(employee: any) {
    return axios
      .post(this.getApiEndpoint('update-employeeSecure'), employee);
  }

  updateEmployeesSendType(
    idOrganizacion: number,
    idsEmpleados: number[],
    tipoEnvioEncuesta: number,
  ) {
    return axios.patch(
      this.getRestApiEndpoint('api/organization/employees/tipo-envio'),
      {
        idOrganizacion,
        idsEmpleados,
        tipoEnvioEncuesta,
      },
      this.getNoCacheConfig(),
    );
  }

  saveNewEmployeesExcel(employees: any) {
    return axios
      .post(this.getApiEndpoint('insert-employees-batch'), employees);
  }

  saveNewPreguntasExcel(preguntas: any) {
    return axios
      .post(this.getApiEndpoint('insert-preguntas-excel'), preguntas);
  }

  getEmployees(idOrganization:number) {
    //console.log('ID ORGANIZACION::', idOrganization);
    return axios
      .post(this.getApiEndpoint('get-employees'), {idOrganization:idOrganization});
  }

  deleteEmployee(idEmployee:number) {
    //console.log('DR. idEmployee ',idEmployee);
    const d = {id:idEmployee};
    return axios.post(this.getApiEndpoint('delete-Employee'), {
      idEmployee:idEmployee
    });
  }

  activeEmployee(idEmployee:number) {
    //console.log('DR. idEmployee ',idEmployee);
    const d = {id:idEmployee};
    return axios.post(this.getApiEndpoint('active-Employee'), {
      idEmployee:idEmployee
    });
  }

  getDemograficos(idOrganization:number) {
    //console.log('ID ORGANIZACION::', idOrganization);
    return axios
      .post(this.getApiEndpoint('get-demograficos'), {idOrganization:idOrganization});
  }

  deleteDemografico(idDemografico:number) {
    //console.log('DR. idEmployee ',idEmployee);
    const d = {id:idDemografico};
    return axios.post(this.getApiEndpoint('delete-demografico'), {
      idDemografico:idDemografico
    });
  }

  activeDemografico(idDemografico:number) {
    //console.log('DR. idEmployee ',idEmployee);
    const d = {id:idDemografico};
    return axios.post(this.getApiEndpoint('active-demografico'), {
      idDemografico:idDemografico
    });
  }

  saveNewDemografico(campo: any, idOrganizacion: any) {    
   //console.log('CAMPO: ',campo);
    const data = {idOrganizacion:idOrganizacion,campo:campo.NombreCampo}
   //console.log('data: ',data);
    return axios.post(this.getApiEndpoint('insert-demographic-field'), data);
  }

  saveNewClima(data_clima: any) {    
   //console.log('DATA_CLIMA_A_GUARDAR: ', data_clima);
    //const data = {idOrganizacion:idOrganizacion,campo:campo.NombreCampo}
    //console.log('data: ',data);

    return axios.post(this.getApiEndpoint('insert-flujo-clima'), data_clima);
  }

  uploadFileV2(
    formData: FormData,
    onProgress?: (percent: number, event: any) => void
  ) {
    return axios.post(this.getApiEndpoint('upload-file-v2'), formData, {
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
      .post(this.getApiEndpoint('get-flujos-clima-json'), {idOrganizacion:idOrganization});
  }

  getClimasById(idOrganization:number) {    
    return axios
      .post(this.getApiEndpoint('get-flujos-clima-by-id-json'), {idOrganizacion:idOrganization});
  }

  getFactores(idOrganization:number) {    
    return axios
      .post(this.getApiEndpoint('get-factores-json'), {idOrganizacion:idOrganization});
  }

  getGrandesFactores(idFlujo:number) {    
    return axios
      .post(this.getApiEndpoint('get-grandes-factores'), {IdFlujo:idFlujo});
  }

   saveNewGFactor(data_gfactor: any) {    
    //console.log('DATA_GRAN_FACTOR_A_GUARDAR: ', data_gfactor);

    return axios.post(this.getApiEndpoint('insert-gran-factor'), data_gfactor);
  
  }

  saveNewFactor(data_factor: any) {    
   //console.log('DATA_FACTOR_A_GUARDAR: ', data_factor);

    return axios.post(this.getApiEndpoint('insert-factor'), data_factor);
  }

  renameClimateStructureElement(payload: {
    tipoElemento: 'ENCUESTA' | 'FACTOR';
    idOrganizacion: number;
    idClima: number;
    idElemento: number;
    nuevoNombre: string;
    descripcion?: string | null;
    idEncuesta?: number;
  }) {
    const body = { ...payload } as any;
    if (body.descripcion === undefined || body.descripcion === null) {
      delete body.descripcion;
    } else {
      body.descripcion = String(body.descripcion);
    }

    return axios.post(
      this.getRestApiEndpoint('api/clima/estructura/renombrar'),
      body,
      this.getNoCacheConfig()
    );
  }

  updateGFactor(data_gfactor: any) {
    return this.renameClimateStructureElement({
      tipoElemento: 'ENCUESTA',
      idOrganizacion: Number(
        data_gfactor?.IdOrganizacion ??
        data_gfactor?.idOrganizacion ??
        this.selectedOrganizationSnapshot?.Id ??
        0
      ),
      idClima: Number(data_gfactor?.IdFlujo ?? data_gfactor?.idFlujo ?? 0),
      idElemento: Number(data_gfactor?.Id ?? data_gfactor?.IdGranFactor ?? data_gfactor?.idGranFactor ?? 0),
      nuevoNombre: String(data_gfactor?.Etiqueta ?? data_gfactor?.nuevoNombre ?? '').trim(),
      descripcion: data_gfactor?.Descripcion ?? data_gfactor?.descripcion ?? null,
    });
  }

  updateFactor(data_factor: any) {
    return this.renameClimateStructureElement({
      tipoElemento: 'FACTOR',
      idOrganizacion: Number(
        data_factor?.IdOrganizacion ??
        data_factor?.idOrganizacion ??
        this.selectedOrganizationSnapshot?.Id ??
        0
      ),
      idClima: Number(data_factor?.IdFlujo ?? data_factor?.idFlujo ?? 0),
      idEncuesta: Number(data_factor?.IdGFactor ?? data_factor?.IdGranFactor ?? data_factor?.idGFactor ?? 0),
      idElemento: Number(data_factor?.Id ?? data_factor?.IdFactor ?? data_factor?.idFactor ?? 0),
      nuevoNombre: String(data_factor?.Etiqueta ?? data_factor?.nuevoNombre ?? '').trim(),
      descripcion: data_factor?.Descripcion ?? data_factor?.descripcion ?? null,
    });
  }

  deleteFactor(idFactor:number) {
    //console.log('DR. idEmployee ',idEmployee);
    const d = {idFactor:idFactor};
    return axios.post(this.getApiEndpoint('delete-factor'), d);
  }

  updateClima(clima_data:any) {    

    return axios
      .post(this.getApiEndpoint('update-clima-status'), clima_data);
  }

  saveNewPregunta(data_pregunta: any) {    
   //console.log('DATA_PREGUNTA_A_GUARDAR: ', data_pregunta);

    return axios.post(this.getApiEndpoint('insert-pregunta'), data_pregunta);
  }

  updatePregunta(pregunta_data:any) {    
    return axios
      .post(this.getApiEndpoint('update-pregunta-estado'), pregunta_data);
  }

  crearEnvioEncuesta(idFlujo:number) {

    const d = {IdFlujo:idFlujo};
    return axios.post(this.getApiEndpoint('crear-envio-encuestas'), d);
  }

  crearEnvioEncuestaIndividual(datos:any) {

 
    return axios.post(this.getApiEndpoint('crear-envio-encuesta-individual'), datos);
  }

  getEncuestasFlujo(idFlujo:number) {

    return axios
      .post(this.getApiEndpoint('get-encuestas-flujo'), {IdFlujo:idFlujo});
  }

  sendEmail(mailBody: any) {

    return axios
      .post(this.getApiEndpoint('send-email-just-link'), mailBody);
  }

  updateEncuestaEmpleado(update_data: any) {

    return axios
      .post(this.getApiEndpoint('actualizar-encuesta-empleado'), update_data);
  }

  updateEncuestaEncabezado(update_data: any) {

    return axios
      .post(this.getApiEndpoint('actualizar-envio-encuesta-encabezado'), update_data);
  }

  sendWhatsappMessage(mesaje_data: any) {

    return axios
      .post(this.getApiEndpoint('api/send-whatsapp-template-temp'), mesaje_data);
  }

   sendWhatsappMessageProd(mesaje_data: any) {

    return axios
      .post(this.getApiEndpoint('api/s-w-t-j'), mesaje_data);
  }


  saveNewTemplate(template_data: any) {    
   //console.log('DATA_PLANTILLA_A_GUARDAR: ', template_data);

    return axios.post(this.getApiEndpoint('insert-plantilla'), template_data);
  }

  getFlujosPlantilla(idOrganizacion:number) {

    return axios
      .post(this.getApiEndpoint('get-flujos-con-plantilla'), {IdOrganizacion:idOrganizacion});
  }

  getFlujoPlantilla(IdFlujo:number) {

    return axios
      .post(this.getApiEndpoint('get-clima-plantilla'), {IdFlujo:IdFlujo});
  }

  getPreguntasClima(idFlujo:number) {    
    return axios
      .post(this.getApiEndpoint('get-clima-json'), {idFlujo:idFlujo});
  }

  getPreguntasClimaGF(idFlujo:number,idEmpleado:number) {    
    return axios
      .post(this.getApiEndpoint('get-clima-json-gf'), {idFlujo:idFlujo,idEmpleado:idEmpleado});
  }

  savePreguntas(preguntas_data: any, turnstileToken = '') {
    //console.log('DATA_PLANTILLA_A_GUARDAR: ', template_data);

    return axios.post(
      this.getApiEndpoint('guardar-encuesta-empleado'),
      preguntas_data,
      {
        headers: {
          'Turnstile-Token': turnstileToken,
        },
      }
    );
  }

  updateClimaEncuesta(clima_data:any) {    

    return axios
      .post(this.getApiEndpoint('update-encuesta-empleado'), clima_data);
  }

  getClimaInfo(clima_data:any) {    
    return axios
      .post(this.getApiEndpoint('get-encuesta-info'), clima_data);
  }

  getEmpleadoInfo(IdEmpleado:any) {    
    return axios
      .post(this.getApiEndpoint('get-empleado-info'), {IdEmpleado:IdEmpleado});
  }

  getFlujosLista(idOrganizacion:number) {

    return axios
      .post(this.getApiEndpoint('get-flujos-list'), {IdOrganizacion:idOrganizacion});
  }

  getMetricaFactores(idFlujo:number) {

    return axios
      .post(this.getApiEndpoint('get-metrica-factores'), {IdFlujo:idFlujo});
  }

  getMetricaFactoresFiltrado(idFlujo:number, filtros:string) {

    return axios
      .post(this.getApiEndpoint('get-metrica-factores-filtrado'), {IdFlujo:idFlujo,FiltrosDemograficos:filtros});
  }

  getMetricaFactoresFiltradoGF(idFlujo:number, filtros:string, filtrosGf:string, tipoFiltro:string) {

    return axios
      .post(this.getApiEndpoint('get-metrica-factores-filtrado-gf'),
        {IdFlujo:idFlujo,
          FiltrosDemograficos:filtros,
          FiltrosGf: filtrosGf,
          TipoFiltro: tipoFiltro 
        });
  }

  getMetricaComments(idFlujo:number) {

    return axios
      .post(this.getApiEndpoint('get-metrica-comments'), {IdFlujo:idFlujo});
  }

  getMetricaCommentsGF(idFlujo:number, filtrosGf:string) {

    return axios
      .post(this.getApiEndpoint('get-metrica-comments-gf'), 
        {
          IdFlujo:idFlujo,
          FiltrosGf: filtrosGf
        });
  }
  

  getMetricaCommentsia(idFlujo:number) {

    return axios
      .post(this.getApiEndpoint('get-metrica-comments-ia'), {IdFlujo:idFlujo});
  }

  getMetricaCommentsIAGF(idFlujo:number, filtrosGf:string) {

    return axios
      .post(this.getApiEndpoint('get-metrica-comments-ia-gf'), 
        {
          IdFlujo:idFlujo,
          FiltrosGf: filtrosGf
        });
  }
  
 getMetricaConteoPreguntasFactores(idFlujo:number) {

    return axios
      .post(this.getApiEndpoint('get-metrica-conteo-factores'), {IdFlujo:idFlujo});
  }

 getMetricaConteoPreguntasFactoresFILTRADO(idFlujo:number, filtros:string) {

    return axios
      .post(this.getApiEndpoint('get-metrica-conteo-factores-FILTRADO'), {IdFlujo:idFlujo,FiltrosDemograficos:filtros});
  }

  getMetricaConteoPreguntasFactoresFILTRADOGF(idFlujo:number, filtros:string, filtrosGf:string) {
    return axios
      .post(this.getApiEndpoint('get-metrica-conteo-factores-FILTRADO-gf'),
        {
          IdFlujo:idFlujo,
          FiltrosDemograficos:filtros,
          FiltrosGf: filtrosGf
        });
  }

  getMetricaSatisfaccionPreguntas(idFlujo:number) {

    return axios
      .post(this.getApiEndpoint('get-metrica-satisfaccion-preguntas'), {IdFlujo:idFlujo});
  }

  getMetricaSatisfaccionPreguntasFILTRADO(idFlujo:number, filtros:string) {

    return axios
      .post(this.getApiEndpoint('get-metrica-satisfaccion-preguntas-FILTRADO'), 
        {IdFlujo:idFlujo,FiltrosDemograficos:filtros});
  }

  getMetricaSatisfaccionPreguntasFILTRADOGF(idFlujo:number, filtros:string, filtrosGf:string, tipoFiltro:string) {

    return axios
      .post(this.getApiEndpoint('get-metrica-satisfaccion-preguntas-filtrado-gf'), 
        {
          IdFlujo:idFlujo,
          FiltrosDemograficos:filtros,
          FiltrosGf: filtrosGf,
          TipoFiltro: tipoFiltro        
        });
  }

  getMetricaCalificacionGeneralClima(idFlujo:number) {

    return axios
      .post(this.getApiEndpoint('get-metrica-calificacion-general'), {IdFlujo:idFlujo});
  }

  getMetricaCalificacionGeneralClimaFiltrado(idFlujo:number, filtros:string) {

    return axios
      .post(this.getApiEndpoint('get-metrica-calificacion-general-filtrado'), {IdFlujo:idFlujo,FiltrosDemograficos:filtros});
  }

  getMetricaCalificacionGeneralClimaFiltradoGF(idFlujo:number, filtros:string, 
    filtrosGf:string, tipoFiltro:string) {

    return axios
      .post(this.getApiEndpoint('get-metrica-calificacion-general-filtrado-gf'), 
        {
          IdFlujo:idFlujo,
          FiltrosDemograficos:filtros,
          FiltrosGf: filtrosGf,
          TipoFiltro: tipoFiltro         
        });
  }

  getAllMetrics(idFlujo:number, filtros:string,
    filtrosGf:string, tipoFiltro:string, signal?: AbortSignal) {

    return axios
      .post(this.getApiEndpoint('get-all-dash-metrics'), 
        {
          IdFlujo:idFlujo,
          FiltrosDemograficos:filtros,
          FiltrosGf: filtrosGf,
          TipoFiltro: tipoFiltro
        }, {
          ...this.getNoCacheConfig(),
          timeout: 120000,
          signal,
        });
  }

  getClimaDashboardSummary(payload: ClimaDashboardPayload, signal?: AbortSignal) {
    return this.postClimaDashboardSection('resumen', payload, signal);
  }

  getClimaDashboardParticipation(payload: ClimaDashboardPayload, signal?: AbortSignal) {
    return this.postClimaDashboardSection('participacion', payload, signal);
  }

  getClimaDashboardSpecialQuestions(payload: ClimaDashboardPayload, signal?: AbortSignal) {
    return this.postClimaDashboardSection('preguntas-especiales', payload, signal);
  }

  getClimaDashboardComments(payload: ClimaDashboardCommentsPayload, signal?: AbortSignal) {
    return this.postClimaDashboardSection('comentarios', payload, signal);
  }

  private postClimaDashboardSection(
    section: string,
    payload: ClimaDashboardPayload | ClimaDashboardCommentsPayload,
    signal?: AbortSignal
  ) {
    return axios.post(
      this.getRestApiEndpoint(`api/clima/dashboard/${section}`),
      payload,
      {
        ...this.getNoCacheConfig(),
        timeout: 120000,
        signal,
      }
    );
  }

  getClimaActionPlanLikertResults(idOrganizacion: number, idFlujo: number) {
    return axios.get(
      this.getRestApiEndpoint('api/clima/planes-accion/resultados-likert'),
      this.getNoCacheConfig({ idOrganizacion, idFlujo })
    );
  }

  getClimaActionPlans(idOrganizacion: number, idFlujo: number, params: Record<string, any> = {}) {
    return axios.get(
      this.getRestApiEndpoint('api/clima/planes-accion'),
      this.getNoCacheConfig({ idOrganizacion, idFlujo, ...params })
    );
  }

  saveClimaActionPlan(payload: any, planId?: number | null) {
    const config = this.getNoCacheConfig();
    const url = planId && planId > 0
      ? this.getRestApiEndpoint(`api/clima/planes-accion/${planId}`)
      : this.getRestApiEndpoint('api/clima/planes-accion');

    return planId && planId > 0
      ? axios.put(url, payload, config)
      : axios.post(url, payload, config);
  }

  deleteClimaActionPlan(planId: number, idOrganizacion: number) {
    return axios.delete(
      this.getRestApiEndpoint(`api/clima/planes-accion/${planId}`),
      this.getNoCacheConfig({ idOrganizacion })
    );
  }

  createClimaActionPlanTask(planId: number, payload: any) {
    return axios.post(
      this.getRestApiEndpoint(`api/clima/planes-accion/${planId}/tareas`),
      payload,
      this.getNoCacheConfig()
    );
  }

  updateClimaActionPlanTask(planId: number, taskId: number, payload: any) {
    return axios.put(
      this.getRestApiEndpoint(`api/clima/planes-accion/${planId}/tareas/${taskId}`),
      payload,
      this.getNoCacheConfig()
    );
  }

  deleteClimaActionPlanTask(planId: number, taskId: number) {
    return axios.delete(
      this.getRestApiEndpoint(`api/clima/planes-accion/${planId}/tareas/${taskId}`),
      this.getNoCacheConfig()
    );
  }

  createClimaActionPlanFollowUp(planId: number, payload: any) {
    return axios.post(
      this.getRestApiEndpoint(`api/clima/planes-accion/${planId}/seguimientos`),
      payload,
      this.getNoCacheConfig()
    );
  }

  getClimaActionPlanFollowUps(planId: number) {
    return axios.get(
      this.getRestApiEndpoint(`api/clima/planes-accion/${planId}/seguimientos`),
      this.getNoCacheConfig()
    );
  }

  getClimaActionPlanPortal(codigoPlanResponsable: string) {
    return this.http.post(
      this.getRestApiEndpoint('api/clima/planes-accion/portal'),
      { codigoPlanResponsable },
      this.getPublicRequestOptions()
    );
  }

  saveClimaActionPlanPortalProgress(payload: {
    codigoPlanResponsable: string;
    tareas: Array<{
      id: number;
      completada: boolean;
      evidencia?: string;
    }>;
    comentario?: string;
  }, turnstileToken: string) {
    return this.http.put(
      this.getRestApiEndpoint('api/clima/planes-accion/portal/progreso'),
      payload,
      this.getPublicRequestOptions(undefined, {
        'Turnstile-Token': turnstileToken,
      })
    );
  }

  generateClimaCorporateAiAnalysis(payload: {
    IdFlujo: number;
    FiltrosDemograficos: string;
    FiltrosGf: string;
    TipoFiltro: string;
  }) {
    const config = this.getNoCacheConfig();

    return axios.post(
      this.getRestApiEndpoint('api/clima/ia/analisis-corporativo'),
      payload,
      {
        ...config,
        timeout: 180000,
      }
    );
  }

  getMetricaEstadoEnvioClima(idFlujo:number) {

    return axios
      .post(this.getApiEndpoint('get-metrica-estado-envio'), {IdFlujo:idFlujo});
  }

  getMetricaPorcentajeRespuestas(idFlujo:number) {

    return axios
      .post(this.getApiEndpoint('get-metrica-porcentaje-respuestas'), {IdFlujo:idFlujo});
  }

  getMetricaPorcentajeRespuestasFiltrado(idFlujo:number, filtros:string) {

    return axios
      .post(this.getApiEndpoint('get-metrica-porcentaje-respuestas-filtrado'), 
        {IdFlujo:idFlujo,FiltrosDemograficos:filtros});
  }

  getMetricaPorcentajeRespuestasFiltradoGF(idFlujo:number, filtros:string, filtrosGf:string) {

    return axios
      .post(this.getApiEndpoint('get-metrica-porcentaje-respuestas-filtrado-gf'), 
        {IdFlujo:idFlujo,
          FiltrosDemograficos:filtros,
          FiltrosGf: filtrosGf
        
        });
  }

  getMetricaPorcentajeSatisfaccionFactor(idFlujo:number) {

    return axios
      .post(this.getApiEndpoint('get-metrica-porcentaje-satisfaccion-factor'), {IdFlujo:idFlujo});
  }

  getMetricaPorcentajeSatisfaccionFactorFiltrado(idFlujo:number, filtros:string) {

    return axios
      .post(this.getApiEndpoint('get-metrica-porcentaje-satisfaccion-factor-filtrado'), 
        {IdFlujo:idFlujo,FiltrosDemograficos:filtros});
  }

  getMetricaPorcentajeSatisfaccionFactorFiltradoGF(idFlujo:number, filtros:string, filtrosGf:string) {

    return axios
      .post(this.getApiEndpoint('get-metrica-porcentaje-satisfaccion-factor-filtrado-gf'), 
        {
          IdFlujo:idFlujo,
          FiltrosDemograficos:filtros,
          FiltrosGf: filtrosGf
        
        });
  }

  getMetricaDemograficos(idOrg:number) {

    return axios
      .post(this.getApiEndpoint('get-metrica-demograficos'), 
        {
          IdOrg:idOrg
          
        });
  }

  getFiltrosDemograficosRestrictivo(idOrg:number, idFlujo:number, minRespuestas: number) {

    return axios
      .post(this.getApiEndpoint('get-factores-demograficos-restrictivo'), 
        {
          IdOrg: idOrg,
          IdFlujo: idFlujo,
          MinRespuestas: minRespuestas        
        });
  }

  getFiltrosDemograficosArbol(idOrg:number) {

    return axios
      .post(this.getApiEndpoint('get-factores-demograficos-arbol'), 
        {
          IdOrg: idOrg     
        });
  }

  logni13(user:any) {
   //console.log('ENTRA EN LOGIN..');
    return this.login(user);

  }

  getMenuAccess(RoleId:any) {
  
    return axios
      .post(this.getApiEndpoint('get-access-menu'), {RoleId: RoleId});

  }

  getUsers(idOrganization: number) {
    return axios
      .get(this.getApiEndpoint('get-users-json'), {
        params: { organizacionId: idOrganization }
      });
  }

  getUsersByIdOrg(idOrganization:any) {
    return axios
      .post(this.getApiEndpoint('get-users-by-id-org-json'),{idOrganization:idOrganization});
  }
  
  getRoles() {
    return axios
      .get(this.getApiEndpoint('get-roles-json'));
  }

  getRolesByIdOrg(idOrganization:any) {
    return axios
      .post(this.getApiEndpoint('get-roles-by-id-org-json'),{idOrganization:idOrganization});
  }

  saveUser(userData: any) {    
    //console.log('DATA_PLANTILLA_A_GUARDAR: ', template_data);

    return axios.post(this.getApiEndpoint('insert-user'), userData);
  }

  updateUser(userData: any) {    
    //console.log('DATA_PLANTILLA_A_GUARDAR: ', template_data);

    return axios.post(this.getApiEndpoint('update-user'), userData);
  }

  getRolesAccess(idOrganization: number) {
  
    return axios
      .get(this.getApiEndpoint('get-roles-access-json'), {
        params: { OrganizacionId: idOrganization }
      });

  }

  getRolesAccessByIdOrg(idOrganization:any) {
  
    return axios
      .post(this.getApiEndpoint('get-roles-access-by-id-org-json'), {idOrganization:idOrganization});

  }

  saveRole(roleData: any) {    
    //console.log('DATA_PLANTILLA_A_GUARDAR: ', template_data);

    return axios.post(this.getApiEndpoint('insert-role'), roleData);
  }

   updateRoleAccess(updRoleData: any) {    
    //console.log('DATA_PLANTILLA_A_GUARDAR: ', template_data);

    return axios.post(this.getApiEndpoint('update-role-access'), updRoleData);
  }

  getUserById(userId:any) {
  
    return axios
      .post(this.getApiEndpoint('get-user-by-id-json'), {userId:userId});

  }

   getGFactorsAccessByIdFlujo(idFlujo:any) {
  
    return axios
      .post(this.getApiEndpoint('get-gfactors-access-by-id-flujo-json'), {idFlujo:idFlujo});

  }

  updateGFactorsAccessByIdFlujo(data:any) {
  
    return axios
      .post(this.getApiEndpoint('update-gf-access'), data);

  }

   getConfigs() {
  
    return axios
      .get(this.getApiEndpoint('get-conf-json'));

  }


  //encuesta orden
   updateGFactorsOrder(data:any) {
    return axios
      .post(this.getApiEndpoint('update-orden-gran-factores'), data);
  }

  updateFactorsOrder(data:any) {
    return axios
      .post(this.getApiEndpoint('update-orden-factores'), data);
  }

  updatePreguntasOrder(data:any) {
    return axios
      .post(this.getApiEndpoint('update-orden-preguntas'), data);
  }

  updatePreguntaLabel(data:any) {    
    return axios
      .post(this.getApiEndpoint('update-pregunta-label'), data);
  }

  insertPreguntaOpcion(data:any) {    
    return axios
      .post(this.getApiEndpoint('insert-pregunta-option'), data);
  }

  updatePreguntaRango(data:any) {    
    return axios
      .post(this.getApiEndpoint('update-pregunta-range'), data);
  }

  updatePreguntaLikertOptions(data:any) {
    return axios
      .post(this.getApiEndpoint('update-pregunta-likert-options'), data);
  }

  insertEmailTemplate(data:any) {    
    return axios
      .post(this.getApiEndpoint('upsert-email-template'), data);
  }


  enviarCorreoIndividual(mailBody: any) {

    return axios
      .post(this.getApiEndpoint('smjl-ind'), mailBody);
  }


  
  obtenerPlantillasCorreoOrg(data: any) {

    return axios
      .post(this.getApiEndpoint('get-email-templates-by-org'), data);
  }

  obtenerPlantillasCorreoByFlujo(data: any) {

    return axios
      .post(this.getApiEndpoint('get-email-templates-by-flow'), data);
  }


   enviarCorreosPendienteClima(idFlujo:any) {

    return axios
      .post(this.getApiEndpoint('send-email-pendientes-just-link'), idFlujo);
  }

  enviarCorreosCompletadosClima(idFlujo:any) {

    return axios
      .post(this.getApiEndpoint('send-email-completadas-just-link'), idFlujo);
      
  }


  enviarCorreosTodosActivos(idFlujo:any) {

    return axios
      .post(this.getApiEndpoint('send-email-todos-activos-just-link'), idFlujo);
      
  }

  obtenerTotalPreguntasActivasClima(idFlujo:any) {

    return axios
      .post(this.getApiEndpoint('get-total-preguntas-encuesta'), idFlujo);
      
  }



}
