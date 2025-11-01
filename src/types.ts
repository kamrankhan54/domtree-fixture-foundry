export type ParsedData = {
    // uniform output into your pipeline
    data: Record<string, any>[];
    meta?: Record<string, any>;
  };
  
  export interface Adapter {
    canRead: (filePath: string) => boolean;
    read: (filePath: string, opts?: Record<string, any>) => Promise<ParsedData>;
  }
  