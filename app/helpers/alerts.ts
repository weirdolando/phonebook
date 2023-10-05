import Swal from "sweetalert2";
import { COLORS } from "../constants";

function successAlertWithMessage(message = "") {
  Swal.fire({
    icon: "success",
    title: "Success",
    text: message,
    showConfirmButton: false,
    timer: 1500,
  });
}

function errorAlert() {
  Swal.fire({
    icon: "error",
    title: "Oops...",
    text: "Something went wrong!",
    confirmButtonColor: "#06b6d4",
  });
}

function errorAlertWithMessage(message = "") {
  Swal.fire({
    icon: "error",
    title: "Error",
    text: message,
    showConfirmButton: false,
    timer: 1500,
  });
}

async function confirmationAlert(cb = () => {}) {
  const result = await Swal.fire({
    title: "Are you sure?",
    text: "You won't be able to revert this!",
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: COLORS.green[600],
    cancelButtonColor: COLORS.red[600],
    confirmButtonText: "Yes",
  });
  if (result.isConfirmed) {
    cb();
  }
}

async function confirmationAlertWithArgument<TArg>(
  cb: (arg: TArg) => void,
  arg: TArg
) {
  const result = await Swal.fire({
    title: "Are you sure?",
    text: "You won't be able to revert this!",
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: COLORS.green[500],
    cancelButtonColor: COLORS.red[600],
    confirmButtonText: "Yes",
  });
  if (result.isConfirmed) {
    cb(arg);
  }
}

export {
  successAlertWithMessage,
  errorAlert,
  errorAlertWithMessage,
  confirmationAlert,
  confirmationAlertWithArgument,
};
