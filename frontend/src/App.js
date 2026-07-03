import React, { useState, useEffect } from 'react';
import './App.css';

const API_URL = 'http://localhost:8080/api/usuarios.php';

function App() {
  const [usuarios, setUsuarios] = useState([]);
  const [form, setForm] = useState({
    id: null,
    nombre: '',
    apePaterno: '',
    apeMaterno: '',
    user: '',
    password: '',
    estado: 1
  });
  const [editando, setEditando] = useState(false);

  // Cargar usuarios al iniciar
  useEffect(() => {
    fetchUsuarios();
  }, []);

  const fetchUsuarios = async () => {
    try {
      const res = await fetch(API_URL);
      const data = await res.json();
      setUsuarios(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Error al obtener usuarios:', error);
    }
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const method = editando ? 'PUT' : 'POST';
    const url = editando ? `${API_URL}?id=${form.id}` : API_URL;

    try {
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      alert(data.mensaje || data.error || 'Operación completada');
      setForm({
        id: null,
        nombre: '',
        apePaterno: '',
        apeMaterno: '',
        user: '',
        password: '',
        estado: 1
      });
      setEditando(false);
      fetchUsuarios();
    } catch (error) {
      alert('Error de conexión con el servidor');
      console.error(error);
    }
  };

  const handleEdit = (usuario) => {
    setForm({ ...usuario, password: '' });
    setEditando(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('¿Desactivar este usuario?')) return;
    try {
      const res = await fetch(`${API_URL}?id=${id}`, { method: 'DELETE' });
      const data = await res.json();
      alert(data.mensaje || data.error || 'Usuario desactivado');
      fetchUsuarios();
    } catch (error) {
      alert('Error al desactivar el usuario');
      console.error(error);
    }
  };

  return (
    <div className="container">
      <h1>Gestión de Usuarios</h1>

      <form onSubmit={handleSubmit}>
        <h3>{editando ? 'Editar Usuario' : 'Nuevo Usuario'}</h3>
        <input
          type="text"
          name="nombre"
          placeholder="Nombre"
          value={form.nombre}
          onChange={handleChange}
          required
        />
        <input
          type="text"
          name="apePaterno"
          placeholder="Apellido Paterno"
          value={form.apePaterno}
          onChange={handleChange}
          required
        />
        <input
          type="text"
          name="apeMaterno"
          placeholder="Apellido Materno"
          value={form.apeMaterno}
          onChange={handleChange}
          required
        />
        <input
          type="text"
          name="user"
          placeholder="Usuario"
          value={form.user}
          onChange={handleChange}
          required
        />
        <input
          type="password"
          name="password"
          placeholder="Contraseña"
          value={form.password}
          onChange={handleChange}
          required={!editando}
        />
        <select name="estado" value={form.estado} onChange={handleChange}>
          <option value="1">Activo</option>
          <option value="0">Inactivo</option>
        </select>
        <button type="submit">{editando ? 'Actualizar' : 'Crear'}</button>
        {editando && (
          <button
            type="button"
            onClick={() => {
              setEditando(false);
              setForm({
                id: null,
                nombre: '',
                apePaterno: '',
                apeMaterno: '',
                user: '',
                password: '',
                estado: 1
              });
            }}
          >
            Cancelar
          </button>
        )}
      </form>

      <table border="1" cellPadding="5">
        <thead>
          <tr>
            <th>ID</th>
            <th>Nombre</th>
            <th>Apellido Paterno</th>
            <th>Apellido Materno</th>
            <th>Usuario</th>
            <th>Estado</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {usuarios.length === 0 ? (
            <tr>
              <td colSpan="7" style={{ textAlign: 'center' }}>
                No hay usuarios registrados
              </td>
            </tr>
          ) : (
            usuarios.map((u) => (
              <tr key={u.id}>
                <td>{u.id}</td>
                <td>{u.nombre}</td>
                <td>{u.apePaterno}</td>
                <td>{u.apeMaterno}</td>
                <td>{u.user}</td>
                <td>{u.estado === 1 ? 'Activo' : 'Inactivo'}</td>
                <td>
                  <button onClick={() => handleEdit(u)}>Editar</button>
                  <button onClick={() => handleDelete(u.id)}>Desactivar</button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}

export default App;