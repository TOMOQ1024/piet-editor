export default function DebugButton(
  props: {
    name: string,
    func: Function,
  }
) {
  return (
    <div
      className='debug-button'
      onClick={() => props.func()}
    >
      {props.name}
    </div>
  );
}