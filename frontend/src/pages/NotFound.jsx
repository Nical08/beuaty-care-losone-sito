import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { useLang } from "@/lib/langContext";

const NotFound = () => {
  const { t } = useLang();
  return (
    <div data-testid="not-found-page" className="container-site flex min-h-[60vh] flex-col items-start justify-center py-20">
      <p className="eyebrow mb-3">404</p>
      <h1 className="font-serif text-4xl font-semibold text-antracite sm:text-5xl">{t.notFound.title}</h1>
      <p className="mt-4 max-w-md leading-relaxed text-muted-foreground">{t.notFound.text}</p>
      <Link to="/" data-testid="not-found-home-link" className="btn-primary mt-8">
        {t.notFound.btn} <ArrowRight size={17} />
      </Link>
    </div>
  );
};

export default NotFound;
