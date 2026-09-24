import LoginForm from "@/features/auth/components/LoginForm";

export default function LoginPage() {
    return (
        <main
            className="min-h-screen flex items-center justify-center px-4"
            style={ {background: "linear-gradient(135deg, #4241bc 0%, #5B5BD6 40%, #7c7ce8 100%)"} }
        >
            <LoginForm />
        </main>
    );
}