"use client";

import { useId } from "react";

import { createRng, hashString } from "@/mocks/market-activity";

const QR_SIZE = 21;

function buildMatrix(seed: string): boolean[][] {
  const rng = createRng(hashString(seed));
  const matrix: boolean[][] = Array.from({ length: QR_SIZE }, () =>
    Array<boolean>(QR_SIZE).fill(false)
  );

  const finder = (top: number, left: number) => {
    for (let i = 0; i < 7; i++) {
      for (let j = 0; j < 7; j++) {
        const ring = i === 0 || i === 6 || j === 0 || j === 6;
        const core = i >= 2 && i <= 4 && j >= 2 && j <= 4;
        matrix[top + i][left + j] = ring || core;
      }
    }
  };

  finder(0, 0);
  finder(0, QR_SIZE - 7);
  finder(QR_SIZE - 7, 0);

  for (let i = 0; i < QR_SIZE; i++) {
    for (let j = 0; j < QR_SIZE; j++) {
      if (matrix[i][j]) continue;
      matrix[i][j] = rng() < 0.44;
    }
  }

  return matrix;
}

export function ReferralQr({ value, size = 160 }: { value: string; size?: number }) {
  const maskId = useId();
  const matrix = buildMatrix(value);
  const quiet = 2;
  const total = QR_SIZE + quiet * 2;

  return (
    <svg
      width={size}
      height={size}
      viewBox={`0 0 ${total} ${total}`}
      role="img"
      aria-label="Referral QR code"
      className="h-auto w-full max-w-[200px] rounded-[10px] bg-white p-2"
    >
      <defs>
        <mask id={maskId}>
          <rect width={total} height={total} fill="#fff" />
          {matrix.map((row, i) =>
            row.map((filled, j) =>
              filled ? (
                <rect
                  key={`${i}-${j}`}
                  x={j + quiet}
                  y={i + quiet}
                  width={1}
                  height={1}
                  fill="#000"
                />
              ) : null
            )
          )}
        </mask>
      </defs>
      <rect width={total} height={total} fill="#fff" />
      <rect width={total} height={total} fill="#000" mask={`url(#${maskId})`} />
    </svg>
  );
}