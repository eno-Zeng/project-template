export default function NotFound() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-[var(--a-color-bg-2-ff)] p-6">
      <section className="w-full max-w-[480px] rounded-2xl bg-[var(--a-color-bg-1)] px-6 py-12 text-center shadow-[0_12px_40px_rgb(0_0_0_/_8%)]">
        <p
          className="mb-3 text-[64px] leading-none font-bold"
          style={{ color: 'var(--a-color-primary-1-default)' }}
        >
          404
        </p>
        <h1 className="text-[28px] font-semibold" style={{ color: 'var(--a-color-text-1)' }}>
          页面未找到
        </h1>
      </section>
    </main>
  );
}
