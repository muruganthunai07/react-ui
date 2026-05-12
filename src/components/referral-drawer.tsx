import { Button } from '@/components/ui/button';
import { Drawer, DrawerContent, DrawerDescription, DrawerHeader, DrawerTitle, DrawerTrigger } from '@/components/ui/drawer';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useAuth } from '@/contexts/auth-context';
import { useState } from 'react';
import { Copy, Users, Gift, TrendingUp, Info, Share2, CheckCircle } from 'lucide-react';
import { TENANT_APP_NAME } from '@/config/tenant';

export function ReferralDrawer() {
  const { user } = useAuth();
  const referralCode = user?.referralCode || '';
  const [copied, setCopied] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  const handleCopy = () => {
    if (referralCode) {
      navigator.clipboard.writeText(referralCode);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleShare = () => {
    if (navigator.share) {
      const shareUrl = `${window.location.origin}?referral=${referralCode}`;
      navigator.share({
        title: `Join ${TENANT_APP_NAME} with my referral code!`,
        text: `Use my referral code ${referralCode} to get started on ${TENANT_APP_NAME}!`,
        url: shareUrl
      });
    } else {
      handleCopy();
    }
  };

  return (
    <Drawer open={isOpen} onOpenChange={setIsOpen}>
      <DrawerTrigger asChild>
        <Button className="w-full">
          <Share2 className="h-4 w-4 mr-2" />
          Open Referral Program
        </Button>
      </DrawerTrigger>
      <DrawerContent>
        <div className="mx-auto w-full max-w-md">
          <DrawerHeader className="border-b">
            <DrawerTitle className="flex items-center gap-2">
              <Gift className="h-5 w-5 text-primary" />
              Referral Program
            </DrawerTitle>
            <DrawerDescription>
              Invite friends and earn bonuses on their first deposits
            </DrawerDescription>
          </DrawerHeader>
          
          <ScrollArea className="h-[calc(100vh-200px)] max-h-[600px]">
            <div className="p-4 space-y-6">
              {/* Referral Code Section */}
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Users className="h-5 w-5" />
                    Your Referral Code
                  </CardTitle>
                  <CardDescription>
                    Share this code with friends to earn bonuses
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
                    <span className="font-mono text-lg tracking-wider font-bold">
                      {referralCode}
                    </span>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={handleCopy}
                      className="ml-2"
                    >
                      {copied ? (
                        <CheckCircle className="h-4 w-4 text-green-600" />
                      ) : (
                        <Copy className="h-4 w-4" />
                      )}
                    </Button>
                  </div>
                  <div className="flex gap-2">
                    <Button onClick={handleShare} className="flex-1">
                      <Share2 className="h-4 w-4 mr-2" />
                      Share
                    </Button>
                  </div>
                  {copied && (
                    <p className="text-sm text-green-600 text-center">
                      Referral code copied to clipboard!
                    </p>
                  )}
                </CardContent>
              </Card>

              {/* How It Works Section */}
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Info className="h-5 w-5" />
                    How It Works
                  </CardTitle>
                  <CardDescription>
                    Understanding our 3-level referral system
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Level 1 */}
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <Badge variant="default" className="bg-primary">
                        Level 1
                      </Badge>
                      <span className="font-semibold">Direct Referral (3% Bonus)</span>
                    </div>
                    <p className="text-sm text-muted-foreground pl-4">
                      When someone uses your referral code and makes their first deposit, 
                      you earn 3% of their deposit amount as a bonus.
                    </p>
                  </div>

                  <Separator />

                  {/* Level 2 */}
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <Badge variant="secondary">
                        Level 2
                      </Badge>
                      <span className="font-semibold">Secondary (2% Bonus)</span>
                    </div>
                    <p className="text-sm text-muted-foreground pl-4">
                      If someone you referred refers another person, you earn 2% of 
                      that new person's first deposit as a secondary bonus.
                    </p>
                  </div>

                  <Separator />

                  {/* Level 3 */}
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <Badge variant="outline">
                        Level 3
                      </Badge>
                      <span className="font-semibold">Tertiary (1% Bonus)</span>
                    </div>
                    <p className="text-sm text-muted-foreground pl-4">
                      You also earn 1% bonus from third-level referrals in your network.
                    </p>
                  </div>
                </CardContent>
              </Card>

              {/* Example Section */}
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg flex items-center gap-2">
                    <TrendingUp className="h-5 w-5" />
                    Example Scenario
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="text-sm space-y-2">
                    <p className="font-medium">When your referral deposits ₹1000:</p>
                    <div className="space-y-1 pl-4">
                      <p className="text-muted-foreground">
                        • You (Level 1): <span className="text-green-600 font-medium">₹30 bonus</span>
                      </p>
                      <p className="text-muted-foreground">
                        • Your referrer (Level 2): <span className="text-green-600 font-medium">₹20 bonus</span>
                      </p>
                      <p className="text-muted-foreground">
                        • Your referrer's referrer (Level 3): <span className="text-green-600 font-medium">₹10 bonus</span>
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Important Notes */}
              <Card className="border-orange-200 bg-orange-50">
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg text-orange-800">
                    Important Notes
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <ul className="text-sm text-orange-700 space-y-1">
                    <li>• Bonuses are paid on every referral user deposits</li>
                    <li>• Referral code must be used during registration</li>
                    <li>• Bonuses are automatically credited after deposit approval</li>
                    <li>• No limit on number of referrals you can make</li>
                  </ul>
                </CardContent>
              </Card>
            </div>
          </ScrollArea>
        </div>
      </DrawerContent>
    </Drawer>
  );
} 