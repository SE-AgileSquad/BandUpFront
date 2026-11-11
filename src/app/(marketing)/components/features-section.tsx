import { FEATURES } from "../constants/landing";
import { FeatureRow } from "./feature-row";

export function FeaturesSection() {
    return (
        <section
            id="features"
            aria-labelledby="features-title"
            className="container-page scroll-mt-24"
        >
            <h2 id="features-title" className="sr-only">
                {FEATURES.srTitle}
            </h2>
            <div className="flex flex-col gap-12 lg:gap-20">
                {FEATURES.rows.map((row) => (
                    <FeatureRow key={row.eyebrow} {...row} />
                ))}
            </div>
        </section>
    );
}