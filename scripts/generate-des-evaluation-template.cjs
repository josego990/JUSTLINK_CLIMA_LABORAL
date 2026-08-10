const fs = require('node:fs');
const path = require('node:path');
const XLSX = require('xlsx');

const outputPath = path.resolve(
  __dirname,
  '../src/assets/templates/Plantilla_Evaluacion_Desempeno_Ejemplo.xlsx'
);

const headers = {
  position: 'Puesto *',
  scenario: 'Escenario *',
  scenarioWeight: 'Ponderación escenario (%) *',
  dimensionCode: 'Código dimensión',
  dimensionName: 'Dimensión *',
  dimensionDescription: 'Descripción dimensión',
  dimensionWeight: 'Ponderación dimensión (%) *',
  criterionCode: 'Código criterio',
  criterionName: 'Criterio *',
  criterionDescription: 'Descripción criterio',
  criterionWeight: 'Ponderación criterio (%) *',
  requiredRatingLevel: 'Nivel exigencia (1-5) *',
  itemCode: 'Código ítem',
  itemText: 'Ítem evaluativo *',
  itemType: 'Tipo de ítem *',
  scale: 'Escala',
  options: 'Opciones Likert (separadas por |)',
};

const positions = [
  {
    name: 'JEFE DE OPERACIONES',
    sheet: 'JEFE DE OPERACIONES',
    scenarios: [
      ['Colaborador a jefe', 50],
      ['Autoevaluación', 50],
    ],
  },
  {
    name: 'Jefe del departamento de Desarrollo',
    sheet: 'Jefe depto Desarrollo',
    scenarios: [
      ['Jefe a colaborador', 25],
      ['Colaborador a jefe', 25],
      ['Autoevaluación', 25],
      ['Par', 25],
    ],
  },
  {
    name: 'Jefe del departamento de Infraestructura',
    sheet: 'Jefe depto Infraestructura',
    scenarios: [
      ['Jefe a colaborador', 25],
      ['Colaborador a jefe', 25],
      ['Autoevaluación', 25],
      ['Par', 25],
    ],
  },
  {
    name: 'Jefe del sub departamento de Redes',
    sheet: 'Jefe subdepto Redes',
    scenarios: [
      ['Jefe a colaborador', 34],
      ['Colaborador a jefe', 33],
      ['Autoevaluación', 33],
    ],
  },
  {
    name: 'Desarrollador',
    sheet: 'Desarrollador',
    scenarios: [
      ['Jefe a colaborador', 34],
      ['Autoevaluación', 33],
      ['Par', 33],
    ],
  },
  {
    name: 'QA Tester',
    sheet: 'QA Tester',
    scenarios: [
      ['Jefe a colaborador', 34],
      ['Autoevaluación', 33],
      ['Par', 33],
    ],
  },
  {
    name: 'Soporte y manejo de Servidores',
    sheet: 'Soporte y manejo de Servidores',
    scenarios: [
      ['Jefe a colaborador', 34],
      ['Autoevaluación', 33],
      ['Par', 33],
    ],
  },
  {
    name: 'Analista de Red',
    sheet: 'Analista de Red',
    scenarios: [
      ['Jefe a colaborador', 50],
      ['Autoevaluación', 50],
    ],
  },
];

const dimensions = [
  {
    dimensionCode: 'OBJETIVOS',
    dimensionName: 'Objetivos',
    dimensionDescription: 'Cumplimiento de metas y entregables acordados.',
    dimensionWeight: 45,
  },
  {
    dimensionCode: 'COMPETENCIAS',
    dimensionName: 'Competencias',
    dimensionDescription: 'Habilidades observables para desempeñar el puesto.',
    dimensionWeight: 35,
  },
  {
    dimensionCode: 'VALORES',
    dimensionName: 'Valores',
    dimensionDescription: 'Conductas alineadas con los valores de la organización.',
    dimensionWeight: 20,
  },
];

const scenarioDefinitions = {
  'Jefe a colaborador': {
    OBJETIVOS: {
      criterionCode: 'JAC_CUMPLIMIENTO',
      criterionName: 'Cumplimiento y resultados',
      criterionDescription: 'Evalúa los resultados observados por el jefe directo.',
      items: [
        ['JAC_OBJ_RESULTADOS', 'Cumple las metas y entregables acordados para el período', 'Likert de 5 niveles'],
        ['JAC_OBJ_MEJORA', '¿Qué debería mejorar para alcanzar mejores resultados?', 'Pregunta abierta'],
      ],
    },
    COMPETENCIAS: {
      criterionCode: 'JAC_DESEMPENO',
      criterionName: 'Desempeño y colaboración',
      criterionDescription: 'Valora las competencias observadas por el jefe.',
      items: [
        ['JAC_COM_CALIDAD', 'Realiza su trabajo con calidad y de forma oportuna', 'Likert de 5 niveles'],
        ['JAC_COM_FORTALEZA', 'Describa una fortaleza relevante de su desempeño', 'Pregunta abierta'],
      ],
    },
    VALORES: {
      criterionCode: 'JAC_VALORES',
      criterionName: 'Integridad y responsabilidad',
      criterionDescription: 'Evalúa conductas alineadas con los valores organizacionales.',
      items: [
        ['JAC_VAL_RESPONSABILIDAD', 'Asume responsabilidad por sus decisiones y resultados', 'Likert de 5 niveles'],
        ['JAC_VAL_EJEMPLO', 'Mencione una conducta destacable alineada con los valores', 'Pregunta abierta'],
      ],
    },
  },
  'Colaborador a jefe': {
    OBJETIVOS: {
      criterionCode: 'CAJ_DIRECCION',
      criterionName: 'Dirección y seguimiento',
      criterionDescription: 'Evalúa cómo el jefe orienta y acompaña los objetivos del equipo.',
      items: [
        ['CAJ_OBJ_PRIORIDADES', 'Comunica con claridad las prioridades y resultados esperados', 'Likert de 5 niveles'],
        ['CAJ_OBJ_APOYO', '¿Qué apoyo adicional debería brindar para facilitar el cumplimiento de objetivos?', 'Pregunta abierta'],
      ],
    },
    COMPETENCIAS: {
      criterionCode: 'CAJ_LIDERAZGO',
      criterionName: 'Liderazgo y retroalimentación',
      criterionDescription: 'Valora el acompañamiento y liderazgo desde la perspectiva del colaborador.',
      items: [
        ['CAJ_COM_FEEDBACK', 'Brinda retroalimentación clara, útil y oportuna', 'Likert de 5 niveles'],
        ['CAJ_COM_MEJORA', '¿Qué práctica de liderazgo debería fortalecer?', 'Pregunta abierta'],
      ],
    },
    VALORES: {
      criterionCode: 'CAJ_CONFIANZA',
      criterionName: 'Coherencia y confianza',
      criterionDescription: 'Evalúa la coherencia del jefe con los valores de la organización.',
      items: [
        ['CAJ_VAL_EQUIDAD', 'Toma decisiones con respeto, transparencia y equidad', 'Likert de 5 niveles'],
        ['CAJ_VAL_RECONOCIMIENTO', 'Describa una conducta del jefe que genere confianza', 'Pregunta abierta'],
      ],
    },
  },
  Autoevaluación: {
    OBJETIVOS: {
      criterionCode: 'AUTO_RESULTADOS',
      criterionName: 'Autogestión de resultados',
      criterionDescription: 'Permite reflexionar sobre el cumplimiento personal de objetivos.',
      items: [
        ['AUTO_OBJ_CUMPLIMIENTO', 'Considero que cumplí las metas y compromisos del período', 'Likert de 5 niveles'],
        ['AUTO_OBJ_APRENDIZAJE', '¿Cuál fue mi principal aprendizaje al trabajar en estos objetivos?', 'Pregunta abierta'],
      ],
    },
    COMPETENCIAS: {
      criterionCode: 'AUTO_DESARROLLO',
      criterionName: 'Aprendizaje y mejora',
      criterionDescription: 'Evalúa la capacidad personal de aprender y mejorar el desempeño.',
      items: [
        ['AUTO_COM_ADAPTACION', 'Me adapto y busco soluciones ante cambios o dificultades', 'Likert de 5 niveles'],
        ['AUTO_COM_FORTALECER', '¿Qué competencia necesito fortalecer durante el próximo período?', 'Pregunta abierta'],
      ],
    },
    VALORES: {
      criterionCode: 'AUTO_RESPONSABILIDAD',
      criterionName: 'Responsabilidad personal',
      criterionDescription: 'Promueve la reflexión sobre la conducta y responsabilidad individual.',
      items: [
        ['AUTO_VAL_COHERENCIA', 'Actúo de manera coherente con los valores de la organización', 'Likert de 5 niveles'],
        ['AUTO_VAL_COMPROMISO', '¿Qué compromiso personal asumiré para mejorar?', 'Pregunta abierta'],
      ],
    },
  },
  Par: {
    OBJETIVOS: {
      criterionCode: 'PAR_COORDINACION',
      criterionName: 'Coordinación de entregables',
      criterionDescription: 'Evalúa la coordinación de resultados entre compañeros.',
      items: [
        ['PAR_OBJ_COMPROMISOS', 'Cumple los compromisos acordados con sus compañeros', 'Likert de 5 niveles'],
        ['PAR_OBJ_APORTE', '¿Qué aporte de esta persona facilita el logro de objetivos compartidos?', 'Pregunta abierta'],
      ],
    },
    COMPETENCIAS: {
      criterionCode: 'PAR_COLABORACION',
      criterionName: 'Trabajo colaborativo',
      criterionDescription: 'Valora comunicación, apoyo y cooperación entre pares.',
      items: [
        ['PAR_COM_EQUIPO', 'Comparte información y colabora activamente con el equipo', 'Likert de 5 niveles'],
        ['PAR_COM_MEJORA', '¿Qué podría mejorar para colaborar mejor con sus pares?', 'Pregunta abierta'],
      ],
    },
    VALORES: {
      criterionCode: 'PAR_RESPETO',
      criterionName: 'Respeto y apoyo',
      criterionDescription: 'Evalúa relaciones de trabajo respetuosas y confiables.',
      items: [
        ['PAR_VAL_RESPETO', 'Mantiene un trato respetuoso y constructivo con sus compañeros', 'Likert de 5 niveles'],
        ['PAR_VAL_CONDUCTA', 'Describa una conducta positiva observada en el trabajo en equipo', 'Pregunta abierta'],
      ],
    },
  },
};

const buildRows = (position) => position.scenarios.flatMap(([scenarioName, scenarioWeight]) => {
  const scenario = scenarioDefinitions[scenarioName];

  return dimensions.flatMap((dimension) => {
    const criterion = scenario[dimension.dimensionCode];

    return criterion.items.map(([itemCode, itemText, itemType]) => ({
      [headers.position]: position.name,
      [headers.scenario]: scenarioName,
      [headers.scenarioWeight]: scenarioWeight,
      [headers.dimensionCode]: dimension.dimensionCode,
      [headers.dimensionName]: dimension.dimensionName,
      [headers.dimensionDescription]: dimension.dimensionDescription,
      [headers.dimensionWeight]: dimension.dimensionWeight,
      [headers.criterionCode]: criterion.criterionCode,
      [headers.criterionName]: criterion.criterionName,
      [headers.criterionDescription]: criterion.criterionDescription,
      [headers.criterionWeight]: 100,
      [headers.requiredRatingLevel]: 4,
      [headers.itemCode]: itemCode,
      [headers.itemText]: itemText,
      [headers.itemType]: itemType,
      [headers.scale]: itemType === 'Likert de 5 niveles' ? 'Predeterminada' : '',
      [headers.options]: '',
    }));
  });
});

const instructions = [
  ['PLANTILLA DE EVALUACIÓN DE DESEMPEÑO'],
  ['1. Cada hoja de datos representa un puesto y la columna Puesto contiene su nombre completo.'],
  ['2. Excel limita los nombres de pestaña a 31 caracteres; por eso algunos nombres están abreviados únicamente en la pestaña.'],
  ['3. El ejemplo corresponde a un modelo 360 o Mixto e incluye: Jefe a colaborador, Colaborador a jefe, Autoevaluación y Par.'],
  ['4. Tipos admitidos: Likert de 5 niveles y Pregunta abierta.'],
  ['5. Los escenarios por puesto, las dimensiones y los criterios por dimensión deben sumar 100%.'],
  ['6. Predeterminada usa la escala seleccionada en el formulario. También puede indicarse un código o nombre de escala existente.'],
  ['7. Los códigos son opcionales; si se informan, usa letras, números, guion o guion bajo, hasta 50 caracteres.'],
  ['8. La importación es atómica: cualquier error detiene toda la carga. Nada se guarda hasta pulsar Guardar evaluación.'],
  ['9. En modo demo aplican los límites configurados de dimensiones, criterios e ítems. Este ejemplo usa 3 dimensiones, 1 criterio por escenario y dimensión, y 2 ítems por criterio.'],
  ['10. Los escenarios se adaptan a la jerarquía esperada: los puestos sin jefe no incluyen Jefe a colaborador y los puestos sin subordinados no incluyen Colaborador a jefe.'],
  ['11. Si la jerarquía real de la organización es diferente, ajuste los escenarios y redistribuya sus ponderaciones para que cada puesto sume 100%.'],
  ['12. Al cargar sobre un modelo existente, el sistema conserva los valores actuales y omite dimensiones, criterios e ítems duplicados para el mismo puesto y escenario.'],
  [],
  ['El ejemplo incluye 8 puestos, los 4 escenarios y las dimensiones Objetivos (45%), Competencias (35%) y Valores (20%).'],
];

const workbook = XLSX.utils.book_new();
const readmeSheet = XLSX.utils.aoa_to_sheet(instructions);
readmeSheet['!cols'] = [{ wch: 125 }];
XLSX.utils.book_append_sheet(workbook, readmeSheet, 'LEEME');

const dataHeaders = Object.values(headers);
positions.forEach((position) => {
  const dataSheet = XLSX.utils.json_to_sheet(buildRows(position), {
    header: dataHeaders,
  });
  dataSheet['!cols'] = dataHeaders.map((header) => ({
    wch: Math.min(56, Math.max(18, header.length + 2)),
  }));
  dataSheet['!autofilter'] = { ref: dataSheet['!ref'] };
  XLSX.utils.book_append_sheet(workbook, dataSheet, position.sheet);
});

fs.mkdirSync(path.dirname(outputPath), { recursive: true });
XLSX.writeFile(workbook, outputPath);
console.log(outputPath);
