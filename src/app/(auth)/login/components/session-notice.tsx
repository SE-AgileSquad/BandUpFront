import { StatusNotice } from "@/components/auth/status-notice";
import { LOGIN_COPY } from "../constants/login";
import { readResumeInfo } from "../lib/resume-info";
import type { LoginReason } from "../types";

type SessionNoticeProps = {
    reason: LoginReason | null;
    next: string | null;
};

export function SessionNotice({ reason, next }: SessionNoticeProps) {
    const { session } = LOGIN_COPY;

    if (reason === "session-expired") {
        return (
            <StatusNotice
                variant="info"
                title={session.expiredTitle}
                description={session.expiredDescription}
            />
        );
    }

    if (!next) return null;

    const info = readResumeInfo(next);

    return (
        <StatusNotice
            variant="info"
            title={session.protectedTitle}
            description={
                info
                    ? session.resumeWithInfo(info.title, info.detail)
                    : session.resumeFallback
            }
        />
    );
}