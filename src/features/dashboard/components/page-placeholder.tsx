interface PagePlaceholderProps {
    title: string;
    description: string;
}

export function PagePlaceholder({ title, description }: PagePlaceholderProps) {
    return (
        <div className="flex flex-col gap-2">
            <h1 className="text-h1 font-bold text-foreground">{title}</h1>
            <p className="text-body text-muted-foreground">{description}</p>
        </div>
    );
}