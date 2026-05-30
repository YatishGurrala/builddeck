"use client";

import { Area, AreaChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

const data = [
  { name: 'Mon', docs: 2 },
  { name: 'Tue', docs: 5 },
  { name: 'Wed', docs: 4 },
  { name: 'Thu', docs: 8 },
  { name: 'Fri', docs: 6 },
  { name: 'Sat', docs: 7 },
  { name: 'Sun', docs: 5 },
];

export function RecentDocsChart() {
  return (
    <Card>
      <CardHeader>
        <CardDescription>Workspace activity</CardDescription>
        <CardTitle>Recently updated docs</CardTitle>
      </CardHeader>
      <CardContent className="h-72">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data}>
            <defs>
              <linearGradient id="docFill" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#0f172a" stopOpacity={0.28} />
                <stop offset="95%" stopColor="#0f172a" stopOpacity={0} />
              </linearGradient>
            </defs>
            <XAxis dataKey="name" stroke="#94a3b8" fontSize={12} />
            <YAxis stroke="#94a3b8" fontSize={12} />
            <Tooltip />
            <Area type="monotone" dataKey="docs" stroke="#0f172a" fill="url(#docFill)" strokeWidth={2} />
          </AreaChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}