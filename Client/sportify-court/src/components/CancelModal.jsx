import { Dialog } from "@headlessui/react";

export default function CancelModal({ isOpen, onClose, onConfirm }) {
  return (
    <Dialog
      open={isOpen}
      onClose={onClose}
      className="fixed inset-0 z-50 flex items-center justify-center"
    >
      <div
        className="fixed inset-0 bg-black/40 backdrop-blur-sm transition-opacity"
        aria-hidden="true"
      />

      <div className="relative z-10 flex items-center justify-center w-full h-full">
        <Dialog.Panel className="w-full max-w-md bg-white rounded-xl shadow-xl p-8 border border-gray-100">
          <Dialog.Title className="text-xl font-semibold mb-3 text-red-700">
            Batalkan Booking
          </Dialog.Title>
          <Dialog.Description className="mb-6 text-base text-gray-700">
            Apakah kamu yakin ingin membatalkan booking ini? Tindakan ini tidak
            dapat dibatalkan.
          </Dialog.Description>

          <div className="flex justify-end gap-3">
            <button
              onClick={onClose}
              className="px-5 py-2 rounded-lg bg-gray-100 text-gray-700 hover:bg-gray-200 transition font-medium"
            >
              Batal
            </button>
            <button
              onClick={onConfirm}
              className="px-5 py-2 rounded-lg bg-red-600 text-white hover:bg-red-700 transition font-medium shadow-sm"
            >
              Ya, Batalkan
            </button>
          </div>
        </Dialog.Panel>
      </div>
    </Dialog>
  );
}
