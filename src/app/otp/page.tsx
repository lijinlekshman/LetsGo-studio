"use client";
export const dynamic = "force-dynamic";

import React, { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import Image from "next/image";
import Link from "next/link";

const OTPPage: React.FC = () => {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [otp, setOtp] = useState("");
  const [mobileNumber, setMobileNumber] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const number = searchParams.get("mobileNumber");

    if (!number) {
      router.replace("/"); // Avoids pushing to history stack
      return;
    }

    setMobileNumber(number);
    setLoading(false);
  }, [searchParams, router]);

  const verifyOTPAndBookCab = () => {
    if (otp === "123456") {
      alert("OTP Verified! Redirecting to user dashboard...");
      router.push(`/user-dashboard?mobileNumber=${mobileNumber}`);
    } else {
      alert("OTP Verification Failed: Invalid OTP. Please try again.");
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p>Loading...</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen py-2">
      <main className="flex flex-col items-center justify-center w-full flex-1 px-4 md:px-20 text-center">
        <Image
          src="/image/LetsGo-W-slogan.png"
          width={400}
          height={100}
          alt="Let'sGo Rides"
        />

        <Card className="w-full max-w-md mt-10">
          <CardHeader>
            <CardTitle>Verify OTP</CardTitle>
            <CardDescription>
              Enter the OTP sent to your mobile number {mobileNumber}.
            </CardDescription>
          </CardHeader>
          <CardContent className="grid gap-4">
            <div className="grid gap-2">
              <label htmlFor="otp">OTP</label>
              <Input
                type="text"
                id="otp"
                placeholder="Enter OTP"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                required
              />
            </div>
            <Button onClick={verifyOTPAndBookCab} disabled={!otp}>
              Verify OTP
            </Button>
            <Link
              href="/"
              className="mt-4 text-sm text-muted-foreground hover:text-foreground"
            >
              Back to Home
            </Link>
          </CardContent>
        </Card>
      </main>
    </div>
  );
};

export default OTPPage;
