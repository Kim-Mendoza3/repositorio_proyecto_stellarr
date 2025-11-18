'use client';

import { useSearchParams } from 'next/navigation';
import AuthGuard from '@/components/auth/AuthGuard';
import PartnerCompanies from '@/components/PartnerCompanies';
import CreditScoringFlow from '@/components/CreditScoringFlow';

/**
 * EBAS Credit Application Page (Protected)
 * Displays partners first, then credit flow when partner is selected
 */
export default function EBASCredit() {
  const searchParams = useSearchParams();
  const selectedPartner = searchParams.get('partner');

  return (
    <AuthGuard>
      {selectedPartner ? (
        <CreditScoringFlow partnerName={selectedPartner} />
      ) : (
        <PartnerCompanies />
      )}
    </AuthGuard>
  );
}
