/**
 * Components — Root Barrel Export
 *
 * Usage:
 *   import { Button, Card, Badge, Sidebar, PageHeader } from '../components';
 *   import { LineChart } from '../components';
 */

// ─── Atomic UI Components ───────────────────────────────────────────────────
export * from './ui';

// ─── Layout Components ──────────────────────────────────────────────────────
export { Sidebar } from './layout/Sidebar';
export { PageHeader } from './layout/PageHeader';
export type { PageHeaderProps } from './layout/PageHeader';

// ─── Charts ─────────────────────────────────────────────────────────────────
export { LineChart, BarChart, DonutChart } from './charts';
