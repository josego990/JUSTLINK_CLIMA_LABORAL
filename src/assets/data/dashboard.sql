SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
ALTER PROCEDURE [dbo].[spDashboardGF]
  @IdFlujo INT,
  @Filtros dbo.FiltroCampoDemograficoTT READONLY, 
  @IdsGF   dbo.IntIdTT READONLY,
  @Modo    NVARCHAR(3) = N'AND'
AS
BEGIN
  SET NOCOUNT ON;

  DECLARE @ModoEff NVARCHAR(3) =
    CASE WHEN UPPER(@Modo) IN (N'AND',N'OR') THEN UPPER(@Modo) ELSE N'AND' END;

  CREATE TABLE #GF (Id INT PRIMARY KEY);

  /* =========================================================
     NUEVO: detectar método de aplicación del flujo
  ========================================================= */
  DECLARE @IdOrganizacion   INT = 0;
  DECLARE @MetodoAplicacion NVARCHAR(50) = N'';
  DECLARE @EsLikert5        BIT = 0;

  SELECT
      @IdOrganizacion   = fc.IdOrganizacion,
      @MetodoAplicacion = ISNULL(fc.MetodoAplicacion, N'')
  FROM dbo.FlujosClima fc
  WHERE fc.Id = @IdFlujo;

  SET @EsLikert5 =
    CASE
      WHEN UPPER(LTRIM(RTRIM(@MetodoAplicacion))) IN (N'LIKERT-5', N'LIKERT 5', N'LIKERT5')
      THEN 1 ELSE 0
    END;

  DECLARE @Top1Score        TINYINT = CASE WHEN @EsLikert5 = 1 THEN 4 ELSE 3 END;
  DECLARE @Top2LowScore     TINYINT = CASE WHEN @EsLikert5 = 1 THEN 3 ELSE 2 END;
  DECLARE @Bottom2HighScore TINYINT = 1;
  DECLARE @MaxScore         DECIMAL(6,2) = CASE WHEN @EsLikert5 = 1 THEN 4.0 ELSE 3.0 END;

  IF EXISTS (SELECT 1 FROM @IdsGF)
  BEGIN
    INSERT INTO #GF(Id) SELECT Id FROM @IdsGF;
  END
  ELSE
  BEGIN
    INSERT INTO #GF(Id)
    SELECT DISTINCT fa.IdGranFactor
    FROM dbo.Factores fa
    WHERE fa.IdFlujo = @IdFlujo;
  END

  /* 🔹 Normalizar filtros: 'vacío' -> '' (trim, case/accent-insensitive) */
  IF OBJECT_ID('tempdb..#FNorm') IS NOT NULL DROP TABLE #FNorm;
  CREATE TABLE #FNorm
  (
    IdCampoDemografico INT NOT NULL,
    Valor NVARCHAR(255) NULL
  );

  INSERT INTO #FNorm (IdCampoDemografico, Valor)
  SELECT
      f.IdCampoDemografico,
      CASE
        WHEN f.Valor IS NULL THEN NULL
        WHEN LTRIM(RTRIM(f.Valor)) COLLATE Latin1_General_100_CI_AI IN (N'vacío', N'vacio')
             THEN N''                                  -- ← aquí se vuelve cadena vacía
        ELSE LTRIM(RTRIM(f.Valor))
      END
  FROM @Filtros AS f;

  /* 1) #Emps: declarar UNA vez y luego insertar */
  IF OBJECT_ID('tempdb..#Emps') IS NOT NULL DROP TABLE #Emps;
  CREATE TABLE #Emps (IdEmpleado INT PRIMARY KEY);

  IF EXISTS (SELECT 1 FROM #FNorm)          -- ← usar normalizados
  BEGIN
    IF @ModoEff = N'AND'
    BEGIN
      INSERT INTO #Emps (IdEmpleado)
      SELECT e.Id
      FROM dbo.Empleados e
      WHERE e.Estado = 1
        AND e.IdOrganizacion = @IdOrganizacion
        AND NOT EXISTS (
              SELECT 1
              FROM (
                   SELECT DISTINCT IdCampoDemografico
                   FROM #FNorm                       -- ← usar normalizados
              ) fc
              WHERE NOT EXISTS (
                  SELECT 1
                  FROM dbo.EmpleadoDemografico ed
                  WHERE ed.IdEmpleado         = e.Id
                    AND ed.IdCampoDemografico = fc.IdCampoDemografico
                    AND LTRIM(RTRIM(ISNULL(ed.Valor, N''))) IN (   -- emp empareja '' también
                        SELECT LTRIM(RTRIM(ISNULL(f2.Valor, N'')))
                        FROM #FNorm f2
                        WHERE f2.IdCampoDemografico = fc.IdCampoDemografico
                    )
              )
        );
    END
    ELSE  -- Modo OR global: cumple al menos un par (IdCampo, Valor)
    BEGIN
      INSERT INTO #Emps (IdEmpleado)
      SELECT DISTINCT e.Id
      FROM dbo.Empleados e
      JOIN dbo.EmpleadoDemografico ed
        ON ed.IdEmpleado = e.Id
      JOIN #FNorm f
        ON f.IdCampoDemografico = ed.IdCampoDemografico
       AND LTRIM(RTRIM(ISNULL(ed.Valor, N''))) = LTRIM(RTRIM(ISNULL(f.Valor, N'')))  -- ← '' ok
      WHERE e.Estado         = 1
        AND e.IdOrganizacion = @IdOrganizacion;
    END
  END
  ELSE
  BEGIN
    -- Sin filtros: todos los empleados activos de la organización del flujo
    INSERT INTO #Emps (IdEmpleado)
    SELECT e.Id
    FROM dbo.Empleados e
    WHERE e.Estado         = 1
      AND e.IdOrganizacion = @IdOrganizacion;
  END

  /* =========================================================
     REEMPLAZAR #Base (agrega ValorOpcion + score dinámico)
  ========================================================= */
  CREATE TABLE #Base(
    IdEmpleado   INT          NOT NULL,
    IdFactor     INT          NOT NULL,
    IdGranFactor INT          NOT NULL,
    IdOpcion     INT          NOT NULL,
    ValorOpcion  NVARCHAR(10) NOT NULL, -- opt_1,opt_2,opt_0,opt_3,opt_4
    Score        TINYINT      NOT NULL, -- Likert-4: 3..0, Likert-5: 4..0
    IdPregunta   INT          NOT NULL
  );

  INSERT INTO #Base (IdEmpleado, IdPregunta, IdFactor, IdGranFactor, IdOpcion, ValorOpcion, Score)
  SELECT
    r.IdEmpleado,
    p.Id               AS IdPregunta,
    p.IdFactor,
    fa.IdGranFactor,
    r.IdOpcion,

    CASE
      WHEN @EsLikert5 = 1 AND ov.ValorRaw = 'opt_5' THEN 'opt_0'  -- compatibilidad por datos viejos
      ELSE ov.ValorRaw
    END AS ValorOpcion,

    CASE
      WHEN ov.ValorRaw = 'opt_1' THEN CASE WHEN @EsLikert5 = 1 THEN 4 ELSE 3 END
      WHEN ov.ValorRaw = 'opt_2' THEN CASE WHEN @EsLikert5 = 1 THEN 3 ELSE 2 END
      WHEN @EsLikert5 = 1 AND ov.ValorRaw IN ('opt_0','opt_5') THEN 2
      WHEN ov.ValorRaw = 'opt_3' THEN 1
      WHEN ov.ValorRaw = 'opt_4' THEN 0
    END AS Score
  FROM dbo.Respuestas r
  JOIN dbo.Preguntas        p     ON p.Id  = r.IdPregunta AND p.Tipo = 'radio'
  JOIN dbo.Factores         fa    ON fa.Id = p.IdFactor AND fa.IdFlujo = @IdFlujo
  JOIN #GF                  gfSel ON gfSel.Id = fa.IdGranFactor
  JOIN dbo.OpcionesPregunta o     ON o.Id = r.IdOpcion
  CROSS APPLY (SELECT LOWER(LTRIM(RTRIM(o.Valor))) AS ValorRaw) ov
  WHERE r.IdOpcion <> 1
    AND EXISTS (SELECT 1 FROM #Emps e WHERE e.IdEmpleado = r.IdEmpleado)
    AND (
      ov.ValorRaw IN ('opt_1','opt_2','opt_3','opt_4')
      OR (@EsLikert5 = 1 AND ov.ValorRaw IN ('opt_0','opt_5'))
    );

  /* =========================================================
     SELECT 1 (calificación general) dinámico 4/5 niveles
  ========================================================= */
  SELECT
    COUNT(*) AS total_respuestas,
    SUM(CASE WHEN ValorOpcion = 'opt_1' THEN 1 ELSE 0 END) AS total_opt1,
    SUM(CASE WHEN ValorOpcion = 'opt_2' THEN 1 ELSE 0 END) AS total_opt2,
    SUM(CASE WHEN ValorOpcion = 'opt_0' THEN 1 ELSE 0 END) AS total_opt0,
    SUM(CASE WHEN ValorOpcion = 'opt_3' THEN 1 ELSE 0 END) AS total_opt3,
    SUM(CASE WHEN ValorOpcion = 'opt_4' THEN 1 ELSE 0 END) AS total_opt4,

    CONVERT(decimal(5,2), 100.0 * SUM(CASE WHEN Score = @Top1Score THEN 1 ELSE 0 END) / NULLIF(COUNT(*),0)) AS pct_top1,
    CONVERT(decimal(5,2), 100.0 * SUM(CASE WHEN Score BETWEEN @Top2LowScore AND @Top1Score THEN 1 ELSE 0 END) / NULLIF(COUNT(*),0)) AS pct_top2,

    CONVERT(decimal(5,2), 100.0 * SUM(CASE WHEN ValorOpcion = 'opt_4' THEN 1 ELSE 0 END) / NULLIF(COUNT(*),0)) AS pct_bottom1,

    CONVERT(decimal(5,2), 100.0 * SUM(CASE WHEN Score BETWEEN @Top2LowScore AND @Top1Score THEN 1 ELSE 0 END) / NULLIF(COUNT(*),0)) AS pct_favorable,
    CONVERT(decimal(5,2), 100.0 * SUM(CASE WHEN Score BETWEEN 0 AND @Bottom2HighScore THEN 1 ELSE 0 END) / NULLIF(COUNT(*),0)) AS pct_desfavorable,

    -- Restrictivo alineado con pct_general (complementario)
    CONVERT(decimal(6,2),
      100.0 * SUM(@MaxScore - Score) / NULLIF(@MaxScore * COUNT(*),0)
    ) AS pct_desfavorable_restrictivo,

    CONVERT(decimal(6,2), 100.0 *
      (
        SUM(CASE WHEN Score BETWEEN @Top2LowScore AND @Top1Score THEN 1 ELSE 0 END) -
        SUM(CASE WHEN Score BETWEEN 0 AND @Bottom2HighScore THEN 1 ELSE 0 END)
      ) / NULLIF(COUNT(*),0)
    ) AS nsat,

    CONVERT(decimal(6,2), 100.0 * SUM(Score) / NULLIF(@MaxScore * COUNT(*),0)) AS pct_general,

    CONVERT(decimal(5,2), 1.0 + SUM(Score) / NULLIF(COUNT(*),0)) AS mean_1_4
FROM #Base
OPTION (RECOMPILE);



  /* =========================================================
     SELECT 2 (distribución global) + opt_0
  ========================================================= */
  SELECT
    ISNULL(CONVERT(decimal(5,2), 100.0 * SUM(CASE WHEN ValorOpcion = 'opt_1' THEN 1 ELSE 0 END) / NULLIF(COUNT(*),0)), 0.00) AS opt_1_pct,
    ISNULL(CONVERT(decimal(5,2), 100.0 * SUM(CASE WHEN ValorOpcion = 'opt_2' THEN 1 ELSE 0 END) / NULLIF(COUNT(*),0)), 0.00) AS opt_2_pct,
    ISNULL(CONVERT(decimal(5,2), 100.0 * SUM(CASE WHEN ValorOpcion = 'opt_0' THEN 1 ELSE 0 END) / NULLIF(COUNT(*),0)), 0.00) AS opt_0_pct, -- nuevo
    ISNULL(CONVERT(decimal(5,2), 100.0 * SUM(CASE WHEN ValorOpcion = 'opt_3' THEN 1 ELSE 0 END) / NULLIF(COUNT(*),0)), 0.00) AS opt_3_pct,
    ISNULL(CONVERT(decimal(5,2), 100.0 * SUM(CASE WHEN ValorOpcion = 'opt_4' THEN 1 ELSE 0 END) / NULLIF(COUNT(*),0)), 0.00) AS opt_4_pct,
    COUNT(*) AS total_respuestas
  FROM #Base
  OPTION (RECOMPILE);

  /* =========================================================
     SELECT 3 (por factor) - cambiar agg para usar ValorOpcion
  ========================================================= */
  WITH agg AS (
    SELECT
      b.IdFactor,
      b.IdGranFactor,
      gf.Etiqueta AS EtiquetaGranFactor,
      fa.Etiqueta AS Factor,

      COUNT(DISTINCT b.IdEmpleado) AS empleados_respondieron,
      COUNT(*) AS total_respuestas,

      SUM(CASE WHEN b.ValorOpcion = 'opt_1' THEN 1 ELSE 0 END) AS cnt_opt1,
      SUM(CASE WHEN b.ValorOpcion = 'opt_2' THEN 1 ELSE 0 END) AS cnt_opt2,
      SUM(CASE WHEN b.ValorOpcion = 'opt_0' THEN 1 ELSE 0 END) AS cnt_opt0, -- nuevo
      SUM(CASE WHEN b.ValorOpcion = 'opt_3' THEN 1 ELSE 0 END) AS cnt_opt3,
      SUM(CASE WHEN b.ValorOpcion = 'opt_4' THEN 1 ELSE 0 END) AS cnt_opt4,

      SUM(CAST(b.Score AS INT)) AS sum_score,
      AVG(CAST(b.Score AS FLOAT)) AS avg_score,
      STDEV(CAST(b.Score AS FLOAT)) AS stdev_score
    FROM #Base b
    JOIN dbo.Factores      fa ON fa.Id = b.IdFactor
    JOIN dbo.GranFactores  gf ON gf.Id = b.IdGranFactor
    JOIN dbo.Empleados      e ON e.Id = b.IdEmpleado AND e.Estado = 1
    GROUP BY b.IdFactor, b.IdGranFactor, gf.Etiqueta, fa.Etiqueta
  )
  SELECT
    IdFactor, IdGranFactor, EtiquetaGranFactor, Factor,
    empleados_respondieron, total_respuestas,

    cnt_opt1, cnt_opt2, cnt_opt0, cnt_opt3, cnt_opt4,  -- incluye neutro

    ISNULL(CONVERT(decimal(5,2), 100.0*cnt_opt1/NULLIF(total_respuestas,0)), 0.00) AS pct_opt1,
    ISNULL(CONVERT(decimal(5,2), 100.0*cnt_opt2/NULLIF(total_respuestas,0)), 0.00) AS pct_opt2,
    ISNULL(CONVERT(decimal(5,2), 100.0*cnt_opt0/NULLIF(total_respuestas,0)), 0.00) AS pct_opt0,
    ISNULL(CONVERT(decimal(5,2), 100.0*cnt_opt3/NULLIF(total_respuestas,0)), 0.00) AS pct_opt3,
    ISNULL(CONVERT(decimal(5,2), 100.0*cnt_opt4/NULLIF(total_respuestas,0)), 0.00) AS pct_opt4,

    ISNULL(CONVERT(decimal(6,2), 100.0*(cnt_opt1 + cnt_opt2)/NULLIF(total_respuestas,0)), 0.00) AS pct_satisfaccion_equal,

    ISNULL(CONVERT(decimal(6,2),
      ((100.0*(cnt_opt1 + cnt_opt2 - cnt_opt3 - cnt_opt4)/NULLIF(total_respuestas,0)) + 100.0)/2.0
    ), 0.00) AS pct_satisfaccion_nsat01,

    (sum_score + total_respuestas) AS sum_score,
    CONVERT(decimal(5,4), 1.0 + avg_score) AS avg_score,
    CONVERT(decimal(5,4), stdev_score) AS stdev_score,
    ISNULL(CONVERT(decimal(6,2), 100.0 * sum_score / NULLIF(@MaxScore * total_respuestas,0)), 0.00) AS pct_satisfaccion,

    ISNULL(CONVERT(decimal(5,2), 100.0*cnt_opt1/NULLIF(cnt_opt1 + cnt_opt2, 0)), 0.00) AS pct_top1_sobre_favorables,
    ISNULL(CONVERT(decimal(5,2), 100.0*cnt_opt4/NULLIF(cnt_opt3 + cnt_opt4, 0)), 0.00) AS pct_opt4_sobre_desfavor
  FROM agg
  ORDER BY EtiquetaGranFactor, Factor
  OPTION (RECOMPILE);

  /* =========================================================
     SELECT 4 (por pregunta) usar ValorOpcion + escala dinámica
  ========================================================= */
  WITH base_q AS (
    SELECT
      b.IdPregunta,
      fa.Id AS IdFactor,
      fa.Etiqueta AS Factor,
      p.Etiqueta  AS Pregunta,
      gf.Etiqueta AS EtiquetaGranFactor,
      COUNT(*) AS total_respuestas,

      SUM(CASE WHEN b.ValorOpcion = 'opt_1' THEN 1 ELSE 0 END) AS total_opt1,
      SUM(CASE WHEN b.ValorOpcion = 'opt_2' THEN 1 ELSE 0 END) AS total_opt2,
      SUM(CASE WHEN b.ValorOpcion = 'opt_0' THEN 1 ELSE 0 END) AS total_opt0, -- nuevo
      SUM(CASE WHEN b.ValorOpcion = 'opt_3' THEN 1 ELSE 0 END) AS total_opt3,
      SUM(CASE WHEN b.ValorOpcion = 'opt_4' THEN 1 ELSE 0 END) AS total_opt4,

      SUM(CAST(b.Score AS INT)) AS sum_score
    FROM #Base b
    JOIN dbo.Preguntas p ON p.Id = b.IdPregunta
    JOIN dbo.Factores  fa ON fa.Id = b.IdFactor
    JOIN dbo.GranFactores gf ON gf.Id = fa.IdGranFactor
    GROUP BY b.IdPregunta, fa.Etiqueta, p.Etiqueta, gf.Etiqueta, fa.Id
  )
  SELECT
    IdPregunta, IdFactor, Factor, Pregunta, EtiquetaGranFactor, total_respuestas,
    total_opt1, total_opt2, total_opt0, total_opt3, total_opt4,

    ROUND(100.0 * total_opt1 / NULLIF(total_respuestas, 0), 2) AS pct_top1,
    ROUND(100.0 * (total_opt1 + total_opt2) / NULLIF(total_respuestas, 0), 2) AS pct_top2,
    ROUND(100.0 * (total_opt1 + total_opt2) / NULLIF(total_respuestas, 0), 2) AS pct_favorable,
    ROUND(100.0 * (total_opt3 + total_opt4) / NULLIF(total_respuestas, 0), 2) AS pct_desfavorable,

    ROUND(
      100.0 * ((total_opt1 + total_opt2) - (total_opt3 + total_opt4))
      / NULLIF(total_respuestas, 0), 2
    ) AS nsat,

    ROUND(100.0 * sum_score / NULLIF(@MaxScore * total_respuestas, 0), 2) AS mean_0_100,
    ROUND(1.0 + sum_score / NULLIF(total_respuestas, 0), 2) AS mean_1_4
  FROM base_q
  ORDER BY IdFactor, IdPregunta
  OPTION (RECOMPILE);

  /* =========================================================
     SELECT 5 (respuesta por factor) + neutro
  ========================================================= */
  WITH T AS (
    SELECT
      b.IdFactor,
      fa.Etiqueta AS Factor,
      SUM(CASE WHEN b.ValorOpcion = 'opt_1' THEN 1 ELSE 0 END) AS n_totalmente_de_acuerdo,
      SUM(CASE WHEN b.ValorOpcion = 'opt_2' THEN 1 ELSE 0 END) AS n_de_acuerdo,
      SUM(CASE WHEN b.ValorOpcion = 'opt_0' THEN 1 ELSE 0 END) AS n_neutro, -- nuevo
      SUM(CASE WHEN b.ValorOpcion = 'opt_3' THEN 1 ELSE 0 END) AS n_en_desacuerdo,
      SUM(CASE WHEN b.ValorOpcion = 'opt_4' THEN 1 ELSE 0 END) AS n_totalmente_en_desacuerdo,
      COUNT(*) AS n_total
    FROM #Base b
    JOIN dbo.Factores fa ON fa.Id = b.IdFactor
    JOIN dbo.Empleados e ON e.Id = b.IdEmpleado AND e.Estado = 1
    GROUP BY b.IdFactor, fa.Etiqueta
  )
  SELECT
    IdFactor,
    Factor,
    CONVERT(decimal(5,2), 100.0 * n_totalmente_de_acuerdo    / NULLIF(n_total, 0)) AS total_totalmente_de_acuerdo,
    CONVERT(decimal(5,2), 100.0 * n_de_acuerdo               / NULLIF(n_total, 0)) AS total_de_acuerdo,
    CONVERT(decimal(5,2), 100.0 * n_neutro                   / NULLIF(n_total, 0)) AS total_neutro, -- nuevo
    CONVERT(decimal(5,2), 100.0 * n_en_desacuerdo            / NULLIF(n_total, 0)) AS total_en_desacuerdo,
    CONVERT(decimal(5,2), 100.0 * n_totalmente_en_desacuerdo / NULLIF(n_total, 0)) AS total_totalmente_en_desacuerdo,
    n_total AS total_respuestas
  FROM T
  ORDER BY Factor
  OPTION (RECOMPILE);

  /* =========================================================
     SELECT 6 (satisfacción por factor) dinámico
  ========================================================= */
  WITH F AS (
    SELECT
      b.IdFactor,
      b.IdGranFactor,
      gf.Etiqueta AS EtiquetaGranFactor,
      fa.Etiqueta AS Factor,
      COUNT(*) AS total_respuestas,
      SUM(CASE WHEN b.Score BETWEEN @Top2LowScore AND @Top1Score THEN 1 ELSE 0 END) AS total_satisfaccion,
      SUM(CASE WHEN b.Score BETWEEN 0 AND @Bottom2HighScore THEN 1 ELSE 0 END) AS total_insatisfaccion,

      -- Acumulados para versión restrictiva (ponderada)
      SUM(b.Score) AS sum_score
    FROM #Base b
    JOIN dbo.Factores     fa ON fa.Id = b.IdFactor
    JOIN dbo.GranFactores gf ON gf.Id = b.IdGranFactor
    GROUP BY b.IdFactor, b.IdGranFactor, gf.Etiqueta, fa.Etiqueta
)
SELECT
    IdFactor,
    IdGranFactor,
    EtiquetaGranFactor,
    Factor,
    total_respuestas,
    total_satisfaccion,
    total_insatisfaccion,

    -- Versión clásica (Top2 / Bottom2)
    CONVERT(decimal(5,2), 100.0 * total_satisfaccion   / NULLIF(total_respuestas,0)) AS pct_satisfaccion,
    CONVERT(decimal(5,2), 100.0 * total_insatisfaccion / NULLIF(total_respuestas,0)) AS pct_insatisfaccion,

    CONVERT(decimal(5,2),
      100.0
      - (100.0 * total_satisfaccion   / NULLIF(total_respuestas,0))
      - (100.0 * total_insatisfaccion / NULLIF(total_respuestas,0))
    ) AS pct_neutro,

    -- Versión restrictiva (ponderada por score)
    CONVERT(decimal(6,2),
      100.0 * sum_score / NULLIF(@MaxScore * total_respuestas, 0)
    ) AS pct_satisfaccion_restrictivo,

    CONVERT(decimal(6,2),
      100.0 * (@MaxScore * total_respuestas - sum_score) / NULLIF(@MaxScore * total_respuestas, 0)
    ) AS pct_insatisfaccion_restrictivo

FROM F
ORDER BY EtiquetaGranFactor, Factor
OPTION (RECOMPILE);


  /* === SELECT 7..10 se quedan igual === */
  /* === SELECT 7: Comentarios abiertos (misma forma que spGetComentariosAbiertosPorFlujoGF) === */
  SELECT
      fa.Id       AS IdFactor,
      fa.Etiqueta AS Factor,
      p.Id        AS IdPregunta,
      p.Etiqueta  AS Pregunta,
      (
        SELECT
            r.Id             AS IdRespuesta,
            r.RespuestaLibre AS Comentario,
            r.FechaRespuesta
        FROM dbo.Respuestas r
        WHERE r.IdPregunta       = p.Id
          AND r.RespuestaLibre  IS NOT NULL     -- solo abiertas
          AND r.IdOpcion         = 2477         -- <-- ID de opción para texto libre (ajusta si difiere)
          AND EXISTS (SELECT 1 FROM #Emps e WHERE e.IdEmpleado = r.IdEmpleado)  -- respeta filtros/activos
        ORDER BY r.FechaRespuesta DESC, r.Id DESC
        FOR JSON PATH
      ) AS ComentariosJSON
  FROM   dbo.Factores  fa
  JOIN   dbo.Preguntas p
        ON p.IdFactor = fa.Id
        AND p.Tipo     = 'text'                  -- abiertas
  JOIN   #GF gfSel
        ON gfSel.Id  = fa.IdGranFactor          -- respeta filtro GF (o “todos” si venía vacío)
  WHERE  fa.IdFlujo   = @IdFlujo
  ORDER BY fa.Etiqueta, p.Id
  OPTION (RECOMPILE);


  /* === SELECT 8: Comentarios abiertos con IA (misma forma que spGetComentariosAbiertosIAPorFlujoGF) === */
  SELECT
      fa.Id       AS IdFactor,
      fa.Etiqueta AS Factor,
      p.Id        AS IdPregunta,
      p.Etiqueta  AS Pregunta,
      (
        SELECT
            r.Id             AS IdRespuesta,
            r.RespuestaLibre AS Comentario,
            r.Sentimient     AS Sentiment,   -- <- origen 'Sentimient' mapeado a 'Sentiment'
            r.Positive,
            r.Negative,
            r.Neutral,
            r.Mixxed,
            r.FechaRespuesta
        FROM dbo.Respuestas r
        WHERE r.IdPregunta       = p.Id
          AND r.RespuestaLibre  IS NOT NULL   -- solo abiertas
          AND r.IdOpcion         = 2477       -- ajusta si tu ID de “texto libre” es otro
          AND EXISTS (SELECT 1 FROM #Emps e WHERE e.IdEmpleado = r.IdEmpleado) -- respeta filtros/activos
        ORDER BY r.FechaRespuesta DESC, r.Id DESC
        FOR JSON PATH
      ) AS ComentariosJSON
  FROM   dbo.Factores  fa
  JOIN   dbo.Preguntas p
        ON p.IdFactor = fa.Id
        AND p.Tipo     = 'iatext'             -- abiertas analizadas por IA/Comprehend
  JOIN   #GF gfSel
        ON gfSel.Id  = fa.IdGranFactor       -- respeta filtro de GF (o “todos” si venía vacío)
  WHERE  fa.IdFlujo   = @IdFlujo
  ORDER BY fa.Etiqueta, p.Id
  OPTION (RECOMPILE);


  /* === SELECT 9: Métricas para preguntas tipo 'slider' (rango) === */
  ;WITH r_slider AS (
    SELECT
      r.Id            AS IdRespuesta,
      r.IdEmpleado,
      r.IdPregunta,
      TRY_CONVERT(INT, r.RespuestaLibre) AS Valor,
      r.FechaRespuesta
    FROM dbo.Respuestas r
    WHERE r.RespuestaLibre IS NOT NULL
  ),
  r_slider_clean AS (  -- última respuesta por (Empleado, Pregunta)
    SELECT r.*,
          ROW_NUMBER() OVER(
            PARTITION BY r.IdEmpleado, r.IdPregunta
            ORDER BY r.FechaRespuesta DESC, r.IdRespuesta DESC
          ) AS rn
    FROM r_slider r
  ),
  q AS (  -- universo de preguntas slider dentro del flujo y GF seleccionados
    SELECT
      fa.IdGranFactor,
      gf.Etiqueta         AS EtiquetaGranFactor,
      fa.Id               AS IdFactor,
      fa.Etiqueta         AS Factor,
      p.Id                AS IdPregunta,
      p.Etiqueta          AS Pregunta,
      p.RangoMin,
      p.RangoMax
    FROM dbo.Preguntas       p
    JOIN dbo.Factores        fa ON fa.Id = p.IdFactor AND fa.IdFlujo = @IdFlujo
    JOIN dbo.GranFactores    gf ON gf.Id = fa.IdGranFactor
    JOIN #GF                gfSel ON gfSel.Id = fa.IdGranFactor
    WHERE p.Tipo = 'slider'
  ),
  resp AS (  -- respuestas válidas (numéricas y dentro de rango), filtradas por #Emps
    SELECT
      q.IdGranFactor, q.EtiquetaGranFactor, q.IdFactor, q.Factor,
      q.IdPregunta, q.Pregunta, q.RangoMin, q.RangoMax,
      rc.Valor
    FROM q
    JOIN r_slider_clean rc
      ON rc.IdPregunta = q.IdPregunta AND rc.rn = 1
    WHERE EXISTS (SELECT 1 FROM #Emps e WHERE e.IdEmpleado = rc.IdEmpleado)
      AND rc.Valor IS NOT NULL
      AND rc.Valor BETWEEN q.RangoMin AND q.RangoMax
  ),
  /* Tally 0..1000 para cubrir rangos típicos (ajusta si necesitas más) */
  N AS (
    SELECT 0 AS n
    UNION ALL SELECT n+1 FROM N WHERE n < 1000
  ),
  range_vals AS (  -- todos los valores del rango por pregunta
    SELECT
      q.IdGranFactor, q.EtiquetaGranFactor, q.IdFactor, q.Factor,
      q.IdPregunta, q.Pregunta, q.RangoMin, q.RangoMax,
      Valor = q.RangoMin + N.n
    FROM q
    JOIN N ON N.n <= (q.RangoMax - q.RangoMin)
  ),
  dist AS (  -- conteo por (pregunta, valor)
    SELECT
      rv.IdGranFactor, rv.EtiquetaGranFactor, rv.IdFactor, rv.Factor,
      rv.IdPregunta, rv.Pregunta, rv.RangoMin, rv.RangoMax,
      rv.Valor,
      COUNT(r.Valor) AS Conteo
    FROM range_vals rv
    LEFT JOIN resp r
      ON r.IdPregunta = rv.IdPregunta
    AND r.Valor      = rv.Valor
    GROUP BY
      rv.IdGranFactor, rv.EtiquetaGranFactor, rv.IdFactor, rv.Factor,
      rv.IdPregunta, rv.Pregunta, rv.RangoMin, rv.RangoMax, rv.Valor
  ),
  tot AS (  -- totales y promedio por pregunta
    SELECT
      IdPregunta,
      total_respuestas = COUNT(*),
      promedio         = AVG(CAST(Valor AS FLOAT))
    FROM resp
    GROUP BY IdPregunta
  ),
  heads AS (  -- una fila por pregunta (evitamos GROUP BY en el SELECT final)
    SELECT DISTINCT
      d.IdGranFactor, d.EtiquetaGranFactor, d.IdFactor, d.Factor,
      d.IdPregunta, d.Pregunta, d.RangoMin, d.RangoMax
    FROM dist d
  )
  SELECT
    h.IdGranFactor,
    h.EtiquetaGranFactor,
    h.IdFactor,
    h.Factor,
    h.IdPregunta,
    h.Pregunta,
    h.RangoMin,
    h.RangoMax,
    ISNULL(t.total_respuestas, 0)                 AS total_respuestas,
    CONVERT(DECIMAL(10,4), ISNULL(t.promedio,0))  AS promedio,
    dj.DistribucionJSON
  FROM heads h
  LEFT JOIN tot t
    ON t.IdPregunta = h.IdPregunta
  OUTER APPLY (
    SELECT
      d2.Valor,
      d2.Conteo,
      CONVERT(DECIMAL(6,2),
        CASE WHEN ISNULL(t.total_respuestas,0) = 0
            THEN 0
            ELSE 100.0 * d2.Conteo / t.total_respuestas
        END
      ) AS Porcentaje
    FROM dist d2
    WHERE d2.IdPregunta = h.IdPregunta
    ORDER BY d2.Valor
    FOR JSON PATH
  ) dj(DistribucionJSON)
  ORDER BY h.EtiquetaGranFactor, h.Factor, h.IdPregunta
  OPTION (MAXRECURSION 0, RECOMPILE);


  /* === SELECT 10 (revisado): Participación global por factor demográfico
       % de participación de cada VALOR sobre el TOTAL de contestadas del flujo
       - Sin filtros demográficos
       - Deduplica duplicados de EncuestasEmpleados por empleado
  ========================================================================= */
  ;WITH per_emp AS (
    /* Un registro por empleado con flag si tiene alguna encuesta Contestada */
    SELECT
      ee.IdEmpleado,
      MAX(CASE WHEN ee.Estado = 'Contestada' THEN 1 ELSE 0 END) AS TieneContestada
     FROM dbo.EncuestasEmpleados ee
	  JOIN dbo.Empleados e
		ON e.Id = ee.IdEmpleado
	   AND e.Estado = 1                      -- <<< solo activos
	   AND e.IdOrganizacion = @IdOrganizacion -- <<< misma organización del flujo
	  WHERE ee.IdFlujo   = @IdFlujo
		AND ee.Eliminada = 0
	  GROUP BY ee.IdEmpleado
  ),
  part_emps AS (
    /* Solo los que efectivamente contestaron */
    SELECT IdEmpleado
    FROM per_emp
    WHERE TieneContestada = 1
  ),
  /* Conteo de participantes por (CampoDemográfico, Valor) */
  cnt_valor AS (
    SELECT
      ed.IdCampoDemografico,
      ed.Valor,
      COUNT(DISTINCT ed.IdEmpleado) AS conteo
    FROM dbo.EmpleadoDemografico ed
    JOIN part_emps pe
      ON pe.IdEmpleado = ed.IdEmpleado
    GROUP BY ed.IdCampoDemografico, ed.Valor
  ),
  /* Total global de contestadas (denominador único para todos los campos) */
  totales AS (
    SELECT COUNT(*) AS total_contestadas
    FROM part_emps
  )
  SELECT
    cv.IdCampoDemografico,
    cd.NombreCampo AS Campo,           -- ajusta si tu catálogo usa otra columna (p.ej. Etiqueta)
    cv.Valor,
    cv.conteo                           AS total_participantes_valor,
    CONVERT(decimal(6,2),
            100.0 * cv.conteo / NULLIF(t.total_contestadas, 0)) AS porcentaje
  FROM cnt_valor        cv
  CROSS JOIN totales    t
  LEFT JOIN dbo.CamposDemograficos cd
    ON cd.Id = cv.IdCampoDemografico
  ORDER BY
    cv.IdCampoDemografico,
    cv.Valor
  OPTION (RECOMPILE);


  /* === % PENDIENTES por valor demográfico (universo = empleados del flujo) === */

  /* Limpieza previa */
  IF OBJECT_ID('tempdb..#AllEmps')   IS NOT NULL DROP TABLE #AllEmps;
  IF OBJECT_ID('tempdb..#PendEmps2') IS NOT NULL DROP TABLE #PendEmps2;
  IF OBJECT_ID('tempdb..#PerEmp')    IS NOT NULL DROP TABLE #PerEmp;

  /* Base del flujo (sin eliminadas); deduplicado por empleado y favoreciendo 'Contestada' */
  ;WITH ee_base AS (
    SELECT ee.IdEmpleado, ee.Estado
    FROM dbo.EncuestasEmpleados ee
    WHERE ee.IdFlujo   = @IdFlujo
      AND ee.Eliminada = 0
  ),
  per_emp AS (
    SELECT
      eb.IdEmpleado,
      MAX(CASE WHEN eb.Estado = 'Contestada' THEN 1 ELSE 0 END) AS TieneContestada
    FROM ee_base eb
    GROUP BY eb.IdEmpleado
  )
  /* Persistimos la CTE para usarla varias veces */
  SELECT
    IdEmpleado,
    TieneContestada
  INTO #PerEmp
  FROM per_emp;

  /* Universo: todos los empleados con encuesta (una vez) */
  SELECT IdEmpleado
  INTO #AllEmps
  FROM #PerEmp;

  /* Pendientes: solo quienes NO tienen ninguna contestada */
  SELECT IdEmpleado
  INTO #PendEmps2
  FROM #PerEmp
  WHERE TieneContestada = 0;


  DELETE ae FROM #AllEmps   ae WHERE NOT EXISTS (SELECT 1 FROM dbo.Empleados e WHERE e.Id = ae.IdEmpleado AND e.Estado = 1);
  DELETE pe FROM #PendEmps2 pe WHERE NOT EXISTS (SELECT 1 FROM dbo.Empleados e WHERE e.Id = pe.IdEmpleado AND e.Estado = 1);


  /* Pares únicos (Empleado, Campo, Valor) en universo y en pendientes */
  ;WITH all_pairs AS (
    SELECT DISTINCT ae.IdEmpleado, ed.IdCampoDemografico, ed.Valor
    FROM #AllEmps ae
    JOIN dbo.EmpleadoDemografico ed ON ed.IdEmpleado = ae.IdEmpleado
  ),
  pend_pairs AS (
    SELECT DISTINCT pe.IdEmpleado, ed.IdCampoDemografico, ed.Valor
    FROM #PendEmps2 pe
    JOIN dbo.EmpleadoDemografico ed ON ed.IdEmpleado = pe.IdEmpleado
  ),
  totals AS (  -- denominador por (campo, valor)
    SELECT IdCampoDemografico, Valor, COUNT(DISTINCT IdEmpleado) AS total_en_campo
    FROM all_pairs
    GROUP BY IdCampoDemografico, Valor
  ),
  pend AS (    -- numerador por (campo, valor)
    SELECT IdCampoDemografico, Valor, COUNT(DISTINCT IdEmpleado) AS pendientes
    FROM pend_pairs
    GROUP BY IdCampoDemografico, Valor
  )
  SELECT
    t.IdCampoDemografico,
    cd.NombreCampo AS Campo,   -- ajusta al catálogo real
    t.Valor,
    t.total_en_campo,                                                    -- empleados del flujo con ese valor
    ISNULL(p.pendientes, 0)                           AS pendientes,
    (t.total_en_campo - ISNULL(p.pendientes,0))       AS contestadas,
    CONVERT(decimal(6,2), 100.0 * ISNULL(p.pendientes,0) / NULLIF(t.total_en_campo,0)) AS pct_pendientes,
    CONVERT(decimal(6,2), 100.0 * (t.total_en_campo - ISNULL(p.pendientes,0)) / NULLIF(t.total_en_campo,0)) AS pct_contestadas
  FROM totals t

  LEFT JOIN pend p
    ON p.IdCampoDemografico = t.IdCampoDemografico
  AND p.Valor              = t.Valor
  LEFT JOIN dbo.CamposDemograficos cd
    ON cd.Id = t.IdCampoDemografico
  ORDER BY t.IdCampoDemografico, t.Valor
  OPTION (RECOMPILE);

  /* === SELECT 12: Distribución de respuestas para preguntas tipo 'select' ===
       - Conserva el orden de todos los result sets anteriores.
       - Usa #Emps para respetar los filtros demográficos AND/OR.
       - Usa #GF para respetar la selección de grandes factores.
       - Incluye opciones sin respuestas con Conteo = 0 y Porcentaje = 0.
       - Si existen respuestas duplicadas históricas, toma la más reciente
         por empleado y pregunta, porque 'select' es de selección única.
  ========================================================================== */
  ;WITH preguntas_select AS (
    SELECT
      fa.IdGranFactor,
      gf.Etiqueta AS EtiquetaGranFactor,
      fa.Id       AS IdFactor,
      fa.Etiqueta AS Factor,
      p.Id        AS IdPregunta,
      p.Etiqueta  AS Pregunta
    FROM dbo.Preguntas p
    JOIN dbo.Factores fa
      ON fa.Id = p.IdFactor
     AND fa.IdFlujo = @IdFlujo
    JOIN dbo.GranFactores gf
      ON gf.Id = fa.IdGranFactor
    JOIN #GF gfSel
      ON gfSel.Id = fa.IdGranFactor
    WHERE LOWER(LTRIM(RTRIM(ISNULL(p.Tipo, N'')))) = N'select'
  ),
  opciones_select AS (
    SELECT
      ps.IdPregunta,
      op.Id       AS IdOpcion,
      op.Valor,
      op.Etiqueta,
      ROW_NUMBER() OVER (
        PARTITION BY ps.IdPregunta
        ORDER BY op.Id
      ) AS OrdenOpcion
    FROM preguntas_select ps
    JOIN dbo.OpcionesPregunta op
      ON op.IdPregunta = ps.IdPregunta
  ),
  respuestas_ranked AS (
    SELECT
      r.Id,
      r.IdEmpleado,
      r.IdPregunta,
      r.IdOpcion,
      ROW_NUMBER() OVER (
        PARTITION BY r.IdEmpleado, r.IdPregunta
        ORDER BY r.FechaRespuesta DESC, r.Id DESC
      ) AS rn
    FROM dbo.Respuestas r
    JOIN preguntas_select ps
      ON ps.IdPregunta = r.IdPregunta
    JOIN #Emps emp
      ON emp.IdEmpleado = r.IdEmpleado
  ),
  respuestas_validas AS (
    SELECT
      rr.IdEmpleado,
      rr.IdPregunta,
      rr.IdOpcion
    FROM respuestas_ranked rr
    JOIN opciones_select os
      ON os.IdPregunta = rr.IdPregunta
     AND os.IdOpcion   = rr.IdOpcion
    WHERE rr.rn = 1
  ),
  conteos AS (
    SELECT
      rv.IdPregunta,
      rv.IdOpcion,
      COUNT(*) AS Conteo
    FROM respuestas_validas rv
    GROUP BY rv.IdPregunta, rv.IdOpcion
  ),
  totales AS (
    SELECT
      rv.IdPregunta,
      COUNT(*) AS total_respuestas
    FROM respuestas_validas rv
    GROUP BY rv.IdPregunta
  ),
  total_opciones AS (
    SELECT
      os.IdPregunta,
      COUNT(*) AS total_opciones
    FROM opciones_select os
    GROUP BY os.IdPregunta
  )
  SELECT
    ps.IdGranFactor,
    ps.EtiquetaGranFactor,
    ps.IdFactor,
    ps.Factor,
    ps.IdPregunta,
    ps.Pregunta,
    ISNULL(op.total_opciones, 0)  AS total_opciones,
    ISNULL(t.total_respuestas, 0) AS total_respuestas,
    opciones.OpcionesJSON
  FROM preguntas_select ps
  LEFT JOIN totales t
    ON t.IdPregunta = ps.IdPregunta
  LEFT JOIN total_opciones op
    ON op.IdPregunta = ps.IdPregunta
  OUTER APPLY (
    SELECT
      os.IdOpcion,
      os.Valor,
      os.Etiqueta,
      ISNULL(c.Conteo, 0) AS Conteo,
      CONVERT(DECIMAL(6,2),
        CASE
          WHEN ISNULL(t.total_respuestas, 0) = 0 THEN 0
          ELSE 100.0 * ISNULL(c.Conteo, 0) / t.total_respuestas
        END
      ) AS Porcentaje
    FROM opciones_select os
    LEFT JOIN conteos c
      ON c.IdPregunta = os.IdPregunta
     AND c.IdOpcion   = os.IdOpcion
    WHERE os.IdPregunta = ps.IdPregunta
    ORDER BY os.OrdenOpcion
    FOR JSON PATH
  ) opciones(OpcionesJSON)
  ORDER BY
    ps.EtiquetaGranFactor,
    ps.Factor,
    ps.IdPregunta
  OPTION (RECOMPILE);

  /* Limpieza final */
  DROP TABLE IF EXISTS #AllEmps;
  DROP TABLE IF EXISTS #PendEmps2;
  DROP TABLE IF EXISTS #PerEmp;



END
GO
