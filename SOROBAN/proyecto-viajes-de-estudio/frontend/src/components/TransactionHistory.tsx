'use client';

import { useEffect, useState } from 'react';
import { useWallet } from '@/contexts/WalletContext';
import { ArrowUpRight, ExternalLink, Loader } from 'lucide-react';

interface TransactionRecord {
  hash: string;
  created_at: string;
  successful: boolean;
  memo?: string;
  operations: Array<{
    type: string;
    amount?: string;
  }>;
}

export default function TransactionHistory() {
  const { account } = useWallet();
  const [transactions, setTransactions] = useState<TransactionRecord[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!account) return;

    const fetchTransactions = async () => {
      setLoading(true);
      try {
        const response = await fetch(
          `https://horizon-testnet.stellar.org/accounts/${account.publicKey}/transactions?order=desc&limit=10`
        );
        const data = await response.json();

        if (data.records) {
          // Para cada transacción, obtener sus operaciones
          const enrichedTxs = await Promise.all(
            data.records.map(async (tx: any) => {
              const opsResponse = await fetch(tx.links.operations.href);
              const opsData = await opsResponse.json();
              return {
                hash: tx.hash,
                created_at: tx.created_at,
                successful: tx.successful,
                memo: tx.memo,
                operations: opsData.records || [],
              };
            })
          );

          setTransactions(enrichedTxs);
        }
      } catch (err) {
        console.error('Error fetching transactions:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchTransactions();
    const interval = setInterval(fetchTransactions, 30000); // Actualizar cada 30s

    return () => clearInterval(interval);
  }, [account]);

  if (!account) {
    return (
      <div className="bg-slate-800 rounded-lg p-6 border border-slate-700">
        <p className="text-slate-400">Conecta una wallet para ver transacciones</p>
      </div>
    );
  }

  return (
    <div className="bg-slate-800 rounded-lg border border-slate-700 overflow-hidden">
      <div className="p-6 border-b border-slate-700">
        <h3 className="text-lg font-semibold text-white flex items-center gap-2">
          <ArrowUpRight className="w-5 h-5 text-stellar" />
          Historial de Transacciones
        </h3>
      </div>

      {loading ? (
        <div className="p-8 flex items-center justify-center gap-2 text-slate-400">
          <Loader className="w-4 h-4 animate-spin" />
          Cargando transacciones...
        </div>
      ) : transactions.length === 0 ? (
        <div className="p-8 text-center text-slate-400">
          No hay transacciones registradas
        </div>
      ) : (
        <div className="divide-y divide-slate-700 max-h-96 overflow-y-auto">
          {transactions.map(tx => {
            const paymentOp = tx.operations.find((op: any) => op.type === 'payment');
            const amount = paymentOp?.amount || '?';

            return (
              <div key={tx.hash} className="p-4 hover:bg-slate-900/50 transition-colors">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    {/* Memo */}
                    {tx.memo && (
                      <p className="text-sm text-stellar font-medium mb-1">{tx.memo}</p>
                    )}

                    {/* Hash */}
                    <p className="text-sm text-slate-300 font-mono">
                      {tx.hash.slice(0, 8)}...{tx.hash.slice(-4)}
                    </p>

                    {/* Fecha */}
                    <p className="text-xs text-slate-500 mt-1">
                      {new Date(tx.created_at).toLocaleString('es-ES')}
                    </p>
                  </div>

                  {/* Monto y Estado */}
                  <div className="text-right">
                    <p className="font-semibold text-stellar">-{amount} XLM</p>
                    <div className="flex items-center gap-2 mt-2">
                      {tx.successful ? (
                        <span className="text-xs px-2 py-1 rounded bg-green-900/30 text-green-400">
                          ✓ Confirmada
                        </span>
                      ) : (
                        <span className="text-xs px-2 py-1 rounded bg-red-900/30 text-red-400">
                          ✗ Fallida
                        </span>
                      )}
                      <a
                        href={`https://stellar.expert/explorer/testnet/tx/${tx.hash}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-stellar hover:text-stellar/80"
                      >
                        <ExternalLink className="w-4 h-4" />
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
