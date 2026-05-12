import { useState, useEffect } from 'react';
import { AdminLayout } from '@/components/admin-layout';
import { TENANT_REFERRAL_SUPPORTED } from '@/config/tenant';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import {
  SalesReport,
  DrawReport,
  DBFReport,
  CostReport,
  WithdrawCommissionReport,
  ReferralBonusReport
} from './reports/index';

export default function ReportsPage() {
  const [reportType, setReportType] = useState('sales');

  useEffect(() => {
    if (!TENANT_REFERRAL_SUPPORTED && reportType === 'referral-bonus') {
      setReportType('sales');
    }
  }, [reportType]);

  const renderReport = () => {
    switch (reportType) {
      case 'draw':
        return <DrawReport />;
      case 'dbf':
        return <DBFReport />;
      case 'cost':
        return <CostReport />;
      case 'withdraw-commission':
        return <WithdrawCommissionReport />;
      case 'referral-bonus':
        return TENANT_REFERRAL_SUPPORTED ? (
          <ReferralBonusReport />
        ) : (
          <SalesReport />
        );
      case 'sales':
      default:
        return <SalesReport />;
    }
  };

  return (
    <AdminLayout>
      <div className='space-y-4'>
        <div className='w-full max-w-md'>
          <Select value={reportType} onValueChange={setReportType}>
            <SelectTrigger className='border-2 border-primary/50 focus:border-primary focus:ring-0'>
              <SelectValue placeholder='Select report type' />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value='sales'>Sales</SelectItem>
              <SelectItem value='draw'>Draw</SelectItem>
              <SelectItem value='dbf'>DBF</SelectItem>
              <SelectItem value='cost'>Cost</SelectItem>
              <SelectItem value='withdraw-commission'>Withdraw Commission</SelectItem>
              {TENANT_REFERRAL_SUPPORTED ? (
                <SelectItem value='referral-bonus'>Referral Bonus</SelectItem>
              ) : null}
            </SelectContent>
          </Select>
        </div>
        {renderReport()}
      </div>
    </AdminLayout>
  );
}
