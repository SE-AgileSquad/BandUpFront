import { AuthHeader } from "./auth-header";
import { LoginForm } from "./login-form";

export default function LoginPage() {
    return (
        <>
            <AuthHeader
                title="Welcome back"
                description="Sign in to continue your IELTS preparation."
            />
            <LoginForm />
        </>
    );
}