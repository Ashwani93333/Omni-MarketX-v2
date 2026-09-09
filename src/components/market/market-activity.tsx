"use client";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

import { OrderBook } from "./order-book";
import { OrderBookDepth } from "./order-book-depth";
import { RecentTrades } from "./recent-trades";

export function MarketActivity({
  marketId,
  lastPrice,
}: {
  marketId: string;
  lastPrice: number;
}) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Market Activity</CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="book">
          <TabsList className="w-full">
            <TabsTrigger value="book" className="flex-1">
              Order Book
            </TabsTrigger>
            <TabsTrigger value="depth" className="flex-1">
              Depth
            </TabsTrigger>
            <TabsTrigger value="trades" className="flex-1">
              Recent Trades
            </TabsTrigger>
          </TabsList>
          <TabsContent value="book">
            <OrderBook marketId={marketId} lastPrice={lastPrice} />
          </TabsContent>
          <TabsContent value="depth">
            <OrderBookDepth marketId={marketId} lastPrice={lastPrice} />
          </TabsContent>
          <TabsContent value="trades">
            <RecentTrades marketId={marketId} lastPrice={lastPrice} />
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}