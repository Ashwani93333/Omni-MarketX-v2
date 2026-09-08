"use client";

import { Clock3, X } from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { formatRelativeTime } from "@/lib/format";
import { cn } from "@/lib/utils";
import { useOrdersStore } from "@/store/orders-store";

export function OpenOrdersCard() {
  const openOrders = useOrdersStore((s) => s.openOrders);
  const cancel = useOrdersStore((s) => s.cancel);

  const handleCancel = (id: string) => {
    cancel(id);
    toast.success("Order cancelled");
  };

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-[15px]">
          <Clock3 className="h-4 w-4 text-primary" />
          Open Orders
          {openOrders.length > 0 && (
            <span className="rounded-md bg-primary-light px-1.5 py-0.5 text-[10px] font-bold text-primary">
              {openOrders.length}
            </span>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-2 pt-0">
        {openOrders.length === 0 ? (
          <p className="rounded-[10px] bg-background px-3 py-2 text-xs text-text-muted">
            No open orders. Limit orders you place will appear here.
          </p>
        ) : (
          <ul className="space-y-2">
            {openOrders.map((order) => (
              <li
                key={order.id}
                className="rounded-[10px] border border-border bg-background px-3 py-2.5"
              >
                <div className="flex items-center justify-between gap-2">
                  <span
                    className={cn(
                      "inline-flex rounded-md px-1.5 py-0.5 text-[10px] font-bold",
                      order.side === "YES"
                        ? "bg-success-light text-success"
                        : "bg-danger-light text-danger"
                    )}
                  >
                    {order.side}
                  </span>
                  <span className="number-tight text-[11px] text-text-muted">
                    {order.type} · {formatRelativeTime(order.placedAt)}
                  </span>
                  <button
                    onClick={() => handleCancel(order.id)}
                    aria-label="Cancel order"
                    className="ml-auto rounded-md p-1 text-text-muted transition-colors hover:bg-surface hover:text-danger"
                  >
                    <X className="h-3.5 w-3.5" />
                  </button>
                </div>
                <Link
                  href={`/markets/${order.marketId}`}
                  className="mt-1.5 block line-clamp-1 text-xs font-semibold text-text-primary transition-colors hover:text-primary"
                >
                  {order.marketTitle}
                </Link>
                <p className="mt-1 text-[11px] text-text-muted">
                  @ <span className="number-tight">{order.price.toFixed(3)}</span>{" "}
                  · <span className="number-tight">{order.shares} shares</span>
                </p>
              </li>
            ))}
          </ul>
        )}
      </CardContent>
    </Card>
  );
}