import { useEffect, useMemo, useState } from "react";
import { useAuth } from "@/contexts/auth-context";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { OtpInput } from "@/components/otp-input";
import { toast } from "sonner";
import { UserService } from "@/services/UserService";
import { Lock, Smartphone } from "lucide-react";

type ResetPasswordFormProps = {
  mobileNumber?: string;
  onSuccess?: () => void;
  className?: string;
};

type Step = "mobile" | "otp" | "reset";

export function ResetPasswordForm({
  mobileNumber: presetMobileNumber,
  onSuccess,
  className,
}: ResetPasswordFormProps) {
  const { resendOtp, verifyOtpForReset } = useAuth();
  const [mobileNumber, setMobileNumber] = useState<string>(
    presetMobileNumber || ""
  );
  const [step, setStep] = useState<Step>("mobile");
  const [isLoading, setIsLoading] = useState(false);
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const isMobilePrefilled = useMemo(
    () => Boolean(presetMobileNumber && presetMobileNumber.length > 0),
    [presetMobileNumber]
  );

  useEffect(() => {
    if (presetMobileNumber) {
      setMobileNumber(presetMobileNumber);
    }
  }, [presetMobileNumber]);

  const handleSendOtp = async () => {
    if (!/^\d{10}$/.test(mobileNumber)) {
      toast.error("Enter a valid 10-digit mobile number");
      return;
    }
    setIsLoading(true);
    try {
      const res = await resendOtp(mobileNumber);
      if (res.success) {
        toast.success(res.message?.[0] || "OTP sent");
        setStep("otp");
        setOtp("");
      } else {
        toast.error(res.message?.[0] || "Failed to send OTP");
      }
    } catch {
      toast.error("Failed to send OTP");
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyOtp = async () => {
    if (otp.length !== 4) {
      toast.error("Enter the 4-digit OTP");
      return;
    }
    setIsLoading(true);
    try {
      const result = await verifyOtpForReset({ mobileNumber, otp });
      if (result.success) {
        toast.success("OTP verified");
        setStep("reset");
      } else {
        toast.error(result.message?.[0] || "OTP verification failed");
      }
    } catch {
      toast.error("OTP verification failed");
    } finally {
      setIsLoading(false);
    }
  };

  const handleReset = async () => {
    if (newPassword.length === 0 || confirmPassword.length === 0) {
      toast.error("Please enter your new password");
      return;
    }
    if (newPassword !== confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }
    setIsLoading(true);
    try {
      const res = await UserService.resetPassword({
        mobileNumber,
        newPassword,
      });
      if (!res.isError) {
        toast.success(res.message || "Password reset successful");
        setOtp("");
        setNewPassword("");
        setConfirmPassword("");
        onSuccess?.();
      } else {
        toast.error(res.errors?.[0]?.message || "Password reset failed");
      }
    } catch (err: unknown) {
      const error = err as { response?: { data?: { errors?: string[] } } };
      const apiMsg = error?.response?.data?.errors?.[0];
      toast.error(apiMsg || "Password reset failed");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={className}>
      {step === "mobile" && (
        <div className="space-y-6">
          {!isMobilePrefilled ? (
            <div className="space-y-2">
              <label className="text-sm font-medium">Mobile Number</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                  <Smartphone className="h-5 w-5 text-muted-foreground" />
                </div>
                <div className="absolute inset-y-0 left-10 flex items-center pointer-events-none">
                  <span className="text-muted-foreground">+91</span>
                </div>
                <Input
                  type="tel"
                  pattern="[6-9][0-9]{9}"
                  value={mobileNumber}
                  onChange={(e) => setMobileNumber(e.target.value)}
                  className="pl-20"
                  placeholder="Enter 10-digit number"
                  minLength={10}
                  maxLength={10}
                />
              </div>
            </div>
          ) : (
            <div className="space-y-2">
              <label className="text-sm font-medium">Mobile Number</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                  <Smartphone className="h-5 w-5 text-muted-foreground" />
                </div>
                <div className="absolute inset-y-0 left-10 flex items-center pointer-events-none">
                  <span className="text-muted-foreground">+91</span>
                </div>
                <Input
                  type="tel"
                  value={mobileNumber}
                  disabled
                  className="pl-20"
                  placeholder="Enter 10-digit number"
                  minLength={10}
                  maxLength={10}
                />
              </div>
            </div>
          )}
          <Button
            className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-bold py-6"
            disabled={isLoading}
            onClick={handleSendOtp}
          >
            {isLoading ? "Sending OTP..." : "Send OTP"}
          </Button>
        </div>
      )}

      {step === "otp" && (
        <div className="space-y-6">
          {!isMobilePrefilled && (
            <p className="text-xs text-muted-foreground text-center">
              OTP sent to +91 {mobileNumber}
            </p>
          )}
          <div className="space-y-4">
            <label className="text-sm font-medium block text-center">
              Enter the 4-digit OTP
            </label>
            <OtpInput
              value={otp}
              onChange={setOtp}
              numInputs={4}
              renderInput={(props) => (
                <Input {...props} className="text-center" />
              )}
            />
            <p className="text-xs text-muted-foreground text-center">
              Didn't receive the OTP?{" "}
              <button
                type="button"
                className="text-primary hover:underline"
                onClick={handleSendOtp}
              >
                Resend
              </button>
            </p>
          </div>
          <Button
            className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-bold py-6"
            disabled={isLoading || otp.length !== 4}
            onClick={handleVerifyOtp}
          >
            {isLoading ? "Verifying..." : "Verify OTP"}
          </Button>
        </div>
      )}

      {step === "reset" && (
        <div className="space-y-6">
          <div className="space-y-2">
            <label className="text-sm font-medium">New Password</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                <Lock className="h-5 w-5 text-muted-foreground" />
              </div>
              <Input
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="pl-10"
                placeholder="Enter new password"
              />
            </div>
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">Confirm New Password</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                <Lock className="h-5 w-5 text-muted-foreground" />
              </div>
              <Input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="pl-10"
                placeholder="Confirm new password"
              />
            </div>
          </div>
          <Button
            className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-bold py-6"
            disabled={isLoading}
            onClick={handleReset}
          >
            {isLoading ? "Resetting..." : "Reset Password"}
          </Button>
        </div>
      )}
    </div>
  );
}

export default ResetPasswordForm;
