import { useState, useEffect, useImperativeHandle, forwardRef, useCallback, useMemo } from 'react';
import { Transaction } from '@/types/api';
import { ExternalLink, Loader2, History, CheckCircle2, Clock, XCircle } from 'lucide-react';
import { format } from 'date-fns';
import { motion } from 'framer-motion';
import { getTransactions } from '@/services/api';
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
  PaginationEllipsis,
} from '@/components/ui/pagination';

interface TransactionHistoryProps {
  entityId?: string;
  transactions?: Transaction[];
  loading?: boolean;
}

export interface TransactionHistoryRef {
  refresh: () => Promise<void>;
}

export const TransactionHistory = forwardRef<TransactionHistoryRef, TransactionHistoryProps>(
  ({ entityId, transactions: propsTransactions, loading: propsLoading }, ref) => {
    const [transactions, setTransactions] = useState<Transaction[]>([]);
    const [loading, setLoading] = useState(true);
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10;

    const loadTransactions = useCallback(async () => {
      if (!entityId) {
        return;
      }

      setLoading(true);
      try {
        const data = await getTransactions(entityId);
        setTransactions(data);
      } catch (error) {
        console.error('Error loading transactions:', error);
        setTransactions([]);
      } finally {
        setLoading(false);
      }
    }, [entityId]);

    useEffect(() => {
      if (entityId) {
        loadTransactions();
      } else if (propsTransactions !== undefined) {
        setTransactions(propsTransactions);
        setLoading(propsLoading ?? false);
      }
    }, [entityId, propsTransactions, propsLoading, loadTransactions]);

    // Expose refresh function via ref
    useImperativeHandle(ref, () => ({
      refresh: async () => {
        await loadTransactions();
      },
    }), [loadTransactions]);

    const allTransactions = entityId ? transactions : (propsTransactions || []);
    const displayLoading = entityId ? loading : (propsLoading ?? false);
    
    // Reset to page 1 when transactions change
    useEffect(() => {
      setCurrentPage(1);
    }, [allTransactions.length]);

    // Calculate pagination
    const totalPages = Math.ceil(allTransactions.length / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const displayTransactions = useMemo(() => {
      return allTransactions.slice(startIndex, endIndex);
    }, [allTransactions, startIndex, endIndex]);

    const shortAddress = (addr: string) => `${addr.slice(0, 6)}...${addr.slice(-4)}`;
    const shortHash = (hash: string) => `${hash.slice(0, 10)}...${hash.slice(-6)}`;

    // Generate page numbers to display
    const getPageNumbers = () => {
      const pages: (number | 'ellipsis')[] = [];
      const maxVisiblePages = 5;
      
      if (totalPages <= maxVisiblePages) {
        // Show all pages if total pages is less than max visible
        for (let i = 1; i <= totalPages; i++) {
          pages.push(i);
        }
      } else {
        // Always show first page
        pages.push(1);
        
        if (currentPage > 3) {
          pages.push('ellipsis');
        }
        
        // Show pages around current page
        const start = Math.max(2, currentPage - 1);
        const end = Math.min(totalPages - 1, currentPage + 1);
        
        for (let i = start; i <= end; i++) {
          if (i !== 1 && i !== totalPages) {
            pages.push(i);
          }
        }
        
        if (currentPage < totalPages - 2) {
          pages.push('ellipsis');
        }
        
        // Always show last page
        if (totalPages > 1) {
          pages.push(totalPages);
        }
      }
      
      return pages;
    };

    const statusConfig = {
    Pending: {
      color: 'text-yellow-400',
      bgColor: 'bg-yellow-400/10',
      borderColor: 'border-yellow-400/20',
      icon: Clock,
    },
    Completed: {
      color: 'text-green-400',
      bgColor: 'bg-green-400/10',
      borderColor: 'border-green-400/20',
      icon: CheckCircle2,
    },
    Failed: {
      color: 'text-red-400',
      bgColor: 'bg-red-400/10',
      borderColor: 'border-red-400/20',
      icon: XCircle,
    },
  };

    if (displayLoading) {
      return (
        <div className="flex items-center justify-center py-16">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </div>
      );
    }

    if (allTransactions.length === 0) {
      return (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center py-16"
        >
          <div className="w-16 h-16 mx-auto mb-4 rounded-xl bg-primary/10 flex items-center justify-center">
            <History className="w-8 h-8 text-primary opacity-50" />
          </div>
          <p className="text-muted-foreground font-medium">No transactions yet</p>
          <p className="text-sm text-muted-foreground/70 mt-1">Transactions will appear here once you start making transfers</p>
        </motion.div>
      );
    }

    const pageNumbers = getPageNumbers();

    return (
      <div className="space-y-4">
        <div className="overflow-x-auto">
          <div className="min-w-full">
            <div className="space-y-2">
              {displayTransactions.map((tx, index) => {
                const status = statusConfig[tx.status];
                const StatusIcon = status.icon;
                
                return (
                  <motion.div
                    key={tx.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="group glass-card p-2.5 sm:p-3 hover:border-primary/30 transition-all duration-300 hover:shadow-lg hover:shadow-primary/5"
                  >
                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 sm:gap-3">
                      {/* Left side - Date and Recipient */}
                      <div className="flex-1 min-w-0 w-full sm:w-auto">
                        <div className="flex items-center gap-2 mb-1.5">
                          <div className={`p-1 rounded-lg ${status.bgColor} border ${status.borderColor} flex-shrink-0`}>
                            <StatusIcon className={`w-3 h-3 sm:w-3.5 sm:h-3.5 ${status.color}`} />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-xs sm:text-sm font-semibold text-foreground truncate">{tx.toName}</p>
                            <p className="text-xs text-muted-foreground font-mono truncate">{shortAddress(tx.toAddress)}</p>
                          </div>
                        </div>
                        <p className="text-xs text-muted-foreground">
                          {format(new Date(tx.timestamp), 'MMM d, yyyy • HH:mm')}
                        </p>
                      </div>

                      {/* Center - Amount */}
                      <div className="text-left sm:text-right w-full sm:w-auto">
                        <p className="text-sm sm:text-base font-bold text-foreground group-hover:text-primary transition-colors">
                          {tx.amount} {tx.token}
                        </p>
                      </div>

                      {/* Right side - Status and Hash */}
                      <div className="flex items-center gap-2 w-full sm:w-auto">
                        <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${status.bgColor} ${status.color} border ${status.borderColor} whitespace-nowrap`}>
                          {tx.status}
                        </span>
                        <a
                          href={`https://snowtrace.io/tx/${tx.txHash}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="p-1.5 rounded-lg bg-secondary/50 hover:bg-primary/10 border border-border hover:border-primary/30 transition-all duration-200 group/link flex-shrink-0 ml-auto sm:ml-0"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <ExternalLink className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-muted-foreground group-hover/link:text-primary transition-colors" />
                        </a>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-border/50">
            <div className="text-xs sm:text-sm text-muted-foreground">
              Showing {startIndex + 1} to {Math.min(endIndex, allTransactions.length)} of {allTransactions.length} transactions
            </div>
            <Pagination>
              <PaginationContent>
                <PaginationItem>
                  <PaginationPrevious
                    href="#"
                    onClick={(e) => {
                      e.preventDefault();
                      if (currentPage > 1) {
                        setCurrentPage((prev) => prev - 1);
                      }
                    }}
                    className={currentPage === 1 ? 'pointer-events-none opacity-50' : 'cursor-pointer'}
                  />
                </PaginationItem>
                
                {pageNumbers.map((page, index) => (
                  <PaginationItem key={index}>
                    {page === 'ellipsis' ? (
                      <PaginationEllipsis />
                    ) : (
                      <PaginationLink
                        href="#"
                        onClick={(e) => {
                          e.preventDefault();
                          setCurrentPage(page);
                        }}
                        isActive={currentPage === page}
                        className="cursor-pointer"
                      >
                        {page}
                      </PaginationLink>
                    )}
                  </PaginationItem>
                ))}
                
                <PaginationItem>
                  <PaginationNext
                    href="#"
                    onClick={(e) => {
                      e.preventDefault();
                      if (currentPage < totalPages) {
                        setCurrentPage((prev) => prev + 1);
                      }
                    }}
                    className={currentPage === totalPages ? 'pointer-events-none opacity-50' : 'cursor-pointer'}
                  />
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          </div>
        )}
      </div>
    );
  }
);
