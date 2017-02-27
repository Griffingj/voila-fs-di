import { script }     from 'lab';
import { expect }     from 'chai';
import fsGraphFactory from '../src/lib/fsGraphFactory';

export const lab = script();
const { describe, it } = lab;

export function isStrict(declaration) {
  const { dependencies, provider } = declaration;
  return (!dependencies || dependencies instanceof Array) &&
    provider instanceof Function;
}

describe('fsGraphFactory', () => {
  it('builds a strict graph from the files described in the globs', done => {
    fsGraphFactory({
      globs: [
        'test/fsGraphFixture/**/*{Task,Factory}.ts'
      ],
      deriveKey: func => func.name.replace(/Fixture((Task)|(Factory))$/, '')
    })
    .then(graph => {
      const keys = Object.keys(graph);
      let allStrict = true;

      for (const key of keys) {
        if (!isStrict(graph[key])) {
          allStrict = false;
          break;
        }
      }
      expect(keys.sort()).to.eql(['a', 'b']);
      expect(allStrict).to.be.ok;
      done();
    });
  });
});
