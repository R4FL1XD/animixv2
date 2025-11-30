export default function Footer() {
  return (
    <footer className="py-6 md:px-8 md:py-0 mt-8 border-t">
      <div className="container flex flex-col items-center justify-center gap-4 h-24">
        <p className="text-center text-sm leading-loose text-muted-foreground max-w-2xl">
          Animix is a fan-made project for educational and portfolio purposes, not for commercial use.
          All anime data is provided by an external API from Sankavollerei. This site is not affiliated with any official streaming service.
        </p>
      </div>
    </footer>
  );
}
