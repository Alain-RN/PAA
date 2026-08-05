import React from 'react';
import { useAppState } from '../hooks/useAppState';
import { GlassCard } from '../components/GlassCard';
import { LineChart, BarChart, DonutChart } from '../components/CustomCharts';
import { Users, Activity, Clock, Percent, FilePieChart, TrendingUp, BarChart2 } from 'lucide-react';

export const AdminDashboard: React.FC = () => {
  const { analytics } = useAppState();

  return (
    <div>
      <div style={styles.header}>
        <h1 className="font-heading" style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>Console d'Administration</h1>
        <p className="font-body" style={{ color: 'var(--text-secondary)' }}>
          Suivi en temps réel des statistiques d'apprentissage, d'activité et des performances étudiantes.
        </p>
      </div>

      {/* KPI Cards Row */}
      <div style={styles.kpiRow}>
        <GlassCard style={styles.kpiCard}>
          <div style={styles.kpiHeader}>
            <span style={styles.kpiTitle}>Étudiants inscrits</span>
            <Users size={20} color="var(--accent-primary)" />
          </div>
          <div className="font-xp" style={styles.kpiValue}>{analytics.totalUsers}</div>
          <div style={styles.kpiSub}>+2 cette semaine</div>
        </GlassCard>

        <GlassCard style={styles.kpiCard}>
          <div style={styles.kpiHeader}>
            <span style={styles.kpiTitle}>Actifs aujourd'hui</span>
            <Activity size={20} color="var(--accent-success)" />
          </div>
          <div className="font-xp" style={styles.kpiValue}>{analytics.activeUsersToday}</div>
          <div style={styles.kpiSub}>~70% de la promo</div>
        </GlassCard>

        <GlassCard style={styles.kpiCard}>
          <div style={styles.kpiHeader}>
            <span style={styles.kpiTitle}>Temps moyen / jour</span>
            <Clock size={20} color="var(--accent-warning)" />
          </div>
          <div className="font-xp" style={styles.kpiValue}>{analytics.averageTimeSpent} min</div>
          <div style={styles.kpiSub}>+4 min vs mois dernier</div>
        </GlassCard>

        <GlassCard style={styles.kpiCard}>
          <div style={styles.kpiHeader}>
            <span style={styles.kpiTitle}>Taux de réussite quiz</span>
            <Percent size={20} color="var(--accent-secondary)" />
          </div>
          <div className="font-xp" style={styles.kpiValue}>{analytics.averageSuccessRate}%</div>
          <div style={styles.kpiSub}>Moyenne sur les évaluations</div>
        </GlassCard>
      </div>

      {/* Analytics Charts Grid */}
      <div style={styles.chartsGrid}>
        {/* Registration trend line chart */}
        <GlassCard style={{ gridColumn: 'span 2' }}>
          <h3 className="font-heading" style={styles.chartTitle}>
            <TrendingUp size={16} color="var(--accent-primary)" />
            <span>Évolution des Inscriptions (Journalier)</span>
          </h3>
          <div style={styles.chartContainer}>
            <LineChart data={analytics.dailyRegistrations} />
          </div>
        </GlassCard>

        {/* Popular courses bar chart */}
        <GlassCard>
          <h3 className="font-heading" style={styles.chartTitle}>
            <BarChart2 size={16} color="var(--accent-success)" />
            <span>Répartition des étudiants par cours</span>
          </h3>
          <div style={styles.chartContainer}>
            <BarChart data={analytics.popularCourses} />
          </div>
        </GlassCard>

        {/* Success rates donut chart */}
        <GlassCard>
          <h3 className="font-heading" style={styles.chartTitle}>
            <FilePieChart size={16} color="var(--accent-secondary)" />
            <span>Taux de réussite moyen par catégorie</span>
          </h3>
          <div style={{ ...styles.chartContainer, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <DonutChart data={analytics.categoryPerformance} />
          </div>
        </GlassCard>
      </div>
    </div>
  );
};

const styles: Record<string, React.CSSProperties> = {
  header: {
    marginBottom: '2rem',
  },
  kpiRow: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
    gap: '1.25rem',
    marginBottom: '2rem',
  },
  kpiCard: {
    padding: '1.25rem',
  },
  kpiHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '0.75rem',
  },
  kpiTitle: {
    fontSize: '0.8rem',
    color: 'var(--text-secondary)',
    fontWeight: 600,
    textTransform: 'uppercase',
  },
  kpiValue: {
    fontSize: '1.75rem',
    fontWeight: 800,
    marginBottom: '0.25rem',
  },
  kpiSub: {
    fontSize: '0.7rem',
    color: 'var(--text-muted)',
  },
  chartsGrid: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '1.5rem',
  },
  chartTitle: {
    fontSize: '1rem',
    marginBottom: '1.25rem',
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
  },
  chartContainer: {
    padding: '0.5rem',
  },
};

export default AdminDashboard;
