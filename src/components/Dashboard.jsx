import { useState, useEffect } from 'react';
import { initializeApp } from 'firebase/app';
import { getFirestore, collection, getDocs } from 'firebase/firestore';
import { getAuth, signInWithEmailAndPassword } from 'firebase/auth';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const Dashboard = ({ keyfileContent }) => {
  const [stats, setStats] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const firebaseConfig = {
          apiKey: keyfileContent.api_key,
          authDomain: `${keyfileContent.project_id}.firebaseapp.com`,
          projectId: keyfileContent.project_id,
        };

        const app = initializeApp(firebaseConfig);
        const auth = getAuth(app);
        
        // Use a default email and password for authentication
        // In a real-world scenario, you'd want to use a more secure method
        await signInWithEmailAndPassword(auth, 'admin@example.com', 'password');

        const db = getFirestore(app);
        const usersRef = collection(db, 'users');
        const snapshot = await getDocs(usersRef);

        const credits = snapshot.docs.map(doc => doc.data().daily_credits || 0);
        const totalUsers = credits.length;
        const totalCredits = credits.reduce((sum, credit) => sum + credit, 0);
        const averageCredits = totalCredits / totalUsers;
        const maxCredits = Math.max(...credits);
        const minCredits = Math.min(...credits);

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
      } catch (error) {
        console.error('Error fetching data:', error);
        setStats({ error: error.message });
      }
    };

    fetchData();
  }, [keyfileContent]);

  if (!stats) {
    return <div className="text-center mt-8">Loading...</div>;
  }

  if (stats.error) {
    return <div className="text-center mt-8 text-red-500">Error: {stats.error}</div>;
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
