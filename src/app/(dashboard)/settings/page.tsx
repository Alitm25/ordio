"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useCurrentUser } from "@/features/auth/hooks/useCurrentUser";
import { changePasswordSchema, ChangePasswordFormValues } from "@/features/settings/schemas/changePasswordSchema";
import { api } from "@/services/api";
import { getErrorMessage } from "@/lib/getErrorMessage";
import { toast } from "sonner";
import { useState } from "react";
import {Eye, EyeOff, User, Lock, Mail} from "lucide-react";
import {useQueryClient} from "@tanstack/react-query";
import {ChangeEmailFormValues, changeEmailSchema} from "@/features/settings/schemas/changeEmail";
import {useTranslations} from "next-intl";

export default function SettingsPage() {
    // Get the current user
    const { data } = useCurrentUser();
    const user = data?.user;
    const queryClient = useQueryClient();

    // Change email & passwords states
    const [showEmailPassword, setShowEmailPassword] = useState(false);
    const [showCurrentPassword, setShowCurrentPassword] = useState(false);
    const [showNewPassword, setShowNewPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    /* Change Password section START */
        // default for values initialization
        const form = useForm<ChangePasswordFormValues>({
            resolver: zodResolver(changePasswordSchema),
            defaultValues: {
                currentPassword: "",
                newPassword: "",
                confirmPassword: "",
            },
        });

        // Translations function
    const tSettings = useTranslations("settings");

        // form onSubmit handler
        const onSubmit = async (data: ChangePasswordFormValues) => {
            try {
                await api.patch("user/change-password", {
                    currentPassword: data.currentPassword,
                    newPassword: data.newPassword,
                });

                toast.success("Password changed successfully");
                form.reset();
            } catch (error) {
                toast.error(getErrorMessage(error, "Could not change password"));
            }
        };
    /* Change Password section END */

    /* Change Email section START */
        // email form default values initialization
        const emailForm = useForm<ChangeEmailFormValues>({
            resolver: zodResolver(changeEmailSchema),
            defaultValues: {
                newEmail: "",
                currentPassword: "",
            },
        });

        // Change email onSubmit handler
        const onEmailSubmit = async (data: ChangeEmailFormValues) => {
            try {
                await api.patch("user/change-email", data);

                toast.success("Email changed successfully");
                emailForm.reset();

                queryClient.invalidateQueries({ queryKey: ["currentUser"] });
            } catch (error) {
                toast.error(getErrorMessage(error, "Could not change email"));
            }
        };
    /* Change Email section END */

    return (
        <div className="space-y-6 max-w-2xl">
            <h1 className="text-3xl font-bold">{ tSettings('title') }</h1>
            {/* Account information Card START */}
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <User className="h-5 w-5" />
                            { tSettings('account.title') }
                        </CardTitle>
                    </CardHeader>

                    <CardContent className="space-y-4">
                        <div className="flex flex-col gap-1">
                            <span className="text-sm text-muted-foreground">
                                { tSettings('account.email') }
                            </span>
                            <span className="font-medium">
                                {user?.email ?? "—"}
                            </span>
                        </div>

                        <div className="flex flex-col gap-1">
                            <span className="text-sm text-muted-foreground">
                                { tSettings('account.memberSince') }
                            </span>
                            <span className="font-medium">
                                {user?.createdAt ? new Date(user.createdAt).toLocaleDateString("en-US", {
                                        year: "numeric",
                                        month: "long",
                                        day: "numeric",
                                    }) : "—"}
                            </span>
                        </div>
                    </CardContent>
                </Card>
            {/* Account information Card END */}

            {/* Change Email Card START */}
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Mail className="h-5 w-5" />
                            { tSettings('changeEmail.title') }
                        </CardTitle>
                    </CardHeader>

                    <CardContent>
                        <form
                            onSubmit={emailForm.handleSubmit(onEmailSubmit)}
                            className="space-y-4"
                        >
                            <div className="space-y-1">
                                <Input
                                    {...emailForm.register("newEmail")}
                                    type="email"
                                    placeholder={ tSettings('changeEmail.newEmail') }
                                />
                                {emailForm.formState.errors.newEmail && (
                                    <p className="text-sm text-red-500">
                                        {emailForm.formState.errors.newEmail.message}
                                    </p>
                                )}
                            </div>

                            <div className="space-y-1">
                                <div className="relative">
                                    <Input
                                        {...emailForm.register("currentPassword")}
                                        type={showEmailPassword ? "text" : "password"}
                                        placeholder={ tSettings('changeEmail.currentPassword') }
                                    />
                                    <button
                                        type="button"
                                        onClick={() =>
                                            setShowEmailPassword((prev) => !prev)
                                        }
                                        className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                                    >
                                        {showEmailPassword ? (
                                            <EyeOff className="h-4 w-4" />
                                        ) : (
                                            <Eye className="h-4 w-4" />
                                        )}
                                    </button>
                                </div>
                                {emailForm.formState.errors.currentPassword && (
                                    <p className="text-sm text-red-500">
                                        {emailForm.formState.errors.currentPassword.message}
                                    </p>
                                )}
                            </div>

                            <div className="flex justify-end pt-2">
                                <Button
                                    type="submit"
                                    className="cursor-pointer"
                                    disabled={emailForm.formState.isSubmitting}
                                >
                                    {emailForm.formState.isSubmitting
                                        ? tSettings('changeEmail.loading')
                                        : tSettings('changeEmail.submit')  }
                                </Button>
                            </div>
                        </form>
                    </CardContent>
                </Card>
            {/* Change Email Card END */}

            {/* Change Password Card START */}
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Lock className="h-5 w-5" />
                            { tSettings('changePassword.title') }
                        </CardTitle>
                    </CardHeader>

                    <CardContent>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                            <div className="space-y-1">
                                <div className="relative">
                                    <Input
                                        {...form.register("currentPassword")}
                                        type={ showCurrentPassword ? "text" : "password"}
                                        placeholder={ tSettings('changePassword.currentPassword') }
                                    />
                                    <button type="button" onClick={ () => setShowCurrentPassword((prev) => !prev) }
                                            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground cursor-pointer"
                                    >
                                        {showCurrentPassword ? (
                                            <EyeOff className="h-4 w-4" />
                                        ) : (
                                            <Eye className="h-4 w-4" />
                                        )}
                                    </button>
                                </div>
                                {form.formState.errors.currentPassword && (
                                    <p className="text-sm text-red-500">
                                        {
                                            form.formState.errors.currentPassword
                                                .message
                                        }
                                    </p>
                                )}
                            </div>

                            <div className="space-y-1">
                                <div className="relative">
                                    <Input
                                        {...form.register("newPassword")}
                                        type={showNewPassword ? "text" : "password"}
                                        placeholder={ tSettings('changePassword.newPassword') }
                                    />
                                    <button type="button" onClick={ () => setShowNewPassword((prev) => !prev) }
                                            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground cursor-pointer"
                                    >
                                        {showNewPassword ? (
                                            <EyeOff className="h-4 w-4" />
                                        ) : (
                                            <Eye className="h-4 w-4" />
                                        )}
                                    </button>
                                </div>
                                {form.formState.errors.newPassword && (
                                    <p className="text-sm text-red-500">
                                        {form.formState.errors.newPassword.message}
                                    </p>
                                )}
                            </div>

                            <div className="space-y-1">
                                <div className="relative">
                                    <Input
                                        {...form.register("confirmPassword")}
                                        type={ showConfirmPassword ? "text" : "password" }
                                        placeholder={ tSettings('changePassword.confirmPassword') }
                                    />
                                    <button type="button" onClick={ () => setShowConfirmPassword((prev) => !prev) }
                                            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground cursor-pointer"
                                    >
                                        {showConfirmPassword ? (
                                            <EyeOff className="h-4 w-4" />
                                        ) : (
                                            <Eye className="h-4 w-4" />
                                        )}
                                    </button>
                                </div>
                                {form.formState.errors.confirmPassword && (
                                    <p className="text-sm text-red-500">
                                        {
                                            form.formState.errors.confirmPassword
                                                .message
                                        }
                                    </p>
                                )}
                            </div>

                            <div className="flex justify-end pt-2">
                                <Button
                                    type="submit"
                                    className="cursor-pointer"
                                    disabled={form.formState.isSubmitting}
                                >
                                    {form.formState.isSubmitting
                                        ? tSettings('changePassword.loading')
                                        : tSettings('changePassword.submit')  }
                                </Button>
                            </div>
                        </form>
                    </CardContent>
                </Card>
            {/* Change Password Card END */}
        </div>
    );
}