export default function Footer() {
  return (
    <footer style={{
      background: 'linear-gradient(135deg, rgba(0,56,92,0.8), rgba(53,74,126,0.8))',
      borderTop: '1px solid rgba(213,130,216,0.2)',
      padding: '2rem',
      textAlign: 'center',
      marginTop: 'auto',
    }}>
      <p style={{
        background: 'linear-gradient(135deg, #d582d8, #ffaaff)',
        WebkitBackgroundClip: 'text',
        WebkitTextFillColor: 'transparent',
        fontWeight: 700,
        fontSize: '1.1rem',
        marginBottom: '0.3rem',
      }}>
        🛍️ MiniMarket
      </p>
      <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: '0.8rem' }}>
        © 2026 Mini Marketplace — Desarrollo de Aplicaciones Web Avanzado
      </p>
    </footer>
  );
}