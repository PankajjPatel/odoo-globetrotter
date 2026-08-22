import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ProtectedRoute } from './components/ProtectedRoute';
import { PublicOnlyRoute } from './components/PublicOnlyRoute';
import { Layout } from './components/Layout';
import { LoginScreen } from './screens/LoginScreen';
import { DashboardScreen } from './screens/DashboardScreen';
import { MyTripsScreen } from './screens/MyTripsScreen';
import { CreateTripScreen } from './screens/CreateTripScreen';
import { ItineraryBuilderScreen } from './screens/ItineraryBuilderScreen';
import { ItineraryViewScreen } from './screens/ItineraryViewScreen';
import { BudgetScreen } from './screens/BudgetScreen';
import { CitySearchScreen } from './screens/CitySearchScreen';
import { ActivitySearchScreen } from './screens/ActivitySearchScreen';
import { SharedTripScreen } from './screens/SharedTripScreen';
import { ProfileScreen } from './screens/ProfileScreen';
import { AdminDashboardScreen } from './screens/AdminDashboardScreen';

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="app-container">
          <Routes>
            <Route path="/" element={<Navigate to="/dashboard" replace />} />
            <Route
              path="/login"
              element={
                <PublicOnlyRoute>
                  <LoginScreen />
                </PublicOnlyRoute>
              }
            />
            {/* Protected Routes inside Layout */}
            <Route
              element={
                <ProtectedRoute>
                  <Layout />
                </ProtectedRoute>
              }
            >
              <Route path="/dashboard" element={<DashboardScreen />} />
              <Route path="/create-trip" element={<CreateTripScreen />} />
              <Route path="/my-trips" element={<MyTripsScreen />} />
              <Route path="/trip/:id/builder" element={<ItineraryBuilderScreen />} />
              <Route path="/trip/:id/view" element={<ItineraryViewScreen />} />
              <Route path="/search/city" element={<CitySearchScreen />} />
              <Route path="/search/activity" element={<ActivitySearchScreen />} />
              <Route path="/trip/:id/budget" element={<BudgetScreen />} />
              <Route path="/profile" element={<ProfileScreen />} />
              <Route path="/admin" element={<AdminDashboardScreen />} />
            </Route>
            {/* Shared public itinerary route */}
            <Route path="/share/:id" element={<SharedTripScreen />} />
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
