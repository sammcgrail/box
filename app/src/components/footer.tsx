export function Footer() {
  return (
    <footer className="border-t py-6">
      <div className="container flex flex-col items-center justify-between gap-4 md:flex-row">
        <p className="text-sm text-muted-foreground">
          Built with 🤖
        </p>
        <p className="text-sm text-muted-foreground">
          {new Date().getFullYear()}
        </p>
      </div>
    </footer>
  );
}
