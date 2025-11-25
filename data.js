export const medDatabase = [
  {
    id: 'sertralina',
    name: 'Sertralina',
    type: 'ISRS',
    cautionList: [
      { targetId: 'ibuprofeno', level: 'low', msg: 'Puede aumentar riesgo de sangrado con uso prolongado.' },
      { targetId: 'hierba_de_san_juan', level: 'high', msg: 'Riesgo de síndrome serotoninérgico. Evitar sin supervisión médica.' },
      { targetId: 'paroxetina', level: 'high', msg: 'Duplicidad de mecanismo (ISRS). Ajustar dosis solo con psiquiatra.' },
      { targetId: 'mirtazapina', level: 'medium', msg: 'Posible potenciación sedante. Vigilar somnolencia.' }
    ]
  },
  {
    id: 'paroxetina',
    name: 'Paroxetina',
    type: 'ISRS',
    cautionList: [
      { targetId: 'sertralina', level: 'high', msg: 'No combinar dos ISRS sin ajuste profesional.' },
      { targetId: 'hierba_de_san_juan', level: 'high', msg: 'Interacción serotoninérgica. Evitar.' },
      { targetId: 'mirtazapina', level: 'medium', msg: 'Potenciación sedante. Consultar si hay somnolencia marcada.' }
    ]
  },
  {
    id: 'mirtazapina',
    name: 'Mirtazapina',
    type: 'NaSSA',
    cautionList: [
      { targetId: 'zopiclona', level: 'medium', msg: 'Aumento de sedación. No conducir si hay somnolencia.' },
      { targetId: 'alprazolam', level: 'medium', msg: 'Sedación aditiva. Vigilar coordinación y alertas.' },
      { targetId: 'alcohol', level: 'high', msg: 'Incrementa depresión del SNC. Evitar.' }
    ]
  },
  {
    id: 'venlafaxina',
    name: 'Venlafaxina',
    type: 'IRSN',
    cautionList: [
      { targetId: 'hierba_de_san_juan', level: 'high', msg: 'Riesgo de síndrome serotoninérgico.' },
      { targetId: 'linezolid', level: 'high', msg: 'Contraindicado por riesgo de hipertensión severa.' }
    ]
  },
  {
    id: 'clonazepam',
    name: 'Clonazepam',
    type: 'Benzodiacepina',
    cautionList: [
      { targetId: 'alcohol', level: 'high', msg: 'Depresión respiratoria y sedación profunda. Evitar.' },
      { targetId: 'zopiclona', level: 'medium', msg: 'Sedación combinada. Usar solo si médico indica.' }
    ]
  },
  {
    id: 'alprazolam',
    name: 'Alprazolam',
    type: 'Benzodiacepina',
    cautionList: [
      { targetId: 'alcohol', level: 'high', msg: 'Mayor riesgo de sedación y caídas. Evitar.' },
      { targetId: 'opioides', level: 'high', msg: 'Riesgo de depresión respiratoria. Supervisión médica estricta.' }
    ]
  },
  {
    id: 'ibuprofeno',
    name: 'Ibuprofeno',
    type: 'AINE',
    cautionList: [
      { targetId: 'sertralina', level: 'low', msg: 'Puede aumentar riesgo de sangrado gástrico. Usar con precaución.' }
    ]
  },
  {
    id: 'omeprazol',
    name: 'Omeprazol',
    type: 'IBP',
    cautionList: []
  },
  {
    id: 'omega_3',
    name: 'Omega-3',
    type: 'Suplemento',
    cautionList: [
      { targetId: 'ibuprofeno', level: 'low', msg: 'Ligero aumento de riesgo de sangrado con AINEs.' }
    ]
  },
  {
    id: 'magnesio',
    name: 'Magnesio',
    type: 'Suplemento',
    cautionList: []
  },
  {
    id: 'creatina',
    name: 'Creatina',
    type: 'Suplemento',
    cautionList: [
      { targetId: 'diureticos', level: 'medium', msg: 'Asegurar hidratación adecuada.' }
    ]
  },
  {
    id: 'hierba_de_san_juan',
    name: 'Hierba de San Juan',
    type: 'Suplemento',
    cautionList: [
      { targetId: 'sertralina', level: 'high', msg: 'No combinar por riesgo serotoninérgico.' },
      { targetId: 'paroxetina', level: 'high', msg: 'Interacción significativa serotoninérgica.' },
      { targetId: 'venlafaxina', level: 'high', msg: 'Riesgo de aumento excesivo de serotonina.' }
    ]
  },
  {
    id: 'diureticos',
    name: 'Diuréticos',
    type: 'Clase',
    cautionList: [
      { targetId: 'creatina', level: 'medium', msg: 'Puede agravar deshidratación. Vigilar ingesta de agua.' }
    ]
  },
  {
    id: 'zopiclona',
    name: 'Zopiclona',
    type: 'Hipnótico',
    cautionList: [
      { targetId: 'mirtazapina', level: 'medium', msg: 'Sedación aditiva.' },
      { targetId: 'clonazepam', level: 'medium', msg: 'Sumatoria de efectos sedantes.' }
    ]
  },
  {
    id: 'alcohol',
    name: 'Alcohol',
    type: 'Sustancia',
    cautionList: [
      { targetId: 'mirtazapina', level: 'high', msg: 'Aumenta depresión del SNC. Evitar.' },
      { targetId: 'clonazepam', level: 'high', msg: 'Sedación y riesgo respiratorio.' },
      { targetId: 'alprazolam', level: 'high', msg: 'Sedación severa y alteraciones motoras.' }
    ]
  }
];
