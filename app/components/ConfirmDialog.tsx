"use client";
import React from "react";
import { Dialog, DialogTitle, DialogActions, Button } from "@mui/material";

export default function ConfirmDialog({ open, onClose, onConfirm, title = "Confirmar" }: any) {
  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>{title}</DialogTitle>
      <DialogActions>
        <Button onClick={onClose}>Cancelar</Button>
        <Button color="error" variant="contained" onClick={onConfirm}>Eliminar</Button>
      </DialogActions>
    </Dialog>
  );
}
