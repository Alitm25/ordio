"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

import {
    loginSchema,
    LoginFormData,
} from "../schemas/loginSchema";

import { useLogin } from "../hooks/useLogin";

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

            router.push("/dashboard");
        } catch (error) {
            console.error(error);
        }
    };

    return (
        <form
            onSubmit={handleSubmit(onSubmit)}
            className="space-y-4"
        >
            <div>
                <Input type="email" placeholder="Email" {...register("email")} />

                {
                    errors.email && (
                        <p className="text-red-500 text-sm mt-1">
                            {errors.email.message}
                        </p>
                    )
                }
            </div>

            <div>
                <Input type="password" placeholder="Password" {...register("password") }
                />

                {
                    errors.password && (
                        <p className="text-red-500 text-sm mt-1">
                            {errors.password.message}
                        </p>
                    )
                }
            </div>

            <Button type="submit" className="w-full" disabled={loginMutation.isPending}>
                {
                    loginMutation.isPending
                    ? "Logging in..."
                    : "Login"
                }
            </Button>
        </form>
    );
}