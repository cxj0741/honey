
export default function CongirmDialog({ title, open, setOpen, handleConfirm }: { title: string, open: boolean, setOpen: Function, handleConfirm: Function }) {
  return (
    <dialog open={open} className="modal bg-transparent">
      <div className="modal-box">
        <h3 className="font-bold text-lg">ATTENTION</h3>
        <p className="pt-2">{title}</p>
        <div className="modal-action">
          <button
            onClick={() => handleConfirm()}
            className="btn btn-outline btn-error btn-sm">Confirm</button>
          <button
            onClick={() => setOpen(false)}
            className="btn btn-outline btn-success btn-sm">Cancel</button>
        </div>
      </div>
    </dialog>
  )
}
