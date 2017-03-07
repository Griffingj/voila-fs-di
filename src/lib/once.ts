export default function once(task: Function) {
  let action = task;

  return function (...args) {
    action.apply(this, args);
    action = () => undefined;
  };
}
