
"use client";

import { usePathname } from "next/navigation";
import Navigation from "./Navigation";

export default function NavigationWrapper() {
    const pathname = usePathname();

    const esRutaAdministrativa =
        pathname === "/login" || pathname.startsWith("/admin");

    if (esRutaAdministrativa) {
        return null;
    }

    return <Navigation />;
}
