const Footer = () => {
  return (
    <footer className="border-t border-border py-10 px-6">
      <div className="container mx-auto flex flex-col items-center justify-between gap-4 text-sm text-muted-foreground md:flex-row">
        <span className="font-semibold text-foreground">Clonex</span>
        <span>© {new Date().getFullYear()} Clonex. All rights reserved.</span>
        <div className="flex gap-6">
          <a href="#" className="transition-colors hover:text-foreground">Privacy</a>
          <a href="#" className="transition-colors hover:text-foreground">Terms</a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
