import { useState, useEffect } from 'react';
import { initializeApp, getApps, cert } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

const Dashboard = ({ keyfileContent }) => {
  const [stats, setStats] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (!keyfileContent || !keyfileContent.project_id || !keyfileContent.private_key || !keyfileContent.client_email) {
          throw new Error('Invalid keyfile content. Please check your keyfile and try again.');
        }

        let app;
        if (getApps().length === 0) {
          app = initializeApp({
            credential: cert(keyfileContent),
            projectId: keyfileContent.project_id,
          });
        } else {
          app = getApp();
        }
        
        const db = getFirestore(app);
        
        try {
          const usersRef = db.collection('users');
          const snapshot = await usersRef.get();
        } catch (firebaseError) {
          throw new Error(`Firebase error: ${firebaseError.message}`);
        }

        const credits = snapshot.docs.map(doc => doc.data().daily_credits || 0);
        const totalUsers = credits.length;
        const totalCredits = credits.reduce((sum, credit) => sum + credit, 0);
        const averageCredits = totalCredits / totalUsers || 0;
        const maxCredits = Math.max(...credits, 0);
        const minCredits = Math.min(...credits, 0);

        const distribution = credits.reduce((acc, credit) => {
          const range = Math.floor(credit / 100) * 100;
          acc[range] = (acc[range] || 0) + 1;
          return acc;
        }, {});

        const chartData = Object.entries(distribution).map(([range, count]) => ({
          range: `${range}-${Number(range) + 99}`,
          count,
        }));

        setStats({
          totalUsers,
          totalCredits,
          averageCredits,
          maxCredits,
          minCredits,
          chartData,
        });
        setError(null);
      } catch (error) {
        console.error('Error fetching data:', error);
        setError(error.message);
        setStats(null);
      }
    };

    fetchData();
  }, [keyfileContent]);

  if (error) {
    return (
      <Alert variant="destructive" className="mt-8">
        <AlertTitle>Error</AlertTitle>
        <AlertDescription>{error}</AlertDescription>
      </Alert>
    );
  }

  if (!stats) {
    return <div className="text-center mt-8">Loading...</div>;
  }

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Users</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalUsers}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Credits</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalCredits.toLocaleString()}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Average Credits</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.averageCredits.toFixed(2)}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Credit Range</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.minCredits} - {stats.maxCredits}</div>
          </CardContent>
        </Card>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Credit Distribution</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={400}>
            <BarChart data={stats.chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="range" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="count" fill="#8884d8" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  );
};

export default Dashboard;
