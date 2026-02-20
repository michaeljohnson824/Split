import { useState, useCallback } from 'react'
import HomeScreen from './screens/HomeScreen'
import SettingsScreen from './screens/SettingsScreen'
import ReceiptScreen from './screens/ReceiptScreen'
import ItemsScreen from './screens/ItemsScreen'
import PeopleScreen from './screens/PeopleScreen'
import AssignScreen from './screens/AssignScreen'
import SummaryScreen from './screens/SummaryScreen'

function generateId() {
  return `item-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
}

export default function App() {
  // --- Settings (persisted) ---
  const [apiKey, setApiKey] = useState(() => localStorage.getItem('splittab_api_key') || '');
  const [venmoUsername, setVenmoUsername] = useState(
    () => localStorage.getItem('splittab_venmo') || ''
  );

  const saveSettings = useCallback((key, venmo) => {
    setApiKey(key);
    setVenmoUsername(venmo);
    localStorage.setItem('splittab_api_key', key);
    localStorage.setItem('splittab_venmo', venmo);
  }, []);

  // --- Screen state ---
  const [screen, setScreen] = useState('home'); // home | settings | receipt | items | people | assign | summary
  const [prevScreen, setPrevScreen] = useState(null);

  const navigate = useCallback((to, from) => {
    setPrevScreen(from || screen);
    setScreen(to);
    window.scrollTo(0, 0);
  }, [screen]);

  const goBack = useCallback(() => {
    if (prevScreen) {
      setScreen(prevScreen);
      setPrevScreen(null);
      window.scrollTo(0, 0);
    } else {
      setScreen('home');
      window.scrollTo(0, 0);
    }
  }, [prevScreen]);

  // --- Receipt data ---
  const [receiptImage, setReceiptImage] = useState(null); // data URL for preview

  // items: [{id, name, price, flagged}]
  const [items, setItems] = useState([]);
  const [subtotal, setSubtotal] = useState('');
  const [tax, setTax] = useState('');
  const [tip, setTip] = useState('');

  // --- People ---
  const [people, setPeople] = useState([]);

  // --- Assignments: { itemId: [personIndex, ...] } ---
  const [assignments, setAssignments] = useState({});

  // --- Helpers for item management ---
  const addItem = useCallback((name = '', price = '') => {
    const newItem = { id: generateId(), name, price, flagged: false };
    setItems(prev => [...prev, newItem]);
    return newItem.id;
  }, []);

  const updateItem = useCallback((id, changes) => {
    setItems(prev => prev.map(item => item.id === id ? { ...item, ...changes } : item));
  }, []);

  const removeItem = useCallback((id) => {
    setItems(prev => prev.filter(item => item.id !== id));
    setAssignments(prev => {
      const next = { ...prev };
      delete next[id];
      return next;
    });
  }, []);

  const loadReceiptData = useCallback((data) => {
    const loadedItems = data.items.map(item => ({
      id: generateId(),
      name: item.name,
      price: item.price,
      flagged: item.flagged || false,
    }));
    setItems(loadedItems);
    setSubtotal(data.subtotal ? String(data.subtotal) : '');
    setTax(data.tax ? String(data.tax) : '');
    setTip(data.tip !== null && data.tip !== undefined ? String(data.tip) : '');
    setAssignments({});
  }, []);

  const resetSession = useCallback(() => {
    setReceiptImage(null);
    setItems([]);
    setSubtotal('');
    setTax('');
    setTip('');
    setPeople([]);
    setAssignments({});
    setPrevScreen(null);
  }, []);

  // --- Shared props bundles ---
  const settingsProps = {
    apiKey,
    venmoUsername,
    onSave: saveSettings,
    onBack: () => navigate(prevScreen || 'home'),
  };

  const receiptProps = {
    apiKey,
    receiptImage,
    setReceiptImage,
    onReceiptParsed: (data) => {
      loadReceiptData(data);
      navigate('items', 'receipt');
    },
    onSkipToManual: () => {
      resetSession();
      navigate('items', 'home');
    },
    onBack: () => navigate('home', 'receipt'),
  };

  const itemsProps = {
    items,
    setItems,
    subtotal,
    setSubtotal,
    tax,
    setTax,
    tip,
    setTip,
    addItem,
    updateItem,
    removeItem,
    onNext: () => navigate('people', 'items'),
    onBack: () => navigate(prevScreen || 'home'),
  };

  const peopleProps = {
    people,
    setPeople,
    onNext: () => {
      setAssignments({});
      navigate('assign', 'people');
    },
    onBack: () => navigate('items', 'people'),
  };

  const assignProps = {
    items,
    people,
    assignments,
    setAssignments,
    onNext: () => navigate('summary', 'assign'),
    onBack: () => navigate('people', 'assign'),
  };

  const summaryProps = {
    items,
    people,
    assignments,
    tax: parseFloat(tax) || 0,
    tip: parseFloat(tip) || 0,
    venmoUsername,
    onBack: () => navigate('assign', 'summary'),
    onStartOver: () => {
      resetSession();
      navigate('home');
    },
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {screen === 'home' && (
        <HomeScreen
          onStartCamera={() => navigate('receipt', 'home')}
          onStartManual={() => {
            resetSession();
            navigate('items', 'home');
          }}
          onOpenSettings={() => navigate('settings', 'home')}
          hasApiKey={!!apiKey}
        />
      )}
      {screen === 'settings' && (
        <SettingsScreen {...settingsProps} />
      )}
      {screen === 'receipt' && (
        <ReceiptScreen {...receiptProps} />
      )}
      {screen === 'items' && (
        <ItemsScreen {...itemsProps} />
      )}
      {screen === 'people' && (
        <PeopleScreen {...peopleProps} />
      )}
      {screen === 'assign' && (
        <AssignScreen {...assignProps} />
      )}
      {screen === 'summary' && (
        <SummaryScreen {...summaryProps} />
      )}
    </div>
  );
}
