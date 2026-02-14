import { cookies } from "next/headers";

export async function POST(req: Request) {
  const { id } = await req.json();

  const cookieStore = await cookies();

  cookieStore.set("employeeId", id, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 8,
  });

  return Response.json({ success: true });
}
