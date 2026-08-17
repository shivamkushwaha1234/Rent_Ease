function Footer() {
  return (
    <footer className="border-t border-slate-200 bg-white/95 py-8 text-slate-600">
      <div className="mx-auto max-w-7xl px-6 text-center text-sm sm:text-base">
        <p className="font-semibold text-slate-900">RentEase</p>
        <p className="mt-2">Rent furniture, electronics, appliances and more with flexible rental plans.</p>
        <div className="mt-4 flex flex-col gap-2 text-slate-500 sm:flex-row sm:justify-center sm:gap-6">
          <span>&copy; {new Date().getFullYear()} RentEase</span>
          <span>Privacy</span>
          <span>Terms</span>
          <span>Support</span>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
