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
        
        {/* 1. Header & 3 Quick Action Cards */}
        <div className="space-y-4">
          <div className="flex items-center justify-between gap-4">
            <h2 className="text-xl sm:text-2xl font-semibold tracking-tight text-slate-800">
              Recents
            </h2>

            <Link
              href="/admin/products/add"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-medium text-xs transition-colors cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5 stroke-[2]" />
              <span>New Formulation</span>
            </Link>
          </div>

          {/* 3 Quick Action Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {/* Card 1: Add Formulation */}
            <Link
              href="/admin/products/add"
              className="group p-3.5 rounded-2xl bg-white border border-slate-200 hover:border-violet-400 transition-colors flex items-center gap-3 cursor-pointer"
            >
              <div className="w-9 h-9 rounded-xl bg-violet-50 text-violet-600 border border-violet-100 flex items-center justify-center shrink-0 group-hover:bg-violet-600 group-hover:text-white transition-colors">
                <Plus className="w-4 h-4 stroke-[2]" />
              </div>
              <span className="text-xs font-medium text-slate-800 group-hover:text-violet-700 transition-colors truncate">
                New Formulation
              </span>
            </Link>

            {/* Card 2: Visual Aids */}
            <Link
              href="/admin/products"
              className="group p-3.5 rounded-2xl bg-white border border-slate-200 hover:border-purple-400 transition-colors flex items-center gap-3 cursor-pointer"
            >
              <div className="w-9 h-9 rounded-xl bg-purple-50 text-purple-600 border border-purple-100 flex items-center justify-center shrink-0 group-hover:bg-purple-600 group-hover:text-white transition-colors">
                <Presentation className="w-4 h-4" />
              </div>
              <span className="text-xs font-medium text-slate-800 group-hover:text-purple-700 transition-colors truncate">
                Visual Aids
              </span>
            </Link>

            {/* Card 3: Inquiries */}
            <Link
              href="/admin/enquiries"
              className="group p-3.5 rounded-2xl bg-white border border-slate-200 hover:border-amber-400 transition-colors flex items-center gap-3 cursor-pointer"
            >
              <div className="w-9 h-9 rounded-xl bg-amber-50 text-amber-600 border border-amber-100 flex items-center justify-center shrink-0 group-hover:bg-amber-600 group-hover:text-white transition-colors">
                <Mail className="w-4 h-4" />
              </div>
              <span className="text-xs font-medium text-slate-800 group-hover:text-amber-700 transition-colors truncate">
                Inquiries ({pendingEnquiries})
              </span>
            </Link>
          </div>
        </div>

        {/* 2. Segmented Pill Filter */}
        <div className="flex items-center gap-1.5 p-1 rounded-xl bg-slate-200/50 w-fit">
          <button
            type="button"
            onClick={() => setActiveFilter('all')}
            className={`px-3 py-1 rounded-lg text-xs transition-colors cursor-pointer ${
              activeFilter === 'all'
                ? 'bg-white text-slate-900 font-semibold'
                : 'text-slate-600 hover:text-slate-900 font-normal'
            }`}
          >
            All Catalogs
          </button>
          <button
            type="button"
            onClick={() => setActiveFilter('active')}
            className={`px-3 py-1 rounded-lg text-xs transition-colors cursor-pointer ${
              activeFilter === 'active'
                ? 'bg-white text-slate-900 font-semibold'
                : 'text-slate-600 hover:text-slate-900 font-normal'
            }`}
          >
            Active Formulations ({activeProducts})
          </button>
          <button
            type="button"
            onClick={() => setActiveFilter('leads')}
            className={`px-3 py-1 rounded-lg text-xs transition-colors cursor-pointer ${
              activeFilter === 'leads'
                ? 'bg-white text-slate-900 font-semibold'
                : 'text-slate-600 hover:text-slate-900 font-normal'
            }`}
          >
            Trade Leads ({totalEnquiries})
          </button>
        </div>

        {/* 3. Presentation Cards Grid (Clean Flat Minimal) */}
        <div className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {adminDecks.map((deck) => (
              <Link
                key={deck.id}
                href="/admin/products"
                className="group flex flex-col space-y-2 cursor-pointer select-none"
              >
                {/* Visual Card Thumbnail (Zero Shadow) */}
                <div className={`relative aspect-[16/10] w-full rounded-2xl bg-gradient-to-br ${deck.bgGradient} p-4 sm:p-5 overflow-hidden flex flex-col justify-between border border-white/10`}>
                  
                  {/* Top Label */}
                  <div className="flex items-center justify-between z-10">
                    <span className="text-[10px] font-medium tracking-wider uppercase text-white/80">
                      Ciplon
                    </span>
                    <span className="px-2 py-0.5 rounded-full text-[9px] font-medium bg-white/20 text-white backdrop-blur-xs">
                      {deck.slidesCount}
                    </span>
                  </div>

                  {/* 3D Product Pack Image / Logo (No Drop Shadow) */}
                  <div className="absolute right-3 -bottom-2 w-28 h-28 sm:w-32 sm:h-32 flex items-center justify-center opacity-90 group-hover:scale-105 transition-transform duration-200">
                    <img
                      src={deck.image}
                      alt={deck.title}
                      className={`max-h-full max-w-full ${deck.isLogo ? 'object-contain brightness-0 invert' : 'object-contain'}`}
                      onError={(e) => {
                        e.currentTarget.src = '/images/box_globucel_sc.jpg';
                      }}
                    />
                  </div>

                  {/* Title on Artwork */}
                  <div className="z-10 max-w-[65%]">
                    <h3 className="text-base sm:text-lg font-semibold text-white leading-snug tracking-tight">
                      {deck.title}
                    </h3>
                  </div>

                  {/* Hover Overlay (No Shadow) */}
                  <div className="absolute inset-0 bg-black/15 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <div className="w-10 h-10 rounded-full bg-white text-slate-900 border border-slate-200 flex items-center justify-center transform scale-90 group-hover:scale-100 transition-transform">
                      <Play className="w-4 h-4 fill-slate-900 ml-0.5" />
                    </div>
                  </div>
                </div>

                {/* Subtitle Under Thumbnail */}
                <div className="px-0.5 flex items-center justify-between gap-2">
                  <h4 className="text-xs font-medium text-slate-800 group-hover:text-violet-700 transition-colors truncate">
                    {deck.title}
                  </h4>
                  <span className={`text-[11px] font-medium shrink-0 ${deck.categoryColor}`}>
                    {deck.category}
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* 4. Core Metrics Row (Clean Flat) */}
        <div className="space-y-3 pt-3 border-t border-slate-200/80">
          <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-400">
            Operations & Inventory
          </h3>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
            {/* Metric 1: Inquiries */}
            <div className="bg-white rounded-xl border border-slate-200/80 p-4 space-y-1">
              <div className="flex items-center justify-between">
                <span className="text-xs font-medium text-slate-500">Inquiries</span>
                <span className="w-7 h-7 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center">
                  <Mail className="w-3.5 h-3.5" />
                </span>
              </div>
              <div className="mt-1">
                <span className="text-2xl font-semibold text-slate-800">{totalEnquiries}</span>
                <span className="text-[11px] text-amber-700 block font-normal">{pendingEnquiries} pending</span>
              </div>
            </div>

            {/* Metric 2: Products */}
            <div className="bg-white rounded-xl border border-slate-200/80 p-4 space-y-1">
              <div className="flex items-center justify-between">
                <span className="text-xs font-medium text-slate-500">Products</span>
                <span className="w-7 h-7 rounded-lg bg-violet-50 text-violet-600 flex items-center justify-center">
                  <Package className="w-3.5 h-3.5" />
                </span>
              </div>
              <div className="mt-1">
                <span className="text-2xl font-semibold text-slate-800">{totalProducts}</span>
                <span className="text-[11px] text-slate-400 block font-normal">{activeProducts} active</span>
              </div>
            </div>

            {/* Metric 3: Categories */}
            <div className="bg-white rounded-xl border border-slate-200/80 p-4 space-y-1">
              <div className="flex items-center justify-between">
                <span className="text-xs font-medium text-slate-500">Portfolios</span>
                <span className="w-7 h-7 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
                  <FolderTree className="w-3.5 h-3.5" />
                </span>
              </div>
              <div className="mt-1">
                <span className="text-2xl font-semibold text-slate-800">{totalCategories}</span>
                <span className="text-[11px] text-slate-400 block font-normal">Categories</span>
              </div>
            </div>

            {/* Metric 4: Field Operations */}
            <div className="bg-white rounded-xl border border-slate-200/80 p-4 space-y-1">
              <div className="flex items-center justify-between">
                <span className="text-xs font-medium text-slate-500">E-Detailing</span>
                <span className="w-7 h-7 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
                  <Presentation className="w-3.5 h-3.5" />
                </span>
              </div>
              <div className="mt-1">
                <span className="text-2xl font-semibold text-slate-800">Active</span>
                <span className="text-[11px] text-emerald-700 block font-normal">Live on MR</span>
              </div>
            </div>
          </div>
        </div>

        {/* 5. Recent Commercial Inquiries & Products */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
          {/* Recent Inquiries */}
          <div className="bg-white rounded-2xl border border-slate-200/80 p-5">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="text-xs font-semibold text-slate-800 flex items-center gap-2">
                <Mail className="w-3.5 h-3.5 text-violet-600" />
                <span>Inquiries</span>
              </h3>
              <Link href="/admin/enquiries" className="text-xs font-medium text-violet-600 hover:text-violet-800">
                View all &rarr;
              </Link>
            </div>

            <div className="mt-3">
              {recentEnquiries.length === 0 ? (
                <div className="py-6 text-center text-slate-400 font-light">
                  <p className="text-xs">No pending commercial inquiries.</p>
                </div>
              ) : (
                <div className="divide-y divide-slate-100">
                  {recentEnquiries.slice(0, 5).map((enq) => (
                    <div key={enq.id} className="py-2.5 flex items-center justify-between text-xs">
                      <div>
                        <span className="block font-medium text-slate-800">{enq.full_name || enq.name}</span>
                        <span className="text-slate-400 font-light text-[11px]">{enq.city || 'Request'} &bull; {enq.email}</span>
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
          <div className="bg-white rounded-2xl border border-slate-200/80 p-5">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="text-xs font-semibold text-slate-800 flex items-center gap-2">
                <Package className="w-3.5 h-3.5 text-violet-600" />
                <span>Recent Formulations</span>
              </h3>
              <Link href="/admin/products" className="text-xs font-medium text-violet-600 hover:text-violet-800">
                Manage &rarr;
              </Link>
            </div>

            <div className="mt-3">
              {recentProducts.length === 0 ? (
                <div className="py-6 text-center text-slate-400 font-light">
                  <p className="text-xs">No products in catalog.</p>
                </div>
              ) : (
                <div className="divide-y divide-slate-100">
                  {recentProducts.slice(0, 5).map((prod) => (
                    <div key={prod.id} className="py-2.5 flex items-center justify-between text-xs">
                      <div>
                        <span className="block font-medium text-slate-800">{prod.brand_name}</span>
                        <span className="text-slate-400 font-light text-[11px] truncate max-w-xs block">{prod.generic_name}</span>
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
