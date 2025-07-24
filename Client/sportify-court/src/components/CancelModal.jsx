import { Dialog } from "@headlessui/react";

export default function CancelModal({ isOpen, onClose, onConfirm }) {
  return (
    <Dialog open={isOpen} onClose={onClose} className="relative z-50">
      <div className="fixed inset-0 bg-black/30" aria-hidden="true" />

      <div className="fixed inset-0 flex items-center justify-center p-4">
        <Dialog.Panel className="w-full max-w-sm bg-white rounded shadow p-6">
          <Dialog.Title className="text-lg font-bold mb-4 text-red-600">
            Batalkan Booking
          </Dialog.Title>
          <Dialog.Description className="mb-4 text-sm text-gray-600">
            Apakah kamu yakin ingin membatalkan booking ini? Tindakan ini tidak
            dapat dibatalkan.
          </Dialog.Description>

          <div className="flex justify-end space-x-2">
            <button
              onClick={onClose}
              className="px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded"
            >
              Batal
            </button>
            <button
              onClick={onConfirm}
              className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded"
            >
              Ya, Batalkan
            </button>
          </div>
        </Dialog.Panel>
      </div>
    </Dialog>
  );
}
