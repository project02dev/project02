import { NextResponse } from "next/server";

export async function GET() {
  // In a real app, this would come from your database
  const verificationTypes = [
    {
      id: "education",
      name: "Educational Credentials",
      description:
        "Upload your highest degree certificate or academic credentials",
      allowedFileTypes: ".pdf,.jpg,.png",
      required: true,
    },
    {
      id: "professional",
      name: "Professional Certifications",
      description: "Upload relevant professional certificates or licenses",
      allowedFileTypes: ".pdf,.jpg,.png",
      required: false,
    },
    {
      id: "portfolio",
      name: "Portfolio/Work Samples",
      description: "Upload samples of your previous work or portfolio",
      allowedFileTypes: ".pdf,.zip",
      required: false,
    },
  ];

  return NextResponse.json(verificationTypes);
}
