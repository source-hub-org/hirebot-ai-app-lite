import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'

export default function AddQuestionModal({
  open,
  onClose,
}: {
  open: boolean
  onClose: () => void
}) {
  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add Question</DialogTitle>
        </DialogHeader>

        {/* Modal form content */}
        <div className="space-y-4">{/* TODO: Filter topic, language, position, page_size */}</div>

        <button className="mt-4 bg-blue-600 text-white px-4 py-2 rounded">Add Question</button>
      </DialogContent>
    </Dialog>
  )
}
