import { Logo } from "./logo";
import { FooterColumn } from "./footer-column";
import { FooterAccount } from "./footer-account";
import { FOOTER_COLUMNS, filterLinks } from "@/constants/navigation";
import { siteConfig } from "@/constants/site";

const year = new Date().getFullYear();

export function Footer() {
    return (
        <footer className="container-page flex flex-col gap-6 py-10">
            <div className="flex flex-col gap-6 md:flex-row md:justify-between">
                <div className="flex max-w-sm flex-col gap-[10px]">
                    <Logo className="self-start" />
                    <p className="text-[14px] leading-[21px] text-muted-foreground">
                        {siteConfig.tagline}
                    </p>
                </div>
                <nav aria-label="Footer" className="flex flex-wrap gap-8 md:gap-[72px]">
                    {FOOTER_COLUMNS.map((column) =>
                        column.authAware ? (
                            <FooterAccount key={column.title} column={column} />
                        ) : (
                            <FooterColumn
                                key={column.title}
                                title={column.title}
                                links={filterLinks(column.links)}
                            />
                        ),
                    )}
                </nav>
            </div>
            <div className="flex flex-col gap-2 text-[13px] leading-[1.4] text-muted-foreground md:flex-row md:justify-between">
                <p>© {year} BandUp. All rights reserved.</p>
                <p>{siteConfig.disclaimer}</p>
            </div>
        </footer>
    );
}