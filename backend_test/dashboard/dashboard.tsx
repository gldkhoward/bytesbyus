'use client'
import { Navbar } from "./features/navbar/navbar";

export default function Dashboard() {
    return (
        <div className="min-h-screen bg-gray-50">
            <Navbar onMenuToggle={() => {}} />
            <h1>Dashboard</h1>
        </div>
    );
}
