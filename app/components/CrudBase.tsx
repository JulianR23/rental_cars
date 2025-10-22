"use client";
import React, { useState, useEffect } from "react";
import {
  Button,
  TextField,
  IconButton,
  Switch,
  Chip,
  Alert,
  Snackbar,
  MenuItem,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";

interface Field<T> {
  name: keyof T;
  label: string;
  type?: string;
  options?: string[] | { value: string; label: string }[];
  readOnly?: boolean;
  multiple?: boolean;
  min?: string;
  max?: string;
  onChange?: (value: string) => void;
}

interface CrudPageProps<T> {
  fetchAll: () => Promise<T[]>;
  createItem: (item: T) => Promise<void>;
  updateItem: (id: string, item: T) => Promise<void>;
  deleteItem: (id: string) => Promise<void>;
  idField: keyof T;
  fields: Field<T>[];
}

type AlertSeverity = "success" | "error" | "warning" | "info";

export function CrudPage<T extends { [key: string]: any }>({
  fetchAll,
  createItem,
  updateItem,
  deleteItem,
  idField,
  fields,
}: CrudPageProps<T>) {
  const [items, setItems] = useState<T[]>([]);
  const [form, setForm] = useState<T>({} as T);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [alert, setAlert] = useState<{
    open: boolean;
    message: string;
    severity: AlertSeverity;
  }>({
    open: false,
    message: "",
    severity: "success",
  });

  useEffect(() => {
    loadItems();
  }, []);

  const showAlert = (message: string, severity: AlertSeverity = "success") => {
    setAlert({ open: true, message, severity });
  };

  const handleCloseAlert = () => {
    setAlert({ ...alert, open: false });
  };

  const loadItems = async () => {
    try {
      const data = await fetchAll();
      setItems(data);
    } catch (error) {
      showAlert("Error al cargar los datos", "error");
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: e.target.type === "number" ? Number(value) : value,
    }));
  };

  const handleFileChange = async (
    e: React.ChangeEvent<HTMLInputElement>,
    fieldName: keyof T
  ) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    try {
      const uploadedUrls: string[] = [];

      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        const formData = new FormData();
        formData.append("file", file);

        const response = await fetch("/api/upload", {
          method: "POST",
          body: formData,
        });

        if (!response.ok) {
          throw new Error("Error al subir la imagen");
        }

        const data = await response.json();
        uploadedUrls.push(data.url);
      }

      setForm((prev) => ({
        ...prev,
        [fieldName]: uploadedUrls,
      }));

      showAlert(
        `${uploadedUrls.length} imagen(es) subida(s) exitosamente`,
        "success"
      );
    } catch (error) {
      showAlert("Error al subir las imágenes", "error");
    }
  };

  const handleSubmit = async () => {
    try {
      if (editingId) {
        await updateItem(editingId, form);
        showAlert("¡Registro actualizado exitosamente!", "success");
        setEditingId(null);
      } else {
        await createItem(form);
        showAlert("¡Registro creado exitosamente!", "success");
      }
      setForm({} as T);
      await loadItems();
    } catch (error) {
      showAlert(
        error instanceof Error ? error.message : "Error al guardar el registro",
        "error"
      );
    }
  };

  const handleEdit = (item: T) => {
    setForm(item);
    setEditingId(item[idField] || null);
  };

  const handleDelete = async (id?: string) => {
    if (!id) return;
    if (!confirm("¿Estás seguro de eliminar este registro?")) return;

    try {
      await deleteItem(id);
      showAlert("¡Registro eliminado exitosamente!", "success");
      await loadItems();
    } catch (error) {
      showAlert("Error al eliminar el registro", "error");
    }
  };

  const handleCancel = () => {
    setForm({} as T);
    setEditingId(null);
  };

  return (
    <div style={{ padding: "20px" }}>
      <Snackbar
        open={alert.open}
        autoHideDuration={5000}
        onClose={handleCloseAlert}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <Alert
          onClose={handleCloseAlert}
          severity={alert.severity}
          sx={{ width: "100%" }}
          variant="filled"
        >
          {alert.message}
        </Alert>
      </Snackbar>

      <div
        style={{
          marginBottom: "20px",
          display: "flex",
          gap: "10px",
          flexWrap: "wrap",
          alignItems: "center",
        }}
      >
        {fields.map((f) => {
          if (f.type === "file") {
            return (
              <div
                key={String(f.name)}
                style={{ display: "flex", flexDirection: "column", gap: "4px" }}
              >
                <Button
                  component="label"
                  variant="outlined"
                  startIcon={<CloudUploadIcon />}
                  disabled={f.readOnly}
                >
                  {f.label}
                  <input
                    type="file"
                    hidden
                    multiple={f.multiple}
                    accept="image/*"
                    onChange={(e) => handleFileChange(e, f.name)}
                  />
                </Button>
                {form[f.name] &&
                  Array.isArray(form[f.name]) &&
                  (form[f.name] as string[]).length > 0 && (
                    <span style={{ fontSize: "12px", color: "#666" }}>
                      {(form[f.name] as string[]).length} imagen(es)
                      seleccionada(s)
                    </span>
                  )}
              </div>
            );
          }

          if (f.type === "boolean") {
            return (
              <div
                key={String(f.name)}
                style={{ display: "flex", alignItems: "center", gap: "8px" }}
              >
                <label>{f.label}</label>
                <Switch
                  checked={!!form[f.name]}
                  onChange={(e) =>
                    setForm({ ...form, [f.name]: e.target.checked })
                  }
                  disabled={f.readOnly}
                />
              </div>
            );
          }

          if (f.type === "select" && f.options) {
            return (
              <TextField
                key={String(f.name)}
                select
                label={f.label}
                name={String(f.name)}
                value={form[f.name] || ""}
                onChange={(e) => setForm({ ...form, [f.name]: e.target.value })}
                style={{ minWidth: "150px" }}
                disabled={f.readOnly}
              >
                <MenuItem value="">
                  <em>Selecciona una opción</em>
                </MenuItem>
                {f.options.map((opt, i) => {
                  const value = typeof opt === "string" ? opt : opt.value;
                  const label = typeof opt === "string" ? opt : opt.label;
                  return (
                    <MenuItem key={i} value={value}>
                      {label}
                    </MenuItem>
                  );
                })}
              </TextField>
            );
          }

          if (
            f.type === "text" ||
            f.type === "number" ||
            f.type === "date" ||
            !f.type
          ) {
            if (f.readOnly) return null;

            return (
              <TextField
                key={String(f.name)}
                label={f.label}
                name={String(f.name)}
                type={f.type || "text"}
                value={form[f.name] || ""}
                onChange={(e) => {
                  handleChange(e);
                  if (f.onChange) f.onChange(e.target.value);
                }}
                style={{ minWidth: "150px" }}
                inputProps={{
                  min: f.min,
                  max: f.max,
                }}
                slotProps={{
                  inputLabel: { shrink: true },
                }}
              />
            );
          }

          return null;
        })}

        <Button variant="contained" onClick={handleSubmit}>
          {editingId ? "Actualizar" : "Agregar"}
        </Button>

        {editingId && (
          <Button variant="outlined" onClick={handleCancel}>
            Cancelar
          </Button>
        )}
      </div>

      <table
        style={{
          borderCollapse: "collapse",
          width: "100%",
          fontFamily: "Arial, sans-serif",
        }}
      >
        <thead>
          <tr>
            {fields.map((f) => (
              <th key={String(f.name)} style={thStyle}>
                {f.label}
              </th>
            ))}
            <th style={thStyle}>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {items.map((item) => (
            <tr key={item[idField]}>
              {fields.map((f) => (
                <td key={String(f.name)} style={tdStyle}>
                  {f.type === "boolean" ? (
                    <Chip
                      label={item[f.name] ? "Activo" : "Inactivo"}
                      color={item[f.name] ? "success" : "default"}
                    />
                  ) : f.type === "file" && Array.isArray(item[f.name]) ? (
                    <span>{(item[f.name] as string[]).length} imagen(es)</span>
                  ) : (
                    item[f.name]
                  )}
                </td>
              ))}
              <td style={tdStyle}>
                <IconButton onClick={() => handleEdit(item)} color="primary">
                  <EditIcon />
                </IconButton>
                <IconButton
                  onClick={() => handleDelete(item[idField])}
                  color="error"
                >
                  <DeleteIcon />
                </IconButton>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

const thStyle = {
  border: "1px solid #B9B9B9",
  padding: "8px",
  textAlign: "center" as const,
  color: "#74747B",
};
const tdStyle = {
  border: "1px solid #B9B9B9",
  padding: "8px",
  textAlign: "center" as const,
  color: "#323232",
};
