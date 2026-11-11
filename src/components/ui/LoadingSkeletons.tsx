import React from 'react';
import Skeleton from './Skeleton.tsx';

export function JobCardSkeleton() {
  return (
    <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm flex flex-col h-full">
      <div className="flex justify-between items-start mb-6">
        <Skeleton width="3.5rem" height="3.5rem" className="rounded-xl" />
        <Skeleton width="4rem" height="1.5rem" className="rounded-full" />
      </div>
      <div className="space-y-3 mb-6">
        <Skeleton width="80%" height="1.25rem" />
        <Skeleton width="40%" height="0.875rem" />
      </div>
      <div className="mt-auto space-y-4 pt-4 border-t border-gray-50">
        <div className="flex items-center gap-6">
          <Skeleton width="5rem" height="0.75rem" />
          <Skeleton width="5rem" height="0.75rem" />
        </div>
        <div className="flex items-center justify-between">
          <Skeleton width="8rem" height="0.75rem" />
          <Skeleton width="6rem" height="1rem" />
        </div>
      </div>
    </div>
  );
}

export function TenderCardSkeleton() {
  return (
    <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm">
      <div className="flex justify-between items-start mb-6">
        <Skeleton width="4rem" height="1.25rem" className="rounded-full" />
        <Skeleton width="6rem" height="0.75rem" />
      </div>
      <div className="space-y-3 mb-8">
        <Skeleton width="90%" height="1.5rem" />
        <div className="flex items-center gap-2">
          <Skeleton width="1.25rem" height="1.25rem" circle />
          <Skeleton width="10rem" height="1rem" />
        </div>
      </div>
      <div className="pt-6 border-t border-gray-50 flex justify-between items-center">
        <Skeleton width="12rem" height="1rem" />
        <Skeleton width="8rem" height="1.25rem" />
      </div>
    </div>
  );
}

export function AnnouncementCardSkeleton() {
  return (
    <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div className="space-y-4 flex-1">
          <div className="flex items-center gap-3">
            <Skeleton width="4rem" height="1.25rem" className="rounded-full" />
            <Skeleton width="10rem" height="0.75rem" />
          </div>
          <Skeleton width="85%" height="1.5rem" />
          <div className="space-y-2">
            <Skeleton width="100%" height="0.875rem" />
            <Skeleton width="90%" height="0.875rem" />
          </div>
        </div>
        <div className="shrink-0 flex items-center gap-3">
          <Skeleton width="3rem" height="3rem" className="rounded-xl" />
          <Skeleton width="8rem" height="3rem" className="rounded-xl" />
        </div>
      </div>
    </div>
  );
}

export function CompanyCardSkeleton() {
  return (
    <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-8 space-y-6">
      <div className="flex items-start justify-between">
        <Skeleton width="4rem" height="4rem" className="rounded-2xl" />
        <div className="flex gap-2">
          <Skeleton width="2rem" height="2rem" className="rounded-xl" />
          <Skeleton width="2rem" height="2rem" className="rounded-xl" />
        </div>
      </div>
      <div className="space-y-2">
        <Skeleton width="70%" height="1.25rem" />
        <Skeleton width="40%" height="0.75rem" />
      </div>
      <div className="space-y-3 pt-4 border-t border-gray-50">
        <Skeleton width="60%" height="0.75rem" />
        <Skeleton width="80%" height="0.75rem" />
        <Skeleton width="50%" height="0.75rem" />
      </div>
    </div>
  );
}

export function JobListItemSkeleton() {
  return (
    <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm flex flex-col md:flex-row gap-6">
      <Skeleton width="4rem" height="4rem" className="rounded-xl shrink-0" />
      <div className="flex-1 space-y-4">
        <div className="flex flex-col md:flex-row justify-between items-start gap-4">
          <div className="space-y-2 flex-1">
            <Skeleton width="80%" height="1.5rem" />
            <Skeleton width="40%" height="1rem" />
          </div>
          <Skeleton width="5rem" height="1.5rem" className="rounded-full" />
        </div>
        <div className="flex flex-wrap gap-6">
          <Skeleton width="8rem" height="1rem" />
          <Skeleton width="10rem" height="1rem" />
        </div>
      </div>
      <div className="flex flex-col justify-between items-end gap-4">
        <Skeleton width="6rem" height="0.75rem" />
        <Skeleton width="8rem" height="2.5rem" className="rounded-xl" />
      </div>
    </div>
  );
}

export function TableSkeleton({ columns = 5, rows = 5 }) {
  return (
    <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50/50">
            <tr>
              {Array.from({ length: columns }).map((_, i) => (
                <th key={i} className="px-6 py-4">
                  <Skeleton width="6rem" height="0.75rem" />
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {Array.from({ length: rows }).map((_, i) => (
              <tr key={i}>
                {Array.from({ length: columns }).map((_, j) => (
                  <td key={j} className="px-6 py-6">
                    <div className="flex items-center gap-3">
                      {j === 0 && <Skeleton width="2rem" height="2rem" className="rounded-lg" />}
                      <Skeleton width={j === 0 ? "10rem" : "6rem"} height="1rem" />
                    </div>
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
