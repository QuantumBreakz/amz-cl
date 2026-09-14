"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { products } from "@/lib/catalog";
import { apiClient, type CommerceState, type Order } from "@/lib/api-client";
import { setQuantity, subtotalCents } from "@/lib/commerce";

export type { Order };

const initial: CommerceState = {
  cart: [],
  saved: [],
  orders: [],
  name: "",
  location: "Pakistan",
  language: "English",
  user: null,
};

function errorMessage(reason: unknown) {
  return reason instanceof Error
    ? reason.message
    : "The server could not save your changes.";
}

function useCommerceState() {
  const [state, setState] = useState<CommerceState>(initial);
  const [ready, setReady] = useState(false);
  const [toast, setToast] = useState("");
  const requestQueue = useRef<Promise<void>>(Promise.resolve());

  useEffect(() => {
    let active = true;
    apiClient
      .session()
      .then((next) => active && setState(next))
      .catch((reason) => active && setToast(errorMessage(reason)))
      .finally(() => active && setReady(true));
    return () => {
      active = false;
    };
  }, []);

  useEffect(() => {
    if (!toast) return;
    const timeout = setTimeout(() => setToast(""), 3500);
    return () => clearTimeout(timeout);
  }, [toast]);

  const reconcile = useCallback(
    (operation: () => Promise<CommerceState>) => {
      requestQueue.current = requestQueue.current
        .catch(() => undefined)
        .then(async () => {
          const next = await operation();
          setState(next);
        })
        .catch(async (reason) => {
          setToast(errorMessage(reason));
          try {
            setState(await apiClient.session());
          } catch {}
        });
    },
    [],
  );

  // Derived values recompute only when the cart changes. subtotalCents does a
  // linear catalog lookup per line, so before this memo it ran O(lines x catalog)
  // on every render. The memo is deliberately the complete optimization: the
  // 191-product fixture and normal cart sizes do not justify an indexed cache in
  // the pure commerce module.
  const total = useMemo(
    () => subtotalCents(state.cart, products) / 100,
    [state.cart],
  );
  const count = useMemo(
    () => state.cart.reduce((sum, line) => sum + line.quantity, 0),
    [state.cart],
  );

  const add = useCallback(
    (id: string, quantity = 1, color?: string) => {
      setState((current) => ({
        ...current,
        cart: setQuantity(
          current.cart,
          id,
          (current.cart.find((line) => line.id === id)?.quantity ?? 0) + quantity,
          products,
          color,
        ),
      }));
      setToast("Added to Cart");
      reconcile(() => apiClient.addCart(id, quantity, color));
    },
    [reconcile],
  );

  const quantity = useCallback(
    (id: string, nextQuantity: number) => {
      setState((current) => ({
        ...current,
        cart: setQuantity(current.cart, id, nextQuantity, products),
      }));
      reconcile(() => apiClient.setCartLine(id, nextQuantity));
    },
    [reconcile],
  );

  const save = useCallback(
    (id: string) => {
      setState((current) => ({
        ...current,
        saved: [...new Set([...current.saved, id])],
        cart: current.cart.filter((line) => line.id !== id),
      }));
      setToast("Saved for later");
      reconcile(() => apiClient.saveItem(id));
    },
    [reconcile],
  );

  const unsave = useCallback(
    (id: string) => {
      setState((current) => ({
        ...current,
        saved: current.saved.filter((candidate) => candidate !== id),
      }));
      reconcile(() => apiClient.removeSavedItem(id));
    },
    [reconcile],
  );

  const setLocation = useCallback(
    (location: string) => {
      setState((current) => ({ ...current, location }));
      reconcile(() => apiClient.updateProfile({ location }));
    },
    [reconcile],
  );

  const setName = useCallback(
    (name: string) => {
      setState((current) => ({ ...current, name }));
      reconcile(() => apiClient.updateProfile({ name }));
    },
    [reconcile],
  );

  const setLanguage = useCallback(
    (language: string) => {
      setState((current) => ({ ...current, language }));
      reconcile(() => apiClient.updateProfile({ language }));
    },
    [reconcile],
  );

  const authenticate = useCallback(
    async (input: {
      mode: "login" | "register";
      name?: string;
      email: string;
      password: string;
    }) => {
      await requestQueue.current;
      const next =
        input.mode === "register"
          ? await apiClient.register({
              name: input.name ?? "",
              email: input.email,
              password: input.password,
            })
          : await apiClient.login({ email: input.email, password: input.password });
      setState(next);
      return next;
    },
    [],
  );

  const logout = useCallback(async () => {
    await requestQueue.current;
    const next = await apiClient.logout();
    setState(next);
    setToast("Signed out");
  }, []);

  const placeOrder = useCallback(async (name: string, address: string) => {
    await requestQueue.current;
    const result = await apiClient.placeOrder({
      name,
      address,
      idempotencyKey: crypto.randomUUID(),
    });
    setState(result.state);
    return result.order.id;
  }, []);

  return useMemo(
    () => ({
      ...state,
      ready,
      toast,
      notify: setToast,
      total,
      count,
      add,
      quantity,
      save,
      unsave,
      setLocation,
      setName,
      setLanguage,
      authenticate,
      logout,
      placeOrder,
    }),
    [
      state,
      ready,
      toast,
      total,
      count,
      add,
      quantity,
      save,
      unsave,
      setLocation,
      setName,
      setLanguage,
      authenticate,
      logout,
      placeOrder,
    ],
  );
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
  const store = useContext(Store);
  if (!store) throw new Error("StoreProvider missing");
  return store;
}
