import LoginForm from "@/features/auth/components/LoginForm";

export default function LoginPage() {
    return (
        <main className="min-h-screen flex items-center justify-center">
            <div className="w-full max-w-md p-6">
                <LoginForm />
            </div>
        </main>
    );
}