"use client";
import Link from "next/link";
import { CheckCircle2, PackageCheck, Search } from "lucide-react";
import { productById, productUrl } from "@/lib/catalog";
import { Price } from "./ui";
import { useStore } from "./store";
export function OrderConfirmation({ id }: { id: string }) {
  const store = useStore();
  const order = store.orders.find((o) => o.id === id);
  return (
    <div className="confirmation-page">
      <section className="confirmation-card">
        <CheckCircle2 />
        <div>
          <h1>Order placed, thank you!</h1>
          {order ? (
            <>
              <p>
                Confirmation will be shown here for <b>{order.name}</b>.
              </p>
              <p>
                Shipping to <b>{order.address}</b>
              </p>
              <div className="confirmation-date">
                Delivery estimate: <b>Tuesday, September 22</b>
              </div>
              <p className="order-id">Order # {order.id}</p>
            </>
          ) : (
            <p>Your demo order was submitted successfully.</p>
          )}
        </div>
      </section>
      <div className="confirmation-actions">
        <Link className="yellow-button" href="/orders">
          Review your orders
        </Link>
        <Link className="outline-button" href="/">
          Continue shopping
        </Link>
      </div>
    </div>
  );
}
export function Orders() {
  const store = useStore();
  return (
    <div className="orders-page">
      <div className="breadcrumbs">
        <Link href="/account">Your Account</Link>
        <span>›</span>
        <span>Your Orders</span>
      </div>
      <div className="orders-heading">
        <h1>Your Orders</h1>
        <form>
          <input
            placeholder="Search all orders"
            aria-label="Search all orders"
          />
          <button>
            <Search /> Search Orders
          </button>
        </form>
      </div>
      <nav className="order-tabs">
        <b>Orders</b>
        <span>Buy Again</span>
        <span>Not Yet Shipped</span>
        <span>Cancelled Orders</span>
      </nav>
      {!store.orders.length ? (
        <div className="empty-orders">
          <PackageCheck size={76} />
          <h2>Looks like you haven't placed an order in the past 3 months.</h2>
          <Link href="/">Start shopping</Link>
        </div>
      ) : (
        <div className="order-list">
          {store.orders.map((order) => (
            <article className="order-card" key={order.id}>
              <header>
                <span>
                  ORDER PLACED
                  <b>
                    {new Date(order.date).toLocaleDateString("en-US", {
                      month: "long",
                      day: "numeric",
                      year: "numeric",
                    })}
                  </b>
                </span>
                <span>
                  TOTAL<b>${order.total.toFixed(2)}</b>
                </span>
                <span>
                  SHIP TO<b>{order.name}</b>
                </span>
                <span className="order-number">
                  ORDER # {order.id}
                  <Link href={`/order-confirmation?id=${order.id}`}>
                    View order details
                  </Link>
                </span>
              </header>
              <div className="order-body">
                <h2>Arriving Tuesday</h2>
                <p>Not yet shipped</p>
                {order.lines.map((line) => {
                  const p = productById(line.id);
                  return p ? (
                    <div className="order-line" key={line.id}>
                      <Link href={productUrl(p.id)}>
                        <img src={p.images[0]} alt={p.name} />
                      </Link>
                      <div>
                        <Link href={productUrl(p.id)}>{p.name}</Link>
                        <p>Return window ends 30 days after delivery</p>
                        <button
                          className="yellow-button"
                          onClick={() => store.add(p.id, line.quantity)}
                        >
                          Buy it again
                        </button>
                      </div>
                      <Price value={p.price * line.quantity} />
                      <div className="order-buttons">
                        <button
                          className="outline-button"
                          onClick={() =>
                            store.notify("Tracking isn't available in this demo")
                          }
                        >
                          Track package
                        </button>
                        <button
                          className="outline-button"
                          onClick={() =>
                            store.notify("Reviews aren't available in this demo")
                          }
                        >
                          Write a product review
                        </button>
                      </div>
                    </div>
                  ) : null;
                })}
              </div>
            </article>
          ))}
        </div>
      )}
    </div>
  );
}
