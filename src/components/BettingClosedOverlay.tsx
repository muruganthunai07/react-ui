import React from 'react';

interface BettingClosedOverlayProps {
  show: boolean;
}

const overlayStyle: React.CSSProperties = {
  position: 'fixed',
  top: 0,
  left: 0,
  width: '100vw',
  height: '100vh',
  background: 'rgba(0,0,0,0.5)',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  zIndex: 1000,
};

const cardStyle: React.CSSProperties = {
  background: 'rgba(30,30,30,0.95)',
  borderRadius: 16,
  padding: '32px 40px',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  boxShadow: '0 4px 32px rgba(0,0,0,0.25)',
};

export const BettingClosedOverlay: React.FC<BettingClosedOverlayProps> = ({ show }) => {
  if (!show) return null;
  return (
    <div style={overlayStyle}>
      <div style={cardStyle}>
        <div style={{
          background: '#e11d48',
          borderRadius: '50%',
          width: 56,
          height: 56,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          marginBottom: 16,
        }}>
          <span style={{ color: 'white', fontSize: 32, fontWeight: 700 }}>!</span>
        </div>
        <div style={{ color: 'white', fontWeight: 700, fontSize: 22, marginBottom: 4, textAlign: 'center' }}>
          Betting closed
        </div>
      </div>
    </div>
  );
}; 