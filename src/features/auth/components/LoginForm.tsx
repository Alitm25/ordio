"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

import { loginSchema, LoginFormData } from "../schemas/loginSchema";

import { useLogin } from "../hooks/useLogin";
import { toast } from "sonner";
import Link from "next/link";
import { getErrorMessage } from "@/lib/getErrorMessage";
import {useTranslations} from "next-intl";

export default function LoginForm() {
    const router = useRouter();

    const loginMutation = useLogin();

    const t = useTranslations('auth.login');
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<LoginFormData>({
        resolver: zodResolver(loginSchema),
    });

    const onSubmit = async (data: LoginFormData) => {
        try {
            await loginMutation.mutateAsync(data);

            toast.success("Logged in successfully");

            router.push("/dashboard");
        } catch (error) {
            toast.error(getErrorMessage(error, "Invalid email or password"));
        }
    };

    return (
        <Card className="w-full max-w-md border-border/50 shadow-xl">
            <CardHeader className={'space-y-2'}>
                <div className="flex justify-center mb-6">
                    <div className="text-3xl font-bold">
                        Ordio
                    </div>
                </div>

                <CardTitle className="text-2xl">
                    { t('title') }
                </CardTitle>

                <CardDescription>
                    { t("description") }
                </CardDescription>
            </CardHeader>

            <CardContent className={'space-y-4'}>
                <form
                    onSubmit={handleSubmit(onSubmit)}
                    className="space-y-4"
                >
                    <div>
                        <Input type="email" placeholder={ t('email') } {...register("email")} />

                        {
                            errors.email && (
                                <p className="text-sm text-red-500 mt-1">
                                    {errors.email.message}
                                </p>
                            )
                        }
                    </div>

                    <div>
                        <Input type="password" placeholder={ t('password') } {...register("password")} />

                        {
                            errors.password && (
                                <p className="text-sm text-red-500 mt-1">
                                    {errors.password.message}
                                </p>
                            )
                        }
                    </div>

                    <Button type="submit" className="w-full cursor-pointer" disabled={loginMutation.isPending}>
                        {
                            loginMutation.isPending
                            ? `${ t('loading') }`
                            : `${ t("submit") }`
                        }
                    </Button>
                </form>
                {/* Back to register page */}
                <p className="text-sm text-center text-muted-foreground mt-4">
                    { t('noAccount') }{" "}
                    <Link href="/register" className="text-primary underline-offset-4 hover:underline">
                        { t('register') }
                    </Link>
                </p>
            </CardContent>
        </Card>
    );
}