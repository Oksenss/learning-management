import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

const isStudentRoute = createRouteMatcher(["/user/(.*)"]);
const isTeacherRoute = createRouteMatcher(["/teacher/(.*)"]);

// Define the teacher's user ID
const TEACHER_USER_ID = "user_2sw6Y355PI2BxUXPkeeidUy1oii";

export default clerkMiddleware(async (auth, req) => {
  const { userId } = await auth(); // Get user ID directly
  console.log("User ID:", userId);

  // If the user ID matches the teacher ID, assign "teacher", otherwise "student"
  const userRole = userId === TEACHER_USER_ID ? "teacher" : "student";
  console.log("User Role:", userRole);

  if (isStudentRoute(req) && userRole !== "student") {
    return NextResponse.redirect(new URL("/teacher/courses", req.url));
  }

  if (isTeacherRoute(req) && userRole !== "teacher") {
    return NextResponse.redirect(new URL("/user/courses", req.url));
  }
});

export const config = {
  matcher: [
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    "/(api|trpc)(.*)",
  ],
};
