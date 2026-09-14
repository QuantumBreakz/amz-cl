"use client";
import {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from "react";
import { products } from "@/lib/catalog";
import {
  CartLine,
  setQuantity,
  subtotalCents,
  validCart,
} from "@/lib/commerce";
export type Order = {
  id: string;
  date: string;
  lines: CartLine[];
  total: number;
  name: string;
  address: string;
};
type State = {
  cart: CartLine[];
  saved: string[];
  orders: Order[];
  name: string;
  location: string;
};
const initial: State = {
  cart: [],
  saved: [],
  orders: [],
  name: "",
  location: "Pakistan",
};
function useCommerceState() {
  const [state, setState] = useState<State>(initial);
  const [ready, setReady] = useState(false);
  const [toast, setToast] = useState("");
  useEffect(() => {
    try {
      const raw = JSON.parse(
        localStorage.getItem("amazon-assignment-v1") || "null",
      );
      if (raw && typeof raw === "object")
        setState({
          cart: validCart(raw.cart, products),
          saved: Array.isArray(raw.saved)
            ? raw.saved.filter(
                (id: unknown) =>
                  typeof id === "string" && products.some((p) => p.id === id),
              )
            : [],
          orders: Array.isArray(raw.orders)
            ? raw.orders
                .filter(
                  (o: Order) =>
                    o &&
                    typeof o.id === "string" &&
                    typeof o.total === "number" &&
                    // name/address are rendered directly; a non-string here
                    // (crafted localStorage) would throw during render.
                    typeof o.name === "string" &&
                    typeof o.address === "string" &&
                    typeof o.date === "string" &&
                    Array.isArray(o.lines),
                )
                .map((o: Order) => ({
                  ...o,
                  lines: validCart(o.lines, products),
                }))
            : [],
          name: typeof raw.name === "string" ? raw.name : "",
          location:
            typeof raw.location === "string" ? raw.location : "Pakistan",
        });
    } catch {}
    setReady(true);
  }, []);
  useEffect(() => {
    if (ready)
      try {
        localStorage.setItem("amazon-assignment-v1", JSON.stringify(state));
      } catch {
        setToast(
          "Your browser could not save changes. Keep this tab open to continue.",
        );
      }
  }, [state, ready]);
  useEffect(() => {
    if (toast) {
      const t = setTimeout(() => setToast(""), 3500);
      return () => clearTimeout(t);
    }
  }, [toast]);
  return {
    ...state,
    ready,
    toast,
    notify: setToast,
    total: subtotalCents(state.cart, products) / 100,
    count: state.cart.reduce((n, l) => n + l.quantity, 0),
    add: (id: string, qty = 1, color?: string) => {
      setState((s) => ({
        ...s,
        cart: setQuantity(
          s.cart,
          id,
          (s.cart.find((l) => l.id === id)?.quantity ?? 0) + qty,
          products,
          color,
        ),
      }));
      setToast("Added to Cart");
    },
    quantity: (id: string, qty: number) =>
      setState((s) => ({ ...s, cart: setQuantity(s.cart, id, qty, products) })),
    save: (id: string) => {
      setState((s) => ({
        ...s,
        saved: [...new Set([...s.saved, id])],
        cart: s.cart.filter((l) => l.id !== id),
      }));
      setToast("Saved for later");
    },
    unsave: (id: string) =>
      setState((s) => ({ ...s, saved: s.saved.filter((x) => x !== id) })),
    login: (name: string) => setState((s) => ({ ...s, name })),
    setLocation: (location: string) => setState((s) => ({ ...s, location })),
    placeOrder: (name: string, address: string) => {
      const order: Order = {
        id: `113-${Date.now().toString().slice(-7)}-${Math.floor(
          Math.random() * 10000000,
        )
          .toString()
          .padStart(7, "0")}`,
        date: new Date().toISOString(),
        lines: state.cart.map((x) => ({ ...x })),
        total: subtotalCents(state.cart, products) / 100,
        name,
        address,
      };
      if (!order.lines.length) return null;
      setState((s) => ({ ...s, cart: [], orders: [order, ...s.orders] }));
      return order.id;
    },
  };
}
const Store = createContext<ReturnType<typeof useCommerceState> | null>(null);
export function StoreProvider({ children }: { children: ReactNode }) {
  const store = useCommerceState();
  return (
    <Store.Provider value={store}>
      {children}
      {store.toast && (
        <div className="toast" role="status">
          ✓ {store.toast}
        </div>
      )}
    </Store.Provider>
  );
}
export function useStore() {
  const s = useContext(Store);
  if (!s) throw new Error("StoreProvider missing");
  return s;
}
