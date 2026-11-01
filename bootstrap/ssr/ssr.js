import { useEffect, useMemo, useRef, useState } from "react";
import { Head, Link, createInertiaApp, router, useForm, usePage } from "@inertiajs/react";
import { Activity, AlertCircle, AlertTriangle, Archive, ArrowDown, ArrowLeft, ArrowRight, ArrowUp, ArrowUpRight, Award, Bell, BookOpen, Briefcase, Building2, Calendar, CalendarClock, Check, CheckCheck, CheckCircle2, ChevronDown, ChevronLeft, ChevronRight, Clock, Crosshair, Download, Droplet, Edit2, Edit3, ExternalLink, Eye, EyeOff, Factory, FileText, Film, Filter, FlaskConical, Folder, FolderEdit, FolderPlus, FolderTree, Gift, Globe, Globe2, GripVertical, Handshake, HeartPulse, Image, ImageIcon, Key, Layers, LayoutDashboard, LayoutGrid, List, Loader2, Lock, LogIn, LogOut, Mail, MapPin, Maximize, Maximize2, Menu, MessageSquare, Microscope, Minimize, MoveLeft, MoveRight, Navigation, Package, Percent, Phone, PhoneCall, Pill, Play, Plus, PlusCircle, Presentation, Receipt, RefreshCw, RotateCcw, Save, Search, Send, Settings, Share2, Shield, ShieldCheck, Sliders, Sparkles, Star, Stethoscope, Target, Thermometer, ToggleLeft, Trash2, TrendingUp, Upload, User, UserCheck, UserPlus, Users, X, XCircle } from "lucide-react";
import { Fragment, jsx, jsxs } from "react/jsx-runtime";
import toast from "react-hot-toast";
import axios from "axios";
import { createPortal } from "react-dom";
import createServer from "@inertiajs/react/server";
import { renderToString } from "react-dom/server";
//#region \0rolldown/runtime.js
var __defProp = Object.defineProperty;
var __exportAll = (all, no_symbols) => {
	let target = {};
	for (var name in all) __defProp(target, name, {
		get: all[name],
		enumerable: true
	});
	if (!no_symbols) __defProp(target, Symbol.toStringTag, { value: "Module" });
	return target;
};
//#endregion
//#region resources/js/components/admin/AdminSidebar.jsx
function AdminSidebar({ isOpen, onClose }) {
	const { url, props } = usePage();
	const currentPath = url.split("?")[0];
	const authUser = props.auth?.user;
	const adminName = authUser?.name || "Administrator";
	authUser?.email;
	const [searchQuery, setSearchQuery] = useState("");
	const isParentActive = (prefix) => currentPath.startsWith(prefix);
	const userRoles = authUser?.roles || [];
	const userPermissions = authUser?.permissions || [];
	const isSuperAdmin = authUser?.role === "admin" || userRoles.includes("super_admin");
	const hasPerm = (perm) => {
		if (isSuperAdmin) return true;
		if (!perm) return true;
		return userPermissions.includes(perm);
	};
	const navigationSections = [
		{
			title: "Workspace",
			items: [
				{
					name: "Dashboard",
					path: "/admin",
					icon: LayoutDashboard,
					active: currentPath === "/admin" || currentPath === "/admin/dashboard"
				},
				{
					name: "Field Operations & Map",
					path: "/admin/tracking",
					icon: MapPin,
					permission: "dcr.view",
					active: isParentActive("/admin/tracking")
				},
				{
					name: "Product Formulations",
					path: "/admin/products",
					icon: Package,
					permission: "products.view",
					active: isParentActive("/admin/product") && !currentPath.includes("/add") && !currentPath.includes("/create")
				},
				{
					name: "Add Formulation",
					path: "/admin/products/add",
					icon: PlusCircle,
					permission: "products.create",
					active: currentPath === "/admin/products/add" || currentPath === "/admin/products/create"
				},
				{
					name: "Categories",
					path: "/admin/category",
					icon: FolderTree,
					permission: "categories.view",
					active: currentPath === "/admin/category" || currentPath === "/admin/categories"
				}
			]
		},
		{
			title: "Employee & Field",
			items: [
				{
					name: "Employee Assign",
					path: "/mrconnect/employee-assign",
					icon: Users,
					active: isParentActive("/mrconnect/employee-assign")
				},
				{
					name: "Tour Plan",
					path: "/mrconnect/tour-plan",
					icon: Globe,
					active: isParentActive("/mrconnect/tour-plan")
				},
				{
					name: "Field Expenses",
					path: "/mrconnect/field-expenses",
					icon: Receipt,
					active: isParentActive("/mrconnect/field-expenses")
				},
				{
					name: "Leave",
					path: "/mrconnect/leave",
					icon: Calendar,
					active: isParentActive("/mrconnect/leave")
				}
			]
		},
		{
			title: "Sales & Targets",
			items: [
				{
					name: "Primary Sales",
					path: "/mrconnect/primary-sales",
					icon: TrendingUp,
					active: isParentActive("/mrconnect/primary-sales")
				},
				{
					name: "POB Order",
					path: "/mrconnect/pob-order",
					icon: Package,
					active: isParentActive("/mrconnect/pob-order")
				},
				{
					name: "Set Target",
					path: "/mrconnect/set-target",
					icon: Target,
					active: isParentActive("/mrconnect/set-target")
				}
			]
		},
		{
			title: "Media & Alert",
			items: [
				{
					name: "E-Detailing",
					path: "/mr/detailing",
					icon: Presentation,
					active: isParentActive("/mr/detailing")
				},
				{
					name: "Video Library",
					path: "/mrconnect/video-library",
					icon: Film,
					active: isParentActive("/mrconnect/video-library")
				},
				{
					name: "Slider",
					path: "/mrconnect/slider",
					icon: Sliders,
					active: isParentActive("/mrconnect/slider")
				},
				{
					name: "Notice / Announcement",
					path: "/mrconnect/notice",
					icon: Bell,
					active: isParentActive("/mrconnect/notice")
				}
			]
		},
		{
			title: "Sponsorship & Schemes",
			items: [{
				name: "Sponsor",
				path: "/mrconnect/sponsor",
				icon: Handshake,
				active: isParentActive("/mrconnect/sponsor")
			}, {
				name: "Scheme",
				path: "/mrconnect/scheme",
				icon: Percent,
				active: isParentActive("/mrconnect/scheme")
			}]
		},
		{
			title: "HR & Reports",
			items: [{
				name: "HR Directory",
				path: "/mrconnect/hr-section",
				icon: UserCheck,
				active: isParentActive("/mrconnect/hr-section")
			}, {
				name: "All Reports",
				path: "/mrconnect/all-reports",
				icon: FileText,
				active: isParentActive("/mrconnect/all-reports")
			}]
		},
		{
			title: "Management",
			items: [
				{
					name: "Commercial Inquiries",
					path: "/admin/enquiries",
					icon: Mail,
					active: isParentActive("/admin/enquiries")
				},
				{
					name: "Staff & Team",
					path: "/admin/staff",
					icon: Users,
					permission: "staff.view",
					active: isParentActive("/admin/staff")
				},
				{
					name: "Roles & Permissions",
					path: "/admin/roles",
					icon: Shield,
					permission: "roles.view",
					active: isParentActive("/admin/roles")
				},
				{
					name: "Company Settings",
					path: "/admin/settings",
					icon: Settings,
					permission: "settings.view",
					active: isParentActive("/admin/settings")
				}
			]
		}
	];
	return /* @__PURE__ */ jsxs(Fragment, { children: [isOpen && /* @__PURE__ */ jsx("div", {
		onClick: onClose,
		className: "fixed inset-0 bg-slate-900/40 backdrop-blur-xs z-40 lg:hidden transition-opacity",
		"aria-hidden": "true"
	}), /* @__PURE__ */ jsxs("aside", {
		className: `fixed top-0 bottom-0 left-0 z-50 w-64 bg-[#fbfbfd] border-r border-slate-200/80 flex flex-col transition-transform duration-200 ease-in-out lg:translate-x-0 ${isOpen ? "translate-x-0" : "-translate-x-full"}`,
		children: [
			/* @__PURE__ */ jsxs("div", {
				className: "h-16 px-4 border-b border-slate-100 flex items-center justify-between",
				children: [/* @__PURE__ */ jsxs(Link, {
					href: "/admin",
					className: "flex items-center gap-2.5 px-2 py-1.5 rounded-xl hover:bg-slate-200/60 transition-colors group cursor-pointer",
					children: [/* @__PURE__ */ jsx("div", {
						className: "w-7 h-7 rounded-lg bg-gradient-to-br from-violet-600 via-indigo-600 to-purple-700 text-white flex items-center justify-center font-semibold text-xs",
						children: "CA"
					}), /* @__PURE__ */ jsxs("div", {
						className: "flex items-center gap-1.5",
						children: [/* @__PURE__ */ jsx("span", {
							className: "text-xs font-semibold text-slate-800 tracking-tight",
							children: "Ciplon Admin"
						}), /* @__PURE__ */ jsx(ChevronDown, { className: "w-3.5 h-3.5 text-slate-400 group-hover:text-slate-700 transition-colors" })]
					})]
				}), /* @__PURE__ */ jsxs("div", {
					className: "flex items-center gap-1",
					children: [/* @__PURE__ */ jsxs(Link, {
						href: "/admin/enquiries",
						className: "p-1.5 rounded-lg text-slate-400 hover:text-slate-800 hover:bg-slate-200/60 transition-colors relative",
						title: "Commercial Inquiries",
						children: [/* @__PURE__ */ jsx(Bell, { className: "w-4 h-4" }), /* @__PURE__ */ jsx("span", { className: "w-1.5 h-1.5 bg-violet-600 rounded-full absolute top-1.5 right-1.5 ring-2 ring-white" })]
					}), /* @__PURE__ */ jsx("button", {
						type: "button",
						onClick: onClose,
						className: "p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 lg:hidden cursor-pointer",
						"aria-label": "Close sidebar",
						children: /* @__PURE__ */ jsx(X, { className: "w-4 h-4" })
					})]
				})]
			}),
			/* @__PURE__ */ jsx("div", {
				className: "p-3",
				children: /* @__PURE__ */ jsxs("div", {
					className: "relative",
					children: [
						/* @__PURE__ */ jsx(Search, { className: "w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" }),
						/* @__PURE__ */ jsx("input", {
							type: "text",
							value: searchQuery,
							onChange: (e) => setSearchQuery(e.target.value),
							placeholder: "Search & commands",
							className: "w-full bg-slate-200/60 hover:bg-slate-200/80 focus:bg-white border border-transparent focus:border-slate-300 rounded-xl pl-8 pr-8 py-1.5 text-xs text-slate-800 placeholder:text-slate-400 focus:outline-none transition-all font-normal"
						}),
						/* @__PURE__ */ jsx("span", {
							className: "absolute right-2.5 top-1/2 -translate-y-1/2 text-[10px] font-mono text-slate-400 bg-white border border-slate-200 px-1 py-0.2 rounded",
							children: "⌘K"
						})
					]
				})
			}),
			/* @__PURE__ */ jsx("div", {
				className: "flex-1 overflow-y-auto px-3 py-1 space-y-4",
				children: navigationSections.map((section) => {
					const filteredItems = section.items.filter((item) => {
						if (item.permission && !hasPerm(item.permission)) return false;
						return item.name.toLowerCase().includes(searchQuery.toLowerCase());
					});
					if (filteredItems.length === 0) return null;
					return /* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("div", {
						className: "px-2.5 pb-1.5 text-[10px] font-medium uppercase tracking-wider text-slate-400",
						children: section.title
					}), /* @__PURE__ */ jsx("div", {
						className: "space-y-0.5",
						children: filteredItems.map((item) => {
							const Icon = item.icon;
							return /* @__PURE__ */ jsxs(Link, {
								href: item.path,
								onClick: () => {
									if (isOpen && typeof onClose === "function") onClose();
								},
								className: `flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-medium transition-all cursor-pointer ${item.active ? "bg-slate-900 text-white font-medium" : "text-slate-600 hover:text-slate-900 hover:bg-slate-200/50"}`,
								children: [/* @__PURE__ */ jsx(Icon, { className: `w-4 h-4 ${item.active ? "text-violet-400 stroke-[2]" : "text-slate-400"}` }), /* @__PURE__ */ jsx("span", {
									className: "flex-1 truncate",
									children: item.name
								})]
							}, item.path);
						})
					})] }, section.title);
				})
			}),
			/* @__PURE__ */ jsx("div", {
				className: "p-3 border-t border-slate-100 bg-white",
				children: /* @__PURE__ */ jsxs("div", {
					className: "p-2 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-between gap-2",
					children: [/* @__PURE__ */ jsxs("div", {
						className: "flex items-center gap-2 min-w-0",
						children: [/* @__PURE__ */ jsx("div", {
							className: "w-7 h-7 rounded-full bg-gradient-to-tr from-violet-600 to-indigo-600 text-white font-semibold text-xs flex items-center justify-center shrink-0",
							children: adminName.charAt(0).toUpperCase()
						}), /* @__PURE__ */ jsxs("div", {
							className: "min-w-0 flex-1",
							children: [/* @__PURE__ */ jsx("span", {
								className: "block text-xs font-semibold text-slate-800 truncate leading-tight",
								children: adminName
							}), /* @__PURE__ */ jsx("span", {
								className: "block text-[10px] text-slate-400 font-normal truncate",
								children: "System Admin"
							})]
						})]
					}), /* @__PURE__ */ jsx("button", {
						type: "button",
						onClick: () => router.post("/logout"),
						className: "p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer",
						title: "Sign Out",
						children: /* @__PURE__ */ jsx(LogOut, { className: "w-3.5 h-3.5" })
					})]
				})
			})
		]
	})] });
}
//#endregion
//#region resources/js/components/admin/AdminNavbar.jsx
function AdminNavbar({ onToggleSidebar }) {
	const { url, props } = usePage();
	const currentPath = url.split("?")[0];
	const authUser = props.auth?.user || {};
	const adminName = authUser.name || "Administrator";
	authUser.email;
	const getNavContext = () => {
		const path = currentPath.toLowerCase();
		if (path === "/admin" || path === "/admin/dashboard") return {
			title: "Dashboard",
			parent: null
		};
		if (path === "/admin/products") return {
			title: "Products & Formulations",
			parent: null
		};
		if (path === "/admin/categories" || path === "/admin/category") return {
			title: "Categories",
			parent: null
		};
		if (path === "/admin/staff") return {
			title: "Staff & Team",
			parent: null
		};
		if (path === "/admin/roles") return {
			title: "Roles & Permissions",
			parent: null
		};
		if (path === "/admin/settings") return {
			title: "Settings",
			parent: null
		};
		if (path === "/admin/enquiries") return {
			title: "Commercial Inquiries",
			parent: null
		};
		if (path.includes("/products/add") || path.includes("/products/create")) return {
			title: "Add New Formulation",
			parent: {
				label: "Products",
				url: "/admin/products"
			}
		};
		if (path.includes("/products/") && path.includes("/edit")) return {
			title: "Edit Formulation",
			parent: {
				label: "Products",
				url: "/admin/products"
			}
		};
		if (path.startsWith("/admin/products/") && path.split("/").filter(Boolean).length === 3) return {
			title: "Product Details",
			parent: {
				label: "Products",
				url: "/admin/products"
			}
		};
		const parts = currentPath.split("/").filter(Boolean);
		const lastPart = parts[parts.length - 1] || "Dashboard";
		return {
			title: lastPart.charAt(0).toUpperCase() + lastPart.slice(1),
			parent: null
		};
	};
	const navContext = getNavContext();
	return /* @__PURE__ */ jsxs("header", {
		className: "h-16 bg-white/90 backdrop-blur-md border-b border-slate-200/80 px-4 sm:px-6 flex items-center justify-between sticky top-0 z-30",
		children: [/* @__PURE__ */ jsxs("div", {
			className: "flex items-center gap-2.5 min-w-0",
			children: [/* @__PURE__ */ jsx("button", {
				type: "button",
				onClick: onToggleSidebar,
				className: "p-1.5 rounded-xl text-slate-600 hover:text-slate-900 hover:bg-slate-100 lg:hidden cursor-pointer",
				"aria-label": "Open sidebar",
				children: /* @__PURE__ */ jsx(Menu, { className: "w-5 h-5" })
			}), navContext.parent ? /* @__PURE__ */ jsxs("div", {
				className: "flex items-center gap-2 min-w-0",
				children: [/* @__PURE__ */ jsx(Link, {
					href: navContext.parent.url,
					className: "p-1.5 rounded-lg text-slate-500 hover:text-slate-900 hover:bg-slate-100 transition-colors shrink-0",
					title: `Back to ${navContext.parent.label}`,
					children: /* @__PURE__ */ jsx(ArrowLeft, { className: "w-4 h-4 stroke-[2.2]" })
				}), /* @__PURE__ */ jsxs("div", {
					className: "flex items-center gap-1.5 text-xs sm:text-sm min-w-0",
					children: [
						/* @__PURE__ */ jsx(Link, {
							href: navContext.parent.url,
							className: "hidden sm:inline hover:text-slate-900 transition-colors truncate font-medium text-slate-500",
							children: navContext.parent.label
						}),
						/* @__PURE__ */ jsx("span", {
							className: "hidden sm:inline text-slate-300",
							children: "/"
						}),
						/* @__PURE__ */ jsx("h1", {
							className: "text-sm sm:text-base font-semibold text-slate-800 tracking-tight truncate",
							children: navContext.title
						})
					]
				})]
			}) : /* @__PURE__ */ jsx("h1", {
				className: "text-sm sm:text-base font-semibold text-slate-800 tracking-tight truncate",
				children: navContext.title
			})]
		}), /* @__PURE__ */ jsxs("div", {
			className: "flex items-center gap-2.5",
			children: [/* @__PURE__ */ jsxs(Link, {
				href: "/",
				className: "hidden sm:inline-flex items-center gap-1 text-xs font-normal text-slate-500 hover:text-slate-800 px-2.5 py-1.5 rounded-lg hover:bg-slate-100 transition-colors",
				children: [/* @__PURE__ */ jsx("span", { children: "Live Site" }), /* @__PURE__ */ jsx(ExternalLink, { className: "w-3 h-3 text-slate-400" })]
			}), /* @__PURE__ */ jsxs("div", {
				className: "flex items-center gap-2 p-1 pl-1.5 pr-2 rounded-xl bg-slate-50 border border-slate-200/80",
				children: [/* @__PURE__ */ jsx("div", {
					className: "w-6 h-6 rounded-lg bg-gradient-to-tr from-violet-600 to-indigo-600 text-white flex items-center justify-center text-[11px] font-semibold",
					children: adminName.charAt(0).toUpperCase()
				}), /* @__PURE__ */ jsx("span", {
					className: "text-xs font-medium text-slate-700 truncate max-w-[120px]",
					children: adminName
				})]
			})]
		})]
	});
}
//#endregion
//#region resources/js/layouts/AdminLayout.jsx
function AdminLayout({ children }) {
	const [sidebarOpen, setSidebarOpen] = useState(false);
	return /* @__PURE__ */ jsxs("div", {
		className: "min-h-screen bg-[#f8f9fc] flex antialiased text-slate-800 font-sans",
		children: [/* @__PURE__ */ jsx(AdminSidebar, {
			isOpen: sidebarOpen,
			onClose: () => setSidebarOpen(false)
		}), /* @__PURE__ */ jsxs("div", {
			className: "flex-1 flex flex-col lg:pl-64 min-w-0",
			children: [/* @__PURE__ */ jsx(AdminNavbar, { onToggleSidebar: () => setSidebarOpen(!sidebarOpen) }), /* @__PURE__ */ jsx("main", {
				className: "flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto",
				children
			})]
		})]
	});
}
//#endregion
//#region resources/js/Pages/admin/Dashboard.jsx
var Dashboard_exports$1 = /* @__PURE__ */ __exportAll({ default: () => Dashboard$1 });
function Dashboard$1({ stats = {}, recentProducts = [], recentEnquiries = [] }) {
	const totalProducts = stats.totalProducts ?? 0;
	const activeProducts = stats.activeProducts ?? 0;
	stats.featuredProducts;
	const totalCategories = stats.totalCategories ?? 0;
	const totalEnquiries = stats.totalEnquiries ?? 0;
	const pendingEnquiries = stats.pendingEnquiries ?? 0;
	const [activeFilter, setActiveFilter] = useState("all");
	return /* @__PURE__ */ jsx(AdminLayout, { children: /* @__PURE__ */ jsxs("div", {
		className: "space-y-8 pb-12 font-sans",
		children: [
			/* @__PURE__ */ jsxs("div", {
				className: "space-y-4",
				children: [/* @__PURE__ */ jsxs("div", {
					className: "flex items-center justify-between gap-4",
					children: [/* @__PURE__ */ jsx("h2", {
						className: "text-xl sm:text-2xl font-semibold tracking-tight text-slate-800",
						children: "Recents"
					}), /* @__PURE__ */ jsxs(Link, {
						href: "/admin/products/add",
						className: "inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-medium text-xs transition-colors cursor-pointer",
						children: [/* @__PURE__ */ jsx(Plus, { className: "w-3.5 h-3.5 stroke-[2]" }), /* @__PURE__ */ jsx("span", { children: "New Formulation" })]
					})]
				}), /* @__PURE__ */ jsxs("div", {
					className: "grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3",
					children: [
						/* @__PURE__ */ jsxs(Link, {
							href: "/admin/tracking",
							className: "group p-3.5 rounded-2xl bg-white border border-sky-200 hover:border-sky-400 transition-colors flex items-center gap-3 cursor-pointer",
							children: [/* @__PURE__ */ jsx("div", {
								className: "w-9 h-9 rounded-xl bg-sky-50 text-sky-600 border border-sky-100 flex items-center justify-center shrink-0 group-hover:bg-sky-600 group-hover:text-white transition-colors",
								children: /* @__PURE__ */ jsx(Navigation, { className: "w-4 h-4" })
							}), /* @__PURE__ */ jsxs("div", {
								className: "min-w-0",
								children: [/* @__PURE__ */ jsx("span", {
									className: "text-xs font-semibold text-slate-800 group-hover:text-sky-700 transition-colors block truncate",
									children: "Field Operations"
								}), /* @__PURE__ */ jsxs("span", {
									className: "text-[10px] text-emerald-600 font-medium flex items-center gap-1",
									children: [/* @__PURE__ */ jsx("span", { className: "w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" }), "Live GPS Map"]
								})]
							})]
						}),
						/* @__PURE__ */ jsxs(Link, {
							href: "/admin/products/add",
							className: "group p-3.5 rounded-2xl bg-white border border-slate-200 hover:border-violet-400 transition-colors flex items-center gap-3 cursor-pointer",
							children: [/* @__PURE__ */ jsx("div", {
								className: "w-9 h-9 rounded-xl bg-violet-50 text-violet-600 border border-violet-100 flex items-center justify-center shrink-0 group-hover:bg-violet-600 group-hover:text-white transition-colors",
								children: /* @__PURE__ */ jsx(Plus, { className: "w-4 h-4 stroke-[2]" })
							}), /* @__PURE__ */ jsx("span", {
								className: "text-xs font-medium text-slate-800 group-hover:text-violet-700 transition-colors truncate",
								children: "New Formulation"
							})]
						}),
						/* @__PURE__ */ jsxs(Link, {
							href: "/admin/products",
							className: "group p-3.5 rounded-2xl bg-white border border-slate-200 hover:border-purple-400 transition-colors flex items-center gap-3 cursor-pointer",
							children: [/* @__PURE__ */ jsx("div", {
								className: "w-9 h-9 rounded-xl bg-purple-50 text-purple-600 border border-purple-100 flex items-center justify-center shrink-0 group-hover:bg-purple-600 group-hover:text-white transition-colors",
								children: /* @__PURE__ */ jsx(Presentation, { className: "w-4 h-4" })
							}), /* @__PURE__ */ jsx("span", {
								className: "text-xs font-medium text-slate-800 group-hover:text-purple-700 transition-colors truncate",
								children: "Visual Aids"
							})]
						}),
						/* @__PURE__ */ jsxs(Link, {
							href: "/admin/enquiries",
							className: "group p-3.5 rounded-2xl bg-white border border-slate-200 hover:border-amber-400 transition-colors flex items-center gap-3 cursor-pointer",
							children: [/* @__PURE__ */ jsx("div", {
								className: "w-9 h-9 rounded-xl bg-amber-50 text-amber-600 border border-amber-100 flex items-center justify-center shrink-0 group-hover:bg-amber-600 group-hover:text-white transition-colors",
								children: /* @__PURE__ */ jsx(Mail, { className: "w-4 h-4" })
							}), /* @__PURE__ */ jsxs("span", {
								className: "text-xs font-medium text-slate-800 group-hover:text-amber-700 transition-colors truncate",
								children: [
									"Inquiries (",
									pendingEnquiries,
									")"
								]
							})]
						})
					]
				})]
			}),
			/* @__PURE__ */ jsxs("div", {
				className: "flex items-center gap-1.5 p-1 rounded-xl bg-slate-200/50 w-fit",
				children: [
					/* @__PURE__ */ jsx("button", {
						type: "button",
						onClick: () => setActiveFilter("all"),
						className: `px-3 py-1 rounded-lg text-xs transition-colors cursor-pointer ${activeFilter === "all" ? "bg-white text-slate-900 font-semibold" : "text-slate-600 hover:text-slate-900 font-normal"}`,
						children: "All Catalogs"
					}),
					/* @__PURE__ */ jsxs("button", {
						type: "button",
						onClick: () => setActiveFilter("active"),
						className: `px-3 py-1 rounded-lg text-xs transition-colors cursor-pointer ${activeFilter === "active" ? "bg-white text-slate-900 font-semibold" : "text-slate-600 hover:text-slate-900 font-normal"}`,
						children: [
							"Active Formulations (",
							activeProducts,
							")"
						]
					}),
					/* @__PURE__ */ jsxs("button", {
						type: "button",
						onClick: () => setActiveFilter("leads"),
						className: `px-3 py-1 rounded-lg text-xs transition-colors cursor-pointer ${activeFilter === "leads" ? "bg-white text-slate-900 font-semibold" : "text-slate-600 hover:text-slate-900 font-normal"}`,
						children: [
							"Trade Leads (",
							totalEnquiries,
							")"
						]
					})
				]
			}),
			/* @__PURE__ */ jsx("div", {
				className: "space-y-4",
				children: /* @__PURE__ */ jsx("div", {
					className: "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5",
					children: [
						{
							id: "brand-slide",
							title: "Ciplon Corporate Profile",
							category: "Brand Heritage",
							categoryColor: "text-violet-600",
							tag: "ISO 9001:2015 & WHO-GMP",
							updated: "Updated today",
							bgGradient: "from-violet-600 via-purple-600 to-indigo-700",
							image: "/images/ciplon_logo.png",
							isLogo: true,
							slidesCount: "Fixed #1"
						},
						{
							id: "amoxiclav",
							title: "AmoxiClav 625 Duo",
							category: "Antibiotics",
							categoryColor: "text-sky-600",
							tag: "10x10 Alu-Alu Strip",
							updated: "Updated 20m ago",
							bgGradient: "from-sky-500 via-blue-600 to-indigo-600",
							image: "/images/box_factocel_ix.jpg",
							slidesCount: "12 Slides"
						},
						{
							id: "ciplocid",
							title: "Ciplocid-DSR Capsules",
							category: "Gastro Care",
							categoryColor: "text-purple-600",
							tag: "Rabeprazole + Domperidone",
							updated: "Updated 1h ago",
							bgGradient: "from-purple-600 via-fuchsia-600 to-pink-600",
							image: "/images/box_globucel_sc.jpg",
							slidesCount: "8 Slides"
						},
						{
							id: "cardiovast",
							title: "Cardiovast 20",
							category: "Cardiology Care",
							categoryColor: "text-blue-600",
							tag: "Atorvastatin Calcium IP",
							updated: "Updated 2h ago",
							bgGradient: "from-blue-600 via-indigo-600 to-cyan-600",
							image: "/images/box_fibrogen_i.jpg",
							slidesCount: "10 Slides"
						},
						{
							id: "aerobreathe",
							title: "AeroBreathe 200 Inhaler",
							category: "Pulmonology",
							categoryColor: "text-violet-600",
							tag: "Budesonide + Formoterol",
							updated: "Updated 4h ago",
							bgGradient: "from-indigo-600 via-violet-600 to-purple-800",
							image: "/images/box_globucel_sc.jpg",
							slidesCount: "14 Slides"
						},
						{
							id: "ciplonpara",
							title: "CiplonPara 650",
							category: "Analgesics",
							categoryColor: "text-purple-600",
							tag: "Paracetamol Tablets IP",
							updated: "Updated today",
							bgGradient: "from-fuchsia-600 via-purple-700 to-indigo-800",
							image: "/images/box_factocel_ix.jpg",
							slidesCount: "6 Slides"
						}
					].map((deck) => /* @__PURE__ */ jsxs(Link, {
						href: "/admin/products",
						className: "group flex flex-col space-y-2 cursor-pointer select-none",
						children: [/* @__PURE__ */ jsxs("div", {
							className: `relative aspect-[16/10] w-full rounded-2xl bg-gradient-to-br ${deck.bgGradient} p-4 sm:p-5 overflow-hidden flex flex-col justify-between border border-white/10`,
							children: [
								/* @__PURE__ */ jsxs("div", {
									className: "flex items-center justify-between z-10",
									children: [/* @__PURE__ */ jsx("span", {
										className: "text-[10px] font-medium tracking-wider uppercase text-white/80",
										children: "Ciplon"
									}), /* @__PURE__ */ jsx("span", {
										className: "px-2 py-0.5 rounded-full text-[9px] font-medium bg-white/20 text-white backdrop-blur-xs",
										children: deck.slidesCount
									})]
								}),
								/* @__PURE__ */ jsx("div", {
									className: "absolute right-3 -bottom-2 w-28 h-28 sm:w-32 sm:h-32 flex items-center justify-center opacity-90 group-hover:scale-105 transition-transform duration-200",
									children: /* @__PURE__ */ jsx("img", {
										src: deck.image,
										alt: deck.title,
										className: `max-h-full max-w-full ${deck.isLogo ? "object-contain brightness-0 invert" : "object-contain"}`,
										onError: (e) => {
											e.currentTarget.src = "/images/box_globucel_sc.jpg";
										}
									})
								}),
								/* @__PURE__ */ jsx("div", {
									className: "z-10 max-w-[65%]",
									children: /* @__PURE__ */ jsx("h3", {
										className: "text-base sm:text-lg font-semibold text-white leading-snug tracking-tight",
										children: deck.title
									})
								}),
								/* @__PURE__ */ jsx("div", {
									className: "absolute inset-0 bg-black/15 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center",
									children: /* @__PURE__ */ jsx("div", {
										className: "w-10 h-10 rounded-full bg-white text-slate-900 border border-slate-200 flex items-center justify-center transform scale-90 group-hover:scale-100 transition-transform",
										children: /* @__PURE__ */ jsx(Play, { className: "w-4 h-4 fill-slate-900 ml-0.5" })
									})
								})
							]
						}), /* @__PURE__ */ jsxs("div", {
							className: "px-0.5 flex items-center justify-between gap-2",
							children: [/* @__PURE__ */ jsx("h4", {
								className: "text-xs font-medium text-slate-800 group-hover:text-violet-700 transition-colors truncate",
								children: deck.title
							}), /* @__PURE__ */ jsx("span", {
								className: `text-[11px] font-medium shrink-0 ${deck.categoryColor}`,
								children: deck.category
							})]
						})]
					}, deck.id))
				})
			}),
			/* @__PURE__ */ jsxs("div", {
				className: "space-y-3 pt-3 border-t border-slate-200/80",
				children: [/* @__PURE__ */ jsx("h3", {
					className: "text-xs font-semibold uppercase tracking-wider text-slate-400",
					children: "Operations & Inventory"
				}), /* @__PURE__ */ jsxs("div", {
					className: "grid grid-cols-2 lg:grid-cols-4 gap-3",
					children: [
						/* @__PURE__ */ jsxs("div", {
							className: "bg-white rounded-xl border border-slate-200/80 p-4 space-y-1",
							children: [/* @__PURE__ */ jsxs("div", {
								className: "flex items-center justify-between",
								children: [/* @__PURE__ */ jsx("span", {
									className: "text-xs font-medium text-slate-500",
									children: "Inquiries"
								}), /* @__PURE__ */ jsx("span", {
									className: "w-7 h-7 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center",
									children: /* @__PURE__ */ jsx(Mail, { className: "w-3.5 h-3.5" })
								})]
							}), /* @__PURE__ */ jsxs("div", {
								className: "mt-1",
								children: [/* @__PURE__ */ jsx("span", {
									className: "text-2xl font-semibold text-slate-800",
									children: totalEnquiries
								}), /* @__PURE__ */ jsxs("span", {
									className: "text-[11px] text-amber-700 block font-normal",
									children: [pendingEnquiries, " pending"]
								})]
							})]
						}),
						/* @__PURE__ */ jsxs("div", {
							className: "bg-white rounded-xl border border-slate-200/80 p-4 space-y-1",
							children: [/* @__PURE__ */ jsxs("div", {
								className: "flex items-center justify-between",
								children: [/* @__PURE__ */ jsx("span", {
									className: "text-xs font-medium text-slate-500",
									children: "Products"
								}), /* @__PURE__ */ jsx("span", {
									className: "w-7 h-7 rounded-lg bg-violet-50 text-violet-600 flex items-center justify-center",
									children: /* @__PURE__ */ jsx(Package, { className: "w-3.5 h-3.5" })
								})]
							}), /* @__PURE__ */ jsxs("div", {
								className: "mt-1",
								children: [/* @__PURE__ */ jsx("span", {
									className: "text-2xl font-semibold text-slate-800",
									children: totalProducts
								}), /* @__PURE__ */ jsxs("span", {
									className: "text-[11px] text-slate-400 block font-normal",
									children: [activeProducts, " active"]
								})]
							})]
						}),
						/* @__PURE__ */ jsxs("div", {
							className: "bg-white rounded-xl border border-slate-200/80 p-4 space-y-1",
							children: [/* @__PURE__ */ jsxs("div", {
								className: "flex items-center justify-between",
								children: [/* @__PURE__ */ jsx("span", {
									className: "text-xs font-medium text-slate-500",
									children: "Portfolios"
								}), /* @__PURE__ */ jsx("span", {
									className: "w-7 h-7 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center",
									children: /* @__PURE__ */ jsx(FolderTree, { className: "w-3.5 h-3.5" })
								})]
							}), /* @__PURE__ */ jsxs("div", {
								className: "mt-1",
								children: [/* @__PURE__ */ jsx("span", {
									className: "text-2xl font-semibold text-slate-800",
									children: totalCategories
								}), /* @__PURE__ */ jsx("span", {
									className: "text-[11px] text-slate-400 block font-normal",
									children: "Categories"
								})]
							})]
						}),
						/* @__PURE__ */ jsxs("div", {
							className: "bg-white rounded-xl border border-slate-200/80 p-4 space-y-1",
							children: [/* @__PURE__ */ jsxs("div", {
								className: "flex items-center justify-between",
								children: [/* @__PURE__ */ jsx("span", {
									className: "text-xs font-medium text-slate-500",
									children: "E-Detailing"
								}), /* @__PURE__ */ jsx("span", {
									className: "w-7 h-7 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center",
									children: /* @__PURE__ */ jsx(Presentation, { className: "w-3.5 h-3.5" })
								})]
							}), /* @__PURE__ */ jsxs("div", {
								className: "mt-1",
								children: [/* @__PURE__ */ jsx("span", {
									className: "text-2xl font-semibold text-slate-800",
									children: "Active"
								}), /* @__PURE__ */ jsx("span", {
									className: "text-[11px] text-emerald-700 block font-normal",
									children: "Live on MR"
								})]
							})]
						})
					]
				})]
			}),
			/* @__PURE__ */ jsxs("div", {
				className: "grid grid-cols-1 lg:grid-cols-2 gap-5",
				children: [/* @__PURE__ */ jsxs("div", {
					className: "bg-white rounded-2xl border border-slate-200/80 p-5",
					children: [/* @__PURE__ */ jsxs("div", {
						className: "flex items-center justify-between pb-3 border-b border-slate-100",
						children: [/* @__PURE__ */ jsxs("h3", {
							className: "text-xs font-semibold text-slate-800 flex items-center gap-2",
							children: [/* @__PURE__ */ jsx(Mail, { className: "w-3.5 h-3.5 text-violet-600" }), /* @__PURE__ */ jsx("span", { children: "Inquiries" })]
						}), /* @__PURE__ */ jsx(Link, {
							href: "/admin/enquiries",
							className: "text-xs font-medium text-violet-600 hover:text-violet-800",
							children: "View all →"
						})]
					}), /* @__PURE__ */ jsx("div", {
						className: "mt-3",
						children: recentEnquiries.length === 0 ? /* @__PURE__ */ jsx("div", {
							className: "py-6 text-center text-slate-400 font-light",
							children: /* @__PURE__ */ jsx("p", {
								className: "text-xs",
								children: "No pending commercial inquiries."
							})
						}) : /* @__PURE__ */ jsx("div", {
							className: "divide-y divide-slate-100",
							children: recentEnquiries.slice(0, 5).map((enq) => /* @__PURE__ */ jsxs("div", {
								className: "py-2.5 flex items-center justify-between text-xs",
								children: [/* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("span", {
									className: "block font-medium text-slate-800",
									children: enq.full_name || enq.name
								}), /* @__PURE__ */ jsxs("span", {
									className: "text-slate-400 font-light text-[11px]",
									children: [
										enq.city || "Request",
										" • ",
										enq.email
									]
								})] }), /* @__PURE__ */ jsx("span", {
									className: "text-[10px] text-amber-700 bg-amber-50 px-2 py-0.5 rounded-full font-medium",
									children: enq.status || "Pending"
								})]
							}, enq.id))
						})
					})]
				}), /* @__PURE__ */ jsxs("div", {
					className: "bg-white rounded-2xl border border-slate-200/80 p-5",
					children: [/* @__PURE__ */ jsxs("div", {
						className: "flex items-center justify-between pb-3 border-b border-slate-100",
						children: [/* @__PURE__ */ jsxs("h3", {
							className: "text-xs font-semibold text-slate-800 flex items-center gap-2",
							children: [/* @__PURE__ */ jsx(Package, { className: "w-3.5 h-3.5 text-violet-600" }), /* @__PURE__ */ jsx("span", { children: "Recent Formulations" })]
						}), /* @__PURE__ */ jsx(Link, {
							href: "/admin/products",
							className: "text-xs font-medium text-violet-600 hover:text-violet-800",
							children: "Manage →"
						})]
					}), /* @__PURE__ */ jsx("div", {
						className: "mt-3",
						children: recentProducts.length === 0 ? /* @__PURE__ */ jsx("div", {
							className: "py-6 text-center text-slate-400 font-light",
							children: /* @__PURE__ */ jsx("p", {
								className: "text-xs",
								children: "No products in catalog."
							})
						}) : /* @__PURE__ */ jsx("div", {
							className: "divide-y divide-slate-100",
							children: recentProducts.slice(0, 5).map((prod) => /* @__PURE__ */ jsxs("div", {
								className: "py-2.5 flex items-center justify-between text-xs",
								children: [/* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("span", {
									className: "block font-medium text-slate-800",
									children: prod.brand_name
								}), /* @__PURE__ */ jsx("span", {
									className: "text-slate-400 font-light text-[11px] truncate max-w-xs block",
									children: prod.generic_name
								})] }), /* @__PURE__ */ jsx("span", {
									className: "text-[10px] text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full font-medium",
									children: prod.dosage_form || "Formulation"
								})]
							}, prod.id))
						})
					})]
				})]
			})
		]
	}) });
}
//#endregion
//#region resources/js/Pages/admin/category/CategoryForm.jsx
var CategoryForm_exports = /* @__PURE__ */ __exportAll({ default: () => CategoryForm });
var ucfirst$1 = (str) => {
	if (!str) return "";
	return str.charAt(0).toUpperCase() + str.slice(1);
};
function CategoryForm({ category = null, parentCategories = [] }) {
	const isEditMode = Boolean(category?.id);
	const { data, setData, post, put, processing, errors, clearErrors } = useForm({
		name: category?.name || "",
		parent_id: category?.parent_id ? String(category.parent_id) : "",
		description: category?.description || "",
		status: category?.status || "active"
	});
	const [slugPreview, setSlugPreview] = useState(category?.slug || "");
	const handleChange = (e) => {
		const { name, value } = e.target;
		let val = value;
		if (name === "name" && val.length > 0) {
			val = ucfirst$1(val);
			const generatedSlug = val.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)+/g, "");
			setSlugPreview(generatedSlug);
		}
		setData(name, val);
		if (errors[name]) clearErrors(name);
	};
	const handleSubmit = (e) => {
		e.preventDefault();
		const payload = {
			...data,
			name: data.name.trim(),
			parent_id: data.parent_id ? parseInt(data.parent_id, 10) : null,
			description: data.description.trim() || null
		};
		if (isEditMode) put(`/admin/categories/${category.id}`, { data: payload });
		else post("/admin/categories", { data: payload });
	};
	const filteredParents = parentCategories.filter((cat) => {
		if (!isEditMode) return true;
		return String(cat.id) !== String(category?.id);
	});
	return /* @__PURE__ */ jsx(AdminLayout, { children: /* @__PURE__ */ jsxs("div", {
		className: "max-w-4xl mx-auto space-y-6 pb-12 pt-2",
		children: [errors.general && /* @__PURE__ */ jsxs("div", {
			className: "p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-900 flex items-start gap-3",
			children: [
				/* @__PURE__ */ jsx(AlertCircle, { className: "w-5 h-5 text-rose-600 shrink-0 mt-0.5" }),
				/* @__PURE__ */ jsxs("div", {
					className: "flex-1",
					children: [/* @__PURE__ */ jsx("h4", {
						className: "text-sm font-semibold text-rose-900",
						children: "Error"
					}), /* @__PURE__ */ jsx("p", {
						className: "text-xs text-rose-700 mt-0.5",
						children: errors.general
					})]
				}),
				/* @__PURE__ */ jsx("button", {
					type: "button",
					onClick: () => clearErrors("general"),
					className: "text-xs font-semibold text-rose-800 hover:underline cursor-pointer",
					children: "Dismiss"
				})
			]
		}), /* @__PURE__ */ jsxs("form", {
			onSubmit: handleSubmit,
			noValidate: true,
			className: "space-y-6",
			children: [/* @__PURE__ */ jsxs("div", {
				className: "bg-white rounded-xl border border-slate-200 p-6 space-y-6",
				children: [/* @__PURE__ */ jsxs("div", {
					className: "flex items-center gap-3 pb-4 border-b border-slate-100",
					children: [/* @__PURE__ */ jsx("div", {
						className: "w-10 h-10 rounded-lg bg-teal-50 text-teal-600 flex items-center justify-center",
						children: isEditMode ? /* @__PURE__ */ jsx(FolderEdit, { className: "w-5 h-5" }) : /* @__PURE__ */ jsx(FolderPlus, { className: "w-5 h-5" })
					}), /* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("h3", {
						className: "text-base font-bold text-slate-900",
						children: isEditMode ? "Edit Pharmaceutical Category" : "Create New Category"
					}), /* @__PURE__ */ jsx("p", {
						className: "text-xs text-slate-500",
						children: "Configure classification hierarchy, therapeutic domain, and publication state."
					})] })]
				}), /* @__PURE__ */ jsxs("div", {
					className: "grid grid-cols-1 md:grid-cols-2 gap-6",
					children: [
						/* @__PURE__ */ jsxs("div", {
							className: "space-y-1.5 md:col-span-2",
							children: [
								/* @__PURE__ */ jsxs("label", {
									className: "text-xs font-semibold text-slate-700 flex items-center justify-between",
									children: [/* @__PURE__ */ jsx("span", { children: "Category Name *" }), /* @__PURE__ */ jsx("span", {
										className: "text-[10px] text-slate-400 font-normal",
										children: "Capitalized automatically"
									})]
								}),
								/* @__PURE__ */ jsx("input", {
									type: "text",
									name: "name",
									value: data.name,
									onChange: handleChange,
									placeholder: "e.g. Cardiovascular Agents",
									className: `w-full px-3.5 py-2.5 rounded-lg text-xs sm:text-sm font-medium border transition-colors outline-none ${errors.name ? "border-rose-300 bg-rose-50/30 text-rose-900 focus:border-rose-500" : "border-slate-200 bg-slate-50/50 hover:bg-white focus:bg-white focus:border-teal-500 focus:ring-1 focus:ring-teal-500"}`
								}),
								errors.name && /* @__PURE__ */ jsxs("p", {
									className: "text-[11px] text-rose-600 flex items-center gap-1 font-medium mt-1",
									children: [/* @__PURE__ */ jsx(AlertCircle, { className: "w-3.5 h-3.5 shrink-0" }), errors.name]
								}),
								slugPreview && /* @__PURE__ */ jsxs("p", {
									className: "text-[11px] text-slate-400 font-mono mt-1",
									children: ["Slug preview: ", /* @__PURE__ */ jsxs("span", {
										className: "text-teal-600",
										children: ["/", slugPreview]
									})]
								})
							]
						}),
						/* @__PURE__ */ jsxs("div", {
							className: "space-y-1.5 md:col-span-2",
							children: [
								/* @__PURE__ */ jsxs("label", {
									className: "text-xs font-semibold text-slate-700 flex items-center justify-between",
									children: [/* @__PURE__ */ jsxs("span", {
										className: "flex items-center gap-1.5",
										children: [/* @__PURE__ */ jsx(Layers, { className: "w-3.5 h-3.5 text-slate-400" }), /* @__PURE__ */ jsx("span", { children: "Parent Category (Hierarchy)" })]
									}), /* @__PURE__ */ jsx("span", {
										className: "text-[10px] text-slate-400 font-normal",
										children: "Leave empty for top-level"
									})]
								}),
								/* @__PURE__ */ jsxs("select", {
									name: "parent_id",
									value: data.parent_id,
									onChange: handleChange,
									className: "w-full px-3.5 py-2.5 rounded-lg text-xs sm:text-sm font-medium border border-slate-200 bg-slate-50/50 hover:bg-white focus:bg-white focus:border-teal-500 focus:ring-1 focus:ring-teal-500 transition-colors outline-none cursor-pointer text-slate-700",
									children: [/* @__PURE__ */ jsx("option", {
										value: "",
										children: "None (Top-Level Primary Category)"
									}), filteredParents.map((cat) => /* @__PURE__ */ jsx("option", {
										value: cat.id,
										children: cat.name
									}, cat.id))]
								}),
								errors.parent_id && /* @__PURE__ */ jsxs("p", {
									className: "text-[11px] text-rose-600 flex items-center gap-1 font-medium mt-1",
									children: [/* @__PURE__ */ jsx(AlertCircle, { className: "w-3.5 h-3.5 shrink-0" }), errors.parent_id]
								})
							]
						}),
						/* @__PURE__ */ jsxs("div", {
							className: "space-y-1.5 md:col-span-2",
							children: [
								/* @__PURE__ */ jsxs("label", {
									className: "text-xs font-semibold text-slate-700 flex items-center gap-1.5",
									children: [/* @__PURE__ */ jsx(FileText, { className: "w-3.5 h-3.5 text-slate-400" }), /* @__PURE__ */ jsx("span", { children: "Clinical & Pharmacological Description" })]
								}),
								/* @__PURE__ */ jsx("textarea", {
									name: "description",
									rows: 4,
									value: data.description,
									onChange: handleChange,
									placeholder: "Outline the therapeutic focus, indication categories, or physiological mechanism...",
									className: "w-full px-3.5 py-2.5 rounded-lg text-xs sm:text-sm font-medium border border-slate-200 bg-slate-50/50 hover:bg-white focus:bg-white focus:border-teal-500 focus:ring-1 focus:ring-teal-500 transition-colors outline-none resize-none text-slate-700"
								}),
								errors.description && /* @__PURE__ */ jsxs("p", {
									className: "text-[11px] text-rose-600 flex items-center gap-1 font-medium mt-1",
									children: [/* @__PURE__ */ jsx(AlertCircle, { className: "w-3.5 h-3.5 shrink-0" }), errors.description]
								})
							]
						}),
						/* @__PURE__ */ jsxs("div", {
							className: "space-y-1.5 md:col-span-2",
							children: [/* @__PURE__ */ jsxs("label", {
								className: "text-xs font-semibold text-slate-700 flex items-center gap-1.5",
								children: [/* @__PURE__ */ jsx(ToggleLeft, { className: "w-3.5 h-3.5 text-slate-400" }), /* @__PURE__ */ jsx("span", { children: "Publication Status" })]
							}), /* @__PURE__ */ jsxs("div", {
								className: "flex items-center gap-4 pt-1",
								children: [/* @__PURE__ */ jsxs("label", {
									className: "flex items-center gap-2 cursor-pointer",
									children: [/* @__PURE__ */ jsx("input", {
										type: "radio",
										name: "status",
										value: "active",
										checked: data.status === "active",
										onChange: handleChange,
										className: "w-4 h-4 text-teal-600 focus:ring-teal-500"
									}), /* @__PURE__ */ jsx("span", {
										className: "text-xs font-semibold text-slate-700",
										children: "Active (Visible in catalog)"
									})]
								}), /* @__PURE__ */ jsxs("label", {
									className: "flex items-center gap-2 cursor-pointer",
									children: [/* @__PURE__ */ jsx("input", {
										type: "radio",
										name: "status",
										value: "inactive",
										checked: data.status === "inactive",
										onChange: handleChange,
										className: "w-4 h-4 text-teal-600 focus:ring-teal-500"
									}), /* @__PURE__ */ jsx("span", {
										className: "text-xs font-semibold text-slate-500",
										children: "Inactive (Draft / Hidden)"
									})]
								})]
							})]
						})
					]
				})]
			}), /* @__PURE__ */ jsxs("div", {
				className: "flex items-center justify-between gap-4",
				children: [/* @__PURE__ */ jsx(Link, {
					href: "/admin/categories",
					className: "px-4 py-2.5 text-xs font-semibold text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer",
					children: "Cancel"
				}), /* @__PURE__ */ jsxs("button", {
					type: "submit",
					disabled: processing,
					className: "inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-teal-600 hover:bg-teal-700 text-white font-semibold text-xs transition-colors cursor-pointer disabled:opacity-50",
					children: [processing && /* @__PURE__ */ jsx("div", { className: "w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" }), /* @__PURE__ */ jsx("span", { children: isEditMode ? "Update Category" : "Create Category" })]
				})]
			})]
		})]
	}) });
}
//#endregion
//#region resources/js/components/common/ConfirmModal.jsx
function ConfirmModal({ isOpen, onClose, onConfirm, title = "Confirm Deletion", message = "Are you sure you want to proceed? This action cannot be undone.", confirmText = "Delete", cancelText = "Cancel", isDanger = true, isLoading = false }) {
	useEffect(() => {
		if (!isOpen) return;
		const handleKeyDown = (e) => {
			if (e.key === "Escape" && !isLoading) onClose();
		};
		window.addEventListener("keydown", handleKeyDown);
		return () => window.removeEventListener("keydown", handleKeyDown);
	}, [
		isOpen,
		isLoading,
		onClose
	]);
	if (!isOpen) return null;
	return /* @__PURE__ */ jsxs("div", {
		className: "fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm animate-in fade-in duration-200",
		children: [/* @__PURE__ */ jsx("div", {
			className: "fixed inset-0",
			onClick: isLoading ? void 0 : onClose
		}), /* @__PURE__ */ jsxs("div", {
			className: "relative w-full max-w-md bg-white rounded-2xl border border-slate-200 shadow-xl p-6 z-10 space-y-4 animate-in zoom-in-95 duration-200",
			children: [
				/* @__PURE__ */ jsx("button", {
					type: "button",
					onClick: onClose,
					disabled: isLoading,
					className: "absolute top-4 right-4 p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors disabled:opacity-50 cursor-pointer",
					"aria-label": "Close dialog",
					children: /* @__PURE__ */ jsx(X, { className: "w-4 h-4" })
				}),
				/* @__PURE__ */ jsxs("div", {
					className: "flex items-start gap-4",
					children: [/* @__PURE__ */ jsx("div", {
						className: `w-11 h-11 rounded-xl flex items-center justify-center shrink-0 ${isDanger ? "bg-rose-50 text-rose-600 border border-rose-100" : "bg-teal-50 text-teal-600 border border-teal-100"}`,
						children: isDanger ? /* @__PURE__ */ jsx(Trash2, { className: "w-5 h-5 stroke-[2.2]" }) : /* @__PURE__ */ jsx(AlertTriangle, { className: "w-5 h-5 stroke-[2.2]" })
					}), /* @__PURE__ */ jsxs("div", {
						className: "flex-1 pr-4",
						children: [/* @__PURE__ */ jsx("h3", {
							className: "text-base font-bold text-slate-900",
							children: title
						}), /* @__PURE__ */ jsx("p", {
							className: "mt-1.5 text-xs sm:text-sm text-slate-500 leading-relaxed",
							children: message
						})]
					})]
				}),
				/* @__PURE__ */ jsxs("div", {
					className: "flex items-center justify-end gap-2.5 pt-3 border-t border-slate-100",
					children: [/* @__PURE__ */ jsx("button", {
						type: "button",
						onClick: onClose,
						disabled: isLoading,
						className: "px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-800 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer disabled:opacity-50",
						children: cancelText
					}), /* @__PURE__ */ jsxs("button", {
						type: "button",
						onClick: onConfirm,
						disabled: isLoading,
						className: `px-4 py-2 text-xs font-semibold text-white rounded-lg transition-colors flex items-center gap-2 cursor-pointer disabled:opacity-50 ${isDanger ? "bg-rose-600 hover:bg-rose-700 active:bg-rose-800" : "bg-teal-600 hover:bg-teal-700 active:bg-teal-800"}`,
						children: [isLoading && /* @__PURE__ */ jsx("div", { className: "w-3.5 h-3.5 border-2 border-white/40 border-t-white rounded-full animate-spin" }), /* @__PURE__ */ jsx("span", { children: isLoading ? "Deleting..." : confirmText })]
					})]
				})
			]
		})]
	});
}
//#endregion
//#region resources/js/components/common/SearchBar.jsx
/**
* Reusable SearchBar component for admin panel and forms.
* Follows clean, flat aesthetic without heavy shadows or borders.
*
* @param {Object} props
* @param {string} props.value - Current search term
* @param {function} props.onChange - Event handler for input changes
* @param {function} [props.onClear] - Optional callback when clear button is clicked
* @param {string} [props.placeholder='Search...'] - Placeholder text
* @param {string} [props.className='relative flex-1 w-full'] - Container class
* @param {string} [props.inputClassName=''] - Custom classes for the input
* @param {boolean} [props.showClear=true] - Whether to show the clear 'X' button
* @param {boolean} [props.disabled=false] - Disable the input
*/
function SearchBar({ value = "", onChange, onClear, placeholder = "Search...", className = "relative flex-1 w-full", inputClassName = "", showClear = true, disabled = false, ...props }) {
	const handleClear = () => {
		if (onClear) onClear();
		else if (onChange) onChange({ target: { value: "" } });
	};
	const hasValue = Boolean(value && String(value).length > 0);
	return /* @__PURE__ */ jsxs("div", {
		className,
		children: [
			/* @__PURE__ */ jsx(Search, { className: "w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none shrink-0" }),
			/* @__PURE__ */ jsx("input", {
				type: "text",
				value,
				onChange,
				placeholder,
				disabled,
				className: `w-full pl-9 ${hasValue && showClear ? "pr-9" : "pr-4"} py-2 text-xs sm:text-sm rounded-lg border border-slate-200 bg-slate-50/50 hover:bg-white focus:bg-white focus:border-teal-500 focus:ring-1 focus:ring-teal-500 transition-colors outline-none text-slate-800 placeholder:text-slate-400 disabled:opacity-60 disabled:cursor-not-allowed ${inputClassName}`,
				...props
			}),
			hasValue && showClear && !disabled && /* @__PURE__ */ jsx("button", {
				type: "button",
				onClick: handleClear,
				className: "absolute right-2.5 top-1/2 -translate-y-1/2 p-1 text-slate-400 hover:text-slate-600 rounded-md hover:bg-slate-100 transition-colors cursor-pointer",
				title: "Clear search",
				"aria-label": "Clear search",
				children: /* @__PURE__ */ jsx(X, { className: "w-3.5 h-3.5" })
			})
		]
	});
}
//#endregion
//#region resources/js/Pages/admin/category/CategoryList.jsx
var CategoryList_exports = /* @__PURE__ */ __exportAll({ default: () => CategoryList });
function CategoryList({ categories: paginatedCategories, filters = {} }) {
	const categories = Array.isArray(paginatedCategories) ? paginatedCategories : paginatedCategories?.data || [];
	const [search, setSearch] = useState(filters.search || "");
	const [statusFilter, setStatusFilter] = useState(filters.status || "");
	const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);
	const [deletingId, setDeletingId] = useState(null);
	const [deleteConfirm, setDeleteConfirm] = useState({
		isOpen: false,
		category: null
	});
	const applyFilters = (searchVal, statusVal) => {
		const params = {};
		if (searchVal.trim()) params.search = searchVal.trim();
		if (statusVal) params.status = statusVal;
		router.get("/admin/categories", params, { preserveState: true });
	};
	const handleSearchChange = (val) => {
		setSearch(val);
	};
	const handleSearchSubmit = () => {
		applyFilters(search, statusFilter);
	};
	const handleStatusChange = (val) => {
		setStatusFilter(val);
		applyFilters(search, val);
	};
	const handleClearFilters = () => {
		setSearch("");
		setStatusFilter("");
		router.get("/admin/categories", {}, { preserveState: true });
	};
	const formatDate = (isoString) => {
		if (!isoString) return "—";
		try {
			return new Date(isoString).toLocaleDateString("en-US", {
				year: "numeric",
				month: "short",
				day: "numeric"
			});
		} catch {
			return isoString;
		}
	};
	const requestDelete = (category) => {
		setDeleteConfirm({
			isOpen: true,
			category
		});
	};
	const handleConfirmDelete = () => {
		const category = deleteConfirm.category;
		if (!category) return;
		setDeletingId(category.id);
		router.delete(`/admin/categories/${category.id}`, {
			preserveScroll: true,
			onFinish: () => {
				setDeletingId(null);
				setDeleteConfirm({
					isOpen: false,
					category: null
				});
			}
		});
	};
	const handleToggleStatus = (category) => {
		const newStatus = category.status === "active" ? "inactive" : "active";
		router.patch(`/admin/categories/${category.id}/status`, { status: newStatus }, { preserveScroll: true });
	};
	const handleRefresh = () => {
		router.reload({ only: ["categories"] });
	};
	return /* @__PURE__ */ jsx(AdminLayout, { children: /* @__PURE__ */ jsxs("div", {
		className: "space-y-6 pt-2 pb-20 sm:pb-8",
		children: [
			/* @__PURE__ */ jsxs("div", {
				className: "bg-white rounded-xl border border-slate-200 p-4 flex flex-col sm:flex-row items-center justify-between gap-3",
				children: [/* @__PURE__ */ jsxs("div", {
					className: "flex items-center gap-2 w-full sm:flex-1",
					children: [/* @__PURE__ */ jsx(SearchBar, {
						value: search,
						onChange: (e) => handleSearchChange(e.target.value),
						onClear: () => {
							setSearch("");
							applyFilters("", statusFilter);
						},
						onKeyDown: (e) => {
							if (e.key === "Enter") handleSearchSubmit();
						},
						placeholder: "Search by category name or description..."
					}), /* @__PURE__ */ jsxs("button", {
						type: "button",
						onClick: () => setIsFilterModalOpen(true),
						className: `sm:hidden h-[38px] px-3 rounded-lg border transition-colors cursor-pointer shrink-0 flex items-center justify-center gap-1.5 text-xs font-medium relative ${isFilterModalOpen || statusFilter ? "bg-teal-50 border-teal-300 text-teal-700" : "bg-slate-50/50 hover:bg-white border-slate-200 text-slate-600"}`,
						title: "Filter categories",
						"aria-label": "Filter categories",
						children: [/* @__PURE__ */ jsx(Filter, { className: "w-4 h-4" }), statusFilter && /* @__PURE__ */ jsx("span", { className: "w-2 h-2 bg-teal-600 rounded-full" })]
					})]
				}), /* @__PURE__ */ jsxs("div", {
					className: "hidden sm:flex items-center gap-2.5 shrink-0",
					children: [
						/* @__PURE__ */ jsxs("div", {
							className: "flex items-center gap-2",
							children: [/* @__PURE__ */ jsxs("select", {
								value: statusFilter,
								onChange: (e) => handleStatusChange(e.target.value),
								className: "w-36 px-3 py-2 text-xs sm:text-sm rounded-lg border border-slate-200 bg-slate-50/50 hover:bg-white focus:bg-white focus:border-teal-500 focus:ring-1 focus:ring-teal-500 transition-colors outline-none cursor-pointer text-slate-700",
								children: [
									/* @__PURE__ */ jsx("option", {
										value: "",
										children: "All Statuses"
									}),
									/* @__PURE__ */ jsx("option", {
										value: "active",
										children: "Active Only"
									}),
									/* @__PURE__ */ jsx("option", {
										value: "inactive",
										children: "Inactive Only"
									})
								]
							}), (search || statusFilter) && /* @__PURE__ */ jsx("button", {
								type: "button",
								onClick: handleClearFilters,
								className: "text-xs text-slate-500 hover:text-slate-800 px-2 py-1 whitespace-nowrap cursor-pointer rounded-lg hover:bg-slate-100",
								children: "Clear"
							})]
						}),
						/* @__PURE__ */ jsxs("button", {
							type: "button",
							onClick: handleRefresh,
							className: "inline-flex items-center gap-1.5 px-3 py-2 text-xs font-medium text-slate-600 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors cursor-pointer shrink-0",
							title: "Refresh list",
							children: [/* @__PURE__ */ jsx(RefreshCw, { className: "w-3.5 h-3.5" }), /* @__PURE__ */ jsx("span", { children: "Refresh" })]
						}),
						/* @__PURE__ */ jsxs(Link, {
							href: "/admin/category/add",
							className: "inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-white bg-teal-600 hover:bg-teal-700 rounded-lg transition-colors cursor-pointer shrink-0",
							children: [/* @__PURE__ */ jsx(Plus, { className: "w-4 h-4 stroke-[2.5]" }), /* @__PURE__ */ jsx("span", { children: "Add Category" })]
						})
					]
				})]
			}),
			/* @__PURE__ */ jsx("div", {
				className: "bg-white rounded-xl border border-slate-200 overflow-hidden",
				children: categories.length === 0 ? /* @__PURE__ */ jsxs("div", {
					className: "p-12 text-center space-y-3",
					children: [
						/* @__PURE__ */ jsx("div", {
							className: "w-12 h-12 rounded-xl bg-slate-100 text-slate-400 flex items-center justify-center mx-auto",
							children: /* @__PURE__ */ jsx(Folder, { className: "w-6 h-6" })
						}),
						/* @__PURE__ */ jsx("h3", {
							className: "text-sm font-semibold text-slate-800",
							children: "No categories found"
						}),
						/* @__PURE__ */ jsx("p", {
							className: "text-xs text-slate-500 max-w-sm mx-auto",
							children: search || statusFilter ? "Try adjusting your search query or status filter." : "Get started by creating your first pharmaceutical category."
						}),
						!search && !statusFilter && /* @__PURE__ */ jsxs(Link, {
							href: "/admin/category/add",
							className: "inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-white bg-teal-600 hover:bg-teal-700 rounded-lg transition-colors mt-2",
							children: [/* @__PURE__ */ jsx(Plus, { className: "w-4 h-4" }), /* @__PURE__ */ jsx("span", { children: "Add Category" })]
						})
					]
				}) : /* @__PURE__ */ jsx("div", {
					className: "overflow-x-auto",
					children: /* @__PURE__ */ jsxs("table", {
						className: "w-full text-left text-xs sm:text-sm",
						children: [/* @__PURE__ */ jsx("thead", { children: /* @__PURE__ */ jsxs("tr", {
							className: "border-b border-slate-200 bg-slate-50/70 text-[11px] font-semibold uppercase tracking-wider text-slate-500",
							children: [
								/* @__PURE__ */ jsx("th", {
									className: "py-3 px-4 sm:px-6",
									children: "Category"
								}),
								/* @__PURE__ */ jsx("th", {
									className: "py-3 px-4",
									children: "Hierarchy"
								}),
								/* @__PURE__ */ jsx("th", {
									className: "py-3 px-4",
									children: "Description"
								}),
								/* @__PURE__ */ jsx("th", {
									className: "py-3 px-4",
									children: "Status"
								}),
								/* @__PURE__ */ jsx("th", {
									className: "py-3 px-4 text-right",
									children: "Created"
								}),
								/* @__PURE__ */ jsx("th", {
									className: "py-3 px-4 sm:px-6 text-right",
									children: "Actions"
								})
							]
						}) }), /* @__PURE__ */ jsx("tbody", {
							className: "divide-y divide-slate-100",
							children: categories.map((category) => {
								const isRoot = !category.parent_id;
								const hasChildren = category.children_count > 0;
								return /* @__PURE__ */ jsxs("tr", {
									className: "hover:bg-slate-50/60 transition-colors",
									children: [
										/* @__PURE__ */ jsx("td", {
											className: "py-3.5 px-4 sm:px-6",
											children: /* @__PURE__ */ jsxs("div", {
												className: "flex items-center gap-3",
												children: [/* @__PURE__ */ jsx("div", {
													className: `w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${isRoot ? "bg-teal-50 text-teal-700 border border-teal-100" : "bg-slate-100 text-slate-600 border border-slate-200"}`,
													children: /* @__PURE__ */ jsx(Folder, { className: "w-4 h-4" })
												}), /* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("span", {
													className: "font-semibold text-slate-900 block capitalize",
													children: category.name
												}), /* @__PURE__ */ jsxs("span", {
													className: "text-[11px] font-mono text-slate-400 block",
													children: ["/", category.slug]
												})] })]
											})
										}),
										/* @__PURE__ */ jsx("td", {
											className: "py-3.5 px-4",
											children: isRoot ? /* @__PURE__ */ jsxs("div", {
												className: "flex items-center gap-1.5",
												children: [/* @__PURE__ */ jsxs("span", {
													className: "inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-medium bg-slate-100 text-slate-700",
													children: [/* @__PURE__ */ jsx(Layers, { className: "w-3 h-3 text-slate-500" }), "Primary Category"]
												}), hasChildren && /* @__PURE__ */ jsxs("span", {
													className: "text-[11px] text-teal-600 font-medium",
													children: [
														"(",
														category.children_count,
														" sub)"
													]
												})]
											}) : /* @__PURE__ */ jsxs("span", {
												className: "inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-medium bg-teal-50 text-teal-800 border border-teal-200/60 capitalize",
												children: ["Sub of ", category.parent?.name || `ID #${category.parent_id}`]
											})
										}),
										/* @__PURE__ */ jsx("td", {
											className: "py-3.5 px-4 max-w-xs truncate text-slate-600 text-xs first-letter:uppercase",
											children: category.description || /* @__PURE__ */ jsx("span", {
												className: "text-slate-300 italic",
												children: "No description"
											})
										}),
										/* @__PURE__ */ jsx("td", {
											className: "py-3.5 px-4",
											children: /* @__PURE__ */ jsx("button", {
												type: "button",
												onClick: () => handleToggleStatus(category),
												title: "Click to toggle status",
												className: "cursor-pointer hover:opacity-80 transition-opacity",
												children: category.status === "active" ? /* @__PURE__ */ jsxs("span", {
													className: "inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200",
													children: [/* @__PURE__ */ jsx(CheckCircle2, { className: "w-3 h-3" }), "Active"]
												}) : /* @__PURE__ */ jsxs("span", {
													className: "inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-semibold bg-slate-100 text-slate-600 border border-slate-200",
													children: [/* @__PURE__ */ jsx(XCircle, { className: "w-3 h-3" }), "Inactive"]
												})
											})
										}),
										/* @__PURE__ */ jsx("td", {
											className: "py-3.5 px-4 text-right text-xs text-slate-500 whitespace-nowrap",
											children: /* @__PURE__ */ jsxs("span", {
												className: "inline-flex items-center gap-1 justify-end",
												children: [/* @__PURE__ */ jsx(Calendar, { className: "w-3 h-3 text-slate-400" }), formatDate(category.created_at)]
											})
										}),
										/* @__PURE__ */ jsx("td", {
											className: "py-3.5 px-4 sm:px-6 text-right whitespace-nowrap",
											children: /* @__PURE__ */ jsxs("div", {
												className: "flex items-center justify-end gap-1.5",
												children: [/* @__PURE__ */ jsx(Link, {
													href: `/admin/categories/${category.id}/edit`,
													className: "p-1.5 rounded-lg text-teal-600 hover:text-teal-800 hover:bg-teal-50 transition-colors",
													title: "Edit category",
													children: /* @__PURE__ */ jsx(Edit3, { className: "w-4 h-4" })
												}), /* @__PURE__ */ jsx("button", {
													type: "button",
													onClick: () => requestDelete(category),
													disabled: deletingId === category.id,
													className: "p-1.5 rounded-lg text-rose-500 hover:text-rose-700 hover:bg-rose-50 transition-colors cursor-pointer disabled:opacity-50",
													title: "Delete category",
													children: /* @__PURE__ */ jsx(Trash2, { className: "w-4 h-4" })
												})]
											})
										})
									]
								}, category.id);
							})
						})]
					})
				})
			}),
			/* @__PURE__ */ jsx(ConfirmModal, {
				isOpen: deleteConfirm.isOpen,
				onClose: () => setDeleteConfirm({
					isOpen: false,
					category: null
				}),
				onConfirm: handleConfirmDelete,
				isLoading: Boolean(deletingId),
				title: "Delete Category",
				message: `Are you sure you want to delete the category "${deleteConfirm.category?.name}"? Any subcategories or associated products may be affected. This action cannot be undone.`,
				confirmText: "Delete Category",
				isDanger: true
			}),
			isFilterModalOpen && /* @__PURE__ */ jsxs("div", {
				className: "fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-slate-900/40 backdrop-blur-sm animate-in fade-in duration-200",
				children: [/* @__PURE__ */ jsx("div", {
					className: "fixed inset-0",
					onClick: () => setIsFilterModalOpen(false)
				}), /* @__PURE__ */ jsxs("div", {
					className: "relative w-full sm:max-w-md bg-white rounded-t-2xl sm:rounded-2xl border border-slate-200 shadow-xl p-5 z-10 space-y-4 animate-in slide-in-from-bottom-5 sm:zoom-in-95 duration-200 max-h-[85vh] overflow-y-auto",
					children: [
						/* @__PURE__ */ jsxs("div", {
							className: "flex items-center justify-between pb-3 border-b border-slate-100",
							children: [/* @__PURE__ */ jsxs("div", {
								className: "flex items-center gap-2.5",
								children: [/* @__PURE__ */ jsx("div", {
									className: "w-8 h-8 rounded-lg bg-teal-50 text-teal-600 flex items-center justify-center",
									children: /* @__PURE__ */ jsx(Filter, { className: "w-4 h-4" })
								}), /* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("h3", {
									className: "text-sm font-bold text-slate-900",
									children: "Filter Categories"
								}), /* @__PURE__ */ jsx("p", {
									className: "text-[11px] text-slate-500",
									children: "Filter category listing by status"
								})] })]
							}), /* @__PURE__ */ jsx("button", {
								type: "button",
								onClick: () => setIsFilterModalOpen(false),
								className: "p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors cursor-pointer",
								"aria-label": "Close",
								children: /* @__PURE__ */ jsx(X, { className: "w-4 h-4" })
							})]
						}),
						/* @__PURE__ */ jsx("div", {
							className: "space-y-3.5 py-1",
							children: /* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("label", {
								className: "block text-xs font-semibold text-slate-700 mb-1.5",
								children: "Category Status"
							}), /* @__PURE__ */ jsxs("select", {
								value: statusFilter,
								onChange: (e) => setStatusFilter(e.target.value),
								className: "w-full px-3 py-2 text-xs sm:text-sm rounded-lg border border-slate-200 bg-slate-50/50 hover:bg-white focus:bg-white focus:border-teal-500 focus:ring-1 focus:ring-teal-500 transition-colors outline-none cursor-pointer text-slate-700",
								children: [
									/* @__PURE__ */ jsx("option", {
										value: "",
										children: "All Statuses"
									}),
									/* @__PURE__ */ jsx("option", {
										value: "active",
										children: "Active Only"
									}),
									/* @__PURE__ */ jsx("option", {
										value: "inactive",
										children: "Inactive Only"
									})
								]
							})] })
						}),
						/* @__PURE__ */ jsxs("div", {
							className: "flex items-center justify-between pt-3 border-t border-slate-100 gap-2",
							children: [/* @__PURE__ */ jsx("button", {
								type: "button",
								onClick: () => {
									setStatusFilter("");
								},
								disabled: !statusFilter,
								className: "px-3.5 py-2 text-xs font-semibold text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed",
								children: "Reset"
							}), /* @__PURE__ */ jsx("button", {
								type: "button",
								onClick: () => {
									applyFilters(search, statusFilter);
									setIsFilterModalOpen(false);
								},
								className: "px-4 py-2 text-xs font-semibold text-white bg-teal-600 hover:bg-teal-700 rounded-lg transition-colors cursor-pointer",
								children: "Apply Filters"
							})]
						})
					]
				})]
			}),
			/* @__PURE__ */ jsxs(Link, {
				href: "/admin/category/add",
				className: "sm:hidden fixed bottom-6 right-6 z-40 inline-flex items-center gap-2 px-4.5 py-3 rounded-full bg-teal-600 hover:bg-teal-700 active:scale-95 text-white font-semibold text-xs shadow-lg shadow-teal-900/25 transition-all cursor-pointer",
				"aria-label": "Add Category",
				children: [/* @__PURE__ */ jsx(Plus, { className: "w-4.5 h-4.5 stroke-[2.5]" }), /* @__PURE__ */ jsx("span", { children: "Add Category" })]
			})
		]
	}) });
}
//#endregion
//#region resources/js/Pages/admin/enquiry/EnquiryIndex.jsx
var EnquiryIndex_exports = /* @__PURE__ */ __exportAll({ default: () => EnquiryIndex });
function EnquiryIndex({ enquiries = {}, stats = {}, filters = {} }) {
	const [searchTerm, setSearchTerm] = useState(filters.search || "");
	const [selectedEnquiry, setSelectedEnquiry] = useState(null);
	const [statusUpdating, setStatusUpdating] = useState(false);
	const enquiryList = enquiries.data || [];
	const handleSearch = (e) => {
		e.preventDefault();
		router.get("/admin/enquiries", {
			search: searchTerm,
			status: filters.status || "all"
		}, { preserveState: true });
	};
	const handleStatusFilter = (status) => {
		router.get("/admin/enquiries", {
			search: searchTerm,
			status
		}, { preserveState: true });
	};
	const handleUpdateStatus = (enquiryId, newStatus) => {
		setStatusUpdating(true);
		router.patch(`/admin/enquiries/${enquiryId}/status`, { status: newStatus }, {
			preserveScroll: true,
			onSuccess: () => {
				setStatusUpdating(false);
				if (selectedEnquiry && selectedEnquiry.id === enquiryId) setSelectedEnquiry((prev) => ({
					...prev,
					status: newStatus
				}));
			},
			onError: () => {
				setStatusUpdating(false);
			}
		});
	};
	const handleDelete = (enquiryId) => {
		if (confirm("Are you sure you want to delete this commercial inquiry?")) router.delete(`/admin/enquiries/${enquiryId}`, {
			preserveScroll: true,
			onSuccess: () => {
				if (selectedEnquiry && selectedEnquiry.id === enquiryId) setSelectedEnquiry(null);
			}
		});
	};
	const getStatusBadge = (status) => {
		switch (status) {
			case "pending": return /* @__PURE__ */ jsxs("span", {
				className: "inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold bg-amber-50 text-amber-700 border border-amber-200",
				children: [/* @__PURE__ */ jsx(Clock, { className: "w-3 h-3" }), "Pending Action"]
			});
			case "contacted": return /* @__PURE__ */ jsxs("span", {
				className: "inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold bg-blue-50 text-blue-700 border border-blue-200",
				children: [/* @__PURE__ */ jsx(Mail, { className: "w-3 h-3" }), "Contacted"]
			});
			case "resolved": return /* @__PURE__ */ jsxs("span", {
				className: "inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200",
				children: [/* @__PURE__ */ jsx(CheckCircle2, { className: "w-3 h-3" }), "Resolved"]
			});
			default: return /* @__PURE__ */ jsx("span", {
				className: "inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold bg-slate-100 text-slate-700 border border-slate-200",
				children: status
			});
		}
	};
	return /* @__PURE__ */ jsx(AdminLayout, { children: /* @__PURE__ */ jsxs("div", {
		className: "space-y-6",
		children: [
			/* @__PURE__ */ jsx("div", {
				className: "flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4",
				children: /* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("h1", {
					className: "text-2xl font-bold text-slate-900 tracking-tight",
					children: "Commercial Inquiries & Partnerships"
				}), /* @__PURE__ */ jsx("p", {
					className: "text-xs sm:text-sm text-slate-500 mt-1",
					children: "Inquiries received via the Contact page and formulation enquiry modals."
				})] })
			}),
			/* @__PURE__ */ jsxs("div", {
				className: "grid grid-cols-2 lg:grid-cols-4 gap-4",
				children: [
					/* @__PURE__ */ jsxs("div", {
						className: "bg-white p-5 rounded-2xl border border-slate-200",
						children: [/* @__PURE__ */ jsx("span", {
							className: "text-xs font-semibold text-slate-400 uppercase tracking-wider block",
							children: "Total Inquiries"
						}), /* @__PURE__ */ jsx("span", {
							className: "text-2xl font-bold text-slate-900 mt-1 block",
							children: stats.total || 0
						})]
					}),
					/* @__PURE__ */ jsxs("div", {
						className: "bg-white p-5 rounded-2xl border border-amber-200/80 bg-amber-50/20",
						children: [/* @__PURE__ */ jsx("span", {
							className: "text-xs font-semibold text-amber-700 uppercase tracking-wider block",
							children: "Pending Action"
						}), /* @__PURE__ */ jsx("span", {
							className: "text-2xl font-bold text-amber-600 mt-1 block",
							children: stats.pending || 0
						})]
					}),
					/* @__PURE__ */ jsxs("div", {
						className: "bg-white p-5 rounded-2xl border border-slate-200",
						children: [/* @__PURE__ */ jsx("span", {
							className: "text-xs font-semibold text-slate-400 uppercase tracking-wider block",
							children: "Contacted"
						}), /* @__PURE__ */ jsx("span", {
							className: "text-2xl font-bold text-blue-600 mt-1 block",
							children: stats.contacted || 0
						})]
					}),
					/* @__PURE__ */ jsxs("div", {
						className: "bg-white p-5 rounded-2xl border border-slate-200",
						children: [/* @__PURE__ */ jsx("span", {
							className: "text-xs font-semibold text-slate-400 uppercase tracking-wider block",
							children: "Resolved"
						}), /* @__PURE__ */ jsx("span", {
							className: "text-2xl font-bold text-emerald-600 mt-1 block",
							children: stats.resolved || 0
						})]
					})
				]
			}),
			/* @__PURE__ */ jsxs("div", {
				className: "bg-white p-4 rounded-2xl border border-slate-200 flex flex-col md:flex-row items-center justify-between gap-4",
				children: [/* @__PURE__ */ jsx("div", {
					className: "flex items-center gap-1.5 overflow-x-auto w-full md:w-auto pb-1 md:pb-0 no-scrollbar",
					children: [
						{
							label: "All",
							value: "all"
						},
						{
							label: "Pending",
							value: "pending"
						},
						{
							label: "Contacted",
							value: "contacted"
						},
						{
							label: "Resolved",
							value: "resolved"
						}
					].map((tab) => /* @__PURE__ */ jsx("button", {
						type: "button",
						onClick: () => handleStatusFilter(tab.value),
						className: `px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer whitespace-nowrap ${(filters.status || "all") === tab.value ? "bg-[#0c2340] text-white shadow-xs" : "bg-slate-100 text-slate-600 hover:bg-slate-200"}`,
						children: tab.label
					}, tab.value))
				}), /* @__PURE__ */ jsxs("form", {
					onSubmit: handleSearch,
					className: "relative w-full md:w-72",
					children: [/* @__PURE__ */ jsx(Search, { className: "w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" }), /* @__PURE__ */ jsx("input", {
						type: "text",
						value: searchTerm,
						onChange: (e) => setSearchTerm(e.target.value),
						placeholder: "Search sender, company, email...",
						className: "w-full pl-9 pr-4 py-2 bg-slate-50 focus:bg-white border border-slate-200 focus:border-[#c59324] rounded-xl text-xs text-slate-900 placeholder:text-slate-400 outline-none transition-all"
					})]
				})]
			}),
			/* @__PURE__ */ jsxs("div", {
				className: "bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs",
				children: [enquiryList.length === 0 ? /* @__PURE__ */ jsxs("div", {
					className: "p-12 text-center space-y-3",
					children: [
						/* @__PURE__ */ jsx("div", {
							className: "w-12 h-12 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center mx-auto",
							children: /* @__PURE__ */ jsx(Mail, { className: "w-6 h-6" })
						}),
						/* @__PURE__ */ jsx("h3", {
							className: "text-base font-bold text-slate-800",
							children: "No Commercial Inquiries Found"
						}),
						/* @__PURE__ */ jsx("p", {
							className: "text-xs text-slate-500 max-w-sm mx-auto",
							children: filters.search || filters.status !== "all" ? "No inquiries match your current filters. Try resetting search." : "New inquiries submitted via the Contact page or product modal will appear here."
						})
					]
				}) : /* @__PURE__ */ jsx("div", {
					className: "overflow-x-auto",
					children: /* @__PURE__ */ jsxs("table", {
						className: "w-full text-left border-collapse text-xs",
						children: [/* @__PURE__ */ jsx("thead", { children: /* @__PURE__ */ jsxs("tr", {
							className: "bg-slate-50/80 border-b border-slate-200 text-slate-500 font-semibold uppercase tracking-wider text-[11px]",
							children: [
								/* @__PURE__ */ jsx("th", {
									className: "py-3.5 px-4 sm:px-6",
									children: "Sender & Organization"
								}),
								/* @__PURE__ */ jsx("th", {
									className: "py-3.5 px-4",
									children: "Contact"
								}),
								/* @__PURE__ */ jsx("th", {
									className: "py-3.5 px-4",
									children: "Inquiry Nature"
								}),
								/* @__PURE__ */ jsx("th", {
									className: "py-3.5 px-4",
									children: "Received Date"
								}),
								/* @__PURE__ */ jsx("th", {
									className: "py-3.5 px-4",
									children: "Status"
								}),
								/* @__PURE__ */ jsx("th", {
									className: "py-3.5 px-4 text-right",
									children: "Actions"
								})
							]
						}) }), /* @__PURE__ */ jsx("tbody", {
							className: "divide-y divide-slate-100",
							children: enquiryList.map((item) => /* @__PURE__ */ jsxs("tr", {
								className: "hover:bg-slate-50/70 transition-colors group cursor-pointer",
								onClick: () => setSelectedEnquiry(item),
								children: [
									/* @__PURE__ */ jsxs("td", {
										className: "py-4 px-4 sm:px-6",
										children: [/* @__PURE__ */ jsx("div", {
											className: "font-bold text-slate-900 text-sm",
											children: item.name
										}), item.company && /* @__PURE__ */ jsxs("div", {
											className: "text-slate-500 text-xs flex items-center gap-1 mt-0.5",
											children: [/* @__PURE__ */ jsx(Building2, { className: "w-3 h-3 text-slate-400 shrink-0" }), /* @__PURE__ */ jsx("span", {
												className: "truncate max-w-[200px]",
												children: item.company
											})]
										})]
									}),
									/* @__PURE__ */ jsxs("td", {
										className: "py-4 px-4",
										children: [/* @__PURE__ */ jsx("div", {
											className: "text-slate-800 font-medium",
											children: item.email
										}), item.phone && /* @__PURE__ */ jsx("div", {
											className: "text-slate-500 text-xs mt-0.5",
											children: item.phone
										})]
									}),
									/* @__PURE__ */ jsxs("td", {
										className: "py-4 px-4",
										children: [/* @__PURE__ */ jsx("span", {
											className: "font-semibold text-slate-800 block",
											children: item.inquiry_type || "General"
										}), item.product_name && /* @__PURE__ */ jsx("span", {
											className: "text-[11px] text-[#c59324] font-medium block truncate max-w-[180px]",
											children: item.product_name
										})]
									}),
									/* @__PURE__ */ jsx("td", {
										className: "py-4 px-4 text-slate-500 whitespace-nowrap",
										children: item.created_at ? new Date(item.created_at).toLocaleDateString("en-IN", {
											day: "numeric",
											month: "short",
											year: "numeric"
										}) : "Recent"
									}),
									/* @__PURE__ */ jsx("td", {
										className: "py-4 px-4",
										children: getStatusBadge(item.status)
									}),
									/* @__PURE__ */ jsx("td", {
										className: "py-4 px-4 text-right whitespace-nowrap",
										onClick: (e) => e.stopPropagation(),
										children: /* @__PURE__ */ jsxs("div", {
											className: "flex items-center justify-end gap-2",
											children: [/* @__PURE__ */ jsx("button", {
												type: "button",
												onClick: () => setSelectedEnquiry(item),
												className: "px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-[#0c2340] hover:text-white text-slate-700 font-semibold transition-colors cursor-pointer",
												children: "View"
											}), /* @__PURE__ */ jsx("button", {
												type: "button",
												onClick: () => handleDelete(item.id),
												className: "p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer",
												title: "Delete inquiry",
												children: /* @__PURE__ */ jsx(Trash2, { className: "w-4 h-4" })
											})]
										})
									})
								]
							}, item.id))
						})]
					})
				}), enquiries.links && enquiries.links.length > 3 && /* @__PURE__ */ jsxs("div", {
					className: "p-4 border-t border-slate-100 flex items-center justify-between",
					children: [/* @__PURE__ */ jsxs("span", {
						className: "text-xs text-slate-500",
						children: [
							"Showing ",
							enquiries.from || 0,
							" to ",
							enquiries.to || 0,
							" of ",
							enquiries.total || 0,
							" inquiries"
						]
					}), /* @__PURE__ */ jsx("div", {
						className: "flex items-center gap-1",
						children: enquiries.links.map((link, idx) => /* @__PURE__ */ jsx("button", {
							disabled: !link.url,
							onClick: () => link.url && router.get(link.url, {}, { preserveState: true }),
							dangerouslySetInnerHTML: { __html: link.label },
							className: `px-3 py-1 rounded-lg text-xs font-semibold cursor-pointer ${link.active ? "bg-[#0c2340] text-white" : link.url ? "bg-slate-50 text-slate-700 hover:bg-slate-100" : "text-slate-300 cursor-not-allowed"}`
						}, idx))
					})]
				})]
			}),
			selectedEnquiry && /* @__PURE__ */ jsx("div", {
				className: "fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs animate-in fade-in duration-150",
				children: /* @__PURE__ */ jsxs("div", {
					className: "bg-white rounded-3xl max-w-xl w-full max-h-[92vh] overflow-y-auto border border-slate-200 shadow-2xl relative",
					children: [/* @__PURE__ */ jsxs("div", {
						className: "p-6 bg-gradient-to-r from-[#0c2340] to-[#07172b] text-white rounded-t-3xl relative",
						children: [
							/* @__PURE__ */ jsx("button", {
								type: "button",
								onClick: () => setSelectedEnquiry(null),
								className: "absolute top-5 right-5 p-1.5 rounded-full text-slate-300 hover:text-white hover:bg-white/10 transition-colors cursor-pointer",
								children: /* @__PURE__ */ jsx(X, { className: "w-5 h-5" })
							}),
							/* @__PURE__ */ jsxs("div", {
								className: "flex items-center gap-2 mb-2",
								children: [/* @__PURE__ */ jsx("span", {
									className: "text-[11px] font-bold text-[#dfad36] uppercase tracking-wider",
									children: selectedEnquiry.inquiry_type || "Commercial Inquiry"
								}), selectedEnquiry.product_name && /* @__PURE__ */ jsx("span", {
									className: "text-[11px] bg-white/15 px-2 py-0.5 rounded text-white",
									children: selectedEnquiry.product_name
								})]
							}),
							/* @__PURE__ */ jsx("h3", {
								className: "text-xl font-bold text-white",
								children: selectedEnquiry.name
							}),
							selectedEnquiry.company && /* @__PURE__ */ jsxs("p", {
								className: "text-xs text-slate-300 mt-0.5",
								children: [
									selectedEnquiry.company,
									" ",
									selectedEnquiry.country ? `• ${selectedEnquiry.country}` : ""
								]
							})
						]
					}), /* @__PURE__ */ jsxs("div", {
						className: "p-6 space-y-5 text-xs sm:text-sm",
						children: [
							/* @__PURE__ */ jsxs("div", {
								className: "grid grid-cols-1 sm:grid-cols-2 gap-3 p-3.5 rounded-2xl bg-slate-50 border border-slate-200",
								children: [/* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("span", {
									className: "text-[10px] uppercase font-bold text-slate-400 block tracking-wider",
									children: "Email Address"
								}), /* @__PURE__ */ jsx("a", {
									href: `mailto:${selectedEnquiry.email}`,
									className: "text-[#0c2340] font-semibold hover:underline mt-0.5 block truncate",
									children: selectedEnquiry.email
								})] }), /* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("span", {
									className: "text-[10px] uppercase font-bold text-slate-400 block tracking-wider",
									children: "Phone / WhatsApp"
								}), /* @__PURE__ */ jsx("span", {
									className: "text-[#0c2340] font-semibold mt-0.5 block",
									children: selectedEnquiry.phone || "Not provided"
								})] })]
							}),
							/* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("span", {
								className: "text-[10px] uppercase font-bold text-slate-400 block tracking-wider mb-1.5",
								children: "Requirements & Message"
							}), /* @__PURE__ */ jsx("div", {
								className: "p-4 rounded-2xl bg-slate-50 border border-slate-200 text-slate-800 leading-relaxed whitespace-pre-wrap",
								children: selectedEnquiry.message
							})] }),
							/* @__PURE__ */ jsxs("div", {
								className: "pt-2 border-t border-slate-100",
								children: [/* @__PURE__ */ jsx("span", {
									className: "text-[10px] uppercase font-bold text-slate-400 block tracking-wider mb-2",
									children: "Update Workflow Status"
								}), /* @__PURE__ */ jsxs("div", {
									className: "flex flex-wrap items-center gap-2",
									children: [
										/* @__PURE__ */ jsx("button", {
											type: "button",
											disabled: statusUpdating,
											onClick: () => handleUpdateStatus(selectedEnquiry.id, "pending"),
											className: `px-3 py-1.5 rounded-xl font-bold text-xs cursor-pointer transition-colors ${selectedEnquiry.status === "pending" ? "bg-amber-500 text-white" : "bg-slate-100 text-slate-700 hover:bg-slate-200"}`,
											children: "Pending"
										}),
										/* @__PURE__ */ jsx("button", {
											type: "button",
											disabled: statusUpdating,
											onClick: () => handleUpdateStatus(selectedEnquiry.id, "contacted"),
											className: `px-3 py-1.5 rounded-xl font-bold text-xs cursor-pointer transition-colors ${selectedEnquiry.status === "contacted" ? "bg-blue-600 text-white" : "bg-slate-100 text-slate-700 hover:bg-slate-200"}`,
											children: "Mark as Contacted"
										}),
										/* @__PURE__ */ jsx("button", {
											type: "button",
											disabled: statusUpdating,
											onClick: () => handleUpdateStatus(selectedEnquiry.id, "resolved"),
											className: `px-3 py-1.5 rounded-xl font-bold text-xs cursor-pointer transition-colors ${selectedEnquiry.status === "resolved" ? "bg-emerald-600 text-white" : "bg-slate-100 text-slate-700 hover:bg-slate-200"}`,
											children: "Mark as Resolved"
										})
									]
								})]
							}),
							/* @__PURE__ */ jsxs("div", {
								className: "pt-4 border-t border-slate-100 flex items-center justify-between",
								children: [/* @__PURE__ */ jsxs("a", {
									href: `mailto:${selectedEnquiry.email}?subject=Re: Inquiry regarding ${selectedEnquiry.product_name || selectedEnquiry.inquiry_type || "Ciplon Pharma"}`,
									className: "inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#c59324] to-[#dfad36] text-[#07172b] font-bold text-xs hover:brightness-105 transition-all shadow-sm",
									children: [/* @__PURE__ */ jsx(Mail, { className: "w-3.5 h-3.5" }), /* @__PURE__ */ jsx("span", { children: "Reply via Email" })]
								}), /* @__PURE__ */ jsx("button", {
									type: "button",
									onClick: () => setSelectedEnquiry(null),
									className: "px-4 py-2 rounded-xl text-slate-500 hover:text-slate-800 font-semibold text-xs cursor-pointer",
									children: "Close"
								})]
							})
						]
					})]
				})
			})
		]
	}) });
}
//#endregion
//#region resources/js/Pages/admin/product/ProductDetails.jsx
var ProductDetails_exports = /* @__PURE__ */ __exportAll({ default: () => ProductDetails });
var capitalizeFirst = (text) => {
	if (!text || typeof text !== "string") return text;
	return text.charAt(0).toUpperCase() + text.slice(1);
};
function ProductDetails({ product }) {
	const [activeImage, setActiveImage] = useState(product?.primary_image?.url || product?.primaryImage?.url || product?.images?.[0]?.url || null);
	const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
	const [isDeleting, setIsDeleting] = useState(false);
	const [brokenImages, setBrokenImages] = useState({});
	const handleImageError = (url) => {
		if (!url) return;
		setBrokenImages((prev) => ({
			...prev,
			[url]: true
		}));
	};
	const handleConfirmDelete = () => {
		if (!product) return;
		setIsDeleting(true);
		router.delete(`/admin/products/${product.id}`, { onFinish: () => {
			setIsDeleting(false);
			setIsDeleteModalOpen(false);
		} });
	};
	if (!product) return /* @__PURE__ */ jsx(AdminLayout, { children: /* @__PURE__ */ jsxs("div", {
		className: "max-w-md mx-auto p-12 text-center space-y-4",
		children: [
			/* @__PURE__ */ jsx(Package, { className: "w-12 h-12 text-slate-300 mx-auto" }),
			/* @__PURE__ */ jsx("h3", {
				className: "text-base font-bold text-slate-800",
				children: "Product not found"
			}),
			/* @__PURE__ */ jsx(Link, {
				href: "/admin/products",
				className: "inline-block text-xs font-semibold text-teal-600 hover:underline",
				children: "← Back to Products list"
			})
		]
	}) });
	return /* @__PURE__ */ jsx(AdminLayout, { children: /* @__PURE__ */ jsxs("div", {
		className: "max-w-6xl mx-auto space-y-6 pb-12",
		children: [
			/* @__PURE__ */ jsxs("div", {
				className: "flex flex-col sm:flex-row sm:items-center justify-between gap-4",
				children: [/* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsxs("div", {
					className: "flex items-center gap-3",
					children: [
						/* @__PURE__ */ jsx("h2", {
							className: "text-2xl font-bold tracking-tight text-slate-900 capitalize",
							children: product.brand_name
						}),
						/* @__PURE__ */ jsx("span", {
							className: "px-2.5 py-0.5 rounded-full text-xs font-semibold uppercase tracking-wider bg-teal-50 text-teal-700 border border-teal-200",
							children: product.status
						}),
						product.is_featured && /* @__PURE__ */ jsxs("span", {
							className: "px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-50 text-amber-700 border border-amber-200 flex items-center gap-1",
							children: [/* @__PURE__ */ jsx(Sparkles, { className: "w-3 h-3 text-amber-500" }), " Featured"]
						})
					]
				}), /* @__PURE__ */ jsxs("p", {
					className: "text-xs sm:text-sm text-slate-500 mt-0.5 capitalize",
					children: [
						product.generic_name || "No generic name",
						" • ",
						product.dosage_form || "Formulation",
						" ",
						product.strength ? `(${product.strength})` : ""
					]
				})] }), /* @__PURE__ */ jsxs("div", {
					className: "flex items-center gap-2.5 self-start sm:self-auto",
					children: [
						/* @__PURE__ */ jsxs(Link, {
							href: `/admin/products/${product.id}/slides`,
							className: "inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-bold text-white bg-teal-700 hover:bg-teal-800 rounded-lg transition-colors shadow-xs cursor-pointer",
							children: [/* @__PURE__ */ jsx(Layers, { className: "w-3.5 h-3.5" }), /* @__PURE__ */ jsx("span", { children: product.slides && product.slides.length > 0 ? `Carousel (${product.slides.length})` : "Create Carousel" })]
						}),
						/* @__PURE__ */ jsxs(Link, {
							href: `/admin/products/${product.id}/edit`,
							className: "inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-white bg-teal-600 hover:bg-teal-700 rounded-lg transition-colors",
							children: [/* @__PURE__ */ jsx(Edit3, { className: "w-3.5 h-3.5" }), /* @__PURE__ */ jsx("span", { children: "Edit" })]
						}),
						/* @__PURE__ */ jsx("button", {
							type: "button",
							onClick: () => setIsDeleteModalOpen(true),
							className: "p-2 text-xs font-medium text-rose-600 bg-rose-50 hover:bg-rose-100 rounded-lg border border-rose-200 transition-colors cursor-pointer",
							title: "Delete product",
							children: /* @__PURE__ */ jsx(Trash2, { className: "w-4 h-4" })
						})
					]
				})]
			}),
			/* @__PURE__ */ jsxs("div", {
				className: "grid grid-cols-1 lg:grid-cols-3 gap-6",
				children: [/* @__PURE__ */ jsxs("div", {
					className: "space-y-6",
					children: [/* @__PURE__ */ jsxs("div", {
						className: "bg-white rounded-xl border border-slate-200 p-5 space-y-3",
						children: [/* @__PURE__ */ jsx("div", {
							className: "w-full aspect-square rounded-lg bg-slate-100 border border-slate-200 overflow-hidden flex items-center justify-center",
							children: activeImage && !brokenImages[activeImage] ? /* @__PURE__ */ jsx("img", {
								src: activeImage,
								alt: product.brand_name,
								className: "w-full h-full object-cover",
								onError: () => handleImageError(activeImage)
							}) : /* @__PURE__ */ jsxs("div", {
								className: "text-center p-6 text-slate-400",
								children: [/* @__PURE__ */ jsx(Image, { className: "w-12 h-12 mx-auto mb-2 opacity-50" }), /* @__PURE__ */ jsx("p", {
									className: "text-xs",
									children: activeImage ? "Image unavailable" : "No product photos uploaded"
								})]
							})
						}), product.images?.length > 1 && /* @__PURE__ */ jsx("div", {
							className: "flex gap-2 overflow-x-auto pb-1",
							children: product.images.map((img) => /* @__PURE__ */ jsx("button", {
								type: "button",
								onClick: () => setActiveImage(img.url),
								className: `w-14 h-14 rounded-lg overflow-hidden border-2 shrink-0 cursor-pointer transition-all flex items-center justify-center bg-slate-50 ${activeImage === img.url ? "border-teal-500 scale-95" : "border-slate-200 opacity-70 hover:opacity-100"}`,
								children: !brokenImages[img.url] ? /* @__PURE__ */ jsx("img", {
									src: img.url,
									alt: "thumb",
									className: "w-full h-full object-cover",
									onError: () => handleImageError(img.url)
								}) : /* @__PURE__ */ jsx(Image, { className: "w-5 h-5 text-slate-400" })
							}, img.id))
						})]
					}), /* @__PURE__ */ jsxs("div", {
						className: "bg-white rounded-xl border border-slate-200 p-5 space-y-3",
						children: [/* @__PURE__ */ jsx("h4", {
							className: "text-xs font-bold uppercase tracking-wider text-slate-700",
							children: "Quick Specs"
						}), /* @__PURE__ */ jsxs("div", {
							className: "divide-y divide-slate-100 text-xs",
							children: [
								/* @__PURE__ */ jsxs("div", {
									className: "py-2 flex justify-between",
									children: [/* @__PURE__ */ jsx("span", {
										className: "text-slate-500",
										children: "Category:"
									}), /* @__PURE__ */ jsx("span", {
										className: "font-semibold text-slate-900 capitalize",
										children: product.category?.name || "—"
									})]
								}),
								/* @__PURE__ */ jsxs("div", {
									className: "py-2 flex justify-between",
									children: [/* @__PURE__ */ jsx("span", {
										className: "text-slate-500",
										children: "Product Code:"
									}), /* @__PURE__ */ jsx("span", {
										className: "font-mono font-medium text-slate-900 uppercase",
										children: product.product_code || "—"
									})]
								}),
								/* @__PURE__ */ jsxs("div", {
									className: "py-2 flex justify-between",
									children: [/* @__PURE__ */ jsx("span", {
										className: "text-slate-500",
										children: "Dosage Form:"
									}), /* @__PURE__ */ jsx("span", {
										className: "font-medium text-slate-900 capitalize",
										children: product.dosage_form || "—"
									})]
								}),
								/* @__PURE__ */ jsxs("div", {
									className: "py-2 flex justify-between",
									children: [/* @__PURE__ */ jsx("span", {
										className: "text-slate-500",
										children: "Strength:"
									}), /* @__PURE__ */ jsx("span", {
										className: "font-medium text-slate-900 capitalize",
										children: product.strength || "—"
									})]
								}),
								/* @__PURE__ */ jsxs("div", {
									className: "py-2 flex justify-between",
									children: [/* @__PURE__ */ jsx("span", {
										className: "text-slate-500",
										children: "Prescription:"
									}), /* @__PURE__ */ jsx("span", {
										className: "font-medium text-slate-900 capitalize",
										children: product.prescription_type || "—"
									})]
								}),
								/* @__PURE__ */ jsxs("div", {
									className: "py-2 flex justify-between",
									children: [/* @__PURE__ */ jsx("span", {
										className: "text-slate-500",
										children: "URL Slug:"
									}), /* @__PURE__ */ jsxs("span", {
										className: "font-mono text-slate-600",
										children: ["/", product.slug]
									})]
								})
							]
						})]
					})]
				}), /* @__PURE__ */ jsxs("div", {
					className: "lg:col-span-2 space-y-6",
					children: [/* @__PURE__ */ jsxs("div", {
						className: "bg-white rounded-xl border border-slate-200 overflow-hidden",
						children: [/* @__PURE__ */ jsxs("div", {
							className: "p-5 border-b border-slate-100 flex items-center gap-2",
							children: [/* @__PURE__ */ jsx(FlaskConical, { className: "w-5 h-5 text-teal-600" }), /* @__PURE__ */ jsx("h3", {
								className: "text-sm font-bold text-slate-900",
								children: "Active Formulation Composition"
							})]
						}), product.compositions?.length ? /* @__PURE__ */ jsxs("table", {
							className: "w-full text-left text-xs sm:text-sm",
							children: [/* @__PURE__ */ jsx("thead", { children: /* @__PURE__ */ jsxs("tr", {
								className: "bg-slate-50 text-[11px] font-semibold text-slate-500 uppercase tracking-wider border-b border-slate-200",
								children: [
									/* @__PURE__ */ jsx("th", {
										className: "py-3 px-5",
										children: "Active Pharmaceutical Ingredient"
									}),
									/* @__PURE__ */ jsx("th", {
										className: "py-3 px-5 text-right",
										children: "Strength"
									}),
									/* @__PURE__ */ jsx("th", {
										className: "py-3 px-5 text-right",
										children: "Unit"
									})
								]
							}) }), /* @__PURE__ */ jsx("tbody", {
								className: "divide-y divide-slate-100",
								children: product.compositions.map((comp) => /* @__PURE__ */ jsxs("tr", {
									className: "hover:bg-slate-50/50",
									children: [
										/* @__PURE__ */ jsx("td", {
											className: "py-3 px-5 font-semibold text-slate-900 capitalize",
											children: comp.ingredient_name
										}),
										/* @__PURE__ */ jsx("td", {
											className: "py-3 px-5 text-right font-mono font-medium text-slate-800",
											children: comp.strength
										}),
										/* @__PURE__ */ jsx("td", {
											className: "py-3 px-5 text-right font-mono text-slate-500 uppercase",
											children: comp.unit
										})
									]
								}, comp.id))
							})]
						}) : /* @__PURE__ */ jsx("div", {
							className: "p-6 text-center text-xs text-slate-400",
							children: "No active ingredient compositions listed for this formulation."
						})]
					}), /* @__PURE__ */ jsxs("div", {
						className: "bg-white rounded-xl border border-slate-200 p-6 space-y-5",
						children: [
							/* @__PURE__ */ jsxs("div", {
								className: "flex items-center gap-2 pb-3 border-b border-slate-100",
								children: [/* @__PURE__ */ jsx(FileText, { className: "w-5 h-5 text-teal-600" }), /* @__PURE__ */ jsx("h3", {
									className: "text-sm font-bold text-slate-900",
									children: "Therapeutic Overview & Monograph"
								})]
							}),
							product.short_description && /* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("h5", {
								className: "text-xs font-bold uppercase tracking-wider text-slate-500 mb-1",
								children: "Highlight Summary"
							}), /* @__PURE__ */ jsx("p", {
								className: "text-xs sm:text-sm text-slate-700 bg-teal-50/40 p-3 rounded-lg border border-teal-100 first-letter:uppercase",
								children: capitalizeFirst(product.short_description)
							})] }),
							product.description && /* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("h5", {
								className: "text-xs font-bold uppercase tracking-wider text-slate-500 mb-1",
								children: "Detailed Description"
							}), /* @__PURE__ */ jsx("p", {
								className: "text-xs sm:text-sm text-slate-700 whitespace-pre-line leading-relaxed first-letter:uppercase",
								children: capitalizeFirst(product.description)
							})] }),
							/* @__PURE__ */ jsxs("div", {
								className: "grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2",
								children: [
									/* @__PURE__ */ jsxs("div", {
										className: "p-4 rounded-lg bg-slate-50 border border-slate-200",
										children: [/* @__PURE__ */ jsx("h5", {
											className: "text-xs font-bold text-slate-800 mb-1",
											children: "Approved Indications"
										}), /* @__PURE__ */ jsx("p", {
											className: "text-xs text-slate-600 leading-relaxed whitespace-pre-line first-letter:uppercase",
											children: capitalizeFirst(product.indications) || /* @__PURE__ */ jsx("span", {
												className: "text-slate-400 italic",
												children: "None specified"
											})
										})]
									}),
									/* @__PURE__ */ jsxs("div", {
										className: "p-4 rounded-lg bg-slate-50 border border-slate-200",
										children: [/* @__PURE__ */ jsx("h5", {
											className: "text-xs font-bold text-slate-800 mb-1",
											children: "Dosage & Directions"
										}), /* @__PURE__ */ jsx("p", {
											className: "text-xs text-slate-600 leading-relaxed whitespace-pre-line first-letter:uppercase",
											children: capitalizeFirst(product.directions) || /* @__PURE__ */ jsx("span", {
												className: "text-slate-400 italic",
												children: "None specified"
											})
										})]
									}),
									/* @__PURE__ */ jsxs("div", {
										className: "p-4 rounded-lg bg-slate-50 border border-slate-200",
										children: [/* @__PURE__ */ jsx("h5", {
											className: "text-xs font-bold text-slate-800 mb-1",
											children: "Precautions & Warnings"
										}), /* @__PURE__ */ jsx("p", {
											className: "text-xs text-slate-600 leading-relaxed whitespace-pre-line first-letter:uppercase",
											children: capitalizeFirst(product.precautions) || /* @__PURE__ */ jsx("span", {
												className: "text-slate-400 italic",
												children: "None specified"
											})
										})]
									}),
									/* @__PURE__ */ jsxs("div", {
										className: "p-4 rounded-lg bg-slate-50 border border-slate-200",
										children: [/* @__PURE__ */ jsx("h5", {
											className: "text-xs font-bold text-slate-800 mb-1",
											children: "Storage Parameters"
										}), /* @__PURE__ */ jsx("p", {
											className: "text-xs text-slate-600 leading-relaxed whitespace-pre-line first-letter:uppercase",
											children: capitalizeFirst(product.storage) || /* @__PURE__ */ jsx("span", {
												className: "text-slate-400 italic",
												children: "None specified"
											})
										})]
									})
								]
							})
						]
					})]
				})]
			}),
			/* @__PURE__ */ jsx(ConfirmModal, {
				isOpen: isDeleteModalOpen,
				onClose: () => setIsDeleteModalOpen(false),
				onConfirm: handleConfirmDelete,
				isLoading: isDeleting,
				title: "Delete Product Profile",
				message: `Are you sure you want to delete "${product?.brand_name}"? This formulation, all chemical compositions, and associated images will be permanently removed.`,
				confirmText: "Delete Product",
				isDanger: true
			})
		]
	}) });
}
//#endregion
//#region resources/js/Pages/admin/product/ProductForm.jsx
var ProductForm_exports = /* @__PURE__ */ __exportAll({ default: () => ProductForm });
var STANDARD_DOSAGE_FORMS = [
	{
		value: "Tablet",
		label: "Tablet"
	},
	{
		value: "Capsule",
		label: "Capsule"
	},
	{
		value: "Syrup",
		label: "Syrup"
	},
	{
		value: "Suspension",
		label: "Suspension"
	},
	{
		value: "Injection",
		label: "Injection"
	},
	{
		value: "Infusion",
		label: "Infusion"
	},
	{
		value: "Cream",
		label: "Cream"
	},
	{
		value: "Ointment",
		label: "Ointment"
	},
	{
		value: "Gel",
		label: "Gel"
	},
	{
		value: "Drops",
		label: "Eye/Ear Drops"
	},
	{
		value: "Inhaler",
		label: "Inhaler / Respule"
	},
	{
		value: "Powder",
		label: "Powder / Sachet"
	}
];
var STANDARD_PRESCRIPTION_TYPES = [
	{
		value: "Schedule H",
		label: "Schedule H Prescription"
	},
	{
		value: "Schedule H1",
		label: "Schedule H1 Strict Prescription"
	},
	{
		value: "Schedule X",
		label: "Schedule X Controlled"
	},
	{
		value: "OTC",
		label: "Over The Counter (OTC)"
	},
	{
		value: "General Sales",
		label: "General Sales"
	}
];
var ucfirst = (str) => str && typeof str === "string" ? str.charAt(0).toUpperCase() + str.slice(1) : str || "";
function ProductForm({ product = null, categories: propCategories = [] }) {
	const isEditMode = Boolean(product?.id);
	const currentDosage = product?.dosage_form || "Tablet";
	const isCustomDosageInitial = Boolean(currentDosage && !STANDARD_DOSAGE_FORMS.some((f) => f.value === currentDosage));
	const currentRx = product?.prescription_type || "Schedule H";
	const isCustomRxInitial = Boolean(currentRx && !STANDARD_PRESCRIPTION_TYPES.some((p) => p.value === currentRx));
	const [isCustomDosage, setIsCustomDosage] = useState(isCustomDosageInitial);
	const [customDosage, setCustomDosage] = useState(isCustomDosageInitial ? currentDosage : "");
	const [isCustomPrescription, setIsCustomPrescription] = useState(isCustomRxInitial);
	const [customPrescription, setCustomPrescription] = useState(isCustomRxInitial ? ucfirst(currentRx) : "");
	const [formData, setFormData] = useState({
		brand_name: product ? ucfirst(product.brand_name) : "",
		generic_name: product ? ucfirst(product.generic_name) : "",
		product_code: product ? (product.product_code || "").toUpperCase() : "",
		category_id: product?.category_id || "",
		dosage_form: product ? ucfirst(currentDosage) : "Tablet",
		strength: product ? ucfirst(product.strength) : "",
		prescription_type: product ? ucfirst(currentRx) : "Schedule H",
		short_description: product ? ucfirst(product.short_description) : "",
		description: product ? ucfirst(product.description) : "",
		indications: product ? ucfirst(product.indications) : "",
		directions: product ? ucfirst(product.directions) : "",
		precautions: product ? ucfirst(product.precautions) : "",
		storage: product ? ucfirst(product.storage) : "",
		status: product?.status || "active",
		is_featured: Boolean(product?.is_featured)
	});
	const [compositions, setCompositions] = useState(product?.compositions?.length ? product.compositions.map((c) => ({
		ingredient_name: ucfirst(c.ingredient_name),
		strength: c.strength,
		unit: c.unit || "mg"
	})) : [{
		ingredient_name: "",
		strength: "",
		unit: "mg"
	}]);
	const [existingImages, setExistingImages] = useState(product?.images || []);
	const [removedImageIds, setRemovedImageIds] = useState([]);
	const [selectedImages, setSelectedImages] = useState([]);
	const [imagePreviews, setImagePreviews] = useState([]);
	const categories = propCategories;
	const [errors, setErrors] = useState({});
	const [isSubmitting, setIsSubmitting] = useState(false);
	const handleChange = (e) => {
		const { name, value, type, checked } = e.target;
		let finalValue = type === "checkbox" ? checked : value;
		if (name === "product_code" && typeof finalValue === "string") finalValue = finalValue.toUpperCase();
		else if ([
			"brand_name",
			"generic_name",
			"strength",
			"short_description",
			"description",
			"indications",
			"directions",
			"precautions",
			"storage"
		].includes(name) && typeof finalValue === "string") finalValue = ucfirst(finalValue);
		setFormData((prev) => ({
			...prev,
			[name]: finalValue
		}));
		if (errors[name]) setErrors((prev) => ({
			...prev,
			[name]: null
		}));
	};
	const handleDosageSelectChange = (e) => {
		const val = e.target.value;
		if (val === "Other") {
			setIsCustomDosage(true);
			setFormData((prev) => ({
				...prev,
				dosage_form: customDosage
			}));
		} else {
			setIsCustomDosage(false);
			setFormData((prev) => ({
				...prev,
				dosage_form: val
			}));
		}
	};
	const handleCustomDosageChange = (e) => {
		let val = e.target.value;
		if (val.length > 0) val = val.charAt(0).toUpperCase() + val.slice(1);
		setCustomDosage(val);
		setFormData((prev) => ({
			...prev,
			dosage_form: val
		}));
	};
	const handlePrescriptionSelectChange = (e) => {
		const val = e.target.value;
		if (val === "Other") {
			setIsCustomPrescription(true);
			setFormData((prev) => ({
				...prev,
				prescription_type: customPrescription
			}));
		} else {
			setIsCustomPrescription(false);
			setFormData((prev) => ({
				...prev,
				prescription_type: val
			}));
		}
	};
	const handleCustomPrescriptionChange = (e) => {
		let val = e.target.value;
		if (val.length > 0) val = val.charAt(0).toUpperCase() + val.slice(1);
		setCustomPrescription(val);
		setFormData((prev) => ({
			...prev,
			prescription_type: val
		}));
	};
	const handleCompositionChange = (index, field, value) => {
		let finalVal = value;
		if (field === "ingredient_name") finalVal = ucfirst(finalVal);
		setCompositions((prev) => {
			const updated = [...prev];
			updated[index][field] = finalVal;
			return updated;
		});
	};
	const addCompositionRow = () => {
		setCompositions((prev) => [...prev, {
			ingredient_name: "",
			strength: "",
			unit: "mg"
		}]);
	};
	const removeCompositionRow = (index) => {
		if (compositions.length === 1) {
			setCompositions([{
				ingredient_name: "",
				strength: "",
				unit: "mg"
			}]);
			return;
		}
		setCompositions((prev) => prev.filter((_, i) => i !== index));
	};
	const handleRemoveExistingImage = (imageId) => {
		setExistingImages((prev) => prev.filter((img) => img.id !== imageId));
		setRemovedImageIds((prev) => [...prev, imageId]);
	};
	const handleImageChange = (e) => {
		const files = Array.from(e.target.files || []);
		if (!files.length) return;
		const validFiles = [];
		const newPreviews = [];
		files.forEach((file) => {
			if (file.size > 2097152) {
				toast.error(`"${file.name}" exceeds the 2MB limit.`);
				return;
			}
			validFiles.push(file);
			newPreviews.push({
				url: URL.createObjectURL(file),
				name: file.name
			});
		});
		setSelectedImages((prev) => [...prev, ...validFiles]);
		setImagePreviews((prev) => [...prev, ...newPreviews]);
	};
	const removeSelectedImage = (index) => {
		if (imagePreviews[index]?.url) URL.revokeObjectURL(imagePreviews[index].url);
		setSelectedImages((prev) => prev.filter((_, i) => i !== index));
		setImagePreviews((prev) => prev.filter((_, i) => i !== index));
	};
	const validate = () => {
		const newErrors = {};
		if (!formData.brand_name.trim()) newErrors.brand_name = "Brand Name is required";
		if (!formData.category_id) newErrors.category_id = "Please select a Category";
		return newErrors;
	};
	const handleSubmit = (e) => {
		e.preventDefault();
		const validationErrors = validate();
		if (Object.keys(validationErrors).length > 0) {
			setErrors(validationErrors);
			return;
		}
		setIsSubmitting(true);
		setErrors({});
		const data = new FormData();
		if (isEditMode) data.append("_method", "PUT");
		data.append("brand_name", ucfirst(formData.brand_name.trim()));
		if (formData.generic_name.trim()) data.append("generic_name", ucfirst(formData.generic_name.trim()));
		if (formData.product_code.trim()) data.append("product_code", formData.product_code.trim().toUpperCase());
		data.append("category_id", formData.category_id);
		if (formData.dosage_form) data.append("dosage_form", ucfirst(formData.dosage_form));
		if (formData.strength.trim()) data.append("strength", ucfirst(formData.strength.trim()));
		if (formData.prescription_type) data.append("prescription_type", ucfirst(formData.prescription_type));
		if (formData.short_description.trim()) data.append("short_description", ucfirst(formData.short_description.trim()));
		if (formData.description.trim()) data.append("description", ucfirst(formData.description.trim()));
		if (formData.indications.trim()) data.append("indications", ucfirst(formData.indications.trim()));
		if (formData.directions.trim()) data.append("directions", ucfirst(formData.directions.trim()));
		if (formData.precautions.trim()) data.append("precautions", ucfirst(formData.precautions.trim()));
		if (formData.storage.trim()) data.append("storage", ucfirst(formData.storage.trim()));
		data.append("status", formData.status);
		data.append("is_featured", formData.is_featured ? "1" : "0");
		const validCompositions = compositions.filter((c) => c.ingredient_name.trim() && c.strength.trim()).map((c) => ({
			ingredient_name: ucfirst(c.ingredient_name.trim()),
			strength: c.strength.trim(),
			unit: c.unit || "mg"
		}));
		data.append("compositions", JSON.stringify(validCompositions));
		if (isEditMode && removedImageIds.length > 0) data.append("removed_image_ids", JSON.stringify(removedImageIds));
		selectedImages.forEach((file) => {
			data.append("images[]", file);
		});
		const endpoint = isEditMode ? `/admin/products/${product.id}` : "/admin/products";
		router.post(endpoint, data, {
			onError: (backendErrors) => {
				setErrors(backendErrors);
				setIsSubmitting(false);
			},
			onFinish: () => {
				setIsSubmitting(false);
			}
		});
	};
	return /* @__PURE__ */ jsx(AdminLayout, { children: /* @__PURE__ */ jsx("div", {
		className: "max-w-5xl mx-auto space-y-6 pb-12 pt-2",
		children: /* @__PURE__ */ jsxs("form", {
			onSubmit: handleSubmit,
			className: "space-y-6",
			children: [
				/* @__PURE__ */ jsxs("div", {
					className: "bg-white rounded-xl border border-slate-200 p-6 sm:p-7 space-y-5",
					children: [/* @__PURE__ */ jsxs("div", {
						className: "flex items-center gap-2.5 pb-3 border-b border-slate-100",
						children: [/* @__PURE__ */ jsx("div", {
							className: "w-7 h-7 rounded-lg bg-teal-50 text-teal-700 flex items-center justify-center font-bold text-xs",
							children: "1"
						}), /* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("h3", {
							className: "text-base font-bold text-slate-900",
							children: "Basic Information"
						}), /* @__PURE__ */ jsx("p", {
							className: "text-xs text-slate-500",
							children: "Core formulation identification parameters"
						})] })]
					}), /* @__PURE__ */ jsxs("div", {
						className: "grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5",
						children: [
							/* @__PURE__ */ jsxs("div", {
								className: "space-y-1.5",
								children: [
									/* @__PURE__ */ jsxs("label", {
										className: "text-xs font-semibold text-slate-700 flex items-center justify-between",
										children: [/* @__PURE__ */ jsx("span", { children: "Brand Name *" }), /* @__PURE__ */ jsx("span", {
											className: "text-[10px] text-slate-400 font-normal",
											children: "Capitalized automatically"
										})]
									}),
									/* @__PURE__ */ jsx("input", {
										type: "text",
										name: "brand_name",
										value: formData.brand_name,
										onChange: handleChange,
										placeholder: "e.g. Paracetamol Extra",
										className: `w-full px-3.5 py-2 text-xs sm:text-sm rounded-lg border outline-none transition-colors ${errors.brand_name ? "border-rose-300 bg-rose-50/20 text-rose-900" : "border-slate-200 bg-slate-50/50 hover:bg-white focus:bg-white focus:border-teal-500 focus:ring-1 focus:ring-teal-500"}`
									}),
									errors.brand_name && /* @__PURE__ */ jsxs("p", {
										className: "text-[11px] text-rose-600 flex items-center gap-1",
										children: [/* @__PURE__ */ jsx(AlertCircle, { className: "w-3 h-3" }), errors.brand_name]
									})
								]
							}),
							/* @__PURE__ */ jsxs("div", {
								className: "space-y-1.5",
								children: [/* @__PURE__ */ jsxs("label", {
									className: "text-xs font-semibold text-slate-700 flex items-center justify-between",
									children: [/* @__PURE__ */ jsx("span", { children: "Generic Name" }), /* @__PURE__ */ jsx("span", {
										className: "text-[10px] text-slate-400 font-normal",
										children: "Capitalized automatically"
									})]
								}), /* @__PURE__ */ jsx("input", {
									type: "text",
									name: "generic_name",
									value: formData.generic_name,
									onChange: handleChange,
									placeholder: "e.g. Acetaminophen + Caffeine",
									className: "w-full px-3.5 py-2 text-xs sm:text-sm rounded-lg border border-slate-200 bg-slate-50/50 hover:bg-white focus:bg-white focus:border-teal-500 focus:ring-1 focus:ring-teal-500 transition-colors outline-none"
								})]
							}),
							/* @__PURE__ */ jsxs("div", {
								className: "space-y-1.5",
								children: [
									/* @__PURE__ */ jsxs("label", {
										className: "text-xs font-semibold text-slate-700 flex items-center justify-between",
										children: [/* @__PURE__ */ jsx("span", { children: "Product Code / SKU" }), /* @__PURE__ */ jsx("span", {
											className: "text-[10px] text-slate-400 font-normal",
											children: "Auto uppercase"
										})]
									}),
									/* @__PURE__ */ jsx("input", {
										type: "text",
										name: "product_code",
										value: formData.product_code,
										onChange: handleChange,
										placeholder: "e.g. APX-TAB-001",
										className: "w-full px-3.5 py-2 text-xs sm:text-sm font-mono rounded-lg border border-slate-200 bg-slate-50/50 hover:bg-white focus:bg-white focus:border-teal-500 focus:ring-1 focus:ring-teal-500 transition-colors outline-none uppercase"
									}),
									errors.product_code && /* @__PURE__ */ jsxs("p", {
										className: "text-[11px] text-rose-600 flex items-center gap-1",
										children: [/* @__PURE__ */ jsx(AlertCircle, { className: "w-3 h-3" }), errors.product_code]
									})
								]
							}),
							/* @__PURE__ */ jsxs("div", {
								className: "space-y-1.5",
								children: [
									/* @__PURE__ */ jsx("label", {
										className: "text-xs font-semibold text-slate-700",
										children: "Category *"
									}),
									/* @__PURE__ */ jsxs("select", {
										name: "category_id",
										value: formData.category_id,
										onChange: handleChange,
										className: `w-full px-3.5 py-2 text-xs sm:text-sm rounded-lg border outline-none transition-colors cursor-pointer text-slate-700 ${errors.category_id ? "border-rose-300 bg-rose-50/20 text-rose-900" : "border-slate-200 bg-slate-50/50 hover:bg-white focus:bg-white focus:border-teal-500 focus:ring-1 focus:ring-teal-500"}`,
										children: [/* @__PURE__ */ jsx("option", {
											value: "",
											children: "Select Category"
										}), categories.map((c) => /* @__PURE__ */ jsx("option", {
											value: c.id,
											children: c.name
										}, c.id))]
									}),
									errors.category_id && /* @__PURE__ */ jsxs("p", {
										className: "text-[11px] text-rose-600 flex items-center gap-1",
										children: [/* @__PURE__ */ jsx(AlertCircle, { className: "w-3 h-3" }), errors.category_id]
									})
								]
							})
						]
					})]
				}),
				/* @__PURE__ */ jsxs("div", {
					className: "bg-white rounded-xl border border-slate-200 p-6 sm:p-7 space-y-5",
					children: [/* @__PURE__ */ jsxs("div", {
						className: "flex items-center gap-2.5 pb-3 border-b border-slate-100",
						children: [/* @__PURE__ */ jsx("div", {
							className: "w-7 h-7 rounded-lg bg-teal-50 text-teal-700 flex items-center justify-center font-bold text-xs",
							children: "2"
						}), /* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("h3", {
							className: "text-base font-bold text-slate-900",
							children: "Formulation & Dosage"
						}), /* @__PURE__ */ jsx("p", {
							className: "text-xs text-slate-500",
							children: "Dosage forms and prescription regulatory classifications"
						})] })]
					}), /* @__PURE__ */ jsxs("div", {
						className: "grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-5",
						children: [
							/* @__PURE__ */ jsxs("div", {
								className: "space-y-1.5",
								children: [
									/* @__PURE__ */ jsx("label", {
										className: "text-xs font-semibold text-slate-700",
										children: "Dosage Form"
									}),
									/* @__PURE__ */ jsxs("select", {
										value: isCustomDosage ? "Other" : formData.dosage_form,
										onChange: handleDosageSelectChange,
										className: "w-full px-3.5 py-2 text-xs sm:text-sm rounded-lg border border-slate-200 bg-slate-50/50 hover:bg-white focus:bg-white focus:border-teal-500 focus:ring-1 focus:ring-teal-500 transition-colors outline-none cursor-pointer text-slate-700",
										children: [STANDARD_DOSAGE_FORMS.map((f) => /* @__PURE__ */ jsx("option", {
											value: f.value,
											children: f.label
										}, f.value)), /* @__PURE__ */ jsx("option", {
											value: "Other",
											children: "Other / Custom"
										})]
									}),
									isCustomDosage && /* @__PURE__ */ jsx("input", {
										type: "text",
										value: customDosage,
										onChange: handleCustomDosageChange,
										placeholder: "Enter custom dosage form (e.g. Lozenges)",
										className: "w-full mt-2 px-3.5 py-2 text-xs sm:text-sm rounded-lg border border-teal-300 bg-teal-50/30 focus:bg-white focus:border-teal-500 transition-colors outline-none",
										autoFocus: true
									})
								]
							}),
							/* @__PURE__ */ jsxs("div", {
								className: "space-y-1.5",
								children: [/* @__PURE__ */ jsxs("label", {
									className: "text-xs font-semibold text-slate-700 flex items-center justify-between",
									children: [/* @__PURE__ */ jsx("span", { children: "Strength" }), /* @__PURE__ */ jsx("span", {
										className: "text-[10px] text-slate-400 font-normal",
										children: "Capitalized automatically"
									})]
								}), /* @__PURE__ */ jsx("input", {
									type: "text",
									name: "strength",
									value: formData.strength,
									onChange: handleChange,
									placeholder: "e.g. 500 mg, 10 mg/5ml",
									className: "w-full px-3.5 py-2 text-xs sm:text-sm rounded-lg border border-slate-200 bg-slate-50/50 hover:bg-white focus:bg-white focus:border-teal-500 focus:ring-1 focus:ring-teal-500 transition-colors outline-none"
								})]
							}),
							/* @__PURE__ */ jsxs("div", {
								className: "space-y-1.5",
								children: [
									/* @__PURE__ */ jsx("label", {
										className: "text-xs font-semibold text-slate-700",
										children: "Prescription Classification"
									}),
									/* @__PURE__ */ jsxs("select", {
										value: isCustomPrescription ? "Other" : formData.prescription_type,
										onChange: handlePrescriptionSelectChange,
										className: "w-full px-3.5 py-2 text-xs sm:text-sm rounded-lg border border-slate-200 bg-slate-50/50 hover:bg-white focus:bg-white focus:border-teal-500 focus:ring-1 focus:ring-teal-500 transition-colors outline-none cursor-pointer text-slate-700",
										children: [STANDARD_PRESCRIPTION_TYPES.map((p) => /* @__PURE__ */ jsx("option", {
											value: p.value,
											children: p.label
										}, p.value)), /* @__PURE__ */ jsx("option", {
											value: "Other",
											children: "Other Custom Classification"
										})]
									}),
									isCustomPrescription && /* @__PURE__ */ jsx("input", {
										type: "text",
										value: customPrescription,
										onChange: handleCustomPrescriptionChange,
										placeholder: "Enter prescription type",
										className: "w-full mt-2 px-3.5 py-2 text-xs sm:text-sm rounded-lg border border-teal-300 bg-teal-50/30 focus:bg-white focus:border-teal-500 transition-colors outline-none",
										autoFocus: true
									})
								]
							})
						]
					})]
				}),
				/* @__PURE__ */ jsxs("div", {
					className: "bg-white rounded-xl border border-slate-200 p-6 sm:p-7 space-y-5",
					children: [/* @__PURE__ */ jsxs("div", {
						className: "flex items-center justify-between pb-3 border-b border-slate-100",
						children: [/* @__PURE__ */ jsxs("div", {
							className: "flex items-center gap-2.5",
							children: [/* @__PURE__ */ jsx("div", {
								className: "w-7 h-7 rounded-lg bg-teal-50 text-teal-700 flex items-center justify-center font-bold text-xs",
								children: "3"
							}), /* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("h3", {
								className: "text-base font-bold text-slate-900",
								children: "Active Compositions (APIs)"
							}), /* @__PURE__ */ jsx("p", {
								className: "text-xs text-slate-500",
								children: "Chemical molecules and biological strengths per dosage unit"
							})] })]
						}), /* @__PURE__ */ jsxs("button", {
							type: "button",
							onClick: addCompositionRow,
							className: "inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-teal-700 bg-teal-50 hover:bg-teal-100 rounded-lg transition-colors cursor-pointer",
							children: [/* @__PURE__ */ jsx(Plus, { className: "w-3.5 h-3.5" }), /* @__PURE__ */ jsx("span", { children: "Add Ingredient" })]
						})]
					}), /* @__PURE__ */ jsx("div", {
						className: "space-y-3",
						children: compositions.map((item, idx) => /* @__PURE__ */ jsxs("div", {
							className: "flex flex-col sm:flex-row items-center gap-3 p-3 rounded-lg border border-slate-200/80 bg-slate-50/40",
							children: [
								/* @__PURE__ */ jsxs("div", {
									className: "flex-1 w-full space-y-1",
									children: [/* @__PURE__ */ jsx("span", {
										className: "text-[10px] uppercase font-semibold text-slate-400",
										children: "Ingredient Name"
									}), /* @__PURE__ */ jsx("input", {
										type: "text",
										value: item.ingredient_name,
										onChange: (e) => handleCompositionChange(idx, "ingredient_name", e.target.value),
										placeholder: "e.g. Paracetamol (Acetaminophen)",
										className: "w-full px-3 py-1.5 text-xs sm:text-sm rounded-lg border border-slate-200 bg-white focus:border-teal-500 outline-none"
									})]
								}),
								/* @__PURE__ */ jsxs("div", {
									className: "w-full sm:w-36 space-y-1",
									children: [/* @__PURE__ */ jsx("span", {
										className: "text-[10px] uppercase font-semibold text-slate-400",
										children: "Strength Value"
									}), /* @__PURE__ */ jsx("input", {
										type: "text",
										value: item.strength,
										onChange: (e) => handleCompositionChange(idx, "strength", e.target.value),
										placeholder: "e.g. 500",
										className: "w-full px-3 py-1.5 text-xs sm:text-sm rounded-lg border border-slate-200 bg-white focus:border-teal-500 outline-none"
									})]
								}),
								/* @__PURE__ */ jsxs("div", {
									className: "w-full sm:w-28 space-y-1",
									children: [/* @__PURE__ */ jsx("span", {
										className: "text-[10px] uppercase font-semibold text-slate-400",
										children: "Unit"
									}), /* @__PURE__ */ jsx("input", {
										type: "text",
										value: item.unit,
										onChange: (e) => handleCompositionChange(idx, "unit", e.target.value),
										placeholder: "e.g. mg, mcg, %",
										className: "w-full px-3 py-1.5 text-xs sm:text-sm rounded-lg border border-slate-200 bg-white focus:border-teal-500 outline-none"
									})]
								}),
								/* @__PURE__ */ jsx("div", {
									className: "self-end sm:self-center pt-2 sm:pt-4",
									children: /* @__PURE__ */ jsx("button", {
										type: "button",
										onClick: () => removeCompositionRow(idx),
										className: "p-1.5 rounded-lg text-rose-500 hover:text-rose-700 hover:bg-rose-50 transition-colors cursor-pointer",
										title: "Remove ingredient",
										children: /* @__PURE__ */ jsx(Trash2, { className: "w-4 h-4" })
									})
								})
							]
						}, idx))
					})]
				}),
				/* @__PURE__ */ jsxs("div", {
					className: "bg-white rounded-xl border border-slate-200 p-6 sm:p-7 space-y-5",
					children: [/* @__PURE__ */ jsxs("div", {
						className: "flex items-center gap-2.5 pb-3 border-b border-slate-100",
						children: [/* @__PURE__ */ jsx("div", {
							className: "w-7 h-7 rounded-lg bg-teal-50 text-teal-700 flex items-center justify-center font-bold text-xs",
							children: "4"
						}), /* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("h3", {
							className: "text-base font-bold text-slate-900",
							children: "Clinical Overview & Documentation"
						}), /* @__PURE__ */ jsx("p", {
							className: "text-xs text-slate-500",
							children: "Technical monograph information, indications, and administration directions"
						})] })]
					}), /* @__PURE__ */ jsxs("div", {
						className: "space-y-4",
						children: [
							/* @__PURE__ */ jsxs("div", {
								className: "space-y-1.5",
								children: [/* @__PURE__ */ jsxs("label", {
									className: "text-xs font-semibold text-slate-700 flex items-center justify-between",
									children: [/* @__PURE__ */ jsx("span", { children: "Short Summary / Tagline" }), /* @__PURE__ */ jsx("span", {
										className: "text-[10px] text-slate-400 font-normal",
										children: "Capitalized automatically"
									})]
								}), /* @__PURE__ */ jsx("input", {
									type: "text",
									name: "short_description",
									value: formData.short_description,
									onChange: handleChange,
									placeholder: "Concise one-line pharmacological description...",
									className: "w-full px-3.5 py-2 text-xs sm:text-sm rounded-lg border border-slate-200 bg-slate-50/50 hover:bg-white focus:bg-white focus:border-teal-500 focus:ring-1 focus:ring-teal-500 transition-colors outline-none"
								})]
							}),
							/* @__PURE__ */ jsxs("div", {
								className: "space-y-1.5",
								children: [/* @__PURE__ */ jsxs("label", {
									className: "text-xs font-semibold text-slate-700 flex items-center justify-between",
									children: [/* @__PURE__ */ jsx("span", { children: "Detailed Clinical Description" }), /* @__PURE__ */ jsx("span", {
										className: "text-[10px] text-slate-400 font-normal",
										children: "Capitalized automatically"
									})]
								}), /* @__PURE__ */ jsx("textarea", {
									rows: 3,
									name: "description",
									value: formData.description,
									onChange: handleChange,
									placeholder: "Comprehensive pharmacological profile, pharmacokinetics, and therapeutic class...",
									className: "w-full px-3.5 py-2 text-xs sm:text-sm rounded-lg border border-slate-200 bg-slate-50/50 hover:bg-white focus:bg-white focus:border-teal-500 focus:ring-1 focus:ring-teal-500 transition-colors outline-none resize-none"
								})]
							}),
							/* @__PURE__ */ jsxs("div", {
								className: "grid grid-cols-1 sm:grid-cols-2 gap-4",
								children: [
									/* @__PURE__ */ jsxs("div", {
										className: "space-y-1.5",
										children: [/* @__PURE__ */ jsxs("label", {
											className: "text-xs font-semibold text-slate-700 flex items-center justify-between",
											children: [/* @__PURE__ */ jsx("span", { children: "Clinical Indications" }), /* @__PURE__ */ jsx("span", {
												className: "text-[10px] text-slate-400 font-normal",
												children: "Capitalized automatically"
											})]
										}), /* @__PURE__ */ jsx("textarea", {
											rows: 2,
											name: "indications",
											value: formData.indications,
											onChange: handleChange,
											placeholder: "Diseases, symptoms, or diagnostic uses...",
											className: "w-full px-3.5 py-2 text-xs sm:text-sm rounded-lg border border-slate-200 bg-slate-50/50 hover:bg-white focus:bg-white focus:border-teal-500 focus:ring-1 focus:ring-teal-500 transition-colors outline-none resize-none"
										})]
									}),
									/* @__PURE__ */ jsxs("div", {
										className: "space-y-1.5",
										children: [/* @__PURE__ */ jsxs("label", {
											className: "text-xs font-semibold text-slate-700 flex items-center justify-between",
											children: [/* @__PURE__ */ jsx("span", { children: "Dosage & Administration Directions" }), /* @__PURE__ */ jsx("span", {
												className: "text-[10px] text-slate-400 font-normal",
												children: "Capitalized automatically"
											})]
										}), /* @__PURE__ */ jsx("textarea", {
											rows: 2,
											name: "directions",
											value: formData.directions,
											onChange: handleChange,
											placeholder: "Standard dosing frequency, route, and administration instructions...",
											className: "w-full px-3.5 py-2 text-xs sm:text-sm rounded-lg border border-slate-200 bg-slate-50/50 hover:bg-white focus:bg-white focus:border-teal-500 focus:ring-1 focus:ring-teal-500 transition-colors outline-none resize-none"
										})]
									}),
									/* @__PURE__ */ jsxs("div", {
										className: "space-y-1.5",
										children: [/* @__PURE__ */ jsxs("label", {
											className: "text-xs font-semibold text-slate-700 flex items-center justify-between",
											children: [/* @__PURE__ */ jsx("span", { children: "Precautions & Warnings" }), /* @__PURE__ */ jsx("span", {
												className: "text-[10px] text-slate-400 font-normal",
												children: "Capitalized automatically"
											})]
										}), /* @__PURE__ */ jsx("textarea", {
											rows: 2,
											name: "precautions",
											value: formData.precautions,
											onChange: handleChange,
											placeholder: "Contraindications, drug interactions, pregnancy warnings...",
											className: "w-full px-3.5 py-2 text-xs sm:text-sm rounded-lg border border-slate-200 bg-slate-50/50 hover:bg-white focus:bg-white focus:border-teal-500 focus:ring-1 focus:ring-teal-500 transition-colors outline-none resize-none"
										})]
									}),
									/* @__PURE__ */ jsxs("div", {
										className: "space-y-1.5",
										children: [/* @__PURE__ */ jsxs("label", {
											className: "text-xs font-semibold text-slate-700 flex items-center justify-between",
											children: [/* @__PURE__ */ jsx("span", { children: "Storage Requirements" }), /* @__PURE__ */ jsx("span", {
												className: "text-[10px] text-slate-400 font-normal",
												children: "Capitalized automatically"
											})]
										}), /* @__PURE__ */ jsx("textarea", {
											rows: 2,
											name: "storage",
											value: formData.storage,
											onChange: handleChange,
											placeholder: "e.g. Store below 25°C in a dry place. Protect from light.",
											className: "w-full px-3.5 py-2 text-xs sm:text-sm rounded-lg border border-slate-200 bg-slate-50/50 hover:bg-white focus:bg-white focus:border-teal-500 focus:ring-1 focus:ring-teal-500 transition-colors outline-none resize-none"
										})]
									})
								]
							})
						]
					})]
				}),
				/* @__PURE__ */ jsxs("div", {
					className: "bg-white rounded-xl border border-slate-200 p-6 sm:p-7 space-y-5",
					children: [
						/* @__PURE__ */ jsxs("div", {
							className: "flex items-center gap-2.5 pb-3 border-b border-slate-100",
							children: [/* @__PURE__ */ jsx("div", {
								className: "w-7 h-7 rounded-lg bg-teal-50 text-teal-700 flex items-center justify-center font-bold text-xs",
								children: "5"
							}), /* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("h3", {
								className: "text-base font-bold text-slate-900",
								children: "Product Photography & Visuals"
							}), /* @__PURE__ */ jsx("p", {
								className: "text-xs text-slate-500",
								children: "High-resolution packaging, blister packs, and vials (Max 2MB per file)"
							})] })]
						}),
						isEditMode && existingImages.length > 0 && /* @__PURE__ */ jsxs("div", {
							className: "space-y-2",
							children: [/* @__PURE__ */ jsx("span", {
								className: "text-xs font-semibold text-slate-700 block",
								children: "Existing Images"
							}), /* @__PURE__ */ jsx("div", {
								className: "grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 gap-3",
								children: existingImages.map((img) => /* @__PURE__ */ jsxs("div", {
									className: "relative group rounded-lg border border-slate-200 overflow-hidden bg-slate-50 aspect-square",
									children: [/* @__PURE__ */ jsx("img", {
										src: img.url,
										alt: "",
										className: "w-full h-full object-cover"
									}), /* @__PURE__ */ jsx("button", {
										type: "button",
										onClick: () => handleRemoveExistingImage(img.id),
										className: "absolute top-1 right-1 p-1 rounded-md bg-rose-600 text-white opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer shadow-xs",
										title: "Remove image",
										children: /* @__PURE__ */ jsx(X, { className: "w-3.5 h-3.5" })
									})]
								}, img.id))
							})]
						}),
						/* @__PURE__ */ jsxs("div", {
							className: "border-2 border-dashed border-slate-200 rounded-xl p-6 text-center hover:border-teal-400 transition-colors bg-slate-50/30",
							children: [/* @__PURE__ */ jsx("input", {
								type: "file",
								multiple: true,
								accept: "image/jpeg,image/png,image/jpg,image/webp",
								onChange: handleImageChange,
								className: "hidden",
								id: "product-image-file-input"
							}), /* @__PURE__ */ jsxs("label", {
								htmlFor: "product-image-file-input",
								className: "flex flex-col items-center justify-center cursor-pointer space-y-2",
								children: [
									/* @__PURE__ */ jsx("div", {
										className: "w-10 h-10 rounded-full bg-teal-50 text-teal-600 flex items-center justify-center",
										children: /* @__PURE__ */ jsx(Upload, { className: "w-5 h-5" })
									}),
									/* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("span", {
										className: "text-xs font-semibold text-teal-700 hover:underline",
										children: "Click to upload product photos"
									}), /* @__PURE__ */ jsx("span", {
										className: "text-xs text-slate-500",
										children: " or drag and drop"
									})] }),
									/* @__PURE__ */ jsx("p", {
										className: "text-[11px] text-slate-400",
										children: "PNG, JPG, or WEBP up to 2MB each"
									})
								]
							})]
						}),
						imagePreviews.length > 0 && /* @__PURE__ */ jsxs("div", {
							className: "space-y-2 pt-2",
							children: [/* @__PURE__ */ jsxs("span", {
								className: "text-xs font-semibold text-slate-700 block",
								children: [
									"Ready to Upload (",
									imagePreviews.length,
									")"
								]
							}), /* @__PURE__ */ jsx("div", {
								className: "grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 gap-3",
								children: imagePreviews.map((preview, idx) => /* @__PURE__ */ jsxs("div", {
									className: "relative group rounded-lg border border-teal-200 overflow-hidden bg-slate-50 aspect-square",
									children: [/* @__PURE__ */ jsx("img", {
										src: preview.url,
										alt: "",
										className: "w-full h-full object-cover"
									}), /* @__PURE__ */ jsx("button", {
										type: "button",
										onClick: () => removeSelectedImage(idx),
										className: "absolute top-1 right-1 p-1 rounded-md bg-rose-600 text-white opacity-90 hover:opacity-100 transition-opacity cursor-pointer shadow-xs",
										title: "Remove image",
										children: /* @__PURE__ */ jsx(X, { className: "w-3.5 h-3.5" })
									})]
								}, idx))
							})]
						})
					]
				}),
				/* @__PURE__ */ jsxs("div", {
					className: "bg-white rounded-xl border border-slate-200 p-6 sm:p-7 space-y-5",
					children: [/* @__PURE__ */ jsxs("div", {
						className: "flex items-center gap-2.5 pb-3 border-b border-slate-100",
						children: [/* @__PURE__ */ jsx("div", {
							className: "w-7 h-7 rounded-lg bg-teal-50 text-teal-700 flex items-center justify-center font-bold text-xs",
							children: "6"
						}), /* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("h3", {
							className: "text-base font-bold text-slate-900",
							children: "Publishing & Catalog Visibility"
						}), /* @__PURE__ */ jsx("p", {
							className: "text-xs text-slate-500",
							children: "Control lifecycle state and public landing page promotion"
						})] })]
					}), /* @__PURE__ */ jsxs("div", {
						className: "space-y-4",
						children: [/* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("label", {
							className: "block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-2",
							children: "Publication Status"
						}), /* @__PURE__ */ jsx("div", {
							className: "grid grid-cols-1 sm:grid-cols-4 gap-3",
							children: [
								{
									value: "active",
									label: "Active",
									desc: "Visible in commercial catalog"
								},
								{
									value: "draft",
									label: "Draft",
									desc: "Work in progress / unlisted"
								},
								{
									value: "inactive",
									label: "Inactive",
									desc: "Temporarily disabled"
								},
								{
									value: "archived",
									label: "Archived",
									desc: "Discontinued monograph"
								}
							].map((s) => /* @__PURE__ */ jsxs("label", {
								className: `flex items-start gap-2.5 p-3 rounded-lg border cursor-pointer transition-colors ${formData.status === s.value ? "border-teal-500 bg-teal-50/30 text-teal-950 font-medium" : "border-slate-200 hover:bg-slate-50 text-slate-700"}`,
								children: [/* @__PURE__ */ jsx("input", {
									type: "radio",
									name: "status",
									value: s.value,
									checked: formData.status === s.value,
									onChange: handleChange,
									className: "w-4 h-4 mt-0.5 text-teal-600 focus:ring-teal-500"
								}), /* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("span", {
									className: "text-xs font-semibold block",
									children: s.label
								}), /* @__PURE__ */ jsx("span", {
									className: "text-[10px] text-slate-500 block",
									children: s.desc
								})] })]
							}, s.value))
						})] }), /* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("label", {
							className: "block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-2",
							children: "Public Website Promotion"
						}), /* @__PURE__ */ jsxs("label", {
							className: "flex items-start gap-3 p-4 rounded-lg border border-slate-200 hover:bg-slate-50 cursor-pointer transition-colors",
							children: [/* @__PURE__ */ jsx("input", {
								type: "checkbox",
								name: "is_featured",
								checked: formData.is_featured,
								onChange: handleChange,
								className: "w-4 h-4 mt-0.5 rounded text-teal-600 focus:ring-teal-500"
							}), /* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsxs("span", {
								className: "text-xs font-semibold text-slate-900 block flex items-center gap-1.5",
								children: [/* @__PURE__ */ jsx(Sparkles, { className: "w-3.5 h-3.5 text-amber-500" }), "Feature on Homepage"]
							}), /* @__PURE__ */ jsx("span", {
								className: "text-[11px] text-slate-500 block mt-0.5",
								children: "Display prominently on the public homepage featured medicine formulations showcase."
							})] })]
						})] })]
					})]
				}),
				/* @__PURE__ */ jsxs("div", {
					className: "flex items-center justify-end gap-3 pt-2",
					children: [/* @__PURE__ */ jsx(Link, {
						href: "/admin/products",
						className: "px-4 py-2 text-xs font-medium text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer",
						children: "Cancel"
					}), /* @__PURE__ */ jsx("button", {
						type: "submit",
						disabled: isSubmitting,
						className: "px-6 py-2 text-xs font-semibold text-white bg-teal-600 hover:bg-teal-700 active:bg-teal-800 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer flex items-center gap-2",
						children: isSubmitting ? /* @__PURE__ */ jsxs(Fragment, { children: [/* @__PURE__ */ jsx("div", { className: "w-3.5 h-3.5 border-2 border-white/40 border-t-white rounded-full animate-spin" }), /* @__PURE__ */ jsx("span", { children: isEditMode ? "Updating Product..." : "Saving Product..." })] }) : /* @__PURE__ */ jsx("span", { children: isEditMode ? "Update Product" : "Save & Publish Product" })
					})]
				})
			]
		})
	}) });
}
//#endregion
//#region resources/js/Pages/admin/product/ProductList.jsx
var ProductList_exports = /* @__PURE__ */ __exportAll({ default: () => ProductList });
function ProductList({ products: paginatedProducts, categories: initialCategories = [], filters = {} }) {
	const products = Array.isArray(paginatedProducts) ? paginatedProducts : paginatedProducts?.data || [];
	const meta = {
		current_page: paginatedProducts?.current_page || 1,
		last_page: paginatedProducts?.last_page || 1,
		total: paginatedProducts?.total || products.length
	};
	const categories = initialCategories;
	const [search, setSearch] = useState(filters.search || "");
	const [categoryFilter, setCategoryFilter] = useState(filters.category_id || "");
	const [statusFilter, setStatusFilter] = useState(filters.status || "");
	const [featuredFilter, setFeaturedFilter] = useState(filters.is_featured || "");
	const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);
	const [deletingId, setDeletingId] = useState(null);
	const [deleteConfirm, setDeleteConfirm] = useState({
		isOpen: false,
		product: null
	});
	const applyFilters = (newFilters = {}) => {
		const params = {
			search: newFilters.search !== void 0 ? newFilters.search : search,
			category_id: newFilters.category_id !== void 0 ? newFilters.category_id : categoryFilter,
			status: newFilters.status !== void 0 ? newFilters.status : statusFilter,
			is_featured: newFilters.is_featured !== void 0 ? newFilters.is_featured : featuredFilter
		};
		Object.keys(params).forEach((key) => {
			if (params[key] === "" || params[key] === null || params[key] === void 0) delete params[key];
		});
		router.get("/admin/products", params, { preserveState: true });
	};
	const requestDelete = (product) => {
		setDeleteConfirm({
			isOpen: true,
			product
		});
	};
	const handleConfirmDelete = () => {
		const product = deleteConfirm.product;
		if (!product) return;
		setDeletingId(product.id);
		router.delete(`/admin/products/${product.id}`, {
			preserveScroll: true,
			onFinish: () => {
				setDeletingId(null);
				setDeleteConfirm({
					isOpen: false,
					product: null
				});
			}
		});
	};
	const handleToggleStatus = (product) => {
		const nextStatus = product.status === "active" ? "inactive" : "active";
		router.patch(`/admin/products/${product.id}/status`, { status: nextStatus }, { preserveScroll: true });
	};
	const handleRefresh = () => {
		router.reload({ only: ["products"] });
	};
	const handleClearFilters = () => {
		setSearch("");
		setCategoryFilter("");
		setStatusFilter("");
		setFeaturedFilter("");
		router.get("/admin/products", {}, { preserveState: true });
	};
	const getStatusBadge = (status) => {
		switch (status) {
			case "active": return /* @__PURE__ */ jsxs("span", {
				className: "inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200",
				children: [/* @__PURE__ */ jsx(CheckCircle2, { className: "w-3 h-3" }), " Active"]
			});
			case "inactive": return /* @__PURE__ */ jsxs("span", {
				className: "inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-slate-100 text-slate-600 border border-slate-200",
				children: [/* @__PURE__ */ jsx(XCircle, { className: "w-3 h-3" }), " Inactive"]
			});
			case "draft": return /* @__PURE__ */ jsxs("span", {
				className: "inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-50 text-amber-700 border border-amber-200",
				children: [/* @__PURE__ */ jsx(Clock, { className: "w-3 h-3" }), " Draft"]
			});
			case "archived": return /* @__PURE__ */ jsxs("span", {
				className: "inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-rose-50 text-rose-700 border border-rose-200",
				children: [/* @__PURE__ */ jsx(Archive, { className: "w-3 h-3" }), " Archived"]
			});
			default: return /* @__PURE__ */ jsx("span", {
				className: "inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold bg-slate-100 text-slate-700",
				children: status
			});
		}
	};
	return /* @__PURE__ */ jsx(AdminLayout, { children: /* @__PURE__ */ jsxs("div", {
		className: "space-y-6 pt-2 pb-20 sm:pb-8",
		children: [
			/* @__PURE__ */ jsxs("div", {
				className: "bg-white rounded-xl border border-slate-200 p-4 space-y-4",
				children: [/* @__PURE__ */ jsxs("div", {
					className: "flex flex-col sm:flex-row items-center justify-between gap-3",
					children: [/* @__PURE__ */ jsxs("div", {
						className: "flex items-center gap-2 w-full sm:flex-1",
						children: [/* @__PURE__ */ jsx(SearchBar, {
							value: search,
							onChange: (e) => setSearch(e.target.value),
							onClear: () => {
								setSearch("");
								applyFilters({ search: "" });
							},
							onKeyDown: (e) => {
								if (e.key === "Enter") applyFilters({ search });
							},
							placeholder: "Search formulations by brand, generic, or code..."
						}), /* @__PURE__ */ jsxs("button", {
							type: "button",
							onClick: () => setIsFilterModalOpen(true),
							className: `sm:hidden h-[38px] px-3 rounded-lg border transition-colors cursor-pointer shrink-0 flex items-center justify-center gap-1.5 text-xs font-medium relative ${isFilterModalOpen || categoryFilter || statusFilter || featuredFilter ? "bg-teal-50 border-teal-300 text-teal-700" : "bg-slate-50/50 hover:bg-white border-slate-200 text-slate-600"}`,
							title: "Filter products",
							"aria-label": "Filter products",
							children: [/* @__PURE__ */ jsx(Filter, { className: "w-4 h-4" }), (categoryFilter || statusFilter || featuredFilter) && /* @__PURE__ */ jsx("span", { className: "w-2 h-2 bg-teal-600 rounded-full" })]
						})]
					}), /* @__PURE__ */ jsxs("div", {
						className: "hidden sm:flex items-center gap-2.5 shrink-0",
						children: [/* @__PURE__ */ jsxs("button", {
							type: "button",
							onClick: handleRefresh,
							className: "inline-flex items-center gap-1.5 px-3 py-2 text-xs font-medium text-slate-600 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors cursor-pointer",
							title: "Refresh list",
							children: [/* @__PURE__ */ jsx(RefreshCw, { className: "w-3.5 h-3.5" }), /* @__PURE__ */ jsx("span", { children: "Refresh" })]
						}), /* @__PURE__ */ jsxs(Link, {
							href: "/admin/products/add",
							className: "inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-white bg-teal-600 hover:bg-teal-700 rounded-lg transition-colors cursor-pointer",
							children: [/* @__PURE__ */ jsx(Plus, { className: "w-4 h-4 stroke-[2.5]" }), /* @__PURE__ */ jsx("span", { children: "Add Product" })]
						})]
					})]
				}), /* @__PURE__ */ jsxs("div", {
					className: "hidden sm:flex items-center gap-3 pt-3 border-t border-slate-100 flex-wrap",
					children: [
						/* @__PURE__ */ jsxs("div", {
							className: "flex items-center gap-2 text-xs font-medium text-slate-500",
							children: [/* @__PURE__ */ jsx(Filter, { className: "w-3.5 h-3.5" }), /* @__PURE__ */ jsx("span", { children: "Filters:" })]
						}),
						/* @__PURE__ */ jsxs("select", {
							value: categoryFilter,
							onChange: (e) => {
								setCategoryFilter(e.target.value);
								applyFilters({ category_id: e.target.value });
							},
							className: "px-3 py-1.5 text-xs rounded-lg border border-slate-200 bg-slate-50/50 hover:bg-white focus:bg-white focus:border-teal-500 focus:ring-1 focus:ring-teal-500 transition-colors outline-none cursor-pointer text-slate-700 max-w-[200px]",
							children: [/* @__PURE__ */ jsx("option", {
								value: "",
								children: "All Categories"
							}), categories.map((cat) => /* @__PURE__ */ jsx("option", {
								value: cat.id,
								children: cat.name
							}, cat.id))]
						}),
						/* @__PURE__ */ jsxs("select", {
							value: statusFilter,
							onChange: (e) => {
								setStatusFilter(e.target.value);
								applyFilters({ status: e.target.value });
							},
							className: "px-3 py-1.5 text-xs rounded-lg border border-slate-200 bg-slate-50/50 hover:bg-white focus:bg-white focus:border-teal-500 focus:ring-1 focus:ring-teal-500 transition-colors outline-none cursor-pointer text-slate-700",
							children: [
								/* @__PURE__ */ jsx("option", {
									value: "",
									children: "All Statuses"
								}),
								/* @__PURE__ */ jsx("option", {
									value: "active",
									children: "Active"
								}),
								/* @__PURE__ */ jsx("option", {
									value: "inactive",
									children: "Inactive"
								}),
								/* @__PURE__ */ jsx("option", {
									value: "draft",
									children: "Draft"
								}),
								/* @__PURE__ */ jsx("option", {
									value: "archived",
									children: "Archived"
								})
							]
						}),
						/* @__PURE__ */ jsxs("select", {
							value: featuredFilter,
							onChange: (e) => {
								setFeaturedFilter(e.target.value);
								applyFilters({ is_featured: e.target.value });
							},
							className: "px-3 py-1.5 text-xs rounded-lg border border-slate-200 bg-slate-50/50 hover:bg-white focus:bg-white focus:border-teal-500 focus:ring-1 focus:ring-teal-500 transition-colors outline-none cursor-pointer text-slate-700",
							children: [
								/* @__PURE__ */ jsx("option", {
									value: "",
									children: "Featured: All"
								}),
								/* @__PURE__ */ jsx("option", {
									value: "1",
									children: "Featured Only ⭐"
								}),
								/* @__PURE__ */ jsx("option", {
									value: "0",
									children: "Standard Only"
								})
							]
						}),
						(search || categoryFilter || statusFilter || featuredFilter) && /* @__PURE__ */ jsx("button", {
							type: "button",
							onClick: handleClearFilters,
							className: "text-xs text-rose-600 hover:text-rose-800 font-semibold px-2 py-1 cursor-pointer ml-auto",
							children: "Clear Filters"
						})
					]
				})]
			}),
			/* @__PURE__ */ jsxs("div", {
				className: "bg-white rounded-xl border border-slate-200 overflow-hidden",
				children: [products.length === 0 ? /* @__PURE__ */ jsxs("div", {
					className: "p-12 text-center space-y-3",
					children: [
						/* @__PURE__ */ jsx("div", {
							className: "w-12 h-12 rounded-xl bg-slate-100 text-slate-400 flex items-center justify-center mx-auto",
							children: /* @__PURE__ */ jsx(Package, { className: "w-6 h-6" })
						}),
						/* @__PURE__ */ jsx("h3", {
							className: "text-sm font-semibold text-slate-800",
							children: "No products found"
						}),
						/* @__PURE__ */ jsx("p", {
							className: "text-xs text-slate-500 max-w-sm mx-auto",
							children: search || categoryFilter || statusFilter || featuredFilter ? "Try adjusting your search criteria or filters." : "Get started by creating your first pharmaceutical product."
						}),
						/* @__PURE__ */ jsxs(Link, {
							href: "/admin/products/add",
							className: "inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-white bg-teal-600 hover:bg-teal-700 rounded-lg transition-colors mt-2",
							children: [/* @__PURE__ */ jsx(Plus, { className: "w-4 h-4" }), /* @__PURE__ */ jsx("span", { children: "Add Product" })]
						})
					]
				}) : /* @__PURE__ */ jsx("div", {
					className: "overflow-x-auto",
					children: /* @__PURE__ */ jsxs("table", {
						className: "w-full text-left text-xs sm:text-sm",
						children: [/* @__PURE__ */ jsx("thead", { children: /* @__PURE__ */ jsxs("tr", {
							className: "border-b border-slate-200 bg-slate-50/70 text-[11px] font-semibold uppercase tracking-wider text-slate-500",
							children: [
								/* @__PURE__ */ jsx("th", {
									className: "py-3 px-4 sm:px-6",
									children: "Product"
								}),
								/* @__PURE__ */ jsx("th", {
									className: "py-3 px-4",
									children: "Category"
								}),
								/* @__PURE__ */ jsx("th", {
									className: "py-3 px-4",
									children: "Status"
								}),
								/* @__PURE__ */ jsx("th", {
									className: "py-3 px-4 text-center",
									children: "Featured"
								}),
								/* @__PURE__ */ jsx("th", {
									className: "py-3 px-4 sm:px-6 text-right",
									children: "Actions"
								})
							]
						}) }), /* @__PURE__ */ jsx("tbody", {
							className: "divide-y divide-slate-100",
							children: products.map((product) => {
								const displayImg = product.primary_image?.url || product.primaryImage?.url || product.images?.[0]?.url;
								return /* @__PURE__ */ jsxs("tr", {
									className: "hover:bg-slate-50/60 transition-colors",
									children: [
										/* @__PURE__ */ jsx("td", {
											className: "py-3.5 px-4 sm:px-6",
											children: /* @__PURE__ */ jsxs("div", {
												className: "flex items-center gap-3",
												children: [/* @__PURE__ */ jsxs("div", {
													className: "w-10 h-10 rounded-lg bg-slate-100 border border-slate-200 overflow-hidden flex items-center justify-center shrink-0",
													children: [displayImg && /* @__PURE__ */ jsx("img", {
														src: displayImg,
														alt: product.brand_name,
														className: "w-full h-full object-cover",
														onError: (e) => {
															e.currentTarget.style.display = "none";
															const fallback = e.currentTarget.parentElement?.querySelector(".img-fallback");
															if (fallback) fallback.classList.remove("hidden");
														}
													}), /* @__PURE__ */ jsx("div", {
														className: `img-fallback items-center justify-center ${displayImg ? "hidden" : "flex"}`,
														children: /* @__PURE__ */ jsx(Pill, { className: "w-5 h-5 text-slate-400" })
													})]
												}), /* @__PURE__ */ jsxs("div", { children: [
													/* @__PURE__ */ jsx("div", {
														className: "flex items-center gap-1.5",
														children: /* @__PURE__ */ jsx(Link, {
															href: `/admin/products/${product.id}`,
															className: "font-semibold text-slate-900 hover:text-teal-600 transition-colors block capitalize",
															children: product.brand_name
														})
													}),
													/* @__PURE__ */ jsx("span", {
														className: "text-[11px] text-slate-500 block truncate max-w-xs capitalize",
														children: product.generic_name || "No generic specified"
													}),
													product.product_code && /* @__PURE__ */ jsxs("span", {
														className: "text-[10px] font-mono text-slate-400 block uppercase",
														children: ["Code: ", product.product_code]
													})
												] })]
											})
										}),
										/* @__PURE__ */ jsx("td", {
											className: "py-3.5 px-4",
											children: product.category ? /* @__PURE__ */ jsxs("span", {
												className: "inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-teal-50 text-teal-800 border border-teal-200/60 capitalize",
												children: [/* @__PURE__ */ jsx(Layers, { className: "w-3 h-3 text-teal-600" }), product.category.name]
											}) : /* @__PURE__ */ jsx("span", {
												className: "text-slate-400 italic text-xs",
												children: "Uncategorized"
											})
										}),
										/* @__PURE__ */ jsx("td", {
											className: "py-3.5 px-4",
											children: /* @__PURE__ */ jsx("button", {
												type: "button",
												onClick: () => handleToggleStatus(product),
												title: "Click to toggle status",
												className: "cursor-pointer hover:opacity-80 transition-opacity",
												children: getStatusBadge(product.status)
											})
										}),
										/* @__PURE__ */ jsx("td", {
											className: "py-3.5 px-4 text-center",
											children: product.is_featured ? /* @__PURE__ */ jsxs("span", {
												className: "inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-semibold bg-amber-50 text-amber-700 border border-amber-200",
												children: [/* @__PURE__ */ jsx(Star, { className: "w-3 h-3 fill-amber-500 text-amber-500" }), "Featured"]
											}) : /* @__PURE__ */ jsx("span", {
												className: "text-slate-300 text-xs",
												children: "—"
											})
										}),
										/* @__PURE__ */ jsx("td", {
											className: "py-3.5 px-4 sm:px-6 text-right whitespace-nowrap",
											children: /* @__PURE__ */ jsxs("div", {
												className: "flex items-center justify-end gap-1.5",
												children: [
													/* @__PURE__ */ jsx(Link, {
														href: `/admin/products/${product.id}`,
														className: "p-1.5 rounded-lg text-slate-500 hover:text-slate-800 hover:bg-slate-100 transition-colors",
														title: "View product details",
														children: /* @__PURE__ */ jsx(Eye, { className: "w-4 h-4" })
													}),
													/* @__PURE__ */ jsx(Link, {
														href: `/admin/products/${product.id}/edit`,
														className: "p-1.5 rounded-lg text-teal-600 hover:text-teal-800 hover:bg-teal-50 transition-colors",
														title: "Edit product",
														children: /* @__PURE__ */ jsx(Edit3, { className: "w-4 h-4" })
													}),
													/* @__PURE__ */ jsx("button", {
														type: "button",
														onClick: () => requestDelete(product),
														disabled: deletingId === product.id,
														className: "p-1.5 rounded-lg text-rose-500 hover:text-rose-700 hover:bg-rose-50 transition-colors cursor-pointer disabled:opacity-50",
														title: "Delete product",
														children: /* @__PURE__ */ jsx(Trash2, { className: "w-4 h-4" })
													})
												]
											})
										})
									]
								}, product.id);
							})
						})]
					})
				}), meta.last_page > 1 && /* @__PURE__ */ jsxs("div", {
					className: "p-4 border-t border-slate-100 flex items-center justify-between text-xs text-slate-600",
					children: [/* @__PURE__ */ jsxs("span", { children: [
						"Showing ",
						products.length,
						" of ",
						meta.total,
						" products"
					] }), /* @__PURE__ */ jsx("div", {
						className: "flex items-center gap-1",
						children: Array.from({ length: meta.last_page }).map((_, idx) => {
							const pNum = idx + 1;
							return /* @__PURE__ */ jsx("button", {
								type: "button",
								onClick: () => applyFilters({ page: pNum }),
								className: `px-3 py-1 rounded-md text-xs font-semibold cursor-pointer ${meta.current_page === pNum ? "bg-teal-700 text-white" : "bg-slate-100 hover:bg-slate-200 text-slate-700"}`,
								children: pNum
							}, pNum);
						})
					})]
				})]
			}),
			/* @__PURE__ */ jsx(ConfirmModal, {
				isOpen: deleteConfirm.isOpen,
				onClose: () => setDeleteConfirm({
					isOpen: false,
					product: null
				}),
				onConfirm: handleConfirmDelete,
				isLoading: Boolean(deletingId),
				title: "Delete Formulation",
				message: `Are you sure you want to delete "${deleteConfirm.product?.brand_name}"? All associated compositions and image records will be permanently removed.`,
				confirmText: "Delete Product",
				isDanger: true
			}),
			isFilterModalOpen && /* @__PURE__ */ jsxs("div", {
				className: "fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-slate-900/40 backdrop-blur-sm animate-in fade-in duration-200",
				children: [/* @__PURE__ */ jsx("div", {
					className: "fixed inset-0",
					onClick: () => setIsFilterModalOpen(false)
				}), /* @__PURE__ */ jsxs("div", {
					className: "relative w-full sm:max-w-md bg-white rounded-t-2xl sm:rounded-2xl border border-slate-200 shadow-xl p-5 z-10 space-y-4 animate-in slide-in-from-bottom-5 sm:zoom-in-95 duration-200 max-h-[85vh] overflow-y-auto",
					children: [
						/* @__PURE__ */ jsxs("div", {
							className: "flex items-center justify-between pb-3 border-b border-slate-100",
							children: [/* @__PURE__ */ jsxs("div", {
								className: "flex items-center gap-2.5",
								children: [/* @__PURE__ */ jsx("div", {
									className: "w-8 h-8 rounded-lg bg-teal-50 text-teal-600 flex items-center justify-center",
									children: /* @__PURE__ */ jsx(Filter, { className: "w-4 h-4" })
								}), /* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("h3", {
									className: "text-sm font-bold text-slate-900",
									children: "Filter Products"
								}), /* @__PURE__ */ jsx("p", {
									className: "text-[11px] text-slate-500",
									children: "Refine catalog by category and status"
								})] })]
							}), /* @__PURE__ */ jsx("button", {
								type: "button",
								onClick: () => setIsFilterModalOpen(false),
								className: "p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors cursor-pointer",
								"aria-label": "Close",
								children: /* @__PURE__ */ jsx(X, { className: "w-4 h-4" })
							})]
						}),
						/* @__PURE__ */ jsxs("div", {
							className: "space-y-3.5 py-1",
							children: [
								/* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("label", {
									className: "block text-xs font-semibold text-slate-700 mb-1.5",
									children: "Category"
								}), /* @__PURE__ */ jsxs("select", {
									value: categoryFilter,
									onChange: (e) => setCategoryFilter(e.target.value),
									className: "w-full px-3 py-2 text-xs sm:text-sm rounded-lg border border-slate-200 bg-slate-50/50 hover:bg-white focus:bg-white focus:border-teal-500 focus:ring-1 focus:ring-teal-500 transition-colors outline-none cursor-pointer text-slate-700",
									children: [/* @__PURE__ */ jsx("option", {
										value: "",
										children: "All Categories"
									}), categories.map((cat) => /* @__PURE__ */ jsx("option", {
										value: cat.id,
										children: cat.name
									}, cat.id))]
								})] }),
								/* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("label", {
									className: "block text-xs font-semibold text-slate-700 mb-1.5",
									children: "Status"
								}), /* @__PURE__ */ jsxs("select", {
									value: statusFilter,
									onChange: (e) => setStatusFilter(e.target.value),
									className: "w-full px-3 py-2 text-xs sm:text-sm rounded-lg border border-slate-200 bg-slate-50/50 hover:bg-white focus:bg-white focus:border-teal-500 focus:ring-1 focus:ring-teal-500 transition-colors outline-none cursor-pointer text-slate-700",
									children: [
										/* @__PURE__ */ jsx("option", {
											value: "",
											children: "All Statuses"
										}),
										/* @__PURE__ */ jsx("option", {
											value: "active",
											children: "Active"
										}),
										/* @__PURE__ */ jsx("option", {
											value: "inactive",
											children: "Inactive"
										}),
										/* @__PURE__ */ jsx("option", {
											value: "draft",
											children: "Draft"
										}),
										/* @__PURE__ */ jsx("option", {
											value: "archived",
											children: "Archived"
										})
									]
								})] }),
								/* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("label", {
									className: "block text-xs font-semibold text-slate-700 mb-1.5",
									children: "Featured Showcase"
								}), /* @__PURE__ */ jsxs("select", {
									value: featuredFilter,
									onChange: (e) => setFeaturedFilter(e.target.value),
									className: "w-full px-3 py-2 text-xs sm:text-sm rounded-lg border border-slate-200 bg-slate-50/50 hover:bg-white focus:bg-white focus:border-teal-500 focus:ring-1 focus:ring-teal-500 transition-colors outline-none cursor-pointer text-slate-700",
									children: [
										/* @__PURE__ */ jsx("option", {
											value: "",
											children: "All Featured States"
										}),
										/* @__PURE__ */ jsx("option", {
											value: "1",
											children: "Featured Only ⭐"
										}),
										/* @__PURE__ */ jsx("option", {
											value: "0",
											children: "Standard Only"
										})
									]
								})] })
							]
						}),
						/* @__PURE__ */ jsxs("div", {
							className: "flex items-center justify-between pt-3 border-t border-slate-100 gap-2",
							children: [/* @__PURE__ */ jsx("button", {
								type: "button",
								onClick: () => {
									setCategoryFilter("");
									setStatusFilter("");
									setFeaturedFilter("");
								},
								disabled: !categoryFilter && !statusFilter && !featuredFilter,
								className: "px-3.5 py-2 text-xs font-semibold text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed",
								children: "Reset"
							}), /* @__PURE__ */ jsx("button", {
								type: "button",
								onClick: () => {
									applyFilters({
										category_id: categoryFilter,
										status: statusFilter,
										is_featured: featuredFilter
									});
									setIsFilterModalOpen(false);
								},
								className: "px-4 py-2 text-xs font-semibold text-white bg-teal-600 hover:bg-teal-700 rounded-lg transition-colors cursor-pointer",
								children: "Apply Filters"
							})]
						})
					]
				})]
			}),
			/* @__PURE__ */ jsxs(Link, {
				href: "/admin/products/add",
				className: "sm:hidden fixed bottom-6 right-6 z-40 inline-flex items-center gap-2 px-4.5 py-3 rounded-full bg-teal-600 hover:bg-teal-700 active:scale-95 text-white font-semibold text-xs shadow-lg shadow-teal-900/25 transition-all cursor-pointer",
				"aria-label": "Add Product",
				children: [/* @__PURE__ */ jsx(Plus, { className: "w-4.5 h-4.5 stroke-[2.5]" }), /* @__PURE__ */ jsx("span", { children: "Add Product" })]
			})
		]
	}) });
}
//#endregion
//#region resources/js/Pages/admin/product/ProductSlides.jsx
var ProductSlides_exports = /* @__PURE__ */ __exportAll({ default: () => ProductSlides });
function ProductSlides({ product, slides = [] }) {
	const [selectedFiles, setSelectedFiles] = useState([]);
	const [filePreviews, setFilePreviews] = useState([]);
	const [isUploading, setIsUploading] = useState(false);
	const [lightboxIndex, setLightboxIndex] = useState(null);
	const [deleteConfirm, setDeleteConfirm] = useState({
		isOpen: false,
		slide: null
	});
	const [editingTitleId, setEditingTitleId] = useState(null);
	const [editTitleValue, setEditTitleValue] = useState("");
	const fileInputRef = useRef(null);
	const handleFilesChange = (e) => {
		const files = Array.from(e.target.files || []);
		if (files.length === 0) return;
		setSelectedFiles((prev) => [...prev, ...files]);
		const newPreviews = files.map((file) => ({
			file,
			url: URL.createObjectURL(file),
			name: file.name
		}));
		setFilePreviews((prev) => [...prev, ...newPreviews]);
	};
	const handleRemoveStaged = (index) => {
		setSelectedFiles((prev) => prev.filter((_, i) => i !== index));
		setFilePreviews((prev) => prev.filter((_, i) => i !== index));
	};
	const handleUploadSubmit = (e) => {
		e?.preventDefault();
		if (selectedFiles.length === 0) return;
		setIsUploading(true);
		const formData = new FormData();
		selectedFiles.forEach((file) => {
			formData.append("images[]", file);
		});
		router.post(`/admin/products/${product.id}/slides`, formData, {
			onSuccess: () => {
				setSelectedFiles([]);
				setFilePreviews([]);
				setIsUploading(false);
				if (fileInputRef.current) fileInputRef.current.value = "";
			},
			onError: () => setIsUploading(false)
		});
	};
	const handleMove = (index, direction) => {
		const targetIdx = index + direction;
		if (targetIdx < 0 || targetIdx >= slides.length) return;
		const newOrder = [...slides];
		const [moved] = newOrder.splice(index, 1);
		newOrder.splice(targetIdx, 0, moved);
		const slideIds = newOrder.map((s) => s.id);
		router.post(`/admin/products/${product.id}/slides/reorder`, { slide_ids: slideIds }, { preserveScroll: true });
	};
	const handleToggleStatus = (slide) => {
		router.patch(`/admin/products/${product.id}/slides/${slide.id}/status`, {}, { preserveScroll: true });
	};
	const handleConfirmDelete = () => {
		if (!deleteConfirm.slide) return;
		router.delete(`/admin/products/${product.id}/slides/${deleteConfirm.slide.id}`, {
			preserveScroll: true,
			onSuccess: () => setDeleteConfirm({
				isOpen: false,
				slide: null
			})
		});
	};
	const handleSaveTitle = (slide) => {
		router.post(`/admin/products/${product.id}/slides/${slide.id}`, { title: editTitleValue.trim() || slide.title }, {
			preserveScroll: true,
			onSuccess: () => setEditingTitleId(null)
		});
	};
	const activeSlides = slides.filter((s) => s.is_active);
	return /* @__PURE__ */ jsxs(AdminLayout, { children: [
		/* @__PURE__ */ jsx(Head, { title: `${product.brand_name} — Visual Aid Carousel` }),
		/* @__PURE__ */ jsxs("div", {
			className: "space-y-6",
			children: [
				/* @__PURE__ */ jsxs("div", {
					className: "flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4",
					children: [/* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsxs("div", {
						className: "flex items-center gap-2 text-xs text-slate-500 mb-1",
						children: [
							/* @__PURE__ */ jsx(Link, {
								href: "/admin/products",
								className: "hover:text-teal-600 transition-colors",
								children: "Products"
							}),
							/* @__PURE__ */ jsx("span", { children: "/" }),
							/* @__PURE__ */ jsx(Link, {
								href: `/admin/products/${product.id}`,
								className: "hover:text-teal-600 transition-colors font-medium",
								children: product.brand_name
							}),
							/* @__PURE__ */ jsx("span", { children: "/" }),
							/* @__PURE__ */ jsx("span", {
								className: "text-slate-800 font-semibold",
								children: "Visual Aid Carousel"
							})
						]
					}), /* @__PURE__ */ jsxs("div", {
						className: "flex items-center gap-3",
						children: [/* @__PURE__ */ jsx("div", {
							className: "w-10 h-10 rounded-xl bg-teal-50 text-teal-700 flex items-center justify-center shadow-xs",
							children: /* @__PURE__ */ jsx(Image, { className: "w-5 h-5 stroke-[2.2]" })
						}), /* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsxs("h1", {
							className: "text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2",
							children: [/* @__PURE__ */ jsx("span", { children: product.brand_name }), /* @__PURE__ */ jsx("span", {
								className: "text-xs px-2.5 py-0.5 rounded-full bg-teal-50 text-teal-800 border border-teal-200/80 font-bold",
								children: "Visual Aid Carousel"
							})]
						}), /* @__PURE__ */ jsx("p", {
							className: "text-xs text-slate-500",
							children: "Upload slide images directly. MRs present them as a full-screen interactive carousel on their tablet."
						})] })]
					})] }), /* @__PURE__ */ jsxs("div", {
						className: "flex items-center gap-2.5",
						children: [/* @__PURE__ */ jsx(Link, {
							href: `/admin/products/${product.id}`,
							className: "px-3.5 py-2 text-xs font-semibold text-slate-700 bg-white border border-slate-200 hover:bg-slate-50 rounded-xl transition-colors cursor-pointer",
							children: "Back to Product"
						}), /* @__PURE__ */ jsxs(Link, {
							href: "/mr/products",
							target: "_blank",
							className: "inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-teal-700 bg-teal-50 hover:bg-teal-100 border border-teal-200 rounded-xl transition-colors cursor-pointer",
							children: [
								/* @__PURE__ */ jsx(Eye, { className: "w-4 h-4" }),
								/* @__PURE__ */ jsx("span", { children: "Preview MR Carousel" }),
								/* @__PURE__ */ jsx(ExternalLink, { className: "w-3 h-3 opacity-60" })
							]
						})]
					})]
				}),
				/* @__PURE__ */ jsxs("div", {
					className: "bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-xs space-y-4",
					children: [
						/* @__PURE__ */ jsxs("div", {
							className: "flex items-center justify-between pb-3 border-b border-slate-100",
							children: [/* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("h2", {
								className: "text-sm font-bold text-slate-900",
								children: "Upload Carousel Slide Images"
							}), /* @__PURE__ */ jsx("p", {
								className: "text-xs text-slate-500",
								children: "Select one or multiple presentation slide images (PNG, JPG, WebP) to add to the visual aid carousel."
							})] }), /* @__PURE__ */ jsxs("span", {
								className: "text-xs font-semibold px-3 py-1 rounded-full bg-teal-50 text-teal-800 border border-teal-200",
								children: [
									slides.length,
									" ",
									slides.length === 1 ? "Slide" : "Slides",
									" in Carousel"
								]
							})]
						}),
						/* @__PURE__ */ jsxs("div", {
							onClick: () => fileInputRef.current?.click(),
							className: "border-2 border-dashed border-teal-500/40 hover:border-teal-600 bg-teal-50/20 hover:bg-teal-50/40 rounded-2xl p-8 text-center cursor-pointer transition-all space-y-3 group",
							children: [
								/* @__PURE__ */ jsx("div", {
									className: "w-12 h-12 rounded-2xl bg-teal-100 text-teal-700 flex items-center justify-center mx-auto group-hover:scale-110 transition-transform shadow-xs",
									children: /* @__PURE__ */ jsx(Upload, { className: "w-6 h-6 stroke-[2.2]" })
								}),
								/* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("p", {
									className: "text-sm font-bold text-slate-800",
									children: "Click to browse or drop slide images here"
								}), /* @__PURE__ */ jsx("p", {
									className: "text-xs text-slate-400 mt-1",
									children: "Select multiple slides at once. Recommended resolution: 1920x1080 (16:9) or 4:3 for optimal tablet presentation."
								})] }),
								/* @__PURE__ */ jsx("input", {
									ref: fileInputRef,
									type: "file",
									accept: "image/png,image/jpeg,image/webp,image/svg+xml",
									multiple: true,
									onChange: handleFilesChange,
									className: "hidden"
								})
							]
						}),
						filePreviews.length > 0 && /* @__PURE__ */ jsxs("div", {
							className: "p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-3",
							children: [/* @__PURE__ */ jsxs("div", {
								className: "flex items-center justify-between",
								children: [/* @__PURE__ */ jsxs("span", {
									className: "text-xs font-bold text-slate-700",
									children: [
										filePreviews.length,
										" ",
										filePreviews.length === 1 ? "image" : "images",
										" selected for upload:"
									]
								}), /* @__PURE__ */ jsxs("button", {
									type: "button",
									onClick: handleUploadSubmit,
									disabled: isUploading,
									className: "px-4 py-2 rounded-xl bg-teal-700 hover:bg-teal-800 text-white font-bold text-xs shadow-xs transition-colors flex items-center gap-1.5 cursor-pointer disabled:opacity-50",
									children: [/* @__PURE__ */ jsx(Upload, { className: "w-3.5 h-3.5" }), /* @__PURE__ */ jsx("span", { children: isUploading ? "Uploading Slides..." : `Upload ${filePreviews.length} Slide(s)` })]
								})]
							}), /* @__PURE__ */ jsx("div", {
								className: "grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 gap-3",
								children: filePreviews.map((item, idx) => /* @__PURE__ */ jsxs("div", {
									className: "relative rounded-xl border border-slate-200 bg-white overflow-hidden shadow-xs group",
									children: [
										/* @__PURE__ */ jsx("img", {
											src: item.url,
											alt: item.name,
											className: "w-full h-24 object-cover"
										}),
										/* @__PURE__ */ jsx("button", {
											type: "button",
											onClick: () => handleRemoveStaged(idx),
											className: "absolute top-1 right-1 p-1 bg-red-600/90 text-white rounded-md hover:bg-red-700 cursor-pointer shadow-xs",
											title: "Remove",
											children: /* @__PURE__ */ jsx(X, { className: "w-3 h-3" })
										}),
										/* @__PURE__ */ jsx("div", {
											className: "p-1.5 text-[10px] font-medium text-slate-600 truncate text-center",
											children: item.name
										})
									]
								}, idx))
							})]
						})
					]
				}),
				/* @__PURE__ */ jsxs("div", {
					className: "bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-xs space-y-4",
					children: [/* @__PURE__ */ jsxs("div", {
						className: "flex items-center justify-between pb-3 border-b border-slate-100",
						children: [/* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("h2", {
							className: "text-sm font-bold text-slate-900",
							children: "Presentation Slide Sequence"
						}), /* @__PURE__ */ jsx("p", {
							className: "text-xs text-slate-500",
							children: "Drag or use arrows to arrange the order that MRs flip through during doctor meetings."
						})] }), /* @__PURE__ */ jsxs("span", {
							className: "text-xs font-semibold text-slate-500",
							children: [
								activeSlides.length,
								" of ",
								slides.length,
								" active in deck"
							]
						})]
					}), slides.length === 0 ? /* @__PURE__ */ jsxs("div", {
						className: "p-12 text-center space-y-3",
						children: [
							/* @__PURE__ */ jsx("div", {
								className: "w-14 h-14 mx-auto rounded-2xl bg-teal-50 text-teal-700 flex items-center justify-center",
								children: /* @__PURE__ */ jsx(Image, { className: "w-7 h-7" })
							}),
							/* @__PURE__ */ jsx("h3", {
								className: "text-sm font-bold text-slate-900",
								children: "No Slide Images in Carousel Yet"
							}),
							/* @__PURE__ */ jsx("p", {
								className: "text-xs text-slate-500 max-w-md mx-auto",
								children: "Upload your pharmaceutical visual aid images above. MRs will flip through them as an interactive full-screen carousel."
							})
						]
					}) : /* @__PURE__ */ jsx("div", {
						className: "grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4",
						children: slides.map((slide, idx) => /* @__PURE__ */ jsxs("div", {
							className: `rounded-2xl border transition-all overflow-hidden flex flex-col justify-between shadow-xs ${slide.is_active ? "bg-white border-slate-200 hover:border-teal-400 hover:shadow-md" : "bg-slate-50/70 border-slate-200 opacity-60"}`,
							children: [
								/* @__PURE__ */ jsxs("div", {
									className: "p-2.5 px-3 bg-slate-50/80 border-b border-slate-100 flex items-center justify-between",
									children: [/* @__PURE__ */ jsxs("span", {
										className: "text-xs font-black text-teal-800 bg-teal-50 px-2.5 py-0.5 rounded-md border border-teal-200",
										children: ["Slide #", idx + 1]
									}), /* @__PURE__ */ jsx("button", {
										type: "button",
										onClick: () => handleToggleStatus(slide),
										className: `p-1 rounded-lg text-xs font-semibold cursor-pointer transition-colors ${slide.is_active ? "text-emerald-700 hover:bg-emerald-50" : "text-slate-400 hover:bg-slate-200"}`,
										title: slide.is_active ? "Active in presentation" : "Hidden from presentation",
										children: slide.is_active ? /* @__PURE__ */ jsx(CheckCircle2, { className: "w-4 h-4" }) : /* @__PURE__ */ jsx(XCircle, { className: "w-4 h-4" })
									})]
								}),
								/* @__PURE__ */ jsxs("div", {
									onClick: () => setLightboxIndex(idx),
									className: "relative w-full h-44 bg-slate-900 cursor-pointer overflow-hidden group",
									children: [/* @__PURE__ */ jsx("img", {
										src: slide.image_path,
										alt: slide.title,
										className: "w-full h-full object-contain group-hover:scale-105 transition-transform duration-200"
									}), /* @__PURE__ */ jsxs("div", {
										className: "absolute inset-0 bg-slate-900/30 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white text-xs font-bold gap-1.5 backdrop-blur-[1px]",
										children: [/* @__PURE__ */ jsx(Eye, { className: "w-4 h-4" }), /* @__PURE__ */ jsx("span", { children: "View Full Slide" })]
									})]
								}),
								/* @__PURE__ */ jsxs("div", {
									className: "p-3 bg-white space-y-2",
									children: [editingTitleId === slide.id ? /* @__PURE__ */ jsxs("div", {
										className: "flex items-center gap-1",
										children: [
											/* @__PURE__ */ jsx("input", {
												type: "text",
												value: editTitleValue,
												onChange: (e) => setEditTitleValue(e.target.value),
												className: "flex-1 px-2 py-1 text-xs border rounded-lg focus:outline-none focus:ring-1 focus:ring-teal-500",
												placeholder: "Slide Title"
											}),
											/* @__PURE__ */ jsx("button", {
												type: "button",
												onClick: () => handleSaveTitle(slide),
												className: "p-1 text-emerald-700 hover:bg-emerald-50 rounded",
												children: /* @__PURE__ */ jsx(Check, { className: "w-3.5 h-3.5" })
											}),
											/* @__PURE__ */ jsx("button", {
												type: "button",
												onClick: () => setEditingTitleId(null),
												className: "p-1 text-slate-400 hover:bg-slate-100 rounded",
												children: /* @__PURE__ */ jsx(X, { className: "w-3.5 h-3.5" })
											})
										]
									}) : /* @__PURE__ */ jsxs("div", {
										className: "flex items-center justify-between",
										children: [/* @__PURE__ */ jsx("span", {
											className: "text-xs font-bold text-slate-800 truncate",
											title: slide.title,
											children: slide.title || `Slide ${idx + 1}`
										}), /* @__PURE__ */ jsx("button", {
											type: "button",
											onClick: () => {
												setEditingTitleId(slide.id);
												setEditTitleValue(slide.title || "");
											},
											className: "p-1 text-slate-400 hover:text-teal-700 rounded cursor-pointer",
											title: "Rename slide",
											children: /* @__PURE__ */ jsx(Edit2, { className: "w-3 h-3" })
										})]
									}), /* @__PURE__ */ jsxs("div", {
										className: "flex items-center justify-between pt-1 border-t border-slate-100",
										children: [/* @__PURE__ */ jsxs("div", {
											className: "flex items-center gap-1",
											children: [/* @__PURE__ */ jsx("button", {
												type: "button",
												onClick: () => handleMove(idx, -1),
												disabled: idx === 0,
												className: "p-1.5 rounded-lg text-slate-500 hover:bg-slate-100 hover:text-slate-900 disabled:opacity-20 cursor-pointer",
												title: "Move Left (Earlier in Carousel)",
												children: /* @__PURE__ */ jsx(MoveLeft, { className: "w-3.5 h-3.5" })
											}), /* @__PURE__ */ jsx("button", {
												type: "button",
												onClick: () => handleMove(idx, 1),
												disabled: idx === slides.length - 1,
												className: "p-1.5 rounded-lg text-slate-500 hover:bg-slate-100 hover:text-slate-900 disabled:opacity-20 cursor-pointer",
												title: "Move Right (Later in Carousel)",
												children: /* @__PURE__ */ jsx(MoveRight, { className: "w-3.5 h-3.5" })
											})]
										}), /* @__PURE__ */ jsx("button", {
											type: "button",
											onClick: () => setDeleteConfirm({
												isOpen: true,
												slide
											}),
											className: "p-1.5 rounded-lg text-red-500 hover:bg-red-50 hover:text-red-700 cursor-pointer",
											title: "Delete Slide",
											children: /* @__PURE__ */ jsx(Trash2, { className: "w-3.5 h-3.5" })
										})]
									})]
								})
							]
						}, slide.id))
					})]
				})
			]
		}),
		lightboxIndex !== null && slides[lightboxIndex] && /* @__PURE__ */ jsx("div", {
			className: "fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/90 backdrop-blur-md animate-in fade-in duration-200",
			children: /* @__PURE__ */ jsxs("div", {
				className: "relative max-w-5xl w-full flex flex-col items-center",
				children: [/* @__PURE__ */ jsxs("div", {
					className: "w-full flex items-center justify-between pb-3 text-white",
					children: [/* @__PURE__ */ jsxs("div", {
						className: "flex items-center gap-2",
						children: [/* @__PURE__ */ jsxs("span", {
							className: "text-xs font-bold px-2.5 py-0.5 rounded-full bg-teal-500/30 text-teal-300 border border-teal-500/50",
							children: [
								"Slide ",
								lightboxIndex + 1,
								" of ",
								slides.length
							]
						}), /* @__PURE__ */ jsx("span", {
							className: "text-sm font-semibold text-slate-200",
							children: slides[lightboxIndex].title
						})]
					}), /* @__PURE__ */ jsx("button", {
						type: "button",
						onClick: () => setLightboxIndex(null),
						className: "p-2 rounded-xl text-slate-400 hover:text-white hover:bg-white/10 cursor-pointer",
						children: /* @__PURE__ */ jsx(X, { className: "w-6 h-6" })
					})]
				}), /* @__PURE__ */ jsxs("div", {
					className: "relative w-full max-h-[80vh] flex items-center justify-center",
					children: [
						/* @__PURE__ */ jsx("img", {
							src: slides[lightboxIndex].image_path,
							alt: slides[lightboxIndex].title,
							className: "max-h-[75vh] w-auto max-w-full object-contain rounded-2xl shadow-2xl border border-white/10"
						}),
						lightboxIndex > 0 && /* @__PURE__ */ jsx("button", {
							type: "button",
							onClick: () => setLightboxIndex(lightboxIndex - 1),
							className: "absolute left-2 top-1/2 -translate-y-1/2 p-3 rounded-full bg-black/60 hover:bg-black/80 text-white cursor-pointer backdrop-blur-xs transition-colors",
							children: /* @__PURE__ */ jsx(ChevronLeft, { className: "w-6 h-6" })
						}),
						lightboxIndex < slides.length - 1 && /* @__PURE__ */ jsx("button", {
							type: "button",
							onClick: () => setLightboxIndex(lightboxIndex + 1),
							className: "absolute right-2 top-1/2 -translate-y-1/2 p-3 rounded-full bg-black/60 hover:bg-black/80 text-white cursor-pointer backdrop-blur-xs transition-colors",
							children: /* @__PURE__ */ jsx(ChevronRight, { className: "w-6 h-6" })
						})
					]
				})]
			})
		}),
		/* @__PURE__ */ jsx(ConfirmModal, {
			isOpen: deleteConfirm.isOpen,
			title: "Delete Slide Image?",
			message: `Are you sure you want to remove "${deleteConfirm.slide?.title || "this slide"}" from the visual aid carousel?`,
			confirmText: "Delete Slide",
			confirmVariant: "danger",
			onConfirm: handleConfirmDelete,
			onClose: () => setDeleteConfirm({
				isOpen: false,
				slide: null
			})
		})
	] });
}
//#endregion
//#region resources/js/Pages/admin/roles/RoleForm.jsx
var RoleForm_exports = /* @__PURE__ */ __exportAll({ default: () => RoleForm });
function RoleForm({ isEdit = false, role = null, groupedPermissions = {} }) {
	const isSuperAdmin = role?.name === "super_admin";
	const { data, setData, post, put, processing, errors } = useForm({
		name: role?.name || "",
		permissions: role?.permissions || []
	});
	const togglePermission = (permName) => {
		if (isSuperAdmin) return;
		if (data.permissions.includes(permName)) setData("permissions", data.permissions.filter((p) => p !== permName));
		else setData("permissions", [...data.permissions, permName]);
	};
	const toggleGroup = (modulePermissions) => {
		if (isSuperAdmin) return;
		const names = modulePermissions.map((p) => p.name);
		if (names.every((n) => data.permissions.includes(n))) setData("permissions", data.permissions.filter((p) => !names.includes(p)));
		else {
			const merged = Array.from(/* @__PURE__ */ new Set([...data.permissions, ...names]));
			setData("permissions", merged);
		}
	};
	const handleSubmit = (e) => {
		e.preventDefault();
		if (isEdit) put(`/admin/roles/${role.id}`);
		else post("/admin/roles");
	};
	const totalPermissionsCount = Object.values(groupedPermissions).reduce((acc, perms) => acc + perms.length, 0);
	return /* @__PURE__ */ jsx(AdminLayout, { children: /* @__PURE__ */ jsxs("div", {
		className: "max-w-4xl mx-auto space-y-5 pb-10",
		children: [isSuperAdmin && /* @__PURE__ */ jsxs("div", {
			className: "bg-purple-50/80 border border-purple-200/80 rounded-xl p-4 flex items-center gap-3 text-purple-900",
			children: [/* @__PURE__ */ jsx(Lock, { className: "w-5 h-5 text-purple-600 shrink-0" }), /* @__PURE__ */ jsxs("div", {
				className: "text-xs",
				children: [/* @__PURE__ */ jsx("strong", {
					className: "block font-semibold text-purple-950",
					children: "Super Administrator Role is Protected"
				}), /* @__PURE__ */ jsx("span", { children: "This role has global, permanent access to all administrative capabilities and cannot be modified." })]
			})]
		}), /* @__PURE__ */ jsxs("form", {
			onSubmit: handleSubmit,
			className: "space-y-5",
			children: [
				/* @__PURE__ */ jsxs("div", {
					className: "bg-white p-5 sm:p-6 rounded-xl border border-slate-200/80 shadow-[0_1px_3px_rgba(0,0,0,0.04)]",
					children: [
						/* @__PURE__ */ jsxs("label", {
							className: "block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5",
							children: ["Role Identifier Key ", /* @__PURE__ */ jsx("span", {
								className: "text-rose-500",
								children: "*"
							})]
						}),
						/* @__PURE__ */ jsx("input", {
							type: "text",
							disabled: isSuperAdmin,
							value: data.name,
							onChange: (e) => setData("name", e.target.value),
							placeholder: "e.g. area_sales_manager or medical_rep",
							className: `w-full px-3.5 py-2.5 bg-slate-50/70 hover:bg-slate-50 focus:bg-white border ${errors.name ? "border-rose-300 focus:border-rose-500" : "border-slate-200 focus:border-teal-600"} rounded-lg text-xs sm:text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-600/10 transition-all ${isSuperAdmin ? "opacity-60 cursor-not-allowed bg-slate-100" : ""}`
						}),
						errors.name && /* @__PURE__ */ jsx("p", {
							className: "text-xs text-rose-600 mt-1 font-medium",
							children: errors.name
						}),
						/* @__PURE__ */ jsxs("p", {
							className: "text-[11px] text-slate-400 mt-1.5",
							children: [
								"Use lowercase alphanumeric characters and underscores (e.g. ",
								/* @__PURE__ */ jsx("code", {
									className: "text-teal-700 font-medium",
									children: "territory_manager"
								}),
								")."
							]
						})
					]
				}),
				/* @__PURE__ */ jsxs("div", {
					className: "bg-white rounded-xl border border-slate-200/80 shadow-[0_1px_3px_rgba(0,0,0,0.04)] overflow-hidden",
					children: [/* @__PURE__ */ jsxs("div", {
						className: "p-4 sm:p-5 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-2 bg-slate-50/40",
						children: [/* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("h2", {
							className: "text-sm font-bold text-slate-900",
							children: "Module Capabilities & Permissions"
						}), /* @__PURE__ */ jsx("p", {
							className: "text-xs text-slate-500 mt-0.5",
							children: "Toggle specific privileges granted to users assigned this role."
						})] }), /* @__PURE__ */ jsxs("span", {
							className: "inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-teal-50 text-teal-800 self-start sm:self-auto",
							children: [/* @__PURE__ */ jsx(CheckCircle2, { className: "w-3.5 h-3.5 text-teal-600" }), /* @__PURE__ */ jsxs("span", { children: [
								data.permissions.length,
								" of ",
								totalPermissionsCount,
								" permissions granted"
							] })]
						})]
					}), /* @__PURE__ */ jsx("div", {
						className: "divide-y divide-slate-100",
						children: Object.entries(groupedPermissions).map(([moduleName, permissions]) => {
							const allSelected = permissions.map((p) => p.name).every((n) => data.permissions.includes(n));
							const activeCount = permissions.filter((p) => data.permissions.includes(p.name)).length;
							return /* @__PURE__ */ jsxs("div", {
								className: "p-4 sm:p-5",
								children: [/* @__PURE__ */ jsxs("div", {
									className: "flex items-center justify-between pb-3",
									children: [/* @__PURE__ */ jsxs("div", {
										className: "flex items-center gap-2",
										children: [/* @__PURE__ */ jsx("span", {
											className: "text-xs sm:text-sm font-bold text-slate-900",
											children: moduleName
										}), /* @__PURE__ */ jsxs("span", {
											className: "text-[11px] px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 font-medium",
											children: [
												activeCount,
												"/",
												permissions.length
											]
										})]
									}), !isSuperAdmin && /* @__PURE__ */ jsx("button", {
										type: "button",
										onClick: () => toggleGroup(permissions),
										className: "text-xs font-medium text-teal-700 hover:text-teal-800 transition-colors cursor-pointer",
										children: allSelected ? "Deselect All" : "Select All"
									})]
								}), /* @__PURE__ */ jsx("div", {
									className: "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2",
									children: permissions.map((perm) => {
										const checked = data.permissions.includes(perm.name);
										return /* @__PURE__ */ jsxs("label", {
											className: `flex items-start gap-2.5 p-2.5 rounded-lg text-xs cursor-pointer transition-all ${checked ? "bg-teal-50/60 text-teal-950 font-medium" : "hover:bg-slate-50 text-slate-700"} ${isSuperAdmin ? "cursor-default" : ""}`,
											children: [/* @__PURE__ */ jsx("input", {
												type: "checkbox",
												disabled: isSuperAdmin,
												checked,
												onChange: () => togglePermission(perm.name),
												className: "mt-0.5 rounded text-teal-600 focus:ring-teal-500 border-slate-300"
											}), /* @__PURE__ */ jsxs("div", {
												className: "min-w-0 flex-1 leading-tight",
												children: [/* @__PURE__ */ jsx("span", {
													className: "block font-semibold text-slate-900",
													children: perm.label
												}), /* @__PURE__ */ jsx("span", {
													className: "text-[10px] text-slate-400 font-mono block mt-0.5 truncate",
													children: perm.name
												})]
											})]
										}, perm.id);
									})
								})]
							}, moduleName);
						})
					})]
				}),
				/* @__PURE__ */ jsxs("div", {
					className: "bg-white p-4 rounded-xl border border-slate-200/80 shadow-[0_1px_3px_rgba(0,0,0,0.04)] flex items-center justify-between",
					children: [/* @__PURE__ */ jsx(Link, {
						href: "/admin/roles",
						className: "px-4 py-2 rounded-lg border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-semibold transition-colors",
						children: "Cancel"
					}), !isSuperAdmin && /* @__PURE__ */ jsxs("button", {
						type: "submit",
						disabled: processing,
						className: "inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-teal-700 hover:bg-teal-800 disabled:opacity-50 text-white text-xs font-semibold shadow-sm transition-all cursor-pointer",
						children: [/* @__PURE__ */ jsx(Save, { className: "w-3.5 h-3.5" }), /* @__PURE__ */ jsx("span", { children: processing ? "Saving..." : isEdit ? "Save Role Changes" : "Create Role" })]
					})]
				})
			]
		})]
	}) });
}
//#endregion
//#region resources/js/Pages/admin/roles/RoleList.jsx
var RoleList_exports = /* @__PURE__ */ __exportAll({ default: () => RoleList });
function RoleList({ roles = [] }) {
	const handleDelete = (role) => {
		if (confirm(`Are you sure you want to delete role "${role.name}"?`)) router.delete(`/admin/roles/${role.id}`);
	};
	const getRoleMeta = (name) => {
		switch (name) {
			case "super_admin": return {
				title: "Super Administrator",
				desc: "Unrestricted master access across all formulations, team members, and configuration modules.",
				icon: ShieldCheck,
				iconBg: "bg-purple-50 text-purple-700"
			};
			case "manager": return {
				title: "Area / Regulatory Manager",
				desc: "Oversees product catalogs, categories, batch status, settings, and daily doctor interaction reports.",
				icon: Users,
				iconBg: "bg-blue-50 text-blue-700"
			};
			case "mr": return {
				title: "Medical Representative (MR)",
				desc: "Field operations specialist with direct access to drug catalogs, sample allocations, and DCR submissions.",
				icon: Briefcase,
				iconBg: "bg-teal-50 text-teal-700"
			};
			default: return {
				title: name.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase()),
				desc: "Custom access level configured with designated module permissions.",
				icon: Shield,
				iconBg: "bg-slate-100 text-slate-700"
			};
		}
	};
	return /* @__PURE__ */ jsx(AdminLayout, { children: /* @__PURE__ */ jsxs("div", {
		className: "space-y-5 pb-8",
		children: [/* @__PURE__ */ jsxs("div", {
			className: "flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white rounded-xl border border-slate-200/80 p-4 sm:p-5 shadow-[0_1px_3px_rgba(0,0,0,0.04)]",
			children: [/* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("p", {
				className: "text-xs sm:text-sm text-slate-500 font-medium",
				children: "Configure system roles, access privileges, and module permission policies."
			}), /* @__PURE__ */ jsx("div", {
				className: "flex items-center gap-2 mt-1",
				children: /* @__PURE__ */ jsxs("span", {
					className: "inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-slate-100 text-slate-600",
					children: [roles.length, " Access Roles"]
				})
			})] }), /* @__PURE__ */ jsxs(Link, {
				href: "/admin/roles/create",
				className: "inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-teal-700 hover:bg-teal-800 text-white text-xs font-semibold transition-colors shadow-sm shrink-0 self-start sm:self-auto cursor-pointer",
				children: [/* @__PURE__ */ jsx(Plus, { className: "w-4 h-4 stroke-[2.2]" }), /* @__PURE__ */ jsx("span", { children: "Create New Role" })]
			})]
		}), /* @__PURE__ */ jsx("div", {
			className: "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5",
			children: roles.map((role) => {
				const isProtected = role.name === "super_admin";
				const meta = getRoleMeta(role.name);
				const RoleIcon = meta.icon;
				return /* @__PURE__ */ jsxs("div", {
					className: "bg-white rounded-xl border border-slate-200/80 p-5 shadow-[0_1px_3px_rgba(0,0,0,0.04)] hover:shadow-sm hover:border-teal-300 transition-all flex flex-col justify-between",
					children: [/* @__PURE__ */ jsxs("div", { children: [
						/* @__PURE__ */ jsxs("div", {
							className: "flex items-center justify-between mb-3",
							children: [/* @__PURE__ */ jsx("span", {
								className: `w-9 h-9 rounded-xl flex items-center justify-center ${meta.iconBg}`,
								children: /* @__PURE__ */ jsx(RoleIcon, { className: "w-5 h-5" })
							}), /* @__PURE__ */ jsxs("span", {
								className: "text-[11px] font-semibold px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-600",
								children: [role.permissions_count || 0, " Permissions"]
							})]
						}),
						/* @__PURE__ */ jsx("h3", {
							className: "text-base font-bold text-slate-900 tracking-tight",
							children: meta.title
						}),
						/* @__PURE__ */ jsx("span", {
							className: "text-[11px] text-slate-400 font-mono block mt-0.5",
							children: role.name
						}),
						/* @__PURE__ */ jsx("p", {
							className: "text-xs text-slate-500 mt-2 leading-relaxed",
							children: meta.desc
						}),
						/* @__PURE__ */ jsxs("div", {
							className: "mt-4 pt-3 border-t border-slate-100 flex items-center gap-2 text-xs text-slate-600",
							children: [/* @__PURE__ */ jsx(Users, { className: "w-3.5 h-3.5 text-slate-400" }), /* @__PURE__ */ jsxs("span", { children: [/* @__PURE__ */ jsx("strong", { children: role.users_count || 0 }), " assigned team members"] })]
						})
					] }), /* @__PURE__ */ jsx("div", {
						className: "mt-5 pt-3 border-t border-slate-100 flex items-center justify-between",
						children: isProtected ? /* @__PURE__ */ jsxs("span", {
							className: "inline-flex items-center gap-1.5 text-[11px] text-purple-700 font-semibold bg-purple-50 px-2.5 py-1 rounded-full",
							children: [/* @__PURE__ */ jsx(Lock, { className: "w-3 h-3" }), /* @__PURE__ */ jsx("span", { children: "System Protected Role" })]
						}) : /* @__PURE__ */ jsxs("div", {
							className: "flex items-center justify-between w-full",
							children: [/* @__PURE__ */ jsxs(Link, {
								href: `/admin/roles/${role.id}/edit`,
								className: "inline-flex items-center gap-1.5 text-xs font-semibold text-teal-700 hover:text-teal-800 hover:bg-teal-50 px-2.5 py-1.5 rounded-lg transition-colors cursor-pointer",
								children: [/* @__PURE__ */ jsx(Edit2, { className: "w-3.5 h-3.5" }), /* @__PURE__ */ jsx("span", { children: "Edit Permissions" })]
							}), /* @__PURE__ */ jsx("button", {
								type: "button",
								onClick: () => handleDelete(role),
								className: "p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer",
								title: "Delete Role",
								"aria-label": "Delete Role",
								children: /* @__PURE__ */ jsx(Trash2, { className: "w-3.5 h-3.5" })
							})]
						})
					})]
				}, role.id);
			})
		})]
	}) });
}
//#endregion
//#region resources/js/Pages/admin/settings/Settings.jsx
var Settings_exports = /* @__PURE__ */ __exportAll({ default: () => Settings$1 });
function Settings$1({ grouped = {}, settings: initialSettings = {} }) {
	const [activeTab, setActiveTab] = useState("all");
	const [isSaving, setIsSaving] = useState(false);
	const [hasChanges, setHasChanges] = useState(false);
	const [settings, setSettings] = useState({
		company_name: initialSettings.company_name || "",
		legal_name: initialSettings.legal_name || "",
		tagline: initialSettings.tagline || "",
		description: initialSettings.description || "",
		founded_year: initialSettings.founded_year || "",
		logo_url: initialSettings.logo_url || "",
		drug_license_no: initialSettings.drug_license_no || "",
		gst_tax_id: initialSettings.gst_tax_id || "",
		who_gmp_certified: Boolean(initialSettings.who_gmp_certified),
		iso_certification: initialSettings.iso_certification || "",
		company_email: initialSettings.company_email || "",
		enquiries_email: initialSettings.enquiries_email || "",
		company_phone: initialSettings.company_phone || "",
		whatsapp_number: initialSettings.whatsapp_number || "",
		business_hours: initialSettings.business_hours || "",
		headquarters_address: initialSettings.headquarters_address || "",
		city: initialSettings.city || "",
		state: initialSettings.state || "",
		postal_code: initialSettings.postal_code || "",
		country: initialSettings.country || "",
		manufacturing_unit_address: initialSettings.manufacturing_unit_address || "",
		website_url: initialSettings.website_url || "",
		linkedin_url: initialSettings.linkedin_url || "",
		twitter_url: initialSettings.twitter_url || "",
		mapbox_token: initialSettings.mapbox_token || "",
		mapbox_style: initialSettings.mapbox_style || "mapbox://styles/mapbox/streets-v12",
		mapbox_default_lat: initialSettings.mapbox_default_lat || "8.1833",
		mapbox_default_lng: initialSettings.mapbox_default_lng || "77.4119",
		mapbox_default_zoom: initialSettings.mapbox_default_zoom || "13",
		mapbox_tracking_interval: initialSettings.mapbox_tracking_interval || "30",
		...initialSettings,
		who_gmp_certified: Boolean(initialSettings.who_gmp_certified)
	});
	const [logoFile, setLogoFile] = useState(null);
	const [logoPreview, setLogoPreview] = useState(null);
	const handleChange = (key, value) => {
		setSettings((prev) => ({
			...prev,
			[key]: value
		}));
		setHasChanges(true);
	};
	const handleLogoChange = (e) => {
		const file = e.target.files?.[0];
		if (!file) return;
		if (file.size > 5242880) {
			toast.error("Logo file size must be under 5MB.");
			return;
		}
		setLogoFile(file);
		setLogoPreview(URL.createObjectURL(file));
		setHasChanges(true);
	};
	const removeLogoFile = () => {
		if (logoPreview) URL.revokeObjectURL(logoPreview);
		setLogoFile(null);
		setLogoPreview(null);
	};
	const handleSubmit = (e) => {
		e?.preventDefault();
		setIsSaving(true);
		const formData = new FormData();
		formData.append("settings", JSON.stringify(settings));
		if (logoFile) formData.append("logo", logoFile);
		router.post("/admin/settings", formData, {
			onSuccess: () => {
				removeLogoFile();
				setHasChanges(false);
				setIsSaving(false);
			},
			onError: () => {
				setIsSaving(false);
			},
			onFinish: () => {
				setIsSaving(false);
			}
		});
	};
	return /* @__PURE__ */ jsx(AdminLayout, { children: /* @__PURE__ */ jsxs("div", {
		className: "max-w-6xl mx-auto space-y-6 pb-16",
		children: [
			/* @__PURE__ */ jsxs("div", {
				className: "flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-4",
				children: [/* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("h2", {
					className: "text-lg font-bold text-slate-900 tracking-tight",
					children: "Business Profile & Settings"
				}), /* @__PURE__ */ jsx("p", {
					className: "text-xs text-slate-500",
					children: "Configure your pharmaceutical enterprise information, compliance details, and contact points."
				})] }), /* @__PURE__ */ jsx("button", {
					type: "button",
					onClick: handleSubmit,
					disabled: isSaving || !hasChanges,
					className: `inline-flex items-center gap-2 px-5 py-2 rounded-lg text-xs font-semibold text-white transition-all shadow-xs cursor-pointer ${hasChanges ? "bg-teal-600 hover:bg-teal-700" : "bg-slate-400 opacity-60 cursor-not-allowed"}`,
					children: isSaving ? /* @__PURE__ */ jsxs(Fragment, { children: [/* @__PURE__ */ jsx(Loader2, { className: "w-3.5 h-3.5 animate-spin" }), /* @__PURE__ */ jsx("span", { children: "Saving Changes..." })] }) : /* @__PURE__ */ jsxs(Fragment, { children: [/* @__PURE__ */ jsx(Save, { className: "w-3.5 h-3.5" }), /* @__PURE__ */ jsx("span", { children: hasChanges ? "Save Changes" : "All Changes Saved" })] })
				})]
			}),
			/* @__PURE__ */ jsx("div", {
				className: "flex items-center gap-1.5 overflow-x-auto pb-1 text-xs",
				children: [
					{
						id: "all",
						label: "All Settings",
						icon: FileText
					},
					{
						id: "general",
						label: "General & Identity",
						icon: Building2
					},
					{
						id: "regulatory",
						label: "Regulatory & Compliance",
						icon: ShieldCheck
					},
					{
						id: "contact",
						label: "Contact & Hours",
						icon: PhoneCall
					},
					{
						id: "location",
						label: "Locations & Plants",
						icon: MapPin
					},
					{
						id: "social",
						label: "Web & Social",
						icon: Globe
					},
					{
						id: "mapbox",
						label: "Mapbox SDK & Field Map",
						icon: Navigation
					}
				].map((tab) => {
					const Icon = tab.icon;
					const isActive = activeTab === tab.id;
					return /* @__PURE__ */ jsxs("button", {
						type: "button",
						onClick: () => setActiveTab(tab.id),
						className: `inline-flex items-center gap-2 px-3.5 py-2 rounded-lg font-medium transition-colors shrink-0 cursor-pointer ${isActive ? "bg-teal-50 text-teal-700 border border-teal-200 font-semibold" : "text-slate-600 hover:text-slate-900 hover:bg-slate-100 border border-transparent"}`,
						children: [/* @__PURE__ */ jsx(Icon, { className: "w-3.5 h-3.5" }), /* @__PURE__ */ jsx("span", { children: tab.label })]
					}, tab.id);
				})
			}),
			/* @__PURE__ */ jsxs("form", {
				onSubmit: handleSubmit,
				className: "space-y-6",
				children: [
					(activeTab === "all" || activeTab === "general") && /* @__PURE__ */ jsxs("div", {
						className: "bg-white rounded-xl border border-slate-200 p-6 sm:p-7 space-y-6",
						children: [/* @__PURE__ */ jsxs("div", {
							className: "flex items-center gap-2.5 pb-3 border-b border-slate-100",
							children: [/* @__PURE__ */ jsx("div", {
								className: "w-8 h-8 rounded-lg bg-teal-50 text-teal-700 flex items-center justify-center font-bold text-xs",
								children: /* @__PURE__ */ jsx(Building2, { className: "w-4 h-4" })
							}), /* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("h3", {
								className: "text-sm font-bold text-slate-900",
								children: "General & Corporate Identity"
							}), /* @__PURE__ */ jsx("p", {
								className: "text-xs text-slate-500",
								children: "Legal entity name, public trade name, and corporate branding."
							})] })]
						}), /* @__PURE__ */ jsxs("div", {
							className: "grid grid-cols-1 md:grid-cols-2 gap-5",
							children: [
								/* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsxs("label", {
									className: "block text-xs font-semibold text-slate-700 mb-1.5",
									children: ["Brand / Trade Name ", /* @__PURE__ */ jsx("span", {
										className: "text-rose-500",
										children: "*"
									})]
								}), /* @__PURE__ */ jsx("input", {
									type: "text",
									value: settings.company_name,
									onChange: (e) => handleChange("company_name", e.target.value),
									placeholder: "e.g. Ciplon Life Sciences",
									className: "w-full px-3.5 py-2 bg-slate-50/50 border border-slate-200 rounded-lg text-xs text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 transition-all"
								})] }),
								/* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsxs("label", {
									className: "block text-xs font-semibold text-slate-700 mb-1.5",
									children: ["Full Registered Legal Entity Name ", /* @__PURE__ */ jsx("span", {
										className: "text-rose-500",
										children: "*"
									})]
								}), /* @__PURE__ */ jsx("input", {
									type: "text",
									value: settings.legal_name,
									onChange: (e) => handleChange("legal_name", e.target.value),
									placeholder: "e.g. Ciplon Pharmaceuticals Ltd.",
									className: "w-full px-3.5 py-2 bg-slate-50/50 border border-slate-200 rounded-lg text-xs text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 transition-all"
								})] }),
								/* @__PURE__ */ jsxs("div", {
									className: "md:col-span-2",
									children: [/* @__PURE__ */ jsx("label", {
										className: "block text-xs font-semibold text-slate-700 mb-1.5",
										children: "Corporate Tagline / Mission Statement"
									}), /* @__PURE__ */ jsx("input", {
										type: "text",
										value: settings.tagline,
										onChange: (e) => handleChange("tagline", e.target.value),
										placeholder: "e.g. Advancing Global Healthcare Through Scientific Precision & Quality",
										className: "w-full px-3.5 py-2 bg-slate-50/50 border border-slate-200 rounded-lg text-xs text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 transition-all"
									})]
								}),
								/* @__PURE__ */ jsxs("div", {
									className: "md:col-span-2",
									children: [/* @__PURE__ */ jsx("label", {
										className: "block text-xs font-semibold text-slate-700 mb-1.5",
										children: "Detailed Company Overview"
									}), /* @__PURE__ */ jsx("textarea", {
										rows: 3,
										value: settings.description,
										onChange: (e) => handleChange("description", e.target.value),
										placeholder: "Provide a comprehensive profile of your pharmaceutical manufacturing and R&D activities...",
										className: "w-full px-3.5 py-2 bg-slate-50/50 border border-slate-200 rounded-lg text-xs text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 transition-all resize-y"
									})]
								}),
								/* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("label", {
									className: "block text-xs font-semibold text-slate-700 mb-1.5",
									children: "Year Established"
								}), /* @__PURE__ */ jsx("input", {
									type: "text",
									value: settings.founded_year,
									onChange: (e) => handleChange("founded_year", e.target.value),
									placeholder: "e.g. 2004",
									className: "w-full px-3.5 py-2 bg-slate-50/50 border border-slate-200 rounded-lg text-xs text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 transition-all"
								})] }),
								/* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("label", {
									className: "block text-xs font-semibold text-slate-700 mb-1.5",
									children: "Official Corporate Logo"
								}), /* @__PURE__ */ jsxs("div", {
									className: "flex items-center gap-4",
									children: [
										/* @__PURE__ */ jsx("div", {
											className: "w-14 h-14 rounded-lg border border-slate-200 bg-slate-50 flex items-center justify-center overflow-hidden shrink-0",
											children: logoPreview || settings.logo_url ? /* @__PURE__ */ jsx("img", {
												src: logoPreview || settings.logo_url,
												alt: "Logo",
												className: "w-full h-full object-contain p-1",
												onError: (e) => {
													e.currentTarget.style.display = "none";
												}
											}) : /* @__PURE__ */ jsx(ImageIcon, { className: "w-6 h-6 text-slate-300" })
										}),
										/* @__PURE__ */ jsxs("div", {
											className: "flex-1 space-y-1",
											children: [
												/* @__PURE__ */ jsx("input", {
													type: "file",
													id: "business-logo-input",
													accept: "image/png,image/jpeg,image/svg+xml,image/webp",
													onChange: handleLogoChange,
													className: "hidden"
												}),
												/* @__PURE__ */ jsxs("label", {
													htmlFor: "business-logo-input",
													className: "inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 text-xs font-semibold text-slate-700 cursor-pointer transition-colors",
													children: [/* @__PURE__ */ jsx(Upload, { className: "w-3.5 h-3.5" }), /* @__PURE__ */ jsx("span", { children: settings.logo_url || logoPreview ? "Change Logo" : "Upload Logo" })]
												}),
												/* @__PURE__ */ jsx("p", {
													className: "text-[11px] text-slate-400",
													children: "PNG, SVG or WEBP with transparent background recommended."
												})
											]
										}),
										logoPreview && /* @__PURE__ */ jsx("button", {
											type: "button",
											onClick: removeLogoFile,
											className: "p-1.5 rounded-lg text-rose-600 hover:bg-rose-50 border border-rose-200 cursor-pointer",
											title: "Clear selection",
											children: /* @__PURE__ */ jsx(X, { className: "w-3.5 h-3.5" })
										})
									]
								})] })
							]
						})]
					}),
					(activeTab === "all" || activeTab === "regulatory") && /* @__PURE__ */ jsxs("div", {
						className: "bg-white rounded-xl border border-slate-200 p-6 sm:p-7 space-y-6",
						children: [/* @__PURE__ */ jsxs("div", {
							className: "flex items-center gap-2.5 pb-3 border-b border-slate-100",
							children: [/* @__PURE__ */ jsx("div", {
								className: "w-8 h-8 rounded-lg bg-teal-50 text-teal-700 flex items-center justify-center font-bold text-xs",
								children: /* @__PURE__ */ jsx(ShieldCheck, { className: "w-4 h-4" })
							}), /* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("h3", {
								className: "text-sm font-bold text-slate-900",
								children: "Regulatory, Licensing & Quality Compliance"
							}), /* @__PURE__ */ jsx("p", {
								className: "text-xs text-slate-500",
								children: "Official pharmaceutical licenses, statutory numbers, and quality accreditations."
							})] })]
						}), /* @__PURE__ */ jsxs("div", {
							className: "grid grid-cols-1 md:grid-cols-2 gap-5",
							children: [
								/* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("label", {
									className: "block text-xs font-semibold text-slate-700 mb-1.5",
									children: "Drug Manufacturing / Wholesale License Number"
								}), /* @__PURE__ */ jsx("input", {
									type: "text",
									value: settings.drug_license_no,
									onChange: (e) => handleChange("drug_license_no", e.target.value),
									placeholder: "e.g. DL-2024-MH-BIO891",
									className: "w-full px-3.5 py-2 bg-slate-50/50 border border-slate-200 rounded-lg text-xs font-mono text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 transition-all"
								})] }),
								/* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("label", {
									className: "block text-xs font-semibold text-slate-700 mb-1.5",
									children: "GST / Corporate Tax Identification Number"
								}), /* @__PURE__ */ jsx("input", {
									type: "text",
									value: settings.gst_tax_id,
									onChange: (e) => handleChange("gst_tax_id", e.target.value),
									placeholder: "e.g. 27AABCA1234D1Z5",
									className: "w-full px-3.5 py-2 bg-slate-50/50 border border-slate-200 rounded-lg text-xs font-mono text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 transition-all"
								})] }),
								/* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("label", {
									className: "block text-xs font-semibold text-slate-700 mb-1.5",
									children: "Quality Management & ISO Certifications"
								}), /* @__PURE__ */ jsx("input", {
									type: "text",
									value: settings.iso_certification,
									onChange: (e) => handleChange("iso_certification", e.target.value),
									placeholder: "e.g. ISO 9001:2015 & ISO 14001:2015 Certified",
									className: "w-full px-3.5 py-2 bg-slate-50/50 border border-slate-200 rounded-lg text-xs text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 transition-all"
								})] }),
								/* @__PURE__ */ jsxs("div", {
									className: "flex items-center gap-3 pt-6",
									children: [/* @__PURE__ */ jsx("input", {
										type: "checkbox",
										id: "who-gmp-checkbox",
										checked: settings.who_gmp_certified,
										onChange: (e) => handleChange("who_gmp_certified", e.target.checked),
										className: "w-4 h-4 rounded text-teal-600 focus:ring-teal-500 border-slate-300 cursor-pointer"
									}), /* @__PURE__ */ jsxs("label", {
										htmlFor: "who-gmp-checkbox",
										className: "text-xs font-medium text-slate-800 cursor-pointer select-none",
										children: ["WHO-GMP Certified Facility Status", /* @__PURE__ */ jsx("span", {
											className: "block text-[11px] text-slate-400 font-normal",
											children: "Check if formulation manufacturing adheres to World Health Organization GMP guidelines."
										})]
									})]
								})
							]
						})]
					}),
					(activeTab === "all" || activeTab === "contact") && /* @__PURE__ */ jsxs("div", {
						className: "bg-white rounded-xl border border-slate-200 p-6 sm:p-7 space-y-6",
						children: [/* @__PURE__ */ jsxs("div", {
							className: "flex items-center gap-2.5 pb-3 border-b border-slate-100",
							children: [/* @__PURE__ */ jsx("div", {
								className: "w-8 h-8 rounded-lg bg-teal-50 text-teal-700 flex items-center justify-center font-bold text-xs",
								children: /* @__PURE__ */ jsx(PhoneCall, { className: "w-4 h-4" })
							}), /* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("h3", {
								className: "text-sm font-bold text-slate-900",
								children: "Communication & Operating Hours"
							}), /* @__PURE__ */ jsx("p", {
								className: "text-xs text-slate-500",
								children: "Public emails, customer helpline, and administrative availability."
							})] })]
						}), /* @__PURE__ */ jsxs("div", {
							className: "grid grid-cols-1 md:grid-cols-2 gap-5",
							children: [
								/* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("label", {
									className: "block text-xs font-semibold text-slate-700 mb-1.5",
									children: "Primary Corporate Email"
								}), /* @__PURE__ */ jsx("input", {
									type: "email",
									value: settings.company_email,
									onChange: (e) => handleChange("company_email", e.target.value),
									placeholder: "corporate@ciplon.com",
									className: "w-full px-3.5 py-2 bg-slate-50/50 border border-slate-200 rounded-lg text-xs text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 transition-all"
								})] }),
								/* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("label", {
									className: "block text-xs font-semibold text-slate-700 mb-1.5",
									children: "Commercial / Product Enquiries Email"
								}), /* @__PURE__ */ jsx("input", {
									type: "email",
									value: settings.enquiries_email,
									onChange: (e) => handleChange("enquiries_email", e.target.value),
									placeholder: "enquiry@ciplon.com",
									className: "w-full px-3.5 py-2 bg-slate-50/50 border border-slate-200 rounded-lg text-xs text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 transition-all"
								})] }),
								/* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("label", {
									className: "block text-xs font-semibold text-slate-700 mb-1.5",
									children: "Official Phone / Toll-free Number"
								}), /* @__PURE__ */ jsx("input", {
									type: "text",
									value: settings.company_phone,
									onChange: (e) => handleChange("company_phone", e.target.value),
									placeholder: "+1 (800) 458-7290",
									className: "w-full px-3.5 py-2 bg-slate-50/50 border border-slate-200 rounded-lg text-xs text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 transition-all"
								})] }),
								/* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("label", {
									className: "block text-xs font-semibold text-slate-700 mb-1.5",
									children: "WhatsApp Business Communication"
								}), /* @__PURE__ */ jsx("input", {
									type: "text",
									value: settings.whatsapp_number,
									onChange: (e) => handleChange("whatsapp_number", e.target.value),
									placeholder: "+1 (800) 458-7291",
									className: "w-full px-3.5 py-2 bg-slate-50/50 border border-slate-200 rounded-lg text-xs text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 transition-all"
								})] }),
								/* @__PURE__ */ jsxs("div", {
									className: "md:col-span-2",
									children: [/* @__PURE__ */ jsx("label", {
										className: "block text-xs font-semibold text-slate-700 mb-1.5",
										children: "Business & Dispatch Operating Hours"
									}), /* @__PURE__ */ jsx("input", {
										type: "text",
										value: settings.business_hours,
										onChange: (e) => handleChange("business_hours", e.target.value),
										placeholder: "e.g. Monday - Friday: 09:00 - 18:00 (EST)",
										className: "w-full px-3.5 py-2 bg-slate-50/50 border border-slate-200 rounded-lg text-xs text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 transition-all"
									})]
								})
							]
						})]
					}),
					(activeTab === "all" || activeTab === "location") && /* @__PURE__ */ jsxs("div", {
						className: "bg-white rounded-xl border border-slate-200 p-6 sm:p-7 space-y-6",
						children: [/* @__PURE__ */ jsxs("div", {
							className: "flex items-center gap-2.5 pb-3 border-b border-slate-100",
							children: [/* @__PURE__ */ jsx("div", {
								className: "w-8 h-8 rounded-lg bg-teal-50 text-teal-700 flex items-center justify-center font-bold text-xs",
								children: /* @__PURE__ */ jsx(MapPin, { className: "w-4 h-4" })
							}), /* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("h3", {
								className: "text-sm font-bold text-slate-900",
								children: "Headquarters & Manufacturing Facilities"
							}), /* @__PURE__ */ jsx("p", {
								className: "text-xs text-slate-500",
								children: "Registered commercial office and pharmaceutical formulation manufacturing sites."
							})] })]
						}), /* @__PURE__ */ jsxs("div", {
							className: "grid grid-cols-1 md:grid-cols-2 gap-5",
							children: [
								/* @__PURE__ */ jsxs("div", {
									className: "md:col-span-2",
									children: [/* @__PURE__ */ jsx("label", {
										className: "block text-xs font-semibold text-slate-700 mb-1.5",
										children: "Corporate Headquarters Street Address"
									}), /* @__PURE__ */ jsx("input", {
										type: "text",
										value: settings.headquarters_address,
										onChange: (e) => handleChange("headquarters_address", e.target.value),
										placeholder: "e.g. Innovation Park, Sector 62, Bio-Tech Corridor",
										className: "w-full px-3.5 py-2 bg-slate-50/50 border border-slate-200 rounded-lg text-xs text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 transition-all"
									})]
								}),
								/* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("label", {
									className: "block text-xs font-semibold text-slate-700 mb-1.5",
									children: "City"
								}), /* @__PURE__ */ jsx("input", {
									type: "text",
									value: settings.city,
									onChange: (e) => handleChange("city", e.target.value),
									placeholder: "e.g. Boston",
									className: "w-full px-3.5 py-2 bg-slate-50/50 border border-slate-200 rounded-lg text-xs text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 transition-all"
								})] }),
								/* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("label", {
									className: "block text-xs font-semibold text-slate-700 mb-1.5",
									children: "State / Province"
								}), /* @__PURE__ */ jsx("input", {
									type: "text",
									value: settings.state,
									onChange: (e) => handleChange("state", e.target.value),
									placeholder: "e.g. Massachusetts",
									className: "w-full px-3.5 py-2 bg-slate-50/50 border border-slate-200 rounded-lg text-xs text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 transition-all"
								})] }),
								/* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("label", {
									className: "block text-xs font-semibold text-slate-700 mb-1.5",
									children: "Postal / ZIP Code"
								}), /* @__PURE__ */ jsx("input", {
									type: "text",
									value: settings.postal_code,
									onChange: (e) => handleChange("postal_code", e.target.value),
									placeholder: "e.g. 02115",
									className: "w-full px-3.5 py-2 bg-slate-50/50 border border-slate-200 rounded-lg text-xs font-mono text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 transition-all"
								})] }),
								/* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("label", {
									className: "block text-xs font-semibold text-slate-700 mb-1.5",
									children: "Country"
								}), /* @__PURE__ */ jsx("input", {
									type: "text",
									value: settings.country,
									onChange: (e) => handleChange("country", e.target.value),
									placeholder: "e.g. United States",
									className: "w-full px-3.5 py-2 bg-slate-50/50 border border-slate-200 rounded-lg text-xs text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 transition-all"
								})] }),
								/* @__PURE__ */ jsxs("div", {
									className: "md:col-span-2",
									children: [/* @__PURE__ */ jsx("label", {
										className: "block text-xs font-semibold text-slate-700 mb-1.5",
										children: "Formulation Plant & Manufacturing Site Address"
									}), /* @__PURE__ */ jsx("input", {
										type: "text",
										value: settings.manufacturing_unit_address,
										onChange: (e) => handleChange("manufacturing_unit_address", e.target.value),
										placeholder: "e.g. Ciplon Formulation Plant 1, Pharma SEZ, Industrial Zone",
										className: "w-full px-3.5 py-2 bg-slate-50/50 border border-slate-200 rounded-lg text-xs text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 transition-all"
									})]
								})
							]
						})]
					}),
					(activeTab === "all" || activeTab === "social") && /* @__PURE__ */ jsxs("div", {
						className: "bg-white rounded-xl border border-slate-200 p-6 sm:p-7 space-y-6",
						children: [/* @__PURE__ */ jsxs("div", {
							className: "flex items-center gap-2.5 pb-3 border-b border-slate-100",
							children: [/* @__PURE__ */ jsx("div", {
								className: "w-8 h-8 rounded-lg bg-teal-50 text-teal-700 flex items-center justify-center font-bold text-xs",
								children: /* @__PURE__ */ jsx(Globe, { className: "w-4 h-4" })
							}), /* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("h3", {
								className: "text-sm font-bold text-slate-900",
								children: "Web Presence & Social Channels"
							}), /* @__PURE__ */ jsx("p", {
								className: "text-xs text-slate-500",
								children: "Corporate portal and professional institutional network links."
							})] })]
						}), /* @__PURE__ */ jsxs("div", {
							className: "grid grid-cols-1 md:grid-cols-2 gap-5",
							children: [
								/* @__PURE__ */ jsxs("div", {
									className: "md:col-span-2",
									children: [/* @__PURE__ */ jsx("label", {
										className: "block text-xs font-semibold text-slate-700 mb-1.5",
										children: "Official Website URL"
									}), /* @__PURE__ */ jsx("input", {
										type: "url",
										value: settings.website_url,
										onChange: (e) => handleChange("website_url", e.target.value),
										placeholder: "https://ciplon.com",
										className: "w-full px-3.5 py-2 bg-slate-50/50 border border-slate-200 rounded-lg text-xs text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 transition-all"
									})]
								}),
								/* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("label", {
									className: "block text-xs font-semibold text-slate-700 mb-1.5",
									children: "LinkedIn Organization Profile"
								}), /* @__PURE__ */ jsx("input", {
									type: "url",
									value: settings.linkedin_url,
									onChange: (e) => handleChange("linkedin_url", e.target.value),
									placeholder: "https://linkedin.com/company/ciplon",
									className: "w-full px-3.5 py-2 bg-slate-50/50 border border-slate-200 rounded-lg text-xs text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 transition-all"
								})] }),
								/* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("label", {
									className: "block text-xs font-semibold text-slate-700 mb-1.5",
									children: "Twitter / X Profile"
								}), /* @__PURE__ */ jsx("input", {
									type: "url",
									value: settings.twitter_url,
									onChange: (e) => handleChange("twitter_url", e.target.value),
									placeholder: "https://x.com/ciplon_pharma",
									className: "w-full px-3.5 py-2 bg-slate-50/50 border border-slate-200 rounded-lg text-xs text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 transition-all"
								})] })
							]
						})]
					}),
					(activeTab === "all" || activeTab === "mapbox") && /* @__PURE__ */ jsxs("div", {
						className: "bg-white rounded-xl border border-slate-200 p-6 sm:p-7 space-y-6",
						children: [
							/* @__PURE__ */ jsxs("div", {
								className: "flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100",
								children: [/* @__PURE__ */ jsxs("div", {
									className: "flex items-center gap-2.5",
									children: [/* @__PURE__ */ jsx("div", {
										className: "w-8 h-8 rounded-lg bg-indigo-50 text-indigo-700 flex items-center justify-center font-bold text-xs",
										children: /* @__PURE__ */ jsx(Navigation, { className: "w-4 h-4" })
									}), /* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("h3", {
										className: "text-sm font-bold text-slate-900",
										children: "Mapbox SDK & Field Map Configuration"
									}), /* @__PURE__ */ jsx("p", {
										className: "text-xs text-slate-500",
										children: "Configure Mapbox GL vector mapping engine for MR live tracking & route animation."
									})] })]
								}), /* @__PURE__ */ jsx("div", {
									className: "flex items-center gap-2",
									children: settings.mapbox_token ? /* @__PURE__ */ jsxs("span", {
										className: "inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-medium bg-emerald-50 text-emerald-700 border border-emerald-200/60",
										children: [/* @__PURE__ */ jsx(CheckCircle2, { className: "w-3.5 h-3.5" }), "Mapbox Token Configured"]
									}) : /* @__PURE__ */ jsx("span", {
										className: "inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-medium bg-amber-50 text-amber-700 border border-amber-200/60",
										children: "Standard Mapbox Vector Tiles Active"
									})
								})]
							}),
							/* @__PURE__ */ jsxs("div", {
								className: "bg-slate-50/60 border border-slate-200/70 rounded-lg p-3.5 text-xs text-slate-600 space-y-1",
								children: [/* @__PURE__ */ jsx("p", {
									className: "font-semibold text-slate-800",
									children: "💡 Mapbox Integration Instructions"
								}), /* @__PURE__ */ jsxs("p", { children: [
									"The Doctor Movement Map and MR live GPS locator uses Mapbox GL SDK. Enter your Mapbox Public Token (starts with ",
									/* @__PURE__ */ jsx("code", {
										className: "text-indigo-600 bg-white px-1 py-0.5 rounded border border-slate-200",
										children: "pk.eyJ1..."
									}),
									") below. If left empty, high-definition street tiles and route vectors remain fully functional."
								] })]
							}),
							/* @__PURE__ */ jsxs("div", {
								className: "grid grid-cols-1 md:grid-cols-2 gap-5",
								children: [
									/* @__PURE__ */ jsxs("div", {
										className: "md:col-span-2",
										children: [
											/* @__PURE__ */ jsx("label", {
												className: "block text-xs font-semibold text-slate-700 mb-1.5",
												children: "Mapbox Public Access Token (SDK Key)"
											}),
											/* @__PURE__ */ jsxs("div", {
												className: "relative",
												children: [/* @__PURE__ */ jsx("div", {
													className: "absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400",
													children: /* @__PURE__ */ jsx(Key, { className: "w-3.5 h-3.5" })
												}), /* @__PURE__ */ jsx("input", {
													type: "text",
													value: settings.mapbox_token,
													onChange: (e) => handleChange("mapbox_token", e.target.value),
													placeholder: "pk.eyJ1IjoieW91ci11c2VybmFtZSIsImEiOiJjb...",
													className: "w-full pl-9 pr-3.5 py-2 bg-slate-50/50 border border-slate-200 rounded-lg text-xs font-mono text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
												})]
											}),
											/* @__PURE__ */ jsxs("p", {
												className: "mt-1 text-[11px] text-slate-400",
												children: [
													"You can get your free token from ",
													/* @__PURE__ */ jsx("a", {
														href: "https://account.mapbox.com/access-tokens/",
														target: "_blank",
														rel: "noreferrer",
														className: "text-indigo-600 hover:underline",
														children: "mapbox.com/account/access-tokens"
													}),
													"."
												]
											})
										]
									}),
									/* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("label", {
										className: "block text-xs font-semibold text-slate-700 mb-1.5",
										children: "Default Map Style"
									}), /* @__PURE__ */ jsxs("div", {
										className: "relative",
										children: [/* @__PURE__ */ jsx("div", {
											className: "absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400",
											children: /* @__PURE__ */ jsx(Layers, { className: "w-3.5 h-3.5" })
										}), /* @__PURE__ */ jsxs("select", {
											value: settings.mapbox_style,
											onChange: (e) => handleChange("mapbox_style", e.target.value),
											className: "w-full pl-9 pr-3.5 py-2 bg-slate-50/50 border border-slate-200 rounded-lg text-xs text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all cursor-pointer",
											children: [
												/* @__PURE__ */ jsx("option", {
													value: "mapbox://styles/mapbox/streets-v12",
													children: "Mapbox Streets (Recommended)"
												}),
												/* @__PURE__ */ jsx("option", {
													value: "mapbox://styles/mapbox/navigation-day-v1",
													children: "Mapbox Navigation Day"
												}),
												/* @__PURE__ */ jsx("option", {
													value: "mapbox://styles/mapbox/light-v11",
													children: "Mapbox Light Clean"
												}),
												/* @__PURE__ */ jsx("option", {
													value: "mapbox://styles/mapbox/outdoors-v12",
													children: "Mapbox Outdoors Topo"
												}),
												/* @__PURE__ */ jsx("option", {
													value: "mapbox://styles/mapbox/dark-v11",
													children: "Mapbox Dark Mode"
												}),
												/* @__PURE__ */ jsx("option", {
													value: "mapbox://styles/mapbox/satellite-streets-v12",
													children: "Mapbox Satellite Hybrid"
												})
											]
										})]
									})] }),
									/* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("label", {
										className: "block text-xs font-semibold text-slate-700 mb-1.5",
										children: "MR Live GPS Broadcast Interval (seconds)"
									}), /* @__PURE__ */ jsx("input", {
										type: "number",
										min: "5",
										max: "300",
										value: settings.mapbox_tracking_interval,
										onChange: (e) => handleChange("mapbox_tracking_interval", e.target.value),
										placeholder: "30",
										className: "w-full px-3.5 py-2 bg-slate-50/50 border border-slate-200 rounded-lg text-xs text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
									})] }),
									/* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsxs("div", {
										className: "flex items-center justify-between mb-1.5",
										children: [/* @__PURE__ */ jsx("label", {
											className: "block text-xs font-semibold text-slate-700",
											children: "Default Center Latitude"
										}), /* @__PURE__ */ jsx("button", {
											type: "button",
											onClick: () => {
												handleChange("mapbox_default_lat", "8.1833");
												handleChange("mapbox_default_lng", "77.4119");
											},
											className: "text-[11px] text-indigo-600 hover:text-indigo-800 font-medium cursor-pointer",
											children: "Preset: Nagercoil (TN)"
										})]
									}), /* @__PURE__ */ jsx("input", {
										type: "text",
										value: settings.mapbox_default_lat,
										onChange: (e) => handleChange("mapbox_default_lat", e.target.value),
										placeholder: "8.1833",
										className: "w-full px-3.5 py-2 bg-slate-50/50 border border-slate-200 rounded-lg text-xs text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
									})] }),
									/* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("label", {
										className: "block text-xs font-semibold text-slate-700 mb-1.5",
										children: "Default Center Longitude"
									}), /* @__PURE__ */ jsx("input", {
										type: "text",
										value: settings.mapbox_default_lng,
										onChange: (e) => handleChange("mapbox_default_lng", e.target.value),
										placeholder: "77.4119",
										className: "w-full px-3.5 py-2 bg-slate-50/50 border border-slate-200 rounded-lg text-xs text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
									})] }),
									/* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("label", {
										className: "block text-xs font-semibold text-slate-700 mb-1.5",
										children: "Default Map Zoom Level (1 - 18)"
									}), /* @__PURE__ */ jsx("input", {
										type: "number",
										min: "1",
										max: "18",
										value: settings.mapbox_default_zoom,
										onChange: (e) => handleChange("mapbox_default_zoom", e.target.value),
										placeholder: "13",
										className: "w-full px-3.5 py-2 bg-slate-50/50 border border-slate-200 rounded-lg text-xs text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
									})] }),
									/* @__PURE__ */ jsx("div", {
										className: "flex items-end",
										children: /* @__PURE__ */ jsxs("a", {
											href: "/admin/tracking",
											className: "w-full inline-flex items-center justify-center gap-2 px-4 py-2 rounded-lg text-xs font-semibold text-indigo-700 bg-indigo-50 hover:bg-indigo-100 border border-indigo-200 transition-colors",
											children: [/* @__PURE__ */ jsx(Crosshair, { className: "w-3.5 h-3.5" }), "Open Live Field Tracking Map"]
										})
									})
								]
							})
						]
					}),
					/* @__PURE__ */ jsxs("div", {
						className: "flex items-center justify-between p-4 bg-white rounded-xl border border-slate-200 shadow-xs",
						children: [/* @__PURE__ */ jsx("div", {
							className: "flex items-center gap-2",
							children: hasChanges ? /* @__PURE__ */ jsxs("span", {
								className: "text-xs font-medium text-amber-600 flex items-center gap-1.5",
								children: [/* @__PURE__ */ jsx("span", { className: "w-2 h-2 rounded-full bg-amber-500 animate-pulse" }), "Unsaved changes"]
							}) : /* @__PURE__ */ jsxs("span", {
								className: "text-xs font-medium text-teal-700 flex items-center gap-1.5",
								children: [/* @__PURE__ */ jsx(CheckCircle2, { className: "w-3.5 h-3.5" }), "Up to date"]
							})
						}), /* @__PURE__ */ jsx("button", {
							type: "submit",
							disabled: isSaving || !hasChanges,
							className: `inline-flex items-center gap-2 px-6 py-2.5 rounded-lg text-xs font-semibold text-white transition-all shadow-xs cursor-pointer ${hasChanges ? "bg-teal-600 hover:bg-teal-700" : "bg-slate-400 opacity-60 cursor-not-allowed"}`,
							children: isSaving ? /* @__PURE__ */ jsxs(Fragment, { children: [/* @__PURE__ */ jsx(Loader2, { className: "w-3.5 h-3.5 animate-spin" }), /* @__PURE__ */ jsx("span", { children: "Saving..." })] }) : /* @__PURE__ */ jsxs(Fragment, { children: [/* @__PURE__ */ jsx(Save, { className: "w-3.5 h-3.5" }), /* @__PURE__ */ jsx("span", { children: "Save All Settings" })] })
						})]
					})
				]
			})
		]
	}) });
}
//#endregion
//#region resources/js/Pages/admin/staff/StaffForm.jsx
var StaffForm_exports = /* @__PURE__ */ __exportAll({ default: () => StaffForm });
var capitalizeWords$1 = (str) => {
	if (!str || typeof str !== "string") return "";
	return str.replace(/\b\w/g, (char) => char.toUpperCase());
};
function StaffForm({ isEdit = false, staff = null, roles = [] }) {
	const { data, setData, post, put, processing, errors } = useForm({
		name: capitalizeWords$1(staff?.name || ""),
		email: staff?.email || "",
		role: staff?.role || "mr",
		password: ""
	});
	const handleNameChange = (e) => {
		setData("name", capitalizeWords$1(e.target.value));
	};
	const handleSubmit = (e) => {
		e.preventDefault();
		if (isEdit) put(`/admin/staff/${staff.id}`);
		else post("/admin/staff");
	};
	return /* @__PURE__ */ jsx(AdminLayout, { children: /* @__PURE__ */ jsx("div", {
		className: "max-w-xl mx-auto pb-10",
		children: /* @__PURE__ */ jsxs("form", {
			onSubmit: handleSubmit,
			className: "bg-white p-6 sm:p-7 rounded-xl border border-slate-200/80 shadow-[0_1px_3px_rgba(0,0,0,0.04)] space-y-5",
			children: [
				/* @__PURE__ */ jsxs("div", { children: [
					/* @__PURE__ */ jsxs("label", {
						className: "block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5 flex items-center justify-between",
						children: [/* @__PURE__ */ jsxs("span", { children: ["Full Name ", /* @__PURE__ */ jsx("span", {
							className: "text-rose-500",
							children: "*"
						})] }), /* @__PURE__ */ jsx("span", {
							className: "text-[10px] text-slate-400 font-normal",
							children: "Capitalized automatically"
						})]
					}),
					/* @__PURE__ */ jsxs("div", {
						className: "relative",
						children: [/* @__PURE__ */ jsx(User, { className: "w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" }), /* @__PURE__ */ jsx("input", {
							type: "text",
							value: data.name,
							onChange: handleNameChange,
							placeholder: "e.g. Dr. Rajesh Sharma",
							className: `w-full pl-9 pr-3.5 py-2.5 bg-slate-50/70 hover:bg-slate-50 focus:bg-white border ${errors.name ? "border-rose-300 focus:border-rose-500" : "border-slate-200 focus:border-teal-600"} rounded-lg text-xs sm:text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-600/10 transition-all capitalize`
						})]
					}),
					errors.name && /* @__PURE__ */ jsx("p", {
						className: "text-xs text-rose-600 mt-1 font-medium",
						children: errors.name
					})
				] }),
				/* @__PURE__ */ jsxs("div", { children: [
					/* @__PURE__ */ jsxs("label", {
						className: "block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5",
						children: ["Email Address ", /* @__PURE__ */ jsx("span", {
							className: "text-rose-500",
							children: "*"
						})]
					}),
					/* @__PURE__ */ jsxs("div", {
						className: "relative",
						children: [/* @__PURE__ */ jsx(Mail, { className: "w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" }), /* @__PURE__ */ jsx("input", {
							type: "email",
							value: data.email,
							onChange: (e) => setData("email", e.target.value),
							placeholder: "e.g. rajesh@ciplon.com",
							className: `w-full pl-9 pr-3.5 py-2.5 bg-slate-50/70 hover:bg-slate-50 focus:bg-white border ${errors.email ? "border-rose-300 focus:border-rose-500" : "border-slate-200 focus:border-teal-600"} rounded-lg text-xs sm:text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-600/10 transition-all`
						})]
					}),
					errors.email && /* @__PURE__ */ jsx("p", {
						className: "text-xs text-rose-600 mt-1 font-medium",
						children: errors.email
					})
				] }),
				/* @__PURE__ */ jsxs("div", { children: [
					/* @__PURE__ */ jsxs("label", {
						className: "block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2",
						children: ["Role & Access Level ", /* @__PURE__ */ jsx("span", {
							className: "text-rose-500",
							children: "*"
						})]
					}),
					/* @__PURE__ */ jsx("div", {
						className: "space-y-2",
						children: roles.map((r) => {
							const isSelected = data.role === r.name;
							return /* @__PURE__ */ jsxs("label", {
								className: `p-3 rounded-lg border cursor-pointer transition-all flex items-start gap-3 ${isSelected ? "border-teal-600 bg-teal-50/40 text-teal-950 font-semibold ring-1 ring-teal-600/20" : "border-slate-200 hover:border-slate-300 bg-slate-50/40 text-slate-700"}`,
								children: [/* @__PURE__ */ jsx("input", {
									type: "radio",
									name: "role",
									value: r.name,
									checked: isSelected,
									onChange: (e) => setData("role", e.target.value),
									className: "mt-1 text-teal-600 focus:ring-teal-500"
								}), /* @__PURE__ */ jsxs("div", {
									className: "flex-1 min-w-0",
									children: [/* @__PURE__ */ jsxs("div", {
										className: "flex items-center justify-between",
										children: [/* @__PURE__ */ jsx("span", {
											className: "text-xs font-bold text-slate-900",
											children: r.name === "super_admin" ? "Super Admin" : r.name === "mr" ? "Medical Representative (MR)" : capitalizeWords$1(r.name.replace(/_/g, " "))
										}), isSelected && /* @__PURE__ */ jsx("span", {
											className: "text-[10px] font-semibold text-teal-700 bg-teal-100/60 px-2 py-0.5 rounded-full",
											children: "Active"
										})]
									}), /* @__PURE__ */ jsx("span", {
										className: "text-[11px] text-slate-500 mt-0.5 block leading-tight font-normal",
										children: r.name === "super_admin" ? "Unrestricted master access to all operations" : r.name === "manager" ? "Manages products, categories, doctor call records" : "Field catalog access & Daily Call Reports (DCR)"
									})]
								})]
							}, r.id);
						})
					}),
					errors.role && /* @__PURE__ */ jsx("p", {
						className: "text-xs text-rose-600 mt-1 font-medium",
						children: errors.role
					})
				] }),
				/* @__PURE__ */ jsxs("div", { children: [
					/* @__PURE__ */ jsxs("label", {
						className: "block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5",
						children: [
							isEdit ? "Password (Leave blank to keep existing)" : "Password",
							" ",
							!isEdit && /* @__PURE__ */ jsx("span", {
								className: "text-rose-500",
								children: "*"
							})
						]
					}),
					/* @__PURE__ */ jsxs("div", {
						className: "relative",
						children: [/* @__PURE__ */ jsx(Lock, { className: "w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" }), /* @__PURE__ */ jsx("input", {
							type: "password",
							value: data.password,
							onChange: (e) => setData("password", e.target.value),
							placeholder: isEdit ? "••••••••" : "Minimum 8 characters",
							className: `w-full pl-9 pr-3.5 py-2.5 bg-slate-50/70 hover:bg-slate-50 focus:bg-white border ${errors.password ? "border-rose-300 focus:border-rose-500" : "border-slate-200 focus:border-teal-600"} rounded-lg text-xs sm:text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-600/10 transition-all`
						})]
					}),
					errors.password && /* @__PURE__ */ jsx("p", {
						className: "text-xs text-rose-600 mt-1 font-medium",
						children: errors.password
					})
				] }),
				/* @__PURE__ */ jsxs("div", {
					className: "pt-4 border-t border-slate-100 flex items-center justify-end gap-2.5",
					children: [/* @__PURE__ */ jsx(Link, {
						href: "/admin/staff",
						className: "px-4 py-2 rounded-lg border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-semibold transition-colors cursor-pointer",
						children: "Cancel"
					}), /* @__PURE__ */ jsxs("button", {
						type: "submit",
						disabled: processing,
						className: "inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-teal-700 hover:bg-teal-800 disabled:opacity-50 text-white text-xs font-semibold shadow-sm transition-all cursor-pointer",
						children: [/* @__PURE__ */ jsx(Save, { className: "w-3.5 h-3.5" }), /* @__PURE__ */ jsx("span", { children: processing ? "Saving..." : isEdit ? "Save Changes" : "Create Staff Member" })]
					})]
				})
			]
		})
	}) });
}
//#endregion
//#region resources/js/Pages/admin/staff/StaffList.jsx
var StaffList_exports = /* @__PURE__ */ __exportAll({ default: () => StaffList });
var capitalizeWords = (str) => {
	if (!str || typeof str !== "string") return "";
	return str.replace(/\b\w/g, (char) => char.toUpperCase());
};
function StaffList({ staff, filters = {}, roles = [] }) {
	const { auth } = usePage().props;
	const [searchTerm, setSearchTerm] = useState(filters.search || "");
	const [roleFilter, setRoleFilter] = useState(filters.role || "");
	const applyFilters = (searchVal, roleVal) => {
		const params = {};
		if (searchVal.trim()) params.search = searchVal.trim();
		if (roleVal) params.role = roleVal;
		router.get("/admin/staff", params, { preserveState: true });
	};
	const handleSearchSubmit = (e) => {
		e.preventDefault();
		applyFilters(searchTerm, roleFilter);
	};
	const handleRoleChange = (val) => {
		setRoleFilter(val);
		applyFilters(searchTerm, val);
	};
	const handleDelete = (member) => {
		const formattedName = capitalizeWords(member.name);
		if (confirm(`Are you sure you want to remove staff member "${formattedName}"?`)) router.delete(`/admin/staff/${member.id}`);
	};
	const getRoleBadge = (roleName) => {
		switch (roleName) {
			case "super_admin": return /* @__PURE__ */ jsx("span", {
				className: "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-purple-50 text-purple-700",
				children: "Super Admin"
			});
			case "manager": return /* @__PURE__ */ jsx("span", {
				className: "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-blue-50 text-blue-700",
				children: "Manager"
			});
			case "mr": return /* @__PURE__ */ jsx("span", {
				className: "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-teal-50 text-teal-700",
				children: "Medical Rep (MR)"
			});
			default: return /* @__PURE__ */ jsx("span", {
				className: "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-slate-100 text-slate-700",
				children: capitalizeWords(roleName || "Staff")
			});
		}
	};
	return /* @__PURE__ */ jsx(AdminLayout, { children: /* @__PURE__ */ jsxs("div", {
		className: "space-y-4 pb-8",
		children: [/* @__PURE__ */ jsxs("div", {
			className: "bg-white rounded-xl border border-slate-200/80 p-3 sm:p-4 shadow-[0_1px_3px_rgba(0,0,0,0.04)] flex flex-col sm:flex-row items-center justify-between gap-3",
			children: [/* @__PURE__ */ jsxs("form", {
				onSubmit: handleSearchSubmit,
				className: "relative w-full sm:flex-1 max-w-md",
				children: [/* @__PURE__ */ jsx(Search, { className: "w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" }), /* @__PURE__ */ jsx("input", {
					type: "text",
					value: searchTerm,
					onChange: (e) => setSearchTerm(e.target.value),
					placeholder: "Search staff by name or email...",
					className: "w-full pl-9 pr-3 py-2 bg-slate-50/70 hover:bg-slate-50 focus:bg-white border border-slate-200 focus:border-teal-600 rounded-lg text-xs sm:text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-600/10 transition-all"
				})]
			}), /* @__PURE__ */ jsxs("div", {
				className: "flex items-center gap-2 w-full sm:w-auto justify-between sm:justify-end",
				children: [
					/* @__PURE__ */ jsxs("div", {
						className: "flex items-center gap-1.5",
						children: [/* @__PURE__ */ jsx(Filter, { className: "w-3.5 h-3.5 text-slate-400 shrink-0" }), /* @__PURE__ */ jsxs("select", {
							value: roleFilter,
							onChange: (e) => handleRoleChange(e.target.value),
							className: "px-2.5 py-2 text-xs rounded-lg border border-slate-200 bg-slate-50/70 hover:bg-white focus:bg-white focus:border-teal-600 outline-none cursor-pointer text-slate-700",
							children: [/* @__PURE__ */ jsx("option", {
								value: "",
								children: "All Roles"
							}), roles.map((r) => /* @__PURE__ */ jsx("option", {
								value: r.name,
								children: r.name === "super_admin" ? "Super Admin" : r.name === "mr" ? "Medical Rep" : capitalizeWords(r.name.replace(/_/g, " "))
							}, r.id))]
						})]
					}),
					/* @__PURE__ */ jsxs(Link, {
						href: "/admin/roles",
						className: "inline-flex items-center gap-1.5 px-3 py-2 rounded-lg border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-semibold transition-colors cursor-pointer",
						title: "Configure Roles & Permissions",
						children: [/* @__PURE__ */ jsx(Shield, { className: "w-3.5 h-3.5 text-slate-500" }), /* @__PURE__ */ jsx("span", {
							className: "hidden sm:inline",
							children: "Roles"
						})]
					}),
					/* @__PURE__ */ jsxs(Link, {
						href: "/admin/staff/create",
						className: "inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-teal-700 hover:bg-teal-800 text-white text-xs font-semibold shadow-sm transition-colors shrink-0 cursor-pointer",
						children: [/* @__PURE__ */ jsx(UserPlus, { className: "w-3.5 h-3.5" }), /* @__PURE__ */ jsx("span", { children: "Add Staff" })]
					})
				]
			})]
		}), /* @__PURE__ */ jsxs("div", {
			className: "bg-white rounded-xl border border-slate-200/80 shadow-[0_1px_3px_rgba(0,0,0,0.04)] overflow-hidden",
			children: [/* @__PURE__ */ jsx("div", {
				className: "overflow-x-auto",
				children: /* @__PURE__ */ jsxs("table", {
					className: "w-full text-left border-collapse",
					children: [/* @__PURE__ */ jsx("thead", { children: /* @__PURE__ */ jsxs("tr", {
						className: "bg-slate-50/70 border-b border-slate-200/80 text-[11px] font-bold text-slate-500 uppercase tracking-wider",
						children: [
							/* @__PURE__ */ jsx("th", {
								className: "py-3 px-4 sm:px-5",
								children: "Team Member"
							}),
							/* @__PURE__ */ jsx("th", {
								className: "py-3 px-4",
								children: "Role Access"
							}),
							/* @__PURE__ */ jsx("th", {
								className: "py-3 px-4",
								children: "Joined Date"
							}),
							/* @__PURE__ */ jsx("th", {
								className: "py-3 px-4 sm:px-5 text-right",
								children: "Actions"
							})
						]
					}) }), /* @__PURE__ */ jsx("tbody", {
						className: "divide-y divide-slate-100 text-xs text-slate-700",
						children: staff?.data?.length === 0 ? /* @__PURE__ */ jsx("tr", { children: /* @__PURE__ */ jsxs("td", {
							colSpan: "4",
							className: "py-12 text-center text-slate-400 font-medium",
							children: [/* @__PURE__ */ jsx(Users, { className: "w-8 h-8 mx-auto mb-2 opacity-40" }), "No staff members found matching the criteria."]
						}) }) : staff?.data?.map((member) => {
							const primaryRole = member.roles?.[0]?.name || member.role;
							const isSelf = member.id === auth.user?.id;
							const formattedName = capitalizeWords(member.name);
							const initial = formattedName ? formattedName.charAt(0).toUpperCase() : "U";
							return /* @__PURE__ */ jsxs("tr", {
								className: "hover:bg-slate-50/50 transition-colors",
								children: [
									/* @__PURE__ */ jsx("td", {
										className: "py-3.5 px-4 sm:px-5",
										children: /* @__PURE__ */ jsxs("div", {
											className: "flex items-center gap-3",
											children: [/* @__PURE__ */ jsx("div", {
												className: "w-8 h-8 rounded-full bg-teal-50 text-teal-800 font-bold text-xs flex items-center justify-center uppercase shrink-0",
												children: initial
											}), /* @__PURE__ */ jsxs("div", {
												className: "min-w-0",
												children: [/* @__PURE__ */ jsxs("div", {
													className: "font-semibold text-slate-900 flex items-center gap-1.5 truncate",
													children: [/* @__PURE__ */ jsx("span", {
														className: "capitalize",
														children: formattedName
													}), isSelf && /* @__PURE__ */ jsx("span", {
														className: "text-[10px] font-medium bg-slate-100 text-slate-600 px-1.5 py-0.5 rounded-full",
														children: "You"
													})]
												}), /* @__PURE__ */ jsx("p", {
													className: "text-[11px] text-slate-400 truncate",
													children: member.email
												})]
											})]
										})
									}),
									/* @__PURE__ */ jsx("td", {
										className: "py-3.5 px-4",
										children: getRoleBadge(primaryRole)
									}),
									/* @__PURE__ */ jsx("td", {
										className: "py-3.5 px-4 text-slate-500",
										children: new Date(member.created_at).toLocaleDateString(void 0, {
											year: "numeric",
											month: "short",
											day: "numeric"
										})
									}),
									/* @__PURE__ */ jsx("td", {
										className: "py-3.5 px-4 sm:px-5 text-right",
										children: /* @__PURE__ */ jsxs("div", {
											className: "flex items-center justify-end gap-1",
											children: [/* @__PURE__ */ jsx(Link, {
												href: `/admin/staff/${member.id}/edit`,
												className: "p-1.5 rounded-lg text-slate-500 hover:text-teal-700 hover:bg-teal-50 transition-colors",
												title: "Edit Member",
												"aria-label": "Edit Member",
												children: /* @__PURE__ */ jsx(Edit2, { className: "w-3.5 h-3.5" })
											}), !isSelf && /* @__PURE__ */ jsx("button", {
												type: "button",
												onClick: () => handleDelete(member),
												className: "p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer",
												title: "Delete Member",
												"aria-label": "Delete Member",
												children: /* @__PURE__ */ jsx(Trash2, { className: "w-3.5 h-3.5" })
											})]
										})
									})
								]
							}, member.id);
						})
					})]
				})
			}), staff?.links && staff.links.length > 3 && /* @__PURE__ */ jsxs("div", {
				className: "p-3.5 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500",
				children: [/* @__PURE__ */ jsxs("span", { children: [
					"Showing ",
					staff.from || 0,
					" to ",
					staff.to || 0,
					" of ",
					staff.total || 0,
					" members"
				] }), /* @__PURE__ */ jsx("div", {
					className: "flex items-center gap-1",
					children: staff.links.map((link, idx) => /* @__PURE__ */ jsx(Link, {
						href: link.url || "#",
						preserveScroll: true,
						dangerouslySetInnerHTML: { __html: link.label },
						className: `px-2.5 py-1 rounded font-medium transition-colors ${link.active ? "bg-teal-700 text-white" : link.url ? "bg-slate-100 hover:bg-slate-200 text-slate-700" : "text-slate-300 pointer-events-none"}`
					}, idx))
				})]
			})]
		})]
	}) });
}
//#endregion
//#region resources/js/components/maps/DoctorMovementMap.jsx
/**
* DoctorMovementMap Component
* Integrates Mapbox GL JS SDK with fallback vector canvas/tiles
* Renders Doctor Movement route, visited vs pending pins, animated path, and MR live position.
*/
function DoctorMovementMap({ mapboxConfig = {}, doctorStops = {}, activeMR = null, onStopClick = null, height = "480px" }) {
	const mapContainerRef = useRef(null);
	const mapInstanceRef = useRef(null);
	const markersRef = useRef([]);
	const [mapLoaded, setMapLoaded] = useState(false);
	const [mapError, setMapError] = useState(false);
	const [activeFilter, setActiveFilter] = useState("all");
	const token = (mapboxConfig.token || (typeof window !== "undefined" ? window.MAPBOX_TOKEN : "") || "").trim();
	const mapStyle = mapboxConfig.style || "mapbox://styles/mapbox/streets-v12";
	const defaultLat = mapboxConfig.default_lat || 8.1833;
	const defaultLng = mapboxConfig.default_lng || 77.4119;
	const defaultZoom = mapboxConfig.default_zoom || 13;
	const visitedStops = doctorStops.visited || [];
	const pendingStops = doctorStops.pending || [];
	const allStops = doctorStops.all || [...visitedStops, ...pendingStops];
	const routeCoordinates = doctorStops.route_coordinates || [];
	const mrLiveLocation = doctorStops.mr_live_location || (activeMR ? {
		lat: activeMR.lat || defaultLat,
		lng: activeMR.lng || defaultLng,
		user_name: activeMR.name,
		reg_code: activeMR.reg_code,
		battery: activeMR.battery_level,
		last_synced: "Just now"
	} : null);
	const visibleStops = allStops.filter((stop) => {
		if (activeFilter === "visited") return stop.status === "visited";
		if (activeFilter === "pending") return stop.status === "pending";
		return true;
	});
	useEffect(() => {
		let isMounted = true;
		const loadMapboxSDK = async () => {
			if (window.mapboxgl) {
				initMapbox();
				return;
			}
			try {
				if (!document.getElementById("mapbox-gl-css")) {
					const link = document.createElement("link");
					link.id = "mapbox-gl-css";
					link.rel = "stylesheet";
					link.href = "https://api.mapbox.com/mapbox-gl-js/v3.4.0/mapbox-gl.css";
					document.head.appendChild(link);
				}
				if (!document.getElementById("mapbox-gl-js")) {
					const script = document.createElement("script");
					script.id = "mapbox-gl-js";
					script.src = "https://api.mapbox.com/mapbox-gl-js/v3.4.0/mapbox-gl.js";
					script.async = true;
					script.onload = () => {
						if (isMounted) initMapbox();
					};
					script.onerror = () => {
						if (isMounted) setMapError(true);
					};
					document.body.appendChild(script);
				} else initMapbox();
			} catch (e) {
				if (isMounted) setMapError(true);
			}
		};
		const initMapbox = () => {
			if (!mapContainerRef.current || !window.mapboxgl) return;
			if (mapInstanceRef.current) {
				mapInstanceRef.current.remove();
				mapInstanceRef.current = null;
			}
			try {
				const effectiveToken = token.trim() || "pk.eyJ1IjoibXJjb25uZWN0LWRlbW8iLCJhIjoiY2x6cTFxZmxwMDJiazJqcXB0eGdxOGNteSJ9.mock";
				window.mapboxgl.accessToken = effectiveToken;
				const centerLng = mrLiveLocation?.lng || allStops[0]?.lng || defaultLng;
				const centerLat = mrLiveLocation?.lat || allStops[0]?.lat || defaultLat;
				const map = new window.mapboxgl.Map({
					container: mapContainerRef.current,
					style: token.trim() ? mapStyle : "https://demotiles.maplibre.org/style.json",
					center: [centerLng, centerLat],
					zoom: defaultZoom,
					attributionControl: false
				});
				map.addControl(new window.mapboxgl.NavigationControl({ showCompass: true }), "bottom-right");
				map.on("load", () => {
					if (!isMounted) return;
					mapInstanceRef.current = map;
					setMapLoaded(true);
					drawRouteAndMarkers(map);
				});
				map.on("error", (e) => {
					if (!mapLoaded) setMapError(true);
				});
			} catch (err) {
				setMapError(true);
			}
		};
		loadMapboxSDK();
		return () => {
			isMounted = false;
			if (mapInstanceRef.current) {
				mapInstanceRef.current.remove();
				mapInstanceRef.current = null;
			}
		};
	}, [
		token,
		mapStyle,
		activeMR?.id
	]);
	const drawRouteAndMarkers = (map) => {
		if (!map) return;
		markersRef.current.forEach((m) => m.remove());
		markersRef.current = [];
		if (routeCoordinates && routeCoordinates.length > 1) {
			const geojsonRoute = {
				type: "Feature",
				properties: {},
				geometry: {
					type: "LineString",
					coordinates: routeCoordinates
				}
			};
			if (map.getSource("route-line")) map.getSource("route-line").setData(geojsonRoute);
			else {
				map.addSource("route-line", {
					type: "geojson",
					data: geojsonRoute
				});
				map.addLayer({
					id: "route-line-glow",
					type: "line",
					source: "route-line",
					layout: {
						"line-join": "round",
						"line-cap": "round"
					},
					paint: {
						"line-color": "#6366f1",
						"line-width": 6,
						"line-opacity": .25
					}
				});
				map.addLayer({
					id: "route-line",
					type: "line",
					source: "route-line",
					layout: {
						"line-join": "round",
						"line-cap": "round"
					},
					paint: {
						"line-color": "#4f46e5",
						"line-width": 3,
						"line-dasharray": [2, 2]
					}
				});
			}
		}
		if (mrLiveLocation && window.mapboxgl) {
			const mrEl = document.createElement("div");
			mrEl.className = "relative flex items-center justify-center cursor-pointer";
			mrEl.innerHTML = `
        <div class="relative flex items-center justify-center">
          <span class="absolute w-9 h-9 rounded-full bg-violet-500/25 animate-ping"></span>
          <span class="absolute w-6 h-6 rounded-full bg-violet-500/40"></span>
          <div class="relative w-6 h-6 rounded-lg bg-slate-900 text-white flex items-center justify-center border-2 border-white text-[10px] font-semibold">
            MR
          </div>
        </div>
      `;
			const mrPopup = new window.mapboxgl.Popup({ offset: 25 }).setHTML(`
        <div class="p-2 font-sans text-xs">
          <div class="font-bold text-slate-900">${mrLiveLocation.user_name || "Medical Representative"}</div>
          <div class="text-[11px] text-slate-500">Reg: ${mrLiveLocation.reg_code || "1026"} • Live GPS</div>
          <div class="mt-1 flex items-center gap-1.5 text-[11px] text-emerald-600 font-medium">
            <span class="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            Active Field Route
          </div>
        </div>
      `);
			const mrMarker = new window.mapboxgl.Marker(mrEl).setLngLat([mrLiveLocation.lng, mrLiveLocation.lat]).setPopup(mrPopup).addTo(map);
			markersRef.current.push(mrMarker);
		}
		visibleStops.forEach((stop, index) => {
			if (!stop.lat || !stop.lng || !window.mapboxgl) return;
			const isVisited = stop.status === "visited";
			const el = document.createElement("div");
			el.className = "cursor-pointer transform hover:scale-110 transition-transform";
			el.innerHTML = `
        <div class="flex items-center justify-center w-7 h-7 rounded-full ${isVisited ? "bg-emerald-500 text-white border-2 border-white shadow-xs" : "bg-amber-500 text-white border-2 border-white shadow-xs"} text-xs font-bold">
          ${isVisited ? "✓" : index + 1}
        </div>
      `;
			const popup = new window.mapboxgl.Popup({ offset: 20 }).setHTML(`
        <div class="p-2.5 font-sans text-xs max-w-[220px]">
          <div class="font-bold text-slate-900">${stop.name}</div>
          <div class="text-[11px] text-indigo-600 font-medium">${stop.specialization || "Consultant"}</div>
          <div class="text-[11px] text-slate-500 truncate">${stop.clinic_hospital || stop.address}</div>
          <div class="mt-2 pt-1.5 border-t border-slate-100 flex items-center justify-between text-[11px]">
            <span class="font-medium ${isVisited ? "text-emerald-600" : "text-amber-600"}">
              ${isVisited ? "● Visited" : "○ Pending"}
            </span>
            <span class="text-slate-400 font-mono">${stop.scheduled_time || stop.time || ""}</span>
          </div>
        </div>
      `);
			const marker = new window.mapboxgl.Marker(el).setLngLat([stop.lng, stop.lat]).setPopup(popup).addTo(map);
			el.addEventListener("click", () => {
				if (onStopClick) onStopClick(stop);
			});
			markersRef.current.push(marker);
		});
		if (visibleStops.length > 0 && window.mapboxgl) {
			const bounds = new window.mapboxgl.LngLatBounds();
			if (mrLiveLocation) bounds.extend([mrLiveLocation.lng, mrLiveLocation.lat]);
			visibleStops.forEach((s) => bounds.extend([s.lng, s.lat]));
			map.fitBounds(bounds, {
				padding: 50,
				maxZoom: 15,
				duration: 1e3
			});
		}
	};
	const handleRecenter = () => {
		if (mapInstanceRef.current && mrLiveLocation) mapInstanceRef.current.flyTo({
			center: [mrLiveLocation.lng, mrLiveLocation.lat],
			zoom: defaultZoom,
			essential: true
		});
	};
	return /* @__PURE__ */ jsxs("div", {
		className: "relative rounded-2xl border border-slate-200/80 bg-white overflow-hidden",
		children: [/* @__PURE__ */ jsxs("div", {
			className: "flex flex-wrap items-center justify-between px-4 py-3 border-b border-slate-100 bg-white gap-2",
			children: [/* @__PURE__ */ jsxs("div", {
				className: "flex items-center gap-2",
				children: [/* @__PURE__ */ jsx("span", {
					className: "text-[10px] font-semibold uppercase tracking-wider text-slate-400",
					children: "Route View"
				}), /* @__PURE__ */ jsx("h3", {
					className: "text-sm font-semibold text-slate-800",
					children: "Doctor Movement Map"
				})]
			}), /* @__PURE__ */ jsxs("div", {
				className: "flex items-center gap-2 text-xs",
				children: [/* @__PURE__ */ jsxs("div", {
					className: "flex items-center gap-1 p-0.5 rounded-xl bg-slate-200/50",
					children: [
						/* @__PURE__ */ jsxs("button", {
							type: "button",
							onClick: () => setActiveFilter("all"),
							className: `px-2.5 py-1 rounded-lg text-xs transition-colors cursor-pointer ${activeFilter === "all" ? "bg-white text-slate-900 font-semibold shadow-2xs" : "text-slate-600 hover:text-slate-900 font-normal"}`,
							children: [
								"All (",
								allStops.length,
								")"
							]
						}),
						/* @__PURE__ */ jsxs("button", {
							type: "button",
							onClick: () => setActiveFilter("visited"),
							className: `px-2.5 py-1 rounded-lg text-xs transition-colors cursor-pointer flex items-center gap-1 ${activeFilter === "visited" ? "bg-white text-emerald-700 font-semibold shadow-2xs" : "text-slate-600 hover:text-slate-900 font-normal"}`,
							children: [
								/* @__PURE__ */ jsx("span", { className: "w-1.5 h-1.5 rounded-full bg-emerald-500" }),
								visitedStops.length,
								" Visited"
							]
						}),
						/* @__PURE__ */ jsxs("button", {
							type: "button",
							onClick: () => setActiveFilter("pending"),
							className: `px-2.5 py-1 rounded-lg text-xs transition-colors cursor-pointer flex items-center gap-1 ${activeFilter === "pending" ? "bg-white text-amber-700 font-semibold shadow-2xs" : "text-slate-600 hover:text-slate-900 font-normal"}`,
							children: [
								/* @__PURE__ */ jsx("span", { className: "w-1.5 h-1.5 rounded-full bg-amber-500" }),
								pendingStops.length,
								" Pending"
							]
						})
					]
				}), /* @__PURE__ */ jsxs("span", {
					className: "hidden sm:inline-flex items-center gap-1.5 px-2.5 py-1 rounded-xl text-xs font-medium bg-emerald-50 text-emerald-700 border border-emerald-200/60",
					children: [/* @__PURE__ */ jsx("span", { className: "w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" }), "Animated Route Active"]
				})]
			})]
		}), /* @__PURE__ */ jsxs("div", {
			className: "relative w-full bg-slate-100",
			style: { height },
			children: [
				/* @__PURE__ */ jsx("div", {
					ref: mapContainerRef,
					className: "w-full h-full"
				}),
				mapError && /* @__PURE__ */ jsx("div", {
					className: "absolute inset-0 bg-slate-50 flex flex-col items-center justify-center p-6 text-center",
					children: /* @__PURE__ */ jsxs("div", {
						className: "w-full h-full max-h-[380px] relative rounded-lg border border-slate-200 bg-gradient-to-br from-slate-50 via-slate-100/50 to-indigo-50/30 overflow-hidden flex items-center justify-center",
						children: [
							/* @__PURE__ */ jsx("div", { className: "absolute inset-0 bg-[radial-gradient(#cbd5e1_1px,transparent_1px)] [background-size:16px_16px] opacity-70" }),
							/* @__PURE__ */ jsx("svg", {
								className: "absolute inset-0 w-full h-full",
								viewBox: "0 0 600 350",
								preserveAspectRatio: "none",
								children: /* @__PURE__ */ jsx("path", {
									d: "M 80 280 L 160 230 L 260 170 L 340 140 L 440 90 L 520 70",
									fill: "none",
									stroke: "#0284c7",
									strokeWidth: "3.5",
									strokeDasharray: "6 6",
									className: "animate-[dash_20s_linear_infinite]"
								})
							}),
							/* @__PURE__ */ jsxs("div", {
								className: "relative z-10 w-full h-full p-8 flex flex-col justify-between",
								children: [/* @__PURE__ */ jsxs("div", {
									className: "flex justify-between items-start",
									children: [/* @__PURE__ */ jsxs("div", {
										className: "bg-white/95 backdrop-blur-xs p-2.5 rounded-lg border border-slate-200 text-left text-xs max-w-xs",
										children: [
											/* @__PURE__ */ jsx("span", {
												className: "text-[10px] font-bold text-emerald-600 uppercase",
												children: "Visited Doctor #1"
											}),
											/* @__PURE__ */ jsx("p", {
												className: "font-semibold text-slate-800",
												children: "Parvathipuram Diabetes Center"
											}),
											/* @__PURE__ */ jsx("p", {
												className: "text-[11px] text-slate-500",
												children: "Dr. Rajesh Kumar MD • 12:45 PM"
											})
										]
									}), /* @__PURE__ */ jsxs("div", {
										className: "bg-white/95 backdrop-blur-xs p-2.5 rounded-lg border border-slate-200 text-left text-xs max-w-xs",
										children: [
											/* @__PURE__ */ jsx("span", {
												className: "text-[10px] font-bold text-amber-600 uppercase",
												children: "Pending Doctor #2"
											}),
											/* @__PURE__ */ jsx("p", {
												className: "font-semibold text-slate-800",
												children: "Kottar Digestive Clinic"
											}),
											/* @__PURE__ */ jsx("p", {
												className: "text-[11px] text-slate-500",
												children: "Dr. P. Venkatesh • 03:15 PM"
											})
										]
									})]
								}), /* @__PURE__ */ jsxs("div", {
									className: "flex justify-between items-end",
									children: [/* @__PURE__ */ jsxs("div", {
										className: "bg-white/95 backdrop-blur-xs p-2.5 rounded-lg border border-sky-300 text-left text-xs flex items-center gap-2",
										children: [/* @__PURE__ */ jsx("div", {
											className: "w-7 h-7 rounded-full bg-sky-600 text-white flex items-center justify-center font-bold text-xs",
											children: "MR"
										}), /* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("p", {
											className: "font-bold text-slate-900",
											children: mrLiveLocation?.user_name || "MR Live"
										}), /* @__PURE__ */ jsxs("p", {
											className: "text-[11px] text-emerald-600 flex items-center gap-1",
											children: [/* @__PURE__ */ jsx("span", { className: "w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" }), "GPS Broadcast Active"]
										})] })]
									}), /* @__PURE__ */ jsx("div", {
										className: "bg-white/95 backdrop-blur-xs px-3 py-1.5 rounded-lg border border-slate-200 text-xs text-slate-600",
										children: "Mapbox Token: Configure in Admin Settings"
									})]
								})]
							})
						]
					})
				}),
				/* @__PURE__ */ jsx("div", {
					className: "absolute top-3 right-3 z-10 flex flex-col gap-1.5 bg-white/95 backdrop-blur-xs p-1 rounded-lg border border-slate-200 shadow-xs",
					children: /* @__PURE__ */ jsx("button", {
						type: "button",
						title: "Recenter on MR Location",
						onClick: handleRecenter,
						className: "p-1.5 text-slate-600 hover:text-indigo-600 hover:bg-slate-100 rounded transition-colors cursor-pointer",
						children: /* @__PURE__ */ jsx(RotateCcw, { className: "w-3.5 h-3.5" })
					})
				})
			]
		})]
	});
}
//#endregion
//#region resources/js/Pages/admin/tracking/TrackingDashboard.jsx
var TrackingDashboard_exports = /* @__PURE__ */ __exportAll({ default: () => TrackingDashboard });
function TrackingDashboard({ mapbox = {}, kpi = {}, field_representatives = [], active_mr = null, doctor_stops = {}, tour_plans_for_approval = [], leaderboard = [] }) {
	const [selectedMRId, setSelectedMRId] = useState(active_mr?.id || field_representatives[0]?.id || null);
	const [searchRepQuery, setSearchRepQuery] = useState("");
	const [tourMode, setTourMode] = useState("doctor");
	const [tourApprovalTab, setTourApprovalTab] = useState("doctors");
	const [reviewModalPlan, setReviewModalPlan] = useState(null);
	const [reviewNotes, setReviewNotes] = useState("");
	const [isProcessing, setIsProcessing] = useState(false);
	const activeRep = field_representatives.find((r) => r.id === selectedMRId) || active_mr || field_representatives[0];
	const filteredReps = field_representatives.filter((rep) => rep.name.toLowerCase().includes(searchRepQuery.toLowerCase()) || rep.reg_code.toLowerCase().includes(searchRepQuery.toLowerCase()));
	const filteredPlans = tour_plans_for_approval.filter((plan) => {
		if (tourApprovalTab === "doctors") return plan.type === "doctor";
		if (tourApprovalTab === "distributors") return plan.type === "distributor";
		return true;
	});
	const tourSummary = tourMode === "doctor" ? kpi.tour_summary?.doctor_mode || {
		total_tours: 36,
		planned: 857,
		visited: 228,
		completion_percent: 27
	} : kpi.tour_summary?.distributor_mode || {
		total_tours: 14,
		planned: 210,
		visited: 148,
		completion_percent: 70
	};
	const handleSelectMR = (repId) => {
		setSelectedMRId(repId);
		router.get("/admin/tracking", { user_id: repId }, {
			preserveState: true,
			preserveScroll: true
		});
	};
	const handleApprovePlan = (planId) => {
		setIsProcessing(true);
		router.post(`/admin/tour-plans/${planId}/approve`, { notes: reviewNotes || "Tour plan approved." }, {
			preserveScroll: true,
			onSuccess: () => {
				toast.success("Tour plan approved successfully!");
				setReviewModalPlan(null);
				setIsProcessing(false);
			},
			onError: () => {
				toast.error("Failed to approve tour plan.");
				setIsProcessing(false);
			}
		});
	};
	const handleRejectPlan = (planId) => {
		setIsProcessing(true);
		router.post(`/admin/tour-plans/${planId}/reject`, { notes: reviewNotes || "Tour plan rejected." }, {
			preserveScroll: true,
			onSuccess: () => {
				toast.success("Tour plan marked as rejected.");
				setReviewModalPlan(null);
				setIsProcessing(false);
			},
			onError: () => {
				toast.error("Failed to reject tour plan.");
				setIsProcessing(false);
			}
		});
	};
	return /* @__PURE__ */ jsxs(AdminLayout, { children: [/* @__PURE__ */ jsxs("div", {
		className: "space-y-6 pb-12 font-sans max-w-[1600px] mx-auto",
		children: [
			/* @__PURE__ */ jsxs("div", {
				className: "flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-200/80",
				children: [/* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("h2", {
					className: "text-xl sm:text-2xl font-semibold tracking-tight text-slate-800",
					children: "Field Operations & Live Tracking"
				}), /* @__PURE__ */ jsx("p", {
					className: "text-xs text-slate-500 font-normal mt-0.5",
					children: "Real-time Mapbox doctor movement, field telemetry, and monthly tour plan approvals."
				})] }), /* @__PURE__ */ jsxs("div", {
					className: "flex items-center gap-2.5",
					children: [/* @__PURE__ */ jsxs("div", {
						className: "inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-50 text-emerald-700 border border-emerald-200/60 text-xs font-medium",
						children: [/* @__PURE__ */ jsx("span", { className: "w-2 h-2 rounded-full bg-emerald-500 animate-pulse" }), /* @__PURE__ */ jsx("span", { children: "Mapbox Live Tracking Active" })]
					}), /* @__PURE__ */ jsxs(Link, {
						href: "/admin/settings",
						className: "inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 font-medium text-xs transition-colors cursor-pointer",
						children: [/* @__PURE__ */ jsx(Settings, { className: "w-3.5 h-3.5 text-slate-500" }), /* @__PURE__ */ jsx("span", { children: "Mapbox Settings" })]
					})]
				})]
			}),
			/* @__PURE__ */ jsxs("div", {
				className: "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4",
				children: [
					/* @__PURE__ */ jsxs("div", {
						className: "bg-white rounded-2xl border border-slate-200/80 p-5",
						children: [
							/* @__PURE__ */ jsxs("div", {
								className: "flex items-center justify-between",
								children: [/* @__PURE__ */ jsx("span", {
									className: "text-xs font-medium text-slate-500",
									children: "Medical Representatives"
								}), /* @__PURE__ */ jsx("div", {
									className: "w-9 h-9 rounded-xl bg-violet-50 text-violet-600 border border-violet-100 flex items-center justify-center",
									children: /* @__PURE__ */ jsx(Users, { className: "w-4 h-4" })
								})]
							}),
							/* @__PURE__ */ jsx("div", {
								className: "mt-2",
								children: /* @__PURE__ */ jsx("span", {
									className: "text-2xl font-semibold text-slate-800",
									children: kpi.medical_representatives || 35
								})
							}),
							/* @__PURE__ */ jsx("div", {
								className: "mt-1 flex items-center gap-1.5 text-[11px] text-slate-400 font-normal",
								children: /* @__PURE__ */ jsxs("span", {
									className: "text-violet-600 font-medium",
									children: [field_representatives.length, " Active in Field"]
								})
							})
						]
					}),
					/* @__PURE__ */ jsxs("div", {
						className: "bg-white rounded-2xl border border-slate-200/80 p-5",
						children: [
							/* @__PURE__ */ jsxs("div", {
								className: "flex items-center justify-between",
								children: [/* @__PURE__ */ jsx("span", {
									className: "text-xs font-medium text-slate-500",
									children: "Doctors in Territory"
								}), /* @__PURE__ */ jsx("div", {
									className: "w-9 h-9 rounded-xl bg-rose-50 text-rose-600 border border-rose-100 flex items-center justify-center",
									children: /* @__PURE__ */ jsx(MapPin, { className: "w-4 h-4" })
								})]
							}),
							/* @__PURE__ */ jsx("div", {
								className: "mt-2",
								children: /* @__PURE__ */ jsx("span", {
									className: "text-2xl font-semibold text-slate-800",
									children: kpi.doctors || 6504
								})
							}),
							/* @__PURE__ */ jsx("div", {
								className: "mt-1 flex items-center gap-1.5 text-[11px] text-slate-400 font-normal",
								children: /* @__PURE__ */ jsx("span", {
									className: "text-emerald-600 font-medium",
									children: "9 Assigned on Today's Route"
								})
							})
						]
					}),
					/* @__PURE__ */ jsxs("div", {
						className: "bg-white rounded-2xl border border-slate-200/80 p-5",
						children: [
							/* @__PURE__ */ jsxs("div", {
								className: "flex items-center justify-between",
								children: [/* @__PURE__ */ jsx("span", {
									className: "text-xs font-medium text-slate-500",
									children: "Regional Managers"
								}), /* @__PURE__ */ jsx("div", {
									className: "w-9 h-9 rounded-xl bg-emerald-50 text-emerald-600 border border-emerald-100 flex items-center justify-center",
									children: /* @__PURE__ */ jsx(ShieldCheck, { className: "w-4 h-4" })
								})]
							}),
							/* @__PURE__ */ jsx("div", {
								className: "mt-2",
								children: /* @__PURE__ */ jsx("span", {
									className: "text-2xl font-semibold text-slate-800",
									children: kpi.managers || 13
								})
							}),
							/* @__PURE__ */ jsx("div", {
								className: "mt-1 flex items-center gap-1.5 text-[11px] text-slate-400 font-normal",
								children: /* @__PURE__ */ jsx("span", {
									className: "text-slate-500",
									children: "ABM & Regional Supervision"
								})
							})
						]
					}),
					/* @__PURE__ */ jsxs("div", {
						className: "bg-white rounded-2xl border border-slate-200/80 p-5",
						children: [
							/* @__PURE__ */ jsxs("div", {
								className: "flex items-center justify-between",
								children: [/* @__PURE__ */ jsx("span", {
									className: "text-xs font-medium text-slate-500",
									children: "Active Headquarters"
								}), /* @__PURE__ */ jsx("div", {
									className: "w-9 h-9 rounded-xl bg-amber-50 text-amber-600 border border-amber-100 flex items-center justify-center",
									children: /* @__PURE__ */ jsx(Building2, { className: "w-4 h-4" })
								})]
							}),
							/* @__PURE__ */ jsx("div", {
								className: "mt-2",
								children: /* @__PURE__ */ jsx("span", {
									className: "text-2xl font-semibold text-slate-800",
									children: kpi.headquarters || 26
								})
							}),
							/* @__PURE__ */ jsx("div", {
								className: "mt-1 flex items-center gap-1.5 text-[11px] text-slate-400 font-normal",
								children: /* @__PURE__ */ jsx("span", {
									className: "text-slate-500",
									children: "Operational Hubs"
								})
							})
						]
					})
				]
			}),
			/* @__PURE__ */ jsxs("div", {
				className: "grid grid-cols-1 lg:grid-cols-12 gap-5",
				children: [/* @__PURE__ */ jsxs("div", {
					className: "lg:col-span-5 bg-white rounded-2xl border border-slate-200/80 p-5 space-y-4",
					children: [
						/* @__PURE__ */ jsxs("div", {
							className: "flex items-center justify-between pb-3 border-b border-slate-100",
							children: [/* @__PURE__ */ jsxs("div", {
								className: "flex items-center gap-2",
								children: [/* @__PURE__ */ jsx(Calendar, { className: "w-4 h-4 text-violet-600" }), /* @__PURE__ */ jsx("h3", {
									className: "text-sm font-semibold text-slate-800",
									children: "Tour Plan Summary - Today"
								})]
							}), /* @__PURE__ */ jsxs("div", {
								className: "flex items-center gap-1 p-0.5 rounded-xl bg-slate-200/50 text-xs",
								children: [/* @__PURE__ */ jsx("button", {
									type: "button",
									onClick: () => setTourMode("doctor"),
									className: `px-3 py-1 rounded-lg transition-colors cursor-pointer ${tourMode === "doctor" ? "bg-white text-slate-900 font-semibold shadow-2xs" : "text-slate-600 hover:text-slate-900 font-normal"}`,
									children: "Doctor Mode"
								}), /* @__PURE__ */ jsx("button", {
									type: "button",
									onClick: () => setTourMode("distributor"),
									className: `px-3 py-1 rounded-lg transition-colors cursor-pointer ${tourMode === "distributor" ? "bg-white text-slate-900 font-semibold shadow-2xs" : "text-slate-600 hover:text-slate-900 font-normal"}`,
									children: "Distributor"
								})]
							})]
						}),
						/* @__PURE__ */ jsxs("div", {
							className: "grid grid-cols-2 sm:grid-cols-4 gap-2.5",
							children: [
								/* @__PURE__ */ jsxs("div", {
									className: "rounded-xl p-3 bg-slate-50 border border-slate-100 text-center",
									children: [/* @__PURE__ */ jsx("p", {
										className: "text-base font-semibold text-slate-800",
										children: tourSummary.total_tours
									}), /* @__PURE__ */ jsx("span", {
										className: "text-[10px] font-medium text-slate-500 block mt-0.5",
										children: "Total Tours"
									})]
								}),
								/* @__PURE__ */ jsxs("div", {
									className: "rounded-xl p-3 bg-slate-50 border border-slate-100 text-center",
									children: [/* @__PURE__ */ jsx("p", {
										className: "text-base font-semibold text-slate-800",
										children: tourSummary.planned
									}), /* @__PURE__ */ jsx("span", {
										className: "text-[10px] font-medium text-slate-500 block mt-0.5",
										children: "Planned"
									})]
								}),
								/* @__PURE__ */ jsxs("div", {
									className: "rounded-xl p-3 bg-slate-50 border border-slate-100 text-center",
									children: [/* @__PURE__ */ jsx("p", {
										className: "text-base font-semibold text-emerald-600",
										children: tourSummary.visited
									}), /* @__PURE__ */ jsx("span", {
										className: "text-[10px] font-medium text-slate-500 block mt-0.5",
										children: "Visited"
									})]
								}),
								/* @__PURE__ */ jsxs("div", {
									className: "rounded-xl p-3 bg-slate-50 border border-slate-100 text-center",
									children: [/* @__PURE__ */ jsxs("p", {
										className: "text-base font-semibold text-violet-600",
										children: [tourSummary.completion_percent, "%"]
									}), /* @__PURE__ */ jsx("span", {
										className: "text-[10px] font-medium text-slate-500 block mt-0.5",
										children: "Completion"
									})]
								})
							]
						}),
						/* @__PURE__ */ jsxs("div", {
							className: "flex items-center justify-between text-xs text-slate-500 pt-1",
							children: [/* @__PURE__ */ jsx("span", { children: "Overall regional completion progress" }), /* @__PURE__ */ jsxs("span", {
								className: "font-semibold text-slate-800",
								children: [tourSummary.completion_percent, "% Completed"]
							})]
						}),
						/* @__PURE__ */ jsx("div", {
							className: "w-full bg-slate-100 h-2 rounded-full overflow-hidden",
							children: /* @__PURE__ */ jsx("div", {
								className: "bg-emerald-500 h-full rounded-full transition-all duration-500",
								style: { width: `${tourSummary.completion_percent}%` }
							})
						})
					]
				}), /* @__PURE__ */ jsxs("div", {
					className: "lg:col-span-7 bg-white rounded-2xl border border-slate-200/80 p-5 space-y-3",
					children: [/* @__PURE__ */ jsxs("div", {
						className: "flex items-center justify-between pb-2 border-b border-slate-100",
						children: [/* @__PURE__ */ jsxs("div", {
							className: "flex items-center gap-2",
							children: [/* @__PURE__ */ jsx(ShieldCheck, { className: "w-4 h-4 text-violet-600" }), /* @__PURE__ */ jsx("h3", {
								className: "text-sm font-semibold text-slate-800",
								children: "Tour Plan for Approval"
							})]
						}), /* @__PURE__ */ jsxs("div", {
							className: "flex items-center gap-1 p-0.5 rounded-xl bg-slate-200/50 text-xs",
							children: [/* @__PURE__ */ jsxs("button", {
								type: "button",
								onClick: () => setTourApprovalTab("doctors"),
								className: `px-3 py-1 rounded-lg transition-colors cursor-pointer ${tourApprovalTab === "doctors" ? "bg-white text-slate-900 font-semibold shadow-2xs" : "text-slate-600 hover:text-slate-900 font-normal"}`,
								children: [
									"Doctors (",
									tour_plans_for_approval.filter((p) => p.type === "doctor").length,
									")"
								]
							}), /* @__PURE__ */ jsx("button", {
								type: "button",
								onClick: () => setTourApprovalTab("distributors"),
								className: `px-3 py-1 rounded-lg transition-colors cursor-pointer ${tourApprovalTab === "distributors" ? "bg-white text-slate-900 font-semibold shadow-2xs" : "text-slate-600 hover:text-slate-900 font-normal"}`,
								children: "Distributors (0)"
							})]
						})]
					}), /* @__PURE__ */ jsx("div", {
						className: "overflow-x-auto max-h-[195px] overflow-y-auto",
						children: /* @__PURE__ */ jsxs("table", {
							className: "w-full text-left text-xs border-collapse",
							children: [/* @__PURE__ */ jsx("thead", { children: /* @__PURE__ */ jsxs("tr", {
								className: "border-b border-slate-100 text-[11px] font-semibold text-slate-400",
								children: [
									/* @__PURE__ */ jsx("th", {
										className: "py-2 px-2",
										children: "Employee"
									}),
									/* @__PURE__ */ jsx("th", {
										className: "py-2 px-2",
										children: "Month"
									}),
									/* @__PURE__ */ jsx("th", {
										className: "py-2 px-2 text-center",
										children: "Days"
									}),
									/* @__PURE__ */ jsx("th", {
										className: "py-2 px-2 text-right",
										children: "Action"
									})
								]
							}) }), /* @__PURE__ */ jsx("tbody", {
								className: "divide-y divide-slate-100",
								children: filteredPlans.length > 0 ? filteredPlans.map((plan) => /* @__PURE__ */ jsxs("tr", {
									className: "hover:bg-slate-50/70 transition-colors",
									children: [
										/* @__PURE__ */ jsx("td", {
											className: "py-2 px-2 font-medium text-slate-800",
											children: plan.employee_name
										}),
										/* @__PURE__ */ jsx("td", {
											className: "py-2 px-2 text-slate-500",
											children: plan.month
										}),
										/* @__PURE__ */ jsx("td", {
											className: "py-2 px-2 text-center font-normal text-slate-700",
											children: /* @__PURE__ */ jsxs("span", {
												className: "px-2 py-0.5 rounded-md bg-slate-100 text-[11px]",
												children: [plan.days_count, " days"]
											})
										}),
										/* @__PURE__ */ jsx("td", {
											className: "py-2 px-2 text-right",
											children: plan.status === "approved" ? /* @__PURE__ */ jsxs("span", {
												className: "inline-flex items-center gap-1 text-[11px] font-medium text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200/60",
												children: [/* @__PURE__ */ jsx(Check, { className: "w-3 h-3" }), " Approved"]
											}) : /* @__PURE__ */ jsx("button", {
												type: "button",
												onClick: () => {
													setReviewModalPlan(plan);
													setReviewNotes("");
												},
												className: "px-3 py-1 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-medium text-xs transition-colors cursor-pointer",
												children: "Review"
											})
										})
									]
								}, plan.id)) : /* @__PURE__ */ jsx("tr", { children: /* @__PURE__ */ jsx("td", {
									colSpan: "4",
									className: "py-6 text-center text-slate-400",
									children: "No pending tour plans found for approval."
								}) })
							})]
						})
					})]
				})]
			}),
			/* @__PURE__ */ jsxs("div", {
				className: "grid grid-cols-1 lg:grid-cols-12 gap-5 items-start",
				children: [
					/* @__PURE__ */ jsxs("div", {
						className: "lg:col-span-3 bg-white rounded-2xl border border-slate-200/80 p-4 space-y-3.5",
						children: [
							/* @__PURE__ */ jsxs("div", {
								className: "flex items-center justify-between pb-2 border-b border-slate-100",
								children: [/* @__PURE__ */ jsxs("div", {
									className: "flex items-center gap-1.5",
									children: [/* @__PURE__ */ jsx(Users, { className: "w-4 h-4 text-violet-600" }), /* @__PURE__ */ jsx("h3", {
										className: "text-sm font-semibold text-slate-800",
										children: "Field Representatives"
									})]
								}), /* @__PURE__ */ jsxs("span", {
									className: "text-[11px] font-medium text-slate-400",
									children: [filteredReps.length, " Active"]
								})]
							}),
							/* @__PURE__ */ jsxs("div", {
								className: "relative",
								children: [/* @__PURE__ */ jsx(Search, { className: "w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2.5 pointer-events-none" }), /* @__PURE__ */ jsx("input", {
									type: "text",
									value: searchRepQuery,
									onChange: (e) => setSearchRepQuery(e.target.value),
									placeholder: "Search representative...",
									className: "w-full pl-8 pr-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 placeholder-slate-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-violet-500/20 focus:border-violet-500 transition-all"
								})]
							}),
							/* @__PURE__ */ jsx("div", {
								className: "space-y-1.5 max-h-[580px] overflow-y-auto pr-1",
								children: filteredReps.map((rep) => {
									const isSelected = rep.id === activeRep?.id;
									return /* @__PURE__ */ jsxs("div", {
										onClick: () => handleSelectMR(rep.id),
										className: `p-3 rounded-xl border transition-all cursor-pointer flex items-center justify-between gap-3 ${isSelected ? "bg-violet-50/70 border-violet-300 ring-1 ring-violet-300/50" : "bg-white border-slate-200/70 hover:bg-slate-50/80"}`,
										children: [/* @__PURE__ */ jsxs("div", {
											className: "flex items-center gap-2.5 min-w-0",
											children: [/* @__PURE__ */ jsx("div", {
												className: `w-8 h-8 rounded-lg flex items-center justify-center font-medium text-xs shrink-0 ${isSelected ? "bg-violet-600 text-white" : "bg-slate-100 text-slate-700"}`,
												children: rep.name.substring(0, 2).toUpperCase()
											}), /* @__PURE__ */ jsxs("div", {
												className: "min-w-0",
												children: [/* @__PURE__ */ jsxs("div", {
													className: "flex items-center gap-1.5",
													children: [/* @__PURE__ */ jsx("p", {
														className: "text-xs font-medium text-slate-800 truncate",
														children: rep.name
													}), /* @__PURE__ */ jsx("span", {
														className: `text-[10px] font-medium px-1.5 py-0.2 rounded ${rep.role_title === "ABM" ? "bg-purple-100 text-purple-700" : "bg-slate-100 text-slate-600"}`,
														children: rep.role_title
													})]
												}), /* @__PURE__ */ jsxs("p", {
													className: "text-[11px] text-slate-400",
													children: [
														"Reg: ",
														rep.reg_code,
														" • ",
														rep.last_checkin_time
													]
												})]
											})]
										}), /* @__PURE__ */ jsxs("div", {
											className: "relative w-8 h-8 shrink-0 flex items-center justify-center",
											children: [/* @__PURE__ */ jsxs("svg", {
												className: "w-8 h-8 -rotate-90",
												viewBox: "0 0 36 36",
												children: [/* @__PURE__ */ jsx("path", {
													className: "text-slate-100",
													strokeWidth: "3.5",
													stroke: "currentColor",
													fill: "none",
													d: "M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
												}), /* @__PURE__ */ jsx("path", {
													className: rep.progress_percent >= 80 ? "text-emerald-500" : rep.progress_percent >= 40 ? "text-violet-600" : "text-amber-500",
													strokeDasharray: `${rep.progress_percent}, 100`,
													strokeWidth: "3.5",
													strokeLinecap: "round",
													stroke: "currentColor",
													fill: "none",
													d: "M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
												})]
											}), /* @__PURE__ */ jsxs("span", {
												className: "absolute text-[9px] font-semibold text-slate-700",
												children: [rep.progress_percent, "%"]
											})]
										})]
									}, rep.id);
								})
							})
						]
					}),
					/* @__PURE__ */ jsxs("div", {
						className: "lg:col-span-6 space-y-4",
						children: [/* @__PURE__ */ jsx(DoctorMovementMap, {
							mapboxConfig: mapbox,
							doctorStops: doctor_stops,
							activeMR: activeRep,
							height: "490px"
						}), activeRep && /* @__PURE__ */ jsxs("div", {
							className: "bg-white rounded-2xl border border-slate-200/80 p-4 flex flex-col sm:flex-row items-center justify-between gap-4",
							children: [/* @__PURE__ */ jsxs("div", {
								className: "flex items-center gap-3",
								children: [/* @__PURE__ */ jsx("div", {
									className: "w-10 h-10 rounded-xl bg-gradient-to-br from-violet-600 via-indigo-600 to-purple-700 text-white flex items-center justify-center font-medium text-xs",
									children: activeRep.name.substring(0, 2).toUpperCase()
								}), /* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsxs("div", {
									className: "flex items-center gap-2",
									children: [/* @__PURE__ */ jsx("span", {
										className: "px-2 py-0.5 rounded-md bg-slate-900 text-white font-mono text-[10px] font-semibold",
										children: activeRep.reg_code
									}), /* @__PURE__ */ jsx("h4", {
										className: "text-xs font-semibold text-slate-800",
										children: activeRep.name
									})]
								}), /* @__PURE__ */ jsxs("p", {
									className: "text-[11px] text-slate-400 mt-0.5",
									children: [
										"Reg: ",
										activeRep.reg_code,
										" • Live Telemetry Active"
									]
								})] })]
							}), /* @__PURE__ */ jsxs("div", {
								className: "flex items-center gap-4 text-xs",
								children: [/* @__PURE__ */ jsxs("div", {
									className: "text-right",
									children: [/* @__PURE__ */ jsx("p", {
										className: "text-slate-400 text-[10px] font-medium",
										children: "Tour Schedule"
									}), /* @__PURE__ */ jsxs("p", {
										className: "font-medium text-slate-700",
										children: [
											"Start: ",
											/* @__PURE__ */ jsx("span", {
												className: "text-emerald-600",
												children: activeRep.start_time
											}),
											" | End: ",
											/* @__PURE__ */ jsx("span", {
												className: "text-amber-600",
												children: activeRep.end_time
											})
										]
									})]
								}), /* @__PURE__ */ jsxs("div", {
									className: "relative w-11 h-11 shrink-0 flex items-center justify-center",
									children: [/* @__PURE__ */ jsxs("svg", {
										className: "w-11 h-11 -rotate-90",
										viewBox: "0 0 36 36",
										children: [/* @__PURE__ */ jsx("path", {
											className: "text-slate-100",
											strokeWidth: "3.5",
											stroke: "currentColor",
											fill: "none",
											d: "M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
										}), /* @__PURE__ */ jsx("path", {
											className: "text-emerald-500",
											strokeDasharray: `${activeRep.progress_percent || 41}, 100`,
											strokeWidth: "3.5",
											strokeLinecap: "round",
											stroke: "currentColor",
											fill: "none",
											d: "M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
										})]
									}), /* @__PURE__ */ jsxs("span", {
										className: "absolute text-[11px] font-semibold text-slate-800",
										children: [activeRep.progress_percent || 41, "%"]
									})]
								})]
							})]
						})]
					}),
					/* @__PURE__ */ jsxs("div", {
						className: "lg:col-span-3 bg-white rounded-2xl border border-slate-200/80 p-4 space-y-3.5",
						children: [/* @__PURE__ */ jsxs("div", {
							className: "flex items-center justify-between pb-2 border-b border-slate-100",
							children: [/* @__PURE__ */ jsxs("div", {
								className: "flex items-center gap-1.5",
								children: [/* @__PURE__ */ jsx(Award, { className: "w-4 h-4 text-amber-500" }), /* @__PURE__ */ jsx("h3", {
									className: "text-sm font-semibold text-slate-800",
									children: "Last 30 Days Performance"
								})]
							}), /* @__PURE__ */ jsx("span", {
								className: "text-[10px] font-medium text-slate-400",
								children: "Leaderboard"
							})]
						}), /* @__PURE__ */ jsx("div", {
							className: "space-y-2 max-h-[580px] overflow-y-auto pr-1",
							children: leaderboard.map((item) => /* @__PURE__ */ jsxs("div", {
								className: "p-2.5 rounded-xl border border-slate-100 hover:border-slate-200 bg-white hover:bg-slate-50/50 transition-colors flex items-center justify-between text-xs",
								children: [/* @__PURE__ */ jsxs("div", {
									className: "flex items-center gap-2 min-w-0",
									children: [/* @__PURE__ */ jsxs("span", {
										className: `w-5 h-5 rounded-full flex items-center justify-center font-semibold text-[10px] shrink-0 ${item.rank === 1 ? "bg-amber-100 text-amber-800 border border-amber-300" : item.rank === 2 ? "bg-slate-200 text-slate-700" : item.rank === 3 ? "bg-amber-50 text-amber-700" : "bg-slate-100 text-slate-500"}`,
										children: ["#", item.rank]
									}), /* @__PURE__ */ jsxs("div", {
										className: "min-w-0",
										children: [/* @__PURE__ */ jsx("p", {
											className: "font-medium text-slate-800 truncate",
											children: item.name
										}), /* @__PURE__ */ jsxs("p", {
											className: "text-[11px] text-slate-400 truncate",
											children: [
												/* @__PURE__ */ jsxs("span", {
													className: "text-violet-600 font-medium",
													children: [item.doctors_count, " doctors"]
												}),
												" ",
												item.visits_multiplier,
												" = ",
												item.total_calls,
												" calls"
											]
										})]
									})]
								}), /* @__PURE__ */ jsxs("div", {
									className: "text-right shrink-0",
									children: [/* @__PURE__ */ jsxs("span", {
										className: "font-semibold text-violet-700 text-xs",
										children: [item.coverage_percent, "%"]
									}), /* @__PURE__ */ jsx("p", {
										className: "text-[10px] text-slate-400",
										children: "Coverage"
									})]
								})]
							}, item.rank))
						})]
					})
				]
			})
		]
	}), reviewModalPlan && /* @__PURE__ */ jsx("div", {
		className: "fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-xs p-4",
		children: /* @__PURE__ */ jsxs("div", {
			className: "bg-white rounded-2xl border border-slate-200 max-w-lg w-full p-6 space-y-4 shadow-xl",
			children: [
				/* @__PURE__ */ jsxs("div", {
					className: "flex items-center justify-between pb-3 border-b border-slate-100",
					children: [/* @__PURE__ */ jsxs("div", {
						className: "flex items-center gap-2",
						children: [/* @__PURE__ */ jsx(ShieldCheck, { className: "w-5 h-5 text-violet-600" }), /* @__PURE__ */ jsx("h3", {
							className: "text-base font-semibold text-slate-800",
							children: "Review Tour Plan"
						})]
					}), /* @__PURE__ */ jsx("button", {
						type: "button",
						onClick: () => setReviewModalPlan(null),
						className: "text-slate-400 hover:text-slate-600 cursor-pointer",
						children: /* @__PURE__ */ jsx(X, { className: "w-5 h-5" })
					})]
				}),
				/* @__PURE__ */ jsxs("div", {
					className: "space-y-3 text-xs text-slate-700",
					children: [/* @__PURE__ */ jsxs("div", {
						className: "grid grid-cols-2 gap-3 p-3 bg-slate-50 rounded-xl border border-slate-200/60",
						children: [
							/* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("span", {
								className: "text-slate-400 text-[10px] font-medium",
								children: "Representative"
							}), /* @__PURE__ */ jsx("p", {
								className: "font-semibold text-slate-800 text-sm",
								children: reviewModalPlan.employee_name
							})] }),
							/* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("span", {
								className: "text-slate-400 text-[10px] font-medium",
								children: "Plan Period"
							}), /* @__PURE__ */ jsx("p", {
								className: "font-medium text-slate-800",
								children: reviewModalPlan.month
							})] }),
							/* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("span", {
								className: "text-slate-400 text-[10px] font-medium",
								children: "Field Working Days"
							}), /* @__PURE__ */ jsxs("p", {
								className: "font-medium text-slate-800",
								children: [reviewModalPlan.days_count, " Days"]
							})] }),
							/* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("span", {
								className: "text-slate-400 text-[10px] font-medium",
								children: "Target Doctor Visits"
							}), /* @__PURE__ */ jsxs("p", {
								className: "font-semibold text-violet-600",
								children: [reviewModalPlan.planned_visits, " Visits"]
							})] })
						]
					}), /* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("label", {
						className: "block text-xs font-medium text-slate-700 mb-1",
						children: "Administrator Notes & Guidance"
					}), /* @__PURE__ */ jsx("textarea", {
						rows: "3",
						value: reviewNotes,
						onChange: (e) => setReviewNotes(e.target.value),
						placeholder: "Optional feedback for the representative...",
						className: "w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-violet-500/20 focus:border-violet-500"
					})] })]
				}),
				/* @__PURE__ */ jsxs("div", {
					className: "flex items-center justify-end gap-2.5 pt-3 border-t border-slate-100",
					children: [/* @__PURE__ */ jsx("button", {
						type: "button",
						disabled: isProcessing,
						onClick: () => handleRejectPlan(reviewModalPlan.id),
						className: "px-4 py-2 rounded-xl text-xs font-medium text-rose-700 bg-rose-50 hover:bg-rose-100 border border-rose-200/60 transition-colors cursor-pointer",
						children: "Reject Plan"
					}), /* @__PURE__ */ jsx("button", {
						type: "button",
						disabled: isProcessing,
						onClick: () => handleApprovePlan(reviewModalPlan.id),
						className: "px-5 py-2 rounded-xl text-xs font-medium text-white bg-slate-900 hover:bg-slate-800 transition-colors cursor-pointer",
						children: isProcessing ? "Processing..." : "Approve Tour Plan"
					})]
				})
			]
		})
	})] });
}
//#endregion
//#region resources/js/Pages/auth/LoginPage.jsx
var LoginPage_exports = /* @__PURE__ */ __exportAll({ default: () => LoginPage });
function LoginPage() {
	const { props } = usePage();
	const companyProfile = props.company || {};
	const [showPassword, setShowPassword] = useState(false);
	const [demoLoading, setDemoLoading] = useState(null);
	const [selectedRole, setSelectedRole] = useState("mr");
	const { data, setData, post, processing, errors, reset } = useForm({
		email: "mr@ciplon.com",
		password: "password",
		remember: true
	});
	const handleSubmit = (e) => {
		e.preventDefault();
		post("/login", { onFinish: () => reset("password") });
	};
	const selectRoleTab = (role) => {
		setSelectedRole(role);
		if (role === "mr") setData({
			email: "mr@ciplon.com",
			password: "password",
			remember: true
		});
		else setData({
			email: "admin@gmail.com",
			password: "password",
			remember: true
		});
	};
	const handleQuickLogin = (role) => {
		const email = role === "mr" ? "mr@ciplon.com" : "admin@gmail.com";
		const password = "password";
		setDemoLoading(role);
		setData("email", email);
		setData("password", password);
		router.post("/login", {
			email,
			password,
			remember: true
		}, { onFinish: () => {
			setDemoLoading(null);
			reset("password");
		} });
	};
	const companyName = companyProfile?.company_name || "Ciplon Pharma Private Limited";
	companyProfile?.logo_url;
	return /* @__PURE__ */ jsxs("div", {
		className: "min-h-screen bg-[#fbfbfd] flex flex-col justify-between p-4 sm:p-6 font-sans text-slate-800",
		children: [
			/* @__PURE__ */ jsxs("header", {
				className: "max-w-6xl w-full mx-auto flex items-center justify-between py-2 border-b border-slate-100",
				children: [/* @__PURE__ */ jsxs(Link, {
					href: "/",
					className: "flex items-center gap-2.5 group cursor-pointer",
					children: [/* @__PURE__ */ jsx("div", {
						className: "w-8 h-8 rounded-xl bg-gradient-to-br from-violet-600 via-indigo-600 to-purple-700 text-white flex items-center justify-center font-semibold text-xs shrink-0",
						children: "CP"
					}), /* @__PURE__ */ jsxs("div", {
						className: "flex flex-col",
						children: [/* @__PURE__ */ jsx("span", {
							className: "text-xs font-semibold tracking-tight text-slate-800",
							children: companyName
						}), /* @__PURE__ */ jsx("span", {
							className: "text-[10px] text-slate-400 font-normal",
							children: "Enterprise Field & Admin Suite"
						})]
					})]
				}), /* @__PURE__ */ jsx("div", {
					className: "flex items-center gap-2",
					children: /* @__PURE__ */ jsxs("span", {
						className: "inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-100 text-[10px] font-medium",
						children: [/* @__PURE__ */ jsx("span", { className: "w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" }), "System Operational"]
					})
				})]
			}),
			/* @__PURE__ */ jsx("main", {
				className: "flex-1 flex items-center justify-center py-10 px-2 sm:px-4",
				children: /* @__PURE__ */ jsxs("div", {
					className: "w-full max-w-sm space-y-6",
					children: [
						/* @__PURE__ */ jsxs("div", {
							className: "text-center space-y-1.5",
							children: [/* @__PURE__ */ jsx("h1", {
								className: "text-xl sm:text-2xl font-semibold tracking-tight text-slate-900",
								children: "Welcome back"
							}), /* @__PURE__ */ jsx("p", {
								className: "text-xs text-slate-500 font-normal",
								children: "Sign in with your verified credentials to access your portal."
							})]
						}),
						/* @__PURE__ */ jsxs("div", {
							className: "p-1 bg-slate-100/80 rounded-xl flex items-center gap-1 border border-slate-200/60",
							children: [/* @__PURE__ */ jsxs("button", {
								type: "button",
								onClick: () => selectRoleTab("mr"),
								className: `flex-1 py-1.5 px-3 rounded-lg text-xs font-medium transition-all flex items-center justify-center gap-1.5 cursor-pointer ${selectedRole === "mr" ? "bg-white text-slate-900 shadow-2xs font-semibold" : "text-slate-500 hover:text-slate-800"}`,
								children: [/* @__PURE__ */ jsx(Stethoscope, { className: `w-3.5 h-3.5 ${selectedRole === "mr" ? "text-violet-600" : "text-slate-400"}` }), /* @__PURE__ */ jsx("span", { children: "MR Portal" })]
							}), /* @__PURE__ */ jsxs("button", {
								type: "button",
								onClick: () => selectRoleTab("admin"),
								className: `flex-1 py-1.5 px-3 rounded-lg text-xs font-medium transition-all flex items-center justify-center gap-1.5 cursor-pointer ${selectedRole === "admin" ? "bg-white text-slate-900 shadow-2xs font-semibold" : "text-slate-500 hover:text-slate-800"}`,
								children: [/* @__PURE__ */ jsx(ShieldCheck, { className: `w-3.5 h-3.5 ${selectedRole === "admin" ? "text-violet-600" : "text-slate-400"}` }), /* @__PURE__ */ jsx("span", { children: "Admin Panel" })]
							})]
						}),
						props.flash?.error && /* @__PURE__ */ jsxs("div", {
							className: "p-3 rounded-xl bg-rose-50 text-rose-700 text-xs border border-rose-200/60 flex items-center gap-2",
							children: [/* @__PURE__ */ jsx(AlertCircle, { className: "w-4 h-4 shrink-0 text-rose-500" }), /* @__PURE__ */ jsx("span", { children: props.flash.error })]
						}),
						/* @__PURE__ */ jsxs("div", {
							className: "bg-white rounded-2xl border border-slate-200/80 p-6 sm:p-7 space-y-4",
							children: [/* @__PURE__ */ jsxs("form", {
								onSubmit: handleSubmit,
								noValidate: true,
								className: "space-y-4",
								children: [
									/* @__PURE__ */ jsxs("div", {
										className: "space-y-1",
										children: [
											/* @__PURE__ */ jsx("label", {
												className: "text-xs font-medium text-slate-700 block",
												children: "Email Address"
											}),
											/* @__PURE__ */ jsxs("div", {
												className: "relative",
												children: [/* @__PURE__ */ jsx(Mail, { className: "w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" }), /* @__PURE__ */ jsx("input", {
													type: "email",
													value: data.email,
													onChange: (e) => setData("email", e.target.value),
													placeholder: "name@ciplon.com",
													autoComplete: "email",
													className: `w-full bg-slate-50/60 hover:bg-slate-50 focus:bg-white border rounded-xl pl-8 pr-3 py-2 text-xs text-slate-800 placeholder:text-slate-400 focus:outline-none transition-all font-normal ${errors.email ? "border-rose-300 focus:border-rose-500 focus:ring-1 focus:ring-rose-500/20" : "border-slate-200 focus:border-slate-300 focus:ring-2 focus:ring-violet-500/10"}`
												})]
											}),
											errors.email && /* @__PURE__ */ jsxs("p", {
												className: "text-[11px] text-rose-600 flex items-center gap-1 font-normal mt-1",
												children: [/* @__PURE__ */ jsx(AlertCircle, { className: "w-3 h-3 shrink-0" }), /* @__PURE__ */ jsx("span", { children: errors.email })]
											})
										]
									}),
									/* @__PURE__ */ jsxs("div", {
										className: "space-y-1",
										children: [
											/* @__PURE__ */ jsxs("div", {
												className: "flex items-center justify-between",
												children: [/* @__PURE__ */ jsx("label", {
													className: "text-xs font-medium text-slate-700 block",
													children: "Password"
												}), /* @__PURE__ */ jsx("button", {
													type: "button",
													onClick: () => alert("Please contact administrator at support@ciplon.com to reset your credentials."),
													className: "text-[11px] font-normal text-slate-400 hover:text-slate-700 transition-colors cursor-pointer",
													children: "Forgot password?"
												})]
											}),
											/* @__PURE__ */ jsxs("div", {
												className: "relative",
												children: [
													/* @__PURE__ */ jsx(Lock, { className: "w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" }),
													/* @__PURE__ */ jsx("input", {
														type: showPassword ? "text" : "password",
														value: data.password,
														onChange: (e) => setData("password", e.target.value),
														placeholder: "•••••••••",
														autoComplete: "current-password",
														className: `w-full bg-slate-50/60 hover:bg-slate-50 focus:bg-white border rounded-xl pl-8 pr-9 py-2 text-xs text-slate-800 placeholder:text-slate-400 focus:outline-none transition-all font-normal ${errors.password ? "border-rose-300 focus:border-rose-500 focus:ring-1 focus:ring-rose-500/20" : "border-slate-200 focus:border-slate-300 focus:ring-2 focus:ring-violet-500/10"}`
													}),
													/* @__PURE__ */ jsx("button", {
														type: "button",
														onClick: () => setShowPassword(!showPassword),
														className: "absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600 transition-colors cursor-pointer",
														tabIndex: -1,
														children: showPassword ? /* @__PURE__ */ jsx(EyeOff, { className: "w-3.5 h-3.5" }) : /* @__PURE__ */ jsx(Eye, { className: "w-3.5 h-3.5" })
													})
												]
											}),
											errors.password && /* @__PURE__ */ jsxs("p", {
												className: "text-[11px] text-rose-600 flex items-center gap-1 font-normal mt-1",
												children: [/* @__PURE__ */ jsx(AlertCircle, { className: "w-3 h-3 shrink-0" }), /* @__PURE__ */ jsx("span", { children: errors.password })]
											})
										]
									}),
									/* @__PURE__ */ jsx("div", {
										className: "flex items-center justify-between pt-0.5",
										children: /* @__PURE__ */ jsxs("label", {
											className: "flex items-center gap-2 text-xs text-slate-600 cursor-pointer",
											children: [/* @__PURE__ */ jsx("input", {
												type: "checkbox",
												checked: data.remember,
												onChange: (e) => setData("remember", e.target.checked),
												className: "w-3.5 h-3.5 rounded border-slate-300 text-slate-900 focus:ring-slate-900"
											}), /* @__PURE__ */ jsx("span", {
												className: "font-normal",
												children: "Keep me signed in"
											})]
										})
									}),
									/* @__PURE__ */ jsx("button", {
										type: "submit",
										disabled: processing || demoLoading !== null,
										className: "w-full mt-2 py-2.5 px-4 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-medium flex items-center justify-center gap-2 transition-all cursor-pointer disabled:opacity-60",
										children: processing && demoLoading === null ? /* @__PURE__ */ jsxs(Fragment, { children: [/* @__PURE__ */ jsx("div", { className: "w-3.5 h-3.5 border-2 border-white/60 border-t-white rounded-full animate-spin" }), /* @__PURE__ */ jsx("span", { children: "Authenticating..." })] }) : /* @__PURE__ */ jsxs(Fragment, { children: [/* @__PURE__ */ jsxs("span", { children: ["Sign In to ", selectedRole === "mr" ? "MR Portal" : "Admin Panel"] }), /* @__PURE__ */ jsx(ArrowRight, { className: "w-3.5 h-3.5 text-violet-400" })] })
									})
								]
							}), /* @__PURE__ */ jsxs("div", {
								className: "pt-3 border-t border-slate-100 space-y-2",
								children: [/* @__PURE__ */ jsxs("div", {
									className: "flex items-center justify-between text-[11px] text-slate-400 font-normal",
									children: [/* @__PURE__ */ jsx("span", { children: "1-Click Fast Login" }), /* @__PURE__ */ jsx("span", {
										className: "font-mono text-[10px] text-violet-600 bg-violet-50 px-1.5 py-0.2 rounded",
										children: "Demo Ready"
									})]
								}), /* @__PURE__ */ jsxs("div", {
									className: "grid grid-cols-2 gap-2",
									children: [/* @__PURE__ */ jsxs("button", {
										type: "button",
										disabled: processing || demoLoading !== null,
										onClick: () => handleQuickLogin("mr"),
										className: "py-1.5 px-2.5 rounded-xl border border-slate-200/80 hover:bg-slate-50 text-slate-700 text-xs font-medium flex items-center justify-center gap-1.5 transition-colors cursor-pointer disabled:opacity-50",
										title: "Sign in as Medical Representative",
										children: [demoLoading === "mr" ? /* @__PURE__ */ jsx("div", { className: "w-3 h-3 border-2 border-slate-400 border-t-slate-800 rounded-full animate-spin" }) : /* @__PURE__ */ jsx(Stethoscope, { className: "w-3.5 h-3.5 text-violet-600" }), /* @__PURE__ */ jsx("span", { children: "Demo MR" })]
									}), /* @__PURE__ */ jsxs("button", {
										type: "button",
										disabled: processing || demoLoading !== null,
										onClick: () => handleQuickLogin("admin"),
										className: "py-1.5 px-2.5 rounded-xl border border-slate-200/80 hover:bg-slate-50 text-slate-700 text-xs font-medium flex items-center justify-center gap-1.5 transition-colors cursor-pointer disabled:opacity-50",
										title: "Sign in as System Admin",
										children: [demoLoading === "admin" ? /* @__PURE__ */ jsx("div", { className: "w-3 h-3 border-2 border-slate-400 border-t-slate-800 rounded-full animate-spin" }) : /* @__PURE__ */ jsx(ShieldCheck, { className: "w-3.5 h-3.5 text-indigo-600" }), /* @__PURE__ */ jsx("span", { children: "Demo Admin" })]
									})]
								})]
							})]
						}),
						/* @__PURE__ */ jsx("div", {
							className: "text-center",
							children: /* @__PURE__ */ jsx("p", {
								className: "text-[11px] text-slate-400 font-normal",
								children: "Protected by 256-bit encryption • ISO 9001:2015 Compliant"
							})
						})
					]
				})
			}),
			/* @__PURE__ */ jsxs("footer", {
				className: "max-w-6xl w-full mx-auto py-3 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-2 text-[11px] text-slate-400 font-normal",
				children: [/* @__PURE__ */ jsxs("span", { children: [
					"© ",
					(/* @__PURE__ */ new Date()).getFullYear(),
					" ",
					companyName,
					". All rights reserved."
				] }), /* @__PURE__ */ jsxs("div", {
					className: "flex items-center gap-4",
					children: [/* @__PURE__ */ jsx(Link, {
						href: "/quality",
						className: "hover:text-slate-600 transition-colors",
						children: "Quality Assurance"
					}), /* @__PURE__ */ jsx(Link, {
						href: "/contact",
						className: "hover:text-slate-600 transition-colors",
						children: "Support"
					})]
				})]
			})
		]
	});
}
//#endregion
//#region resources/js/layouts/MR/MRSidebar.jsx
function MRSidebar({ isOpen, onClose }) {
	const { url, props } = usePage();
	const currentPath = url.split("?")[0];
	const authUser = props.auth?.user;
	const userName = authUser?.name || "Medical Representative";
	authUser?.email;
	const [searchQuery, setSearchQuery] = useState("");
	const isParentActive = (prefix) => currentPath.startsWith(prefix);
	const navigationSections = [
		{
			title: "Workspace",
			items: [
				{
					name: "Dashboard",
					path: "/mr/dashboard",
					icon: LayoutDashboard,
					active: currentPath === "/mr/dashboard" || currentPath === "/mr"
				},
				{
					name: "Doctor Directory",
					path: "/mr/doctors",
					icon: Users,
					active: isParentActive("/mr/doctors")
				},
				{
					name: "Calls & Visits Planner",
					path: "/mr/visits",
					icon: Calendar,
					active: isParentActive("/mr/visits")
				},
				{
					name: "Product Formulations",
					path: "/mr/products",
					icon: Package,
					active: isParentActive("/mr/products")
				}
			]
		},
		{
			title: "Employee & Field",
			items: [
				{
					name: "Employee Assign",
					path: "/mrconnect/employee-assign",
					icon: Users,
					active: isParentActive("/mrconnect/employee-assign")
				},
				{
					name: "Tour Plan",
					path: "/mrconnect/tour-plan",
					icon: Globe,
					active: isParentActive("/mrconnect/tour-plan")
				},
				{
					name: "Field Expenses",
					path: "/mrconnect/field-expenses",
					icon: Receipt,
					active: isParentActive("/mrconnect/field-expenses")
				},
				{
					name: "Leave",
					path: "/mrconnect/leave",
					icon: Calendar,
					active: isParentActive("/mrconnect/leave")
				}
			]
		},
		{
			title: "Sales & Targets",
			items: [
				{
					name: "Primary Sales",
					path: "/mrconnect/primary-sales",
					icon: TrendingUp,
					active: isParentActive("/mrconnect/primary-sales")
				},
				{
					name: "POB Order",
					path: "/mrconnect/pob-order",
					icon: Package,
					active: isParentActive("/mrconnect/pob-order")
				},
				{
					name: "Set Target",
					path: "/mrconnect/set-target",
					icon: Target,
					active: isParentActive("/mrconnect/set-target")
				}
			]
		},
		{
			title: "Media & Alert",
			items: [
				{
					name: "E-Detailing",
					path: "/mr/detailing",
					icon: Presentation,
					active: isParentActive("/mr/detailing")
				},
				{
					name: "Video Library",
					path: "/mrconnect/video-library",
					icon: Film,
					active: isParentActive("/mrconnect/video-library")
				},
				{
					name: "Slider",
					path: "/mrconnect/slider",
					icon: Sliders,
					active: isParentActive("/mrconnect/slider")
				},
				{
					name: "Notice / Announcement",
					path: "/mrconnect/notice",
					icon: Bell,
					active: isParentActive("/mrconnect/notice")
				}
			]
		},
		{
			title: "Sponsorship & Schemes",
			items: [{
				name: "Sponsor",
				path: "/mrconnect/sponsor",
				icon: Handshake,
				active: isParentActive("/mrconnect/sponsor")
			}, {
				name: "Scheme",
				path: "/mrconnect/scheme",
				icon: Percent,
				active: isParentActive("/mrconnect/scheme")
			}]
		},
		{
			title: "HR & Reports",
			items: [{
				name: "HR Directory",
				path: "/mrconnect/hr-section",
				icon: UserCheck,
				active: isParentActive("/mrconnect/hr-section")
			}, {
				name: "All Reports",
				path: "/mrconnect/all-reports",
				icon: FileText,
				active: isParentActive("/mrconnect/all-reports")
			}]
		}
	];
	return /* @__PURE__ */ jsxs(Fragment, { children: [isOpen && /* @__PURE__ */ jsx("div", {
		onClick: onClose,
		className: "fixed inset-0 bg-slate-900/40 backdrop-blur-xs z-40 lg:hidden transition-opacity",
		"aria-hidden": "true"
	}), /* @__PURE__ */ jsxs("aside", {
		className: `fixed top-0 bottom-0 left-0 z-50 w-64 bg-[#fbfbfd] border-r border-slate-200/80 flex flex-col transition-transform duration-200 ease-in-out lg:translate-x-0 ${isOpen ? "translate-x-0" : "-translate-x-full"}`,
		children: [
			/* @__PURE__ */ jsxs("div", {
				className: "h-16 px-4 border-b border-slate-100 flex items-center justify-between",
				children: [/* @__PURE__ */ jsxs(Link, {
					href: "/mr/dashboard",
					className: "flex items-center gap-2.5 px-2 py-1.5 rounded-xl hover:bg-slate-200/60 transition-colors group cursor-pointer",
					children: [/* @__PURE__ */ jsx("div", {
						className: "w-7 h-7 rounded-lg bg-slate-900 text-white flex items-center justify-center font-semibold text-xs",
						children: "MR"
					}), /* @__PURE__ */ jsxs("div", {
						className: "flex items-center gap-1.5",
						children: [/* @__PURE__ */ jsx("span", {
							className: "text-xs font-semibold text-slate-800 tracking-tight",
							children: "Ciplon MR"
						}), /* @__PURE__ */ jsx(ChevronDown, { className: "w-3.5 h-3.5 text-slate-400 group-hover:text-slate-700 transition-colors" })]
					})]
				}), /* @__PURE__ */ jsxs("div", {
					className: "flex items-center gap-1",
					children: [/* @__PURE__ */ jsxs(Link, {
						href: "/mrconnect/notice",
						className: "p-1.5 rounded-lg text-slate-400 hover:text-slate-800 hover:bg-slate-200/60 transition-colors relative",
						title: "Notices & Announcements",
						children: [/* @__PURE__ */ jsx(Bell, { className: "w-4 h-4" }), /* @__PURE__ */ jsx("span", { className: "w-1.5 h-1.5 bg-violet-600 rounded-full absolute top-1.5 right-1.5 ring-2 ring-white" })]
					}), /* @__PURE__ */ jsx("button", {
						type: "button",
						onClick: onClose,
						className: "p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 lg:hidden cursor-pointer",
						"aria-label": "Close sidebar",
						children: /* @__PURE__ */ jsx(X, { className: "w-4 h-4" })
					})]
				})]
			}),
			/* @__PURE__ */ jsx("div", {
				className: "p-3",
				children: /* @__PURE__ */ jsxs("div", {
					className: "relative",
					children: [
						/* @__PURE__ */ jsx(Search, { className: "w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" }),
						/* @__PURE__ */ jsx("input", {
							type: "text",
							value: searchQuery,
							onChange: (e) => setSearchQuery(e.target.value),
							placeholder: "Search & commands",
							className: "w-full bg-slate-200/60 hover:bg-slate-200/80 focus:bg-white border border-transparent focus:border-slate-300 rounded-xl pl-8 pr-8 py-1.5 text-xs text-slate-800 placeholder:text-slate-400 focus:outline-none transition-all font-normal"
						}),
						/* @__PURE__ */ jsx("span", {
							className: "absolute right-2.5 top-1/2 -translate-y-1/2 text-[10px] font-mono text-slate-400 bg-white border border-slate-200 px-1 py-0.2 rounded",
							children: "⌘K"
						})
					]
				})
			}),
			/* @__PURE__ */ jsx("div", {
				className: "flex-1 overflow-y-auto px-3 py-1 space-y-4",
				children: navigationSections.map((section) => {
					const filteredItems = section.items.filter((item) => item.name.toLowerCase().includes(searchQuery.toLowerCase()));
					if (filteredItems.length === 0) return null;
					return /* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("div", {
						className: "px-2.5 pb-1.5 text-[10px] font-medium uppercase tracking-wider text-slate-400",
						children: section.title
					}), /* @__PURE__ */ jsx("div", {
						className: "space-y-0.5",
						children: filteredItems.map((item) => {
							const Icon = item.icon;
							return /* @__PURE__ */ jsxs(Link, {
								href: item.path,
								onClick: () => {
									if (isOpen && typeof onClose === "function") onClose();
								},
								className: `flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-medium transition-all cursor-pointer ${item.active ? "bg-slate-900 text-white font-medium" : "text-slate-600 hover:text-slate-900 hover:bg-slate-200/50"}`,
								children: [/* @__PURE__ */ jsx(Icon, { className: `w-4 h-4 ${item.active ? "text-violet-400 stroke-[2]" : "text-slate-400"}` }), /* @__PURE__ */ jsx("span", {
									className: "flex-1 truncate",
									children: item.name
								})]
							}, item.path);
						})
					})] }, section.title);
				})
			}),
			/* @__PURE__ */ jsx("div", {
				className: "p-3 border-t border-slate-100 bg-white",
				children: /* @__PURE__ */ jsxs("div", {
					className: "p-2 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-between gap-2",
					children: [/* @__PURE__ */ jsxs("div", {
						className: "flex items-center gap-2 min-w-0",
						children: [/* @__PURE__ */ jsx("div", {
							className: "w-7 h-7 rounded-full bg-slate-900 text-white font-semibold text-xs flex items-center justify-center shrink-0",
							children: userName.charAt(0).toUpperCase()
						}), /* @__PURE__ */ jsxs("div", {
							className: "min-w-0 flex-1",
							children: [/* @__PURE__ */ jsx("span", {
								className: "block text-xs font-semibold text-slate-800 truncate leading-tight",
								children: userName
							}), /* @__PURE__ */ jsx("span", {
								className: "block text-[10px] text-slate-400 font-normal truncate",
								children: "Field Representative"
							})]
						})]
					}), /* @__PURE__ */ jsx("button", {
						type: "button",
						onClick: () => router.post("/logout"),
						className: "p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer",
						title: "Sign Out",
						children: /* @__PURE__ */ jsx(LogOut, { className: "w-3.5 h-3.5" })
					})]
				})
			})
		]
	})] });
}
//#endregion
//#region resources/js/services/api.js
var api = axios.create({
	baseURL: "/",
	headers: {
		"X-Requested-With": "XMLHttpRequest",
		"Accept": "application/json"
	},
	withCredentials: true
});
//#endregion
//#region resources/js/layouts/MR/MRHeader.jsx
function MRHeader({ onToggleSidebar, title = "MR Dashboard" }) {
	const { props } = usePage();
	const authUser = props.auth?.user || {};
	const userName = authUser.name || "Medical Representative";
	const userEmail = authUser.email || "mr@ciplon.com";
	const [dropdownOpen, setDropdownOpen] = useState(false);
	const [gpsStatus, setGpsStatus] = useState("idle");
	const [lastAccuracy, setLastAccuracy] = useState(null);
	const dropdownRef = useRef(null);
	const syncLiveLocation = async (manual = false) => {
		if (!navigator.geolocation) {
			if (manual) toast.error("Geolocation is not supported by your browser.");
			setGpsStatus("error");
			return;
		}
		setGpsStatus("syncing");
		navigator.geolocation.getCurrentPosition(async (pos) => {
			try {
				const lat = pos.coords.latitude;
				const lng = pos.coords.longitude;
				const acc = Math.round(pos.coords.accuracy);
				const spd = pos.coords.speed || 0;
				let batteryLevel = 85;
				let batteryStatus = "discharging";
				if ("getBattery" in navigator) try {
					const b = await navigator.getBattery();
					batteryLevel = Math.round(b.level * 100);
					batteryStatus = b.charging ? "charging" : "discharging";
				} catch (e) {}
				await api.post("/api/v1/mr/location", {
					latitude: lat,
					longitude: lng,
					accuracy: acc,
					speed: spd,
					battery_level: batteryLevel,
					battery_status: batteryStatus,
					current_activity: spd > 3 ? "travelling" : "in_field"
				});
				setGpsStatus("active");
				setLastAccuracy(acc);
				if (manual) toast.success(`GPS Location Synced (~${acc}m accuracy)`);
			} catch (err) {
				setGpsStatus("error");
				if (manual) toast.error("Failed to sync GPS with admin.");
			}
		}, (err) => {
			setGpsStatus("error");
			if (manual) {
				if (err.code === 1) toast.error("Location permission denied. Please allow location in browser.");
				else toast.error("Unable to retrieve GPS position.");
			}
		}, {
			enableHighAccuracy: true,
			timeout: 1e4,
			maximumAge: 0
		});
	};
	useEffect(() => {
		syncLiveLocation(false);
		const interval = setInterval(() => {
			syncLiveLocation(false);
		}, 45e3);
		return () => clearInterval(interval);
	}, []);
	useEffect(() => {
		function handleClickOutside(event) {
			if (dropdownRef.current && !dropdownRef.current.contains(event.target)) setDropdownOpen(false);
		}
		document.addEventListener("mousedown", handleClickOutside);
		return () => document.removeEventListener("mousedown", handleClickOutside);
	}, []);
	return /* @__PURE__ */ jsxs("header", {
		className: "h-16 bg-white/90 backdrop-blur-md border-b border-slate-200/80 px-4 sm:px-6 flex items-center justify-between sticky top-0 z-30",
		children: [/* @__PURE__ */ jsxs("div", {
			className: "flex items-center gap-3 min-w-0",
			children: [/* @__PURE__ */ jsx("button", {
				type: "button",
				onClick: onToggleSidebar,
				className: "p-1.5 rounded-xl text-slate-600 hover:text-slate-900 hover:bg-slate-100 lg:hidden cursor-pointer",
				"aria-label": "Open sidebar",
				children: /* @__PURE__ */ jsx(Menu, { className: "w-5 h-5" })
			}), /* @__PURE__ */ jsx("div", {
				className: "flex items-center gap-2",
				children: /* @__PURE__ */ jsx("h1", {
					className: "text-sm sm:text-base font-semibold text-slate-800 tracking-tight truncate",
					children: title
				})
			})]
		}), /* @__PURE__ */ jsxs("div", {
			className: "flex items-center gap-2 sm:gap-2.5",
			children: [
				/* @__PURE__ */ jsxs("button", {
					type: "button",
					onClick: () => syncLiveLocation(true),
					title: "Click to sync current GPS coordinates with admin",
					className: `inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl text-[11px] font-medium transition-all cursor-pointer ${gpsStatus === "active" ? "bg-emerald-50 text-emerald-700 border border-emerald-200/60 hover:bg-emerald-100" : gpsStatus === "syncing" ? "bg-sky-50 text-sky-700 border border-sky-200/60" : "bg-slate-100 text-slate-600 hover:bg-slate-200"}`,
					children: [
						gpsStatus === "syncing" ? /* @__PURE__ */ jsx(Loader2, { className: "w-3 h-3 animate-spin text-sky-600" }) : gpsStatus === "active" ? /* @__PURE__ */ jsxs("span", {
							className: "relative flex h-2 w-2",
							children: [/* @__PURE__ */ jsx("span", { className: "animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" }), /* @__PURE__ */ jsx("span", { className: "relative inline-flex rounded-full h-2 w-2 bg-emerald-500" })]
						}) : /* @__PURE__ */ jsx(Navigation, { className: "w-3 h-3 text-slate-500" }),
						/* @__PURE__ */ jsx("span", {
							className: "hidden md:inline",
							children: gpsStatus === "active" ? `GPS Live (~${lastAccuracy || 10}m)` : gpsStatus === "syncing" ? "Syncing GPS..." : "Sync GPS"
						}),
						/* @__PURE__ */ jsx("span", {
							className: "md:hidden",
							children: "GPS"
						})
					]
				}),
				/* @__PURE__ */ jsxs(Link, {
					href: "/mr/detailing",
					className: "hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium bg-violet-50 text-violet-700 hover:bg-violet-100 border border-violet-200/60 transition-colors",
					children: [/* @__PURE__ */ jsx(Sparkles, { className: "w-3.5 h-3.5" }), /* @__PURE__ */ jsx("span", { children: "E-Detailing" })]
				}),
				/* @__PURE__ */ jsxs(Link, {
					href: "/",
					className: "hidden md:inline-flex items-center gap-1 text-xs font-normal text-slate-500 hover:text-slate-800 px-2.5 py-1.5 rounded-lg hover:bg-slate-100 transition-colors",
					children: [/* @__PURE__ */ jsx("span", { children: "Website" }), /* @__PURE__ */ jsx(ExternalLink, { className: "w-3 h-3 text-slate-400" })]
				}),
				/* @__PURE__ */ jsxs("div", {
					className: "relative pl-1",
					ref: dropdownRef,
					children: [/* @__PURE__ */ jsxs("button", {
						type: "button",
						onClick: () => setDropdownOpen(!dropdownOpen),
						className: "flex items-center gap-2 p-1 pl-1.5 pr-2 rounded-xl hover:bg-slate-100 transition-colors cursor-pointer text-left border border-slate-200/60",
						children: [
							/* @__PURE__ */ jsx("div", {
								className: "w-6 h-6 rounded-lg bg-slate-900 text-white flex items-center justify-center text-[11px] font-semibold",
								children: userName.charAt(0).toUpperCase()
							}),
							/* @__PURE__ */ jsx("span", {
								className: "hidden sm:inline-block text-xs font-medium text-slate-700 truncate max-w-[120px]",
								children: userName
							}),
							/* @__PURE__ */ jsx(ChevronDown, { className: "w-3 h-3 text-slate-400" })
						]
					}), dropdownOpen && /* @__PURE__ */ jsxs("div", {
						className: "absolute right-0 mt-2 w-52 bg-white rounded-2xl border border-slate-200 shadow-xl py-1.5 z-50 text-xs font-normal",
						children: [/* @__PURE__ */ jsxs("div", {
							className: "px-3.5 py-2.5 border-b border-slate-100",
							children: [
								/* @__PURE__ */ jsx("span", {
									className: "block font-semibold text-slate-800 truncate",
									children: userName
								}),
								/* @__PURE__ */ jsx("span", {
									className: "block text-[11px] text-slate-400 truncate font-light",
									children: userEmail
								}),
								/* @__PURE__ */ jsx("span", {
									className: "inline-block text-[10px] font-medium text-violet-700 bg-violet-50 px-2 py-0.5 rounded-full mt-1.5",
									children: "Field Representative"
								})
							]
						}), /* @__PURE__ */ jsx("div", {
							className: "py-1",
							children: /* @__PURE__ */ jsxs(Link, {
								href: "/logout",
								method: "post",
								as: "button",
								className: "w-full flex items-center gap-2 px-3.5 py-2 text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer text-left font-medium",
								children: [/* @__PURE__ */ jsx(LogOut, { className: "w-3.5 h-3.5" }), /* @__PURE__ */ jsx("span", { children: "Sign Out" })]
							})
						})]
					})]
				})
			]
		})]
	});
}
//#endregion
//#region resources/js/layouts/MR/MRLayout.jsx
function MRLayout({ children, title = "MR Dashboard" }) {
	const [sidebarOpen, setSidebarOpen] = useState(false);
	const { url } = usePage();
	const currentPath = url.split("?")[0];
	const mobileNav = [
		{
			label: "Dashboard",
			href: "/mr/dashboard",
			icon: LayoutDashboard,
			active: currentPath === "/mr/dashboard"
		},
		{
			label: "Detailing",
			href: "/mr/detailing",
			icon: Presentation,
			active: currentPath.startsWith("/mr/detailing")
		},
		{
			label: "Visits",
			href: "/mr/visits",
			icon: CalendarClock,
			active: currentPath.startsWith("/mr/visits")
		},
		{
			label: "Doctors",
			href: "/mr/doctors",
			icon: UserCheck,
			active: currentPath.startsWith("/mr/doctors")
		},
		{
			label: "Products",
			href: "/mr/products",
			icon: Pill,
			active: currentPath.startsWith("/mr/products")
		}
	];
	return /* @__PURE__ */ jsxs("div", {
		className: "min-h-screen bg-[#f8f9fc] flex antialiased text-slate-800 font-sans",
		children: [
			/* @__PURE__ */ jsx(MRSidebar, {
				isOpen: sidebarOpen,
				onClose: () => setSidebarOpen(false)
			}),
			/* @__PURE__ */ jsxs("div", {
				className: "flex-1 flex flex-col lg:pl-64 min-w-0 pb-16 lg:pb-0",
				children: [/* @__PURE__ */ jsx(MRHeader, {
					onToggleSidebar: () => setSidebarOpen(!sidebarOpen),
					title
				}), /* @__PURE__ */ jsx("main", {
					className: "flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto",
					children
				})]
			}),
			/* @__PURE__ */ jsx("nav", {
				className: "lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-slate-200/80 px-2 py-1.5 flex items-center justify-around shadow-lg",
				children: mobileNav.map((item) => {
					const Icon = item.icon;
					return /* @__PURE__ */ jsxs(Link, {
						href: item.href,
						className: `flex flex-col items-center justify-center py-1 px-3 rounded-xl text-[10px] font-medium transition-colors ${item.active ? "text-violet-700 font-semibold" : "text-slate-400 hover:text-slate-700"}`,
						children: [/* @__PURE__ */ jsx(Icon, { className: `w-5 h-5 mb-0.5 ${item.active ? "text-violet-700 stroke-[2]" : "text-slate-400"}` }), /* @__PURE__ */ jsx("span", { children: item.label })]
					}, item.label);
				})
			})
		]
	});
}
//#endregion
//#region resources/js/Pages/mr/Dashboard.jsx
var Dashboard_exports = /* @__PURE__ */ __exportAll({ default: () => Dashboard });
function Dashboard({ initialData = null }) {
	const { props } = usePage();
	const userName = props.auth?.user?.name || "Representative";
	const [dashboardData, setDashboardData] = useState(initialData);
	const [loading, setLoading] = useState(false);
	const [activeFilter, setActiveFilter] = useState("all");
	const refreshData = async () => {
		setLoading(true);
		try {
			const response = await api.get("/api/v1/mr/dashboard");
			if (response.data?.success) setDashboardData(response.data.data);
		} catch {
			router.reload({ only: ["initialData"] });
		} finally {
			setLoading(false);
		}
	};
	const summary = dashboardData?.summary || {
		today_visits: 0,
		completed_visits: 0,
		pending_visits: 0,
		follow_ups_due: 0
	};
	const performance = dashboardData?.performance || {
		visits: {
			completed: 0,
			target: 0
		},
		doctors: {
			covered: 0,
			target: 0
		},
		product_promotions: {
			completed: 0,
			target: 0
		},
		achievement: 0
	};
	const todayVisits = dashboardData?.today_visits || [];
	const upcomingFollowups = dashboardData?.upcoming_followups || [];
	const filteredDecks = [
		{
			id: "brand-overview",
			title: "Company Overview & Trust",
			category: "Brand Heritage",
			tag: "ISO 9001:2015",
			image: "/images/ciplon_logo.png",
			isLogo: true,
			slidesCount: "Fixed #1",
			description: "Corporate accreditations, manufacturing standards, and clinical heritage."
		},
		{
			id: "amoxiclav",
			title: "AmoxiClav 625 Duo",
			category: "Antibiotics",
			tag: "Amoxicillin + Clavulanic",
			image: "/images/box_factocel_ix.jpg",
			slidesCount: "12 Slides",
			description: "Broad spectrum bactericidal coverage with beta-lactamase inhibitor."
		},
		{
			id: "ciplocid-dsr",
			title: "Ciplocid-DSR Capsules",
			category: "Gastroenterology",
			tag: "Rabeprazole + Domperidone",
			image: "/images/box_globucel_sc.jpg",
			slidesCount: "8 Slides",
			description: "Dual-action sustained release for GERD, dyspepsia, and acid reflux."
		},
		{
			id: "cardiovast",
			title: "Cardiovast 20",
			category: "Cardiology Care",
			tag: "Atorvastatin Calcium IP",
			image: "/images/box_fibrogen_i.jpg",
			slidesCount: "10 Slides",
			description: "Lipid-lowering HMG-CoA reductase inhibitor for cardiovascular prevention."
		},
		{
			id: "aerobreathe",
			title: "AeroBreathe 200 Inhaler",
			category: "Pulmonology",
			tag: "Budesonide + Formoterol",
			image: "/images/box_globucel_sc.jpg",
			slidesCount: "14 Slides",
			description: "Rapid onset bronchodilator with anti-inflammatory corticosteroid control."
		},
		{
			id: "ciplonpara",
			title: "CiplonPara 650",
			category: "Analgesics",
			tag: "Paracetamol Tablets IP",
			image: "/images/box_factocel_ix.jpg",
			slidesCount: "6 Slides",
			description: "Fast acting antipyretic & analgesic therapy for fever and pain relief."
		}
	].filter((deck) => {
		if (activeFilter === "antibiotics") return deck.category === "Antibiotics";
		if (activeFilter === "chronic") return deck.category === "Cardiology Care" || deck.category === "Pulmonology";
		return true;
	});
	return /* @__PURE__ */ jsx(MRLayout, {
		title: "MR Dashboard",
		children: /* @__PURE__ */ jsxs("div", {
			className: "space-y-6 pb-12 font-sans max-w-[1400px] mx-auto text-slate-800",
			children: [
				/* @__PURE__ */ jsxs("div", {
					className: "flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-200/80",
					children: [/* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("h2", {
						className: "text-xl sm:text-2xl font-semibold tracking-tight text-slate-800",
						children: "Field Operations Dashboard"
					}), /* @__PURE__ */ jsxs("p", {
						className: "text-xs text-slate-500 font-normal mt-0.5",
						children: [
							"Welcome back, ",
							/* @__PURE__ */ jsx("strong", {
								className: "font-semibold text-slate-700",
								children: userName
							}),
							". Track your doctor visits, detailing decks, and territory route plan."
						]
					})] }), /* @__PURE__ */ jsxs("div", {
						className: "flex items-center gap-2",
						children: [/* @__PURE__ */ jsxs("button", {
							type: "button",
							onClick: refreshData,
							disabled: loading,
							className: "inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-700 bg-white border border-slate-200/80 hover:bg-slate-50 rounded-xl transition-colors cursor-pointer disabled:opacity-50",
							title: "Refresh Dashboard",
							children: [/* @__PURE__ */ jsx(RefreshCw, { className: `w-3.5 h-3.5 ${loading ? "animate-spin text-slate-900" : "text-slate-500"}` }), /* @__PURE__ */ jsx("span", { children: "Refresh" })]
						}), /* @__PURE__ */ jsxs(Link, {
							href: "/mr/visits",
							className: "inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-medium text-white bg-slate-900 hover:bg-slate-800 rounded-xl transition-colors cursor-pointer",
							children: [/* @__PURE__ */ jsx(Calendar, { className: "w-3.5 h-3.5" }), /* @__PURE__ */ jsx("span", { children: "Daily Planner" })]
						})]
					})]
				}),
				/* @__PURE__ */ jsxs("div", {
					className: "grid grid-cols-2 lg:grid-cols-4 gap-4",
					children: [
						/* @__PURE__ */ jsxs("div", {
							className: "bg-white rounded-2xl border border-slate-200/80 p-5 space-y-2",
							children: [
								/* @__PURE__ */ jsxs("div", {
									className: "flex items-center justify-between",
									children: [/* @__PURE__ */ jsx("span", {
										className: "text-xs font-medium text-slate-500",
										children: "Today's Visits"
									}), /* @__PURE__ */ jsx("span", {
										className: "w-7 h-7 rounded-lg bg-slate-100 text-slate-700 flex items-center justify-center font-semibold text-xs",
										children: /* @__PURE__ */ jsx(Users, { className: "w-3.5 h-3.5" })
									})]
								}),
								/* @__PURE__ */ jsx("p", {
									className: "text-2xl font-semibold text-slate-800",
									children: summary.today_visits
								}),
								/* @__PURE__ */ jsx("p", {
									className: "text-[11px] text-slate-400 font-normal",
									children: "Scheduled practitioner appointments"
								})
							]
						}),
						/* @__PURE__ */ jsxs("div", {
							className: "bg-white rounded-2xl border border-slate-200/80 p-5 space-y-2",
							children: [
								/* @__PURE__ */ jsxs("div", {
									className: "flex items-center justify-between",
									children: [/* @__PURE__ */ jsx("span", {
										className: "text-xs font-medium text-slate-500",
										children: "Completed Calls"
									}), /* @__PURE__ */ jsx("span", {
										className: "w-7 h-7 rounded-lg bg-emerald-50 text-emerald-700 border border-emerald-100 flex items-center justify-center font-semibold text-xs",
										children: /* @__PURE__ */ jsx(CheckCircle2, { className: "w-3.5 h-3.5" })
									})]
								}),
								/* @__PURE__ */ jsx("p", {
									className: "text-2xl font-semibold text-emerald-700",
									children: summary.completed_visits
								}),
								/* @__PURE__ */ jsx("p", {
									className: "text-[11px] text-emerald-600 font-medium",
									children: "Logged & verified calls"
								})
							]
						}),
						/* @__PURE__ */ jsxs("div", {
							className: "bg-white rounded-2xl border border-slate-200/80 p-5 space-y-2",
							children: [
								/* @__PURE__ */ jsxs("div", {
									className: "flex items-center justify-between",
									children: [/* @__PURE__ */ jsx("span", {
										className: "text-xs font-medium text-slate-500",
										children: "Pending Visits"
									}), /* @__PURE__ */ jsx("span", {
										className: "w-7 h-7 rounded-lg bg-amber-50 text-amber-700 border border-amber-100 flex items-center justify-center font-semibold text-xs",
										children: /* @__PURE__ */ jsx(Clock, { className: "w-3.5 h-3.5" })
									})]
								}),
								/* @__PURE__ */ jsx("p", {
									className: "text-2xl font-semibold text-amber-700",
									children: summary.pending_visits
								}),
								/* @__PURE__ */ jsx("p", {
									className: "text-[11px] text-amber-600 font-medium",
									children: "Scheduled for today"
								})
							]
						}),
						/* @__PURE__ */ jsxs("div", {
							className: "bg-white rounded-2xl border border-slate-200/80 p-5 space-y-2",
							children: [
								/* @__PURE__ */ jsxs("div", {
									className: "flex items-center justify-between",
									children: [/* @__PURE__ */ jsx("span", {
										className: "text-xs font-medium text-slate-500",
										children: "Monthly Coverage"
									}), /* @__PURE__ */ jsx("span", {
										className: "w-7 h-7 rounded-lg bg-violet-50 text-violet-700 border border-violet-100 flex items-center justify-center font-semibold text-xs",
										children: /* @__PURE__ */ jsx(Award, { className: "w-3.5 h-3.5" })
									})]
								}),
								/* @__PURE__ */ jsxs("p", {
									className: "text-2xl font-semibold text-violet-700",
									children: [performance.achievement, "%"]
								}),
								/* @__PURE__ */ jsxs("p", {
									className: "text-[11px] text-slate-400 font-normal",
									children: [
										performance.doctors.covered,
										" of ",
										performance.doctors.target,
										" Doctors covered"
									]
								})
							]
						})
					]
				}),
				/* @__PURE__ */ jsxs("div", {
					className: "grid grid-cols-1 sm:grid-cols-3 gap-3",
					children: [
						/* @__PURE__ */ jsxs(Link, {
							href: "/mr/detailing",
							className: "p-3.5 rounded-2xl bg-white border border-slate-200/80 hover:bg-slate-50 transition-colors flex items-center justify-between group cursor-pointer",
							children: [/* @__PURE__ */ jsxs("div", {
								className: "flex items-center gap-3",
								children: [/* @__PURE__ */ jsx("div", {
									className: "w-8 h-8 rounded-xl bg-slate-100 text-slate-700 flex items-center justify-center",
									children: /* @__PURE__ */ jsx(Presentation, { className: "w-4 h-4" })
								}), /* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("span", {
									className: "block text-xs font-semibold text-slate-800",
									children: "Doctor E-Detailing"
								}), /* @__PURE__ */ jsx("span", {
									className: "block text-[11px] text-slate-400",
									children: "Launch interactive slide deck"
								})] })]
							}), /* @__PURE__ */ jsx(ChevronRight, { className: "w-4 h-4 text-slate-400 group-hover:text-slate-700 transition-colors" })]
						}),
						/* @__PURE__ */ jsxs(Link, {
							href: "/mrconnect/pob-order",
							className: "p-3.5 rounded-2xl bg-white border border-slate-200/80 hover:bg-slate-50 transition-colors flex items-center justify-between group cursor-pointer",
							children: [/* @__PURE__ */ jsxs("div", {
								className: "flex items-center gap-3",
								children: [/* @__PURE__ */ jsx("div", {
									className: "w-8 h-8 rounded-xl bg-slate-100 text-slate-700 flex items-center justify-center",
									children: /* @__PURE__ */ jsx(Package, { className: "w-4 h-4" })
								}), /* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("span", {
									className: "block text-xs font-semibold text-slate-800",
									children: "Book POB Order"
								}), /* @__PURE__ */ jsx("span", {
									className: "block text-[11px] text-slate-400",
									children: "Personal chemist orders"
								})] })]
							}), /* @__PURE__ */ jsx(ChevronRight, { className: "w-4 h-4 text-slate-400 group-hover:text-slate-700 transition-colors" })]
						}),
						/* @__PURE__ */ jsxs(Link, {
							href: "/mrconnect/tour-plan",
							className: "p-3.5 rounded-2xl bg-white border border-slate-200/80 hover:bg-slate-50 transition-colors flex items-center justify-between group cursor-pointer",
							children: [/* @__PURE__ */ jsxs("div", {
								className: "flex items-center gap-3",
								children: [/* @__PURE__ */ jsx("div", {
									className: "w-8 h-8 rounded-xl bg-slate-100 text-slate-700 flex items-center justify-center",
									children: /* @__PURE__ */ jsx(Calendar, { className: "w-4 h-4" })
								}), /* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("span", {
									className: "block text-xs font-semibold text-slate-800",
									children: "Monthly Tour Plan"
								}), /* @__PURE__ */ jsx("span", {
									className: "block text-[11px] text-slate-400",
									children: "Submit route for approval"
								})] })]
							}), /* @__PURE__ */ jsx(ChevronRight, { className: "w-4 h-4 text-slate-400 group-hover:text-slate-700 transition-colors" })]
						})
					]
				}),
				/* @__PURE__ */ jsxs("div", {
					className: "space-y-4",
					children: [/* @__PURE__ */ jsxs("div", {
						className: "flex flex-col sm:flex-row sm:items-center justify-between gap-3",
						children: [/* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("h3", {
							className: "text-base font-semibold text-slate-800",
							children: "Visual Aid Presentation Decks"
						}), /* @__PURE__ */ jsx("p", {
							className: "text-xs text-slate-400 font-normal",
							children: "Approved digital scientific visual aids for in-clinic physician detailing."
						})] }), /* @__PURE__ */ jsxs("div", {
							className: "flex items-center gap-1.5 p-1 rounded-xl bg-slate-100 border border-slate-200/60 w-fit",
							children: [
								/* @__PURE__ */ jsx("button", {
									type: "button",
									onClick: () => setActiveFilter("all"),
									className: `px-3 py-1 rounded-lg text-xs transition-colors cursor-pointer ${activeFilter === "all" ? "bg-white text-slate-900 font-semibold shadow-2xs" : "text-slate-600 hover:text-slate-900 font-normal"}`,
									children: "All Formulations"
								}),
								/* @__PURE__ */ jsx("button", {
									type: "button",
									onClick: () => setActiveFilter("antibiotics"),
									className: `px-3 py-1 rounded-lg text-xs transition-colors cursor-pointer ${activeFilter === "antibiotics" ? "bg-white text-slate-900 font-semibold shadow-2xs" : "text-slate-600 hover:text-slate-900 font-normal"}`,
									children: "Antibiotics"
								}),
								/* @__PURE__ */ jsx("button", {
									type: "button",
									onClick: () => setActiveFilter("chronic"),
									className: `px-3 py-1 rounded-lg text-xs transition-colors cursor-pointer ${activeFilter === "chronic" ? "bg-white text-slate-900 font-semibold shadow-2xs" : "text-slate-600 hover:text-slate-900 font-normal"}`,
									children: "Cardio & Respiratory"
								})
							]
						})]
					}), /* @__PURE__ */ jsx("div", {
						className: "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4",
						children: filteredDecks.map((deck) => /* @__PURE__ */ jsxs("div", {
							className: "bg-white rounded-2xl border border-slate-200/80 p-5 flex flex-col justify-between space-y-4 hover:border-slate-300 transition-colors",
							children: [/* @__PURE__ */ jsxs("div", {
								className: "space-y-3",
								children: [
									/* @__PURE__ */ jsxs("div", {
										className: "flex items-center justify-between",
										children: [/* @__PURE__ */ jsx("span", {
											className: "px-2 py-0.5 rounded-md text-[10px] font-semibold uppercase bg-slate-100 text-slate-700",
											children: deck.category
										}), /* @__PURE__ */ jsx("span", {
											className: "text-[11px] font-mono text-slate-400",
											children: deck.slidesCount
										})]
									}),
									/* @__PURE__ */ jsx("div", {
										className: "h-28 bg-slate-50 rounded-xl border border-slate-100 p-2 flex items-center justify-center relative overflow-hidden",
										children: /* @__PURE__ */ jsx("img", {
											src: deck.image,
											alt: deck.title,
											className: "max-h-full max-w-full object-contain",
											onError: (e) => {
												e.currentTarget.src = "/images/box_factocel_ix.jpg";
											}
										})
									}),
									/* @__PURE__ */ jsxs("div", { children: [
										/* @__PURE__ */ jsx("h4", {
											className: "text-sm font-semibold text-slate-800",
											children: deck.title
										}),
										/* @__PURE__ */ jsx("p", {
											className: "text-[11px] font-medium text-slate-500 mt-0.5",
											children: deck.tag
										}),
										/* @__PURE__ */ jsx("p", {
											className: "text-xs text-slate-400 line-clamp-2 mt-1 leading-relaxed",
											children: deck.description
										})
									] })
								]
							}), /* @__PURE__ */ jsxs(Link, {
								href: "/mr/detailing",
								className: "w-full py-2 px-3 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-medium flex items-center justify-center gap-1.5 transition-colors cursor-pointer",
								children: [/* @__PURE__ */ jsx(Play, { className: "w-3.5 h-3.5 fill-white" }), /* @__PURE__ */ jsx("span", { children: "Launch Detailing Deck" })]
							})]
						}, deck.id))
					})]
				}),
				dashboardData?.doctor_stops && /* @__PURE__ */ jsxs("div", {
					className: "bg-white rounded-2xl border border-slate-200/80 p-5 space-y-3",
					children: [/* @__PURE__ */ jsxs("div", {
						className: "flex items-center justify-between border-b border-slate-100 pb-3",
						children: [/* @__PURE__ */ jsxs("div", {
							className: "flex items-center gap-2",
							children: [/* @__PURE__ */ jsx(MapPin, { className: "w-4 h-4 text-violet-600" }), /* @__PURE__ */ jsx("h3", {
								className: "text-sm font-semibold text-slate-800",
								children: "Today's Field Route & Doctor Movement"
							})]
						}), /* @__PURE__ */ jsxs("span", {
							className: "text-xs text-slate-400 font-normal",
							children: [
								dashboardData.doctor_stops.visited_count,
								" Visited • ",
								dashboardData.doctor_stops.pending_count,
								" Pending"
							]
						})]
					}), /* @__PURE__ */ jsx(DoctorMovementMap, {
						mapboxConfig: dashboardData.mapbox || {},
						doctorStops: dashboardData.doctor_stops,
						activeMR: null,
						height: "360px"
					})]
				}),
				/* @__PURE__ */ jsxs("div", {
					className: "grid grid-cols-1 lg:grid-cols-2 gap-5",
					children: [/* @__PURE__ */ jsxs("div", {
						className: "bg-white rounded-2xl border border-slate-200/80 p-5 space-y-3",
						children: [/* @__PURE__ */ jsxs("div", {
							className: "flex items-center justify-between pb-3 border-b border-slate-100",
							children: [/* @__PURE__ */ jsxs("h3", {
								className: "text-sm font-semibold text-slate-800 flex items-center gap-2",
								children: [/* @__PURE__ */ jsx(Clock, { className: "w-4 h-4 text-slate-600" }), /* @__PURE__ */ jsx("span", { children: "Today's Doctor Visits" })]
							}), /* @__PURE__ */ jsx(Link, {
								href: "/mr/visits",
								className: "text-xs font-medium text-slate-700 hover:text-slate-900",
								children: "View Planner →"
							})]
						}), todayVisits.length === 0 ? /* @__PURE__ */ jsx("div", {
							className: "py-8 text-center text-slate-400 text-xs",
							children: "No doctor visits scheduled today."
						}) : /* @__PURE__ */ jsx("div", {
							className: "divide-y divide-slate-100",
							children: todayVisits.map((visit, idx) => /* @__PURE__ */ jsxs("div", {
								className: "py-3 flex items-center justify-between text-xs",
								children: [/* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("span", {
									className: "block font-semibold text-slate-800",
									children: visit.doctor
								}), /* @__PURE__ */ jsx("span", {
									className: "text-slate-400 text-[11px]",
									children: visit.hospital
								})] }), /* @__PURE__ */ jsxs("div", {
									className: "text-right",
									children: [/* @__PURE__ */ jsx("span", {
										className: "font-mono text-slate-700 block text-xs",
										children: visit.time
									}), /* @__PURE__ */ jsx("span", {
										className: `inline-block mt-0.5 text-[10px] font-semibold px-2 py-0.5 rounded-md ${visit.status === "Completed" ? "bg-emerald-50 text-emerald-700 border border-emerald-100" : "bg-amber-50 text-amber-700 border border-amber-100"}`,
										children: visit.status
									})]
								})]
							}, idx))
						})]
					}), /* @__PURE__ */ jsxs("div", {
						className: "bg-white rounded-2xl border border-slate-200/80 p-5 space-y-3",
						children: [/* @__PURE__ */ jsxs("div", {
							className: "flex items-center justify-between pb-3 border-b border-slate-100",
							children: [/* @__PURE__ */ jsxs("h3", {
								className: "text-sm font-semibold text-slate-800 flex items-center gap-2",
								children: [/* @__PURE__ */ jsx(CalendarClock, { className: "w-4 h-4 text-slate-600" }), /* @__PURE__ */ jsx("span", { children: "Upcoming Follow-ups" })]
							}), /* @__PURE__ */ jsxs("span", {
								className: "text-xs text-slate-400",
								children: [upcomingFollowups.length, " queued"]
							})]
						}), upcomingFollowups.length === 0 ? /* @__PURE__ */ jsx("div", {
							className: "py-8 text-center text-slate-400 text-xs",
							children: "No follow-ups scheduled."
						}) : /* @__PURE__ */ jsx("div", {
							className: "divide-y divide-slate-100",
							children: upcomingFollowups.map((item, idx) => /* @__PURE__ */ jsxs("div", {
								className: "py-3 flex items-center justify-between text-xs",
								children: [/* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("span", {
									className: "block font-semibold text-slate-800",
									children: item.doctor
								}), /* @__PURE__ */ jsx("span", {
									className: "text-slate-400 text-[11px]",
									children: item.purpose
								})] }), /* @__PURE__ */ jsxs("div", {
									className: "text-right",
									children: [/* @__PURE__ */ jsx("span", {
										className: "text-slate-600 text-xs block",
										children: item.date
									}), /* @__PURE__ */ jsx("span", {
										className: "inline-block mt-0.5 text-[10px] font-semibold px-2 py-0.5 rounded-md bg-slate-100 text-slate-700",
										children: item.status
									})]
								})]
							}, idx))
						})]
					})]
				})
			]
		})
	});
}
//#endregion
//#region resources/js/Pages/mr/Detailing.jsx
var Detailing_exports = /* @__PURE__ */ __exportAll({ default: () => Detailing });
function Detailing({ products = [], doctors = [], company = {} }) {
	const [selectedDoctorId, setSelectedDoctorId] = useState("");
	const [orderedProducts, setOrderedProducts] = useState([]);
	const [selectedProductIds, setSelectedProductIds] = useState(/* @__PURE__ */ new Set());
	const [categoryFilter, setCategoryFilter] = useState("all");
	const [draggedIndex, setDraggedIndex] = useState(null);
	const [dragOverIndex, setDragOverIndex] = useState(null);
	const [isPlaying, setIsPlaying] = useState(false);
	const [currentSlideIndex, setCurrentSlideIndex] = useState(0);
	const [isFullscreen, setIsFullscreen] = useState(false);
	const touchStartX = useRef(0);
	const touchStartY = useRef(0);
	const touchDeltaX = useRef(0);
	useEffect(() => {
		if (products && products.length > 0) {
			setOrderedProducts(products);
			setSelectedProductIds(new Set(products.map((p) => p.id)));
		}
	}, [products]);
	const selectedDoctor = doctors.find((d) => String(d.id) === String(selectedDoctorId));
	const includedProducts = orderedProducts.filter((p) => selectedProductIds.has(p.id));
	const slides = [
		{
			type: "brand_intro",
			id: "slide-brand"
		},
		{
			type: "manufacturing_competitors",
			id: "slide-mfg"
		},
		{
			type: "manufacturing_akums",
			id: "slide-mfg-akums"
		},
		...includedProducts.map((p) => ({
			type: "product",
			id: `prod-${p.id}`,
			data: p
		})),
		{
			type: "recap",
			id: "slide-recap"
		}
	];
	const totalSlides = slides.length;
	const handleToggleProduct = (id) => {
		setSelectedProductIds((prev) => {
			const next = new Set(prev);
			if (next.has(id)) {
				if (next.size === 1) {
					toast.error("Keep at least one product selected.");
					return prev;
				}
				next.delete(id);
			} else next.add(id);
			return next;
		});
	};
	const handleMoveProduct = (index, direction) => {
		const targetIndex = index + direction;
		if (targetIndex < 0 || targetIndex >= orderedProducts.length) return;
		setOrderedProducts((prev) => {
			const next = [...prev];
			const temp = next[index];
			next[index] = next[targetIndex];
			next[targetIndex] = temp;
			return next;
		});
	};
	const handleDragStart = (e, index) => {
		setDraggedIndex(index);
		e.dataTransfer.effectAllowed = "move";
		if (e.target) e.target.style.opacity = "0.5";
	};
	const handleDragEnd = (e) => {
		if (e.target) e.target.style.opacity = "1";
		setDraggedIndex(null);
		setDragOverIndex(null);
	};
	const handleDragOver = (e, index) => {
		e.preventDefault();
		e.dataTransfer.dropEffect = "move";
		if (dragOverIndex !== index) setDragOverIndex(index);
	};
	const handleDrop = (e, targetIndex) => {
		e.preventDefault();
		if (draggedIndex === null || draggedIndex === targetIndex) return;
		setOrderedProducts((prev) => {
			const next = [...prev];
			const draggedItem = next.splice(draggedIndex, 1)[0];
			next.splice(targetIndex, 0, draggedItem);
			return next;
		});
		setDraggedIndex(null);
		setDragOverIndex(null);
		toast.success("Slide order updated");
	};
	const handleResetOrder = () => {
		setOrderedProducts([...products]);
		setSelectedProductIds(new Set(products.map((p) => p.id)));
		toast.success("Restored default order");
	};
	const handleStartPresentation = () => {
		if (includedProducts.length === 0) {
			toast.error("Select at least one product.");
			return;
		}
		setCurrentSlideIndex(0);
		setIsPlaying(true);
	};
	const handleExitPresentation = () => {
		if (document.fullscreenElement) document.exitFullscreen().catch(() => {});
		setIsPlaying(false);
	};
	const handleToggleFullscreen = () => {
		if (!document.fullscreenElement) document.documentElement.requestFullscreen().then(() => setIsFullscreen(true)).catch(() => {});
		else document.exitFullscreen().then(() => setIsFullscreen(false)).catch(() => {});
	};
	const goToNextSlide = () => {
		if (currentSlideIndex < totalSlides - 1) setCurrentSlideIndex((prev) => prev + 1);
	};
	const goToPrevSlide = () => {
		if (currentSlideIndex > 0) setCurrentSlideIndex((prev) => prev - 1);
	};
	useEffect(() => {
		if (!isPlaying) return;
		const handleKeyDown = (e) => {
			if (e.key === "ArrowRight" || e.key === "Space") goToNextSlide();
			else if (e.key === "ArrowLeft") goToPrevSlide();
			else if (e.key === "Escape") handleExitPresentation();
		};
		window.addEventListener("keydown", handleKeyDown);
		return () => window.removeEventListener("keydown", handleKeyDown);
	}, [
		isPlaying,
		currentSlideIndex,
		totalSlides
	]);
	const handleTouchStart = (e) => {
		if (!isPlaying) return;
		touchStartX.current = e.touches[0].clientX;
		touchStartY.current = e.touches[0].clientY;
		touchDeltaX.current = 0;
	};
	const handleTouchMove = (e) => {
		if (!isPlaying) return;
		const currentX = e.touches[0].clientX;
		touchDeltaX.current = currentX - touchStartX.current;
	};
	const handleTouchEnd = () => {
		if (!isPlaying) return;
		const threshold = 40;
		if (touchDeltaX.current < -40) goToNextSlide();
		else if (touchDeltaX.current > threshold) goToPrevSlide();
		touchDeltaX.current = 0;
	};
	const categoriesList = ["all", ...new Set(products.map((p) => p.category?.name).filter(Boolean))];
	const filteredOrderedProducts = orderedProducts.filter((product) => {
		if (categoryFilter === "all") return true;
		return product.category?.name === categoryFilter;
	});
	const logoUrl = company?.logo_url || company?.logo || "/images/ciplon_logo.png";
	return /* @__PURE__ */ jsxs(MRLayout, {
		title: "Doctor Slide Show",
		children: [/* @__PURE__ */ jsxs("div", {
			className: "space-y-4 pb-12",
			children: [
				/* @__PURE__ */ jsx("div", {
					className: "bg-white rounded-xl border border-slate-200 p-4",
					children: /* @__PURE__ */ jsxs("div", {
						className: "flex flex-col md:flex-row md:items-center justify-between gap-4",
						children: [/* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("h1", {
							className: "text-xl font-bold text-slate-900",
							children: "Doctor Slide Show"
						}), /* @__PURE__ */ jsx("p", {
							className: "text-xs text-slate-500",
							children: "Sort medicines for doctor, then start presentation."
						})] }), /* @__PURE__ */ jsxs("div", {
							className: "flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5",
							children: [/* @__PURE__ */ jsxs("select", {
								value: selectedDoctorId,
								onChange: (e) => setSelectedDoctorId(e.target.value),
								className: "py-2 px-3 bg-slate-50/50 border border-slate-200/80 rounded-xl text-xs text-slate-800 font-medium focus:outline-none focus:ring-1 focus:ring-slate-900 cursor-pointer",
								children: [/* @__PURE__ */ jsx("option", {
									value: "",
									children: "General Physician"
								}), doctors.map((doc) => /* @__PURE__ */ jsxs("option", {
									value: doc.id,
									children: [
										doc.name,
										" ",
										doc.specialization ? `(${doc.specialization})` : ""
									]
								}, doc.id))]
							}), /* @__PURE__ */ jsxs("button", {
								type: "button",
								onClick: handleStartPresentation,
								className: "inline-flex items-center justify-center gap-2 px-5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-medium text-xs shadow-xs transition-colors cursor-pointer",
								children: [/* @__PURE__ */ jsx(Play, { className: "w-3.5 h-3.5 fill-white text-white" }), /* @__PURE__ */ jsxs("span", { children: [
									"Start Slideshow (",
									totalSlides,
									" Slides)"
								] })]
							})]
						})]
					})
				}),
				/* @__PURE__ */ jsxs("div", {
					className: "grid grid-cols-1 sm:grid-cols-3 gap-2.5 text-xs",
					children: [
						/* @__PURE__ */ jsxs("div", {
							className: "bg-white rounded-lg border border-slate-200 px-3.5 py-2.5 flex items-center justify-between",
							children: [/* @__PURE__ */ jsxs("div", {
								className: "flex items-center gap-2.5",
								children: [/* @__PURE__ */ jsx("span", {
									className: "w-6 h-6 rounded bg-slate-100 text-slate-700 font-bold text-xs flex items-center justify-center",
									children: "1"
								}), /* @__PURE__ */ jsx("span", {
									className: "font-semibold text-slate-800",
									children: "Slide 1: Brand Logo & Heritage"
								})]
							}), /* @__PURE__ */ jsx("img", {
								src: logoUrl,
								alt: "Ciplon Logo",
								className: "h-5 w-auto object-contain opacity-80",
								onError: (e) => {
									e.currentTarget.src = "/images/ciplon_logo.png";
								}
							})]
						}),
						/* @__PURE__ */ jsxs("div", {
							className: "bg-white rounded-lg border border-slate-200 px-3.5 py-2.5 flex items-center justify-between",
							children: [/* @__PURE__ */ jsxs("div", {
								className: "flex items-center gap-2.5",
								children: [/* @__PURE__ */ jsx("span", {
									className: "w-6 h-6 rounded bg-slate-100 text-slate-700 font-bold text-xs flex items-center justify-center",
									children: "2"
								}), /* @__PURE__ */ jsx("span", {
									className: "font-semibold text-slate-800",
									children: "Slide 2: Walpar Wellness (WHO-GMP)"
								})]
							}), /* @__PURE__ */ jsx("img", {
								src: "/images/walpar_logo.png",
								alt: "Walpar Logo",
								className: "h-5 w-auto object-contain"
							})]
						}),
						/* @__PURE__ */ jsxs("div", {
							className: "bg-white rounded-lg border border-slate-200 px-3.5 py-2.5 flex items-center justify-between",
							children: [/* @__PURE__ */ jsxs("div", {
								className: "flex items-center gap-2.5",
								children: [/* @__PURE__ */ jsx("span", {
									className: "w-6 h-6 rounded bg-slate-100 text-slate-700 font-bold text-xs flex items-center justify-center",
									children: "3"
								}), /* @__PURE__ */ jsx("span", {
									className: "font-semibold text-slate-800",
									children: "Slide 3: Pure & Cure (Akums Drugs)"
								})]
							}), /* @__PURE__ */ jsx("img", {
								src: "/images/akums_logo.png",
								alt: "Akums Logo",
								className: "h-5 w-auto object-contain"
							})]
						})
					]
				}),
				/* @__PURE__ */ jsxs("div", {
					className: "flex items-center justify-between pt-1",
					children: [/* @__PURE__ */ jsxs("div", {
						className: "text-xs font-semibold text-slate-700",
						children: [
							"Medicine Slides (",
							includedProducts.length,
							" selected)"
						]
					}), /* @__PURE__ */ jsxs("div", {
						className: "flex items-center gap-2 text-xs",
						children: [categoriesList.length > 2 && /* @__PURE__ */ jsx("select", {
							value: categoryFilter,
							onChange: (e) => setCategoryFilter(e.target.value),
							className: "py-1 px-2.5 bg-white border border-slate-200 rounded-lg text-slate-700 focus:outline-none cursor-pointer",
							children: categoriesList.map((cat) => /* @__PURE__ */ jsx("option", {
								value: cat,
								children: cat === "all" ? "All Categories" : cat
							}, cat))
						}), /* @__PURE__ */ jsxs("button", {
							type: "button",
							onClick: handleResetOrder,
							className: "inline-flex items-center gap-1 px-2 py-1 rounded-lg border border-slate-200 bg-white text-slate-600 hover:text-slate-900 cursor-pointer",
							title: "Reset order",
							children: [/* @__PURE__ */ jsx(RotateCcw, { className: "w-3 h-3" }), /* @__PURE__ */ jsx("span", { children: "Reset" })]
						})]
					})]
				}),
				/* @__PURE__ */ jsx("div", {
					className: "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3",
					children: filteredOrderedProducts.map((product) => {
						const actualIndex = orderedProducts.findIndex((p) => p.id === product.id);
						const isIncluded = selectedProductIds.has(product.id);
						const slideNumber = actualIndex + 4;
						const isBeingDragged = draggedIndex === actualIndex;
						const isDragTarget = dragOverIndex === actualIndex;
						const imageUrl = product.primary_image?.file_path || product.primary_image?.url || product.images?.[0]?.file_path || product.images?.[0]?.url || "/images/ciplon_d.png";
						return /* @__PURE__ */ jsxs("div", {
							draggable: true,
							onDragStart: (e) => handleDragStart(e, actualIndex),
							onDragEnd: handleDragEnd,
							onDragOver: (e) => handleDragOver(e, actualIndex),
							onDrop: (e) => handleDrop(e, actualIndex),
							className: `rounded-xl bg-white border p-3 select-none transition-colors ${isBeingDragged ? "opacity-40 border-dashed border-slate-400" : isDragTarget ? "border-slate-800 bg-slate-50" : isIncluded ? "border-slate-200 hover:border-slate-300" : "border-slate-200 bg-slate-50/70 opacity-50"}`,
							children: [
								/* @__PURE__ */ jsxs("div", {
									className: "flex items-center justify-between pb-2 border-b border-slate-100",
									children: [/* @__PURE__ */ jsx("span", {
										className: "w-6 h-6 rounded bg-slate-100 text-slate-800 font-bold text-xs flex items-center justify-center",
										children: slideNumber
									}), /* @__PURE__ */ jsxs("div", {
										className: "flex items-center gap-1 text-slate-400",
										children: [
											/* @__PURE__ */ jsx("button", {
												type: "button",
												onClick: () => handleMoveProduct(actualIndex, -1),
												disabled: actualIndex === 0,
												className: "p-1 rounded hover:text-slate-800 disabled:opacity-20 cursor-pointer",
												title: "Move up",
												children: /* @__PURE__ */ jsx(ArrowUp, { className: "w-3.5 h-3.5" })
											}),
											/* @__PURE__ */ jsx("button", {
												type: "button",
												onClick: () => handleMoveProduct(actualIndex, 1),
												disabled: actualIndex === orderedProducts.length - 1,
												className: "p-1 rounded hover:text-slate-800 disabled:opacity-20 cursor-pointer",
												title: "Move down",
												children: /* @__PURE__ */ jsx(ArrowDown, { className: "w-3.5 h-3.5" })
											}),
											/* @__PURE__ */ jsx("span", {
												className: "cursor-grab hover:text-slate-800 px-0.5",
												children: /* @__PURE__ */ jsx(GripVertical, { className: "w-3.5 h-3.5" })
											})
										]
									})]
								}),
								/* @__PURE__ */ jsxs("div", {
									className: "py-2.5 flex items-center gap-3",
									children: [/* @__PURE__ */ jsx("div", {
										className: "w-14 h-14 rounded-lg bg-slate-50 border border-slate-100 p-1 flex items-center justify-center shrink-0",
										children: /* @__PURE__ */ jsx("img", {
											src: imageUrl,
											alt: product.brand_name,
											className: "max-h-full max-w-full object-contain",
											onError: (e) => {
												e.currentTarget.src = "/images/ciplon_d.png";
											}
										})
									}), /* @__PURE__ */ jsxs("div", {
										className: "flex-1 min-w-0",
										children: [/* @__PURE__ */ jsx("h4", {
											className: "text-sm font-bold text-slate-900 truncate",
											children: product.brand_name
										}), /* @__PURE__ */ jsx("p", {
											className: "text-xs text-slate-500 truncate mt-0.5",
											title: product.generic_name,
											children: product.generic_name
										})]
									})]
								}),
								/* @__PURE__ */ jsx("div", {
									className: "pt-2 border-t border-slate-100 flex items-center justify-between",
									children: /* @__PURE__ */ jsxs("label", {
										className: "flex items-center gap-2 cursor-pointer text-xs text-slate-600",
										children: [/* @__PURE__ */ jsx("input", {
											type: "checkbox",
											checked: isIncluded,
											onChange: () => handleToggleProduct(product.id),
											className: "w-3.5 h-3.5 rounded text-slate-900 focus:ring-0 cursor-pointer"
										}), /* @__PURE__ */ jsx("span", { children: isIncluded ? "Included" : "Skip" })]
									})
								})
							]
						}, product.id);
					})
				})
			]
		}), isPlaying && /* @__PURE__ */ jsxs("div", {
			className: "fixed inset-0 z-50 bg-white text-slate-900 flex flex-col select-none overflow-hidden",
			onTouchStart: handleTouchStart,
			onTouchMove: handleTouchMove,
			onTouchEnd: handleTouchEnd,
			children: [
				/* @__PURE__ */ jsxs("div", {
					className: "h-13 px-4 sm:px-6 border-b border-slate-200 flex items-center justify-between shrink-0 bg-white",
					children: [/* @__PURE__ */ jsxs("div", {
						className: "flex items-center gap-3",
						children: [/* @__PURE__ */ jsxs("span", {
							className: "px-2 py-0.5 rounded bg-slate-100 text-slate-800 font-mono font-bold text-xs border border-slate-200",
							children: [
								currentSlideIndex + 1,
								" / ",
								totalSlides
							]
						}), /* @__PURE__ */ jsx("span", {
							className: "text-xs text-slate-600 hidden sm:inline font-medium",
							children: selectedDoctor ? `Dr. ${selectedDoctor.name}` : "Doctor Detailing"
						})]
					}), /* @__PURE__ */ jsxs("div", {
						className: "flex items-center gap-2",
						children: [/* @__PURE__ */ jsx("button", {
							type: "button",
							onClick: handleToggleFullscreen,
							className: "p-1.5 rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50 cursor-pointer",
							title: "Fullscreen",
							children: isFullscreen ? /* @__PURE__ */ jsx(Minimize, { className: "w-4 h-4" }) : /* @__PURE__ */ jsx(Maximize, { className: "w-4 h-4" })
						}), /* @__PURE__ */ jsxs("button", {
							type: "button",
							onClick: handleExitPresentation,
							className: "inline-flex items-center gap-1 px-3 py-1.5 rounded-lg border border-slate-200 text-slate-700 hover:bg-slate-50 text-xs font-semibold cursor-pointer",
							children: [/* @__PURE__ */ jsx(X, { className: "w-3.5 h-3.5" }), /* @__PURE__ */ jsx("span", { children: "Exit" })]
						})]
					})]
				}),
				/* @__PURE__ */ jsx("div", {
					className: "h-0.5 bg-slate-100 w-full relative shrink-0",
					children: /* @__PURE__ */ jsx("div", {
						className: "h-full bg-slate-800 transition-all duration-200",
						style: { width: `${(currentSlideIndex + 1) / totalSlides * 100}%` }
					})
				}),
				/* @__PURE__ */ jsx("div", {
					className: "flex-1 overflow-y-auto p-4 sm:p-8 lg:p-12 flex items-center justify-center",
					children: /* @__PURE__ */ jsxs("div", {
						className: "w-full max-w-6xl",
						children: [
							slides[currentSlideIndex].type === "brand_intro" && /* @__PURE__ */ jsxs("div", {
								className: "py-6 sm:py-12 text-center space-y-8 max-w-4xl mx-auto",
								children: [
									/* @__PURE__ */ jsx("div", {
										className: "flex items-center justify-center",
										children: /* @__PURE__ */ jsx("img", {
											src: logoUrl,
											alt: company?.name || "Ciplon Pharma",
											className: "h-36 sm:h-52 w-auto object-contain",
											onError: (e) => {
												e.currentTarget.src = "/images/ciplon_logo.png";
											}
										})
									}),
									/* @__PURE__ */ jsxs("div", {
										className: "space-y-2",
										children: [/* @__PURE__ */ jsx("h1", {
											className: "text-3xl sm:text-5xl font-bold text-slate-900 tracking-tight",
											children: company?.name || "Ciplon Pharma Private Limited"
										}), /* @__PURE__ */ jsx("p", {
											className: "text-base sm:text-lg font-medium text-slate-500 tracking-wide",
											children: "Science Into Smiles"
										})]
									}),
									/* @__PURE__ */ jsxs("div", {
										className: "flex flex-wrap items-center justify-center gap-3 pt-2",
										children: [
											/* @__PURE__ */ jsxs("div", {
												className: "px-5 py-2.5 rounded-full bg-slate-50 border border-slate-200/80 text-center",
												children: [/* @__PURE__ */ jsx("span", {
													className: "text-xs sm:text-sm font-semibold text-slate-800",
													children: "ISO 9001:2015"
												}), /* @__PURE__ */ jsx("span", {
													className: "text-[11px] text-slate-500 ml-1.5 font-normal",
													children: "Certified QMS"
												})]
											}),
											/* @__PURE__ */ jsxs("div", {
												className: "px-5 py-2.5 rounded-full bg-slate-50 border border-slate-200/80 text-center",
												children: [/* @__PURE__ */ jsx("span", {
													className: "text-xs sm:text-sm font-semibold text-slate-800",
													children: "WHO-GMP"
												}), /* @__PURE__ */ jsx("span", {
													className: "text-[11px] text-slate-500 ml-1.5 font-normal",
													children: "Cleanrooms"
												})]
											}),
											/* @__PURE__ */ jsxs("div", {
												className: "px-5 py-2.5 rounded-full bg-slate-50 border border-slate-200/80 text-center",
												children: [/* @__PURE__ */ jsx("span", {
													className: "text-xs sm:text-sm font-semibold text-slate-800",
													children: "FSSAI"
												}), /* @__PURE__ */ jsx("span", {
													className: "text-[11px] text-slate-500 ml-1.5 font-normal",
													children: "Compliant"
												})]
											})
										]
									})
								]
							}),
							slides[currentSlideIndex].type === "manufacturing_competitors" && /* @__PURE__ */ jsx("div", {
								className: "py-2 sm:py-6 max-w-6xl mx-auto",
								children: /* @__PURE__ */ jsxs("div", {
									className: "grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch",
									children: [/* @__PURE__ */ jsxs("div", {
										className: "lg:col-span-5 bg-slate-50/70 rounded-2xl p-6 sm:p-8 flex flex-col justify-between space-y-6",
										children: [/* @__PURE__ */ jsxs("div", {
											className: "space-y-5",
											children: [
												/* @__PURE__ */ jsxs("div", {
													className: "flex items-center justify-between",
													children: [/* @__PURE__ */ jsx("span", {
														className: "text-[11px] font-bold uppercase tracking-wider text-slate-400",
														children: "Manufacturer"
													}), /* @__PURE__ */ jsx("span", {
														className: "px-3 py-1 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800",
														children: "WHO-GMP & ISO 9001:2015"
													})]
												}),
												/* @__PURE__ */ jsx("div", {
													className: "w-full h-36 sm:h-44 rounded-xl bg-white p-6 flex items-center justify-center",
													children: /* @__PURE__ */ jsx("img", {
														src: "/images/walpar_logo.png",
														alt: "Walpar Nutritions Limited Logo",
														className: "max-h-32 sm:max-h-36 max-w-full object-contain"
													})
												}),
												/* @__PURE__ */ jsxs("div", {
													className: "space-y-1 pt-1",
													children: [/* @__PURE__ */ jsx("h3", {
														className: "text-xl sm:text-2xl font-bold text-slate-900 leading-snug",
														children: "WALPAR WELLNESS PVT. LTD."
													}), /* @__PURE__ */ jsx("p", {
														className: "text-xs text-slate-500 leading-relaxed",
														children: "Plot No. 2/A & 06, Opp. Sabarmati Gas Station, Khatraj, Kalol, Gandhinagar, Gujarat – 382721"
													})]
												})
											]
										}), /* @__PURE__ */ jsxs("div", {
											className: "pt-4 border-t border-slate-200/60 grid grid-cols-2 gap-3 text-left",
											children: [/* @__PURE__ */ jsxs("div", {
												className: "p-3 rounded-xl bg-white",
												children: [/* @__PURE__ */ jsx("span", {
													className: "text-[10px] uppercase font-semibold text-slate-400 block",
													children: "Cleanrooms"
												}), /* @__PURE__ */ jsx("span", {
													className: "text-xs font-bold text-slate-800",
													children: "Class 10,000"
												})]
											}), /* @__PURE__ */ jsxs("div", {
												className: "p-3 rounded-xl bg-white",
												children: [/* @__PURE__ */ jsx("span", {
													className: "text-[10px] uppercase font-semibold text-slate-400 block",
													children: "Air Filtration"
												}), /* @__PURE__ */ jsx("span", {
													className: "text-xs font-bold text-emerald-700",
													children: "HEPA Integrated"
												})]
											})]
										})]
									}), /* @__PURE__ */ jsxs("div", {
										className: "lg:col-span-7 bg-slate-50/70 rounded-2xl p-6 sm:p-8 flex flex-col justify-between space-y-5",
										children: [
											/* @__PURE__ */ jsxs("div", {
												className: "space-y-1.5",
												children: [/* @__PURE__ */ jsxs("div", {
													className: "flex items-center gap-2",
													children: [/* @__PURE__ */ jsx(ShieldCheck, { className: "w-5 h-5 text-slate-700" }), /* @__PURE__ */ jsx("h3", {
														className: "text-lg sm:text-xl font-bold text-slate-900",
														children: "Leading Brands Made At The Same Facility"
													})]
												}), /* @__PURE__ */ jsx("p", {
													className: "text-xs text-slate-500 leading-relaxed",
													children: "The same production lines, validated formulation protocols, and high-potency quality assurance trusted by India's top pharma giants:"
												})]
											}),
											/* @__PURE__ */ jsx("div", {
												className: "grid grid-cols-2 sm:grid-cols-3 gap-2.5",
												children: [
													{
														name: "Sun Pharma",
														sub: "Specialty Formulations"
													},
													{
														name: "Cipla",
														sub: "Respiratory & Critical"
													},
													{
														name: "Alkem Labs",
														sub: "Anti-Infectives"
													},
													{
														name: "Torrent Pharma",
														sub: "Cardiovascular"
													},
													{
														name: "Mankind",
														sub: "Primary Care"
													},
													{
														name: "Abbott",
														sub: "Nutritional & GI"
													},
													{
														name: "Intas Pharma",
														sub: "Biologics & Specialty"
													},
													{
														name: "Lupin",
														sub: "Complex Formulations"
													},
													{
														name: "Dr. Reddy's",
														sub: "Therapeutic Lines"
													}
												].map((b) => /* @__PURE__ */ jsxs("div", {
													className: "p-3.5 rounded-xl bg-white flex flex-col justify-between",
													children: [/* @__PURE__ */ jsx("span", {
														className: "text-sm font-bold text-slate-900 block",
														children: b.name
													}), /* @__PURE__ */ jsx("span", {
														className: "text-[10px] text-slate-500 font-medium block mt-0.5",
														children: b.sub
													})]
												}, b.name))
											}),
											/* @__PURE__ */ jsxs("div", {
												className: "p-3.5 rounded-xl bg-white text-xs text-slate-600 flex items-center gap-2.5",
												children: [/* @__PURE__ */ jsx(CheckCircle2, { className: "w-4 h-4 text-emerald-600 shrink-0" }), /* @__PURE__ */ jsx("span", { children: "Ensures identical active molecule assay, micronization stability, and bioequivalence profile." })]
											})
										]
									})]
								})
							}),
							slides[currentSlideIndex].type === "manufacturing_akums" && /* @__PURE__ */ jsx("div", {
								className: "py-2 sm:py-6 max-w-6xl mx-auto",
								children: /* @__PURE__ */ jsxs("div", {
									className: "grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch",
									children: [/* @__PURE__ */ jsxs("div", {
										className: "lg:col-span-5 bg-slate-50/70 rounded-2xl p-6 sm:p-8 flex flex-col justify-between space-y-6",
										children: [/* @__PURE__ */ jsxs("div", {
											className: "space-y-5",
											children: [
												/* @__PURE__ */ jsxs("div", {
													className: "flex items-center justify-between",
													children: [/* @__PURE__ */ jsx("span", {
														className: "text-[11px] font-bold uppercase tracking-wider text-slate-400",
														children: "Manufacturer & Parent Group"
													}), /* @__PURE__ */ jsx("span", {
														className: "px-3 py-1 rounded-full text-[10px] font-bold bg-amber-100 text-amber-800",
														children: "India's #1 CDMO"
													})]
												}),
												/* @__PURE__ */ jsx("div", {
													className: "w-full h-36 sm:h-44 rounded-xl bg-white p-6 flex items-center justify-center",
													children: /* @__PURE__ */ jsx("img", {
														src: "/images/akums_logo.png",
														alt: "Akums Drugs & Pharmaceuticals Ltd. Logo",
														className: "max-h-32 sm:max-h-36 max-w-full object-contain"
													})
												}),
												/* @__PURE__ */ jsxs("div", {
													className: "space-y-1 pt-1",
													children: [
														/* @__PURE__ */ jsx("h3", {
															className: "text-xl sm:text-2xl font-bold text-slate-900 leading-snug",
															children: "Pure & Cure Healthcare Pvt. Ltd."
														}),
														/* @__PURE__ */ jsx("span", {
															className: "text-xs font-semibold text-amber-800 block",
															children: "(A subsidiary of Akums Drugs & Pharmaceuticals Ltd.)"
														}),
														/* @__PURE__ */ jsx("p", {
															className: "text-xs text-slate-500 leading-relaxed",
															children: "Vill. Manakpur, P.O. Lodhimajra, Baddi-173 205, Distt.-Solan, (H.P.)"
														})
													]
												})
											]
										}), /* @__PURE__ */ jsxs("div", {
											className: "pt-4 border-t border-slate-200/60 grid grid-cols-2 gap-3 text-left",
											children: [/* @__PURE__ */ jsxs("div", {
												className: "p-3 rounded-xl bg-white",
												children: [/* @__PURE__ */ jsx("span", {
													className: "text-[10px] uppercase font-semibold text-slate-400 block",
													children: "Facility Hub"
												}), /* @__PURE__ */ jsx("span", {
													className: "text-xs font-bold text-slate-800",
													children: "Baddi (H.P.)"
												})]
											}), /* @__PURE__ */ jsxs("div", {
												className: "p-3 rounded-xl bg-white",
												children: [/* @__PURE__ */ jsx("span", {
													className: "text-[10px] uppercase font-semibold text-slate-400 block",
													children: "Market Share"
												}), /* @__PURE__ */ jsx("span", {
													className: "text-xs font-bold text-amber-700",
													children: "12%+ India Supply"
												})]
											})]
										})]
									}), /* @__PURE__ */ jsxs("div", {
										className: "lg:col-span-7 bg-slate-50/70 rounded-2xl p-6 sm:p-8 flex flex-col justify-between space-y-5",
										children: [
											/* @__PURE__ */ jsxs("div", {
												className: "space-y-1.5",
												children: [/* @__PURE__ */ jsxs("div", {
													className: "flex items-center gap-2",
													children: [/* @__PURE__ */ jsx(ShieldCheck, { className: "w-5 h-5 text-slate-700" }), /* @__PURE__ */ jsx("h3", {
														className: "text-lg sm:text-xl font-bold text-slate-900",
														children: "Major Pharma Giants Manufactured By Akums"
													})]
												}), /* @__PURE__ */ jsx("p", {
													className: "text-xs text-slate-500 leading-relaxed",
													children: "Over 1,500 active formulations engineered under identical world-scale cGMP validated production units:"
												})]
											}),
											/* @__PURE__ */ jsx("div", {
												className: "grid grid-cols-2 sm:grid-cols-3 gap-2.5",
												children: [
													{
														name: "Sun Pharma",
														sub: "Specialty Formulations"
													},
													{
														name: "Abbott",
														sub: "Global Nutritional & GI"
													},
													{
														name: "Cipla",
														sub: "Critical & Pulmonary Care"
													},
													{
														name: "Dr. Reddy's",
														sub: "Oncology & Therapeutic"
													},
													{
														name: "Lupin",
														sub: "Cardiovascular Lines"
													},
													{
														name: "Mankind",
														sub: "Primary Therapeutic Care"
													},
													{
														name: "Glenmark",
														sub: "Dermatology & Respiratory"
													},
													{
														name: "Torrent Pharma",
														sub: "Neuro & Cardiac Lines"
													},
													{
														name: "Alkem Labs",
														sub: "Anti-Infective Regimens"
													}
												].map((b) => /* @__PURE__ */ jsxs("div", {
													className: "p-3.5 rounded-xl bg-white flex flex-col justify-between",
													children: [/* @__PURE__ */ jsx("span", {
														className: "text-sm font-bold text-slate-900 block",
														children: b.name
													}), /* @__PURE__ */ jsx("span", {
														className: "text-[10px] text-slate-500 font-medium block mt-0.5",
														children: b.sub
													})]
												}, b.name))
											}),
											/* @__PURE__ */ jsxs("div", {
												className: "p-3.5 rounded-xl bg-white text-xs text-slate-600 flex items-center gap-2.5",
												children: [/* @__PURE__ */ jsx(CheckCircle2, { className: "w-4 h-4 text-emerald-600 shrink-0" }), /* @__PURE__ */ jsx("span", { children: "Ensures gold-standard clinical safety, rigorous chemical assays, and highest doctor trust for Ciplon medicines." })]
											})
										]
									})]
								})
							}),
							slides[currentSlideIndex].type === "product" && (() => {
								const prod = slides[currentSlideIndex].data;
								const imageUrl = prod.primary_image?.file_path || prod.primary_image?.url || prod.images?.[0]?.file_path || prod.images?.[0]?.url || "/images/ciplon_d.png";
								return /* @__PURE__ */ jsx("div", {
									className: "py-2 sm:py-6",
									children: /* @__PURE__ */ jsxs("div", {
										className: "grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-14 items-center",
										children: [/* @__PURE__ */ jsxs("div", {
											className: "lg:col-span-6 flex flex-col items-center justify-center space-y-4",
											children: [/* @__PURE__ */ jsx("div", {
												className: "w-full h-80 sm:h-[430px] lg:h-[490px] rounded-3xl bg-slate-50/60 p-6 sm:p-10 flex items-center justify-center",
												children: /* @__PURE__ */ jsx("img", {
													src: imageUrl,
													alt: prod.brand_name,
													className: "max-h-full max-w-full object-contain",
													onError: (e) => {
														e.currentTarget.src = "/images/ciplon_d.png";
													}
												})
											}), /* @__PURE__ */ jsxs("div", {
												className: "flex items-center gap-2 flex-wrap justify-center",
												children: [
													/* @__PURE__ */ jsx("span", {
														className: "px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider bg-slate-900 text-white",
														children: prod.dosage_form || "Formulation"
													}),
													prod.packaging_type && /* @__PURE__ */ jsx("span", {
														className: "px-4 py-1.5 rounded-full text-xs font-semibold text-slate-700 bg-slate-100",
														children: prod.packaging_type
													}),
													prod.sku && /* @__PURE__ */ jsxs("span", {
														className: "px-3.5 py-1.5 rounded-full text-[11px] font-mono font-medium text-slate-500 bg-slate-50",
														children: ["SKU: ", prod.sku]
													})
												]
											})]
										}), /* @__PURE__ */ jsxs("div", {
											className: "lg:col-span-6 space-y-5",
											children: [
												/* @__PURE__ */ jsxs("div", {
													className: "space-y-1",
													children: [/* @__PURE__ */ jsx("span", {
														className: "text-xs font-bold text-slate-400 uppercase tracking-widest block",
														children: prod.category?.name || "Therapeutic Formulation"
													}), /* @__PURE__ */ jsx("h1", {
														className: "text-3xl sm:text-5xl font-extrabold text-slate-900 tracking-tight leading-tight",
														children: prod.brand_name
													})]
												}),
												/* @__PURE__ */ jsxs("div", {
													className: "p-4 sm:p-5 rounded-2xl bg-slate-50 space-y-1",
													children: [/* @__PURE__ */ jsxs("div", {
														className: "flex items-center justify-between",
														children: [/* @__PURE__ */ jsx("span", {
															className: "text-[10px] font-bold uppercase tracking-widest text-slate-400",
															children: "Active Generic Molecule / Salt Composition"
														}), /* @__PURE__ */ jsx("span", {
															className: "px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-100 text-emerald-800",
															children: "Verified Potency"
														})]
													}), /* @__PURE__ */ jsx("p", {
														className: "text-base sm:text-xl font-bold text-slate-900 leading-snug",
														children: prod.generic_name
													})]
												}),
												/* @__PURE__ */ jsxs("div", {
													className: "grid grid-cols-1 sm:grid-cols-2 gap-3.5",
													children: [/* @__PURE__ */ jsxs("div", {
														className: "p-4 rounded-2xl bg-slate-50 space-y-1",
														children: [/* @__PURE__ */ jsx("span", {
															className: "text-[11px] font-bold uppercase tracking-wider text-slate-500 block",
															children: "Therapeutic Indications"
														}), /* @__PURE__ */ jsx("p", {
															className: "text-xs text-slate-700 font-normal leading-relaxed",
															children: prod.indications || "Primary and secondary targeted clinical therapy."
														})]
													}), /* @__PURE__ */ jsxs("div", {
														className: "p-4 rounded-2xl bg-slate-50 space-y-1",
														children: [/* @__PURE__ */ jsx("span", {
															className: "text-[11px] font-bold uppercase tracking-wider text-slate-500 block",
															children: "Recommended Regimen"
														}), /* @__PURE__ */ jsx("p", {
															className: "text-xs text-slate-700 font-normal leading-relaxed",
															children: prod.directions || "As prescribed by physician or healthcare specialist."
														})]
													})]
												}),
												prod.compositions && prod.compositions.length > 0 && /* @__PURE__ */ jsxs("div", {
													className: "pt-1 space-y-2",
													children: [/* @__PURE__ */ jsx("span", {
														className: "text-[11px] font-bold uppercase tracking-wider text-slate-500 block",
														children: "Active Ingredient Strengths"
													}), /* @__PURE__ */ jsx("div", {
														className: "flex flex-wrap gap-2",
														children: prod.compositions.map((comp) => /* @__PURE__ */ jsxs("span", {
															className: "px-3.5 py-1.5 rounded-xl bg-slate-100 text-xs font-medium text-slate-800",
															children: [
																/* @__PURE__ */ jsxs("span", {
																	className: "text-slate-500",
																	children: [comp.ingredient_name, ":"]
																}),
																" ",
																/* @__PURE__ */ jsxs("span", {
																	className: "font-mono text-slate-900 font-bold",
																	children: [
																		comp.strength,
																		" ",
																		comp.unit
																	]
																})
															]
														}, comp.id))
													})]
												})
											]
										})]
									})
								});
							})(),
							slides[currentSlideIndex].type === "recap" && /* @__PURE__ */ jsxs("div", {
								className: "py-8 sm:py-16 text-center space-y-8 max-w-3xl mx-auto",
								children: [
									/* @__PURE__ */ jsx("div", {
										className: "w-16 h-16 rounded-full bg-emerald-50 text-emerald-700 flex items-center justify-center mx-auto",
										children: /* @__PURE__ */ jsx(CheckCircle2, { className: "w-8 h-8 stroke-[2]" })
									}),
									/* @__PURE__ */ jsxs("div", {
										className: "space-y-2",
										children: [/* @__PURE__ */ jsxs("h2", {
											className: "text-3xl sm:text-5xl font-bold text-slate-900 tracking-tight",
											children: ["Thank You", selectedDoctor ? `, Dr. ${selectedDoctor.name}` : ""]
										}), /* @__PURE__ */ jsx("p", {
											className: "text-base text-slate-500",
											children: "Formulation detailing session successfully concluded."
										})]
									}),
									/* @__PURE__ */ jsx("div", {
										className: "flex flex-wrap justify-center gap-2.5 pt-2",
										children: includedProducts.map((p) => /* @__PURE__ */ jsx("span", {
											className: "px-4 py-2 rounded-full bg-slate-100 text-xs text-slate-800 font-semibold",
											children: p.brand_name
										}, p.id))
									}),
									/* @__PURE__ */ jsxs("div", {
										className: "flex flex-col sm:flex-row items-center justify-center gap-3 pt-4",
										children: [/* @__PURE__ */ jsx(Link, {
											href: "/mr/visits",
											className: "px-6 py-3 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-medium text-xs transition-colors cursor-pointer",
											children: "Log Field Visit & Samples"
										}), /* @__PURE__ */ jsx("button", {
											type: "button",
											onClick: () => setCurrentSlideIndex(0),
											className: "px-6 py-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-medium cursor-pointer",
											children: "Restart Slideshow"
										})]
									})
								]
							})
						]
					})
				}),
				/* @__PURE__ */ jsxs("div", {
					className: "h-14 px-4 sm:px-6 border-t border-slate-200 flex items-center justify-between shrink-0 bg-white",
					children: [
						/* @__PURE__ */ jsxs("button", {
							type: "button",
							onClick: goToPrevSlide,
							disabled: currentSlideIndex === 0,
							className: "inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl border border-slate-200/80 text-slate-700 hover:bg-slate-50 disabled:opacity-30 disabled:pointer-events-none text-xs font-medium cursor-pointer",
							children: [/* @__PURE__ */ jsx(ChevronLeft, { className: "w-4 h-4" }), /* @__PURE__ */ jsx("span", { children: "Previous" })]
						}),
						/* @__PURE__ */ jsx("span", {
							className: "text-[11px] text-slate-400",
							children: "Swipe or tap Next →"
						}),
						/* @__PURE__ */ jsxs("button", {
							type: "button",
							onClick: goToNextSlide,
							disabled: currentSlideIndex === totalSlides - 1,
							className: "inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white disabled:opacity-30 disabled:pointer-events-none text-xs font-medium cursor-pointer shadow-xs",
							children: [/* @__PURE__ */ jsx("span", { children: "Next" }), /* @__PURE__ */ jsx(ChevronRight, { className: "w-4 h-4" })]
						})
					]
				})
			]
		})]
	});
}
//#endregion
//#region resources/js/Pages/mr/DoctorForm.jsx
var DoctorForm_exports = /* @__PURE__ */ __exportAll({ default: () => DoctorForm });
var SPECIALTY_OPTIONS$1 = [
	"General Medicine",
	"Cardiology",
	"Diabetology",
	"Orthopedics",
	"Pediatrics",
	"Pulmonology",
	"Gynecology",
	"Dermatology",
	"Neurology",
	"Gastroenterology",
	"ENT",
	"Ophthalmology"
];
var TIER_OPTIONS = [
	{
		id: "core",
		label: "Core KOL",
		desc: "Key Opinion Leader / High-volume prescriber (Weekly detailing recommended)",
		defaultFreq: 4,
		badge: "bg-emerald-50 text-emerald-800 border-emerald-300"
	},
	{
		id: "class_a",
		label: "Class A (High Potential)",
		desc: "Regular prescriber with strong brand loyalty (Fortnightly detailing)",
		defaultFreq: 3,
		badge: "bg-teal-50 text-teal-800 border-teal-300"
	},
	{
		id: "class_b",
		label: "Class B (Moderate)",
		desc: "Occasional prescriber with growth opportunity (Bi-weekly visits)",
		defaultFreq: 2,
		badge: "bg-amber-50 text-amber-800 border-amber-300"
	},
	{
		id: "class_c",
		label: "Class C (Maintenance)",
		desc: "Trial prescriber or remote location clinic (Monthly touchpoint)",
		defaultFreq: 1,
		badge: "bg-slate-100 text-slate-700 border-slate-300"
	}
];
function DoctorForm({ mode = "create", doctorId = null }) {
	const isEdit = mode === "edit";
	const [formData, setFormData] = useState({
		name: "",
		qualification: "",
		specialization: "General Medicine",
		clinic_hospital_name: "",
		address: "",
		territory: "",
		city: "",
		phone: "",
		email: "",
		visiting_hours: "",
		visiting_days: "",
		tier: "core",
		target_frequency_per_month: 4,
		notes: "",
		status: "active"
	});
	const [loadingDoctor, setLoadingDoctor] = useState(isEdit);
	const [submitting, setSubmitting] = useState(false);
	const [errors, setErrors] = useState({});
	const [loadError, setLoadError] = useState(null);
	useEffect(() => {
		if (isEdit && doctorId) {
			setLoadingDoctor(true);
			axios.get(`/api/v1/mr/doctors/${doctorId}`).then((res) => {
				if (res.data?.success && res.data?.data) {
					const doc = res.data.data;
					setFormData({
						name: doc.name || "",
						qualification: doc.qualification || "",
						specialization: doc.specialization || "General Medicine",
						clinic_hospital_name: doc.clinic_hospital_name || "",
						address: doc.address || "",
						territory: doc.territory || "",
						city: doc.city || "",
						phone: doc.phone || "",
						email: doc.email || "",
						visiting_hours: doc.visiting_hours || "",
						visiting_days: doc.visiting_days || "",
						tier: doc.tier || "core",
						target_frequency_per_month: doc.target_frequency_per_month || 4,
						notes: doc.notes || "",
						status: doc.status || "active"
					});
				}
			}).catch((err) => {
				console.error("Failed to load doctor:", err);
				setLoadError("Doctor record not found or could not be loaded.");
				toast.error("Could not load doctor details.");
			}).finally(() => {
				setLoadingDoctor(false);
			});
		}
	}, [isEdit, doctorId]);
	const handleChange = (e) => {
		const { name, value } = e.target;
		setFormData((prev) => ({
			...prev,
			[name]: value
		}));
		if (errors[name]) setErrors((prev) => {
			const updated = { ...prev };
			delete updated[name];
			return updated;
		});
	};
	const handleTierSelect = (tierId, defaultFreq) => {
		setFormData((prev) => ({
			...prev,
			tier: tierId,
			target_frequency_per_month: isEdit ? prev.target_frequency_per_month : defaultFreq
		}));
	};
	const handleSubmit = async (e) => {
		e.preventDefault();
		setSubmitting(true);
		setErrors({});
		try {
			if (isEdit) {
				if ((await axios.put(`/api/v1/mr/doctors/${doctorId}`, formData)).data?.success) {
					toast.success("Doctor details updated successfully!");
					router.visit("/mr/doctors");
				}
			} else if ((await axios.post("/api/v1/mr/doctors", formData)).data?.success) {
				toast.success("New doctor added to your field directory!");
				router.visit("/mr/doctors");
			}
		} catch (err) {
			if (err.response?.status === 422 && err.response?.data?.errors) {
				setErrors(err.response.data.errors);
				toast.error("Please resolve the highlighted validation errors.");
			} else toast.error(err.response?.data?.message || "Failed to save doctor details.");
		} finally {
			setSubmitting(false);
		}
	};
	return /* @__PURE__ */ jsx(MRLayout, {
		title: isEdit ? "Edit Doctor Profile" : "Add New Doctor",
		children: /* @__PURE__ */ jsxs("div", {
			className: "max-w-5xl mx-auto space-y-6 pb-12",
			children: [/* @__PURE__ */ jsxs("div", {
				className: "flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4",
				children: [/* @__PURE__ */ jsxs("div", { children: [
					/* @__PURE__ */ jsxs(Link, {
						href: "/mr/doctors",
						className: "inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-teal-700 transition-colors mb-2 cursor-pointer",
						children: [/* @__PURE__ */ jsx(ArrowLeft, { className: "w-4 h-4" }), /* @__PURE__ */ jsx("span", { children: "Back to Doctors Directory" })]
					}),
					/* @__PURE__ */ jsx("h1", {
						className: "text-2xl font-bold text-slate-900 tracking-tight",
						children: isEdit ? `Edit Doctor Profile` : "Add New Doctor"
					}),
					/* @__PURE__ */ jsx("p", {
						className: "text-xs text-slate-500 mt-0.5",
						children: isEdit ? "Update clinic coordinates, visiting hours, and monthly detailing target calls" : "Register a healthcare practitioner into your assigned field territory and detailing plan"
					})
				] }), /* @__PURE__ */ jsxs("div", {
					className: "flex items-center gap-2",
					children: [/* @__PURE__ */ jsx(Link, {
						href: "/mr/doctors",
						className: "px-4 py-2 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-700 font-semibold text-xs transition-colors cursor-pointer",
						children: "Cancel"
					}), /* @__PURE__ */ jsxs("button", {
						type: "button",
						onClick: handleSubmit,
						disabled: submitting || loadingDoctor,
						className: "flex items-center gap-2 px-5 py-2 rounded-xl bg-teal-700 hover:bg-teal-800 disabled:bg-teal-700/60 text-white font-semibold text-xs shadow-xs transition-colors cursor-pointer",
						children: [/* @__PURE__ */ jsx(Save, { className: "w-4 h-4" }), /* @__PURE__ */ jsx("span", { children: submitting ? "Saving..." : isEdit ? "Update Doctor" : "Save & Register Doctor" })]
					})]
				})]
			}), loadingDoctor ? /* @__PURE__ */ jsx("div", {
				className: "space-y-4",
				children: /* @__PURE__ */ jsxs("div", {
					className: "bg-white rounded-2xl p-8 border border-slate-200/80 shadow-xs animate-pulse space-y-4",
					children: [
						/* @__PURE__ */ jsx("div", { className: "h-6 bg-slate-100 rounded w-1/4" }),
						/* @__PURE__ */ jsxs("div", {
							className: "grid grid-cols-2 gap-4",
							children: [/* @__PURE__ */ jsx("div", { className: "h-10 bg-slate-100 rounded" }), /* @__PURE__ */ jsx("div", { className: "h-10 bg-slate-100 rounded" })]
						}),
						/* @__PURE__ */ jsx("div", { className: "h-24 bg-slate-100 rounded" })
					]
				})
			}) : loadError ? /* @__PURE__ */ jsxs("div", {
				className: "bg-rose-50 border border-rose-200 rounded-2xl p-8 text-center space-y-3",
				children: [
					/* @__PURE__ */ jsx(AlertCircle, { className: "w-10 h-10 text-rose-600 mx-auto" }),
					/* @__PURE__ */ jsx("h3", {
						className: "text-sm font-bold text-rose-900",
						children: loadError
					}),
					/* @__PURE__ */ jsx(Link, {
						href: "/mr/doctors",
						className: "inline-block px-4 py-2 rounded-xl bg-rose-600 text-white text-xs font-semibold cursor-pointer",
						children: "Return to Doctors"
					})
				]
			}) : /* @__PURE__ */ jsxs("form", {
				onSubmit: handleSubmit,
				className: "space-y-6",
				children: [
					/* @__PURE__ */ jsxs("div", {
						className: "bg-white rounded-2xl border border-slate-200/80 shadow-xs p-6 space-y-5",
						children: [/* @__PURE__ */ jsxs("div", {
							className: "flex items-center gap-2.5 pb-3 border-b border-slate-100",
							children: [/* @__PURE__ */ jsx("div", {
								className: "w-8 h-8 rounded-lg bg-teal-50 text-teal-700 flex items-center justify-center",
								children: /* @__PURE__ */ jsx(Stethoscope, { className: "w-4 h-4" })
							}), /* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("h2", {
								className: "text-sm font-bold text-slate-900",
								children: "Healthcare Professional Information"
							}), /* @__PURE__ */ jsx("p", {
								className: "text-[11px] text-slate-500",
								children: "Name, degree, specialization, and practicing territory"
							})] })]
						}), /* @__PURE__ */ jsxs("div", {
							className: "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4",
							children: [
								/* @__PURE__ */ jsxs("div", {
									className: "sm:col-span-2",
									children: [
										/* @__PURE__ */ jsxs("label", {
											className: "block text-xs font-semibold text-slate-700 mb-1",
											children: ["Doctor Full Name ", /* @__PURE__ */ jsx("span", {
												className: "text-rose-500",
												children: "*"
											})]
										}),
										/* @__PURE__ */ jsx("input", {
											type: "text",
											required: true,
											name: "name",
											value: formData.name,
											onChange: handleChange,
											placeholder: "e.g. Dr. Rajesh Sharma",
											className: `w-full px-3.5 py-2.5 bg-slate-50 border rounded-xl text-xs text-slate-900 focus:outline-none focus:bg-white focus:ring-2 focus:ring-teal-600/15 transition-all ${errors.name ? "border-rose-400 focus:border-rose-500" : "border-slate-200 focus:border-teal-600"}`
										}),
										errors.name && /* @__PURE__ */ jsx("p", {
											className: "text-[11px] text-rose-600 mt-1",
											children: errors.name[0]
										})
									]
								}),
								/* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("label", {
									className: "block text-xs font-semibold text-slate-700 mb-1",
									children: "Qualifications / Degree"
								}), /* @__PURE__ */ jsx("input", {
									type: "text",
									name: "qualification",
									value: formData.qualification,
									onChange: handleChange,
									placeholder: "e.g. MBBS, MD (Cardiology)",
									className: "w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 focus:border-teal-600 focus:bg-white rounded-xl text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-teal-600/15 transition-all"
								})] }),
								/* @__PURE__ */ jsxs("div", { children: [
									/* @__PURE__ */ jsxs("label", {
										className: "block text-xs font-semibold text-slate-700 mb-1",
										children: ["Primary Specialization ", /* @__PURE__ */ jsx("span", {
											className: "text-rose-500",
											children: "*"
										})]
									}),
									/* @__PURE__ */ jsx("select", {
										name: "specialization",
										value: formData.specialization,
										onChange: handleChange,
										className: "w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 focus:border-teal-600 focus:bg-white rounded-xl text-xs text-slate-900 focus:outline-none cursor-pointer",
										children: SPECIALTY_OPTIONS$1.map((spec) => /* @__PURE__ */ jsx("option", {
											value: spec,
											children: spec
										}, spec))
									}),
									errors.specialization && /* @__PURE__ */ jsx("p", {
										className: "text-[11px] text-rose-600 mt-1",
										children: errors.specialization[0]
									})
								] }),
								/* @__PURE__ */ jsxs("div", { children: [
									/* @__PURE__ */ jsxs("label", {
										className: "block text-xs font-semibold text-slate-700 mb-1",
										children: ["Territory / Beat Area ", /* @__PURE__ */ jsx("span", {
											className: "text-rose-500",
											children: "*"
										})]
									}),
									/* @__PURE__ */ jsx("input", {
										type: "text",
										required: true,
										name: "territory",
										value: formData.territory,
										onChange: handleChange,
										placeholder: "e.g. South Zone / Central Market",
										className: `w-full px-3.5 py-2.5 bg-slate-50 border rounded-xl text-xs text-slate-900 focus:outline-none focus:bg-white focus:ring-2 focus:ring-teal-600/15 transition-all ${errors.territory ? "border-rose-400 focus:border-rose-500" : "border-slate-200 focus:border-teal-600"}`
									}),
									errors.territory && /* @__PURE__ */ jsx("p", {
										className: "text-[11px] text-rose-600 mt-1",
										children: errors.territory[0]
									})
								] }),
								/* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("label", {
									className: "block text-xs font-semibold text-slate-700 mb-1",
									children: "City / Town"
								}), /* @__PURE__ */ jsx("input", {
									type: "text",
									name: "city",
									value: formData.city,
									onChange: handleChange,
									placeholder: "e.g. Mumbai",
									className: "w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 focus:border-teal-600 focus:bg-white rounded-xl text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-teal-600/15 transition-all"
								})] })
							]
						})]
					}),
					/* @__PURE__ */ jsxs("div", {
						className: "bg-white rounded-2xl border border-slate-200/80 shadow-xs p-6 space-y-5",
						children: [/* @__PURE__ */ jsxs("div", {
							className: "flex items-center gap-2.5 pb-3 border-b border-slate-100",
							children: [/* @__PURE__ */ jsx("div", {
								className: "w-8 h-8 rounded-lg bg-blue-50 text-blue-700 flex items-center justify-center",
								children: /* @__PURE__ */ jsx(Building2, { className: "w-4 h-4" })
							}), /* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("h2", {
								className: "text-sm font-bold text-slate-900",
								children: "Clinic & Visiting Schedule"
							}), /* @__PURE__ */ jsx("p", {
								className: "text-[11px] text-slate-500",
								children: "Practice address and optimal MR detailing time windows"
							})] })]
						}), /* @__PURE__ */ jsxs("div", {
							className: "grid grid-cols-1 sm:grid-cols-2 gap-4",
							children: [
								/* @__PURE__ */ jsxs("div", {
									className: "sm:col-span-2",
									children: [
										/* @__PURE__ */ jsxs("label", {
											className: "block text-xs font-semibold text-slate-700 mb-1",
											children: ["Clinic / Hospital Name ", /* @__PURE__ */ jsx("span", {
												className: "text-rose-500",
												children: "*"
											})]
										}),
										/* @__PURE__ */ jsx("input", {
											type: "text",
											required: true,
											name: "clinic_hospital_name",
											value: formData.clinic_hospital_name,
											onChange: handleChange,
											placeholder: "e.g. Metro Heart & Multi-Specialty Clinic",
											className: `w-full px-3.5 py-2.5 bg-slate-50 border rounded-xl text-xs text-slate-900 focus:outline-none focus:bg-white focus:ring-2 focus:ring-teal-600/15 transition-all ${errors.clinic_hospital_name ? "border-rose-400 focus:border-rose-500" : "border-slate-200 focus:border-teal-600"}`
										}),
										errors.clinic_hospital_name && /* @__PURE__ */ jsx("p", {
											className: "text-[11px] text-rose-600 mt-1",
											children: errors.clinic_hospital_name[0]
										})
									]
								}),
								/* @__PURE__ */ jsxs("div", {
									className: "sm:col-span-2",
									children: [/* @__PURE__ */ jsx("label", {
										className: "block text-xs font-semibold text-slate-700 mb-1",
										children: "Street Address / Chamber Location"
									}), /* @__PURE__ */ jsx("textarea", {
										rows: "2",
										name: "address",
										value: formData.address,
										onChange: handleChange,
										placeholder: "e.g. 3rd Floor, Apollo Arcade, Near City Center",
										className: "w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 focus:border-teal-600 focus:bg-white rounded-xl text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-teal-600/15 transition-all"
									})]
								}),
								/* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("label", {
									className: "block text-xs font-semibold text-slate-700 mb-1",
									children: "OPD / Visiting Days"
								}), /* @__PURE__ */ jsx("input", {
									type: "text",
									name: "visiting_days",
									value: formData.visiting_days,
									onChange: handleChange,
									placeholder: "e.g. Mon - Sat, or Tue/Thu/Sat",
									className: "w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 focus:border-teal-600 focus:bg-white rounded-xl text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-teal-600/15 transition-all"
								})] }),
								/* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("label", {
									className: "block text-xs font-semibold text-slate-700 mb-1",
									children: "Best Visiting Hours for MRs"
								}), /* @__PURE__ */ jsx("input", {
									type: "text",
									name: "visiting_hours",
									value: formData.visiting_hours,
									onChange: handleChange,
									placeholder: "e.g. 11:30 AM - 01:30 PM, 06:00 PM - 08:00 PM",
									className: "w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 focus:border-teal-600 focus:bg-white rounded-xl text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-teal-600/15 transition-all"
								})] })
							]
						})]
					}),
					/* @__PURE__ */ jsxs("div", {
						className: "bg-white rounded-2xl border border-slate-200/80 shadow-xs p-6 space-y-5",
						children: [
							/* @__PURE__ */ jsxs("div", {
								className: "flex items-center gap-2.5 pb-3 border-b border-slate-100",
								children: [/* @__PURE__ */ jsx("div", {
									className: "w-8 h-8 rounded-lg bg-emerald-50 text-emerald-700 flex items-center justify-center",
									children: /* @__PURE__ */ jsx(Target, { className: "w-4 h-4" })
								}), /* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("h2", {
									className: "text-sm font-bold text-slate-900",
									children: "Contact & Detailing Strategy"
								}), /* @__PURE__ */ jsx("p", {
									className: "text-[11px] text-slate-500",
									children: "Tier classification, monthly target call frequency, and key notes"
								})] })]
							}),
							/* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsxs("label", {
								className: "block text-xs font-semibold text-slate-700 mb-2",
								children: ["Doctor Classification Tier ", /* @__PURE__ */ jsx("span", {
									className: "text-rose-500",
									children: "*"
								})]
							}), /* @__PURE__ */ jsx("div", {
								className: "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3",
								children: TIER_OPTIONS.map((t) => {
									const isSelected = formData.tier === t.id;
									return /* @__PURE__ */ jsxs("div", {
										onClick: () => handleTierSelect(t.id, t.defaultFreq),
										className: `p-3.5 rounded-xl border-2 transition-all cursor-pointer flex flex-col justify-between gap-2 ${isSelected ? "border-teal-600 bg-teal-50/50 shadow-xs ring-1 ring-teal-600/20" : "border-slate-200 hover:border-slate-300 bg-slate-50/50"}`,
										children: [/* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsxs("div", {
											className: "flex items-center justify-between",
											children: [/* @__PURE__ */ jsx("span", {
												className: "font-bold text-xs text-slate-900",
												children: t.label
											}), /* @__PURE__ */ jsx("div", {
												className: `w-4 h-4 rounded-full border flex items-center justify-center ${isSelected ? "border-teal-700 bg-teal-700 text-white" : "border-slate-300 bg-white"}`,
												children: isSelected && /* @__PURE__ */ jsx("div", { className: "w-1.5 h-1.5 rounded-full bg-white" })
											})]
										}), /* @__PURE__ */ jsx("p", {
											className: "text-[11px] text-slate-500 mt-1 leading-snug",
											children: t.desc
										})] }), /* @__PURE__ */ jsxs("div", {
											className: "pt-2 border-t border-slate-200/60 text-[10px] font-semibold text-teal-800",
											children: [
												"Suggested: ",
												t.defaultFreq,
												" visits/mo"
											]
										})]
									}, t.id);
								})
							})] }),
							/* @__PURE__ */ jsxs("div", {
								className: "grid grid-cols-1 sm:grid-cols-3 gap-4",
								children: [
									/* @__PURE__ */ jsxs("div", { children: [
										/* @__PURE__ */ jsxs("label", {
											className: "block text-xs font-semibold text-slate-700 mb-1",
											children: ["Phone / Mobile ", /* @__PURE__ */ jsx("span", {
												className: "text-rose-500",
												children: "*"
											})]
										}),
										/* @__PURE__ */ jsx("input", {
											type: "text",
											required: true,
											name: "phone",
											value: formData.phone,
											onChange: handleChange,
											placeholder: "e.g. +91 98201 12345",
											className: `w-full px-3.5 py-2.5 bg-slate-50 border rounded-xl text-xs text-slate-900 focus:outline-none focus:bg-white focus:ring-2 focus:ring-teal-600/15 transition-all ${errors.phone ? "border-rose-400 focus:border-rose-500" : "border-slate-200 focus:border-teal-600"}`
										}),
										errors.phone && /* @__PURE__ */ jsx("p", {
											className: "text-[11px] text-rose-600 mt-1",
											children: errors.phone[0]
										})
									] }),
									/* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("label", {
										className: "block text-xs font-semibold text-slate-700 mb-1",
										children: "Email Address"
									}), /* @__PURE__ */ jsx("input", {
										type: "email",
										name: "email",
										value: formData.email,
										onChange: handleChange,
										placeholder: "e.g. doctor@clinic.com",
										className: "w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 focus:border-teal-600 focus:bg-white rounded-xl text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-teal-600/15 transition-all"
									})] }),
									/* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsxs("label", {
										className: "block text-xs font-semibold text-slate-700 mb-1",
										children: ["Target Calls / Month ", /* @__PURE__ */ jsx("span", {
											className: "text-rose-500",
											children: "*"
										})]
									}), /* @__PURE__ */ jsx("input", {
										type: "number",
										min: "1",
										max: "30",
										required: true,
										name: "target_frequency_per_month",
										value: formData.target_frequency_per_month,
										onChange: handleChange,
										className: "w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 focus:border-teal-600 focus:bg-white rounded-xl text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-teal-600/15 transition-all"
									})] })
								]
							}),
							/* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("label", {
								className: "block text-xs font-semibold text-slate-700 mb-1",
								children: "Directory Status"
							}), /* @__PURE__ */ jsxs("div", {
								className: "flex items-center gap-4",
								children: [/* @__PURE__ */ jsxs("label", {
									className: "flex items-center gap-2 cursor-pointer text-xs font-medium text-slate-700",
									children: [/* @__PURE__ */ jsx("input", {
										type: "radio",
										name: "status",
										value: "active",
										checked: formData.status === "active",
										onChange: handleChange,
										className: "text-teal-700 focus:ring-teal-700"
									}), /* @__PURE__ */ jsx("span", { children: "Active (Included in Detailing Route)" })]
								}), /* @__PURE__ */ jsxs("label", {
									className: "flex items-center gap-2 cursor-pointer text-xs font-medium text-slate-700",
									children: [/* @__PURE__ */ jsx("input", {
										type: "radio",
										name: "status",
										value: "inactive",
										checked: formData.status === "inactive",
										onChange: handleChange,
										className: "text-teal-700 focus:ring-teal-700"
									}), /* @__PURE__ */ jsx("span", { children: "Inactive (Temporarily on hold)" })]
								})]
							})] }),
							/* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("label", {
								className: "block text-xs font-semibold text-slate-700 mb-1",
								children: "Detailing Notes & Molecule Preferences"
							}), /* @__PURE__ */ jsx("textarea", {
								rows: "3",
								name: "notes",
								value: formData.notes,
								onChange: handleChange,
								placeholder: "Key prescription habits, focus products, sample preferences, or competitor molecule objections...",
								className: "w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 focus:border-teal-600 focus:bg-white rounded-xl text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-teal-600/15 transition-all"
							})] })
						]
					}),
					/* @__PURE__ */ jsxs("div", {
						className: "flex items-center justify-end gap-3 pt-4 border-t border-slate-200",
						children: [/* @__PURE__ */ jsx(Link, {
							href: "/mr/doctors",
							className: "px-5 py-2.5 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-700 font-semibold text-xs transition-colors cursor-pointer",
							children: "Cancel & Return"
						}), /* @__PURE__ */ jsxs("button", {
							type: "submit",
							disabled: submitting,
							className: "flex items-center gap-2 px-6 py-2.5 rounded-xl bg-teal-700 hover:bg-teal-800 disabled:bg-teal-700/60 text-white font-semibold text-xs shadow-xs transition-colors cursor-pointer",
							children: [/* @__PURE__ */ jsx(Save, { className: "w-4 h-4" }), /* @__PURE__ */ jsx("span", { children: submitting ? "Saving..." : isEdit ? "Update Doctor Profile" : "Save & Register Doctor" })]
						})]
					})
				]
			})]
		})
	});
}
//#endregion
//#region resources/js/Pages/mr/Doctors.jsx
var Doctors_exports = /* @__PURE__ */ __exportAll({ default: () => Doctors });
var SPECIALTY_OPTIONS = [
	"General Medicine",
	"Cardiology",
	"Diabetology",
	"Orthopedics",
	"Pediatrics",
	"Pulmonology",
	"Gynecology",
	"Dermatology",
	"Neurology",
	"Gastroenterology",
	"ENT",
	"Ophthalmology"
];
var TIER_CONFIG = {
	core: {
		label: "Core KOL",
		bg: "bg-emerald-50",
		text: "text-emerald-700",
		border: "border-emerald-200",
		dot: "bg-emerald-500"
	},
	class_a: {
		label: "Class A",
		bg: "bg-teal-50",
		text: "text-teal-700",
		border: "border-teal-200",
		dot: "bg-teal-500"
	},
	class_b: {
		label: "Class B",
		bg: "bg-amber-50",
		text: "text-amber-700",
		border: "border-amber-200",
		dot: "bg-amber-500"
	},
	class_c: {
		label: "Class C",
		bg: "bg-slate-100",
		text: "text-slate-600",
		border: "border-slate-200",
		dot: "bg-slate-400"
	}
};
function Doctors({ initialFilters = {} }) {
	const [doctors, setDoctors] = useState([]);
	const [meta, setMeta] = useState(null);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(null);
	const [search, setSearch] = useState(initialFilters.search || "");
	const [specialization, setSpecialization] = useState(initialFilters.specialization || "all");
	const [tier, setTier] = useState(initialFilters.tier || "all");
	const [territory, setTerritory] = useState(initialFilters.territory || "all");
	const [viewMode, setViewMode] = useState("grid");
	const [profileDoctor, setProfileDoctor] = useState(null);
	const [deleteDoctorId, setDeleteDoctorId] = useState(null);
	const fetchDoctors = async () => {
		setLoading(true);
		setError(null);
		try {
			const params = {};
			if (search.trim()) params.search = search.trim();
			if (specialization !== "all") params.specialization = specialization;
			if (tier !== "all") params.tier = tier;
			if (territory !== "all") params.territory = territory;
			const res = await axios.get("/api/v1/mr/doctors", { params });
			if (res.data?.success) {
				setDoctors(res.data.data || []);
				setMeta(res.data.meta || null);
			}
		} catch (err) {
			console.error("Failed to load doctors:", err);
			setError(err.response?.data?.message || "Unable to connect to field service. Please retry.");
		} finally {
			setLoading(false);
		}
	};
	useEffect(() => {
		const timer = setTimeout(() => {
			fetchDoctors();
		}, 250);
		return () => clearTimeout(timer);
	}, [
		search,
		specialization,
		tier,
		territory
	]);
	const handleDeleteDoctor = async (id) => {
		try {
			if ((await axios.delete(`/api/v1/mr/doctors/${id}`)).data?.success) {
				toast.success("Doctor removed from directory");
				setDeleteDoctorId(null);
				fetchDoctors();
			}
		} catch (err) {
			toast.error(err.response?.data?.message || "Failed to remove doctor.");
		}
	};
	const handleResetFilters = () => {
		setSearch("");
		setSpecialization("all");
		setTier("all");
		setTerritory("all");
	};
	return /* @__PURE__ */ jsxs(MRLayout, {
		title: "Doctor Directory",
		children: [
			/* @__PURE__ */ jsxs("div", {
				className: "space-y-5 max-w-7xl mx-auto",
				children: [
					/* @__PURE__ */ jsxs("div", {
						className: "flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-2 border-b border-slate-200/80",
						children: [/* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsxs("div", {
							className: "flex items-center gap-2",
							children: [/* @__PURE__ */ jsx("h1", {
								className: "text-xl sm:text-2xl font-semibold text-slate-800 tracking-tight",
								children: "Doctor Directory"
							}), meta?.total !== void 0 && /* @__PURE__ */ jsxs("span", {
								className: "px-2 py-0.5 rounded-full text-[11px] font-semibold bg-slate-100 text-slate-700 border border-slate-200",
								children: [meta.total, " Doctors"]
							})]
						}), /* @__PURE__ */ jsx("p", {
							className: "text-xs text-slate-500 font-normal mt-0.5",
							children: "Healthcare professionals mapped to your field territory & visit schedules"
						})] }), /* @__PURE__ */ jsxs("div", {
							className: "flex items-center gap-2",
							children: [/* @__PURE__ */ jsxs("button", {
								type: "button",
								onClick: fetchDoctors,
								disabled: loading,
								className: "inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-200/80 bg-white hover:bg-slate-50 text-slate-700 text-xs font-medium transition-colors cursor-pointer",
								title: "Refresh directory",
								children: [/* @__PURE__ */ jsx(RefreshCw, { className: `w-3.5 h-3.5 ${loading ? "animate-spin text-slate-900" : "text-slate-500"}` }), /* @__PURE__ */ jsx("span", { children: "Refresh" })]
							}), /* @__PURE__ */ jsxs(Link, {
								href: "/mr/doctors/create",
								className: "inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-medium text-xs transition-colors cursor-pointer",
								children: [/* @__PURE__ */ jsx(Plus, { className: "w-3.5 h-3.5 stroke-[2]" }), /* @__PURE__ */ jsx("span", { children: "Add Doctor" })]
							})]
						})]
					}),
					/* @__PURE__ */ jsxs("div", {
						className: "grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4",
						children: [
							/* @__PURE__ */ jsxs("div", {
								className: "bg-white p-5 rounded-2xl border border-slate-200/80 space-y-1",
								children: [
									/* @__PURE__ */ jsxs("div", {
										className: "flex items-center justify-between",
										children: [/* @__PURE__ */ jsx("span", {
											className: "text-xs font-medium text-slate-500",
											children: "Total Directory"
										}), /* @__PURE__ */ jsx("div", {
											className: "w-7 h-7 rounded-lg bg-slate-100 text-slate-700 flex items-center justify-center",
											children: /* @__PURE__ */ jsx(UserCheck, { className: "w-3.5 h-3.5" })
										})]
									}),
									/* @__PURE__ */ jsx("div", {
										className: "text-2xl font-semibold text-slate-800",
										children: meta ? meta.total : "—"
									}),
									/* @__PURE__ */ jsxs("p", {
										className: "text-[11px] text-slate-400 font-normal",
										children: [meta?.active_count ?? 0, " active in territory"]
									})
								]
							}),
							/* @__PURE__ */ jsxs("div", {
								className: "bg-white p-5 rounded-2xl border border-slate-200/80 space-y-1",
								children: [
									/* @__PURE__ */ jsxs("div", {
										className: "flex items-center justify-between",
										children: [/* @__PURE__ */ jsx("span", {
											className: "text-xs font-medium text-slate-500",
											children: "Core KOLs"
										}), /* @__PURE__ */ jsx("div", {
											className: "w-7 h-7 rounded-lg bg-emerald-50 text-emerald-700 border border-emerald-100 flex items-center justify-center",
											children: /* @__PURE__ */ jsx(Sparkles, { className: "w-3.5 h-3.5" })
										})]
									}),
									/* @__PURE__ */ jsx("div", {
										className: "text-2xl font-semibold text-emerald-700",
										children: meta ? meta.core_count : "—"
									}),
									/* @__PURE__ */ jsx("p", {
										className: "text-[11px] text-emerald-600 font-medium",
										children: "Top priority prescribers"
									})
								]
							}),
							/* @__PURE__ */ jsxs("div", {
								className: "bg-white p-5 rounded-2xl border border-slate-200/80 space-y-1",
								children: [
									/* @__PURE__ */ jsxs("div", {
										className: "flex items-center justify-between",
										children: [/* @__PURE__ */ jsx("span", {
											className: "text-xs font-medium text-slate-500",
											children: "Monthly Call Target"
										}), /* @__PURE__ */ jsx("div", {
											className: "w-7 h-7 rounded-lg bg-violet-50 text-violet-700 border border-violet-100 flex items-center justify-center",
											children: /* @__PURE__ */ jsx(Target, { className: "w-3.5 h-3.5" })
										})]
									}),
									/* @__PURE__ */ jsx("div", {
										className: "text-2xl font-semibold text-violet-700",
										children: meta ? meta.total_monthly_target_visits : "—"
									}),
									/* @__PURE__ */ jsx("p", {
										className: "text-[11px] text-slate-400 font-normal",
										children: "Scheduled field visits"
									})
								]
							}),
							/* @__PURE__ */ jsxs("div", {
								className: "bg-white p-5 rounded-2xl border border-slate-200/80 space-y-1",
								children: [
									/* @__PURE__ */ jsxs("div", {
										className: "flex items-center justify-between",
										children: [/* @__PURE__ */ jsx("span", {
											className: "text-xs font-medium text-slate-500",
											children: "Field Zones"
										}), /* @__PURE__ */ jsx("div", {
											className: "w-7 h-7 rounded-lg bg-amber-50 text-amber-700 border border-amber-100 flex items-center justify-center",
											children: /* @__PURE__ */ jsx(MapPin, { className: "w-3.5 h-3.5" })
										})]
									}),
									/* @__PURE__ */ jsx("div", {
										className: "text-2xl font-semibold text-amber-700",
										children: meta ? meta.territories?.length || 0 : "—"
									}),
									/* @__PURE__ */ jsx("p", {
										className: "text-[11px] text-slate-400 font-normal",
										children: "Assigned territories"
									})
								]
							})
						]
					}),
					/* @__PURE__ */ jsxs("div", {
						className: "bg-white p-4 rounded-2xl border border-slate-200/80 space-y-3",
						children: [/* @__PURE__ */ jsxs("div", {
							className: "flex flex-col md:flex-row items-stretch md:items-center gap-2.5",
							children: [
								/* @__PURE__ */ jsxs("div", {
									className: "relative flex-1",
									children: [
										/* @__PURE__ */ jsx(Search, { className: "w-3.5 h-3.5 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" }),
										/* @__PURE__ */ jsx("input", {
											type: "text",
											value: search,
											onChange: (e) => setSearch(e.target.value),
											placeholder: "Search by doctor name, clinic, territory, or phone...",
											className: "w-full pl-9 pr-8 py-2 bg-slate-50 border border-slate-200/80 focus:border-slate-900 focus:bg-white rounded-xl text-xs text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-1 focus:ring-slate-900 transition-all"
										}),
										search && /* @__PURE__ */ jsx("button", {
											type: "button",
											onClick: () => setSearch(""),
											className: "absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-0.5",
											children: /* @__PURE__ */ jsx(X, { className: "w-3.5 h-3.5" })
										})
									]
								}),
								/* @__PURE__ */ jsx("div", {
									className: "w-full md:w-48",
									children: /* @__PURE__ */ jsxs("select", {
										value: specialization,
										onChange: (e) => setSpecialization(e.target.value),
										className: "w-full py-2 px-3 bg-slate-50 border border-slate-200/80 focus:border-slate-900 focus:bg-white rounded-xl text-xs text-slate-700 focus:outline-none focus:ring-1 focus:ring-slate-900 cursor-pointer",
										children: [/* @__PURE__ */ jsx("option", {
											value: "all",
											children: "All Specialties"
										}), SPECIALTY_OPTIONS.map((spec) => /* @__PURE__ */ jsx("option", {
											value: spec,
											children: spec
										}, spec))]
									})
								}),
								/* @__PURE__ */ jsx("div", {
									className: "w-full md:w-36",
									children: /* @__PURE__ */ jsxs("select", {
										value: tier,
										onChange: (e) => setTier(e.target.value),
										className: "w-full py-2 px-3 bg-slate-50 border border-slate-200/80 focus:border-slate-900 focus:bg-white rounded-xl text-xs text-slate-700 focus:outline-none focus:ring-1 focus:ring-slate-900 cursor-pointer",
										children: [
											/* @__PURE__ */ jsx("option", {
												value: "all",
												children: "All Tiers"
											}),
											/* @__PURE__ */ jsx("option", {
												value: "core",
												children: "Core KOL"
											}),
											/* @__PURE__ */ jsx("option", {
												value: "class_a",
												children: "Class A"
											}),
											/* @__PURE__ */ jsx("option", {
												value: "class_b",
												children: "Class B"
											}),
											/* @__PURE__ */ jsx("option", {
												value: "class_c",
												children: "Class C"
											})
										]
									})
								}),
								/* @__PURE__ */ jsxs("div", {
									className: "flex items-center gap-1 border border-slate-200/80 rounded-xl p-0.5 bg-slate-50 self-end md:self-auto",
									children: [/* @__PURE__ */ jsx("button", {
										type: "button",
										onClick: () => setViewMode("grid"),
										className: `p-1.5 rounded-lg transition-colors cursor-pointer ${viewMode === "grid" ? "bg-white text-slate-900 font-semibold shadow-2xs" : "text-slate-400 hover:text-slate-700"}`,
										title: "Card grid view",
										children: /* @__PURE__ */ jsx(LayoutGrid, { className: "w-4 h-4" })
									}), /* @__PURE__ */ jsx("button", {
										type: "button",
										onClick: () => setViewMode("table"),
										className: `p-1.5 rounded-lg transition-colors cursor-pointer ${viewMode === "table" ? "bg-white text-slate-900 font-semibold shadow-2xs" : "text-slate-400 hover:text-slate-700"}`,
										title: "Table view",
										children: /* @__PURE__ */ jsx(List, { className: "w-4 h-4" })
									})]
								})
							]
						}), (search || specialization !== "all" || tier !== "all" || territory !== "all") && /* @__PURE__ */ jsxs("div", {
							className: "flex items-center gap-2 pt-1 text-[11px] text-slate-500 flex-wrap",
							children: [
								/* @__PURE__ */ jsx("span", { children: "Active filters:" }),
								search && /* @__PURE__ */ jsxs("span", {
									className: "inline-flex items-center gap-1 bg-slate-100 text-slate-700 px-2 py-0.5 rounded-md font-medium border border-slate-200",
									children: [
										"Search: \"",
										search,
										"\"",
										/* @__PURE__ */ jsx(X, {
											className: "w-3 h-3 cursor-pointer",
											onClick: () => setSearch("")
										})
									]
								}),
								specialization !== "all" && /* @__PURE__ */ jsxs("span", {
									className: "inline-flex items-center gap-1 bg-slate-100 text-slate-700 px-2 py-0.5 rounded-md font-medium border border-slate-200",
									children: [specialization, /* @__PURE__ */ jsx(X, {
										className: "w-3 h-3 cursor-pointer",
										onClick: () => setSpecialization("all")
									})]
								}),
								tier !== "all" && /* @__PURE__ */ jsxs("span", {
									className: "inline-flex items-center gap-1 bg-slate-100 text-slate-700 px-2 py-0.5 rounded-md font-medium border border-slate-200",
									children: [
										"Tier: ",
										TIER_CONFIG[tier]?.label || tier,
										/* @__PURE__ */ jsx(X, {
											className: "w-3 h-3 cursor-pointer",
											onClick: () => setTier("all")
										})
									]
								}),
								/* @__PURE__ */ jsx("button", {
									type: "button",
									onClick: handleResetFilters,
									className: "text-slate-700 hover:text-slate-900 hover:underline font-semibold ml-1 cursor-pointer",
									children: "Clear all"
								})
							]
						})]
					}),
					loading ? /* @__PURE__ */ jsx("div", {
						className: "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4",
						children: [
							1,
							2,
							3,
							4,
							5,
							6
						].map((n) => /* @__PURE__ */ jsxs("div", {
							className: "bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs animate-pulse space-y-3",
							children: [
								/* @__PURE__ */ jsxs("div", {
									className: "flex items-center gap-3",
									children: [/* @__PURE__ */ jsx("div", { className: "w-12 h-12 rounded-xl bg-slate-100" }), /* @__PURE__ */ jsxs("div", {
										className: "flex-1 space-y-2",
										children: [/* @__PURE__ */ jsx("div", { className: "h-4 bg-slate-100 rounded w-3/4" }), /* @__PURE__ */ jsx("div", { className: "h-3 bg-slate-100 rounded w-1/2" })]
									})]
								}),
								/* @__PURE__ */ jsx("div", { className: "h-3 bg-slate-100 rounded w-full" }),
								/* @__PURE__ */ jsx("div", { className: "h-3 bg-slate-100 rounded w-2/3" }),
								/* @__PURE__ */ jsx("div", { className: "h-8 bg-slate-100 rounded-xl mt-4" })
							]
						}, n))
					}) : error ? /* @__PURE__ */ jsxs("div", {
						className: "bg-rose-50 border border-rose-200 rounded-2xl p-6 text-center space-y-2",
						children: [
							/* @__PURE__ */ jsx(AlertCircle, { className: "w-8 h-8 text-rose-600 mx-auto" }),
							/* @__PURE__ */ jsx("h3", {
								className: "text-sm font-bold text-rose-900",
								children: error
							}),
							/* @__PURE__ */ jsx("button", {
								type: "button",
								onClick: fetchDoctors,
								className: "text-xs font-semibold text-rose-700 hover:underline cursor-pointer",
								children: "Retry Loading"
							})
						]
					}) : doctors.length === 0 ? /* @__PURE__ */ jsxs("div", {
						className: "bg-white rounded-2xl border border-slate-200/80 p-12 text-center space-y-3",
						children: [
							/* @__PURE__ */ jsx("div", {
								className: "w-14 h-14 rounded-2xl bg-slate-100 text-slate-700 flex items-center justify-center mx-auto",
								children: /* @__PURE__ */ jsx(Stethoscope, { className: "w-7 h-7 stroke-[1.8]" })
							}),
							/* @__PURE__ */ jsx("h3", {
								className: "text-base font-bold text-slate-800",
								children: "No Doctors Found"
							}),
							/* @__PURE__ */ jsx("p", {
								className: "text-xs text-slate-500 max-w-sm mx-auto",
								children: search || specialization !== "all" || tier !== "all" ? "No healthcare professionals match your current search criteria or filters." : "Your doctor directory is currently empty. Add your first doctor to begin planning visits."
							}),
							search || specialization !== "all" || tier !== "all" ? /* @__PURE__ */ jsx("button", {
								type: "button",
								onClick: handleResetFilters,
								className: "px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold transition-colors cursor-pointer",
								children: "Clear Filters"
							}) : /* @__PURE__ */ jsx(Link, {
								href: "/mr/doctors/create",
								className: "px-3.5 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-medium transition-colors cursor-pointer",
								children: "+ Add First Doctor"
							})
						]
					}) : viewMode === "grid" ? /* @__PURE__ */ jsx("div", {
						className: "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4",
						children: doctors.map((doc) => {
							const tierInfo = TIER_CONFIG[doc.tier] || TIER_CONFIG.class_a;
							return /* @__PURE__ */ jsxs("div", {
								className: "bg-white rounded-2xl border border-slate-200/80 hover:border-slate-300 transition-colors flex flex-col overflow-hidden group",
								children: [/* @__PURE__ */ jsxs("div", {
									className: "p-5 pb-3 space-y-3 flex-1",
									children: [
										/* @__PURE__ */ jsxs("div", {
											className: "flex items-start justify-between gap-2",
											children: [/* @__PURE__ */ jsxs("div", {
												className: "flex items-center gap-3 min-w-0",
												children: [/* @__PURE__ */ jsx("div", {
													className: "w-10 h-10 rounded-xl bg-slate-900 text-white font-semibold text-xs flex items-center justify-center shrink-0",
													children: doc.name.replace("Dr. ", "").charAt(0)
												}), /* @__PURE__ */ jsxs("div", {
													className: "min-w-0 flex-1",
													children: [/* @__PURE__ */ jsx("h3", {
														className: "text-sm font-semibold text-slate-800 truncate leading-tight",
														children: doc.name
													}), doc.qualification && /* @__PURE__ */ jsx("p", {
														className: "text-[11px] text-slate-400 truncate mt-0.5",
														children: doc.qualification
													})]
												})]
											}), /* @__PURE__ */ jsxs("span", {
												className: `inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md text-[10px] font-semibold uppercase tracking-wider shrink-0 border ${tierInfo.bg} ${tierInfo.text} ${tierInfo.border}`,
												children: [/* @__PURE__ */ jsx("span", { className: `w-1.5 h-1.5 rounded-full ${tierInfo.dot}` }), tierInfo.label]
											})]
										}),
										/* @__PURE__ */ jsxs("div", {
											className: "flex items-center gap-2 pt-1 flex-wrap",
											children: [/* @__PURE__ */ jsxs("span", {
												className: "inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-medium bg-slate-100 text-slate-700",
												children: [/* @__PURE__ */ jsx(Stethoscope, { className: "w-3.5 h-3.5 text-slate-500" }), doc.specialization]
											}), /* @__PURE__ */ jsxs("span", {
												className: "inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-medium bg-slate-100 text-slate-700",
												children: [
													/* @__PURE__ */ jsx(Target, { className: "w-3.5 h-3.5 text-violet-600" }),
													doc.target_frequency_per_month,
													" calls / mo"
												]
											})]
										}),
										/* @__PURE__ */ jsxs("div", {
											className: "space-y-1.5 pt-2 text-xs text-slate-600 border-t border-slate-100",
											children: [
												/* @__PURE__ */ jsxs("div", {
													className: "flex items-start gap-2",
													children: [/* @__PURE__ */ jsx(Building2, { className: "w-3.5 h-3.5 text-slate-400 shrink-0 mt-0.5" }), /* @__PURE__ */ jsx("span", {
														className: "font-medium text-slate-700 line-clamp-1",
														children: doc.clinic_hospital_name
													})]
												}),
												/* @__PURE__ */ jsxs("div", {
													className: "flex items-center gap-2",
													children: [/* @__PURE__ */ jsx(MapPin, { className: "w-3.5 h-3.5 text-slate-400 shrink-0" }), /* @__PURE__ */ jsxs("span", {
														className: "truncate text-slate-500",
														children: [doc.territory, doc.city ? `, ${doc.city}` : ""]
													})]
												}),
												doc.visiting_hours && /* @__PURE__ */ jsxs("div", {
													className: "flex items-center gap-2 text-[11px] text-slate-400 font-normal",
													children: [/* @__PURE__ */ jsx(Clock, { className: "w-3.5 h-3.5 text-slate-400 shrink-0" }), /* @__PURE__ */ jsxs("span", {
														className: "truncate",
														children: [
															doc.visiting_hours,
															" (",
															doc.visiting_days || "Daily",
															")"
														]
													})]
												})
											]
										})
									]
								}), /* @__PURE__ */ jsxs("div", {
									className: "px-5 py-3 bg-slate-50/70 border-t border-slate-100 flex items-center justify-between text-xs",
									children: [/* @__PURE__ */ jsx("div", {
										className: "flex items-center gap-2",
										children: doc.phone && /* @__PURE__ */ jsxs("a", {
											href: `tel:${doc.phone.replace(/\s+/g, "")}`,
											className: "flex items-center gap-1.5 text-slate-700 hover:text-slate-900 font-medium",
											title: "Click to call",
											children: [/* @__PURE__ */ jsx(Phone, { className: "w-3.5 h-3.5 text-sky-600" }), /* @__PURE__ */ jsx("span", { children: doc.phone })]
										})
									}), /* @__PURE__ */ jsxs("div", {
										className: "flex items-center gap-1",
										children: [
											/* @__PURE__ */ jsx("button", {
												type: "button",
												onClick: () => setProfileDoctor(doc),
												className: "p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-white transition-colors cursor-pointer",
												title: "View Full Profile",
												children: /* @__PURE__ */ jsx(Eye, { className: "w-4 h-4" })
											}),
											/* @__PURE__ */ jsx(Link, {
												href: `/mr/doctors/${doc.id}/edit`,
												className: "p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-white transition-colors cursor-pointer",
												title: "Edit Doctor Details",
												children: /* @__PURE__ */ jsx(Edit2, { className: "w-4 h-4" })
											}),
											/* @__PURE__ */ jsx("button", {
												type: "button",
												onClick: () => setDeleteDoctorId(doc.id),
												className: "p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-white transition-colors cursor-pointer",
												title: "Remove Doctor",
												children: /* @__PURE__ */ jsx(Trash2, { className: "w-4 h-4" })
											})
										]
									})]
								})]
							}, doc.id);
						})
					}) : /* @__PURE__ */ jsx("div", {
						className: "bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden",
						children: /* @__PURE__ */ jsx("div", {
							className: "overflow-x-auto",
							children: /* @__PURE__ */ jsxs("table", {
								className: "w-full text-left text-xs",
								children: [/* @__PURE__ */ jsx("thead", {
									className: "bg-slate-50 text-slate-500 uppercase tracking-wider font-semibold border-b border-slate-200 text-[10px]",
									children: /* @__PURE__ */ jsxs("tr", { children: [
										/* @__PURE__ */ jsx("th", {
											className: "py-3 px-4",
											children: "Doctor"
										}),
										/* @__PURE__ */ jsx("th", {
											className: "py-3 px-4",
											children: "Specialty"
										}),
										/* @__PURE__ */ jsx("th", {
											className: "py-3 px-4",
											children: "Clinic & Location"
										}),
										/* @__PURE__ */ jsx("th", {
											className: "py-3 px-4",
											children: "Tier"
										}),
										/* @__PURE__ */ jsx("th", {
											className: "py-3 px-4",
											children: "Target Calls"
										}),
										/* @__PURE__ */ jsx("th", {
											className: "py-3 px-4",
											children: "Contact"
										}),
										/* @__PURE__ */ jsx("th", {
											className: "py-3 px-4 text-right",
											children: "Actions"
										})
									] })
								}), /* @__PURE__ */ jsx("tbody", {
									className: "divide-y divide-slate-100 text-slate-700",
									children: doctors.map((doc) => {
										const tierInfo = TIER_CONFIG[doc.tier] || TIER_CONFIG.class_a;
										return /* @__PURE__ */ jsxs("tr", {
											className: "hover:bg-slate-50/60 transition-colors",
											children: [
												/* @__PURE__ */ jsxs("td", {
													className: "py-3.5 px-4 font-bold text-slate-900",
													children: [/* @__PURE__ */ jsx("div", { children: doc.name }), doc.qualification && /* @__PURE__ */ jsx("div", {
														className: "text-[10px] text-slate-500 font-normal",
														children: doc.qualification
													})]
												}),
												/* @__PURE__ */ jsx("td", {
													className: "py-3.5 px-4",
													children: /* @__PURE__ */ jsx("span", {
														className: "font-semibold text-slate-800",
														children: doc.specialization
													})
												}),
												/* @__PURE__ */ jsxs("td", {
													className: "py-3.5 px-4",
													children: [/* @__PURE__ */ jsx("div", {
														className: "font-medium text-slate-900",
														children: doc.clinic_hospital_name
													}), /* @__PURE__ */ jsx("div", {
														className: "text-[10px] text-slate-500",
														children: doc.territory
													})]
												}),
												/* @__PURE__ */ jsx("td", {
													className: "py-3.5 px-4",
													children: /* @__PURE__ */ jsxs("span", {
														className: `inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider border ${tierInfo.bg} ${tierInfo.text} ${tierInfo.border}`,
														children: [/* @__PURE__ */ jsx("span", { className: `w-1.5 h-1.5 rounded-full ${tierInfo.dot}` }), tierInfo.label]
													})
												}),
												/* @__PURE__ */ jsxs("td", {
													className: "py-3.5 px-4 font-semibold text-slate-800",
													children: [doc.target_frequency_per_month, " / mo"]
												}),
												/* @__PURE__ */ jsxs("td", {
													className: "py-3.5 px-4",
													children: [/* @__PURE__ */ jsx("div", {
														className: "font-medium text-slate-900",
														children: doc.phone
													}), doc.email && /* @__PURE__ */ jsx("div", {
														className: "text-[10px] text-slate-500",
														children: doc.email
													})]
												}),
												/* @__PURE__ */ jsx("td", {
													className: "py-3.5 px-4 text-right",
													children: /* @__PURE__ */ jsxs("div", {
														className: "flex items-center justify-end gap-1",
														children: [
															/* @__PURE__ */ jsx("button", {
																type: "button",
																onClick: () => setProfileDoctor(doc),
																className: "p-1 text-slate-400 hover:text-slate-900 transition-colors cursor-pointer",
																title: "View",
																children: /* @__PURE__ */ jsx(Eye, { className: "w-4 h-4" })
															}),
															/* @__PURE__ */ jsx(Link, {
																href: `/mr/doctors/${doc.id}/edit`,
																className: "p-1 text-slate-400 hover:text-slate-900 transition-colors cursor-pointer",
																title: "Edit",
																children: /* @__PURE__ */ jsx(Edit2, { className: "w-4 h-4" })
															}),
															/* @__PURE__ */ jsx("button", {
																type: "button",
																onClick: () => setDeleteDoctorId(doc.id),
																className: "p-1 text-slate-400 hover:text-rose-600 transition-colors cursor-pointer",
																title: "Delete",
																children: /* @__PURE__ */ jsx(Trash2, { className: "w-4 h-4" })
															})
														]
													})
												})
											]
										}, doc.id);
									})
								})]
							})
						})
					})
				]
			}),
			profileDoctor && /* @__PURE__ */ jsx("div", {
				className: "fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs animate-in fade-in duration-150",
				children: /* @__PURE__ */ jsxs("div", {
					className: "bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 space-y-4",
					children: [
						/* @__PURE__ */ jsxs("div", {
							className: "flex items-start justify-between",
							children: [/* @__PURE__ */ jsxs("div", {
								className: "flex items-center gap-3",
								children: [/* @__PURE__ */ jsx("div", {
									className: "w-12 h-12 rounded-xl bg-slate-900 text-white font-bold text-base flex items-center justify-center shadow-xs",
									children: profileDoctor.name.replace("Dr. ", "").charAt(0)
								}), /* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("h3", {
									className: "text-base font-bold text-slate-900",
									children: profileDoctor.name
								}), /* @__PURE__ */ jsx("p", {
									className: "text-xs text-slate-500",
									children: profileDoctor.qualification || profileDoctor.specialization
								})] })]
							}), /* @__PURE__ */ jsx("button", {
								type: "button",
								onClick: () => setProfileDoctor(null),
								className: "p-1 text-slate-400 hover:text-slate-600 rounded-lg cursor-pointer",
								children: /* @__PURE__ */ jsx(X, { className: "w-5 h-5" })
							})]
						}),
						/* @__PURE__ */ jsxs("div", {
							className: "bg-slate-50 p-3.5 rounded-xl space-y-2 text-xs",
							children: [
								/* @__PURE__ */ jsxs("div", {
									className: "flex items-center justify-between",
									children: [/* @__PURE__ */ jsx("span", {
										className: "text-slate-500",
										children: "Tier / Classification:"
									}), /* @__PURE__ */ jsx("span", {
										className: "font-bold text-slate-800 capitalize",
										children: profileDoctor.tier.replace("_", " ")
									})]
								}),
								/* @__PURE__ */ jsxs("div", {
									className: "flex items-center justify-between",
									children: [/* @__PURE__ */ jsx("span", {
										className: "text-slate-500",
										children: "Target Field Calls:"
									}), /* @__PURE__ */ jsxs("span", {
										className: "font-bold text-slate-900",
										children: [profileDoctor.target_frequency_per_month, " visits / month"]
									})]
								}),
								/* @__PURE__ */ jsxs("div", {
									className: "flex items-center justify-between",
									children: [/* @__PURE__ */ jsx("span", {
										className: "text-slate-500",
										children: "Clinic / Hospital:"
									}), /* @__PURE__ */ jsx("span", {
										className: "font-semibold text-slate-800",
										children: profileDoctor.clinic_hospital_name
									})]
								}),
								/* @__PURE__ */ jsxs("div", {
									className: "flex items-center justify-between",
									children: [/* @__PURE__ */ jsx("span", {
										className: "text-slate-500",
										children: "Territory:"
									}), /* @__PURE__ */ jsxs("span", {
										className: "font-medium text-slate-700",
										children: [
											profileDoctor.territory,
											", ",
											profileDoctor.city
										]
									})]
								}),
								profileDoctor.visiting_hours && /* @__PURE__ */ jsxs("div", {
									className: "flex items-center justify-between",
									children: [/* @__PURE__ */ jsx("span", {
										className: "text-slate-500",
										children: "Visiting Hours:"
									}), /* @__PURE__ */ jsx("span", {
										className: "text-slate-700",
										children: profileDoctor.visiting_hours
									})]
								})
							]
						}),
						profileDoctor.notes && /* @__PURE__ */ jsxs("div", {
							className: "p-3 bg-slate-50 rounded-xl border border-slate-200/80 text-xs",
							children: [/* @__PURE__ */ jsx("span", {
								className: "font-bold text-slate-900 block mb-0.5",
								children: "Detailing & Prescribing Notes:"
							}), /* @__PURE__ */ jsx("p", {
								className: "text-slate-600",
								children: profileDoctor.notes
							})]
						}),
						/* @__PURE__ */ jsxs("div", {
							className: "pt-2 border-t border-slate-100 flex items-center justify-between",
							children: [/* @__PURE__ */ jsxs("a", {
								href: `tel:${profileDoctor.phone.replace(/\s+/g, "")}`,
								className: "flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-medium transition-colors",
								children: [/* @__PURE__ */ jsx(Phone, { className: "w-3.5 h-3.5" }), /* @__PURE__ */ jsx("span", { children: "Call Doctor" })]
							}), /* @__PURE__ */ jsx(Link, {
								href: `/mr/doctors/${profileDoctor.id}/edit`,
								className: "px-4 py-2 rounded-xl border border-slate-200/80 hover:bg-slate-50 text-slate-700 text-xs font-medium transition-colors cursor-pointer",
								children: "Edit Profile"
							})]
						})
					]
				})
			}),
			deleteDoctorId && /* @__PURE__ */ jsx("div", {
				className: "fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs animate-in fade-in duration-150",
				children: /* @__PURE__ */ jsxs("div", {
					className: "bg-white rounded-2xl max-w-sm w-full p-5 shadow-2xl border border-slate-200 text-center space-y-3",
					children: [
						/* @__PURE__ */ jsx("div", {
							className: "w-12 h-12 rounded-full bg-rose-50 text-rose-600 flex items-center justify-center mx-auto",
							children: /* @__PURE__ */ jsx(Trash2, { className: "w-6 h-6 stroke-[1.8]" })
						}),
						/* @__PURE__ */ jsx("h3", {
							className: "text-sm font-bold text-slate-900",
							children: "Remove Doctor?"
						}),
						/* @__PURE__ */ jsx("p", {
							className: "text-xs text-slate-500",
							children: "Are you sure you want to remove this healthcare professional from your active territory directory?"
						}),
						/* @__PURE__ */ jsxs("div", {
							className: "flex items-center justify-center gap-2.5 pt-2",
							children: [/* @__PURE__ */ jsx("button", {
								type: "button",
								onClick: () => setDeleteDoctorId(null),
								className: "px-4 py-2 rounded-xl text-slate-600 hover:bg-slate-100 text-xs font-semibold cursor-pointer",
								children: "Cancel"
							}), /* @__PURE__ */ jsx("button", {
								type: "button",
								onClick: () => handleDeleteDoctor(deleteDoctorId),
								className: "px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-semibold cursor-pointer shadow-xs",
								children: "Confirm Delete"
							})]
						})
					]
				})
			})
		]
	});
}
//#endregion
//#region resources/js/Pages/mr/Products.jsx
var Products_exports = /* @__PURE__ */ __exportAll({ default: () => Products });
function Products({ initialFilters = {} }) {
	const [products, setProducts] = useState([]);
	const [meta, setMeta] = useState(null);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(null);
	const [search, setSearch] = useState(initialFilters.search || "");
	const [categoryFilter, setCategoryFilter] = useState(initialFilters.category || "all");
	const [dosageFilter, setDosageFilter] = useState(initialFilters.dosage_form || "all");
	const [viewMode, setViewMode] = useState("grid");
	const [detailProduct, setDetailProduct] = useState(null);
	const [presentationMode, setPresentationMode] = useState(false);
	const [activeSlide, setActiveSlide] = useState(0);
	const [deckTheme, setDeckTheme] = useState("light");
	const [fitMode, setFitMode] = useState("full");
	const fetchProducts = async () => {
		setLoading(true);
		setError(null);
		try {
			const params = {};
			if (search.trim()) params.search = search.trim();
			if (categoryFilter !== "all") params.category = categoryFilter;
			if (dosageFilter !== "all") params.dosage_form = dosageFilter;
			const res = await axios.get("/api/v1/mr/products", { params });
			if (res.data?.success) {
				setProducts(res.data.data || []);
				setMeta(res.data.meta || null);
			}
		} catch (err) {
			console.error("Failed to load products:", err);
			setError("Unable to load product catalog. Please retry.");
		} finally {
			setLoading(false);
		}
	};
	useEffect(() => {
		const timer = setTimeout(() => {
			fetchProducts();
		}, 250);
		return () => clearTimeout(timer);
	}, [
		search,
		categoryFilter,
		dosageFilter
	]);
	const handleOpenPresentation = (prod, slideIndex = 0) => {
		setDetailProduct(prod);
		setActiveSlide(slideIndex);
		setPresentationMode(true);
	};
	const handleToggleFullscreen = () => {
		if (!document.fullscreenElement) document.documentElement.requestFullscreen?.().catch(() => {});
		else document.exitFullscreen?.().catch(() => {});
	};
	const handleClosePresentation = () => {
		setPresentationMode(false);
	};
	const carouselSlides = detailProduct?.slides && detailProduct.slides.length > 0 ? detailProduct.slides : [];
	const totalSlideCount = carouselSlides.length;
	const handleNextSlide = () => {
		if (activeSlide < totalSlideCount - 1) setActiveSlide((prev) => prev + 1);
	};
	const handlePrevSlide = () => {
		if (activeSlide > 0) setActiveSlide((prev) => prev - 1);
	};
	useEffect(() => {
		const handleKeyDown = (e) => {
			if (!presentationMode) return;
			if (e.key === "ArrowRight" || e.key === "Space") handleNextSlide();
			else if (e.key === "ArrowLeft") handlePrevSlide();
			else if (e.key === "Escape") handleClosePresentation();
		};
		window.addEventListener("keydown", handleKeyDown);
		return () => window.removeEventListener("keydown", handleKeyDown);
	}, [
		presentationMode,
		activeSlide,
		totalSlideCount
	]);
	return /* @__PURE__ */ jsxs(MRLayout, {
		title: "Products & Digital Detailing Aids",
		children: [/* @__PURE__ */ jsxs("div", {
			className: "space-y-5 max-w-7xl mx-auto pb-10 font-sans",
			children: [
				/* @__PURE__ */ jsxs("div", {
					className: "flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs",
					children: [/* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsxs("div", {
						className: "flex items-center gap-2.5",
						children: [/* @__PURE__ */ jsx("h1", {
							className: "text-xl font-bold text-slate-900 tracking-tight",
							children: "Product Portfolio & E-Detailing"
						}), meta?.total !== void 0 && /* @__PURE__ */ jsxs("span", {
							className: "px-2.5 py-0.5 rounded-full text-xs font-semibold bg-slate-100 text-slate-800 border border-slate-200/80",
							children: [meta.total, " Formulations"]
						})]
					}), /* @__PURE__ */ jsx("p", {
						className: "text-xs text-slate-500 mt-1",
						children: "Interactive pharmaceutical visual aids, molecule compositions, and prescribing guides for in-clinic doctor calls"
					})] }), /* @__PURE__ */ jsxs("div", {
						className: "flex items-center gap-2",
						children: [
							/* @__PURE__ */ jsx("button", {
								type: "button",
								onClick: fetchProducts,
								disabled: loading,
								className: "p-2 rounded-xl border border-slate-200/80 hover:bg-slate-50 text-slate-600 transition-colors cursor-pointer",
								title: "Refresh products catalog",
								children: /* @__PURE__ */ jsx(RefreshCw, { className: `w-4 h-4 ${loading ? "animate-spin text-slate-900" : ""}` })
							}),
							/* @__PURE__ */ jsxs(Link, {
								href: "/mr/detailing",
								className: "flex items-center gap-2 px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-semibold text-xs border border-slate-200/80 transition-colors cursor-pointer",
								title: "Launch Doctor E-Detailing Interactive Slide Show",
								children: [/* @__PURE__ */ jsx(Presentation, { className: "w-4 h-4 stroke-[2]" }), /* @__PURE__ */ jsx("span", { children: "Doctor E-Detailing" })]
							}),
							/* @__PURE__ */ jsxs(Link, {
								href: "/mr/visits",
								className: "flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-medium text-xs transition-colors shadow-xs cursor-pointer",
								children: [/* @__PURE__ */ jsx(Calendar, { className: "w-4 h-4 stroke-[2]" }), /* @__PURE__ */ jsx("span", { children: "Field Visits" })]
							})
						]
					})]
				}),
				/* @__PURE__ */ jsx("div", {
					className: "bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs space-y-3",
					children: /* @__PURE__ */ jsxs("div", {
						className: "flex flex-col md:flex-row items-stretch md:items-center gap-2.5",
						children: [
							/* @__PURE__ */ jsxs("div", {
								className: "relative flex-1",
								children: [
									/* @__PURE__ */ jsx(Search, { className: "w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" }),
									/* @__PURE__ */ jsx("input", {
										type: "text",
										value: search,
										onChange: (e) => setSearch(e.target.value),
										placeholder: "Search by brand name, generic molecule, indication, or composition...",
										className: "w-full pl-9 pr-8 py-2 bg-slate-50/50 border border-slate-200/80 focus:border-slate-900 focus:bg-white rounded-xl text-xs text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-1 focus:ring-slate-900 transition-all"
									}),
									search && /* @__PURE__ */ jsx("button", {
										type: "button",
										onClick: () => setSearch(""),
										className: "absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-0.5 cursor-pointer",
										children: /* @__PURE__ */ jsx(X, { className: "w-3.5 h-3.5" })
									})
								]
							}),
							/* @__PURE__ */ jsx("div", {
								className: "w-full md:w-56",
								children: /* @__PURE__ */ jsxs("select", {
									value: categoryFilter,
									onChange: (e) => setCategoryFilter(e.target.value),
									className: "w-full py-2 px-3 bg-slate-50/50 border border-slate-200/80 focus:border-slate-900 focus:bg-white rounded-xl text-xs text-slate-700 focus:outline-none cursor-pointer",
									children: [/* @__PURE__ */ jsx("option", {
										value: "all",
										children: "All Therapeutic Segments"
									}), meta?.categories?.map((cat) => /* @__PURE__ */ jsxs("option", {
										value: cat.slug,
										children: [
											cat.name,
											" (",
											cat.products_count ?? 0,
											")"
										]
									}, cat.id))]
								})
							}),
							/* @__PURE__ */ jsx("div", {
								className: "w-full md:w-44",
								children: /* @__PURE__ */ jsxs("select", {
									value: dosageFilter,
									onChange: (e) => setDosageFilter(e.target.value),
									className: "w-full py-2 px-3 bg-slate-50/50 border border-slate-200/80 focus:border-slate-900 focus:bg-white rounded-xl text-xs text-slate-700 focus:outline-none cursor-pointer",
									children: [/* @__PURE__ */ jsx("option", {
										value: "all",
										children: "All Dosage Forms"
									}), meta?.dosage_forms?.map((form) => /* @__PURE__ */ jsx("option", {
										value: form,
										children: form
									}, form))]
								})
							}),
							/* @__PURE__ */ jsxs("div", {
								className: "flex items-center bg-slate-100 p-1 rounded-xl self-end md:self-center shrink-0",
								children: [/* @__PURE__ */ jsx("button", {
									type: "button",
									onClick: () => setViewMode("grid"),
									className: `p-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${viewMode === "grid" ? "bg-white text-slate-900 shadow-xs" : "text-slate-500 hover:text-slate-900"}`,
									title: "Grid presentation cards",
									children: /* @__PURE__ */ jsx(Layers, { className: "w-4 h-4" })
								}), /* @__PURE__ */ jsx("button", {
									type: "button",
									onClick: () => setViewMode("list"),
									className: `p-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${viewMode === "list" ? "bg-white text-slate-900 shadow-xs" : "text-slate-500 hover:text-slate-900"}`,
									title: "List view",
									children: /* @__PURE__ */ jsx(BookOpen, { className: "w-4 h-4" })
								})]
							})
						]
					})
				}),
				loading ? /* @__PURE__ */ jsx("div", {
					className: "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4",
					children: [
						1,
						2,
						3,
						4,
						5,
						6
					].map((i) => /* @__PURE__ */ jsxs("div", {
						className: "bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs animate-pulse space-y-3",
						children: [
							/* @__PURE__ */ jsx("div", { className: "h-32 bg-slate-100 rounded-xl w-full" }),
							/* @__PURE__ */ jsx("div", { className: "h-4 bg-slate-100 rounded w-2/3" }),
							/* @__PURE__ */ jsx("div", { className: "h-3 bg-slate-100 rounded w-1/2" }),
							/* @__PURE__ */ jsx("div", { className: "h-8 bg-slate-100 rounded w-full mt-2" })
						]
					}, i))
				}) : error ? /* @__PURE__ */ jsxs("div", {
					className: "bg-rose-50 border border-rose-200 rounded-2xl p-8 text-center space-y-3",
					children: [
						/* @__PURE__ */ jsx(AlertCircle, { className: "w-8 h-8 text-rose-600 mx-auto" }),
						/* @__PURE__ */ jsx("h3", {
							className: "text-sm font-bold text-rose-900",
							children: error
						}),
						/* @__PURE__ */ jsx("button", {
							type: "button",
							onClick: fetchProducts,
							className: "text-xs font-semibold text-rose-700 hover:underline cursor-pointer",
							children: "Retry Loading Catalog"
						})
					]
				}) : products.length === 0 ? /* @__PURE__ */ jsxs("div", {
					className: "bg-white rounded-2xl border border-slate-200/80 p-12 text-center space-y-3 shadow-xs",
					children: [
						/* @__PURE__ */ jsx("div", {
							className: "w-14 h-14 rounded-2xl bg-slate-100 text-slate-700 flex items-center justify-center mx-auto",
							children: /* @__PURE__ */ jsx(Pill, { className: "w-7 h-7 stroke-[1.8]" })
						}),
						/* @__PURE__ */ jsx("h3", {
							className: "text-base font-bold text-slate-900",
							children: "No Formulations Found"
						}),
						/* @__PURE__ */ jsx("p", {
							className: "text-xs text-slate-500 max-w-sm mx-auto",
							children: "No products match your current search query or therapeutic category filters."
						}),
						/* @__PURE__ */ jsx("button", {
							type: "button",
							onClick: () => {
								setSearch("");
								setCategoryFilter("all");
								setDosageFilter("all");
							},
							className: "px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-medium transition-colors cursor-pointer",
							children: "Clear All Filters"
						})
					]
				}) : viewMode === "grid" ? /* @__PURE__ */ jsx("div", {
					className: "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4",
					children: products.map((p) => {
						const primaryImg = p.primary_image?.file_path || p.images?.[0]?.file_path;
						return /* @__PURE__ */ jsxs("div", {
							className: "bg-white rounded-2xl border border-slate-200/80 hover:border-slate-300 hover:shadow-xs transition-all p-5 flex flex-col justify-between gap-4 group",
							children: [/* @__PURE__ */ jsxs("div", {
								className: "space-y-3",
								children: [
									/* @__PURE__ */ jsxs("div", {
										className: "flex items-start gap-3.5",
										children: [/* @__PURE__ */ jsx("div", {
											className: "w-20 h-20 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-center p-2 shrink-0 overflow-hidden group-hover:scale-102 transition-transform",
											children: primaryImg ? /* @__PURE__ */ jsx("img", {
												src: primaryImg,
												alt: p.brand_name,
												className: "w-full h-full object-contain"
											}) : /* @__PURE__ */ jsx(Pill, { className: "w-8 h-8 text-slate-400" })
										}), /* @__PURE__ */ jsxs("div", {
											className: "min-w-0 flex-1",
											children: [
												/* @__PURE__ */ jsxs("div", {
													className: "flex items-center gap-1.5 flex-wrap mb-1",
													children: [p.category && /* @__PURE__ */ jsx("span", {
														className: "px-2 py-0.5 rounded-md text-[10px] font-semibold bg-slate-100 text-slate-700 border border-slate-200/60",
														children: p.category.name
													}), /* @__PURE__ */ jsx("span", {
														className: `px-2 py-0.5 rounded-md text-[10px] font-semibold ${p.prescription_type === "Rx Only" ? "bg-slate-100 text-slate-800 border border-slate-200/80" : "bg-slate-50 text-slate-600 border border-slate-200/60"}`,
														children: p.prescription_type || "Rx"
													})]
												}),
												/* @__PURE__ */ jsx("h3", {
													className: "text-sm font-bold text-slate-900 group-hover:text-slate-700 transition-colors truncate",
													children: p.brand_name
												}),
												/* @__PURE__ */ jsx("p", {
													className: "text-[11px] text-slate-500 font-medium line-clamp-1",
													children: p.generic_name
												}),
												/* @__PURE__ */ jsxs("div", {
													className: "text-[10px] text-slate-600 font-medium mt-0.5",
													children: [
														p.dosage_form,
														" • ",
														p.strength
													]
												})
											]
										})]
									}),
									p.compositions && p.compositions.length > 0 && /* @__PURE__ */ jsx("div", {
										className: "pt-2 border-t border-slate-100 flex flex-wrap gap-1",
										children: p.compositions.map((c) => /* @__PURE__ */ jsxs("span", {
											className: "inline-flex items-center px-2 py-0.5 rounded-md text-[10px] font-medium bg-slate-50 text-slate-700 border border-slate-200/60",
											children: [
												c.ingredient_name,
												" (",
												c.strength,
												" ",
												c.unit,
												")"
											]
										}, c.id))
									}),
									p.indications && /* @__PURE__ */ jsxs("p", {
										className: "text-xs text-slate-600 line-clamp-2 leading-relaxed",
										children: [/* @__PURE__ */ jsx("span", {
											className: "font-semibold text-slate-700",
											children: "Indications: "
										}), p.indications]
									})
								]
							}), /* @__PURE__ */ jsx("div", {
								className: "pt-3 border-t border-slate-100",
								children: /* @__PURE__ */ jsxs("button", {
									type: "button",
									onClick: () => handleOpenPresentation(p, 0),
									className: "w-full py-2.5 px-4 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-medium shadow-xs transition-colors flex items-center justify-center gap-2 cursor-pointer",
									title: "Open Interactive Visual Aid Carousel",
									children: [/* @__PURE__ */ jsx(Play, { className: "w-3.5 h-3.5 fill-current" }), /* @__PURE__ */ jsx("span", { children: "Present Visual Aid" })]
								})
							})]
						}, p.id);
					})
				}) : /* @__PURE__ */ jsx("div", {
					className: "bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden",
					children: /* @__PURE__ */ jsx("div", {
						className: "overflow-x-auto",
						children: /* @__PURE__ */ jsxs("table", {
							className: "w-full text-left border-collapse",
							children: [/* @__PURE__ */ jsx("thead", { children: /* @__PURE__ */ jsxs("tr", {
								className: "bg-slate-50/80 border-b border-slate-200/80 text-[11px] font-bold text-slate-500 uppercase tracking-wider",
								children: [
									/* @__PURE__ */ jsx("th", {
										className: "py-3 px-4",
										children: "Brand & Molecule"
									}),
									/* @__PURE__ */ jsx("th", {
										className: "py-3 px-4",
										children: "Segment"
									}),
									/* @__PURE__ */ jsx("th", {
										className: "py-3 px-4",
										children: "Dosage / Strength"
									}),
									/* @__PURE__ */ jsx("th", {
										className: "py-3 px-4",
										children: "Active Compositions"
									}),
									/* @__PURE__ */ jsx("th", {
										className: "py-3 px-4 text-right",
										children: "Detailing Actions"
									})
								]
							}) }), /* @__PURE__ */ jsx("tbody", {
								className: "divide-y divide-slate-100 text-xs",
								children: products.map((p) => /* @__PURE__ */ jsxs("tr", {
									className: "hover:bg-slate-50/60 transition-colors",
									children: [
										/* @__PURE__ */ jsxs("td", {
											className: "py-3 px-4",
											children: [/* @__PURE__ */ jsx("div", {
												className: "font-bold text-slate-900",
												children: p.brand_name
											}), /* @__PURE__ */ jsx("div", {
												className: "text-[11px] text-slate-500",
												children: p.generic_name
											})]
										}),
										/* @__PURE__ */ jsx("td", {
											className: "py-3 px-4",
											children: /* @__PURE__ */ jsx("span", {
												className: "px-2 py-0.5 rounded-md text-[10px] font-semibold bg-slate-100 text-slate-700 border border-slate-200/60",
												children: p.category?.name || "General"
											})
										}),
										/* @__PURE__ */ jsxs("td", {
											className: "py-3 px-4 font-medium text-slate-700",
											children: [
												p.dosage_form,
												" ",
												/* @__PURE__ */ jsx("span", {
													className: "text-slate-400",
													children: "•"
												}),
												" ",
												p.strength
											]
										}),
										/* @__PURE__ */ jsx("td", {
											className: "py-3 px-4",
											children: /* @__PURE__ */ jsxs("div", {
												className: "flex flex-wrap gap-1 max-w-xs",
												children: [p.compositions?.slice(0, 2).map((c) => /* @__PURE__ */ jsx("span", {
													className: "text-[10px] bg-slate-100 text-slate-700 px-1.5 py-0.5 rounded font-medium border border-slate-200/60",
													children: c.ingredient_name
												}, c.id)), p.compositions?.length > 2 && /* @__PURE__ */ jsxs("span", {
													className: "text-[10px] text-slate-400",
													children: [
														"+",
														p.compositions.length - 2,
														" more"
													]
												})]
											})
										}),
										/* @__PURE__ */ jsx("td", {
											className: "py-3 px-4 text-right",
											children: /* @__PURE__ */ jsxs("button", {
												type: "button",
												onClick: () => handleOpenPresentation(p, 0),
												className: "px-3.5 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-medium shadow-xs cursor-pointer inline-flex items-center gap-1.5",
												title: "Open Interactive Visual Aid Carousel",
												children: [/* @__PURE__ */ jsx(Play, { className: "w-3.5 h-3.5 fill-current" }), /* @__PURE__ */ jsx("span", { children: "Present Visual Aid" })]
											})
										})
									]
								}, p.id))
							})]
						})
					})
				})
			]
		}), presentationMode && detailProduct && typeof document !== "undefined" && createPortal(/* @__PURE__ */ jsxs("div", {
			className: "fixed inset-0 z-[999999] w-screen h-screen bg-black select-none overflow-hidden flex items-center justify-center animate-in fade-in duration-200",
			tabIndex: 0,
			children: [
				/* @__PURE__ */ jsxs("div", {
					className: "absolute top-4 right-4 z-50 flex items-center gap-2",
					children: [/* @__PURE__ */ jsx("button", {
						type: "button",
						onClick: handleToggleFullscreen,
						className: "w-10 h-10 rounded-full bg-black/60 hover:bg-black/90 text-white/80 hover:text-white backdrop-blur-md border border-white/20 flex items-center justify-center transition-all cursor-pointer shadow-2xl active:scale-95",
						title: "Toggle Fullscreen",
						children: /* @__PURE__ */ jsx(Maximize2, { className: "w-4 h-4" })
					}), /* @__PURE__ */ jsx("button", {
						type: "button",
						onClick: handleClosePresentation,
						className: "w-10 h-10 rounded-full bg-black/60 hover:bg-rose-600 text-white/80 hover:text-white backdrop-blur-md border border-white/20 flex items-center justify-center transition-all cursor-pointer shadow-2xl active:scale-95",
						title: "Exit Presentation (Esc)",
						children: /* @__PURE__ */ jsx(X, { className: "w-5 h-5 stroke-[2.5]" })
					})]
				}),
				totalSlideCount > 0 && /* @__PURE__ */ jsx("div", {
					className: "absolute top-4 left-4 z-50 pointer-events-none",
					children: /* @__PURE__ */ jsxs("div", {
						className: "px-3.5 py-1.5 rounded-full bg-black/65 backdrop-blur-md border border-white/20 text-white text-xs font-medium shadow-2xl flex items-center gap-2",
						children: [
							/* @__PURE__ */ jsxs("span", {
								className: "text-white font-semibold",
								children: [
									activeSlide + 1,
									" / ",
									totalSlideCount
								]
							}),
							/* @__PURE__ */ jsx("span", {
								className: "text-white/40",
								children: "•"
							}),
							/* @__PURE__ */ jsx("span", {
								className: "text-slate-300 max-w-xs truncate",
								children: detailProduct.brand_name
							})
						]
					})
				}),
				/* @__PURE__ */ jsx("div", {
					className: "w-full h-full flex items-center justify-center relative cursor-default",
					onClick: (e) => {
						const rect = e.currentTarget.getBoundingClientRect();
						const clickX = e.clientX - rect.left;
						if (clickX > rect.width * .6) handleNextSlide();
						else if (clickX < rect.width * .4) handlePrevSlide();
					},
					children: totalSlideCount === 0 ? /* @__PURE__ */ jsxs("div", {
						className: "text-center text-white space-y-3 p-8 max-w-md bg-slate-900/90 rounded-3xl border border-white/10 shadow-2xl",
						children: [
							/* @__PURE__ */ jsx(Image, { className: "w-12 h-12 text-slate-400 mx-auto" }),
							/* @__PURE__ */ jsx("h3", {
								className: "text-lg font-bold text-white",
								children: "No Slide Images Uploaded"
							}),
							/* @__PURE__ */ jsx("p", {
								className: "text-xs text-slate-400",
								children: "Please upload slide images in Admin > Visual Aid Carousels."
							}),
							/* @__PURE__ */ jsx("button", {
								type: "button",
								onClick: handleClosePresentation,
								className: "px-5 py-2 rounded-xl bg-white hover:bg-slate-100 text-slate-900 text-xs font-semibold transition-colors cursor-pointer",
								children: "Close"
							})
						]
					}) : /* @__PURE__ */ jsx("img", {
						src: carouselSlides[activeSlide]?.image_path,
						alt: carouselSlides[activeSlide]?.title || `Slide ${activeSlide + 1}`,
						className: "w-full h-full object-contain select-none transition-all duration-150 animate-in fade-in"
					}, activeSlide)
				}),
				activeSlide > 0 && /* @__PURE__ */ jsx("button", {
					type: "button",
					onClick: (e) => {
						e.stopPropagation();
						handlePrevSlide();
					},
					className: "absolute left-4 top-1/2 -translate-y-1/2 z-40 w-14 h-14 rounded-full bg-black/60 hover:bg-white/20 text-white/80 hover:text-white backdrop-blur-md border border-white/20 flex items-center justify-center transition-all hover:scale-105 active:scale-95 cursor-pointer shadow-2xl group",
					title: "Previous Slide (← Left Arrow)",
					children: /* @__PURE__ */ jsx(ChevronLeft, { className: "w-8 h-8 stroke-[2.2] group-hover:-translate-x-0.5 transition-transform" })
				}),
				activeSlide < totalSlideCount - 1 && /* @__PURE__ */ jsx("button", {
					type: "button",
					onClick: (e) => {
						e.stopPropagation();
						handleNextSlide();
					},
					className: "absolute right-4 top-1/2 -translate-y-1/2 z-40 w-14 h-14 rounded-full bg-black/60 hover:bg-white/20 text-white/80 hover:text-white backdrop-blur-md border border-white/20 flex items-center justify-center transition-all hover:scale-105 active:scale-95 cursor-pointer shadow-2xl group",
					title: "Next Slide (→ Right Arrow or Space)",
					children: /* @__PURE__ */ jsx(ChevronRight, { className: "w-8 h-8 stroke-[2.2] group-hover:translate-x-0.5 transition-transform" })
				}),
				totalSlideCount > 1 && /* @__PURE__ */ jsx("div", {
					className: "absolute bottom-4 left-1/2 -translate-x-1/2 z-40 px-3 py-1.5 rounded-full bg-black/60 backdrop-blur-md border border-white/15 flex items-center gap-1.5 shadow-2xl",
					children: carouselSlides.map((_, idx) => /* @__PURE__ */ jsx("button", {
						type: "button",
						onClick: (e) => {
							e.stopPropagation();
							setActiveSlide(idx);
						},
						className: `transition-all rounded-full cursor-pointer ${activeSlide === idx ? "w-6 h-2 bg-white" : "w-2 h-2 bg-white/40 hover:bg-white/80"}`,
						title: `Jump to Slide ${idx + 1}`
					}, idx))
				})
			]
		}), document.body)]
	});
}
//#endregion
//#region resources/js/Pages/mr/Schedule.jsx
var Schedule_exports = /* @__PURE__ */ __exportAll({ default: () => Schedule });
var CALL_OUTCOMES$1 = [
	"Spoke with Doctor - Positive response",
	"Prescription promised for upcoming month",
	"Requested clinic visit with product samples",
	"Busy in OPD - Requested callback later",
	"Call unanswered / Left reminder message"
];
var VISIT_OUTCOMES$1 = [
	"Visited clinic & completed product detailing",
	"Handed over samples & clinical visual aid shown",
	"Doctor committed to trial on 5+ patients",
	"Doctor in surgery / Not available at clinic",
	"Follow-up visit requested next week"
];
function Schedule({ schedules = [], metrics = {}, doctors = [], products = [], todayDate = "", filters = {} }) {
	const [activeTab, setActiveTab] = useState(filters.tab || "today");
	const [actionFilter, setActionFilter] = useState(filters.action_type || "all");
	const [statusFilter, setStatusFilter] = useState(filters.status || "all");
	const [searchQuery, setSearchQuery] = useState(filters.search || "");
	const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
	const [outcomeModalSchedule, setOutcomeModalSchedule] = useState(null);
	const [outcomeNote, setOutcomeNote] = useState("");
	const [isSubmitting, setIsSubmitting] = useState(false);
	const [rescheduleItem, setRescheduleItem] = useState(null);
	const [rescheduleDate, setRescheduleDate] = useState("");
	const [rescheduleTime, setRescheduleTime] = useState("");
	const [formData, setFormData] = useState({
		action_type: "call",
		contact_mode: "doctor",
		doctor_id: "",
		custom_contact_name: "",
		contact_type: "doctor",
		scheduled_date: todayDate || (/* @__PURE__ */ new Date()).toISOString().split("T")[0],
		scheduled_time: "Morning OPD (10:30 AM)",
		priority: "normal",
		purpose: "",
		notes: ""
	});
	const filteredSchedules = useMemo(() => {
		return schedules.filter((item) => {
			if (actionFilter !== "all" && item.action_type !== actionFilter) return false;
			if (statusFilter !== "all" && item.status !== statusFilter) return false;
			if (searchQuery.trim()) {
				const q = searchQuery.toLowerCase();
				const docName = item.doctor?.name?.toLowerCase() || "";
				const docHospital = item.doctor?.clinic_hospital_name?.toLowerCase() || "";
				const customName = item.custom_contact_name?.toLowerCase() || "";
				const purpose = item.purpose?.toLowerCase() || "";
				const notes = item.notes?.toLowerCase() || "";
				if (!docName.includes(q) && !docHospital.includes(q) && !customName.includes(q) && !purpose.includes(q) && !notes.includes(q)) return false;
			}
			return true;
		});
	}, [
		schedules,
		actionFilter,
		statusFilter,
		searchQuery
	]);
	const handleTabChange = (newTab) => {
		setActiveTab(newTab);
		router.get("/mr/schedule", {
			tab: newTab,
			action_type: actionFilter,
			status: statusFilter,
			search: searchQuery
		}, {
			preserveState: true,
			preserveScroll: true
		});
	};
	const openOutcomeModal = (schedule) => {
		setOutcomeModalSchedule(schedule);
		setOutcomeNote(schedule.outcome_note || "");
	};
	const handleStatusUpdate = (scheduleId, status, customOutcomeNote = null) => {
		setIsSubmitting(true);
		router.put(`/mr/schedule/${scheduleId}/status`, {
			status,
			outcome_note: customOutcomeNote !== null ? customOutcomeNote : outcomeNote
		}, {
			preserveScroll: true,
			onSuccess: () => {
				setIsSubmitting(false);
				setOutcomeModalSchedule(null);
				setOutcomeNote("");
				toast.success(status === "completed" ? "Marked as completed!" : `Status updated to ${status}`);
			},
			onError: () => {
				setIsSubmitting(false);
				toast.error("Failed to update status.");
			}
		});
	};
	const handleRescheduleSubmit = (e) => {
		e.preventDefault();
		if (!rescheduleItem || !rescheduleDate) return;
		setIsSubmitting(true);
		router.put(`/mr/schedule/${rescheduleItem.id}/status`, {
			status: "rescheduled",
			new_date: rescheduleDate,
			new_time: rescheduleTime
		}, {
			preserveScroll: true,
			onSuccess: () => {
				setIsSubmitting(false);
				setRescheduleItem(null);
				setRescheduleDate("");
				setRescheduleTime("");
				toast.success("Rescheduled successfully!");
			},
			onError: () => {
				setIsSubmitting(false);
				toast.error("Failed to reschedule.");
			}
		});
	};
	const handleDelete = (scheduleId) => {
		if (!confirm("Are you sure you want to remove this item from your schedule?")) return;
		router.delete(`/mr/schedule/${scheduleId}`, {
			preserveScroll: true,
			onSuccess: () => toast.success("Schedule item removed."),
			onError: () => toast.error("Failed to remove item.")
		});
	};
	const handleCreateSubmit = (e) => {
		e.preventDefault();
		if (formData.contact_mode === "doctor" && !formData.doctor_id) {
			toast.error("Please select a doctor.");
			return;
		}
		if (formData.contact_mode === "custom" && !formData.custom_contact_name.trim()) {
			toast.error("Please enter the contact name.");
			return;
		}
		if (!formData.purpose.trim()) {
			toast.error("Please specify the purpose or discussion topic.");
			return;
		}
		setIsSubmitting(true);
		router.post("/mr/schedule", {
			doctor_id: formData.contact_mode === "doctor" ? formData.doctor_id : null,
			custom_contact_name: formData.contact_mode === "custom" ? formData.custom_contact_name : null,
			contact_type: formData.contact_mode === "doctor" ? "doctor" : formData.contact_type,
			action_type: formData.action_type,
			scheduled_date: formData.scheduled_date,
			scheduled_time: formData.scheduled_time,
			priority: formData.priority,
			purpose: formData.purpose,
			notes: formData.notes
		}, {
			preserveScroll: true,
			onSuccess: () => {
				setIsSubmitting(false);
				setIsCreateModalOpen(false);
				setFormData({
					action_type: "call",
					contact_mode: "doctor",
					doctor_id: "",
					custom_contact_name: "",
					contact_type: "doctor",
					scheduled_date: todayDate || (/* @__PURE__ */ new Date()).toISOString().split("T")[0],
					scheduled_time: "Morning OPD (10:30 AM)",
					priority: "normal",
					purpose: "",
					notes: ""
				});
				toast.success("Added to your schedule!");
			},
			onError: (errors) => {
				setIsSubmitting(false);
				const first = Object.values(errors)[0] || "Failed to save schedule.";
				toast.error(first);
			}
		});
	};
	const selectedDoctorObj = useMemo(() => {
		if (!formData.doctor_id) return null;
		return doctors.find((d) => String(d.id) === String(formData.doctor_id));
	}, [formData.doctor_id, doctors]);
	const addProductToPurpose = (brandName) => {
		setFormData((prev) => ({
			...prev,
			purpose: prev.purpose ? `${prev.purpose}, ${brandName}` : `Detailing ${brandName}`
		}));
	};
	return /* @__PURE__ */ jsx(MRLayout, {
		title: "Planner & Calls",
		children: /* @__PURE__ */ jsxs("div", {
			className: "space-y-6",
			children: [
				/* @__PURE__ */ jsxs("div", {
					className: "flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs",
					children: [/* @__PURE__ */ jsxs("div", { children: [
						/* @__PURE__ */ jsxs("div", {
							className: "flex items-center gap-2 text-xs font-semibold text-teal-700 uppercase tracking-wider mb-1",
							children: [
								/* @__PURE__ */ jsx(CalendarClock, { className: "w-4 h-4" }),
								/* @__PURE__ */ jsx("span", { children: "MR Field Daily Planner" }),
								/* @__PURE__ */ jsx("span", {
									className: "inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold bg-teal-50 text-teal-800 border border-teal-200/60",
									children: todayDate ? new Date(todayDate).toLocaleDateString("en-US", {
										weekday: "short",
										month: "short",
										day: "numeric",
										year: "numeric"
									}) : "Today"
								})
							]
						}),
						/* @__PURE__ */ jsx("h1", {
							className: "text-2xl font-bold tracking-tight text-slate-900",
							children: "Today's Calls & Clinic Visits"
						}),
						/* @__PURE__ */ jsx("p", {
							className: "text-xs text-slate-500 mt-0.5",
							children: "Organize your field schedule, complete telephonic calls, record clinic visits, and mark outcomes."
						})
					] }), /* @__PURE__ */ jsx("div", {
						className: "flex items-center gap-2.5 shrink-0",
						children: /* @__PURE__ */ jsxs("button", {
							type: "button",
							onClick: () => setIsCreateModalOpen(true),
							className: "inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-teal-700 hover:bg-teal-800 text-white text-xs font-semibold shadow-xs hover:shadow-sm transition-all cursor-pointer",
							children: [/* @__PURE__ */ jsx(Plus, { className: "w-4 h-4 stroke-[2.2]" }), /* @__PURE__ */ jsx("span", { children: "Schedule Call or Visit" })]
						})
					})]
				}),
				/* @__PURE__ */ jsxs("div", {
					className: "grid grid-cols-1 md:grid-cols-4 gap-4",
					children: [
						/* @__PURE__ */ jsxs("div", {
							className: "md:col-span-2 bg-slate-900 text-white p-5 rounded-2xl border border-slate-800 relative overflow-hidden flex flex-col justify-between",
							children: [
								/* @__PURE__ */ jsxs("div", {
									className: "relative z-10",
									children: [/* @__PURE__ */ jsxs("div", {
										className: "flex items-center justify-between mb-2",
										children: [/* @__PURE__ */ jsxs("span", {
											className: "text-xs font-medium text-slate-300 uppercase tracking-wider flex items-center gap-1.5",
											children: [/* @__PURE__ */ jsx(TrendingUp, { className: "w-3.5 h-3.5 text-emerald-400" }), " Today's Execution Rate"]
										}), /* @__PURE__ */ jsxs("span", {
											className: "text-xs font-semibold bg-emerald-500/20 text-emerald-300 px-2.5 py-0.5 rounded-full border border-emerald-500/30",
											children: [
												metrics.today_completed || 0,
												" of ",
												metrics.today_total || 0,
												" Done"
											]
										})]
									}), /* @__PURE__ */ jsxs("div", {
										className: "flex items-baseline gap-2",
										children: [/* @__PURE__ */ jsxs("span", {
											className: "text-3xl font-extrabold tracking-tight",
											children: [metrics.completion_rate || 0, "%"]
										}), /* @__PURE__ */ jsx("span", {
											className: "text-xs text-slate-400 font-normal",
											children: metrics.today_pending > 0 ? `${metrics.today_pending} action${metrics.today_pending > 1 ? "s" : ""} remaining today` : metrics.today_total > 0 ? "All scheduled items completed! Great work!" : "No items scheduled for today yet"
										})]
									})]
								}),
								/* @__PURE__ */ jsx("div", {
									className: "relative z-10 mt-4",
									children: /* @__PURE__ */ jsx("div", {
										className: "w-full h-2.5 bg-slate-800 rounded-full overflow-hidden p-0.5 border border-slate-700",
										children: /* @__PURE__ */ jsx("div", {
											className: "h-full bg-emerald-500 rounded-full transition-all duration-500",
											style: { width: `${Math.min(100, Math.max(metrics.completion_rate || 0, metrics.today_total === 0 ? 0 : 5))}%` }
										})
									})
								}),
								/* @__PURE__ */ jsx("div", { className: "absolute -right-6 -bottom-8 w-32 h-32 rounded-full bg-teal-600/10 pointer-events-none" })
							]
						}),
						/* @__PURE__ */ jsxs("div", {
							className: "bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs flex items-center justify-between",
							children: [/* @__PURE__ */ jsxs("div", { children: [
								/* @__PURE__ */ jsx("span", {
									className: "text-[11px] font-semibold text-slate-500 uppercase tracking-wider block",
									children: "Clinic Visits Planned"
								}),
								/* @__PURE__ */ jsx("span", {
									className: "text-2xl font-bold text-slate-900 mt-1 block",
									children: metrics.today_visits || 0
								}),
								/* @__PURE__ */ jsxs("span", {
									className: "text-[11px] text-teal-700 font-medium flex items-center gap-1 mt-0.5",
									children: [/* @__PURE__ */ jsx(MapPin, { className: "w-3 h-3" }), " In-Person Detailing"]
								})
							] }), /* @__PURE__ */ jsx("div", {
								className: "w-11 h-11 rounded-xl bg-teal-50 text-teal-700 flex items-center justify-center shrink-0",
								children: /* @__PURE__ */ jsx(Stethoscope, { className: "w-5 h-5 stroke-[2]" })
							})]
						}),
						/* @__PURE__ */ jsxs("div", {
							className: "bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs flex items-center justify-between",
							children: [/* @__PURE__ */ jsxs("div", { children: [
								/* @__PURE__ */ jsx("span", {
									className: "text-[11px] font-semibold text-slate-500 uppercase tracking-wider block",
									children: "Phone Calls Planned"
								}),
								/* @__PURE__ */ jsx("span", {
									className: "text-2xl font-bold text-slate-900 mt-1 block",
									children: metrics.today_calls || 0
								}),
								/* @__PURE__ */ jsxs("span", {
									className: "text-[11px] text-sky-700 font-medium flex items-center gap-1 mt-0.5",
									children: [/* @__PURE__ */ jsx(PhoneCall, { className: "w-3 h-3" }), " Telephonic Follow-ups"]
								})
							] }), /* @__PURE__ */ jsx("div", {
								className: "w-11 h-11 rounded-xl bg-sky-50 text-sky-700 flex items-center justify-center shrink-0",
								children: /* @__PURE__ */ jsx(Phone, { className: "w-5 h-5 stroke-[2]" })
							})]
						})
					]
				}),
				/* @__PURE__ */ jsxs("div", {
					className: "bg-white rounded-2xl border border-slate-200/80 p-4 shadow-xs space-y-3",
					children: [/* @__PURE__ */ jsxs("div", {
						className: "flex flex-col md:flex-row md:items-center justify-between gap-3",
						children: [/* @__PURE__ */ jsxs("div", {
							className: "flex items-center gap-1 bg-slate-100 p-1 rounded-xl w-full md:w-auto overflow-x-auto",
							children: [
								/* @__PURE__ */ jsxs("button", {
									type: "button",
									onClick: () => handleTabChange("today"),
									className: `flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer whitespace-nowrap ${activeTab === "today" ? "bg-white text-slate-900 shadow-xs" : "text-slate-600 hover:text-slate-900"}`,
									children: [/* @__PURE__ */ jsx("span", { children: "Today's Agenda" }), /* @__PURE__ */ jsx("span", {
										className: `text-[10px] px-1.5 py-0.2 rounded-full font-bold ${activeTab === "today" ? "bg-teal-100 text-teal-800" : "bg-slate-200 text-slate-600"}`,
										children: metrics.today_total || 0
									})]
								}),
								/* @__PURE__ */ jsxs("button", {
									type: "button",
									onClick: () => handleTabChange("upcoming"),
									className: `flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer whitespace-nowrap ${activeTab === "upcoming" ? "bg-white text-slate-900 shadow-xs" : "text-slate-600 hover:text-slate-900"}`,
									children: [/* @__PURE__ */ jsx("span", { children: "Upcoming" }), /* @__PURE__ */ jsx("span", {
										className: `text-[10px] px-1.5 py-0.2 rounded-full font-bold ${activeTab === "upcoming" ? "bg-teal-100 text-teal-800" : "bg-slate-200 text-slate-600"}`,
										children: metrics.upcoming_count || 0
									})]
								}),
								/* @__PURE__ */ jsx("button", {
									type: "button",
									onClick: () => handleTabChange("history"),
									className: `flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer whitespace-nowrap ${activeTab === "history" ? "bg-white text-slate-900 shadow-xs" : "text-slate-600 hover:text-slate-900"}`,
									children: /* @__PURE__ */ jsx("span", { children: "Past History" })
								}),
								/* @__PURE__ */ jsx("button", {
									type: "button",
									onClick: () => handleTabChange("all"),
									className: `flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer whitespace-nowrap ${activeTab === "all" ? "bg-white text-slate-900 shadow-xs" : "text-slate-600 hover:text-slate-900"}`,
									children: /* @__PURE__ */ jsx("span", { children: "All" })
								})
							]
						}), /* @__PURE__ */ jsxs("div", {
							className: "relative w-full md:w-72",
							children: [
								/* @__PURE__ */ jsx(Search, { className: "w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" }),
								/* @__PURE__ */ jsx("input", {
									type: "text",
									placeholder: "Search doctor, clinic, purpose...",
									value: searchQuery,
									onChange: (e) => setSearchQuery(e.target.value),
									className: "w-full pl-9 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-teal-600/20 focus:border-teal-700 transition-all"
								}),
								searchQuery && /* @__PURE__ */ jsx("button", {
									type: "button",
									onClick: () => setSearchQuery(""),
									className: "absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-0.5",
									children: /* @__PURE__ */ jsx(X, { className: "w-3.5 h-3.5" })
								})
							]
						})]
					}), /* @__PURE__ */ jsxs("div", {
						className: "flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-slate-100 text-xs",
						children: [/* @__PURE__ */ jsxs("div", {
							className: "flex items-center gap-2 overflow-x-auto",
							children: [
								/* @__PURE__ */ jsx("span", {
									className: "text-[11px] font-semibold text-slate-400 uppercase tracking-wider shrink-0",
									children: "Type:"
								}),
								/* @__PURE__ */ jsx("button", {
									type: "button",
									onClick: () => setActionFilter("all"),
									className: `px-2.5 py-1 rounded-lg text-xs font-medium cursor-pointer transition-colors ${actionFilter === "all" ? "bg-slate-900 text-white font-semibold" : "bg-slate-100 text-slate-600 hover:bg-slate-200"}`,
									children: "All Actions"
								}),
								/* @__PURE__ */ jsxs("button", {
									type: "button",
									onClick: () => setActionFilter("visit"),
									className: `inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-medium cursor-pointer transition-colors ${actionFilter === "visit" ? "bg-teal-700 text-white font-semibold" : "bg-teal-50 text-teal-800 hover:bg-teal-100"}`,
									children: [/* @__PURE__ */ jsx(MapPin, { className: "w-3 h-3" }), " Visits Only"]
								}),
								/* @__PURE__ */ jsxs("button", {
									type: "button",
									onClick: () => setActionFilter("call"),
									className: `inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-medium cursor-pointer transition-colors ${actionFilter === "call" ? "bg-sky-700 text-white font-semibold" : "bg-sky-50 text-sky-800 hover:bg-sky-100"}`,
									children: [/* @__PURE__ */ jsx(Phone, { className: "w-3 h-3" }), " Calls Only"]
								})
							]
						}), /* @__PURE__ */ jsxs("div", {
							className: "flex items-center gap-2",
							children: [/* @__PURE__ */ jsx("span", {
								className: "text-[11px] font-semibold text-slate-400 uppercase tracking-wider",
								children: "Status:"
							}), /* @__PURE__ */ jsxs("select", {
								value: statusFilter,
								onChange: (e) => setStatusFilter(e.target.value),
								className: "bg-slate-50 border border-slate-200 text-slate-700 text-xs rounded-lg px-2.5 py-1 focus:outline-hidden focus:border-teal-700 cursor-pointer",
								children: [
									/* @__PURE__ */ jsx("option", {
										value: "all",
										children: "All Status"
									}),
									/* @__PURE__ */ jsx("option", {
										value: "pending",
										children: "Pending"
									}),
									/* @__PURE__ */ jsx("option", {
										value: "completed",
										children: "Completed"
									}),
									/* @__PURE__ */ jsx("option", {
										value: "missed",
										children: "Missed"
									})
								]
							})]
						})]
					})]
				}),
				/* @__PURE__ */ jsx("div", {
					className: "space-y-3",
					children: filteredSchedules.length === 0 ? /* @__PURE__ */ jsxs("div", {
						className: "bg-white rounded-2xl border border-slate-200/80 p-12 text-center shadow-xs",
						children: [
							/* @__PURE__ */ jsx("div", {
								className: "w-12 h-12 rounded-2xl bg-teal-50 text-teal-700 flex items-center justify-center mx-auto mb-3",
								children: /* @__PURE__ */ jsx(CalendarClock, { className: "w-6 h-6 stroke-[1.8]" })
							}),
							/* @__PURE__ */ jsx("h3", {
								className: "text-base font-bold text-slate-900 mb-1",
								children: "No Scheduled Items Found"
							}),
							/* @__PURE__ */ jsx("p", {
								className: "text-xs text-slate-500 max-w-sm mx-auto mb-4",
								children: searchQuery || actionFilter !== "all" || statusFilter !== "all" ? "No items match your active filters. Try clearing filters or searching for something else." : `You have no calls or visits planned in the '${activeTab}' view.`
							}),
							/* @__PURE__ */ jsxs("button", {
								type: "button",
								onClick: () => setIsCreateModalOpen(true),
								className: "inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-teal-700 text-white text-xs font-semibold hover:bg-teal-800 shadow-xs cursor-pointer",
								children: [/* @__PURE__ */ jsx(Plus, { className: "w-3.5 h-3.5 stroke-[2.2]" }), /* @__PURE__ */ jsx("span", { children: "Add Today's Call or Visit" })]
							})
						]
					}) : filteredSchedules.map((item) => {
						const isCall = item.action_type === "call";
						const isCompleted = item.status === "completed";
						const isPending = item.status === "pending";
						const isMissed = item.status === "missed";
						const doctor = item.doctor;
						const displayName = doctor ? doctor.name : item.custom_contact_name;
						const subtitle = doctor ? `${doctor.specialization} • ${doctor.clinic_hospital_name}` : `Custom Contact • ${(item.contact_type || "contact").toUpperCase()}`;
						const phone = doctor ? doctor.phone : null;
						return /* @__PURE__ */ jsx("div", {
							className: `bg-white rounded-2xl border transition-all p-4.5 sm:p-5 shadow-xs hover:shadow-sm ${isCompleted ? "border-emerald-200/90 bg-emerald-50/15" : isMissed ? "border-rose-200/90 bg-rose-50/15" : "border-slate-200/80 hover:border-slate-300"}`,
							children: /* @__PURE__ */ jsxs("div", {
								className: "flex flex-col lg:flex-row lg:items-center justify-between gap-4",
								children: [/* @__PURE__ */ jsxs("div", {
									className: "flex items-start gap-3.5 min-w-0 flex-1",
									children: [/* @__PURE__ */ jsx("div", {
										className: `w-11 h-11 rounded-2xl flex items-center justify-center shrink-0 shadow-xs ${isCompleted ? "bg-emerald-100 text-emerald-700" : isCall ? "bg-sky-100/80 text-sky-700" : "bg-teal-100/80 text-teal-800"}`,
										children: isCompleted ? /* @__PURE__ */ jsx(CheckCheck, { className: "w-5 h-5 stroke-[2.2]" }) : isCall ? /* @__PURE__ */ jsx(PhoneCall, { className: "w-5 h-5 stroke-[2.2]" }) : /* @__PURE__ */ jsx(MapPin, { className: "w-5 h-5 stroke-[2.2]" })
									}), /* @__PURE__ */ jsxs("div", {
										className: "min-w-0 flex-1",
										children: [
											/* @__PURE__ */ jsxs("div", {
												className: "flex flex-wrap items-center gap-2 mb-1",
												children: [
													/* @__PURE__ */ jsx("span", {
														className: `text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full ${isCall ? "bg-sky-50 text-sky-800 border border-sky-200/70" : "bg-teal-50 text-teal-800 border border-teal-200/70"}`,
														children: isCall ? "Phone Call" : "Clinic Visit"
													}),
													item.priority === "high" && /* @__PURE__ */ jsx("span", {
														className: "text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-rose-50 text-rose-700 border border-rose-200/60",
														children: "High Priority"
													}),
													/* @__PURE__ */ jsxs("span", {
														className: "inline-flex items-center gap-1 text-[11px] text-slate-500 font-medium bg-slate-100 px-2 py-0.5 rounded-md",
														children: [
															/* @__PURE__ */ jsx(Clock, { className: "w-3 h-3 text-slate-400" }),
															/* @__PURE__ */ jsx("span", { children: item.scheduled_time || "Anytime" }),
															activeTab !== "today" && /* @__PURE__ */ jsxs("span", {
																className: "text-slate-400 font-normal",
																children: ["• ", new Date(item.scheduled_date).toLocaleDateString("en-US", {
																	month: "short",
																	day: "numeric"
																})]
															})
														]
													}),
													isCompleted && /* @__PURE__ */ jsxs("span", {
														className: "inline-flex items-center gap-1 text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-300",
														children: [/* @__PURE__ */ jsx(Check, { className: "w-3 h-3 stroke-[2.5]" }), " Visited / Called"]
													}),
													isMissed && /* @__PURE__ */ jsx("span", {
														className: "text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-rose-100 text-rose-800",
														children: "Missed"
													})
												]
											}),
											/* @__PURE__ */ jsxs("div", {
												className: "flex items-center gap-2",
												children: [/* @__PURE__ */ jsx("h4", {
													className: "text-sm font-bold text-slate-900 truncate",
													children: displayName
												}), doctor?.tier && /* @__PURE__ */ jsx("span", {
													className: "text-[9px] uppercase font-extrabold px-1.5 py-0.2 bg-teal-50 text-teal-700 border border-teal-200 rounded",
													children: doctor.tier
												})]
											}),
											/* @__PURE__ */ jsx("p", {
												className: "text-xs text-slate-500 truncate mt-0.5",
												children: subtitle
											}),
											/* @__PURE__ */ jsxs("div", {
												className: "mt-2 bg-slate-50/80 rounded-xl p-2.5 border border-slate-100/90 text-xs",
												children: [/* @__PURE__ */ jsxs("div", {
													className: "flex items-start gap-1.5",
													children: [/* @__PURE__ */ jsx(FileText, { className: "w-3.5 h-3.5 text-teal-700 shrink-0 mt-0.5" }), /* @__PURE__ */ jsxs("div", {
														className: "min-w-0 flex-1",
														children: [/* @__PURE__ */ jsx("span", {
															className: "font-medium text-slate-800",
															children: "Purpose: "
														}), /* @__PURE__ */ jsx("span", {
															className: "text-slate-600",
															children: item.purpose
														})]
													})]
												}), item.notes && /* @__PURE__ */ jsxs("p", {
													className: "text-[11px] text-slate-500 mt-1 pl-5 italic",
													children: ["Note: ", item.notes]
												})]
											}),
											isCompleted && item.outcome_note && /* @__PURE__ */ jsxs("div", {
												className: "mt-2 bg-emerald-50/70 border border-emerald-200/60 rounded-xl p-2.5 text-xs text-emerald-950 flex items-start gap-2",
												children: [/* @__PURE__ */ jsx(MessageSquare, { className: "w-3.5 h-3.5 text-emerald-700 shrink-0 mt-0.5" }), /* @__PURE__ */ jsxs("div", { children: [
													/* @__PURE__ */ jsx("span", {
														className: "font-bold text-emerald-900",
														children: "Outcome: "
													}),
													/* @__PURE__ */ jsx("span", { children: item.outcome_note }),
													item.completed_at && /* @__PURE__ */ jsxs("span", {
														className: "text-[10px] text-emerald-700 block mt-0.5",
														children: ["Logged at ", new Date(item.completed_at).toLocaleTimeString([], {
															hour: "2-digit",
															minute: "2-digit"
														})]
													})
												] })]
											})
										]
									})]
								}), /* @__PURE__ */ jsxs("div", {
									className: "flex flex-wrap lg:flex-col items-end gap-2 shrink-0 pt-3 lg:pt-0 border-t lg:border-t-0 border-slate-100",
									children: [
										isPending && /* @__PURE__ */ jsxs("div", {
											className: "flex items-center gap-2 w-full sm:w-auto justify-end",
											children: [
												phone && /* @__PURE__ */ jsxs("a", {
													href: `tel:${phone}`,
													className: "inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-sky-200 bg-sky-50 text-sky-800 hover:bg-sky-100 text-xs font-semibold transition-colors cursor-pointer",
													title: `Dial ${phone}`,
													children: [/* @__PURE__ */ jsx(Phone, { className: "w-3.5 h-3.5" }), /* @__PURE__ */ jsxs("span", { children: ["Call ", phone] })]
												}),
												/* @__PURE__ */ jsxs("button", {
													type: "button",
													onClick: () => openOutcomeModal(item),
													className: `inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-bold text-white shadow-xs hover:shadow-sm transition-all cursor-pointer ${isCall ? "bg-sky-700 hover:bg-sky-800" : "bg-teal-700 hover:bg-teal-800"}`,
													children: [/* @__PURE__ */ jsx(Check, { className: "w-4 h-4 stroke-[2.5]" }), /* @__PURE__ */ jsx("span", { children: isCall ? "Mark as Called" : "Mark as Visited" })]
												}),
												/* @__PURE__ */ jsx("button", {
													type: "button",
													onClick: () => {
														setRescheduleItem(item);
														setRescheduleDate(item.scheduled_date);
														setRescheduleTime(item.scheduled_time || "");
													},
													className: "p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer",
													title: "Reschedule",
													children: /* @__PURE__ */ jsx(RotateCcw, { className: "w-4 h-4" })
												}),
												/* @__PURE__ */ jsx("button", {
													type: "button",
													onClick: () => handleDelete(item.id),
													className: "p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer",
													title: "Delete",
													children: /* @__PURE__ */ jsx(Trash2, { className: "w-4 h-4" })
												})
											]
										}),
										!isCall && isPending && doctor && /* @__PURE__ */ jsxs(Link, {
											href: `/mr/visits?doctor_id=${doctor.id}`,
											className: "text-[11px] font-semibold text-teal-700 hover:text-teal-900 inline-flex items-center gap-1 cursor-pointer mt-1",
											children: [/* @__PURE__ */ jsx("span", { children: "Log Full Clinic Detailing Form" }), /* @__PURE__ */ jsx(ChevronRight, { className: "w-3 h-3" })]
										}),
										isCompleted && /* @__PURE__ */ jsxs("div", {
											className: "flex items-center gap-2",
											children: [
												/* @__PURE__ */ jsx("button", {
													type: "button",
													onClick: () => openOutcomeModal(item),
													className: "text-[11px] font-medium text-emerald-800 hover:text-emerald-950 underline cursor-pointer",
													children: "Edit Outcome Note"
												}),
												/* @__PURE__ */ jsx("span", {
													className: "text-slate-300",
													children: "•"
												}),
												/* @__PURE__ */ jsx("button", {
													type: "button",
													onClick: () => handleStatusUpdate(item.id, "pending"),
													className: "text-[11px] font-medium text-slate-500 hover:text-slate-800 cursor-pointer",
													title: "Revert to Pending",
													children: "Reopen"
												}),
												/* @__PURE__ */ jsx("button", {
													type: "button",
													onClick: () => handleDelete(item.id),
													className: "p-1 rounded text-slate-400 hover:text-rose-600 hover:bg-rose-50 ml-1 cursor-pointer",
													title: "Delete",
													children: /* @__PURE__ */ jsx(Trash2, { className: "w-3.5 h-3.5" })
												})
											]
										})
									]
								})]
							})
						}, item.id);
					})
				}),
				isCreateModalOpen && /* @__PURE__ */ jsx("div", {
					className: "fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs overflow-y-auto",
					children: /* @__PURE__ */ jsxs("div", {
						className: "bg-white rounded-3xl max-w-lg w-full p-6 shadow-xl border border-slate-100 my-8",
						children: [/* @__PURE__ */ jsxs("div", {
							className: "flex items-center justify-between pb-4 border-b border-slate-100",
							children: [/* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("h3", {
								className: "text-lg font-bold text-slate-900",
								children: "Schedule a Call or Clinic Visit"
							}), /* @__PURE__ */ jsx("p", {
								className: "text-xs text-slate-500 mt-0.5",
								children: "Add to your daily agenda for prompt execution and tracking."
							})] }), /* @__PURE__ */ jsx("button", {
								type: "button",
								onClick: () => setIsCreateModalOpen(false),
								className: "p-1.5 rounded-xl text-slate-400 hover:text-slate-600 hover:bg-slate-100 cursor-pointer",
								children: /* @__PURE__ */ jsx(X, { className: "w-5 h-5" })
							})]
						}), /* @__PURE__ */ jsxs("form", {
							onSubmit: handleCreateSubmit,
							className: "space-y-4 pt-4 text-xs",
							children: [
								/* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsxs("label", {
									className: "block font-semibold text-slate-700 mb-1.5",
									children: ["Select Activity Type ", /* @__PURE__ */ jsx("span", {
										className: "text-rose-500",
										children: "*"
									})]
								}), /* @__PURE__ */ jsxs("div", {
									className: "grid grid-cols-2 gap-3",
									children: [/* @__PURE__ */ jsxs("button", {
										type: "button",
										onClick: () => setFormData((prev) => ({
											...prev,
											action_type: "call"
										})),
										className: `flex items-center justify-center gap-2 p-3 rounded-2xl border text-xs font-bold transition-all cursor-pointer ${formData.action_type === "call" ? "bg-sky-50 border-sky-600 text-sky-800 shadow-xs ring-2 ring-sky-600/20" : "border-slate-200 text-slate-600 hover:bg-slate-50"}`,
										children: [/* @__PURE__ */ jsx(PhoneCall, { className: "w-4 h-4 text-sky-600" }), /* @__PURE__ */ jsx("span", { children: "Phone Call" })]
									}), /* @__PURE__ */ jsxs("button", {
										type: "button",
										onClick: () => setFormData((prev) => ({
											...prev,
											action_type: "visit"
										})),
										className: `flex items-center justify-center gap-2 p-3 rounded-2xl border text-xs font-bold transition-all cursor-pointer ${formData.action_type === "visit" ? "bg-teal-50 border-teal-700 text-teal-800 shadow-xs ring-2 ring-teal-700/20" : "border-slate-200 text-slate-600 hover:bg-slate-50"}`,
										children: [/* @__PURE__ */ jsx(MapPin, { className: "w-4 h-4 text-teal-700" }), /* @__PURE__ */ jsx("span", { children: "Clinic Visit" })]
									})]
								})] }),
								/* @__PURE__ */ jsxs("div", {
									className: "bg-slate-50 p-3.5 rounded-2xl border border-slate-200/70 space-y-3",
									children: [/* @__PURE__ */ jsxs("div", {
										className: "flex items-center justify-between",
										children: [/* @__PURE__ */ jsx("span", {
											className: "font-bold text-slate-800",
											children: "Whom to Visit or Call?"
										}), /* @__PURE__ */ jsxs("div", {
											className: "flex items-center gap-2 text-[11px]",
											children: [/* @__PURE__ */ jsxs("label", {
												className: "flex items-center gap-1 cursor-pointer",
												children: [/* @__PURE__ */ jsx("input", {
													type: "radio",
													name: "contact_mode",
													checked: formData.contact_mode === "doctor",
													onChange: () => setFormData((prev) => ({
														...prev,
														contact_mode: "doctor"
													})),
													className: "text-teal-700 focus:ring-teal-700"
												}), /* @__PURE__ */ jsx("span", {
													className: "font-medium text-slate-700",
													children: "Doctor"
												})]
											}), /* @__PURE__ */ jsxs("label", {
												className: "flex items-center gap-1 cursor-pointer",
												children: [/* @__PURE__ */ jsx("input", {
													type: "radio",
													name: "contact_mode",
													checked: formData.contact_mode === "custom",
													onChange: () => setFormData((prev) => ({
														...prev,
														contact_mode: "custom"
													})),
													className: "text-teal-700 focus:ring-teal-700"
												}), /* @__PURE__ */ jsx("span", {
													className: "font-medium text-slate-700",
													children: "Chemist / Other"
												})]
											})]
										})]
									}), formData.contact_mode === "doctor" ? /* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsxs("select", {
										value: formData.doctor_id,
										onChange: (e) => setFormData((prev) => ({
											...prev,
											doctor_id: e.target.value
										})),
										className: "w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs focus:ring-2 focus:ring-teal-600/20 focus:border-teal-700 cursor-pointer",
										required: true,
										children: [/* @__PURE__ */ jsxs("option", {
											value: "",
											children: [
												"-- Select Doctor from Your List (",
												doctors.length,
												" available) --"
											]
										}), doctors.map((d) => /* @__PURE__ */ jsxs("option", {
											value: d.id,
											children: [
												d.name,
												" (",
												d.specialization,
												") - ",
												d.clinic_hospital_name
											]
										}, d.id))]
									}), selectedDoctorObj && /* @__PURE__ */ jsxs("div", {
										className: "mt-2 bg-white p-2.5 rounded-xl border border-slate-200 text-[11px] text-slate-600 space-y-0.5",
										children: [
											/* @__PURE__ */ jsxs("p", { children: [
												/* @__PURE__ */ jsx("span", {
													className: "font-semibold text-slate-800",
													children: "Clinic:"
												}),
												" ",
												selectedDoctorObj.clinic_hospital_name
											] }),
											selectedDoctorObj.phone && /* @__PURE__ */ jsxs("p", { children: [
												/* @__PURE__ */ jsx("span", {
													className: "font-semibold text-slate-800",
													children: "Phone:"
												}),
												" ",
												selectedDoctorObj.phone
											] }),
											selectedDoctorObj.visiting_hours && /* @__PURE__ */ jsxs("p", { children: [
												/* @__PURE__ */ jsx("span", {
													className: "font-semibold text-slate-800",
													children: "Visiting Hours:"
												}),
												" ",
												selectedDoctorObj.visiting_hours
											] })
										]
									})] }) : /* @__PURE__ */ jsxs("div", {
										className: "grid grid-cols-1 sm:grid-cols-2 gap-2",
										children: [/* @__PURE__ */ jsx("div", { children: /* @__PURE__ */ jsx("input", {
											type: "text",
											placeholder: "e.g. Apollo Pharmacy / City Medico",
											value: formData.custom_contact_name,
											onChange: (e) => setFormData((prev) => ({
												...prev,
												custom_contact_name: e.target.value
											})),
											className: "w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs focus:ring-2 focus:ring-teal-600/20 focus:border-teal-700",
											required: true
										}) }), /* @__PURE__ */ jsx("div", { children: /* @__PURE__ */ jsxs("select", {
											value: formData.contact_type,
											onChange: (e) => setFormData((prev) => ({
												...prev,
												contact_type: e.target.value
											})),
											className: "w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs focus:ring-2 focus:ring-teal-600/20 focus:border-teal-700 cursor-pointer",
											children: [
												/* @__PURE__ */ jsx("option", {
													value: "chemist",
													children: "Chemist / Pharmacy"
												}),
												/* @__PURE__ */ jsx("option", {
													value: "hospital",
													children: "Hospital Desk / Purchase"
												}),
												/* @__PURE__ */ jsx("option", {
													value: "stockist",
													children: "Stockist / Distributor"
												})
											]
										}) })]
									})]
								}),
								/* @__PURE__ */ jsxs("div", {
									className: "grid grid-cols-1 sm:grid-cols-2 gap-3",
									children: [/* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("label", {
										className: "block font-semibold text-slate-700 mb-1",
										children: "Date"
									}), /* @__PURE__ */ jsx("input", {
										type: "date",
										value: formData.scheduled_date,
										onChange: (e) => setFormData((prev) => ({
											...prev,
											scheduled_date: e.target.value
										})),
										className: "w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs focus:ring-2 focus:ring-teal-600/20 focus:border-teal-700",
										required: true
									})] }), /* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("label", {
										className: "block font-semibold text-slate-700 mb-1",
										children: "Preferred Time Slot"
									}), /* @__PURE__ */ jsx("input", {
										type: "text",
										placeholder: "e.g. Morning OPD (10:30 AM)",
										value: formData.scheduled_time,
										onChange: (e) => setFormData((prev) => ({
											...prev,
											scheduled_time: e.target.value
										})),
										className: "w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs focus:ring-2 focus:ring-teal-600/20 focus:border-teal-700"
									})] })]
								}),
								/* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("label", {
									className: "block font-semibold text-slate-700 mb-1",
									children: "Priority Level"
								}), /* @__PURE__ */ jsx("div", {
									className: "flex items-center gap-2",
									children: [
										"high",
										"normal",
										"low"
									].map((p) => /* @__PURE__ */ jsx("button", {
										type: "button",
										onClick: () => setFormData((prev) => ({
											...prev,
											priority: p
										})),
										className: `flex-1 py-1.5 rounded-xl border font-bold capitalize text-xs transition-all cursor-pointer ${formData.priority === p ? p === "high" ? "bg-rose-50 border-rose-600 text-rose-700 ring-1 ring-rose-500" : "bg-slate-900 border-slate-900 text-white" : "border-slate-200 text-slate-600 hover:bg-slate-50"}`,
										children: p
									}, p))
								})] }),
								/* @__PURE__ */ jsxs("div", { children: [
									/* @__PURE__ */ jsxs("div", {
										className: "flex items-center justify-between mb-1",
										children: [/* @__PURE__ */ jsxs("label", {
											className: "font-semibold text-slate-700",
											children: ["Detailing Purpose / Agenda ", /* @__PURE__ */ jsx("span", {
												className: "text-rose-500",
												children: "*"
											})]
										}), /* @__PURE__ */ jsx("span", {
											className: "text-[11px] text-slate-400",
											children: "Click product to tag:"
										})]
									}),
									products.length > 0 && /* @__PURE__ */ jsx("div", {
										className: "flex flex-wrap gap-1 mb-2 max-h-16 overflow-y-auto p-1 bg-slate-50 rounded-xl border border-slate-100",
										children: products.slice(0, 8).map((prod) => /* @__PURE__ */ jsxs("button", {
											type: "button",
											onClick: () => addProductToPurpose(prod.brand_name),
											className: "text-[10px] font-semibold bg-white hover:bg-teal-50 text-slate-700 hover:text-teal-800 border border-slate-200 px-2 py-0.5 rounded-md cursor-pointer transition-colors shadow-2xs",
											children: ["+ ", prod.brand_name]
										}, prod.id))
									}),
									/* @__PURE__ */ jsx("textarea", {
										rows: "2",
										placeholder: "e.g. Detailing Ciplox 500 & Rosucipl; follow up on prescription feedback...",
										value: formData.purpose,
										onChange: (e) => setFormData((prev) => ({
											...prev,
											purpose: e.target.value
										})),
										className: "w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs focus:ring-2 focus:ring-teal-600/20 focus:border-teal-700",
										required: true
									})
								] }),
								/* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("label", {
									className: "block font-semibold text-slate-700 mb-1",
									children: "Internal Notes (Optional)"
								}), /* @__PURE__ */ jsx("input", {
									type: "text",
									placeholder: "e.g. Doctor prefers evening OPD after 6 PM",
									value: formData.notes,
									onChange: (e) => setFormData((prev) => ({
										...prev,
										notes: e.target.value
									})),
									className: "w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs focus:ring-2 focus:ring-teal-600/20 focus:border-teal-700"
								})] }),
								/* @__PURE__ */ jsxs("div", {
									className: "flex items-center justify-end gap-2 pt-3 border-t border-slate-100",
									children: [/* @__PURE__ */ jsx("button", {
										type: "button",
										onClick: () => setIsCreateModalOpen(false),
										className: "px-4 py-2 rounded-xl text-slate-600 hover:bg-slate-100 font-semibold cursor-pointer",
										children: "Cancel"
									}), /* @__PURE__ */ jsx("button", {
										type: "submit",
										disabled: isSubmitting,
										className: "px-5 py-2 rounded-xl bg-teal-700 hover:bg-teal-800 text-white font-bold shadow-xs transition-all cursor-pointer disabled:opacity-50",
										children: isSubmitting ? "Scheduling..." : "Save to Schedule"
									})]
								})
							]
						})]
					})
				}),
				outcomeModalSchedule && /* @__PURE__ */ jsx("div", {
					className: "fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs",
					children: /* @__PURE__ */ jsxs("div", {
						className: "bg-white rounded-3xl max-w-md w-full p-6 shadow-xl border border-slate-100",
						children: [/* @__PURE__ */ jsxs("div", {
							className: "flex items-center justify-between pb-3 border-b border-slate-100",
							children: [/* @__PURE__ */ jsxs("div", {
								className: "flex items-center gap-2.5",
								children: [/* @__PURE__ */ jsx("div", {
									className: `w-9 h-9 rounded-xl flex items-center justify-center ${outcomeModalSchedule.action_type === "call" ? "bg-sky-100 text-sky-700" : "bg-teal-100 text-teal-800"}`,
									children: outcomeModalSchedule.action_type === "call" ? /* @__PURE__ */ jsx(PhoneCall, { className: "w-4 h-4" }) : /* @__PURE__ */ jsx(CheckCircle2, { className: "w-4 h-4" })
								}), /* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsxs("h3", {
									className: "text-base font-bold text-slate-900",
									children: ["Mark as ", outcomeModalSchedule.action_type === "call" ? "Called" : "Visited"]
								}), /* @__PURE__ */ jsx("p", {
									className: "text-[11px] text-slate-500",
									children: outcomeModalSchedule.doctor?.name || outcomeModalSchedule.custom_contact_name
								})] })]
							}), /* @__PURE__ */ jsx("button", {
								type: "button",
								onClick: () => setOutcomeModalSchedule(null),
								className: "p-1.5 rounded-xl text-slate-400 hover:text-slate-600 hover:bg-slate-100 cursor-pointer",
								children: /* @__PURE__ */ jsx(X, { className: "w-4 h-4" })
							})]
						}), /* @__PURE__ */ jsxs("div", {
							className: "space-y-4 pt-3 text-xs",
							children: [
								/* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("label", {
									className: "block font-semibold text-slate-700 mb-1.5",
									children: "Quick Outcome Presets (Tap to select)"
								}), /* @__PURE__ */ jsx("div", {
									className: "space-y-1.5",
									children: (outcomeModalSchedule.action_type === "call" ? CALL_OUTCOMES$1 : VISIT_OUTCOMES$1).map((outcome, idx) => /* @__PURE__ */ jsx("button", {
										type: "button",
										onClick: () => setOutcomeNote(outcome),
										className: `w-full text-left p-2 rounded-xl text-xs transition-colors border cursor-pointer ${outcomeNote === outcome ? "bg-emerald-50 border-emerald-400 text-emerald-900 font-semibold" : "bg-slate-50 border-slate-200/80 text-slate-700 hover:bg-slate-100"}`,
										children: outcome
									}, idx))
								})] }),
								/* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("label", {
									className: "block font-semibold text-slate-700 mb-1",
									children: "Outcome Feedback / Discussion Notes"
								}), /* @__PURE__ */ jsx("textarea", {
									rows: "3",
									placeholder: "Add notes on doctor's feedback, prescription commitments, or follow-up needs...",
									value: outcomeNote,
									onChange: (e) => setOutcomeNote(e.target.value),
									className: "w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs focus:ring-2 focus:ring-teal-600/20 focus:border-teal-700"
								})] }),
								/* @__PURE__ */ jsxs("div", {
									className: "flex items-center justify-end gap-2 pt-2 border-t border-slate-100",
									children: [/* @__PURE__ */ jsx("button", {
										type: "button",
										onClick: () => setOutcomeModalSchedule(null),
										className: "px-3.5 py-1.5 rounded-xl text-slate-600 hover:bg-slate-100 font-medium cursor-pointer",
										children: "Cancel"
									}), /* @__PURE__ */ jsxs("button", {
										type: "button",
										disabled: isSubmitting,
										onClick: () => handleStatusUpdate(outcomeModalSchedule.id, "completed", outcomeNote),
										className: "inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-bold shadow-xs cursor-pointer disabled:opacity-50",
										children: [/* @__PURE__ */ jsx(Check, { className: "w-4 h-4 stroke-[2.5]" }), /* @__PURE__ */ jsx("span", { children: "Confirm Completion" })]
									})]
								})
							]
						})]
					})
				}),
				rescheduleItem && /* @__PURE__ */ jsx("div", {
					className: "fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs",
					children: /* @__PURE__ */ jsxs("div", {
						className: "bg-white rounded-3xl max-w-sm w-full p-6 shadow-xl border border-slate-100",
						children: [/* @__PURE__ */ jsxs("div", {
							className: "flex items-center justify-between pb-3 border-b border-slate-100",
							children: [/* @__PURE__ */ jsx("h3", {
								className: "text-base font-bold text-slate-900",
								children: "Reschedule Activity"
							}), /* @__PURE__ */ jsx("button", {
								type: "button",
								onClick: () => setRescheduleItem(null),
								className: "p-1.5 rounded-xl text-slate-400 hover:text-slate-600 hover:bg-slate-100 cursor-pointer",
								children: /* @__PURE__ */ jsx(X, { className: "w-4 h-4" })
							})]
						}), /* @__PURE__ */ jsxs("form", {
							onSubmit: handleRescheduleSubmit,
							className: "space-y-3 pt-3 text-xs",
							children: [
								/* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("label", {
									className: "block font-semibold text-slate-700 mb-1",
									children: "New Date"
								}), /* @__PURE__ */ jsx("input", {
									type: "date",
									value: rescheduleDate,
									onChange: (e) => setRescheduleDate(e.target.value),
									className: "w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs focus:ring-2 focus:ring-teal-600/20 focus:border-teal-700",
									required: true
								})] }),
								/* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("label", {
									className: "block font-semibold text-slate-700 mb-1",
									children: "New Time Slot"
								}), /* @__PURE__ */ jsx("input", {
									type: "text",
									value: rescheduleTime,
									onChange: (e) => setRescheduleTime(e.target.value),
									placeholder: "e.g. Tomorrow Evening OPD (06:00 PM)",
									className: "w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs focus:ring-2 focus:ring-teal-600/20 focus:border-teal-700"
								})] }),
								/* @__PURE__ */ jsxs("div", {
									className: "flex items-center justify-end gap-2 pt-2 border-t border-slate-100",
									children: [/* @__PURE__ */ jsx("button", {
										type: "button",
										onClick: () => setRescheduleItem(null),
										className: "px-3 py-1.5 rounded-xl text-slate-600 hover:bg-slate-100 font-medium cursor-pointer",
										children: "Cancel"
									}), /* @__PURE__ */ jsx("button", {
										type: "submit",
										disabled: isSubmitting,
										className: "px-4 py-1.5 rounded-xl bg-teal-700 hover:bg-teal-800 text-white font-bold cursor-pointer disabled:opacity-50",
										children: "Save Reschedule"
									})]
								})
							]
						})]
					})
				})
			]
		})
	});
}
//#endregion
//#region resources/js/Pages/mr/Visits.jsx
var Visits_exports = /* @__PURE__ */ __exportAll({ default: () => Visits });
var CALL_OUTCOMES = [
	"Spoke with Doctor - Positive response",
	"Prescription promised for upcoming month",
	"Requested clinic visit with product samples",
	"Busy in OPD - Requested callback later",
	"Call unanswered / Left reminder message"
];
var VISIT_OUTCOMES = [
	"Visited clinic & completed product detailing",
	"Handed over samples & clinical visual aid shown",
	"Doctor committed to trial on 5+ patients",
	"Doctor in surgery / Not available at clinic",
	"Follow-up visit requested next week"
];
var FEEDBACK_OPTIONS = [
	{
		value: "highly_interested",
		label: "High Interest (Core Prescriber)",
		color: "text-emerald-700 bg-emerald-50"
	},
	{
		value: "regular_prescriber",
		label: "Regular Prescriber",
		color: "text-teal-700 bg-teal-50"
	},
	{
		value: "trial_prescriber",
		label: "Agreed for Clinical Trial",
		color: "text-indigo-700 bg-indigo-50"
	},
	{
		value: "neutral",
		label: "Neutral / Follow-up Needed",
		color: "text-amber-700 bg-amber-50"
	},
	{
		value: "negative",
		label: "Price / Molecule Objection",
		color: "text-rose-700 bg-rose-50"
	}
];
var CALL_TYPES = [
	{
		value: "routine_detailing",
		label: "Routine Detailing Call"
	},
	{
		value: "new_product_launch",
		label: "New Product Launch"
	},
	{
		value: "sample_delivery",
		label: "Sample & Input Handover"
	},
	{
		value: "cme_invite",
		label: "CME / Symposium Invitation"
	},
	{
		value: "follow_up",
		label: "Follow-up Call"
	}
];
function Visits({ schedules = [], metrics = {}, doctors = [], products = [], todayDate = "", filters = {}, initialFilters = {} }) {
	const [activeView, setActiveView] = useState(filters.view || "planner");
	const [plannerTab, setPlannerTab] = useState(filters.tab || "today");
	const [actionFilter, setActionFilter] = useState(filters.action_type || "all");
	const [statusFilter, setStatusFilter] = useState(filters.status || "all");
	const [plannerSearch, setPlannerSearch] = useState(filters.search || "");
	const [isScheduleModalOpen, setIsScheduleModalOpen] = useState(false);
	const [outcomeModalSchedule, setOutcomeModalSchedule] = useState(null);
	const [outcomeNote, setOutcomeNote] = useState("");
	const [rescheduleItem, setRescheduleItem] = useState(null);
	const [rescheduleDate, setRescheduleDate] = useState("");
	const [rescheduleTime, setRescheduleTime] = useState("");
	const [isPlannerSubmitting, setIsPlannerSubmitting] = useState(false);
	const [scheduleForm, setScheduleForm] = useState({
		action_type: "call",
		contact_mode: "doctor",
		doctor_id: "",
		custom_contact_name: "",
		contact_type: "doctor",
		scheduled_date: todayDate || (/* @__PURE__ */ new Date()).toISOString().split("T")[0],
		scheduled_time: "Morning OPD (10:30 AM)",
		priority: "normal",
		purpose: "",
		notes: ""
	});
	const [visits, setVisits] = useState([]);
	const [visitsMeta, setVisitsMeta] = useState(null);
	const [visitsLoading, setVisitsLoading] = useState(false);
	const [dcrStatusFilter, setDcrStatusFilter] = useState(initialFilters.status || "all");
	const [dcrDateFilter, setDcrDateFilter] = useState(initialFilters.date || "all");
	const [dcrDoctorFilter, setDcrDoctorFilter] = useState(initialFilters.doctor_id || "all");
	const [dcrSearch, setDcrSearch] = useState("");
	const [detailModalOpen, setDetailModalOpen] = useState(false);
	const [editingVisit, setEditingVisit] = useState(null);
	const [isDcrSubmitting, setIsDcrSubmitting] = useState(false);
	const [detailForm, setDetailForm] = useState({
		doctor_id: "",
		visit_date: todayDate || (/* @__PURE__ */ new Date()).toISOString().split("T")[0],
		visit_time: "11:00 AM",
		call_type: "routine_detailing",
		status: "completed",
		products_detailed: ["Ciplox 500"],
		doctor_feedback: "regular_prescriber",
		samples_given: "",
		remarks: "",
		next_visit_date: ""
	});
	const fetchDetailingVisits = async () => {
		setVisitsLoading(true);
		try {
			const res = await axios.get("/api/v1/mr/visits", { params: {
				status: dcrStatusFilter,
				date: dcrDateFilter,
				doctor_id: dcrDoctorFilter,
				search: dcrSearch
			} });
			if (res.data?.success) {
				setVisits(res.data.data || []);
				setVisitsMeta(res.data.meta || {});
			}
		} catch (err) {
			console.error(err);
		} finally {
			setVisitsLoading(false);
		}
	};
	useEffect(() => {
		if (activeView === "detailing") fetchDetailingVisits();
	}, [
		activeView,
		dcrStatusFilter,
		dcrDateFilter,
		dcrDoctorFilter,
		dcrSearch
	]);
	const filteredSchedules = useMemo(() => {
		return schedules.filter((item) => {
			if (actionFilter !== "all" && item.action_type !== actionFilter) return false;
			if (statusFilter !== "all" && item.status !== statusFilter) return false;
			if (plannerSearch.trim()) {
				const q = plannerSearch.toLowerCase();
				const docName = item.doctor?.name?.toLowerCase() || "";
				const docHospital = item.doctor?.clinic_hospital_name?.toLowerCase() || "";
				const customName = item.custom_contact_name?.toLowerCase() || "";
				const purpose = item.purpose?.toLowerCase() || "";
				const notes = item.notes?.toLowerCase() || "";
				if (!docName.includes(q) && !docHospital.includes(q) && !customName.includes(q) && !purpose.includes(q) && !notes.includes(q)) return false;
			}
			return true;
		});
	}, [
		schedules,
		actionFilter,
		statusFilter,
		plannerSearch
	]);
	const handlePlannerTabChange = (newTab) => {
		setPlannerTab(newTab);
		router.get("/mr/visits", {
			tab: newTab,
			action_type: actionFilter,
			status: statusFilter,
			search: plannerSearch,
			view: "planner"
		}, {
			preserveState: true,
			preserveScroll: true
		});
	};
	const openOutcomeModal = (schedule) => {
		setOutcomeModalSchedule(schedule);
		setOutcomeNote(schedule.outcome_note || "");
	};
	const handlePlannerStatusUpdate = (scheduleId, status, customOutcomeNote = null) => {
		setIsPlannerSubmitting(true);
		router.put(`/mr/schedule/${scheduleId}/status`, {
			status,
			outcome_note: customOutcomeNote !== null ? customOutcomeNote : outcomeNote
		}, {
			preserveScroll: true,
			onSuccess: () => {
				setIsPlannerSubmitting(false);
				setOutcomeModalSchedule(null);
				setOutcomeNote("");
				toast.success(status === "completed" ? "Marked as completed!" : `Status updated to ${status}`);
			},
			onError: () => {
				setIsPlannerSubmitting(false);
				toast.error("Failed to update status.");
			}
		});
	};
	const handleRescheduleSubmit = (e) => {
		e.preventDefault();
		if (!rescheduleItem || !rescheduleDate) return;
		setIsPlannerSubmitting(true);
		router.put(`/mr/schedule/${rescheduleItem.id}/status`, {
			status: "rescheduled",
			new_date: rescheduleDate,
			new_time: rescheduleTime
		}, {
			preserveScroll: true,
			onSuccess: () => {
				setIsPlannerSubmitting(false);
				setRescheduleItem(null);
				setRescheduleDate("");
				setRescheduleTime("");
				toast.success("Rescheduled successfully!");
			},
			onError: () => {
				setIsPlannerSubmitting(false);
				toast.error("Failed to reschedule.");
			}
		});
	};
	const handlePlannerDelete = (scheduleId) => {
		if (!confirm("Are you sure you want to remove this item from your schedule?")) return;
		router.delete(`/mr/schedule/${scheduleId}`, {
			preserveScroll: true,
			onSuccess: () => toast.success("Schedule item removed."),
			onError: () => toast.error("Failed to remove item.")
		});
	};
	const handleScheduleSubmit = (e) => {
		e.preventDefault();
		if (scheduleForm.contact_mode === "doctor" && !scheduleForm.doctor_id) {
			toast.error("Please select a doctor.");
			return;
		}
		if (scheduleForm.contact_mode === "custom" && !scheduleForm.custom_contact_name.trim()) {
			toast.error("Please enter the contact name.");
			return;
		}
		if (!scheduleForm.purpose.trim()) {
			toast.error("Please specify the discussion purpose.");
			return;
		}
		setIsPlannerSubmitting(true);
		router.post("/mr/schedule", {
			doctor_id: scheduleForm.contact_mode === "doctor" ? scheduleForm.doctor_id : null,
			custom_contact_name: scheduleForm.contact_mode === "custom" ? scheduleForm.custom_contact_name : null,
			contact_type: scheduleForm.contact_mode === "doctor" ? "doctor" : scheduleForm.contact_type,
			action_type: scheduleForm.action_type,
			scheduled_date: scheduleForm.scheduled_date,
			scheduled_time: scheduleForm.scheduled_time,
			priority: scheduleForm.priority,
			purpose: scheduleForm.purpose,
			notes: scheduleForm.notes
		}, {
			preserveScroll: true,
			onSuccess: () => {
				setIsPlannerSubmitting(false);
				setIsScheduleModalOpen(false);
				setScheduleForm({
					action_type: "call",
					contact_mode: "doctor",
					doctor_id: "",
					custom_contact_name: "",
					contact_type: "doctor",
					scheduled_date: todayDate || (/* @__PURE__ */ new Date()).toISOString().split("T")[0],
					scheduled_time: "Morning OPD (10:30 AM)",
					priority: "normal",
					purpose: "",
					notes: ""
				});
				toast.success("Added to your schedule!");
			},
			onError: (errs) => {
				setIsPlannerSubmitting(false);
				toast.error(Object.values(errs)[0] || "Failed to save schedule.");
			}
		});
	};
	const openDetailingModal = (docId = "", presetProducts = []) => {
		const defaultDocId = docId || (doctors[0]?.id ? String(doctors[0].id) : "");
		setEditingVisit(null);
		setDetailForm({
			doctor_id: defaultDocId,
			visit_date: todayDate || (/* @__PURE__ */ new Date()).toISOString().split("T")[0],
			visit_time: "11:00 AM",
			call_type: "routine_detailing",
			status: "completed",
			products_detailed: presetProducts.length > 0 ? presetProducts : products[0]?.brand_name ? [products[0].brand_name] : ["CiplonPara 650"],
			doctor_feedback: "regular_prescriber",
			samples_given: "",
			remarks: "",
			next_visit_date: ""
		});
		setDetailModalOpen(true);
	};
	const handleSubmitDetailing = async (e) => {
		e.preventDefault();
		if (!detailForm.doctor_id) {
			toast.error("Please select a doctor.");
			return;
		}
		setIsDcrSubmitting(true);
		try {
			if (editingVisit) {
				if ((await axios.put(`/api/v1/mr/visits/${editingVisit.id}`, detailForm)).data?.success) {
					toast.success("Detailing log updated!");
					setDetailModalOpen(false);
					fetchDetailingVisits();
				}
			} else if ((await axios.post("/api/v1/mr/visits", detailForm)).data?.success) {
				toast.success("Detailing & samples recorded successfully!");
				setDetailModalOpen(false);
				setActiveView("detailing");
				fetchDetailingVisits();
			}
		} catch (err) {
			toast.error(err.response?.data?.message || "Error saving detailing log.");
		} finally {
			setIsDcrSubmitting(false);
		}
	};
	const handleDeleteDetailing = async (visitId) => {
		if (!confirm("Are you sure you want to delete this detailing log?")) return;
		try {
			if ((await axios.delete(`/api/v1/mr/visits/${visitId}`)).data?.success) {
				toast.success("Detailing log removed.");
				fetchDetailingVisits();
			}
		} catch {
			toast.error("Failed to remove log.");
		}
	};
	const toggleDetailProduct = (brand) => {
		const list = detailForm.products_detailed || [];
		if (list.includes(brand)) setDetailForm((prev) => ({
			...prev,
			products_detailed: list.filter((p) => p !== brand)
		}));
		else setDetailForm((prev) => ({
			...prev,
			products_detailed: [...list, brand]
		}));
	};
	const addProductToPurpose = (brandName) => {
		setScheduleForm((prev) => ({
			...prev,
			purpose: prev.purpose ? `${prev.purpose}, ${brandName}` : `Detailing ${brandName}`
		}));
	};
	return /* @__PURE__ */ jsx(MRLayout, {
		title: "Visits & Daily Planner",
		children: /* @__PURE__ */ jsxs("div", {
			className: "space-y-6",
			children: [
				/* @__PURE__ */ jsxs("div", {
					className: "flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-200/80",
					children: [/* @__PURE__ */ jsxs("div", { children: [
						/* @__PURE__ */ jsxs("div", {
							className: "flex items-center gap-2 text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1",
							children: [
								/* @__PURE__ */ jsx(CalendarClock, { className: "w-4 h-4 text-slate-700" }),
								/* @__PURE__ */ jsx("span", { children: "Field Operations" }),
								/* @__PURE__ */ jsx("span", {
									className: "inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold bg-slate-100 text-slate-700 border border-slate-200",
									children: todayDate ? new Date(todayDate).toLocaleDateString("en-US", {
										weekday: "short",
										month: "short",
										day: "numeric",
										year: "numeric"
									}) : "Today"
								})
							]
						}),
						/* @__PURE__ */ jsx("h1", {
							className: "text-xl sm:text-2xl font-semibold tracking-tight text-slate-800",
							children: "Visits & Daily Planner"
						}),
						/* @__PURE__ */ jsx("p", {
							className: "text-xs text-slate-500 font-normal mt-0.5",
							children: "Plan scheduled calls and clinic visits, check off completed interactions, and record product detailing logs."
						})
					] }), /* @__PURE__ */ jsx("div", {
						className: "flex items-center gap-2.5 shrink-0",
						children: activeView === "planner" ? /* @__PURE__ */ jsxs("button", {
							type: "button",
							onClick: () => setIsScheduleModalOpen(true),
							className: "inline-flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-medium transition-colors cursor-pointer",
							children: [/* @__PURE__ */ jsx(Plus, { className: "w-4 h-4 stroke-[2]" }), /* @__PURE__ */ jsx("span", { children: "Schedule Call or Visit" })]
						}) : /* @__PURE__ */ jsxs("button", {
							type: "button",
							onClick: () => openDetailingModal(),
							className: "inline-flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-medium transition-colors cursor-pointer",
							children: [/* @__PURE__ */ jsx(Plus, { className: "w-4 h-4 stroke-[2]" }), /* @__PURE__ */ jsx("span", { children: "Log Detailing & Samples" })]
						})
					})]
				}),
				/* @__PURE__ */ jsxs("div", {
					className: "flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-2 rounded-2xl border border-slate-200/80",
					children: [/* @__PURE__ */ jsxs("div", {
						className: "flex items-center gap-1.5 p-1 bg-slate-100 rounded-xl w-full sm:w-auto",
						children: [/* @__PURE__ */ jsxs("button", {
							type: "button",
							onClick: () => setActiveView("planner"),
							className: `flex items-center justify-center gap-2 px-4 py-1.5 rounded-lg text-xs font-medium transition-colors cursor-pointer ${activeView === "planner" ? "bg-white text-slate-900 font-semibold shadow-2xs" : "text-slate-600 hover:text-slate-900 font-normal"}`,
							children: [
								/* @__PURE__ */ jsx(CalendarClock, { className: `w-3.5 h-3.5 ${activeView === "planner" ? "text-slate-900 stroke-[2]" : "text-slate-400"}` }),
								/* @__PURE__ */ jsx("span", { children: "Daily Calls & Planner" }),
								/* @__PURE__ */ jsxs("span", {
									className: `text-[10px] px-1.5 py-0.2 rounded-md font-semibold ${activeView === "planner" ? "bg-slate-100 text-slate-800" : "bg-slate-200/70 text-slate-600"}`,
									children: [metrics.today_total || 0, " Today"]
								})
							]
						}), /* @__PURE__ */ jsxs("button", {
							type: "button",
							onClick: () => setActiveView("detailing"),
							className: `flex items-center justify-center gap-2 px-4 py-1.5 rounded-lg text-xs font-medium transition-colors cursor-pointer ${activeView === "detailing" ? "bg-white text-slate-900 font-semibold shadow-2xs" : "text-slate-600 hover:text-slate-900 font-normal"}`,
							children: [
								/* @__PURE__ */ jsx(Stethoscope, { className: `w-3.5 h-3.5 ${activeView === "detailing" ? "text-slate-900 stroke-[2]" : "text-slate-400"}` }),
								/* @__PURE__ */ jsx("span", { children: "Detailing & Sample Logs" }),
								/* @__PURE__ */ jsx("span", {
									className: `text-[10px] px-1.5 py-0.2 rounded-md font-semibold ${activeView === "detailing" ? "bg-slate-100 text-slate-800" : "bg-slate-200/70 text-slate-600"}`,
									children: "DCR Logs"
								})
							]
						})]
					}), /* @__PURE__ */ jsxs("div", {
						className: "text-[11px] text-slate-400 px-2 flex items-center gap-1.5",
						children: [/* @__PURE__ */ jsx(Sparkles, { className: "w-3.5 h-3.5 text-slate-400 shrink-0" }), /* @__PURE__ */ jsx("span", { children: activeView === "planner" ? "Check off calls & visits as you complete them on the road" : "Clinical detailing history and physician sample disbursements" })]
					})]
				}),
				activeView === "planner" && /* @__PURE__ */ jsxs("div", {
					className: "space-y-6",
					children: [
						/* @__PURE__ */ jsxs("div", {
							className: "grid grid-cols-1 md:grid-cols-4 gap-4",
							children: [
								/* @__PURE__ */ jsxs("div", {
									className: "md:col-span-2 bg-slate-900 text-white p-5 rounded-2xl border border-slate-800 relative overflow-hidden flex flex-col justify-between",
									children: [
										/* @__PURE__ */ jsxs("div", {
											className: "relative z-10",
											children: [/* @__PURE__ */ jsxs("div", {
												className: "flex items-center justify-between mb-2",
												children: [/* @__PURE__ */ jsxs("span", {
													className: "text-xs font-medium text-slate-300 uppercase tracking-wider flex items-center gap-1.5",
													children: [/* @__PURE__ */ jsx(TrendingUp, { className: "w-3.5 h-3.5 text-emerald-400" }), " Today's Execution Rate"]
												}), /* @__PURE__ */ jsxs("span", {
													className: "text-xs font-semibold bg-emerald-500/20 text-emerald-300 px-2.5 py-0.5 rounded-full border border-emerald-500/30",
													children: [
														metrics.today_completed || 0,
														" of ",
														metrics.today_total || 0,
														" Done"
													]
												})]
											}), /* @__PURE__ */ jsxs("div", {
												className: "flex items-baseline gap-2",
												children: [/* @__PURE__ */ jsxs("span", {
													className: "text-3xl font-extrabold tracking-tight",
													children: [metrics.completion_rate || 0, "%"]
												}), /* @__PURE__ */ jsx("span", {
													className: "text-xs text-slate-400 font-normal",
													children: metrics.today_pending > 0 ? `${metrics.today_pending} action${metrics.today_pending > 1 ? "s" : ""} remaining today` : metrics.today_total > 0 ? "All scheduled items completed! Great work!" : "No items scheduled for today yet"
												})]
											})]
										}),
										/* @__PURE__ */ jsx("div", {
											className: "relative z-10 mt-4",
											children: /* @__PURE__ */ jsx("div", {
												className: "w-full h-2.5 bg-slate-800 rounded-full overflow-hidden p-0.5 border border-slate-700",
												children: /* @__PURE__ */ jsx("div", {
													className: "h-full bg-emerald-500 rounded-full transition-all duration-500",
													style: { width: `${Math.min(100, Math.max(metrics.completion_rate || 0, metrics.today_total === 0 ? 0 : 5))}%` }
												})
											})
										}),
										/* @__PURE__ */ jsx("div", { className: "absolute -right-6 -bottom-8 w-32 h-32 rounded-full bg-emerald-500/5 pointer-events-none" })
									]
								}),
								/* @__PURE__ */ jsxs("div", {
									className: "bg-white p-5 rounded-2xl border border-slate-200/80 flex items-center justify-between",
									children: [/* @__PURE__ */ jsxs("div", { children: [
										/* @__PURE__ */ jsx("span", {
											className: "text-xs font-medium text-slate-500 block",
											children: "Clinic Visits Planned"
										}),
										/* @__PURE__ */ jsx("span", {
											className: "text-2xl font-semibold text-slate-800 mt-1 block",
											children: metrics.today_visits || 0
										}),
										/* @__PURE__ */ jsxs("span", {
											className: "text-[11px] text-slate-400 font-normal flex items-center gap-1 mt-0.5",
											children: [/* @__PURE__ */ jsx(MapPin, { className: "w-3 h-3 text-slate-400" }), " In-person clinic visits"]
										})
									] }), /* @__PURE__ */ jsx("div", {
										className: "w-9 h-9 rounded-xl bg-slate-100 text-slate-700 flex items-center justify-center shrink-0",
										children: /* @__PURE__ */ jsx(Stethoscope, { className: "w-4 h-4 stroke-[2]" })
									})]
								}),
								/* @__PURE__ */ jsxs("div", {
									className: "bg-white p-5 rounded-2xl border border-slate-200/80 flex items-center justify-between",
									children: [/* @__PURE__ */ jsxs("div", { children: [
										/* @__PURE__ */ jsx("span", {
											className: "text-xs font-medium text-slate-500 block",
											children: "Phone Calls Planned"
										}),
										/* @__PURE__ */ jsx("span", {
											className: "text-2xl font-semibold text-slate-800 mt-1 block",
											children: metrics.today_calls || 0
										}),
										/* @__PURE__ */ jsxs("span", {
											className: "text-[11px] text-slate-400 font-normal flex items-center gap-1 mt-0.5",
											children: [/* @__PURE__ */ jsx(PhoneCall, { className: "w-3 h-3 text-slate-400" }), " Telephonic reminders"]
										})
									] }), /* @__PURE__ */ jsx("div", {
										className: "w-9 h-9 rounded-xl bg-slate-100 text-slate-700 flex items-center justify-center shrink-0",
										children: /* @__PURE__ */ jsx(Phone, { className: "w-4 h-4 stroke-[2]" })
									})]
								})
							]
						}),
						/* @__PURE__ */ jsxs("div", {
							className: "bg-white rounded-2xl border border-slate-200/80 p-4 space-y-3",
							children: [/* @__PURE__ */ jsxs("div", {
								className: "flex flex-col md:flex-row md:items-center justify-between gap-3",
								children: [/* @__PURE__ */ jsxs("div", {
									className: "flex items-center gap-1 bg-slate-100 p-1 rounded-xl w-full md:w-auto overflow-x-auto",
									children: [
										/* @__PURE__ */ jsxs("button", {
											type: "button",
											onClick: () => handlePlannerTabChange("today"),
											className: `flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors cursor-pointer whitespace-nowrap ${plannerTab === "today" ? "bg-white text-slate-900 font-semibold shadow-2xs" : "text-slate-600 hover:text-slate-900"}`,
											children: [/* @__PURE__ */ jsx("span", { children: "Today's Agenda" }), /* @__PURE__ */ jsx("span", {
												className: `text-[10px] px-1.5 py-0.2 rounded-md font-semibold ${plannerTab === "today" ? "bg-slate-100 text-slate-900" : "bg-slate-200/70 text-slate-600"}`,
												children: metrics.today_total || 0
											})]
										}),
										/* @__PURE__ */ jsxs("button", {
											type: "button",
											onClick: () => handlePlannerTabChange("upcoming"),
											className: `flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors cursor-pointer whitespace-nowrap ${plannerTab === "upcoming" ? "bg-white text-slate-900 font-semibold shadow-2xs" : "text-slate-600 hover:text-slate-900"}`,
											children: [/* @__PURE__ */ jsx("span", { children: "Upcoming" }), /* @__PURE__ */ jsx("span", {
												className: `text-[10px] px-1.5 py-0.2 rounded-md font-semibold ${plannerTab === "upcoming" ? "bg-slate-100 text-slate-900" : "bg-slate-200/70 text-slate-600"}`,
												children: metrics.upcoming_count || 0
											})]
										}),
										/* @__PURE__ */ jsx("button", {
											type: "button",
											onClick: () => handlePlannerTabChange("history"),
											className: `flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors cursor-pointer whitespace-nowrap ${plannerTab === "history" ? "bg-white text-slate-900 font-semibold shadow-2xs" : "text-slate-600 hover:text-slate-900"}`,
											children: /* @__PURE__ */ jsx("span", { children: "Past History" })
										}),
										/* @__PURE__ */ jsx("button", {
											type: "button",
											onClick: () => handlePlannerTabChange("all"),
											className: `flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors cursor-pointer whitespace-nowrap ${plannerTab === "all" ? "bg-white text-slate-900 font-semibold shadow-2xs" : "text-slate-600 hover:text-slate-900"}`,
											children: /* @__PURE__ */ jsx("span", { children: "All" })
										})
									]
								}), /* @__PURE__ */ jsxs("div", {
									className: "relative w-full md:w-72",
									children: [
										/* @__PURE__ */ jsx(Search, { className: "w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" }),
										/* @__PURE__ */ jsx("input", {
											type: "text",
											placeholder: "Search doctor, clinic, purpose...",
											value: plannerSearch,
											onChange: (e) => setPlannerSearch(e.target.value),
											className: "w-full pl-9 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-200/80 rounded-xl focus:bg-white focus:outline-hidden focus:ring-1 focus:ring-slate-900 focus:border-slate-900 transition-all text-slate-800"
										}),
										plannerSearch && /* @__PURE__ */ jsx("button", {
											type: "button",
											onClick: () => setPlannerSearch(""),
											className: "absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-0.5",
											children: /* @__PURE__ */ jsx(X, { className: "w-3.5 h-3.5" })
										})
									]
								})]
							}), /* @__PURE__ */ jsxs("div", {
								className: "flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-slate-100 text-xs",
								children: [/* @__PURE__ */ jsxs("div", {
									className: "flex items-center gap-1.5 overflow-x-auto",
									children: [
										/* @__PURE__ */ jsx("span", {
											className: "text-[11px] font-medium text-slate-400 uppercase tracking-wider shrink-0",
											children: "Type:"
										}),
										/* @__PURE__ */ jsx("button", {
											type: "button",
											onClick: () => setActionFilter("all"),
											className: `px-2.5 py-1 rounded-lg text-xs font-medium cursor-pointer transition-colors ${actionFilter === "all" ? "bg-slate-900 text-white font-semibold" : "bg-slate-100 text-slate-600 hover:bg-slate-200/70"}`,
											children: "All Actions"
										}),
										/* @__PURE__ */ jsxs("button", {
											type: "button",
											onClick: () => setActionFilter("visit"),
											className: `inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-medium cursor-pointer transition-colors ${actionFilter === "visit" ? "bg-slate-900 text-white font-semibold" : "bg-slate-100 text-slate-600 hover:bg-slate-200/70"}`,
											children: [/* @__PURE__ */ jsx(MapPin, { className: "w-3 h-3 text-violet-600" }), " Visits Only"]
										}),
										/* @__PURE__ */ jsxs("button", {
											type: "button",
											onClick: () => setActionFilter("call"),
											className: `inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-medium cursor-pointer transition-colors ${actionFilter === "call" ? "bg-slate-900 text-white font-semibold" : "bg-slate-100 text-slate-600 hover:bg-slate-200/70"}`,
											children: [/* @__PURE__ */ jsx(Phone, { className: "w-3 h-3 text-sky-600" }), " Calls Only"]
										})
									]
								}), /* @__PURE__ */ jsxs("div", {
									className: "flex items-center gap-2",
									children: [/* @__PURE__ */ jsx("span", {
										className: "text-[11px] font-medium text-slate-400 uppercase tracking-wider",
										children: "Status:"
									}), /* @__PURE__ */ jsxs("select", {
										value: statusFilter,
										onChange: (e) => setStatusFilter(e.target.value),
										className: "bg-slate-50 border border-slate-200/80 text-slate-700 text-xs rounded-xl px-2.5 py-1 focus:outline-hidden focus:ring-1 focus:ring-slate-900 focus:border-slate-900 cursor-pointer",
										children: [
											/* @__PURE__ */ jsx("option", {
												value: "all",
												children: "All Status"
											}),
											/* @__PURE__ */ jsx("option", {
												value: "pending",
												children: "Pending"
											}),
											/* @__PURE__ */ jsx("option", {
												value: "completed",
												children: "Completed"
											}),
											/* @__PURE__ */ jsx("option", {
												value: "missed",
												children: "Missed"
											})
										]
									})]
								})]
							})]
						}),
						/* @__PURE__ */ jsx("div", {
							className: "space-y-3",
							children: filteredSchedules.length === 0 ? /* @__PURE__ */ jsxs("div", {
								className: "bg-white rounded-2xl border border-slate-200/80 p-12 text-center",
								children: [
									/* @__PURE__ */ jsx("div", {
										className: "w-10 h-10 rounded-xl bg-slate-100 text-slate-700 flex items-center justify-center mx-auto mb-3",
										children: /* @__PURE__ */ jsx(CalendarClock, { className: "w-5 h-5 stroke-[1.8]" })
									}),
									/* @__PURE__ */ jsx("h3", {
										className: "text-sm font-semibold text-slate-800 mb-1",
										children: "No Scheduled Items Found"
									}),
									/* @__PURE__ */ jsx("p", {
										className: "text-xs text-slate-400 max-w-sm mx-auto mb-4 font-normal",
										children: plannerSearch || actionFilter !== "all" || statusFilter !== "all" ? "No items match your active filters. Try clearing filters or searching for something else." : `You have no calls or visits planned in the '${plannerTab}' view.`
									}),
									/* @__PURE__ */ jsxs("button", {
										type: "button",
										onClick: () => setIsScheduleModalOpen(true),
										className: "inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-slate-900 text-white text-xs font-medium hover:bg-slate-800 transition-colors cursor-pointer",
										children: [/* @__PURE__ */ jsx(Plus, { className: "w-3.5 h-3.5 stroke-[2]" }), /* @__PURE__ */ jsx("span", { children: "Add Today's Call or Visit" })]
									})
								]
							}) : filteredSchedules.map((item) => {
								const isCall = item.action_type === "call";
								const isCompleted = item.status === "completed";
								const isPending = item.status === "pending";
								const isMissed = item.status === "missed";
								const doctor = item.doctor;
								const displayName = doctor ? doctor.name : item.custom_contact_name;
								const subtitle = doctor ? `${doctor.specialization} • ${doctor.clinic_hospital_name}` : `Custom Contact • ${(item.contact_type || "contact").toUpperCase()}`;
								const phone = doctor ? doctor.phone : null;
								return /* @__PURE__ */ jsx("div", {
									className: `bg-white rounded-2xl border transition-colors p-4 sm:p-5 ${isCompleted ? "border-emerald-200 bg-emerald-50/20" : isMissed ? "border-rose-200 bg-rose-50/20" : "border-slate-200/80 hover:border-slate-300"}`,
									children: /* @__PURE__ */ jsxs("div", {
										className: "flex flex-col lg:flex-row lg:items-center justify-between gap-4",
										children: [/* @__PURE__ */ jsxs("div", {
											className: "flex items-start gap-3.5 min-w-0 flex-1",
											children: [/* @__PURE__ */ jsx("div", {
												className: `w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${isCompleted ? "bg-emerald-50 text-emerald-700 border border-emerald-100" : isCall ? "bg-sky-50 text-sky-700 border border-sky-100" : "bg-slate-100 text-slate-700 border border-slate-200/60"}`,
												children: isCompleted ? /* @__PURE__ */ jsx(CheckCheck, { className: "w-4 h-4 stroke-[2]" }) : isCall ? /* @__PURE__ */ jsx(PhoneCall, { className: "w-4 h-4 stroke-[2]" }) : /* @__PURE__ */ jsx(MapPin, { className: "w-4 h-4 stroke-[2]" })
											}), /* @__PURE__ */ jsxs("div", {
												className: "min-w-0 flex-1",
												children: [
													/* @__PURE__ */ jsxs("div", {
														className: "flex flex-wrap items-center gap-2 mb-1",
														children: [
															/* @__PURE__ */ jsx("span", {
																className: `text-[10px] uppercase font-semibold px-2 py-0.5 rounded-md ${isCall ? "bg-sky-50 text-sky-700 border border-sky-100" : "bg-slate-100 text-slate-700 border border-slate-200/70"}`,
																children: isCall ? "Phone Call" : "Clinic Visit"
															}),
															item.priority === "high" && /* @__PURE__ */ jsx("span", {
																className: "text-[10px] uppercase font-semibold px-2 py-0.5 rounded-md bg-rose-50 text-rose-700 border border-rose-100",
																children: "High Priority"
															}),
															/* @__PURE__ */ jsxs("span", {
																className: "inline-flex items-center gap-1 text-[11px] text-slate-500 font-normal bg-slate-50 px-2 py-0.5 rounded-md border border-slate-100",
																children: [
																	/* @__PURE__ */ jsx(Clock, { className: "w-3 h-3 text-slate-400" }),
																	/* @__PURE__ */ jsx("span", { children: item.scheduled_time || "Anytime" }),
																	plannerTab !== "today" && /* @__PURE__ */ jsxs("span", {
																		className: "text-slate-400 font-normal",
																		children: ["• ", new Date(item.scheduled_date).toLocaleDateString("en-US", {
																			month: "short",
																			day: "numeric"
																		})]
																	})
																]
															}),
															isCompleted && /* @__PURE__ */ jsxs("span", {
																className: "inline-flex items-center gap-1 text-[10px] uppercase font-semibold px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-700 border border-emerald-100",
																children: [/* @__PURE__ */ jsx(Check, { className: "w-3 h-3 stroke-[2.5]" }), " Completed"]
															}),
															isMissed && /* @__PURE__ */ jsx("span", {
																className: "text-[10px] uppercase font-semibold px-2 py-0.5 rounded-md bg-rose-50 text-rose-700 border border-rose-100",
																children: "Missed"
															})
														]
													}),
													/* @__PURE__ */ jsxs("div", {
														className: "flex items-center gap-2",
														children: [/* @__PURE__ */ jsx("h4", {
															className: "text-sm font-semibold text-slate-800 truncate",
															children: displayName
														}), doctor?.tier && /* @__PURE__ */ jsx("span", {
															className: "text-[9px] uppercase font-semibold px-1.5 py-0.2 bg-slate-100 text-slate-700 border border-slate-200 rounded",
															children: doctor.tier
														})]
													}),
													/* @__PURE__ */ jsx("p", {
														className: "text-xs text-slate-400 truncate mt-0.5 font-normal",
														children: subtitle
													}),
													/* @__PURE__ */ jsxs("div", {
														className: "mt-2.5 bg-slate-50 rounded-xl p-2.5 border border-slate-100 text-xs",
														children: [/* @__PURE__ */ jsxs("div", {
															className: "flex items-start gap-1.5",
															children: [/* @__PURE__ */ jsx(FileText, { className: "w-3.5 h-3.5 text-slate-500 shrink-0 mt-0.5" }), /* @__PURE__ */ jsxs("div", {
																className: "min-w-0 flex-1",
																children: [/* @__PURE__ */ jsx("span", {
																	className: "font-semibold text-slate-700",
																	children: "Purpose: "
																}), /* @__PURE__ */ jsx("span", {
																	className: "text-slate-600 font-normal",
																	children: item.purpose
																})]
															})]
														}), item.notes && /* @__PURE__ */ jsxs("p", {
															className: "text-[11px] text-slate-400 mt-1 pl-5 italic",
															children: ["Note: ", item.notes]
														})]
													}),
													isCompleted && item.outcome_note && /* @__PURE__ */ jsxs("div", {
														className: "mt-2 bg-emerald-50/80 border border-emerald-100 rounded-xl p-2.5 text-xs text-emerald-900 flex items-start gap-2",
														children: [/* @__PURE__ */ jsx(MessageSquare, { className: "w-3.5 h-3.5 text-emerald-700 shrink-0 mt-0.5" }), /* @__PURE__ */ jsxs("div", { children: [
															/* @__PURE__ */ jsx("span", {
																className: "font-semibold text-emerald-900",
																children: "Outcome: "
															}),
															/* @__PURE__ */ jsx("span", {
																className: "font-normal",
																children: item.outcome_note
															}),
															item.completed_at && /* @__PURE__ */ jsxs("span", {
																className: "text-[10px] text-emerald-700 block mt-0.5",
																children: ["Logged at ", new Date(item.completed_at).toLocaleTimeString([], {
																	hour: "2-digit",
																	minute: "2-digit"
																})]
															})
														] })]
													})
												]
											})]
										}), /* @__PURE__ */ jsxs("div", {
											className: "flex flex-wrap lg:flex-col items-end gap-2 shrink-0 pt-3 lg:pt-0 border-t lg:border-t-0 border-slate-100",
											children: [
												isPending && /* @__PURE__ */ jsxs("div", {
													className: "flex items-center gap-2 w-full sm:w-auto justify-end",
													children: [
														phone && /* @__PURE__ */ jsxs("a", {
															href: `tel:${phone}`,
															className: "inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-200/80 bg-white text-slate-700 hover:bg-slate-50 text-xs font-medium transition-colors cursor-pointer",
															title: `Dial ${phone}`,
															children: [/* @__PURE__ */ jsx(Phone, { className: "w-3.5 h-3.5 text-sky-600" }), /* @__PURE__ */ jsxs("span", { children: ["Call ", phone] })]
														}),
														/* @__PURE__ */ jsxs("button", {
															type: "button",
															onClick: () => openOutcomeModal(item),
															className: "inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-medium text-white bg-slate-900 hover:bg-slate-800 transition-colors cursor-pointer",
															children: [/* @__PURE__ */ jsx(Check, { className: "w-3.5 h-3.5 stroke-[2]" }), /* @__PURE__ */ jsx("span", { children: isCall ? "Mark as Called" : "Mark as Visited" })]
														}),
														/* @__PURE__ */ jsx("button", {
															type: "button",
															onClick: () => {
																setRescheduleItem(item);
																setRescheduleDate(item.scheduled_date);
																setRescheduleTime(item.scheduled_time || "");
															},
															className: "p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer",
															title: "Reschedule",
															children: /* @__PURE__ */ jsx(RotateCcw, { className: "w-4 h-4" })
														}),
														/* @__PURE__ */ jsx("button", {
															type: "button",
															onClick: () => handlePlannerDelete(item.id),
															className: "p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer",
															title: "Delete",
															children: /* @__PURE__ */ jsx(Trash2, { className: "w-4 h-4" })
														})
													]
												}),
												!isCall && doctor && /* @__PURE__ */ jsxs("button", {
													type: "button",
													onClick: () => openDetailingModal(String(doctor.id)),
													className: "inline-flex items-center gap-1.5 text-xs font-medium text-slate-700 hover:text-slate-900 bg-white hover:bg-slate-50 px-3 py-1.5 rounded-xl border border-slate-200/80 cursor-pointer mt-1 transition-colors",
													children: [
														/* @__PURE__ */ jsx(Pill, { className: "w-3.5 h-3.5 text-slate-500" }),
														/* @__PURE__ */ jsx("span", { children: "Log Detailing & Samples" }),
														/* @__PURE__ */ jsx(ChevronRight, { className: "w-3 h-3 text-slate-400" })
													]
												}),
												isCompleted && /* @__PURE__ */ jsxs("div", {
													className: "flex items-center gap-2",
													children: [
														/* @__PURE__ */ jsx("button", {
															type: "button",
															onClick: () => openOutcomeModal(item),
															className: "text-[11px] font-medium text-emerald-800 hover:text-emerald-950 underline cursor-pointer",
															children: "Edit Outcome"
														}),
														/* @__PURE__ */ jsx("span", {
															className: "text-slate-300",
															children: "•"
														}),
														/* @__PURE__ */ jsx("button", {
															type: "button",
															onClick: () => handlePlannerStatusUpdate(item.id, "pending"),
															className: "text-[11px] font-medium text-slate-500 hover:text-slate-800 cursor-pointer",
															children: "Reopen"
														}),
														/* @__PURE__ */ jsx("button", {
															type: "button",
															onClick: () => handlePlannerDelete(item.id),
															className: "p-1 rounded text-slate-400 hover:text-rose-600 hover:bg-rose-50 ml-1 cursor-pointer",
															children: /* @__PURE__ */ jsx(Trash2, { className: "w-3.5 h-3.5" })
														})
													]
												})
											]
										})]
									})
								}, item.id);
							})
						})
					]
				}),
				activeView === "detailing" && /* @__PURE__ */ jsxs("div", {
					className: "space-y-6",
					children: [/* @__PURE__ */ jsx("div", {
						className: "bg-white rounded-2xl border border-slate-200/80 p-4 shadow-xs space-y-3",
						children: /* @__PURE__ */ jsxs("div", {
							className: "flex flex-col md:flex-row md:items-center justify-between gap-3",
							children: [/* @__PURE__ */ jsxs("div", {
								className: "relative w-full md:w-80",
								children: [
									/* @__PURE__ */ jsx(Search, { className: "w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" }),
									/* @__PURE__ */ jsx("input", {
										type: "text",
										placeholder: "Search doctor, hospital, specialty...",
										value: dcrSearch,
										onChange: (e) => setDcrSearch(e.target.value),
										className: "w-full pl-9 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-200/80 rounded-xl focus:bg-white focus:outline-hidden focus:ring-1 focus:ring-slate-900 focus:border-slate-900 text-slate-800"
									}),
									dcrSearch && /* @__PURE__ */ jsx("button", {
										type: "button",
										onClick: () => setDcrSearch(""),
										className: "absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-0.5",
										children: /* @__PURE__ */ jsx(X, { className: "w-3.5 h-3.5" })
									})
								]
							}), /* @__PURE__ */ jsxs("div", {
								className: "flex flex-wrap items-center gap-2",
								children: [
									/* @__PURE__ */ jsxs("select", {
										value: dcrDateFilter,
										onChange: (e) => setDcrDateFilter(e.target.value),
										className: "bg-slate-50 border border-slate-200/80 text-slate-700 text-xs rounded-xl px-2.5 py-1.5 focus:outline-hidden focus:ring-1 focus:ring-slate-900 focus:border-slate-900 cursor-pointer",
										children: [
											/* @__PURE__ */ jsx("option", {
												value: "all",
												children: "All Dates"
											}),
											/* @__PURE__ */ jsx("option", {
												value: "today",
												children: "Today's Visits"
											}),
											/* @__PURE__ */ jsx("option", {
												value: "upcoming",
												children: "Upcoming"
											}),
											/* @__PURE__ */ jsx("option", {
												value: "past",
												children: "Past History"
											})
										]
									}),
									/* @__PURE__ */ jsxs("select", {
										value: dcrDoctorFilter,
										onChange: (e) => setDcrDoctorFilter(e.target.value),
										className: "bg-slate-50 border border-slate-200/80 text-slate-700 text-xs rounded-xl px-2.5 py-1.5 focus:outline-hidden focus:ring-1 focus:ring-slate-900 focus:border-slate-900 cursor-pointer max-w-[180px]",
										children: [/* @__PURE__ */ jsx("option", {
											value: "all",
											children: "All Doctors"
										}), doctors.map((d) => /* @__PURE__ */ jsx("option", {
											value: d.id,
											children: d.name
										}, d.id))]
									}),
									/* @__PURE__ */ jsxs("select", {
										value: dcrStatusFilter,
										onChange: (e) => setDcrStatusFilter(e.target.value),
										className: "bg-slate-50 border border-slate-200/80 text-slate-700 text-xs rounded-xl px-2.5 py-1.5 focus:outline-hidden focus:ring-1 focus:ring-slate-900 focus:border-slate-900 cursor-pointer",
										children: [
											/* @__PURE__ */ jsx("option", {
												value: "all",
												children: "All Status"
											}),
											/* @__PURE__ */ jsx("option", {
												value: "completed",
												children: "Completed Calls"
											}),
											/* @__PURE__ */ jsx("option", {
												value: "scheduled",
												children: "Scheduled"
											})
										]
									})
								]
							})]
						})
					}), visitsLoading ? /* @__PURE__ */ jsxs("div", {
						className: "bg-white rounded-2xl border border-slate-200/80 p-12 text-center text-xs text-slate-500",
						children: [/* @__PURE__ */ jsx(RefreshCw, { className: "w-5 h-5 animate-spin text-slate-900 mx-auto mb-2" }), /* @__PURE__ */ jsx("span", { children: "Loading detailing records..." })]
					}) : visits.length === 0 ? /* @__PURE__ */ jsxs("div", {
						className: "bg-white rounded-2xl border border-slate-200/80 p-12 text-center",
						children: [
							/* @__PURE__ */ jsx("div", {
								className: "w-10 h-10 rounded-xl bg-slate-100 text-slate-700 flex items-center justify-center mx-auto mb-3",
								children: /* @__PURE__ */ jsx(Stethoscope, { className: "w-5 h-5 stroke-[1.8]" })
							}),
							/* @__PURE__ */ jsx("h3", {
								className: "text-sm font-semibold text-slate-800 mb-1",
								children: "No Detailing Records Found"
							}),
							/* @__PURE__ */ jsx("p", {
								className: "text-xs text-slate-400 max-w-sm mx-auto mb-4 font-normal",
								children: "Log the drugs pitched, free sample strips handed over, and prescriber commitment for your doctor visits."
							}),
							/* @__PURE__ */ jsxs("button", {
								type: "button",
								onClick: () => openDetailingModal(),
								className: "inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-slate-900 text-white text-xs font-medium hover:bg-slate-800 transition-colors cursor-pointer",
								children: [/* @__PURE__ */ jsx(Plus, { className: "w-3.5 h-3.5 stroke-[2]" }), /* @__PURE__ */ jsx("span", { children: "Log Detailing & Samples" })]
							})
						]
					}) : /* @__PURE__ */ jsx("div", {
						className: "space-y-3",
						children: visits.map((v) => {
							const doc = v.doctor;
							const feedbackObj = FEEDBACK_OPTIONS.find((f) => f.value === v.doctor_feedback);
							return /* @__PURE__ */ jsx("div", {
								className: "bg-white rounded-2xl border border-slate-200/80 hover:border-slate-300 p-4 sm:p-5 transition-colors",
								children: /* @__PURE__ */ jsxs("div", {
									className: "flex flex-col lg:flex-row lg:items-start justify-between gap-4",
									children: [/* @__PURE__ */ jsxs("div", {
										className: "flex items-start gap-3.5 min-w-0 flex-1",
										children: [/* @__PURE__ */ jsx("div", {
											className: "w-10 h-10 rounded-xl bg-slate-100 text-slate-700 flex items-center justify-center font-semibold text-xs shrink-0 border border-slate-200/60",
											children: doc?.name?.charAt(4) || "D"
										}), /* @__PURE__ */ jsxs("div", {
											className: "min-w-0 flex-1",
											children: [
												/* @__PURE__ */ jsxs("div", {
													className: "flex flex-wrap items-center gap-2 mb-1",
													children: [
														/* @__PURE__ */ jsx("span", {
															className: "text-[10px] uppercase font-semibold px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 border border-slate-200/70",
															children: v.call_type?.replace("_", " ")?.toUpperCase() || "ROUTINE DETAILING"
														}),
														/* @__PURE__ */ jsx("span", {
															className: "text-[10px] uppercase font-semibold px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-700 border border-emerald-100",
															children: v.status?.toUpperCase() || "COMPLETED"
														}),
														/* @__PURE__ */ jsxs("span", {
															className: "inline-flex items-center gap-1 text-[11px] text-slate-500 font-normal bg-slate-50 px-2 py-0.5 rounded-md border border-slate-100",
															children: [
																/* @__PURE__ */ jsx(Calendar, { className: "w-3 h-3 text-slate-400" }),
																/* @__PURE__ */ jsx("span", { children: v.visit_date }),
																v.visit_time && /* @__PURE__ */ jsxs("span", { children: ["• ", v.visit_time] })
															]
														})
													]
												}),
												/* @__PURE__ */ jsxs("div", {
													className: "flex items-center gap-2",
													children: [
														/* @__PURE__ */ jsx("h4", {
															className: "text-sm font-semibold text-slate-800 truncate",
															children: doc?.name
														}),
														doc?.qualification && /* @__PURE__ */ jsxs("span", {
															className: "text-[11px] text-slate-400",
															children: [
																"(",
																doc.qualification,
																")"
															]
														}),
														doc?.tier && /* @__PURE__ */ jsx("span", {
															className: "text-[9px] uppercase font-semibold px-1.5 py-0.2 bg-slate-100 text-slate-700 border border-slate-200 rounded",
															children: doc.tier
														})
													]
												}),
												/* @__PURE__ */ jsxs("p", {
													className: "text-xs text-slate-400 truncate mt-0.5 font-normal",
													children: [
														doc?.clinic_hospital_name,
														" • ",
														doc?.specialization
													]
												}),
												Array.isArray(v.products_detailed) && v.products_detailed.length > 0 && /* @__PURE__ */ jsxs("div", {
													className: "mt-2.5 flex flex-wrap items-center gap-1.5",
													children: [/* @__PURE__ */ jsx("span", {
														className: "text-[11px] font-medium text-slate-400",
														children: "Formulations Detailed:"
													}), v.products_detailed.map((prod, idx) => /* @__PURE__ */ jsxs("span", {
														className: "inline-flex items-center gap-1 text-[10px] font-medium bg-slate-100 text-slate-700 border border-slate-200/80 px-2 py-0.5 rounded-md",
														children: [/* @__PURE__ */ jsx(Pill, { className: "w-2.5 h-2.5 text-slate-500" }), /* @__PURE__ */ jsx("span", { children: prod })]
													}, idx))]
												}),
												/* @__PURE__ */ jsxs("div", {
													className: "mt-2.5 grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs",
													children: [feedbackObj && /* @__PURE__ */ jsxs("div", {
														className: "bg-slate-50 p-2 rounded-xl border border-slate-100 flex items-center gap-2",
														children: [/* @__PURE__ */ jsx("span", {
															className: "text-slate-400 font-normal",
															children: "Physician Feedback:"
														}), /* @__PURE__ */ jsx("span", {
															className: `px-2 py-0.5 rounded-md font-semibold text-[10px] ${feedbackObj.color}`,
															children: feedbackObj.label
														})]
													}), v.samples_given && /* @__PURE__ */ jsxs("div", {
														className: "bg-slate-50 p-2 rounded-xl border border-slate-100 flex items-center gap-2",
														children: [
															/* @__PURE__ */ jsx(Gift, { className: "w-3.5 h-3.5 text-slate-600 shrink-0" }),
															/* @__PURE__ */ jsx("span", {
																className: "text-slate-400 font-normal",
																children: "Samples Provided:"
															}),
															/* @__PURE__ */ jsx("span", {
																className: "text-slate-700 font-medium truncate",
																children: v.samples_given
															})
														]
													})]
												}),
												v.remarks && /* @__PURE__ */ jsxs("p", {
													className: "text-[11px] text-slate-500 mt-2 bg-slate-50 p-2 rounded-xl border border-slate-100 font-normal",
													children: ["Remarks: ", v.remarks]
												}),
												v.next_visit_date && /* @__PURE__ */ jsxs("p", {
													className: "text-[11px] text-slate-600 font-medium mt-1.5 flex items-center gap-1",
													children: [/* @__PURE__ */ jsx(Calendar, { className: "w-3 h-3 text-slate-400" }), /* @__PURE__ */ jsxs("span", { children: ["Follow-up Planned: ", new Date(v.next_visit_date).toLocaleDateString("en-US", {
														month: "short",
														day: "numeric",
														year: "numeric"
													})] })]
												})
											]
										})]
									}), /* @__PURE__ */ jsxs("div", {
										className: "flex items-center gap-2 shrink-0 pt-2 lg:pt-0 border-t lg:border-t-0 border-slate-100",
										children: [/* @__PURE__ */ jsxs("button", {
											type: "button",
											onClick: () => {
												setEditingVisit(v);
												setDetailForm({
													doctor_id: String(v.doctor_id),
													visit_date: v.visit_date,
													visit_time: v.visit_time || "11:00 AM",
													call_type: v.call_type || "routine_detailing",
													status: v.status || "completed",
													products_detailed: v.products_detailed || [],
													doctor_feedback: v.doctor_feedback || "regular_prescriber",
													samples_given: v.samples_given || "",
													remarks: v.remarks || "",
													next_visit_date: v.next_visit_date || ""
												});
												setDetailModalOpen(true);
											},
											className: "inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold text-slate-700 hover:bg-slate-100 border border-slate-200 cursor-pointer",
											children: [/* @__PURE__ */ jsx(Edit2, { className: "w-3.5 h-3.5" }), /* @__PURE__ */ jsx("span", { children: "Edit Log" })]
										}), /* @__PURE__ */ jsx("button", {
											type: "button",
											onClick: () => handleDeleteDetailing(v.id),
											className: "p-1.5 rounded-xl text-slate-400 hover:text-rose-600 hover:bg-rose-50 border border-slate-200 cursor-pointer",
											title: "Delete",
											children: /* @__PURE__ */ jsx(Trash2, { className: "w-4 h-4" })
										})]
									})]
								})
							}, v.id);
						})
					})]
				}),
				isScheduleModalOpen && /* @__PURE__ */ jsx("div", {
					className: "fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs overflow-y-auto",
					children: /* @__PURE__ */ jsxs("div", {
						className: "bg-white rounded-3xl max-w-lg w-full p-6 shadow-xl border border-slate-100 my-8",
						children: [/* @__PURE__ */ jsxs("div", {
							className: "flex items-center justify-between pb-4 border-b border-slate-100",
							children: [/* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("h3", {
								className: "text-lg font-bold text-slate-900",
								children: "Schedule a Call or Clinic Visit"
							}), /* @__PURE__ */ jsx("p", {
								className: "text-xs text-slate-500 mt-0.5",
								children: "Add to your daily agenda for prompt field execution."
							})] }), /* @__PURE__ */ jsx("button", {
								type: "button",
								onClick: () => setIsScheduleModalOpen(false),
								className: "p-1.5 rounded-xl text-slate-400 hover:text-slate-600 hover:bg-slate-100 cursor-pointer",
								children: /* @__PURE__ */ jsx(X, { className: "w-5 h-5" })
							})]
						}), /* @__PURE__ */ jsxs("form", {
							onSubmit: handleScheduleSubmit,
							className: "space-y-4 pt-4 text-xs",
							children: [
								/* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsxs("label", {
									className: "block font-semibold text-slate-700 mb-1.5",
									children: ["Select Activity Type ", /* @__PURE__ */ jsx("span", {
										className: "text-rose-500",
										children: "*"
									})]
								}), /* @__PURE__ */ jsxs("div", {
									className: "grid grid-cols-2 gap-3",
									children: [/* @__PURE__ */ jsxs("button", {
										type: "button",
										onClick: () => setScheduleForm((prev) => ({
											...prev,
											action_type: "call"
										})),
										className: `flex items-center justify-center gap-2 p-3 rounded-2xl border text-xs font-bold transition-all cursor-pointer ${scheduleForm.action_type === "call" ? "bg-sky-50 border-sky-600 text-sky-800 shadow-xs ring-2 ring-sky-600/20" : "border-slate-200 text-slate-600 hover:bg-slate-50"}`,
										children: [/* @__PURE__ */ jsx(PhoneCall, { className: "w-4 h-4 text-sky-600" }), /* @__PURE__ */ jsx("span", { children: "Phone Call" })]
									}), /* @__PURE__ */ jsxs("button", {
										type: "button",
										onClick: () => setScheduleForm((prev) => ({
											...prev,
											action_type: "visit"
										})),
										className: `flex items-center justify-center gap-2 p-3 rounded-2xl border text-xs font-semibold transition-colors cursor-pointer ${scheduleForm.action_type === "visit" ? "bg-slate-900 border-slate-900 text-white" : "border-slate-200/80 text-slate-600 hover:bg-slate-50"}`,
										children: [/* @__PURE__ */ jsx(MapPin, { className: "w-4 h-4" }), /* @__PURE__ */ jsx("span", { children: "Clinic Visit" })]
									})]
								})] }),
								/* @__PURE__ */ jsxs("div", {
									className: "bg-slate-50 p-3.5 rounded-2xl border border-slate-200/70 space-y-3",
									children: [/* @__PURE__ */ jsxs("div", {
										className: "flex items-center justify-between",
										children: [/* @__PURE__ */ jsx("span", {
											className: "font-semibold text-slate-800",
											children: "Whom to Visit or Call?"
										}), /* @__PURE__ */ jsxs("div", {
											className: "flex items-center gap-3 text-[11px]",
											children: [/* @__PURE__ */ jsxs("label", {
												className: "flex items-center gap-1.5 cursor-pointer",
												children: [/* @__PURE__ */ jsx("input", {
													type: "radio",
													name: "contact_mode",
													checked: scheduleForm.contact_mode === "doctor",
													onChange: () => setScheduleForm((prev) => ({
														...prev,
														contact_mode: "doctor"
													})),
													className: "text-slate-900 focus:ring-slate-900"
												}), /* @__PURE__ */ jsx("span", {
													className: "font-medium text-slate-700",
													children: "Doctor"
												})]
											}), /* @__PURE__ */ jsxs("label", {
												className: "flex items-center gap-1.5 cursor-pointer",
												children: [/* @__PURE__ */ jsx("input", {
													type: "radio",
													name: "contact_mode",
													checked: scheduleForm.contact_mode === "custom",
													onChange: () => setScheduleForm((prev) => ({
														...prev,
														contact_mode: "custom"
													})),
													className: "text-slate-900 focus:ring-slate-900"
												}), /* @__PURE__ */ jsx("span", {
													className: "font-medium text-slate-700",
													children: "Chemist / Other"
												})]
											})]
										})]
									}), scheduleForm.contact_mode === "doctor" ? /* @__PURE__ */ jsx("div", { children: /* @__PURE__ */ jsxs("select", {
										value: scheduleForm.doctor_id,
										onChange: (e) => setScheduleForm((prev) => ({
											...prev,
											doctor_id: e.target.value
										})),
										className: "w-full bg-white border border-slate-200/80 rounded-xl px-3 py-2 text-xs focus:ring-1 focus:ring-slate-900 focus:border-slate-900 cursor-pointer",
										required: true,
										children: [/* @__PURE__ */ jsxs("option", {
											value: "",
											children: [
												"-- Select Doctor from Your List (",
												doctors.length,
												" available) --"
											]
										}), doctors.map((d) => /* @__PURE__ */ jsxs("option", {
											value: d.id,
											children: [
												d.name,
												" (",
												d.specialization,
												") - ",
												d.clinic_hospital_name
											]
										}, d.id))]
									}) }) : /* @__PURE__ */ jsxs("div", {
										className: "grid grid-cols-1 sm:grid-cols-2 gap-2",
										children: [/* @__PURE__ */ jsx("input", {
											type: "text",
											placeholder: "e.g. Apollo Pharmacy / City Medico",
											value: scheduleForm.custom_contact_name,
											onChange: (e) => setScheduleForm((prev) => ({
												...prev,
												custom_contact_name: e.target.value
											})),
											className: "w-full bg-white border border-slate-200/80 rounded-xl px-3 py-2 text-xs focus:ring-1 focus:ring-slate-900 focus:border-slate-900",
											required: true
										}), /* @__PURE__ */ jsxs("select", {
											value: scheduleForm.contact_type,
											onChange: (e) => setScheduleForm((prev) => ({
												...prev,
												contact_type: e.target.value
											})),
											className: "w-full bg-white border border-slate-200/80 rounded-xl px-3 py-2 text-xs focus:ring-1 focus:ring-slate-900 focus:border-slate-900 cursor-pointer",
											children: [
												/* @__PURE__ */ jsx("option", {
													value: "chemist",
													children: "Chemist / Pharmacy"
												}),
												/* @__PURE__ */ jsx("option", {
													value: "hospital",
													children: "Hospital Desk / Purchase"
												}),
												/* @__PURE__ */ jsx("option", {
													value: "stockist",
													children: "Stockist / Distributor"
												})
											]
										})]
									})]
								}),
								/* @__PURE__ */ jsxs("div", {
									className: "grid grid-cols-1 sm:grid-cols-2 gap-3",
									children: [/* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("label", {
										className: "block font-medium text-slate-700 mb-1",
										children: "Date"
									}), /* @__PURE__ */ jsx("input", {
										type: "date",
										value: scheduleForm.scheduled_date,
										onChange: (e) => setScheduleForm((prev) => ({
											...prev,
											scheduled_date: e.target.value
										})),
										className: "w-full bg-slate-50 border border-slate-200/80 rounded-xl px-3 py-2 text-xs focus:ring-1 focus:ring-slate-900 focus:border-slate-900",
										required: true
									})] }), /* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("label", {
										className: "block font-medium text-slate-700 mb-1",
										children: "Preferred Time Slot"
									}), /* @__PURE__ */ jsx("input", {
										type: "text",
										placeholder: "e.g. Morning OPD (10:30 AM)",
										value: scheduleForm.scheduled_time,
										onChange: (e) => setScheduleForm((prev) => ({
											...prev,
											scheduled_time: e.target.value
										})),
										className: "w-full bg-slate-50 border border-slate-200/80 rounded-xl px-3 py-2 text-xs focus:ring-1 focus:ring-slate-900 focus:border-slate-900"
									})] })]
								}),
								/* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("label", {
									className: "block font-medium text-slate-700 mb-1",
									children: "Priority Level"
								}), /* @__PURE__ */ jsx("div", {
									className: "flex items-center gap-2",
									children: [
										"high",
										"normal",
										"low"
									].map((p) => /* @__PURE__ */ jsx("button", {
										type: "button",
										onClick: () => setScheduleForm((prev) => ({
											...prev,
											priority: p
										})),
										className: `flex-1 py-1.5 rounded-xl border font-semibold capitalize text-xs transition-colors cursor-pointer ${scheduleForm.priority === p ? p === "high" ? "bg-rose-50 border-rose-300 text-rose-700" : "bg-slate-900 border-slate-900 text-white" : "border-slate-200/80 text-slate-600 hover:bg-slate-50"}`,
										children: p
									}, p))
								})] }),
								/* @__PURE__ */ jsxs("div", { children: [
									/* @__PURE__ */ jsxs("div", {
										className: "flex items-center justify-between mb-1",
										children: [/* @__PURE__ */ jsxs("label", {
											className: "font-medium text-slate-700",
											children: ["Detailing Purpose / Agenda ", /* @__PURE__ */ jsx("span", {
												className: "text-rose-500",
												children: "*"
											})]
										}), /* @__PURE__ */ jsx("span", {
											className: "text-[11px] text-slate-400",
											children: "Click product to tag:"
										})]
									}),
									products.length > 0 && /* @__PURE__ */ jsx("div", {
										className: "flex flex-wrap gap-1 mb-2 max-h-16 overflow-y-auto p-1 bg-slate-50 rounded-xl border border-slate-100",
										children: products.slice(0, 8).map((prod) => /* @__PURE__ */ jsxs("button", {
											type: "button",
											onClick: () => addProductToPurpose(prod.brand_name),
											className: "text-[10px] font-medium bg-white hover:bg-slate-100 text-slate-700 border border-slate-200/80 px-2 py-0.5 rounded-md cursor-pointer transition-colors",
											children: ["+ ", prod.brand_name]
										}, prod.id))
									}),
									/* @__PURE__ */ jsx("textarea", {
										rows: "2",
										placeholder: "e.g. Detailing AmoxiClav 625 Duo; follow up on prescription feedback...",
										value: scheduleForm.purpose,
										onChange: (e) => setScheduleForm((prev) => ({
											...prev,
											purpose: e.target.value
										})),
										className: "w-full bg-slate-50 border border-slate-200/80 rounded-xl p-2.5 text-xs focus:ring-1 focus:ring-slate-900 focus:border-slate-900",
										required: true
									})
								] }),
								/* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("label", {
									className: "block font-medium text-slate-700 mb-1",
									children: "Internal Notes (Optional)"
								}), /* @__PURE__ */ jsx("input", {
									type: "text",
									placeholder: "e.g. Doctor prefers evening OPD after 6 PM",
									value: scheduleForm.notes,
									onChange: (e) => setScheduleForm((prev) => ({
										...prev,
										notes: e.target.value
									})),
									className: "w-full bg-slate-50 border border-slate-200/80 rounded-xl px-3 py-2 text-xs focus:ring-1 focus:ring-slate-900 focus:border-slate-900"
								})] }),
								/* @__PURE__ */ jsxs("div", {
									className: "flex items-center justify-end gap-2 pt-3 border-t border-slate-100",
									children: [/* @__PURE__ */ jsx("button", {
										type: "button",
										onClick: () => setIsScheduleModalOpen(false),
										className: "px-4 py-2 rounded-xl text-slate-600 hover:bg-slate-100 text-xs font-medium cursor-pointer",
										children: "Cancel"
									}), /* @__PURE__ */ jsx("button", {
										type: "submit",
										disabled: isPlannerSubmitting,
										className: "px-5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-medium transition-colors cursor-pointer disabled:opacity-50",
										children: isPlannerSubmitting ? "Scheduling..." : "Save to Schedule"
									})]
								})
							]
						})]
					})
				}),
				outcomeModalSchedule && /* @__PURE__ */ jsx("div", {
					className: "fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs",
					children: /* @__PURE__ */ jsxs("div", {
						className: "bg-white rounded-3xl max-w-md w-full p-6 shadow-xl border border-slate-100",
						children: [/* @__PURE__ */ jsxs("div", {
							className: "flex items-center justify-between pb-3 border-b border-slate-100",
							children: [/* @__PURE__ */ jsxs("div", {
								className: "flex items-center gap-2.5",
								children: [/* @__PURE__ */ jsx("div", {
									className: `w-8 h-8 rounded-xl flex items-center justify-center ${outcomeModalSchedule.action_type === "call" ? "bg-sky-50 text-sky-700" : "bg-slate-100 text-slate-700"}`,
									children: outcomeModalSchedule.action_type === "call" ? /* @__PURE__ */ jsx(PhoneCall, { className: "w-4 h-4" }) : /* @__PURE__ */ jsx(CheckCircle2, { className: "w-4 h-4" })
								}), /* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsxs("h3", {
									className: "text-sm font-semibold text-slate-800",
									children: ["Mark as ", outcomeModalSchedule.action_type === "call" ? "Called" : "Visited"]
								}), /* @__PURE__ */ jsx("p", {
									className: "text-[11px] text-slate-400",
									children: outcomeModalSchedule.doctor?.name || outcomeModalSchedule.custom_contact_name
								})] })]
							}), /* @__PURE__ */ jsx("button", {
								type: "button",
								onClick: () => setOutcomeModalSchedule(null),
								className: "p-1.5 rounded-xl text-slate-400 hover:text-slate-600 hover:bg-slate-100 cursor-pointer",
								children: /* @__PURE__ */ jsx(X, { className: "w-4 h-4" })
							})]
						}), /* @__PURE__ */ jsxs("div", {
							className: "space-y-4 pt-3 text-xs",
							children: [
								/* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("label", {
									className: "block font-medium text-slate-700 mb-1.5",
									children: "Quick Outcome Presets (Tap to select)"
								}), /* @__PURE__ */ jsx("div", {
									className: "space-y-1.5",
									children: (outcomeModalSchedule.action_type === "call" ? CALL_OUTCOMES : VISIT_OUTCOMES).map((outcome, idx) => /* @__PURE__ */ jsx("button", {
										type: "button",
										onClick: () => setOutcomeNote(outcome),
										className: `w-full text-left p-2 rounded-xl text-xs transition-colors border cursor-pointer ${outcomeNote === outcome ? "bg-emerald-50 border-emerald-300 text-emerald-800 font-semibold" : "bg-slate-50 border-slate-200/80 text-slate-700 hover:bg-slate-100"}`,
										children: outcome
									}, idx))
								})] }),
								/* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("label", {
									className: "block font-medium text-slate-700 mb-1",
									children: "Outcome Feedback / Discussion Notes"
								}), /* @__PURE__ */ jsx("textarea", {
									rows: "3",
									placeholder: "Add notes on doctor's feedback, prescription commitments, or follow-up needs...",
									value: outcomeNote,
									onChange: (e) => setOutcomeNote(e.target.value),
									className: "w-full bg-slate-50 border border-slate-200/80 rounded-xl p-2.5 text-xs focus:ring-1 focus:ring-slate-900 focus:border-slate-900"
								})] }),
								/* @__PURE__ */ jsxs("div", {
									className: "flex items-center justify-end gap-2 pt-2 border-t border-slate-100",
									children: [/* @__PURE__ */ jsx("button", {
										type: "button",
										onClick: () => setOutcomeModalSchedule(null),
										className: "px-3.5 py-1.5 rounded-xl text-slate-600 hover:bg-slate-100 text-xs font-medium cursor-pointer",
										children: "Cancel"
									}), /* @__PURE__ */ jsxs("button", {
										type: "button",
										disabled: isPlannerSubmitting,
										onClick: () => handlePlannerStatusUpdate(outcomeModalSchedule.id, "completed", outcomeNote),
										className: "inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-medium transition-colors cursor-pointer disabled:opacity-50",
										children: [/* @__PURE__ */ jsx(Check, { className: "w-4 h-4 stroke-[2]" }), /* @__PURE__ */ jsx("span", { children: "Confirm Completion" })]
									})]
								})
							]
						})]
					})
				}),
				rescheduleItem && /* @__PURE__ */ jsx("div", {
					className: "fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs",
					children: /* @__PURE__ */ jsxs("div", {
						className: "bg-white rounded-3xl max-w-sm w-full p-6 shadow-xl border border-slate-100",
						children: [/* @__PURE__ */ jsxs("div", {
							className: "flex items-center justify-between pb-3 border-b border-slate-100",
							children: [/* @__PURE__ */ jsx("h3", {
								className: "text-sm font-semibold text-slate-800",
								children: "Reschedule Activity"
							}), /* @__PURE__ */ jsx("button", {
								type: "button",
								onClick: () => setRescheduleItem(null),
								className: "p-1.5 rounded-xl text-slate-400 hover:text-slate-600 hover:bg-slate-100 cursor-pointer",
								children: /* @__PURE__ */ jsx(X, { className: "w-4 h-4" })
							})]
						}), /* @__PURE__ */ jsxs("form", {
							onSubmit: handleRescheduleSubmit,
							className: "space-y-3 pt-3 text-xs",
							children: [
								/* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("label", {
									className: "block font-medium text-slate-700 mb-1",
									children: "New Date"
								}), /* @__PURE__ */ jsx("input", {
									type: "date",
									value: rescheduleDate,
									onChange: (e) => setRescheduleDate(e.target.value),
									className: "w-full bg-slate-50 border border-slate-200/80 rounded-xl px-3 py-2 text-xs focus:ring-1 focus:ring-slate-900 focus:border-slate-900",
									required: true
								})] }),
								/* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("label", {
									className: "block font-medium text-slate-700 mb-1",
									children: "New Time Slot"
								}), /* @__PURE__ */ jsx("input", {
									type: "text",
									value: rescheduleTime,
									onChange: (e) => setRescheduleTime(e.target.value),
									placeholder: "e.g. Tomorrow Evening OPD (06:00 PM)",
									className: "w-full bg-slate-50 border border-slate-200/80 rounded-xl px-3 py-2 text-xs focus:ring-1 focus:ring-slate-900 focus:border-slate-900"
								})] }),
								/* @__PURE__ */ jsxs("div", {
									className: "flex items-center justify-end gap-2 pt-2 border-t border-slate-100",
									children: [/* @__PURE__ */ jsx("button", {
										type: "button",
										onClick: () => setRescheduleItem(null),
										className: "px-3.5 py-1.5 rounded-xl text-slate-600 hover:bg-slate-100 text-xs font-medium cursor-pointer",
										children: "Cancel"
									}), /* @__PURE__ */ jsx("button", {
										type: "submit",
										disabled: isPlannerSubmitting,
										className: "px-4 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-medium transition-colors cursor-pointer disabled:opacity-50",
										children: "Save Reschedule"
									})]
								})
							]
						})]
					})
				}),
				detailModalOpen && /* @__PURE__ */ jsx("div", {
					className: "fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs overflow-y-auto",
					children: /* @__PURE__ */ jsxs("div", {
						className: "bg-white rounded-3xl max-w-xl w-full p-6 shadow-xl border border-slate-100 my-8",
						children: [/* @__PURE__ */ jsxs("div", {
							className: "flex items-center justify-between pb-3 border-b border-slate-100",
							children: [/* @__PURE__ */ jsxs("div", {
								className: "flex items-center gap-2.5",
								children: [/* @__PURE__ */ jsx("div", {
									className: "w-8 h-8 rounded-xl bg-slate-100 text-slate-700 flex items-center justify-center font-semibold",
									children: /* @__PURE__ */ jsx(Pill, { className: "w-4 h-4" })
								}), /* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("h3", {
									className: "text-sm font-semibold text-slate-800",
									children: editingVisit ? "Edit Detailing Record" : "Record In-Clinic Detailing & Samples"
								}), /* @__PURE__ */ jsx("p", {
									className: "text-xs text-slate-400 font-normal",
									children: "Log formulations pitched, samples given, and physician response."
								})] })]
							}), /* @__PURE__ */ jsx("button", {
								type: "button",
								onClick: () => setDetailModalOpen(false),
								className: "p-1.5 rounded-xl text-slate-400 hover:text-slate-600 hover:bg-slate-100 cursor-pointer",
								children: /* @__PURE__ */ jsx(X, { className: "w-4 h-4" })
							})]
						}), /* @__PURE__ */ jsxs("form", {
							onSubmit: handleSubmitDetailing,
							className: "space-y-4 pt-3 text-xs",
							children: [
								/* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsxs("label", {
									className: "block font-medium text-slate-700 mb-1",
									children: ["Doctor Detailed ", /* @__PURE__ */ jsx("span", {
										className: "text-rose-500",
										children: "*"
									})]
								}), /* @__PURE__ */ jsxs("select", {
									value: detailForm.doctor_id,
									onChange: (e) => setDetailForm({
										...detailForm,
										doctor_id: e.target.value
									}),
									className: "w-full bg-slate-50 border border-slate-200/80 rounded-xl px-3 py-2 text-xs focus:ring-1 focus:ring-slate-900 focus:border-slate-900 cursor-pointer",
									required: true,
									children: [/* @__PURE__ */ jsx("option", {
										value: "",
										children: "-- Select Doctor --"
									}), doctors.map((d) => /* @__PURE__ */ jsxs("option", {
										value: d.id,
										children: [
											d.name,
											" (",
											d.specialization,
											") - ",
											d.clinic_hospital_name
										]
									}, d.id))]
								})] }),
								/* @__PURE__ */ jsxs("div", {
									className: "grid grid-cols-1 sm:grid-cols-3 gap-2.5",
									children: [
										/* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("label", {
											className: "block font-medium text-slate-700 mb-1",
											children: "Visit Date"
										}), /* @__PURE__ */ jsx("input", {
											type: "date",
											value: detailForm.visit_date,
											onChange: (e) => setDetailForm({
												...detailForm,
												visit_date: e.target.value
											}),
											className: "w-full bg-slate-50 border border-slate-200/80 rounded-xl px-3 py-2 text-xs focus:ring-1 focus:ring-slate-900 focus:border-slate-900",
											required: true
										})] }),
										/* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("label", {
											className: "block font-medium text-slate-700 mb-1",
											children: "Time"
										}), /* @__PURE__ */ jsx("input", {
											type: "text",
											value: detailForm.visit_time,
											onChange: (e) => setDetailForm({
												...detailForm,
												visit_time: e.target.value
											}),
											className: "w-full bg-slate-50 border border-slate-200/80 rounded-xl px-3 py-2 text-xs focus:ring-1 focus:ring-slate-900 focus:border-slate-900"
										})] }),
										/* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("label", {
											className: "block font-medium text-slate-700 mb-1",
											children: "Call Type"
										}), /* @__PURE__ */ jsx("select", {
											value: detailForm.call_type,
											onChange: (e) => setDetailForm({
												...detailForm,
												call_type: e.target.value
											}),
											className: "w-full bg-slate-50 border border-slate-200/80 rounded-xl px-2.5 py-2 text-xs focus:ring-1 focus:ring-slate-900 focus:border-slate-900 cursor-pointer",
											children: CALL_TYPES.map((ct) => /* @__PURE__ */ jsx("option", {
												value: ct.value,
												children: ct.label
											}, ct.value))
										})] })
									]
								}),
								/* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("label", {
									className: "block font-medium text-slate-700 mb-1.5",
									children: "Molecules Detailed (Tap to toggle)"
								}), /* @__PURE__ */ jsx("div", {
									className: "flex flex-wrap gap-1.5 max-h-24 overflow-y-auto p-2 bg-slate-50 rounded-xl border border-slate-200/80",
									children: products.map((prod) => {
										const selected = (detailForm.products_detailed || []).includes(prod.brand_name);
										return /* @__PURE__ */ jsxs("button", {
											type: "button",
											onClick: () => toggleDetailProduct(prod.brand_name),
											className: `px-2.5 py-1 rounded-lg text-xs font-medium border transition-colors cursor-pointer ${selected ? "bg-slate-900 text-white border-slate-900" : "bg-white text-slate-700 border-slate-200/80 hover:bg-slate-100"}`,
											children: [selected ? "✓ " : "+ ", prod.brand_name]
										}, prod.id);
									})
								})] }),
								/* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsxs("label", {
									className: "block font-medium text-slate-700 mb-1",
									children: ["Doctor Prescribing Response & Commitment ", /* @__PURE__ */ jsx("span", {
										className: "text-rose-500",
										children: "*"
									})]
								}), /* @__PURE__ */ jsx("select", {
									value: detailForm.doctor_feedback,
									onChange: (e) => setDetailForm({
										...detailForm,
										doctor_feedback: e.target.value
									}),
									className: "w-full bg-slate-50 border border-slate-200/80 rounded-xl px-3 py-2 text-xs focus:ring-1 focus:ring-slate-900 focus:border-slate-900 cursor-pointer",
									required: true,
									children: FEEDBACK_OPTIONS.map((f) => /* @__PURE__ */ jsx("option", {
										value: f.value,
										children: f.label
									}, f.value))
								})] }),
								/* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("label", {
									className: "block font-medium text-slate-700 mb-1",
									children: "Physician Samples & Promo Inputs Given"
								}), /* @__PURE__ */ jsx("input", {
									type: "text",
									placeholder: "e.g. 10 strips AmoxiClav 625 Duo + 1 Pen Stand + 5 Trial Kits",
									value: detailForm.samples_given,
									onChange: (e) => setDetailForm({
										...detailForm,
										samples_given: e.target.value
									}),
									className: "w-full bg-slate-50 border border-slate-200/80 rounded-xl px-3 py-2 text-xs focus:ring-1 focus:ring-slate-900 focus:border-slate-900"
								})] }),
								/* @__PURE__ */ jsxs("div", {
									className: "grid grid-cols-1 sm:grid-cols-2 gap-2.5",
									children: [/* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("label", {
										className: "block font-medium text-slate-700 mb-1",
										children: "Next Follow-up Date"
									}), /* @__PURE__ */ jsx("input", {
										type: "date",
										value: detailForm.next_visit_date,
										onChange: (e) => setDetailForm({
											...detailForm,
											next_visit_date: e.target.value
										}),
										className: "w-full bg-slate-50 border border-slate-200/80 rounded-xl px-3 py-2 text-xs focus:ring-1 focus:ring-slate-900 focus:border-slate-900"
									})] }), /* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("label", {
										className: "block font-medium text-slate-700 mb-1",
										children: "Remarks / Objections"
									}), /* @__PURE__ */ jsx("input", {
										type: "text",
										placeholder: "e.g. Doctor requested efficacy reprint",
										value: detailForm.remarks,
										onChange: (e) => setDetailForm({
											...detailForm,
											remarks: e.target.value
										}),
										className: "w-full bg-slate-50 border border-slate-200/80 rounded-xl px-3 py-2 text-xs focus:ring-1 focus:ring-slate-900 focus:border-slate-900"
									})] })]
								}),
								/* @__PURE__ */ jsxs("div", {
									className: "flex items-center justify-end gap-2 pt-3 border-t border-slate-100",
									children: [/* @__PURE__ */ jsx("button", {
										type: "button",
										onClick: () => setDetailModalOpen(false),
										className: "px-4 py-2 rounded-xl text-slate-600 hover:bg-slate-100 text-xs font-medium cursor-pointer",
										children: "Cancel"
									}), /* @__PURE__ */ jsx("button", {
										type: "submit",
										disabled: isDcrSubmitting,
										className: "px-5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-medium transition-colors cursor-pointer disabled:opacity-50",
										children: isDcrSubmitting ? "Saving..." : "Save Detailing Record"
									})]
								})
							]
						})]
					})
				})
			]
		})
	});
}
//#endregion
//#region resources/js/Pages/mrconnect/AllReports.jsx
var AllReports_exports = /* @__PURE__ */ __exportAll({ default: () => AllReports });
function AllReports({ reports = [] }) {
	const { props } = usePage();
	const isAdmin = props.auth?.user?.role === "admin";
	const Layout = isAdmin ? AdminLayout : MRLayout;
	const handleExport = (reportTitle) => {
		toast.success(`Exporting ${reportTitle} to CSV format...`);
	};
	return /* @__PURE__ */ jsx(Layout, {
		title: isAdmin ? "All Operational Reports" : "My Operational Reports",
		children: /* @__PURE__ */ jsxs("div", {
			className: "space-y-6 pb-12 font-sans max-w-[1400px] mx-auto",
			children: [/* @__PURE__ */ jsx("div", {
				className: "flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-200/80",
				children: /* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("h2", {
					className: "text-xl sm:text-2xl font-semibold tracking-tight text-slate-800",
					children: isAdmin ? "Operations & Analytics Reports" : "My Operations & Performance Reports"
				}), /* @__PURE__ */ jsx("p", {
					className: "text-xs text-slate-500 font-normal mt-0.5",
					children: isAdmin ? "Comprehensive Daily Call Reports (DCR), territory coverage metrics, and POB booking summaries across representatives." : "Your individual Daily Call Reports (DCR), doctor coverage adherence, and personal order booking summaries."
				})] })
			}), /* @__PURE__ */ jsx("div", {
				className: "grid grid-cols-1 md:grid-cols-2 gap-5",
				children: reports.map((rep) => /* @__PURE__ */ jsxs("div", {
					className: "bg-white rounded-2xl border border-slate-200/80 p-5 space-y-3 flex flex-col justify-between",
					children: [/* @__PURE__ */ jsxs("div", {
						className: "space-y-2",
						children: [
							/* @__PURE__ */ jsxs("div", {
								className: "flex items-center justify-between",
								children: [/* @__PURE__ */ jsx("span", {
									className: "text-[11px] font-semibold text-violet-700 bg-violet-50 px-2.5 py-0.5 rounded-md border border-violet-100",
									children: rep.category
								}), /* @__PURE__ */ jsxs("span", {
									className: "text-xs font-semibold text-slate-700",
									children: [
										rep.records,
										" ",
										isAdmin ? "Records Indexed" : "My Records"
									]
								})]
							}),
							/* @__PURE__ */ jsx("h3", {
								className: "text-base font-semibold text-slate-800",
								children: rep.title
							}),
							/* @__PURE__ */ jsx("p", {
								className: "text-xs text-slate-500 leading-relaxed",
								children: rep.desc
							})
						]
					}), /* @__PURE__ */ jsxs("div", {
						className: "pt-3 border-t border-slate-100 flex items-center justify-between",
						children: [/* @__PURE__ */ jsx("span", {
							className: "text-[11px] text-slate-400 font-medium",
							children: "CSV & PDF Ready"
						}), /* @__PURE__ */ jsxs("button", {
							type: "button",
							onClick: () => handleExport(rep.title),
							className: "inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-medium text-xs transition-colors cursor-pointer",
							children: [/* @__PURE__ */ jsx(Download, { className: "w-3.5 h-3.5" }), /* @__PURE__ */ jsx("span", { children: "Export Report" })]
						})]
					})]
				}, rep.id))
			})]
		})
	});
}
//#endregion
//#region resources/js/Pages/mrconnect/EmployeeAssign.jsx
var EmployeeAssign_exports = /* @__PURE__ */ __exportAll({ default: () => EmployeeAssign });
function EmployeeAssign({ representatives = [], isIndividualMR = false }) {
	const { props } = usePage();
	const isAdmin = props.auth?.user?.role === "admin";
	const Layout = isAdmin ? AdminLayout : MRLayout;
	const [search, setSearch] = useState("");
	const filtered = representatives.filter((r) => r.name.toLowerCase().includes(search.toLowerCase()) || r.reg_code.toLowerCase().includes(search.toLowerCase()) || r.headquarters.toLowerCase().includes(search.toLowerCase()));
	const selfRep = representatives[0] || {};
	return /* @__PURE__ */ jsx(Layout, {
		title: isAdmin ? "Employee Territory Assignment" : "My Territory Assignment",
		children: /* @__PURE__ */ jsxs("div", {
			className: "space-y-6 pb-12 font-sans max-w-[1400px] mx-auto",
			children: [/* @__PURE__ */ jsxs("div", {
				className: "flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-200/80",
				children: [/* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("h2", {
					className: "text-xl sm:text-2xl font-semibold tracking-tight text-slate-800",
					children: isAdmin ? "Employee Territory Assignment" : "My Territory Assignment"
				}), /* @__PURE__ */ jsx("p", {
					className: "text-xs text-slate-500 font-normal mt-0.5",
					children: isAdmin ? "Assign medical representatives to territories, operational headquarters, and reporting managers." : "Your official operational headquarters, territory jurisdiction, and reporting hierarchy."
				})] }), isAdmin && /* @__PURE__ */ jsxs("div", {
					className: "relative",
					children: [/* @__PURE__ */ jsx(Search, { className: "w-3.5 h-3.5 text-slate-400 absolute left-3 top-3 pointer-events-none" }), /* @__PURE__ */ jsx("input", {
						type: "text",
						placeholder: "Search representative or HQ...",
						value: search,
						onChange: (e) => setSearch(e.target.value),
						className: "pl-8 pr-3 py-1.5 bg-white border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-violet-500/20 focus:border-violet-500"
					})]
				})]
			}), !isAdmin ? /* @__PURE__ */ jsxs("div", {
				className: "space-y-6",
				children: [/* @__PURE__ */ jsxs("div", {
					className: "bg-white rounded-2xl border border-slate-200/80 p-6 space-y-6",
					children: [/* @__PURE__ */ jsxs("div", {
						className: "flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100",
						children: [/* @__PURE__ */ jsxs("div", {
							className: "flex items-center gap-4",
							children: [/* @__PURE__ */ jsx("div", {
								className: "w-14 h-14 rounded-2xl bg-slate-900 text-white font-bold text-xl flex items-center justify-center shrink-0",
								children: selfRep.name?.charAt(0) || "M"
							}), /* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("h3", {
								className: "text-lg font-semibold text-slate-800",
								children: selfRep.name
							}), /* @__PURE__ */ jsxs("div", {
								className: "flex items-center gap-2 mt-1",
								children: [
									/* @__PURE__ */ jsx("span", {
										className: "font-mono text-xs font-semibold bg-violet-50 text-violet-700 border border-violet-100 px-2 py-0.5 rounded-md",
										children: selfRep.reg_code
									}),
									/* @__PURE__ */ jsx("span", {
										className: "text-xs text-slate-500 font-medium",
										children: selfRep.role_title
									}),
									/* @__PURE__ */ jsx("span", {
										className: "inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200/60",
										children: "Active Assignment"
									})
								]
							})] })]
						}), /* @__PURE__ */ jsxs(Link, {
							href: "/mr/doctors",
							className: "inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-violet-600 hover:bg-violet-700 text-white font-medium text-xs transition-colors",
							children: [/* @__PURE__ */ jsx(Users, { className: "w-3.5 h-3.5" }), /* @__PURE__ */ jsx("span", { children: "View My Assigned Doctors" })]
						})]
					}), /* @__PURE__ */ jsxs("div", {
						className: "grid grid-cols-1 sm:grid-cols-3 gap-6",
						children: [
							/* @__PURE__ */ jsxs("div", {
								className: "p-4 rounded-xl bg-slate-50/60 border border-slate-100 space-y-1",
								children: [/* @__PURE__ */ jsx("span", {
									className: "text-xs font-medium text-slate-400",
									children: "Operational HQ"
								}), /* @__PURE__ */ jsxs("p", {
									className: "text-sm font-semibold text-slate-800 flex items-center gap-1.5 pt-1",
									children: [/* @__PURE__ */ jsx(Building2, { className: "w-4 h-4 text-violet-600" }), /* @__PURE__ */ jsx("span", { children: selfRep.headquarters })]
								})]
							}),
							/* @__PURE__ */ jsxs("div", {
								className: "p-4 rounded-xl bg-slate-50/60 border border-slate-100 space-y-1",
								children: [/* @__PURE__ */ jsx("span", {
									className: "text-xs font-medium text-slate-400",
									children: "Territory Jurisdiction"
								}), /* @__PURE__ */ jsxs("p", {
									className: "text-sm font-semibold text-slate-800 flex items-center gap-1.5 pt-1",
									children: [/* @__PURE__ */ jsx(MapPin, { className: "w-4 h-4 text-indigo-600" }), /* @__PURE__ */ jsx("span", { children: selfRep.territory })]
								})]
							}),
							/* @__PURE__ */ jsxs("div", {
								className: "p-4 rounded-xl bg-slate-50/60 border border-slate-100 space-y-1",
								children: [/* @__PURE__ */ jsx("span", {
									className: "text-xs font-medium text-slate-400",
									children: "Reporting Line Manager"
								}), /* @__PURE__ */ jsxs("p", {
									className: "text-sm font-semibold text-slate-800 flex items-center gap-1.5 pt-1",
									children: [/* @__PURE__ */ jsx(UserCheck, { className: "w-4 h-4 text-emerald-600" }), /* @__PURE__ */ jsx("span", { children: selfRep.reporting_manager })]
								})]
							})
						]
					})]
				}), /* @__PURE__ */ jsxs("div", {
					className: "grid grid-cols-1 sm:grid-cols-3 gap-4",
					children: [
						/* @__PURE__ */ jsxs("div", {
							className: "bg-white rounded-2xl border border-slate-200/80 p-5",
							children: [
								/* @__PURE__ */ jsx("span", {
									className: "text-xs font-medium text-slate-500",
									children: "Allocated Doctors"
								}),
								/* @__PURE__ */ jsx("p", {
									className: "text-2xl font-semibold text-slate-800 mt-2",
									children: selfRep.assigned_doctors_count
								}),
								/* @__PURE__ */ jsx("p", {
									className: "text-[11px] text-slate-400 mt-1",
									children: "Exclusive practitioner coverage"
								})
							]
						}),
						/* @__PURE__ */ jsxs("div", {
							className: "bg-white rounded-2xl border border-slate-200/80 p-5",
							children: [
								/* @__PURE__ */ jsx("span", {
									className: "text-xs font-medium text-slate-500",
									children: "Appointment Date"
								}),
								/* @__PURE__ */ jsx("p", {
									className: "text-2xl font-semibold text-violet-600 mt-2",
									children: selfRep.joining_date
								}),
								/* @__PURE__ */ jsx("p", {
									className: "text-[11px] text-slate-400 mt-1",
									children: "Territory assignment inception"
								})
							]
						}),
						/* @__PURE__ */ jsxs("div", {
							className: "bg-white rounded-2xl border border-slate-200/80 p-5",
							children: [
								/* @__PURE__ */ jsx("span", {
									className: "text-xs font-medium text-slate-500",
									children: "Route Compliance"
								}),
								/* @__PURE__ */ jsx("p", {
									className: "text-2xl font-semibold text-emerald-600 mt-2",
									children: "100%"
								}),
								/* @__PURE__ */ jsx("p", {
									className: "text-[11px] text-emerald-600 font-medium mt-1",
									children: "Active verified field representative"
								})
							]
						})
					]
				})]
			}) : /* @__PURE__ */ jsxs("div", {
				className: "space-y-6",
				children: [/* @__PURE__ */ jsxs("div", {
					className: "grid grid-cols-1 sm:grid-cols-4 gap-4",
					children: [
						/* @__PURE__ */ jsxs("div", {
							className: "bg-white rounded-2xl border border-slate-200/80 p-5",
							children: [
								/* @__PURE__ */ jsx("span", {
									className: "text-xs font-medium text-slate-500",
									children: "Field Representatives"
								}),
								/* @__PURE__ */ jsx("p", {
									className: "text-2xl font-semibold text-slate-800 mt-2",
									children: representatives.length
								}),
								/* @__PURE__ */ jsx("p", {
									className: "text-[11px] text-slate-400 mt-1",
									children: "Active field personnel"
								})
							]
						}),
						/* @__PURE__ */ jsxs("div", {
							className: "bg-white rounded-2xl border border-slate-200/80 p-5",
							children: [
								/* @__PURE__ */ jsx("span", {
									className: "text-xs font-medium text-slate-500",
									children: "Total Headquarters"
								}),
								/* @__PURE__ */ jsx("p", {
									className: "text-2xl font-semibold text-violet-600 mt-2",
									children: "26 HQs"
								}),
								/* @__PURE__ */ jsx("p", {
									className: "text-[11px] text-slate-400 mt-1",
									children: "Assigned hubs"
								})
							]
						}),
						/* @__PURE__ */ jsxs("div", {
							className: "bg-white rounded-2xl border border-slate-200/80 p-5",
							children: [
								/* @__PURE__ */ jsx("span", {
									className: "text-xs font-medium text-slate-500",
									children: "Area Business Managers"
								}),
								/* @__PURE__ */ jsx("p", {
									className: "text-2xl font-semibold text-emerald-600 mt-2",
									children: "13 ABMs"
								}),
								/* @__PURE__ */ jsx("p", {
									className: "text-[11px] text-slate-400 mt-1",
									children: "First-line supervisors"
								})
							]
						}),
						/* @__PURE__ */ jsxs("div", {
							className: "bg-white rounded-2xl border border-slate-200/80 p-5",
							children: [
								/* @__PURE__ */ jsx("span", {
									className: "text-xs font-medium text-slate-500",
									children: "Territory Coverage"
								}),
								/* @__PURE__ */ jsx("p", {
									className: "text-2xl font-semibold text-slate-800 mt-2",
									children: "100%"
								}),
								/* @__PURE__ */ jsx("p", {
									className: "text-[11px] text-emerald-600 font-medium mt-1",
									children: "Fully allocated"
								})
							]
						})
					]
				}), /* @__PURE__ */ jsxs("div", {
					className: "bg-white rounded-2xl border border-slate-200/80 overflow-hidden",
					children: [/* @__PURE__ */ jsxs("div", {
						className: "px-5 py-3.5 border-b border-slate-100 flex items-center justify-between",
						children: [/* @__PURE__ */ jsx("h3", {
							className: "text-sm font-semibold text-slate-800",
							children: "Assigned Representatives & Territories"
						}), /* @__PURE__ */ jsxs("span", {
							className: "text-xs text-slate-400",
							children: [filtered.length, " representatives"]
						})]
					}), /* @__PURE__ */ jsx("div", {
						className: "overflow-x-auto",
						children: /* @__PURE__ */ jsxs("table", {
							className: "w-full text-left text-xs border-collapse",
							children: [/* @__PURE__ */ jsx("thead", { children: /* @__PURE__ */ jsxs("tr", {
								className: "border-b border-slate-100 text-[11px] font-semibold text-slate-400 bg-slate-50/50",
								children: [
									/* @__PURE__ */ jsx("th", {
										className: "py-2.5 px-4",
										children: "Employee"
									}),
									/* @__PURE__ */ jsx("th", {
										className: "py-2.5 px-4",
										children: "Role / Reg"
									}),
									/* @__PURE__ */ jsx("th", {
										className: "py-2.5 px-4",
										children: "Headquarters"
									}),
									/* @__PURE__ */ jsx("th", {
										className: "py-2.5 px-4",
										children: "Territory"
									}),
									/* @__PURE__ */ jsx("th", {
										className: "py-2.5 px-4 text-center",
										children: "Assigned Doctors"
									}),
									/* @__PURE__ */ jsx("th", {
										className: "py-2.5 px-4",
										children: "Reporting Manager"
									}),
									/* @__PURE__ */ jsx("th", {
										className: "py-2.5 px-4 text-center",
										children: "Status"
									})
								]
							}) }), /* @__PURE__ */ jsx("tbody", {
								className: "divide-y divide-slate-100",
								children: filtered.map((rep) => /* @__PURE__ */ jsxs("tr", {
									className: "hover:bg-slate-50/70 transition-colors",
									children: [
										/* @__PURE__ */ jsx("td", {
											className: "py-3 px-4 font-medium text-slate-800",
											children: rep.name
										}),
										/* @__PURE__ */ jsxs("td", {
											className: "py-3 px-4 text-slate-600",
											children: [/* @__PURE__ */ jsx("span", {
												className: "font-mono text-[11px] font-semibold bg-slate-100 px-1.5 py-0.5 rounded mr-1.5 text-slate-700",
												children: rep.reg_code
											}), rep.role_title]
										}),
										/* @__PURE__ */ jsx("td", {
											className: "py-3 px-4 text-slate-700 font-medium",
											children: rep.headquarters
										}),
										/* @__PURE__ */ jsx("td", {
											className: "py-3 px-4 text-slate-500",
											children: rep.territory
										}),
										/* @__PURE__ */ jsxs("td", {
											className: "py-3 px-4 text-center font-medium text-violet-700",
											children: [rep.assigned_doctors_count, " doctors"]
										}),
										/* @__PURE__ */ jsx("td", {
											className: "py-3 px-4 text-slate-600",
											children: rep.reporting_manager
										}),
										/* @__PURE__ */ jsx("td", {
											className: "py-3 px-4 text-center",
											children: /* @__PURE__ */ jsx("span", {
												className: "inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md text-[11px] font-medium bg-emerald-50 text-emerald-700 border border-emerald-200/60",
												children: "Active"
											})
										})
									]
								}, rep.id))
							})]
						})
					})]
				})]
			})]
		})
	});
}
//#endregion
//#region resources/js/Pages/mrconnect/FieldExpenses.jsx
var FieldExpenses_exports = /* @__PURE__ */ __exportAll({ default: () => FieldExpenses });
function FieldExpenses({ expenses = [], summary = {} }) {
	const { props } = usePage();
	const isAdmin = props.auth?.user?.role === "admin";
	const Layout = isAdmin ? AdminLayout : MRLayout;
	const [showModal, setShowModal] = useState(false);
	const [formData, setFormData] = useState({
		date: (/* @__PURE__ */ new Date()).toISOString().split("T")[0],
		expense_type: "daily_allowance",
		amount: "",
		distance_km: "",
		city: "",
		notes: ""
	});
	const handleSubmit = (e) => {
		e.preventDefault();
		router.post("/mrconnect/field-expenses", formData, {
			onSuccess: () => {
				toast.success("Field expense claim submitted successfully.");
				setShowModal(false);
				setFormData({
					date: (/* @__PURE__ */ new Date()).toISOString().split("T")[0],
					expense_type: "daily_allowance",
					amount: "",
					distance_km: "",
					city: "",
					notes: ""
				});
			},
			onError: () => toast.error("Failed to submit expense.")
		});
	};
	const handleApprove = (id) => {
		router.post(`/mrconnect/field-expenses/${id}/approve`, {}, { onSuccess: () => toast.success("Expense claim approved!") });
	};
	return /* @__PURE__ */ jsxs(Layout, {
		title: isAdmin ? "Field Expenses" : "My Field Expenses",
		children: [/* @__PURE__ */ jsxs("div", {
			className: "space-y-6 pb-12 font-sans max-w-[1400px] mx-auto",
			children: [
				/* @__PURE__ */ jsxs("div", {
					className: "flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-200/80",
					children: [/* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("h2", {
						className: "text-xl sm:text-2xl font-semibold tracking-tight text-slate-800",
						children: isAdmin ? "Field Expenses & Daily Allowance (DA/TA)" : "My Field Expenses (DA/TA)"
					}), /* @__PURE__ */ jsx("p", {
						className: "text-xs text-slate-500 font-normal mt-0.5",
						children: isAdmin ? "Review, audit, and approve field representative travel claims and allowances." : "Submit daily travel claims, mileage allowances, lodging, and meal expenses."
					})] }), /* @__PURE__ */ jsxs("button", {
						type: "button",
						onClick: () => setShowModal(true),
						className: "inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-medium text-xs transition-colors cursor-pointer",
						children: [/* @__PURE__ */ jsx(Plus, { className: "w-3.5 h-3.5" }), /* @__PURE__ */ jsx("span", { children: "Claim Expense" })]
					})]
				}),
				/* @__PURE__ */ jsxs("div", {
					className: "grid grid-cols-1 sm:grid-cols-3 gap-4",
					children: [
						/* @__PURE__ */ jsxs("div", {
							className: "bg-white rounded-2xl border border-slate-200/80 p-5",
							children: [
								/* @__PURE__ */ jsx("span", {
									className: "text-xs font-medium text-slate-500",
									children: "Total Claimed"
								}),
								/* @__PURE__ */ jsxs("p", {
									className: "text-2xl font-semibold text-slate-800 mt-2",
									children: ["₹", Number(summary.total_claimed || 0).toLocaleString()]
								}),
								/* @__PURE__ */ jsx("p", {
									className: "text-[11px] text-slate-400 mt-1",
									children: "All submitted claims"
								})
							]
						}),
						/* @__PURE__ */ jsxs("div", {
							className: "bg-white rounded-2xl border border-slate-200/80 p-5",
							children: [
								/* @__PURE__ */ jsx("span", {
									className: "text-xs font-medium text-slate-500",
									children: "Approved & Disbursed"
								}),
								/* @__PURE__ */ jsxs("p", {
									className: "text-2xl font-semibold text-emerald-600 mt-2",
									children: ["₹", Number(summary.approved_amount || 0).toLocaleString()]
								}),
								/* @__PURE__ */ jsx("p", {
									className: "text-[11px] text-emerald-600 font-medium mt-1",
									children: "Processed by finance"
								})
							]
						}),
						/* @__PURE__ */ jsxs("div", {
							className: "bg-white rounded-2xl border border-slate-200/80 p-5",
							children: [
								/* @__PURE__ */ jsx("span", {
									className: "text-xs font-medium text-slate-500",
									children: "Pending Review"
								}),
								/* @__PURE__ */ jsxs("p", {
									className: "text-2xl font-semibold text-amber-600 mt-2",
									children: ["₹", Number(summary.pending_amount || 0).toLocaleString()]
								}),
								/* @__PURE__ */ jsx("p", {
									className: "text-[11px] text-amber-600 font-medium mt-1",
									children: "Awaiting management"
								})
							]
						})
					]
				}),
				/* @__PURE__ */ jsxs("div", {
					className: "bg-white rounded-2xl border border-slate-200/80 overflow-hidden",
					children: [/* @__PURE__ */ jsxs("div", {
						className: "px-5 py-3.5 border-b border-slate-100 flex items-center justify-between",
						children: [/* @__PURE__ */ jsx("h3", {
							className: "text-sm font-semibold text-slate-800",
							children: "Expense Claim Records"
						}), /* @__PURE__ */ jsxs("span", {
							className: "text-xs text-slate-400",
							children: [expenses.length, " claims"]
						})]
					}), /* @__PURE__ */ jsx("div", {
						className: "overflow-x-auto",
						children: /* @__PURE__ */ jsxs("table", {
							className: "w-full text-left text-xs border-collapse",
							children: [/* @__PURE__ */ jsx("thead", { children: /* @__PURE__ */ jsxs("tr", {
								className: "border-b border-slate-100 text-[11px] font-semibold text-slate-400 bg-slate-50/50",
								children: [
									/* @__PURE__ */ jsx("th", {
										className: "py-2.5 px-4",
										children: "Date"
									}),
									isAdmin && /* @__PURE__ */ jsx("th", {
										className: "py-2.5 px-4",
										children: "Representative"
									}),
									/* @__PURE__ */ jsx("th", {
										className: "py-2.5 px-4",
										children: "Type"
									}),
									/* @__PURE__ */ jsx("th", {
										className: "py-2.5 px-4",
										children: "Location / Distance"
									}),
									/* @__PURE__ */ jsx("th", {
										className: "py-2.5 px-4 text-right",
										children: "Amount"
									}),
									/* @__PURE__ */ jsx("th", {
										className: "py-2.5 px-4 text-center",
										children: "Status"
									}),
									isAdmin && /* @__PURE__ */ jsx("th", {
										className: "py-2.5 px-4 text-right",
										children: "Action"
									})
								]
							}) }), /* @__PURE__ */ jsx("tbody", {
								className: "divide-y divide-slate-100",
								children: expenses.length > 0 ? expenses.map((exp) => /* @__PURE__ */ jsxs("tr", {
									className: "hover:bg-slate-50/70 transition-colors",
									children: [
										/* @__PURE__ */ jsx("td", {
											className: "py-3 px-4 font-medium text-slate-800 whitespace-nowrap",
											children: exp.date
										}),
										isAdmin && /* @__PURE__ */ jsx("td", {
											className: "py-3 px-4 font-medium text-slate-700",
											children: exp.user_name || "Representative"
										}),
										/* @__PURE__ */ jsx("td", {
											className: "py-3 px-4 capitalize text-slate-600",
											children: exp.expense_type.replace("_", " ")
										}),
										/* @__PURE__ */ jsxs("td", {
											className: "py-3 px-4 text-slate-500",
											children: [
												exp.city,
												" ",
												exp.distance_km ? `(${exp.distance_km} km)` : ""
											]
										}),
										/* @__PURE__ */ jsxs("td", {
											className: "py-3 px-4 text-right font-semibold text-slate-800",
											children: ["₹", Number(exp.amount).toFixed(2)]
										}),
										/* @__PURE__ */ jsx("td", {
											className: "py-3 px-4 text-center",
											children: /* @__PURE__ */ jsxs("span", {
												className: `inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md text-[11px] font-medium ${exp.status === "approved" ? "bg-emerald-50 text-emerald-700 border border-emerald-200/60" : exp.status === "rejected" ? "bg-rose-50 text-rose-700 border border-rose-200/60" : "bg-amber-50 text-amber-700 border border-amber-200/60"}`,
												children: [
													exp.status === "approved" && /* @__PURE__ */ jsx(CheckCircle2, { className: "w-3 h-3" }),
													exp.status === "pending" && /* @__PURE__ */ jsx(Clock, { className: "w-3 h-3" }),
													exp.status.charAt(0).toUpperCase() + exp.status.slice(1)
												]
											})
										}),
										isAdmin && /* @__PURE__ */ jsx("td", {
											className: "py-3 px-4 text-right",
											children: exp.status === "pending" && /* @__PURE__ */ jsx("button", {
												type: "button",
												onClick: () => handleApprove(exp.id),
												className: "px-2.5 py-1 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-medium text-[11px] transition-colors cursor-pointer",
												children: "Approve"
											})
										})
									]
								}, exp.id)) : /* @__PURE__ */ jsx("tr", { children: /* @__PURE__ */ jsx("td", {
									colSpan: isAdmin ? 7 : 5,
									className: "py-8 text-center text-slate-400",
									children: "No expense claims submitted yet."
								}) })
							})]
						})
					})]
				})
			]
		}), showModal && /* @__PURE__ */ jsx("div", {
			className: "fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-xs p-4",
			children: /* @__PURE__ */ jsxs("div", {
				className: "bg-white rounded-2xl border border-slate-200 max-w-md w-full p-6 space-y-4 shadow-xl",
				children: [/* @__PURE__ */ jsxs("div", {
					className: "flex items-center justify-between pb-3 border-b border-slate-100",
					children: [/* @__PURE__ */ jsx("h3", {
						className: "text-base font-semibold text-slate-800",
						children: "Submit Expense Claim"
					}), /* @__PURE__ */ jsx("button", {
						type: "button",
						onClick: () => setShowModal(false),
						className: "text-slate-400 hover:text-slate-600 cursor-pointer",
						children: /* @__PURE__ */ jsx(X, { className: "w-5 h-5" })
					})]
				}), /* @__PURE__ */ jsxs("form", {
					onSubmit: handleSubmit,
					className: "space-y-3.5 text-xs",
					children: [
						/* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("label", {
							className: "block text-xs font-medium text-slate-700 mb-1",
							children: "Date"
						}), /* @__PURE__ */ jsx("input", {
							type: "date",
							required: true,
							value: formData.date,
							onChange: (e) => setFormData({
								...formData,
								date: e.target.value
							}),
							className: "w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-violet-500/20 focus:border-violet-500"
						})] }),
						/* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("label", {
							className: "block text-xs font-medium text-slate-700 mb-1",
							children: "Expense Type"
						}), /* @__PURE__ */ jsxs("select", {
							value: formData.expense_type,
							onChange: (e) => setFormData({
								...formData,
								expense_type: e.target.value
							}),
							className: "w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-violet-500/20 focus:border-violet-500 cursor-pointer",
							children: [
								/* @__PURE__ */ jsx("option", {
									value: "daily_allowance",
									children: "Daily Allowance (DA)"
								}),
								/* @__PURE__ */ jsx("option", {
									value: "travel_fuel",
									children: "Travel & Fuel Allowance (TA)"
								}),
								/* @__PURE__ */ jsx("option", {
									value: "lodging",
									children: "Hotel & Lodging"
								}),
								/* @__PURE__ */ jsx("option", {
									value: "meal",
									children: "Client / Doctor CME Hospitality"
								}),
								/* @__PURE__ */ jsx("option", {
									value: "miscellaneous",
									children: "Stationery & Courier"
								})
							]
						})] }),
						/* @__PURE__ */ jsxs("div", {
							className: "grid grid-cols-2 gap-3",
							children: [/* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("label", {
								className: "block text-xs font-medium text-slate-700 mb-1",
								children: "Claim Amount (₹)"
							}), /* @__PURE__ */ jsx("input", {
								type: "number",
								required: true,
								min: "1",
								placeholder: "450",
								value: formData.amount,
								onChange: (e) => setFormData({
									...formData,
									amount: e.target.value
								}),
								className: "w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-violet-500/20 focus:border-violet-500"
							})] }), /* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("label", {
								className: "block text-xs font-medium text-slate-700 mb-1",
								children: "Distance (km)"
							}), /* @__PURE__ */ jsx("input", {
								type: "number",
								placeholder: "42",
								value: formData.distance_km,
								onChange: (e) => setFormData({
									...formData,
									distance_km: e.target.value
								}),
								className: "w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-violet-500/20 focus:border-violet-500"
							})] })]
						}),
						/* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("label", {
							className: "block text-xs font-medium text-slate-700 mb-1",
							children: "Territory / City"
						}), /* @__PURE__ */ jsx("input", {
							type: "text",
							placeholder: "Nagercoil / Kanyakumari",
							value: formData.city,
							onChange: (e) => setFormData({
								...formData,
								city: e.target.value
							}),
							className: "w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-violet-500/20 focus:border-violet-500"
						})] }),
						/* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("label", {
							className: "block text-xs font-medium text-slate-700 mb-1",
							children: "Remarks"
						}), /* @__PURE__ */ jsx("textarea", {
							rows: "2",
							placeholder: "Notes regarding fieldwork coverage...",
							value: formData.notes,
							onChange: (e) => setFormData({
								...formData,
								notes: e.target.value
							}),
							className: "w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-violet-500/20 focus:border-violet-500"
						})] }),
						/* @__PURE__ */ jsxs("div", {
							className: "flex items-center justify-end gap-2.5 pt-2 border-t border-slate-100",
							children: [/* @__PURE__ */ jsx("button", {
								type: "button",
								onClick: () => setShowModal(false),
								className: "px-4 py-2 rounded-xl text-xs font-medium text-slate-600 hover:bg-slate-100 transition-colors cursor-pointer",
								children: "Cancel"
							}), /* @__PURE__ */ jsx("button", {
								type: "submit",
								className: "px-5 py-2 rounded-xl text-xs font-medium text-white bg-slate-900 hover:bg-slate-800 transition-colors cursor-pointer",
								children: "Submit Claim"
							})]
						})
					]
				})]
			})
		})]
	});
}
//#endregion
//#region resources/js/Pages/mrconnect/HRSection.jsx
var HRSection_exports = /* @__PURE__ */ __exportAll({ default: () => HRSection });
function HRSection({ employees = [] }) {
	const { props } = usePage();
	const isAdmin = props.auth?.user?.role === "admin";
	return /* @__PURE__ */ jsx(isAdmin ? AdminLayout : MRLayout, {
		title: isAdmin ? "HR Directory & Records" : "My HR & Employment Profile",
		children: /* @__PURE__ */ jsxs("div", {
			className: "space-y-6 pb-12 font-sans max-w-[1400px] mx-auto",
			children: [/* @__PURE__ */ jsx("div", {
				className: "flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-200/80",
				children: /* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("h2", {
					className: "text-xl sm:text-2xl font-semibold tracking-tight text-slate-800",
					children: isAdmin ? "Human Resources Directory" : "My HR & Employment Profile"
				}), /* @__PURE__ */ jsx("p", {
					className: "text-xs text-slate-500 font-normal mt-0.5",
					children: isAdmin ? "Official company personnel records, departments, and communication coordinates." : "Your official company employment record, registration code, and department designation."
				})] })
			}), /* @__PURE__ */ jsxs("div", {
				className: "bg-white rounded-2xl border border-slate-200/80 overflow-hidden",
				children: [/* @__PURE__ */ jsxs("div", {
					className: "px-5 py-3.5 border-b border-slate-100 flex items-center justify-between",
					children: [/* @__PURE__ */ jsx("h3", {
						className: "text-sm font-semibold text-slate-800",
						children: isAdmin ? "Employee Master" : "Personal Employment Details"
					}), /* @__PURE__ */ jsx("span", {
						className: "text-xs text-slate-400",
						children: isAdmin ? `${employees.length} employees` : "Verified Official Record"
					})]
				}), /* @__PURE__ */ jsx("div", {
					className: "overflow-x-auto",
					children: /* @__PURE__ */ jsxs("table", {
						className: "w-full text-left text-xs border-collapse",
						children: [/* @__PURE__ */ jsx("thead", { children: /* @__PURE__ */ jsxs("tr", {
							className: "border-b border-slate-100 text-[11px] font-semibold text-slate-400 bg-slate-50/50",
							children: [
								/* @__PURE__ */ jsx("th", {
									className: "py-2.5 px-4",
									children: "Emp ID"
								}),
								/* @__PURE__ */ jsx("th", {
									className: "py-2.5 px-4",
									children: "Employee Name"
								}),
								/* @__PURE__ */ jsx("th", {
									className: "py-2.5 px-4",
									children: "Email Address"
								}),
								/* @__PURE__ */ jsx("th", {
									className: "py-2.5 px-4",
									children: "Department"
								}),
								/* @__PURE__ */ jsx("th", {
									className: "py-2.5 px-4",
									children: "Role"
								}),
								/* @__PURE__ */ jsx("th", {
									className: "py-2.5 px-4 text-center",
									children: "Status"
								})
							]
						}) }), /* @__PURE__ */ jsx("tbody", {
							className: "divide-y divide-slate-100",
							children: employees.map((emp) => /* @__PURE__ */ jsxs("tr", {
								className: "hover:bg-slate-50/70 transition-colors",
								children: [
									/* @__PURE__ */ jsx("td", {
										className: "py-3 px-4 font-mono font-semibold text-slate-800",
										children: emp.emp_id
									}),
									/* @__PURE__ */ jsx("td", {
										className: "py-3 px-4 font-medium text-slate-800",
										children: emp.name
									}),
									/* @__PURE__ */ jsx("td", {
										className: "py-3 px-4 text-slate-500",
										children: emp.email
									}),
									/* @__PURE__ */ jsx("td", {
										className: "py-3 px-4 text-slate-600 font-medium",
										children: emp.department
									}),
									/* @__PURE__ */ jsx("td", {
										className: "py-3 px-4 text-slate-700",
										children: /* @__PURE__ */ jsx("span", {
											className: "bg-slate-100 text-slate-700 font-medium px-2 py-0.5 rounded text-[11px]",
											children: emp.role
										})
									}),
									/* @__PURE__ */ jsx("td", {
										className: "py-3 px-4 text-center",
										children: /* @__PURE__ */ jsx("span", {
											className: "inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md text-[11px] font-medium bg-emerald-50 text-emerald-700 border border-emerald-200/60",
											children: "Active"
										})
									})
								]
							}, emp.id))
						})]
					})
				})]
			})]
		})
	});
}
//#endregion
//#region resources/js/Pages/mrconnect/Leave.jsx
var Leave_exports = /* @__PURE__ */ __exportAll({ default: () => Leave });
function Leave({ leaves = [], balances = {} }) {
	const { props } = usePage();
	const isAdmin = props.auth?.user?.role === "admin";
	const Layout = isAdmin ? AdminLayout : MRLayout;
	const [showModal, setShowModal] = useState(false);
	const [formData, setFormData] = useState({
		leave_type: "casual",
		from_date: (/* @__PURE__ */ new Date()).toISOString().split("T")[0],
		to_date: (/* @__PURE__ */ new Date()).toISOString().split("T")[0],
		reason: ""
	});
	const handleSubmit = (e) => {
		e.preventDefault();
		router.post("/mrconnect/leave", formData, {
			onSuccess: () => {
				toast.success("Leave application submitted.");
				setShowModal(false);
				setFormData({
					leave_type: "casual",
					from_date: (/* @__PURE__ */ new Date()).toISOString().split("T")[0],
					to_date: (/* @__PURE__ */ new Date()).toISOString().split("T")[0],
					reason: ""
				});
			},
			onError: () => toast.error("Failed to submit leave.")
		});
	};
	const handleApprove = (id) => {
		router.post(`/mrconnect/leave/${id}/approve`, {}, { onSuccess: () => toast.success("Leave approved!") });
	};
	return /* @__PURE__ */ jsxs(Layout, {
		title: isAdmin ? "Leave Management" : "My Leaves",
		children: [/* @__PURE__ */ jsxs("div", {
			className: "space-y-6 pb-12 font-sans max-w-[1400px] mx-auto",
			children: [
				/* @__PURE__ */ jsxs("div", {
					className: "flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-200/80",
					children: [/* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("h2", {
						className: "text-xl sm:text-2xl font-semibold tracking-tight text-slate-800",
						children: isAdmin ? "Leave Applications & Approvals" : "My Leaves & Absence"
					}), /* @__PURE__ */ jsx("p", {
						className: "text-xs text-slate-500 font-normal mt-0.5",
						children: isAdmin ? "Review, audit, and approve field staff absence requests and quota balances." : "Apply for casual, sick, and earned leaves with instant manager workflow."
					})] }), /* @__PURE__ */ jsxs("button", {
						type: "button",
						onClick: () => setShowModal(true),
						className: "inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-medium text-xs transition-colors cursor-pointer",
						children: [/* @__PURE__ */ jsx(Plus, { className: "w-3.5 h-3.5" }), /* @__PURE__ */ jsx("span", { children: "Apply Leave" })]
					})]
				}),
				/* @__PURE__ */ jsxs("div", {
					className: "grid grid-cols-1 sm:grid-cols-4 gap-4",
					children: [
						/* @__PURE__ */ jsxs("div", {
							className: "bg-white rounded-2xl border border-slate-200/80 p-5",
							children: [
								/* @__PURE__ */ jsx("span", {
									className: "text-xs font-medium text-slate-500",
									children: "Casual Leave (CL)"
								}),
								/* @__PURE__ */ jsxs("p", {
									className: "text-2xl font-semibold text-slate-800 mt-2",
									children: [balances.casual_leave || 8, " Days"]
								}),
								/* @__PURE__ */ jsx("p", {
									className: "text-[11px] text-slate-400 mt-1",
									children: "Available balance"
								})
							]
						}),
						/* @__PURE__ */ jsxs("div", {
							className: "bg-white rounded-2xl border border-slate-200/80 p-5",
							children: [
								/* @__PURE__ */ jsx("span", {
									className: "text-xs font-medium text-slate-500",
									children: "Sick Leave (SL)"
								}),
								/* @__PURE__ */ jsxs("p", {
									className: "text-2xl font-semibold text-slate-800 mt-2",
									children: [balances.sick_leave || 6, " Days"]
								}),
								/* @__PURE__ */ jsx("p", {
									className: "text-[11px] text-slate-400 mt-1",
									children: "Medical quota"
								})
							]
						}),
						/* @__PURE__ */ jsxs("div", {
							className: "bg-white rounded-2xl border border-slate-200/80 p-5",
							children: [
								/* @__PURE__ */ jsx("span", {
									className: "text-xs font-medium text-slate-500",
									children: "Earned Leave (EL)"
								}),
								/* @__PURE__ */ jsxs("p", {
									className: "text-2xl font-semibold text-slate-800 mt-2",
									children: [balances.earned_leave || 12, " Days"]
								}),
								/* @__PURE__ */ jsx("p", {
									className: "text-[11px] text-slate-400 mt-1",
									children: "Accrued privilege"
								})
							]
						}),
						/* @__PURE__ */ jsxs("div", {
							className: "bg-white rounded-2xl border border-slate-200/80 p-5",
							children: [
								/* @__PURE__ */ jsx("span", {
									className: "text-xs font-medium text-slate-500",
									children: "Pending Requests"
								}),
								/* @__PURE__ */ jsx("p", {
									className: "text-2xl font-semibold text-amber-600 mt-2",
									children: balances.pending_requests || 0
								}),
								/* @__PURE__ */ jsx("p", {
									className: "text-[11px] text-amber-600 font-medium mt-1",
									children: "Awaiting approval"
								})
							]
						})
					]
				}),
				/* @__PURE__ */ jsxs("div", {
					className: "bg-white rounded-2xl border border-slate-200/80 overflow-hidden",
					children: [/* @__PURE__ */ jsxs("div", {
						className: "px-5 py-3.5 border-b border-slate-100 flex items-center justify-between",
						children: [/* @__PURE__ */ jsx("h3", {
							className: "text-sm font-semibold text-slate-800",
							children: isAdmin ? "All Staff Leave Applications" : "My Leave History"
						}), /* @__PURE__ */ jsxs("span", {
							className: "text-xs text-slate-400",
							children: [leaves.length, " records"]
						})]
					}), /* @__PURE__ */ jsx("div", {
						className: "overflow-x-auto",
						children: /* @__PURE__ */ jsxs("table", {
							className: "w-full text-left text-xs border-collapse",
							children: [/* @__PURE__ */ jsx("thead", { children: /* @__PURE__ */ jsxs("tr", {
								className: "border-b border-slate-100 text-[11px] font-semibold text-slate-400 bg-slate-50/50",
								children: [
									isAdmin && /* @__PURE__ */ jsx("th", {
										className: "py-2.5 px-4",
										children: "Employee"
									}),
									/* @__PURE__ */ jsx("th", {
										className: "py-2.5 px-4",
										children: "Leave Type"
									}),
									/* @__PURE__ */ jsx("th", {
										className: "py-2.5 px-4",
										children: "From Date"
									}),
									/* @__PURE__ */ jsx("th", {
										className: "py-2.5 px-4",
										children: "To Date"
									}),
									/* @__PURE__ */ jsx("th", {
										className: "py-2.5 px-4 text-center",
										children: "Days"
									}),
									/* @__PURE__ */ jsx("th", {
										className: "py-2.5 px-4",
										children: "Reason"
									}),
									/* @__PURE__ */ jsx("th", {
										className: "py-2.5 px-4 text-center",
										children: "Status"
									}),
									isAdmin && /* @__PURE__ */ jsx("th", {
										className: "py-2.5 px-4 text-right",
										children: "Action"
									})
								]
							}) }), /* @__PURE__ */ jsx("tbody", {
								className: "divide-y divide-slate-100",
								children: leaves.length > 0 ? leaves.map((lv) => /* @__PURE__ */ jsxs("tr", {
									className: "hover:bg-slate-50/70 transition-colors",
									children: [
										isAdmin && /* @__PURE__ */ jsx("td", {
											className: "py-3 px-4 font-medium text-slate-800",
											children: lv.user_name || "Representative"
										}),
										/* @__PURE__ */ jsxs("td", {
											className: "py-3 px-4 capitalize text-slate-700",
											children: [lv.leave_type, " Leave"]
										}),
										/* @__PURE__ */ jsx("td", {
											className: "py-3 px-4 text-slate-600",
											children: lv.from_date
										}),
										/* @__PURE__ */ jsx("td", {
											className: "py-3 px-4 text-slate-600",
											children: lv.to_date
										}),
										/* @__PURE__ */ jsx("td", {
											className: "py-3 px-4 text-center font-medium text-slate-800",
											children: lv.days_count
										}),
										/* @__PURE__ */ jsx("td", {
											className: "py-3 px-4 text-slate-500 max-w-xs truncate",
											children: lv.reason
										}),
										/* @__PURE__ */ jsx("td", {
											className: "py-3 px-4 text-center",
											children: /* @__PURE__ */ jsx("span", {
												className: `inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md text-[11px] font-medium ${lv.status === "approved" ? "bg-emerald-50 text-emerald-700 border border-emerald-200/60" : lv.status === "rejected" ? "bg-rose-50 text-rose-700 border border-rose-200/60" : "bg-amber-50 text-amber-700 border border-amber-200/60"}`,
												children: lv.status.charAt(0).toUpperCase() + lv.status.slice(1)
											})
										}),
										isAdmin && /* @__PURE__ */ jsx("td", {
											className: "py-3 px-4 text-right",
											children: lv.status === "pending" && /* @__PURE__ */ jsx("button", {
												type: "button",
												onClick: () => handleApprove(lv.id),
												className: "px-2.5 py-1 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-medium text-[11px] transition-colors cursor-pointer",
												children: "Approve"
											})
										})
									]
								}, lv.id)) : /* @__PURE__ */ jsx("tr", { children: /* @__PURE__ */ jsx("td", {
									colSpan: isAdmin ? 8 : 6,
									className: "py-8 text-center text-slate-400",
									children: "No leave records recorded yet."
								}) })
							})]
						})
					})]
				})
			]
		}), showModal && /* @__PURE__ */ jsx("div", {
			className: "fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-xs p-4",
			children: /* @__PURE__ */ jsxs("div", {
				className: "bg-white rounded-2xl border border-slate-200 max-w-md w-full p-6 space-y-4 shadow-xl",
				children: [/* @__PURE__ */ jsxs("div", {
					className: "flex items-center justify-between pb-3 border-b border-slate-100",
					children: [/* @__PURE__ */ jsx("h3", {
						className: "text-base font-semibold text-slate-800",
						children: "Apply for Leave"
					}), /* @__PURE__ */ jsx("button", {
						type: "button",
						onClick: () => setShowModal(false),
						className: "text-slate-400 hover:text-slate-600 cursor-pointer",
						children: /* @__PURE__ */ jsx(X, { className: "w-5 h-5" })
					})]
				}), /* @__PURE__ */ jsxs("form", {
					onSubmit: handleSubmit,
					className: "space-y-3.5 text-xs",
					children: [
						/* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("label", {
							className: "block text-xs font-medium text-slate-700 mb-1",
							children: "Leave Category"
						}), /* @__PURE__ */ jsxs("select", {
							value: formData.leave_type,
							onChange: (e) => setFormData({
								...formData,
								leave_type: e.target.value
							}),
							className: "w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-violet-500/20 focus:border-violet-500 cursor-pointer",
							children: [
								/* @__PURE__ */ jsx("option", {
									value: "casual",
									children: "Casual Leave (CL)"
								}),
								/* @__PURE__ */ jsx("option", {
									value: "sick",
									children: "Sick Leave (SL)"
								}),
								/* @__PURE__ */ jsx("option", {
									value: "earned",
									children: "Earned Leave (EL)"
								}),
								/* @__PURE__ */ jsx("option", {
									value: "compensatory",
									children: "Compensatory Off"
								})
							]
						})] }),
						/* @__PURE__ */ jsxs("div", {
							className: "grid grid-cols-2 gap-3",
							children: [/* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("label", {
								className: "block text-xs font-medium text-slate-700 mb-1",
								children: "From Date"
							}), /* @__PURE__ */ jsx("input", {
								type: "date",
								required: true,
								value: formData.from_date,
								onChange: (e) => setFormData({
									...formData,
									from_date: e.target.value
								}),
								className: "w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-violet-500/20 focus:border-violet-500"
							})] }), /* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("label", {
								className: "block text-xs font-medium text-slate-700 mb-1",
								children: "To Date"
							}), /* @__PURE__ */ jsx("input", {
								type: "date",
								required: true,
								value: formData.to_date,
								onChange: (e) => setFormData({
									...formData,
									to_date: e.target.value
								}),
								className: "w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-violet-500/20 focus:border-violet-500"
							})] })]
						}),
						/* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("label", {
							className: "block text-xs font-medium text-slate-700 mb-1",
							children: "Reason for Absence"
						}), /* @__PURE__ */ jsx("textarea", {
							rows: "3",
							required: true,
							placeholder: "Please state details regarding your leave...",
							value: formData.reason,
							onChange: (e) => setFormData({
								...formData,
								reason: e.target.value
							}),
							className: "w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-violet-500/20 focus:border-violet-500"
						})] }),
						/* @__PURE__ */ jsxs("div", {
							className: "flex items-center justify-end gap-2.5 pt-2 border-t border-slate-100",
							children: [/* @__PURE__ */ jsx("button", {
								type: "button",
								onClick: () => setShowModal(false),
								className: "px-4 py-2 rounded-xl text-xs font-medium text-slate-600 hover:bg-slate-100 transition-colors cursor-pointer",
								children: "Cancel"
							}), /* @__PURE__ */ jsx("button", {
								type: "submit",
								className: "px-5 py-2 rounded-xl text-xs font-medium text-white bg-slate-900 hover:bg-slate-800 transition-colors cursor-pointer",
								children: "Submit Application"
							})]
						})
					]
				})]
			})
		})]
	});
}
//#endregion
//#region resources/js/Pages/mrconnect/Notice.jsx
var Notice_exports = /* @__PURE__ */ __exportAll({ default: () => Notice });
function Notice({ notices = [] }) {
	const { props } = usePage();
	const Layout = props.auth?.user?.role === "admin" ? AdminLayout : MRLayout;
	return /* @__PURE__ */ jsx(Layout, {
		title: "Notices & Announcements",
		children: /* @__PURE__ */ jsxs("div", {
			className: "space-y-6 pb-12 font-sans max-w-[1400px] mx-auto",
			children: [/* @__PURE__ */ jsx("div", {
				className: "flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-200/80",
				children: /* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("h2", {
					className: "text-xl sm:text-2xl font-semibold tracking-tight text-slate-800",
					children: "Notices & Official Announcements"
				}), /* @__PURE__ */ jsx("p", {
					className: "text-xs text-slate-500 font-normal mt-0.5",
					children: "Broadcast circulars, price updates, medical conference details, and corporate news."
				})] })
			}), /* @__PURE__ */ jsx("div", {
				className: "space-y-4",
				children: notices.map((nt) => /* @__PURE__ */ jsxs("div", {
					className: "bg-white rounded-2xl border border-slate-200/80 p-5 space-y-2.5",
					children: [
						/* @__PURE__ */ jsxs("div", {
							className: "flex flex-col sm:flex-row sm:items-center justify-between gap-2",
							children: [/* @__PURE__ */ jsxs("div", {
								className: "flex items-center gap-2",
								children: [/* @__PURE__ */ jsx("span", {
									className: `px-2.5 py-0.5 rounded-md text-[11px] font-semibold uppercase ${nt.priority === "urgent" ? "bg-rose-50 text-rose-700 border border-rose-200/60" : nt.priority === "high" ? "bg-amber-50 text-amber-700 border border-amber-200/60" : "bg-violet-50 text-violet-700 border border-violet-200/60"}`,
									children: nt.category
								}), /* @__PURE__ */ jsx("h3", {
									className: "text-sm font-semibold text-slate-800",
									children: nt.title
								})]
							}), /* @__PURE__ */ jsx("span", {
								className: "text-[11px] text-slate-400 font-normal",
								children: nt.published_at
							})]
						}),
						/* @__PURE__ */ jsx("p", {
							className: "text-xs text-slate-600 leading-relaxed",
							children: nt.content
						}),
						/* @__PURE__ */ jsxs("div", {
							className: "pt-2 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-400",
							children: [/* @__PURE__ */ jsxs("span", { children: ["Published by: ", /* @__PURE__ */ jsx("strong", {
								className: "text-slate-600 font-medium",
								children: nt.publisher_name || "Ciplon Head Office"
							})] }), /* @__PURE__ */ jsx("span", {
								className: "text-emerald-600 font-medium",
								children: "Active Circular"
							})]
						})
					]
				}, nt.id))
			})]
		})
	});
}
//#endregion
//#region resources/js/Pages/mrconnect/PobOrder.jsx
var PobOrder_exports = /* @__PURE__ */ __exportAll({ default: () => PobOrder });
function PobOrder({ orders = [], doctors = [], summary = {} }) {
	const { props } = usePage();
	const Layout = props.auth?.user?.role === "admin" ? AdminLayout : MRLayout;
	const [showModal, setShowModal] = useState(false);
	const [formData, setFormData] = useState({
		chemist_name: "",
		doctor_id: "",
		total_amount: "",
		notes: ""
	});
	const handleSubmit = (e) => {
		e.preventDefault();
		router.post("/mrconnect/pob-order", formData, {
			onSuccess: () => {
				toast.success("POB order booked successfully!");
				setShowModal(false);
				setFormData({
					chemist_name: "",
					doctor_id: "",
					total_amount: "",
					notes: ""
				});
			},
			onError: () => toast.error("Failed to book POB order.")
		});
	};
	return /* @__PURE__ */ jsxs(Layout, {
		title: "POB Order Booking",
		children: [/* @__PURE__ */ jsxs("div", {
			className: "space-y-6 pb-12 font-sans max-w-[1400px] mx-auto",
			children: [
				/* @__PURE__ */ jsxs("div", {
					className: "flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-200/80",
					children: [/* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("h2", {
						className: "text-xl sm:text-2xl font-semibold tracking-tight text-slate-800",
						children: "Personal Order Booking (POB Orders)"
					}), /* @__PURE__ */ jsx("p", {
						className: "text-xs text-slate-500 font-normal mt-0.5",
						children: "Book retail chemist orders and doctor prescription stock requirements directly from the field."
					})] }), /* @__PURE__ */ jsxs("button", {
						type: "button",
						onClick: () => setShowModal(true),
						className: "inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-medium text-xs transition-colors cursor-pointer",
						children: [/* @__PURE__ */ jsx(Plus, { className: "w-3.5 h-3.5" }), /* @__PURE__ */ jsx("span", { children: "Book New POB Order" })]
					})]
				}),
				/* @__PURE__ */ jsxs("div", {
					className: "grid grid-cols-1 sm:grid-cols-3 gap-4",
					children: [
						/* @__PURE__ */ jsxs("div", {
							className: "bg-white rounded-2xl border border-slate-200/80 p-5",
							children: [
								/* @__PURE__ */ jsx("span", {
									className: "text-xs font-medium text-slate-500",
									children: "Total Orders Booked"
								}),
								/* @__PURE__ */ jsx("p", {
									className: "text-2xl font-semibold text-slate-800 mt-2",
									children: summary.total_orders || orders.length
								}),
								/* @__PURE__ */ jsx("p", {
									className: "text-[11px] text-slate-400 mt-1",
									children: "Field prescription orders"
								})
							]
						}),
						/* @__PURE__ */ jsxs("div", {
							className: "bg-white rounded-2xl border border-slate-200/80 p-5",
							children: [
								/* @__PURE__ */ jsx("span", {
									className: "text-xs font-medium text-slate-500",
									children: "Total Order Booking Value"
								}),
								/* @__PURE__ */ jsxs("p", {
									className: "text-2xl font-semibold text-violet-600 mt-2",
									children: ["₹", Number(summary.total_value || 0).toLocaleString()]
								}),
								/* @__PURE__ */ jsx("p", {
									className: "text-[11px] text-slate-400 mt-1",
									children: "Gross sales generated"
								})
							]
						}),
						/* @__PURE__ */ jsxs("div", {
							className: "bg-white rounded-2xl border border-slate-200/80 p-5",
							children: [
								/* @__PURE__ */ jsx("span", {
									className: "text-xs font-medium text-slate-500",
									children: "Stockist Verified"
								}),
								/* @__PURE__ */ jsx("p", {
									className: "text-2xl font-semibold text-emerald-600 mt-2",
									children: summary.verified_orders || 0
								}),
								/* @__PURE__ */ jsx("p", {
									className: "text-[11px] text-emerald-600 font-medium mt-1",
									children: "Approved for dispatch"
								})
							]
						})
					]
				}),
				/* @__PURE__ */ jsxs("div", {
					className: "bg-white rounded-2xl border border-slate-200/80 overflow-hidden",
					children: [/* @__PURE__ */ jsxs("div", {
						className: "px-5 py-3.5 border-b border-slate-100 flex items-center justify-between",
						children: [/* @__PURE__ */ jsx("h3", {
							className: "text-sm font-semibold text-slate-800",
							children: "Recent POB Bookings"
						}), /* @__PURE__ */ jsxs("span", {
							className: "text-xs text-slate-400",
							children: [orders.length, " orders"]
						})]
					}), /* @__PURE__ */ jsx("div", {
						className: "overflow-x-auto",
						children: /* @__PURE__ */ jsxs("table", {
							className: "w-full text-left text-xs border-collapse",
							children: [/* @__PURE__ */ jsx("thead", { children: /* @__PURE__ */ jsxs("tr", {
								className: "border-b border-slate-100 text-[11px] font-semibold text-slate-400 bg-slate-50/50",
								children: [
									/* @__PURE__ */ jsx("th", {
										className: "py-2.5 px-4",
										children: "Order No"
									}),
									/* @__PURE__ */ jsx("th", {
										className: "py-2.5 px-4",
										children: "Chemist / Pharmacy"
									}),
									/* @__PURE__ */ jsx("th", {
										className: "py-2.5 px-4",
										children: "Representative"
									}),
									/* @__PURE__ */ jsx("th", {
										className: "py-2.5 px-4 text-center",
										children: "Items"
									}),
									/* @__PURE__ */ jsx("th", {
										className: "py-2.5 px-4 text-right",
										children: "Order Amount"
									}),
									/* @__PURE__ */ jsx("th", {
										className: "py-2.5 px-4 text-center",
										children: "Status"
									})
								]
							}) }), /* @__PURE__ */ jsx("tbody", {
								className: "divide-y divide-slate-100",
								children: orders.length > 0 ? orders.map((ord) => /* @__PURE__ */ jsxs("tr", {
									className: "hover:bg-slate-50/70 transition-colors",
									children: [
										/* @__PURE__ */ jsx("td", {
											className: "py-3 px-4 font-mono font-semibold text-slate-800",
											children: ord.order_no
										}),
										/* @__PURE__ */ jsx("td", {
											className: "py-3 px-4 font-medium text-slate-800",
											children: ord.chemist_name
										}),
										/* @__PURE__ */ jsx("td", {
											className: "py-3 px-4 text-slate-600",
											children: ord.representative_name || "Representative"
										}),
										/* @__PURE__ */ jsxs("td", {
											className: "py-3 px-4 text-center text-slate-600",
											children: [ord.items_count, " products"]
										}),
										/* @__PURE__ */ jsxs("td", {
											className: "py-3 px-4 text-right font-semibold text-slate-800",
											children: ["₹", Number(ord.total_amount).toLocaleString()]
										}),
										/* @__PURE__ */ jsx("td", {
											className: "py-3 px-4 text-center",
											children: /* @__PURE__ */ jsx("span", {
												className: `inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md text-[11px] font-medium ${ord.status === "verified" ? "bg-emerald-50 text-emerald-700 border border-emerald-200/60" : "bg-amber-50 text-amber-700 border border-amber-200/60"}`,
												children: ord.status.charAt(0).toUpperCase() + ord.status.slice(1)
											})
										})
									]
								}, ord.id)) : /* @__PURE__ */ jsx("tr", { children: /* @__PURE__ */ jsx("td", {
									colSpan: 6,
									className: "py-8 text-center text-slate-400",
									children: "No POB orders recorded yet."
								}) })
							})]
						})
					})]
				})
			]
		}), showModal && /* @__PURE__ */ jsx("div", {
			className: "fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-xs p-4",
			children: /* @__PURE__ */ jsxs("div", {
				className: "bg-white rounded-2xl border border-slate-200 max-w-md w-full p-6 space-y-4 shadow-xl",
				children: [/* @__PURE__ */ jsxs("div", {
					className: "flex items-center justify-between pb-3 border-b border-slate-100",
					children: [/* @__PURE__ */ jsx("h3", {
						className: "text-base font-semibold text-slate-800",
						children: "Book Personal Order (POB)"
					}), /* @__PURE__ */ jsx("button", {
						type: "button",
						onClick: () => setShowModal(false),
						className: "text-slate-400 hover:text-slate-600 cursor-pointer",
						children: /* @__PURE__ */ jsx(X, { className: "w-5 h-5" })
					})]
				}), /* @__PURE__ */ jsxs("form", {
					onSubmit: handleSubmit,
					className: "space-y-3.5 text-xs",
					children: [
						/* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("label", {
							className: "block text-xs font-medium text-slate-700 mb-1",
							children: "Chemist / Retail Pharmacy"
						}), /* @__PURE__ */ jsx("input", {
							type: "text",
							required: true,
							placeholder: "e.g. Apollo Pharmacy, KP Road",
							value: formData.chemist_name,
							onChange: (e) => setFormData({
								...formData,
								chemist_name: e.target.value
							}),
							className: "w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-violet-500/20 focus:border-violet-500"
						})] }),
						/* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("label", {
							className: "block text-xs font-medium text-slate-700 mb-1",
							children: "Prescribing Doctor (Optional)"
						}), /* @__PURE__ */ jsxs("select", {
							value: formData.doctor_id,
							onChange: (e) => setFormData({
								...formData,
								doctor_id: e.target.value
							}),
							className: "w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-violet-500/20 focus:border-violet-500 cursor-pointer",
							children: [/* @__PURE__ */ jsx("option", {
								value: "",
								children: "Select Doctor..."
							}), doctors.map((doc) => /* @__PURE__ */ jsxs("option", {
								value: doc.id,
								children: [
									doc.name,
									" (",
									doc.clinic_hospital_name,
									")"
								]
							}, doc.id))]
						})] }),
						/* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("label", {
							className: "block text-xs font-medium text-slate-700 mb-1",
							children: "Total Order Value (₹)"
						}), /* @__PURE__ */ jsx("input", {
							type: "number",
							required: true,
							min: "1",
							placeholder: "8500",
							value: formData.total_amount,
							onChange: (e) => setFormData({
								...formData,
								total_amount: e.target.value
							}),
							className: "w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-violet-500/20 focus:border-violet-500"
						})] }),
						/* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("label", {
							className: "block text-xs font-medium text-slate-700 mb-1",
							children: "Notes & Product Breakdown"
						}), /* @__PURE__ */ jsx("textarea", {
							rows: "2",
							placeholder: "e.g. Factocel-IX 10 vials, Globucel-SC 5 vials...",
							value: formData.notes,
							onChange: (e) => setFormData({
								...formData,
								notes: e.target.value
							}),
							className: "w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-violet-500/20 focus:border-violet-500"
						})] }),
						/* @__PURE__ */ jsxs("div", {
							className: "flex items-center justify-end gap-2.5 pt-2 border-t border-slate-100",
							children: [/* @__PURE__ */ jsx("button", {
								type: "button",
								onClick: () => setShowModal(false),
								className: "px-4 py-2 rounded-xl text-xs font-medium text-slate-600 hover:bg-slate-100 transition-colors cursor-pointer",
								children: "Cancel"
							}), /* @__PURE__ */ jsx("button", {
								type: "submit",
								className: "px-5 py-2 rounded-xl text-xs font-medium text-white bg-slate-900 hover:bg-slate-800 transition-colors cursor-pointer",
								children: "Submit Order"
							})]
						})
					]
				})]
			})
		})]
	});
}
//#endregion
//#region resources/js/Pages/mrconnect/PrimarySales.jsx
var PrimarySales_exports = /* @__PURE__ */ __exportAll({ default: () => PrimarySales });
function PrimarySales({ sales = [], summary = {} }) {
	const { props } = usePage();
	const Layout = props.auth?.user?.role === "admin" ? AdminLayout : MRLayout;
	return /* @__PURE__ */ jsx(Layout, {
		title: "Primary Sales",
		children: /* @__PURE__ */ jsxs("div", {
			className: "space-y-6 pb-12 font-sans max-w-[1400px] mx-auto",
			children: [
				/* @__PURE__ */ jsx("div", {
					className: "flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-200/80",
					children: /* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("h2", {
						className: "text-xl sm:text-2xl font-semibold tracking-tight text-slate-800",
						children: "Primary Sales & Stockist Invoicing"
					}), /* @__PURE__ */ jsx("p", {
						className: "text-xs text-slate-500 font-normal mt-0.5",
						children: "Monitor primary billing to authorized pharmaceutical distributors and clearing agents."
					})] })
				}),
				/* @__PURE__ */ jsxs("div", {
					className: "grid grid-cols-1 sm:grid-cols-3 gap-4",
					children: [
						/* @__PURE__ */ jsxs("div", {
							className: "bg-white rounded-2xl border border-slate-200/80 p-5",
							children: [
								/* @__PURE__ */ jsx("span", {
									className: "text-xs font-medium text-slate-500",
									children: "Gross Primary Revenue"
								}),
								/* @__PURE__ */ jsxs("p", {
									className: "text-2xl font-semibold text-slate-800 mt-2",
									children: ["₹", Number(summary.total_primary || 0).toLocaleString()]
								}),
								/* @__PURE__ */ jsx("p", {
									className: "text-[11px] text-slate-400 mt-1",
									children: "Invoiced sales"
								})
							]
						}),
						/* @__PURE__ */ jsxs("div", {
							className: "bg-white rounded-2xl border border-slate-200/80 p-5",
							children: [
								/* @__PURE__ */ jsx("span", {
									className: "text-xs font-medium text-slate-500",
									children: "Realized Collections"
								}),
								/* @__PURE__ */ jsxs("p", {
									className: "text-2xl font-semibold text-emerald-600 mt-2",
									children: ["₹", Number(summary.paid_amount || 0).toLocaleString()]
								}),
								/* @__PURE__ */ jsx("p", {
									className: "text-[11px] text-emerald-600 font-medium mt-1",
									children: "Settled payments"
								})
							]
						}),
						/* @__PURE__ */ jsxs("div", {
							className: "bg-white rounded-2xl border border-slate-200/80 p-5",
							children: [
								/* @__PURE__ */ jsx("span", {
									className: "text-xs font-medium text-slate-500",
									children: "Outstanding Receivable"
								}),
								/* @__PURE__ */ jsxs("p", {
									className: "text-2xl font-semibold text-amber-600 mt-2",
									children: ["₹", Number(summary.pending_amount || 0).toLocaleString()]
								}),
								/* @__PURE__ */ jsx("p", {
									className: "text-[11px] text-amber-600 font-medium mt-1",
									children: "Payment pipeline"
								})
							]
						})
					]
				}),
				/* @__PURE__ */ jsxs("div", {
					className: "bg-white rounded-2xl border border-slate-200/80 overflow-hidden",
					children: [/* @__PURE__ */ jsxs("div", {
						className: "px-5 py-3.5 border-b border-slate-100 flex items-center justify-between",
						children: [/* @__PURE__ */ jsx("h3", {
							className: "text-sm font-semibold text-slate-800",
							children: "Stockist Invoices"
						}), /* @__PURE__ */ jsxs("span", {
							className: "text-xs text-slate-400",
							children: [sales.length, " invoices"]
						})]
					}), /* @__PURE__ */ jsx("div", {
						className: "overflow-x-auto",
						children: /* @__PURE__ */ jsxs("table", {
							className: "w-full text-left text-xs border-collapse",
							children: [/* @__PURE__ */ jsx("thead", { children: /* @__PURE__ */ jsxs("tr", {
								className: "border-b border-slate-100 text-[11px] font-semibold text-slate-400 bg-slate-50/50",
								children: [
									/* @__PURE__ */ jsx("th", {
										className: "py-2.5 px-4",
										children: "Invoice No"
									}),
									/* @__PURE__ */ jsx("th", {
										className: "py-2.5 px-4",
										children: "Stockist / Distributor"
									}),
									/* @__PURE__ */ jsx("th", {
										className: "py-2.5 px-4",
										children: "Billing Date"
									}),
									/* @__PURE__ */ jsx("th", {
										className: "py-2.5 px-4",
										children: "Territory"
									}),
									/* @__PURE__ */ jsx("th", {
										className: "py-2.5 px-4 text-right",
										children: "Invoice Amount"
									}),
									/* @__PURE__ */ jsx("th", {
										className: "py-2.5 px-4 text-center",
										children: "Payment Status"
									})
								]
							}) }), /* @__PURE__ */ jsx("tbody", {
								className: "divide-y divide-slate-100",
								children: sales.map((item) => /* @__PURE__ */ jsxs("tr", {
									className: "hover:bg-slate-50/70 transition-colors",
									children: [
										/* @__PURE__ */ jsx("td", {
											className: "py-3 px-4 font-mono font-semibold text-slate-800",
											children: item.invoice_no
										}),
										/* @__PURE__ */ jsx("td", {
											className: "py-3 px-4 font-medium text-slate-800",
											children: item.stockist_name
										}),
										/* @__PURE__ */ jsx("td", {
											className: "py-3 px-4 text-slate-600",
											children: item.invoice_date
										}),
										/* @__PURE__ */ jsx("td", {
											className: "py-3 px-4 text-slate-500",
											children: item.territory
										}),
										/* @__PURE__ */ jsxs("td", {
											className: "py-3 px-4 text-right font-semibold text-slate-800",
											children: ["₹", Number(item.amount).toLocaleString()]
										}),
										/* @__PURE__ */ jsx("td", {
											className: "py-3 px-4 text-center",
											children: /* @__PURE__ */ jsx("span", {
												className: `inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md text-[11px] font-medium ${item.status === "paid" ? "bg-emerald-50 text-emerald-700 border border-emerald-200/60" : "bg-amber-50 text-amber-700 border border-amber-200/60"}`,
												children: item.status.toUpperCase()
											})
										})
									]
								}, item.id))
							})]
						})
					})]
				})
			]
		})
	});
}
//#endregion
//#region resources/js/Pages/mrconnect/Scheme.jsx
var Scheme_exports = /* @__PURE__ */ __exportAll({ default: () => Scheme });
function Scheme({ schemes = [] }) {
	const { props } = usePage();
	const Layout = props.auth?.user?.role === "admin" ? AdminLayout : MRLayout;
	return /* @__PURE__ */ jsx(Layout, {
		title: "Product Schemes & Commercial Offers",
		children: /* @__PURE__ */ jsxs("div", {
			className: "space-y-6 pb-12 font-sans max-w-[1400px] mx-auto",
			children: [/* @__PURE__ */ jsx("div", {
				className: "flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-200/80",
				children: /* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("h2", {
					className: "text-xl sm:text-2xl font-semibold tracking-tight text-slate-800",
					children: "Commercial Schemes & Promotional Offers"
				}), /* @__PURE__ */ jsx("p", {
					className: "text-xs text-slate-500 font-normal mt-0.5",
					children: "Bonus units, volume rebates, and trade settlement discounts available to chemists."
				})] })
			}), /* @__PURE__ */ jsx("div", {
				className: "grid grid-cols-1 md:grid-cols-2 gap-5",
				children: schemes.map((sc) => /* @__PURE__ */ jsxs("div", {
					className: "bg-white rounded-2xl border border-slate-200/80 p-5 space-y-3",
					children: [
						/* @__PURE__ */ jsxs("div", {
							className: "flex items-center justify-between pb-2 border-b border-slate-100",
							children: [/* @__PURE__ */ jsx("span", {
								className: "text-xs font-semibold text-violet-700 bg-violet-50 px-2.5 py-1 rounded-lg border border-violet-100",
								children: sc.product_name
							}), /* @__PURE__ */ jsx("span", {
								className: "text-xs font-semibold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200/60",
								children: "Active Offer"
							})]
						}),
						/* @__PURE__ */ jsx("h3", {
							className: "text-base font-semibold text-slate-800",
							children: sc.title
						}),
						/* @__PURE__ */ jsx("p", {
							className: "text-xs text-slate-600 font-medium bg-slate-50 p-3 rounded-xl border border-slate-200/60",
							children: sc.offer_detail
						}),
						/* @__PURE__ */ jsxs("div", {
							className: "flex items-center justify-between text-xs text-slate-500 pt-2",
							children: [/* @__PURE__ */ jsxs("span", { children: [
								"Validity: ",
								sc.valid_from,
								" → ",
								sc.valid_until
							] }), /* @__PURE__ */ jsxs("span", {
								className: "font-semibold text-slate-800",
								children: [
									"Equivalent ~",
									sc.discount_percent,
									"% Margin"
								]
							})]
						})
					]
				}, sc.id))
			})]
		})
	});
}
//#endregion
//#region resources/js/Pages/mrconnect/SetTarget.jsx
var SetTarget_exports = /* @__PURE__ */ __exportAll({ default: () => SetTarget });
function SetTarget({ targets = [], summary = {} }) {
	const { props } = usePage();
	const isAdmin = props.auth?.user?.role === "admin";
	return /* @__PURE__ */ jsx(isAdmin ? AdminLayout : MRLayout, {
		title: isAdmin ? "Target vs Sales Performance" : "My Sales Targets",
		children: /* @__PURE__ */ jsxs("div", {
			className: "space-y-6 pb-12 font-sans max-w-[1400px] mx-auto",
			children: [
				/* @__PURE__ */ jsx("div", {
					className: "flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-200/80",
					children: /* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("h2", {
						className: "text-xl sm:text-2xl font-semibold tracking-tight text-slate-800",
						children: isAdmin ? "Target vs Sales Achievement" : "My Sales Targets & Achievement"
					}), /* @__PURE__ */ jsx("p", {
						className: "text-xs text-slate-500 font-normal mt-0.5",
						children: isAdmin ? "Set monthly sales quotas and evaluate field representative quota achievement." : "Your allocated monthly sales targets, verified revenue achievement, and milestone progress."
					})] })
				}),
				/* @__PURE__ */ jsxs("div", {
					className: "grid grid-cols-1 sm:grid-cols-3 gap-4",
					children: [
						/* @__PURE__ */ jsxs("div", {
							className: "bg-white rounded-2xl border border-slate-200/80 p-5",
							children: [
								/* @__PURE__ */ jsx("span", {
									className: "text-xs font-medium text-slate-500",
									children: isAdmin ? "Cumulative Target" : "My Sales Quota"
								}),
								/* @__PURE__ */ jsxs("p", {
									className: "text-2xl font-semibold text-slate-800 mt-2",
									children: ["₹", Number(summary.total_target || 0).toLocaleString()]
								}),
								/* @__PURE__ */ jsx("p", {
									className: "text-[11px] text-slate-400 mt-1",
									children: "Assigned budget"
								})
							]
						}),
						/* @__PURE__ */ jsxs("div", {
							className: "bg-white rounded-2xl border border-slate-200/80 p-5",
							children: [
								/* @__PURE__ */ jsx("span", {
									className: "text-xs font-medium text-slate-500",
									children: "Sales Achieved"
								}),
								/* @__PURE__ */ jsxs("p", {
									className: "text-2xl font-semibold text-emerald-600 mt-2",
									children: ["₹", Number(summary.total_achieved || 0).toLocaleString()]
								}),
								/* @__PURE__ */ jsx("p", {
									className: "text-[11px] text-emerald-600 font-medium mt-1",
									children: "Realized volume"
								})
							]
						}),
						/* @__PURE__ */ jsxs("div", {
							className: "bg-white rounded-2xl border border-slate-200/80 p-5",
							children: [
								/* @__PURE__ */ jsx("span", {
									className: "text-xs font-medium text-slate-500",
									children: "Overall Achievement"
								}),
								/* @__PURE__ */ jsxs("p", {
									className: "text-2xl font-semibold text-violet-600 mt-2",
									children: [summary.overall_percentage || 0, "%"]
								}),
								/* @__PURE__ */ jsx("p", {
									className: "text-[11px] text-slate-400 mt-1",
									children: "Portfolio achievement index"
								})
							]
						})
					]
				}),
				/* @__PURE__ */ jsxs("div", {
					className: "bg-white rounded-2xl border border-slate-200/80 overflow-hidden",
					children: [/* @__PURE__ */ jsxs("div", {
						className: "px-5 py-3.5 border-b border-slate-100 flex items-center justify-between",
						children: [/* @__PURE__ */ jsx("h3", {
							className: "text-sm font-semibold text-slate-800",
							children: isAdmin ? "Sales Quotas by Representative" : "My Assigned Monthly Quotas"
						}), /* @__PURE__ */ jsxs("span", {
							className: "text-xs text-slate-400",
							children: [targets.length, " records"]
						})]
					}), /* @__PURE__ */ jsx("div", {
						className: "overflow-x-auto",
						children: /* @__PURE__ */ jsxs("table", {
							className: "w-full text-left text-xs border-collapse",
							children: [/* @__PURE__ */ jsx("thead", { children: /* @__PURE__ */ jsxs("tr", {
								className: "border-b border-slate-100 text-[11px] font-semibold text-slate-400 bg-slate-50/50",
								children: [
									isAdmin && /* @__PURE__ */ jsx("th", {
										className: "py-2.5 px-4",
										children: "Representative"
									}),
									/* @__PURE__ */ jsx("th", {
										className: "py-2.5 px-4",
										children: "Period"
									}),
									/* @__PURE__ */ jsx("th", {
										className: "py-2.5 px-4 text-right",
										children: "Target Quota (₹)"
									}),
									/* @__PURE__ */ jsx("th", {
										className: "py-2.5 px-4 text-right",
										children: "Achieved Sales (₹)"
									}),
									/* @__PURE__ */ jsx("th", {
										className: "py-2.5 px-4 text-center",
										children: "Progress %"
									}),
									/* @__PURE__ */ jsx("th", {
										className: "py-2.5 px-4",
										children: "Notes"
									})
								]
							}) }), /* @__PURE__ */ jsx("tbody", {
								className: "divide-y divide-slate-100",
								children: targets.length === 0 ? /* @__PURE__ */ jsx("tr", { children: /* @__PURE__ */ jsx("td", {
									colSpan: isAdmin ? 6 : 5,
									className: "py-8 text-center text-slate-400 text-xs",
									children: "No sales targets assigned yet."
								}) }) : targets.map((tgt) => {
									const pct = tgt.target_amount > 0 ? Math.round(tgt.achieved_amount / tgt.target_amount * 100) : 0;
									return /* @__PURE__ */ jsxs("tr", {
										className: "hover:bg-slate-50/70 transition-colors",
										children: [
											isAdmin && /* @__PURE__ */ jsx("td", {
												className: "py-3 px-4 font-medium text-slate-800",
												children: tgt.employee_name
											}),
											/* @__PURE__ */ jsxs("td", {
												className: "py-3 px-4 font-medium text-slate-700",
												children: [
													tgt.month,
													" ",
													tgt.year
												]
											}),
											/* @__PURE__ */ jsxs("td", {
												className: "py-3 px-4 text-right font-semibold text-slate-800",
												children: ["₹", Number(tgt.target_amount).toLocaleString()]
											}),
											/* @__PURE__ */ jsxs("td", {
												className: "py-3 px-4 text-right font-semibold text-emerald-600",
												children: ["₹", Number(tgt.achieved_amount).toLocaleString()]
											}),
											/* @__PURE__ */ jsx("td", {
												className: "py-3 px-4 text-center font-bold text-slate-900",
												children: /* @__PURE__ */ jsxs("div", {
													className: "inline-flex items-center gap-1.5",
													children: [/* @__PURE__ */ jsxs("span", {
														className: "text-xs",
														children: [pct, "%"]
													}), /* @__PURE__ */ jsx("div", {
														className: "w-16 bg-slate-100 h-1.5 rounded-full overflow-hidden hidden sm:block",
														children: /* @__PURE__ */ jsx("div", {
															className: "bg-slate-900 h-full rounded-full",
															style: { width: `${Math.min(100, pct)}%` }
														})
													})]
												})
											}),
											/* @__PURE__ */ jsx("td", {
												className: "py-3 px-4 text-slate-500 max-w-xs truncate",
												children: tgt.notes
											})
										]
									}, tgt.id);
								})
							})]
						})
					})]
				})
			]
		})
	});
}
//#endregion
//#region resources/js/Pages/mrconnect/Slider.jsx
var Slider_exports = /* @__PURE__ */ __exportAll({ default: () => Slider });
function Slider({ slides = [] }) {
	const { props } = usePage();
	const Layout = props.auth?.user?.role === "admin" ? AdminLayout : MRLayout;
	return /* @__PURE__ */ jsx(Layout, {
		title: "Promotional Sliders & Visual Aids",
		children: /* @__PURE__ */ jsxs("div", {
			className: "space-y-6 pb-12 font-sans max-w-[1400px] mx-auto",
			children: [/* @__PURE__ */ jsxs("div", {
				className: "flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-200/80",
				children: [/* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("h2", {
					className: "text-xl sm:text-2xl font-semibold tracking-tight text-slate-800",
					children: "Interactive Promotional Sliders"
				}), /* @__PURE__ */ jsx("p", {
					className: "text-xs text-slate-500 font-normal mt-0.5",
					children: "Manage pharmaceutical visual aid presentation slides and carousel sequences."
				})] }), /* @__PURE__ */ jsxs(Link, {
					href: "/mr/detailing",
					className: "inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-medium text-xs transition-colors cursor-pointer shadow-xs",
					children: [/* @__PURE__ */ jsx(Presentation, { className: "w-3.5 h-3.5" }), /* @__PURE__ */ jsx("span", { children: "Open E-Detailing Deck" })]
				})]
			}), /* @__PURE__ */ jsx("div", {
				className: "grid grid-cols-1 md:grid-cols-3 gap-5",
				children: slides.map((slide) => /* @__PURE__ */ jsxs("div", {
					className: "bg-white rounded-2xl border border-slate-200/80 overflow-hidden flex flex-col justify-between",
					children: [/* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsxs("div", {
						className: "relative aspect-video bg-slate-100 flex items-center justify-center p-4 overflow-hidden border-b border-slate-100",
						children: [/* @__PURE__ */ jsx("img", {
							src: slide.image,
							alt: slide.title,
							className: "max-h-36 max-w-full object-contain"
						}), /* @__PURE__ */ jsxs("span", {
							className: "absolute top-2.5 left-2.5 bg-slate-900 text-white font-mono text-[10px] font-semibold px-2 py-0.5 rounded",
							children: ["Slide #", slide.order]
						})]
					}), /* @__PURE__ */ jsxs("div", {
						className: "p-4 space-y-1.5",
						children: [/* @__PURE__ */ jsx("span", {
							className: "text-[10px] font-semibold text-violet-700 bg-violet-50 px-2 py-0.5 rounded",
							children: slide.type
						}), /* @__PURE__ */ jsx("h3", {
							className: "text-sm font-semibold text-slate-800",
							children: slide.title
						})]
					})] }), /* @__PURE__ */ jsx("div", {
						className: "p-4 pt-0 flex items-center justify-between text-[11px] text-slate-400",
						children: /* @__PURE__ */ jsxs("span", {
							className: "inline-flex items-center gap-1 text-emerald-600 font-medium",
							children: [/* @__PURE__ */ jsx(CheckCircle2, { className: "w-3.5 h-3.5" }), "Active in Detailing Deck"]
						})
					})]
				}, slide.id))
			})]
		})
	});
}
//#endregion
//#region resources/js/Pages/mrconnect/Sponsor.jsx
var Sponsor_exports = /* @__PURE__ */ __exportAll({ default: () => Sponsor });
function Sponsor({ sponsorships = [] }) {
	const { props } = usePage();
	const isAdmin = props.auth?.user?.role === "admin";
	return /* @__PURE__ */ jsx(isAdmin ? AdminLayout : MRLayout, {
		title: isAdmin ? "Doctor & CME Sponsorships" : "My Doctor Sponsorships",
		children: /* @__PURE__ */ jsxs("div", {
			className: "space-y-6 pb-12 font-sans max-w-[1400px] mx-auto",
			children: [/* @__PURE__ */ jsx("div", {
				className: "flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-200/80",
				children: /* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("h2", {
					className: "text-xl sm:text-2xl font-semibold tracking-tight text-slate-800",
					children: isAdmin ? "Doctor & Academic Sponsorships" : "My Doctor Sponsorships"
				}), /* @__PURE__ */ jsx("p", {
					className: "text-xs text-slate-500 font-normal mt-0.5",
					children: isAdmin ? "Manage clinical CME programs, academic grants, medical society conferences, and clinical camp sponsorships." : "Track your physician CME registrations, conference travel grants, and health camp proposals."
				})] })
			}), /* @__PURE__ */ jsxs("div", {
				className: "bg-white rounded-2xl border border-slate-200/80 overflow-hidden",
				children: [/* @__PURE__ */ jsxs("div", {
					className: "px-5 py-3.5 border-b border-slate-100 flex items-center justify-between",
					children: [/* @__PURE__ */ jsx("h3", {
						className: "text-sm font-semibold text-slate-800",
						children: isAdmin ? "All Sponsorship Records" : "My Submitted Sponsorships"
					}), /* @__PURE__ */ jsxs("span", {
						className: "text-xs text-slate-400",
						children: [sponsorships.length, " activities"]
					})]
				}), /* @__PURE__ */ jsx("div", {
					className: "overflow-x-auto",
					children: /* @__PURE__ */ jsxs("table", {
						className: "w-full text-left text-xs border-collapse",
						children: [/* @__PURE__ */ jsx("thead", { children: /* @__PURE__ */ jsxs("tr", {
							className: "border-b border-slate-100 text-[11px] font-semibold text-slate-400 bg-slate-50/50",
							children: [
								/* @__PURE__ */ jsx("th", {
									className: "py-2.5 px-4",
									children: "Title / Program"
								}),
								/* @__PURE__ */ jsx("th", {
									className: "py-2.5 px-4",
									children: "Category"
								}),
								/* @__PURE__ */ jsx("th", {
									className: "py-2.5 px-4",
									children: "Doctor / Society"
								}),
								isAdmin && /* @__PURE__ */ jsx("th", {
									className: "py-2.5 px-4",
									children: "Representative"
								}),
								/* @__PURE__ */ jsx("th", {
									className: "py-2.5 px-4 text-right",
									children: "Sponsorship Amount"
								}),
								/* @__PURE__ */ jsx("th", {
									className: "py-2.5 px-4 text-center",
									children: "Status"
								})
							]
						}) }), /* @__PURE__ */ jsx("tbody", {
							className: "divide-y divide-slate-100",
							children: sponsorships.length === 0 ? /* @__PURE__ */ jsx("tr", { children: /* @__PURE__ */ jsx("td", {
								colSpan: isAdmin ? 6 : 5,
								className: "py-8 text-center text-slate-400 text-xs",
								children: "No sponsorships recorded."
							}) }) : sponsorships.map((item) => /* @__PURE__ */ jsxs("tr", {
								className: "hover:bg-slate-50/70 transition-colors",
								children: [
									/* @__PURE__ */ jsx("td", {
										className: "py-3 px-4 font-medium text-slate-800 max-w-sm",
										children: item.title
									}),
									/* @__PURE__ */ jsx("td", {
										className: "py-3 px-4 uppercase font-medium text-violet-700 text-[11px]",
										children: item.type.replace("_", " ")
									}),
									/* @__PURE__ */ jsx("td", {
										className: "py-3 px-4 text-slate-700",
										children: item.doctor_name || "Medical Society"
									}),
									isAdmin && /* @__PURE__ */ jsx("td", {
										className: "py-3 px-4 text-slate-500",
										children: item.representative_name
									}),
									/* @__PURE__ */ jsxs("td", {
										className: "py-3 px-4 text-right font-semibold text-slate-800",
										children: ["₹", Number(item.amount).toLocaleString()]
									}),
									/* @__PURE__ */ jsx("td", {
										className: "py-3 px-4 text-center",
										children: /* @__PURE__ */ jsx("span", {
											className: `inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md text-[11px] font-medium ${item.status === "approved" ? "bg-emerald-50 text-emerald-700 border border-emerald-200/60" : "bg-amber-50 text-amber-700 border border-amber-200/60"}`,
											children: item.status.toUpperCase()
										})
									})
								]
							}, item.id))
						})]
					})
				})]
			})]
		})
	});
}
//#endregion
//#region resources/js/Pages/mrconnect/TourPlan.jsx
var TourPlan_exports = /* @__PURE__ */ __exportAll({ default: () => TourPlan });
function TourPlan({ tourPlans = [] }) {
	const { props } = usePage();
	const isAdmin = props.auth?.user?.role === "admin";
	const Layout = isAdmin ? AdminLayout : MRLayout;
	const now = /* @__PURE__ */ new Date();
	const currentMonthName = now.toLocaleString("en-US", {
		month: "long",
		year: "numeric"
	});
	const currentYear = now.getFullYear();
	const [showModal, setShowModal] = useState(false);
	const [formData, setFormData] = useState({
		month: currentMonthName,
		year: currentYear,
		type: "Monthly Tour Plan (MTP)",
		days_count: 24,
		planned_visits: 120,
		notes: ""
	});
	const handleSubmit = (e) => {
		e.preventDefault();
		router.post("/mrconnect/tour-plan", formData, {
			onSuccess: () => {
				toast.success("Tour plan submitted successfully!");
				setShowModal(false);
			},
			onError: () => toast.error("Failed to submit tour plan.")
		});
	};
	const handleApprove = (id) => {
		router.post(`/mrconnect/tour-plan/${id}/approve`, {}, {
			onSuccess: () => toast.success("Tour plan approved!"),
			onError: () => toast.error("Action failed.")
		});
	};
	const handleReject = (id) => {
		router.post(`/mrconnect/tour-plan/${id}/reject`, {}, {
			onSuccess: () => toast.success("Tour plan rejected."),
			onError: () => toast.error("Action failed.")
		});
	};
	return /* @__PURE__ */ jsxs(Layout, {
		title: isAdmin ? "Monthly Tour Plan (MTP)" : "My Monthly Tour Plan",
		children: [/* @__PURE__ */ jsxs("div", {
			className: "space-y-6 pb-12 font-sans max-w-[1400px] mx-auto",
			children: [
				/* @__PURE__ */ jsxs("div", {
					className: "flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-200/80",
					children: [/* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("h2", {
						className: "text-xl sm:text-2xl font-semibold tracking-tight text-slate-800",
						children: isAdmin ? "Monthly Tour Plan (MTP) Schedules" : "My Monthly Tour Plan (MTP)"
					}), /* @__PURE__ */ jsx("p", {
						className: "text-xs text-slate-500 font-normal mt-0.5",
						children: isAdmin ? "Review and manage field representative doctor route plans and monthly tour approvals." : "Submit and monitor your doctor route coverage schedules and administrative approval status."
					})] }), /* @__PURE__ */ jsx("div", {
						className: "flex items-center gap-2",
						children: !isAdmin ? /* @__PURE__ */ jsxs("button", {
							type: "button",
							onClick: () => setShowModal(true),
							className: "inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-medium text-xs transition-colors cursor-pointer shadow-xs",
							children: [/* @__PURE__ */ jsx(Plus, { className: "w-3.5 h-3.5" }), /* @__PURE__ */ jsx("span", { children: "Submit Tour Plan" })]
						}) : /* @__PURE__ */ jsxs(Link, {
							href: "/admin/tracking",
							className: "inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-medium text-xs transition-colors cursor-pointer shadow-xs",
							children: [/* @__PURE__ */ jsx(MapPin, { className: "w-3.5 h-3.5" }), /* @__PURE__ */ jsx("span", { children: "Live Tour Tracking Map" })]
						})
					})]
				}),
				/* @__PURE__ */ jsxs("div", {
					className: "grid grid-cols-1 sm:grid-cols-4 gap-4",
					children: [
						/* @__PURE__ */ jsxs("div", {
							className: "bg-white rounded-2xl border border-slate-200/80 p-5",
							children: [
								/* @__PURE__ */ jsx("span", {
									className: "text-xs font-medium text-slate-500",
									children: isAdmin ? "Total Plans Submitted" : "My Tour Plans"
								}),
								/* @__PURE__ */ jsx("p", {
									className: "text-2xl font-semibold text-slate-800 mt-2",
									children: tourPlans.length
								}),
								/* @__PURE__ */ jsx("p", {
									className: "text-[11px] text-slate-400 mt-1",
									children: "Recorded cycles"
								})
							]
						}),
						/* @__PURE__ */ jsxs("div", {
							className: "bg-white rounded-2xl border border-slate-200/80 p-5",
							children: [
								/* @__PURE__ */ jsx("span", {
									className: "text-xs font-medium text-slate-500",
									children: "Approved Plans"
								}),
								/* @__PURE__ */ jsx("p", {
									className: "text-2xl font-semibold text-emerald-600 mt-2",
									children: tourPlans.filter((p) => p.status === "approved").length
								}),
								/* @__PURE__ */ jsx("p", {
									className: "text-[11px] text-emerald-600 font-medium mt-1",
									children: "Active field routes"
								})
							]
						}),
						/* @__PURE__ */ jsxs("div", {
							className: "bg-white rounded-2xl border border-slate-200/80 p-5",
							children: [
								/* @__PURE__ */ jsx("span", {
									className: "text-xs font-medium text-slate-500",
									children: "Pending Review"
								}),
								/* @__PURE__ */ jsx("p", {
									className: "text-2xl font-semibold text-amber-600 mt-2",
									children: tourPlans.filter((p) => p.status === "pending").length
								}),
								/* @__PURE__ */ jsx("p", {
									className: "text-[11px] text-amber-600 font-medium mt-1",
									children: "Awaiting management"
								})
							]
						}),
						/* @__PURE__ */ jsxs("div", {
							className: "bg-white rounded-2xl border border-slate-200/80 p-5",
							children: [
								/* @__PURE__ */ jsx("span", {
									className: "text-xs font-medium text-slate-500",
									children: "Planned Call Density"
								}),
								/* @__PURE__ */ jsxs("p", {
									className: "text-2xl font-semibold text-violet-600 mt-2",
									children: [tourPlans.reduce((sum, p) => sum + (p.planned_visits || 0), 0), " Calls"]
								}),
								/* @__PURE__ */ jsx("p", {
									className: "text-[11px] text-slate-400 mt-1",
									children: "Doctor touchpoints"
								})
							]
						})
					]
				}),
				/* @__PURE__ */ jsxs("div", {
					className: "bg-white rounded-2xl border border-slate-200/80 overflow-hidden",
					children: [/* @__PURE__ */ jsxs("div", {
						className: "px-5 py-3.5 border-b border-slate-100 flex items-center justify-between",
						children: [/* @__PURE__ */ jsx("h3", {
							className: "text-sm font-semibold text-slate-800",
							children: isAdmin ? "Field Tour Plans" : "My Tour Schedules"
						}), /* @__PURE__ */ jsxs("span", {
							className: "text-xs text-slate-400",
							children: [tourPlans.length, " records"]
						})]
					}), /* @__PURE__ */ jsx("div", {
						className: "overflow-x-auto",
						children: /* @__PURE__ */ jsxs("table", {
							className: "w-full text-left text-xs border-collapse",
							children: [/* @__PURE__ */ jsx("thead", { children: /* @__PURE__ */ jsxs("tr", {
								className: "border-b border-slate-100 text-[11px] font-semibold text-slate-400 bg-slate-50/50",
								children: [
									isAdmin && /* @__PURE__ */ jsx("th", {
										className: "py-2.5 px-4",
										children: "Representative"
									}),
									/* @__PURE__ */ jsx("th", {
										className: "py-2.5 px-4",
										children: "Month / Period"
									}),
									/* @__PURE__ */ jsx("th", {
										className: "py-2.5 px-4 text-center",
										children: "Working Days"
									}),
									/* @__PURE__ */ jsx("th", {
										className: "py-2.5 px-4 text-center",
										children: "Planned Visits"
									}),
									/* @__PURE__ */ jsx("th", {
										className: "py-2.5 px-4",
										children: "Notes"
									}),
									/* @__PURE__ */ jsx("th", {
										className: "py-2.5 px-4 text-center",
										children: "Status"
									}),
									isAdmin && /* @__PURE__ */ jsx("th", {
										className: "py-2.5 px-4 text-center",
										children: "Actions"
									})
								]
							}) }), /* @__PURE__ */ jsx("tbody", {
								className: "divide-y divide-slate-100",
								children: tourPlans.length === 0 ? /* @__PURE__ */ jsx("tr", { children: /* @__PURE__ */ jsx("td", {
									colSpan: isAdmin ? 7 : 5,
									className: "py-8 text-center text-slate-400 text-xs",
									children: "No tour plans found. Click \"Submit Tour Plan\" above to create one."
								}) }) : tourPlans.map((plan) => /* @__PURE__ */ jsxs("tr", {
									className: "hover:bg-slate-50/70 transition-colors",
									children: [
										isAdmin && /* @__PURE__ */ jsx("td", {
											className: "py-3 px-4 font-medium text-slate-800",
											children: plan.user_name
										}),
										/* @__PURE__ */ jsxs("td", {
											className: "py-3 px-4 font-medium text-slate-700",
											children: [
												plan.month,
												" ",
												plan.year
											]
										}),
										/* @__PURE__ */ jsxs("td", {
											className: "py-3 px-4 text-center font-medium text-slate-800",
											children: [plan.days_count, " days"]
										}),
										/* @__PURE__ */ jsxs("td", {
											className: "py-3 px-4 text-center font-medium text-violet-700",
											children: [plan.planned_visits, " visits"]
										}),
										/* @__PURE__ */ jsx("td", {
											className: "py-3 px-4 text-slate-500 max-w-xs truncate",
											children: plan.notes || "Routine monthly territory coverage."
										}),
										/* @__PURE__ */ jsx("td", {
											className: "py-3 px-4 text-center",
											children: /* @__PURE__ */ jsx("span", {
												className: `inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md text-[11px] font-medium ${plan.status === "approved" ? "bg-emerald-50 text-emerald-700 border border-emerald-200/60" : plan.status === "rejected" ? "bg-rose-50 text-rose-700 border border-rose-200/60" : "bg-amber-50 text-amber-700 border border-amber-200/60"}`,
												children: plan.status.charAt(0).toUpperCase() + plan.status.slice(1)
											})
										}),
										isAdmin && /* @__PURE__ */ jsx("td", {
											className: "py-3 px-4 text-center",
											children: plan.status === "pending" ? /* @__PURE__ */ jsxs("div", {
												className: "flex items-center justify-center gap-1.5",
												children: [/* @__PURE__ */ jsx("button", {
													type: "button",
													onClick: () => handleApprove(plan.id),
													className: "p-1 rounded-lg bg-emerald-50 text-emerald-700 hover:bg-emerald-100 transition-colors",
													title: "Approve Plan",
													children: /* @__PURE__ */ jsx(Check, { className: "w-3.5 h-3.5" })
												}), /* @__PURE__ */ jsx("button", {
													type: "button",
													onClick: () => handleReject(plan.id),
													className: "p-1 rounded-lg bg-rose-50 text-rose-700 hover:bg-rose-100 transition-colors",
													title: "Reject Plan",
													children: /* @__PURE__ */ jsx(X, { className: "w-3.5 h-3.5" })
												})]
											}) : /* @__PURE__ */ jsx("span", {
												className: "text-[11px] text-slate-400",
												children: "Reviewed"
											})
										})
									]
								}, plan.id))
							})]
						})
					})]
				})
			]
		}), showModal && /* @__PURE__ */ jsx("div", {
			className: "fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-xs p-4",
			children: /* @__PURE__ */ jsxs("div", {
				className: "bg-white rounded-2xl max-w-md w-full border border-slate-200 p-6 space-y-4",
				children: [/* @__PURE__ */ jsxs("div", {
					className: "flex items-center justify-between border-b border-slate-100 pb-3",
					children: [/* @__PURE__ */ jsx("h3", {
						className: "text-base font-semibold text-slate-800",
						children: "Submit Monthly Tour Plan"
					}), /* @__PURE__ */ jsx("button", {
						type: "button",
						onClick: () => setShowModal(false),
						className: "p-1 text-slate-400 hover:text-slate-600 rounded-lg",
						children: /* @__PURE__ */ jsx(X, { className: "w-4 h-4" })
					})]
				}), /* @__PURE__ */ jsxs("form", {
					onSubmit: handleSubmit,
					className: "space-y-3",
					children: [
						/* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("label", {
							className: "block text-xs font-medium text-slate-700 mb-1",
							children: "Month / Period"
						}), /* @__PURE__ */ jsx("input", {
							type: "text",
							required: true,
							value: formData.month,
							onChange: (e) => setFormData({
								...formData,
								month: e.target.value
							}),
							placeholder: "e.g. August 2026",
							className: "w-full px-3 py-2 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-violet-500/20"
						})] }),
						/* @__PURE__ */ jsxs("div", {
							className: "grid grid-cols-2 gap-3",
							children: [/* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("label", {
								className: "block text-xs font-medium text-slate-700 mb-1",
								children: "Working Days"
							}), /* @__PURE__ */ jsx("input", {
								type: "number",
								min: "1",
								max: "31",
								required: true,
								value: formData.days_count,
								onChange: (e) => setFormData({
									...formData,
									days_count: parseInt(e.target.value) || ""
								}),
								className: "w-full px-3 py-2 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-violet-500/20"
							})] }), /* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("label", {
								className: "block text-xs font-medium text-slate-700 mb-1",
								children: "Planned Doctor Visits"
							}), /* @__PURE__ */ jsx("input", {
								type: "number",
								min: "1",
								max: "300",
								required: true,
								value: formData.planned_visits,
								onChange: (e) => setFormData({
									...formData,
									planned_visits: parseInt(e.target.value) || ""
								}),
								className: "w-full px-3 py-2 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-violet-500/20"
							})] })]
						}),
						/* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("label", {
							className: "block text-xs font-medium text-slate-700 mb-1",
							children: "Route & Field Notes"
						}), /* @__PURE__ */ jsx("textarea", {
							rows: "3",
							value: formData.notes,
							onChange: (e) => setFormData({
								...formData,
								notes: e.target.value
							}),
							placeholder: "Specify key clinic stops, ex-station days, and joint fieldwork plans...",
							className: "w-full px-3 py-2 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-violet-500/20"
						})] }),
						/* @__PURE__ */ jsxs("div", {
							className: "flex items-center justify-end gap-2 pt-2",
							children: [/* @__PURE__ */ jsx("button", {
								type: "button",
								onClick: () => setShowModal(false),
								className: "px-3.5 py-1.5 rounded-xl border border-slate-200 text-xs text-slate-600 hover:bg-slate-50 cursor-pointer",
								children: "Cancel"
							}), /* @__PURE__ */ jsx("button", {
								type: "submit",
								className: "px-4 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-medium text-xs cursor-pointer shadow-xs",
								children: "Submit Plan"
							})]
						})
					]
				})]
			})
		})]
	});
}
//#endregion
//#region resources/js/Pages/mrconnect/VideoLibrary.jsx
var VideoLibrary_exports = /* @__PURE__ */ __exportAll({ default: () => VideoLibrary });
function VideoLibrary({ videos = [] }) {
	const { props } = usePage();
	const Layout = props.auth?.user?.role === "admin" ? AdminLayout : MRLayout;
	return /* @__PURE__ */ jsx(Layout, {
		title: "Clinical Video Library",
		children: /* @__PURE__ */ jsxs("div", {
			className: "space-y-6 pb-12 font-sans max-w-[1400px] mx-auto",
			children: [/* @__PURE__ */ jsx("div", {
				className: "flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-200/80",
				children: /* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("h2", {
					className: "text-xl sm:text-2xl font-semibold tracking-tight text-slate-800",
					children: "Clinical Video Library & MOA Animations"
				}), /* @__PURE__ */ jsx("p", {
					className: "text-xs text-slate-500 font-normal mt-0.5",
					children: "High-definition Mechanism of Action (MOA) 3D scientific videos for doctor engagement."
				})] })
			}), /* @__PURE__ */ jsx("div", {
				className: "grid grid-cols-1 md:grid-cols-3 gap-5",
				children: videos.map((vid) => /* @__PURE__ */ jsxs("div", {
					className: "bg-white rounded-2xl border border-slate-200/80 overflow-hidden flex flex-col justify-between group",
					children: [/* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsxs("div", {
						className: "relative aspect-video bg-slate-900 overflow-hidden",
						children: [
							/* @__PURE__ */ jsx("img", {
								src: vid.thumbnail,
								alt: vid.title,
								className: "w-full h-full object-cover opacity-80 group-hover:scale-105 transition-transform duration-300"
							}),
							/* @__PURE__ */ jsx("div", {
								className: "absolute inset-0 bg-slate-955/30 flex items-center justify-center",
								children: /* @__PURE__ */ jsx("div", {
									className: "w-12 h-12 rounded-full bg-white/90 text-slate-900 flex items-center justify-center shadow-lg group-hover:bg-slate-900 group-hover:text-white transition-colors",
									children: /* @__PURE__ */ jsx(Play, { className: "w-5 h-5 ml-0.5" })
								})
							}),
							/* @__PURE__ */ jsx("span", {
								className: "absolute bottom-2.5 right-2.5 bg-black/80 text-white font-mono text-[10px] px-2 py-0.5 rounded",
								children: vid.duration
							})
						]
					}), /* @__PURE__ */ jsxs("div", {
						className: "p-4 space-y-2",
						children: [
							/* @__PURE__ */ jsx("span", {
								className: "text-[10px] font-semibold text-slate-700 bg-slate-100 border border-slate-200/60 px-2 py-0.5 rounded-md",
								children: vid.category
							}),
							/* @__PURE__ */ jsx("h3", {
								className: "text-sm font-semibold text-slate-800 line-clamp-2",
								children: vid.title
							}),
							/* @__PURE__ */ jsx("p", {
								className: "text-xs text-slate-500 line-clamp-2",
								children: vid.description
							})
						]
					})] }), /* @__PURE__ */ jsxs("div", {
						className: "p-4 pt-0 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-400",
						children: [/* @__PURE__ */ jsxs("span", {
							className: "flex items-center gap-1",
							children: [
								/* @__PURE__ */ jsx(Eye, { className: "w-3.5 h-3.5" }),
								vid.views,
								" views"
							]
						}), /* @__PURE__ */ jsx(Link, {
							href: "/mr/detailing",
							className: "font-medium text-violet-600 hover:text-violet-800",
							children: "Launch in Player →"
						})]
					})]
				}, vid.id))
			})]
		})
	});
}
//#endregion
//#region resources/js/components/common/Container.jsx
function Container({ children, className = "", size = "default" }) {
	const sizeClasses = {
		narrow: "max-w-5xl",
		default: "max-w-7xl",
		wide: "max-w-[1400px]",
		full: "max-w-full"
	};
	return /* @__PURE__ */ jsx("div", {
		className: `mx-auto w-full px-4 sm:px-6 lg:px-8 ${sizeClasses[size] || sizeClasses.default} ${className}`,
		children
	});
}
//#endregion
//#region resources/js/components/common/Button.jsx
function Button({ children, variant = "primary", size = "md", href, onClick, type = "button", icon: Icon, iconPosition = "right", className = "", disabled = false, ...props }) {
	const baseStyles = "inline-flex items-center justify-center font-medium rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none cursor-pointer";
	const variants = {
		primary: "bg-[#0c2340] text-white hover:bg-[#123055] active:bg-[#07172b] focus:ring-[#c59324] shadow-xs",
		medical: "bg-gradient-to-r from-[#c59324] via-[#d4a029] to-[#b8831b] text-white hover:from-[#b8831b] hover:to-[#9f6d0f] focus:ring-[#c59324] shadow-xs",
		secondary: "bg-amber-50 text-[#0c2340] border border-amber-200/80 hover:bg-amber-100/70 focus:ring-[#c59324]",
		outline: "bg-white text-slate-700 border border-slate-200 hover:border-[#c59324] hover:text-[#0c2340] active:bg-slate-100 focus:ring-[#c59324]",
		white: "bg-white text-slate-900 hover:bg-slate-100 active:bg-slate-200 focus:ring-white",
		ghost: "bg-transparent text-slate-700 hover:bg-amber-50/50 hover:text-[#0c2340] active:bg-slate-200 focus:ring-[#c59324]"
	};
	const sizes = {
		sm: "px-3.5 py-1.5 text-xs gap-1.5",
		md: "px-5 py-2.5 text-sm gap-2",
		lg: "px-6 py-3 text-base gap-2.5 font-semibold"
	};
	const combinedClasses = `${baseStyles} ${variants[variant] || variants.primary} ${sizes[size] || sizes.md} ${className}`;
	const content = /* @__PURE__ */ jsxs(Fragment, { children: [
		Icon && iconPosition === "left" && /* @__PURE__ */ jsx(Icon, { className: "w-4 h-4 shrink-0 transition-transform group-hover:-translate-x-0.5" }),
		/* @__PURE__ */ jsx("span", { children }),
		Icon && iconPosition === "right" && /* @__PURE__ */ jsx(Icon, { className: "w-4 h-4 shrink-0 transition-transform group-hover:translate-x-0.5" })
	] });
	if (href) {
		if (href.startsWith("/") && !href.includes("#")) return /* @__PURE__ */ jsx(Link, {
			href,
			className: `group ${combinedClasses}`,
			...props,
			children: content
		});
		return /* @__PURE__ */ jsx("a", {
			href,
			className: `group ${combinedClasses}`,
			...props,
			children: content
		});
	}
	return /* @__PURE__ */ jsx("button", {
		type,
		onClick,
		disabled,
		className: `group ${combinedClasses}`,
		...props,
		children: content
	});
}
//#endregion
//#region resources/js/components/Header.jsx
function Header({ companyData, onOpenEnquiryModal }) {
	const [isScrolled, setIsScrolled] = useState(false);
	const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
	const [mobileSearchOpen, setMobileSearchOpen] = useState(false);
	const { url } = usePage();
	const currentPath = url.split("?")[0];
	const isProductsPage = currentPath.startsWith("/products");
	const getQueryParam = (param) => {
		try {
			return new URLSearchParams(url.split("?")[1] || "").get(param) || "";
		} catch {
			return "";
		}
	};
	const [searchTerm, setSearchTerm] = useState(getQueryParam("search"));
	useEffect(() => {
		setSearchTerm(getQueryParam("search"));
	}, [url]);
	useEffect(() => {
		const handleScroll = () => {
			setIsScrolled(window.scrollY > 20);
		};
		window.addEventListener("scroll", handleScroll, { passive: true });
		return () => window.removeEventListener("scroll", handleScroll);
	}, []);
	const handleSearchSubmit = (e) => {
		e.preventDefault();
		const trimmed = searchTerm.trim();
		if (trimmed) {
			router.get(`/products?search=${encodeURIComponent(trimmed)}`);
			setMobileSearchOpen(false);
			setMobileMenuOpen(false);
		} else if (isProductsPage) router.get("/products");
	};
	const handleClearSearch = () => {
		setSearchTerm("");
		if (isProductsPage && getQueryParam("search")) router.get("/products");
	};
	const navLinks = [
		{
			name: "Home",
			href: "/"
		},
		{
			name: "About Us",
			href: "/about"
		},
		{
			name: "Products & Formulations",
			href: "/products"
		},
		{
			name: "Quality & WHO-GMP",
			href: "/quality"
		},
		{
			name: "Contact Corporate Desk",
			href: "/contact"
		}
	];
	const rawCompanyName = companyData?.company_name || companyData?.companyName || "Ciplon Life Sciences";
	const companyPhone = companyData?.company_phone || companyData?.companyPhone || "+91 800 458 7290";
	const logoUrl = companyData?.logo_url || companyData?.logoUrl;
	rawCompanyName.toUpperCase().replace(" PHARMACEUTICALS", "").replace(" LIFE SCIENCES", "").replace(" PVT. LTD.", "").replace(" LTD.", "").trim();
	return /* @__PURE__ */ jsx("header", {
		className: "sticky top-0 z-50 w-full transition-all duration-300",
		children: /* @__PURE__ */ jsx("nav", {
			className: `bg-white transition-all duration-200 ${isScrolled ? "border-b border-slate-200 py-2.5" : "border-b border-slate-200 py-3 sm:py-4"}`,
			children: /* @__PURE__ */ jsxs(Container, {
				size: "wide",
				children: [
					/* @__PURE__ */ jsxs("div", {
						className: "flex items-center justify-between gap-4 xl:gap-8",
						children: [
							/* @__PURE__ */ jsx(Link, {
								href: "/",
								onClick: () => {
									if (window.location.pathname === "/") window.scrollTo({
										top: 0,
										behavior: "smooth"
									});
								},
								className: "flex items-center shrink-0 group focus:outline-none",
								title: "Ciplon Pharmaceuticals",
								children: /* @__PURE__ */ jsx("img", {
									src: logoUrl || "/images/ciplon_logo.png",
									alt: "Ciplon Pharma Private Limited",
									className: "h-12 sm:h-14 md:h-16 lg:h-17 xl:h-18 w-auto max-w-[260px] sm:max-w-[320px] lg:max-w-[360px] object-contain transition-all",
									onError: (e) => {
										e.currentTarget.src = "/images/ciplon_logo.png";
									}
								})
							}),
							/* @__PURE__ */ jsxs("nav", {
								className: "hidden lg:flex items-center gap-3 xl:gap-5 2xl:gap-6 text-xs xl:text-[13px] font-semibold tracking-wide text-slate-700 whitespace-nowrap",
								children: [
									/* @__PURE__ */ jsx(Link, {
										href: "/",
										className: `hover:text-[#c59324] transition-colors uppercase whitespace-nowrap ${currentPath === "/" ? "text-[#c59324]" : ""}`,
										children: "HOME"
									}),
									/* @__PURE__ */ jsxs("div", {
										className: "relative group/menu py-2",
										children: [/* @__PURE__ */ jsxs(Link, {
											href: "/about",
											className: "flex items-center gap-1 hover:text-[#c59324] transition-colors uppercase whitespace-nowrap cursor-pointer",
											children: [/* @__PURE__ */ jsx("span", { children: "ABOUT US" }), /* @__PURE__ */ jsx("span", {
												className: "text-[8px] text-slate-400 group-hover/menu:text-[#c59324] transition-transform group-hover/menu:rotate-180",
												children: "▼"
											})]
										}), /* @__PURE__ */ jsxs("div", {
											className: "absolute top-full left-0 hidden group-hover/menu:block min-w-[240px] w-max bg-white rounded-2xl shadow-xl border border-slate-100 py-2.5 px-1.5 z-50 animate-in fade-in slide-in-from-top-1 duration-150",
											children: [
												/* @__PURE__ */ jsx(Link, {
													href: "/about",
													className: "block px-4 py-2 text-xs font-medium text-slate-700 hover:bg-amber-50/60 hover:text-[#c59324] rounded-lg transition-colors whitespace-nowrap",
													children: "Corporate Overview"
												}),
												/* @__PURE__ */ jsx(Link, {
													href: "/about",
													className: "block px-4 py-2 text-xs font-medium text-slate-700 hover:bg-amber-50/60 hover:text-[#c59324] rounded-lg transition-colors whitespace-nowrap",
													children: "Walpar Manufacturing"
												}),
												/* @__PURE__ */ jsx(Link, {
													href: "/quality",
													className: "block px-4 py-2 text-xs font-medium text-slate-700 hover:bg-amber-50/60 hover:text-[#c59324] rounded-lg transition-colors whitespace-nowrap",
													children: "Quality & Certifications"
												}),
												/* @__PURE__ */ jsx("a", {
													href: "/#news",
													className: "block px-4 py-2 text-xs font-medium text-slate-700 hover:bg-amber-50/60 hover:text-[#c59324] rounded-lg transition-colors whitespace-nowrap",
													children: "Corporate Media"
												})
											]
										})]
									}),
									/* @__PURE__ */ jsx(Link, {
										href: "/products",
										className: "hover:text-[#c59324] transition-colors uppercase whitespace-nowrap",
										children: "PRODUCTS"
									}),
									/* @__PURE__ */ jsxs("div", {
										className: "relative group/menu py-2",
										children: [/* @__PURE__ */ jsxs(Link, {
											href: "/quality",
											className: "flex items-center gap-1 hover:text-[#c59324] transition-colors uppercase whitespace-nowrap cursor-pointer",
											children: [/* @__PURE__ */ jsx("span", { children: "QUALITY & GMP" }), /* @__PURE__ */ jsx("span", {
												className: "text-[8px] text-slate-400 group-hover/menu:text-[#c59324] transition-transform group-hover/menu:rotate-180",
												children: "▼"
											})]
										}), /* @__PURE__ */ jsxs("div", {
											className: "absolute top-full left-0 hidden group-hover/menu:block min-w-[240px] w-max bg-white rounded-2xl shadow-xl border border-slate-100 py-2 px-1 z-50 animate-in fade-in slide-in-from-top-1 duration-150",
											children: [
												/* @__PURE__ */ jsx(Link, {
													href: "/quality",
													className: "block px-4 py-2 text-xs font-medium text-slate-700 hover:bg-amber-50/60 hover:text-[#c59324] rounded-lg transition-colors whitespace-nowrap",
													children: "WHO-GMP Facilities"
												}),
												/* @__PURE__ */ jsx(Link, {
													href: "/quality",
													className: "block px-4 py-2 text-xs font-medium text-slate-700 hover:bg-amber-50/60 hover:text-[#c59324] rounded-lg transition-colors whitespace-nowrap",
													children: "ISO 9001:2015 Standards"
												}),
												/* @__PURE__ */ jsx(Link, {
													href: "/quality",
													className: "block px-4 py-2 text-xs font-medium text-slate-700 hover:bg-amber-50/60 hover:text-[#c59324] rounded-lg transition-colors whitespace-nowrap",
													children: "Quality Control (QC)"
												})
											]
										})]
									}),
									/* @__PURE__ */ jsx("a", {
										href: "/#science",
										className: "hover:text-[#c59324] transition-colors uppercase whitespace-nowrap",
										children: "R&D"
									}),
									/* @__PURE__ */ jsx("a", {
										href: "/#news",
										className: "hover:text-[#c59324] transition-colors uppercase whitespace-nowrap",
										children: "MEDIA"
									}),
									/* @__PURE__ */ jsx(Link, {
										href: "/contact",
										className: "hover:text-[#c59324] transition-colors uppercase whitespace-nowrap cursor-pointer",
										children: "CONTACT"
									})
								]
							}),
							/* @__PURE__ */ jsxs("div", {
								className: "hidden md:flex items-center gap-4 shrink-0",
								children: [/* @__PURE__ */ jsxs("div", {
									className: "relative",
									children: [/* @__PURE__ */ jsx("button", {
										type: "button",
										onClick: () => setMobileSearchOpen(!mobileSearchOpen),
										className: "p-1.5 text-slate-600 hover:text-[#c59324] transition-colors cursor-pointer rounded-full hover:bg-amber-50/50",
										"aria-label": "Search",
										title: "Search products and molecules",
										children: /* @__PURE__ */ jsx(Search, { className: "w-4 h-4 stroke-[2.2]" })
									}), mobileSearchOpen && /* @__PURE__ */ jsx("div", {
										className: "absolute right-0 top-full mt-2 w-72 bg-white rounded-2xl shadow-2xl border border-slate-200 p-2 z-50 animate-in fade-in slide-in-from-top-2 duration-150",
										children: /* @__PURE__ */ jsxs("form", {
											onSubmit: handleSearchSubmit,
											className: "relative w-full",
											children: [
												/* @__PURE__ */ jsx(Search, { className: "w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" }),
												/* @__PURE__ */ jsx("input", {
													type: "text",
													value: searchTerm,
													onChange: (e) => setSearchTerm(e.target.value),
													placeholder: "Search molecules, brands...",
													autoFocus: true,
													className: "w-full pl-9 pr-7 py-1.5 bg-slate-50 focus:bg-white border border-slate-200 focus:border-[#c59324] rounded-xl text-xs text-slate-800 focus:outline-none"
												}),
												searchTerm && /* @__PURE__ */ jsx("button", {
													type: "button",
													onClick: () => setSearchTerm(""),
													className: "absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600",
													children: /* @__PURE__ */ jsx(X, { className: "w-3.5 h-3.5" })
												})
											]
										})
									})]
								}), /* @__PURE__ */ jsx(Link, {
									href: "/login",
									className: "flex items-center gap-1.5 text-[#e05e00] hover:text-[#c44e00] transition-colors group py-1 px-1 focus:outline-none",
									title: "MR Portal & Accord Healthcare Partner Network"
								})]
							}),
							/* @__PURE__ */ jsxs("div", {
								className: "flex items-center gap-1.5 lg:hidden",
								children: [/* @__PURE__ */ jsx("button", {
									type: "button",
									onClick: () => setMobileSearchOpen(!mobileSearchOpen),
									className: `p-2 rounded-xl text-slate-700 hover:bg-slate-100 transition-colors md:hidden ${mobileSearchOpen ? "bg-teal-50 text-teal-700" : ""}`,
									"aria-label": "Toggle mobile search",
									children: /* @__PURE__ */ jsx(Search, { className: "w-5 h-5" })
								}), /* @__PURE__ */ jsx("button", {
									type: "button",
									onClick: () => setMobileMenuOpen(!mobileMenuOpen),
									className: "p-2 rounded-xl text-slate-700 hover:bg-slate-100 focus:outline-none focus:ring-2 focus:ring-[#c59324] cursor-pointer",
									"aria-label": "Toggle navigation menu",
									children: mobileMenuOpen ? /* @__PURE__ */ jsx(X, { className: "w-6 h-6" }) : /* @__PURE__ */ jsx(Menu, { className: "w-6 h-6" })
								})]
							})
						]
					}),
					mobileSearchOpen && /* @__PURE__ */ jsx("div", {
						className: "md:hidden mt-2.5 pt-2.5 border-t border-slate-100 animate-in fade-in slide-in-from-top-1 duration-200",
						children: /* @__PURE__ */ jsxs("form", {
							onSubmit: handleSearchSubmit,
							className: "relative w-full",
							children: [
								/* @__PURE__ */ jsx(Search, { className: "w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" }),
								/* @__PURE__ */ jsx("input", {
									type: "text",
									value: searchTerm,
									onChange: (e) => setSearchTerm(e.target.value),
									placeholder: "Search molecules, brands, indications...",
									autoFocus: true,
									className: "w-full pl-9 pr-8 py-2 bg-slate-100/90 focus:bg-white border border-slate-200 focus:border-[#c59324] rounded-xl text-xs text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#c59324]/20 transition-all"
								}),
								searchTerm && /* @__PURE__ */ jsx("button", {
									type: "button",
									onClick: handleClearSearch,
									className: "absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 cursor-pointer p-0.5",
									"aria-label": "Clear search",
									children: /* @__PURE__ */ jsx(X, { className: "w-3.5 h-3.5" })
								})
							]
						})
					}),
					mobileMenuOpen && /* @__PURE__ */ jsxs("div", {
						className: "lg:hidden mt-3 pt-3 border-t border-slate-100 pb-4 space-y-2 bg-white animate-in fade-in duration-200",
						children: [
							navLinks.map((link) => /* @__PURE__ */ jsx(Link, {
								href: link.href,
								onClick: () => setMobileMenuOpen(false),
								className: "block px-3 py-2 rounded-lg text-xs font-semibold text-slate-800 hover:bg-amber-50 hover:text-[#c59324] transition-colors",
								children: link.name
							}, link.name)),
							/* @__PURE__ */ jsxs(Link, {
								href: "/login",
								onClick: () => setMobileMenuOpen(false),
								className: "block px-3 py-2 rounded-lg text-xs font-semibold text-slate-700 hover:bg-amber-50 hover:text-[#c59324] transition-colors flex items-center gap-2",
								children: [/* @__PURE__ */ jsx(LogIn, { className: "w-4 h-4 text-slate-500" }), /* @__PURE__ */ jsx("span", { children: "Portal Login" })]
							}),
							/* @__PURE__ */ jsxs("div", {
								className: "pt-2 mt-2 border-t border-slate-100 space-y-2",
								children: [/* @__PURE__ */ jsxs(Link, {
									href: "/products",
									onClick: () => setMobileMenuOpen(false),
									className: "w-full justify-center bg-gradient-to-r from-[#c59324] to-[#dfad36] hover:brightness-105 text-[#07172b] text-xs font-bold py-2.5 px-4 rounded-xl flex items-center gap-2 transition-all shadow-sm",
									children: [/* @__PURE__ */ jsx("span", { children: "View Product Catalog" }), /* @__PURE__ */ jsx(ArrowRight, { className: "w-4 h-4" })]
								}), companyPhone && /* @__PURE__ */ jsx("div", {
									className: "pt-2 text-center text-xs text-slate-500",
									children: /* @__PURE__ */ jsx("a", {
										href: `tel:${companyPhone.replace(/\s+/g, "")}`,
										className: "block py-1 font-medium text-[#c59324]",
										children: companyPhone
									})
								})]
							})
						]
					})
				]
			})
		})
	});
}
//#endregion
//#region resources/js/components/Footer.jsx
var CURRENT_YEAR = (/* @__PURE__ */ new Date()).getFullYear();
function Footer({ companyData, categories = [], onOpenEnquiryModal }) {
	const legalName = companyData?.legal_name || "Ciplon Pharma Private Limited";
	const headquarters = companyData?.headquarters_address || "M24/A, KH No. 294, 1st Floor, Batla House, Okhla, Jamia Nagar, South Delhi";
	const city = companyData?.city || "New Delhi";
	const state = companyData?.state || "Delhi";
	const postalCode = companyData?.postal_code || "110025";
	const country = companyData?.country || "India";
	const email = companyData?.company_email || companyData?.enquiries_email || "info@ciplonpharma.in";
	const website = companyData?.website_url || "https://www.ciplonpharma.in";
	const fssaiLicNo = companyData?.fssai_lic_no || "10426340000172";
	const trademarkStatus = companyData?.trademark_status || "TM-Trademark Under Registration";
	const isoCertification = companyData?.iso_certification || "An ISO 9001: 2015 Certified Company";
	const manufacturerName = companyData?.manufacturer_name || "Pure & Cure Healthcare Pvt. Ltd. / Walpar Wellness";
	const manufacturerCert = companyData?.manufacturer_certification || "WHO-GMP & cGMP Compliant Facility";
	const logoUrl = companyData?.logo_url || "/images/ciplon_logo.png";
	return /* @__PURE__ */ jsxs("footer", {
		className: "bg-[#071527] text-slate-300 selection:bg-[#c59324] selection:text-white border-t border-[#c59324]/30 relative overflow-hidden font-sans",
		children: [
			/* @__PURE__ */ jsx("div", { className: "absolute top-0 left-1/2 -translate-x-1/2 w-3/4 h-24 bg-gradient-to-b from-[#c59324]/5 to-transparent pointer-events-none" }),
			/* @__PURE__ */ jsx("div", {
				className: "pt-16 pb-12 relative z-10",
				children: /* @__PURE__ */ jsx(Container, { children: /* @__PURE__ */ jsxs("div", {
					className: "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10 lg:gap-8 items-start",
					children: [
						/* @__PURE__ */ jsxs("div", {
							className: "lg:col-span-4 space-y-5",
							children: [
								/* @__PURE__ */ jsx("div", {
									className: "inline-block bg-white px-4 py-2.5 rounded-xl border border-white/10 shadow-sm",
									children: /* @__PURE__ */ jsx("img", {
										src: logoUrl,
										alt: legalName,
										className: "h-10 sm:h-12 w-auto object-contain",
										onError: (e) => {
											e.currentTarget.src = "/images/ciplon_logo.png";
										}
									})
								}),
								/* @__PURE__ */ jsxs("div", {
									className: "space-y-2",
									children: [/* @__PURE__ */ jsx("h3", {
										className: "text-base font-bold text-white tracking-wide uppercase",
										children: legalName
									}), /* @__PURE__ */ jsx("p", {
										className: "text-xs text-slate-400 leading-relaxed",
										children: "Dedicated to delivering high-potency, research-driven finished pharmaceutical formulations. Marketed under strict quality management and regulatory compliance."
									})]
								}),
								/* @__PURE__ */ jsxs("div", {
									className: "flex flex-wrap items-center gap-2 pt-1",
									children: [/* @__PURE__ */ jsxs("span", {
										className: "inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-white/5 border border-white/10 text-[11px] font-medium text-amber-300",
										children: [/* @__PURE__ */ jsx(ShieldCheck, { className: "w-3.5 h-3.5 text-amber-400" }), /* @__PURE__ */ jsx("span", { children: isoCertification })]
									}), /* @__PURE__ */ jsxs("span", {
										className: "inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-white/5 border border-white/10 text-[11px] font-medium text-emerald-300",
										children: [/* @__PURE__ */ jsx(Award, { className: "w-3.5 h-3.5 text-emerald-400" }), /* @__PURE__ */ jsx("span", { children: "WHO-GMP Partnered" })]
									})]
								}),
								/* @__PURE__ */ jsxs("div", {
									className: "inline-flex items-center gap-2 px-3 py-1 rounded-lg bg-slate-900/80 border border-[#c59324]/30 text-xs",
									children: [/* @__PURE__ */ jsx("span", {
										className: "italic font-black text-amber-400",
										children: "fssai"
									}), /* @__PURE__ */ jsxs("span", {
										className: "text-slate-400 text-[11px]",
										children: ["Lic. No. ", /* @__PURE__ */ jsx("strong", {
											className: "text-amber-200 font-mono font-semibold",
											children: fssaiLicNo
										})]
									})]
								})
							]
						}),
						/* @__PURE__ */ jsxs("div", {
							className: "lg:col-span-2 space-y-4",
							children: [/* @__PURE__ */ jsx("h4", {
								className: "text-xs font-bold text-white uppercase tracking-wider border-b border-white/10 pb-2.5",
								children: "Explore"
							}), /* @__PURE__ */ jsxs("ul", {
								className: "space-y-2.5 text-xs",
								children: [
									/* @__PURE__ */ jsx("li", { children: /* @__PURE__ */ jsxs(Link, {
										href: "/",
										className: "hover:text-amber-300 transition-colors inline-flex items-center gap-1 text-slate-300",
										children: [/* @__PURE__ */ jsx(ChevronRight, { className: "w-3 h-3 text-[#c59324]" }), /* @__PURE__ */ jsx("span", { children: "Home" })]
									}) }),
									/* @__PURE__ */ jsx("li", { children: /* @__PURE__ */ jsxs(Link, {
										href: "/about",
										className: "hover:text-amber-300 transition-colors inline-flex items-center gap-1 text-slate-300",
										children: [/* @__PURE__ */ jsx(ChevronRight, { className: "w-3 h-3 text-[#c59324]" }), /* @__PURE__ */ jsx("span", { children: "About Us" })]
									}) }),
									/* @__PURE__ */ jsx("li", { children: /* @__PURE__ */ jsxs(Link, {
										href: "/products",
										className: "hover:text-amber-300 transition-colors inline-flex items-center gap-1 text-slate-300",
										children: [/* @__PURE__ */ jsx(ChevronRight, { className: "w-3 h-3 text-[#c59324]" }), /* @__PURE__ */ jsx("span", { children: "Our Formulations" })]
									}) }),
									/* @__PURE__ */ jsx("li", { children: /* @__PURE__ */ jsxs(Link, {
										href: "/quality",
										className: "hover:text-amber-300 transition-colors inline-flex items-center gap-1 text-slate-300",
										children: [/* @__PURE__ */ jsx(ChevronRight, { className: "w-3 h-3 text-[#c59324]" }), /* @__PURE__ */ jsx("span", { children: "Quality Assurance" })]
									}) }),
									/* @__PURE__ */ jsx("li", { children: /* @__PURE__ */ jsxs(Link, {
										href: "/contact",
										className: "hover:text-amber-300 transition-colors inline-flex items-center gap-1 text-slate-300",
										children: [/* @__PURE__ */ jsx(ChevronRight, { className: "w-3 h-3 text-[#c59324]" }), /* @__PURE__ */ jsx("span", { children: "Contact Corporate Desk" })]
									}) }),
									/* @__PURE__ */ jsx("li", {
										className: "pt-1",
										children: /* @__PURE__ */ jsxs(Link, {
											href: "/login",
											className: "inline-flex items-center gap-1 text-amber-300 hover:text-white font-semibold",
											children: [/* @__PURE__ */ jsx("span", { children: "MR Connect Portal" }), /* @__PURE__ */ jsx(ArrowUpRight, { className: "w-3 h-3" })]
										})
									})
								]
							})]
						}),
						/* @__PURE__ */ jsxs("div", {
							className: "lg:col-span-3 space-y-4",
							children: [
								/* @__PURE__ */ jsx("h4", {
									className: "text-xs font-bold text-white uppercase tracking-wider border-b border-white/10 pb-2.5",
									children: "Registered Office"
								}),
								/* @__PURE__ */ jsxs("div", {
									className: "space-y-2 text-xs text-slate-300 leading-relaxed",
									children: [
										/* @__PURE__ */ jsxs("div", {
											className: "flex items-start gap-2.5",
											children: [/* @__PURE__ */ jsx(MapPin, { className: "w-4 h-4 text-[#c59324] shrink-0 mt-0.5" }), /* @__PURE__ */ jsxs("p", { children: [
												headquarters,
												", ",
												city,
												", ",
												state,
												", ",
												country,
												"-",
												postalCode
											] })]
										}),
										/* @__PURE__ */ jsxs("div", {
											className: "flex items-center gap-2.5 pt-1",
											children: [/* @__PURE__ */ jsx(Mail, { className: "w-4 h-4 text-[#c59324] shrink-0" }), /* @__PURE__ */ jsx("a", {
												href: `mailto:${email}`,
												className: "text-amber-200 hover:text-white transition-colors underline",
												children: email
											})]
										}),
										/* @__PURE__ */ jsxs("div", {
											className: "flex items-center gap-2.5",
											children: [/* @__PURE__ */ jsx(Globe, { className: "w-4 h-4 text-[#c59324] shrink-0" }), /* @__PURE__ */ jsx("a", {
												href: website,
												target: "_blank",
												rel: "noopener noreferrer",
												className: "text-amber-200 hover:text-white transition-colors underline",
												children: "www.ciplonpharma.in"
											})]
										})
									]
								}),
								/* @__PURE__ */ jsxs("div", {
									className: "pt-2 border-t border-white/10 space-y-1",
									children: [
										/* @__PURE__ */ jsx("span", {
											className: "text-[11px] font-semibold text-slate-400 block uppercase tracking-wider",
											children: "Manufacturing Partners:"
										}),
										/* @__PURE__ */ jsx("p", {
											className: "text-xs text-slate-300 font-medium",
											children: manufacturerName
										}),
										/* @__PURE__ */ jsx("p", {
											className: "text-[11px] text-amber-300/80",
											children: manufacturerCert
										})
									]
								})
							]
						}),
						/* @__PURE__ */ jsxs("div", {
							className: "lg:col-span-3 space-y-4",
							children: [
								/* @__PURE__ */ jsx("h4", {
									className: "text-xs font-bold text-white uppercase tracking-wider border-b border-white/10 pb-2.5",
									children: "Business Inquiries"
								}),
								/* @__PURE__ */ jsx("p", {
									className: "text-xs text-slate-400 leading-relaxed",
									children: "Partner with us for third-party manufacturing alliances, PCD franchise opportunities, institutional hospital supplies, and distribution networks."
								}),
								/* @__PURE__ */ jsxs("button", {
									type: "button",
									onClick: () => {
										if (typeof onOpenEnquiryModal === "function") onOpenEnquiryModal();
										else window.location.href = "/contact";
									},
									className: "w-full py-2.5 px-4 rounded-xl bg-gradient-to-r from-[#c59324] to-[#dfad36] hover:from-[#b0811d] hover:to-[#c59324] text-[#071527] font-bold text-xs uppercase tracking-wider transition-all cursor-pointer flex items-center justify-center gap-2 shadow-sm",
									children: [/* @__PURE__ */ jsx("span", { children: "Partner With Us" }), /* @__PURE__ */ jsx(ArrowUpRight, { className: "w-4 h-4" })]
								}),
								/* @__PURE__ */ jsxs("div", {
									className: "pt-2 text-[11px] text-slate-400 space-y-1",
									children: [/* @__PURE__ */ jsx("p", {
										className: "text-amber-300/90 font-medium",
										children: trademarkStatus
									}), /* @__PURE__ */ jsx("p", {
										className: "text-slate-500",
										children: "All formulations comply strictly with Schedule M & cGMP norms."
									})]
								})
							]
						})
					]
				}) })
			}),
			/* @__PURE__ */ jsx("div", {
				className: "py-5 bg-[#040c17] text-slate-400 text-xs border-t border-white/5",
				children: /* @__PURE__ */ jsx(Container, { children: /* @__PURE__ */ jsxs("div", {
					className: "flex flex-col sm:flex-row items-center justify-between gap-3 text-center sm:text-left",
					children: [/* @__PURE__ */ jsxs("p", {
						className: "text-[11px] sm:text-xs text-slate-400",
						children: [
							"© ",
							CURRENT_YEAR,
							" ",
							/* @__PURE__ */ jsx("span", {
								className: "text-white font-medium",
								children: legalName
							}),
							". All rights reserved."
						]
					}), /* @__PURE__ */ jsxs("div", {
						className: "flex flex-wrap items-center justify-center gap-4 text-[11px] sm:text-xs text-slate-400",
						children: [
							/* @__PURE__ */ jsx(Link, {
								href: "/about",
								className: "hover:text-amber-300 transition-colors",
								children: "About"
							}),
							/* @__PURE__ */ jsx("span", { children: "•" }),
							/* @__PURE__ */ jsx(Link, {
								href: "/products",
								className: "hover:text-amber-300 transition-colors",
								children: "Products"
							}),
							/* @__PURE__ */ jsx("span", { children: "•" }),
							/* @__PURE__ */ jsx(Link, {
								href: "/contact",
								className: "hover:text-amber-300 transition-colors",
								children: "Contact"
							}),
							/* @__PURE__ */ jsx("span", { children: "•" }),
							/* @__PURE__ */ jsx("span", {
								className: "text-slate-500",
								children: "ISO 9001:2015"
							})
						]
					})]
				}) })
			})
		]
	});
}
//#endregion
//#region resources/js/components/home/EnquiryModal.jsx
function EnquiryModal({ isOpen, onClose, initialProduct = null }) {
	const [formData, setFormData] = useState({
		fullName: "",
		email: "",
		organization: "",
		country: "",
		enquiryType: initialProduct ? "Product Formulation Enquiry" : "Commercial Partnership",
		productName: initialProduct ? `${initialProduct.brandName} (${initialProduct.genericName})` : "",
		message: ""
	});
	const [isSubmitting, setIsSubmitting] = useState(false);
	const [isSuccess, setIsSuccess] = useState(false);
	if (!isOpen) return null;
	const handleChange = (e) => {
		setFormData((prev) => ({
			...prev,
			[e.target.name]: e.target.value
		}));
	};
	const handleSubmit = (e) => {
		e.preventDefault();
		setIsSubmitting(true);
		router.post("/enquiry", {
			name: formData.fullName,
			email: formData.email,
			organization: formData.organization,
			country: formData.country,
			message: formData.message,
			product_name: formData.productName || formData.enquiryType
		}, {
			preserveScroll: true,
			onSuccess: () => {
				setIsSuccess(true);
				toast.success("Enquiry submitted successfully!");
				setIsSubmitting(false);
			},
			onError: () => {
				toast.error("Unable to submit enquiry. Please check your input.");
				setIsSubmitting(false);
			}
		});
	};
	const handleResetAndClose = () => {
		setIsSuccess(false);
		onClose();
	};
	return /* @__PURE__ */ jsx("div", {
		className: "fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-in fade-in duration-200",
		children: /* @__PURE__ */ jsxs("div", {
			className: "bg-white rounded-3xl max-w-xl w-full max-h-[92vh] overflow-y-auto shadow-2xl border border-slate-200 relative",
			role: "dialog",
			"aria-modal": "true",
			children: [/* @__PURE__ */ jsxs("div", {
				className: "p-6 sm:p-7 bg-gradient-to-r from-[#0c2340] via-[#07172b] to-[#0c2340] text-white rounded-t-3xl relative border-b border-[#c59324]/20",
				children: [
					/* @__PURE__ */ jsx("button", {
						onClick: handleResetAndClose,
						className: "absolute top-6 right-6 p-2 rounded-full text-slate-400 hover:text-white hover:bg-white/10 transition-colors cursor-pointer",
						"aria-label": "Close modal",
						children: /* @__PURE__ */ jsx(X, { className: "w-5 h-5" })
					}),
					/* @__PURE__ */ jsx("span", {
						className: "text-[11px] font-mono tracking-wider uppercase text-[#dfad36] font-semibold",
						children: "Institutional & Distributor Desk"
					}),
					/* @__PURE__ */ jsx("h3", {
						className: "text-xl sm:text-2xl font-bold text-white mt-1",
						children: initialProduct ? `Inquire: ${initialProduct.brandName}` : "Pharmaceutical Business Enquiry"
					}),
					/* @__PURE__ */ jsx("p", {
						className: "text-xs text-slate-300 mt-1",
						children: "Connect with our regulatory affairs and commercial distribution team."
					})
				]
			}), /* @__PURE__ */ jsx("div", {
				className: "p-6 sm:p-7",
				children: isSuccess ? /* @__PURE__ */ jsxs("div", {
					className: "py-8 text-center space-y-4",
					children: [
						/* @__PURE__ */ jsx("div", {
							className: "w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto",
							children: /* @__PURE__ */ jsx(CheckCircle2, { className: "w-8 h-8" })
						}),
						/* @__PURE__ */ jsx("h4", {
							className: "text-xl font-bold text-slate-900",
							children: "Enquiry Received"
						}),
						/* @__PURE__ */ jsx("p", {
							className: "text-sm text-slate-600 max-w-md mx-auto leading-relaxed",
							children: "Thank you for reaching out. A representative from our commercial and regulatory licensing desk will review your details and contact you within 24–48 hours."
						}),
						/* @__PURE__ */ jsx("div", {
							className: "pt-4",
							children: /* @__PURE__ */ jsx(Button, {
								variant: "primary",
								onClick: handleResetAndClose,
								children: "Done"
							})
						})
					]
				}) : /* @__PURE__ */ jsxs("form", {
					onSubmit: handleSubmit,
					className: "space-y-4 text-sm",
					children: [
						/* @__PURE__ */ jsxs("div", {
							className: "grid grid-cols-1 sm:grid-cols-2 gap-4",
							children: [/* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("label", {
								className: "block text-xs font-semibold text-slate-700 mb-1",
								children: "Full Name *"
							}), /* @__PURE__ */ jsx("input", {
								type: "text",
								required: true,
								name: "fullName",
								value: formData.fullName,
								onChange: handleChange,
								placeholder: "e.g. Dr. Robert Chen",
								className: "w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-teal-600 text-slate-900 text-xs sm:text-sm"
							})] }), /* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("label", {
								className: "block text-xs font-semibold text-slate-700 mb-1",
								children: "Corporate / Official Email *"
							}), /* @__PURE__ */ jsx("input", {
								type: "email",
								required: true,
								name: "email",
								value: formData.email,
								onChange: handleChange,
								placeholder: "name@company.com",
								className: "w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-teal-600 text-slate-900 text-xs sm:text-sm"
							})] })]
						}),
						/* @__PURE__ */ jsxs("div", {
							className: "grid grid-cols-1 sm:grid-cols-2 gap-4",
							children: [/* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("label", {
								className: "block text-xs font-semibold text-slate-700 mb-1",
								children: "Organization / Institution *"
							}), /* @__PURE__ */ jsx("input", {
								type: "text",
								required: true,
								name: "organization",
								value: formData.organization,
								onChange: handleChange,
								placeholder: "Hospital, Distributor or Agency",
								className: "w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-teal-600 text-slate-900 text-xs sm:text-sm"
							})] }), /* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("label", {
								className: "block text-xs font-semibold text-slate-700 mb-1",
								children: "Country / Market *"
							}), /* @__PURE__ */ jsx("input", {
								type: "text",
								required: true,
								name: "country",
								value: formData.country,
								onChange: handleChange,
								placeholder: "e.g. Germany, UAE, Canada",
								className: "w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-teal-600 text-slate-900 text-xs sm:text-sm"
							})] })]
						}),
						/* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("label", {
							className: "block text-xs font-semibold text-slate-700 mb-1",
							children: "Enquiry Category"
						}), /* @__PURE__ */ jsxs("select", {
							name: "enquiryType",
							value: formData.enquiryType,
							onChange: handleChange,
							className: "w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-teal-600 text-slate-900 text-xs sm:text-sm bg-white",
							children: [
								/* @__PURE__ */ jsx("option", {
									value: "Commercial Partnership",
									children: "Distribution & Licensing Partnership"
								}),
								/* @__PURE__ */ jsx("option", {
									value: "Product Formulation Enquiry",
									children: "Finished Formulation Specifications"
								}),
								/* @__PURE__ */ jsx("option", {
									value: "Contract Manufacturing",
									children: "Contract Formulation & Packaging"
								}),
								/* @__PURE__ */ jsx("option", {
									value: "Hospital & Tender Supply",
									children: "Institutional / Hospital Tender Supply"
								}),
								/* @__PURE__ */ jsx("option", {
									value: "General Corporate",
									children: "General Corporate Communications"
								})
							]
						})] }),
						formData.productName && /* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("label", {
							className: "block text-xs font-semibold text-slate-700 mb-1",
							children: "Referenced Formulation"
						}), /* @__PURE__ */ jsx("input", {
							type: "text",
							readOnly: true,
							value: formData.productName,
							className: "w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-slate-700 text-xs font-mono"
						})] }),
						/* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("label", {
							className: "block text-xs font-semibold text-slate-700 mb-1",
							children: "Requirements & Details *"
						}), /* @__PURE__ */ jsx("textarea", {
							rows: "3",
							required: true,
							name: "message",
							value: formData.message,
							onChange: handleChange,
							placeholder: "Specify target volume, registration dossier requirement, or destination market...",
							className: "w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-teal-600 text-slate-900 text-xs sm:text-sm resize-none"
						})] }),
						/* @__PURE__ */ jsxs("div", {
							className: "p-3 rounded-xl bg-slate-50 border border-slate-200 text-[11px] text-slate-500 flex items-center gap-2",
							children: [/* @__PURE__ */ jsx(ShieldCheck, { className: "w-4 h-4 text-[#c59324] shrink-0" }), /* @__PURE__ */ jsx("span", { children: "All proprietary business information is handled under commercial non-disclosure protocols." })]
						}),
						/* @__PURE__ */ jsxs("div", {
							className: "pt-2 flex items-center justify-end gap-3",
							children: [/* @__PURE__ */ jsx(Button, {
								variant: "ghost",
								size: "sm",
								onClick: handleResetAndClose,
								children: "Cancel"
							}), /* @__PURE__ */ jsx(Button, {
								variant: "primary",
								size: "md",
								type: "submit",
								icon: Send,
								disabled: isSubmitting,
								children: isSubmitting ? "Sending Request..." : "Submit Official Enquiry"
							})]
						})
					]
				})
			})]
		})
	});
}
//#endregion
//#region resources/js/layouts/PublicLayout.jsx
function PublicLayout({ children, companyData: propCompanyData, categories: propCategories }) {
	const { url, props } = usePage();
	const companyData = propCompanyData || props.company || {};
	const categories = propCategories || props.navCategories || [];
	const [isEnquiryModalOpen, setIsEnquiryModalOpen] = useState(false);
	useEffect(() => {
		window.scrollTo({
			top: 0,
			behavior: "instant"
		});
	}, [url]);
	return /* @__PURE__ */ jsxs("div", {
		className: "min-h-screen flex flex-col bg-white text-slate-900 selection:bg-[#c59324] selection:text-white antialiased",
		children: [
			/* @__PURE__ */ jsx(Header, {
				companyData,
				categories,
				onOpenEnquiryModal: () => setIsEnquiryModalOpen(true)
			}),
			/* @__PURE__ */ jsx("main", {
				className: "flex-1 w-full",
				children: typeof children === "function" ? children({ openEnquiryModal: () => setIsEnquiryModalOpen(true) }) : children
			}),
			/* @__PURE__ */ jsx(Footer, {
				companyData,
				categories
			}),
			/* @__PURE__ */ jsx(EnquiryModal, {
				isOpen: isEnquiryModalOpen,
				onClose: () => setIsEnquiryModalOpen(false)
			})
		]
	});
}
//#endregion
//#region resources/js/components/common/SeoHead.jsx
/**
* SeoHead component for dynamic page SEO, OpenGraph, Twitter Cards, and JSON-LD schema
*/
function SeoHead({ title, description, keywords, canonicalUrl, ogImage = "/images/ciplon_logo.png", ogType = "website", schemaJson }) {
	const defaultTitle = "Ciplon Pharma — WHO-GMP & ISO 9001:2015 Certified Finished Formulations";
	const defaultDesc = "Ciplon Pharma Private Limited is an ISO 9001:2015 certified pharmaceutical company providing WHO-GMP finished formulations, PCD pharma franchises, and institutional supply across India.";
	const defaultKeywords = "Ciplon Pharma, pharmaceutical manufacturer, WHO-GMP formulations, PCD pharma franchise India, medicine third party manufacturing, pharmaceutical distributor Delhi, Walpar Wellness";
	const metaTitle = title ? `${title} | Ciplon Pharma` : defaultTitle;
	const metaDescription = description || defaultDesc;
	return /* @__PURE__ */ jsxs(Head, { children: [
		/* @__PURE__ */ jsx("title", { children: metaTitle }),
		/* @__PURE__ */ jsx("meta", {
			name: "description",
			content: metaDescription
		}),
		/* @__PURE__ */ jsx("meta", {
			name: "keywords",
			content: keywords || defaultKeywords
		}),
		/* @__PURE__ */ jsx("meta", {
			name: "robots",
			content: "index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1"
		}),
		canonicalUrl && /* @__PURE__ */ jsx("link", {
			rel: "canonical",
			href: canonicalUrl
		}),
		/* @__PURE__ */ jsx("meta", {
			property: "og:title",
			content: metaTitle
		}),
		/* @__PURE__ */ jsx("meta", {
			property: "og:description",
			content: metaDescription
		}),
		/* @__PURE__ */ jsx("meta", {
			property: "og:type",
			content: ogType
		}),
		canonicalUrl && /* @__PURE__ */ jsx("meta", {
			property: "og:url",
			content: canonicalUrl
		}),
		/* @__PURE__ */ jsx("meta", {
			property: "og:image",
			content: ogImage
		}),
		/* @__PURE__ */ jsx("meta", {
			property: "og:site_name",
			content: "Ciplon Pharma Private Limited"
		}),
		/* @__PURE__ */ jsx("meta", {
			property: "og:locale",
			content: "en_IN"
		}),
		/* @__PURE__ */ jsx("meta", {
			name: "twitter:card",
			content: "summary_large_image"
		}),
		/* @__PURE__ */ jsx("meta", {
			name: "twitter:title",
			content: metaTitle
		}),
		/* @__PURE__ */ jsx("meta", {
			name: "twitter:description",
			content: metaDescription
		}),
		/* @__PURE__ */ jsx("meta", {
			name: "twitter:image",
			content: ogImage
		}),
		/* @__PURE__ */ jsx("meta", {
			name: "twitter:site",
			content: "@ciplon_pharma"
		}),
		schemaJson && /* @__PURE__ */ jsx("script", {
			type: "application/ld+json",
			dangerouslySetInnerHTML: { __html: JSON.stringify(schemaJson) }
		})
	] });
}
//#endregion
//#region resources/js/Pages/public/AboutPage.jsx
var AboutPage_exports = /* @__PURE__ */ __exportAll({ default: () => AboutPage });
function AboutPage({ company, categories = [], featuredProducts = [] }) {
	return /* @__PURE__ */ jsxs(PublicLayout, {
		companyData: company || {},
		categories,
		children: [/* @__PURE__ */ jsx(SeoHead, {
			title: "About Us — Corporate Profile & Manufacturing Heritage",
			description: "Learn about Ciplon Pharma Private Limited, our ISO 9001:2015 certification, our WHO-GMP manufacturing partner Walpar Wellness Pvt. Ltd., and our mission to provide affordable quality healthcare.",
			canonicalUrl: "https://www.ciplonpharma.in/about"
		}), /* @__PURE__ */ jsxs("div", {
			className: "bg-white text-slate-900",
			children: [
				/* @__PURE__ */ jsxs("section", {
					className: "relative py-16 sm:py-24 bg-gradient-to-r from-[#0c2340] via-[#07172b] to-[#040e1b] text-white overflow-hidden border-b border-[#c59324]/20",
					children: [/* @__PURE__ */ jsx("div", {
						className: "absolute inset-0 opacity-15 pointer-events-none",
						children: /* @__PURE__ */ jsxs("svg", {
							className: "w-full h-full",
							xmlns: "http://www.w3.org/2000/svg",
							children: [/* @__PURE__ */ jsx("defs", { children: /* @__PURE__ */ jsx("pattern", {
								id: "aboutGrid",
								width: "40",
								height: "40",
								patternUnits: "userSpaceOnUse",
								children: /* @__PURE__ */ jsx("circle", {
									cx: "20",
									cy: "20",
									r: "1.5",
									fill: "#c59324"
								})
							}) }), /* @__PURE__ */ jsx("rect", {
								width: "100%",
								height: "100%",
								fill: "url(#aboutGrid)"
							})]
						})
					}), /* @__PURE__ */ jsx(Container, {
						size: "wide",
						className: "relative z-10",
						children: /* @__PURE__ */ jsxs("div", {
							className: "max-w-3xl",
							children: [
								/* @__PURE__ */ jsxs("div", {
									className: "inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#c59324]/20 border border-[#c59324]/40 text-[#dfad36] text-xs font-semibold uppercase tracking-wider mb-5",
									children: [/* @__PURE__ */ jsx(Sparkles, { className: "w-3.5 h-3.5" }), "Corporate Profile & Heritage"]
								}),
								/* @__PURE__ */ jsxs("h1", {
									className: "text-3xl sm:text-5xl font-bold tracking-tight text-white leading-tight",
									children: [
										"Committed to ",
										/* @__PURE__ */ jsx("span", {
											className: "text-[#dfad36]",
											children: "Healthcare Excellence"
										}),
										" & Scientific Innovation"
									]
								}),
								/* @__PURE__ */ jsx("p", {
									className: "mt-5 text-base sm:text-lg text-slate-300 leading-relaxed font-normal",
									children: "Ciplon Pharma Private Limited is an ISO 9001:2015 certified pharmaceutical formulations enterprise dedicated to delivering dependable, bioequivalent, and accessible therapeutics across clinical disciplines."
								}),
								/* @__PURE__ */ jsxs("div", {
									className: "mt-8 flex flex-wrap items-center gap-4",
									children: [/* @__PURE__ */ jsxs(Link, {
										href: "/products",
										className: "px-6 py-3 rounded-xl bg-gradient-to-r from-[#c59324] to-[#dfad36] text-[#07172b] font-semibold text-sm hover:brightness-105 transition-all shadow-md flex items-center gap-2",
										children: ["Explore Formulations", /* @__PURE__ */ jsx(ArrowRight, { className: "w-4 h-4" })]
									}), /* @__PURE__ */ jsx(Link, {
										href: "/contact",
										className: "px-6 py-3 rounded-xl bg-white/10 hover:bg-white/15 text-white font-semibold text-sm border border-white/20 transition-all",
										children: "Partner With Us"
									})]
								})
							]
						})
					})]
				}),
				/* @__PURE__ */ jsx("section", {
					className: "py-16 sm:py-24 bg-slate-50 border-b border-slate-200",
					children: /* @__PURE__ */ jsx(Container, {
						size: "wide",
						children: /* @__PURE__ */ jsxs("div", {
							className: "grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center",
							children: [/* @__PURE__ */ jsxs("div", { children: [
								/* @__PURE__ */ jsx("span", {
									className: "text-xs font-bold uppercase tracking-widest text-[#c59324]",
									children: "Who We Are"
								}),
								/* @__PURE__ */ jsx("h2", {
									className: "text-2xl sm:text-4xl font-bold text-[#0c2340] mt-2 mb-6",
									children: "Pioneering Therapeutics with Human Warmth & Clinical Rigor"
								}),
								/* @__PURE__ */ jsxs("div", {
									className: "space-y-4 text-slate-600 text-sm sm:text-base leading-relaxed",
									children: [/* @__PURE__ */ jsxs("p", { children: [
										"Rooted in India’s dynamic pharmaceutical landscape, ",
										/* @__PURE__ */ jsx("strong", { children: "Ciplon Pharma Private Limited" }),
										" combines scientific research with modern formulation technology. Our portfolio spans prescription medicines, specialty injectables, oral solid dosages, and targeted nutraceutical therapeutics."
									] }), /* @__PURE__ */ jsx("p", { children: "Every Ciplon brand undergoes comprehensive testing to ensure bioavailability, physiological stability, and therapeutic efficacy. We maintain stringent adherence to Indian Pharmacopoeia (IP), British Pharmacopoeia (BP), and United States Pharmacopeia (USP) monographs." })]
								}),
								/* @__PURE__ */ jsxs("div", {
									className: "mt-8 grid grid-cols-2 gap-4",
									children: [/* @__PURE__ */ jsxs("div", {
										className: "p-4 rounded-xl bg-white border border-slate-200 shadow-xs",
										children: [
											/* @__PURE__ */ jsx("span", {
												className: "text-xs text-slate-500 uppercase font-semibold block",
												children: "Quality Standard"
											}),
											/* @__PURE__ */ jsx("span", {
												className: "text-base font-bold text-[#0c2340] mt-1 block",
												children: "ISO 9001:2015"
											}),
											/* @__PURE__ */ jsx("span", {
												className: "text-xs text-slate-500 mt-0.5 block",
												children: "Certified QMS Protocol"
											})
										]
									}), /* @__PURE__ */ jsxs("div", {
										className: "p-4 rounded-xl bg-white border border-slate-200 shadow-xs",
										children: [
											/* @__PURE__ */ jsx("span", {
												className: "text-xs text-slate-500 uppercase font-semibold block",
												children: "Regulatory Lic."
											}),
											/* @__PURE__ */ jsx("span", {
												className: "text-base font-bold text-[#0c2340] mt-1 block",
												children: "FSSAI 10426340000172"
											}),
											/* @__PURE__ */ jsx("span", {
												className: "text-xs text-slate-500 mt-0.5 block",
												children: "Central Safety Approval"
											})
										]
									})]
								})
							] }), /* @__PURE__ */ jsxs("div", {
								className: "relative",
								children: [/* @__PURE__ */ jsxs("div", {
									className: "rounded-3xl overflow-hidden shadow-2xl border-4 border-white aspect-[4/3] bg-slate-900 relative",
									children: [/* @__PURE__ */ jsx("img", {
										src: "/images/hero_indian_doctors.jpg",
										alt: "Indian Medical Professionals at Ciplon",
										className: "w-full h-full object-cover"
									}), /* @__PURE__ */ jsx("div", {
										className: "absolute inset-0 bg-gradient-to-t from-[#0c2340]/80 via-transparent to-transparent flex items-end p-6",
										children: /* @__PURE__ */ jsxs("div", {
											className: "text-white",
											children: [/* @__PURE__ */ jsx("p", {
												className: "text-xs uppercase tracking-wider text-[#dfad36] font-semibold",
												children: "Medical Excellence"
											}), /* @__PURE__ */ jsx("p", {
												className: "text-base sm:text-lg font-bold",
												children: "Trusted by Clinicians & Healthcare Specialists Across India"
											})]
										})
									})]
								}), /* @__PURE__ */ jsxs("div", {
									className: "hidden sm:flex absolute -bottom-6 -left-6 bg-[#0c2340] text-white p-5 rounded-2xl shadow-xl border border-[#c59324]/30 items-center gap-4 max-w-xs",
									children: [/* @__PURE__ */ jsx("div", {
										className: "w-12 h-12 rounded-full bg-[#c59324]/20 border border-[#c59324] flex items-center justify-center text-[#dfad36] shrink-0",
										children: /* @__PURE__ */ jsx(Factory, { className: "w-6 h-6" })
									}), /* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("p", {
										className: "text-xs text-slate-300",
										children: "Mfg Partner"
									}), /* @__PURE__ */ jsx("p", {
										className: "text-sm font-bold text-white leading-snug",
										children: "Walpar Wellness Pvt. Ltd. (WHO-GMP)"
									})] })]
								})]
							})]
						})
					})
				}),
				/* @__PURE__ */ jsx("section", {
					className: "py-16 sm:py-24 bg-white",
					children: /* @__PURE__ */ jsxs(Container, {
						size: "wide",
						children: [/* @__PURE__ */ jsxs("div", {
							className: "text-center max-w-2xl mx-auto mb-14",
							children: [
								/* @__PURE__ */ jsx("span", {
									className: "text-xs font-bold uppercase tracking-widest text-[#c59324]",
									children: "Guiding Pillars"
								}),
								/* @__PURE__ */ jsx("h2", {
									className: "text-2xl sm:text-4xl font-bold text-[#0c2340] mt-2",
									children: "Our Foundational Values"
								}),
								/* @__PURE__ */ jsx("div", { className: "w-16 h-1 bg-gradient-to-r from-[#c59324] to-[#dfad36] mx-auto mt-3 rounded-full" })
							]
						}), /* @__PURE__ */ jsx("div", {
							className: "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6",
							children: [
								{
									title: "Uncompromising Quality",
									desc: "Formulations engineered in strictly audited WHO-GMP and ISO 9001:2015 certified facilities with rigorous batch-level HPLC purity verification.",
									icon: ShieldCheck
								},
								{
									title: "Accessible Healthcare",
									desc: "Bridging modern therapeutic innovation with economic affordability, ensuring life-saving medicines reach every community across India.",
									icon: HeartPulse
								},
								{
									title: "Research-Led Formulations",
									desc: "Active pipeline spanning specialty therapeutics, complex generics, preventive nutra-medicines, and stability-tested dosage forms.",
									icon: FlaskConical
								},
								{
									title: "Ethical Transparency",
									desc: "Committed to complete compliance integrity, transparent monographs, strict pharmacovigilance, and dependable physician trust.",
									icon: CheckCircle2
								}
							].map((v, i) => {
								const Icon = v.icon;
								return /* @__PURE__ */ jsxs("div", {
									className: "p-6 rounded-2xl bg-white border border-slate-200 hover:border-[#c59324]/50 hover:shadow-lg transition-all duration-300 flex flex-col group",
									children: [
										/* @__PURE__ */ jsx("div", {
											className: "w-12 h-12 rounded-xl bg-amber-50 group-hover:bg-[#c59324] text-[#c59324] group-hover:text-white flex items-center justify-center mb-5 transition-colors",
											children: /* @__PURE__ */ jsx(Icon, { className: "w-6 h-6 stroke-[2]" })
										}),
										/* @__PURE__ */ jsx("h3", {
											className: "text-base sm:text-lg font-bold text-[#0c2340] mb-2",
											children: v.title
										}),
										/* @__PURE__ */ jsx("p", {
											className: "text-xs sm:text-sm text-slate-600 leading-relaxed flex-1",
											children: v.desc
										})
									]
								}, i);
							})
						})]
					})
				}),
				/* @__PURE__ */ jsx("section", {
					className: "py-16 sm:py-24 bg-[#0c2340] text-white relative overflow-hidden",
					children: /* @__PURE__ */ jsx(Container, {
						size: "wide",
						children: /* @__PURE__ */ jsxs("div", {
							className: "grid grid-cols-1 lg:grid-cols-2 gap-12 items-center",
							children: [/* @__PURE__ */ jsx("div", {
								className: "order-2 lg:order-1 relative",
								children: /* @__PURE__ */ jsx("div", {
									className: "rounded-3xl overflow-hidden shadow-2xl border-4 border-white/10 aspect-[4/3] bg-slate-900",
									children: /* @__PURE__ */ jsx("img", {
										src: "/images/pharma_automation_line.jpg",
										alt: "WHO-GMP Automated Packaging & Manufacturing Line",
										className: "w-full h-full object-cover"
									})
								})
							}), /* @__PURE__ */ jsxs("div", {
								className: "order-1 lg:order-2",
								children: [
									/* @__PURE__ */ jsx("span", {
										className: "text-xs font-bold uppercase tracking-widest text-[#dfad36]",
										children: "Manufacturing Partner"
									}),
									/* @__PURE__ */ jsx("h2", {
										className: "text-2xl sm:text-4xl font-bold text-white mt-2 mb-6",
										children: "Walpar Wellness Pvt. Ltd. — Precision at Scale"
									}),
									/* @__PURE__ */ jsx("p", {
										className: "text-slate-300 text-sm sm:text-base leading-relaxed mb-6",
										children: "Our products are manufactured under rigorous compliance standards at Walpar Wellness Pvt. Ltd., located in Khatraj, Gandhinagar, Gujarat. The facility holds WHO-GMP certification and ISO 9001:2015 accreditation, featuring high-speed automated blistering, carton serialization, and HEPA air filtration."
									}),
									/* @__PURE__ */ jsxs("div", {
										className: "space-y-3.5",
										children: [
											/* @__PURE__ */ jsxs("div", {
												className: "flex items-start gap-3",
												children: [/* @__PURE__ */ jsx(CheckCircle2, { className: "w-5 h-5 text-[#dfad36] shrink-0 mt-0.5" }), /* @__PURE__ */ jsxs("span", {
													className: "text-xs sm:text-sm text-slate-200",
													children: [/* @__PURE__ */ jsx("strong", { children: "Unit Address:" }), " Plot No. 2/A & 06, Opp. Sabarmati Gas Station, Khatraj, Kalol, Gandhinagar, Gujarat - 382721"]
												})]
											}),
											/* @__PURE__ */ jsxs("div", {
												className: "flex items-start gap-3",
												children: [/* @__PURE__ */ jsx(CheckCircle2, { className: "w-5 h-5 text-[#dfad36] shrink-0 mt-0.5" }), /* @__PURE__ */ jsxs("span", {
													className: "text-xs sm:text-sm text-slate-200",
													children: [/* @__PURE__ */ jsx("strong", { children: "Microbiological & Stability:" }), " In-house analytical laboratories with Zone IVb climate stability chambers"]
												})]
											}),
											/* @__PURE__ */ jsxs("div", {
												className: "flex items-start gap-3",
												children: [/* @__PURE__ */ jsx(CheckCircle2, { className: "w-5 h-5 text-[#dfad36] shrink-0 mt-0.5" }), /* @__PURE__ */ jsxs("span", {
													className: "text-xs sm:text-sm text-slate-200",
													children: [/* @__PURE__ */ jsx("strong", { children: "Batch Traceability:" }), " Complete QR & tamper-proof carton seals on every production run"]
												})]
											})
										]
									}),
									/* @__PURE__ */ jsx("div", {
										className: "mt-8",
										children: /* @__PURE__ */ jsxs(Link, {
											href: "/quality",
											className: "inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-white/10 hover:bg-white/20 text-white font-semibold text-sm border border-white/20 transition-all",
											children: ["View Quality & Compliance Dossier", /* @__PURE__ */ jsx(ArrowRight, { className: "w-4 h-4 text-[#dfad36]" })]
										})
									})
								]
							})]
						})
					})
				}),
				/* @__PURE__ */ jsx("section", {
					className: "py-16 sm:py-24 bg-white",
					children: /* @__PURE__ */ jsxs(Container, {
						size: "wide",
						children: [/* @__PURE__ */ jsxs("div", {
							className: "text-center max-w-2xl mx-auto mb-14",
							children: [
								/* @__PURE__ */ jsx("span", {
									className: "text-xs font-bold uppercase tracking-widest text-[#c59324]",
									children: "Heritage"
								}),
								/* @__PURE__ */ jsx("h2", {
									className: "text-2xl sm:text-4xl font-bold text-[#0c2340] mt-2",
									children: "Our Path to Excellence"
								}),
								/* @__PURE__ */ jsx("div", { className: "w-16 h-1 bg-gradient-to-r from-[#c59324] to-[#dfad36] mx-auto mt-3 rounded-full" })
							]
						}), /* @__PURE__ */ jsx("div", {
							className: "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6",
							children: [
								{
									year: "Incorporation",
									title: "Founded with a Vision",
									desc: "Established Ciplon Pharma Private Limited with a core dedication to therapeutic excellence and patient-first healthcare."
								},
								{
									year: "WHO-GMP Alignment",
									title: "State-of-the-Art Partnering",
									desc: "Partnered with Walpar Wellness Pvt. Ltd. (Khatraj Unit) for automated, robotic manufacturing adhering to WHO-GMP standards."
								},
								{
									year: "ISO 9001:2015",
									title: "Quality System Certified",
									desc: "Attained formal ISO 9001:2015 quality management standards across all procurement, supply chain, and packaging stages."
								},
								{
									year: "Nationwide Expansion",
									title: "9,738+ Registrations",
									desc: "Scaled multi-state distribution channels, institutional hospital supply, and specialized medical representative networks."
								}
							].map((m, i) => /* @__PURE__ */ jsxs("div", {
								className: "p-6 rounded-2xl bg-slate-50 border border-slate-200 relative",
								children: [
									/* @__PURE__ */ jsx("span", {
										className: "text-xs font-bold text-[#c59324] tracking-wider uppercase block mb-1",
										children: m.year
									}),
									/* @__PURE__ */ jsx("h3", {
										className: "text-base font-bold text-[#0c2340] mb-2",
										children: m.title
									}),
									/* @__PURE__ */ jsx("p", {
										className: "text-xs sm:text-sm text-slate-600 leading-relaxed",
										children: m.desc
									})
								]
							}, i))
						})]
					})
				}),
				/* @__PURE__ */ jsx("section", {
					className: "py-14 bg-gradient-to-r from-[#0c2340] to-[#07172b] text-white text-center",
					children: /* @__PURE__ */ jsxs(Container, {
						size: "narrow",
						children: [
							/* @__PURE__ */ jsx("h2", {
								className: "text-2xl sm:text-3xl font-bold text-white mb-3",
								children: "Looking for Formulations or Distribution Partnerships?"
							}),
							/* @__PURE__ */ jsx("p", {
								className: "text-slate-300 text-sm sm:text-base max-w-xl mx-auto mb-7",
								children: "Connect with our corporate team for bulk supply, institutional partnerships, and third-party contracts."
							}),
							/* @__PURE__ */ jsxs("div", {
								className: "flex flex-wrap items-center justify-center gap-4",
								children: [/* @__PURE__ */ jsx(Link, {
									href: "/contact",
									className: "px-7 py-3 rounded-xl bg-gradient-to-r from-[#c59324] to-[#dfad36] text-[#07172b] font-semibold text-sm hover:brightness-105 transition-all shadow-md",
									children: "Contact Corporate Desk"
								}), /* @__PURE__ */ jsx(Link, {
									href: "/products",
									className: "px-7 py-3 rounded-xl bg-white/10 hover:bg-white/20 text-white font-semibold text-sm border border-white/20 transition-all",
									children: "Browse All Formulations"
								})]
							})
						]
					})
				})
			]
		})]
	});
}
//#endregion
//#region resources/js/Pages/public/ContactPage.jsx
var ContactPage_exports = /* @__PURE__ */ __exportAll({ default: () => ContactPage });
function ContactPage({ company }) {
	const companyData = company || {};
	const [submitted, setSubmitted] = useState(false);
	const { data, setData, post, processing, errors, reset } = useForm({
		name: "",
		email: "",
		phone: "",
		company: "",
		inquiry_type: "General Enquiry",
		message: ""
	});
	const handleSubmit = (e) => {
		e.preventDefault();
		post("/enquiry", {
			preserveScroll: true,
			onSuccess: () => {
				setSubmitted(true);
				reset();
			}
		});
	};
	return /* @__PURE__ */ jsxs(PublicLayout, {
		companyData,
		children: [/* @__PURE__ */ jsx(SeoHead, {
			title: "Contact Us & Commercial Inquiries — PCD Distributorship & Institutional Supply",
			description: "Contact Ciplon Pharma Private Limited for PCD pharma franchise inquiries, hospital supply, third-party manufacturing partnerships, or regulatory dossier requests.",
			canonicalUrl: "https://www.ciplonpharma.in/contact"
		}), /* @__PURE__ */ jsxs("div", {
			className: "bg-white text-slate-900",
			children: [
				/* @__PURE__ */ jsxs("section", {
					className: "relative py-16 sm:py-24 bg-gradient-to-r from-[#0c2340] via-[#07172b] to-[#040e1b] text-white overflow-hidden border-b border-[#c59324]/20",
					children: [/* @__PURE__ */ jsx("div", {
						className: "absolute inset-0 opacity-15 pointer-events-none",
						children: /* @__PURE__ */ jsxs("svg", {
							className: "w-full h-full",
							xmlns: "http://www.w3.org/2000/svg",
							children: [/* @__PURE__ */ jsx("defs", { children: /* @__PURE__ */ jsx("pattern", {
								id: "contactGrid",
								width: "40",
								height: "40",
								patternUnits: "userSpaceOnUse",
								children: /* @__PURE__ */ jsx("circle", {
									cx: "20",
									cy: "20",
									r: "1.5",
									fill: "#c59324"
								})
							}) }), /* @__PURE__ */ jsx("rect", {
								width: "100%",
								height: "100%",
								fill: "url(#contactGrid)"
							})]
						})
					}), /* @__PURE__ */ jsx(Container, {
						size: "wide",
						className: "relative z-10",
						children: /* @__PURE__ */ jsxs("div", {
							className: "max-w-3xl",
							children: [
								/* @__PURE__ */ jsxs("div", {
									className: "inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#c59324]/20 border border-[#c59324]/40 text-[#dfad36] text-xs font-semibold uppercase tracking-wider mb-5",
									children: [/* @__PURE__ */ jsx(Sparkles, { className: "w-3.5 h-3.5" }), "Connect With Us"]
								}),
								/* @__PURE__ */ jsxs("h1", {
									className: "text-3xl sm:text-5xl font-bold tracking-tight text-white leading-tight",
									children: ["Corporate Contacts & ", /* @__PURE__ */ jsx("span", {
										className: "text-[#dfad36]",
										children: "Commercial Inquiries"
									})]
								}),
								/* @__PURE__ */ jsx("p", {
									className: "mt-5 text-base sm:text-lg text-slate-300 leading-relaxed font-normal",
									children: "Whether you are seeking institutional bulk supply, PCD franchise distribution, contract manufacturing, or product dossiers, our pharmaceutical team is here to assist."
								})
							]
						})
					})]
				}),
				/* @__PURE__ */ jsx("section", {
					className: "py-16 sm:py-24 bg-slate-50 border-b border-slate-200",
					children: /* @__PURE__ */ jsx(Container, {
						size: "wide",
						children: /* @__PURE__ */ jsxs("div", {
							className: "grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16",
							children: [/* @__PURE__ */ jsxs("div", {
								className: "lg:col-span-5 space-y-6",
								children: [
									/* @__PURE__ */ jsxs("div", { children: [
										/* @__PURE__ */ jsx("span", {
											className: "text-xs font-bold uppercase tracking-widest text-[#c59324]",
											children: "Official Locations"
										}),
										/* @__PURE__ */ jsx("h2", {
											className: "text-2xl sm:text-3xl font-bold text-[#0c2340] mt-1 mb-4",
											children: "Registered Offices & Facilities"
										}),
										/* @__PURE__ */ jsx("p", {
											className: "text-sm text-slate-600 leading-relaxed",
											children: "Direct your correspondence to our registered corporate office or regulatory contact desk."
										})
									] }),
									/* @__PURE__ */ jsx("div", {
										className: "p-6 rounded-2xl bg-white border border-slate-200 shadow-xs hover:border-[#c59324]/40 transition-colors",
										children: /* @__PURE__ */ jsxs("div", {
											className: "flex items-start gap-4",
											children: [/* @__PURE__ */ jsx("div", {
												className: "w-12 h-12 rounded-xl bg-amber-50 border border-[#c59324]/30 text-[#c59324] flex items-center justify-center shrink-0",
												children: /* @__PURE__ */ jsx(Building2, { className: "w-6 h-6 stroke-[2]" })
											}), /* @__PURE__ */ jsxs("div", { children: [
												/* @__PURE__ */ jsx("span", {
													className: "text-xs font-bold uppercase tracking-wider text-[#c59324]",
													children: "Corporate Headquarters"
												}),
												/* @__PURE__ */ jsx("h3", {
													className: "text-base font-bold text-[#0c2340] mt-0.5 mb-1.5",
													children: "Ciplon Pharma Private Limited"
												}),
												/* @__PURE__ */ jsx("p", {
													className: "text-xs sm:text-sm text-slate-600 leading-relaxed",
													children: "M24/A, KH No. 294, 1st Floor, Batla House, Okhla, Jamia Nagar, South Delhi, Delhi - 110025, India"
												}),
												/* @__PURE__ */ jsxs("div", {
													className: "mt-3 pt-3 border-t border-slate-100 flex flex-wrap gap-2 text-xs font-medium text-slate-500",
													children: [/* @__PURE__ */ jsx("span", {
														className: "bg-slate-100 px-2 py-0.5 rounded",
														children: "ISO 9001:2015"
													}), /* @__PURE__ */ jsx("span", {
														className: "bg-slate-100 px-2 py-0.5 rounded",
														children: "FSSAI 10426340000172"
													})]
												})
											] })]
										})
									}),
									/* @__PURE__ */ jsx("div", {
										className: "p-6 rounded-2xl bg-white border border-slate-200 shadow-xs hover:border-[#c59324]/40 transition-colors",
										children: /* @__PURE__ */ jsxs("div", {
											className: "flex items-start gap-4",
											children: [/* @__PURE__ */ jsx("div", {
												className: "w-12 h-12 rounded-xl bg-slate-100 border border-slate-200 text-[#0c2340] flex items-center justify-center shrink-0",
												children: /* @__PURE__ */ jsx(Factory, { className: "w-6 h-6 stroke-[2]" })
											}), /* @__PURE__ */ jsxs("div", { children: [
												/* @__PURE__ */ jsx("span", {
													className: "text-xs font-bold uppercase tracking-wider text-slate-500",
													children: "Manufacturing Unit"
												}),
												/* @__PURE__ */ jsx("h3", {
													className: "text-base font-bold text-[#0c2340] mt-0.5 mb-1.5",
													children: "Walpar Wellness Pvt. Ltd."
												}),
												/* @__PURE__ */ jsx("p", {
													className: "text-xs sm:text-sm text-slate-600 leading-relaxed",
													children: "Plot No. 2/A & 06, Opp. Sabarmati Gas Station, Khatraj, Kalol, Gandhinagar, Gujarat - 382721"
												}),
												/* @__PURE__ */ jsxs("div", {
													className: "mt-3 pt-3 border-t border-slate-100 flex flex-wrap gap-2 text-xs font-medium text-slate-500",
													children: [/* @__PURE__ */ jsx("span", {
														className: "bg-amber-50 text-[#c59324] px-2 py-0.5 rounded font-semibold",
														children: "WHO-GMP Certified"
													}), /* @__PURE__ */ jsx("span", {
														className: "bg-slate-100 px-2 py-0.5 rounded",
														children: "Automated Lines"
													})]
												})
											] })]
										})
									}),
									/* @__PURE__ */ jsxs("div", {
										className: "p-6 rounded-2xl bg-[#0c2340] text-white",
										children: [/* @__PURE__ */ jsx("h4", {
											className: "text-sm font-bold text-[#dfad36] uppercase tracking-wider mb-4",
											children: "Direct Desks"
										}), /* @__PURE__ */ jsxs("div", {
											className: "space-y-3.5 text-xs sm:text-sm",
											children: [
												/* @__PURE__ */ jsxs("div", {
													className: "flex items-center gap-3",
													children: [/* @__PURE__ */ jsx(Mail, { className: "w-4 h-4 text-[#dfad36] shrink-0" }), /* @__PURE__ */ jsx("a", {
														href: "mailto:info@ciplonpharma.in",
														className: "text-slate-200 hover:text-white underline-offset-2 hover:underline",
														children: "info@ciplonpharma.in"
													})]
												}),
												/* @__PURE__ */ jsxs("div", {
													className: "flex items-center gap-3",
													children: [/* @__PURE__ */ jsx(Phone, { className: "w-4 h-4 text-[#dfad36] shrink-0" }), /* @__PURE__ */ jsx("span", {
														className: "text-slate-200",
														children: companyData?.company_phone || "+91 800 458 7290"
													})]
												}),
												/* @__PURE__ */ jsxs("div", {
													className: "flex items-center gap-3",
													children: [/* @__PURE__ */ jsx(Clock, { className: "w-4 h-4 text-[#dfad36] shrink-0" }), /* @__PURE__ */ jsx("span", {
														className: "text-slate-300",
														children: "Monday – Saturday: 9:30 AM – 6:30 PM IST"
													})]
												})
											]
										})]
									})
								]
							}), /* @__PURE__ */ jsx("div", {
								className: "lg:col-span-7",
								children: /* @__PURE__ */ jsxs("div", {
									className: "bg-white p-8 sm:p-10 rounded-3xl border border-slate-200 shadow-md",
									children: [/* @__PURE__ */ jsxs("div", {
										className: "mb-6",
										children: [
											/* @__PURE__ */ jsx("span", {
												className: "text-xs font-bold uppercase tracking-widest text-[#c59324]",
												children: "Inquiry Form"
											}),
											/* @__PURE__ */ jsx("h3", {
												className: "text-2xl font-bold text-[#0c2340] mt-1",
												children: "Send a Commercial Inquiry"
											}),
											/* @__PURE__ */ jsx("p", {
												className: "text-xs sm:text-sm text-slate-500 mt-1",
												children: "Fill out your requirements below and our commercial division will connect with you within 24 hours."
											})
										]
									}), submitted ? /* @__PURE__ */ jsxs("div", {
										className: "p-8 rounded-2xl bg-amber-50/80 border border-[#c59324]/40 text-center space-y-4",
										children: [
											/* @__PURE__ */ jsx("div", {
												className: "w-14 h-14 rounded-full bg-[#c59324] text-white flex items-center justify-center mx-auto shadow-md",
												children: /* @__PURE__ */ jsx(CheckCircle2, { className: "w-8 h-8" })
											}),
											/* @__PURE__ */ jsx("h4", {
												className: "text-xl font-bold text-[#0c2340]",
												children: "Inquiry Transmitted Successfully"
											}),
											/* @__PURE__ */ jsx("p", {
												className: "text-sm text-slate-600 max-w-md mx-auto",
												children: "Thank you for reaching out to Ciplon Pharma. Our regulatory and business desk will review your details and respond promptly."
											}),
											/* @__PURE__ */ jsx("button", {
												type: "button",
												onClick: () => setSubmitted(false),
												className: "px-6 py-2.5 rounded-xl bg-[#0c2340] text-white text-xs font-semibold hover:bg-slate-800 transition-all cursor-pointer",
												children: "Submit Another Inquiry"
											})
										]
									}) : /* @__PURE__ */ jsxs("form", {
										onSubmit: handleSubmit,
										className: "space-y-4 sm:space-y-5",
										children: [
											/* @__PURE__ */ jsxs("div", {
												className: "grid grid-cols-1 sm:grid-cols-2 gap-4",
												children: [/* @__PURE__ */ jsxs("div", { children: [
													/* @__PURE__ */ jsxs("label", {
														className: "block text-xs font-semibold text-slate-700 mb-1.5",
														children: ["Full Name ", /* @__PURE__ */ jsx("span", {
															className: "text-rose-500",
															children: "*"
														})]
													}),
													/* @__PURE__ */ jsx("input", {
														type: "text",
														required: true,
														value: data.name,
														onChange: (e) => setData("name", e.target.value),
														placeholder: "Dr. / Mr. / Ms. Full Name",
														className: "w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:border-[#c59324] focus:ring-2 focus:ring-[#c59324]/20 outline-none text-sm transition-all"
													}),
													errors.name && /* @__PURE__ */ jsx("p", {
														className: "text-rose-500 text-xs mt-1",
														children: errors.name
													})
												] }), /* @__PURE__ */ jsxs("div", { children: [
													/* @__PURE__ */ jsxs("label", {
														className: "block text-xs font-semibold text-slate-700 mb-1.5",
														children: ["Email Address ", /* @__PURE__ */ jsx("span", {
															className: "text-rose-500",
															children: "*"
														})]
													}),
													/* @__PURE__ */ jsx("input", {
														type: "email",
														required: true,
														value: data.email,
														onChange: (e) => setData("email", e.target.value),
														placeholder: "name@organization.com",
														className: "w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:border-[#c59324] focus:ring-2 focus:ring-[#c59324]/20 outline-none text-sm transition-all"
													}),
													errors.email && /* @__PURE__ */ jsx("p", {
														className: "text-rose-500 text-xs mt-1",
														children: errors.email
													})
												] })]
											}),
											/* @__PURE__ */ jsxs("div", {
												className: "grid grid-cols-1 sm:grid-cols-2 gap-4",
												children: [/* @__PURE__ */ jsxs("div", { children: [
													/* @__PURE__ */ jsxs("label", {
														className: "block text-xs font-semibold text-slate-700 mb-1.5",
														children: ["Phone / WhatsApp ", /* @__PURE__ */ jsx("span", {
															className: "text-rose-500",
															children: "*"
														})]
													}),
													/* @__PURE__ */ jsx("input", {
														type: "tel",
														required: true,
														value: data.phone,
														onChange: (e) => setData("phone", e.target.value),
														placeholder: "+91 98765 43210",
														className: "w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:border-[#c59324] focus:ring-2 focus:ring-[#c59324]/20 outline-none text-sm transition-all"
													}),
													errors.phone && /* @__PURE__ */ jsx("p", {
														className: "text-rose-500 text-xs mt-1",
														children: errors.phone
													})
												] }), /* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("label", {
													className: "block text-xs font-semibold text-slate-700 mb-1.5",
													children: "Organization / Hospital / Distributor"
												}), /* @__PURE__ */ jsx("input", {
													type: "text",
													value: data.company,
													onChange: (e) => setData("company", e.target.value),
													placeholder: "Hospital / Pharmacy / Distributor Name",
													className: "w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:border-[#c59324] focus:ring-2 focus:ring-[#c59324]/20 outline-none text-sm transition-all"
												})] })]
											}),
											/* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("label", {
												className: "block text-xs font-semibold text-slate-700 mb-1.5",
												children: "Inquiry Nature"
											}), /* @__PURE__ */ jsxs("select", {
												value: data.inquiry_type,
												onChange: (e) => setData("inquiry_type", e.target.value),
												className: "w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:border-[#c59324] focus:ring-2 focus:ring-[#c59324]/20 outline-none text-sm bg-white transition-all",
												children: [
													/* @__PURE__ */ jsx("option", {
														value: "General Enquiry",
														children: "General Corporate Inquiry"
													}),
													/* @__PURE__ */ jsx("option", {
														value: "Bulk Formulation Supply",
														children: "Bulk Formulation Supply"
													}),
													/* @__PURE__ */ jsx("option", {
														value: "PCD Pharma Franchise",
														children: "PCD Pharma Franchise / Regional Stockist"
													}),
													/* @__PURE__ */ jsx("option", {
														value: "Hospital & Institutional Tender",
														children: "Hospital & Institutional Tender"
													}),
													/* @__PURE__ */ jsx("option", {
														value: "Third-Party Contract Manufacturing",
														children: "Third-Party Contract Manufacturing"
													}),
													/* @__PURE__ */ jsx("option", {
														value: "Product Monograph & Dossier",
														children: "Product Monograph & Dossier Request"
													}),
													/* @__PURE__ */ jsx("option", {
														value: "Pharmacovigilance",
														children: "Pharmacovigilance & Drug Safety"
													})
												]
											})] }),
											/* @__PURE__ */ jsxs("div", { children: [
												/* @__PURE__ */ jsxs("label", {
													className: "block text-xs font-semibold text-slate-700 mb-1.5",
													children: ["Detailed Message & Requirements ", /* @__PURE__ */ jsx("span", {
														className: "text-rose-500",
														children: "*"
													})]
												}),
												/* @__PURE__ */ jsx("textarea", {
													required: true,
													rows: 4,
													value: data.message,
													onChange: (e) => setData("message", e.target.value),
													placeholder: "Please provide dosage form, molecule, expected volume, or specific queries...",
													className: "w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:border-[#c59324] focus:ring-2 focus:ring-[#c59324]/20 outline-none text-sm transition-all"
												}),
												errors.message && /* @__PURE__ */ jsx("p", {
													className: "text-rose-500 text-xs mt-1",
													children: errors.message
												})
											] }),
											/* @__PURE__ */ jsxs("button", {
												type: "submit",
												disabled: processing,
												className: "w-full py-3.5 px-6 rounded-xl bg-gradient-to-r from-[#c59324] to-[#dfad36] text-[#07172b] font-bold text-sm hover:brightness-105 transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50",
												children: [/* @__PURE__ */ jsx(Send, { className: "w-4 h-4" }), processing ? "Transmitting Inquiry..." : "Submit Commercial Inquiry"]
											})
										]
									})]
								})
							})]
						})
					})
				}),
				/* @__PURE__ */ jsx("section", {
					className: "py-16 sm:py-20 bg-white",
					children: /* @__PURE__ */ jsxs(Container, {
						size: "narrow",
						children: [/* @__PURE__ */ jsxs("div", {
							className: "text-center max-w-xl mx-auto mb-12",
							children: [/* @__PURE__ */ jsx("span", {
								className: "text-xs font-bold uppercase tracking-widest text-[#c59324]",
								children: "Assistance"
							}), /* @__PURE__ */ jsx("h2", {
								className: "text-2xl sm:text-3xl font-bold text-[#0c2340] mt-1",
								children: "Frequently Asked Inquiries"
							})]
						}), /* @__PURE__ */ jsxs("div", {
							className: "space-y-4",
							children: [
								/* @__PURE__ */ jsxs("div", {
									className: "p-5 rounded-2xl bg-slate-50 border border-slate-200",
									children: [/* @__PURE__ */ jsx("h4", {
										className: "text-sm font-bold text-[#0c2340]",
										children: "How can I request Certificates of Analysis (COA)?"
									}), /* @__PURE__ */ jsx("p", {
										className: "text-xs sm:text-sm text-slate-600 mt-1.5 leading-relaxed",
										children: "Every batch manufactured at Walpar Wellness is accompanied by an authenticated Certificate of Analysis (COA). You can submit a request with the batch number via this form or by emailing info@ciplonpharma.in."
									})]
								}),
								/* @__PURE__ */ jsxs("div", {
									className: "p-5 rounded-2xl bg-slate-50 border border-slate-200",
									children: [/* @__PURE__ */ jsx("h4", {
										className: "text-sm font-bold text-[#0c2340]",
										children: "Do you provide PCD Franchise & Distributorship rights?"
									}), /* @__PURE__ */ jsx("p", {
										className: "text-xs sm:text-sm text-slate-600 mt-1.5 leading-relaxed",
										children: "Yes, Ciplon Pharma offers monopoly-based district and territorial PCD distributorship agreements backed by promotional inputs, visual aids, MR training kits, and timely product delivery."
									})]
								}),
								/* @__PURE__ */ jsxs("div", {
									className: "p-5 rounded-2xl bg-slate-50 border border-slate-200",
									children: [/* @__PURE__ */ jsx("h4", {
										className: "text-sm font-bold text-[#0c2340]",
										children: "What regulatory standards govern your formulation packaging?"
									}), /* @__PURE__ */ jsx("p", {
										className: "text-xs sm:text-sm text-slate-600 mt-1.5 leading-relaxed",
										children: "All formulations comply strictly with Schedule M (WHO-GMP guidelines), FSSAI license 10426340000172 regulations, and ISO 9001:2015 quality assurance protocols with tamper-evident packaging."
									})]
								})
							]
						})]
					})
				})
			]
		})]
	});
}
//#endregion
//#region resources/js/components/home/IntasHeroBanner.jsx
function IntasHeroBanner({ onExploreProducts, onContactUs, onOpenEnquiryModal }) {
	const [activeSlide, setActiveSlide] = useState(0);
	const [activeCard, setActiveCard] = useState(0);
	const slides = [
		{
			id: 0,
			image: "/images/hero_indian_doctors.jpg",
			headlinePre: "Advancing Modern Healthcare",
			headlineMain: "Transforming Patient Care",
			headlineSub: "Embarking on a journey of",
			headlineSubBold: "clinical excellence",
			description: "An emerging Indian pharmaceutical enterprise committed to developing high-potency, affordable finished formulations.",
			tag: "Quality Formulations"
		},
		{
			id: 1,
			image: "/images/pharma_automation_line.jpg",
			headlinePre: "Modern Formulation Technology",
			headlineMain: "High-Precision Manufacturing",
			headlineSub: "Engineered for reproducible quality in",
			headlineSubBold: "finished therapeutics",
			description: "Modern production lines dedicated to consistent, safe oral solids and liquid formulations.",
			tag: "Precision Technology"
		},
		{
			id: 2,
			image: "/images/hero_indian_scientists.jpg",
			headlinePre: "Translating Analytical Science",
			headlineMain: "Into Life-Changing Smiles",
			headlineSub: "Continuous focus on",
			headlineSubBold: "essential medicines",
			description: "Dedicated Indian research personnel and formulation chemists upholding high standards of quality assurance.",
			tag: "Advanced R&D"
		},
		{
			id: 3,
			image: "/images/hero_indian_consultation.jpg",
			headlinePre: "Patient-Centric Healthcare",
			headlineMain: "Compassionate Medical Care",
			headlineSub: "Trusted by doctors across",
			headlineSubBold: "clinical therapies",
			description: "Delivering bioequivalent, accessible therapeutic treatments that enhance patient outcomes and community wellness.",
			tag: "Clinical Trust"
		}
	];
	useEffect(() => {
		const timer = setInterval(() => {
			setActiveSlide((prev) => (prev + 1) % slides.length);
		}, 6500);
		return () => clearInterval(timer);
	}, [slides.length]);
	const handlePrevSlide = () => {
		setActiveSlide((prev) => (prev - 1 + slides.length) % slides.length);
	};
	const handleNextSlide = () => {
		setActiveSlide((prev) => (prev + 1) % slides.length);
	};
	const currentSlide = slides[activeSlide];
	const cards = [
		{
			icon: Award,
			title: "Committed to Quality by Design (QbD)",
			description: "Our dedicated commitment to clinical precision, verified bioavailability, and stringent analytical standards across every formulation.",
			actionText: "Our Quality Vision",
			isPrimary: true
		},
		{
			icon: Globe,
			title: "A Global Healthcare Partner",
			description: "Ciplon is trusted by healthcare professionals across more than 85+ countries across the globe.",
			actionText: "Our Global Footprint",
			isPrimary: false
		},
		{
			icon: Sparkles,
			title: "A Dynamic Product Basket",
			description: "Empowered by a passionate R&D team, offering a comprehensive therapeutic range of finished pharmaceutical formulations.",
			actionText: "Explore Portfolio",
			isPrimary: false
		},
		{
			icon: HeartPulse,
			title: "Pharma Therapy for Life",
			description: "Discover our specialized plasma fractionation, biosimilars, and targeted hospital therapy solutions.",
			actionText: "View Therapies",
			isPrimary: false
		}
	];
	return /* @__PURE__ */ jsxs("section", {
		className: "relative w-full bg-slate-50 select-none overflow-hidden",
		children: [/* @__PURE__ */ jsxs("div", {
			className: "relative w-full h-[460px] sm:h-[520px] md:h-[580px] lg:h-[620px] overflow-hidden bg-slate-900",
			children: [
				slides.map((slide, index) => /* @__PURE__ */ jsxs("div", {
					className: `absolute inset-0 transition-opacity duration-1000 ease-in-out ${index === activeSlide ? "opacity-100 z-10" : "opacity-0 z-0 pointer-events-none"}`,
					children: [
						/* @__PURE__ */ jsx("img", {
							src: slide.image,
							alt: slide.headlineMain,
							className: "w-full h-full object-cover object-center transform scale-100 transition-transform duration-[7000ms] ease-out hover:scale-105"
						}),
						/* @__PURE__ */ jsx("div", { className: "absolute inset-0 bg-gradient-to-r from-slate-950/85 via-slate-900/65 to-sky-950/40" }),
						/* @__PURE__ */ jsx("div", { className: "absolute inset-0 bg-gradient-to-t from-slate-950/70 via-transparent to-slate-950/30" })
					]
				}, slide.id)),
				/* @__PURE__ */ jsx("div", {
					className: "absolute top-0 right-4 sm:right-8 lg:right-16 z-30 pointer-events-auto filter drop-shadow-md",
					children: /* @__PURE__ */ jsxs("div", {
						className: "w-24 sm:w-28 md:w-32 flex flex-col items-center",
						children: [/* @__PURE__ */ jsxs("div", {
							className: "w-full bg-[#e21838] text-white pt-2.5 pb-2.5 px-2 flex flex-col items-center shadow-md",
							children: [
								/* @__PURE__ */ jsxs("div", {
									className: "flex items-center gap-1 text-amber-300 text-xs mb-0.5",
									children: [
										/* @__PURE__ */ jsx("span", { children: "★" }),
										/* @__PURE__ */ jsx("span", { children: "★" }),
										/* @__PURE__ */ jsx("span", { children: "★" })
									]
								}),
								/* @__PURE__ */ jsx("span", {
									className: "text-[10px] sm:text-[11px] font-bold uppercase tracking-wider text-center leading-tight",
									children: "QUALITY FIRST"
								}),
								/* @__PURE__ */ jsx("span", {
									className: "text-[8px] sm:text-[9px] font-medium uppercase tracking-wider text-center text-sky-100",
									children: "PATIENT CENTRIC"
								})
							]
						}), /* @__PURE__ */ jsxs("div", {
							className: "w-full bg-[#0a2540] text-white pt-2 pb-4 px-1.5 flex flex-col items-center text-center shadow-md",
							style: { clipPath: "polygon(0% 0%, 100% 0%, 100% 82%, 50% 100%, 0% 82%)" },
							children: [
								/* @__PURE__ */ jsx("span", {
									className: "text-[9px] sm:text-[10px] font-bold uppercase tracking-widest text-white leading-none",
									children: "COMMITTED"
								}),
								/* @__PURE__ */ jsx("span", {
									className: "text-[7px] sm:text-[8px] font-medium text-sky-200 uppercase tracking-tight mt-1 block",
									children: "TO EXCELLENCE"
								}),
								/* @__PURE__ */ jsx("span", {
									className: "text-[8px] sm:text-[9px] font-bold text-amber-300 uppercase tracking-wider mt-0.5 block",
									children: "HEALTHCARE"
								})
							]
						})]
					})
				}),
				/* @__PURE__ */ jsx("div", {
					className: "absolute inset-0 z-20 flex items-center pt-2 pb-14 sm:pb-20",
					children: /* @__PURE__ */ jsx(Container, { children: /* @__PURE__ */ jsxs("div", {
						className: "max-w-2xl sm:max-w-3xl text-white pl-2 sm:pl-4",
						children: [
							/* @__PURE__ */ jsx("div", {
								className: "inline-flex items-center gap-2 px-3 py-1 rounded-full bg-black/40 backdrop-blur-md border border-[#c59324]/40 text-xs sm:text-sm font-semibold tracking-wide text-[#dfad36] mb-3 sm:mb-4",
								children: /* @__PURE__ */ jsx("span", { children: currentSlide.headlinePre })
							}),
							/* @__PURE__ */ jsx("h1", {
								className: "text-3xl sm:text-4xl md:text-5xl lg:text-[54px] font-bold tracking-tight leading-[1.18] text-white drop-shadow-md",
								children: currentSlide.headlineMain
							}),
							/* @__PURE__ */ jsxs("div", {
								className: "mt-3 sm:mt-4 text-lg sm:text-2xl md:text-3xl font-light text-slate-100 flex flex-wrap items-center gap-x-2 gap-y-1",
								children: [/* @__PURE__ */ jsx("span", { children: currentSlide.headlineSub }), /* @__PURE__ */ jsx("span", {
									className: "font-bold text-[#dfad36] underline decoration-[#c59324] decoration-2 underline-offset-4",
									children: currentSlide.headlineSubBold
								})]
							}),
							/* @__PURE__ */ jsx("p", {
								className: "mt-3 text-sm sm:text-base text-slate-200/90 max-w-xl font-normal leading-relaxed hidden sm:block",
								children: currentSlide.description
							}),
							/* @__PURE__ */ jsxs("div", {
								className: "mt-6 sm:mt-8 flex flex-wrap items-center gap-3",
								children: [/* @__PURE__ */ jsxs("button", {
									type: "button",
									onClick: onExploreProducts,
									className: "px-6 py-2.5 sm:py-3 rounded-full bg-gradient-to-r from-[#c59324] via-[#d4a029] to-[#b8831b] hover:from-[#b8831b] hover:to-[#9f6d0f] text-white font-bold text-xs sm:text-sm transition-all shadow-lg shadow-[#c59324]/30 hover:scale-[1.02] cursor-pointer flex items-center gap-2",
									children: [/* @__PURE__ */ jsx("span", { children: "Explore Formulations" }), /* @__PURE__ */ jsx(ArrowRight, { className: "w-4 h-4" })]
								}), /* @__PURE__ */ jsx("button", {
									type: "button",
									onClick: () => {
										const el = document.getElementById("about");
										if (el) el.scrollIntoView({ behavior: "smooth" });
									},
									className: "px-6 py-2.5 sm:py-3 rounded-full bg-white/15 hover:bg-white/25 text-white font-semibold text-xs sm:text-sm backdrop-blur-md border border-white/30 transition-all cursor-pointer",
									children: "Discover Ciplon"
								})]
							})
						]
					}) })
				}),
				/* @__PURE__ */ jsx("button", {
					type: "button",
					onClick: handlePrevSlide,
					className: "absolute left-3 sm:left-6 top-1/2 -translate-y-1/2 z-30 w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-black/40 hover:bg-[#0c2340] hover:border-[#c59324] text-white backdrop-blur-md border border-white/20 flex items-center justify-center transition-all cursor-pointer shadow-lg group",
					"aria-label": "Previous Slide",
					children: /* @__PURE__ */ jsx(ChevronLeft, { className: "w-6 h-6 group-hover:-translate-x-0.5 transition-transform" })
				}),
				/* @__PURE__ */ jsx("button", {
					type: "button",
					onClick: handleNextSlide,
					className: "absolute right-3 sm:right-6 top-1/2 -translate-y-1/2 z-30 w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-black/40 hover:bg-[#0c2340] hover:border-[#c59324] text-white backdrop-blur-md border border-white/20 flex items-center justify-center transition-all cursor-pointer shadow-lg group",
					"aria-label": "Next Slide",
					children: /* @__PURE__ */ jsx(ChevronRight, { className: "w-6 h-6 group-hover:translate-x-0.5 transition-transform" })
				}),
				/* @__PURE__ */ jsx("div", {
					className: "absolute bottom-4 sm:bottom-6 left-1/2 -translate-x-1/2 z-30 flex items-center gap-2",
					children: slides.map((_, idx) => /* @__PURE__ */ jsx("button", {
						type: "button",
						onClick: () => setActiveSlide(idx),
						className: `h-2.5 rounded-full transition-all cursor-pointer ${idx === activeSlide ? "w-8 bg-[#c59324]" : "w-2.5 bg-white/50 hover:bg-white"}`,
						"aria-label": `Go to slide ${idx + 1}`
					}, idx))
				})
			]
		}), /* @__PURE__ */ jsx("div", {
			className: "relative z-30 -mt-6 sm:-mt-10 lg:-mt-14 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8",
			children: /* @__PURE__ */ jsx("div", {
				className: "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4",
				children: cards.map((card, index) => {
					const Icon = card.icon;
					const isSelected = index === activeCard;
					return /* @__PURE__ */ jsxs("div", {
						onClick: () => {
							setActiveCard(index);
							if (index === 2) onExploreProducts();
							else if (index === 3) {
								const el = document.getElementById("science");
								if (el) el.scrollIntoView({ behavior: "smooth" });
							} else if (index === 1) {
								const el = document.getElementById("excellence");
								if (el) el.scrollIntoView({ behavior: "smooth" });
							}
						},
						className: `p-5 sm:p-6 rounded-2xl cursor-pointer transition-all duration-300 flex flex-col justify-between border ${card.isPrimary || isSelected ? "bg-gradient-to-br from-[#0c2340] to-[#07172b] text-white border-[#c59324] shadow-xl shadow-[#0c2340]/30 scale-[1.02]" : "bg-white text-slate-800 border-slate-200/90 hover:border-[#c59324]/50 hover:shadow-xl shadow-md"}`,
						children: [/* @__PURE__ */ jsxs("div", { children: [
							/* @__PURE__ */ jsx("div", {
								className: `w-11 h-11 rounded-xl flex items-center justify-center mb-4 transition-transform group-hover:scale-110 ${card.isPrimary || isSelected ? "bg-[#c59324]/20 text-[#dfad36] border border-[#c59324]/40" : "bg-amber-50 text-[#0c2340] border border-amber-100"}`,
								children: /* @__PURE__ */ jsx(Icon, { className: "w-6 h-6 stroke-[2.2]" })
							}),
							/* @__PURE__ */ jsx("h3", {
								className: `text-base font-bold tracking-tight mb-2 leading-snug ${card.isPrimary || isSelected ? "text-white" : "text-[#0c2340]"}`,
								children: card.title
							}),
							/* @__PURE__ */ jsx("p", {
								className: `text-xs leading-relaxed ${card.isPrimary || isSelected ? "text-slate-300" : "text-slate-600"}`,
								children: card.description
							})
						] }), /* @__PURE__ */ jsxs("div", {
							className: "pt-4 mt-3 border-t border-black/10 flex items-center justify-between text-xs font-bold",
							children: [/* @__PURE__ */ jsx("span", {
								className: card.isPrimary || isSelected ? "text-[#dfad36]" : "text-[#c59324]",
								children: card.actionText
							}), /* @__PURE__ */ jsx(ArrowRight, { className: `w-4 h-4 transition-transform group-hover:translate-x-1 ${card.isPrimary || isSelected ? "text-[#dfad36]" : "text-[#c59324]"}` })]
						})]
					}, index);
				})
			})
		})]
	});
}
//#endregion
//#region resources/js/components/home/CompanyIntroSection.jsx
function CompanyIntroSection() {
	const [isModalOpen, setIsModalOpen] = useState(false);
	return /* @__PURE__ */ jsxs("section", {
		id: "about",
		className: "py-16 sm:py-24 bg-white border-b border-slate-100",
		children: [/* @__PURE__ */ jsx(Container, { children: /* @__PURE__ */ jsxs("div", {
			className: "max-w-4xl mx-auto text-center space-y-6",
			children: [
				/* @__PURE__ */ jsxs("div", {
					className: "inline-block relative",
					children: [
						/* @__PURE__ */ jsx("span", {
							className: "text-[11px] font-bold tracking-widest text-[#c59324] uppercase block mb-1",
							children: "Corporate Overview"
						}),
						/* @__PURE__ */ jsx("h2", {
							className: "text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight text-[#0c2340] uppercase",
							children: "CIPLON PHARMA PRIVATE LIMITED"
						}),
						/* @__PURE__ */ jsx("p", {
							className: "text-xs sm:text-sm font-semibold text-slate-500 mt-1",
							children: "(An ISO 9001: 2015 certified company)"
						}),
						/* @__PURE__ */ jsx("div", { className: "w-20 h-1 bg-gradient-to-r from-[#c59324] to-[#dfad36] mx-auto mt-2 rounded-full" })
					]
				}),
				/* @__PURE__ */ jsx("p", {
					className: "text-sm sm:text-base md:text-lg text-slate-700 leading-relaxed font-normal",
					children: "Ciplon Pharma Private Limited is an ISO 9001: 2015 certified healthcare and pharmaceutical formulations company committed to marketing high-quality, accessible, and affordable therapeutic formulations. Manufactured in state-of-the-art WHO-GMP and ISO 9001: 2015 certified partner facilities, our formulations undergo rigorous quality control and batch testing to ensure the highest standards of safety, bioavailability, and clinical efficacy."
				}),
				/* @__PURE__ */ jsx("div", {
					className: "pt-2",
					children: /* @__PURE__ */ jsx("button", {
						type: "button",
						onClick: () => setIsModalOpen(true),
						className: "px-8 py-3 rounded-full bg-[#0c2340] hover:bg-[#123055] text-white border border-[#c59324]/40 font-bold text-xs sm:text-sm tracking-wider uppercase transition-all shadow-md shadow-[#0c2340]/25 hover:shadow-lg hover:scale-105 cursor-pointer",
						children: "READ MORE"
					})
				})
			]
		}) }), isModalOpen && /* @__PURE__ */ jsx("div", {
			className: "fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-in fade-in duration-200",
			children: /* @__PURE__ */ jsxs("div", {
				className: "bg-white rounded-3xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl border border-slate-100 relative max-h-[90vh] overflow-y-auto",
				children: [
					/* @__PURE__ */ jsx("button", {
						type: "button",
						onClick: () => setIsModalOpen(false),
						className: "absolute top-5 right-5 p-2 rounded-full bg-slate-100 text-slate-500 hover:bg-slate-200 transition-colors cursor-pointer",
						children: /* @__PURE__ */ jsx(X, { className: "w-5 h-5" })
					}),
					/* @__PURE__ */ jsxs("div", {
						className: "flex items-center gap-3 mb-4",
						children: [/* @__PURE__ */ jsx("div", {
							className: "w-12 h-12 rounded-2xl bg-amber-50 text-[#c59324] flex items-center justify-center border border-amber-200/70",
							children: /* @__PURE__ */ jsx(Building2, { className: "w-6 h-6" })
						}), /* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("h3", {
							className: "text-xl font-bold text-[#0c2340]",
							children: "Ciplon Pharma Private Limited"
						}), /* @__PURE__ */ jsx("p", {
							className: "text-xs text-slate-500 font-medium",
							children: "An ISO 9001: 2015 Certified Company • FSSAI Lic. No. 10426340000172"
						})] })]
					}),
					/* @__PURE__ */ jsxs("div", {
						className: "space-y-4 text-xs sm:text-sm text-slate-600 leading-relaxed pt-2",
						children: [
							/* @__PURE__ */ jsxs("p", { children: [
								/* @__PURE__ */ jsx("strong", { children: "Marketed by:" }),
								" Ciplon Pharma Private Limited",
								/* @__PURE__ */ jsx("br", {}),
								"M24/A, KH No. 294, 1st Floor, Batla House, Okhla, Jamia Nagar, South Delhi, New Delhi, Delhi, India - 110025."
							] }),
							/* @__PURE__ */ jsxs("div", {
								className: "grid grid-cols-1 sm:grid-cols-3 gap-3 py-3",
								children: [
									/* @__PURE__ */ jsxs("div", {
										className: "p-3 rounded-xl bg-slate-50 border border-slate-200/80 text-center",
										children: [
											/* @__PURE__ */ jsx(ShieldCheck, { className: "w-5 h-5 text-[#c59324] mx-auto mb-1.5" }),
											/* @__PURE__ */ jsx("div", {
												className: "font-extrabold text-[#0c2340] text-sm",
												children: "ISO 9001: 2015"
											}),
											/* @__PURE__ */ jsx("div", {
												className: "text-[11px] text-slate-500",
												children: "Certified Quality Standard"
											})
										]
									}),
									/* @__PURE__ */ jsxs("div", {
										className: "p-3 rounded-xl bg-slate-50 border border-slate-200/80 text-center",
										children: [
											/* @__PURE__ */ jsx(Award, { className: "w-5 h-5 text-[#c59324] mx-auto mb-1.5" }),
											/* @__PURE__ */ jsx("div", {
												className: "font-extrabold text-[#0c2340] text-sm",
												children: "WHO-GMP"
											}),
											/* @__PURE__ */ jsx("div", {
												className: "text-[11px] text-slate-500",
												children: "Manufacturing Facility"
											})
										]
									}),
									/* @__PURE__ */ jsxs("div", {
										className: "p-3 rounded-xl bg-slate-50 border border-slate-200/80 text-center",
										children: [
											/* @__PURE__ */ jsx(Globe2, { className: "w-5 h-5 text-[#c59324] mx-auto mb-1.5" }),
											/* @__PURE__ */ jsx("div", {
												className: "font-extrabold text-[#0c2340] text-sm",
												children: "FSSAI License"
											}),
											/* @__PURE__ */ jsx("div", {
												className: "text-[11px] text-slate-500",
												children: "10426340000172"
											})
										]
									})
								]
							}),
							/* @__PURE__ */ jsxs("div", {
								className: "p-4 rounded-2xl bg-amber-50/60 border border-amber-200/60 text-xs text-slate-700 space-y-1.5",
								children: [
									/* @__PURE__ */ jsx("p", {
										className: "font-bold text-[#0c2340] uppercase tracking-wider text-[11px]",
										children: "Manufacturing Partner Credentials"
									}),
									/* @__PURE__ */ jsx("p", {
										className: "font-semibold text-slate-800",
										children: "Mfg. in India by: WALPAR WELLNESS PVT.LTD."
									}),
									/* @__PURE__ */ jsx("p", {
										className: "text-slate-600",
										children: "(WHO-GMP & An ISO 9001 : 2015 Certified Company)"
									}),
									/* @__PURE__ */ jsx("p", {
										className: "text-slate-500 text-[11px]",
										children: "PLOT NO.2/A & 06, OPP, SABARMATI GAS STATION, KHATRAJ, KALOL, GANDHINAGAR., Gujarat-382721."
									})
								]
							}),
							/* @__PURE__ */ jsxs("p", {
								className: "text-slate-600",
								children: [
									"For any query or feedback, contact our corporate desk at ",
									/* @__PURE__ */ jsx("a", {
										href: "mailto:info@ciplonpharma.in",
										className: "text-[#c59324] font-semibold hover:underline",
										children: "info@ciplonpharma.in"
									}),
									" or visit ",
									/* @__PURE__ */ jsx("a", {
										href: "https://www.ciplonpharma.in",
										target: "_blank",
										rel: "noopener noreferrer",
										className: "text-[#c59324] font-semibold hover:underline",
										children: "www.ciplonpharma.in"
									}),
									". TM - Trademark Under Registration."
								]
							})
						]
					}),
					/* @__PURE__ */ jsx("div", {
						className: "mt-6 pt-4 border-t border-slate-100 flex justify-end",
						children: /* @__PURE__ */ jsx("button", {
							type: "button",
							onClick: () => setIsModalOpen(false),
							className: "px-6 py-2 rounded-xl bg-[#0c2340] text-white text-xs font-bold hover:bg-[#c59324] transition-colors cursor-pointer",
							children: "Close Overview"
						})
					})
				]
			})
		})]
	});
}
//#endregion
//#region resources/js/components/home/ExcellenceStatsSection.jsx
function ExcellenceStatsSection() {
	const [activeIdx, setActiveIdx] = useState(0);
	const scrollContainerRef = useRef(null);
	const stats = [
		{
			icon: Globe2,
			value: "$2.2",
			unit: "Billion",
			label: "Billion Turnover",
			highlight: true
		},
		{
			icon: TrendingUp,
			value: "20",
			unit: "%",
			label: "CAGR Growth",
			highlight: false
		},
		{
			icon: Award,
			value: "No. 1",
			unit: "",
			label: "Generic Company in Key Markets",
			highlight: false
		},
		{
			icon: Layers,
			value: "9,738",
			unit: "+",
			label: "Product Registrations Worldwide",
			highlight: false
		}
	];
	const handleScroll = () => {
		if (!scrollContainerRef.current) return;
		const container = scrollContainerRef.current;
		const containerCenter = container.scrollLeft + container.offsetWidth / 2;
		const children = Array.from(container.children);
		let closestIdx = 0;
		let minDistance = Infinity;
		children.forEach((child, idx) => {
			const childCenter = child.offsetLeft + child.offsetWidth / 2;
			const distance = Math.abs(containerCenter - childCenter);
			if (distance < minDistance) {
				minDistance = distance;
				closestIdx = idx;
			}
		});
		setActiveIdx(closestIdx);
	};
	const scrollToIndex = (index) => {
		if (!scrollContainerRef.current) return;
		const cards = scrollContainerRef.current.children;
		if (cards && cards[index]) {
			cards[index].scrollIntoView({
				behavior: "smooth",
				block: "nearest",
				inline: "center"
			});
			setActiveIdx(index);
		}
	};
	const isDraggingRef = useRef(false);
	const startXRef = useRef(0);
	const scrollLeftStartRef = useRef(0);
	const handleMouseDown = (e) => {
		if (!scrollContainerRef.current) return;
		isDraggingRef.current = true;
		startXRef.current = e.pageX - scrollContainerRef.current.offsetLeft;
		scrollLeftStartRef.current = scrollContainerRef.current.scrollLeft;
	};
	const handleMouseMove = (e) => {
		if (!isDraggingRef.current || !scrollContainerRef.current) return;
		e.preventDefault();
		const walk = (e.pageX - scrollContainerRef.current.offsetLeft - startXRef.current) * 1.5;
		scrollContainerRef.current.scrollLeft = scrollLeftStartRef.current - walk;
	};
	const handleMouseUpOrLeave = () => {
		isDraggingRef.current = false;
	};
	return /* @__PURE__ */ jsxs("section", {
		id: "excellence",
		className: "py-12 sm:py-20 bg-gradient-to-b sm:bg-gradient-to-r from-[#0c2340] via-[#07172b] to-[#040e1b] text-white relative overflow-hidden border-y border-[#c59324]/20",
		children: [/* @__PURE__ */ jsx("div", {
			className: "absolute inset-0 opacity-10 pointer-events-none",
			children: /* @__PURE__ */ jsxs("svg", {
				className: "w-full h-full",
				xmlns: "http://www.w3.org/2000/svg",
				children: [/* @__PURE__ */ jsx("defs", { children: /* @__PURE__ */ jsx("pattern", {
					id: "dotPattern",
					width: "40",
					height: "40",
					patternUnits: "userSpaceOnUse",
					children: /* @__PURE__ */ jsx("circle", {
						cx: "20",
						cy: "20",
						r: "2",
						fill: "#c59324"
					})
				}) }), /* @__PURE__ */ jsx("rect", {
					width: "100%",
					height: "100%",
					fill: "url(#dotPattern)"
				})]
			})
		}), /* @__PURE__ */ jsxs(Container, {
			className: "relative z-10",
			children: [
				/* @__PURE__ */ jsxs("div", {
					className: "text-center mb-8 sm:mb-14",
					children: [/* @__PURE__ */ jsxs("h2", {
						className: "text-2xl sm:text-4xl md:text-5xl font-bold tracking-tight text-white",
						children: [/* @__PURE__ */ jsx("span", {
							className: "text-[#dfad36] drop-shadow-sm",
							children: "Excellence"
						}), " is a Matter of Fact"]
					}), /* @__PURE__ */ jsx("div", { className: "w-16 sm:w-20 h-1 bg-gradient-to-r from-[#c59324] to-[#dfad36] mx-auto mt-3 rounded-full" })]
				}),
				/* @__PURE__ */ jsx("div", {
					ref: scrollContainerRef,
					onScroll: handleScroll,
					onMouseDown: handleMouseDown,
					onMouseMove: handleMouseMove,
					onMouseUp: handleMouseUpOrLeave,
					onMouseLeave: handleMouseUpOrLeave,
					className: "flex md:grid md:grid-cols-4 gap-4 sm:gap-6 lg:gap-8 max-w-6xl mx-auto overflow-x-auto md:overflow-visible snap-x snap-mandatory md:snap-none no-scrollbar touch-pan-x px-6 md:px-0 scroll-px-6 pb-2 md:pb-0 select-none cursor-grab active:cursor-grabbing md:cursor-default",
					children: stats.map((item, idx) => {
						const Icon = item.icon;
						const isActiveOnMobile = activeIdx === idx;
						return /* @__PURE__ */ jsxs("div", {
							onClick: () => scrollToIndex(idx),
							className: `group p-6 sm:p-7 rounded-2xl backdrop-blur-md text-center transition-all duration-300 md:hover:scale-105 md:hover:shadow-2xl flex flex-col items-center justify-center shadow-lg shrink-0 w-[78vw] sm:w-[50vw] md:w-auto snap-center min-h-[220px] ${isActiveOnMobile ? "bg-white/10 border-2 border-[#dfad36] shadow-[#dfad36]/10 shadow-xl" : "bg-white/5 border border-[#c59324]/25 hover:border-[#c59324]/50"}`,
							children: [
								/* @__PURE__ */ jsx("div", {
									className: `w-14 h-14 rounded-full flex items-center justify-center mb-4 transition-all duration-300 md:group-hover:scale-110 ${isActiveOnMobile ? "bg-[#c59324] text-[#07172b] border border-[#dfad36]" : "bg-[#c59324]/20 border border-[#c59324]/40 text-[#dfad36] md:group-hover:bg-[#c59324] md:group-hover:text-[#07172b]"}`,
									children: /* @__PURE__ */ jsx(Icon, { className: "w-7 h-7 stroke-[2.2]" })
								}),
								/* @__PURE__ */ jsxs("div", {
									className: "flex items-baseline justify-center gap-1",
									children: [/* @__PURE__ */ jsx("span", {
										className: "text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-white md:group-hover:text-[#dfad36] transition-colors",
										children: item.value
									}), item.unit && /* @__PURE__ */ jsx("span", {
										className: "text-xl sm:text-2xl font-bold text-[#dfad36]",
										children: item.unit
									})]
								}),
								/* @__PURE__ */ jsx("p", {
									className: "text-xs sm:text-sm font-semibold text-slate-300 mt-2 leading-snug",
									children: item.label
								})
							]
						}, idx);
					})
				}),
				/* @__PURE__ */ jsxs("div", {
					className: "flex md:hidden flex-col items-center justify-center gap-2.5 mt-6",
					children: [/* @__PURE__ */ jsxs("div", {
						className: "flex items-center justify-center gap-3",
						children: [
							/* @__PURE__ */ jsx("button", {
								type: "button",
								onClick: () => scrollToIndex(Math.max(0, activeIdx - 1)),
								disabled: activeIdx === 0,
								className: "p-2 rounded-full bg-white/10 text-white disabled:opacity-20 disabled:cursor-not-allowed hover:bg-white/20 active:scale-95 transition-all cursor-pointer border border-white/10",
								"aria-label": "Previous stat",
								children: /* @__PURE__ */ jsx(ChevronLeft, { className: "w-4 h-4" })
							}),
							/* @__PURE__ */ jsx("div", {
								className: "flex items-center gap-1.5 px-2",
								children: stats.map((_, idx) => /* @__PURE__ */ jsx("button", {
									type: "button",
									onClick: () => scrollToIndex(idx),
									className: `h-2 rounded-full transition-all duration-300 cursor-pointer ${activeIdx === idx ? "w-7 bg-gradient-to-r from-[#c59324] to-[#dfad36] shadow-sm shadow-[#dfad36]/50" : "w-2 bg-white/30 hover:bg-white/60"}`,
									"aria-label": `Go to stat ${idx + 1}`
								}, idx))
							}),
							/* @__PURE__ */ jsx("button", {
								type: "button",
								onClick: () => scrollToIndex(Math.min(stats.length - 1, activeIdx + 1)),
								disabled: activeIdx === stats.length - 1,
								className: "p-2 rounded-full bg-white/10 text-white disabled:opacity-20 disabled:cursor-not-allowed hover:bg-white/20 active:scale-95 transition-all cursor-pointer border border-white/10",
								"aria-label": "Next stat",
								children: /* @__PURE__ */ jsx(ChevronRight, { className: "w-4 h-4" })
							})
						]
					}), /* @__PURE__ */ jsxs("span", {
						className: "text-[11px] font-medium text-slate-400 tracking-wide",
						children: [
							"Swipe left or right (",
							activeIdx + 1,
							" of ",
							stats.length,
							")"
						]
					})]
				})
			]
		})]
	});
}
//#endregion
//#region resources/js/components/home/ScienceIntoSmilesSection.jsx
function ScienceIntoSmilesSection() {
	const [isModalOpen, setIsModalOpen] = useState(false);
	return /* @__PURE__ */ jsxs("section", {
		id: "science",
		className: "py-16 sm:py-24 bg-white border-b border-slate-100 overflow-hidden",
		children: [/* @__PURE__ */ jsxs(Container, { children: [/* @__PURE__ */ jsxs("div", {
			className: "text-center mb-12 sm:mb-16",
			children: [/* @__PURE__ */ jsx("h2", {
				className: "text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight text-[#0c2340] uppercase",
				children: "TRANSFORMING SCIENCE INTO SMILES"
			}), /* @__PURE__ */ jsx("div", { className: "w-20 h-1 bg-gradient-to-r from-[#c59324] to-[#dfad36] mx-auto mt-2 rounded-full" })]
		}), /* @__PURE__ */ jsxs("div", {
			className: "grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center",
			children: [/* @__PURE__ */ jsx("div", {
				className: "lg:col-span-6 flex justify-center",
				children: /* @__PURE__ */ jsxs("div", {
					className: "relative w-[300px] h-[300px] sm:w-[380px] sm:h-[380px] md:w-[420px] md:h-[420px] flex items-center justify-center",
					children: [
						/* @__PURE__ */ jsx("div", { className: "absolute inset-0 rounded-full border border-slate-200 animate-spin-slow pointer-events-none" }),
						/* @__PURE__ */ jsx("div", { className: "absolute inset-4 rounded-full border-2 border-dashed border-[#c59324]/30 pointer-events-none" }),
						/* @__PURE__ */ jsx("div", { className: "absolute inset-10 rounded-full border border-amber-100 pointer-events-none" }),
						/* @__PURE__ */ jsxs("div", {
							className: "relative z-10 w-48 h-48 sm:w-60 sm:h-60 md:w-64 md:h-64 rounded-full p-2 bg-white shadow-2xl border-4 border-[#c59324] overflow-hidden group",
							children: [/* @__PURE__ */ jsx("img", {
								src: "/images/hero_indian_scientists.jpg",
								alt: "Ciplon Formulation R&D Laboratory",
								className: "w-full h-full object-cover rounded-full group-hover:scale-110 transition-transform duration-500"
							}), /* @__PURE__ */ jsx("div", {
								className: "absolute inset-0 rounded-full bg-gradient-to-t from-[#0c2340]/80 via-transparent to-transparent flex items-end justify-center pb-3",
								children: /* @__PURE__ */ jsx("span", {
									className: "text-[11px] sm:text-xs font-bold text-[#dfad36] uppercase tracking-wider bg-[#0c2340]/90 border border-[#c59324]/50 px-2.5 py-0.5 rounded-full shadow-md",
									children: "Core R&D Hub"
								})
							})]
						}),
						/* @__PURE__ */ jsx("div", {
							className: "absolute -top-2 right-4 sm:top-2 sm:right-6 z-20 w-24 h-24 sm:w-28 sm:h-28 rounded-full p-1.5 bg-white shadow-xl border-2 border-[#dfad36] overflow-hidden hover:scale-110 transition-transform cursor-pointer group",
							children: /* @__PURE__ */ jsx("img", {
								src: "/images/pharma_automation_line.jpg",
								alt: "High Speed Robotic Packaging Line",
								className: "w-full h-full object-cover rounded-full"
							})
						}),
						/* @__PURE__ */ jsx("div", {
							className: "absolute -bottom-2 left-2 sm:bottom-4 sm:left-4 z-20 w-22 h-22 sm:w-26 sm:h-26 rounded-full p-1.5 bg-white shadow-xl border-2 border-[#dfad36] overflow-hidden hover:scale-110 transition-transform cursor-pointer group",
							children: /* @__PURE__ */ jsx("img", {
								src: "/images/ciplon_facility.jpg",
								alt: "Formulation Cleanroom",
								className: "w-full h-full object-cover rounded-full"
							})
						}),
						/* @__PURE__ */ jsx("div", {
							className: "absolute bottom-6 right-2 sm:bottom-8 sm:right-4 z-20 w-20 h-20 sm:w-24 sm:h-24 rounded-full p-1.5 bg-white shadow-xl border-2 border-[#dfad36] overflow-hidden hover:scale-110 transition-transform cursor-pointer group",
							children: /* @__PURE__ */ jsx("img", {
								src: "/images/ciplon_lab.jpg",
								alt: "Analytical Spectroscopy",
								className: "w-full h-full object-cover rounded-full"
							})
						}),
						/* @__PURE__ */ jsx("div", {
							className: "absolute top-1/2 -left-2 w-5 h-5 rounded-full bg-[#c59324] border-2 border-white shadow-md flex items-center justify-center",
							children: /* @__PURE__ */ jsx("div", { className: "w-2 h-2 rounded-full bg-white animate-ping" })
						}),
						/* @__PURE__ */ jsx("div", {
							className: "absolute top-1/2 -right-2 w-5 h-5 rounded-full bg-[#c59324] border-2 border-white shadow-md flex items-center justify-center",
							children: /* @__PURE__ */ jsx("div", { className: "w-2 h-2 rounded-full bg-white animate-ping" })
						})
					]
				})
			}), /* @__PURE__ */ jsxs("div", {
				className: "lg:col-span-6 space-y-6",
				children: [
					/* @__PURE__ */ jsx("p", {
						className: "text-sm sm:text-base text-slate-700 leading-relaxed font-normal",
						children: "R&D is the cornerstone of Ciplon's success. A high-calibre team works round the clock with a quest to develop a progressive and formidable product basket that includes novel doses, generics, biosimilars and parenteral formulations to address unmet global healthcare needs."
					}),
					/* @__PURE__ */ jsx("div", {
						className: "space-y-3.5 pt-2",
						children: [
							{
								highlight: "6 - 7%",
								text: "of turnover invested in R&D every year"
							},
							{
								highlight: "Over 1,00,000 sq ft",
								text: "dedicated R&D and analytical space"
							},
							{
								highlight: "650+ scientists",
								text: "and researchers working across therapeutic areas"
							},
							{
								highlight: "17 advanced",
								text: "formulation and bio-analytical research facilities"
							},
							{
								highlight: "Global Regulatory Authority",
								text: "accreditations including USFDA, WHO-GMP & MHRA"
							},
							{
								highlight: "Pioneers in biosimilars",
								text: "and novel extended-release drug delivery systems"
							}
						].map((item, index) => /* @__PURE__ */ jsxs("div", {
							className: "flex items-start gap-3 group",
							children: [/* @__PURE__ */ jsx("div", {
								className: "w-5 h-5 rounded-full bg-amber-50 text-[#c59324] border border-amber-200/60 flex items-center justify-center shrink-0 mt-0.5 group-hover:bg-[#0c2340] group-hover:text-[#dfad36] transition-colors",
								children: /* @__PURE__ */ jsx(ChevronRight, { className: "w-3.5 h-3.5 stroke-[3]" })
							}), /* @__PURE__ */ jsxs("p", {
								className: "text-xs sm:text-sm text-slate-700 leading-snug",
								children: [
									/* @__PURE__ */ jsx("strong", {
										className: "text-[#0c2340] font-bold",
										children: item.highlight
									}),
									" ",
									/* @__PURE__ */ jsx("span", { children: item.text })
								]
							})]
						}, index))
					}),
					/* @__PURE__ */ jsx("div", {
						className: "pt-4",
						children: /* @__PURE__ */ jsx("button", {
							type: "button",
							onClick: () => setIsModalOpen(true),
							className: "px-8 py-3 rounded-full bg-[#0c2340] hover:bg-[#123055] text-white border border-[#c59324]/40 font-bold text-xs sm:text-sm tracking-wider uppercase transition-all shadow-md shadow-[#0c2340]/25 hover:shadow-lg hover:scale-105 cursor-pointer",
							children: "READ MORE"
						})
					})
				]
			})]
		})] }), isModalOpen && /* @__PURE__ */ jsx("div", {
			className: "fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-in fade-in duration-200",
			children: /* @__PURE__ */ jsxs("div", {
				className: "bg-white rounded-3xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl border border-slate-100 relative max-h-[90vh] overflow-y-auto",
				children: [
					/* @__PURE__ */ jsx("button", {
						type: "button",
						onClick: () => setIsModalOpen(false),
						className: "absolute top-5 right-5 p-2 rounded-full bg-slate-100 text-slate-500 hover:bg-slate-200 transition-colors cursor-pointer",
						children: /* @__PURE__ */ jsx(X, { className: "w-5 h-5" })
					}),
					/* @__PURE__ */ jsxs("div", {
						className: "flex items-center gap-3 mb-4",
						children: [/* @__PURE__ */ jsx("div", {
							className: "w-12 h-12 rounded-2xl bg-sky-50 text-[#0069b4] flex items-center justify-center border border-sky-100",
							children: /* @__PURE__ */ jsx(Microscope, { className: "w-6 h-6" })
						}), /* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("h3", {
							className: "text-xl font-bold text-[#003e6d]",
							children: "Ciplon Research & Development"
						}), /* @__PURE__ */ jsx("p", {
							className: "text-xs text-slate-500",
							children: "Transforming Science into High-Affordability Therapies"
						})] })]
					}),
					/* @__PURE__ */ jsxs("div", {
						className: "space-y-4 text-xs sm:text-sm text-slate-600 leading-relaxed pt-2",
						children: [
							/* @__PURE__ */ jsx("p", { children: "Our formulation scientists focus on complex generics, bioequivalence, and modified-release tablets and capsules. With dedicated stability chambers under ICH Climatic Zone IVB guidelines, every product undergoes forced degradation, dissolution kinetics, and analytical testing." }),
							/* @__PURE__ */ jsxs("div", {
								className: "grid grid-cols-2 gap-3 py-2",
								children: [/* @__PURE__ */ jsxs("div", {
									className: "p-3 rounded-xl bg-slate-50 border border-slate-200",
									children: [/* @__PURE__ */ jsx("div", {
										className: "text-xs font-bold text-slate-900",
										children: "Bioequivalence Testing"
									}), /* @__PURE__ */ jsx("div", {
										className: "text-[11px] text-slate-500 mt-1",
										children: "Multi-media comparative in-vitro dissolution profiling"
									})]
								}), /* @__PURE__ */ jsxs("div", {
									className: "p-3 rounded-xl bg-slate-50 border border-slate-200",
									children: [/* @__PURE__ */ jsx("div", {
										className: "text-xs font-bold text-slate-900",
										children: "HPLC & Mass Spec"
									}), /* @__PURE__ */ jsx("div", {
										className: "text-[11px] text-slate-500 mt-1",
										children: "High sensitivity impurity profiling & chiral separations"
									})]
								})]
							}),
							/* @__PURE__ */ jsx("p", { children: "Ciplon authors Common Technical Documents (eCTD) for regulatory filings across the US, Europe, ASEAN, and CIS markets, helping ensure speedy therapeutic access worldwide." })
						]
					}),
					/* @__PURE__ */ jsx("div", {
						className: "mt-6 pt-4 border-t border-slate-100 flex justify-end",
						children: /* @__PURE__ */ jsx("button", {
							type: "button",
							onClick: () => setIsModalOpen(false),
							className: "px-6 py-2 rounded-xl bg-[#0069b4] text-white text-xs font-bold hover:bg-[#005a9c] transition-colors cursor-pointer",
							children: "Close"
						})
					})
				]
			})
		})]
	});
}
//#endregion
//#region resources/js/components/home/LatestNewsSection.jsx
function LatestNewsSection() {
	const [selectedArticle, setSelectedArticle] = useState(null);
	return /* @__PURE__ */ jsxs("section", {
		id: "news",
		className: "py-16 sm:py-24 bg-slate-50 border-b border-slate-100",
		children: [/* @__PURE__ */ jsxs(Container, { children: [/* @__PURE__ */ jsxs("div", {
			className: "text-center mb-12 sm:mb-16",
			children: [/* @__PURE__ */ jsx("h2", {
				className: "text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight text-[#0c2340] uppercase",
				children: "LATEST NEWS"
			}), /* @__PURE__ */ jsx("div", { className: "w-20 h-1 bg-gradient-to-r from-[#c59324] to-[#dfad36] mx-auto mt-2 rounded-full" })]
		}), /* @__PURE__ */ jsx("div", {
			className: "grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto",
			children: [
				{
					id: 1,
					image: "/images/pharma_product_boxes.jpg",
					date: "15 March 2026",
					badge: "Product Launch",
					title: "Ciplon launches THYMOTAS - a potent, patented novel immunomodulator in standard sepsis & infection care",
					summary: "Ciplon Pharmaceuticals has announced the commercial launch of Thymotas, an innovative therapeutic agent engineered for enhanced immune response and rapid clinical recovery in intensive care settings.",
					fullContent: "Ciplon Pharmaceuticals today launched Thymotas across premier hospital networks. Backed by extensive multicenter clinical trials demonstrating a 34% reduction in ICU recovery duration, Thymotas represents a milestone in hospital-acquired sepsis management. Formulated at our USFDA and WHO-GMP approved injectable facility, it guarantees sterile, endotoxin-free delivery."
				},
				{
					id: 2,
					image: "/images/pharma_automation_line.jpg",
					date: "08 February 2026",
					badge: "Manufacturing",
					title: "Ciplon commissions robotic high-speed sterile packaging facility at flagship formulation hub",
					summary: "State-of-the-art German robotic packaging line installed to boost annual oral solid and sterile vial throughput to over 4.5 billion units with zero human intervention.",
					fullContent: "Demonstrating its commitment to Industry 4.0 automation, Ciplon has integrated automated robotic pick-and-pack conveyor lines with AI-guided 360-degree optical blister inspection. This ensures 100% defect-free packaging, barcoded anti-counterfeit serialisation, and compliance with the EU Falsified Medicines Directive (FMD)."
				},
				{
					id: 3,
					image: "/images/ciplon_lab.jpg",
					date: "10 December 2025",
					badge: "Regulatory Approval",
					title: "Ciplon receives European Medicines Agency (EMA) validation for key cardiovascular biosimilar",
					summary: "The regulatory clearance marks a significant milestone in expanding Ciplon’s specialized therapy footprint in European and highly regulated markets.",
					fullContent: "Ciplon Biologics has secured positive recommendation from the European Medicines Agency (EMA) for its complex cardiovascular biosimilar formulation. This dossier clearance paves the way for direct hospital supply across 27 EU member states, lowering healthcare costs for patients without compromising therapeutic equivalence."
				}
			].map((item) => /* @__PURE__ */ jsxs("article", {
				onClick: () => setSelectedArticle(item),
				className: "group bg-white rounded-2xl border border-slate-200/90 shadow-sm hover:shadow-xl hover:border-[#c59324]/50 transition-all duration-300 flex flex-col justify-between overflow-hidden cursor-pointer",
				children: [/* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsxs("div", {
					className: "relative w-full h-48 sm:h-52 bg-slate-100 overflow-hidden",
					children: [/* @__PURE__ */ jsx("img", {
						src: item.image,
						alt: item.title,
						className: "w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
					}), /* @__PURE__ */ jsx("div", {
						className: "absolute top-3 right-3 px-2.5 py-1 rounded-md bg-white/95 backdrop-blur-md text-[10px] font-bold text-[#0c2340] border border-amber-200/80 shadow-xs",
						children: item.badge
					})]
				}), /* @__PURE__ */ jsxs("div", {
					className: "p-5 sm:p-6 space-y-3",
					children: [
						/* @__PURE__ */ jsxs("div", {
							className: "flex items-center gap-1.5 text-xs text-slate-400 font-semibold",
							children: [/* @__PURE__ */ jsx(Calendar, { className: "w-3.5 h-3.5 text-[#c59324]" }), /* @__PURE__ */ jsx("span", { children: item.date })]
						}),
						/* @__PURE__ */ jsx("h3", {
							className: "text-sm sm:text-base font-bold text-[#0c2340] group-hover:text-[#c59324] transition-colors leading-snug line-clamp-3",
							children: item.title
						}),
						/* @__PURE__ */ jsx("p", {
							className: "text-xs text-slate-500 leading-relaxed line-clamp-3",
							children: item.summary
						})
					]
				})] }), /* @__PURE__ */ jsx("div", {
					className: "px-5 sm:px-6 pb-5 pt-0",
					children: /* @__PURE__ */ jsx("div", {
						className: "pt-3 border-t border-slate-100 flex items-center justify-between",
						children: /* @__PURE__ */ jsxs("span", {
							className: "text-xs font-bold text-[#c59324] group-hover:text-[#0c2340] inline-flex items-center gap-1",
							children: [/* @__PURE__ */ jsx("span", { children: "READ MORE" }), /* @__PURE__ */ jsx(ArrowRight, { className: "w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" })]
						})
					})
				})]
			}, item.id))
		})] }), selectedArticle && /* @__PURE__ */ jsx("div", {
			className: "fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-in fade-in duration-200",
			children: /* @__PURE__ */ jsxs("div", {
				className: "bg-white rounded-3xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl border border-slate-100 relative max-h-[90vh] overflow-y-auto",
				children: [
					/* @__PURE__ */ jsx("button", {
						type: "button",
						onClick: () => setSelectedArticle(null),
						className: "absolute top-5 right-5 p-2 rounded-full bg-slate-100 text-slate-500 hover:bg-slate-200 transition-colors cursor-pointer",
						children: /* @__PURE__ */ jsx(X, { className: "w-5 h-5" })
					}),
					/* @__PURE__ */ jsx("div", {
						className: "rounded-xl overflow-hidden mb-4 h-56 w-full",
						children: /* @__PURE__ */ jsx("img", {
							src: selectedArticle.image,
							alt: selectedArticle.title,
							className: "w-full h-full object-cover"
						})
					}),
					/* @__PURE__ */ jsxs("div", {
						className: "flex items-center gap-3 text-xs text-slate-400 mb-2 font-semibold",
						children: [
							/* @__PURE__ */ jsx("span", {
								className: "px-2.5 py-0.5 rounded-full bg-sky-50 text-[#0069b4] font-bold",
								children: selectedArticle.badge
							}),
							/* @__PURE__ */ jsx("span", { children: "•" }),
							/* @__PURE__ */ jsx("span", { children: selectedArticle.date })
						]
					}),
					/* @__PURE__ */ jsx("h3", {
						className: "text-lg sm:text-xl font-bold text-slate-900 leading-snug mb-3",
						children: selectedArticle.title
					}),
					/* @__PURE__ */ jsxs("div", {
						className: "space-y-3 text-xs sm:text-sm text-slate-600 leading-relaxed",
						children: [/* @__PURE__ */ jsx("p", { children: selectedArticle.fullContent }), /* @__PURE__ */ jsx("p", { children: "For further commercial licensing and institutional distribution agreements, contact our corporate medical communications division." })]
					}),
					/* @__PURE__ */ jsx("div", {
						className: "mt-6 pt-4 border-t border-slate-100 flex justify-end",
						children: /* @__PURE__ */ jsx("button", {
							type: "button",
							onClick: () => setSelectedArticle(null),
							className: "px-6 py-2 rounded-xl bg-[#0069b4] text-white text-xs font-bold hover:bg-[#005a9c] transition-colors cursor-pointer",
							children: "Close Release"
						})
					})
				]
			})
		})]
	});
}
//#endregion
//#region resources/js/components/home/FeaturedProductsSection.jsx
function FeaturedProductsSection({ products = [], onOpenEnquiryModal }) {
	const [selectedFilter, setSelectedFilter] = useState("ALL");
	const formattedItems = useMemo(() => {
		return (products || []).map((p, index) => {
			const imagePath = p.primary_image?.file_path ? p.primary_image.file_path.startsWith("/") ? p.primary_image.file_path : `/${p.primary_image.file_path}` : p.primaryImage?.file_path ? p.primaryImage.file_path.startsWith("/") ? p.primaryImage.file_path : `/${p.primaryImage.file_path}` : p.imageUrl || p.image_url || p.primary_image?.url || p.primaryImage?.url || "/images/pharma_product_boxes.jpg";
			return {
				id: p.id || p.slug || index,
				slug: p.slug || p.id,
				name: p.brand_name || p.name || "Ciplon Formulation",
				image: imagePath,
				category: p.category?.name || "Formulations",
				generic: p.generic_name || p.composition || "Therapeutic formulation",
				dosageForm: p.dosage_form || "Tablet / Capsule",
				strength: p.strength || "Standard Dosage",
				description: p.short_description || p.description || "WHO-GMP validated finished formulation.",
				isDatabase: true
			};
		});
	}, [products]);
	const categoriesList = useMemo(() => {
		const set = /* @__PURE__ */ new Set(["ALL"]);
		(products || []).forEach((p) => {
			if (p.category?.name) set.add(p.category.name);
		});
		return Array.from(set);
	}, [products]);
	const displayedItems = useMemo(() => {
		if (selectedFilter === "ALL") return formattedItems;
		return formattedItems.filter((item) => item.category === selectedFilter);
	}, [formattedItems, selectedFilter]);
	return /* @__PURE__ */ jsx("section", {
		id: "products",
		className: "py-16 sm:py-24 bg-white border-b border-slate-100",
		children: /* @__PURE__ */ jsxs(Container, { children: [
			/* @__PURE__ */ jsxs("div", {
				className: "text-center mb-10 sm:mb-12",
				children: [
					/* @__PURE__ */ jsx("h2", {
						className: "text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight text-[#0c2340] uppercase",
						children: "FEATURED PRODUCTS"
					}),
					/* @__PURE__ */ jsx("div", { className: "w-20 h-1 bg-gradient-to-r from-[#c59324] to-[#dfad36] mx-auto mt-2 rounded-full" }),
					/* @__PURE__ */ jsx("p", {
						className: "text-xs sm:text-sm text-slate-500 max-w-xl mx-auto mt-3",
						children: "High-purity plasma therapeutics and finished formulations manufactured under strict WHO-GMP compliance."
					})
				]
			}),
			/* @__PURE__ */ jsx("div", {
				className: "flex items-center justify-center gap-2 overflow-x-auto pb-2 mb-10 no-scrollbar",
				children: categoriesList.map((cat) => /* @__PURE__ */ jsx("button", {
					type: "button",
					onClick: () => setSelectedFilter(cat),
					className: `px-4 py-1.5 rounded-full text-xs font-semibold transition-all cursor-pointer whitespace-nowrap ${selectedFilter === cat ? "bg-[#0c2340] text-white border border-[#0c2340]" : "bg-white text-slate-600 hover:text-[#c59324] hover:border-[#c59324] border border-slate-200"}`,
					children: cat === "ALL" ? "All Formulations" : cat
				}, cat))
			}),
			/* @__PURE__ */ jsx("div", {
				className: "grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8 max-w-6xl mx-auto items-stretch",
				children: displayedItems.map((item) => /* @__PURE__ */ jsxs("div", {
					className: "bg-white rounded-2xl border border-slate-200/90 hover:border-[#c59324] hover:shadow-lg hover:shadow-slate-200/50 transition-all duration-300 flex flex-col justify-between group overflow-hidden",
					children: [/* @__PURE__ */ jsxs("div", {
						className: "p-6 pb-2",
						children: [
							/* @__PURE__ */ jsxs("div", {
								className: "flex items-center justify-between gap-2 pb-3.5 border-b border-slate-100 text-xs",
								children: [/* @__PURE__ */ jsx("span", {
									className: "font-bold text-[#c59324] uppercase tracking-wider text-[11px] truncate",
									children: item.category
								}), /* @__PURE__ */ jsx("span", {
									className: "inline-flex items-center px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 font-semibold text-[10px] uppercase tracking-wider shrink-0",
									children: item.dosageForm
								})]
							}),
							/* @__PURE__ */ jsx(Link, {
								href: `/products/${item.slug || item.id}`,
								className: "w-full h-56 sm:h-60 flex items-center justify-center p-4 my-2 bg-gradient-to-b from-slate-50/50 via-white to-slate-50/30 rounded-xl block relative overflow-hidden",
								children: /* @__PURE__ */ jsx("img", {
									src: item.image,
									alt: item.name,
									className: "max-h-full max-w-full object-contain filter drop-shadow-sm transition-transform duration-300 group-hover:scale-105"
								})
							}),
							/* @__PURE__ */ jsxs("div", {
								className: "space-y-1.5 pt-2",
								children: [/* @__PURE__ */ jsx(Link, {
									href: `/products/${item.slug || item.id}`,
									className: "text-lg sm:text-xl font-bold text-[#0c2340] group-hover:text-[#c59324] transition-colors block leading-tight tracking-tight line-clamp-1",
									title: item.name,
									children: item.name
								}), /* @__PURE__ */ jsx("p", {
									className: "text-xs font-medium text-slate-600 leading-snug line-clamp-2 min-h-[2.5rem]",
									children: item.generic
								})]
							}),
							/* @__PURE__ */ jsxs("div", {
								className: "flex items-center justify-between text-xs py-2.5 px-3 my-3 bg-slate-50/80 rounded-xl border border-slate-100",
								children: [/* @__PURE__ */ jsxs("div", {
									className: "flex items-center gap-1.5 min-w-0 pr-2",
									children: [/* @__PURE__ */ jsx("span", {
										className: "text-slate-400 font-medium text-[11px] shrink-0",
										children: "Strength:"
									}), /* @__PURE__ */ jsx("span", {
										className: "font-semibold text-[#0c2340] text-[11px] truncate",
										title: item.strength,
										children: item.strength
									})]
								}), /* @__PURE__ */ jsxs("div", {
									className: "flex items-center gap-1 text-emerald-700 font-semibold text-[11px] shrink-0 bg-emerald-50/80 px-2 py-0.5 rounded-md border border-emerald-100",
									children: [/* @__PURE__ */ jsx(ShieldCheck, { className: "w-3.5 h-3.5 text-emerald-600" }), /* @__PURE__ */ jsx("span", { children: "WHO-GMP" })]
								})]
							}),
							/* @__PURE__ */ jsx("p", {
								className: "text-xs text-slate-500 leading-relaxed line-clamp-2 min-h-[2rem]",
								children: item.description
							})
						]
					}), /* @__PURE__ */ jsxs("div", {
						className: "p-6 pt-3 mt-2 border-t border-slate-100 flex items-center gap-2.5 bg-slate-50/30",
						children: [/* @__PURE__ */ jsx(Link, {
							href: `/products/${item.slug || item.id}`,
							className: "flex-1 py-2.5 rounded-xl border border-slate-200 hover:border-[#c59324] hover:text-[#c59324] text-slate-700 text-center font-semibold text-xs transition-colors bg-white shadow-xs",
							children: "Monograph"
						}), /* @__PURE__ */ jsx("button", {
							type: "button",
							onClick: () => {
								if (typeof onOpenEnquiryModal === "function") onOpenEnquiryModal();
							},
							className: "flex-1 py-2.5 rounded-xl bg-[#0c2340] hover:bg-[#c59324] text-white text-center font-semibold text-xs transition-colors cursor-pointer shadow-xs",
							children: "Enquire Supply"
						})]
					})]
				}, item.id))
			}),
			/* @__PURE__ */ jsx("div", {
				className: "mt-12 sm:mt-14 text-center",
				children: /* @__PURE__ */ jsxs(Link, {
					href: "/products",
					className: "inline-flex items-center gap-2 px-8 py-3.5 rounded-xl bg-[#0c2340] hover:bg-[#c59324] text-white font-semibold text-xs sm:text-sm tracking-wider uppercase transition-colors cursor-pointer",
					children: [/* @__PURE__ */ jsx("span", { children: "Explore All Formulations" }), /* @__PURE__ */ jsx(ArrowRight, { className: "w-4 h-4 text-[#dfad36]" })]
				})
			})
		] })
	});
}
//#endregion
//#region resources/js/Pages/public/HomePage.jsx
var HomePage_exports = /* @__PURE__ */ __exportAll({ default: () => HomePage });
function HomePage({ featuredProducts = [], categories = [], company = null }) {
	const { props } = usePage();
	const companyData = company || props.company || {};
	const products = featuredProducts.length > 0 ? featuredProducts : [];
	const [isEnquiryModalOpen, setIsEnquiryModalOpen] = useState(false);
	const handleScrollToProducts = () => {
		const el = document.getElementById("products");
		if (el) el.scrollIntoView({ behavior: "smooth" });
		else router.get("/products");
	};
	const handleContactUs = () => {
		setIsEnquiryModalOpen(true);
	};
	return /* @__PURE__ */ jsxs(PublicLayout, {
		companyData,
		categories,
		children: [/* @__PURE__ */ jsx(SeoHead, {
			title: "Ciplon Pharma — WHO-GMP & ISO 9001:2015 Formulations & PCD Pharma",
			description: "Ciplon Pharma Private Limited delivers WHO-GMP certified finished pharmaceutical formulations, PCD pharma franchises, hospital supplies, and high-quality generics across India.",
			canonicalUrl: "https://www.ciplonpharma.in",
			schemaJson: {
				"@context": "https://schema.org",
				"@type": "MedicalOrganization",
				name: "Ciplon Pharma Private Limited",
				alternateName: "Ciplon Pharma",
				url: "https://www.ciplonpharma.in",
				logo: "https://www.ciplonpharma.in/images/ciplon_logo.png",
				description: "ISO 9001:2015 certified pharmaceutical formulations company marketing WHO-GMP finished formulations across India.",
				address: {
					"@type": "PostalAddress",
					streetAddress: "M24/A, KH No. 294, 1st Floor, Batla House, Okhla, Jamia Nagar, South Delhi",
					addressLocality: "New Delhi",
					addressRegion: "Delhi",
					postalCode: "110025",
					addressCountry: "IN"
				},
				contactPoint: {
					"@type": "ContactPoint",
					telephone: "+91-8004587290",
					contactType: "customer support",
					areaServed: "IN",
					availableLanguage: ["en", "hi"]
				}
			}
		}), /* @__PURE__ */ jsxs("div", {
			className: "w-full bg-white text-slate-900 selection:bg-[#c59324] selection:text-white",
			children: [
				/* @__PURE__ */ jsx(IntasHeroBanner, {
					onExploreProducts: handleScrollToProducts,
					onContactUs: handleContactUs,
					onOpenEnquiryModal: () => setIsEnquiryModalOpen(true)
				}),
				/* @__PURE__ */ jsx(CompanyIntroSection, {}),
				/* @__PURE__ */ jsx(ExcellenceStatsSection, {}),
				/* @__PURE__ */ jsx(ScienceIntoSmilesSection, {}),
				/* @__PURE__ */ jsx(LatestNewsSection, {}),
				/* @__PURE__ */ jsx(FeaturedProductsSection, {
					products,
					onOpenEnquiryModal: () => setIsEnquiryModalOpen(true)
				}),
				/* @__PURE__ */ jsx(EnquiryModal, {
					isOpen: isEnquiryModalOpen,
					onClose: () => setIsEnquiryModalOpen(false)
				})
			]
		})]
	});
}
//#endregion
//#region resources/js/Pages/public/ProductDetailsPage.jsx
var ProductDetailsPage_exports = /* @__PURE__ */ __exportAll({ default: () => ProductDetailsPage });
function ProductDetailsPage({ product, relatedProducts: initialRelated = [], categories = [] }) {
	const [selectedImageIndex, setSelectedImageIndex] = useState(0);
	const [copiedLink, setCopiedLink] = useState(false);
	const [isEnquiryOpen, setIsEnquiryOpen] = useState(false);
	const [isImageHovered, setIsImageHovered] = useState(false);
	const brandName = product?.brandName || product?.brand_name || "Pharmaceutical Formulation";
	const genericName = product?.genericName || product?.generic_name || "";
	const productCode = product?.productCode || product?.product_code || "";
	const dosageForm = product?.dosageForm || product?.dosage_form || "Finished Formulation";
	const strength = product?.strength || "Clinical Strength";
	product?.packSize || product?.pack_size;
	const description = product?.description || product?.short_description || "Finished pharmaceutical formulation produced in strict compliance with current Good Manufacturing Practices (cGMP). Complete analytical specifications, stability documentation, and batch release data are maintained in our central regulatory repository.";
	const indications = product?.indications || "For clinical management and therapeutic treatment as documented in approved pharmaceutical compendia and product technical dossiers.";
	const directions = product?.directions || "To be administered strictly under the supervision of a registered medical practitioner in accordance with clinical dosing protocols.";
	const precautions = product?.precautions || "Contraindicated in patients with documented hypersensitivity to active substances or excipients. Monitor clinical response in specific patient cohorts.";
	const storage = product?.storage || "Store in a dry, ventilated area below 25°C. Protect from moisture and direct sunlight. Keep out of reach of children.";
	const categoryName = product?.category?.name || (typeof product?.category === "string" ? product.category : "") || product?.therapeuticArea || "Therapeutic Portfolio";
	const prescriptionType = product?.prescriptionType || product?.prescription_type || "Rx Only";
	const images = useMemo(() => {
		const list = [];
		const getSrc = (img) => {
			if (!img) return null;
			if (typeof img === "string") return img;
			if (img.file_path) return img.file_path.startsWith("/") ? img.file_path : `/${img.file_path}`;
			return img.url || img.image_url || null;
		};
		const primarySrc = getSrc(product?.primary_image || product?.primaryImage);
		if (primarySrc) list.push(primarySrc);
		if (Array.isArray(product?.images)) product.images.forEach((img) => {
			const src = getSrc(img);
			if (src && !list.includes(src)) list.push(src);
		});
		if (product?.image && !list.includes(product.image)) list.push(product.image);
		return list;
	}, [product]);
	useEffect(() => {
		if (images.length <= 1 || isImageHovered) return;
		const timer = setTimeout(() => {
			setSelectedImageIndex((prev) => prev >= images.length - 1 ? 0 : prev + 1);
		}, 3e3);
		return () => clearTimeout(timer);
	}, [
		images.length,
		isImageHovered,
		selectedImageIndex
	]);
	const compositions = useMemo(() => {
		if (Array.isArray(product?.compositions) && product.compositions.length > 0) return product.compositions;
		return [];
	}, [product]);
	const relatedProducts = initialRelated.slice(0, 3);
	const productSchema = {
		"@context": "https://schema.org",
		"@type": "Drug",
		name: brandName,
		nonProprietaryName: genericName,
		description,
		dosageForm,
		prescriptionStatus: prescriptionType,
		manufacturer: {
			"@type": "Organization",
			name: "Walpar Wellness Pvt. Ltd."
		},
		recognizingAuthority: {
			"@type": "Organization",
			name: "WHO-GMP & ISO 9001:2015"
		},
		image: images.length > 0 ? images[0] : "https://www.ciplonpharma.in/images/ciplon_logo.png"
	};
	const handleShare = () => {
		if (navigator?.clipboard) {
			navigator.clipboard.writeText(window.location.href);
			setCopiedLink(true);
			setTimeout(() => setCopiedLink(false), 2e3);
		}
	};
	if (!product) return /* @__PURE__ */ jsx(PublicLayout, {
		categories,
		children: /* @__PURE__ */ jsx("div", {
			className: "py-20 bg-slate-50 min-h-[60vh] flex items-center",
			children: /* @__PURE__ */ jsx(Container, { children: /* @__PURE__ */ jsxs("div", {
				className: "max-w-md mx-auto text-center space-y-5 p-8 bg-white rounded-3xl border border-slate-200 shadow-sm",
				children: [
					/* @__PURE__ */ jsx("div", {
						className: "w-14 h-14 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center mx-auto",
						children: /* @__PURE__ */ jsx(AlertCircle, { className: "w-7 h-7 stroke-[1.8]" })
					}),
					/* @__PURE__ */ jsx("h2", {
						className: "text-xl font-bold text-slate-900",
						children: "Formulation Not Found"
					}),
					/* @__PURE__ */ jsx("p", {
						className: "text-xs text-slate-500 leading-relaxed",
						children: "The requested pharmaceutical product formulation could not be located in our current catalog."
					}),
					/* @__PURE__ */ jsx("div", {
						className: "pt-2",
						children: /* @__PURE__ */ jsxs(Link, {
							href: "/products",
							className: "inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#0c2340] hover:bg-[#c59324] text-white text-xs font-semibold transition-colors cursor-pointer",
							children: [/* @__PURE__ */ jsx(ArrowLeft, { className: "w-4 h-4" }), /* @__PURE__ */ jsx("span", { children: "Return to Products Catalog" })]
						})
					})
				]
			}) })
		})
	});
	return /* @__PURE__ */ jsxs(PublicLayout, {
		categories,
		children: [/* @__PURE__ */ jsx(SeoHead, {
			title: `${brandName} (${dosageForm} ${strength}) — Formulation Details`,
			description: `${brandName} (${genericName || dosageForm}) manufactured under WHO-GMP compliance. View clinical indications, dosage, composition, and technical dossier specifications.`,
			canonicalUrl: `https://www.ciplonpharma.in/products/${product.slug || product.product_code || product.id}`,
			ogImage: images.length > 0 ? images[0] : "/images/ciplon_logo.png",
			ogType: "article",
			schemaJson: productSchema
		}), /* @__PURE__ */ jsx("div", {
			className: "bg-white pt-2 pb-14 min-h-screen",
			children: /* @__PURE__ */ jsxs(Container, { children: [
				/* @__PURE__ */ jsx("div", {
					className: "hidden md:flex items-center text-xs text-slate-500 mb-3",
					children: /* @__PURE__ */ jsxs("nav", {
						className: "flex items-center gap-1.5 font-medium flex-wrap",
						children: [
							/* @__PURE__ */ jsx(Link, {
								href: "/",
								className: "hover:text-[#c59324] transition-colors",
								children: "Home"
							}),
							/* @__PURE__ */ jsx(ChevronRight, { className: "w-3.5 h-3.5 text-slate-300 shrink-0" }),
							/* @__PURE__ */ jsx(Link, {
								href: "/products",
								className: "hover:text-[#c59324] transition-colors",
								children: "Products Catalog"
							}),
							categoryName && /* @__PURE__ */ jsxs(Fragment, { children: [/* @__PURE__ */ jsx(ChevronRight, { className: "w-3.5 h-3.5 text-slate-300 shrink-0" }), /* @__PURE__ */ jsx("span", {
								className: "text-slate-600",
								children: categoryName
							})] }),
							brandName && /* @__PURE__ */ jsxs(Fragment, { children: [/* @__PURE__ */ jsx(ChevronRight, { className: "w-3.5 h-3.5 text-slate-300 shrink-0" }), /* @__PURE__ */ jsx("span", {
								className: "text-[#0c2340] font-bold truncate max-w-[220px]",
								children: brandName
							})] })
						]
					})
				}),
				/* @__PURE__ */ jsxs("div", {
					className: "grid grid-cols-1 lg:grid-cols-12 gap-5 lg:gap-8 items-start mb-6",
					children: [/* @__PURE__ */ jsxs("div", {
						className: "lg:col-span-5 space-y-2.5",
						children: [/* @__PURE__ */ jsxs("div", {
							className: "bg-slate-50/70 rounded-2xl relative aspect-[4/3] overflow-hidden group border border-slate-200/80 p-3 flex items-center justify-center",
							onMouseEnter: () => setIsImageHovered(true),
							onMouseLeave: () => setIsImageHovered(false),
							children: [
								/* @__PURE__ */ jsxs("div", {
									className: "absolute top-2.5 left-2.5 z-10 flex flex-wrap items-center gap-1 max-w-[70%]",
									children: [dosageForm && /* @__PURE__ */ jsx("span", {
										className: "px-2.5 py-0.5 rounded-full text-[10px] sm:text-[11px] font-bold uppercase tracking-wider bg-[#0c2340] text-white shadow-xs",
										children: dosageForm
									}), prescriptionType && /* @__PURE__ */ jsx("span", {
										className: "px-2 py-0.5 rounded-full text-[10px] sm:text-[11px] font-semibold uppercase tracking-wider bg-white/95 text-slate-700 border border-slate-200 shadow-xs",
										children: prescriptionType
									})]
								}),
								/* @__PURE__ */ jsx("button", {
									type: "button",
									onClick: handleShare,
									className: "absolute top-2.5 right-2.5 z-10 p-2 rounded-full bg-white/90 hover:bg-white text-slate-500 hover:text-[#c59324] transition-colors cursor-pointer border border-slate-200 shadow-xs",
									title: "Share Formulation",
									"aria-label": "Share Formulation",
									children: copiedLink ? /* @__PURE__ */ jsx(Check, { className: "w-4 h-4 text-[#c59324]" }) : /* @__PURE__ */ jsx(Share2, { className: "w-4 h-4" })
								}),
								images.length > 0 ? /* @__PURE__ */ jsx("img", {
									src: images[selectedImageIndex],
									alt: brandName,
									className: "w-full h-full object-cover transition-transform duration-300 group-hover:scale-105",
									onError: (e) => {
										e.currentTarget.style.display = "none";
									}
								}) : /* @__PURE__ */ jsxs("div", {
									className: "w-full h-full flex flex-col items-center justify-center text-center p-6 space-y-2",
									children: [/* @__PURE__ */ jsx("div", {
										className: "w-14 h-14 rounded-2xl bg-amber-50 text-[#c59324] border border-amber-200/60 flex items-center justify-center",
										children: /* @__PURE__ */ jsx(Pill, { className: "w-7 h-7 stroke-[1.8]" })
									}), /* @__PURE__ */ jsx("span", {
										className: "text-xs font-semibold text-slate-500",
										children: "Finished Formulation"
									})]
								})
							]
						}), images.length > 1 && /* @__PURE__ */ jsx("div", {
							className: "flex items-center gap-2 overflow-x-auto py-1 no-scrollbar",
							children: images.map((imgUrl, idx) => /* @__PURE__ */ jsx("button", {
								type: "button",
								onClick: () => setSelectedImageIndex(idx),
								className: `w-14 h-14 rounded-xl p-1 transition-all cursor-pointer overflow-hidden shrink-0 ${selectedImageIndex === idx ? "border-2 border-[#c59324] bg-white shadow-xs" : "border border-slate-200/80 bg-slate-50 hover:bg-white"}`,
								children: /* @__PURE__ */ jsx("img", {
									src: imgUrl,
									alt: "",
									className: "w-full h-full object-contain rounded-lg"
								})
							}, idx))
						})]
					}), /* @__PURE__ */ jsxs("div", {
						className: "lg:col-span-7 space-y-5",
						children: [
							/* @__PURE__ */ jsxs("div", { children: [
								/* @__PURE__ */ jsxs("div", {
									className: "flex items-center gap-2 flex-wrap mb-1.5",
									children: [categoryName && /* @__PURE__ */ jsx("span", {
										className: "text-[11px] font-bold uppercase tracking-wider text-[#c59324] bg-amber-50 px-2.5 py-0.5 rounded-full border border-amber-200/60",
										children: categoryName
									}), productCode && /* @__PURE__ */ jsxs(Fragment, { children: [/* @__PURE__ */ jsx("span", {
										className: "text-slate-300",
										children: "•"
									}), /* @__PURE__ */ jsxs("span", {
										className: "text-[11px] font-mono text-slate-500",
										children: ["Code: ", productCode]
									})] })]
								}),
								/* @__PURE__ */ jsx("h1", {
									className: "text-2xl sm:text-3xl font-bold text-[#0c2340] tracking-tight leading-tight",
									children: brandName
								}),
								genericName && /* @__PURE__ */ jsx("p", {
									className: "text-sm font-semibold text-slate-600 mt-1",
									children: genericName
								})
							] }),
							/* @__PURE__ */ jsxs("div", {
								className: "grid grid-cols-2 sm:grid-cols-3 gap-3 py-3 border-y border-slate-100",
								children: [
									/* @__PURE__ */ jsxs("div", {
										className: "bg-slate-50 rounded-xl p-2.5 border border-slate-100",
										children: [/* @__PURE__ */ jsx("span", {
											className: "text-[10px] uppercase font-bold text-slate-400 block tracking-wider",
											children: "Dosage Form"
										}), /* @__PURE__ */ jsx("span", {
											className: "text-xs font-bold text-[#0c2340]",
											children: dosageForm
										})]
									}),
									/* @__PURE__ */ jsxs("div", {
										className: "bg-slate-50 rounded-xl p-2.5 border border-slate-100",
										children: [/* @__PURE__ */ jsx("span", {
											className: "text-[10px] uppercase font-bold text-slate-400 block tracking-wider",
											children: "Strength"
										}), /* @__PURE__ */ jsx("span", {
											className: "text-xs font-bold text-[#0c2340]",
											children: strength
										})]
									}),
									/* @__PURE__ */ jsxs("div", {
										className: "bg-slate-50 rounded-xl p-2.5 col-span-2 sm:col-span-1 border border-slate-100",
										children: [/* @__PURE__ */ jsx("span", {
											className: "text-[10px] uppercase font-bold text-slate-400 block tracking-wider",
											children: "Prescription"
										}), /* @__PURE__ */ jsx("span", {
											className: "text-xs font-bold text-[#0c2340]",
											children: prescriptionType
										})]
									})
								]
							}),
							/* @__PURE__ */ jsxs("div", {
								className: "flex items-center gap-3 pt-1",
								children: [/* @__PURE__ */ jsx(Button, {
									variant: "primary",
									size: "md",
									onClick: () => setIsEnquiryOpen(true),
									className: "bg-[#0c2340] hover:bg-[#c59324] text-white font-bold text-xs sm:text-sm py-2.5 px-6 rounded-xl shadow-md transition-colors cursor-pointer",
									children: "Request Technical Dossier / Quote"
								}), /* @__PURE__ */ jsxs("button", {
									type: "button",
									onClick: handleShare,
									className: "inline-flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-semibold text-slate-600 hover:text-[#c59324] hover:border-[#c59324] transition-colors cursor-pointer",
									children: [copiedLink ? /* @__PURE__ */ jsx(Check, { className: "w-3.5 h-3.5 text-[#c59324]" }) : /* @__PURE__ */ jsx(Share2, { className: "w-3.5 h-3.5" }), /* @__PURE__ */ jsx("span", { children: copiedLink ? "Link Copied" : "Share" })]
								})]
							}),
							compositions.length > 0 && /* @__PURE__ */ jsxs("div", {
								className: "pt-2",
								children: [/* @__PURE__ */ jsx("h3", {
									className: "text-xs font-bold uppercase tracking-wider text-[#0c2340] mb-2",
									children: "Active Pharmaceutical Ingredients (API)"
								}), /* @__PURE__ */ jsx("div", {
									className: "border border-slate-100 rounded-xl overflow-hidden divide-y divide-slate-100 bg-white",
									children: compositions.map((comp, idx) => /* @__PURE__ */ jsxs("div", {
										className: "flex items-center justify-between px-3.5 py-2 text-xs",
										children: [/* @__PURE__ */ jsx("span", {
											className: "font-semibold text-slate-800",
											children: comp.ingredient_name || comp.ingredientName
										}), /* @__PURE__ */ jsxs("span", {
											className: "font-mono text-[#c59324] font-bold",
											children: [
												comp.strength,
												" ",
												comp.unit || "mg"
											]
										})]
									}, idx))
								})]
							})
						]
					})]
				}),
				/* @__PURE__ */ jsxs("div", {
					className: "border-t border-slate-100 pt-6 mt-6 space-y-6",
					children: [description && /* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("h3", {
						className: "text-sm font-bold text-slate-900 mb-2",
						children: "Description & Clinical Overview"
					}), /* @__PURE__ */ jsx("p", {
						className: "text-xs sm:text-sm text-slate-600 leading-relaxed whitespace-pre-line",
						children: description
					})] }), /* @__PURE__ */ jsxs("div", {
						className: "grid grid-cols-1 md:grid-cols-2 gap-4",
						children: [
							indications && /* @__PURE__ */ jsxs("div", {
								className: "bg-slate-50/70 rounded-2xl p-4 border border-slate-100",
								children: [/* @__PURE__ */ jsxs("h4", {
									className: "text-xs font-bold uppercase tracking-wider text-[#0c2340] mb-1.5 flex items-center gap-1.5",
									children: [/* @__PURE__ */ jsx(Activity, { className: "w-3.5 h-3.5 text-[#c59324]" }), /* @__PURE__ */ jsx("span", { children: "Indications" })]
								}), /* @__PURE__ */ jsx("p", {
									className: "text-xs text-slate-600 leading-relaxed",
									children: indications
								})]
							}),
							directions && /* @__PURE__ */ jsxs("div", {
								className: "bg-slate-50/70 rounded-2xl p-4 border border-slate-100",
								children: [/* @__PURE__ */ jsxs("h4", {
									className: "text-xs font-bold uppercase tracking-wider text-[#0c2340] mb-1.5 flex items-center gap-1.5",
									children: [/* @__PURE__ */ jsx(Clock, { className: "w-3.5 h-3.5 text-[#c59324]" }), /* @__PURE__ */ jsx("span", { children: "Dosage & Administration" })]
								}), /* @__PURE__ */ jsx("p", {
									className: "text-xs text-slate-600 leading-relaxed",
									children: directions
								})]
							}),
							precautions && /* @__PURE__ */ jsxs("div", {
								className: "bg-slate-50/70 rounded-2xl p-4 border border-slate-100",
								children: [/* @__PURE__ */ jsxs("h4", {
									className: "text-xs font-bold uppercase tracking-wider text-[#0c2340] mb-1.5 flex items-center gap-1.5",
									children: [/* @__PURE__ */ jsx(AlertCircle, { className: "w-3.5 h-3.5 text-[#c59324]" }), /* @__PURE__ */ jsx("span", { children: "Precautions & Warnings" })]
								}), /* @__PURE__ */ jsx("p", {
									className: "text-xs text-slate-600 leading-relaxed",
									children: precautions
								})]
							}),
							storage && /* @__PURE__ */ jsxs("div", {
								className: "bg-slate-50/70 rounded-2xl p-4 border border-slate-100",
								children: [/* @__PURE__ */ jsxs("h4", {
									className: "text-xs font-bold uppercase tracking-wider text-[#0c2340] mb-1.5 flex items-center gap-1.5",
									children: [/* @__PURE__ */ jsx(Thermometer, { className: "w-3.5 h-3.5 text-[#c59324]" }), /* @__PURE__ */ jsx("span", { children: "Storage Requirements" })]
								}), /* @__PURE__ */ jsx("p", {
									className: "text-xs text-slate-600 leading-relaxed",
									children: storage
								})]
							})
						]
					})]
				}),
				relatedProducts.length > 0 && /* @__PURE__ */ jsxs("div", {
					className: "border-t border-slate-100 pt-8 mt-8",
					children: [/* @__PURE__ */ jsxs("div", {
						className: "flex items-center justify-between mb-4",
						children: [/* @__PURE__ */ jsx("h3", {
							className: "text-base font-bold text-[#0c2340]",
							children: "Related Formulations"
						}), /* @__PURE__ */ jsxs(Link, {
							href: "/products",
							className: "text-xs font-semibold text-[#c59324] hover:text-[#9f6d0f] inline-flex items-center gap-1",
							children: [/* @__PURE__ */ jsx("span", { children: "View All" }), /* @__PURE__ */ jsx(ChevronRight, { className: "w-3.5 h-3.5" })]
						})]
					}), /* @__PURE__ */ jsx("div", {
						className: "grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-5",
						children: relatedProducts.map((p) => {
							const rBrand = p.brand_name || p.brandName;
							const rGeneric = p.generic_name || p.genericName;
							const rCode = p.product_code || p.productCode || p.id;
							const rForm = p.dosage_form || p.dosageForm;
							const rStrength = p.strength || "";
							const rImage = p.primary_image?.url || p.primaryImage?.url || Array.isArray(p.images) && p.images[0]?.url || "";
							return /* @__PURE__ */ jsxs(Link, {
								href: `/products/${p.id || rCode}`,
								className: "bg-white hover:border-[#c59324]/60 border border-slate-200/90 rounded-2xl p-4 transition-all duration-300 hover:shadow-lg group flex flex-col justify-between",
								children: [/* @__PURE__ */ jsxs("div", {
									className: "space-y-2.5",
									children: [/* @__PURE__ */ jsxs("div", {
										className: "h-28 rounded-xl bg-slate-50 flex items-center justify-center relative overflow-hidden p-2",
										children: [rImage ? /* @__PURE__ */ jsx("img", {
											src: rImage,
											alt: rBrand,
											className: "max-h-full max-w-full object-contain transition-transform duration-300 group-hover:scale-105"
										}) : /* @__PURE__ */ jsx(Pill, { className: "w-7 h-7 text-[#c59324]" }), rForm && /* @__PURE__ */ jsx("span", {
											className: "absolute top-2 left-2 px-2.5 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-wider bg-[#0c2340] text-white",
											children: rForm
										})]
									}), /* @__PURE__ */ jsxs("div", {
										className: "space-y-0.5",
										children: [
											/* @__PURE__ */ jsxs("div", {
												className: "flex items-center justify-between text-[10px] font-mono text-slate-400",
												children: [/* @__PURE__ */ jsx("span", { children: rCode }), /* @__PURE__ */ jsx("span", {
													className: "text-[#c59324] font-bold",
													children: rStrength
												})]
											}),
											/* @__PURE__ */ jsx("h4", {
												className: "text-xs sm:text-sm font-bold text-[#0c2340] group-hover:text-[#c59324] transition-colors line-clamp-1",
												children: rBrand
											}),
											rGeneric && /* @__PURE__ */ jsx("p", {
												className: "text-xs text-slate-500 line-clamp-1",
												children: rGeneric
											})
										]
									})]
								}), /* @__PURE__ */ jsxs("div", {
									className: "pt-2.5 mt-2.5 border-t border-slate-100 flex items-center justify-between text-xs font-semibold text-[#c59324]",
									children: [/* @__PURE__ */ jsx("span", { children: "View Specifications" }), /* @__PURE__ */ jsx(ChevronRight, { className: "w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" })]
								})]
							}, p.id || rCode);
						})
					})]
				}),
				/* @__PURE__ */ jsxs("div", {
					className: "md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-slate-200 px-4 py-2.5 flex items-center justify-between gap-3 shadow-lg",
					children: [/* @__PURE__ */ jsxs("div", {
						className: "min-w-0 flex-1",
						children: [/* @__PURE__ */ jsx("span", {
							className: "text-xs font-bold text-[#0c2340] block truncate",
							children: brandName
						}), /* @__PURE__ */ jsxs("span", {
							className: "text-[10px] text-[#c59324] font-semibold block truncate",
							children: [
								strength,
								" • ",
								dosageForm
							]
						})]
					}), /* @__PURE__ */ jsx(Button, {
						variant: "primary",
						onClick: () => setIsEnquiryOpen(true),
						className: "shrink-0 bg-[#0c2340] hover:bg-[#c59324] text-white font-bold text-xs py-2 px-4 rounded-xl cursor-pointer",
						children: "Inquire Now"
					})]
				}),
				/* @__PURE__ */ jsx(EnquiryModal, {
					isOpen: isEnquiryOpen,
					onClose: () => setIsEnquiryOpen(false),
					initialProduct: product
				})
			] })
		})]
	});
}
//#endregion
//#region resources/js/components/home/ProductCard.jsx
function ProductCard({ product }) {
	const [imgError, setImgError] = useState(false);
	if (!product) return null;
	const productId = product.id || product.product_code || product.productCode || product.slug;
	const brandName = product.brandName || product.brand_name || "Pharmaceutical Formulation";
	const genericName = product.genericName || product.generic_name || "";
	const dosageForm = product.dosageForm || product.dosage_form || "Solid Oral";
	const strength = product.strength || "";
	const categoryName = product.category?.name || (typeof product.category === "string" ? product.category : "") || product.therapeuticArea || "";
	const rawFilePath = product.primary_image?.file_path || product.primaryImage?.file_path;
	const directPath = rawFilePath ? rawFilePath.startsWith("/") ? rawFilePath : `/${rawFilePath}` : null;
	const imageUrl = product.imageUrl || product.image_url || product.image || directPath || product.primary_image?.url || product.primary_image?.image_url || product.primaryImage?.url || product.primaryImage?.image_url || (Array.isArray(product.images) && product.images.length > 0 ? typeof product.images[0] === "string" ? product.images[0] : product.images[0]?.file_path ? product.images[0].file_path.startsWith("/") ? product.images[0].file_path : `/${product.images[0].file_path}` : product.images[0]?.url : null);
	const getDosageIcon = (form = "") => {
		const safeForm = String(form || "").toLowerCase();
		if (safeForm.includes("capsule")) return /* @__PURE__ */ jsxs("svg", {
			className: "w-6 h-6 text-[#c59324]",
			viewBox: "0 0 24 24",
			fill: "none",
			stroke: "currentColor",
			strokeWidth: "2",
			children: [/* @__PURE__ */ jsx("rect", {
				x: "3",
				y: "9",
				width: "18",
				height: "6",
				rx: "3",
				transform: "rotate(-45 12 12)"
			}), /* @__PURE__ */ jsx("line", {
				x1: "8",
				y1: "8",
				x2: "16",
				y2: "16"
			})]
		});
		if (safeForm.includes("syrup") || safeForm.includes("liquid") || safeForm.includes("suspension")) return /* @__PURE__ */ jsx(FlaskConical, { className: "w-6 h-6 text-[#c59324]" });
		if (safeForm.includes("drop")) return /* @__PURE__ */ jsx(Droplet, { className: "w-6 h-6 text-[#c59324]" });
		return /* @__PURE__ */ jsx(Pill, { className: "w-6 h-6 text-[#c59324]" });
	};
	return /* @__PURE__ */ jsxs(Link, {
		href: `/products/${productId}`,
		className: "group bg-white rounded-2xl border border-slate-200/90 hover:border-[#c59324] hover:shadow-lg hover:shadow-slate-200/50 transition-all duration-300 flex flex-col justify-between overflow-hidden cursor-pointer",
		children: [/* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsxs("div", {
			className: "relative w-full h-52 sm:h-56 bg-gradient-to-b from-slate-50/50 via-white to-slate-50/30 border-b border-slate-100 flex items-center justify-center p-4",
			children: [
				/* @__PURE__ */ jsx("span", {
					className: "absolute top-3 left-3 z-10 inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-[#0c2340] text-white",
					children: dosageForm
				}),
				strength && /* @__PURE__ */ jsx("span", {
					className: "absolute top-3 right-3 z-10 inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-semibold text-[#0c2340] bg-amber-50 border border-amber-200/70",
					children: strength
				}),
				imageUrl && !imgError ? /* @__PURE__ */ jsx("img", {
					src: imageUrl,
					alt: brandName,
					onError: () => setImgError(true),
					loading: "lazy",
					className: "max-h-full max-w-full object-contain filter drop-shadow-sm group-hover:scale-105 transition-transform duration-300"
				}) : /* @__PURE__ */ jsx("div", {
					className: "w-full h-full flex flex-col items-center justify-center bg-slate-50/50 p-4",
					children: /* @__PURE__ */ jsx("div", {
						className: "w-14 h-14 rounded-2xl bg-white border border-slate-200 flex items-center justify-center text-[#c59324] group-hover:scale-105 transition-transform duration-200",
						children: getDosageIcon(dosageForm)
					})
				})
			]
		}), /* @__PURE__ */ jsxs("div", {
			className: "p-4 sm:p-5",
			children: [
				categoryName && /* @__PURE__ */ jsx("span", {
					className: "text-[11px] font-bold uppercase tracking-wider text-[#c59324] block mb-1",
					children: categoryName
				}),
				/* @__PURE__ */ jsx("h3", {
					className: "text-base font-bold text-[#0c2340] group-hover:text-[#c59324] transition-colors line-clamp-1",
					children: brandName
				}),
				genericName ? /* @__PURE__ */ jsx("p", {
					className: "text-xs text-slate-600 font-medium line-clamp-2 mt-1.5 leading-relaxed min-h-[2.5rem]",
					children: genericName
				}) : /* @__PURE__ */ jsx("p", {
					className: "text-xs text-slate-400 font-medium line-clamp-1 mt-1.5",
					children: "Clinical formulation monograph"
				})
			]
		})] }), /* @__PURE__ */ jsx("div", {
			className: "px-4 sm:px-5 pb-4 pt-0",
			children: /* @__PURE__ */ jsxs("div", {
				className: "pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500",
				children: [/* @__PURE__ */ jsxs("span", {
					className: "font-semibold text-slate-600 truncate flex items-center gap-1.5",
					children: [/* @__PURE__ */ jsx(ShieldCheck, { className: "w-3.5 h-3.5 text-emerald-600 shrink-0" }), /* @__PURE__ */ jsx("span", {
						className: "text-[11px]",
						children: "WHO-GMP Validated"
					})]
				}), /* @__PURE__ */ jsxs("span", {
					className: "text-[#c59324] font-bold inline-flex items-center gap-1 group-hover:translate-x-1 transition-transform shrink-0",
					children: [/* @__PURE__ */ jsx("span", { children: "Dossier" }), /* @__PURE__ */ jsx(ArrowRight, { className: "w-3.5 h-3.5" })]
				})]
			})
		})]
	});
}
//#endregion
//#region resources/js/Pages/public/ProductsPage.jsx
var ProductsPage_exports = /* @__PURE__ */ __exportAll({ default: () => ProductsPage });
function ProductsPage({ products = [], categories = [], filters = {} }) {
	const searchQuery = filters.search || "";
	const selectedCategory = filters.category || "All";
	const handleCategorySelect = (category) => {
		const params = {};
		if (searchQuery.trim()) params.search = searchQuery.trim();
		if (category !== "All") params.category = category;
		router.get("/products", params, { preserveState: true });
	};
	const handleResetFilters = () => {
		router.get("/products", {}, { preserveState: true });
	};
	const availableCategories = useMemo(() => {
		const list = ["All"];
		if (Array.isArray(categories)) categories.forEach((cat) => {
			const name = typeof cat === "object" && cat?.name ? cat.name : cat;
			if (name && name !== "All" && !list.includes(name)) list.push(name);
		});
		if (Array.isArray(products)) products.forEach((p) => {
			const catName = typeof p.category === "object" && p.category?.name ? p.category.name : typeof p.category === "string" ? p.category : p.therapeuticArea;
			if (catName && !list.includes(catName)) list.push(catName);
		});
		return list;
	}, [categories, products]);
	const filteredProducts = useMemo(() => {
		if (!Array.isArray(products)) return [];
		return products.filter((p) => {
			if (!p) return false;
			if (selectedCategory !== "All") {
				if ((typeof p.category === "object" && p.category?.name ? p.category.name : typeof p.category === "string" ? p.category : p.therapeuticArea || "").toLowerCase() !== selectedCategory.toLowerCase()) return false;
			}
			if (searchQuery.trim()) {
				const q = searchQuery.toLowerCase().trim();
				const brand = (p.brand_name || p.brandName || "").toLowerCase();
				const generic = (p.generic_name || p.genericName || "").toLowerCase();
				const code = (p.product_code || p.productCode || "").toLowerCase();
				const desc = (p.description || p.short_description || "").toLowerCase();
				return brand.includes(q) || generic.includes(q) || code.includes(q) || desc.includes(q);
			}
			return true;
		});
	}, [
		products,
		selectedCategory,
		searchQuery
	]);
	const hasActiveFilters = searchQuery.trim() !== "" || selectedCategory !== "All";
	return /* @__PURE__ */ jsxs(PublicLayout, {
		categories,
		children: [/* @__PURE__ */ jsx(SeoHead, {
			title: selectedCategory !== "All" ? `${selectedCategory} Formulations — Product Catalog` : "Pharmaceutical Formulations Catalog",
			description: `Explore Ciplon Pharma's comprehensive portfolio of finished formulations${selectedCategory !== "All" ? ` in ${selectedCategory}` : ""}, including tablets, capsules, injectables, and syrups.`,
			canonicalUrl: "https://www.ciplonpharma.in/products"
		}), /* @__PURE__ */ jsxs("div", {
			className: "min-h-screen bg-slate-50/60 pb-16",
			children: [
				/* @__PURE__ */ jsxs("div", {
					className: "bg-[#0c2340] text-white py-10 sm:py-12 border-b border-[#c59324]/40 relative overflow-hidden",
					children: [/* @__PURE__ */ jsx("div", { className: "absolute inset-0 bg-gradient-to-r from-[#0c2340] via-[#091b30] to-[#05101d] pointer-events-none" }), /* @__PURE__ */ jsx(Container, {
						className: "relative z-10",
						children: /* @__PURE__ */ jsxs("div", {
							className: "max-w-3xl",
							children: [
								/* @__PURE__ */ jsx("span", {
									className: "text-[11px] font-bold text-[#dfad36] uppercase tracking-widest block mb-1.5",
									children: "Therapeutic Portfolio & Catalog"
								}),
								/* @__PURE__ */ jsx("h1", {
									className: "text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight text-white uppercase",
									children: "Finished Pharmaceutical Formulations"
								}),
								/* @__PURE__ */ jsx("div", { className: "w-16 h-1 bg-gradient-to-r from-[#c59324] to-[#dfad36] mt-2 mb-2.5 rounded-full" }),
								/* @__PURE__ */ jsx("p", {
									className: "text-xs sm:text-sm text-slate-300 max-w-2xl leading-relaxed",
									children: "WHO-GMP validated finished oral solids, injectables, lyophilized vials, and plasma therapeutics produced under stringent pharmacopoeial quality control."
								})
							]
						})
					})]
				}),
				/* @__PURE__ */ jsx("div", {
					className: "sticky top-[68px] sm:top-[76px] z-30 bg-white/95 backdrop-blur-md border-b border-slate-200/80 shadow-xs",
					children: /* @__PURE__ */ jsx(Container, { children: /* @__PURE__ */ jsx("div", {
						className: "flex items-center justify-between gap-4 py-2.5 sm:py-3",
						children: /* @__PURE__ */ jsx("div", {
							className: "flex items-center gap-2 overflow-x-auto no-scrollbar py-0.5",
							children: availableCategories.map((cat) => {
								const isSelected = selectedCategory.toLowerCase() === cat.toLowerCase();
								return /* @__PURE__ */ jsx("button", {
									type: "button",
									onClick: () => handleCategorySelect(cat),
									className: `px-4 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all duration-200 cursor-pointer ${isSelected ? "bg-[#0c2340] text-white border border-[#c59324] shadow-xs" : "bg-slate-100 text-slate-700 hover:text-[#c59324] hover:bg-amber-50/60 border border-slate-200/80"}`,
									children: cat === "All" ? "All Formulations" : cat
								}, cat);
							})
						})
					}) })
				}),
				/* @__PURE__ */ jsxs(Container, {
					className: "pt-6 sm:pt-8",
					children: [hasActiveFilters && /* @__PURE__ */ jsxs("div", {
						className: "mb-6 flex items-center justify-between gap-3 text-xs text-slate-700 bg-white rounded-2xl px-4 py-2.5 border border-slate-200/80 shadow-xs",
						children: [/* @__PURE__ */ jsxs("div", {
							className: "flex items-center gap-2 flex-wrap",
							children: [
								/* @__PURE__ */ jsx("span", {
									className: "text-slate-500",
									children: "Showing formulations for:"
								}),
								selectedCategory !== "All" && /* @__PURE__ */ jsx("span", {
									className: "font-semibold text-[#0c2340] bg-amber-50 border border-amber-200/70 px-2.5 py-0.5 rounded-lg",
									children: selectedCategory
								}),
								searchQuery.trim() && /* @__PURE__ */ jsxs("span", {
									className: "font-semibold text-slate-800 bg-slate-100 px-2.5 py-0.5 rounded-lg border border-slate-200",
									children: [
										"\"",
										searchQuery.trim(),
										"\""
									]
								})
							]
						}), /* @__PURE__ */ jsxs("button", {
							type: "button",
							onClick: handleResetFilters,
							className: "text-[#c59324] hover:text-[#9f6d0f] font-semibold cursor-pointer shrink-0 inline-flex items-center gap-1.5",
							children: [/* @__PURE__ */ jsx(RefreshCw, { className: "w-3.5 h-3.5" }), /* @__PURE__ */ jsx("span", { children: "Reset Filters" })]
						})]
					}), filteredProducts.length === 0 ? /* @__PURE__ */ jsxs("div", {
						className: "bg-white rounded-3xl border border-slate-200/80 p-10 sm:p-14 text-center max-w-lg mx-auto space-y-4 my-8 shadow-xs",
						children: [
							/* @__PURE__ */ jsx("div", {
								className: "w-14 h-14 rounded-2xl bg-amber-50 border border-amber-200/60 flex items-center justify-center mx-auto text-[#c59324]",
								children: /* @__PURE__ */ jsx(Pill, { className: "w-7 h-7 stroke-[2]" })
							}),
							/* @__PURE__ */ jsx("h3", {
								className: "text-lg font-bold text-[#0c2340]",
								children: "No Formulations Found"
							}),
							/* @__PURE__ */ jsx("p", {
								className: "text-xs text-slate-500 leading-relaxed",
								children: "No products match your current search query or category filter. Try searching for other molecules or reset filters."
							}),
							/* @__PURE__ */ jsx("div", {
								className: "pt-2",
								children: /* @__PURE__ */ jsxs("button", {
									type: "button",
									onClick: handleResetFilters,
									className: "inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#0c2340] hover:bg-[#c59324] text-white text-xs font-bold transition-colors cursor-pointer shadow-xs",
									children: [/* @__PURE__ */ jsx(RefreshCw, { className: "w-3.5 h-3.5" }), /* @__PURE__ */ jsx("span", { children: "Reset All Filters" })]
								})
							})
						]
					}) : /* @__PURE__ */ jsx("div", {
						className: "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8",
						children: filteredProducts.map((product) => /* @__PURE__ */ jsx(ProductCard, { product }, product.id || product.product_code || product.brand_name))
					})]
				})
			]
		})]
	});
}
//#endregion
//#region resources/js/Pages/public/QualityPage.jsx
var QualityPage_exports = /* @__PURE__ */ __exportAll({ default: () => QualityPage });
function QualityPage({ company }) {
	return /* @__PURE__ */ jsxs(PublicLayout, {
		companyData: company || {},
		children: [/* @__PURE__ */ jsx(SeoHead, {
			title: "Quality Assurance & Regulatory Compliance — WHO-GMP & ISO 9001:2015",
			description: "Explore Ciplon Pharma's strict quality assurance framework, WHO-GMP certified manufacturing at Walpar Wellness, HPLC analytical validation, and stability testing standards.",
			canonicalUrl: "https://www.ciplonpharma.in/quality"
		}), /* @__PURE__ */ jsxs("div", {
			className: "bg-white text-slate-900",
			children: [
				/* @__PURE__ */ jsxs("section", {
					className: "relative py-16 sm:py-24 bg-gradient-to-r from-[#0c2340] via-[#07172b] to-[#040e1b] text-white overflow-hidden border-b border-[#c59324]/20",
					children: [/* @__PURE__ */ jsx("div", {
						className: "absolute inset-0 opacity-15 pointer-events-none",
						children: /* @__PURE__ */ jsxs("svg", {
							className: "w-full h-full",
							xmlns: "http://www.w3.org/2000/svg",
							children: [/* @__PURE__ */ jsx("defs", { children: /* @__PURE__ */ jsx("pattern", {
								id: "qualGrid",
								width: "40",
								height: "40",
								patternUnits: "userSpaceOnUse",
								children: /* @__PURE__ */ jsx("circle", {
									cx: "20",
									cy: "20",
									r: "1.5",
									fill: "#c59324"
								})
							}) }), /* @__PURE__ */ jsx("rect", {
								width: "100%",
								height: "100%",
								fill: "url(#qualGrid)"
							})]
						})
					}), /* @__PURE__ */ jsx(Container, {
						size: "wide",
						className: "relative z-10",
						children: /* @__PURE__ */ jsxs("div", {
							className: "max-w-3xl",
							children: [
								/* @__PURE__ */ jsxs("div", {
									className: "inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#c59324]/20 border border-[#c59324]/40 text-[#dfad36] text-xs font-semibold uppercase tracking-wider mb-5",
									children: [/* @__PURE__ */ jsx(ShieldCheck, { className: "w-3.5 h-3.5" }), "Quality Assurance & Regulatory Rigor"]
								}),
								/* @__PURE__ */ jsxs("h1", {
									className: "text-3xl sm:text-5xl font-bold tracking-tight text-white leading-tight",
									children: [
										"Quality is a ",
										/* @__PURE__ */ jsx("span", {
											className: "text-[#dfad36]",
											children: "Matter of Fact"
										}),
										", Not a Compromise"
									]
								}),
								/* @__PURE__ */ jsx("p", {
									className: "mt-5 text-base sm:text-lg text-slate-300 leading-relaxed font-normal",
									children: "At Ciplon Pharma, quality compliance is integrated into every phase of pharmaceutical production. Through our certified manufacturing partner Walpar Wellness Pvt. Ltd., we maintain gold-standard WHO-GMP protocols and ISO 9001:2015 systems."
								}),
								/* @__PURE__ */ jsxs("div", {
									className: "mt-8 flex flex-wrap items-center gap-4",
									children: [/* @__PURE__ */ jsxs(Link, {
										href: "/contact",
										className: "px-6 py-3 rounded-xl bg-gradient-to-r from-[#c59324] to-[#dfad36] text-[#07172b] font-semibold text-sm hover:brightness-105 transition-all shadow-md flex items-center gap-2",
										children: ["Request Batch COA / Dossier", /* @__PURE__ */ jsx(ArrowRight, { className: "w-4 h-4" })]
									}), /* @__PURE__ */ jsx(Link, {
										href: "/products",
										className: "px-6 py-3 rounded-xl bg-white/10 hover:bg-white/15 text-white font-semibold text-sm border border-white/20 transition-all",
										children: "Browse Tested Formulations"
									})]
								})
							]
						})
					})]
				}),
				/* @__PURE__ */ jsx("section", {
					className: "py-16 sm:py-24 bg-slate-50 border-b border-slate-200",
					children: /* @__PURE__ */ jsxs(Container, {
						size: "wide",
						children: [/* @__PURE__ */ jsxs("div", {
							className: "text-center max-w-2xl mx-auto mb-14",
							children: [
								/* @__PURE__ */ jsx("span", {
									className: "text-xs font-bold uppercase tracking-widest text-[#c59324]",
									children: "Regulatory Foundation"
								}),
								/* @__PURE__ */ jsx("h2", {
									className: "text-2xl sm:text-4xl font-bold text-[#0c2340] mt-2",
									children: "Four Pillars of Formulation Safety"
								}),
								/* @__PURE__ */ jsx("div", { className: "w-16 h-1 bg-gradient-to-r from-[#c59324] to-[#dfad36] mx-auto mt-3 rounded-full" })
							]
						}), /* @__PURE__ */ jsx("div", {
							className: "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6",
							children: [
								{
									title: "WHO-GMP Certified Facility",
									desc: "Formulations produced at Walpar Wellness Pvt. Ltd. (Khatraj Unit) adhering strictly to World Health Organization Good Manufacturing Practices with HEPA-filtered cleanrooms.",
									icon: Factory
								},
								{
									title: "ISO 9001:2015 Standards",
									desc: "Audited Quality Management System (QMS) ensuring complete standardization across raw active pharmaceutical ingredient (API) procurement, compounding, and warehousing.",
									icon: Award
								},
								{
									title: "High-Precision Analytical QC",
									desc: "In-house HPLC (High-Performance Liquid Chromatography), UV-Visible Spectrophotometry, and dissolution profile testing for every finished batch.",
									icon: Microscope
								},
								{
									title: "ICH Zone IVb Stability Testing",
									desc: "Real-time and accelerated stability studies in climatic walk-in chambers calibrated for tropical Zone IVb conditions (30°C / 75% RH) to guarantee shelf-life integrity.",
									icon: FlaskConical
								}
							].map((p, i) => {
								const Icon = p.icon;
								return /* @__PURE__ */ jsxs("div", {
									className: "p-6 rounded-2xl bg-white border border-slate-200 hover:border-[#c59324]/50 hover:shadow-lg transition-all duration-300 flex flex-col group",
									children: [
										/* @__PURE__ */ jsx("div", {
											className: "w-12 h-12 rounded-xl bg-amber-50 group-hover:bg-[#c59324] text-[#c59324] group-hover:text-white flex items-center justify-center mb-5 transition-colors",
											children: /* @__PURE__ */ jsx(Icon, { className: "w-6 h-6 stroke-[2]" })
										}),
										/* @__PURE__ */ jsx("h3", {
											className: "text-base sm:text-lg font-bold text-[#0c2340] mb-2",
											children: p.title
										}),
										/* @__PURE__ */ jsx("p", {
											className: "text-xs sm:text-sm text-slate-600 leading-relaxed flex-1",
											children: p.desc
										})
									]
								}, i);
							})
						})]
					})
				}),
				/* @__PURE__ */ jsx("section", {
					className: "py-16 sm:py-24 bg-white",
					children: /* @__PURE__ */ jsx(Container, {
						size: "wide",
						children: /* @__PURE__ */ jsxs("div", {
							className: "grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center",
							children: [/* @__PURE__ */ jsxs("div", { children: [
								/* @__PURE__ */ jsx("span", {
									className: "text-xs font-bold uppercase tracking-widest text-[#c59324]",
									children: "Validation Systems"
								}),
								/* @__PURE__ */ jsx("h2", {
									className: "text-2xl sm:text-4xl font-bold text-[#0c2340] mt-2 mb-6",
									children: "Comprehensive Analytical & Microbiological Testing"
								}),
								/* @__PURE__ */ jsxs("div", {
									className: "space-y-4 text-slate-600 text-sm sm:text-base leading-relaxed",
									children: [/* @__PURE__ */ jsx("p", { children: "Every formulation marketed by Ciplon is backed by complete documentation. Before commercial release, batch samples are subjected to stringent chemical assays, dissolution mapping, content uniformity, and microbial bioburden testing." }), /* @__PURE__ */ jsxs("p", { children: [
										"Our manufacturing unit at ",
										/* @__PURE__ */ jsx("strong", { children: "Walpar Wellness Pvt. Ltd. (Khatraj Unit)" }),
										" employs modern validation equipment to ensure that every blister pack, bottle, and vial retains its labeled potency throughout its shelf life."
									] })]
								}),
								/* @__PURE__ */ jsxs("div", {
									className: "mt-8 space-y-3",
									children: [
										/* @__PURE__ */ jsxs("div", {
											className: "flex items-center gap-3",
											children: [/* @__PURE__ */ jsx(CheckCircle2, { className: "w-5 h-5 text-[#c59324] shrink-0" }), /* @__PURE__ */ jsx("span", {
												className: "text-sm font-semibold text-slate-800",
												children: "Assay & Purity testing via calibrated HPLC instrumentation"
											})]
										}),
										/* @__PURE__ */ jsxs("div", {
											className: "flex items-center gap-3",
											children: [/* @__PURE__ */ jsx(CheckCircle2, { className: "w-5 h-5 text-[#c59324] shrink-0" }), /* @__PURE__ */ jsx("span", {
												className: "text-sm font-semibold text-slate-800",
												children: "Dissolution profiling according to IP / BP / USP monographs"
											})]
										}),
										/* @__PURE__ */ jsxs("div", {
											className: "flex items-center gap-3",
											children: [/* @__PURE__ */ jsx(CheckCircle2, { className: "w-5 h-5 text-[#c59324] shrink-0" }), /* @__PURE__ */ jsx("span", {
												className: "text-sm font-semibold text-slate-800",
												children: "Full batch traceability with serialized tamper-evident carton packaging"
											})]
										})
									]
								})
							] }), /* @__PURE__ */ jsx("div", {
								className: "relative",
								children: /* @__PURE__ */ jsx("div", {
									className: "rounded-3xl overflow-hidden shadow-2xl border-4 border-white aspect-[4/3] bg-slate-900",
									children: /* @__PURE__ */ jsx("img", {
										src: "/images/pharma_rd_lab.jpg",
										alt: "Pharmaceutical Quality Control Laboratory",
										className: "w-full h-full object-cover"
									})
								})
							})]
						})
					})
				}),
				/* @__PURE__ */ jsx("section", {
					className: "py-16 sm:py-24 bg-[#0c2340] text-white",
					children: /* @__PURE__ */ jsxs(Container, {
						size: "wide",
						children: [/* @__PURE__ */ jsxs("div", {
							className: "text-center max-w-2xl mx-auto mb-14",
							children: [
								/* @__PURE__ */ jsx("span", {
									className: "text-xs font-bold uppercase tracking-widest text-[#dfad36]",
									children: "Workflow Protocol"
								}),
								/* @__PURE__ */ jsx("h2", {
									className: "text-2xl sm:text-4xl font-bold text-white mt-2",
									children: "4-Stage Quality Assurance Protocol"
								}),
								/* @__PURE__ */ jsx("div", { className: "w-16 h-1 bg-gradient-to-r from-[#c59324] to-[#dfad36] mx-auto mt-3 rounded-full" })
							]
						}), /* @__PURE__ */ jsx("div", {
							className: "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6",
							children: [
								{
									step: "01",
									title: "API Vendor Qualification",
									desc: "Approved vendor qualification and testing of raw active ingredients against IP/BP/USP pharmacopeial monographs."
								},
								{
									step: "02",
									title: "Automated Formulation",
									desc: "Robotic weighing, granulation, compression, and sterile liquid blending minimizing human intervention."
								},
								{
									step: "03",
									title: "In-Process Quality Controls",
									desc: "Continuous online weight variation, hardness, friability, disintegration, and leak testing."
								},
								{
									step: "04",
									title: "Finished Product Release",
									desc: "Rigorous analytical assay, microbiological sterility confirmation, and issuance of authenticated Certificates of Analysis (COA)."
								}
							].map((s, idx) => /* @__PURE__ */ jsxs("div", {
								className: "p-6 rounded-2xl bg-white/5 border border-white/10 hover:border-[#dfad36]/50 transition-all",
								children: [
									/* @__PURE__ */ jsx("span", {
										className: "text-2xl font-bold text-[#dfad36] tracking-tight block mb-2",
										children: s.step
									}),
									/* @__PURE__ */ jsx("h4", {
										className: "text-base font-bold text-white mb-2",
										children: s.title
									}),
									/* @__PURE__ */ jsx("p", {
										className: "text-xs sm:text-sm text-slate-300 leading-relaxed",
										children: s.desc
									})
								]
							}, idx))
						})]
					})
				}),
				/* @__PURE__ */ jsx("section", {
					className: "py-14 bg-white border-t border-slate-200",
					children: /* @__PURE__ */ jsx(Container, {
						size: "wide",
						children: /* @__PURE__ */ jsxs("div", {
							className: "bg-slate-50 p-8 sm:p-10 rounded-3xl border border-slate-200 flex flex-col md:flex-row items-center justify-between gap-6",
							children: [/* @__PURE__ */ jsxs("div", { children: [
								/* @__PURE__ */ jsx("span", {
									className: "text-xs font-bold uppercase tracking-wider text-[#c59324]",
									children: "Regulatory Compliance"
								}),
								/* @__PURE__ */ jsx("h3", {
									className: "text-xl sm:text-2xl font-bold text-[#0c2340] mt-1",
									children: "Need a Product Monograph or Dossier?"
								}),
								/* @__PURE__ */ jsx("p", {
									className: "text-xs sm:text-sm text-slate-600 mt-1 max-w-xl",
									children: "We supply CTD dossiers, stability data summaries, and batch Certificates of Analysis for hospitals, state tenders, and institutional procurement partners."
								})
							] }), /* @__PURE__ */ jsxs("div", {
								className: "shrink-0 flex items-center gap-3",
								children: [/* @__PURE__ */ jsx(Link, {
									href: "/contact",
									className: "px-6 py-3 rounded-xl bg-[#0c2340] hover:bg-slate-800 text-white font-semibold text-sm transition-all shadow-md",
									children: "Contact Regulatory Desk"
								}), /* @__PURE__ */ jsx(Link, {
									href: "/products",
									className: "px-6 py-3 rounded-xl bg-white border border-slate-300 text-slate-800 hover:border-[#c59324] font-semibold text-sm transition-all",
									children: "View Products"
								})]
							})]
						})
					})
				})
			]
		})]
	});
}
//#endregion
//#region resources/js/ssr.jsx
createServer((page) => createInertiaApp({
	page,
	render: renderToString,
	resolve: (name) => {
		const resolvedPage = (/* @__PURE__ */ Object.assign({
			"./Pages/admin/Dashboard.jsx": Dashboard_exports$1,
			"./Pages/admin/category/CategoryForm.jsx": CategoryForm_exports,
			"./Pages/admin/category/CategoryList.jsx": CategoryList_exports,
			"./Pages/admin/enquiry/EnquiryIndex.jsx": EnquiryIndex_exports,
			"./Pages/admin/product/ProductDetails.jsx": ProductDetails_exports,
			"./Pages/admin/product/ProductForm.jsx": ProductForm_exports,
			"./Pages/admin/product/ProductList.jsx": ProductList_exports,
			"./Pages/admin/product/ProductSlides.jsx": ProductSlides_exports,
			"./Pages/admin/roles/RoleForm.jsx": RoleForm_exports,
			"./Pages/admin/roles/RoleList.jsx": RoleList_exports,
			"./Pages/admin/settings/Settings.jsx": Settings_exports,
			"./Pages/admin/staff/StaffForm.jsx": StaffForm_exports,
			"./Pages/admin/staff/StaffList.jsx": StaffList_exports,
			"./Pages/admin/tracking/TrackingDashboard.jsx": TrackingDashboard_exports,
			"./Pages/auth/LoginPage.jsx": LoginPage_exports,
			"./Pages/mr/Dashboard.jsx": Dashboard_exports,
			"./Pages/mr/Detailing.jsx": Detailing_exports,
			"./Pages/mr/DoctorForm.jsx": DoctorForm_exports,
			"./Pages/mr/Doctors.jsx": Doctors_exports,
			"./Pages/mr/Products.jsx": Products_exports,
			"./Pages/mr/Schedule.jsx": Schedule_exports,
			"./Pages/mr/Visits.jsx": Visits_exports,
			"./Pages/mrconnect/AllReports.jsx": AllReports_exports,
			"./Pages/mrconnect/EmployeeAssign.jsx": EmployeeAssign_exports,
			"./Pages/mrconnect/FieldExpenses.jsx": FieldExpenses_exports,
			"./Pages/mrconnect/HRSection.jsx": HRSection_exports,
			"./Pages/mrconnect/Leave.jsx": Leave_exports,
			"./Pages/mrconnect/Notice.jsx": Notice_exports,
			"./Pages/mrconnect/PobOrder.jsx": PobOrder_exports,
			"./Pages/mrconnect/PrimarySales.jsx": PrimarySales_exports,
			"./Pages/mrconnect/Scheme.jsx": Scheme_exports,
			"./Pages/mrconnect/SetTarget.jsx": SetTarget_exports,
			"./Pages/mrconnect/Slider.jsx": Slider_exports,
			"./Pages/mrconnect/Sponsor.jsx": Sponsor_exports,
			"./Pages/mrconnect/TourPlan.jsx": TourPlan_exports,
			"./Pages/mrconnect/VideoLibrary.jsx": VideoLibrary_exports,
			"./Pages/public/AboutPage.jsx": AboutPage_exports,
			"./Pages/public/ContactPage.jsx": ContactPage_exports,
			"./Pages/public/HomePage.jsx": HomePage_exports,
			"./Pages/public/ProductDetailsPage.jsx": ProductDetailsPage_exports,
			"./Pages/public/ProductsPage.jsx": ProductsPage_exports,
			"./Pages/public/QualityPage.jsx": QualityPage_exports
		}))[`./Pages/${name}.jsx`];
		if (!resolvedPage) throw new Error(`Inertia SSR page not found: ./Pages/${name}.jsx`);
		return resolvedPage;
	},
	setup: ({ App, props }) => /* @__PURE__ */ jsx(App, { ...props }),
	title: (title) => title ? `${title} - Ciplon Pharma` : "Ciplon Pharma — WHO-GMP & ISO 9001:2015 Certified Finished Formulations"
}));
//#endregion
export {};
