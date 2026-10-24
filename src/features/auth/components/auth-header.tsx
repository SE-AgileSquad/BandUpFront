interface AuthHeaderProps {
    title: string;
    description: string;
}

export function AuthHeader({ title, description }: AuthHeaderProps) {
    return (
        <div className="flex flex-col items-center gap-2 text-center">
            <h1 className="text-h1 font-bold text-foreground">{title}</h1>
            <p className="text-body text-muted-foreground">{description}</p>
        </div>
    );
}