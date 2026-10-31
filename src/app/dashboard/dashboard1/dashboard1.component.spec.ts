import { fakeAsync, flushMicrotasks, tick } from '@angular/core/testing';

import { Dashboard1Component } from './dashboard1.component';

describe('Dashboard1Component sectional loading', () => {
  let component: Dashboard1Component;
  let organizationService: jasmine.SpyObj<any>;

  const summaryData = {
    calificacionGeneral: { pct_top2: 80 },
    satisfaccionPorcentajes: [],
    satisfaccionPorPregunta: [{ empleados_respondieron: 5 }],
    respuestasPorFactor: [],
    distribucionRespuestas: [],
    porcentajeSatisfaccionPorFactor: [],
  };

  beforeEach(() => {
    organizationService = jasmine.createSpyObj('OrganizacionService', [
      'getClimaDashboardSummary',
      'getClimaDashboardParticipation',
      'getClimaDashboardSpecialQuestions',
      'getClimaDashboardComments',
      'getAllMetrics',
      'getMetricaEstadoEnvioClima',
      'getGrandesFactores',
      'getFiltrosDemograficosArbol',
    ]);
    organizationService.getMetricaEstadoEnvioClima.and.resolveTo({ data: { data: [] } });
    organizationService.getFiltrosDemograficosArbol.and.resolveTo({
      data: { data: [{ campos: '[]' }] },
    });

    component = new Dashboard1Component(
      document,
      {} as any,
      {} as any,
      organizationService,
      {} as any,
      {} as any,
      {} as any,
      {} as any
    );
    component.idOrganization = 29;
    component.idFlujo = 95;
    component.nombreFlujo = 'Clima de prueba';
    component.nombreOrganizacion = 'Organización de prueba';
  });

  it('loads only the summary after the filter debounce', fakeAsync(() => {
    organizationService.getClimaDashboardSummary.and.resolveTo({ data: { data: summaryData } });
    organizationService.getMetricaEstadoEnvioClima.and.resolveTo({
      data: {
        data: [{
          total: 13,
          total_contestadas: 5,
          total_empleados_activos: 15,
          porcentaje: 38.5,
          estado_envio: 'Enviado',
          total_enviadas: 7,
        }],
      },
    });

    void component.aplicarFiltrosSecuencial('', '');
    tick(249);
    expect(organizationService.getClimaDashboardSummary).not.toHaveBeenCalled();

    tick(1);
    flushMicrotasks();

    expect(organizationService.getClimaDashboardSummary).toHaveBeenCalledTimes(1);
    expect(organizationService.getClimaDashboardParticipation).not.toHaveBeenCalled();
    expect(organizationService.getClimaDashboardSpecialQuestions).not.toHaveBeenCalled();
    expect(organizationService.getClimaDashboardComments).not.toHaveBeenCalled();
    expect(component.estadoEnvio).toBe('Enviado');
    expect(component.totalEmplados).toBe(15);
    expect(component.totalCreadas).toBe(13);
    expect(component.totalEnviadas).toBe(7);
    expect(component.totalContestadas).toBe(5);
    expect(component.totalPendientes).toBe(8);
    expect(component.porcentajeEnvio).toBe(38.5);
  }));

  it('waits for the grand factors before requesting the summary for a climate', fakeAsync(() => {
    let resolveGrandFactors!: (value: any) => void;
    organizationService.getGrandesFactores.and.returnValue(new Promise((resolve) => {
      resolveGrandFactors = resolve;
    }));
    organizationService.getClimaDashboardSummary.and.resolveTo({ data: { data: summaryData } });
    component.dataSourceClimas = [{
      Id: 95,
      Nombre: 'Clima de prueba',
      Objetivo: 'Objetivo',
      MetodoAplicacion: 'LIKERT_4',
    }];

    component.onClimaChange(95);
    tick(500);
    expect(organizationService.getClimaDashboardSummary).not.toHaveBeenCalled();

    resolveGrandFactors({
      data: {
        data: [{ Id: 10, Nombre: 'Personas' }, { Id: 20, Nombre: 'Procesos' }],
      },
    });
    flushMicrotasks();
    tick(250);
    flushMicrotasks();

    expect(organizationService.getClimaDashboardSummary).toHaveBeenCalledTimes(1);
    expect(organizationService.getClimaDashboardSummary.calls.mostRecent().args[0])
      .toEqual(jasmine.objectContaining({
        idFlujo: 95,
        idsGrandesFactores: [10, 20],
      }));
    expect(component.metricasSatisfaccionGeneralData.pct_top2).toBe(80);
  }));

  it('uses all available rows when validating the minimum response count', () => {
    const canRender = (component as any).canRenderDashboardSummary({
      ...summaryData,
      satisfaccionPorPregunta: [
        { empleados_respondieron: 0 },
        { empleados_respondieron: 7 },
      ],
    });

    expect(canRender).toBeTrue();
  });

  it('paginates every text question independently and enforces the maximum limit', fakeAsync(() => {
    component.commentsPagination.limite = 500;
    organizationService.getClimaDashboardComments.and.callFake((payload: any) => {
      if (payload.idPregunta == null) {
        return Promise.resolve({
          data: {
            data: {
              preguntas: [
                { IdFactor: 1, Factor: 'Liderazgo', IdPregunta: 11, Pregunta: 'Pregunta abierta', Tipo: 'text' },
                { IdFactor: 2, Factor: 'Cultura', IdPregunta: 22, Pregunta: 'Pregunta IA', Tipo: 'iatext' },
              ],
              items: [],
              paginacion: { pagina: 1, limite: 200, totalRegistros: 5, totalPaginas: 1 },
            },
          },
        });
      }

      const isFirstQuestion = payload.idPregunta === 11;
      const comment = isFirstQuestion
        ? `Respuesta abierta página ${payload.pagina}`
        : 'Respuesta de la segunda pregunta';

      return Promise.resolve({
        data: {
          data: {
            preguntas: [],
            items: [{
              IdFactor: isFirstQuestion ? 1 : 2,
              Factor: isFirstQuestion ? 'Liderazgo' : 'Cultura',
              IdPregunta: payload.idPregunta,
              Pregunta: isFirstQuestion ? 'Pregunta abierta' : 'Pregunta IA',
              Tipo: isFirstQuestion ? 'text' : 'iatext',
              IdRespuesta: payload.pagina,
              Comentario: comment,
              Sentiment: isFirstQuestion ? null : 'POSITIVE',
            }],
            paginacion: {
              pagina: payload.pagina,
              limite: 200,
              totalRegistros: isFirstQuestion ? 3 : 2,
              totalPaginas: isFirstQuestion ? 3 : 2,
            },
          },
        },
      });
    });

    void component.loadCommentsPage(1);
    flushMicrotasks();

    const catalogPayload = organizationService.getClimaDashboardComments.calls.argsFor(0)[0];
    expect(catalogPayload).toEqual(jasmine.objectContaining({
      idOrganizacion: 29,
      idFlujo: 95,
      tipo: 'TODOS',
      idPregunta: null,
      pagina: 1,
      limite: 200,
    }));

    expect(component.commentQuestions.length).toBe(2);
    expect(component.commentQuestions[0].ComentariosJSON[0].Comentario).toBe('Respuesta abierta página 1');
    expect(component.commentQuestions[1].ComentariosJSON[0].Comentario).toBe('Respuesta de la segunda pregunta');

    void component.loadCommentQuestionPage(11, 2);
    flushMicrotasks();

    expect(component.commentQuestions[0].pagination.pagina).toBe(2);
    expect(component.commentQuestions[0].ComentariosJSON[0].Comentario).toBe('Respuesta abierta página 2');
    expect(component.commentQuestions[1].pagination.pagina).toBe(1);
    expect(component.commentQuestions[1].ComentariosJSON[0].Comentario).toBe('Respuesta de la segunda pregunta');

    const pagePayload = organizationService.getClimaDashboardComments.calls.mostRecent().args[0];
    expect(pagePayload).toEqual(jasmine.objectContaining({
      tipo: 'TEXT',
      idPregunta: 11,
      pagina: 2,
      limite: 200,
    }));
  }));

  it('aborts an active section request when the dashboard context changes', fakeAsync(() => {
    let requestSignal: AbortSignal | undefined;
    organizationService.getClimaDashboardParticipation.and.callFake((_payload: any, signal: AbortSignal) => {
      requestSignal = signal;
      return new Promise((_resolve, reject) => {
        signal.addEventListener('abort', () => {
          reject(Object.assign(new Error('canceled'), { code: 'ERR_CANCELED' }));
        });
      });
    });

    void component.loadDashboardSection('participacion');
    flushMicrotasks();
    expect(requestSignal?.aborted).toBeFalse();

    (component as any).invalidateDashboardContext();
    flushMicrotasks();

    expect(requestSignal?.aborted).toBeTrue();
    expect(component.participacionRows).toEqual([]);
  }));
});
