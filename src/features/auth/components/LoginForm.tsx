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
import { useQueryClient } from "@tanstack/react-query";

export default function LoginForm() {
    const router = useRouter();

    const loginMutation = useLogin();
    const queryClient = useQueryClient();

    const t = useTranslations('auth.login');
    const tToast = useTranslations('toast.auth');
    const tValid = useTranslations('validation');

    const { register, handleSubmit, formState: { errors } } = useForm<LoginFormData>({
        resolver: zodResolver(loginSchema),
    });

    const onSubmit = async (data: LoginFormData) => {
        try {
            await loginMutation.mutateAsync(data);

            // Safety net: drop any cached data left over from a previous user before entering the app
            queryClient.clear();

            toast.success( tToast('loginSuccess') );

            router.push("/dashboard");
        } catch (error) {
            toast.error(getErrorMessage(error, tToast('loginError') ));
        }
    };

    return (
        <Card className="w-full max-w-md border-border/50 shadow-xl p-8 rounded-3xl">
            <CardHeader className="space-y-3 pb-5 flex items-center justify-center flex-col">
                <div className="flex justify-center pb-3">
                    <div className="text-3xl font-bold tracking-tight text-foreground">
                        Ordio
                    </div>
                </div>

                <CardTitle className="text-2xl tracking-tight">{t("title")}</CardTitle>
                <CardDescription>{t("description")}</CardDescription>
            </CardHeader>

            <CardContent className="pt-0">
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                    <div className="space-y-2">
                        <Input
                            id="email"
                            type="email"
                            className={'p-5'}
                            placeholder={t('email')}
                            aria-invalid={Boolean(errors.email)}
                            {...register("email")}
                        />
                        {errors.email && (
                            <p className="text-sm text-destructive">
                                {tValid("invalidEmail")}
                            </p>
                        )}
                    </div>

                    <div className="space-y-2">
                        <Input
                            id="password"
                            type="password"
                            className={'p-5'}
                            placeholder={t('password')}
                            aria-invalid={Boolean(errors.password)}
                            {...register("password")}
                        />
                        {errors.password && (
                            <p className="text-sm text-destructive">
                                {tValid("passwordMin")}
                            </p>
                        )}
                    </div>

                    <Button
                        type="submit"
                        className="w-full cursor-pointer p-6 text-base rounded-2xl"
                        disabled={loginMutation.isPending}
                    >
                        {loginMutation.isPending ? t("loading") : t("submit")}
                    </Button>
                </form>

                <p className="text-sm text-center text-muted-foreground mt-6">
                    {t("noAccount")} {" "}
                    <Link href="/register" className="text-primary underline-offset-4 hover:underline">
                        {t("register")}
                    </Link>
                </p>
            </CardContent>
        </Card>
    );
}