const fs = require('fs');
const path = require('path');
const ExcelJS = require('exceljs');
const XLSX = require('xlsx');

const projectRoot = path.resolve(__dirname, '..');
const sourcePath = path.join(
  projectRoot,
  'src/assets/data/Encuestas_clima_Gallup_GPTW_NOM035_Mexico.ods',
);
const baseTemplatePath = path.join(
  projectRoot,
  'src/assets/data/Plantilla_ENCUESTA_FORMATO_ESPANOL_v2.xlsx',
);
const outputDirectory = path.join(projectRoot, 'src/assets/data/climate-templates');

const TYPE_VALIDATION = {
  type: 'list',
  formulae: [
    '"ENCUESTA,FACTOR,LIKERT,PREGUNTA ABIERTA,PREGUNTA IA,RANGO,LISTA,LISTA DEMOGRAFICO"',
  ],
  showErrorMessage: true,
  errorTitle: 'Tipo invalido',
  error: 'Seleccione un valor de la lista.',
};

function normalize(value) {
  return String(value ?? '')
    .trim()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/\s+/g, ' ')
    .toUpperCase();
}

function clone(value) {
  return value == null ? value : JSON.parse(JSON.stringify(value));
}

function getRows(workbook, sheetName) {
  const worksheet = workbook.Sheets[sheetName];
  if (!worksheet) {
    throw new Error(`No se encontro la hoja ${sheetName}.`);
  }

  return XLSX.utils.sheet_to_json(worksheet, {
    header: 1,
    defval: '',
    raw: false,
  });
}

function groupItems(items, getGroup) {
  const groups = new Map();

  for (const item of items) {
    const groupName = String(getGroup(item) || 'General').trim();
    if (!groups.has(groupName)) {
      groups.set(groupName, []);
    }
    groups.get(groupName).push(item);
  }

  return groups;
}

function buildSurveyRows({ survey, description, groups, questionType = 'LIKERT', options = '' }) {
  const rows = [
    {
      type: 'ENCUESTA',
      label: survey,
      description,
      options: '',
    },
  ];

  for (const [factor, questions] of groups.entries()) {
    rows.push({
      type: 'FACTOR',
      label: factor,
      description: '',
      options: '',
    });

    for (const question of questions) {
      rows.push({
        type: questionType,
        label: question.text,
        description: question.description || '',
        options,
      });
    }
  }

  return rows;
}

function buildGallupRows(sourceWorkbook) {
  const rows = getRows(sourceWorkbook, 'Gallup');
  const headerIndex = rows.findIndex((row) => normalize(row[0]) === 'CATEGORIA');
  const items = rows.slice(headerIndex + 1)
    .filter((row) => String(row[0]).trim() && String(row[3]).trim())
    .map((row) => ({
      category: String(row[0]).trim(),
      text: String(row[3]).trim(),
    }));

  return buildSurveyRows({
    survey: 'Compromiso y experiencia laboral - Gallup Q12',
    description: 'Basada en The 12 Elements of Great Managing, ©1993-1998 Gallup, Inc. Traducción al español de referencia.',
    groups: groupItems(items, (item) => item.category),
  });
}

function buildGptwRows(sourceWorkbook) {
  const rows = getRows(sourceWorkbook, 'Great_Place_to_Work');
  const headerIndex = rows.findIndex((row) => normalize(row[0]) === 'CATEGORIA');
  const items = rows.slice(headerIndex + 1)
    .filter((row) => String(row[0]).trim() && String(row[3]).trim())
    .map((row) => ({
      category: String(row[0]).trim(),
      text: String(row[3]).trim(),
    }));

  return buildSurveyRows({
    survey: 'Confianza y experiencia organizacional - Great Place to Work',
    description: 'Basada en GPTW Recognition Program Guide to Participating (2016). Traducción al español de referencia.',
    groups: groupItems(items, (item) => item.category),
  });
}

function extractNomGuide(rows, guideLabel) {
  const guideIndex = rows.findIndex((row) => normalize(row[0]).startsWith(normalize(guideLabel)));
  if (guideIndex < 0) {
    throw new Error(`No se encontro ${guideLabel}.`);
  }

  const nextGuideIndex = rows.findIndex(
    (row, index) => index > guideIndex && /^GUIA (I|II|III):/.test(normalize(row[0])),
  );
  const sectionEnd = nextGuideIndex >= 0 ? nextGuideIndex : rows.length;
  const headerIndex = rows.findIndex(
    (row, index) => index > guideIndex && index < sectionEnd && normalize(row[0]) === 'ITEM',
  );

  if (headerIndex < 0) {
    throw new Error(`No se encontro el encabezado de ${guideLabel}.`);
  }

  return rows.slice(headerIndex + 1, sectionEnd)
    .filter((row) => /^\d+$/.test(String(row[0]).trim()) && String(row[3]).trim())
    .map((row) => ({
      category: String(row[1]).trim(),
      domain: String(row[2]).trim(),
      text: String(row[3]).trim(),
    }));
}

function buildNomRows(sourceWorkbook) {
  const rows = getRows(sourceWorkbook, 'NOM-035_México');
  const guides = [
    {
      marker: 'Guía I:',
      survey: 'NOM-035 - Guía I: acontecimientos traumáticos severos',
      description: 'Aplicable a todos los centros de trabajo.',
      options: 'SÍ|NO',
      groupBy: (item) => item.category,
    },
    {
      marker: 'Guía II:',
      survey: 'NOM-035 - Guía II: factores de riesgo psicosocial',
      description: 'Aplicable a centros de trabajo de 16 a 50 personas.',
      options: 'SIEMPRE|CASI SIEMPRE|ALGUNAS VECES|CASI NUNCA|NUNCA',
      groupBy: (item) => item.domain || item.category,
    },
    {
      marker: 'Guía III:',
      survey: 'NOM-035 - Guía III: factores de riesgo psicosocial y entorno organizacional',
      description: 'Aplicable a centros de trabajo con más de 50 personas.',
      options: 'SIEMPRE|CASI SIEMPRE|ALGUNAS VECES|CASI NUNCA|NUNCA',
      groupBy: (item) => item.domain || item.category,
    },
  ];

  return guides.flatMap((guide) => {
    const items = extractNomGuide(rows, guide.marker);
    return buildSurveyRows({
      survey: guide.survey,
      description: guide.description,
      groups: groupItems(items, guide.groupBy),
      questionType: 'LISTA',
      options: guide.options,
    });
  });
}

async function writeTemplate(filename, rows) {
  const workbook = new ExcelJS.Workbook();
  await workbook.xlsx.readFile(baseTemplatePath);

  const worksheet = workbook.getWorksheet('ENCUESTA');
  if (!worksheet) {
    throw new Error('La plantilla base no contiene la hoja ENCUESTA.');
  }

  const styleTemplates = {
    survey: [1, 2, 3, 4].map((column) => clone(worksheet.getRow(2).getCell(column).style)),
    factor: [1, 2, 3, 4].map((column) => clone(worksheet.getRow(3).getCell(column).style)),
    question: [1, 2, 3, 4].map((column) => clone(worksheet.getRow(4).getCell(column).style)),
  };
  const lastRowToClear = Math.max(worksheet.actualRowCount, rows.length + 1);

  for (let rowNumber = 2; rowNumber <= lastRowToClear; rowNumber += 1) {
    for (let column = 1; column <= 4; column += 1) {
      worksheet.getRow(rowNumber).getCell(column).value = null;
    }
  }

  rows.forEach((item, index) => {
    const row = worksheet.getRow(index + 2);
    const styles = item.type === 'ENCUESTA'
      ? styleTemplates.survey
      : item.type === 'FACTOR'
        ? styleTemplates.factor
        : styleTemplates.question;

    [item.type, item.label, item.description, item.options].forEach((value, columnIndex) => {
      const cell = row.getCell(columnIndex + 1);
      cell.value = value;
      cell.style = clone(styles[columnIndex]);
      if (columnIndex === 0) {
        cell.dataValidation = clone(TYPE_VALIDATION);
      }
    });
  });

  fs.mkdirSync(outputDirectory, { recursive: true });
  await workbook.xlsx.writeFile(path.join(outputDirectory, filename));

  const surveyCount = rows.filter((row) => row.type === 'ENCUESTA').length;
  const factorCount = rows.filter((row) => row.type === 'FACTOR').length;
  const questionCount = rows.length - surveyCount - factorCount;
  console.log(`${filename}: ${surveyCount} encuestas, ${factorCount} factores, ${questionCount} preguntas`);
}

async function main() {
  if (!fs.existsSync(sourcePath)) {
    throw new Error(`No se encontro el archivo fuente: ${sourcePath}`);
  }
  if (!fs.existsSync(baseTemplatePath)) {
    throw new Error(`No se encontro la plantilla base: ${baseTemplatePath}`);
  }

  const sourceWorkbook = XLSX.readFile(sourcePath, { cellDates: true });
  await writeTemplate('Plantilla_Clima_Gallup_Q12.xlsx', buildGallupRows(sourceWorkbook));
  await writeTemplate('Plantilla_Clima_GPTW.xlsx', buildGptwRows(sourceWorkbook));
  await writeTemplate('Plantilla_Clima_NOM035_Mexico.xlsx', buildNomRows(sourceWorkbook));
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
