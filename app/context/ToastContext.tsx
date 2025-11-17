import { createContext, useContext, useState } from "react";
import { Snackbar, Alert } from "@mui/material";

type ToastType = "success" | "error" | "warning" | "info";

interface ToastContextProps {
  showToast: (msg: string, type?: ToastType) => void;
}

const ToastContext = createContext<ToastContextProps>({
  showToast: () => {},
});

export const useToast = () => useContext(ToastContext);

export const ToastProvider = ({ children }: any) => {
  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [type, setType] = useState<ToastType>("info");

  const showToast = (msg: string, t: ToastType = "info") => {
    setMessage(msg);
    setType(t);
    setOpen(true);
  };

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}

      <Snackbar
        open={open}
        autoHideDuration={10000}
        onClose={() => setOpen(false)}
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
      >
        <Alert
          severity={type}
          variant="filled"
          onClose={() => setOpen(false)}   // ⭐ cierre manual
          sx={{ width: "100%" }}
        >
          {message}
        </Alert>
      </Snackbar>
    </ToastContext.Provider>
  );
};
