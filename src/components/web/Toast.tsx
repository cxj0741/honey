export const TOAST_TYPE = {
  INFO: 'alert-info',
  SUCCESS: 'alert-success',
  WARNING: 'alert-warning',
  ERROR: 'alert-error'
}

interface Props {
  type: typeof TOAST_TYPE.INFO | typeof TOAST_TYPE.SUCCESS | typeof TOAST_TYPE.WARNING | typeof TOAST_TYPE.ERROR
  message: string
}
export default function Toast({ type, message }: Props) {
  return (
    <div className="z-50 toast toast-center toast-top">
      <div className={`alert ${type}`}>
        <span className='text-white font-semibold'>{message}</span>
      </div>
    </div>
  )
}