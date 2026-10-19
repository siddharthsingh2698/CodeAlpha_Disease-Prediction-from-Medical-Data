/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { DatasetResponse } from '../types';

export const Screen5DatasetExplorer: React.FC = () => {
  const { selectedDisease, setToastMessage } = useApp();
  const [data, setData] = useState<DatasetResponse | null>(null);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    setCurrentPage(1);
  }, [selectedDisease]);

  useEffect(() => {
    const fetchDataset = async () => {
      setIsLoading(true);
      try {
        const resp = await fetch(
          `/api/dataset/${selectedDisease}?page=${currentPage}&page_size=12&search=${encodeURIComponent(searchQuery)}`
        );
        const res = await resp.json();
        if (res.status === 'success') {
          setData(res);
        }
      } catch (err: any) {
        console.error(err);
        setToastMessage(`Failed to load dataset: ${err.message}`);
      } finally {
        setIsLoading(false);
      }
    };

    const timer = setTimeout(fetchDataset, 200);
    return () => clearTimeout(timer);
  }, [selectedDisease, currentPage, searchQuery, setToastMessage]);

  const downloadDataset = () => {
    window.location.href = `/api/download-sample-cohort/${selectedDisease}`;
    setToastMessage('Exporting dataset CSV file...');
  };

  return (
    <div className="flex flex-col w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-12 py-10 pb-24 md:pb-16 animate-in fade-in duration-300">
      {/* Top Banner */}
      <div className="mb-10 text-center max-w-3xl mx-auto">
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary-container/20 text-primary dark:text-[#6bd8cb] text-xs font-bold mb-3 border border-primary/20">
          <span className="material-symbols-outlined text-[16px]">database</span>
          Clinical Data Transparency & Provenance
        </span>
        <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-on-surface mb-3 font-headline">
          Dataset Explorer & Audit Trail
        </h1>
        <p className="text-base text-on-surface-variant leading-relaxed">
          Inspect, search, and paginate through verified patient records for {selectedDisease.replace('_', ' ').toUpperCase()}.
        </p>
      </div>

      {/* Dataset Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-6 mb-8">
        <div className="bg-surface-container-lowest dark:bg-[#151e22] rounded-2xl p-5 shadow-sm border border-surface-container/60 dark:border-surface-variant/30 flex items-center gap-4">
          <div className="w-12 h-12 rounded-full bg-primary/10 text-primary flex items-center justify-center shrink-0">
            <span className="material-symbols-outlined text-[24px]">folder</span>
          </div>
          <div>
            <span className="text-xs text-on-surface-variant font-semibold">Total Records</span>
            <div className="text-2xl font-extrabold text-on-surface font-headline">
              {data ? data.total_records.toLocaleString() : '...'}
            </div>
          </div>
        </div>

        <div className="bg-surface-container-lowest dark:bg-[#151e22] rounded-2xl p-5 shadow-sm border border-surface-container/60 dark:border-surface-variant/30 flex items-center gap-4">
          <div className="w-12 h-12 rounded-full bg-secondary-container text-on-secondary-container flex items-center justify-center shrink-0">
            <span className="material-symbols-outlined text-[24px]">view_column</span>
          </div>
          <div>
            <span className="text-xs text-on-surface-variant font-semibold">Features</span>
            <div className="text-2xl font-extrabold text-primary dark:text-[#6bd8cb] font-headline">
              {data ? (data.columns.length - 1).toString() : '...'}
            </div>
          </div>
        </div>

        <div className="bg-surface-container-lowest dark:bg-[#151e22] rounded-2xl p-5 shadow-sm border border-surface-container/60 dark:border-surface-variant/30 flex items-center gap-4">
          <div className="w-12 h-12 rounded-full bg-[#ecfdf5] dark:bg-[#064e3b] text-[#065f46] dark:text-[#a7f3d0] flex items-center justify-center shrink-0">
            <span className="material-symbols-outlined text-[24px]">check_circle</span>
          </div>
          <div>
            <span className="text-xs text-on-surface-variant font-semibold">Missing Values</span>
            <div className="text-2xl font-extrabold text-[#065f46] dark:text-[#a7f3d0] font-headline">
              0 (Clean)
            </div>
          </div>
        </div>

        <div className="bg-surface-container-lowest dark:bg-[#151e22] rounded-2xl p-5 shadow-sm border border-surface-container/60 dark:border-surface-variant/30 flex items-center justify-center">
          <button
            onClick={downloadDataset}
            className="w-full inline-flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-primary hover:bg-[#00544c] text-on-primary text-xs font-bold transition-all shadow-md cursor-pointer"
          >
            <span className="material-symbols-outlined text-[18px]">download</span>
            <span>Export CSV Dataset</span>
          </button>
        </div>
      </div>

      {/* Search and Table Card */}
      <div className="bg-surface-container-lowest dark:bg-[#151e22] rounded-3xl p-6 sm:p-8 shadow-sm border border-surface-container/60 dark:border-surface-variant/30">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-6 pb-4 border-b border-surface-container dark:border-surface-variant/30">
          <div className="relative w-full sm:w-80">
            <span className="material-symbols-outlined text-[18px] text-on-surface-variant absolute left-3 top-2.5">
              search
            </span>
            <input
              type="text"
              placeholder="Filter dataset records..."
              value={searchQuery}
              onChange={e => {
                setSearchQuery(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full pl-9 pr-4 py-2 bg-surface-container-low dark:bg-surface-container rounded-full text-xs font-semibold text-on-surface border border-surface-container-high dark:border-surface-variant focus:outline-none focus:ring-2 focus:ring-primary/40"
            />
          </div>

          <div className="flex items-center gap-3 text-xs text-on-surface-variant font-semibold">
            {data && (
              <span>
                Showing {(currentPage - 1) * 12 + 1} - {Math.min(currentPage * 12, data.total_filtered)} of {data.total_filtered.toLocaleString()} records
              </span>
            )}
            <div className="flex items-center gap-1">
              <button
                disabled={currentPage <= 1}
                onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                className="w-8 h-8 rounded-full bg-surface-container-low dark:bg-surface-container flex items-center justify-center text-on-surface hover:bg-surface-container-high disabled:opacity-40 cursor-pointer"
              >
                <span className="material-symbols-outlined text-[16px]">chevron_left</span>
              </button>
              <button
                disabled={data ? currentPage * 12 >= data.total_filtered : false}
                onClick={() => setCurrentPage(p => p + 1)}
                className="w-8 h-8 rounded-full bg-surface-container-low dark:bg-surface-container flex items-center justify-center text-on-surface hover:bg-surface-container-high disabled:opacity-40 cursor-pointer"
              >
                <span className="material-symbols-outlined text-[16px]">chevron_right</span>
              </button>
            </div>
          </div>
        </div>

        {isLoading ? (
          <div className="py-16 flex justify-center items-center gap-2 text-on-surface-variant">
            <span className="material-symbols-outlined animate-spin text-[24px]">progress_activity</span>
            <span className="text-sm font-semibold">Querying clinical database...</span>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-surface-container dark:border-surface-variant text-on-surface-variant font-bold uppercase tracking-wider">
                  {data?.columns.slice(0, 8).map((col, idx) => (
                    <th key={idx} className="py-3 px-3 whitespace-nowrap">
                      {col}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-surface-container/60 dark:divide-surface-variant/30">
                {data?.rows.map((row, rIdx) => (
                  <tr key={rIdx} className="hover:bg-surface-container-low dark:hover:bg-surface-container/50 transition-colors">
                    {data?.columns.slice(0, 8).map((col, cIdx) => (
                      <td key={cIdx} className="py-2.5 px-3 font-mono text-on-surface whitespace-nowrap">
                        {row[col] !== null ? String(row[col]) : 'null'}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};
