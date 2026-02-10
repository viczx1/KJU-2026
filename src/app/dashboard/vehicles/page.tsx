'use client';
import { VehicleList } from '@/components/dashboard/VehicleList';
import { Filter, Search } from 'lucide-react';
import { Button } from '@/components/ui/Button';

export default function VehiclesPage() {
    return (
        <div className="space-y-8">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Fleet Management</h1>
                    <p className="text-[--foreground]/60 mt-1">Manage vehicle deployment and maintenance across all sectors.</p>
                </div>
                <div className="flex gap-2 w-full md:w-auto">
                    <div className="relative flex-1 md:w-64">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[--foreground]/40" />
                        <input
                            type="text"
                            placeholder="Search fleet ID or name..."
                            className="w-full pl-9 pr-4 py-2 bg-white/5 border border-white/10 rounded-lg text-sm focus:outline-none focus:border-[--color-primary] transition-colors"
                        />
                    </div>
                    <Button variant="outline" size="icon">
                        <Filter className="h-4 w-4" />
                    </Button>
                </div>
            </div>

            <VehicleList />
        </div>
    );
}
