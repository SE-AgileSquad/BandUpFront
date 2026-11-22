import { Button } from "@/components/ui/button";
import { ImageSlot } from "@/components/shared/image-slot";
import { LIST_COPY } from "../constants/list";

type ListEmptyProps =
    | { variant: "empty"; emptyType: "passages" | "ongoing"; showClear: boolean; onClear: () => void }
    | { variant: "error"; onRetry: () => void };

export function ListEmpty(props: ListEmptyProps) {
    const isError = props.variant === "error";
    const emptyType = props.variant === "empty" ? props.emptyType : null;
    const image = isError
        ? "/images/img_offline.png"
        : emptyType === "ongoing"
            ? "/images/reading/img_no_ongoing_test.png"
            : "/images/reading/img_no_passages.png";

    return (
        <div className="flex flex-col items-center gap-4 py-8 text-center">
            <div className="relative size-72 sm:size-80">
                <ImageSlot
                    src={image}
                    alt={
                        isError
                            ? "You appear to be offline"
                            : emptyType === "ongoing"
                                ? "No ongoing reading tests"
                                : "No reading passages"
                    }
                    loading="eager"
                    sizes="(min-width: 640px) 320px, 288px"
                />
            </div>
            {isError && <p className="text-[24px] leading-[32px] font-bold">{LIST_COPY.error.title}</p>}
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
