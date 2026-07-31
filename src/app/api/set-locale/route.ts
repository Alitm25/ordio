import {NextResponse} from "next/server";

export async function POST(req: Request) {
    const { locale } = await req.json();

    if ( !['en', 'fa'].includes(locale) ) {
        return NextResponse.json(
            { message: 'Invalid locale'},
            { status: 400 }
        )
    }

    const response = NextResponse.json({ success: true });

    response.cookies.set("locale", locale, {
        path: "/",
        maxAge: 60 * 60 * 24 * 365,
        sameSite: "lax",
    });

    return response;
}