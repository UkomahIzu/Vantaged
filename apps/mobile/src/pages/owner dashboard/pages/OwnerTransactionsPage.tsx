import React, { useEffect, useMemo, useState } from 'react';
import {
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import Svg, { Circle, Line, Path, Polyline } from 'react-native-svg';

import { fontStyle, useOwnerMobile } from '../context/OwnerMobileContext';
import {
  DEMO_OWNER_PROJECT_SUMMARIES,
  DEMO_OWNER_TRANSACTIONS,
  type OwnerMobileProjectFinancialSummary,
  type OwnerMobileTransactionItem,
} from '../data/ownerDashboardData';
import { EscrowShieldIcon, OwnerNavIcon } from '../components/OwnerIcons';

function formatNairaShort(num: number): string {
  if (num >= 1_000_000_000) return `₦${(num / 1_000_000_000).toFixed(2)}B`;
  if (num >= 1_000_000) return `₦${(num / 1_000_000).toFixed(1)}M`;
  return `₦${num.toLocaleString('en-NG')}`;
}

const MONTHLY_CHART_BARS = [
  { label: 'May', valueLabel: '₦35M', pct: 30, projected: false, current: false },
  { label: 'Jun', valueLabel: '₦48M', pct: 42, projected: false, current: false },
  { label: 'Jul', valueLabel: '₦58M', pct: 50, projected: false, current: false },
  { label: 'Aug', valueLabel: '₦72M', pct: 65, projected: false, current: false },
  { label: 'Sep', valueLabel: '₦92M', pct: 82, projected: false, current: false },
  { label: 'Oct', valueLabel: '₦80M', pct: 70, projected: false, current: true },
  { label: 'Nov', valueLabel: '₦65M', pct: 58, projected: true, current: false },
  { label: 'Dec', valueLabel: '₦52M', pct: 46, projected: true, current: false },
  { label: 'Jan', valueLabel: '₦40M', pct: 35, projected: true, current: false },
];

const CATEGORY_BREAKDOWN = [
  { label: 'Walls & Concrete Decking', pct: 42, amount: '₦268.8M', color: '#EF5F18' },
  { label: 'Foundation & Ground Digging', pct: 26, amount: '₦166.4M', color: '#261A66' },
  { label: 'Pipes, Wiring & Plumbing', pct: 18, amount: '₦115.2M', color: '#5E4DB2' },
  { label: 'Finishing: Painting, Tiles & Windows', pct: 10, amount: '₦64.0M', color: '#248246' },
  { label: 'Extra Work Added Later', pct: 4, amount: '₦25.6M', color: '#FA8747' },
];

export function OwnerTransactionsPage() {
  const { palette, isDemoMode } = useOwnerMobile();

  const [projectSummaries, setProjectSummaries] = useState<
    OwnerMobileProjectFinancialSummary[]
  >(isDemoMode ? DEMO_OWNER_PROJECT_SUMMARIES : []);
  const [transactions, setTransactions] = useState<OwnerMobileTransactionItem[]>(
    isDemoMode ? DEMO_OWNER_TRANSACTIONS : []
  );

  useEffect(() => {
    setProjectSummaries(isDemoMode ? DEMO_OWNER_PROJECT_SUMMARIES : []);
    setTransactions(isDemoMode ? DEMO_OWNER_TRANSACTIONS : []);
  }, [isDemoMode]);

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedProjectFilter, setSelectedProjectFilter] = useState('All Buildings');
  const [selectedTypeFilter, setSelectedTypeFilter] = useState('All Payment Types');
  const [selectedStatusFilter, setSelectedStatusFilter] = useState('All Statuses');
  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);

  const [inspectedTx, setInspectedTx] = useState<OwnerMobileTransactionItem | null>(null);
  const [infoTip, setInfoTip] = useState<{ title: string; body: string } | null>(null);
  const [isDownloadModalOpen, setIsDownloadModalOpen] = useState(false);

  const [isDepositModalOpen, setIsDepositModalOpen] = useState(false);
  const [depositStep, setDepositStep] = useState<'form' | 'success'>('form');
  const [depositAmountInput, setDepositAmountInput] = useState('25000000');
  const [depositMethod, setDepositMethod] = useState<'bank_transfer' | 'card'>('bank_transfer');
  const [lastDepositRef, setLastDepositRef] = useState<string>('');

  // Aggregated Totals (Matching web OwnerTransactionsPage)
  const totalCommittedBudget = useMemo(
    () => projectSummaries.reduce((acc, p) => acc + p.currentContractValue, 0),
    [projectSummaries]
  );
  const totalDisbursed = useMemo(
    () => projectSummaries.reduce((acc, p) => acc + p.disbursedAmount, 0),
    [projectSummaries]
  );
  const totalInEscrow = useMemo(
    () => projectSummaries.reduce((acc, p) => acc + p.inEscrowAmount, 0),
    [projectSummaries]
  );
  const totalRetainage = useMemo(
    () => projectSummaries.reduce((acc, p) => acc + p.retainageAmount, 0),
    [projectSummaries]
  );
  const totalPendingAction = useMemo(
    () =>
      transactions
        .filter(
          (t) =>
            t.status === 'Sent – Builder to Confirm' || t.status === 'Issue Reported'
        )
        .reduce((acc, t) => acc + t.amount, 0),
    [transactions]
  );

  const filteredTransactions = useMemo(() => {
    return transactions.filter((t) => {
      if (
        selectedProjectFilter !== 'All Buildings' &&
        t.projectTitle !== selectedProjectFilter
      ) {
        return false;
      }
      if (
        selectedTypeFilter !== 'All Payment Types' &&
        t.type !== selectedTypeFilter
      ) {
        return false;
      }
      if (
        selectedStatusFilter !== 'All Statuses' &&
        t.status !== selectedStatusFilter
      ) {
        return false;
      }
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        if (
          !t.reference.toLowerCase().includes(q) &&
          !t.bankSessionId.toLowerCase().includes(q) &&
          !t.projectTitle.toLowerCase().includes(q) &&
          !t.contractorName.toLowerCase().includes(q) &&
          !t.stageTitle.toLowerCase().includes(q)
        ) {
          return false;
        }
      }
      return true;
    });
  }, [
    transactions,
    selectedProjectFilter,
    selectedTypeFilter,
    selectedStatusFilter,
    searchQuery,
  ]);

  const activeFilterCount =
    (selectedProjectFilter !== 'All Buildings' ? 1 : 0) +
    (selectedTypeFilter !== 'All Payment Types' ? 1 : 0) +
    (selectedStatusFilter !== 'All Statuses' ? 1 : 0);

  const handleExecuteDeposit = () => {
    const rawVal = depositAmountInput.replace(/[^0-9]/g, '');
    const parsedAmount = Math.max(10000, parseInt(rawVal, 10) || 25000000);
    const targetProject = projectSummaries[0];
    const targetTitle = targetProject?.title || 'New Building Escrow';
    const newRef = `DEP-2026-${Math.floor(10000 + Math.random() * 90000)}`;

    if (targetProject) {
      setProjectSummaries((prev) =>
        prev.map((p, idx) =>
          idx === 0 ? { ...p, inEscrowAmount: p.inEscrowAmount + parsedAmount } : p
        )
      );
    } else {
      setProjectSummaries([
        {
          id: `proj-${Date.now()}`,
          title: targetTitle,
          contractor: 'Verified Builder',
          currentContractValue: parsedAmount,
          disbursedAmount: 0,
          inEscrowAmount: parsedAmount,
          retainageAmount: 0,
        },
      ]);
    }

    const newTx: OwnerMobileTransactionItem = {
      id: `tx-dep-${Date.now()}`,
      reference: newRef,
      bankSessionId: `NIBSS/00001426${Math.floor(1000000000 + Math.random() * 9000000000)}`,
      projectId: targetProject?.id || 'proj-new',
      projectTitle: targetTitle,
      contractorName: targetProject?.contractor || 'Verified Builder',
      stageTitle: 'Escrow Deposit for Upcoming Milestones',
      type: 'Deposited on Vantaged',
      amount: parsedAmount,
      date: 'Today, Just now',
      paymentMethod:
        depositMethod === 'bank_transfer'
          ? 'Zenith Bank (Vantaged Escrow)'
          : 'Debit Card',
      status: 'Deposited on Vantaged',
      notes: `₦${parsedAmount.toLocaleString(
        'en-NG'
      )} deposited by owner into secure bank escrow.`,
    };

    setTransactions((prev) => [newTx, ...prev]);
    setLastDepositRef(newRef);
    setDepositStep('success');
  };

  const kpiCards = [
    {
      label: 'TOTAL AGREED BUDGET',
      value: formatNairaShort(totalCommittedBudget),
      tone: 'default' as const,
      tip: 'The full cost agreed with builders to finish your buildings, plus any extra work you approved.',
    },
    {
      label: 'MONEY PAID OUT',
      value: formatNairaShort(totalDisbursed),
      tone: 'default' as const,
      tip: 'Total money already paid to builders for work that was checked and finished on site.',
    },
    {
      label: 'MONEY DEPOSITED ON VANTAGED',
      value: formatNairaShort(totalInEscrow),
      tone: 'orange-text' as const,
      tip: 'Money deposited into your secure project escrow on Vantaged. Builders cannot touch this until you approve release.',
    },
    {
      label: 'FINAL SECURITY HOLD (5%)',
      value: formatNairaShort(totalRetainage),
      tone: 'default' as const,
      tip: '5% of every payment is held back until the house is 100% finished to guarantee defect fixes.',
    },
    {
      label: 'WAITING ON BUILDER',
      value: formatNairaShort(totalPendingAction),
      tone: 'warm-card' as const,
      tip: "Money you approved and sent to a builder. Builders have 3 days to click 'Confirm' to verify it arrived safely.",
    },
  ];

  const getStatusColors = (status: OwnerMobileTransactionItem['status']) => {
    switch (status) {
      case 'Received by Builder':
        return { bg: palette.greenBg, border: palette.greenBorder, text: palette.greenText };
      case 'Sent – Builder to Confirm':
        return { bg: palette.brandSoftBg, border: palette.brandSoftBorder, text: palette.brandSoftText };
      case 'Deposited on Vantaged':
        return { bg: palette.indigoSoftBg, border: palette.indigoSoftBorder, text: palette.indigoSoftText };
      default:
        return { bg: '#FFF1F2', border: '#FECDD3', text: '#BE123C' };
    }
  };

  return (
    <>
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}>
        {/* 1. Page Header & Quick Actions */}
        <View style={styles.headerBlock}>
          <Text style={[styles.title, fontStyle('extrabold'), { color: palette.textPrimary }]}>
            Payments & Building Costs
          </Text>
          <Text style={[styles.subtitle, fontStyle('regular'), { color: palette.textSecondary }]}>
            A simple, clear record of all money spent on your building projects. See what you have paid, what is safely kept in the bank, and what payments are coming up next.
          </Text>

          <View style={styles.actionRow}>
            <Pressable
              onPress={() => setIsDownloadModalOpen(true)}
              style={[
                styles.secondaryBtn,
                { backgroundColor: palette.surface, borderColor: palette.border },
              ]}>
              <Svg width={14} height={14} viewBox="0 0 24 24" fill="none">
                <Path
                  d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"
                  stroke={palette.textMuted}
                  strokeWidth={2}
                  strokeLinecap="round"
                />
                <Polyline
                  points="7 10 12 15 17 10"
                  stroke={palette.textMuted}
                  strokeWidth={2}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <Line
                  x1="12"
                  y1="15"
                  x2="12"
                  y2="3"
                  stroke={palette.textMuted}
                  strokeWidth={2}
                  strokeLinecap="round"
                />
              </Svg>
              <Text style={[styles.secondaryBtnText, fontStyle('bold'), { color: palette.textPrimary }]}>
                Payment Summary
              </Text>
            </Pressable>

            <Pressable
              onPress={() => {
                setDepositStep('form');
                setIsDepositModalOpen(true);
              }}
              style={[styles.primaryBtn, { backgroundColor: palette.brandOrange }]}>
              <Text style={[styles.primaryBtnText, fontStyle('extrabold')]}>
                + Deposit Funds
              </Text>
            </Pressable>
          </View>
        </View>

        {/* 2. 5 Simplified Summary KPI Cards */}
        <View style={styles.kpiGrid}>
          {kpiCards.map((card) => {
            const isWarm = card.tone === 'warm-card';
            const isOrangeText = card.tone === 'orange-text';
            return (
              <View
                key={card.label}
                style={[
                  styles.kpiCard,
                  {
                    backgroundColor: isWarm ? palette.brandSoftBg : palette.surface,
                    borderColor: isWarm ? palette.brandSoftBorder : palette.border,
                  },
                ]}>
                <View style={styles.kpiTopRow}>
                  <Text
                    style={[
                      styles.kpiLabel,
                      fontStyle('extrabold'),
                      { color: isWarm ? palette.brandSoftText : palette.textMuted },
                    ]}>
                    {card.label}
                  </Text>
                  <Pressable
                    onPress={() => setInfoTip({ title: card.label, body: card.tip })}
                    style={[
                      styles.tipBadge,
                      {
                        backgroundColor: isWarm
                          ? palette.brandSoftBorder
                          : palette.surfaceSubtle,
                      },
                    ]}>
                    <Text
                      style={[
                        styles.tipText,
                        fontStyle('bold'),
                        { color: isWarm ? palette.brandSoftText : palette.textMuted },
                      ]}>
                      ?
                    </Text>
                  </Pressable>
                </View>
                <Text
                  style={[
                    styles.kpiValue,
                    fontStyle('extrabold'),
                    {
                      color: isOrangeText
                        ? palette.brandOrange
                        : isWarm
                        ? palette.brandSoftText
                        : palette.textPrimary,
                      fontVariant: ['tabular-nums'],
                    },
                  ]}>
                  {card.value}
                </Text>
              </View>
            );
          })}
        </View>

        {/* 3. Monthly Spending & Future Costs Bar Graph */}
        <View
          style={[
            styles.card,
            { backgroundColor: palette.surface, borderColor: palette.border },
          ]}>
          <View style={styles.cardHeaderBlock}>
            <Text style={[styles.cardTitle, fontStyle('bold'), { color: palette.textPrimary }]}>
              Money Spent Month-by-Month & What's Coming Next
            </Text>
            <Text style={[styles.cardSub, fontStyle('regular'), { color: palette.textMuted }]}>
              How much you spent each month and what you will need to pay over the next 3 months
            </Text>
            <View style={styles.legendRow}>
              <View style={styles.legendItem}>
                <View style={[styles.legendDot, { backgroundColor: palette.brandOrange }]} />
                <Text style={[styles.legendText, fontStyle('semibold'), { color: palette.textSecondary }]}>
                  Money Paid
                </Text>
              </View>
              <View style={styles.legendItem}>
                <View style={[styles.legendDot, { backgroundColor: '#7768B4' }]} />
                <Text style={[styles.legendText, fontStyle('semibold'), { color: palette.textSecondary }]}>
                  Coming Up (Estimated)
                </Text>
              </View>
            </View>
          </View>

          <View style={[styles.chartPlot, { borderBottomColor: palette.border }]}>
            {MONTHLY_CHART_BARS.map((bar) => {
              const hasData = projectSummaries.length > 0;
              return (
                <View key={bar.label} style={styles.barCol}>
                  <Text
                    style={[
                      styles.barVal,
                      fontStyle('bold'),
                      {
                        color: bar.current
                          ? palette.brandOrange
                          : bar.projected
                          ? '#5E4DB2'
                          : palette.textMuted,
                      },
                    ]}>
                    {hasData ? bar.valueLabel : '₦0'}
                  </Text>
                  <View style={styles.barTrack}>
                    <View
                      style={[
                        styles.barFill,
                        {
                          height: hasData ? `${bar.pct}%` : 3,
                          backgroundColor: !hasData
                            ? palette.border
                            : bar.projected
                            ? 'rgba(173, 165, 222, 0.55)'
                            : palette.brandOrange,
                          borderTopWidth: hasData && bar.projected ? 2 : 0,
                          borderTopColor: '#483699',
                        },
                      ]}
                    />
                  </View>
                  <Text
                    style={[
                      styles.barLabel,
                      fontStyle(bar.current ? 'extrabold' : 'semibold'),
                      {
                        color: bar.current ? palette.textPrimary : palette.textMuted,
                      },
                    ]}>
                    {bar.projected ? `${bar.label}*` : bar.label}
                  </Text>
                </View>
              );
            })}
          </View>

          <View style={styles.chartFooter}>
            <Text style={[styles.chartFootNote, fontStyle('medium'), { color: palette.textMuted }]}>
              * Estimated upcoming stage payouts
            </Text>
            <Text style={[styles.chartFootAvg, fontStyle('bold'), { color: palette.textPrimary }]}>
              Avg/mo: {projectSummaries.length > 0 ? '₦64.2M' : '₦0'}
            </Text>
          </View>
        </View>

        {/* 4. Where Your Money Is Going (Category Breakdown) */}
        <View
          style={[
            styles.card,
            { backgroundColor: palette.surface, borderColor: palette.border },
          ]}>
          <Text style={[styles.cardTitle, fontStyle('bold'), { color: palette.textPrimary }]}>
            Where Your Money Is Going
          </Text>
          <Text style={[styles.cardSub, fontStyle('regular'), { color: palette.textMuted }]}>
            How every Naira is spent across your building projects
          </Text>

          <View style={styles.breakdownList}>
            {CATEGORY_BREAKDOWN.map((item) => {
              const hasData = projectSummaries.length > 0;
              return (
                <View key={item.label} style={styles.breakdownRow}>
                  <View style={styles.breakdownLabels}>
                    <Text
                      style={[
                        styles.breakdownName,
                        fontStyle('bold'),
                        { color: palette.textPrimary },
                      ]}>
                      {item.label}
                    </Text>
                    <Text
                      style={[
                        styles.breakdownAmt,
                        fontStyle('bold'),
                        { color: palette.textMuted },
                      ]}>
                      {hasData ? `${item.pct}% (${item.amount})` : '0% (₦0)'}
                    </Text>
                  </View>
                  <View
                    style={[
                      styles.breakdownTrack,
                      { backgroundColor: palette.surfaceSubtle },
                    ]}>
                    <View
                      style={[
                        styles.breakdownFill,
                        {
                          width: hasData ? `${item.pct}%` : '0%',
                          backgroundColor: item.color,
                        },
                      ]}
                    />
                  </View>
                </View>
              );
            })}
          </View>

          <View style={[styles.breakdownFooter, { borderTopColor: palette.border }]}>
            <Text style={[styles.breakdownFootLabel, fontStyle('medium'), { color: palette.textMuted }]}>
              Total Spent So Far
            </Text>
            <Text style={[styles.breakdownFootVal, fontStyle('extrabold'), { color: palette.textPrimary }]}>
              {formatNairaShort(totalDisbursed)}
            </Text>
          </View>
        </View>

        {/* 5. Payment History & Receipts Ledger */}
        <View
          style={[
            styles.card,
            { backgroundColor: palette.surface, borderColor: palette.border },
          ]}>
          <View style={styles.ledgerHeader}>
            <View style={{ flex: 1 }}>
              <Text style={[styles.cardTitle, fontStyle('extrabold'), { color: palette.textPrimary }]}>
                Payment History & Receipts
              </Text>
              <Text style={[styles.cardSub, fontStyle('regular'), { color: palette.textMuted }]}>
                Complete verified record of escrow deposits, releases, and receipts.
              </Text>
            </View>
            <View style={[styles.countBadge, { backgroundColor: palette.surfaceSubtle }]}>
              <Text style={[styles.countBadgeText, fontStyle('bold'), { color: palette.textPrimary }]}>
                {filteredTransactions.length} of {transactions.length}
              </Text>
            </View>
          </View>

          {/* Search & Filter Row */}
          <View style={styles.ledgerControls}>
            <View
              style={[
                styles.searchWrap,
                { backgroundColor: palette.surfaceSubtle, borderColor: palette.border },
              ]}>
              <Svg width={15} height={15} viewBox="0 0 24 24" fill="none">
                <Circle cx="11" cy="11" r="8" stroke={palette.textMuted} strokeWidth={2} />
                <Line x1="21" y1="21" x2="16.65" y2="16.65" stroke={palette.textMuted} strokeWidth={2} />
              </Svg>
              <TextInput
                value={searchQuery}
                onChangeText={setSearchQuery}
                placeholder="Search receipt code, building, or builder..."
                placeholderTextColor={palette.textMuted}
                style={[styles.searchInput, fontStyle('medium'), { color: palette.textPrimary }]}
              />
            </View>

            <Pressable
              onPress={() => setIsFilterModalOpen(true)}
              style={[
                styles.ledgerFilterBtn,
                {
                  backgroundColor:
                    activeFilterCount > 0 ? palette.brandSoftBg : palette.surfaceSubtle,
                  borderColor:
                    activeFilterCount > 0 ? palette.brandSoftBorder : palette.border,
                },
              ]}>
              <Text
                style={[
                  styles.ledgerFilterText,
                  fontStyle('bold'),
                  {
                    color:
                      activeFilterCount > 0 ? palette.brandSoftText : palette.textPrimary,
                  },
                ]}>
                Filter{activeFilterCount > 0 ? ` (${activeFilterCount})` : ''}
              </Text>
            </Pressable>
          </View>

          {/* Transactions List or Empty State */}
          {filteredTransactions.length === 0 ? (
            <View style={styles.ledgerEmpty}>
              <View
                style={[
                  styles.iconBox,
                  {
                    backgroundColor: palette.brandSoftBg,
                    borderColor: palette.brandSoftBorder,
                  },
                ]}>
                <OwnerNavIcon id="transactions" color={palette.brandOrange} size={22} />
              </View>
              <Text style={[styles.emptyTitle, fontStyle('extrabold'), { color: palette.textPrimary }]}>
                No escrow transactions yet
              </Text>
              <Text style={[styles.emptyDesc, fontStyle('regular'), { color: palette.textMuted }]}>
                Once you deposit funds or approve stage payouts, every verified receipt will appear here.
              </Text>
            </View>
          ) : (
            <View style={styles.txList}>
              {filteredTransactions.map((tx) => {
                const st = getStatusColors(tx.status);
                return (
                  <Pressable
                    key={tx.id}
                    onPress={() => setInspectedTx(tx)}
                    style={[
                      styles.txItem,
                      {
                        backgroundColor: palette.surfaceSubtle,
                        borderColor: palette.border,
                      },
                    ]}>
                    <View style={styles.txTopRow}>
                      <View style={{ flex: 1 }}>
                        <Text
                          numberOfLines={1}
                          style={[styles.txStage, fontStyle('bold'), { color: palette.textPrimary }]}>
                          {tx.stageTitle}
                        </Text>
                        <Text
                          numberOfLines={1}
                          style={[styles.txProject, fontStyle('medium'), { color: palette.textSecondary }]}>
                          {tx.projectTitle} · {tx.contractorName}
                        </Text>
                      </View>
                      <Text
                        style={[
                          styles.txAmount,
                          fontStyle('extrabold'),
                          { color: palette.textPrimary, fontVariant: ['tabular-nums'] },
                        ]}>
                        ₦{tx.amount.toLocaleString('en-NG')}
                      </Text>
                    </View>

                    <View style={styles.txBottomRow}>
                      <Text
                        numberOfLines={1}
                        style={[styles.txRef, fontStyle('medium'), { color: palette.textMuted, flex: 1 }]}>
                        {tx.reference} · {tx.date}
                      </Text>
                      <View
                        style={[
                          styles.statusPill,
                          { backgroundColor: st.bg, borderColor: st.border },
                        ]}>
                        <Text
                          numberOfLines={1}
                          style={[styles.statusPillText, fontStyle('bold'), { color: st.text }]}>
                          {tx.status === 'Deposited on Vantaged'
                            ? 'On Vantaged'
                            : tx.status === 'Sent – Builder to Confirm'
                            ? 'Pending Confirm'
                            : tx.status === 'Received by Builder'
                            ? 'Paid to Builder'
                            : tx.status === 'Issue Reported'
                            ? 'Issue Flagged'
                            : tx.status}
                        </Text>
                      </View>
                    </View>
                  </Pressable>
                );
              })}
            </View>
          )}
        </View>
      </ScrollView>

      {/* Info Tooltip Modal */}
      {!!infoTip && (
      <Modal
        visible={!!infoTip}
        transparent
        animationType="fade"
        onRequestClose={() => setInfoTip(null)}>
        <Pressable
          onPress={() => setInfoTip(null)}
          style={[styles.modalBackdrop, { backgroundColor: palette.drawerBackdrop }]}>
          <View
            style={[
              styles.modalCard,
              { backgroundColor: palette.surface, borderColor: palette.border },
            ]}>
            <Text style={[styles.modalTitle, fontStyle('extrabold'), { color: palette.textPrimary }]}>
              {infoTip?.title}
            </Text>
            <Text style={[styles.modalBody, fontStyle('regular'), { color: palette.textSecondary }]}>
              {infoTip?.body}
            </Text>
            <Pressable
              onPress={() => setInfoTip(null)}
              style={[styles.primaryBtn, { backgroundColor: palette.brandOrange, alignSelf: 'flex-end' }]}>
              <Text style={[styles.primaryBtnText, fontStyle('bold')]}>Got it</Text>
            </Pressable>
          </View>
        </Pressable>
      </Modal>
      )}

      {/* Receipt Detail Modal */}
      {!!inspectedTx && (
      <Modal
        visible={!!inspectedTx}
        transparent
        animationType="fade"
        onRequestClose={() => setInspectedTx(null)}>
        <View style={[styles.modalBackdrop, { backgroundColor: palette.drawerBackdrop }]}>
          <View
            style={[
              styles.modalCard,
              { backgroundColor: palette.surface, borderColor: palette.border },
            ]}>
            <View style={styles.modalHeader}>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                <EscrowShieldIcon color={palette.greenText} size={18} />
                <Text style={[styles.modalTitle, fontStyle('extrabold'), { color: palette.textPrimary }]}>
                  Verified Payment Receipt
                </Text>
              </View>
              <Pressable onPress={() => setInspectedTx(null)}>
                <Text style={[styles.closeX, { color: palette.textMuted }]}>✕</Text>
              </Pressable>
            </View>

            {inspectedTx && (
              <View style={{ gap: 10 }}>
                <View
                  style={[
                    styles.receiptHero,
                    { backgroundColor: palette.surfaceSubtle, borderColor: palette.border },
                  ]}>
                  <Text style={[styles.receiptLabel, fontStyle('bold'), { color: palette.textMuted }]}>
                    {inspectedTx.type.toUpperCase()}
                  </Text>
                  <Text style={[styles.receiptAmount, fontStyle('extrabold'), { color: palette.textPrimary }]}>
                    ₦{inspectedTx.amount.toLocaleString('en-NG')}
                  </Text>
                  <Text style={[styles.receiptRef, fontStyle('medium'), { color: palette.brandOrange }]}>
                    Ref: {inspectedTx.reference}
                  </Text>
                </View>

                <View style={styles.detailRow}>
                  <Text style={[styles.detailKey, fontStyle('semibold'), { color: palette.textMuted }]}>Project</Text>
                  <Text style={[styles.detailVal, fontStyle('bold'), { color: palette.textPrimary }]}>{inspectedTx.projectTitle}</Text>
                </View>
                <View style={styles.detailRow}>
                  <Text style={[styles.detailKey, fontStyle('semibold'), { color: palette.textMuted }]}>Stage</Text>
                  <Text style={[styles.detailVal, fontStyle('bold'), { color: palette.textPrimary }]}>{inspectedTx.stageTitle}</Text>
                </View>
                <View style={styles.detailRow}>
                  <Text style={[styles.detailKey, fontStyle('semibold'), { color: palette.textMuted }]}>Builder</Text>
                  <Text style={[styles.detailVal, fontStyle('bold'), { color: palette.textPrimary }]}>{inspectedTx.contractorName}</Text>
                </View>
                <View style={styles.detailRow}>
                  <Text style={[styles.detailKey, fontStyle('semibold'), { color: palette.textMuted }]}>Bank Session</Text>
                  <Text style={[styles.detailVal, fontStyle('bold'), { color: palette.textPrimary }]}>{inspectedTx.bankSessionId}</Text>
                </View>
                <View style={styles.detailRow}>
                  <Text style={[styles.detailKey, fontStyle('semibold'), { color: palette.textMuted }]}>Status</Text>
                  <Text style={[styles.detailVal, fontStyle('bold'), { color: palette.brandOrange }]}>{inspectedTx.status}</Text>
                </View>
                <Text style={[styles.modalBody, fontStyle('regular'), { color: palette.textSecondary, marginTop: 4 }]}>
                  {inspectedTx.notes}
                </Text>
              </View>
            )}

            <Pressable
              onPress={() => setInspectedTx(null)}
              style={[styles.primaryBtn, { backgroundColor: palette.brandOrange, alignSelf: 'flex-end' }]}>
              <Text style={[styles.primaryBtnText, fontStyle('bold')]}>Close Receipt</Text>
            </Pressable>
          </View>
        </View>
      </Modal>
      )}

      {/* Deposit Funds Modal */}
      {isDepositModalOpen && (
      <Modal
        visible={isDepositModalOpen}
        transparent
        animationType="fade"
        onRequestClose={() => setIsDepositModalOpen(false)}>
        <View style={[styles.modalBackdrop, { backgroundColor: palette.drawerBackdrop }]}>
          <View
            style={[
              styles.modalCard,
              { backgroundColor: palette.surface, borderColor: palette.border },
            ]}>
            <View style={styles.modalHeader}>
              <Text style={[styles.modalTitle, fontStyle('extrabold'), { color: palette.textPrimary }]}>
                {depositStep === 'success' ? 'Escrow Deposit Confirmed' : 'Deposit Escrow Funds'}
              </Text>
              <Pressable onPress={() => setIsDepositModalOpen(false)}>
                <Text style={[styles.closeX, { color: palette.textMuted }]}>✕</Text>
              </Pressable>
            </View>

            {depositStep === 'success' ? (
              <View style={{ gap: 10 }}>
                <Text style={[styles.modalBody, fontStyle('regular'), { color: palette.textSecondary }]}>
                  Your deposit has been credited to Vantaged Escrow (Ref: {lastDepositRef}) and added to your ledger.
                </Text>
                <Pressable
                  onPress={() => setIsDepositModalOpen(false)}
                  style={[styles.primaryBtn, { backgroundColor: palette.brandOrange, alignSelf: 'flex-end' }]}>
                  <Text style={[styles.primaryBtnText, fontStyle('bold')]}>Done</Text>
                </Pressable>
              </View>
            ) : (
              <View style={{ gap: 12 }}>
                <Text style={[styles.detailKey, fontStyle('bold'), { color: palette.textPrimary }]}>
                  Deposit Amount (NGN)
                </Text>
                <TextInput
                  value={depositAmountInput}
                  onChangeText={setDepositAmountInput}
                  keyboardType="numeric"
                  style={[
                    styles.amountInput,
                    fontStyle('extrabold'),
                    {
                      backgroundColor: palette.surfaceSubtle,
                      borderColor: palette.border,
                      color: palette.textPrimary,
                    },
                  ]}
                />

                <Text style={[styles.detailKey, fontStyle('bold'), { color: palette.textPrimary }]}>
                  Funding Method
                </Text>
                <View style={styles.optionChips}>
                  {(
                    [
                      { id: 'bank_transfer', label: 'Bank Transfer (Escrow)' },
                      { id: 'card', label: 'Debit Card' },
                    ] as const
                  ).map((m) => (
                    <Pressable
                      key={m.id}
                      onPress={() => setDepositMethod(m.id)}
                      style={[
                        styles.optionChip,
                        {
                          backgroundColor:
                            depositMethod === m.id ? palette.brandOrange : palette.surfaceSubtle,
                          borderColor:
                            depositMethod === m.id ? palette.brandOrange : palette.border,
                        },
                      ]}>
                      <Text
                        style={[
                          styles.optionChipText,
                          fontStyle('bold'),
                          { color: depositMethod === m.id ? '#FFFFFF' : palette.textPrimary },
                        ]}>
                        {m.label}
                      </Text>
                    </Pressable>
                  ))}
                </View>

                <View style={styles.modalFooter}>
                  <Pressable
                    onPress={() => setIsDepositModalOpen(false)}
                    style={[styles.secondaryBtn, { borderColor: palette.border }]}>
                    <Text style={[styles.secondaryBtnText, fontStyle('bold'), { color: palette.textSecondary }]}>
                      Cancel
                    </Text>
                  </Pressable>
                  <Pressable
                    onPress={handleExecuteDeposit}
                    style={[styles.primaryBtn, { backgroundColor: palette.brandOrange }]}>
                    <Text style={[styles.primaryBtnText, fontStyle('bold')]}>
                      Confirm Deposit
                    </Text>
                  </Pressable>
                </View>
              </View>
            )}
          </View>
        </View>
      </Modal>
      )}

      {/* Filter Modal */}
      {isFilterModalOpen && (
      <Modal
        visible={isFilterModalOpen}
        transparent
        animationType="fade"
        onRequestClose={() => setIsFilterModalOpen(false)}>
        <View style={[styles.modalBackdrop, { backgroundColor: palette.drawerBackdrop }]}>
          <View
            style={[
              styles.modalCard,
              { backgroundColor: palette.surface, borderColor: palette.border },
            ]}>
            <View style={styles.modalHeader}>
              <Text style={[styles.modalTitle, fontStyle('extrabold'), { color: palette.textPrimary }]}>
                Filter Payments
              </Text>
              <Pressable onPress={() => setIsFilterModalOpen(false)}>
                <Text style={[styles.closeX, { color: palette.textMuted }]}>✕</Text>
              </Pressable>
            </View>

            <View style={{ gap: 12 }}>
              <Text style={[styles.detailKey, fontStyle('bold'), { color: palette.textPrimary }]}>
                Payment Type
              </Text>
              <View style={styles.optionChips}>
                {[
                  'All Payment Types',
                  'Work Payment',
                  'Deposited on Vantaged',
                  'Extra Work Added',
                ].map((t) => (
                  <Pressable
                    key={t}
                    onPress={() => setSelectedTypeFilter(t)}
                    style={[
                      styles.optionChip,
                      {
                        backgroundColor:
                          selectedTypeFilter === t ? palette.brandOrange : palette.surfaceSubtle,
                        borderColor:
                          selectedTypeFilter === t ? palette.brandOrange : palette.border,
                      },
                    ]}>
                    <Text
                      style={[
                        styles.optionChipText,
                        fontStyle('bold'),
                        { color: selectedTypeFilter === t ? '#FFFFFF' : palette.textPrimary },
                      ]}>
                      {t}
                    </Text>
                  </Pressable>
                ))}
              </View>

              <Text style={[styles.detailKey, fontStyle('bold'), { color: palette.textPrimary }]}>
                Status
              </Text>
              <View style={styles.optionChips}>
                {[
                  'All Statuses',
                  'Received by Builder',
                  'Sent – Builder to Confirm',
                  'Deposited on Vantaged',
                ].map((s) => (
                  <Pressable
                    key={s}
                    onPress={() => setSelectedStatusFilter(s)}
                    style={[
                      styles.optionChip,
                      {
                        backgroundColor:
                          selectedStatusFilter === s ? palette.brandOrange : palette.surfaceSubtle,
                        borderColor:
                          selectedStatusFilter === s ? palette.brandOrange : palette.border,
                      },
                    ]}>
                    <Text
                      style={[
                        styles.optionChipText,
                        fontStyle('bold'),
                        { color: selectedStatusFilter === s ? '#FFFFFF' : palette.textPrimary },
                      ]}>
                      {s}
                    </Text>
                  </Pressable>
                ))}
              </View>
            </View>

            <View style={styles.modalFooter}>
              <Pressable
                onPress={() => {
                  setSelectedProjectFilter('All Buildings');
                  setSelectedTypeFilter('All Payment Types');
                  setSelectedStatusFilter('All Statuses');
                }}
                style={[styles.secondaryBtn, { borderColor: palette.border }]}>
                <Text style={[styles.secondaryBtnText, fontStyle('bold'), { color: palette.textSecondary }]}>
                  Reset
                </Text>
              </Pressable>
              <Pressable
                onPress={() => setIsFilterModalOpen(false)}
                style={[styles.primaryBtn, { backgroundColor: palette.brandOrange }]}>
                <Text style={[styles.primaryBtnText, fontStyle('bold')]}>Apply</Text>
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>
      )}

      {/* Download Payment Summary Modal */}
      {isDownloadModalOpen && (
      <Modal
        visible={isDownloadModalOpen}
        transparent
        animationType="fade"
        onRequestClose={() => setIsDownloadModalOpen(false)}>
        <View style={[styles.modalBackdrop, { backgroundColor: palette.drawerBackdrop }]}>
          <View
            style={[
              styles.modalCard,
              { backgroundColor: palette.surface, borderColor: palette.border },
            ]}>
            <Text style={[styles.modalTitle, fontStyle('extrabold'), { color: palette.textPrimary }]}>
              Payment Summary Ready
            </Text>
            <Text style={[styles.modalBody, fontStyle('regular'), { color: palette.textSecondary }]}>
              Summary prepared for {projectSummaries.length} active building{projectSummaries.length === 1 ? '' : 's'} · Total Budget {formatNairaShort(totalCommittedBudget)} · Paid {formatNairaShort(totalDisbursed)} · Held in Escrow {formatNairaShort(totalInEscrow)}.
            </Text>
            <Pressable
              onPress={() => setIsDownloadModalOpen(false)}
              style={[styles.primaryBtn, { backgroundColor: palette.brandOrange, alignSelf: 'flex-end' }]}>
              <Text style={[styles.primaryBtnText, fontStyle('bold')]}>Done</Text>
            </Pressable>
          </View>
        </View>
      </Modal>
      )}
    </>
  );
}

const styles = StyleSheet.create({
  scroll: { flex: 1 },
  content: { padding: 14, paddingBottom: 32, gap: 14 },
  headerBlock: { gap: 6 },
  title: { fontSize: 23, letterSpacing: -0.5 },
  subtitle: { fontSize: 12.5, lineHeight: 18 },
  actionRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginTop: 4,
  },
  primaryBtn: {
    height: 38,
    paddingHorizontal: 14,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  primaryBtnText: { color: '#FFFFFF', fontSize: 12.5 },
  secondaryBtn: {
    height: 38,
    paddingHorizontal: 12,
    borderRadius: 8,
    borderWidth: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
  },
  secondaryBtnText: { fontSize: 12.5 },
  kpiGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  kpiCard: {
    width: '48.3%',
    flexGrow: 1,
    borderRadius: 14,
    borderWidth: 1,
    padding: 13,
    justifyContent: 'space-between',
    gap: 8,
  },
  kpiTopRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    gap: 6,
  },
  kpiLabel: { fontSize: 10, letterSpacing: 0.4, flex: 1 },
  tipBadge: {
    width: 18,
    height: 18,
    borderRadius: 9,
    alignItems: 'center',
    justifyContent: 'center',
  },
  tipText: { fontSize: 10 },
  kpiValue: { fontSize: 20, letterSpacing: -0.4 },
  card: {
    borderRadius: 16,
    borderWidth: 1,
    padding: 16,
    gap: 12,
  },
  cardHeaderBlock: { gap: 4 },
  cardTitle: { fontSize: 15.5, letterSpacing: -0.2 },
  cardSub: { fontSize: 11.5, lineHeight: 16 },
  legendRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    marginTop: 6,
  },
  legendItem: { flexDirection: 'row', alignItems: 'center', gap: 5 },
  legendDot: { width: 8, height: 8, borderRadius: 4 },
  legendText: { fontSize: 11 },
  chartPlot: {
    height: 156,
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    gap: 4,
    paddingTop: 10,
    paddingBottom: 8,
    borderBottomWidth: 1,
  },
  barCol: {
    flex: 1,
    height: '100%',
    alignItems: 'center',
    justifyContent: 'flex-end',
    gap: 4,
  },
  barVal: { fontSize: 9 },
  barTrack: {
    flex: 1,
    width: '100%',
    alignItems: 'center',
    justifyContent: 'flex-end',
  },
  barFill: {
    width: '72%',
    maxWidth: 22,
    borderTopLeftRadius: 5,
    borderTopRightRadius: 5,
  },
  barLabel: { fontSize: 10 },
  chartFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 8,
  },
  chartFootNote: { fontSize: 10.5 },
  chartFootAvg: { fontSize: 11 },
  breakdownList: { gap: 11, marginTop: 4 },
  breakdownRow: { gap: 5 },
  breakdownLabels: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 8,
  },
  breakdownName: { fontSize: 11.5, flex: 1 },
  breakdownAmt: { fontSize: 11 },
  breakdownTrack: {
    height: 7,
    borderRadius: 999,
    overflow: 'hidden',
  },
  breakdownFill: {
    height: '100%',
    borderRadius: 999,
  },
  breakdownFooter: {
    paddingTop: 10,
    borderTopWidth: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  breakdownFootLabel: { fontSize: 12 },
  breakdownFootVal: { fontSize: 14 },
  ledgerHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    gap: 10,
  },
  countBadge: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 8,
  },
  countBadgeText: { fontSize: 11 },
  ledgerControls: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  searchWrap: {
    flex: 1,
    height: 38,
    borderRadius: 8,
    borderWidth: 1,
    paddingHorizontal: 10,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  searchInput: { flex: 1, fontSize: 12 },
  ledgerFilterBtn: {
    height: 38,
    paddingHorizontal: 12,
    borderRadius: 8,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  ledgerFilterText: { fontSize: 12 },
  ledgerEmpty: {
    paddingVertical: 20,
    alignItems: 'center',
  },
  iconBox: {
    width: 48,
    height: 48,
    borderRadius: 12,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10,
  },
  emptyTitle: { fontSize: 15.5, textAlign: 'center' },
  emptyDesc: {
    fontSize: 12,
    textAlign: 'center',
    lineHeight: 17,
    marginTop: 4,
  },
  txList: { gap: 10 },
  txItem: {
    borderRadius: 12,
    borderWidth: 1,
    padding: 12,
    gap: 8,
  },
  txTopRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    gap: 10,
  },
  txStage: { fontSize: 13 },
  txProject: { fontSize: 11.5, marginTop: 2 },
  txAmount: { fontSize: 14 },
  txBottomRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 8,
  },
  txRef: { fontSize: 10.5, flexShrink: 1 },
  statusPill: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 999,
    borderWidth: 1,
    flexShrink: 0,
  },
  statusPillText: { fontSize: 10 },
  modalBackdrop: {
    flex: 1,
    justifyContent: 'center',
    padding: 18,
  },
  modalCard: {
    borderRadius: 18,
    borderWidth: 1,
    padding: 18,
    gap: 12,
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  modalTitle: { fontSize: 16 },
  modalBody: { fontSize: 12.5, lineHeight: 18 },
  closeX: { fontSize: 16, padding: 4 },
  receiptHero: {
    borderRadius: 12,
    borderWidth: 1,
    padding: 14,
    alignItems: 'center',
    gap: 4,
  },
  receiptLabel: { fontSize: 10, letterSpacing: 0.5 },
  receiptAmount: { fontSize: 22 },
  receiptRef: { fontSize: 11.5 },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 12,
  },
  detailKey: { fontSize: 11.5 },
  detailVal: { fontSize: 11.5, flex: 1, textAlign: 'right' },
  amountInput: {
    height: 42,
    borderRadius: 8,
    borderWidth: 1,
    paddingHorizontal: 12,
    fontSize: 15,
  },
  optionChips: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  optionChip: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
    borderWidth: 1,
  },
  optionChipText: { fontSize: 11.5 },
  modalFooter: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 10,
    paddingTop: 4,
  },
});

export default OwnerTransactionsPage;
