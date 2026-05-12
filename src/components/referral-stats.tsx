import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Users, TrendingUp, Gift, Award } from 'lucide-react';

export function ReferralStats() {

  // Mock data - replace with actual API data
  const referralStats = {
    totalReferrals: 12,
    activeReferrals: 8,
    totalEarnings: 2500,
    thisMonthEarnings: 450,
    level1Referrals: 8,
    level2Referrals: 3,
    level3Referrals: 1
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Referrals</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{referralStats.totalReferrals}</div>
            <p className="text-xs text-muted-foreground">
              +{referralStats.activeReferrals} active
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Earnings</CardTitle>
            <Gift className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">₹{referralStats.totalEarnings}</div>
            <p className="text-xs text-muted-foreground">
              +₹{referralStats.thisMonthEarnings} this month
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Level 1</CardTitle>
            <Award className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{referralStats.level1Referrals}</div>
            <p className="text-xs text-muted-foreground">
              3% bonus per deposit
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Network</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {referralStats.level2Referrals + referralStats.level3Referrals}
            </div>
            <p className="text-xs text-muted-foreground">
              Level 2 & 3 referrals
            </p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5" />
            Referral Network Breakdown
          </CardTitle>
          <CardDescription>
            Your referral network performance across all levels
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Badge variant="default" className="bg-primary">
                  Level 1
                </Badge>
                <span className="font-medium">Direct Referrals</span>
              </div>
              <div className="text-right">
                <div className="font-bold">{referralStats.level1Referrals}</div>
                <div className="text-sm text-muted-foreground">3% bonus</div>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Badge variant="secondary">
                  Level 2
                </Badge>
                <span className="font-medium">Secondary Referrals</span>
              </div>
              <div className="text-right">
                <div className="font-bold">{referralStats.level2Referrals}</div>
                <div className="text-sm text-muted-foreground">2% bonus</div>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Badge variant="outline">
                  Level 3
                </Badge>
                <span className="font-medium">Tertiary Referrals</span>
              </div>
              <div className="text-right">
                <div className="font-bold">{referralStats.level3Referrals}</div>
                <div className="text-sm text-muted-foreground">1% bonus</div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
} 