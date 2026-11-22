import { Button } from "@/components/ui/button";
import { ImageSlot } from "@/components/shared/image-slot";
import { LIST_COPY } from "../constants/list";

type ListEmptyProps =
    | { variant: "empty"; showClear: boolean; onClear: () => void }
    | { variant: "error"; onRetry: () => void };

export function ListEmpty(props: ListEmptyProps) {
    const isError = props.variant === "error";

    return (
        <div className="flex flex-col items-center gap-3 rounded-card border border-border bg-card px-6 py-12 text-center">
            {!isError && (
                <div className="relative size-40">
                    <ImageSlot
                        src={undefined}
                        alt={LIST_COPY.empty.imageAlt}
                        sizes="160px"
                        className="rounded-frame"
                    />
                </div>
            )}
            <p className="text-[24px] leading-[32px] font-bold">
                {isError ? LIST_COPY.error.title : LIST_COPY.empty.title}
            </p>
            <p className="max-w-md text-[14px] leading-[21px] text-muted-foreground">
                {isError ? LIST_COPY.error.text : LIST_COPY.empty.text}
            </p>
            {props.variant === "error" ? (
                <Button type="button" variant="gradient" size="default" onClick={props.onRetry}>
                    {LIST_COPY.error.retry}
                </Button>
            ) : (
                props.showClear && (
                    <Button type="button" variant="gradient" size="default" onClick={props.onClear}>
                        {LIST_COPY.empty.clear}
                    </Button>
                )
            )}
        </div>
    );
}