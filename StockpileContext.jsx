import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { base44 } from '@/api/base44Client';

const StockpileContext = createContext();

// Generate or retrieve a persistent session ID for anonymous users
function getSessionId() {
  let id = localStorage.getItem('aduke_session_id');
  if (!id) {
    id = 'sess_' + Math.random().toString(36).substr(2, 16) + Date.now().toString(36);
    localStorage.setItem('aduke_session_id', id);
  }
  return id;
}

export function StockpileProvider({ children }) {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const sessionId = getSessionId();

  const fetchItems = useCallback(async () => {
    const data = await base44.entities.Stockpile.filter({ session_id: sessionId }, '-created_date', 100);
    setItems(data);
    setLoading(false);
  }, [sessionId]);

  useEffect(() => { fetchItems(); }, [fetchItems]);

  const isStockpiled = useCallback((productId) => {
    return items.some(i => i.product_id === productId);
  }, [items]);

  const addToStockpile = useCallback(async (product) => {
    if (isStockpiled(product.id)) return;
    const record = await base44.entities.Stockpile.create({
      session_id: sessionId,
      product_id: product.id,
      product_name: product.name,
      product_price: product.price,
      product_image: product.image_url || '',
      product_category: product.category || '',
    });
    setItems(prev => [record, ...prev]);
  }, [sessionId, isStockpiled]);

  const removeFromStockpile = useCallback(async (stockpileId) => {
    await base44.entities.Stockpile.delete(stockpileId);
    setItems(prev => prev.filter(i => i.id !== stockpileId));
  }, []);

  return (
    <StockpileContext.Provider value={{ items, loading, isStockpiled, addToStockpile, removeFromStockpile, refetch: fetchItems }}>
      {children}
    </StockpileContext.Provider>
  );
}

export const useStockpile = () => useContext(StockpileContext);
