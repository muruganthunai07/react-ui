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
import { toast } from "sonner";
import AppInfoService from "@/services/AppInfoService";
import { DatePicker } from "@/components/ui/date-picker";
import API from "@/services/api";
import { ReactMultiEmail } from "react-multi-email";
import "react-multi-email/dist/style.css";
import momentTz from 'moment-timezone';

export default function AdminConfigurations() {
  const [reportEmails, setReportEmails] = useState<string[]>([]);
  const [isSaving, setIsSaving] = useState(false);
  const [clearDate, setClearDate] = useState<Date | null>(null);
  const [isClearing, setIsClearing] = useState(false);

  useEffect(() => {
    const fetchReportEmails = async () => {
      try {
        const emailsInfo = await AppInfoService.getAppInfo("ReportEmails");
        if (emailsInfo && emailsInfo.value) {
          try {
            const emailsArray = JSON.parse(emailsInfo.value);
            setReportEmails(Array.isArray(emailsArray) ? emailsArray : []);
          } catch {
            // Fallback for old format (comma-separated or newline-separated)
            const emails = emailsInfo.value.includes(",")
              ? emailsInfo.value.split(",").map((email) => email.trim())
              : emailsInfo.value.split("\n").filter((email) => email.trim());
            setReportEmails(emails);
          }
        }
      } catch (error) {
        console.error("Failed to fetch report emails", error);
      }
    };
    fetchReportEmails();
  }, []);

  const handleSaveReportEmails = async () => {
    setIsSaving(true);
    try {
      await AppInfoService.updateAppInfo({
        key: "ReportEmails",
        value: JSON.stringify(reportEmails),
      });
      toast.success("Report emails saved!");
    } catch (error) {
      console.error("Failed to save report emails.", error);
      toast.error("Failed to save report emails.");
    } finally {
      setIsSaving(false);
    }
  };

  const handleClearReportEmails = async () => {
    setIsSaving(true);
    try {
      await AppInfoService.updateAppInfo({
        key: "ReportEmails",
        value: "",
      });
      setReportEmails([]);
      toast.success("Report emails cleared!");
    } catch (error) {
      console.error("Failed to clear report emails.", error);
      toast.error("Failed to clear report emails.");
    } finally {
      setIsSaving(false);
    }
  };

  const handleClearTransactions = async () => {
    if (!clearDate) {
      toast.error("Please select a date.");
      return;
    }
    setIsClearing(true);
    try {
      const res = await API.post("/api/game/GameAdmin/clear-game-data", {
        BeforeDate: momentTz(clearDate).tz('Asia/Kolkata').format('YYYY-MM-DDTHH:mm:ss'),
      });
      toast.success(res.data.message || "Transactions cleared successfully.");
    } catch (error: unknown) {
      let msg = "Failed to clear transactions.";
      if (typeof error === "object" && error && "response" in error) {
        const err = error as { response?: { data?: { detail?: string } } };
        msg = err.response?.data?.detail || msg;
      }
      toast.error(msg);
    } finally {
      setIsClearing(false);
    }
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Configurations</CardTitle>
            <CardDescription>
              Manage system configurations including report emails and data cleanup.
            </CardDescription>
          </CardHeader>
        </Card>

        {/* Report Emails */}
        <Card>
          <CardHeader>
            <CardTitle>Report Emails</CardTitle>
            <CardDescription>
              Set email addresses to receive reports. Enter email addresses and
              press Enter or comma to add them.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <ReactMultiEmail
                className="min-h-[200px] border rounded-md p-3"
                placeholder="Enter email addresses here..."
                emails={reportEmails}
                onChange={(emails: string[]) => setReportEmails(emails)}
                getLabel={(
                  email: string,
                  index: number,
                  removeEmail: (index: number) => void
                ) => {
                  return (
                    <div
                      data-tag
                      key={index}
                      className="inline-flex items-center bg-blue-100 text-blue-800 rounded-full px-3 py-1 mr-2 mb-2"
                    >
                      <span className="text-sm">{email}</span>
                      <button
                        type="button"
                        onClick={() => removeEmail(index)}
                        className="ml-2 text-blue-600 hover:text-blue-800 font-bold"
                      >
                        ×
                      </button>
                    </div>
                  );
                }}
              />
              <div className="flex gap-2 mt-4">
                <Button
                  onClick={handleSaveReportEmails}
                  className="w-full"
                  disabled={isSaving}
                >
                  {isSaving ? "Saving..." : "Save Emails"}
                </Button>
                <Button
                  onClick={handleClearReportEmails}
                  className="w-full"
                  variant="destructive"
                  disabled={isSaving}
                >
                  Clear Emails
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Remove Transactions Before Date */}
        <Card>
          <CardHeader>
            <CardTitle>Remove Transactions Before Date</CardTitle>
            <CardDescription>
              Delete all bets, draws, withdrawals, and deposits before the
              selected date.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <DatePicker
                date={clearDate ?? undefined}
                setDate={(date) => setClearDate(date ?? null)}
                className="w-full"
              />
              <Button
                variant="destructive"
                className="w-full"
                onClick={handleClearTransactions}
                disabled={isClearing || !clearDate}
              >
                {isClearing ? "Deleting..." : "Delete Transactions"}
              </Button>
              <div className="text-sm text-amber-700 bg-amber-100 border border-amber-300 rounded p-2">
                <b>Warning:</b> This action is irreversible. All transactions
                before the selected date will be permanently deleted.
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
} 