import Swal from "sweetalert2";

export function SuccessAlert(message = "Operation completed successfully.") {
  const Toast = Swal.mixin({
    toast: true,
    position: "bottom-end",
    showConfirmButton: false,
    timer: 3000,
    timerProgressBar: true,
    didOpen: (toast) => {
      toast.onmouseenter = Swal.stopTimer;
      toast.onmouseleave = Swal.resumeTimer;
    },
  });
  Toast.fire({
    icon: "success",
    text: message,
  });
}

export function ErrorAlert(
  errorMessage = "An unexpected error occurred. Please try again later.",
  title = "Error"
) {
  Swal.fire({
    icon: "error",
    title,
    html: errorMessage,
    confirmButtonText: "OK",
    confirmButtonColor: "#d32f2f",
    background: "#f4f6f8",
    color: "#212121",
    customClass: {
      popup: "swal2-professional-popup",
      title: "swal2-professional-title",
      htmlContainer: "swal2-professional-html",
      confirmButton: "swal2-professional-confirm",
    },
    buttonsStyling: true,
  });
}
