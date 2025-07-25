import Swal from "sweetalert2";

export function SuccessAlert(message = "Success", title = "Success!") {
  Swal.fire({
    icon: "success",
    title,
    html: message,
    showConfirmButton: false,
    timer: 1500,
  });
}

export function ErrorAlert(
  errorMessage = "Something went wrong",
  title = "Error!"
) {
  Swal.fire({
    icon: "error",
    title,
    html: errorMessage,
    confirmButtonColor: "#d33",
  });
}
