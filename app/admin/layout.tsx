export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ padding: '1rem' }}>
      {children}
    </div>
  );
}