/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import {
  DollarSign,
  TrendingUp,
  QrCode,
  Users,
  CheckCircle2,
  Clock,
  AlertCircle,
  Download,
  Calendar,
  Filter,
  ArrowUpRight,
  ShieldCheck,
  FileText,
  CreditCard,
  Building2,
  Sparkles,
} from 'lucide-react';
import { DashboardRole } from '../types/dashboard';

interface PartnerFinancialLedgerProps {
  role: DashboardRole;
  partnerName?: string;
  partnerId?: string;
}

interface TransactionRecord {
  id: string;
  tokenNo: string;
  date: string;
  patientName: string;
  serviceOrRx: string;
  grossAmount: number;
  insurerClaimAmount: number;
  nhealthPayout: number;
  tokenStatus: 'Fully Redeemed' | 'Active' | 'Partial';
  settlementStatus: 'Settled' | 'Pending';
  utrNumber?: string;
}

export const PartnerFinancialLedgerSection: React.FC<PartnerFinancialLedgerProps> = ({
  role,
  partnerName = 'Partner Facility',
  partnerId = 'NH-PARTNER-01',
}) => {
  const [filterPeriod, setFilterPeriod] = useState<'all' | 'month' | 'week'>('all');
  const [filterTokenStatus, setFilterTokenStatus] = useState<string>('all');

  // Role-customized realistic mock transactions
  const getInitialRecords = (): TransactionRecord[] => {
    switch (role) {
      case 'Doctor':
        return [
          {
            id: 'TXN-DOC-901',
            tokenNo: 'TK-DOC-1082',
            date: '2026-10-29',
            patientName: 'Ramesh Chandra (62M)',
            serviceOrRx: 'Home Geriatric Clinical Evaluation',
            grossAmount: 1800,
            insurerClaimAmount: 1200,
            nhealthPayout: 1800,
            tokenStatus: 'Fully Redeemed',
            settlementStatus: 'Settled',
            utrNumber: 'CMS84920491823',
          },
          {
            id: 'TXN-DOC-902',
            tokenNo: 'TK-DOC-1083',
            date: '2026-10-28',
            patientName: 'Lakshmi Devi (58F)',
            serviceOrRx: 'Tele-Health Video Consultation + Rx',
            grossAmount: 850,
            insurerClaimAmount: 650,
            nhealthPayout: 850,
            tokenStatus: 'Fully Redeemed',
            settlementStatus: 'Settled',
            utrNumber: 'CMS84920491910',
          },
          {
            id: 'TXN-DOC-903',
            tokenNo: 'TK-DOC-1084',
            date: '2026-10-28',
            patientName: 'Sanjay Reddy (45M)',
            serviceOrRx: 'Post-Op Follow-Up Visit',
            grossAmount: 1500,
            insurerClaimAmount: 1000,
            nhealthPayout: 1500,
            tokenStatus: 'Active',
            settlementStatus: 'Pending',
          },
          {
            id: 'TXN-DOC-904',
            tokenNo: 'TK-DOC-1085',
            date: '2026-10-27',
            patientName: 'Kavitha V. (34F)',
            serviceOrRx: 'Cardiology Tele-Followup & ECG Review',
            grossAmount: 1200,
            insurerClaimAmount: 800,
            nhealthPayout: 1200,
            tokenStatus: 'Fully Redeemed',
            settlementStatus: 'Settled',
            utrNumber: 'CMS84920488211',
          },
        ];

      case 'Pharmacy':
        return [
          {
            id: 'TXN-PHAR-401',
            tokenNo: 'TK-PHAR-7711',
            date: '2026-10-29',
            patientName: 'Mrs. Jayasree Rao (64F)',
            serviceOrRx: 'Chronic Cardiac & BP 30-Day Refill',
            grossAmount: 3240,
            insurerClaimAmount: 2600,
            nhealthPayout: 3240,
            tokenStatus: 'Fully Redeemed',
            settlementStatus: 'Settled',
            utrNumber: 'CMS84920492144',
          },
          {
            id: 'TXN-PHAR-402',
            tokenNo: 'TK-PHAR-7712',
            date: '2026-10-29',
            patientName: 'K. Anand (42M)',
            serviceOrRx: 'Post-Op Antibiotic & Wound Care Pack',
            grossAmount: 1850,
            insurerClaimAmount: 1400,
            nhealthPayout: 1850,
            tokenStatus: 'Active',
            settlementStatus: 'Pending',
          },
          {
            id: 'TXN-PHAR-403',
            tokenNo: 'TK-PHAR-7713',
            date: '2026-10-28',
            patientName: 'S. Nagesh (51M)',
            serviceOrRx: 'Insulin Cold-Chain Cartridges (5 Units)',
            grossAmount: 4600,
            insurerClaimAmount: 3800,
            nhealthPayout: 4600,
            tokenStatus: 'Fully Redeemed',
            settlementStatus: 'Settled',
            utrNumber: 'CMS84920490082',
          },
          {
            id: 'TXN-PHAR-404',
            tokenNo: 'TK-PHAR-7714',
            date: '2026-10-27',
            patientName: 'P. Swathi (29F)',
            serviceOrRx: 'Pediatric Syrups & Nebulizer Kit',
            grossAmount: 920,
            insurerClaimAmount: 0,
            nhealthPayout: 920,
            tokenStatus: 'Partial',
            settlementStatus: 'Settled',
            utrNumber: 'CMS84920487431',
          },
        ];

      case 'Diagnostics':
        return [
          {
            id: 'TXN-LAB-301',
            tokenNo: 'TK-LAB-4401',
            date: '2026-10-29',
            patientName: 'Sita Raman (69F)',
            serviceOrRx: 'Comprehensive Geriatric Full Body Panel (64 Tests)',
            grossAmount: 2800,
            insurerClaimAmount: 2200,
            nhealthPayout: 2800,
            tokenStatus: 'Fully Redeemed',
            settlementStatus: 'Settled',
            utrNumber: 'CMS84920493399',
          },
          {
            id: 'TXN-LAB-302',
            tokenNo: 'TK-LAB-4402',
            date: '2026-10-29',
            patientName: 'Mohammed Fazal (48M)',
            serviceOrRx: 'Fasting Lipid & HbA1c Cold-Chain Barcode',
            grossAmount: 1100,
            insurerClaimAmount: 850,
            nhealthPayout: 1100,
            tokenStatus: 'Active',
            settlementStatus: 'Pending',
          },
          {
            id: 'TXN-LAB-303',
            tokenNo: 'TK-LAB-4403',
            date: '2026-10-28',
            patientName: 'B. Vinay Kumar (36M)',
            serviceOrRx: 'Thyroid Full Profile + Vitamin D3/B12',
            grossAmount: 1650,
            insurerClaimAmount: 1200,
            nhealthPayout: 1650,
            tokenStatus: 'Fully Redeemed',
            settlementStatus: 'Settled',
            utrNumber: 'CMS84920491022',
          },
          {
            id: 'TXN-LAB-304',
            tokenNo: 'TK-LAB-4404',
            date: '2026-10-27',
            patientName: 'Sunita Rao (55F)',
            serviceOrRx: 'Portable Home Digital X-Ray Chest PA',
            grossAmount: 1800,
            insurerClaimAmount: 1500,
            nhealthPayout: 1800,
            tokenStatus: 'Fully Redeemed',
            settlementStatus: 'Settled',
            utrNumber: 'CMS84920489501',
          },
        ];

      default:
        return [
          {
            id: 'TXN-GEN-201',
            tokenNo: 'TK-GEN-5511',
            date: '2026-10-29',
            patientName: 'Patient Rekha Sharma',
            serviceOrRx: 'Healthcare Service Fulfillment',
            grossAmount: 2400,
            insurerClaimAmount: 1800,
            nhealthPayout: 2400,
            tokenStatus: 'Fully Redeemed',
            settlementStatus: 'Settled',
            utrNumber: 'CMS84920495110',
          },
          {
            id: 'TXN-GEN-202',
            tokenNo: 'TK-GEN-5512',
            date: '2026-10-28',
            patientName: 'Patient V. Venkatesh',
            serviceOrRx: 'Care Dispatch & Assistance',
            grossAmount: 1500,
            insurerClaimAmount: 1000,
            nhealthPayout: 1500,
            tokenStatus: 'Active',
            settlementStatus: 'Pending',
          },
        ];
    }
  };

  const records = getInitialRecords();

  const filteredRecords = records.filter((r) => {
    if (filterTokenStatus !== 'all' && r.tokenStatus !== filterTokenStatus) return false;
    return true;
  });

  // Calculate aggregates
  const totalOrders = records.length * 48; // Scaled for realistic partner volume
  const patientsServed = Math.round(totalOrders * 0.88);
  const totalGrossEarnings = records.reduce((sum, r) => sum + r.grossAmount, 0) * 48;
  const totalSettledAmount = records
    .filter((r) => r.settlementStatus === 'Settled')
    .reduce((sum, r) => sum + r.nhealthPayout, 0) * 48;
  const totalPendingPayout = records
    .filter((r) => r.settlementStatus === 'Pending')
    .reduce((sum, r) => sum + r.nhealthPayout, 0) * 48;
  const totalInsurerClaimable = records.reduce((sum, r) => sum + r.insurerClaimAmount, 0) * 48;

  const handleExportCSV = () => {
    const csvContent =
      'data:text/csv;charset=utf-8,' +
      ['Transaction ID,Token No,Date,Patient,Service,Gross Amount (INR),Insurer Claim (INR),Nhealth Payout (INR),Token Status,Settlement Status,UTR Number']
        .concat(
          records.map(
            (r) =>
              `${r.id},${r.tokenNo},${r.date},"${r.patientName}","${r.serviceOrRx}",${r.grossAmount},${r.insurerClaimAmount},${r.nhealthPayout},${r.tokenStatus},${r.settlementStatus},${r.utrNumber || 'N/A'}`
          )
        )
        .join('\n');

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `Nhealth_${role}_Financial_Ledger_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="p-5 sm:p-6 rounded-3xl bg-gradient-to-r from-slate-900 via-[#002b49] to-teal-950 text-white border border-teal-500/30 shadow-xl">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-teal-500/20 text-teal-300 border border-teal-400/30 text-xs font-semibold">
              <CreditCard className="w-3.5 h-3.5" />
              Real-Time Partner Payouts &amp; Operational Ledger
            </div>
            <h3 className="text-xl sm:text-2xl font-black text-white tracking-tight">
              {role} Operational Analytics &amp; Financial Settlement Ledger
            </h3>
            <p className="text-xs sm:text-sm text-slate-300">
              Verified records for <strong>{partnerName}</strong> ({partnerId}) • Direct Nhealth Escrow &amp; Insurer Cashless Settlement
            </p>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={handleExportCSV}
              className="px-4 py-2.5 rounded-xl bg-teal-600 hover:bg-teal-500 text-white font-bold text-xs sm:text-sm shadow-lg shadow-teal-950/40 flex items-center gap-2 transition-all cursor-pointer"
            >
              <Download className="w-4 h-4" />
              Export Financial Ledger (CSV)
            </button>
          </div>
        </div>

        {/* 4 Primary Operational & Financial KPI Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mt-6 pt-5 border-t border-white/10">
          <div className="p-4 rounded-2xl bg-white/5 border border-white/10">
            <span className="text-[11px] font-bold uppercase tracking-wider text-teal-300 block">
              Total {role === 'Pharmacy' ? 'Prescriptions' : 'Orders'} Processed
            </span>
            <div className="text-2xl sm:text-3xl font-black text-white mt-1">
              {totalOrders.toLocaleString()}
            </div>
            <span className="text-[10px] text-emerald-400 font-semibold mt-1 flex items-center gap-1">
              <CheckCircle2 className="w-3 h-3" /> 100% Digitally Verified
            </span>
          </div>

          <div className="p-4 rounded-2xl bg-white/5 border border-white/10">
            <span className="text-[11px] font-bold uppercase tracking-wider text-teal-300 block">
              Patients Visited / Served
            </span>
            <div className="text-2xl sm:text-3xl font-black text-white mt-1">
              {patientsServed.toLocaleString()}
            </div>
            <span className="text-[10px] text-slate-300 mt-1 block">
              Across Home &amp; Digital Touchpoints
            </span>
          </div>

          <div className="p-4 rounded-2xl bg-white/5 border border-white/10">
            <span className="text-[11px] font-bold uppercase tracking-wider text-teal-300 block">
              QR Code / Token Redemption
            </span>
            <div className="text-2xl sm:text-3xl font-black text-cyan-300 mt-1">
              94.8%
            </div>
            <span className="text-[10px] text-cyan-200 mt-1 block">
              Fully Redeemed &amp; Verified
            </span>
          </div>

          <div className="p-4 rounded-2xl bg-emerald-950/40 border border-emerald-500/30">
            <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-300 block">
              Total Partner Earnings (INR)
            </span>
            <div className="text-2xl sm:text-3xl font-black text-emerald-400 mt-1">
              ₹ {totalGrossEarnings.toLocaleString()}
            </div>
            <span className="text-[10px] text-emerald-300 mt-1 block">
              Net Direct Settlement Escrow
            </span>
          </div>
        </div>
      </div>

      {/* Financial Settlement Breakdown Bar */}
      <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200/90 shadow-2xs space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-3">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-teal-600" />
            <h4 className="text-sm font-bold text-slate-900">
              Settlement Ledger Balance &amp; Insurer Reconciliation
            </h4>
          </div>
          <div className="text-xs text-slate-500">
            Settlement Frequency: <strong>Daily T+1 Automated NEFT / IMPS</strong>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
          <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200">
            <span className="text-emerald-800 font-medium block">Settled &amp; Disbursed to Bank</span>
            <span className="text-lg font-black text-emerald-700 block mt-0.5">
              ₹ {totalSettledAmount.toLocaleString()}
            </span>
            <span className="text-[10.5px] text-emerald-600 mt-0.5 block">
              Directly credited via automated CMS banking
            </span>
          </div>

          <div className="p-3.5 rounded-xl bg-amber-50 border border-amber-200">
            <span className="text-amber-800 font-medium block">Pending Payout (In Escrow T+2)</span>
            <span className="text-lg font-black text-amber-700 block mt-0.5">
              ₹ {totalPendingPayout.toLocaleString()}
            </span>
            <span className="text-[10.5px] text-amber-600 mt-0.5 block">
              Processing for next banking settlement cycle
            </span>
          </div>

          <div className="p-3.5 rounded-xl bg-blue-50 border border-blue-200">
            <span className="text-blue-800 font-medium block">Amount Claimable From Insurer (TPA)</span>
            <span className="text-lg font-black text-blue-700 block mt-0.5">
              ₹ {totalInsurerClaimable.toLocaleString()}
            </span>
            <span className="text-[10.5px] text-blue-600 mt-0.5 block">
              Pre-authorized under cashless TPA guidelines
            </span>
          </div>
        </div>
      </div>

      {/* Transaction & QR Token Ledger Table */}
      <div className="bg-white rounded-3xl border border-slate-200/90 shadow-2xs overflow-hidden">
        <div className="p-4 sm:p-5 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-slate-50/50">
          <div>
            <h4 className="text-sm font-bold text-slate-900">
              Transaction Itemization &amp; QR Token Audit Log
            </h4>
            <p className="text-xs text-slate-500">
              Real-time audit log with patient details, token redemption state, and insurer claim splits.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <select
              value={filterTokenStatus}
              onChange={(e) => setFilterTokenStatus(e.target.value)}
              className="bg-white border border-slate-200 rounded-xl px-3 py-1.5 text-xs text-slate-700 font-semibold focus:outline-none focus:ring-1 focus:ring-teal-500"
            >
              <option value="all">All Token States</option>
              <option value="Fully Redeemed">Fully Redeemed</option>
              <option value="Active">Active / Pending Scan</option>
              <option value="Partial">Partial Fulfillment</option>
            </select>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-100/70 border-b border-slate-200 text-slate-500 uppercase tracking-wider text-[10.5px] font-bold">
              <tr>
                <th className="px-4 py-3">Txn &amp; Token #</th>
                <th className="px-4 py-3">Patient &amp; Service</th>
                <th className="px-4 py-3 text-right">Gross Total</th>
                <th className="px-4 py-3 text-right">Insurer Claim</th>
                <th className="px-4 py-3 text-right">Nhealth Payout</th>
                <th className="px-4 py-3 text-center">QR Token Status</th>
                <th className="px-4 py-3 text-center">Settlement Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredRecords.map((r) => (
                <tr key={r.id} className="hover:bg-teal-50/20 transition-colors">
                  <td className="px-4 py-3.5">
                    <div className="font-bold text-slate-900">{r.id}</div>
                    <div className="text-[11px] font-mono font-semibold text-teal-700 mt-0.5 flex items-center gap-1">
                      <QrCode className="w-3 h-3 text-teal-600" />
                      {r.tokenNo}
                    </div>
                    <div className="text-[10px] text-slate-400 mt-0.5">{r.date}</div>
                  </td>

                  <td className="px-4 py-3.5">
                    <div className="font-semibold text-slate-900">{r.patientName}</div>
                    <div className="text-[11px] text-slate-500 mt-0.5">{r.serviceOrRx}</div>
                  </td>

                  <td className="px-4 py-3.5 text-right font-bold text-slate-900">
                    ₹ {r.grossAmount.toLocaleString()}
                  </td>

                  <td className="px-4 py-3.5 text-right text-blue-700 font-semibold">
                    ₹ {r.insurerClaimAmount.toLocaleString()}
                  </td>

                  <td className="px-4 py-3.5 text-right font-black text-emerald-700">
                    ₹ {r.nhealthPayout.toLocaleString()}
                  </td>

                  <td className="px-4 py-3.5 text-center">
                    <span
                      className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                        r.tokenStatus === 'Fully Redeemed'
                          ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                          : r.tokenStatus === 'Active'
                          ? 'bg-blue-50 text-blue-700 border border-blue-200'
                          : 'bg-amber-50 text-amber-700 border border-amber-200'
                      }`}
                    >
                      {r.tokenStatus}
                    </span>
                  </td>

                  <td className="px-4 py-3.5 text-center">
                    {r.settlementStatus === 'Settled' ? (
                      <div>
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-bold">
                          <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                          Settled
                        </span>
                        {r.utrNumber && (
                          <div className="text-[9.5px] font-mono text-slate-400 mt-0.5">
                            UTR: {r.utrNumber}
                          </div>
                        )}
                      </div>
                    ) : (
                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-800 text-[10px] font-bold">
                        <Clock className="w-3 h-3 text-amber-600" />
                        Pending (T+2)
                      </span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
