import { spy }    from 'sinon';
import { script } from 'lab';
import { expect } from 'chai';
import once       from '../src/lib/once';

export const lab = script();
const { describe, it } = lab;

describe('once', () => {
  it('only calls the passed function once', done => {
    const func = spy();
    const proxy = once(func);
    let i = 100;

    while (i--) {
      proxy();
    }
    expect(func.calledOnce).to.be.ok;
    done();
  });
});
