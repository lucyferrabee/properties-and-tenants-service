declare module 'csv-parser' {
    import { Transform } from 'stream';

    interface Options {
        separator?: string;
        headers?: boolean | string[];
    }

    function csv(options?: Options): Transform;

    export = csv;
}
