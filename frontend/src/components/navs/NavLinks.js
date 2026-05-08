import { ROUTES } from '@/features/dashboard/lib/routes'
import Link from 'next/link'
import React from 'react'

export default function NavLinks() {
    return (
        <>
            {
                ROUTES.map((route) => (
                    <li key={route.path}><Link href={route.path}>{route.label}</Link></li>
                ))
            }
            <li><a>Item 1</a></li>
            <li>
                <details>
                    <summary>Parent</summary>
                    <ul className="p-2">
                        <li><a>Submenu 1</a></li>
                        <li><a>Submenu 2</a></li>
                    </ul>
                </details>
            </li>
            <li><a>Item 3</a></li>
        </>
    )
}
