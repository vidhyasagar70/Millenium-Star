"use client";

import React, { useState, useEffect } from "react";
import { SuperAdminGuard } from "@/components/auth/routeGuard";
import Container from "@/components/ui/container";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Trash2, Plus, UserPlus, Loader2, AlertCircle } from "lucide-react";
import { toast } from "sonner";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList,
    BreadcrumbPage,
    BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";

interface Admin {
    _id: string;
    username: string;
    email: string;
    role: string;
    createdAt: string;
}

interface CreateAdminForm {
    username: string;
    email: string;
    password: string;
}

export default function CreateAdminPage() {
    const [admins, setAdmins] = useState<Admin[]>([]);
    const [loading, setLoading] = useState(true);
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [isCreating, setIsCreating] = useState(false);
    const [deleteAdminId, setDeleteAdminId] = useState<string | null>(null);
    const [formData, setFormData] = useState<CreateAdminForm>({
        username: "",
        email: "",
        password: "",
    });
    const [formErrors, setFormErrors] = useState<Partial<CreateAdminForm>>({});

    useEffect(() => {
        fetchAdmins();
    }, []);

    const fetchAdmins = async () => {
        try {
            setLoading(true);
            const response = await fetch(
                `https://millennium-star-inventory-service-dev.caratlogic.com/api/users/admin/list`,
                {
                    credentials: "include",
                }
            );

            if (!response.ok) {
                throw new Error("Failed to fetch admin list");
            }

            const data = await response.json();
            setAdmins(data.data || []);
        } catch (error: any) {
            console.error("Error fetching admins:", error);
            toast.error(error.message || "Failed to load admin list");
        } finally {
            setLoading(false);
        }
    };

    const validateForm = (): boolean => {
        const errors: Partial<CreateAdminForm> = {};

        if (!formData.username.trim()) {
            errors.username = "Username is required";
        } else if (formData.username.length < 3) {
            errors.username = "Username must be at least 3 characters";
        }

        if (!formData.email.trim()) {
            errors.email = "Email is required";
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
            errors.email = "Invalid email format";
        }

        if (!formData.password) {
            errors.password = "Password is required";
        } else if (formData.password.length < 8) {
            errors.password = "Password must be at least 8 characters";
        }

        setFormErrors(errors);
        return Object.keys(errors).length === 0;
    };

    const handleCreateAdmin = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!validateForm()) {
            return;
        }

        try {
            setIsCreating(true);
            const response = await fetch(
                `https://millennium-star-inventory-service-dev.caratlogic.com/api/users/admin/create`,
                {
                    method: "POST",
                    credentials: "include",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify(formData),
                }
            );

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || "Failed to create admin");
            }

            toast.success("Admin created successfully");
            setIsDialogOpen(false);
            setFormData({ username: "", email: "", password: "" });
            setFormErrors({});
            fetchAdmins();
        } catch (error: any) {
            console.error("Error creating admin:", error);
            toast.error(error.message || "Failed to create admin");
        } finally {
            setIsCreating(false);
        }
    };

    const handleDeleteAdmin = async (adminId: string) => {
        try {
            const response = await fetch(
                `https://millennium-star-inventory-service-dev.caratlogic.com/api/users/admin/${adminId}`,
                {
                    method: "DELETE",
                    credentials: "include",
                }
            );

            if (!response.ok) {
                throw new Error("Failed to delete admin");
            }

            toast.success("Admin deleted successfully");
            setDeleteAdminId(null);
            fetchAdmins();
        } catch (error: any) {
            console.error("Error deleting admin:", error);
            toast.error(error.message || "Failed to delete admin");
        }
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
        // Clear error when user starts typing
        if (formErrors[name as keyof CreateAdminForm]) {
            setFormErrors((prev) => ({ ...prev, [name]: undefined }));
        }
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString("en-US", {
            year: "numeric",
            month: "short",
            day: "numeric",
            hour: "2-digit",
            minute: "2-digit",
        });
    };

    return (
        <SuperAdminGuard>
        <div className="min-h-screen bg-gray-50 py-8">
            <Container className="max-w-[1400px]">
                {/* Header */}
                <div className="mb-6">
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">
                        Admin Management
                    </h1>
                    <Breadcrumb>
                        <BreadcrumbList>
                            <BreadcrumbItem>
                                <BreadcrumbLink href="/">HOME</BreadcrumbLink>
                            </BreadcrumbItem>
                            <BreadcrumbSeparator>{"/"}</BreadcrumbSeparator>
                            <BreadcrumbItem>
                                <BreadcrumbLink href="/admin">Admin Panel</BreadcrumbLink>
                            </BreadcrumbItem>
                            <BreadcrumbSeparator>{"/"}</BreadcrumbSeparator>
                            <BreadcrumbItem>
                                <BreadcrumbPage>Create Admin</BreadcrumbPage>
                            </BreadcrumbItem>
                        </BreadcrumbList>
                    </Breadcrumb>
                </div>

                {/* Admin List Card */}
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between">
                        <CardTitle className="text-xl flex items-center gap-2">
                            <UserPlus className="h-5 w-5" />
                            Admin List
                        </CardTitle>
                        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                            <DialogTrigger asChild>
                                <Button className="bg-black hover:bg-gray-800">
                                    <Plus className="h-4 w-4 mr-2" />
                                    Add Admin
                                </Button>
                            </DialogTrigger>
                            <DialogContent className="sm:max-w-[500px]">
                                <DialogHeader>
                                    <DialogTitle>Create New Admin</DialogTitle>
                                    <DialogDescription>
                                        Add a new admin user to the system. All fields are required.
                                    </DialogDescription>
                                </DialogHeader>
                                <form onSubmit={handleCreateAdmin} className="space-y-4 pt-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="username">
                                            Username <span className="text-red-500">*</span>
                                        </Label>
                                        <Input
                                            id="username"
                                            name="username"
                                            type="text"
                                            placeholder="Enter username"
                                            value={formData.username}
                                            onChange={handleInputChange}
                                            className={formErrors.username ? "border-red-500" : ""}
                                        />
                                        {formErrors.username && (
                                            <p className="text-sm text-red-500 flex items-center gap-1">
                                                <AlertCircle className="h-3 w-3" />
                                                {formErrors.username}
                                            </p>
                                        )}
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="email">
                                            Email <span className="text-red-500">*</span>
                                        </Label>
                                        <Input
                                            id="email"
                                            name="email"
                                            type="email"
                                            placeholder="Enter email address"
                                            value={formData.email}
                                            onChange={handleInputChange}
                                            className={formErrors.email ? "border-red-500" : ""}
                                        />
                                        {formErrors.email && (
                                            <p className="text-sm text-red-500 flex items-center gap-1">
                                                <AlertCircle className="h-3 w-3" />
                                                {formErrors.email}
                                            </p>
                                        )}
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="password">
                                            Password <span className="text-red-500">*</span>
                                        </Label>
                                        <Input
                                            id="password"
                                            name="password"
                                            type="password"
                                            placeholder="Enter password (min 8 characters)"
                                            value={formData.password}
                                            onChange={handleInputChange}
                                            className={formErrors.password ? "border-red-500" : ""}
                                        />
                                        {formErrors.password && (
                                            <p className="text-sm text-red-500 flex items-center gap-1">
                                                <AlertCircle className="h-3 w-3" />
                                                {formErrors.password}
                                            </p>
                                        )}
                                    </div>

                                    <div className="flex justify-end gap-3 pt-4">
                                        <Button
                                            type="button"
                                            variant="outline"
                                            onClick={() => {
                                                setIsDialogOpen(false);
                                                setFormData({ username: "", email: "", password: "" });
                                                setFormErrors({});
                                            }}
                                            disabled={isCreating}
                                        >
                                            Cancel
                                        </Button>
                                        <Button
                                            type="submit"
                                            disabled={isCreating}
                                            className="bg-black hover:bg-gray-800"
                                        >
                                            {isCreating ? (
                                                <>
                                                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                                                    Creating...
                                                </>
                                            ) : (
                                                <>
                                                    <Plus className="h-4 w-4 mr-2" />
                                                    Create Admin
                                                </>
                                            )}
                                        </Button>
                                    </div>
                                </form>
                            </DialogContent>
                        </Dialog>
                    </CardHeader>
                    <CardContent>
                        {loading ? (
                            <div className="flex items-center justify-center py-12">
                                <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
                            </div>
                        ) : admins.length === 0 ? (
                            <div className="text-center py-12">
                                <UserPlus className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                                    No admins found
                                </h3>
                                <p className="text-gray-600">
                                    Click "Add Admin" to create your first admin user
                                </p>
                            </div>
                        ) : (
                            <div className="overflow-x-auto">
                                <Table>
                                    <TableHeader>
                                        <TableRow className="bg-gray-100">
                                            <TableHead className="text-xs font-semibold text-center min-w-[80px]">Sr. No.</TableHead>
                                            <TableHead className="text-xs font-semibold text-center min-w-[140px]">Username</TableHead>
                                            <TableHead className="text-xs font-semibold text-center min-w-[200px]">Email</TableHead>
                                            <TableHead className="text-xs font-semibold text-center min-w-[100px]">Role</TableHead>
                                            <TableHead className="text-xs font-semibold text-center min-w-[180px]">Created At</TableHead>
                                            <TableHead className="text-xs font-semibold text-center min-w-[100px]">Actions</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {admins.map((admin, index) => (
                                            <TableRow key={admin._id} className="hover:bg-gray-50">
                                                <TableCell className="text-sm text-center py-4 font-medium">{index + 1}</TableCell>
                                                <TableCell className="text-sm text-center py-4">{admin.username}</TableCell>
                                                <TableCell className="text-sm text-center py-4">{admin.email}</TableCell>
                                                <TableCell className="text-sm text-center py-4">
                                                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                                                        {admin.role}
                                                    </span>
                                                </TableCell>
                                                <TableCell className="text-sm text-center py-4">{formatDate(admin.createdAt)}</TableCell>
                                                <TableCell className="text-sm text-center py-4">
                                                    <Button
                                                        variant="ghost"
                                                        size="sm"
                                                        onClick={() => setDeleteAdminId(admin._id)}
                                                        className="text-black hover:text-black hover:bg-gray-100"
                                                    >
                                                        <Trash2 className="h-4 w-4" />
                                                    </Button>
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </div>
                        )}
                    </CardContent>
                </Card>

                {/* Delete Confirmation Dialog */}
                <AlertDialog
                    open={!!deleteAdminId}
                    onOpenChange={() => setDeleteAdminId(null)}
                >
                    <AlertDialogContent>
                        <AlertDialogHeader>
                            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                            <AlertDialogDescription>
                                This action cannot be undone. This will permanently delete the admin
                                account and remove their access from the system.
                            </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction
                                onClick={() => deleteAdminId && handleDeleteAdmin(deleteAdminId)}
                                className="bg-black hover:bg-gray-800"
                            >
                                Delete
                            </AlertDialogAction>
                        </AlertDialogFooter>
                    </AlertDialogContent>
                </AlertDialog>
            </Container>
        </div>
        </SuperAdminGuard>
    );
}
