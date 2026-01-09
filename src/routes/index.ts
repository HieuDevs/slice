import { getLocalizedPath, type Language } from "@/i18n";
import { ui } from "@/i18n/ui";
import { PATH_MAP } from "./route";

export interface NavLink {
    path: string;
    labelKey: keyof typeof ui.en;
}


// Routes to show in navigation (excludes login)
export const navigationRoutes: NavLink[] = [
    { path: PATH_MAP.HOME, labelKey: "nav.home" },
    { path: PATH_MAP.BLOGS, labelKey: "nav.blogs" },
    { path: PATH_MAP.ABOUT, labelKey: "nav.about" },
    { path: PATH_MAP.FAQ, labelKey: "nav.faq" },
];

export const getNavLinks = (lang: Language) => {
    return navigationRoutes.map((route) => ({
        ...route,
        href: getLocalizedPath(route.path, lang),
    }));
};


