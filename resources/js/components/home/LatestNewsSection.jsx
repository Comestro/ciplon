import { useState } from 'react';
import { Calendar, ArrowRight, X, Clock, Newspaper } from 'lucide-react';
import Container from '../common/Container';

export default function LatestNewsSection() {
  const [selectedArticle, setSelectedArticle] = useState(null);

  const newsItems = [
    {
      id: 1,
      image: '/images/pharma_product_boxes.jpg',
      date: '15 March 2026',
      badge: 'Product Launch',
      title: 'Ciplon launches THYMOTAS - a potent, patented novel immunomodulator in standard sepsis & infection care',
      summary: 'Ciplon Pharmaceuticals has announced the commercial launch of Thymotas, an innovative therapeutic agent engineered for enhanced immune response and rapid clinical recovery in intensive care settings.',
      fullContent: 'Ciplon Pharmaceuticals today launched Thymotas across premier hospital networks. Backed by extensive multicenter clinical trials demonstrating a 34% reduction in ICU recovery duration, Thymotas represents a milestone in hospital-acquired sepsis management. Formulated at our USFDA and WHO-GMP approved injectable facility, it guarantees sterile, endotoxin-free delivery.',
    },
    {
      id: 2,
      image: '/images/pharma_automation_line.jpg',
      date: '08 February 2026',
      badge: 'Manufacturing',
      title: 'Ciplon commissions robotic high-speed sterile packaging facility at flagship formulation hub',
      summary: 'State-of-the-art German robotic packaging line installed to boost annual oral solid and sterile vial throughput to over 4.5 billion units with zero human intervention.',
      fullContent: 'Demonstrating its commitment to Industry 4.0 automation, Ciplon has integrated automated robotic pick-and-pack conveyor lines with AI-guided 360-degree optical blister inspection. This ensures 100% defect-free packaging, barcoded anti-counterfeit serialisation, and compliance with the EU Falsified Medicines Directive (FMD).',
    },
    {
      id: 3,
      image: '/images/ciplon_lab.jpg',
      date: '10 December 2025',
      badge: 'Regulatory Approval',
      title: 'Ciplon receives European Medicines Agency (EMA) validation for key cardiovascular biosimilar',
      summary: 'The regulatory clearance marks a significant milestone in expanding Ciplon’s specialized therapy footprint in European and highly regulated markets.',
      fullContent: 'Ciplon Biologics has secured positive recommendation from the European Medicines Agency (EMA) for its complex cardiovascular biosimilar formulation. This dossier clearance paves the way for direct hospital supply across 27 EU member states, lowering healthcare costs for patients without compromising therapeutic equivalence.',
    },
  ];

  return (
    <section id="news" className="py-16 sm:py-24 bg-slate-50 border-b border-slate-100">
      <Container>
        {/* Title */}
        <div className="text-center mb-12 sm:mb-16">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight text-[#0c2340] uppercase">
            LATEST NEWS
          </h2>
          <div className="w-20 h-1 bg-gradient-to-r from-[#c59324] to-[#dfad36] mx-auto mt-2 rounded-full" />
        </div>

        {/* 3 News Cards Grid matching Intas structure */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {newsItems.map((item) => (
            <article
              key={item.id}
              onClick={() => setSelectedArticle(item)}
              className="group bg-white rounded-2xl border border-slate-200/90 shadow-sm hover:shadow-xl hover:border-[#c59324]/50 transition-all duration-300 flex flex-col justify-between overflow-hidden cursor-pointer"
            >
              <div>
                {/* Image Thumbnail */}
                <div className="relative w-full h-48 sm:h-52 bg-slate-100 overflow-hidden">
                  <img
                    src={item.image}
                    alt={item.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute top-3 right-3 px-2.5 py-1 rounded-md bg-white/95 backdrop-blur-md text-[10px] font-bold text-[#0c2340] border border-amber-200/80 shadow-xs">
                    {item.badge}
                  </div>
                </div>

                {/* Content */}
                <div className="p-5 sm:p-6 space-y-3">
                  <div className="flex items-center gap-1.5 text-xs text-slate-400 font-semibold">
                    <Calendar className="w-3.5 h-3.5 text-[#c59324]" />
                    <span>{item.date}</span>
                  </div>

                  <h3 className="text-sm sm:text-base font-bold text-[#0c2340] group-hover:text-[#c59324] transition-colors leading-snug line-clamp-3">
                    {item.title}
                  </h3>

                  <p className="text-xs text-slate-500 leading-relaxed line-clamp-3">
                    {item.summary}
                  </p>
                </div>
              </div>

              {/* Action Link matching brand theme */}
              <div className="px-5 sm:px-6 pb-5 pt-0">
                <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                  <span className="text-xs font-bold text-[#c59324] group-hover:text-[#0c2340] inline-flex items-center gap-1">
                    <span>READ MORE</span>
                    <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                  </span>
                </div>
              </div>
            </article>
          ))}
        </div>
      </Container>

      {/* Full News Release Modal */}
      {selectedArticle && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl border border-slate-100 relative max-h-[90vh] overflow-y-auto">
            <button
              type="button"
              onClick={() => setSelectedArticle(null)}
              className="absolute top-5 right-5 p-2 rounded-full bg-slate-100 text-slate-500 hover:bg-slate-200 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="rounded-xl overflow-hidden mb-4 h-56 w-full">
              <img
                src={selectedArticle.image}
                alt={selectedArticle.title}
                className="w-full h-full object-cover"
              />
            </div>

            <div className="flex items-center gap-3 text-xs text-slate-400 mb-2 font-semibold">
              <span className="px-2.5 py-0.5 rounded-full bg-sky-50 text-[#0069b4] font-bold">
                {selectedArticle.badge}
              </span>
              <span>•</span>
              <span>{selectedArticle.date}</span>
            </div>

            <h3 className="text-lg sm:text-xl font-bold text-slate-900 leading-snug mb-3">
              {selectedArticle.title}
            </h3>

            <div className="space-y-3 text-xs sm:text-sm text-slate-600 leading-relaxed">
              <p>{selectedArticle.fullContent}</p>
              <p>
                For further commercial licensing and institutional distribution agreements, contact our corporate medical communications division.
              </p>
            </div>

            <div className="mt-6 pt-4 border-t border-slate-100 flex justify-end">
              <button
                type="button"
                onClick={() => setSelectedArticle(null)}
                className="px-6 py-2 rounded-xl bg-[#0069b4] text-white text-xs font-bold hover:bg-[#005a9c] transition-colors cursor-pointer"
              >
                Close Release
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
