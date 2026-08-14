"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";

import {
    registerSchema,
    RegisterFormData,
} from "../schemas/registerSchema";

import { useRegister } from "../hooks/useRegister";
import { toast } from "sonner";
import Link from "next/link";
import {getErrorMessage} from "@/lib/getErrorMessage";
import {useTranslations} from "next-intl";

export default function RegisterForm() {
    const router = useRouter();

    const registerMutation = useRegister();

    // Translation Functions
    const t = useTranslations('auth.register');
    const tToast = useTranslations('toast.auth');
    const tValid = useTranslations('validation');

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<RegisterFormData>({
        resolver: zodResolver(registerSchema),
    });

    const onSubmit = async (data: RegisterFormData) => {
        try {
            await registerMutation.mutateAsync(data);

            toast.success( tToast('registerSuccess') );

            router.push("/login");
        } catch (error) {
            toast.error(getErrorMessage(error, tToast('registerError') ));
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
                    { t('description') }
                </CardDescription>
            </CardHeader>

            <CardContent className={'space-y-4'}>
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                    <div>
                        <Input type="email" placeholder={ t('email') }{...register("email")} />

                        {
                            errors.email && (
                                <p className="text-sm text-red-500 mt-1">
                                    { tValid('invalidEmail') }
                                </p>
                            )
                        }
                    </div>

                    <div>
                        <Input type="password" placeholder={ t('password') } {...register("password")} />

                        {
                            errors.password && (
                                <p className="text-sm text-red-500 mt-1">
                                    { tValid('passwordMin') }
                                </p>
                            )
                        }
                    </div>

                    <Button type="submit" className="w-full cursor-pointer" disabled={registerMutation.isPending}>
                        {
                            registerMutation.isPending
                                ? `${ t('loading') }`
                                : `${ t('submit') }`
                        }
                    </Button>
                </form>
                {/* Back to login form */}
                <p className="text-sm text-center text-muted-foreground mt-4">
                    { t('hasAccount') }{" "}
                    <Link href="/login" className="text-primary underline-offset-4 hover:underline">
                        { t('login') }
                    </Link>
                </p>
            </CardContent>
        </Card>
    );
}