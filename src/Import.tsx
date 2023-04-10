export default function Import(
  { display } : {
    display: boolean
  }
) {
  return (
    <div className={display?'contents-visible':'contents-hidden'}>
      <input type="file" />
    </div>
  )
}