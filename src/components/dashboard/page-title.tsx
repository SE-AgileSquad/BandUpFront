type PageTitleProps = { title: string; description?: string };

export function PageTitle({ title, description }: PageTitleProps) {
    return (
        <div className="flex flex-col gap-2">
            <h1 className="text-page-title text-foreground">{title}</h1>
            {description && (
                <p className="text-[15px] leading-[22px] text-muted-foreground">
                    {description}
                </p>
            )}
        </div>
    );
}