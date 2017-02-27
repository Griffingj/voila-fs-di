import * as Path             from 'path';
import * as Glob             from 'glob';
import asyncAll              from './asyncAll';
import flatten               from './flatten';
import { StrictGraph }       from 'voila-di';
import { LooseGraph }        from 'voila-di';
import { ensureStrictGraph } from 'voila-di';

export type Options = {
  globs: string[];
  deriveKey: (func: Function) => string;
}

export default function fsGraphFactory({ globs, deriveKey }: Options): Promise<StrictGraph> {
  const tasks = globs.map(glob => {
    return (callback) => Glob(glob, { absolute: true } as any, callback);
  });

  return asyncAll(tasks).then((results: any[]) => {
    // Dedupe
    const paths = Array.from(new Set(flatten(results)));
    const looseGraph: LooseGraph = {};

    for (const path of paths) {
      const module = require(Path.resolve(__dirname, path));
      const primaryExport = module.default || module;

      if (primaryExport instanceof Function) {
        const key = deriveKey(primaryExport);
        looseGraph[key] = primaryExport;
      }
    }
    return ensureStrictGraph(looseGraph);
  });
}
