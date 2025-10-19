'use client';
import { CrudPage } from "../../components/CrudBase";
import { memoryDb, User, saveToLocalStorage } from "../../lib/memoryDb";

const delay = (ms: number) => new Promise(res => setTimeout(res, ms));

export default function UsersPage() {
  const fetchAll = async () => {
    await delay(100);
    return memoryDb.users;
  };

  const createItem = async (item: User) => {

    memoryDb.users.push({ ...item });
    saveToLocalStorage();
  };

  const updateItem = async (id: string, item: User) => {
    const idx = memoryDb.users.findIndex(u => u.id === id);
    if (idx >= 0) memoryDb.users[idx] = { ...item, id };
    saveToLocalStorage();
  };

  const deleteItem = async (id: string) => {
    memoryDb.users = memoryDb.users.filter(u => u.id !== id);
    saveToLocalStorage();
  };

  return (
    <CrudPage<User>
      fetchAll={fetchAll}
      createItem={createItem}
      updateItem={updateItem}
      deleteItem={deleteItem}
      idField="id"
      fields={[
        { name: "id", label: "ID"},
        { name: "name", label: "Nombre" },
        { name: "email", label: "Email" },
        { name: "isAdmin", label: "¿Es Administrador?", type: "boolean" },
      ]}
    />
  );
}
