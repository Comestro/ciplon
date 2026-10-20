import { useState } from 'react';
import { Link } from '@inertiajs/react';
import { 
  Package, 
  FolderTree, 
  Plus, 
  ArrowRight, 
  Mail, 
  Clock, 
  Building2, 
  Sparkles,
  Users,
  Presentation,
  ShieldCheck,
  CheckCircle2,
  Play
} from 'lucide-react';
import AdminLayout from '../../layouts/AdminLayout';

export default function Dashboard({ stats = {}, recentProducts = [], recentEnquiries = [] }) {
  const totalProducts = stats.totalProducts ?? 0;
  const activeProducts = stats.activeProducts ?? 0;
  const featuredProducts = stats.featuredProducts ?? 0;
  const totalCategories = stats.totalCategories ?? 0;
  const totalEnquiries = stats.totalEnquiries ?? 0;
  const pendingEnquiries = stats.pendingEnquiries ?? 0;

  const [activeFilter, setActiveFilter] = useState('all');

  // SpaceWork Style Visual Cards for Products & Presentations
  const adminDecks = [
    {
      id: 'brand-slide',
      title: 'Ciplon Corporate Profile',
      category: 'Brand Heritage',
      categoryColor: 'text-violet-600',
      tag: 'ISO 9001:2015 & WHO-GMP',
      updated: 'Updated today',
      bgGradient: 'from-violet-600 via-purple-600 to-indigo-700',
      image: '/images/ciplon_logo.png',
      isLogo: true,
      slidesCount: 'Fixed #1',
    },
    {
      id: 'amoxiclav',
      title: 'AmoxiClav 625 Duo',
      category: 'Antibiotics',
      categoryColor: 'text-sky-600',
      tag: '10x10 Alu-Alu Strip',
      updated: 'Updated 20m ago',
      bgGradient: 'from-sky-500 via-blue-600 to-indigo-600',
      image: '/images/box_factocel_ix.jpg',
      slidesCount: '12 Slides',
    },
    {
      id: 'ciplocid',
      title: 'Ciplocid-DSR Capsules',
      category: 'Gastro Care',
      categoryColor: 'text-purple-600',
      tag: 'Rabeprazole + Domperidone',
      updated: 'Updated 1h ago',
      bgGradient: 'from-purple-600 via-fuchsia-600 to-pink-600',
      image: '/images/box_globucel_sc.jpg',
      slidesCount: '8 Slides',
    },
    {
      id: 'cardiovast',
      title: 'Cardiovast 20',
      category: 'Cardiology Care',
      categoryColor: 'text-blue-600',
      tag: 'Atorvastatin Calcium IP',
      updated: 'Updated 2h ago',
      bgGradient: 'from-blue-600 via-indigo-600 to-cyan-600',
      image: '/images/box_fibrogen_i.jpg',
      slidesCount: '10 Slides',
    },
    {
      id: 'aerobreathe',
      title: 'AeroBreathe 200 Inhaler',
      category: 'Pulmonology',
      categoryColor: 'text-violet-600',
      tag: 'Budesonide + Formoterol',
      updated: 'Updated 4h ago',
      bgGradient: 'from-indigo-600 via-violet-600 to-purple-800',
      image: '/images/box_globucel_sc.jpg',
      slidesCount: '14 Slides',
    },
    {
      id: 'ciplonpara',
      title: 'CiplonPara 650',
      category: 'Analgesics',
      categoryColor: 'text-purple-600',
      tag: 'Paracetamol Tablets IP',
      updated: 'Updated today',
      bgGradient: 'from-fuchsia-600 via-purple-700 to-indigo-800',
      image: '/images/box_factocel_ix.jpg',
      slidesCount: '6 Slides',
    },
  ];

  return (
    <AdminLayout>
      <div className="space-y-8 pb-12 font-sans">
        
        {/* 1. Header & 3 Quick Action Cards (SpaceWork Inspired) */}
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900">
                Recents
              </h2>
              <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
                Manage commercial formulations, digital detailing visual aids, and incoming distributor leads.
              </p>
            </div>

            <div className="flex items-center gap-2">
              <Link
                href="/admin/products/add"
                className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs shadow-xs transition-all cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5 stroke-[2.5]" />
                <span>New Formulation</span>
              </Link>
            </div>
          </div>

          {/* 3 Quick Action Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5">
            {/* Card 1: Add Formulation */}
            <Link
              href="/admin/products/add"
              className="group p-4 rounded-2xl bg-white border border-slate-200/90 hover:border-violet-400 hover:shadow-xs transition-all flex items-center gap-3.5 cursor-pointer"
            >
              <div className="w-10 h-10 rounded-xl bg-violet-50 text-violet-600 border border-violet-100 flex items-center justify-center shrink-0 group-hover:scale-105 group-hover:bg-violet-600 group-hover:text-white transition-all">
                <Plus className="w-5 h-5 stroke-[2.5]" />
              </div>
              <div className="min-w-0 flex-1">
                <h4 className="text-xs font-bold text-slate-900 group-hover:text-violet-700 transition-colors truncate">
                  Start new formulation
                </h4>
                <p className="text-[11px] text-slate-500 truncate mt-0.5">
                  Publish medicine SKU to catalog
                </p>
              </div>
            </Link>

            {/* Card 2: Visual Aids */}
            <Link
              href="/admin/products"
              className="group p-4 rounded-2xl bg-white border border-slate-200/90 hover:border-purple-400 hover:shadow-xs transition-all flex items-center gap-3.5 cursor-pointer"
            >
              <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-600 border border-purple-100 flex items-center justify-center shrink-0 group-hover:scale-105 group-hover:bg-purple-600 group-hover:text-white transition-all">
                <Presentation className="w-5 h-5" />
              </div>
              <div className="min-w-0 flex-1">
                <h4 className="text-xs font-bold text-slate-900 group-hover:text-purple-700 transition-colors truncate">
                  Manage Visual Aids
                </h4>
                <p className="text-[11px] text-slate-500 truncate mt-0.5">
                  Configure MR doctor slide decks
                </p>
              </div>
            </Link>

            {/* Card 3: Inquiries */}
            <Link
              href="/admin/enquiries"
              className="group p-4 rounded-2xl bg-white border border-slate-200/90 hover:border-amber-400 hover:shadow-xs transition-all flex items-center gap-3.5 cursor-pointer"
            >
              <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 border border-amber-100 flex items-center justify-center shrink-0 group-hover:scale-105 group-hover:bg-amber-600 group-hover:text-white transition-all">
                <Mail className="w-5 h-5" />
              </div>
              <div className="min-w-0 flex-1">
                <h4 className="text-xs font-bold text-slate-900 group-hover:text-amber-700 transition-colors truncate">
                  Commercial Inquiries ({pendingEnquiries})
                </h4>
                <p className="text-[11px] text-slate-500 truncate mt-0.5">
                  Review distributor & trade requests
                </p>
              </div>
            </Link>
          </div>
        </div>

        {/* 2. Segmented Pill Filter */}
        <div className="flex items-center gap-1.5 p-1 rounded-xl bg-slate-200/50 w-fit">
          <button
            type="button"
            onClick={() => setActiveFilter('all')}
            className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
              activeFilter === 'all'
                ? 'bg-white text-slate-900 shadow-2xs font-bold'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            All Catalogs
          </button>
          <button
            type="button"
            onClick={() => setActiveFilter('active')}
            className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
              activeFilter === 'active'
                ? 'bg-white text-slate-900 shadow-2xs font-bold'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Active Formulations ({activeProducts})
          </button>
          <button
            type="button"
            onClick={() => setActiveFilter('leads')}
            className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
              activeFilter === 'leads'
                ? 'bg-white text-slate-900 shadow-2xs font-bold'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Trade Leads ({totalEnquiries})
          </button>
        </div>

        {/* 3. SpaceWork 16:9 Presentation Cards Grid */}
        <div className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {adminDecks.map((deck) => (
              <Link
                key={deck.id}
                href="/admin/products"
                className="group flex flex-col space-y-2.5 cursor-pointer select-none"
              >
                {/* 16:9 Aspect Visual Card Thumbnail */}
                <div className={`relative aspect-[16/10] w-full rounded-2xl bg-gradient-to-br ${deck.bgGradient} p-5 overflow-hidden shadow-xs group-hover:shadow-md group-hover:scale-[1.015] transition-all duration-200 flex flex-col justify-between border border-white/10`}>
                  
                  {/* Top Label */}
                  <div className="flex items-center justify-between z-10">
                    <span className="text-[10px] font-bold tracking-widest uppercase text-white/80">
                      CIPLON
                    </span>
                    <span className="px-2 py-0.5 rounded-full text-[9px] font-bold bg-white/20 text-white backdrop-blur-xs">
                      {deck.slidesCount}
                    </span>
                  </div>

                  {/* 3D Product Pack Image / Logo */}
                  <div className="absolute right-3 -bottom-2 w-32 h-32 sm:w-36 sm:h-36 flex items-center justify-center opacity-90 group-hover:scale-105 group-hover:rotate-1 transition-transform duration-300">
                    <img
                      src={deck.image}
                      alt={deck.title}
                      className={`max-h-full max-w-full ${deck.isLogo ? 'object-contain brightness-0 invert drop-shadow-md' : 'object-contain drop-shadow-xl'}`}
                      onError={(e) => {
                        e.currentTarget.src = '/images/box_globucel_sc.jpg';
                      }}
                    />
                  </div>

                  {/* Title on Artwork */}
                  <div className="z-10 max-w-[65%]">
                    <h3 className="text-lg sm:text-xl font-black text-white leading-tight tracking-tight drop-shadow-xs">
                      {deck.title}
                    </h3>
                    <p className="text-[11px] text-white/80 font-medium truncate mt-0.5">
                      {deck.tag}
                    </p>
                  </div>

                  {/* Hover Overlay */}
                  <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <div className="w-11 h-11 rounded-full bg-white text-slate-900 shadow-xl flex items-center justify-center transform scale-75 group-hover:scale-100 transition-transform">
                      <Play className="w-5 h-5 fill-slate-900 ml-0.5" />
                    </div>
                  </div>
                </div>

                {/* Subtitle Under Thumbnail */}
                <div className="px-0.5">
                  <h4 className="text-sm font-bold text-slate-900 group-hover:text-violet-700 transition-colors truncate">
                    {deck.title}
                  </h4>
                  <div className="flex items-center gap-1.5 text-xs text-slate-400 mt-0.5">
                    <span className={`font-semibold ${deck.categoryColor}`}>
                      In {deck.category}
                    </span>
                    <span>&bull;</span>
                    <span>{deck.updated}</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* 4. Core Metrics Row */}
        <div className="space-y-4 pt-4 border-t border-slate-200/80">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-slate-900">
              Operations & Inventory Metrics
            </h3>
            <span className="text-xs text-slate-500">Live platform status</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Metric 1: Inquiries */}
            <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-2xs space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-slate-500">Inquiries</span>
                <span className="w-8 h-8 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
                  <Mail className="w-4 h-4" />
                </span>
              </div>
              <div>
                <span className="text-2xl font-bold text-slate-900">{totalEnquiries}</span>
                <p className="text-[11px] text-amber-700 font-medium mt-0.5">{pendingEnquiries} pending review</p>
              </div>
            </div>

            {/* Metric 2: Products */}
            <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-2xs space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-slate-500">Products</span>
                <span className="w-8 h-8 rounded-xl bg-violet-50 text-violet-600 flex items-center justify-center">
                  <Package className="w-4 h-4" />
                </span>
              </div>
              <div>
                <span className="text-2xl font-bold text-slate-900">{totalProducts}</span>
                <p className="text-[11px] text-slate-500 mt-0.5">{activeProducts} active formulations</p>
              </div>
            </div>

            {/* Metric 3: Categories */}
            <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-2xs space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-slate-500">Therapeutic Areas</span>
                <span className="w-8 h-8 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
                  <FolderTree className="w-4 h-4" />
                </span>
              </div>
              <div>
                <span className="text-2xl font-bold text-slate-900">{totalCategories}</span>
                <p className="text-[11px] text-slate-500 mt-0.5">Clinical portfolios</p>
              </div>
            </div>

            {/* Metric 4: Field Operations */}
            <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-2xs space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-slate-500">MR Visual Aids</span>
                <span className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
                  <Presentation className="w-4 h-4" />
                </span>
              </div>
              <div>
                <span className="text-2xl font-bold text-slate-900">Active</span>
                <p className="text-[11px] text-emerald-700 font-medium mt-0.5">E-Detailing enabled</p>
              </div>
            </div>
          </div>
        </div>

        {/* 5. Recent Commercial Inquiries & Products */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Recent Inquiries */}
          <div className="bg-white rounded-2xl border border-slate-200/80 p-5 sm:p-6 shadow-2xs">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <Mail className="w-4 h-4 text-violet-600" />
                <span>Recent Commercial Inquiries</span>
              </h3>
              <Link href="/admin/enquiries" className="text-xs font-semibold text-violet-600 hover:text-violet-800">
                View all &rarr;
              </Link>
            </div>

            <div className="mt-4">
              {recentEnquiries.length === 0 ? (
                <div className="py-8 text-center text-slate-400">
                  <p className="text-xs">No pending commercial inquiries.</p>
                </div>
              ) : (
                <div className="divide-y divide-slate-100">
                  {recentEnquiries.slice(0, 5).map((enq) => (
                    <div key={enq.id} className="py-2.5 flex items-center justify-between text-xs">
                      <div>
                        <strong className="block text-slate-900">{enq.full_name || enq.name}</strong>
                        <span className="text-slate-500 text-[11px]">{enq.city || 'Commercial Request'} &bull; {enq.email}</span>
                      </div>
                      <span className="text-[10px] text-amber-700 bg-amber-50 px-2 py-0.5 rounded-full font-medium">
                        {enq.status || 'Pending'}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Recent Products */}
          <div className="bg-white rounded-2xl border border-slate-200/80 p-5 sm:p-6 shadow-2xs">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <Package className="w-4 h-4 text-violet-600" />
                <span>Recently Added Formulations</span>
              </h3>
              <Link href="/admin/products" className="text-xs font-semibold text-violet-600 hover:text-violet-800">
                Manage &rarr;
              </Link>
            </div>

            <div className="mt-4">
              {recentProducts.length === 0 ? (
                <div className="py-8 text-center text-slate-400">
                  <p className="text-xs">No products in catalog.</p>
                </div>
              ) : (
                <div className="divide-y divide-slate-100">
                  {recentProducts.slice(0, 5).map((prod) => (
                    <div key={prod.id} className="py-2.5 flex items-center justify-between text-xs">
                      <div>
                        <strong className="block text-slate-900">{prod.brand_name}</strong>
                        <span className="text-slate-500 text-[11px] truncate max-w-xs block">{prod.generic_name}</span>
                      </div>
                      <span className="text-[10px] text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full font-medium">
                        {prod.dosage_form || 'Formulation'}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

      </div>
    </AdminLayout>
  );
}
