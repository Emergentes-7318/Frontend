"use client";
import React, { useState, useEffect } from "react";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Button } from "primereact/button";
import { Dialog } from "primereact/dialog";
import { InputText } from "primereact/inputtext";
import { Dropdown } from "primereact/dropdown";
import { Toast } from "primereact/toast";
import { Tag } from "primereact/tag";
import { ConfirmDialog, confirmDialog } from "primereact/confirmdialog";
import { useAuth } from "@/app/context/AuthContext";
import { useRouter } from "next/navigation";
import "primereact/resources/themes/lara-light-cyan/theme.css";
import 'primeicons/primeicons.css';

interface User {
    id: string;
    username: string;
    email: string;
    role: string;
    created_at?: string;
}

export default function UsersPage() {
    const router = useRouter();
    const { user: currentUser } = useAuth();
    const toast = React.useRef<Toast>(null);

    const [users, setUsers] = useState<User[]>([]);
    const [loading, setLoading] = useState(true);
    const [createDialogVisible, setCreateDialogVisible] = useState(false);
    const [editDialogVisible, setEditDialogVisible] = useState(false);
    const [selectedUser, setSelectedUser] = useState<User | null>(null);

    // Form states
    const [formData, setFormData] = useState({
        username: '',
        email: '',
        password: '',
        role: 'empleado'
    });

    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';

    const roleOptions = [
        { label: 'Administrador', value: 'admin' },
        { label: 'Empleado', value: 'empleado' }
    ];

    // Check if current user is admin
    useEffect(() => {
        if (currentUser && currentUser.role !== 'admin') {
            toast.current?.show({
                severity: 'error',
                summary: 'Acceso Denegado',
                detail: 'Solo los administradores pueden acceder a esta página',
                life: 3000
            });
            router.push('/home/dashboard');
        }
    }, [currentUser, router]);

    // Fetch users
    const fetchUsers = async () => {
        setLoading(true);
        try {
            const token = localStorage.getItem('access_token');
            if (!token) {
                router.push('/auth/login');
                return;
            }

            const response = await fetch(`${apiUrl}/users`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (response.status === 401) {
                localStorage.removeItem('access_token');
                localStorage.removeItem('user');
                router.push('/auth/login');
                return;
            }

            if (!response.ok) {
                throw new Error('Error al cargar usuarios');
            }

            const data = await response.json();
            setUsers(data);
        } catch (error) {
            console.error('Error fetching users:', error);
            toast.current?.show({
                severity: 'error',
                summary: 'Error',
                detail: 'No se pudieron cargar los usuarios',
                life: 3000
            });
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (currentUser && currentUser.role === 'admin') {
            fetchUsers();
        }
    }, [currentUser]);

    // Create user
    const handleCreateUser = async () => {
        try {
            const token = localStorage.getItem('access_token');
            const response = await fetch(`${apiUrl}/users`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(formData)
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Error al crear usuario');
            }

            toast.current?.show({
                severity: 'success',
                summary: 'Éxito',
                detail: 'Usuario creado correctamente',
                life: 3000
            });

            setCreateDialogVisible(false);
            setFormData({ username: '', email: '', password: '', role: 'empleado' });
            fetchUsers();
        } catch (error) {
            console.error('Error creating user:', error);
            toast.current?.show({
                severity: 'error',
                summary: 'Error',
                detail: error instanceof Error ? error.message : 'Error al crear usuario',
                life: 3000
            });
        }
    };

    // Update user role
    const handleUpdateRole = async () => {
        if (!selectedUser) return;

        try {
            const token = localStorage.getItem('access_token');
            const response = await fetch(`${apiUrl}/users/${selectedUser.id}`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ role: formData.role })
            });

            if (!response.ok) {
                throw new Error('Error al actualizar rol');
            }

            toast.current?.show({
                severity: 'success',
                summary: 'Éxito',
                detail: 'Rol actualizado correctamente',
                life: 3000
            });

            setEditDialogVisible(false);
            setSelectedUser(null);
            fetchUsers();
        } catch (error) {
            console.error('Error updating role:', error);
            toast.current?.show({
                severity: 'error',
                summary: 'Error',
                detail: 'Error al actualizar el rol',
                life: 3000
            });
        }
    };

    // Delete user
    const handleDeleteUser = (user: User) => {
        confirmDialog({
            message: `¿Estás seguro de eliminar al usuario "${user.username}"?`,
            header: 'Confirmar eliminación',
            icon: 'pi pi-exclamation-triangle',
            acceptLabel: 'Sí, eliminar',
            rejectLabel: 'Cancelar',
            accept: async () => {
                try {
                    const token = localStorage.getItem('access_token');
                    const response = await fetch(`${apiUrl}/users/${user.id}`, {
                        method: 'DELETE',
                        headers: {
                            'Authorization': `Bearer ${token}`
                        }
                    });

                    if (!response.ok) {
                        throw new Error('Error al eliminar usuario');
                    }

                    toast.current?.show({
                        severity: 'success',
                        summary: 'Éxito',
                        detail: 'Usuario eliminado correctamente',
                        life: 3000
                    });

                    fetchUsers();
                } catch (error) {
                    console.error('Error deleting user:', error);
                    toast.current?.show({
                        severity: 'error',
                        summary: 'Error',
                        detail: 'Error al eliminar el usuario',
                        life: 3000
                    });
                }
            }
        });
    };

    const openEditDialog = (user: User) => {
        setSelectedUser(user);
        setFormData({ ...formData, role: user.role });
        setEditDialogVisible(true);
    };

    // Templates
    const roleBodyTemplate = (rowData: User) => {
        const severity = rowData.role === 'admin' ? 'danger' : 'info';
        const label = rowData.role === 'admin' ? 'Administrador' : 'Empleado';
        return <Tag value={label} severity={severity} />;
    };

    const actionsBodyTemplate = (rowData: User) => {
        const isCurrentUser = currentUser?.id === rowData.id;

        return (
            <div className="flex gap-2">
                <Button
                    icon="pi pi-pencil"
                    className="p-button-sm p-button-warning"
                    onClick={() => openEditDialog(rowData)}
                    tooltip="Editar rol"
                    disabled={isCurrentUser}
                />
                <Button
                    icon="pi pi-trash"
                    className="p-button-sm p-button-danger"
                    onClick={() => handleDeleteUser(rowData)}
                    tooltip="Eliminar usuario"
                    disabled={isCurrentUser}
                />
            </div>
        );
    };

    const dateBodyTemplate = (rowData: User) => {
        if (!rowData.created_at) return '-';
        return new Date(rowData.created_at).toLocaleDateString('es-ES', {
            day: '2-digit',
            month: 'short',
            year: 'numeric'
        });
    };

    if (!currentUser || currentUser.role !== 'admin') {
        return null;
    }

    return (
        <div className="p-6">
            <Toast ref={toast} />
            <ConfirmDialog />

            {/* Header */}
            <div className="mb-6 flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-blue-950 mb-2">Gestión de Usuarios</h1>
                    <p className="text-gray-600">Administra usuarios y roles del sistema</p>
                </div>
                <Button
                    label="Crear Usuario"
                    icon="pi pi-plus"
                    onClick={() => setCreateDialogVisible(true)}
                    className="bg-gradient-to-r from-blue-600 to-purple-600 border-0"
                />
            </div>

            {/* Users Table */}
            <div className="bg-white border border-gray-200 rounded-xl shadow-sm p-4">
                <DataTable
                    value={users}
                    loading={loading}
                    className="p-datatable-sm"
                    stripedRows
                    paginator
                    rows={10}
                    emptyMessage="No hay usuarios registrados"
                >
                    <Column field="username" header="Nombre de usuario" sortable />
                    <Column field="email" header="Correo electrónico" sortable />
                    <Column body={roleBodyTemplate} header="Rol" sortable field="role" />
                    <Column body={dateBodyTemplate} header="Fecha de registro" sortable field="created_at" />
                    <Column body={actionsBodyTemplate} header="Acciones" style={{ width: '150px' }} />
                </DataTable>
            </div>

            {/* Create User Dialog */}
            <Dialog
                header="Crear Nuevo Usuario"
                visible={createDialogVisible}
                style={{ width: '450px' }}
                onHide={() => {
                    setCreateDialogVisible(false);
                    setFormData({ username: '', email: '', password: '', role: 'empleado' });
                }}
            >
                <div className="flex flex-col gap-4">
                    <div>
                        <label htmlFor="username" className="block text-sm font-semibold text-gray-700 mb-2">
                            Nombre de usuario
                        </label>
                        <InputText
                            id="username"
                            value={formData.username}
                            onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                            className="w-full"
                            placeholder="Ingresa el nombre de usuario"
                        />
                    </div>

                    <div>
                        <label htmlFor="email" className="block text-sm font-semibold text-gray-700 mb-2">
                            Correo electrónico
                        </label>
                        <InputText
                            id="email"
                            type="email"
                            value={formData.email}
                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                            className="w-full"
                            placeholder="usuario@ejemplo.com"
                        />
                    </div>

                    <div>
                        <label htmlFor="password" className="block text-sm font-semibold text-gray-700 mb-2">
                            Contraseña
                        </label>
                        <InputText
                            id="password"
                            type="password"
                            value={formData.password}
                            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                            className="w-full"
                            placeholder="Contraseña segura"
                        />
                    </div>

                    <div>
                        <label htmlFor="role" className="block text-sm font-semibold text-gray-700 mb-2">
                            Rol
                        </label>
                        <Dropdown
                            id="role"
                            value={formData.role}
                            options={roleOptions}
                            onChange={(e) => setFormData({ ...formData, role: e.value })}
                            className="w-full"
                            placeholder="Selecciona un rol"
                        />
                    </div>

                    <div className="flex justify-end gap-2 mt-4">
                        <Button
                            label="Cancelar"
                            icon="pi pi-times"
                            onClick={() => {
                                setCreateDialogVisible(false);
                                setFormData({ username: '', email: '', password: '', role: 'empleado' });
                            }}
                            className="p-button-text"
                        />
                        <Button
                            label="Crear"
                            icon="pi pi-check"
                            onClick={handleCreateUser}
                            disabled={!formData.username || !formData.email || !formData.password}
                        />
                    </div>
                </div>
            </Dialog>

            {/* Edit Role Dialog */}
            <Dialog
                header="Editar Rol de Usuario"
                visible={editDialogVisible}
                style={{ width: '400px' }}
                onHide={() => {
                    setEditDialogVisible(false);
                    setSelectedUser(null);
                }}
            >
                <div className="flex flex-col gap-4">
                    <div>
                        <p className="text-sm text-gray-600 mb-2">
                            Usuario: <strong>{selectedUser?.username}</strong>
                        </p>
                        <p className="text-sm text-gray-600 mb-4">
                            Email: <strong>{selectedUser?.email}</strong>
                        </p>
                    </div>

                    <div>
                        <label htmlFor="edit-role" className="block text-sm font-semibold text-gray-700 mb-2">
                            Nuevo Rol
                        </label>
                        <Dropdown
                            id="edit-role"
                            value={formData.role}
                            options={roleOptions}
                            onChange={(e) => setFormData({ ...formData, role: e.value })}
                            className="w-full"
                        />
                    </div>

                    <div className="flex justify-end gap-2 mt-4">
                        <Button
                            label="Cancelar"
                            icon="pi pi-times"
                            onClick={() => {
                                setEditDialogVisible(false);
                                setSelectedUser(null);
                            }}
                            className="p-button-text"
                        />
                        <Button
                            label="Guardar"
                            icon="pi pi-check"
                            onClick={handleUpdateRole}
                        />
                    </div>
                </div>
            </Dialog>
        </div>
    );
}
