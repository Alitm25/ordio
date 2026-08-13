import {toJalaali} from "jalaali-js";

export function formatDate(dateString: string, locale: string): string {
    const date = new Date(dateString);

    if (locale === "fa") {
        const { jy, jm, jd } = toJalaali(
            date.getFullYear(),
            date.getMonth() + 1,
            date.getDate()
        );

        const persianNumbers = (n: number) =>
            n.toString().replace(/\d/g, (d) => "۰۱۲۳۴۵۶۷۸۹"[+d]);

        return `${persianNumbers(jy)}/${persianNumbers(jm).padStart(2, "۰")}/${persianNumbers(jd).padStart(2, "۰")}`;
    }

    return date.toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
    });
}