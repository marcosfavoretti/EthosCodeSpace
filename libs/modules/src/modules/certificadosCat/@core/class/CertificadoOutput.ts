export interface Measurement {
    value: number;
    limit: number;
    unit: string;
    reference: number | undefined;
}

export interface TestStep {
    description: string;
    status: string;
    timestamp: string;
    measurements: Measurement | undefined;
}

export interface TestGroupStats {
    total_steps: number;
    duration: string;
}

export interface TestGroup {
    name: string;
    timestamp: string;
    status_summary: string;
    stats: TestGroupStats;
    steps: TestStep[];
}

export interface LogMetadata {
    /**
     * @description operador que fez o teste eletrico
     */
    operator: string | undefined;
    /**
     * @description serialnumber da cabine
     */
    serianumber: string | undefined;
    /**
     * @description maquina do teste eletrico
     */
    test_stand: string | undefined;
    /**
     * @description hora que deu inicio o teste da cabine
     */
    start_timestamp: string | undefined;
    /**
     * @description modelo do rops da cabine
     */
    rops: string | undefined;
    /**
     * @description hora que foi processado o certificado
     */
    processed_at: string;
}

export interface CertificadosOutput {
    metadata: LogMetadata;
    test_groups: TestGroup[];
}