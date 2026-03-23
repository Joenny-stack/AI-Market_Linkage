export default function AIQualityResult({ prediction, confidence, grade, recommendedPrice, priceLoading }) {
  const confidencePercent = typeof confidence === 'number' ? `${Math.round(confidence * 100)}%` : 'N/A';

  return (
    <div
      style={{
        marginTop: '1rem',
        border: '1px solid var(--border-color, #d9e0e6)',
        borderRadius: '8px',
        padding: '1rem',
        background: '#f6fbf8',
      }}
    >
      <h3 style={{ margin: '0 0 0.6rem 0', color: '#1f5132' }}>AI Quality Assessment</h3>
      <p style={{ margin: '0.25rem 0' }}><strong>Quality Grade:</strong> {grade || 'N/A'}</p>
      <p style={{ margin: '0.25rem 0' }}><strong>Confidence:</strong> {confidencePercent}</p>
      <p style={{ margin: '0.25rem 0' }}><strong>Tomato State:</strong> {prediction || 'N/A'}</p>

      <div style={{ marginTop: '0.75rem', borderTop: '1px solid #c3dbc3', paddingTop: '0.75rem' }}>
        {priceLoading ? (
          <p style={{ margin: 0, color: '#555', fontStyle: 'italic' }}>Calculating recommended price...</p>
        ) : typeof recommendedPrice === 'number' ? (
          <p style={{
            margin: 0,
            padding: '0.4rem 0.75rem',
            background: '#e8f5e9',
            borderRadius: '6px',
            fontWeight: 700,
            fontSize: '1rem',
            color: '#2e7d32',
          }}>
            AI Recommended Price: ${recommendedPrice.toFixed(2)}/kg
          </p>
        ) : null}
      </div>
    </div>
  );
}
