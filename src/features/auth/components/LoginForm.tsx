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
    loginSchema,
    LoginFormData,
} from "../schemas/loginSchema";

import { useLogin } from "../hooks/useLogin";
import {toast} from "sonner";
import Link from "next/link";

export default function LoginForm() {
    const router = useRouter();

    const loginMutation = useLogin();

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<LoginFormData>({
        resolver: zodResolver(loginSchema),
    });

    const onSubmit = async (data: LoginFormData) => {
        try {
            const response = await loginMutation.mutateAsync(data);

            localStorage.setItem("token", response.token);

            toast.success("Logged in successfully");

            router.push("/dashboard");
        } catch (error) {
            toast.error("Invalid email or password");
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
                    Welcome back
                </CardTitle>

                <CardDescription>
                    Sign in to manage your orders
                </CardDescription>
            </CardHeader>

            <CardContent className={'space-y-4'}>
                <form
                    onSubmit={handleSubmit(onSubmit)}
                    className="space-y-4"
                >
                    <div>
                        <Input type="email" placeholder="Enter your email address" {...register("email")} />

                        {
                            errors.email && (
                                <p className="text-sm text-red-500 mt-1">
                                    {errors.email.message}
                                </p>
                            )
                        }
                    </div>

                    <div>
                        <Input type="password" placeholder="Enter your password" {...register("password")} />

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
                            ? "Signing in..."
                            : "Login"
                        }
                    </Button>
                </form>
                {/* Back to register page */}
                <p className="text-sm text-center text-muted-foreground mt-4">
                    Don&apos;t have an account?{" "}
                    <Link href="/register" className="text-primary underline-offset-4 hover:underline">
                        Register now !
                    </Link>
                </p>
            </CardContent>
        </Card>
    );
}