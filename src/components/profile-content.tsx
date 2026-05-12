import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAuth } from "@/contexts/auth-context";
import { TENANT_REFERRAL_SUPPORTED } from "@/config/tenant";
import { ReferralDrawer } from "./referral-drawer";
import { TransactionHistory } from "./transaction-history";

export function ProfileContent() {
  const { user } = useAuth();

  return (
    <div className="container max-w-4xl px-4 py-6 md:py-8">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
        <div className="flex items-center gap-4">
          <Avatar className="h-16 w-16 border-2 border-primary">
            <AvatarImage src="/placeholder.svg" alt="User" />
            <AvatarFallback>
              {user?.name
                ? user.name
                    .split(" ")
                    .map((n) => n[0])
                    .join("")
                    .toUpperCase()
                    .slice(0, 2)
                : ""}
            </AvatarFallback>
          </Avatar>
          <div>
            <h1 className="text-2xl font-bold">{user?.name}</h1>
            <p className="text-muted-foreground">Welcome back!</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 mb-8">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-muted-foreground">
              Current Balance
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">
              Rs.{user?.userBalance?.totalBalance}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-muted-foreground">
              Winning Balance
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">
              Rs.{user?.userBalance?.winningBalance}
            </p>
          </CardContent>
        </Card>
      </div>

      {TENANT_REFERRAL_SUPPORTED ? (
        <Tabs defaultValue="referral" className="mt-6">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="referral">Referral</TabsTrigger>
            <TabsTrigger value="transactions">Transactions</TabsTrigger>
          </TabsList>
          <TabsContent value="referral" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  🎁 Invite Friends & Earn
                </CardTitle>
                <p className="text-muted-foreground">
                  Share your referral code and earn bonuses on every first deposit
                  your friends make
                </p>
              </CardHeader>
              <CardContent>
                <ReferralDrawer />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="transactions" className="mt-4">
            <TransactionHistory userId={null} />
          </TabsContent>
        </Tabs>
      ) : (
        <div className="mt-6">
          <TransactionHistory userId={null} />
        </div>
      )}
    </div>
  );
}
