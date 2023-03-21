export declare const asyncTimeout: (ms: number) => Promise<unknown>;
export declare const timeIn: {
    seconds: (secs: number) => number;
    minutes: (mins: number) => number;
    hours: (hrs: number) => number;
    days: (ds: number) => number;
};
export declare const copy: (toCopy: any) => any;
