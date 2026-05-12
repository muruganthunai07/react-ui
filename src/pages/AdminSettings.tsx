import { useState, useEffect } from "react";
import { AdminLayout } from "@/components/admin-layout";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { FileManagementCard } from "@/components/admin/FileManagementCard";
import { FileType, FileUse } from "@/types/api";
import AppInfoService from "@/services/AppInfoService";

export default function AdminSettings() {
  const [adminMessage, setAdminMessage] = useState("");
  const [helpNumber, setHelpNumber] = useState("");
  const [upiId, setUpiId] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch admin message
        const messageInfo = await AppInfoService.getAppInfo("AdminMessage");
        if (messageInfo && messageInfo.value) {
          setAdminMessage(messageInfo.value);
        }

        // Fetch Help Number
        const helpNumberInfo = await AppInfoService.getAppInfo("HelpNumber");
        if (helpNumberInfo && helpNumberInfo.value) {
          setHelpNumber(helpNumberInfo.value);
        }

        // Fetch UPI ID
        const upiInfo = await AppInfoService.getAppInfo("UPIId");
        if (upiInfo && upiInfo.value) {
          setUpiId(upiInfo.value);
        }
      } catch (error) {
        console.error("Failed to fetch app info", error);
      }
    };
    fetchData();
  }, []);

  const handleSaveMessage = async () => {
    setIsSaving(true);
    try {
      await AppInfoService.updateAppInfo({
        key: "AdminMessage",
        value: adminMessage,
      });
      toast.success("Admin message saved!");
    } catch (error) {
      console.error("Failed to save message.", error);
      toast.error("Failed to save message.");
    } finally {
      setIsSaving(false);
    }
  };

  const handleClearMessage = async () => {
    setIsSaving(true);
    try {
      await AppInfoService.updateAppInfo({
        key: "AdminMessage",
        value: "",
      });
      setAdminMessage("");
      toast.success("Admin message cleared!");
    } catch (error) {
      console.error("Failed to clear message.", error);
      toast.error("Failed to clear message.");
    } finally {
      setIsSaving(false);
    }
  };

  const handleSaveUpiId = async () => {
    setIsSaving(true);
    try {
      await AppInfoService.updateAppInfo({
        key: "UPIId",
        value: upiId,
      });
      toast.success("UPI ID saved!");
    } catch (error) {
      console.error("Failed to save UPI ID.", error);
      toast.error("Failed to save UPI ID.");
    } finally {
      setIsSaving(false);
    }
  };

  const handleSaveHelpNumber = async () => {
    setIsSaving(true);
    try {
      await AppInfoService.updateAppInfo({
        key: "HelpNumber",
        value: helpNumber,
      });
      toast.success("Help number saved!");
    } catch (error) {
      console.error("Failed to save help number.", error);
      toast.error("Failed to save help number.");
    } finally {
      setIsSaving(false);
    }
  };

  const handleClearHelpNumber = async () => {
    setIsSaving(true);
    try {
      await AppInfoService.updateAppInfo({
        key: "HelpNumber",
        value: "",
      });
      setHelpNumber("");
      toast.success("Help number cleared!");
    } catch (error) {
      console.error("Failed to clear help number.", error);
      toast.error("Failed to clear help number.");
    } finally {
      setIsSaving(false);
    }
  };

  const handleClearUpiId = async () => {
    setIsSaving(true);
    try {
      await AppInfoService.updateAppInfo({
        key: "UPIId",
        value: "",
      });
      setUpiId("");
      toast.success("UPI ID cleared!");
    } catch (error) {
      console.error("Failed to clear UPI ID.", error);
      toast.error("Failed to clear UPI ID.");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Admin Settings</CardTitle>
            <CardDescription>
              Manage QR codes, banners and broadcast messages to users.
            </CardDescription>
          </CardHeader>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* QR Code Management */}
          <FileManagementCard
            key="qr-code-management"
            title="QR Code Management"
            description="Add or remove QR codes for payments."
            fileType={FileType.Image}
            fileUse={FileUse.QRCode}
            aspectRatio="aspect-square"
            objectFit="contain"
            uploadText="Upload QR Code"
          />

          {/* Banner Management */}
          <FileManagementCard
            key="banner-management"
            title="Banner Management"
            description="Add or remove banner images for the app."
            fileType={FileType.Image}
            fileUse={FileUse.BannerImage}
            aspectRatio="aspect-[2/1]"
            objectFit="cover"
            uploadText="Upload Banner"
          />

          {/* UPI ID Management */}
          <Card>
            <CardHeader>
              <CardTitle>UPI ID Management</CardTitle>
              <CardDescription>
                Set the UPI ID for payments.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <Input
                  placeholder="Enter UPI ID (e.g., yourname@paytm)"
                  value={upiId}
                  onChange={(e) => setUpiId(e.target.value)}
                />
                <div className="flex gap-2">
                  <Button
                    onClick={handleSaveUpiId}
                    className="w-full"
                    disabled={isSaving}
                  >
                    {isSaving ? "Saving..." : "Save UPI ID"}
                  </Button>
                  <Button
                    onClick={handleClearUpiId}
                    className="w-full"
                    variant="destructive"
                    disabled={isSaving}
                  >
                    Clear UPI ID
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Help Number Management */}
          <Card>
            <CardHeader>
              <CardTitle>Help Number Management</CardTitle>
              <CardDescription>
                Set the WhatsApp number shown in the Help button.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <Input
                  placeholder="Enter help number with country code"
                  value={helpNumber}
                  onChange={(e) => setHelpNumber(e.target.value)}
                />
                <div className="flex gap-2">
                  <Button
                    onClick={handleSaveHelpNumber}
                    className="w-full"
                    disabled={isSaving}
                  >
                    {isSaving ? "Saving..." : "Save Help Number"}
                  </Button>
                  <Button
                    onClick={handleClearHelpNumber}
                    className="w-full"
                    variant="destructive"
                    disabled={isSaving}
                  >
                    Clear Help Number
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Admin Message */}
        <Card>
          <CardHeader>
            <CardTitle>Admin Message</CardTitle>
            <CardDescription>
              Set a global message for all users.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <Textarea
                placeholder="Enter your message here..."
                value={adminMessage}
                onChange={(e) => setAdminMessage(e.target.value)}
                className="min-h-[200px]"
              />
              <div className="flex gap-2">
                <Button
                  onClick={handleSaveMessage}
                  className="w-full"
                  disabled={isSaving}
                >
                  {isSaving ? "Saving..." : "Save Message"}
                </Button>
                <Button
                  onClick={handleClearMessage}
                  className="w-full"
                  variant="destructive"
                  disabled={isSaving}
                >
                  Clear Message
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
}
