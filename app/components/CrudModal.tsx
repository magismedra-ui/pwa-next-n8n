"use client";
import React, { useEffect, useState } from "react";
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, Grid, TextField } from "@mui/material";

export default function CrudModal({ open, onClose, onSave, initial = {}, fields = [] }: any) {
  const [form, setForm] = useState<any>({});


  useEffect(() => setForm(initial || {}), [initial]);

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>{initial?.id ? "Editar" : "Crear"}</DialogTitle>
      <DialogContent>
        <Grid container spacing={2} sx={{ mt: 0.5 }}>
          {fields.map((f: string) => (
            <Grid item xs={12} sm={6} key={f}>
              <TextField
                fullWidth
                label={f}
                value={form[f] ?? ""}
                onChange={(e) => setForm({ ...form, [f]: e.target.value })}
              />
            </Grid>
          ))}
        </Grid>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancelar</Button>
        <Button variant="contained" onClick={() => onSave(form)}>Guardar</Button>
      </DialogActions>
    </Dialog>
  );
}
