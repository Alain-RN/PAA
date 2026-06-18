import React, { useState } from 'react';

// ==========================================
// 1. LINE CHART (SVG)
// ==========================================
interface LineChartProps {
  data: { date: string; count: number }[];
  height?: number;
}

export const LineChart: React.FC<LineChartProps> = ({ data, height = 200 }) => {
  const [hoveredIdx, setHoveredIdx] = useState<number | null>(null);

  const padding = 40;
  const chartWidth = 500;
  const chartHeight = height;

  const maxVal = Math.max(...data.map((d) => d.count), 5);
  const minVal = 0;
  const valRange = maxVal - minVal;

  const points = data.map((d, idx) => {
    const x = padding + (idx / (data.length - 1)) * (chartWidth - padding * 2);
    const y = chartHeight - padding - ((d.count - minVal) / valRange) * (chartHeight - padding * 2);
    return { x, y, ...d };
  });

  // Build the path string
  let pathD = '';
  if (points.length > 0) {
    pathD = `M ${points[0].x} ${points[0].y}`;
    for (let i = 1; i < points.length; i++) {
      // Smooth cubic bezier calculation
      const cpX1 = points[i - 1].x + (points[i].x - points[i - 1].x) / 2;
      const cpY1 = points[i - 1].y;
      const cpX2 = points[i - 1].x + (points[i].x - points[i - 1].x) / 2;
      const cpY2 = points[i].y;
      pathD += ` C ${cpX1} ${cpY1}, ${cpX2} ${cpY2}, ${points[i].x} ${points[i].y}`;
    }
  }

  // Path area under the line (gradient fill)
  let areaD = '';
  if (points.length > 0) {
    areaD = `${pathD} L ${points[points.length - 1].x} ${chartHeight - padding} L ${points[0].x} ${chartHeight - padding} Z`;
  }

  return (
    <div style={{ position: 'relative', width: '100%' }}>
      <svg
        viewBox={`0 0 ${chartWidth} ${chartHeight}`}
        width="100%"
        height="100%"
        style={{ overflow: 'visible' }}
      >
        <defs>
          <linearGradient id="lineGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="var(--accent-primary)" stopOpacity="1" />
            <stop offset="100%" stopColor="var(--accent-secondary)" stopOpacity="1" />
          </linearGradient>
          <linearGradient id="areaGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="var(--accent-primary)" stopOpacity="0.25" />
            <stop offset="100%" stopColor="var(--accent-primary)" stopOpacity="0.0" />
          </linearGradient>
        </defs>

        {/* Grid lines */}
        {[0, 0.25, 0.5, 0.75, 1].map((ratio, i) => {
          const y = padding + ratio * (chartHeight - padding * 2);
          const gridVal = Math.round(maxVal - ratio * valRange);
          return (
            <g key={i}>
              <line
                x1={padding}
                y1={y}
                x2={chartWidth - padding}
                y2={y}
                stroke="rgba(255,255,255,0.05)"
                strokeDasharray="4 4"
              />
              <text
                x={padding - 10}
                y={y + 4}
                fill="var(--text-muted)"
                fontSize="10"
                textAnchor="end"
              >
                {gridVal}
              </text>
            </g>
          );
        })}

        {/* Fill Area */}
        {areaD && <path d={areaD} fill="url(#areaGrad)" />}

        {/* Line Path */}
        {pathD && (
          <path
            d={pathD}
            fill="none"
            stroke="url(#lineGrad)"
            strokeWidth="3.5"
            strokeLinecap="round"
          />
        )}

        {/* Interactive Circles */}
        {points.map((pt, idx) => (
          <g
            key={idx}
            onMouseEnter={() => setHoveredIdx(idx)}
            onMouseLeave={() => setHoveredIdx(null)}
            style={{ cursor: 'pointer' }}
          >
            {/* Extended hover area */}
            <circle cx={pt.x} cy={pt.y} r="15" fill="transparent" />
            <circle
              cx={pt.x}
              cy={pt.y}
              r={hoveredIdx === idx ? '6' : '4'}
              fill={hoveredIdx === idx ? 'var(--accent-secondary)' : 'var(--accent-primary)'}
              stroke="#0f172a"
              strokeWidth="2"
              style={{ transition: 'all 0.15s ease' }}
            />
          </g>
        ))}

        {/* X axis labels */}
        {points.map((pt, idx) => (
          <text
            key={idx}
            x={pt.x}
            y={chartHeight - 12}
            fill="var(--text-muted)"
            fontSize="10"
            textAnchor="middle"
          >
            {pt.date}
          </text>
        ))}
      </svg>

      {/* Tooltip */}
      {hoveredIdx !== null && points[hoveredIdx] && (
        <div
          style={{
            position: 'absolute',
            left: `${(points[hoveredIdx].x / chartWidth) * 100}%`,
            top: `${(points[hoveredIdx].y / chartHeight) * 100 - 45}%`,
            transform: 'translateX(-50%)',
            background: 'rgba(15, 23, 42, 0.95)',
            border: '1px solid var(--accent-primary)',
            borderRadius: '6px',
            padding: '4px 8px',
            fontSize: '0.75rem',
            color: '#fff',
            pointerEvents: 'none',
            zIndex: 10,
            whiteSpace: 'nowrap',
            boxShadow: '0 4px 10px rgba(0,0,0,0.5)',
          }}
        >
          <strong>{points[hoveredIdx].count}</strong> étudiants ({points[hoveredIdx].date})
        </div>
      )}
    </div>
  );
};

// ==========================================
// 2. BAR CHART (SVG)
// ==========================================
interface BarChartProps {
  data: { name: string; studentsCount: number; color?: string }[];
  height?: number;
}

export const BarChart: React.FC<BarChartProps> = ({ data, height = 200 }) => {
  const [hoveredIdx, setHoveredIdx] = useState<number | null>(null);

  const paddingLeft = 140;
  const paddingRight = 40;
  const paddingTop = 20;
  const paddingBottom = 20;
  const chartWidth = 500;
  const chartHeight = height;

  const maxVal = Math.max(...data.map((d) => d.studentsCount), 1);
  const barWidthLimit = chartWidth - paddingLeft - paddingRight;
  const rowHeight = (chartHeight - paddingTop - paddingBottom) / data.length;

  return (
    <div style={{ position: 'relative', width: '100%' }}>
      <svg
        viewBox={`0 0 ${chartWidth} ${chartHeight}`}
        width="100%"
        height="100%"
        style={{ overflow: 'visible' }}
      >
        {data.map((d, idx) => {
          const y = paddingTop + idx * rowHeight + (rowHeight - 20) / 2;
          const barWidth = (d.studentsCount / maxVal) * barWidthLimit;
          const color = d.color || 'var(--accent-primary)';

          return (
            <g
              key={idx}
              onMouseEnter={() => setHoveredIdx(idx)}
              onMouseLeave={() => setHoveredIdx(null)}
              style={{ cursor: 'pointer' }}
            >
              {/* Category Name */}
              <text
                x={paddingLeft - 15}
                y={y + 14}
                fill="var(--text-primary)"
                fontSize="11"
                fontWeight="500"
                textAnchor="end"
                style={{
                  opacity: hoveredIdx === idx ? 1 : 0.8,
                  fill: hoveredIdx === idx ? 'var(--accent-primary)' : 'var(--text-primary)',
                  transition: 'all 0.15s ease',
                }}
              >
                {d.name.length > 20 ? d.name.substring(0, 18) + '...' : d.name}
              </text>

              {/* Bar background */}
              <rect
                x={paddingLeft}
                y={y}
                width={barWidthLimit}
                height="18"
                rx="4"
                fill="rgba(255, 255, 255, 0.03)"
              />

              {/* Glowing Bar */}
              <rect
                x={paddingLeft}
                y={y}
                width={barWidth}
                height="18"
                rx="4"
                fill={color}
                style={{
                  transition: 'width 0.8s cubic-bezier(0.1, 0.8, 0.3, 1)',
                  filter: hoveredIdx === idx ? 'brightness(1.15) drop-shadow(0 0 4px ' + color + ')' : 'none',
                }}
              />

              {/* Value label */}
              <text
                x={paddingLeft + barWidth + 8}
                y={y + 13}
                fill="var(--text-secondary)"
                fontSize="10"
                fontWeight="bold"
              >
                {d.studentsCount} élèves
              </text>
            </g>
          );
        })}
      </svg>
    </div>
  );
};

// ==========================================
// 3. DONUT CHART (SVG)
// ==========================================
interface DonutChartProps {
  data: { category: string; averageScore: number }[];
  size?: number;
}

export const DonutChart: React.FC<DonutChartProps> = ({ data, size = 180 }) => {
  const [hoveredIdx, setHoveredIdx] = useState<number | null>(null);

  const colors = ['#6366f1', '#10b981', '#f59e0b', '#ec4899'];
  const center = size / 2;
  const strokeWidth = 14;
  const radius = size / 2 - strokeWidth - 10;
  const circumference = 2 * Math.PI * radius;

  // Let's divide the donut chart based on equal sizes for mock representation, 
  // or simple visual values.
  const sliceAngle = 360 / data.length;

  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '2rem', justifyContent: 'center' }}>
      <div style={{ position: 'relative', width: size, height: size }}>
        <svg viewBox={`0 0 ${size} ${size}`} width="100%" height="100%">
          <circle
            cx={center}
            cy={center}
            r={radius}
            fill="transparent"
            stroke="rgba(255,255,255,0.03)"
            strokeWidth={strokeWidth}
          />
          {data.map((_d, idx) => {
            const color = colors[idx % colors.length];
            const sizeRatio = 1 / data.length; // equal slices for segments
            const strokeDashOffset = circumference * (1 - sizeRatio);
            const rotation = idx * sliceAngle - 90;

            const isHovered = hoveredIdx === idx;

            return (
              <circle
                key={idx}
                cx={center}
                cy={center}
                r={radius}
                fill="transparent"
                stroke={color}
                strokeWidth={isHovered ? strokeWidth + 3 : strokeWidth}
                strokeDasharray={circumference}
                strokeDashoffset={strokeDashOffset}
                transform={`rotate(${rotation} ${center} ${center})`}
                style={{
                  transition: 'all 0.3s ease',
                  cursor: 'pointer',
                }}
                onMouseEnter={() => setHoveredIdx(idx)}
                onMouseLeave={() => setHoveredIdx(null)}
              />
            );
          })}
        </svg>

        {/* Text inside the Donut */}
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            pointerEvents: 'none',
          }}
        >
          <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
            {hoveredIdx !== null ? data[hoveredIdx].category : 'Moyenne'}
          </span>
          <span style={{ fontSize: '1.25rem', fontWeight: 'bold', color: '#fff', fontFamily: 'var(--font-heading)' }}>
            {hoveredIdx !== null ? `${data[hoveredIdx].averageScore}%` : '75%'}
          </span>
        </div>
      </div>

      {/* Legend list */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
        {data.map((d, idx) => {
          const color = colors[idx % colors.length];
          const isHovered = hoveredIdx === idx;
          return (
            <div
              key={idx}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                cursor: 'pointer',
                opacity: hoveredIdx === null || isHovered ? 1 : 0.6,
                transform: isHovered ? 'translateX(4px)' : 'none',
                transition: 'all 0.2s ease',
              }}
              onMouseEnter={() => setHoveredIdx(idx)}
              onMouseLeave={() => setHoveredIdx(null)}
            >
              <div style={{ width: '10px', height: '10px', borderRadius: '50%', backgroundColor: color }} />
              <span style={{ fontSize: '0.85rem', color: 'var(--text-primary)', fontWeight: isHovered ? 600 : 400 }}>
                {d.category} : <span style={{ color }}>{d.averageScore}%</span>
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
};
